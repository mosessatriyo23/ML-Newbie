// Menjalankan contoh cheat sheet dan kode workflow di Pyodide, lalu menyimpan output NYATA-nya
// ke src/content/generated-outputs.ts. Jalankan ulang setiap kali contoh diubah:
//   NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/gen-outputs.ts
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadPyodide } from "pyodide";
import { CHEATSHEETS } from "../src/content/cheatsheets.ts";
import { WORKFLOW_STEPS } from "../src/content/workflow.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const py = await loadPyodide({ packageCacheDir: join(root, "node_modules", ".pyodide-cache") });
py.setStdout({ write: (b: Uint8Array) => b.length });
py.setStderr({ write: (b: Uint8Array) => b.length });
py.runPython(readFileSync(join(root, "src/runtime/harness.py"), "utf8"));
const dataDir = join(root, "src/content/data");
const MPL = /^\s*(import\s+(matplotlib|seaborn)|from\s+(matplotlib|seaborn)[\s.])/m;
async function run(code: string) {
  for (const f of readdirSync(dataDir)) py.FS.writeFile(f, readFileSync(join(dataDir, f), "utf8"));
  await py.loadPackagesFromImports(code);
  const fn = py.globals.get("run_user_code");
  const r = JSON.parse(fn(code, null, MPL.test(code)));
  fn.destroy();
  if (r.error) throw new Error(r.error.traceback);
  return r.output as string;
}
const out: Record<string, string> = {};
for (const c of CHEATSHEETS) for (const it of c.items) if (it.example && !it.figure) out[`cheat:${c.id}/${it.name}`] = (await run(it.example)).replace(/\n+$/, "");
for (const s of WORKFLOW_STEPS) if (s.code) out[`wf:${s.id}`] = (await run(s.code)).replace(/\n+$/, "");
writeFileSync(
  join(root, "src/content/generated-outputs.ts"),
  `// File ini dibuat otomatis oleh scripts/gen-outputs.ts dari hasil eksekusi nyata di Pyodide — jangan diedit manual.\nexport const GENERATED_OUTPUTS: Record<string, string> = ${JSON.stringify(out, null, 2)};\n`,
);
console.log(`${Object.keys(out).length} output disimpan.`);
