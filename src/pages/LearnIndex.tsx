import { CircleCheck, CircleDashed } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { isAvailable, moduleAvailability } from "../content";
import { DIFFICULTY_LABEL, MODULES } from "../curriculum/curriculum";
import { useStore } from "../engine/store";

const PHASES = [
  { n: 1, title: "Functional Learning Platform", desc: "Dashboard, kurikulum, Python runtime, editor interaktif, kuis, progres, materi Python–NumPy–Pandas–Data Loading–EDA." },
  { n: 2, title: "Machine Learning Core", desc: "Introduction, Statistics, Data Splitting, Preprocessing, Feature Engineering, ML Fundamentals, Regression, Classification, Clustering, Evaluation." },
  { n: 3, title: "Interactive Learning System", desc: "Flashcards, spaced repetition, coding challenge, diagnostic test, ujian modul, memory mode, error notebook." },
  { n: 4, title: "Advanced Learning", desc: "Model improvement, algoritma lanjutan, proyek end-to-end, deployment, final assessment." },
];

export default function LearnIndex() {
  const s = useStore((x) => x);
  const loc = useLocation();
  useEffect(() => {
    if (loc.hash) document.getElementById(loc.hash.slice(1))?.scrollIntoView();
  }, [loc.hash]);
  return (
    <div className="max-w-5xl px-4 py-6 sm:px-8">
      <h1 className="text-3xl font-bold">Kurikulum ML Academy</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        18 modul dari dasar Python hingga deployment. Semua halaman bebas diakses dalam urutan apa pun — tidak ada yang dikunci. Penanda status hanya memberi tahu apakah isinya sudah ditulis: <span className="badge badge-brand">Lengkap</span> berarti materi, latihan, dan kuisnya sudah ada dan seluruh kodenya telah diuji; <CircleDashed size={13} className="inline text-slate-400" /> <span className="badge badge-slate">sedang ditulis</span> berarti halamannya baru berisi ringkasan modul dan referensi resmi.
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {PHASES.map((p) => (
          <div key={p.n} className="card p-4 text-sm">
            <div className="font-semibold">Phase {p.n} — {p.title}</div>
            <div className="text-slate-500">{p.desc}</div>
          </div>
        ))}
      </div>
      <div className="mt-8 space-y-6">
        {MODULES.map((m) => {
          const av = moduleAvailability(m);
          const done = m.lessons.filter((l) => s.completedLessons[l.id]).length;
          return (
            <section key={m.id} id={m.id} className="card scroll-mt-20 p-5" data-testid={`module-${m.id}`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-700 font-bold text-white">{m.number}</div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-bold">Module {m.number} — {m.title}</h2>
                  <p className="text-sm text-slate-500">{m.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {av.complete ? <span className="badge badge-brand">Lengkap — {av.total} subbab</span> : av.avail > 0 ? <span className="badge badge-amber">{av.avail}/{av.total} subbab sudah ditulis</span> : <span className="badge badge-slate">materi sedang ditulis</span>}
                    {av.avail > 0 && <span className="text-slate-500">{done}/{m.lessons.length} selesai</span>}
                  </div>
                </div>
              </div>
              <ol className="mt-4 grid gap-1 sm:grid-cols-2">
                {m.lessons.map((l, i) => {
                  const a = isAvailable(l.id);
                  return (
                    <li key={l.id}>
                      <Link to={`/learn/${l.id}`} className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${a ? "" : "text-slate-500 dark:text-slate-400"}`}>
                        <span className="w-5 text-right text-xs text-slate-500 dark:text-slate-400">{i + 1}</span>
                        {s.completedLessons[l.id] ? <CircleCheck size={14} className="text-brand-500" /> : !a ? <CircleDashed size={14} className="text-slate-400" aria-label="sedang ditulis" /> : <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />}
                        <span className="flex-1">{l.title}</span>
                        {l.difficulty !== "beginner" && <span className="badge badge-purple">{DIFFICULTY_LABEL[l.difficulty]}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
