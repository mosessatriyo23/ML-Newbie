import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { lessonTitle } from "../components/Exercise";
import { isAvailable } from "../content";
import { DATASETS } from "../content/datasets";
import { PROJECTS } from "../content/projects";

export default function ProjectsPage() {
  const levels = ["Beginner", "Intermediate", "Advanced"] as const;
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6" data-testid="projects">
      <h1 className="text-3xl font-bold">End-to-End Machine Learning Projects</h1>
      <p className="mt-1 text-slate-500">
        Proyek bertahap dari dataset mentah hingga model yang dievaluasi. Setiap proyek mencantumkan problem statement, tujuan, dataset, dan data dictionary. Panduan langkah, starter code, checklist, coding challenge, penilaian, dan solusi lengkap dibuka setelah semua materi prasyaratnya tersedia — agar kamu tidak diminta mengerjakan sesuatu yang belum diajarkan.
      </p>
      {levels.map((lv) => (
        <section key={lv} className="mt-8">
          <h2 className="text-xl font-semibold">{lv}</h2>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {PROJECTS.filter((p) => p.level === lv).map((p) => {
              const missing = p.prerequisites.filter((l) => !isAvailable(l));
              const ds = DATASETS.find((d) => d.file === p.dataset);
              return (
                <article key={p.id} className="card flex flex-col p-5" data-testid={`project-${p.id}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    <span className="badge badge-slate">{p.task}</span>
                  </div>
                  <p className="mt-2 text-sm"><b>Problem statement:</b> {p.problem}</p>
                  <p className="mt-1 text-sm"><b>Tujuan:</b> {p.goal}</p>
                  <p className="mt-1 text-sm"><b>Dataset:</b> {ds ? <><code className="inline-code">{ds.file}</code> — {ds.name} ({ds.kind === "real" ? "dataset asli" : "dataset sintetis"}, {ds.license})</> : p.datasetNote}</p>
                  {ds && (
                    <details className="mt-2 text-sm">
                      <summary className="cursor-pointer font-medium text-brand-700 dark:text-brand-400">Data dictionary</summary>
                      <table className="mt-2 w-full text-xs">
                        <tbody>{ds.columns.map(([c, d]) => <tr key={c} className="border-t border-slate-100 dark:border-slate-800"><td className="py-1 pr-2 font-mono">{c}</td><td>{d}</td></tr>)}</tbody>
                      </table>
                    </details>
                  )}
                  <div className="mt-3 flex-1 text-sm">
                    <b>Prasyarat materi:</b>
                    <ul className="mt-1 flex flex-wrap gap-1">
                      {p.prerequisites.map((l) => (
                        <li key={l}><Link to={`/learn/${l}`} className={`badge ${isAvailable(l) ? "badge-brand" : "badge-slate"}`}>{!isAvailable(l) && <Lock size={9} />}{lessonTitle(l)}</Link></li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 rounded-md bg-amber-50 p-2 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
                    <Lock size={13} className="mr-1 inline" /> Panduan & solusi proyek belum dibuka: {missing.length} dari {p.prerequisites.length} materi prasyarat belum tersedia (dijadwalkan Fase {p.phase}).
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
