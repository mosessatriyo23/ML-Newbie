// End-to-end test di Chromium (Playwright) terhadap build produksi.
// Jalankan: npm run build && (npx vite preview --port 4173 &) && node scripts/e2e.mjs [outDir]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:4173/";
const OUT = process.argv[2] ?? "screenshots-local";
mkdirSync(OUT, { recursive: true });

const results = [];
async function step(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t });
    console.log(`✓ ${name} (${Date.now() - t} ms)`);
  } catch (e) {
    results.push({ name, ok: false, err: String(e).split("\n")[0] });
    console.log(`✗ ${name}: ${String(e).split("\n")[0]}`);
  }
}
function expect(cond, msg) {
  if (!cond) throw new Error(msg);
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await ctx.newPage();
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

const go = async (hash) => {
  await page.goto(`${BASE}#${hash}`);
  await page.waitForLoadState("networkidle");
};
const waitDone = async (scope) => {
  await page.waitForFunction(
    (sel) => {
      const el = document.querySelector(sel);
      return el && /Selesai dalam|python-error|dihentikan/.test(el.textContent + (el.querySelector("[data-testid=python-error]") ? "python-error" : ""));
    },
    scope,
    { timeout: 180000 },
  );
};

await step("Dashboard tampil", async () => {
  await go("/");
  await page.getByTestId("dashboard").waitFor();
  await page.screenshot({ path: `${OUT}/01-dashboard.png`, fullPage: true });
});

await step("Semua navigasi utama berfungsi", async () => {
  const pages = [
    ["/learn", "module-m01"],
    ["/workflow", "workflow"],
    ["/practice/flashcards", "flashcards"],
    ["/playground", "playground"],
    ["/projects", "projects"],
    ["/assessments", "assessments"],
    ["/cheatsheets", "cheatsheets"],
    ["/visual-lab", "visual-lab"],
    ["/settings", "settings"],
    ["/learn/np-creating-arrays", "planned-lesson"],
  ];
  for (const [h, id] of pages) {
    await go(h);
    await page.getByTestId(id).first().waitFor({ timeout: 10000 });
  }
});

await step("Python sungguhan berjalan (Try It)", async () => {
  await go("/learn/py-python-syntax");
  await page.getByTestId("lesson-article").waitFor();
  const tryit = page.locator("#tryit");
  await tryit.getByTestId("run-btn").click();
  await waitDone("#tryit [data-testid=output-panel]");
  const out = await tryit.getByTestId("output-panel").textContent();
  expect(out.includes("Python -> NumPy -> Pandas"), `output tidak sesuai: ${out}`);
  await page.screenshot({ path: `${OUT}/02-lesson-top.png` });
  await tryit.screenshot({ path: `${OUT}/03-tryit.png` });
});

await step("Coba di Editor memuat contoh & output cocok", async () => {
  await page.locator("[data-testid=example]").nth(2).getByText("Coba di Editor").click();
  const tryit = page.locator("#tryit");
  await page.waitForTimeout(400);
  await tryit.getByTestId("run-btn").click();
  await waitDone("#tryit [data-testid=output-panel]");
  const out = await tryit.getByTestId("output-panel").textContent();
  expect(out.includes("Python | NumPy | Pandas"), `output contoh 3 salah: ${out}`);
});

await step("Error Python ditampilkan dengan penjelasan", async () => {
  const tryit = page.locator("#tryit");
  const editor = tryit.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type('Print("Halo")');
  await tryit.getByTestId("run-btn").click();
  await tryit.getByTestId("python-error").waitFor({ timeout: 60000 });
  const t = await tryit.getByTestId("python-error").textContent();
  expect(t.includes("NameError") && t.includes("Did you mean"), `pesan error: ${t}`);
});

await step("Latihan: jawaban salah → Incorrect + Error Notebook", async () => {
  const ex = page.getByTestId("exercise-py-syntax-ex1");
  await ex.scrollIntoViewIfNeeded();
  const editor = ex.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type('print("Halo ML")');
  await ex.getByTestId("check-btn").click();
  await ex.getByTestId("feedback-incorrect").waitFor({ timeout: 60000 });
});

await step("Hint bertahap dan solusi terkunci sampai 3 hint", async () => {
  const ex = page.getByTestId("exercise-py-syntax-ex1");
  expect(await ex.getByTestId("solution-btn").isDisabled(), "solusi tidak terkunci");
  for (let i = 0; i < 3; i++) await ex.getByTestId("hint-btn").click();
  expect(!(await ex.getByTestId("solution-btn").isDisabled()), "solusi tidak terbuka setelah 3 hint");
});

await step("Latihan: jawaban benar → Correct", async () => {
  const ex = page.getByTestId("exercise-py-syntax-ex1");
  const editor = ex.locator(".cm-content");
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type('print("Halo, Machine Learning!")');
  await ex.getByTestId("check-btn").click();
  await ex.getByTestId("feedback-correct").waitFor({ timeout: 60000 });
  await ex.screenshot({ path: `${OUT}/04-exercise-correct.png` });
});

await step("Solusi alternatif yang benar diterima (sep='\\n')", async () => {
  const ex = page.getByTestId("exercise-py-syntax-ex4");
  await ex.scrollIntoViewIfNeeded();
  await ex.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText('print("Nama: Sari", "Jurusan: Informatika", "Target: Machine Learning Engineer", sep="\\n")');
  await ex.getByTestId("check-btn").click();
  await ex.getByTestId("feedback-correct").waitFor({ timeout: 60000 });
});

await step("Predict the Output dinilai", async () => {
  const ex = page.getByTestId("exercise-py-syntax-ex2");
  await ex.scrollIntoViewIfNeeded();
  await ex.getByTestId("predict-input").fill("A-B\nCD");
  await ex.getByTestId("check-btn").click();
  await ex.getByTestId("feedback-correct").waitFor();
});

await step("Kuis: skor dihitung & tersimpan", async () => {
  const quiz = page.getByTestId("lesson-quiz");
  await quiz.scrollIntoViewIfNeeded();
  const cards = quiz.locator(".exercise-card");
  // q1 indeks 1, q2 False, q3 indeks 1, q4 "end", q5 indeks 1
  await cards.nth(0).locator(".choice").nth(1).click();
  await cards.nth(0).getByText("Periksa Jawaban").click();
  await cards.nth(1).getByText("False (Salah)").click();
  await cards.nth(1).getByText("Periksa Jawaban").click();
  await cards.nth(2).locator(".choice").nth(1).click();
  await cards.nth(2).getByText("Periksa Jawaban").click();
  await cards.nth(3).locator("input").fill("end");
  await cards.nth(3).getByText("Periksa Jawaban").click();
  await cards.nth(4).locator(".choice").nth(0).click(); // sengaja salah
  await cards.nth(4).getByText("Periksa Jawaban").click();
  const txt = await quiz.textContent();
  expect(txt.includes("Skor: 4/5"), "skor kuis tidak 4/5");
  await quiz.getByText("Simpan Hasil Kuis").click();
  await quiz.screenshot({ path: `${OUT}/05-quiz.png` });
});

await step("Mark as Complete + Bookmark tersimpan setelah refresh", async () => {
  await page.getByTestId("complete-btn").click();
  await page.getByTestId("bookmark-btn").click();
  await page.waitForTimeout(400);
  await page.reload();
  await page.getByTestId("lesson-article").waitFor();
  const c = await page.getByTestId("complete-btn").textContent();
  const b = await page.getByTestId("bookmark-btn").textContent();
  expect(c.includes("Selesai"), "status selesai hilang setelah refresh");
  expect(b.includes("Tersimpan"), "bookmark hilang setelah refresh");
});

await step("Stop menghentikan infinite loop & runtime pulih", async () => {
  const tryit = page.locator("#tryit");
  await tryit.scrollIntoViewIfNeeded();
  await tryit.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText("i = 0\nwhile True:\n    i += 1");
  await tryit.getByTestId("run-btn").click();
  await tryit.getByTestId("stop-btn").waitFor();
  // tunggu sampai loop benar-benar berjalan (runtime selesai dimuat), lalu hentikan
  await page.waitForFunction(() => /Berjalan/.test(document.querySelector("#tryit [data-testid=run-status]")?.textContent ?? ""), null, { timeout: 120000 });
  await page.waitForTimeout(2000);
  await tryit.getByTestId("stop-btn").click();
  await page.waitForFunction(() => /dihentikan/i.test(document.querySelector("#tryit [data-testid=output-panel]").textContent));
  await tryit.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText('print("hidup lagi")');
  await tryit.getByTestId("run-btn").click();
  await waitDone("#tryit [data-testid=output-panel]");
  expect((await tryit.getByTestId("output-panel").textContent()).includes("hidup lagi"), "runtime tidak pulih");
});

await step("Dashboard memakai data nyata (lesson selesai, kuis, riwayat)", async () => {
  await go("/");
  const t = await page.getByTestId("dashboard").textContent();
  expect(t.includes("Python Syntax"), "riwayat/bookmark tidak tampil");
  expect(/QUIZ ACCURACY\s*\d+%/i.test(t) || t.includes("%"), "akurasi kuis tidak tampil");
  await page.screenshot({ path: `${OUT}/06-dashboard-progress.png`, fullPage: true });
});

await step("Error Notebook mencatat kesalahan & Retry tersedia", async () => {
  await go("/practice/errors");
  await page.getByTestId("error-notebook").waitFor();
  const t = await page.getByTestId("error-notebook").textContent();
  expect(t.includes("Retry Mistakes") || t.includes("Sudah dikuasai"), "error notebook kosong");
  await page.screenshot({ path: `${OUT}/07-error-notebook.png`, fullPage: true });
});

await step("Flashcard: flip & rating menjadwalkan ulang", async () => {
  await go("/practice/flashcards");
  await page.getByTestId("flashcard").waitFor();
  await page.getByTestId("flip-btn").click();
  await page.getByTestId("rate-good").click();
  await page.screenshot({ path: `${OUT}/08-flashcards.png` });
});

await step("Playground: NumPy/Pandas/Matplotlib menghasilkan grafik", async () => {
  await go("/playground");
  await page.getByTestId("run-btn").click();
  await page.getByTestId("figure").first().waitFor({ timeout: 180000 });
  const out = await page.getByTestId("output-panel").textContent();
  expect(out.includes("Ukuran data: (30, 5)"), `output playground: ${out.slice(0, 200)}`);
  await page.screenshot({ path: `${OUT}/09-playground.png`, fullPage: true });
});

await step("Seaborn & scikit-learn berjalan di browser", async () => {
  await page.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText(
    'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\nfrom sklearn.linear_model import LogisticRegression\ndf = pd.read_csv("iris.csv")\nm = LogisticRegression(max_iter=500).fit(df.drop(columns="species"), df["species"])\nprint("sklearn ok", round(m.score(df.drop(columns="species"), df["species"]), 2))\nsns.boxplot(data=df, x="species", y="petal_length")\nplt.show()',
  );
  await page.getByTestId("run-btn").click();
  await page.waitForFunction(() => /sklearn ok/.test(document.querySelector("[data-testid=output-panel]").textContent) && document.querySelectorAll("[data-testid=figure]").length > 0, null, { timeout: 240000 });
});

await step("Upload CSV ke Playground dan dibaca pandas", async () => {
  await page.getByTestId("upload-input").setInputFiles({ name: "upload_test.csv", mimeType: "text/csv", buffer: Buffer.from("a,b\n1,2\n3,4\n") });
  await page.getByText("✓ upload_test.csv tersedia").waitFor({ timeout: 60000 });
  await page.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText('import pandas as pd\nprint(pd.read_csv("upload_test.csv")["b"].sum())');
  await page.getByTestId("run-btn").click();
  await page.waitForFunction(() => document.querySelector("[data-testid=stdout]")?.textContent.trim() === "6", null, { timeout: 60000 });
});

await step("Ujian diagnostik (Exam Mode) selesai dengan nilai & pembahasan", async () => {
  await go("/assessments/diagnostic");
  await page.getByTestId("mode-exam").click();
  await page.getByTestId("start-exam").click();
  await page.getByTestId("exam-runner").waitFor();
  for (let i = 0; i < 5; i++) {
    const choice = page.locator(".exercise-card .choice").first();
    if (await choice.count()) await choice.click();
    else await page.locator(".exercise-card input").fill("x");
    await page.getByTestId("next-question").click();
  }
  page.once("dialog", (d) => d.accept());
  await page.getByTestId("finish-exam").click();
  await page.getByTestId("exam-result").waitFor();
  const t = await page.getByTestId("exam-result").textContent();
  expect(t.includes("/30") && t.includes("Pembahasan"), "hasil ujian tidak lengkap");
  await page.screenshot({ path: `${OUT}/10-exam-result.png` });
});

await step("Coding exam menilai kode dengan test case", async () => {
  await go("/assessments/coding-python");
  await page.getByTestId("mode-practice").click();
  await page.getByTestId("start-exam").click();
  await page.getByTestId("check-btn").waitFor();
  await page.getByTestId("check-btn").click();
  await page.getByTestId("feedback-incorrect").waitFor({ timeout: 120000 });
});

await step("Cheat sheet dapat dicari", async () => {
  await go("/cheatsheets");
  await page.getByTestId("cheat-search").fill("read_csv");
  const n = await page.getByTestId("cheat-item").count();
  expect(n >= 1, "hasil pencarian kosong");
});

await step("Workflow: tahap dapat diklik", async () => {
  await go("/workflow");
  await page.getByTestId("wf-step-6").click();
  const t = await page.getByTestId("wf-detail").textContent();
  expect(t.includes("Data Splitting") && t.includes("stratify"), "detail tahap 6 salah");
  await page.screenshot({ path: `${OUT}/11-workflow.png`, fullPage: true });
});

await step("Visual Lab: KNN & threshold", async () => {
  await go("/visual-lab");
  await page.getByText("KNN neighbors").click();
  await page.getByTestId("viz").waitFor();
  await page.getByText("Threshold, confusion matrix & ROC").click();
  await page.getByTestId("viz").waitFor();
  await page.screenshot({ path: `${OUT}/12-visual-lab.png` });
});

await step("Pencarian global", async () => {
  await go("/search?q=split");
  const t = await page.locator("main").textContent();
  expect(t.includes("Train-Test Split"), "pencarian tidak menemukan materi");
});

await step("Dark mode tersimpan setelah refresh", async () => {
  await go("/learn/py-for-loop");
  const before = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByTestId("theme-toggle").click();
  await page.waitForTimeout(300);
  await page.reload();
  await page.waitForLoadState("networkidle");
  const after = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  expect(after !== before, "tema tidak tersimpan");
  await page.screenshot({ path: `${OUT}/13-dark-lesson.png` });
});

await step("Export progress mengunduh JSON", async () => {
  await go("/settings");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByTestId("export-btn").click()]);
  expect(dl.suggestedFilename().endsWith(".json"), "nama file export salah");
});

await step("Mobile: tanpa scroll horizontal", async () => {
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const p = await m.newPage();
  for (const h of ["/", "/learn/py-list", "/playground", "/assessments", "/practice/flashcards"]) {
    await p.goto(`${BASE}#${h}`);
    await p.waitForLoadState("networkidle");
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow <= 1, `overflow ${overflow}px di ${h}`);
  }
  await p.goto(`${BASE}#/learn/py-list`);
  await p.waitForLoadState("networkidle");
  await p.screenshot({ path: `${OUT}/14-mobile-lesson.png` });
  await m.close();
});

await browser.close();
const failed = results.filter((r) => !r.ok);
const relevantErrors = consoleErrors.filter((e) => !/favicon|fonts\.g/.test(e));
console.log(`\n${results.length - failed.length}/${results.length} langkah lulus.`);
if (relevantErrors.length) console.log("Console errors:\n" + relevantErrors.slice(0, 10).join("\n"));
process.exit(failed.length ? 1 : 0);
