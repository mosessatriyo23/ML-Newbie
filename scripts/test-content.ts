// Menguji SELURUH konten pembelajaran di runtime yang sama dengan browser (Pyodide):
//  - setiap contoh kode berjalan dan outputnya sama persis dengan yang tertulis di materi
//  - setiap "kesalahan umum" benar-benar menghasilkan error yang disebut, dan versi perbaikannya berjalan
//  - setiap latihan: kode awal (starter) GAGAL test, solusi & solusi alternatif LULUS test
//  - setiap soal "predict the output" cocok dengan output sebenarnya
//  - jumlah minimal: 3–5 contoh, 5 latihan, 5 kuis, 1 mini challenge, referensi
// Jalankan: NODE_USE_ENV_PROXY=1 npm run test:content  [-- <filter-id>]
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPyodide } from "pyodide";
import { ALL_LESSONS } from "../src/content/lessons/index.ts";
import { EXAMS } from "../src/content/exams/index.ts";
import { WORKFLOW_STEPS } from "../src/content/workflow.ts";
import { CHEATSHEETS } from "../src/content/cheatsheets.ts";
import { DAILY_EXTRA } from "../src/content/practice.ts";
import { ML_WORKFLOW_CODE } from "../src/content/cheatsheets.ts";
import { PROJECTS } from "../src/content/projects.ts";
import { ALL_LESSON_META } from "../src/curriculum/curriculum.ts";
import type { CodeExercise, PyTest } from "../src/types.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const filter = process.argv[2];
const MPL_RE = /^\s*(import\s+(matplotlib|seaborn)|from\s+(matplotlib|seaborn)[\s.])/m;

const py = await loadPyodide({ packageCacheDir: join(root, "node_modules", ".pyodide-cache") });
py.setStdout({ write: (b: Uint8Array) => b.length });
py.setStderr({ write: (b: Uint8Array) => b.length });
py.runPython(readFileSync(join(root, "src/runtime/harness.py"), "utf8"));
const dataDir = join(root, "src/content/data");
const realDir = join(root, "public/datasets");
for (const f of readdirSync(dataDir)) py.FS.writeFile(f, readFileSync(join(dataDir, f), "utf8"));
for (const f of readdirSync(realDir)) py.FS.writeFile(f, readFileSync(join(realDir, f), "utf8"));
const initialFiles = new Set([...readdirSync(dataDir), ...readdirSync(realDir)]);
let seaborn = false;

interface Res {
  output: string;
  error: { type: string; message: string; traceback: string } | null;
  figures: string[];
  tests: { desc: string; passed: boolean; error: string | null }[] | null;
}

function cleanFs() {
  for (const n of py.FS.readdir(".") as string[]) {
    if (n === "." || n === "..") continue;
    if (initialFiles.has(n)) continue;
    const st = py.FS.stat(n);
    if (py.FS.isFile(st.mode)) py.FS.unlink(n);
  }
  for (const f of readdirSync(dataDir)) py.FS.writeFile(f, readFileSync(join(dataDir, f), "utf8"));
  for (const f of readdirSync(realDir)) py.FS.writeFile(f, readFileSync(join(realDir, f), "utf8"));
}

async function run(code: string, tests?: PyTest[]): Promise<Res> {
  cleanFs();
  await py.loadPackagesFromImports(code);
  if (/^\s*(import seaborn|from seaborn)/m.test(code) && !seaborn) {
    await py.loadPackage(["micropip"]);
    await py.pyimport("micropip").install("seaborn");
    seaborn = true;
  }
  if (MPL_RE.test(code)) await py.loadPackage(["matplotlib"]);
  const fn = py.globals.get("run_user_code");
  const json = fn(code, tests ? JSON.stringify(tests) : null, MPL_RE.test(code));
  fn.destroy();
  return JSON.parse(json);
}

const norm = (s: string) =>
  s
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/\s+$/, ""))
    .join("\n")
    .replace(/^\n+|\n+$/g, "");

let failures = 0;
let checks = 0;
function fail(where: string, msg: string) {
  failures++;
  console.log(`  ✗ ${where}: ${msg}`);
}
function ok() {
  checks++;
}

async function checkCodeExercise(where: string, ex: CodeExercise) {
  const s = await run(ex.solution, ex.tests);
  const bad = s.tests?.filter((t) => !t.passed) ?? [];
  if (s.error && !ex.tests.some((t) => t.expr.includes("_error"))) fail(where, `solusi error: ${s.error.traceback}`);
  else if (bad.length) fail(where, `solusi gagal test: ${bad.map((b) => `${b.desc} (${b.error ?? "False"})`).join("; ")} | output=${JSON.stringify(s.output)}`);
  else ok();
  for (const [i, alt] of (ex.alternatives ?? []).entries()) {
    const a = await run(alt, ex.tests);
    const ab = a.tests?.filter((t) => !t.passed) ?? [];
    if (ab.length) fail(`${where} alt#${i + 1}`, `alternatif gagal: ${ab.map((b) => b.desc).join("; ")} ${a.error?.traceback ?? ""}`);
    else ok();
  }
  if (!ex.starterLoops) {
    const st = await run(ex.starter, ex.tests);
    if ((st.tests ?? []).every((t) => t.passed)) fail(where, "starter sudah lulus semua test (soal terlalu mudah / test lemah)");
    else ok();
  }
  if (ex.hints.length !== 3) fail(where, "hint harus 3 tingkat");
}

const lessons = ALL_LESSONS.filter((l) => !filter || l.id.includes(filter));
for (const lesson of lessons) {
  console.log(`• ${lesson.id}`);
  const n = lesson.examples.length;
  if (n < 3 || n > 6) fail(lesson.id, `jumlah contoh ${n} (harus 3–5)`);
  if (lesson.exercises.length !== 5) fail(lesson.id, `jumlah latihan ${lesson.exercises.length} (harus 5)`);
  if (lesson.quiz.length !== 5) fail(lesson.id, `jumlah kuis ${lesson.quiz.length} (harus 5)`);
  if (!lesson.references.length) fail(lesson.id, "tidak ada referensi");
  if (lesson.summary.length < 3) fail(lesson.id, "ringkasan terlalu pendek");
  const levels = new Set(lesson.exercises.map((e) => e.level));
  for (const lv of [3, 4, 5] as const) if (!levels.has(lv) && !(lv === 5 && lesson.challenge.level === 5)) fail(lesson.id, `tidak ada latihan level ${lv}`);

  for (const [i, ex] of lesson.examples.entries()) {
    const where = `${lesson.id} contoh#${i + 1}`;
    const r = await run(ex.code);
    if (ex.expectError) {
      if (r.error?.type !== ex.expectError) fail(where, `diharapkan ${ex.expectError}, didapat ${r.error?.type ?? "tidak ada error"}`);
      else ok();
    } else if (r.error) fail(where, `error: ${r.error.traceback}`);
    else ok();
    if (ex.output !== undefined) {
      if (norm(r.output) !== norm(ex.output)) fail(where, `output beda.\n--- diharapkan ---\n${ex.output}\n--- sebenarnya ---\n${r.output}`);
      else ok();
    }
    if (ex.figure && r.figures.length === 0) fail(where, "grafik tidak tertangkap");
    for (const [frag] of ex.explain) {
      const f = frag.trim();
      if (f.length > 2 && !ex.code.includes(f) && !/^[()[\]{}:,.]+$/.test(f)) fail(where, `potongan penjelasan tidak ada di kode: ${JSON.stringify(f)}`);
    }
  }
  const t = await run(lesson.tryIt);
  if (t.error) fail(`${lesson.id} tryIt`, t.error.traceback);
  else ok();
  if (lesson.io) {
    const r = await run(lesson.io.input);
    if (norm(r.output) !== norm(lesson.io.output)) fail(`${lesson.id} io`, `output beda: ${JSON.stringify(r.output)}`);
    else ok();
  }
  for (const [i, m] of lesson.mistakes.entries()) {
    const where = `${lesson.id} mistake#${i + 1}`;
    if (m.error) {
      const w = await run(m.wrong);
      if (w.error?.type !== m.error) fail(where, `kode salah diharapkan ${m.error}, didapat ${w.error?.type ?? "tanpa error"}`);
      else ok();
    }
    const f = await run(m.fix);
    if (f.error) fail(where, `kode perbaikan error: ${f.error.traceback}`);
    else ok();
  }
  for (const ex of lesson.exercises) {
    const where = `${lesson.id} ${ex.id}`;
    if (ex.type === "code") await checkCodeExercise(where, ex);
    else if (ex.type === "arrange") {
      const r = await run(ex.lines.join("\n"), ex.tests);
      if (!(r.tests ?? []).every((x) => x.passed)) fail(where, `urutan benar gagal test: ${r.error?.traceback ?? r.output}`);
      else ok();
      const rev = await run([...ex.lines].reverse().join("\n"), ex.tests);
      if ((rev.tests ?? []).every((x) => x.passed)) fail(where, "urutan terbalik juga lulus (test lemah)");
    } else if (ex.type === "predict") {
      const r = await run(ex.code);
      if (r.error) fail(where, r.error.traceback);
      else if (norm(r.output) !== norm(ex.answer)) fail(where, `jawaban ${JSON.stringify(ex.answer)} ≠ output ${JSON.stringify(r.output)}`);
      else ok();
    }
  }
  await checkCodeExercise(`${lesson.id} challenge`, lesson.challenge);
  for (const q of lesson.quiz) {
    if (q.type === "predict" && q.code && q.options) {
      const r = await run(q.code);
      if (norm(r.output) !== norm(q.options[q.answer as number])) fail(`${lesson.id} ${q.id}`, `opsi benar ${JSON.stringify(q.options[q.answer as number])} ≠ output ${JSON.stringify(r.output)}`);
      else ok();
    }
    if ((q.type === "mcq" || q.type === "predict" || q.type === "case") && (typeof q.answer !== "number" || !q.options || q.answer >= q.options.length)) fail(`${lesson.id} ${q.id}`, "indeks jawaban tidak valid");
  }
}

if (!filter || filter === "exams") {
  console.log("• exams");
  for (const exam of EXAMS) {
    for (const q of exam.questions) {
      if (q.type === "predict" && q.code && q.options) {
        const r = await run(q.code);
        if (norm(r.output) !== norm(q.options[q.answer as number])) fail(`${exam.id} ${q.id}`, `opsi benar ≠ output ${JSON.stringify(r.output)}`);
        else ok();
      }
      if ((q.type === "mcq" || q.type === "predict" || q.type === "case") && (typeof q.answer !== "number" || !q.options || q.answer >= q.options.length)) fail(`${exam.id} ${q.id}`, "indeks jawaban tidak valid");
    }
    for (const task of exam.codeTasks ?? []) {
      await checkCodeExercise(`${exam.id} ${task.id}`, { ...task, type: "code", kind: "write", level: 4, hints: ["", "", ""], alternatives: [] });
    }
  }
  for (const task of DAILY_EXTRA) await checkCodeExercise(`daily ${task.id}`, { ...task, type: "code", kind: "write", level: 4, hints: ["", "", ""] });
}

if (!filter || filter === "workflow") {
  console.log("• workflow");
  for (const step of WORKFLOW_STEPS) {
    if (!step.code) continue;
    const r = await run(step.code);
    if (r.error) fail(`workflow ${step.id}`, r.error.traceback);
    else if (step.output !== undefined && norm(r.output) !== norm(step.output)) fail(`workflow ${step.id}`, `output beda.\n--- diharapkan ---\n${step.output}\n--- sebenarnya ---\n${r.output}`);
    else ok();
  }
}

if (!filter || filter === "cheatsheets") {
  console.log("• cheatsheets");
  for (const cat of CHEATSHEETS) {
    for (const it of cat.items) {
      if (!it.example) continue;
      const r = await run(it.example);
      if (r.error) fail(`cheatsheet ${cat.id}/${it.name}`, r.error.traceback);
      else if (it.output !== undefined && norm(r.output) !== norm(it.output)) fail(`cheatsheet ${cat.id}/${it.name}`, `output beda.\n--- diharapkan ---\n${it.output}\n--- sebenarnya ---\n${r.output}`);
      else ok();
    }
  }
}

if (!filter || filter === "refs") {
  console.log("• referensi antar-konten");
  const ids = new Set(ALL_LESSON_META.map((l) => l.id));
  const dupes = ALL_LESSON_META.length - ids.size;
  if (dupes) fail("curriculum", `${dupes} id lesson duplikat`);
  const check = (where: string, id?: string) => {
    if (!id) return;
    if (!ids.has(id)) fail(where, `lesson id tidak ada di kurikulum: ${id}`);
    else ok();
  };
  for (const l of ALL_LESSONS) {
    check(`lesson ${l.id}`, l.id);
    for (const p of l.prerequisites ?? []) check(`prasyarat ${l.id}`, p);
    for (const q of l.quiz) check(`quiz ${q.id}`, q.lessonId);
  }
  for (const s of WORKFLOW_STEPS) for (const l of s.lessons) check(`workflow ${s.id}`, l);
  for (const p of PROJECTS) for (const l of p.prerequisites) check(`project ${p.id}`, l);
  for (const e of EXAMS) {
    for (const q of e.questions) check(`exam ${q.id}`, q.lessonId);
    for (const t of e.codeTasks ?? []) check(`exam ${t.id}`, t.lessonId);
  }
  for (const p of PROJECTS) {
    if (!p.starter) continue;
    const pr = await run(p.starter);
    if (pr.error) fail(`project ${p.id} starter`, pr.error.traceback);
    else ok();
    if (p.dataset && !p.starter.includes(p.dataset)) fail(`project ${p.id}`, "starter tidak memakai dataset proyek");
  }
  const r = await run(ML_WORKFLOW_CODE);
  if (r.error) fail("ML_WORKFLOW_CODE", r.error.traceback);
  else ok();
}

console.log(`\n${checks} pemeriksaan lulus, ${failures} gagal.`);
process.exit(failures ? 1 : 0);
