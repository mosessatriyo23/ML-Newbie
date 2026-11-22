import type { ExamDef } from "../../types.ts";
import { DIAGNOSTIC } from "./diagnostic.ts";
import { MODULE01_EXAM, PYTHON_CODING_EXAM } from "./module01.ts";

const FINAL_ASSESSMENT: ExamDef = {
  id: "final",
  title: "Final Assessment — Machine Learning",
  description: "Ujian komprehensif: 30 soal teori, 10 soal interpretasi kode, 10 soal debugging, 5 coding challenge, dan 1 end-to-end mini project.",
  kind: "final",
  pick: 0,
  timeLimitMin: 180,
  available: false,
  unavailableReason: "Dibuka setelah seluruh modul inti (Module 00–16) tersedia, karena soalnya mencakup seluruh workflow Machine Learning. Saat ini baru Module 01 yang lengkap.",
  questions: [],
};

export const EXAMS: ExamDef[] = [DIAGNOSTIC, MODULE01_EXAM, PYTHON_CODING_EXAM, FINAL_ASSESSMENT];
