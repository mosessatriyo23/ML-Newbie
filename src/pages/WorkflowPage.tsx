import { AlertTriangle, ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { TryIt } from "../components/CodeRunner";
import { lessonTitle } from "../components/Exercise";
import { isAvailable } from "../content";
import { WORKFLOW_STEPS } from "../content/workflow";

export default function WorkflowPage() {
  const [sel, setSel] = useState(WORKFLOW_STEPS[0]?.id);
  const [run, setRun] = useState<{ code: string; nonce: number } | undefined>();
  const step = WORKFLOW_STEPS.find((s) => s.id === sel) ?? WORKFLOW_STEPS[0];
  const i = WORKFLOW_STEPS.indexOf(step);
  return (
    <div className="max-w-6xl px-4 py-6 sm:px-8" data-testid="workflow">
      <h1 className="text-3xl font-bold">Machine Learning Workflow</h1>
      <p className="mt-2 max-w-3xl text-slate-600 dark:text-slate-400">
        Alur pengerjaan proyek Machine Learning dari memahami masalah hingga deployment. Klik setiap tahap untuk melihat tujuan, input, output, library, fungsi Python, contoh kode yang dapat dijalankan, kesalahan umum, dan hubungannya dengan tahap berikutnya.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="flex gap-2 rounded-lg border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100">
          <RefreshCw size={17} className="mt-0.5 shrink-0" /> <span><b>Workflow bersifat iteratif.</b> Hasil validasi sering membuatmu kembali ke EDA, preprocessing, atau feature engineering. Urutan boleh disesuaikan dengan masalah.</span>
        </div>
        <div className="flex gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <ShieldCheck size={17} className="mt-0.5 shrink-0" /> <span><b>Test data dijaga sampai akhir.</b> Split dilakukan sebelum preprocessing yang mempelajari data (fit). Model dipilih dengan validation/cross-validation — test set hanya dipakai sekali untuk evaluasi akhir.</span>
        </div>
      </div>

      <ol className="mt-6 flex flex-wrap items-center gap-1.5" aria-label="Tahapan workflow">
        {WORKFLOW_STEPS.map((s, k) => (
          <li key={s.id} className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSel(s.id)}
              className={`rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium transition ${s.id === step.id ? "border-brand-600 bg-brand-700 text-white shadow" : s.phase === "data" ? "border-sky-200 bg-sky-50 text-sky-900 hover:border-sky-400 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-100" : s.phase === "model" ? "border-violet-200 bg-violet-50 text-violet-900 hover:border-violet-400 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-100" : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:border-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"}`}
              data-testid={`wf-step-${s.n}`}
            >
              <span className="opacity-70">{s.n}.</span> {s.title}
            </button>
            {k < WORKFLOW_STEPS.length - 1 && <ArrowRight size={13} className="text-slate-500 dark:text-slate-400" />}
          </li>
        ))}
      </ol>
      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span><span className="inline-block h-2.5 w-2.5 rounded bg-sky-300" /> Data</span>
        <span><span className="inline-block h-2.5 w-2.5 rounded bg-violet-300" /> Modelling</span>
        <span><span className="inline-block h-2.5 w-2.5 rounded bg-emerald-300" /> Hasil & produksi</span>
      </div>

      {step && (
        <section className="card mt-6 p-5" data-testid="wf-detail">
          <div className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Tahap {step.n} dari {WORKFLOW_STEPS.length}</div>
          <h2 className="text-2xl font-bold">{step.title}</h2>
          <p className="mt-2">{step.goal}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50"><div className="text-xs font-semibold uppercase text-slate-500">Input</div>{step.input}</div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50"><div className="text-xs font-semibold uppercase text-slate-500">Output</div>{step.output_desc}</div>
            <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50"><div className="text-xs font-semibold uppercase text-slate-500">Library</div>{step.libraries}</div>
          </div>
          {step.functions.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-semibold">Fungsi Python yang digunakan</div>
              <div className="mt-1 flex flex-wrap gap-1.5">{step.functions.map((f) => <code key={f} className="inline-code">{f}</code>)}</div>
            </div>
          )}
          {step.code && (
            <div className="mt-4">
              <div className="text-sm font-semibold">Contoh kode</div>
              <CodeBlock code={step.code} onTry={() => setRun({ code: step.code!, nonce: Date.now() })} />
              {step.output !== undefined && <CodeBlock code={step.output} lang="text" title="Output" lineNumbers={false} />}
            </div>
          )}
          <div className="mt-4">
            <div className="flex items-center gap-1.5 text-sm font-semibold"><AlertTriangle size={15} className="text-amber-500" /> Kesalahan umum</div>
            <ul className="mt-1 list-disc pl-5 text-sm">{step.mistakes.map((m, k) => <li key={k}>{m}</li>)}</ul>
          </div>
          <div className="mt-4 rounded-lg border-l-4 border-brand-500 bg-brand-50 p-3 text-sm dark:bg-brand-950/30"><b>Hubungan dengan tahap berikutnya:</b> {step.next}</div>
          <div className="mt-4 text-sm">
            <b>Materi terkait:</b>{" "}
            {step.lessons.map((l, k) => (
              <span key={l}>
                {k > 0 && " · "}
                <Link to={`/learn/${l}`} className="text-brand-700 underline dark:text-brand-400">{lessonTitle(l)}</Link>
                {!isAvailable(l) && <span className="ml-1 text-xs text-slate-500">(sedang ditulis)</span>}
              </span>
            ))}
          </div>
          <div className="mt-5 flex justify-between">
            <button type="button" className="btn-outline" disabled={i === 0} onClick={() => setSel(WORKFLOW_STEPS[i - 1].id)}>← Sebelumnya</button>
            <button type="button" className="btn-outline" disabled={i === WORKFLOW_STEPS.length - 1} onClick={() => setSel(WORKFLOW_STEPS[i + 1].id)}>Berikutnya →</button>
          </div>
        </section>
      )}
      {run && (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">Jalankan contoh tahap {step.n}</h2>
          <TryIt initialCode={run.code} external={run} title={`Workflow — ${step.title}`} />
        </section>
      )}
    </div>
  );
}
