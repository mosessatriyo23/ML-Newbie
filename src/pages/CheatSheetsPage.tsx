import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { CodeBlock, CopyButton } from "../components/CodeBlock";
import { CHEATSHEETS, ML_WORKFLOW_CODE } from "../content/cheatsheets";

export default function CheatSheetsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const query = q.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      CHEATSHEETS.filter((c) => cat === "all" || c.id === cat).map((c) => ({
        ...c,
        items: c.items.filter((it) => !query || [it.name, it.syntax, it.use, it.params ?? "", it.example ?? ""].join(" ").toLowerCase().includes(query)),
      })).filter((c) => c.items.length > 0),
    [cat, query],
  );
  const total = CHEATSHEETS.reduce((n, c) => n + c.items.length, 0);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6" data-testid="cheatsheets">
      <h1 className="text-3xl font-bold">Cheat Sheets</h1>
      <p className="mt-1 text-slate-500">{total} sintaks dalam {CHEATSHEETS.length} kategori. Setiap contoh yang memiliki output telah dijalankan dan diverifikasi otomatis.</p>
      <div className="relative mt-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input className="input pl-9" placeholder="Cari fungsi atau kegunaan, misal: read_csv, missing, scaling…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Cari cheat sheet" data-testid="cheat-search" />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <button type="button" className={`badge cursor-pointer px-3 py-1 text-xs ${cat === "all" ? "badge-brand" : "badge-slate"}`} onClick={() => setCat("all")}>Semua</button>
        {CHEATSHEETS.map((c) => (
          <button key={c.id} type="button" className={`badge cursor-pointer px-3 py-1 text-xs ${cat === c.id ? "badge-brand" : "badge-slate"}`} onClick={() => setCat(c.id)}>{c.title}</button>
        ))}
        <button type="button" className={`badge cursor-pointer px-3 py-1 text-xs ${cat === "workflow" ? "badge-brand" : "badge-slate"}`} onClick={() => setCat("workflow")}>ML Workflow Cheat Sheet</button>
      </div>
      {(cat === "all" || cat === "workflow") && !query && (
        <section className="mt-6">
          <h2 className="text-xl font-semibold">Machine Learning Workflow Cheat Sheet</h2>
          <p className="text-sm text-slate-500">Kerangka kode dasar dari dataset mentah sampai model tersimpan. Perhatikan urutannya: split dulu, baru fit preprocessing pada training data.</p>
          <CodeBlock code={ML_WORKFLOW_CODE} title="ml_workflow.py" />
        </section>
      )}
      {filtered.map((c) => (
        <section key={c.id} className="mt-8">
          <h2 className="text-xl font-semibold">{c.title}</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {c.items.map((it) => (
              <div key={it.name} className="card p-4" data-testid="cheat-item">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-semibold">{it.name}</div>
                  <CopyButton text={it.syntax} className="btn-ghost !text-slate-500" />
                </div>
                <pre className="mt-2 overflow-x-auto rounded bg-slate-900 px-3 py-2 font-mono text-[12.5px] text-slate-100">{it.syntax}</pre>
                <div className="mt-2 text-sm"><b>Kegunaan:</b> {it.use}</div>
                {it.params && <div className="mt-1 text-sm"><b>Parameter penting:</b> {it.params}</div>}
                {it.example && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-brand-700 dark:text-brand-400">Contoh & output</summary>
                    <CodeBlock code={it.example} />
                    {it.output !== undefined && <CodeBlock code={it.output} lang="text" title="Output" lineNumbers={false} />}
                  </details>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
      {filtered.length === 0 && cat !== "workflow" && <p className="mt-8 text-slate-500">Tidak ada hasil untuk "{q}".</p>}
    </div>
  );
}
