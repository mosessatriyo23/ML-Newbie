// Perhitungan statistik dashboard — semuanya diturunkan dari data progres nyata.
import { ALL_LESSONS } from "../content/lessons/index";
import { AVAILABLE_LESSONS, CODE_PRACTICE, itemsPerSkill, LESSONS } from "../content";
import { ALL_LESSON_META, MODULES } from "../curriculum/curriculum";
import type { Skill } from "../types";
import { addDays, computeStreak, todayStr, type ProgressState } from "./store";

export interface SkillMastery {
  skill: Skill;
  available: number;
  attempted: number;
  mastered: number;
  accuracy: number | null;
  percent: number | null;
}

export function skillMastery(s: ProgressState): SkillMastery[] {
  const per = itemsPerSkill();
  const skills: Skill[] = ["python", "numpy", "pandas", "statistics", "eda", "preprocessing", "feature", "regression", "classification", "clustering", "evaluation"];
  return skills.map((skill) => {
    const ids = per[skill] ?? [];
    let correct = 0;
    let total = 0;
    let mastered = 0;
    let attempted = 0;
    for (const id of ids) {
      const a = s.attempts[id];
      if (!a) continue;
      attempted++;
      correct += a.correct;
      total += a.total;
      if (a.lastCorrect) mastered++;
    }
    // ujian dengan tag skill juga dihitung ke akurasi
    for (const [id, a] of Object.entries(s.attempts)) {
      if (a.skill === skill && !ids.includes(id)) {
        correct += a.correct;
        total += a.total;
      }
    }
    return {
      skill,
      available: ids.length,
      attempted,
      mastered,
      accuracy: total ? Math.round((correct / total) * 100) : null,
      percent: ids.length ? Math.round((mastered / ids.length) * 100) : null,
    };
  });
}

export function overview(s: ProgressState) {
  const completed = Object.keys(s.completedLessons).filter((id) => LESSONS[id]);
  const quizAttempts = Object.values(s.attempts).filter((a) => a.kind === "quiz");
  const quizCorrect = quizAttempts.reduce((n, a) => n + a.correct, 0);
  const quizTotal = quizAttempts.reduce((n, a) => n + a.total, 0);
  const exerciseIds = new Set(CODE_PRACTICE.map((c) => c.id).concat(ALL_LESSONS.flatMap((l) => l.exercises.map((e) => e.id))));
  const exercisesSolved = Object.keys(s.solved).filter((id) => exerciseIds.has(id)).length;
  const examAvg = s.exams.length ? Math.round(s.exams.reduce((n, e) => n + e.percent, 0) / s.exams.length) : null;
  const completedModules = MODULES.filter((m) => m.lessons.every((l) => s.completedLessons[l.id])).length;
  return {
    completedLessons: completed.length,
    availableLessons: AVAILABLE_LESSONS.length,
    totalLessons: ALL_LESSON_META.length,
    completedModules,
    totalModules: MODULES.length,
    exercisesSolved,
    totalExercises: exerciseIds.size,
    quizAccuracy: quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null,
    quizTotal,
    examAvg,
    streak: computeStreak(s.activity),
  };
}

export function weekActivity(s: ProgressState) {
  const days: { date: string; label: string; minutes: number; actions: number }[] = [];
  const names = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(todayStr(), -i);
    const [y, m, dd] = d.split("-").map(Number);
    const a = s.activity[d];
    days.push({ date: d, label: names[new Date(y, m - 1, dd).getDay()], minutes: Math.round((a?.seconds ?? 0) / 60), actions: a?.actions ?? 0 });
  }
  return days;
}

/** Topik lemah: lesson dengan akurasi < 60% (min. 3 percobaan) atau ada kesalahan yang belum dikuasai. */
export function topicStatus(s: ProgressState) {
  const weak: { lessonId: string; reason: string }[] = [];
  const mastered: string[] = [];
  for (const l of ALL_LESSONS) {
    const ids = [...l.exercises.map((e) => e.id), l.challenge.id, ...l.quiz.map((q) => q.id)];
    let c = 0;
    let t = 0;
    let lastOk = 0;
    for (const id of ids) {
      const a = s.attempts[id];
      if (!a) continue;
      c += a.correct;
      t += a.total;
      if (a.lastCorrect) lastOk++;
    }
    const openErrors = Object.values(s.errors).filter((e) => e.lessonId === l.id && e.status === "open").length;
    if ((t >= 3 && c / t < 0.6) || openErrors >= 2) weak.push({ lessonId: l.id, reason: t ? `Akurasi ${Math.round((c / t) * 100)}%${openErrors ? `, ${openErrors} kesalahan belum dikuasai` : ""}` : `${openErrors} kesalahan belum dikuasai` });
    else if (lastOk / ids.length >= 0.8 && s.completedLessons[l.id]) mastered.push(l.id);
  }
  return { weak, mastered };
}

export function recommendedNext(s: ProgressState): string | undefined {
  if (s.lastLesson && LESSONS[s.lastLesson] && !s.completedLessons[s.lastLesson]) return s.lastLesson;
  return AVAILABLE_LESSONS.find((l) => !s.completedLessons[l.id])?.id;
}
