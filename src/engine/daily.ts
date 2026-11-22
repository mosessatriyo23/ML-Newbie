import { AVAILABLE_LESSONS, CODE_PRACTICE, type CodePracticeItem } from "../content";
import { hashString } from "./grading";
import type { ProgressState } from "./store";

/** Daily coding challenge: dipilih secara deterministik per tanggal dari materi yang sudah dipelajari. */
export function dailyChallenge(s: ProgressState, date: string): CodePracticeItem | undefined {
  const learned = new Set(Object.keys(s.completedLessons).concat(Object.keys(s.visited)));
  let pool = CODE_PRACTICE.filter((c) => c.lessonId && learned.has(c.lessonId));
  if (pool.length === 0) {
    const first = AVAILABLE_LESSONS[0]?.id;
    pool = CODE_PRACTICE.filter((c) => c.lessonId === first);
  }
  if (pool.length === 0) return undefined;
  const prev = s.daily[date];
  if (prev) return CODE_PRACTICE.find((c) => c.id === prev.itemId) ?? pool[0];
  return pool[hashString(date) % pool.length];
}
