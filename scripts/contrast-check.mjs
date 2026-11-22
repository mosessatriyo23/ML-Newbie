// Memindai kontras teks (rasio WCAG) di halaman-halaman utama pada tema terang dan gelap.
// Standar WCAG AA: minimal 4.5:1 untuk teks normal, 3:1 untuk teks besar.
// Jalankan: npm run build && (npx vite preview --port 4173 &) && node scripts/contrast-check.mjs
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const BASE = process.env.BASE_URL ?? "http://localhost:4173/";
const PAGES = ["/", "/learn", "/learn/py-python-syntax", "/learn/py-list", "/learn/np-creating-arrays", "/workflow", "/practice/flashcards", "/practice/errors", "/practice/exercises", "/playground", "/projects", "/assessments", "/assessments/diagnostic", "/cheatsheets", "/visual-lab", "/settings", "/search?q=list"];

const browser = await chromium.launch();
let problems = 0;
for (const theme of ["light", "dark"]) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  await ctx.addInitScript((t) => localStorage.setItem("mlacademy:v1", JSON.stringify({ version: 1, completedLessons: {}, prefs: { theme: t } })), theme);
  const page = await ctx.newPage();
  for (const h of PAGES) {
    await page.goto(`${BASE}#${h}`);
    await page.waitForLoadState("networkidle");
    // buka semua <details> agar isinya ikut diperiksa
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const bad = await page.evaluate(() => {
      const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p[3] ?? 1 }; };
      const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
      const blend = (top, bot) => ({ r: top.r * top.a + bot.r * (1 - top.a), g: top.g * top.a + bot.g * (1 - top.a), b: top.b * top.a + bot.b * (1 - top.a), a: 1 });
      const bgOf = (el) => {
        const layers = [];
        for (let e = el; e; e = e.parentElement) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0) { layers.push(c); if (c.a >= 1) break; } }
        let acc = { r: 255, g: 255, b: 255, a: 1 };
        for (let i = layers.length - 1; i >= 0; i--) acc = blend(layers[i], acc);
        return acc;
      };
      const out = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      while (walker.nextNode()) {
        const t = walker.currentNode; const el = t.parentElement;
        if (!el || seen.has(el) || !t.textContent.trim()) continue;
        seen.add(el);
        const s = getComputedStyle(el);
        if (s.visibility === "hidden" || s.display === "none" || el.closest("svg, [disabled], .cm-editor, option")) continue;
        const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
        let op = 1; for (let e = el; e; e = e.parentElement) op *= Number(getComputedStyle(e).opacity);
        if (op < 0.9) continue;
        const fg = parse(s.color); if (!fg) continue;
        const bg = bgOf(el); const f = blend(fg, bg);
        const L1 = lum(f), L2 = lum(bg); const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        const size = parseFloat(s.fontSize); const bold = Number(s.fontWeight) >= 700;
        const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
        if (ratio < need) out.push(`${ratio.toFixed(2)} "${t.textContent.trim().slice(0, 50)}" <${el.tagName.toLowerCase()} class="${String(el.className).slice(0, 70)}">`);
      }
      return out;
    });
    if (bad.length) { problems += bad.length; console.log(`\n[${theme}] ${h}\n  ` + bad.slice(0, 8).join("\n  ") + (bad.length > 8 ? `\n  … +${bad.length - 8}` : "")); }
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${problems} elemen teks di bawah standar kontras WCAG AA.`);
process.exit(problems ? 1 : 0);
