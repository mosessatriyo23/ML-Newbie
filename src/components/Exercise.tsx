import { ArrowDown, ArrowUp, BookOpen, CheckCircle2, Eye, GripVertical, Lightbulb, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LESSONS, lessonSkill } from "../content";
import { getLessonMeta } from "../curriculum/curriculum";
import { hashString, normalizeOutput, seededRandom, shuffle } from "../engine/grading";
import { clearCode, getState, recordAttempt, saveCode } from "../engine/store";
import type { ArrangeExercise, Exercise, LearningLevel, Md, PredictExercise, PyTest } from "../types";
import type { RunResult } from "../runtime/python";
import { CodeBlock } from "./CodeBlock";
import { CodeRunner, TryIt } from "./CodeRunner";
import { Markdown } from "./Markdown";
import { usePythonRun } from "./usePythonRun";
import { OutputPanel } from "./OutputPanel";

export const mdToText = (m: Md) => (Array.isArray(m) ? m.join("\n") : m);

export const LEVEL_INFO: Record<LearningLevel, { name: string; desc: string; color: string }> = {
  1: { name: "Understand", desc: "Memahami konsep", color: "badge-slate" },
  2: { name: "Follow", desc: "Mengikuti contoh", color: "badge-blue" },
  3: { name: "Complete", desc: "Melengkapi kode", color: "badge-brand" },
  4: { name: "Build", desc: "Menulis sendiri", color: "badge-amber" },
  5: { name: "Apply", desc: "Studi kasus baru", color: "badge-purple" },
};

const KIND_LABEL: Record<string, string> = {
  fill: "Fill in the Blank",
  debug: "Debugging Challenge",
  write: "Write Code from Scratch",
  dataset: "Dataset Challenge",
  arrange: "Code Arrangement",
  predict: "Predict the Output",
};

export function exerciseKindLabel(e: Exercise): string {
  return e.type === "code" ? KIND_LABEL[e.kind] : KIND_LABEL[e.type];
}

export function Feedback({ correct, explanation, solution, lessonId, failing, showSolution }: { correct: boolean; explanation: string; solution?: string; lessonId?: string; failing?: string[]; showSolution: boolean }) {
  const lesson = lessonId ? getLessonMeta(lessonId) : undefined;
  return (
    <div className={`feedback ${correct ? "feedback-ok" : "feedback-bad"}`} data-testid={correct ? "feedback-correct" : "feedback-incorrect"}>
      <div className="flex items-center gap-2 font-semibold">
        {correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
        {correct ? "Correct — jawabanmu benar!" : "Incorrect — belum tepat."}
      </div>
      {!correct && failing && failing.length > 0 && (
        <div className="mt-2 text-sm">
          <div className="font-medium">Bagian yang perlu diperbaiki:</div>
          <ul className="ml-5 list-disc">
            {failing.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
      {(correct || showSolution) && (
        <div className="mt-2 text-sm">
          <span className="font-medium">{correct ? "Mengapa benar: " : "Penjelasan: "}</span>
          <Markdown md={explanation} className="inline" />
        </div>
      )}
      {showSolution && solution && !correct && (
        <div className="mt-2">
          <div className="text-sm font-medium">Solusi:</div>
          <CodeBlock code={solution} />
        </div>
      )}
      {!correct && lesson && (
        <div className="mt-2 text-sm">
          <BookOpen size={14} className="mr-1 inline" />
          Rekomendasi: pelajari ulang{" "}
          <Link className="font-medium underline" to={`/learn/${lesson.id}`}>
            {lesson.title}
          </Link>
          .
        </div>
      )}
    </div>
  );
}

function HintLadder({ hints, level, onMore, canSolution, onSolution, solutionShown }: { hints: [string, string, string]; level: number; onMore: () => void; canSolution: boolean; onSolution: () => void; solutionShown: boolean }) {
  return (
    <div className="mt-3 space-y-2">
      {hints.slice(0, level).map((h, i) => (
        <div key={i} className="hint">
          <Lightbulb size={15} className="mt-0.5 shrink-0 text-amber-500" />
          <div>
            <span className="font-semibold">Hint {i + 1}{i === 0 ? " (konsep)" : i === 1 ? " (fungsi)" : " (sebagian sintaks)"}: </span>
            <Markdown md={h} className="inline" />
          </div>
        </div>
      ))}
      <div className="flex flex-wrap gap-2">
        {level < 3 && (
          <button type="button" className="btn-outline" onClick={onMore} data-testid="hint-btn">
            <Lightbulb size={14} /> Show Hint {level + 1}
          </button>
        )}
        {!solutionShown && (
          <button type="button" className="btn-outline" onClick={onSolution} title={canSolution ? "" : "Disarankan mencoba hint dulu, tetapi solusi boleh dibuka kapan saja"} data-testid="solution-btn">
            <Eye size={14} /> Show Solution
          </button>
        )}
      </div>
    </div>
  );
}

interface ExProps {
  ex: Exercise;
  lessonId?: string;
  examMode?: boolean;
  /** Memory Mode: tanpa hint; solusi & pembahasan muncul setelah submit. */
  memory?: boolean;
  itemKind?: "exercise" | "challenge" | "code-task";
  onResult?: (correct: boolean) => void;
  hideHeader?: boolean;
}

export function ExerciseView(props: ExProps) {
  const { ex } = props;
  return (
    <div className="exercise-card" data-testid={`exercise-${ex.id}`}>
      {!props.hideHeader && (
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={`badge ${LEVEL_INFO[ex.level].color}`}>
            Level {ex.level} — {LEVEL_INFO[ex.level].name}
          </span>
          <span className="badge badge-slate">{exerciseKindLabel(ex)}</span>
          {getState().solved[ex.id] && <span className="badge badge-brand">✓ Pernah diselesaikan</span>}
        </div>
      )}
      {!props.hideHeader && <h4 className="text-base font-semibold text-slate-900 dark:text-white">{ex.title}</h4>}
      <Markdown md={ex.prompt} />
      {ex.type === "code" && <CodeExerciseBody {...props} ex={ex} />}
      {ex.type === "arrange" && <ArrangeBody {...props} ex={ex} />}
      {ex.type === "predict" && <PredictBody {...props} ex={ex} />}
    </div>
  );
}

function useAttempt(props: ExProps, solution: string) {
  const [result, setResult] = useState<{ correct: boolean; failing: string[] } | null>(null);
  const [fails, setFails] = useState(0);
  const [hint, setHint] = useState(0);
  const [showSol, setShowSol] = useState(false);
  const lessonId = props.lessonId;
  const submit = (correct: boolean, failing: string[], answer: string) => {
    setResult({ correct, failing });
    if (!correct) setFails((f) => f + 1);
    recordAttempt({
      itemId: props.ex.id,
      title: props.ex.title,
      correct,
      kind: props.itemKind === "challenge" ? "challenge" : props.examMode ? "exam" : "exercise",
      skill: lessonId ? lessonSkill(lessonId) : props.ex.skill,
      lessonId,
      historyType: props.itemKind === "challenge" ? "challenge" : "exercise",
      error: {
        kind: props.itemKind ?? "exercise",
        question: `${props.ex.title}\n${mdToText(props.ex.prompt)}`,
        wrongAnswer: answer,
        cause: failing.length ? failing.join("; ") : "Jawaban belum sesuai.",
        solution,
      },
    });
    props.onResult?.(correct);
  };
  return { result, fails, hint, setHint, showSol, setShowSol, submit, setResult };
}

function failingFromRun(res: RunResult): string[] {
  const f: string[] = [];
  if (res.error) f.push(`Kode menghasilkan ${res.error.type}${res.error.line ? ` di baris ${res.error.line}` : ""}: ${res.error.message}`);
  for (const t of res.tests ?? []) if (!t.passed) f.push(t.desc + (t.error && !res.error ? ` — ${t.error}` : ""));
  return f;
}

function CodeExerciseBody(props: ExProps & { ex: Extract<Exercise, { type: "code" }> }) {
  const { ex, examMode, memory } = props;
  const key = `${memory ? "mem" : examMode ? "exam" : "ex"}:${ex.id}`;
  const [code, setCode] = useState(() => (examMode ? undefined : getState().code[key]) ?? ex.starter);
  const a = useAttempt(props, ex.solution);
  return (
    <>
      <CodeRunner
        title={KIND_LABEL[ex.kind]}
        code={code}
        filename={`${ex.id}.py`}
        onCodeChange={(c) => {
          setCode(c);
          saveCode(key, c);
        }}
        onReset={() => {
          setCode(ex.starter);
          clearCode(key);
          a.setResult(null);
        }}
        tests={ex.tests}
        checkLabel={examMode ? "Submit" : "Check Answer"}
        onCheck={(res) => {
          const failing = failingFromRun(res);
          a.submit(failing.length === 0 && (res.tests ?? []).every((t) => t.passed), failing, code);
        }}
      />
      {a.result && !examMode && <Feedback correct={a.result.correct} failing={a.result.failing} explanation={ex.explanation} solution={ex.solution} lessonId={props.lessonId} showSolution={a.showSol || a.result.correct || !!memory} />}
      {a.result && examMode && <div className="mt-2 text-sm text-slate-500">Jawaban tersimpan. Pembahasan muncul setelah ujian selesai.</div>}
      {!examMode && !memory && !a.result?.correct && (
        <>
          <HintLadder hints={ex.hints} level={a.hint} onMore={() => a.setHint((h) => Math.min(3, h + 1))} canSolution={a.hint >= 3 || a.fails >= 2} onSolution={() => a.setShowSol(true)} solutionShown={a.showSol} />
          {a.showSol && !a.result && (
            <div className="mt-2">
              <div className="text-sm font-medium">Solusi:</div>
              <CodeBlock code={ex.solution} onTry={() => setCode(ex.solution)} />
              <Markdown md={ex.explanation} className="text-sm" />
            </div>
          )}
        </>
      )}
    </>
  );
}

function ArrangeBody(props: ExProps & { ex: ArrangeExercise }) {
  const { ex, examMode } = props;
  const initial = useMemo(() => {
    const rand = seededRandom(hashString(ex.id));
    let s = shuffle(ex.lines.map((l, i) => ({ l, i })), rand);
    if (s.every((x, i) => x.i === i)) s = [...s.slice(1), s[0]];
    return s;
  }, [ex]);
  const [order, setOrder] = useState(initial);
  const [drag, setDrag] = useState<number | null>(null);
  const { out, run } = usePythonRun();
  const a = useAttempt(props, ex.lines.join("\n"));
  const move = (from: number, to: number) => {
    if (to < 0 || to >= order.length) return;
    const n = [...order];
    const [x] = n.splice(from, 1);
    n.splice(to, 0, x);
    setOrder(n);
  };
  const check = async () => {
    const code = order.map((o) => o.l).join("\n");
    const res = await run(code, ex.tests as PyTest[]);
    if (!res || res.interrupted) return;
    const failing = failingFromRun(res);
    a.submit(failing.length === 0, failing, code);
  };
  return (
    <>
      <ol className="my-3 space-y-1.5" data-testid="arrange-list">
        {order.map((o, idx) => (
          <li
            key={o.i}
            draggable
            onDragStart={() => setDrag(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (drag !== null) move(drag, idx);
              setDrag(null);
            }}
            className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 font-mono text-[13px] dark:border-slate-700 dark:bg-slate-900"
          >
            <GripVertical size={14} className="shrink-0 cursor-grab text-slate-500 dark:text-slate-400" />
            <span className="w-5 shrink-0 text-right text-xs text-slate-500 dark:text-slate-400">{idx + 1}</span>
            <pre className="flex-1 overflow-x-auto whitespace-pre">{o.l}</pre>
            <button type="button" className="icon-btn" aria-label="Naikkan baris" onClick={() => move(idx, idx - 1)} disabled={idx === 0}>
              <ArrowUp size={14} />
            </button>
            <button type="button" className="icon-btn" aria-label="Turunkan baris" onClick={() => move(idx, idx + 1)} disabled={idx === order.length - 1}>
              <ArrowDown size={14} />
            </button>
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button type="button" className="btn-accent" onClick={check} data-testid="check-btn">
          {examMode ? "Submit" : "Check Answer"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => setOrder(initial)}>
          Acak ulang
        </button>
      </div>
      {(out.status !== "idle") && <div className="mt-2"><OutputPanel out={out} /></div>}
      {a.result && !examMode && <Feedback correct={a.result.correct} failing={a.result.failing} explanation={ex.explanation} solution={ex.lines.join("\n")} lessonId={props.lessonId} showSolution={a.showSol || a.result.correct} />}
      {!examMode && !a.result?.correct && <HintLadder hints={ex.hints} level={a.hint} onMore={() => a.setHint((h) => Math.min(3, h + 1))} canSolution={a.hint >= 3 || a.fails >= 2} onSolution={() => a.setShowSol(true)} solutionShown={a.showSol} />}
      {!examMode && a.showSol && !a.result && <CodeBlock code={ex.lines.join("\n")} />}
    </>
  );
}

function PredictBody(props: ExProps & { ex: PredictExercise }) {
  const { ex, examMode } = props;
  const [answer, setAnswer] = useState("");
  const a = useAttempt(props, ex.answer);
  const check = () => {
    const correct = normalizeOutput(answer) === normalizeOutput(ex.answer);
    a.submit(correct, correct ? [] : ["Output yang kamu tulis berbeda dengan output sebenarnya. Perhatikan spasi, baris baru, dan urutan."], answer);
  };
  return (
    <>
      <CodeBlock code={ex.code} />
      <label className="mb-1 block text-sm font-medium text-slate-600 dark:text-slate-300" htmlFor={`pred-${ex.id}`}>
        Tulis output yang kamu perkirakan:
      </label>
      <textarea id={`pred-${ex.id}`} className="input font-mono" rows={Math.max(2, ex.answer.split("\n").length + 1)} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Output..." data-testid="predict-input" />
      <div className="mt-2 flex gap-2">
        <button type="button" className="btn-accent" onClick={check} disabled={!answer.trim()} data-testid="check-btn">
          {examMode ? "Submit" : "Check Answer"}
        </button>
      </div>
      {a.result && !examMode && (
        <>
          <Feedback correct={a.result.correct} failing={a.result.failing} explanation={ex.explanation} lessonId={props.lessonId} showSolution />
          <div className="mt-2 text-sm font-medium">Output sebenarnya:</div>
          <CodeBlock code={ex.answer} lang="text" lineNumbers={false} />
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-brand-700 dark:text-brand-400">Buktikan dengan menjalankan kode</summary>
            <TryIt initialCode={ex.code} title="Jalankan untuk membuktikan" />
          </details>
        </>
      )}
      {!examMode && !a.result?.correct && !a.result && <HintLadder hints={ex.hints} level={a.hint} onMore={() => a.setHint((h) => Math.min(3, h + 1))} canSolution={a.hint >= 3} onSolution={() => a.setShowSol(true)} solutionShown={a.showSol} />}
      {!examMode && a.showSol && !a.result && <CodeBlock code={ex.answer} lang="text" lineNumbers={false} />}
    </>
  );
}

export function lessonTitle(id?: string) {
  return id ? LESSONS[id]?.title ?? getLessonMeta(id)?.title ?? id : "";
}
