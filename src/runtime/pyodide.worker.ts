/// <reference lib="webworker" />
// Web Worker yang menjalankan Python sungguhan (Pyodide/WebAssembly) di luar thread UI,
// sehingga halaman tidak freeze dan eksekusi dapat dihentikan dengan terminate().
import harnessSource from "./harness.py?raw";
import type { WorkerRequest, WorkerResponse } from "./protocol";

declare const self: DedicatedWorkerGlobalScope;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;
let seabornInstalled = false;
let assetBase = "";
const SEABORN_WHEEL = "wheels/seaborn-0.13.2-py3-none-any.whl";
const decoder = new TextDecoder();
const errDecoder = new TextDecoder();

function post(msg: WorkerResponse) {
  self.postMessage(msg);
}

async function init(files: { path: string; content: string }[], base: string, indexURL: string) {
  assetBase = base;
  post({ type: "status", text: "Mengunduh Python runtime (Pyodide)…" });
  const mod = await import(/* @vite-ignore */ `${indexURL}pyodide.mjs`);
  pyodide = await mod.loadPyodide({ indexURL });
  pyodide.setStdout({
    write: (buf: Uint8Array) => {
      post({ type: "stdout", text: decoder.decode(buf, { stream: true }) });
      return buf.length;
    },
  });
  pyodide.setStderr({
    write: (buf: Uint8Array) => {
      post({ type: "stderr", text: errDecoder.decode(buf, { stream: true }) });
      return buf.length;
    },
  });
  pyodide.runPython(harnessSource);
  for (const f of files) writeFile(f.path, f.content);
  const version = pyodide.runPython("import sys; sys.version.split()[0]");
  post({ type: "ready", pyodideVersion: pyodide.version, pythonVersion: version });
}

function writeFile(path: string, content: string | Uint8Array) {
  const dir = path.includes("/") ? path.slice(0, path.lastIndexOf("/")) : "";
  if (dir) pyodide.FS.mkdirTree(dir);
  pyodide.FS.writeFile(path, content);
}

const SEABORN_RE = /^\s*(import\s+seaborn|from\s+seaborn\s+import)/m;
const MPL_RE = /^\s*(import\s+(matplotlib|seaborn)|from\s+(matplotlib|seaborn)[\s.])/m;

async function ensurePackages(code: string) {
  const onMsg = (m: string) => {
    if (m.startsWith("Loading") || m.startsWith("Loaded")) post({ type: "status", text: m.replace("Loading", "Memuat paket:").replace("Loaded", "Paket siap:") });
  };
  await pyodide.loadPackagesFromImports(code, { messageCallback: onMsg, errorCallback: onMsg });
  if (SEABORN_RE.test(code) && !seabornInstalled) {
    post({ type: "status", text: "Memuat paket: seaborn (via micropip)…" });
    await pyodide.loadPackage(["micropip", "matplotlib", "pandas", "scipy"], { messageCallback: onMsg, errorCallback: onMsg });
    const micropip = pyodide.pyimport("micropip");
    try {
      // Wheel seaborn di-host bersama situs (versi terkunci, tidak bergantung pada PyPI).
      await micropip.install(new URL(SEABORN_WHEEL, assetBase).href);
    } catch {
      await micropip.install("seaborn");
    }
    seabornInstalled = true;
  }
  if (MPL_RE.test(code)) await pyodide.loadPackage(["matplotlib"], { messageCallback: onMsg, errorCallback: onMsg });
}

async function run(id: number, code: string, tests?: string) {
  try {
    await ensurePackages(code);
  } catch (e) {
    post({ type: "result", id, result: { output: "", error: { type: "PackageError", message: String(e), line: null, traceback: `Gagal memuat paket: ${String(e)}` }, figures: [], tests: null } });
    return;
  }
  post({ type: "started", id });
  const runFn = pyodide.globals.get("run_user_code");
  try {
    const json = runFn(code, tests ?? null, MPL_RE.test(code));
    post({ type: "result", id, result: JSON.parse(json) });
  } catch (e) {
    post({ type: "result", id, result: { output: "", error: { type: "InternalError", message: String(e), line: null, traceback: String(e) }, figures: [], tests: null } });
  } finally {
    runFn.destroy();
  }
}

self.onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  const msg = ev.data;
  try {
    if (msg.type === "init") await init(msg.files, msg.assetBase, msg.indexURL);
    else if (msg.type === "run") await run(msg.id, msg.code, msg.tests);
    else if (msg.type === "writeFile") {
      writeFile(msg.path, msg.content);
      post({ type: "ack", id: msg.id });
    } else if (msg.type === "listFiles") {
      const names: string[] = pyodide.FS.readdir(".").filter((n: string) => n !== "." && n !== "..");
      const files = names
        .filter((n) => pyodide.FS.isFile(pyodide.FS.stat(n).mode))
        .map((n) => ({ name: n, size: pyodide.FS.stat(n).size as number }));
      post({ type: "files", id: msg.id, files });
    } else if (msg.type === "readFile") {
      const data: Uint8Array = pyodide.FS.readFile(msg.path);
      post({ type: "fileData", id: msg.id, data });
    }
  } catch (e) {
    post({ type: "fatal", text: String(e) });
  }
};
