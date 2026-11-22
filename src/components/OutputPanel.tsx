import { AlertTriangle, CheckCircle2, Loader2, Square, Terminal, XCircle } from "lucide-react";
import type { PyError, TestResult } from "../runtime/protocol";
import { explainError } from "../runtime/python";

export interface OutputChunk {
  kind: "stdout" | "stderr" | "info";
  text: string;
}

export interface OutputState {
  chunks: OutputChunk[];
  error: PyError | null;
  figures: string[];
  tests: TestResult[] | null;
  status: "idle" | "loading" | "running" | "done" | "interrupted";
  statusText?: string;
  durationMs?: number;
}

export const emptyOutput: OutputState = { chunks: [], error: null, figures: [], tests: null, status: "idle" };

export function OutputPanel({ out, onStop }: { out: OutputState; onStop?: () => void }) {
  const hasContent = out.chunks.length > 0 || out.error || out.figures.length > 0 || out.status !== "idle";
  return (
    <div className="terminal" data-testid="output-panel" aria-live="polite">
      <div className="flex items-center justify-between border-b border-slate-700/70 px-3 py-1.5 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Terminal size={13} /> Output
        </span>
        <span className="flex items-center gap-2">
          {(out.status === "loading" || out.status === "running") && (
            <>
              <Loader2 size={13} className="animate-spin text-brand-400" />
              <span className="text-brand-300" data-testid="run-status">{out.statusText ?? (out.status === "loading" ? "Memuat Python…" : "Berjalan…")}</span>
              {onStop && (
                <button type="button" onClick={onStop} className="ml-1 inline-flex items-center gap-1 rounded bg-red-600/90 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-500">
                  <Square size={10} /> Stop
                </button>
              )}
            </>
          )}
          {out.status === "done" && out.durationMs !== undefined && <span>Selesai dalam {(out.durationMs / 1000).toFixed(2)} dtk</span>}
        </span>
      </div>
      <div className="max-h-[420px] overflow-auto px-3 py-2 font-mono text-[13px] leading-relaxed">
        {!hasContent && <div className="text-slate-500">Tekan ▶ Run (atau Ctrl+Enter) untuk menjalankan kode. Output akan tampil di sini.</div>}
        {out.chunks.map((c, i) => (
          <span key={i} className={c.kind === "stderr" ? "whitespace-pre-wrap text-amber-300" : c.kind === "info" ? "whitespace-pre-wrap text-sky-300" : "whitespace-pre-wrap text-slate-100"}>
            {c.text}
          </span>
        ))}
        {out.status === "done" && out.chunks.length === 0 && !out.error && out.figures.length === 0 && (
          <div className="text-slate-500">(Kode berjalan tanpa output. Gunakan print() untuk menampilkan hasil.)</div>
        )}
        {out.error && (
          <div className="mt-2" data-testid="python-error">
            <pre className="whitespace-pre-wrap text-red-300">{out.error.traceback}</pre>
            <div className="mt-2 flex gap-2 rounded-md border border-red-400/30 bg-red-500/10 p-2 font-sans text-[13px] text-red-100">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-300" />
              <div>
                <b>{out.error.type}</b>
                {out.error.line ? ` di baris ${out.error.line}` : ""}: {explainError(out.error)}
              </div>
            </div>
          </div>
        )}
        {out.status === "interrupted" && <div className="mt-1 text-amber-300">{out.statusText}</div>}
        {out.figures.map((f, i) => (
          <img key={i} src={`data:image/png;base64,${f}`} alt={`Grafik ${i + 1} hasil kode`} className="my-2 max-w-full rounded bg-white" data-testid="figure" />
        ))}
      </div>
      {out.tests && (
        <div className="border-t border-slate-700/70 px-3 py-2 font-sans text-[13px]" data-testid="test-results">
          {out.tests.map((t, i) => (
            <div key={i} className="flex items-start gap-2 py-0.5">
              {t.passed ? <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={15} className="mt-0.5 shrink-0 text-red-400" />}
              <span className={t.passed ? "text-emerald-200" : "text-red-200"}>
                {t.desc}
                {!t.passed && t.error && <span className="block text-xs text-red-300/80">{t.error}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
