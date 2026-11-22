import { Brain, CalendarCheck, Layers, NotebookPen, RotateCcw, Shuffle, SquareTerminal } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";
import { ExerciseView, exerciseKindLabel, lessonTitle } from "../components/Exercise";
import { Markdown } from "../components/Markdown";
import { QuestionInput, QuestionPrompt, QuestionReview, recordQuestion } from "../components/Quiz";
import { ALL_CARDS, CODE_PRACTICE, findItem, LESSONS, type CodePracticeItem } from "../content";
import { ALL_LESSONS } from "../content/lessons/index";
import { dailyChallenge } from "../engine/daily";
import type { QuizAnswer } from "../engine/grading";
import { shuffle } from "../engine/grading";
import { reviewCard, setDaily, todayStr, useStore, type ErrorEntry } from "../engine/store";
import type { CodeExercise } from "../types";

const TABS = [
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "daily", label: "Daily Challenge", icon: CalendarCheck },
  { id: "memory", label: "Memory Mode", icon: Brain },
  { id: "errors", label: "Error Notebook", icon: NotebookPen },
  { id: "exercises", label: "Semua Latihan", icon: SquareTerminal },
];

export function toCodeExercise(c: CodePracticeItem): CodeExercise {
  return { id: c.id, type: "code", kind: (c.kind as CodeExercise["kind"]) ?? "write", level: 4, title: c.title, prompt: c.prompt, starter: c.starter, solution: c.solution, tests: c.tests, hints: c.hints ?? ["Ingat kembali konsep pada materi terkait.", "Baca ulang instruksi soal dengan teliti.", "Lihat solusi setelah mencoba."], explanation: c.explanation };
}

function Flashcards() {
  const s = useStore((x) => x);
  const today = todayStr();
  const [lessonFilter, setLessonFilter] = useState("learned");
  const [mode, setMode] = useState<"review" | "memory">("review");
  const [flipped, setFlipped] = useState(false);
  const [typed, setTyped] = useState("");
  const [sessionDone, setSessionDone] = useState<string[]>([]);
  const learned = new Set(Object.keys(s.visited));
  const deck = ALL_CARDS.filter((c) => (lessonFilter === "learned" ? learned.has(c.lessonId) : lessonFilter === "all" ? true : c.lessonId === lessonFilter));
  const due = deck.filter((c) => !sessionDone.includes(c.id) && (!s.cards[c.id] || s.cards[c.id].due <= today));
  const card = due[0];
  const intervals = s.prefs.srsIntervals;
  const st = card ? s.cards[card.id] : undefined;
  const box = st?.box ?? 0;
  const nextGood = intervals[Math.min(box, intervals.length - 1)];
  const nextHard = Math.max(1, Math.round(intervals[Math.min(box, intervals.length - 1)] / 2));
  const rate = (r: "again" | "hard" | "good") => {
    if (!card) return;
    reviewCard(card.id, card.q, r);
    setSessionDone((d) => [...d, card.id]);
    setFlipped(false);
    setTyped("");
  };
  const reviewedToday = Object.values(s.cards).filter((c) => c.lastAt.startsWith(new Date().toISOString().slice(0, 10))).length;
  return (
    <div data-testid="flashcards">
      <div className="flex flex-wrap items-center gap-2">
        <select className="input w-auto" value={lessonFilter} onChange={(e) => { setLessonFilter(e.target.value); setSessionDone([]); }} aria-label="Pilih deck">
          <option value="learned">Materi yang sudah dibuka</option>
          <option value="all">Semua kartu ({ALL_CARDS.length})</option>
          {ALL_LESSONS.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <div className="flex rounded-md border border-slate-300 p-0.5 dark:border-slate-600">
          <button type="button" className={`rounded px-3 py-1 text-sm ${mode === "review" ? "bg-brand-600 text-white" : ""}`} onClick={() => setMode("review")}>Review</button>
          <button type="button" className={`rounded px-3 py-1 text-sm ${mode === "memory" ? "bg-brand-600 text-white" : ""}`} onClick={() => setMode("memory")}>Memory Test (ketik jawaban)</button>
        </div>
        <span className="text-sm text-slate-500">{due.length} kartu jatuh tempo · {deck.length} di deck · {reviewedToday} direview hari ini</span>
      </div>
      {deck.length === 0 && <p className="mt-6 text-slate-500">Deck kosong. Buka minimal satu lesson, atau pilih "Semua kartu".</p>}
      {deck.length > 0 && !card && (
        <div className="card mt-6 p-6 text-center">
          <div className="text-lg font-semibold">🎉 Tidak ada kartu yang jatuh tempo.</div>
          <p className="text-sm text-slate-500">Kartu berikutnya dijadwalkan sesuai interval spaced repetition ({intervals.join(", ")} hari).</p>
        </div>
      )}
      {card && (
        <div className="card mx-auto mt-6 max-w-2xl p-6" data-testid="flashcard">
          <div className="flex justify-between text-xs text-slate-500"><span>{card.lessonTitle}</span><span>Kotak {box + 1}/{intervals.length + 1}{st ? ` · ${st.reviews}× review` : " · kartu baru"}</span></div>
          <div className="mt-4 text-lg font-semibold">{card.q}</div>
          {mode === "memory" && !flipped && (
            <textarea className="input mt-4 font-mono" rows={3} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Tulis sintaks dari ingatan, tanpa melihat materi…" aria-label="Jawaban dari ingatan" />
          )}
          {!flipped ? (
            <button type="button" className="btn-primary mt-4" onClick={() => setFlipped(true)} data-testid="flip-btn">Tampilkan Jawaban</button>
          ) : (
            <>
              {mode === "memory" && (
                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase text-slate-500">Jawabanmu</div>
                  <pre className="mt-1 whitespace-pre-wrap rounded bg-slate-100 p-2 font-mono text-sm dark:bg-slate-800">{typed || "(kosong)"}</pre>
                </div>
              )}
              <div className="mt-4 text-xs font-semibold uppercase text-slate-500">Jawaban</div>
              <CodeBlock code={card.a} lineNumbers={false} />
              <p className="text-sm text-slate-500">Seberapa baik kamu mengingatnya? Nilai dengan jujur — jadwal pengulangan menyesuaikan.</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <button type="button" className="btn border border-red-300 text-red-700 hover:bg-red-50 dark:text-red-300" onClick={() => rate("again")}>Lupa<br /><span className="text-xs">{intervals[0]} hari</span></button>
                <button type="button" className="btn border border-amber-300 text-amber-700 hover:bg-amber-50 dark:text-amber-300" onClick={() => rate("hard")}>Sulit<br /><span className="text-xs">{nextHard} hari</span></button>
                <button type="button" className="btn border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300" onClick={() => rate("good")} data-testid="rate-good">Ingat<br /><span className="text-xs">{nextGood} hari</span></button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Daily() {
  const s = useStore((x) => x);
  const today = todayStr();
  const item = dailyChallenge(s, today);
  const hist = Object.entries(s.daily).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);
  if (!item) return <p className="text-slate-500">Buka minimal satu lesson untuk memulai daily challenge.</p>;
  return (
    <div>
      <p className="text-sm text-slate-500">Satu soal coding per hari, dipilih dari materi yang sudah kamu buka. Soal hari ini: <b>{today}</b>.</p>
      <div className="mt-3">
        <ExerciseView
          key={item.id}
          ex={toCodeExercise(item)}
          lessonId={item.lessonId}
          itemKind="code-task"
          onResult={(ok) => setDaily(today, item.id, ok)}
        />
      </div>
      <h3 className="mt-6 font-semibold">Riwayat daily challenge</h3>
      {hist.length === 0 ? <p className="text-sm text-slate-500">Belum ada riwayat.</p> : (
        <ul className="mt-2 text-sm">
          {hist.map(([d, v]) => <li key={d} className="flex gap-3 py-0.5"><span className="font-mono text-slate-500">{d}</span><span>{findItem(v.itemId)?.item && "title" in findItem(v.itemId)!.item ? (findItem(v.itemId)!.item as { title: string }).title : v.itemId}</span><span className={v.solved ? "text-brand-600" : "text-red-500"}>{v.solved ? "✓ selesai" : "belum benar"}</span></li>)}
        </ul>
      )}
    </div>
  );
}

function Memory() {
  const s = useStore((x) => x);
  const learned = new Set(Object.keys(s.completedLessons).length ? Object.keys(s.completedLessons) : Object.keys(s.visited));
  const pool = CODE_PRACTICE.filter((c) => c.lessonId && learned.has(c.lessonId) && (c.kind === "write" || c.kind === "dataset"));
  const [seed, setSeed] = useState(0);
  const pick = useMemo(() => shuffle(pool).slice(0, 1)[0], [seed, pool.length]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900 dark:border-violet-900 dark:bg-violet-950/30 dark:text-violet-100">
        <b>Memory Mode:</b> tulis kode dari ingatan — tanpa materi, contoh, cheat sheet, atau hint. Solusi dan pembahasan baru muncul setelah kamu submit. Soal diambil dari latihan "Write Code from Scratch" pada materi yang {Object.keys(s.completedLessons).length ? "sudah selesai" : "sudah dibuka"}.
      </div>
      {!pick ? <p className="mt-4 text-slate-500">Belum ada soal. Selesaikan atau buka minimal satu lesson terlebih dahulu.</p> : (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">Materi: {lessonTitle(pick.lessonId)} · {pool.length} soal tersedia</span>
            <button type="button" className="btn-outline" onClick={() => setSeed((x) => x + 1)}><Shuffle size={14} /> Soal lain</button>
          </div>
          <ExerciseView key={pick.id + seed} ex={{ ...toCodeExercise(pick), starter: "# Tulis kode dari ingatan\n" + (pick.kind === "fill" || pick.kind === "debug" ? pick.starter : "") }} lessonId={pick.lessonId} itemKind="code-task" memory />
        </div>
      )}
    </div>
  );
}

function RetryItem({ entry }: { entry: ErrorEntry }) {
  const found = findItem(entry.itemId);
  const [a, setA] = useState<QuizAnswer>(null);
  const [checked, setChecked] = useState(false);
  if (!found) return <p className="text-sm text-slate-500">Soal ini tidak lagi tersedia.</p>;
  if (found.kind === "quiz") {
    const q = found.item;
    return (
      <div className="mt-3">
        <QuestionPrompt q={q} />
        <QuestionInput q={q} value={a} onChange={setA} disabled={checked} reveal={checked} />
        {!checked ? <button type="button" className="btn-accent mt-3" disabled={a === null || a === ""} onClick={() => { recordQuestion(q, a, "quiz"); setChecked(true); }}>Periksa</button> : <QuestionReview q={q} a={a} />}
      </div>
    );
  }
  if (found.kind === "code-task") {
    const t = found.item;
    return <div className="mt-3"><ExerciseView ex={{ id: t.id, type: "code", kind: "write", level: 4, title: t.title, prompt: t.prompt, starter: t.starter, solution: t.solution, tests: t.tests, hints: ["Baca ulang penyebab kesalahan di atas.", "Periksa materi terkait.", "Bandingkan dengan solusi setelah mencoba."], explanation: t.explanation }} lessonId={t.lessonId} itemKind="code-task" hideHeader /></div>;
  }
  return <div className="mt-3"><ExerciseView ex={found.item} lessonId={found.lessonId} itemKind={found.kind === "challenge" ? "challenge" : "exercise"} hideHeader /></div>;
}

function ErrorNotebook() {
  const s = useStore((x) => x);
  const [filter, setFilter] = useState<"open" | "mastered" | "all">("open");
  const [retry, setRetry] = useState<string | null>(null);
  const [session, setSession] = useState<string[] | null>(null);
  const entries = Object.values(s.errors).sort((a, b) => b.lastAt.localeCompare(a.lastAt)).filter((e) => filter === "all" || e.status === filter);
  const open = Object.values(s.errors).filter((e) => e.status === "open");
  if (session) {
    const remaining = session.filter((id) => s.errors[id]?.status === "open");
    const cur = remaining[0];
    return (
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Retry Mistakes — {session.length - remaining.length}/{session.length} dikuasai</h3>
          <button type="button" className="btn-ghost" onClick={() => setSession(null)}>Selesai</button>
        </div>
        {cur ? <div className="exercise-card mt-3"><div className="text-xs text-slate-500">Salah {s.errors[cur].count}× · {lessonTitle(s.errors[cur].lessonId)}</div><RetryItem key={cur} entry={s.errors[cur]} /><button type="button" className="btn-ghost mt-3" onClick={() => setSession((x) => x && [...x.filter((i) => i !== cur), cur])}>Lewati</button></div> : <div className="card mt-3 p-6 text-center">🎉 Semua kesalahan pada sesi ini sudah kamu perbaiki.</div>}
      </div>
    );
  }
  return (
    <div data-testid="error-notebook">
      <div className="flex flex-wrap items-center gap-2">
        {(["open", "mastered", "all"] as const).map((f) => (
          <button key={f} type="button" className={`btn-outline ${filter === f ? "border-brand-500 text-brand-700 dark:text-brand-300" : ""}`} onClick={() => setFilter(f)}>
            {f === "open" ? `Belum dikuasai (${open.length})` : f === "mastered" ? "Sudah dikuasai" : "Semua"}
          </button>
        ))}
        {open.length > 0 && <button type="button" className="btn-primary ml-auto" onClick={() => setSession(open.map((e) => e.itemId))}><RotateCcw size={14} /> Retry Mistakes ({open.length})</button>}
      </div>
      {entries.length === 0 && <p className="mt-6 text-slate-500">{filter === "open" ? "Tidak ada kesalahan yang belum dikuasai. Setiap jawaban salah di latihan, kuis, dan ujian otomatis dicatat di sini." : "Belum ada catatan."}</p>}
      <div className="mt-4 space-y-3">
        {entries.map((e) => (
          <div key={e.itemId} className="exercise-card text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`badge ${e.status === "open" ? "badge-red" : "badge-brand"}`}>{e.status === "open" ? "Belum dikuasai" : "Sudah dikuasai"}</span>
              <span className="badge badge-slate">{e.kind}</span>
              <span className="text-xs text-slate-500">Salah {e.count}× · terakhir {new Date(e.lastAt).toLocaleDateString("id-ID")}</span>
            </div>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              <div><div className="text-xs font-semibold uppercase text-slate-500">Soal</div><Markdown md={e.question.split("\n").slice(0, 6).join("\n")} /></div>
              <div><div className="text-xs font-semibold uppercase text-red-500">Jawaban yang salah</div><pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-red-50 p-2 font-mono text-xs dark:bg-red-950/30">{e.wrongAnswer || "(kosong)"}</pre></div>
              <div><div className="text-xs font-semibold uppercase text-slate-500">Penyebab kesalahan</div><Markdown md={e.cause} /></div>
              <div><div className="text-xs font-semibold uppercase text-emerald-600">Solusi</div><pre className="mt-1 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-emerald-50 p-2 font-mono text-xs dark:bg-emerald-950/30">{e.solution}</pre></div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {e.lessonId && <Link to={`/learn/${e.lessonId}`} className="text-brand-700 underline dark:text-brand-400">Materi terkait: {lessonTitle(e.lessonId)}</Link>}
              <button type="button" className="btn-outline" onClick={() => setRetry(retry === e.itemId ? null : e.itemId)}>{retry === e.itemId ? "Tutup" : "Coba lagi"}</button>
            </div>
            {retry === e.itemId && <RetryItem entry={e} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AllExercises() {
  const s = useStore((x) => x);
  return (
    <div className="space-y-4">
      {ALL_LESSONS.map((l) => (
        <div key={l.id} className="card p-4">
          <div className="flex items-center justify-between">
            <Link to={`/learn/${l.id}`} className="font-semibold hover:underline">{l.title}</Link>
            <span className="text-xs text-slate-500">{[...l.exercises, l.challenge].filter((e) => s.solved[e.id]).length}/{l.exercises.length + 1} selesai</span>
          </div>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            {[...l.exercises, l.challenge].map((e) => (
              <li key={e.id} className="flex items-center gap-2">
                <span className={s.solved[e.id] ? "text-brand-600" : "text-slate-300"}>●</span>
                <Link to={`/learn/${l.id}`} onClick={() => setTimeout(() => document.getElementById(e.id === l.challenge.id ? "challenge" : "exercises")?.scrollIntoView(), 300)} className="flex-1 truncate hover:underline">{e.title}</Link>
                <span className="text-[11px] text-slate-400">{e.id === l.challenge.id ? "Mini challenge" : exerciseKindLabel(e)}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default function PracticePage() {
  const { tab = "flashcards" } = useParams();
  const s = useStore((x) => x);
  const due = ALL_CARDS.filter((c) => s.visited[c.lessonId] && (!s.cards[c.id] || s.cards[c.id].due <= todayStr())).length;
  const open = Object.values(s.errors).filter((e) => e.status === "open").length;
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="text-3xl font-bold">Practice</h1>
      <p className="mt-1 text-slate-500">Latihan untuk mengingat sintaks jangka panjang: flashcard dengan spaced repetition, daily challenge, menulis dari ingatan, dan mengulang kesalahan pribadi. Total {ALL_CARDS.length} flashcard dan {CODE_PRACTICE.length} soal coding dari {Object.keys(LESSONS).length} lesson.</p>
      <div className="mt-4 flex gap-1 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
        {TABS.map((t) => (
          <NavLink key={t.id} to={`/practice/${t.id}`} className={() => `tab flex items-center gap-1.5 ${tab === t.id ? "tab-active" : ""}`}>
            <t.icon size={15} /> {t.label}
            {t.id === "flashcards" && due > 0 && <span className="badge badge-amber">{due}</span>}
            {t.id === "errors" && open > 0 && <span className="badge badge-red">{open}</span>}
            {t.id === "daily" && s.daily[todayStr()]?.solved && <span className="badge badge-brand">✓</span>}
          </NavLink>
        ))}
      </div>
      <div className="mt-5">
        {tab === "flashcards" && <Flashcards />}
        {tab === "daily" && <Daily />}
        {tab === "memory" && <Memory />}
        {tab === "errors" && <ErrorNotebook />}
        {tab === "exercises" && <AllExercises />}
      </div>
    </div>
  );
}
