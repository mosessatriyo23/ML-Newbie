import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getState } from "../engine/store";
import type { PyTest } from "../types";
import { python, type RunResult } from "../runtime/python";
import { emptyOutput, type OutputState } from "./OutputPanel";

export function useRuntimeState() {
  return useSyncExternalStore(
    (cb) => python.subscribe(cb),
    () => python.getState(),
  );
}

/** Menjalankan kode dan mengelola tampilan output (streaming stdout, error, grafik, hasil test). */
export function usePythonRun() {
  const [out, setOut] = useState<OutputState>(emptyOutput);
  const mounted = useRef(true);
  const mine = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const rt = useRuntimeState();

  const run = useCallback(async (code: string, tests?: PyTest[]): Promise<RunResult | null> => {
    if (python.isBusy()) {
      setOut((o) => ({ ...o, chunks: [{ kind: "info", text: "Masih ada kode lain yang berjalan. Tunggu sampai selesai atau tekan Stop.\n" }], status: "done" }));
      return null;
    }
    const firstLoad = python.getState().status !== "ready";
    mine.current = true;
    setOut({ ...emptyOutput, status: firstLoad ? "loading" : "running", statusText: firstLoad ? "Memuat Python runtime (pertama kali ±10–30 detik)…" : "Berjalan…" });
    const append = (kind: "stdout" | "stderr") => (text: string) => {
      if (!mounted.current) return;
      setOut((o) => {
        const chunks = [...o.chunks];
        const last = chunks[chunks.length - 1];
        if (last && last.kind === kind) chunks[chunks.length - 1] = { kind, text: last.text + text };
        else chunks.push({ kind, text });
        return { ...o, chunks, status: "running", statusText: "Berjalan…" };
      });
    };
    try {
      const res = await python.run(code, {
        tests,
        onStdout: append("stdout"),
        onStderr: append("stderr"),
        onStatus: (t) => mounted.current && setOut((o) => ({ ...o, status: "loading", statusText: t })),
        onStarted: () => mounted.current && setOut((o) => ({ ...o, status: "running", statusText: "Berjalan…" })),
        timeoutSec: getState().prefs.execTimeoutSec,
      });
      mine.current = false;
      if (!mounted.current) return res;
      if (res.interrupted) {
        setOut((o) => ({
          ...o,
          status: "interrupted",
          statusText:
            res.interrupted === "timeout"
              ? `⏹ Eksekusi dihentikan otomatis setelah ${getState().prefs.execTimeoutSec} detik (mungkin ada infinite loop). Batas waktu bisa diubah di Settings.`
              : "⏹ Eksekusi dihentikan. Environment Python di-reset (variabel & file buatan kode dihapus).",
        }));
      } else {
        setOut((o) => ({ ...o, error: res.error, figures: res.figures, tests: res.tests, status: "done", durationMs: res.durationMs }));
      }
      return res;
    } catch (e) {
      mine.current = false;
      if (mounted.current) {
        const msg = String((e as Error).message ?? e);
        if (/Dihentikan/.test(msg)) setOut({ ...emptyOutput, status: "interrupted", statusText: `⏹ ${msg}` });
        else setOut({ ...emptyOutput, status: "done", chunks: [{ kind: "stderr", text: msg + "\n" }] });
      }
      return null;
    }
  }, []);

  const stop = useCallback(() => {
    if (mine.current) python.interrupt("stopped");
  }, []);

  const clear = useCallback(() => setOut(emptyOutput), []);

  return { out, run, stop, clear, runtime: rt, setOut };
}
