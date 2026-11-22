import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-boolean-indexing",
  title: "Boolean Indexing",
  minutes: 40,
  prerequisites: ["np-indexing", "np-array-operations"],
  objectives: [
    "Membuat mask boolean dari kondisi dan memakainya untuk memfilter array.",
    "Menggabungkan beberapa kondisi dengan `&`, `|`, dan `~` (dengan tanda kurung).",
    "Mengubah nilai yang memenuhi kondisi melalui assignment dengan mask.",
    "Memakai `np.where` untuk memilih nilai berdasarkan kondisi.",
  ],
  definition: [
    "**Boolean indexing** (disebut juga *masking*) memakai array boolean yang shape-nya sama dengan data untuk memilih elemen: posisi bernilai `True` diambil, posisi `False` dibuang. `arr[arr > 50]` mengembalikan semua elemen yang lebih dari 50.",
    "Kondisi digabung dengan operator **element-wise**: `&` (dan), `|` (atau), `~` (bukan). Setiap kondisi wajib diberi tanda kurung karena `&` dan `|` didahulukan dibanding `>`/`<`: `(a > 10) & (a < 20)`. Kata kunci Python `and`/`or` tidak bisa dipakai untuk array.",
    "Mask juga bisa dipakai di sisi kiri assignment untuk **mengubah** nilai: `arr[arr < 0] = 0`.",
    "`np.where(kondisi, x, y)` membuat array baru: ambil dari `x` jika kondisi True, dari `y` jika False. `np.where(kondisi)` (satu argumen) mengembalikan posisi elemen yang True.",
    "Hasil boolean indexing adalah **salinan** (copy), bukan view.",
  ],
  why: [
    "Filtering adalah operasi paling sering dalam analisis data: pelanggan yang churn, hari dengan AQI tidak sehat, transaksi bernilai besar. Pandas memakai konsep yang sama persis (`df[df[\"umur\"] > 30]`).",
    "Membersihkan data: mengganti nilai tidak valid (negatif, sentinel seperti -999) atau outlier.",
    "Membuat label/fitur baru: `np.where(aqi > 100, \"tidak sehat\", \"sehat\")`.",
  ],
  when: [
    "- Memilih sebagian data berdasarkan kondisi.",
    "- Menghitung statistik untuk sub-kelompok.",
    "- Mengganti nilai yang memenuhi kriteria tertentu.",
    "- Membuat kolom kategori dari nilai numerik.",
  ],
  analogy: "Mask seperti **lembar transparan dengan lubang-lubang** yang diletakkan di atas tabel angka. Hanya angka yang berada di bawah lubang (True) yang terlihat dan diambil.",
  syntax: {
    code: `mask = arr > 50
arr[mask]                       # filter
arr[(arr > 10) & (arr < 20)]    # dan
arr[(arr < 5) | (arr > 95)]     # atau
arr[~mask]                      # kebalikan
arr[arr < 0] = 0                # ubah nilai
np.where(arr > 50, "tinggi", "rendah")`,
  },
  anatomy: [
    ["arr > 50", "Array boolean dengan shape sama seperti arr."],
    ["arr[mask]", "Elemen di posisi True (hasilnya 1D)."],
    ["(…) & (…)", "Kedua kondisi True; tanda kurung wajib."],
    ["~mask", "Membalik True ↔ False."],
    ["np.where(c, x, y)", "Pilih x jika c True, y jika False."],
  ],
  examples: [
    {
      title: "Contoh 1 — Mask dan filter",
      code: `import numpy as np

aqi = np.array([45, 78, 120, 160, 95, 210, 60])
mask = aqi > 100
print(mask)
print(aqi[mask])
print("Rata-rata hari tidak sehat:", aqi[mask].mean())`,
      output: "[False False  True  True False  True False]\n[120 160 210]\nRata-rata hari tidak sehat: 163.33333333333334",
      explain: [
        ["mask = aqi > 100", "Array boolean, satu nilai per hari."],
        ["aqi[mask]", "Hanya AQI yang lebih dari 100."],
        ["aqi[mask].mean()", "Statistik untuk sub-kelompok yang terpilih."],
      ],
    },
    {
      title: "Contoh 2 — Menggabungkan kondisi",
      code: `import numpy as np

umur = np.array([22, 35, 47, 19, 63, 30, 52])
gaji = np.array([4, 9, 15, 3, 12, 7, 20])

dewasa_muda_bergaji = umur[(umur >= 25) & (umur <= 40) & (gaji > 5)]
print(dewasa_muda_bergaji)
print(umur[(umur < 20) | (umur > 60)])
print(umur[~(umur > 30)])`,
      output: "[35 30]\n[19 63]\n[22 19 30]",
      explain: [
        ["(umur >= 25) & (umur <= 40) & (gaji > 5)", "Tiga kondisi; mask dari array lain (gaji) boleh dipakai selama shape-nya sama."],
        ["(umur < 20) | (umur > 60)", "Salah satu kondisi terpenuhi."],
        ["~(umur > 30)", "Kebalikan: umur ≤ 30."],
      ],
      change: "Satu kondisi menjadi beberapa kondisi yang digabung.",
    },
    {
      title: "Contoh 3 — Membersihkan data dengan assignment",
      code: `import numpy as np

suhu = np.array([28.5, -999.0, 30.1, 31.4, -999.0, 29.8])   # -999 = sensor rusak
print("Jumlah tidak valid:", (suhu == -999).sum())

suhu = suhu.copy()
suhu[suhu == -999] = np.nan
print(suhu)
print("Mean valid:", np.nanmean(suhu).round(2))`,
      output: "Jumlah tidak valid: 2\n[28.5  nan 30.1 31.4  nan 29.8]\nMean valid: 29.95",
      explain: [
        ["(suhu == -999).sum()", "Menghitung nilai sentinel."],
        ["suhu[suhu == -999] = np.nan", "Assignment dengan mask: ganti semua -999 menjadi NaN."],
        ["np.nanmean(suhu)", "Mean dihitung tanpa nilai yang hilang."],
      ],
      change: "Mask dipakai untuk mengubah data, bukan hanya membaca.",
    },
    {
      title: "Contoh 4 — np.where dan filter pada data nyata",
      code: `import numpy as np
import pandas as pd

df = pd.read_csv("heart_disease.csv")
chol = df["chol"].to_numpy()
sakit = (df["num"] > 0).to_numpy()   # num 1–4 = ada penyakit jantung

kategori = np.where(chol >= 240, "tinggi", "normal")
print(kategori[:6])
print("Kolesterol tinggi:", (kategori == "tinggi").sum(), "pasien")

for k in ["normal", "tinggi"]:
    m = kategori == k
    print(k, "→ proporsi penyakit jantung:", sakit[m].mean().round(3))`,
      output: "['normal' 'tinggi' 'normal' 'tinggi' 'normal' 'normal']\nKolesterol tinggi: 156 pasien\nnormal → proporsi penyakit jantung: 0.401\ntinggi → proporsi penyakit jantung: 0.513",
      explain: [
        ["np.where(chol >= 240, \"tinggi\", \"normal\")", "Membuat fitur kategori dari nilai numerik (240 mg/dL adalah batas kolesterol tinggi yang umum dipakai)."],
        ["m = kategori == k", "Mask untuk setiap kelompok."],
        ["sakit[m].mean()", "Proporsi pasien berpenyakit jantung di setiap kelompok — analisis sederhana hubungan fitur dan target."],
      ],
      change: "Boolean indexing dipakai untuk membandingkan kelompok pada dataset nyata.",
    },
  ],
  params: [
    {
      title: "Operator & fungsi",
      items: [
        { name: "& | ~", desc: "AND, OR, NOT element-wise (beri tanda kurung pada setiap kondisi)." },
        { name: "np.where(condition, x, y)", desc: "Pilih nilai berdasarkan kondisi." },
        { name: "np.where(condition)", desc: "Tuple berisi index posisi True." },
        { name: "np.isin(a, values)", desc: "Mask: apakah elemen ada di daftar values." },
        { name: "mask.any(), mask.all()", desc: "Ada yang True / semua True." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\na = np.array([3, 8, 1, 12, 7])\nprint(a[a > 5], np.where(a > 5, 1, 0))`, output: "[ 8 12  7] [0 1 0 1 1]" },
  tryIt: `import numpy as np

nilai = np.array([55, 78, 91, 62, 84, 45, 70])
print("Lulus (>= 70):", nilai[nilai >= 70])
print("Grade:", np.where(nilai >= 85, "A", np.where(nilai >= 70, "B", "C")))
print("Posisi gagal:", np.where(nilai < 60)[0])`,
  mistakes: [
    {
      title: "Memakai and/or untuk array",
      wrong: `import numpy as np
a = np.array([5, 15, 25])
print(a[(a > 10) and (a < 20)])`,
      error: "ValueError",
      fix: `import numpy as np
a = np.array([5, 15, 25])
print(a[(a > 10) & (a < 20)])`,
      explain: "`and`/`or` meminta satu nilai True/False untuk seluruh array (ambigu). Gunakan `&`/`|`.",
    },
    {
      title: "Lupa tanda kurung",
      wrong: `import numpy as np
a = np.array([5, 15, 25])
print(a[a > 10 & a < 20])`,
      error: "ValueError",
      fix: `import numpy as np
a = np.array([5, 15, 25])
print(a[(a > 10) & (a < 20)])`,
      explain: "`&` dievaluasi lebih dulu: `10 & a` dihitung sebelum perbandingan, menghasilkan ekspresi berantai yang ambigu.",
    },
    {
      title: "Mask dengan panjang berbeda",
      wrong: `import numpy as np
a = np.array([1, 2, 3, 4])
print(a[np.array([True, False])])`,
      error: "IndexError",
      fix: `import numpy as np
a = np.array([1, 2, 3, 4])
print(a[np.array([True, False, True, False])])`,
      explain: "Mask harus memiliki panjang yang sama dengan array yang difilter.",
    },
  ],
  bestPractices: [
    "Simpan mask di variabel bernama jelas (`tidak_sehat = aqi > 100`) agar kode mudah dibaca.",
    "Selalu beri tanda kurung pada setiap kondisi saat memakai `&`/`|`.",
    "Gunakan `mask.sum()` untuk mengecek berapa banyak data yang terpilih sebelum memakainya.",
    "Ganti nilai sentinel (-999, 0 yang tidak masuk akal) dengan NaN agar tidak merusak statistik.",
  ],
  exercises: [
    {
      id: "np-bool-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Dua kondisi",
      prompt: "Lengkapi agar `hasil` berisi nilai antara 10 dan 20 (inklusif).",
      starter: `import numpy as np
a = np.array([5, 10, 14, 20, 27])
hasil = a[(a >= 10) ____ (a <= 20)]
print(hasil)`,
      solution: `import numpy as np
a = np.array([5, 10, 14, 20, 27])
hasil = a[(a >= 10) & (a <= 20)]
print(hasil)`,
      tests: [{ desc: "hasil == [10, 14, 20]", expr: "list(hasil) == [10, 14, 20]" }],
      hints: ["Konsep: menggabungkan kondisi.", "Keduanya harus terpenuhi.", "Operator `&`"],
      explanation: "`&` adalah AND element-wise.",
    },
    {
      id: "np-bool-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([4, -2, 7, -5, 0])
print(a[a < 0])
a[a < 0] = 0
print(a)
print(np.where(a > 3)[0])`,
      answer: "[-2 -5]\n[4 0 7 0 0]\n[0 2]",
      hints: ["Konsep: filter, assignment, posisi True.", "Nilai negatif: -2 dan -5.", "Setelah diganti, nilai > 3 ada di index 0 dan 2."],
      explanation: "Filter → [-2 -5]; setelah assignment → [4 0 7 0 0]; posisi > 3 → [0 2].",
    },
    {
      id: "np-bool-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Filter dua kondisi",
      prompt: "Kode error. Perbaiki agar `rawan` berisi AQI yang lebih dari 150 **atau** kurang dari 0 (data rusak).",
      starter: `import numpy as np
aqi = np.array([80, 160, -5, 120, 300])
rawan = aqi[aqi > 150 or aqi < 0]
print(rawan)`,
      solution: `import numpy as np
aqi = np.array([80, 160, -5, 120, 300])
rawan = aqi[(aqi > 150) | (aqi < 0)]
print(rawan)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "rawan == [160, -5, 300]", expr: "list(rawan) == [160, -5, 300]" },
      ],
      hints: ["Konsep: OR element-wise.", "Ganti `or` dengan operator array.", "`(aqi > 150) | (aqi < 0)`"],
      explanation: "`|` untuk OR, dan setiap kondisi diberi tanda kurung.",
    },
    {
      id: "np-bool-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Kategori AQI",
      prompt: "Buat `label` dari `aqi` dengan aturan: ≤ 50 → \"baik\", 51–100 → \"sedang\", > 100 → \"tidak sehat\". Gunakan `np.where` bersarang atau `np.select`. Cetak `label`.",
      starter: `import numpy as np
aqi = np.array([35, 50, 75, 101, 180])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
aqi = np.array([35, 50, 75, 101, 180])
label = np.where(aqi <= 50, "baik", np.where(aqi <= 100, "sedang", "tidak sehat"))
print(label)`,
      tests: [
        { desc: "label benar", expr: "list(label) == ['baik', 'baik', 'sedang', 'tidak sehat', 'tidak sehat']" },
        { desc: "Memakai np.where atau np.select", expr: "'where' in _code or 'select' in _code" },
      ],
      alternatives: [
        `import numpy as np
aqi = np.array([35, 50, 75, 101, 180])
label = np.select([aqi <= 50, aqi <= 100], ["baik", "sedang"], default="tidak sehat")
print(label)`,
      ],
      hints: ["Konsep: memilih nilai berdasarkan kondisi.", "np.where bisa bersarang: where(c1, a, where(c2, b, c)).", "Cek kondisi terkecil lebih dulu."],
      explanation: "`np.select` lebih rapi jika kategorinya banyak.",
    },
    {
      id: "np-bool-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Segmen nasabah bank marketing",
      prompt: [
        "Baca `bank_marketing.csv`. Ambil kolom `age` dan `y` (\"yes\"/\"no\") sebagai array.",
        "Buat mask `muda = age < 30` dan `senior = age >= 60`. Hitung `rate_muda`, `rate_senior`, dan `rate_lain` = proporsi `y == \"yes\"` pada masing-masing kelompok (lain = bukan muda dan bukan senior). Cetak ketiganya dibulatkan 3 desimal.",
      ],
      starter: `import numpy as np
import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.read_csv("bank_marketing.csv")
age = df["age"].to_numpy()
yes = df["y"].to_numpy() == "yes"
muda = age < 30
senior = age >= 60
rate_muda = yes[muda].mean()
rate_senior = yes[senior].mean()
rate_lain = yes[~muda & ~senior].mean()
print(round(rate_muda, 3), round(rate_senior, 3), round(rate_lain, 3))`,
      tests: [
        { desc: "rate_muda sesuai", expr: "abs(rate_muda - (df.loc[df['age'] < 30, 'y'] == 'yes').mean()) < 1e-12" },
        { desc: "rate_senior sesuai", expr: "abs(rate_senior - (df.loc[df['age'] >= 60, 'y'] == 'yes').mean()) < 1e-12" },
        { desc: "rate_lain sesuai", expr: "abs(rate_lain - (df.loc[(df['age'] >= 30) & (df['age'] < 60), 'y'] == 'yes').mean()) < 1e-12" },
      ],
      hints: ["Konsep: statistik per kelompok dengan mask.", "`yes = df[\"y\"].to_numpy() == \"yes\"` → array boolean.", "Kelompok lain: `~muda & ~senior`."],
      explanation: "Kelompok usia ekstrem cenderung punya tingkat konversi lebih tinggi — insight yang bisa menjadi fitur atau strategi kampanye.",
    },
  ],
  quiz: [
    { id: "np-bool-q1", type: "mcq", prompt: "Ekspresi yang benar untuk memilih elemen a antara 0 dan 10?", options: ["a[a > 0 and a < 10]", "a[(a > 0) & (a < 10)]", "a[a > 0 & a < 10]", "a[(a > 0) and (a < 10)]"], answer: 1, explanation: "`&` dengan tanda kurung." },
    { id: "np-bool-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\na = np.array([1, 2, 3, 4, 5, 6])\nprint(a[a % 2 == 0])`, options: ["[1 3 5]", "[2 4 6]", "[False True False True False True]", "3"], answer: 1, explanation: "Elemen genap." },
    { id: "np-bool-q3", type: "tf", prompt: "Hasil `arr[mask]` adalah view, sehingga mengubahnya mengubah arr.", answer: false, explanation: "Boolean indexing menghasilkan salinan." },
    { id: "np-bool-q4", type: "fill", prompt: "Operator untuk membalik mask boolean: `____mask`", answer: ["~"], explanation: "`~mask`." },
    { id: "np-bool-q5", type: "case", prompt: "Data sensor menyimpan 0 untuk \"tidak terbaca\". Langkah tepat sebelum menghitung mean?", options: ["Biarkan saja", "arr[arr == 0] = np.nan lalu np.nanmean", "Hapus seluruh array", "Ganti 0 dengan 999"], answer: 1, explanation: "Nilai sentinel harus diubah menjadi missing agar statistik tidak bias." },
  ],
  challenge: {
    id: "np-bool-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Deteksi dan tangani outlier (IQR)",
    prompt: [
      "Aturan IQR: nilai dianggap outlier jika < Q1 − 1.5×IQR atau > Q3 + 1.5×IQR, dengan Q1/Q3 = persentil 25/75 dan IQR = Q3 − Q1.",
      "Untuk array `belanja`: hitung `batas_bawah` dan `batas_atas`, buat mask `outlier`, simpan `n_outlier`, lalu buat `belanja_capped` = salinan dengan nilai di luar batas diganti batasnya (gunakan `np.clip` atau assignment dengan mask).",
      "Cetak `n_outlier` dan `belanja_capped.max()`.",
    ],
    starter: `import numpy as np
belanja = np.array([120, 135, 150, 110, 980, 140, 125, 160, 130, 1500, 145])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
belanja = np.array([120, 135, 150, 110, 980, 140, 125, 160, 130, 1500, 145])
q1, q3 = np.percentile(belanja, [25, 75])
iqr = q3 - q1
batas_bawah = q1 - 1.5 * iqr
batas_atas = q3 + 1.5 * iqr
outlier = (belanja < batas_bawah) | (belanja > batas_atas)
n_outlier = outlier.sum()
belanja_capped = np.clip(belanja, batas_bawah, batas_atas)
print(n_outlier, belanja_capped.max())`,
    tests: [
      { desc: "n_outlier == 2", expr: "n_outlier == 2" },
      { desc: "Batas atas benar", expr: "abs(batas_atas - (__import__('numpy').percentile(belanja, 75) + 1.5 * (__import__('numpy').percentile(belanja, 75) - __import__('numpy').percentile(belanja, 25)))) < 1e-9" },
      { desc: "Nilai capped tidak melebihi batas", expr: "belanja_capped.max() <= batas_atas + 1e-9" },
      { desc: "Array asli tidak berubah", expr: "belanja.max() == 1500" },
    ],
    hints: ["Konsep: persentil + mask OR + clip.", "`q1, q3 = np.percentile(belanja, [25, 75])`", "`np.clip(belanja, batas_bawah, batas_atas)` membuat array baru."],
    explanation: "Capping (winsorizing) mempertahankan jumlah data sambil membatasi pengaruh outlier — teknik yang akan dipakai lagi di Module 06 dan 08.",
  },
  summary: [
    "Kondisi pada array menghasilkan mask boolean; `arr[mask]` memfilter.",
    "Gabungkan dengan `&`, `|`, `~` dan beri tanda kurung setiap kondisi.",
    "`arr[mask] = nilai` mengubah elemen yang memenuhi kondisi.",
    "`np.where(c, x, y)` memilih nilai; `np.where(c)` memberi posisi.",
    "Boolean indexing menghasilkan salinan.",
  ],
  cheatsheet: [
    { syntax: "a[a > t]", desc: "Filter" },
    { syntax: "a[(a > x) & (a < y)]", desc: "Rentang" },
    { syntax: "a[mask] = 0", desc: "Ganti nilai" },
    { syntax: "np.where(c, 'ya', 'tidak')", desc: "Label kondisi" },
    { syntax: "np.select(conds, choices, default)", desc: "Banyak kategori" },
  ],
  flashcards: [
    { q: "Filter elemen a yang lebih dari 0 dan kurang dari 10", a: "a[(a > 0) & (a < 10)]" },
    { q: "Ganti semua nilai negatif di a menjadi 0", a: "a[a < 0] = 0" },
    { q: "Label \"tinggi\"/\"rendah\" berdasarkan a > 50", a: "np.where(a > 50, \"tinggi\", \"rendah\")" },
  ],
  references: [
    numpyDoc("Indexing on ndarrays — Boolean array indexing", "user/basics.indexing.html#boolean-array-indexing"),
    numpyDoc("numpy.where", "reference/generated/numpy.where.html"),
    numpyDoc("numpy.select", "reference/generated/numpy.select.html"),
    numpyDoc("numpy.percentile", "reference/generated/numpy.percentile.html"),
  ],
};
