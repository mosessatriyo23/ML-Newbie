import { Database, Download, FileUp, FolderOpen, RefreshCw, RotateCcw, Save, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { CodeRunner, downloadText } from "../components/CodeRunner";
import { DatasetPreview } from "../components/DatasetPreview";
import { useRuntimeState } from "../components/usePythonRun";
import { DATASETS, DATASET_FILES } from "../content/datasets";
import { PYODIDE_VERSION } from "../runtime/protocol";
import { python } from "../runtime/python";
import { clearCode, getState, saveCode, useStore } from "../engine/store";

const DEFAULT_CODE = `import pandas as pd

# Dataset bawaan sudah tersedia di folder kerja (lihat panel Dataset)
df = pd.read_csv("student_scores.csv")
print(df.head())
print("Ukuran data:", df.shape)

import matplotlib.pyplot as plt
plt.scatter(df["hours_studied"], df["final_score"])
plt.xlabel("Jam belajar")
plt.ylabel("Nilai akhir")
plt.title("Jam belajar vs nilai akhir")
plt.show()
`;

const LIBS = ["numpy", "pandas", "matplotlib", "seaborn (via micropip)", "scikit-learn", "scipy", "statsmodels", "xgboost", "joblib"];

export default function PlaygroundPage() {
  const [code, setCode] = useState(() => getState().code["pg:current"] ?? DEFAULT_CODE);
  const [files, setFiles] = useState<{ name: string; size: number }[] | null>(null);
  const [preview, setPreview] = useState<{ file: string; text: string } | null>({ file: "student_scores.csv", text: DATASET_FILES["student_scores.csv"] });
  const [msg, setMsg] = useState("");
  const [snippetName, setSnippetName] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const rt = useRuntimeState();
  const s = useStore((x) => x);
  const snippets = Object.keys(s.code).filter((k) => k.startsWith("pg:snip:")).map((k) => k.slice(8));

  const refreshFiles = async () => {
    try {
      setFiles(await python.listFiles());
    } catch (e) {
      setMsg(`Gagal membaca file: ${String(e)}`);
    }
  };

  const onUpload = async (f: File) => {
    if (f.size > 20 * 1024 * 1024) {
      setMsg("File terlalu besar (maks. 20 MB untuk runtime browser).");
      return;
    }
    const text = await f.text();
    setMsg(`Mengunggah ${f.name}…`);
    await python.writeFile(f.name, text);
    setPreview({ file: f.name, text });
    setMsg(`✓ ${f.name} tersedia. Baca dengan: pd.read_csv("${f.name}")`);
    void refreshFiles();
  };

  const downloadFile = async (name: string) => {
    const data = await python.readFile(name);
    const blob = new Blob([new Uint8Array(data)]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6" data-testid="playground">
      <h1 className="text-3xl font-bold">Coding Playground</h1>
      <p className="mt-1 text-slate-500">Tulis dan jalankan Python secara bebas. Runtime: Pyodide {PYODIDE_VERSION} (Python {rt.pythonVersion ?? "3.14"}) di Web Worker — tombol Stop selalu dapat menghentikan kode. Library: {LIBS.join(", ")}.</p>
      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <CodeRunner
            title="Playground"
            code={code}
            filename="playground.py"
            minHeight={320}
            onCodeChange={(c) => {
              setCode(c);
              saveCode("pg:current", c);
            }}
            onReset={() => {
              setCode(DEFAULT_CODE);
              clearCode("pg:current");
            }}
            toolbarExtra={
              <button type="button" className="btn-ghost" onClick={() => { python.restart(); setFiles(null); setMsg("Environment di-reset: variabel, modul yang di-import, dan file buatan kode dihapus. Dataset bawaan & file unggahan dimuat ulang."); }} title="Mulai ulang Python">
                <RotateCcw size={14} /> <span className="hidden sm:inline">Reset env</span>
              </button>
            }
          />
          <div className="card p-4">
            <h2 className="flex items-center gap-2 font-semibold"><Save size={16} /> Simpan kode</h2>
            <div className="mt-2 flex gap-2">
              <input className="input" placeholder="Nama snippet, misal: eda-churn" value={snippetName} onChange={(e) => setSnippetName(e.target.value)} />
              <button type="button" className="btn-primary" disabled={!snippetName.trim()} onClick={() => { saveCode(`pg:snip:${snippetName.trim()}`, code); setMsg(`✓ Snippet "${snippetName.trim()}" disimpan di browser.`); setSnippetName(""); }}>Simpan</button>
              <button type="button" className="btn-outline" onClick={() => downloadText("playground.py", code)}><Download size={14} /> .py</button>
            </div>
            {snippets.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm">
                {snippets.map((n) => (
                  <li key={n} className="flex items-center gap-2">
                    <span className="flex-1 font-mono">{n}</span>
                    <button type="button" className="btn-ghost" onClick={() => setCode(getState().code[`pg:snip:${n}`] ?? "")}>Buka</button>
                    <button type="button" className="icon-btn" aria-label={`Hapus ${n}`} onClick={() => clearCode(`pg:snip:${n}`)}><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <aside className="space-y-4">
          {msg && <div className="rounded-md border border-sky-200 bg-sky-50 p-2 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">{msg}</div>}
          <div className="card p-4">
            <h2 className="flex items-center gap-2 font-semibold"><FileUp size={16} /> Upload CSV dataset</h2>
            <p className="mt-1 text-xs text-slate-500">File disimpan di folder kerja Python (bukan dikirim ke server mana pun).</p>
            <input ref={fileInput} type="file" accept=".csv,.txt,.json,.tsv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onUpload(f); e.target.value = ""; }} data-testid="upload-input" />
            <button type="button" className="btn-outline mt-2 w-full" onClick={() => fileInput.current?.click()}><FileUp size={14} /> Pilih file…</button>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold"><FolderOpen size={16} /> Files (folder kerja)</h2>
              <button type="button" className="btn-ghost" onClick={refreshFiles}><RefreshCw size={14} /> Muat</button>
            </div>
            {!files ? <p className="mt-1 text-xs text-slate-500">Tekan "Muat" untuk melihat file di folder kerja Python, termasuk file yang dibuat oleh kodemu.</p> : (
              <ul className="mt-2 space-y-0.5 text-sm" data-testid="file-list">
                {files.map((f) => (
                  <li key={f.name} className="flex items-center gap-2">
                    <span className="flex-1 truncate font-mono text-xs">{f.name}</span>
                    <span className="text-[11px] text-slate-400">{(f.size / 1024).toFixed(1)} KB</span>
                    <button type="button" className="icon-btn" aria-label={`Download ${f.name}`} onClick={() => downloadFile(f.name)}><Download size={13} /></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="card p-4">
            <h2 className="flex items-center gap-2 font-semibold"><Database size={16} /> Dataset latihan</h2>
            <ul className="mt-2 space-y-3 text-sm">
              {DATASETS.filter((d) => !d.file.startsWith("data")).map((d) => (
                <li key={d.file} className="rounded-lg border border-slate-200 p-2 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-semibold">{d.name}</span>
                    <span className={`badge ${d.kind === "real" ? "badge-blue" : "badge-amber"}`}>{d.kind === "real" ? "Asli" : "Sintetis"}</span>
                  </div>
                  <div className="font-mono text-xs text-slate-500">{d.file}</div>
                  <div className="mt-1 text-xs">{d.description}</div>
                  <div className="mt-1 text-xs text-slate-500">Tugas: {d.task}</div>
                  <div className="mt-1 text-xs text-slate-500">Sumber: {d.source}{d.sourceUrl && <> (<a className="underline" href={d.sourceUrl} target="_blank" rel="noreferrer">UCI</a>)</>} · Lisensi: {d.license}</div>
                  <div className="mt-2 flex gap-2">
                    <button type="button" className="btn-ghost" onClick={() => setPreview({ file: d.file, text: DATASET_FILES[d.file] })}>Lihat</button>
                    <button type="button" className="btn-ghost" onClick={() => setCode(`import pandas as pd\n\ndf = pd.read_csv("${d.file}")\nprint(df.head())\nprint(df.shape)\n`)}>Pakai di editor</button>
                    <button type="button" className="btn-ghost" onClick={() => downloadText(d.file, DATASET_FILES[d.file], "text/csv")}><Download size={13} /> CSV</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
      {preview && (
        <div className="card mt-6 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2"><h2 className="font-semibold">Dataset viewer</h2><button type="button" className="btn-ghost" onClick={() => setPreview(null)}>Tutup</button></div>
          <DatasetPreview file={preview.file} text={preview.text} rows={15} />
        </div>
      )}
    </div>
  );
}
