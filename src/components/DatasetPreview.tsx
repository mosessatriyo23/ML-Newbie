import { useEffect, useState } from "react";
import { ALL_DATASETS, parseCsv } from "../content/datasets";
import { fetchDatasetText } from "../runtime/python";

export function DataTable({ header, rows }: { header: string[]; rows: string[][] }) {
  return (
    <div className="overflow-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="text-slate-500 dark:text-slate-400">#</th>
            {header.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="text-slate-500 dark:text-slate-400">{i}</td>
              {r.map((c, j) => (
                <td key={j}>{c === "" ? <span className="text-red-400">NaN</span> : c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DatasetPreview({ file, text, rows = 8 }: { file: string; text?: string; rows?: number }) {
  const [src, setSrc] = useState<string | null>(text ?? null);
  const [err, setErr] = useState("");
  useEffect(() => {
    if (text !== undefined) {
      setSrc(text);
      return;
    }
    let alive = true;
    setSrc(null);
    fetchDatasetText(file)
      .then((t) => alive && setSrc(t))
      .catch((e) => alive && setErr(String(e)));
    return () => {
      alive = false;
    };
  }, [file, text]);
  const info = ALL_DATASETS.find((d) => d.file === file);
  const parsed = src ? parseCsv(src, rows, info?.sep) : null;
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60" data-testid="dataset-preview">
      <div className="mb-1 flex flex-wrap items-baseline gap-2 text-xs">
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{file}</span>
        {parsed && (
          <span className="text-slate-500">
            {parsed.total.toLocaleString("id-ID")} baris × {parsed.header.length} kolom · menampilkan {parsed.rows.length} baris pertama
          </span>
        )}
        {info && <span className={`badge ${info.kind === "real" ? "badge-blue" : "badge-amber"}`}>{info.kind === "real" ? "Dataset asli" : "Dataset sintetis"}</span>}
      </div>
      {err && <div className="text-xs text-red-600 dark:text-red-400">Gagal memuat dataset: {err}</div>}
      {!parsed && !err && <div className="text-xs text-slate-500">Memuat dataset…</div>}
      {parsed && <DataTable header={parsed.header} rows={parsed.rows} />}
    </div>
  );
}
