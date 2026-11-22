import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { lessonSkill } from "../content";
import { getLessonMeta } from "../curriculum/curriculum";
import { answerText, correctAnswerText, isQuizCorrect, type QuizAnswer } from "../engine/grading";
import { recordAttempt, recordQuizResult } from "../engine/store";
import type { QuizQuestion } from "../types";
import { CodeBlock } from "./CodeBlock";
import { Markdown } from "./Markdown";

const TYPE_LABEL: Record<QuizQuestion["type"], string> = {
  mcq: "Multiple Choice",
  tf: "True or False",
  fill: "Fill in the Blank",
  predict: "Predict the Output",
  case: "Case Study",
};

export function QuestionInput({ q, value, onChange, disabled, reveal }: { q: QuizQuestion; value: QuizAnswer; onChange: (a: QuizAnswer) => void; disabled?: boolean; reveal?: boolean }) {
  if (q.type === "tf") {
    return (
      <div className="flex gap-2">
        {[true, false].map((v) => {
          const sel = value === v;
          const right = reveal && q.answer === v;
          return (
            <button key={String(v)} type="button" disabled={disabled} onClick={() => onChange(v)} className={`choice flex-1 justify-center ${sel ? "choice-selected" : ""} ${right ? "choice-right" : ""} ${reveal && sel && !right ? "choice-wrong" : ""}`}>
              {v ? "True (Benar)" : "False (Salah)"}
            </button>
          );
        })}
      </div>
    );
  }
  if (q.type === "fill") {
    return <input className="input font-mono" value={(value as string) ?? ""} disabled={disabled} onChange={(e) => onChange(e.target.value)} placeholder="Ketik jawaban…" aria-label="Jawaban isian" />;
  }
  return (
    <div className="grid gap-2">
      {q.options!.map((o, i) => {
        const sel = value === i;
        const right = reveal && q.answer === i;
        return (
          <button key={i} type="button" disabled={disabled} onClick={() => onChange(i)} className={`choice ${sel ? "choice-selected" : ""} ${right ? "choice-right" : ""} ${reveal && sel && !right ? "choice-wrong" : ""}`}>
            <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
            {q.type === "predict" ? (
              <span className="whitespace-pre-wrap text-left font-mono text-[13px]">{o}</span>
            ) : (
              <span className="text-left">
                <Markdown md={o} className="inline" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function QuestionPrompt({ q, index }: { q: QuizQuestion; index?: number }) {
  return (
    <>
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
        {index !== undefined && <span className="font-semibold text-slate-500">Soal {index + 1}</span>}
        <span className="badge badge-slate">{TYPE_LABEL[q.type]}</span>
      </div>
      <Markdown md={q.prompt} className="font-medium" />
      {q.code && <CodeBlock code={q.code} />}
    </>
  );
}

export function QuestionReview({ q, a }: { q: QuizQuestion; a: QuizAnswer }) {
  const ok = isQuizCorrect(q, a);
  const lesson = q.lessonId ? getLessonMeta(q.lessonId) : undefined;
  return (
    <div className={`feedback ${ok ? "feedback-ok" : "feedback-bad"}`}>
      <div className="flex items-center gap-2 font-semibold">
        {ok ? <CheckCircle2 size={17} /> : <XCircle size={17} />} {ok ? "Correct" : "Incorrect"}
      </div>
      {!ok && (
        <div className="mt-1 text-sm">
          Jawabanmu: <code className="inline-code">{answerText(q, a)}</code> · Jawaban benar: <code className="inline-code">{correctAnswerText(q)}</code>
        </div>
      )}
      <Markdown md={q.explanation} className="text-sm" />
      {!ok && lesson && (
        <div className="text-sm">
          Pelajari ulang:{" "}
          <Link className="font-medium underline" to={`/learn/${lesson.id}`}>
            {lesson.title}
          </Link>
        </div>
      )}
    </div>
  );
}

export function recordQuestion(q: QuizQuestion, a: QuizAnswer, kind: "quiz" | "exam") {
  const ok = isQuizCorrect(q, a);
  recordAttempt({
    itemId: q.id,
    title: q.prompt.slice(0, 80),
    correct: ok,
    kind,
    skill: q.skill ?? (q.lessonId ? lessonSkill(q.lessonId) : undefined),
    lessonId: q.lessonId,
    historyType: kind === "exam" ? "exam" : "quiz",
    error: {
      kind: "quiz",
      question: q.prompt + (q.code ? `\n\n${q.code}` : ""),
      wrongAnswer: answerText(q, a),
      cause: q.explanation,
      solution: correctAnswerText(q),
    },
  });
  return ok;
}

/** Kuis pemahaman di akhir lesson (Practice Mode: umpan balik langsung per soal). */
export function LessonQuiz({ lessonId, title, questions }: { lessonId: string; title: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const qs = questions.map((q) => ({ ...q, lessonId: q.lessonId ?? lessonId }));
  const score = qs.filter((q) => checked[q.id] && isQuizCorrect(q, answers[q.id] ?? null)).length;
  const allChecked = qs.every((q) => checked[q.id]);
  return (
    <div className="space-y-4" data-testid="lesson-quiz">
      {qs.map((q, i) => (
        <div key={q.id} className="exercise-card">
          <QuestionPrompt q={q} index={i} />
          <QuestionInput q={q} value={answers[q.id] ?? null} onChange={(a) => setAnswers((s) => ({ ...s, [q.id]: a }))} disabled={checked[q.id]} reveal={checked[q.id]} />
          {!checked[q.id] ? (
            <button
              type="button"
              className="btn-accent mt-3"
              disabled={answers[q.id] === undefined || answers[q.id] === ""}
              onClick={() => {
                recordQuestion(q, answers[q.id] ?? null, "quiz");
                setChecked((s) => ({ ...s, [q.id]: true }));
              }}
            >
              Periksa Jawaban
            </button>
          ) : (
            <div className="mt-3">
              <QuestionReview q={q} a={answers[q.id] ?? null} />
            </div>
          )}
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <span className="font-semibold">
          Skor: {score}/{qs.length}
        </span>
        {allChecked && !finished && (
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              recordQuizResult(lessonId, title, score, qs.length);
              setFinished(true);
            }}
          >
            Simpan Hasil Kuis
          </button>
        )}
        {finished && <span className="text-sm text-brand-700 dark:text-brand-400">Hasil tersimpan di progres belajarmu.</span>}
        {allChecked && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              setAnswers({});
              setChecked({});
              setFinished(false);
            }}
          >
            Ulangi Kuis
          </button>
        )}
      </div>
    </div>
  );
}
