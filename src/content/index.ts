import { ALL_LESSON_META, MODULES } from "../curriculum/curriculum";
import type { CodeExercise, CodeTask, Exercise, Flashcard, Lesson, LessonMeta, ModuleMeta, QuizQuestion, Skill } from "../types";
import { EXAMS } from "./exams/index";
import { ALL_LESSONS } from "./lessons/index";
import { DAILY_EXTRA } from "./practice";

export const LESSONS: Record<string, Lesson> = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));

export function isAvailable(lessonId: string): boolean {
  return !!LESSONS[lessonId];
}

export function moduleAvailability(m: ModuleMeta) {
  const avail = m.lessons.filter((l) => isAvailable(l.id)).length;
  return { avail, total: m.lessons.length, complete: avail === m.lessons.length, partial: avail > 0 && avail < m.lessons.length };
}

export const AVAILABLE_LESSONS: LessonMeta[] = ALL_LESSON_META.filter((l) => isAvailable(l.id));

export function lessonSkill(lessonId: string): Skill {
  const meta = ALL_LESSON_META.find((l) => l.id === lessonId);
  return MODULES.find((m) => m.id === meta?.moduleId)?.skill ?? "python";
}

export function neighbors(lessonId: string) {
  const i = ALL_LESSON_META.findIndex((l) => l.id === lessonId);
  return { prev: i > 0 ? ALL_LESSON_META[i - 1] : undefined, next: i >= 0 ? ALL_LESSON_META[i + 1] : undefined };
}

export type FoundItem =
  | { kind: "exercise"; item: Exercise; lessonId: string }
  | { kind: "challenge"; item: CodeExercise; lessonId: string }
  | { kind: "quiz"; item: QuizQuestion; lessonId?: string; examId?: string }
  | { kind: "code-task"; item: CodeTask; lessonId?: string; examId?: string };

const ITEM_INDEX = new Map<string, FoundItem>();
for (const l of ALL_LESSONS) {
  for (const e of l.exercises) ITEM_INDEX.set(e.id, { kind: "exercise", item: e, lessonId: l.id });
  ITEM_INDEX.set(l.challenge.id, { kind: "challenge", item: l.challenge, lessonId: l.id });
  for (const q of l.quiz) ITEM_INDEX.set(q.id, { kind: "quiz", item: { ...q, lessonId: q.lessonId ?? l.id }, lessonId: l.id });
}
for (const ex of EXAMS) {
  for (const q of ex.questions) if (!ITEM_INDEX.has(q.id)) ITEM_INDEX.set(q.id, { kind: "quiz", item: q, lessonId: q.lessonId, examId: ex.id });
  for (const t of ex.codeTasks ?? []) ITEM_INDEX.set(t.id, { kind: "code-task", item: t, lessonId: t.lessonId, examId: ex.id });
}
for (const t of DAILY_EXTRA) ITEM_INDEX.set(t.id, { kind: "code-task", item: t, lessonId: t.lessonId });

export function findItem(id: string): FoundItem | undefined {
  return ITEM_INDEX.get(id);
}

export interface CardRef extends Flashcard {
  id: string;
  lessonId: string;
  lessonTitle: string;
}

export const ALL_CARDS: CardRef[] = ALL_LESSONS.flatMap((l) => l.flashcards.map((c, i) => ({ ...c, id: `${l.id}#fc${i}`, lessonId: l.id, lessonTitle: l.title })));

/** Semua latihan kode (bisa dinilai otomatis) — dipakai Daily Challenge & Memory Mode. */
export interface CodePracticeItem {
  id: string;
  title: string;
  prompt: CodeExercise["prompt"];
  starter: string;
  solution: string;
  tests: CodeExercise["tests"];
  explanation: string;
  hints?: [string, string, string];
  lessonId?: string;
  kind: string;
}

export const CODE_PRACTICE: CodePracticeItem[] = [
  ...ALL_LESSONS.flatMap((l) =>
    [...l.exercises, l.challenge]
      .filter((e): e is CodeExercise => e.type === "code")
      .map((e) => ({ id: e.id, title: e.title, prompt: e.prompt, starter: e.starter, solution: e.solution, tests: e.tests, explanation: e.explanation, hints: e.hints, lessonId: l.id, kind: e.kind })),
  ),
  ...DAILY_EXTRA.map((t) => ({ id: t.id, title: t.title, prompt: t.prompt, starter: t.starter, solution: t.solution, tests: t.tests, explanation: t.explanation, lessonId: t.lessonId, kind: "write" })),
];

/** Jumlah item yang dapat dinilai per skill (dasar perhitungan mastery). */
export function itemsPerSkill(): Record<string, string[]> {
  const res: Record<string, string[]> = {};
  for (const l of ALL_LESSONS) {
    const s = lessonSkill(l.id);
    res[s] = res[s] ?? [];
    res[s].push(...l.exercises.map((e) => e.id), l.challenge.id, ...l.quiz.map((q) => q.id));
  }
  return res;
}
