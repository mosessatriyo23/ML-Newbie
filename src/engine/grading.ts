import type { QuizQuestion } from "../types";

/** Normalisasi jawaban isian: spasi diabaikan, kutip tunggal = kutip ganda, huruf kecil. */
export function normalizeFill(s: string): string {
  return s.trim().replace(/\s+/g, "").replace(/"/g, "'").replace(/;$/, "").toLowerCase();
}

/** Normalisasi output: spasi di ujung setiap baris dan baris kosong di akhir diabaikan. */
export function normalizeOutput(s: string): string {
  return s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

export type QuizAnswer = number | boolean | string | null;

export function isQuizCorrect(q: QuizQuestion, a: QuizAnswer): boolean {
  if (a === null || a === undefined) return false;
  if (q.type === "tf") return a === q.answer;
  if (q.type === "fill") {
    const accepted = (q.answer as string[]).map(normalizeFill);
    return accepted.includes(normalizeFill(String(a)));
  }
  return a === q.answer;
}

export function correctAnswerText(q: QuizQuestion): string {
  if (q.type === "tf") return q.answer ? "True (Benar)" : "False (Salah)";
  if (q.type === "fill") return (q.answer as string[])[0];
  return q.options?.[q.answer as number] ?? "";
}

export function answerText(q: QuizQuestion, a: QuizAnswer): string {
  if (a === null || a === undefined || a === "") return "(tidak dijawab)";
  if (q.type === "tf") return a ? "True (Benar)" : "False (Salah)";
  if (q.type === "fill") return String(a);
  return q.options?.[a as number] ?? String(a);
}

/** PRNG deterministik (mulberry32) agar paket soal A/B/C konsisten. */
export function seededRandom(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mengacak urutan opsi pilihan ganda sambil menjaga indeks jawaban benar. */
export function shuffleOptions(q: QuizQuestion, rand: () => number): QuizQuestion {
  if (!q.options || q.type === "tf" || q.type === "fill") return q;
  const idx = shuffle(
    q.options.map((_, i) => i),
    rand,
  );
  return { ...q, options: idx.map((i) => q.options![i]), answer: idx.indexOf(q.answer as number) };
}
