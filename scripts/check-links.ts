// Memeriksa bahwa setiap referensi benar-benar tersedia: URL merespons 200 dan,
// jika ada #anchor, id/name anchor tersebut ada di halaman HTML.
// Jalankan: NODE_USE_ENV_PROXY=1 node --experimental-strip-types scripts/check-links.ts
import { ALL_LESSONS } from "../src/content/lessons/index.ts";
import { MODULE_REFERENCES } from "../src/content/moduleRefs.ts";
import { ALL_DATASETS } from "../src/content/datasets-meta.ts";

const urls = new Map<string, string[]>();
const add = (url: string, where: string) => urls.set(url, [...(urls.get(url) ?? []), where]);
for (const l of ALL_LESSONS) for (const r of l.references) add(r.url, l.id);
for (const [m, refs] of Object.entries(MODULE_REFERENCES)) for (const r of refs) add(r.url, m);
for (const d of ALL_DATASETS) {
  if (d.sourceUrl) add(d.sourceUrl, `dataset ${d.file}`);
  if (d.kaggleUrl) add(d.kaggleUrl, `dataset ${d.file} (Kaggle)`);
}
add("https://www.kaggle.com/learn/python", "refs");
add("https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent", "while-loop");

const pageCache = new Map<string, Promise<{ status: number; body: string }>>();
function fetchPage(base: string) {
  if (!pageCache.has(base)) {
    pageCache.set(
      base,
      fetch(base, { redirect: "follow", headers: { "User-Agent": "Mozilla/5.0 (link-checker)" } })
        .then(async (r) => ({ status: r.status, body: await r.text() }))
        .catch((e) => ({ status: 0, body: String(e) })),
    );
  }
  return pageCache.get(base)!;
}

let bad = 0;
const entries = [...urls.entries()];
const results = await Promise.all(
  entries.map(async ([url, where]) => {
    const [base, anchor] = url.split("#");
    const { status, body } = await fetchPage(base);
    let ok = status === 200;
    let note = `HTTP ${status}`;
    // Kaggle me-render halaman dengan JavaScript; status 200 sudah cukup sebagai bukti halaman ada.
    if (ok && anchor) {
      const found = body.includes(`id="${anchor}"`) || body.includes(`name="${anchor}"`) || body.includes(`id='${anchor}'`);
      if (!found) {
        ok = false;
        note = `anchor #${anchor} tidak ditemukan`;
      }
    }
    return { url, where, ok, note };
  }),
);
for (const r of results) {
  if (!r.ok) {
    bad++;
    console.log(`✗ ${r.url}  (${r.note}) — dipakai di: ${[...new Set(r.where)].join(", ")}`);
  }
}
console.log(`\n${results.length - bad}/${results.length} URL valid.`);
process.exit(bad ? 1 : 0);
