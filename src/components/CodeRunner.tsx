import { Download, Eraser, Play, RotateCcw, Square, Table } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DATASET_FILES } from "../content/datasets";
import { clearCode, getState, saveCode } from "../engine/store";
import type { PyTest } from "../types";
import type { RunResult } from "../runtime/python";
import { CopyButton } from "./CodeBlock";
import { CodeEditor } from "./CodeEditor";
import { DatasetPreview } from "./DatasetPreview";
import { OutputPanel } from "./OutputPanel";
import { usePythonRun } from "./usePythonRun";

export function downloadText(filename: string, text: string, type = "text/x-python") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface CodeRunnerProps {
  code: string;
  onCodeChange: (c: string) => void;
  onReset?: () => void;
  title?: string;
  filename?: string;
  tests?: PyTest[];
  checkLabel?: string;
  onCheck?: (res: RunResult, code: string) => void;
  toolbarExtra?: ReactNode;
  minHeight?: number;
  hideRun?: boolean;
  placeholder?: string;
}

export function CodeRunner({ code, onCodeChange, onReset, title = "Try It Yourself", filename = "main.py", tests, checkLabel = "Check Answer", onCheck, toolbarExtra, minHeight, hideRun, placeholder }: CodeRunnerProps) {
  const { out, run, stop, clear, runtime } = usePythonRun();
  const [showData, setShowData] = useState(false);
  const busy = out.status === "loading" || out.status === "running";
  const datasets = useMemo(() => Object.keys(DATASET_FILES).filter((f) => code.includes(f)), [code]);
  const codeRef = useRef(code);
  codeRef.current = code;

  const doRun = () => {
    if (!busy) void run(codeRef.current);
  };
  const doCheck = async () => {
    if (busy || !tests) return;
    const c = codeRef.current;
    const res = await run(c, tests);
    if (res && !res.interrupted) onCheck?.(res, c);
  };

  return (
    <div className="editor-shell" data-testid="code-runner">
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
          {title}
          <span className="hidden text-xs font-normal text-slate-500 dark:text-slate-400 sm:inline">
            {runtime.status === "ready" || runtime.status === "running" ? `Python ${runtime.pythonVersion ?? ""} · Pyodide ${runtime.pyodideVersion ?? ""}` : runtime.status === "loading" ? "Memuat runtime…" : runtime.status === "error" ? "Runtime gagal dimuat" : "Python (Pyodide) — dimuat saat Run pertama"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {!hideRun &&
            (busy ? (
              <button type="button" className="btn-danger" onClick={stop} data-testid="stop-btn">
                <Square size={14} /> Stop
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={doRun} data-testid="run-btn" title="Ctrl+Enter">
                <Play size={14} /> Run
              </button>
            ))}
          {tests && (
            <button type="button" className="btn-accent" onClick={doCheck} disabled={busy} data-testid="check-btn">
              {checkLabel}
            </button>
          )}
          {onReset && (
            <button type="button" className="btn-ghost" onClick={onReset} title="Kembalikan kode awal">
              <RotateCcw size={14} /> <span className="hidden sm:inline">Reset</span>
            </button>
          )}
          <CopyButton text={code} className="btn-ghost" />
          <button type="button" className="btn-ghost" onClick={clear} title="Bersihkan output">
            <Eraser size={14} /> <span className="hidden sm:inline">Clear</span>
          </button>
          <button type="button" className="btn-ghost" onClick={() => downloadText(filename, code)} title="Download file .py">
            <Download size={14} /> <span className="hidden sm:inline">.py</span>
          </button>
          {datasets.length > 0 && (
            <button type="button" className={`btn-ghost ${showData ? "bg-slate-100 dark:bg-slate-700" : ""}`} onClick={() => setShowData((s) => !s)}>
              <Table size={14} /> <span className="hidden sm:inline">Dataset</span>
            </button>
          )}
          {toolbarExtra}
        </div>
      </div>
      <CodeEditor value={code} onChange={onCodeChange} onRun={doRun} minHeight={minHeight} placeholder={placeholder} />
      {showData && datasets.map((d) => <DatasetPreview key={d} file={d} />)}
      <OutputPanel out={out} onStop={busy ? stop : undefined} />
    </div>
  );
}

/** Editor mandiri yang menyimpan kode pengguna ke progres (localStorage). */
export function TryIt({ initialCode, storageKey, title, filename, external }: { initialCode: string; storageKey?: string; title?: string; filename?: string; external?: { code: string; nonce: number } }) {
  const [code, setCode] = useState(() => (storageKey && getState().code[storageKey]) || initialCode);
  useEffect(() => {
    if (external) setCode(external.code);
  }, [external]);
  return (
    <CodeRunner
      code={code}
      title={title}
      filename={filename}
      onCodeChange={(c) => {
        setCode(c);
        if (storageKey) saveCode(storageKey, c);
      }}
      onReset={() => {
        setCode(initialCode);
        if (storageKey) clearCode(storageKey);
      }}
    />
  );
}
