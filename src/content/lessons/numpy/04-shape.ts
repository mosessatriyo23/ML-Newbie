import type { Lesson } from "../../../types.ts";
import { numpyDoc, sklearnDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-array-shape",
  title: "Array Shape",
  minutes: 35,
  prerequisites: ["np-array-dimensions"],
  objectives: [
    "Membaca atribut `shape` sebagai tuple ukuran setiap dimensi.",
    "Membedakan `shape`, `size`, dan `len()`.",
    "Menafsirkan `X.shape` sebagai (jumlah sampel, jumlah fitur).",
    "Memeriksa kecocokan shape sebelum operasi dan pelatihan model.",
  ],
  definition: [
    "**Shape** adalah **tuple** yang berisi ukuran array pada setiap dimensi. Array 2D dengan 150 baris dan 4 kolom memiliki `shape == (150, 4)`.",
    "Atribut terkait:\n- `shape` — tuple ukuran, misalnya `(150, 4)`\n- `size` — jumlah seluruh elemen (150 × 4 = 600)\n- `len(arr)` — ukuran dimensi pertama saja (150)\n- `ndim` — panjang tuple shape (2)",
    "Pada array 1D, shape ditulis `(n,)` — tuple satu elemen dengan koma, seperti yang kamu pelajari di materi Tuple.",
  ],
  why: [
    "`X.shape` adalah hal pertama yang diperiksa data scientist: berapa banyak sampel dan fitur yang dimiliki. Format `(n_samples, n_features)` dipakai di seluruh dokumentasi scikit-learn.",
    "Banyak error berasal dari shape yang tidak cocok — misalnya jumlah baris X dan panjang y berbeda (*Found input variables with inconsistent numbers of samples*).",
  ],
  when: [
    "- Setelah memuat dataset (Pandas `df.shape` bekerja dengan cara yang sama).",
    "- Setelah setiap transformasi (split, encoding, reshape) untuk memastikan ukurannya benar.",
    "- Saat debugging error dimensi.",
  ],
  analogy: "Shape seperti **ukuran rak**: \"5 tingkat × 8 kotak per tingkat\". `size` adalah jumlah kotak seluruhnya (40). `len` hanya menghitung jumlah tingkat (5).",
  syntax: {
    code: `arr.shape          # tuple ukuran, mis. (150, 4)
n_rows, n_cols = X.shape
arr.size           # total elemen
len(arr)           # ukuran dimensi pertama`,
  },
  anatomy: [
    ["shape", "Atribut tuple ukuran per dimensi."],
    ["(n,)", "Shape array 1D panjang n."],
    ["n_samples, n_features = X.shape", "Unpacking tuple shape (materi Tuple)."],
    ["size", "Perkalian semua angka di shape."],
  ],
  examples: [
    {
      title: "Contoh 1 — shape, size, len, ndim",
      code: `import numpy as np

X = np.zeros((150, 4))
print(X.shape)
print(X.size)
print(len(X))
print(X.ndim)`,
      output: "(150, 4)\n600\n150\n2",
      explain: [
        ["print(X.shape)", "150 baris, 4 kolom."],
        ["print(X.size)", "150 × 4 = 600 elemen."],
        ["print(len(X))", "Hanya dimensi pertama (jumlah baris)."],
        ["print(X.ndim)", "Panjang tuple shape = 2."],
      ],
    },
    {
      title: "Contoh 2 — Shape array 1D",
      code: `import numpy as np

y = np.array([0, 1, 1, 0, 1])
print(y.shape)
print(y.shape[0])
print(type(y.shape))`,
      output: "(5,)\n5\n<class 'tuple'>",
      explain: [
        ["print(y.shape)", "`(5,)` — tuple satu elemen; perhatikan koma."],
        ["print(y.shape[0])", "Tuple bisa diakses dengan index."],
        ["print(type(y.shape))", "shape bertipe tuple."],
      ],
      change: "Kita melihat bentuk shape untuk vektor 1D.",
    },
    {
      title: "Contoh 3 — Shape dataset nyata (Iris)",
      code: `import numpy as np
import pandas as pd

df = pd.read_csv("iris.csv")
X = df.drop(columns="species").to_numpy()
y = df["species"].to_numpy()

n_samples, n_features = X.shape
print(f"{n_samples} sampel, {n_features} fitur")
print("y:", y.shape)
print("Cocok:", X.shape[0] == y.shape[0])`,
      output: "150 sampel, 4 fitur\ny: (150,)\nCocok: True",
      explain: [
        ["X = df.drop(columns=\"species\").to_numpy()", "Mengubah tabel fitur Pandas menjadi NumPy array 2D."],
        ["n_samples, n_features = X.shape", "Unpacking shape ke dua variabel bernama jelas."],
        ["X.shape[0] == y.shape[0]", "Jumlah sampel X harus sama dengan panjang y."],
      ],
      change: "Shape dipakai pada data sungguhan untuk memastikan X dan y selaras.",
    },
    {
      title: "Contoh 4 — Shape berubah setelah operasi",
      code: `import numpy as np

X = np.arange(12).reshape(3, 4)
print(X.shape)
print(X.sum(axis=0).shape)
print(X.sum(axis=1).shape)
print(X[:2].shape)
print(X.T.shape)`,
      output: "(3, 4)\n(4,)\n(3,)\n(2, 4)\n(4, 3)",
      explain: [
        ["X = np.arange(12).reshape(3, 4)", "12 angka disusun menjadi 3×4 (reshape dibahas di subbab berikutnya)."],
        ["X.sum(axis=0).shape", "Agregasi axis 0 menghilangkan dimensi baris → (4,)."],
        ["X.sum(axis=1).shape", "Agregasi axis 1 → (3,)."],
        ["X[:2].shape", "Mengambil 2 baris pertama → (2, 4)."],
        ["X.T.shape", "`.T` (transpose) menukar baris dan kolom → (4, 3)."],
      ],
      change: "Memeriksa shape setelah setiap langkah membantu memahami apa yang terjadi pada data.",
    },
  ],
  params: [
    {
      title: "Atribut ukuran array",
      items: [
        { name: "shape", type: "tuple", desc: "Ukuran setiap dimensi." },
        { name: "size", type: "int", desc: "Total elemen." },
        { name: "ndim", type: "int", desc: "Jumlah dimensi." },
        { name: "len(arr)", type: "int", desc: "Ukuran dimensi pertama (sama dengan shape[0])." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\na = np.ones((2, 3, 5))\nprint(a.shape, a.size, len(a))`, output: "(2, 3, 5) 30 2" },
  tryIt: `import numpy as np
import pandas as pd

df = pd.read_csv("breast_cancer.csv")
X = df.drop(columns=["target", "diagnosis"]).to_numpy()
y = df["target"].to_numpy()
print("X:", X.shape, "| y:", y.shape)
print("Total nilai fitur:", X.size)`,
  mistakes: [
    {
      title: "Memanggil shape seperti fungsi",
      wrong: `import numpy as np
print(np.zeros((2, 2)).shape())`,
      error: "TypeError",
      fix: `import numpy as np
print(np.zeros((2, 2)).shape)`,
      explain: "shape adalah atribut tuple, bukan method: *'tuple' object is not callable*.",
    },
    {
      title: "Mengira len() memberi jumlah semua elemen",
      wrong: `import numpy as np
X = np.zeros((10, 3))
print(len(X))   # 10, bukan 30`,
      fix: `import numpy as np
X = np.zeros((10, 3))
print(X.size)`,
      explain: "len hanya menghitung dimensi pertama. Gunakan size untuk total elemen.",
    },
    {
      title: "Jumlah sampel X dan y tidak cocok",
      wrong: `import numpy as np
X = np.zeros((5, 2))
y = np.zeros(4)
print(X + y[:, None])`,
      error: "ValueError",
      fix: `import numpy as np
X = np.zeros((5, 2))
y = np.zeros(5)
print(X.shape[0] == y.shape[0])`,
      explain: "Operasi atau model akan gagal bila jumlah baris tidak sama. Selalu cek shape setelah memotong/memfilter data.",
    },
  ],
  bestPractices: [
    "Cetak `X.shape` dan `y.shape` setiap selesai memuat, membersihkan, atau membagi data.",
    "Gunakan unpacking bernama: `n_samples, n_features = X.shape`.",
    "Bila shape tidak sesuai harapan, periksa langkah terakhir sebelum melanjutkan.",
  ],
  exercises: [
    {
      id: "np-shape-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Unpacking shape",
      prompt: "Lengkapi agar `baris` dan `kolom` berisi ukuran matriks `M`.",
      starter: `import numpy as np
M = np.ones((7, 3))
baris, kolom = M.____
print(baris, kolom)`,
      solution: `import numpy as np
M = np.ones((7, 3))
baris, kolom = M.shape
print(baris, kolom)`,
      tests: [{ desc: "baris = 7, kolom = 3", expr: "(baris, kolom) == (7, 3)" }],
      hints: ["Konsep: atribut ukuran berbentuk tuple.", "Atribut ini juga ada di Pandas DataFrame.", "`M.shape`"],
      explanation: "shape berbentuk tuple (baris, kolom) sehingga bisa di-unpack.",
    },
    {
      id: "np-shape-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.zeros((4, 6))
print(a.shape, a.size, len(a))
print(a.mean(axis=1).shape)`,
      answer: "(4, 6) 24 4\n(4,)",
      hints: ["Konsep: shape, size, len, dan efek axis.", "size = 4 × 6.", "Agregasi axis=1 menyisakan 4 nilai."],
      explanation: "(4, 6) 24 4, lalu (4,) karena rata-rata per baris.",
    },
    {
      id: "np-shape-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Jumlah fitur",
      prompt: "Perbaiki kode agar `n_fitur` berisi jumlah kolom (5), bukan jumlah baris.",
      starter: `import numpy as np
X = np.zeros((100, 5))
n_fitur = len(X)
print(n_fitur)`,
      solution: `import numpy as np
X = np.zeros((100, 5))
n_fitur = X.shape[1]
print(n_fitur)`,
      tests: [{ desc: "n_fitur == 5", expr: "n_fitur == 5" }],
      hints: ["Konsep: len hanya dimensi pertama.", "Jumlah kolom ada di elemen kedua tuple shape.", "`X.shape[1]`"],
      explanation: "shape[0] = sampel, shape[1] = fitur.",
    },
    {
      id: "np-shape-ex4",
      type: "code",
      kind: "dataset",
      level: 4,
      title: "Dataset Challenge — Wine Quality",
      prompt: [
        "Baca `winequality-red.csv` (dataset nyata UCI, pemisah `;`) dengan Pandas, lalu buat `X` (semua kolom kecuali `quality`) dan `y` (kolom `quality`) sebagai NumPy array dengan `.to_numpy()`.",
        "Simpan `n_samples, n_features = X.shape` lalu cetak keduanya.",
      ],
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
X = df.drop(columns="quality").to_numpy()
y = df["quality"].to_numpy()
n_samples, n_features = X.shape
print(n_samples, n_features)`,
      tests: [
        { desc: "X.shape == (1599, 11)", expr: "X.shape == (1599, 11)" },
        { desc: "y.shape == (1599,)", expr: "y.shape == (1599,)" },
        { desc: "n_samples & n_features benar", expr: "(n_samples, n_features) == (1599, 11)" },
      ],
      hints: ["Konsep: shape dataset nyata.", "Ingat `sep=\";\"` untuk file ini.", "`df.drop(columns=\"quality\").to_numpy()`"],
      explanation: "Dataset Wine Quality memiliki 1.599 sampel dan 11 fitur fisikokimia.",
    },
    {
      id: "np-shape-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Laporan ukuran split",
      prompt: [
        "Data `X` berukuran (200, 6). Ambil 80% baris pertama sebagai `X_train` dan sisanya `X_test` dengan slicing (hitung batasnya dari `X.shape[0]`).",
        "Cetak `Train: (160, 6) Test: (40, 6)`.",
      ],
      starter: `import numpy as np
X = np.arange(1200).reshape(200, 6)
# Tulis kodemu di sini
`,
      solution: `import numpy as np
X = np.arange(1200).reshape(200, 6)
batas = int(X.shape[0] * 0.8)
X_train = X[:batas]
X_test = X[batas:]
print("Train:", X_train.shape, "Test:", X_test.shape)`,
      tests: [
        { desc: "X_train.shape == (160, 6)", expr: "X_train.shape == (160, 6)" },
        { desc: "X_test.shape == (40, 6)", expr: "X_test.shape == (40, 6)" },
        { desc: "Batas dihitung dari shape", expr: "'shape' in _code" },
        { desc: "Output sesuai", expr: "_lines == ['Train: (160, 6) Test: (40, 6)']" },
      ],
      hints: ["Konsep: shape[0] dan slicing baris.", "`batas = int(X.shape[0] * 0.8)`", "`X[:batas]` dan `X[batas:]`"],
      explanation: "Selalu periksa shape hasil split. (Split sungguhan juga mengacak data — Module 07.)",
    },
  ],
  quiz: [
    { id: "np-shape-q1", type: "mcq", prompt: "Pada `X.shape == (569, 30)`, angka 30 menyatakan…", options: ["Jumlah sampel", "Jumlah fitur", "Jumlah kelas", "Jumlah dimensi"], answer: 1, explanation: "Format (n_samples, n_features)." },
    { id: "np-shape-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.array([1, 2, 3, 4]).shape)`, options: ["(4)", "(4,)", "(1, 4)", "4"], answer: 1, explanation: "Array 1D panjang 4 → (4,)." },
    { id: "np-shape-q3", type: "tf", prompt: "Untuk array berukuran (10, 3), `len(arr)` bernilai 30.", answer: false, explanation: "len = 10 (dimensi pertama); size = 30." },
    { id: "np-shape-q4", type: "fill", prompt: "Atribut untuk jumlah seluruh elemen array adalah `arr.____`", answer: ["size"], explanation: "`arr.size`." },
    { id: "np-shape-q5", type: "case", prompt: "`model.fit(X, y)` error: *inconsistent numbers of samples: [100, 98]*. Langkah pertama?", options: ["Ganti algoritma", "Cek X.shape dan y.shape; kemungkinan baris hilang di salah satunya setelah pembersihan data", "Tambah fitur", "Naikkan max_iter"], answer: 1, explanation: "Jumlah baris X dan y harus sama." },
  ],
  challenge: {
    id: "np-shape-challenge",
    type: "code",
    kind: "dataset",
    level: 5,
    title: "Mini Challenge — Profil ukuran beberapa dataset",
    prompt: [
      "Untuk tiga dataset nyata — `iris.csv`, `heart_disease.csv`, `wholesale_customers.csv` — baca dengan Pandas, ubah ke NumPy dengan `.to_numpy()`, lalu simpan hasilnya ke dictionary `ukuran = {nama_file: shape}`.",
      "Cetak setiap baris dalam format `iris.csv: 150 baris x 5 kolom` (urutan seperti di atas).",
    ],
    starter: `import pandas as pd
files = ["iris.csv", "heart_disease.csv", "wholesale_customers.csv"]
ukuran = {}
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
files = ["iris.csv", "heart_disease.csv", "wholesale_customers.csv"]
ukuran = {}
for f in files:
    arr = pd.read_csv(f).to_numpy()
    ukuran[f] = arr.shape
for f, (r, c) in ukuran.items():
    print(f"{f}: {r} baris x {c} kolom")`,
    tests: [
      { desc: "ukuran iris (150, 5)", expr: "ukuran.get('iris.csv') == (150, 5)" },
      { desc: "ukuran heart (303, 14)", expr: "ukuran.get('heart_disease.csv') == (303, 14)" },
      { desc: "ukuran wholesale (440, 8)", expr: "ukuran.get('wholesale_customers.csv') == (440, 8)" },
      { desc: "Output 3 baris sesuai", expr: "_lines == ['iris.csv: 150 baris x 5 kolom', 'heart_disease.csv: 303 baris x 14 kolom', 'wholesale_customers.csv: 440 baris x 8 kolom']" },
    ],
    hints: ["Konsep: shape pada beberapa dataset.", "Loop file, `pd.read_csv(f).to_numpy().shape`.", "Unpacking `(r, c)` saat mencetak."],
    explanation: "Mengenali ukuran dataset di awal membantu memperkirakan waktu training dan memilih metode yang sesuai.",
  },
  summary: [
    "`shape` adalah tuple ukuran setiap dimensi; array 1D ditulis `(n,)`.",
    "`size` = total elemen; `len` = ukuran dimensi pertama; `ndim` = panjang shape.",
    "`X.shape == (n_samples, n_features)` — konvensi scikit-learn.",
    "Agregasi dengan axis mengurangi satu dimensi; `.T` menukar baris dan kolom.",
    "Periksa shape setelah setiap langkah pengolahan data.",
  ],
  cheatsheet: [
    { syntax: "X.shape", desc: "Ukuran (baris, kolom)" },
    { syntax: "n_samples, n_features = X.shape", desc: "Unpacking" },
    { syntax: "X.shape[1]", desc: "Jumlah fitur" },
    { syntax: "X.size", desc: "Total elemen" },
    { syntax: "X.T", desc: "Transpose" },
  ],
  flashcards: [
    { q: "Jumlah fitur matriks X", a: "X.shape[1]" },
    { q: "Simpan jumlah sampel dan fitur dalam dua variabel", a: "n_samples, n_features = X.shape" },
    { q: "Shape array 1D berisi 5 elemen", a: "(5,)" },
  ],
  references: [
    numpyDoc("numpy.ndarray.shape", "reference/generated/numpy.ndarray.shape.html"),
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
    sklearnDoc("Glossary — n_samples, n_features", "glossary.html"),
  ],
};
