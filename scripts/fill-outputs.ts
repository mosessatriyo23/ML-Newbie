// Mengisi placeholder "__RUN__" di file lesson dengan output NYATA hasil eksekusi kode di Pyodide.
// Urutan pengisian = urutan kemunculan di file: examples[].output → io.output →
// exercises[predict].answer → quiz[predict].options (opsi bertanda "__RUN__").
// Setelah diisi, scripts/test-content.ts tetap memverifikasi ulang semuanya.
// Jalankan: NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/fill-outputs.ts <file-lesson.ts> [...]
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { loadPyodide } from "pyodide";
import type { Lesson } from "../src/types.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const py = await loadPyodide({ packageCacheDir: join(root, "node_modules", ".pyodide-cache") });
py.setStdout({ write: (b: Uint8Array) => b.length });
py.setStderr({ write: (b: Uint8Array) => b.length });
py.runPython(readFileSync(join(root, "src/runtime/harness.py"), "utf8"));
const dirs = [join(root, "src/content/data"), join(root, "public/datasets")];
const MPL = /^\s*(import\s+(matplotlib|seaborn)|from\s+(matplotlib|seaborn)[\s.])/m;
let seaborn = false;
let excel = false;

async function run(code: string): Promise<string> {
  for (const d of dirs) for (const f of readdirSync(d)) py.FS.writeFile(f, readFileSync(join(d, f), "utf8"));
  await py.loadPackagesFromImports(code);
  if (/read_excel|to_excel|ExcelWriter|ExcelFile|^\s*(import|from)\s+openpyxl/m.test(code) && !excel) {
    await py.loadPackage(["micropip", "pandas"]);
    await py.pyimport("micropip").install(["et_xmlfile-2.0.0-py3-none-any.whl", "openpyxl-3.1.5-py2.py3-none-any.whl"].map((w) => pathToFileURL(join(root, "public/wheels", w)).href));
    excel = true;
  }
  if (/^\s*(import seaborn|from seaborn)/m.test(code) && !seaborn) {
    await py.loadPackage(["micropip"]);
    await py.pyimport("micropip").install(pathToFileURL(join(root, "public/wheels/seaborn-0.13.2-py3-none-any.whl")).href);
    seaborn = true;
  }
  const fn = py.globals.get("run_user_code");
  const r = JSON.parse(fn(code, null, MPL.test(code)));
  fn.destroy();
  if (r.error) throw new Error(`Kode error:\n${code}\n${r.error.traceback}`);
  return (r.output as string).replace(/\n+$/, "");
}

for (const arg of process.argv.slice(2)) {
  const file = resolve(arg);
  const mod = (await import(pathToFileURL(file).href)) as { lesson: Lesson };
  const l = mod.lesson;
  const outputs: string[] = [];
  for (const ex of l.examples) if (ex.output === "__RUN__") outputs.push(await run(ex.code));
  if (l.io?.output === "__RUN__") outputs.push(await run(l.io.input));
  for (const ex of l.exercises) if (ex.type === "predict" && ex.answer === "__RUN__") outputs.push(await run(ex.code));
  for (const q of l.quiz) if (q.type === "predict" && q.code && q.options?.includes("__RUN__")) outputs.push(await run(q.code));
  let src = readFileSync(file, "utf8");
  let n = 0;
  src = src.replace(/"__RUN__"/g, () => JSON.stringify(outputs[n++]));
  if (n !== outputs.length) throw new Error(`${arg}: ${n} placeholder vs ${outputs.length} output`);
  writeFileSync(file, src);
  console.log(`${l.id}: ${n} output diisi`);
}
