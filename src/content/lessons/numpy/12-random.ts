import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-random-numbers",
  title: "Random Numbers",
  minutes: 40,
  prerequisites: ["np-creating-arrays", "np-mean-median-and-standard-deviation"],
  visual: "normal",
  objectives: [
    "Membuat generator acak modern dengan `np.random.default_rng(seed)`.",
    "Menghasilkan bilangan acak: `random`, `integers`, `normal`, `uniform`.",
    "Mengacak dan mengambil sampel dengan `permutation`, `shuffle`, `choice`.",
    "Memahami peran **seed** untuk hasil yang dapat direproduksi (reproducibility).",
  ],
  definition: [
    "Komputer menghasilkan bilangan **pseudo-random**: deret yang terlihat acak, tetapi sebenarnya dihitung dari sebuah nilai awal bernama **seed**. Seed yang sama → deret yang sama persis.",
    "Cara yang direkomendasikan dokumentasi NumPy saat ini adalah membuat objek **Generator**: `rng = np.random.default_rng(42)`, lalu memanggil method-nya (`rng.integers`, `rng.normal`, …). Fungsi lama seperti `np.random.seed()` dan `np.random.rand()` masih ada (legacy), tetapi tidak disarankan untuk kode baru.",
    "Method penting:\n- `rng.random(n)` — float seragam di [0, 1)\n- `rng.integers(low, high, size)` — bilangan bulat di [low, high)\n- `rng.normal(loc, scale, size)` — distribusi normal dengan mean `loc` dan std `scale`\n- `rng.uniform(low, high, size)` — float seragam di [low, high)\n- `rng.choice(a, size, replace)` — ambil sampel dari array\n- `rng.permutation(a)` — salinan teracak; `rng.shuffle(a)` — mengacak di tempat (in-place)",
  ],
  why: [
    "Keacakan ada di mana-mana dalam ML: train-test split mengacak data, Random Forest mengambil sampel acak, K-Means memilih titik awal acak, neural network menginisialisasi bobot acak.",
    "Tanpa seed, setiap kali kode dijalankan hasilnya berbeda — sulit di-debug dan dibandingkan. Dengan seed (`random_state=42` di scikit-learn), eksperimen bisa diulang persis oleh rekan tim.",
    "Bilangan acak juga dipakai untuk membuat **data simulasi** guna memahami konsep (misalnya melihat bentuk distribusi normal).",
  ],
  when: [
    "- Membuat data sintetis untuk latihan atau pengujian.",
    "- Mengacak urutan data sebelum split (pada data non-time-series).",
    "- Mengambil sampel acak dari dataset besar.",
    "- Simulasi (bootstrap, Monte Carlo).",
  ],
  analogy: "Seed seperti **nomor halaman di buku tabel angka acak**. Siapa pun yang membuka halaman 42 akan membaca deret angka yang sama. Angkanya tampak acak, tetapi selalu bisa diulang jika halamannya sama.",
  syntax: {
    code: `rng = np.random.default_rng(42)
rng.random(3)                    # [0, 1)
rng.integers(1, 7, size=5)       # dadu: 1..6
rng.normal(loc=0, scale=1, size=1000)
rng.choice(arr, size=3, replace=False)
rng.permutation(arr)`,
  },
  anatomy: [
    ["default_rng(42)", "Generator dengan seed 42 — hasil dapat diulang."],
    ["integers(1, 7)", "Batas atas eksklusif: menghasilkan 1 sampai 6."],
    ["normal(loc, scale, size)", "loc = mean, scale = standar deviasi."],
    ["replace=False", "Tanpa pengembalian: setiap elemen hanya bisa terpilih sekali."],
  ],
  examples: [
    {
      title: "Contoh 1 — Seed membuat hasil dapat diulang",
      code: `import numpy as np

rng1 = np.random.default_rng(42)
rng2 = np.random.default_rng(42)
rng3 = np.random.default_rng(7)
print(rng1.integers(1, 7, size=5))
print(rng2.integers(1, 7, size=5))
print(rng3.integers(1, 7, size=5))`,
      output: "[1 5 4 3 3]\n[1 5 4 3 3]\n[6 4 5 6 4]",
      explain: [
        ["np.random.default_rng(42)", "Dua generator dengan seed sama …"],
        ["rng2.integers(1, 7, size=5)", "… menghasilkan deret yang identik."],
        ["np.random.default_rng(7)", "Seed berbeda → deret berbeda."],
      ],
    },
    {
      title: "Contoh 2 — Berbagai distribusi",
      code: `import numpy as np

rng = np.random.default_rng(0)
print(rng.random(3).round(3))
print(rng.uniform(10, 20, size=3).round(2))
tinggi = rng.normal(loc=165, scale=8, size=10_000)
print("Mean:", tinggi.mean().round(2), "Std:", tinggi.std().round(2))
print("Dalam ±1 std:", ((tinggi > 157) & (tinggi < 173)).mean().round(3))`,
      output: "[0.637 0.27  0.041]\n[10.17 18.13 19.13]\nMean: 165.05 Std: 7.99\nDalam ±1 std: 0.682",
      explain: [
        ["rng.random(3)", "Float seragam antara 0 dan 1."],
        ["rng.uniform(10, 20, size=3)", "Float seragam antara 10 dan 20."],
        ["rng.normal(loc=165, scale=8, size=10_000)", "10.000 tinggi badan simulasi dengan mean 165 dan std 8."],
        ["((tinggi > 157) & (tinggi < 173)).mean()", "Sekitar 68% data berada dalam ±1 std — aturan empiris distribusi normal."],
      ],
      change: "Selain bilangan bulat, kita membuat data kontinu dan memverifikasi sifat distribusi normal.",
    },
    {
      title: "Contoh 3 — Sampling dan mengacak",
      code: `import numpy as np

rng = np.random.default_rng(1)
siswa = np.array(["Ani", "Budi", "Citra", "Dodi", "Eka", "Fajar"])
print(rng.choice(siswa, size=3, replace=False))
print(rng.permutation(siswa))
print(siswa)                      # asli tidak berubah

idx = rng.permutation(len(siswa))
print(idx)`,
      output: "['Citra' 'Budi' 'Eka']\n['Fajar' 'Eka' 'Dodi' 'Ani' 'Budi' 'Citra']\n['Ani' 'Budi' 'Citra' 'Dodi' 'Eka' 'Fajar']\n[1 5 0 2 3 4]",
      explain: [
        ["rng.choice(siswa, size=3, replace=False)", "Pilih 3 siswa berbeda secara acak."],
        ["rng.permutation(siswa)", "Mengembalikan salinan teracak; array asli tetap."],
        ["rng.permutation(len(siswa))", "Mengacak index 0..5 — cara umum mengacak baris X dan y dengan urutan yang sama."],
      ],
      change: "Bukan membuat angka baru, tetapi mengacak dan mengambil sampel dari data yang sudah ada.",
    },
    {
      title: "Contoh 4 — Split train/test manual dengan permutasi",
      code: `import numpy as np
import pandas as pd

df = pd.read_csv("iris.csv")
X = df.drop(columns="species").to_numpy()
y = df["species"].to_numpy()

rng = np.random.default_rng(42)
idx = rng.permutation(len(X))
n_train = int(0.8 * len(X))
train_idx, test_idx = idx[:n_train], idx[n_train:]
X_train, X_test = X[train_idx], X[test_idx]
y_train, y_test = y[train_idx], y[test_idx]
print(X_train.shape, X_test.shape)
print(pd.Series(y_test).value_counts().to_dict())`,
      output: "(120, 4) (30, 4)\n{'setosa': 13, 'virginica': 11, 'versicolor': 6}",
      explain: [
        ["idx = rng.permutation(len(X))", "Urutan baris yang teracak."],
        ["train_idx, test_idx = idx[:n_train], idx[n_train:]", "80% pertama untuk train, sisanya test."],
        ["X[train_idx]", "Fancy indexing dengan array index: X dan y diambil dengan urutan yang sama sehingga pasangannya tetap cocok."],
        ["pd.Series(y_test).value_counts()", "Jumlah per kelas di test tidak persis seimbang — alasan adanya `stratify` di scikit-learn."],
      ],
      change: "Inilah yang dilakukan `train_test_split` di balik layar.",
    },
  ],
  params: [
    {
      title: "Method Generator",
      items: [
        { name: "default_rng(seed=None)", desc: "Membuat generator; seed integer untuk reproducibility." },
        { name: "integers(low, high=None, size=None, endpoint=False)", desc: "Bilangan bulat; high eksklusif kecuali endpoint=True." },
        { name: "normal(loc=0.0, scale=1.0, size=None)", desc: "Distribusi normal." },
        { name: "uniform(low=0.0, high=1.0, size=None)", desc: "Seragam kontinu." },
        { name: "choice(a, size=None, replace=True, p=None)", desc: "Sampel; p = probabilitas setiap elemen." },
        { name: "permutation(x), shuffle(x)", desc: "Salinan teracak vs acak in-place." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nrng = np.random.default_rng(123)\nprint(rng.integers(0, 10, size=4), round(rng.random(), 3))`, output: "[0 6 5 0] 0.22" },
  tryIt: `import numpy as np

rng = np.random.default_rng(2024)
dadu = rng.integers(1, 7, size=6000)
# Setiap angka seharusnya muncul sekitar 1000 kali
nilai, jumlah = np.unique(dadu, return_counts=True)
print(dict(zip(nilai.tolist(), jumlah.tolist())))
# Coba ganti seed atau size`,
  mistakes: [
    {
      title: "Batas atas integers dianggap inklusif",
      wrong: `import numpy as np
rng = np.random.default_rng(0)
dadu = rng.integers(1, 6, size=1000)
print(dadu.max())   # tidak pernah 6`,
      fix: `import numpy as np
rng = np.random.default_rng(0)
dadu = rng.integers(1, 7, size=1000)
print(dadu.max())`,
      explain: "`high` eksklusif (seperti `range`). Untuk dadu 1–6 gunakan `integers(1, 7)` atau `endpoint=True`.",
    },
    {
      title: "Membuat generator baru di dalam loop",
      wrong: `import numpy as np
for i in range(3):
    rng = np.random.default_rng(42)
    print(rng.integers(0, 100))   # angka sama terus`,
      fix: `import numpy as np
rng = np.random.default_rng(42)
for i in range(3):
    print(rng.integers(0, 100))`,
      explain: "Buat generator **sekali** di awal, lalu pakai berulang kali.",
    },
    {
      title: "Sampel tanpa pengembalian lebih besar dari populasi",
      wrong: `import numpy as np
rng = np.random.default_rng(0)
print(rng.choice([1, 2, 3], size=5, replace=False))`,
      error: "ValueError",
      fix: `import numpy as np
rng = np.random.default_rng(0)
print(rng.choice([1, 2, 3], size=3, replace=False))`,
      explain: "Tanpa pengembalian, jumlah sampel tidak boleh melebihi jumlah elemen.",
    },
  ],
  bestPractices: [
    "Gunakan `np.random.default_rng(seed)`, bukan fungsi legacy `np.random.seed`/`np.random.rand` untuk kode baru.",
    "Tetapkan seed di awal notebook dan catat nilainya; gunakan juga `random_state` yang sama di scikit-learn.",
    "Jangan mengacak data time series sebelum split — urutan waktu harus dijaga (Module 07).",
    "Uji model dengan beberapa seed untuk melihat apakah hasilnya stabil, bukan kebetulan.",
  ],
  exercises: [
    {
      id: "np-rand-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Generator dengan seed",
      prompt: "Lengkapi agar `rng` adalah generator dengan seed 42.",
      starter: `import numpy as np
rng = np.random.____(42)
print(rng.integers(0, 10, size=3))`,
      solution: `import numpy as np
rng = np.random.default_rng(42)
print(rng.integers(0, 10, size=3))`,
      tests: [
        { desc: "rng adalah Generator", expr: "type(rng).__name__ == 'Generator'" },
        { desc: "Output sama dengan seed 42", expr: "_lines == [str(__import__('numpy').random.default_rng(42).integers(0, 10, size=3))]" },
      ],
      hints: ["Konsep: cara modern membuat generator.", "Nama fungsinya \"default random number generator\".", "`np.random.default_rng(42)`"],
      explanation: "`default_rng` adalah titik awal yang direkomendasikan dokumentasi NumPy.",
    },
    {
      id: "np-rand-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tanpa menjalankan, tebak: apakah kedua baris sama? Tulis output kodenya (True/False dan nilai min/max).",
      code: `import numpy as np
a = np.random.default_rng(5).integers(0, 3, size=1000)
b = np.random.default_rng(5).integers(0, 3, size=1000)
print((a == b).all())
print(a.min(), a.max())`,
      answer: "True\n0 2",
      hints: ["Konsep: seed sama → deret sama.", "Batas atas 3 eksklusif.", "Nilai yang mungkin: 0, 1, 2."],
      explanation: "Deret identik (True); dengan 1000 sampel hampir pasti muncul 0 dan 2 sebagai min/max.",
    },
    {
      id: "np-rand-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Lempar dadu",
      prompt: "Simulasi dadu ini tidak pernah menghasilkan angka 6. Perbaiki agar `dadu` berisi angka 1–6.",
      starter: `import numpy as np
rng = np.random.default_rng(3)
dadu = rng.integers(1, 6, size=600)
print(sorted(set(dadu.tolist())))`,
      solution: `import numpy as np
rng = np.random.default_rng(3)
dadu = rng.integers(1, 7, size=600)
print(sorted(set(dadu.tolist())))`,
      tests: [
        { desc: "Nilai 1 sampai 6 muncul", expr: "sorted(set(dadu.tolist())) == [1, 2, 3, 4, 5, 6]" },
        { desc: "600 lemparan", expr: "dadu.shape == (600,)" },
      ],
      hints: ["Konsep: batas atas eksklusif.", "Seperti range(1, 6) yang berhenti di 5.", "`rng.integers(1, 7, size=600)`"],
      explanation: "Alternatif: `rng.integers(1, 6, size=600, endpoint=True)`.",
    },
    {
      id: "np-rand-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Data simulasi nilai ujian",
      prompt: "Dengan `rng = np.random.default_rng(10)`, buat `nilai` berisi 500 angka dari distribusi normal mean 70, std 10. Batasi ke rentang 0–100 dengan `np.clip`, lalu cetak mean (2 desimal) dan jumlah yang ≥ 85.",
      starter: `import numpy as np
rng = np.random.default_rng(10)
# Tulis kodemu di sini
`,
      solution: `import numpy as np
rng = np.random.default_rng(10)
nilai = np.clip(rng.normal(70, 10, size=500), 0, 100)
print(nilai.mean().round(2), (nilai >= 85).sum())`,
      tests: [
        { desc: "500 nilai", expr: "nilai.shape == (500,)" },
        { desc: "Dalam rentang 0–100", expr: "nilai.min() >= 0 and nilai.max() <= 100" },
        { desc: "Mean mendekati 70", expr: "abs(nilai.mean() - 70) < 1.5" },
        { desc: "Memakai normal dan clip", expr: "'normal' in _code and 'clip' in _code" },
      ],
      hints: ["Konsep: distribusi normal + pembatasan.", "`rng.normal(70, 10, size=500)`", "Bungkus dengan `np.clip(..., 0, 100)`."],
      explanation: "Data simulasi berguna untuk menguji pipeline sebelum data asli tersedia.",
    },
    {
      id: "np-rand-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Sampel acak Heart Disease",
      prompt: [
        "Baca `heart_disease.csv`. Dengan `rng = np.random.default_rng(42)`, ambil `idx` = 50 index baris acak **tanpa pengembalian** (`rng.choice(len(df), size=50, replace=False)`).",
        "Buat `sampel = df.iloc[idx]`, lalu bandingkan proporsi pasien berpenyakit jantung (`num > 0`) di sampel (`p_sampel`) dan di seluruh data (`p_total`). Cetak keduanya dibulatkan 3 desimal.",
      ],
      starter: `import numpy as np
import pandas as pd
df = pd.read_csv("heart_disease.csv")
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.read_csv("heart_disease.csv")
rng = np.random.default_rng(42)
idx = rng.choice(len(df), size=50, replace=False)
sampel = df.iloc[idx]
p_sampel = (sampel["num"] > 0).mean()
p_total = (df["num"] > 0).mean()
print(round(p_sampel, 3), round(p_total, 3))`,
      tests: [
        { desc: "50 index unik", expr: "len(set(idx.tolist())) == 50" },
        { desc: "sampel berisi 50 baris", expr: "len(sampel) == 50" },
        { desc: "p_total sesuai data", expr: "abs(p_total - (df['num'] > 0).mean()) < 1e-12" },
        { desc: "Reproducible dengan seed 42", expr: "sorted(idx.tolist()) == sorted(__import__('numpy').random.default_rng(42).choice(len(df), size=50, replace=False).tolist())" },
      ],
      hints: ["Konsep: sampling tanpa pengembalian.", "`rng.choice(len(df), size=50, replace=False)`", "Proporsi = `(sampel[\"num\"] > 0).mean()`."],
      explanation: "Proporsi di sampel kecil bisa berbeda cukup jauh dari populasi — itulah *sampling variability* yang akan dibahas di Module 05.",
    },
  ],
  quiz: [
    { id: "np-rand-q1", type: "mcq", prompt: "Cara yang direkomendasikan untuk bilangan acak di NumPy modern?", options: ["np.random.seed(42); np.random.rand()", "rng = np.random.default_rng(42)", "import random", "np.rand(42)"], answer: 1, explanation: "Generator dari `default_rng`." },
    { id: "np-rand-q2", type: "predict", prompt: "Nilai apa saja yang mungkin keluar dari kode berikut?", code: `import numpy as np\nrng = np.random.default_rng(0)\nprint(sorted(set(rng.integers(0, 3, size=100).tolist())))`, options: ["[0, 1, 2, 3]", "[0, 1, 2]", "[1, 2, 3]", "[0, 3]"], answer: 1, explanation: "high=3 eksklusif → 0, 1, 2." },
    { id: "np-rand-q3", type: "tf", prompt: "`rng.permutation(arr)` mengubah urutan `arr` aslinya.", answer: false, explanation: "permutation mengembalikan salinan; `shuffle` yang mengubah di tempat." },
    { id: "np-rand-q4", type: "fill", prompt: "Agar sampel tidak berisi elemen berulang, gunakan `replace=____`", answer: ["False"], explanation: "`replace=False`." },
    { id: "np-rand-q5", type: "case", prompt: "Rekan timmu mendapat akurasi berbeda saat menjalankan notebook yang sama. Penyebab paling mungkin?", options: ["Laptopnya lebih lambat", "Tidak ada seed/random_state yang ditetapkan", "Versi Python berbeda nama", "Dataset terlalu kecil"], answer: 1, explanation: "Tanpa seed, split dan inisialisasi acak berbeda setiap kali dijalankan." },
  ],
  challenge: {
    id: "np-rand-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Bootstrap confidence interval",
    prompt: [
      "Bootstrap memperkirakan ketidakpastian sebuah statistik dengan mengambil sampel ulang **dengan pengembalian** berkali-kali.",
      "Dengan `rng = np.random.default_rng(0)`, ulangi 1000 kali: ambil sampel ukuran `len(data)` dari `data` dengan `replace=True` dan simpan mean-nya ke array `boot` (boleh memakai loop atau `rng.choice(data, size=(1000, len(data)))` lalu `.mean(axis=1)`).",
      "Hitung `ci = np.percentile(boot, [2.5, 97.5])` dan cetak dibulatkan 2 desimal.",
    ],
    starter: `import numpy as np
data = np.array([12, 15, 9, 20, 17, 11, 14, 16, 13, 18])
rng = np.random.default_rng(0)
# Tulis kodemu di sini
`,
    solution: `import numpy as np
data = np.array([12, 15, 9, 20, 17, 11, 14, 16, 13, 18])
rng = np.random.default_rng(0)
boot = rng.choice(data, size=(1000, len(data)), replace=True).mean(axis=1)
ci = np.percentile(boot, [2.5, 97.5])
print(ci.round(2))`,
    tests: [
      { desc: "boot berisi 1000 mean", expr: "boot.shape == (1000,)" },
      { desc: "ci berisi 2 nilai berurutan", expr: "len(ci) == 2 and ci[0] < ci[1]" },
      { desc: "Mean asli (14.5) berada di dalam interval", expr: "ci[0] < 14.5 < ci[1]" },
      { desc: "Lebar interval masuk akal", expr: "1 < ci[1] - ci[0] < 6" },
    ],
    hints: ["Konsep: sampling dengan pengembalian berulang.", "`rng.choice(data, size=(1000, len(data)))` membuat 1000 sampel sekaligus.", "Ambil `.mean(axis=1)` lalu `np.percentile`."],
    explanation: "Interval 95% ini menunjukkan rentang mean yang masuk akal. Teknik bootstrap juga dasar Random Forest (bagging).",
  },
  summary: [
    "Pseudo-random: deret ditentukan seed; seed sama → hasil sama.",
    "Gunakan `rng = np.random.default_rng(seed)` dan method-nya.",
    "`integers` (high eksklusif), `random`, `uniform`, `normal`.",
    "`choice` untuk sampel, `permutation` untuk mengacak salinan, `shuffle` in-place.",
    "Keacakan ada di split, Random Forest, K-Means — selalu tetapkan seed untuk reproducibility.",
  ],
  cheatsheet: [
    { syntax: "rng = np.random.default_rng(42)", desc: "Generator" },
    { syntax: "rng.integers(1, 7, size=n)", desc: "Dadu 1–6" },
    { syntax: "rng.normal(mu, sd, size=n)", desc: "Normal" },
    { syntax: "rng.choice(a, k, replace=False)", desc: "Sampel tanpa pengembalian" },
    { syntax: "rng.permutation(len(X))", desc: "Index teracak" },
  ],
  flashcards: [
    { q: "Buat generator acak dengan seed 42", a: "rng = np.random.default_rng(42)" },
    { q: "1000 angka normal mean 0 std 1", a: "rng.normal(0, 1, size=1000)" },
    { q: "Ambil 5 elemen unik secara acak dari arr", a: "rng.choice(arr, size=5, replace=False)" },
  ],
  references: [
    numpyDoc("Random sampling (numpy.random) — Quick start", "reference/random/index.html"),
    numpyDoc("Random Generator", "reference/random/generator.html"),
    numpyDoc("numpy.random.Generator.integers", "reference/random/generated/numpy.random.Generator.integers.html"),
    numpyDoc("numpy.random.Generator.choice", "reference/random/generated/numpy.random.Generator.choice.html"),
  ],
};
