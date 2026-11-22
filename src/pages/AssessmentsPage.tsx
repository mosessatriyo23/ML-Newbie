import { CheckCircle2, ChevronLeft, ChevronRight, Clock, GraduationCap, Lock, Timer, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ExerciseView, lessonTitle } from "../components/Exercise";
import { QuestionInput, QuestionPrompt, QuestionReview, recordQuestion } from "../components/Quiz";
import { CodeBlock } from "../components/CodeBlock";
import { isAvailable, moduleAvailability } from "../content";
import { EXAMS } from "../content/exams/index";
import { MODULES, SKILL_LABEL } from "../curriculum/curriculum";
import { hashString, isQuizCorrect, seededRandom, shuffle, shuffleOptions, type QuizAnswer } from "../engine/grading";
import { recordExam, setDiagnostic, useStore } from "../engine/store";
import type { CodeTask, ExamDef, QuizQuestion, Skill } from "../types";

type Mode = "practice" | "exam" | "timed" | "memory";
const MODE_INFO: Record<Mode, { label: string; desc: string }> = {
  practice: { label: "Practice Mode", desc: "Umpan balik & pembahasan langsung setelah setiap soal. Cocok untuk belajar." },
  exam: { label: "Exam Mode", desc: "Tanpa hint, tanpa jawaban, tanpa pembahasan sampai ujian selesai." },
  timed: { label: "Timed Examination", desc: "Seperti Exam Mode, dengan batas waktu. Ujian otomatis dikumpulkan saat waktu habis." },
  memory: { label: "Memory Test", desc: "Hanya soal menulis kode dari ingatan — tanpa materi, contoh, maupun hint." },
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Item {
  key: string;
  q?: QuizQuestion;
  task?: CodeTask;
}

const DIAG_ORDER: { skill: Skill; module: string; label: string }[] = [
  { skill: "python", module: "m01", label: "Module 01 — Python Fundamentals" },
  { skill: "numpy", module: "m02", label: "Module 02 — NumPy" },
  { skill: "pandas", module: "m03", label: "Module 03 — Pandas" },
  { skill: "statistics", module: "m05", label: "Module 05 — Statistics" },
  { skill: "eda", module: "m06", label: "Module 06 — EDA" },
  { skill: "preprocessing", module: "m08", label: "Module 07–08 — Splitting & Preprocessing" },
  { skill: "fundamentals", module: "m10", label: "Module 10–13 — Modelling" },
  { skill: "evaluation", module: "m14", label: "Module 14 — Model Evaluation" },
];

function ExamRunner({ exam }: { exam: ExamDef }) {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"setup" | "run" | "done">("setup");
  const [mode, setMode] = useState<Mode>(exam.kind === "coding" ? "exam" : "exam");
  const [pack, setPack] = useState<"A" | "B" | "C" | "R">("A");
  const [items, setItems] = useState<Item[]>([]);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [codeResults, setCodeResults] = useState<Record<string, boolean>>({});
  const [idx, setIdx] = useState(0);
  const [startAt, setStartAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [result, setResult] = useState<{ score: number; total: number; durationSec: number } | null>(null);
  const finished = useRef(false);
  const hasCode = (exam.codeTasks?.length ?? 0) > 0;
  const hasQuiz = exam.questions.length > 0;

  const start = () => {
    const seed = pack === "R" ? Date.now() : hashString(exam.id + pack);
    const rand = seededRandom(seed);
    const qs = mode === "memory" ? [] : shuffle(exam.questions, rand).slice(0, exam.pick).map((q) => shuffleOptions(q, rand));
    const tasks = mode === "memory" || exam.kind === "coding" || exam.kind === "final" ? shuffle(exam.codeTasks ?? [], rand).slice(0, exam.pickCode ?? exam.codeTasks?.length ?? 0) : [];
    setItems([...qs.map((q) => ({ key: q.id, q })), ...tasks.map((t) => ({ key: t.id, task: t }))]);
    setAnswers({});
    setChecked({});
    setCodeResults({});
    setIdx(0);
    setStartAt(Date.now());
    finished.current = false;
    setPhase("run");
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    let score = 0;
    const perSkill: Record<string, { c: number; t: number }> = {};
    const weak = new Set<string>();
    for (const it of items) {
      const skill = it.q?.skill ?? it.task?.skill ?? "python";
      perSkill[skill] = perSkill[skill] ?? { c: 0, t: 0 };
      perSkill[skill].t++;
      let ok: boolean;
      if (it.q) {
        ok = mode === "practice" && checked[it.key] ? isQuizCorrect(it.q, answers[it.key] ?? null) : recordQuestion(it.q, answers[it.key] ?? null, "exam");
      } else ok = !!codeResults[it.key];
      if (ok) {
        score++;
        perSkill[skill].c++;
      } else {
        const l = it.q?.lessonId ?? it.task?.lessonId;
        if (l) weak.add(l);
      }
    }
    const durationSec = Math.round((Date.now() - startAt) / 1000);
    const percent = items.length ? Math.round((score / items.length) * 100) : 0;
    recordExam({ id: `${exam.id}-${Date.now()}`, examId: exam.id, title: exam.title, mode: MODE_INFO[mode].label, score, total: items.length, percent, durationSec, at: new Date().toISOString(), perSkill, weakLessons: [...weak] });
    if (exam.kind === "diagnostic") {
      const weakest = DIAG_ORDER.find((d) => {
        const p = perSkill[d.skill];
        return p && p.c / p.t < 0.6;
      });
      setDiagnostic({ at: new Date().toISOString(), perSkill, recommendation: weakest ? `mulai dari ${weakest.label}` : "fondasimu kuat — lanjutkan ke modul Machine Learning (Module 10+)" });
    }
    setResult({ score, total: items.length, durationSec });
    setPhase("done");
  };

  const remaining = mode === "timed" ? exam.timeLimitMin * 60 - Math.floor((now - startAt) / 1000) : null;
  useEffect(() => {
    if (phase !== "run") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [phase]);
  useEffect(() => {
    if (phase === "run" && remaining !== null && remaining <= 0) finish();
  }); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === "setup") {
    const modes: Mode[] = ["practice", "exam", "timed", ...(hasCode ? (["memory"] as Mode[]) : [])];
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <Link to="/assessments" className="text-sm text-slate-500 hover:underline">← Assessments</Link>
        <h1 className="mt-2 text-3xl font-bold">{exam.title}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{exam.description}</p>
        <div className="mt-2 text-sm text-slate-500">
          {hasQuiz && <>Bank soal: {exam.questions.length} soal teori/kode → {exam.pick} soal per paket. </>}
          {hasCode && <>Soal coding: {exam.pickCode ?? exam.codeTasks!.length} dari {exam.codeTasks!.length}. </>}
          Batas waktu (Timed): {exam.timeLimitMin} menit.
        </div>
        <h2 className="mt-6 font-semibold">Pilih mode</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {modes.map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} className={`choice flex-col ${mode === m ? "choice-selected" : ""}`} data-testid={`mode-${m}`}>
              <span className="font-semibold">{MODE_INFO[m].label}</span>
              <span className="text-xs text-slate-500">{MODE_INFO[m].desc}</span>
            </button>
          ))}
        </div>
        <h2 className="mt-6 font-semibold">Paket soal</h2>
        <p className="text-sm text-slate-500">Setiap paket mengambil kombinasi & urutan soal serta urutan pilihan jawaban yang berbeda, agar kamu tidak menghafal urutan jawaban.</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["A", "B", "C", "R"] as const).map((p) => (
            <button key={p} type="button" className={`btn-outline ${pack === p ? "border-brand-500 text-brand-700 dark:text-brand-300" : ""}`} onClick={() => setPack(p)}>
              {p === "R" ? "Randomized (acak setiap kali)" : `Paket ${p}`}
            </button>
          ))}
        </div>
        <button type="button" className="btn-primary mt-6" onClick={start} data-testid="start-exam">Mulai</button>
      </div>
    );
  }

  if (phase === "done" && result) {
    const pct = result.total ? Math.round((result.score / result.total) * 100) : 0;
    const per: Record<string, { c: number; t: number }> = {};
    const wrongLessons = new Set<string>();
    for (const it of items) {
      const sk = it.q?.skill ?? it.task?.skill ?? "python";
      per[sk] = per[sk] ?? { c: 0, t: 0 };
      per[sk].t++;
      const ok = it.q ? isQuizCorrect(it.q, answers[it.key] ?? null) : !!codeResults[it.key];
      if (ok) per[sk].c++;
      else {
        const l = it.q?.lessonId ?? it.task?.lessonId;
        if (l) wrongLessons.add(l);
      }
    }
    const strengths = Object.entries(per).filter(([, v]) => v.c / v.t >= 0.7);
    const weaknesses = Object.entries(per).filter(([, v]) => v.c / v.t < 0.7);
    return (
      <div className="mx-auto max-w-4xl px-4 py-6" data-testid="exam-result">
        <h1 className="text-3xl font-bold">Hasil: {exam.title}</h1>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="stat"><div className="stat-label">Nilai akhir</div><div className="stat-value">{result.score}/{result.total}</div></div>
          <div className="stat"><div className="stat-label">Persentase benar</div><div className="stat-value">{pct}%</div></div>
          <div className="stat"><div className="stat-label">Waktu pengerjaan</div><div className="stat-value">{fmt(result.durationSec)}</div></div>
          <div className="stat"><div className="stat-label">Mode</div><div className="stat-value text-base">{MODE_INFO[mode].label}</div></div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="card p-4">
            <h2 className="font-semibold">Analisis kekuatan</h2>
            {strengths.length ? strengths.map(([k, v]) => <div key={k} className="text-sm">✓ {SKILL_LABEL[k as Skill] ?? k}: {v.c}/{v.t}</div>) : <p className="text-sm text-slate-500">Belum ada bidang dengan skor ≥70%.</p>}
          </div>
          <div className="card p-4">
            <h2 className="font-semibold">Analisis kelemahan</h2>
            {weaknesses.length ? weaknesses.map(([k, v]) => <div key={k} className="text-sm">✗ {SKILL_LABEL[k as Skill] ?? k}: {v.c}/{v.t}</div>) : <p className="text-sm text-slate-500">Tidak ada bidang di bawah 70%. Bagus!</p>}
          </div>
        </div>
        <div className="card mt-4 p-4">
          <h2 className="font-semibold">Topik yang perlu diulang & rekomendasi latihan</h2>
          {wrongLessons.size ? (
            <ul className="mt-1 list-disc pl-5 text-sm">
              {[...wrongLessons].sort((x, y) => Number(isAvailable(y)) - Number(isAvailable(x))).map((l) => <li key={l}><Link className="text-brand-700 underline dark:text-brand-400" to={`/learn/${l}`}>{lessonTitle(l)}</Link> — {isAvailable(l) ? "baca ulang lalu kerjakan latihan Level 3–5-nya." : "materinya belum tersedia di ML Academy; gunakan referensi resmi yang tertera di halaman tersebut."}</li>)}
            </ul>
          ) : <p className="text-sm text-slate-500">Semua soal benar.</p>}
          <p className="mt-2 text-sm">Soal yang salah sudah dicatat di <Link to="/practice/errors" className="underline">Error Notebook</Link> — gunakan <b>Retry Mistakes</b>. Tambah latihan harian di <Link to="/practice/memory" className="underline">Memory Mode</Link>.</p>
          {exam.kind === "diagnostic" && <p className="mt-2 rounded bg-brand-50 p-2 text-sm dark:bg-brand-950/40"><b>Rekomendasi titik awal:</b> {DIAG_ORDER.find((d) => per[d.skill] && per[d.skill].c / per[d.skill].t < 0.6)?.label ?? "Fondasi Python–data kuat. Lanjutkan ke modul Machine Learning."} {(() => { const d = DIAG_ORDER.find((x) => per[x.skill] && per[x.skill].c / per[x.skill].t < 0.6); const m = d && MODULES.find((mm) => mm.id === d.module); return m && moduleAvailability(m).avail === 0 ? " (Modul ini belum tersedia; sementara perkuat modul yang sudah ada dan gunakan referensi resmi di halaman modulnya.)" : ""; })()}</p>}
        </div>
        <h2 className="mt-6 text-xl font-semibold">Pembahasan setiap jawaban</h2>
        <div className="mt-3 space-y-4">
          {items.map((it, i) => (
            <div key={it.key} className="exercise-card">
              {it.q ? (
                <>
                  <QuestionPrompt q={it.q} index={i} />
                  <QuestionInput q={it.q} value={answers[it.key] ?? null} onChange={() => undefined} disabled reveal />
                  <QuestionReview q={it.q} a={answers[it.key] ?? null} />
                </>
              ) : (
                <>
                  <div className="text-xs font-semibold text-slate-500">Soal {i + 1} · Coding</div>
                  <div className="font-semibold">{it.task!.title}</div>
                  <div className={`feedback ${codeResults[it.key] ? "feedback-ok" : "feedback-bad"}`}>
                    <div className="flex items-center gap-2 font-semibold">{codeResults[it.key] ? <CheckCircle2 size={17} /> : <XCircle size={17} />} {codeResults[it.key] ? "Correct" : "Incorrect / tidak dikumpulkan"}</div>
                    <div className="mt-1 text-sm">{it.task!.explanation}</div>
                    <div className="mt-2 text-sm font-medium">Solusi:</div>
                    <CodeBlock code={it.task!.solution} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <button type="button" className="btn-primary" onClick={() => setPhase("setup")}>Ulangi dengan paket lain</button>
          <button type="button" className="btn-outline" onClick={() => nav("/assessments")}>Kembali</button>
        </div>
      </div>
    );
  }

  const it = items[idx];
  const answeredCount = items.filter((x) => (x.q ? answers[x.key] !== undefined && answers[x.key] !== "" : codeResults[x.key] !== undefined)).length;
  return (
    <div className="mx-auto max-w-4xl px-4 py-6" data-testid="exam-runner">
      <div className="sticky top-14 z-10 -mx-4 mb-4 flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <span className="font-semibold">{exam.title}</span>
        <span className="badge badge-slate">{MODE_INFO[mode].label}</span>
        <span className="text-sm text-slate-500">{answeredCount}/{items.length} terjawab</span>
        <span className="ml-auto flex items-center gap-1 text-sm font-mono">
          {remaining !== null ? <><Timer size={15} className={remaining < 60 ? "text-red-500" : ""} /> <span className={remaining < 60 ? "text-red-500" : ""}>{fmt(Math.max(0, remaining))}</span></> : <><Clock size={15} /> {fmt(Math.floor((now - startAt) / 1000))}</>}
        </span>
        <button type="button" className="btn-primary" onClick={() => { if (answeredCount < items.length && !confirm(`Masih ada ${items.length - answeredCount} soal belum dijawab. Kumpulkan sekarang?`)) return; finish(); }} data-testid="finish-exam">Selesai & Kumpulkan</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-1">
        {items.map((x, i) => {
          const done = x.q ? answers[x.key] !== undefined && answers[x.key] !== "" : codeResults[x.key] !== undefined;
          return <button key={x.key} type="button" onClick={() => setIdx(i)} className={`h-8 w-8 rounded text-xs font-semibold ${i === idx ? "bg-brand-600 text-white" : done ? "bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-200" : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>{i + 1}</button>;
        })}
      </div>
      {it && (
        <div className="exercise-card" key={it.key}>
          {it.q ? (
            <>
              <QuestionPrompt q={it.q} index={idx} />
              <QuestionInput q={it.q} value={answers[it.key] ?? null} onChange={(a) => setAnswers((s) => ({ ...s, [it.key]: a }))} disabled={checked[it.key]} reveal={mode === "practice" && checked[it.key]} />
              {mode === "practice" && !checked[it.key] && (
                <button type="button" className="btn-accent mt-3" disabled={answers[it.key] === undefined || answers[it.key] === ""} onClick={() => { recordQuestion(it.q!, answers[it.key] ?? null, "exam"); setChecked((s) => ({ ...s, [it.key]: true })); }}>Periksa</button>
              )}
              {mode === "practice" && checked[it.key] && <QuestionReview q={it.q} a={answers[it.key] ?? null} />}
            </>
          ) : (
            <>
              <div className="mb-1 text-xs font-semibold text-slate-500">Soal {idx + 1} · Coding {mode === "memory" ? "(Memory Test — tulis dari ingatan)" : ""}</div>
              <ExerciseView
                ex={{ id: it.task!.id, type: "code", kind: "write", level: 4, title: it.task!.title, prompt: it.task!.prompt, starter: it.task!.starter, solution: it.task!.solution, tests: it.task!.tests, hints: ["Ingat konsep pada materi terkait.", "Baca instruksi dengan teliti.", "Periksa nama variabel yang diminta."], explanation: it.task!.explanation }}
                lessonId={it.task!.lessonId}
                itemKind="code-task"
                examMode={mode !== "practice"}
                onResult={(ok) => setCodeResults((s) => ({ ...s, [it.key]: ok }))}
                hideHeader
              />
            </>
          )}
        </div>
      )}
      <div className="mt-4 flex justify-between">
        <button type="button" className="btn-outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}><ChevronLeft size={15} /> Sebelumnya</button>
        <button type="button" className="btn-outline" disabled={idx >= items.length - 1} onClick={() => setIdx((i) => i + 1)} data-testid="next-question">Berikutnya <ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

export default function AssessmentsPage() {
  const { examId } = useParams();
  const s = useStore((x) => x);
  const exam = EXAMS.find((e) => e.id === examId);
  const lockedModules = useMemo(() => MODULES.filter((m) => !EXAMS.some((e) => e.moduleId === m.id && e.kind === "module")), []);
  if (examId && exam && exam.available) return <ExamRunner key={exam.id} exam={exam} />;
  const groups: { title: string; items: ExamDef[] }[] = [
    { title: "Diagnostic Pre-Test", items: EXAMS.filter((e) => e.kind === "diagnostic") },
    { title: "Module Examinations", items: EXAMS.filter((e) => e.kind === "module") },
    { title: "Coding Examinations", items: EXAMS.filter((e) => e.kind === "coding") },
    { title: "Final Assessment", items: EXAMS.filter((e) => e.kind === "final") },
  ];
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6" data-testid="assessments">
      <h1 className="text-3xl font-bold">Assessments</h1>
      <p className="mt-1 text-slate-500">Ukur kemampuanmu secara nyata. Mode: Practice, Exam (tanpa hint/solusi sampai selesai), Timed, Memory Test, dan paket soal acak. Subchapter quiz ada di akhir setiap lesson.</p>
      {examId && !exam && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-800">Ujian tidak ditemukan.</div>}
      {groups.map((g) => (
        <section key={g.title} className="mt-6">
          <h2 className="text-lg font-semibold">{g.title}</h2>
          <div className="mt-2 grid gap-3 md:grid-cols-2">
            {g.items.map((e) => {
              const last = s.exams.find((r) => r.examId === e.id);
              return (
                <div key={e.id} className="card flex flex-col p-4">
                  <div className="flex items-start gap-2"><GraduationCap size={18} className="mt-0.5 text-brand-600" /><div className="font-semibold">{e.title}</div></div>
                  <p className="mt-1 flex-1 text-sm text-slate-500">{e.description}</p>
                  {last && <div className="mt-2 text-xs text-slate-500">Terakhir: {last.percent}% ({last.mode}, {new Date(last.at).toLocaleDateString("id-ID")})</div>}
                  {e.available ? <Link to={`/assessments/${e.id}`} className="btn-primary mt-3 self-start" data-testid={`open-${e.id}`}>Buka</Link> : <div className="mt-3 flex items-start gap-1.5 text-sm text-amber-700 dark:text-amber-300"><Lock size={14} className="mt-0.5 shrink-0" /> {e.unavailableReason}</div>}
                </div>
              );
            })}
            {g.title === "Module Examinations" &&
              lockedModules.map((m) => (
                <div key={m.id} className="card p-4 opacity-70">
                  <div className="font-semibold">Ujian Module {m.number} — {m.title}</div>
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500"><Lock size={14} /> Tersedia setelah materi modul ini lengkap (Fase {m.phase}).</div>
                </div>
              ))}
          </div>
        </section>
      ))}
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Riwayat ujian</h2>
        {s.exams.length === 0 ? <p className="text-sm text-slate-500">Belum ada ujian yang dikerjakan.</p> : (
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-slate-500"><tr><th className="py-1">Tanggal</th><th>Ujian</th><th>Mode</th><th>Nilai</th><th>Waktu</th></tr></thead>
              <tbody>
                {s.exams.slice(0, 20).map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800"><td className="py-1">{new Date(r.at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</td><td>{r.title}</td><td>{r.mode}</td><td>{r.score}/{r.total} ({r.percent}%)</td><td>{fmt(r.durationSec)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
