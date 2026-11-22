import { DATASETS, DATASET_FILES, parseCsv } from "../content/datasets";

export function DataTable({ header, rows }: { header: string[]; rows: string[][] }) {
  return (
    <div className="overflow-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="text-slate-400">#</th>
            {header.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td className="text-slate-400">{i}</td>
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
  const src = text ?? DATASET_FILES[file];
  if (!src) return null;
  const info = DATASETS.find((d) => d.file === file);
  const { header, rows: data, total } = parseCsv(src, rows);
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/60" data-testid="dataset-preview">
      <div className="mb-1 flex flex-wrap items-baseline gap-2 text-xs">
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">{file}</span>
        <span className="text-slate-500">
          {total} baris × {header.length} kolom · menampilkan {data.length} baris pertama
        </span>
        {info && <span className={`badge ${info.kind === "real" ? "badge-blue" : "badge-amber"}`}>{info.kind === "real" ? "Dataset asli" : "Dataset sintetis"}</span>}
      </div>
      <DataTable header={header} rows={data} />
    </div>
  );
}
