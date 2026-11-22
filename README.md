# ML Academy — Learn, Code, and Master Machine Learning

Website pembelajaran Python, Data Science, dan Machine Learning interaktif berbahasa Indonesia
(terinspirasi struktur W3Schools). Python **sungguhan** berjalan di browser lewat
[Pyodide](https://pyodide.org) di dalam Web Worker — tidak ada output palsu.

## Status konten (jujur)

| Bagian | Status |
| --- | --- |
| Kurikulum 17 modul / 286 subbab | Ditampilkan lengkap; subbab yang belum dibuat ditandai **belum tersedia** |
| Module 01 — Python Fundamentals (20 subbab) | **Lengkap**: tiap subbab punya 3–5 contoh bertahap, penjelasan baris demi baris, parameter, kesalahan umum, 5 latihan (Level 3–5), 5 kuis, mini challenge, ringkasan, cheat sheet, flashcard, referensi resmi |
| Diagnostic Pre-Test (30 soal), Ujian Module 01 (bank 31 soal, paket A/B/C/acak), Coding Exam Python (8 tugas) | Tersedia |
| Final Assessment, proyek end-to-end | Terkunci sampai modul prasyaratnya tersedia |
| Workflow ML (16 tahap), Cheat Sheet (13 kategori, 85 contoh teruji), Visual Lab (9 visualisasi), Playground | Tersedia |

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # hasil di dist/ (bisa di-host statis, mis. GitHub Pages)
```

Python runtime diunduh dari `cdn.jsdelivr.net/pyodide/v314.0.7/full/` saat tombol Run pertama ditekan
(Python 3.14, NumPy 2.4, pandas 3.0, scikit-learn 1.8, Matplotlib 3.10). Wheel seaborn 0.13.2
di-host sendiri di `public/wheels/`.

## Quality assurance

```bash
# 1000+ pemeriksaan: setiap contoh dijalankan di Pyodide dan output-nya harus SAMA PERSIS dengan materi,
# setiap "kesalahan umum" harus benar-benar menghasilkan error yang disebut, starter latihan harus gagal,
# solusi & solusi alternatif harus lulus test case, opsi "predict the output" harus cocok dengan output nyata.
NODE_USE_ENV_PROXY=1 npm run test:content

# Semua URL referensi (termasuk #anchor) diperiksa benar-benar ada.
NODE_USE_ENV_PROXY=1 npm run test:links

# End-to-end di Chromium (28 skenario): run Python, Stop infinite loop, penilaian latihan,
# solusi alternatif, kuis, persistensi setelah refresh, dark mode, ujian, upload CSV, mobile.
npm run build && npx vite preview --port 4173 &
npm run test:e2e
```

Output cheat sheet & workflow dihasilkan dari eksekusi nyata: `node --experimental-strip-types scripts/gen-outputs.ts`.

## Arsitektur

```
src/curriculum/      struktur 17 modul (status "tersedia" otomatis dari keberadaan konten)
src/content/         materi (lessons/), ujian (exams/), cheat sheet, workflow, proyek, dataset
src/runtime/         Pyodide Web Worker + harness Python (penilaian berbasis test case)
src/engine/          progres (localStorage), penilaian, spaced repetition, analitik dashboard
src/components/      editor CodeMirror, runner, latihan, kuis, layout
src/pages/           Dashboard, Learn, Workflow, Practice, Playground, Projects, Assessments, ...
src/viz/             visualisasi interaktif (dihitung langsung di browser)
scripts/             test konten, cek link, E2E, generator dataset & output
```

Menambah lesson baru: buat file di `src/content/lessons/<modul>/`, daftarkan di `index.ts`, lalu jalankan
`npm run test:content` — lesson otomatis berstatus tersedia.

## Dataset

Asli (CC BY 4.0, UCI Machine Learning Repository, salinan dari scikit-learn): Iris, Breast Cancer Wisconsin (Diagnostic).
Sintetis (dibuat `scripts/generate_datasets.py`, seed 42): Student Scores, Customer Churn, House Prices, Customer Segmentation.
