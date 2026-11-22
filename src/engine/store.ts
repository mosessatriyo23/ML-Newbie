// Penyimpanan progres belajar di localStorage. Semua angka di dashboard dihitung dari data ini —
// tidak ada data progres fiktif.
import { useSyncExternalStore } from "react";
import type { Difficulty, Skill } from "../types";

export const STORAGE_KEY = "mlacademy:v1";

export interface Attempt {
  correct: number;
  total: number;
  lastCorrect: boolean;
  lastAt: string;
  skill?: Skill;
  lessonId?: string;
  kind: "exercise" | "quiz" | "exam" | "challenge";
}

export interface ErrorEntry {
  itemId: string;
  kind: "exercise" | "quiz" | "challenge" | "code-task";
  question: string;
  wrongAnswer: string;
  cause: string;
  solution: string;
  lessonId?: string;
  status: "open" | "mastered";
  count: number;
  firstAt: string;
  lastAt: string;
}

export interface ExamRecord {
  id: string;
  examId: string;
  title: string;
  mode: string;
  score: number;
  total: number;
  percent: number;
  durationSec: number;
  at: string;
  perSkill: Record<string, { c: number; t: number }>;
  weakLessons: string[];
}

export interface CardState {
  box: number;
  due: string; // YYYY-MM-DD
  reviews: number;
  lapses: number;
  lastAt: string;
}

export interface HistoryItem {
  type: "lesson" | "exercise" | "quiz" | "exam" | "flashcard" | "daily" | "challenge";
  id: string;
  title: string;
  at: string;
  detail?: string;
}

export interface Prefs {
  theme: "light" | "dark" | "system";
  difficulty: Difficulty;
  dailyTargetMin: number;
  sidebarCollapsed: boolean;
  execTimeoutSec: number;
  srsIntervals: number[];
  userName: string;
}

export interface ProgressState {
  version: 1;
  createdAt: string;
  completedLessons: Record<string, string>;
  visited: Record<string, string>;
  lastLesson?: string;
  history: HistoryItem[];
  attempts: Record<string, Attempt>;
  solved: Record<string, string>;
  quizResults: Record<string, { score: number; total: number; at: string }[]>;
  exams: ExamRecord[];
  code: Record<string, string>;
  bookmarks: string[];
  cards: Record<string, CardState>;
  prefs: Prefs;
  errors: Record<string, ErrorEntry>;
  daily: Record<string, { itemId: string; solved: boolean; at: string }>;
  activity: Record<string, { seconds: number; actions: number }>;
  diagnostic?: { at: string; perSkill: Record<string, { c: number; t: number }>; recommendation: string };
}

export function todayStr(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(date: string, days: number): string {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return todayStr(dt);
}

function initial(): ProgressState {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    completedLessons: {},
    visited: {},
    history: [],
    attempts: {},
    solved: {},
    quizResults: {},
    exams: [],
    code: {},
    bookmarks: [],
    cards: {},
    prefs: {
      theme: "system",
      difficulty: "beginner",
      dailyTargetMin: 30,
      sidebarCollapsed: false,
      execTimeoutSec: 30,
      srsIntervals: [1, 3, 7, 14, 30],
      userName: "",
    },
    errors: {},
    daily: {},
    activity: {},
  };
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial();
    const parsed = JSON.parse(raw);
    return mergeState(parsed);
  } catch {
    return initial();
  }
}

function mergeState(parsed: Partial<ProgressState>): ProgressState {
  const base = initial();
  return { ...base, ...parsed, prefs: { ...base.prefs, ...(parsed.prefs ?? {}) }, version: 1 };
}

let state: ProgressState = load();
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function persist() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* penyimpanan penuh / diblokir: progres tetap ada selama tab terbuka */
    }
  }, 150);
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* abaikan */
    }
  });
}

export function getState() {
  return state;
}

export function update(fn: (draft: ProgressState) => void) {
  const draft: ProgressState = structuredClone(state);
  fn(draft);
  state = draft;
  persist();
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useStore<T>(selector: (s: ProgressState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state));
}

// ---------------- Aksi ----------------

function pushHistory(d: ProgressState, item: Omit<HistoryItem, "at">) {
  d.history.unshift({ ...item, at: new Date().toISOString() });
  if (d.history.length > 200) d.history.length = 200;
  const t = todayStr();
  d.activity[t] = d.activity[t] ?? { seconds: 0, actions: 0 };
  d.activity[t].actions += 1;
}

export function visitLesson(id: string, title: string) {
  update((d) => {
    const first = !d.visited[id];
    d.visited[id] = new Date().toISOString();
    d.lastLesson = id;
    if (first) pushHistory(d, { type: "lesson", id, title, detail: "Mulai belajar" });
  });
}

export function setLessonComplete(id: string, title: string, done: boolean) {
  update((d) => {
    if (done) {
      d.completedLessons[id] = new Date().toISOString();
      pushHistory(d, { type: "lesson", id, title, detail: "Ditandai selesai" });
    } else delete d.completedLessons[id];
  });
}

export function toggleBookmark(id: string) {
  update((d) => {
    d.bookmarks = d.bookmarks.includes(id) ? d.bookmarks.filter((b) => b !== id) : [id, ...d.bookmarks];
  });
}

export function saveCode(key: string, code: string) {
  update((d) => {
    d.code[key] = code;
  });
}

export function clearCode(key: string) {
  update((d) => {
    delete d.code[key];
  });
}

export interface AttemptInput {
  itemId: string;
  title: string;
  correct: boolean;
  kind: Attempt["kind"];
  skill?: Skill;
  lessonId?: string;
  /** data untuk Error Notebook bila salah */
  error?: Omit<ErrorEntry, "itemId" | "status" | "count" | "firstAt" | "lastAt" | "lessonId">;
  historyType?: HistoryItem["type"];
}

export function recordAttempt(a: AttemptInput) {
  update((d) => {
    const now = new Date().toISOString();
    const prev = d.attempts[a.itemId] ?? { correct: 0, total: 0, lastCorrect: false, lastAt: now, kind: a.kind };
    d.attempts[a.itemId] = {
      correct: prev.correct + (a.correct ? 1 : 0),
      total: prev.total + 1,
      lastCorrect: a.correct,
      lastAt: now,
      skill: a.skill ?? prev.skill,
      lessonId: a.lessonId ?? prev.lessonId,
      kind: a.kind,
    };
    if (a.correct && (a.kind === "exercise" || a.kind === "challenge")) d.solved[a.itemId] = d.solved[a.itemId] ?? now;
    const existing = d.errors[a.itemId];
    if (!a.correct && a.error) {
      d.errors[a.itemId] = {
        ...a.error,
        itemId: a.itemId,
        lessonId: a.lessonId,
        status: "open",
        count: (existing?.count ?? 0) + 1,
        firstAt: existing?.firstAt ?? now,
        lastAt: now,
      };
    } else if (a.correct && existing) {
      existing.status = "mastered";
      existing.lastAt = now;
    }
    pushHistory(d, { type: a.historyType ?? (a.kind === "quiz" ? "quiz" : "exercise"), id: a.itemId, title: a.title, detail: a.correct ? "Benar" : "Salah" });
  });
}

export function recordQuizResult(lessonId: string, title: string, score: number, total: number) {
  update((d) => {
    d.quizResults[lessonId] = [...(d.quizResults[lessonId] ?? []), { score, total, at: new Date().toISOString() }];
    pushHistory(d, { type: "quiz", id: lessonId, title, detail: `Skor kuis ${score}/${total}` });
  });
}

export function recordExam(rec: ExamRecord) {
  update((d) => {
    d.exams.unshift(rec);
    pushHistory(d, { type: "exam", id: rec.examId, title: rec.title, detail: `${rec.percent}% (${rec.mode})` });
  });
}

export function setDiagnostic(diag: ProgressState["diagnostic"]) {
  update((d) => {
    d.diagnostic = diag;
  });
}

export function reviewCard(cardId: string, title: string, rating: "again" | "hard" | "good") {
  update((d) => {
    const intervals = d.prefs.srsIntervals.length ? d.prefs.srsIntervals : [1, 3, 7, 14, 30];
    const t = todayStr();
    const prev = d.cards[cardId] ?? { box: 0, due: t, reviews: 0, lapses: 0, lastAt: "" };
    let box = prev.box;
    let days: number;
    if (rating === "again") {
      box = 0;
      days = intervals[0];
    } else if (rating === "hard") {
      days = Math.max(1, Math.round(intervals[Math.min(box, intervals.length - 1)] / 2));
    } else {
      days = intervals[Math.min(box, intervals.length - 1)];
      box = Math.min(box + 1, intervals.length);
    }
    d.cards[cardId] = {
      box,
      due: addDays(t, days),
      reviews: prev.reviews + 1,
      lapses: prev.lapses + (rating === "again" ? 1 : 0),
      lastAt: new Date().toISOString(),
    };
    pushHistory(d, { type: "flashcard", id: cardId, title, detail: rating === "good" ? "Ingat" : rating === "hard" ? "Sulit" : "Lupa" });
  });
}

export function setDaily(date: string, itemId: string, solved: boolean) {
  update((d) => {
    const prev = d.daily[date];
    if (prev?.solved) return;
    d.daily[date] = { itemId, solved, at: new Date().toISOString() };
  });
}

export function addStudySeconds(sec: number) {
  update((d) => {
    const t = todayStr();
    d.activity[t] = d.activity[t] ?? { seconds: 0, actions: 0 };
    d.activity[t].seconds += sec;
  });
}

export function setPrefs(p: Partial<Prefs>) {
  update((d) => {
    d.prefs = { ...d.prefs, ...p };
  });
}

export function exportProgress(): string {
  return JSON.stringify({ app: "ML Academy", exportedAt: new Date().toISOString(), data: state }, null, 2);
}

export function importProgress(text: string): { ok: boolean; message: string } {
  try {
    const parsed = JSON.parse(text);
    const data = parsed?.data ?? parsed;
    if (!data || typeof data !== "object" || data.version !== 1 || typeof data.completedLessons !== "object") {
      return { ok: false, message: "File bukan ekspor progres ML Academy yang valid." };
    }
    state = mergeState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    listeners.forEach((l) => l());
    return { ok: true, message: "Progres berhasil diimpor." };
  } catch (e) {
    return { ok: false, message: `Gagal membaca file: ${String(e)}` };
  }
}

export function resetProgress() {
  const keepTheme = state.prefs.theme;
  state = initial();
  state.prefs.theme = keepTheme;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* abaikan */
  }
  listeners.forEach((l) => l());
}

/** Streak: jumlah hari berturut-turut (sampai hari ini atau kemarin) yang memiliki aktivitas belajar. */
export function computeStreak(activity: ProgressState["activity"]): number {
  let streak = 0;
  let day = todayStr();
  const active = (d: string) => (activity[d]?.actions ?? 0) > 0 || (activity[d]?.seconds ?? 0) >= 60;
  if (!active(day)) day = addDays(day, -1);
  while (active(day)) {
    streak++;
    day = addDays(day, -1);
  }
  return streak;
}
