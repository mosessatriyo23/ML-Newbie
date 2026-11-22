// Pengelola runtime Python di sisi UI.
// - Satu Web Worker dipakai bersama oleh semua editor.
// - Tombol Stop / timeout menghentikan worker dengan terminate() lalu membuat worker baru,
//   sehingga infinite loop tidak membuat browser freeze.
import { DATASET_FILES } from "../content/datasets";
import type { PyError, RawRunResult, TestResult, WorkerRequest, WorkerResponse } from "./protocol";

export type RuntimeStatus = "idle" | "loading" | "ready" | "running" | "error";

export interface RuntimeState {
  status: RuntimeStatus;
  message: string;
  pyodideVersion?: string;
  pythonVersion?: string;
}

export interface RunOptions {
  tests?: { desc: string; expr: string }[];
  onStdout?: (text: string) => void;
  onStderr?: (text: string) => void;
  onStatus?: (text: string) => void;
  timeoutSec?: number;
}

export interface RunResult {
  output: string;
  error: PyError | null;
  figures: string[];
  tests: TestResult[] | null;
  durationMs: number;
  interrupted?: "stopped" | "timeout";
}

type Listener = (s: RuntimeState) => void;

class PythonRuntime {
  private worker: Worker | null = null;
  private state: RuntimeState = { status: "idle", message: "Python belum dimuat" };
  private listeners = new Set<Listener>();
  private readyPromise: Promise<void> | null = null;
  private nextId = 1;
  private pending = new Map<number, (data: WorkerResponse) => void>();
  private current: {
    id: number;
    opts: RunOptions;
    resolve: (r: RunResult) => void;
    start: number;
    timer?: ReturnType<typeof setTimeout>;
  } | null = null;
  private uploaded = new Map<string, string | Uint8Array>();
  private initReject: ((e: Error) => void) | null = null;

  getState() {
    return this.state;
  }

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private setState(patch: Partial<RuntimeState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((l) => l(this.state));
  }

  /** Memuat Pyodide (sekali). Aman dipanggil berkali-kali. */
  ensureReady(): Promise<void> {
    if (this.readyPromise) return this.readyPromise;
    this.setState({ status: "loading", message: "Menyiapkan Python runtime…" });
    this.readyPromise = new Promise<void>((resolve, reject) => {
      const w = new Worker(new URL("./pyodide.worker.ts", import.meta.url), { type: "module" });
      this.worker = w;
      this.initReject = reject;
      w.onmessage = (ev: MessageEvent<WorkerResponse>) => this.handle(ev.data, resolve);
      w.onerror = (ev) => {
        const msg = ev.message || "Worker gagal dimuat";
        this.setState({ status: "error", message: `Gagal memuat Python: ${msg}. Periksa koneksi internet (Pyodide dimuat dari cdn.jsdelivr.net).` });
        this.readyPromise = null;
        reject(new Error(msg));
      };
      const files = Object.entries(DATASET_FILES).map(([path, content]) => ({ path, content }));
      const req: WorkerRequest = { type: "init", files };
      w.postMessage(req);
      // file yang diunggah pengguna ditulis ulang setelah worker baru dibuat
      for (const [path, content] of this.uploaded) {
        const id = this.nextId++;
        w.postMessage({ type: "writeFile", id, path, content } satisfies WorkerRequest);
      }
    });
    return this.readyPromise;
  }

  private handle(msg: WorkerResponse, resolveReady: () => void) {
    switch (msg.type) {
      case "status":
        if (this.state.status === "loading") this.setState({ message: msg.text });
        this.current?.opts.onStatus?.(msg.text);
        break;
      case "ready":
        this.initReject = null;
        this.setState({ status: "ready", message: "Python siap", pyodideVersion: msg.pyodideVersion, pythonVersion: msg.pythonVersion });
        resolveReady();
        break;
      case "stdout":
        this.current?.opts.onStdout?.(msg.text);
        break;
      case "stderr":
        this.current?.opts.onStderr?.(msg.text);
        break;
      case "started": {
        const cur = this.current;
        if (cur && cur.id === msg.id) {
          cur.start = performance.now();
          const sec = cur.opts.timeoutSec ?? 30;
          if (sec > 0) cur.timer = setTimeout(() => this.interrupt("timeout"), sec * 1000);
        }
        break;
      }
      case "result": {
        const cur = this.current;
        if (cur && cur.id === msg.id) {
          if (cur.timer) clearTimeout(cur.timer);
          this.current = null;
          this.setState({ status: "ready", message: "Python siap" });
          const r: RawRunResult = msg.result;
          cur.resolve({ ...r, durationMs: performance.now() - cur.start });
        }
        break;
      }
      case "ack":
      case "files":
      case "fileData": {
        const cb = this.pending.get(msg.id);
        if (cb) {
          this.pending.delete(msg.id);
          cb(msg);
        }
        break;
      }
      case "fatal":
        if (this.state.status === "loading") {
          this.setState({ status: "error", message: `Gagal memuat Python: ${msg.text}` });
          this.readyPromise = null;
          this.initReject?.(new Error(msg.text));
          this.worker?.terminate();
          this.worker = null;
        } else {
          this.current?.opts.onStderr?.(msg.text + "\n");
        }
        break;
    }
  }

  isBusy() {
    return this.current !== null;
  }

  async run(code: string, opts: RunOptions = {}): Promise<RunResult> {
    if (this.current) throw new Error("Masih ada kode yang sedang berjalan. Tunggu atau tekan Stop.");
    await this.ensureReady();
    if (this.current) throw new Error("Masih ada kode yang sedang berjalan. Tunggu atau tekan Stop.");
    const id = this.nextId++;
    this.setState({ status: "running", message: "Menjalankan kode…" });
    return new Promise<RunResult>((resolve) => {
      this.current = { id, opts, resolve, start: performance.now() };
      const req: WorkerRequest = { type: "run", id, code, tests: opts.tests ? JSON.stringify(opts.tests) : undefined };
      this.worker!.postMessage(req);
    });
  }

  /** Menghentikan eksekusi: worker dimatikan lalu dibuat ulang. */
  interrupt(reason: "stopped" | "timeout" = "stopped") {
    const cur = this.current;
    this.current = null;
    if (cur?.timer) clearTimeout(cur.timer);
    this.worker?.terminate();
    this.worker = null;
    this.readyPromise = null;
    this.pending.clear();
    this.setState({ status: "idle", message: "Runtime dihentikan" });
    if (cur) {
      cur.resolve({
        output: "",
        error: null,
        figures: [],
        tests: null,
        durationMs: performance.now() - cur.start,
        interrupted: reason,
      });
    }
    // siapkan worker baru di latar belakang agar Run berikutnya cepat
    this.ensureReady().catch(() => undefined);
  }

  /** Reset environment: semua variabel, modul yang di-import, dan file buatan kode dihapus. */
  restart() {
    this.interrupt("stopped");
  }

  private request<T extends WorkerResponse>(req: WorkerRequest & { id: number }): Promise<T> {
    return new Promise((resolve) => {
      this.pending.set(req.id, (d) => resolve(d as T));
      this.worker!.postMessage(req);
    });
  }

  async writeFile(path: string, content: string | Uint8Array, persist = true) {
    if (persist) this.uploaded.set(path, content);
    await this.ensureReady();
    await this.request({ type: "writeFile", id: this.nextId++, path, content });
  }

  async listFiles(): Promise<{ name: string; size: number }[]> {
    await this.ensureReady();
    const r = await this.request<Extract<WorkerResponse, { type: "files" }>>({ type: "listFiles", id: this.nextId++ });
    return r.files.sort((a, b) => a.name.localeCompare(b.name));
  }

  async readFile(path: string): Promise<Uint8Array> {
    await this.ensureReady();
    const r = await this.request<Extract<WorkerResponse, { type: "fileData" }>>({ type: "readFile", id: this.nextId++, path });
    return r.data;
  }

  uploadedNames() {
    return [...this.uploaded.keys()];
  }
}

export const python = new PythonRuntime();

/** Penjelasan error Python dalam bahasa Indonesia untuk pemula. */
export function explainError(err: PyError): string {
  const t = err.type;
  const m = err.message;
  if (t === "SyntaxError" || t === "IndentationError" || t === "TabError") {
    if (t === "IndentationError") return "Indentasi (spasi di awal baris) tidak sesuai. Setelah baris yang diakhiri titik dua (:), baris berikutnya harus menjorok ke dalam secara konsisten (biasanya 4 spasi).";
    if (/was never closed|unterminated/.test(m)) return "Ada tanda kurung atau tanda kutip yang belum ditutup. Periksa pasangan ( ), [ ], { }, dan \" \".";
    if (/expected ':'/.test(m)) return "Python mengharapkan tanda titik dua (:) di akhir baris if/for/while/def.";
    return "Penulisan kode tidak sesuai aturan sintaks Python. Periksa baris yang ditunjuk: tanda kurung, titik dua, tanda kutip, atau ejaan kata kunci.";
  }
  if (t === "NameError") return "Python tidak mengenal nama tersebut. Mungkin variabel/fungsi belum dibuat, salah ketik, atau beda huruf besar-kecil (Python case-sensitive).";
  if (t === "TypeError") return "Operasi dipakai pada tipe data yang tidak cocok (misalnya menjumlahkan str dengan int), atau jumlah argumen fungsi tidak sesuai.";
  if (t === "ValueError") return "Tipe datanya benar, tetapi nilainya tidak bisa diproses (misalnya int(\"abc\")).";
  if (t === "IndexError") return "Indeks berada di luar jangkauan. Ingat: indeks dimulai dari 0, dan indeks terakhir adalah len(data) - 1.";
  if (t === "KeyError") return "Key tidak ditemukan pada dictionary/DataFrame. Periksa ejaan nama key atau kolom (case-sensitive).";
  if (t === "AttributeError") return "Objek tersebut tidak memiliki atribut/method dengan nama itu. Periksa ejaan, atau cek tipe objek dengan type().";
  if (t === "ZeroDivisionError") return "Terjadi pembagian dengan nol.";
  if (t === "ModuleNotFoundError" || t === "ImportError") return "Modul tidak ditemukan atau tidak tersedia di runtime browser. Periksa ejaan nama modul.";
  if (t === "FileNotFoundError") return "File tidak ditemukan. Periksa nama file dan ekstensinya. Gunakan Playground → Files untuk melihat file yang tersedia.";
  if (t === "RecursionError") return "Fungsi memanggil dirinya sendiri terlalu dalam tanpa berhenti.";
  if (t === "RuntimeError" && /input\(\)/.test(m)) return "Fungsi input() tidak didukung di editor browser. Isi nilai langsung ke variabel.";
  return "Baca baris terakhir pesan error: nama error di kiri titik dua, penjelasannya di kanan.";
}
