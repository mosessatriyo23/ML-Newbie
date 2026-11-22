// Tipe data inti ML Academy. Semua materi, latihan, kuis, dan ujian mengikuti bentuk ini
// sehingga konten baru cukup ditambahkan sebagai data tanpa mengubah komponen UI.

/** Teks Markdown sederhana. Array = beberapa paragraf/blok. */
export type Md = string | string[];

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Skill =
  | "python"
  | "numpy"
  | "pandas"
  | "statistics"
  | "eda"
  | "preprocessing"
  | "feature"
  | "regression"
  | "classification"
  | "clustering"
  | "evaluation"
  | "fundamentals";

export interface Reference {
  /** Nama sumber, misalnya "Python Official Documentation". */
  source: string;
  /** Judul bagian dokumentasi / bab buku. */
  title: string;
  url: string;
  note?: string;
}

/** Contoh kode bertahap. `output` adalah output persis yang diverifikasi oleh scripts/test-content.ts. */
export interface CodeExample {
  title: string;
  intro?: Md;
  code: string;
  /** Output stdout yang diharapkan (diuji otomatis). Kosongkan bila contoh menghasilkan grafik saja. */
  output?: string;
  /** Jika contoh sengaja menghasilkan error, tulis nama exception-nya, misalnya "NameError". */
  expectError?: string;
  /** Penjelasan baris demi baris: [potongan kode, penjelasan]. */
  explain: [string, string][];
  /** Apa yang berubah dibanding contoh sebelumnya. */
  change?: string;
  /** Contoh menghasilkan grafik (diuji: minimal satu gambar tertangkap). */
  figure?: boolean;
}

export interface Param {
  name: string;
  type?: string;
  default?: string;
  desc: string;
}

export interface ParamGroup {
  title: string;
  items: Param[];
}

export interface Mistake {
  title: string;
  wrong: string;
  error?: string;
  fix: string;
  explain: string;
}

/** Test case Python: `expr` adalah ekspresi Python yang harus bernilai True.
 *  Variabel khusus: `_output` (teks yang dicetak), `_lines` (list baris output tanpa spasi ujung),
 *  `_code` (kode sumber pengguna). */
export interface PyTest {
  desc: string;
  expr: string;
}

export type LearningLevel = 1 | 2 | 3 | 4 | 5;

interface ExerciseBase {
  id: string;
  title: string;
  level: LearningLevel;
  prompt: Md;
  hints: [string, string, string];
  explanation: string;
  skill?: Skill;
}

export interface CodeExercise extends ExerciseBase {
  type: "code";
  /** fill = Fill in the Blank, debug = Debugging, write = Write from Scratch, dataset = Dataset Challenge */
  kind: "fill" | "debug" | "write" | "dataset";
  starter: string;
  solution: string;
  tests: PyTest[];
  /** Solusi alternatif yang juga benar — diuji otomatis agar penilaian tidak sekadar mencocokkan teks. */
  alternatives?: string[];
}

export interface ArrangeExercise extends ExerciseBase {
  type: "arrange";
  /** Baris kode dalam urutan yang benar. Diacak saat ditampilkan. */
  lines: string[];
  tests: PyTest[];
}

export interface PredictExercise extends ExerciseBase {
  type: "predict";
  code: string;
  /** Output yang benar (diverifikasi dengan menjalankan kode). */
  answer: string;
}

export type Exercise = CodeExercise | ArrangeExercise | PredictExercise;

export type QuizType = "mcq" | "tf" | "fill" | "predict" | "case";

export interface QuizQuestion {
  id: string;
  type: QuizType;
  prompt: string;
  code?: string;
  options?: string[];
  /** mcq/predict/case: indeks opsi benar. tf: boolean. fill: daftar jawaban yang diterima. */
  answer: number | boolean | string[];
  explanation: string;
  skill?: Skill;
  /** Lesson terkait untuk rekomendasi belajar ulang. */
  lessonId?: string;
}

export interface Flashcard {
  q: string;
  a: string;
}

export interface CheatItem {
  syntax: string;
  desc: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  objectives: string[];
  definition: Md;
  why: Md;
  when: Md;
  analogy: Md;
  syntax: { code: string; note?: string };
  /** Kamus sintaks: arti setiap bagian kode. */
  anatomy?: [string, string][];
  examples: CodeExample[];
  params?: ParamGroup[];
  io?: { title: string; input: string; output: string; note?: string };
  visual?: string;
  tryIt: string;
  mistakes: Mistake[];
  bestPractices: string[];
  exercises: Exercise[];
  quiz: QuizQuestion[];
  challenge: CodeExercise;
  summary: string[];
  cheatsheet: CheatItem[];
  flashcards: Flashcard[];
  references: Reference[];
  prerequisites?: string[];
}

export interface LessonMeta {
  id: string;
  title: string;
  moduleId: string;
  difficulty: Difficulty;
}

export interface ModuleMeta {
  id: string;
  number: string;
  title: string;
  description: string;
  skill: Skill;
  phase: 1 | 2 | 3 | 4;
  lessons: LessonMeta[];
}

export interface CodeTask {
  id: string;
  title: string;
  prompt: string;
  starter: string;
  solution: string;
  tests: PyTest[];
  skill: Skill;
  lessonId?: string;
  explanation: string;
}

export interface ExamDef {
  id: string;
  title: string;
  description: string;
  kind: "diagnostic" | "module" | "coding" | "final";
  moduleId?: string;
  questions: QuizQuestion[];
  codeTasks?: CodeTask[];
  /** Jumlah soal yang diambil per paket (paket diambil dari bank soal). */
  pick: number;
  pickCode?: number;
  timeLimitMin: number;
  available: boolean;
  unavailableReason?: string;
}
