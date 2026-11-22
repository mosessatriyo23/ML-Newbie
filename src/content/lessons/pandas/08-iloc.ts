import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-iloc",
  title: "iloc[]",
  minutes: 35,
  prerequisites: ["pd-loc"],
  objectives: [
    "Memilih baris dan kolom berdasarkan **posisi integer** dengan `df.iloc[baris, kolom]`.",
    "Memakai slice eksklusif, index negatif, dan list posisi.",
    "Membedakan kapan memakai `iloc` dan kapan `loc`.",
    "Memakai `iloc` untuk split berbasis urutan (misalnya data time series).",
  ],
  definition: [
    "`df.iloc[baris, kolom]` (*integer location*) memilih data berdasarkan **posisi** 0, 1, 2, … — sama seperti indexing list dan array NumPy — tanpa memedulikan label index.",
    "Aturan slice mengikuti Python: **akhir eksklusif** (`df.iloc[0:3]` → posisi 0, 1, 2) dan index negatif dihitung dari belakang (`df.iloc[-1]` = baris terakhir).",
    "Input yang diterima: integer, list integer, slice integer, atau array boolean (bukan Series boolean berlabel — gunakan `.to_numpy()` jika perlu).",
    "Perbedaan inti: **`loc` = label (inklusif), `iloc` = posisi (eksklusif)**. Keduanya sama hanya jika index adalah RangeIndex default 0..n−1 — dan bahkan saat itu slice-nya tetap berbeda.",
  ],
  why: [
    "Setelah filtering atau sorting, label index tidak lagi berurutan (misalnya 7, 2, 15, …). `iloc` tetap memberi \"baris ke-n\" yang sebenarnya.",
    "Data time series harus di-split berdasarkan urutan waktu, bukan acak: 80% baris pertama untuk latih, sisanya untuk uji — `df.iloc[:n_train]` dan `df.iloc[n_train:]`.",
  ],
  when: [
    "- Mengambil baris/kolom ke-n tanpa peduli label.",
    "- Split berdasarkan urutan (time series).",
    "- Mengambil n baris teratas setelah sorting.",
    "- Memilih kolom berdasarkan posisi (misalnya kolom terakhir sebagai target).",
  ],
  analogy: "Jika `loc` mencari berdasarkan **nama** di buku telepon, `iloc` mencari berdasarkan **nomor halaman dan nomor baris**: \"halaman 3, baris 5\" — tidak peduli siapa namanya.",
  syntax: {
    code: `df.iloc[0]              # baris pertama
df.iloc[-1]             # baris terakhir
df.iloc[0:5, 0:3]       # 5 baris × 3 kolom pertama
df.iloc[[0, 2], [1, 3]]
df.iloc[:, -1]          # kolom terakhir`,
  },
  anatomy: [
    ["iloc[0:5]", "Posisi 0–4 (5 tidak ikut)."],
    ["iloc[-3:]", "Tiga baris terakhir."],
    ["iloc[:, -1]", "Semua baris, kolom terakhir."],
    ["iloc[[0, 2]]", "List posisi."],
  ],
  examples: [
    {
      title: "Contoh 1 — Posisi baris dan kolom",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df.iloc[0, 0], df.iloc[0, -1])
print(df.iloc[0:3, 1:3])
print(df.iloc[[0, 5, -1], [0, 4]])`,
      output: "S001 96\n   hours_studied  attendance\n0            8.0          97\n1            4.9          90\n2            8.7          75\n   student_id  final_score\n0        S001           96\n5        S006          100\n29       S030           91",
      explain: [
        ["df.iloc[0, 0], df.iloc[0, -1]", "Sel baris pertama, kolom pertama dan terakhir."],
        ["df.iloc[0:3, 1:3]", "Baris 0–2, kolom posisi 1–2 (hours_studied, attendance)."],
        ["df.iloc[[0, 5, -1], [0, 4]]", "List posisi untuk baris dan kolom."],
      ],
    },
    {
      title: "Contoh 2 — Setelah sorting: loc vs iloc",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
urut = df.sort_values("final_score", ascending=False)
print(urut.index[:3].tolist())          # label tidak berurutan
print(urut.iloc[0]["student_id"], urut.iloc[0]["final_score"])   # peringkat 1
print(urut.loc[0]["student_id"])        # label 0 = S001, bukan peringkat 1
print(urut.iloc[:3][["student_id", "final_score"]])`,
      output: "[5, 6, 7]\nS006 100\nS001\n  student_id  final_score\n5       S006          100\n6       S007          100\n7       S008          100",
      explain: [
        ["urut = df.sort_values(\"final_score\", ascending=False)", "Urutkan dari nilai tertinggi; label index ikut berpindah."],
        ["urut.iloc[0]", "Posisi pertama = siswa peringkat 1."],
        ["urut.loc[0]", "Label 0 = siswa S001, apa pun peringkatnya."],
        ["urut.iloc[:3]", "Tiga teratas berdasarkan posisi."],
      ],
      change: "Index tidak lagi berurutan, sehingga loc dan iloc memberi hasil berbeda.",
    },
    {
      title: "Contoh 3 — Kolom terakhir sebagai target",
      code: `import pandas as pd

df = pd.read_csv("winequality-red.csv", sep=";")
X = df.iloc[:, :-1]
y = df.iloc[:, -1]
print(X.shape, y.name)
print(X.columns[-3:].tolist())`,
      output: "(1599, 11) quality\n['pH', 'sulphates', 'alcohol']",
      explain: [
        ["X = df.iloc[:, :-1]", "Semua kolom kecuali yang terakhir."],
        ["y = df.iloc[:, -1]", "Kolom terakhir (quality) sebagai target."],
      ],
      change: "iloc dipakai pada kolom, bukan baris.",
    },
    {
      title: "Contoh 4 — Split time series berdasarkan urutan",
      code: `import numpy as np
import pandas as pd

tanggal = pd.date_range("2025-01-01", periods=10, freq="D")
df = pd.DataFrame({"tanggal": tanggal, "pm25": np.arange(30, 40)})
n_train = int(len(df) * 0.8)
train = df.iloc[:n_train]
test = df.iloc[n_train:]
print(train["tanggal"].min().date(), "s.d.", train["tanggal"].max().date(), len(train))
print(test["tanggal"].min().date(), "s.d.", test["tanggal"].max().date(), len(test))`,
      output: "2025-01-01 s.d. 2025-01-08 8\n2025-01-09 s.d. 2025-01-10 2",
      explain: [
        ["pd.date_range(\"2025-01-01\", periods=10, freq=\"D\")", "10 tanggal berurutan."],
        ["train = df.iloc[:n_train]", "80% data paling awal untuk latih."],
        ["test = df.iloc[n_train:]", "20% data paling akhir untuk uji — model tidak boleh \"melihat masa depan\"."],
      ],
      change: "iloc dipakai untuk split data berdasarkan urutan waktu.",
    },
  ],
  params: [
    {
      title: "loc vs iloc",
      items: [
        { name: "loc", desc: "Label; slice inklusif; menerima Series boolean." },
        { name: "iloc", desc: "Posisi integer; slice eksklusif; menerima array boolean." },
        { name: "df.iat[i, j] / df.at[label, col]", desc: "Versi cepat untuk satu sel." },
        { name: "df.columns.get_loc(nama)", desc: "Posisi sebuah kolom berdasarkan nama." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3, 4], "b": [5, 6, 7, 8]}, index=[10, 20, 30, 40])\nprint(df.iloc[1:3, 1].tolist(), df.loc[20:30, "b"].tolist())`, output: "[6, 7] [6, 7]" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv")
top5 = df.sort_values("price_million", ascending=False).iloc[:5]
print(top5[["house_id", "city", "price_million"]])`,
  mistakes: [
    {
      title: "Memakai nama kolom di iloc",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.iloc[0, "b"])`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.iloc[0, df.columns.get_loc("b")], df.loc[0, "b"])`,
      explain: "iloc hanya menerima posisi. Gunakan loc untuk nama, atau ubah nama ke posisi dengan `get_loc`.",
    },
    {
      title: "Posisi di luar jangkauan",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
print(df.iloc[3])`,
      error: "IndexError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
print(df.iloc[-1])`,
      explain: "3 baris → posisi valid 0, 1, 2. Gunakan -1 untuk baris terakhir.",
    },
    {
      title: "Mengacak data time series sebelum split",
      wrong: `import numpy as np
import pandas as pd
df = pd.DataFrame({"t": range(10), "y": np.arange(10)})
acak = df.sample(frac=1, random_state=0)
train = acak.iloc[:8]
print(sorted(train["t"].tolist()))   # test berisi masa lalu → leakage`,
      fix: `import numpy as np
import pandas as pd
df = pd.DataFrame({"t": range(10), "y": np.arange(10)})
train = df.iloc[:8]
test = df.iloc[8:]
print(train["t"].max() < test["t"].min())`,
      explain: "Untuk forecasting, latih pada masa lalu dan uji pada masa depan. Pengacakan membuat model \"melihat\" masa depan.",
    },
  ],
  bestPractices: [
    "Gunakan `iloc` untuk posisi, `loc` untuk label — jangan mencampur.",
    "Untuk time series: urutkan berdasarkan tanggal (`sort_values`) lalu split dengan `iloc`.",
    "Hindari memilih kolom dengan posisi di kode produksi; nama kolom lebih tahan perubahan.",
    "Gunakan `reset_index(drop=True)` jika ingin label kembali berurutan setelah filter/sort.",
  ],
  exercises: [
    {
      id: "pd-iloc-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Tiga baris terakhir",
      prompt: "Lengkapi agar `akhir` berisi 3 baris terakhir dengan iloc.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.iloc[____]
print(akhir)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.iloc[-3:]
print(akhir)`,
      tests: [{ desc: "3 baris terakhir", expr: "akhir.index.tolist() == [147, 148, 149]" }],
      hints: ["Konsep: index negatif + slice.", "Mulai dari 3 dari belakang sampai akhir.", "`-3:`"],
      explanation: "`iloc[-3:]` = posisi n−3 sampai akhir.",
    },
    {
      id: "pd-iloc-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"x": [5, 1, 4, 2]}, index=["a", "b", "c", "d"])
u = df.sort_values("x")
print(u.index.tolist())
print(u.iloc[0, 0], u.loc["a", "x"])
print(u.iloc[1:3]["x"].tolist())`,
      answer: "['b', 'd', 'c', 'a']\n1 5\n[2, 4]",
      hints: ["Konsep: sorting memindahkan label.", "Urutan naik: 1 (b), 2 (d), 4 (c), 5 (a).", "iloc[1:3] → posisi 1 dan 2."],
      explanation: "['b', 'd', 'c', 'a']; posisi 0 = 1, label a = 5; [2, 4].",
    },
    {
      id: "pd-iloc-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Peringkat teratas",
      prompt: "Setelah sorting, kode mengambil siswa dengan label 0, bukan peringkat pertama. Perbaiki agar `juara` adalah baris dengan final_score tertinggi.",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
urut = df.sort_values("final_score", ascending=False)
juara = urut.loc[0]
print(juara["student_id"])`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
urut = df.sort_values("final_score", ascending=False)
juara = urut.iloc[0]
print(juara["student_id"])`,
      tests: [{ desc: "juara memiliki nilai tertinggi", expr: "juara['final_score'] == df['final_score'].max()" }],
      hints: ["Konsep: label vs posisi setelah sorting.", "Peringkat pertama = posisi 0.", "`urut.iloc[0]`"],
      explanation: "Setelah sorting, gunakan iloc untuk mengambil berdasarkan urutan.",
    },
    {
      id: "pd-iloc-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — X dan y dari posisi kolom",
      prompt: "Dataset `student_scores.csv` memiliki kolom ID di posisi 0 dan target di posisi terakhir. Buat `X` = kolom posisi 1 sampai sebelum terakhir, dan `y` = kolom terakhir, memakai iloc. Cetak nama kolom X dan nama y.",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
X = df.iloc[:, 1:-1]
y = df.iloc[:, -1]
print(X.columns.tolist(), y.name)`,
      tests: [
        { desc: "X kolom fitur", expr: "X.columns.tolist() == ['hours_studied', 'attendance', 'previous_score']" },
        { desc: "y = final_score", expr: "y.name == 'final_score'" },
        { desc: "Memakai iloc", expr: "'iloc' in _code" },
      ],
      hints: ["Konsep: slice kolom dengan posisi.", "Posisi 1 sampai -1 (eksklusif).", "`df.iloc[:, 1:-1]` dan `df.iloc[:, -1]`"],
      explanation: "Slice kolom memakai aturan yang sama seperti slice baris.",
    },
    {
      id: "pd-iloc-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Split berurutan Auto MPG",
      prompt: [
        "Baca `auto_mpg.csv` dan urutkan berdasarkan `model_year` (gunakan `kind=\"stable\"` agar urutan baris setahun tetap). Ambil 80% baris pertama sebagai `train` dan sisanya `test` dengan iloc.",
        "Cetak rentang tahun di train dan test serta rata-rata `mpg` masing-masing (2 desimal) — apakah mobil yang lebih baru lebih irit?",
      ],
      starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
df = df.sort_values("model_year", kind="stable")
n_train = int(len(df) * 0.8)
train = df.iloc[:n_train]
test = df.iloc[n_train:]
print(train["model_year"].min(), train["model_year"].max(), round(train["mpg"].mean(), 2))
print(test["model_year"].min(), test["model_year"].max(), round(test["mpg"].mean(), 2))`,
      tests: [
        { desc: "Jumlah baris benar", expr: "len(train) == int(len(df) * 0.8) and len(train) + len(test) == len(df)" },
        { desc: "Train berisi tahun lebih awal", expr: "train['model_year'].max() <= test['model_year'].min()" },
        { desc: "mpg test lebih tinggi", expr: "test['mpg'].mean() > train['mpg'].mean()" },
      ],
      hints: ["Konsep: sort + iloc untuk split berurutan.", "`df.sort_values(\"model_year\", kind=\"stable\")`", "`df.iloc[:n_train]`, `df.iloc[n_train:]`"],
      explanation: "Mobil tahun lebih baru rata-rata jauh lebih irit. Jika model dilatih pada mobil lama lalu diuji pada mobil baru, terjadi *distribution shift* — fenomena nyata yang perlu diwaspadai saat forecasting.",
    },
  ],
  quiz: [
    { id: "pd-iloc-q1", type: "mcq", prompt: "`df.iloc[2:5]` mengambil posisi…", options: ["2, 3, 4, 5", "2, 3, 4", "3, 4, 5", "Label 2–5"], answer: 1, explanation: "Akhir eksklusif." },
    { id: "pd-iloc-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [7, 8, 9]}, index=[2, 1, 0])\nprint(df.iloc[0, 0], df.loc[0, "a"])`, options: ["7 7", "7 9", "9 9", "9 7"], answer: 1, explanation: "Posisi 0 → 7; label 0 → 9." },
    { id: "pd-iloc-q3", type: "tf", prompt: "`df.iloc[:, -1]` mengambil kolom terakhir.", answer: true, explanation: "-1 = posisi terakhir." },
    { id: "pd-iloc-q4", type: "fill", prompt: "iloc adalah singkatan dari integer ____", answer: ["location"], explanation: "integer location." },
    { id: "pd-iloc-q5", type: "case", prompt: "Kamu memprediksi PM2.5 harian 2026 dari data 2021–2025. Cara split validasi yang benar?", options: ["train_test_split acak", "Urutkan tanggal, train = iloc awal, validasi = iloc akhir (misalnya 2025)", "Ambil sampel acak 20%", "Pakai semua data untuk validasi"], answer: 1, explanation: "Time series harus di-split berdasarkan waktu." },
  ],
  challenge: {
    id: "pd-iloc-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Rolling-origin validation",
    prompt: [
      "Validasi time series yang lebih kuat memakai beberapa *fold* berurutan. Dengan `n = 12` baris data bulanan, buat fungsi `fold_berurutan(df, n_fold, ukuran_val)` yang mengembalikan list tuple `(train, val)`:",
      "fold ke-k (k = 0..n_fold−1): `val` = `ukuran_val` baris yang berakhir di posisi `len(df) - (n_fold - 1 - k) * ukuran_val`; `train` = semua baris sebelum val.",
      "Uji dengan `n_fold=3, ukuran_val=2` dan cetak `(len(train), val['bulan'].tolist())` untuk setiap fold.",
    ],
    starter: `import pandas as pd
df = pd.DataFrame({"bulan": range(1, 13), "y": [5, 6, 7, 6, 8, 9, 10, 9, 11, 12, 13, 12]})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.DataFrame({"bulan": range(1, 13), "y": [5, 6, 7, 6, 8, 9, 10, 9, 11, 12, 13, 12]})

def fold_berurutan(df, n_fold, ukuran_val):
    hasil = []
    for k in range(n_fold):
        akhir = len(df) - (n_fold - 1 - k) * ukuran_val
        mulai = akhir - ukuran_val
        hasil.append((df.iloc[:mulai], df.iloc[mulai:akhir]))
    return hasil

for train, val in fold_berurutan(df, 3, 2):
    print(len(train), val["bulan"].tolist())`,
    tests: [
      { desc: "3 fold", expr: "len(fold_berurutan(df, 3, 2)) == 3" },
      { desc: "Validasi berurutan", expr: "[v['bulan'].tolist() for _, v in fold_berurutan(df, 3, 2)] == [[7, 8], [9, 10], [11, 12]]" },
      { desc: "Train selalu sebelum validasi", expr: "all(t['bulan'].max() < v['bulan'].min() for t, v in fold_berurutan(df, 3, 2))" },
      { desc: "Ukuran train bertambah", expr: "[len(t) for t, _ in fold_berurutan(df, 3, 2)] == [6, 8, 10]" },
    ],
    hints: ["Konsep: split berurutan berulang dengan iloc.", "Hitung posisi akhir setiap fold, lalu mulai = akhir − ukuran_val.", "`df.iloc[:mulai]` dan `df.iloc[mulai:akhir]`"],
    explanation: "Skema ini mirip `TimeSeriesSplit` di scikit-learn: model selalu dilatih pada masa lalu dan divalidasi pada periode berikutnya.",
  },
  summary: [
    "`df.iloc[baris, kolom]` memilih berdasarkan posisi integer.",
    "Slice eksklusif, index negatif dari belakang.",
    "Setelah sort/filter, iloc memberi \"baris ke-n\" sebenarnya; loc memberi label.",
    "Split time series: urutkan, lalu `iloc[:n]` dan `iloc[n:]`.",
  ],
  cheatsheet: [
    { syntax: "df.iloc[0]", desc: "Baris pertama" },
    { syntax: "df.iloc[-5:]", desc: "5 baris terakhir" },
    { syntax: "df.iloc[:, :-1]", desc: "Semua kolom kecuali terakhir" },
    { syntax: "df.iloc[:n], df.iloc[n:]", desc: "Split berurutan" },
    { syntax: "df.reset_index(drop=True)", desc: "Label kembali 0..n−1" },
  ],
  flashcards: [
    { q: "Ambil kolom terakhir dengan posisi", a: "df.iloc[:, -1]" },
    { q: "Perbedaan slice loc dan iloc", a: "loc inklusif (label), iloc eksklusif (posisi)" },
    { q: "Split time series 80/20", a: "n = int(len(df)*0.8); train = df.iloc[:n]; test = df.iloc[n:]" },
  ],
  references: [
    pandasDoc("Indexing and selecting data — Selection by position", "user_guide/indexing.html#selection-by-position"),
    pandasDoc("pandas.DataFrame.iloc", "reference/api/pandas.DataFrame.iloc.html"),
    pandasDoc("pandas.DataFrame.reset_index", "reference/api/pandas.DataFrame.reset_index.html"),
    { source: "Scikit-learn Official Documentation", title: "Cross-validation of time series data (TimeSeriesSplit)", url: "https://scikit-learn.org/stable/modules/cross_validation.html#time-series-split" },
  ],
};
