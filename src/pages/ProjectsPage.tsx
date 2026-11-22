import { ExternalLink, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { lessonTitle } from "../components/Exercise";
import { isAvailable } from "../content";
import { ALL_DATASETS } from "../content/datasets";
import { PROJECTS } from "../content/projects";

export default function ProjectsPage() {
  const levels = ["Beginner", "Intermediate", "Advanced"] as const;
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6" data-testid="projects">
      <h1 className="text-3xl font-bold">End-to-End Machine Learning Projects</h1>
      <p className="mt-1 text-slate-500">
        Proyek bertahap dari dataset mentah hingga model yang dievaluasi — semua bebas dikerjakan kapan saja. Setiap proyek berisi problem statement, tujuan, dataset (sebagian besar data nyata dari UCI yang juga populer di Kaggle), data dictionary, checklist langkah, dan starter code yang sudah diuji. Tombol <b>Kerjakan di Playground</b> membuka dataset dan starter code langsung di editor Python.
      </p>
      {levels.map((lv) => (
        <section key={lv} className="mt-8">
          <h2 className="text-xl font-semibold">{lv}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {PROJECTS.filter((p) => p.level === lv).map((p) => {
              const ds = ALL_DATASETS.find((d) => d.file === p.dataset);
              return (
                <article key={p.id} className="card flex flex-col p-5" data-testid={`project-${p.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <span className="badge badge-slate">{p.task}</span>
                  </div>
                  <p className="mt-2 text-sm"><b>Problem statement:</b> {p.problem}</p>
                  <p className="mt-1 text-sm"><b>Tujuan:</b> {p.goal}</p>
                  <p className="mt-1 text-sm"><b>Dataset:</b> {ds ? <><code className="inline-code">{ds.file}</code> — {ds.name} <span className={`badge ${ds.kind === "real" ? "badge-blue" : "badge-amber"}`}>{ds.kind === "real" ? "data asli" : "data sintetis"}</span> {ds.license}</> : p.datasetNote}</p>
                  {ds && (ds.sourceUrl || ds.kaggleUrl) && (
                    <p className="mt-1 flex flex-wrap gap-x-3 text-xs">
                      {ds.sourceUrl && <a className="text-brand-700 underline dark:text-brand-400" href={ds.sourceUrl} target="_blank" rel="noreferrer">Sumber asli <ExternalLink size={11} className="inline" /></a>}
                      {ds.kaggleUrl && <a className="text-brand-700 underline dark:text-brand-400" href={ds.kaggleUrl} target="_blank" rel="noreferrer">Kaggle <ExternalLink size={11} className="inline" /></a>}
                    </p>
                  )}
                  {ds && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-700 dark:text-brand-400">Data dictionary</summary>
                      <table className="mt-2 w-full text-xs">
                        <tbody>{ds.columns.map(([c, d]) => <tr key={c} className="border-t border-slate-100 dark:border-slate-800"><td className="py-1 pr-2 font-mono">{c}</td><td>{d}</td></tr>)}</tbody>
                      </table>
                    </details>
                  )}
                  {p.checklist && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-700 dark:text-brand-400">Checklist pengerjaan</summary>
                      <ol className="mt-1 list-decimal space-y-0.5 pl-5">{p.checklist.map((c) => <li key={c}>{c}</li>)}</ol>
                    </details>
                  )}
                  {p.starter && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-700 dark:text-brand-400">Starter code</summary>
                      <CodeBlock code={p.starter} />
                    </details>
                  )}
                  <div className="mt-3 flex-1 text-sm">
                    <b>Materi terkait:</b>
                    <ul className="mt-1 flex flex-wrap gap-1">
                      {p.prerequisites.map((l) => (
                        <li key={l}><Link to={`/learn/${l}`} className={`badge ${isAvailable(l) ? "badge-brand" : "badge-slate"}`}>{lessonTitle(l)}</Link></li>
                      ))}
                    </ul>
                  </div>
                  {ds && p.starter ? (
                    <Link to={`/playground?project=${p.id}`} className="btn-primary mt-4 self-start" data-testid={`start-${p.id}`}><PlayCircle size={15} /> Kerjakan di Playground</Link>
                  ) : (
                    <div className="mt-4 text-sm text-slate-500">Dataset dan starter code untuk proyek ini sedang disiapkan.</div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
