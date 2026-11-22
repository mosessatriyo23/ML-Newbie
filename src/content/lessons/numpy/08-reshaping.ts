import type { Lesson } from "../../../types.ts";
import { numpyDoc, sklearnDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-reshaping-arrays",
  title: "Reshaping Arrays",
  minutes: 35,
  prerequisites: ["np-array-shape"],
  objectives: [
    "Mengubah bentuk array dengan `reshape()` tanpa mengubah isinya.",
    "Memakai `-1` agar NumPy menghitung salah satu ukuran secara otomatis.",
    "Meratakan array menjadi 1D dengan `ravel()`/`flatten()` dan menukar baris-kolom dengan `.T`.",
    "Memperbaiki error *Expected 2D array, got 1D array* dengan `reshape(-1, 1)`.",
    "Menggabungkan array dengan `np.concatenate`, `np.vstack`, dan `np.column_stack`.",
  ],
  definition: [
    "**Reshape** menyusun ulang elemen array ke bentuk (shape) baru. Isi dan urutannya tetap; yang berubah hanya cara pembagiannya ke baris dan kolom. Syaratnya: jumlah elemen harus sama (12 elemen bisa menjadi 3×4, 2×6, atau 12×1, tetapi tidak 5×3).",
    "Angka **-1** pada reshape berarti \"hitung otomatis\". `x.reshape(-1, 1)` menghasilkan satu kolom dengan jumlah baris sebanyak yang dibutuhkan.",
    "Kebalikannya, `ravel()` atau `flatten()` meratakan array berapa pun dimensinya menjadi 1D. Transpose `.T` menukar baris dan kolom.",
    "Untuk menggabungkan array: `np.concatenate` (sepanjang axis tertentu), `np.vstack` (menumpuk sebagai baris), `np.column_stack` (menyusun array 1D sebagai kolom).",
  ],
  why: [
    "scikit-learn mewajibkan X berbentuk 2D. Jika kamu hanya punya satu fitur (misalnya jam belajar), array 1D harus diubah dengan `reshape(-1, 1)` — kalau tidak, muncul error *Expected 2D array, got 1D array instead*.",
    "Menggabungkan kolom fitur baru (`column_stack`) dan meratakan hasil prediksi 2D (`ravel`) adalah langkah rutin dalam pipeline ML.",
  ],
  when: [
    "- Satu fitur 1D akan dimasukkan ke model → `reshape(-1, 1)`.",
    "- Hasil berbentuk (n, 1) perlu menjadi (n,) → `ravel()`.",
    "- Menambah kolom fitur → `np.column_stack`.",
  ],
  analogy: "Reshape seperti **menyusun ulang 12 kursi**: bisa 3 baris × 4 kursi atau 2 baris × 6 kursi — kursinya tetap 12 dan urutannya sama, hanya penataannya yang berubah. `-1` seperti berkata \"saya mau 4 kursi per baris, silakan hitung sendiri jumlah barisnya\".",
  syntax: {
    code: `a.reshape(3, 4)
a.reshape(-1, 1)      # satu kolom
a.ravel()             # rata ke 1D
X.T                   # transpose
np.column_stack([a, b])
np.vstack([a, b])`,
  },
  anatomy: [
    ["reshape(r, c)", "Bentuk baru r×c; r*c harus sama dengan jumlah elemen."],
    ["-1", "Ukuran dimensi tersebut dihitung otomatis."],
    ["ravel()", "Meratakan menjadi 1D (view jika memungkinkan)."],
    ["flatten()", "Meratakan menjadi 1D (selalu salinan)."],
    ["column_stack", "Menggabungkan array 1D sebagai kolom-kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — reshape dasar",
      code: `import numpy as np

a = np.arange(12)
print(a.reshape(3, 4))
print(a.reshape(2, 6).shape)
print(a.reshape(4, -1).shape)`,
      output: "[[ 0  1  2  3]\n [ 4  5  6  7]\n [ 8  9 10 11]]\n(2, 6)\n(4, 3)",
      explain: [
        ["a.reshape(3, 4)", "12 elemen disusun 3 baris × 4 kolom, diisi baris demi baris."],
        ["a.reshape(2, 6).shape", "Bentuk lain dengan jumlah elemen sama."],
        ["a.reshape(4, -1).shape", "-1 → 12 / 4 = 3 kolom."],
      ],
    },
    {
      title: "Contoh 2 — reshape(-1, 1) untuk scikit-learn",
      code: `import numpy as np
from sklearn.linear_model import LinearRegression

jam = np.array([2, 4, 6, 8])
nilai = np.array([55, 65, 78, 90])

X = jam.reshape(-1, 1)
print(jam.shape, "->", X.shape)
model = LinearRegression().fit(X, nilai)
print(model.predict(np.array([5]).reshape(-1, 1)).round(2))`,
      output: "(4,) -> (4, 1)\n[72.]",
      explain: [
        ["X = jam.reshape(-1, 1)", "Vektor (4,) menjadi matriks (4, 1): 4 sampel, 1 fitur."],
        ["LinearRegression().fit(X, nilai)", "Model menerima X 2D dan y 1D (dibahas di Module 11)."],
        ["np.array([5]).reshape(-1, 1)", "Data baru untuk prediksi juga harus 2D."],
      ],
      change: "Contoh ini memperlihatkan alasan paling umum memakai reshape di Machine Learning.",
    },
    {
      title: "Contoh 3 — ravel, flatten, dan transpose",
      code: `import numpy as np

m = np.array([[1, 2, 3],
              [4, 5, 6]])
print(m.ravel())
print(m.T)
print(m.T.shape)

pred = np.array([[0.2], [0.8], [0.5]])
print(pred.ravel())`,
      output: "[1 2 3 4 5 6]\n[[1 4]\n [2 5]\n [3 6]]\n(3, 2)\n[0.2 0.8 0.5]",
      explain: [
        ["m.ravel()", "Diratakan baris demi baris menjadi 1D."],
        ["m.T", "Baris menjadi kolom: (2, 3) → (3, 2)."],
        ["pred.ravel()", "Hasil berbentuk (3, 1) diratakan menjadi (3,)."],
      ],
      change: "Kebalikan dari reshape: mengembalikan array ke 1D.",
    },
    {
      title: "Contoh 4 — Menggabungkan array",
      code: `import numpy as np

luas = np.array([120, 80, 200])
kamar = np.array([3, 2, 4])
X = np.column_stack([luas, kamar])
print(X)

baru = np.array([[150, 3]])
X2 = np.vstack([X, baru])
print(X2.shape)

print(np.concatenate([luas, kamar]))`,
      output: "[[120   3]\n [ 80   2]\n [200   4]]\n(4, 2)\n[120  80 200   3   2   4]",
      explain: [
        ["np.column_stack([luas, kamar])", "Dua array 1D menjadi dua kolom → matriks fitur (3, 2)."],
        ["np.vstack([X, baru])", "Menambah satu baris (sampel) di bawah."],
        ["np.concatenate([luas, kamar])", "Menyambung dua array 1D menjadi satu array panjang."],
      ],
      change: "Selain mengubah bentuk, kita bisa menyusun array baru dari beberapa array.",
    },
  ],
  params: [
    {
      title: "Fungsi bentuk & penggabungan",
      items: [
        { name: "a.reshape(shape)", desc: "Bentuk baru; satu dimensi boleh -1." },
        { name: "a.ravel() / a.flatten()", desc: "Ke 1D; flatten selalu membuat salinan." },
        { name: "a.T", desc: "Transpose." },
        { name: "np.concatenate(arrays, axis=0)", desc: "Menyambung sepanjang axis." },
        { name: "np.vstack(arrays)", desc: "Menumpuk sebagai baris." },
        { name: "np.column_stack(arrays)", desc: "Menyusun 1D sebagai kolom." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nprint(np.arange(6).reshape(-1, 2))`, output: "[[0 1]\n [2 3]\n [4 5]]" },
  tryIt: `import numpy as np

a = np.arange(1, 13)
print(a.reshape(3, 4))
print(a.reshape(-1, 1)[:3])   # tiga baris pertama dari bentuk kolom
print(a.reshape(2, 2, 3).shape)`,
  mistakes: [
    {
      title: "Jumlah elemen tidak cocok",
      wrong: `import numpy as np
np.arange(10).reshape(3, 4)`,
      error: "ValueError",
      fix: `import numpy as np
print(np.arange(12).reshape(3, 4).shape)`,
      explain: "*cannot reshape array of size 10 into shape (3,4)*: 3×4 = 12 ≠ 10.",
    },
    {
      title: "Satu fitur 1D langsung ke model",
      wrong: `import numpy as np
from sklearn.linear_model import LinearRegression
LinearRegression().fit(np.array([1, 2, 3]), np.array([2, 4, 6]))`,
      error: "ValueError",
      fix: `import numpy as np
from sklearn.linear_model import LinearRegression
m = LinearRegression().fit(np.array([1, 2, 3]).reshape(-1, 1), np.array([2, 4, 6]))
print(m.coef_)`,
      explain: "*Expected 2D array, got 1D array instead* — gunakan `reshape(-1, 1)`.",
    },
    {
      title: "Dua -1 sekaligus",
      wrong: `import numpy as np
np.arange(12).reshape(-1, -1)`,
      error: "ValueError",
      fix: `import numpy as np
print(np.arange(12).reshape(-1, 3).shape)`,
      explain: "Hanya satu dimensi yang boleh -1.",
    },
  ],
  bestPractices: [
    "Gunakan `reshape(-1, 1)` untuk satu fitur dan `reshape(1, -1)` untuk satu sampel.",
    "Cetak `.shape` sebelum dan sesudah reshape.",
    "Gunakan `column_stack` untuk menambah kolom fitur dari array 1D.",
  ],
  exercises: [
    {
      id: "np-reshape-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Satu kolom",
      prompt: "Lengkapi agar `X` berbentuk (5, 1).",
      starter: `import numpy as np
jam = np.array([1, 2, 3, 4, 5])
X = jam.reshape(____)
print(X.shape)`,
      solution: `import numpy as np
jam = np.array([1, 2, 3, 4, 5])
X = jam.reshape(-1, 1)
print(X.shape)`,
      alternatives: [`import numpy as np
jam = np.array([1, 2, 3, 4, 5])
X = jam.reshape(5, 1)
print(X.shape)`],
      tests: [{ desc: "X.shape == (5, 1)", expr: "X.shape == (5, 1)" }],
      hints: ["Konsep: satu kolom, baris otomatis.", "Gunakan -1 untuk dimensi baris.", "`reshape(-1, 1)`"],
      explanation: "`(-1, 1)` dan `(5, 1)` sama-sama benar; -1 lebih fleksibel untuk data berukuran berbeda.",
    },
    {
      id: "np-reshape-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.arange(8).reshape(2, -1)
print(a)
print(a.T.shape, a.ravel()[-1])`,
      answer: "[[0 1 2 3]\n [4 5 6 7]]\n(4, 2) 7",
      hints: ["Konsep: -1 dihitung otomatis.", "8 elemen / 2 baris = 4 kolom.", "Transpose (4, 2); elemen terakhir 7."],
      explanation: "reshape(2, -1) → 2×4; a.T → (4, 2); ravel terakhir = 7.",
    },
    {
      id: "np-reshape-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Prediksi satu data",
      prompt: "Kode prediksi error karena data baru masih 1D. Perbaiki agar prediksi untuk luas 100 tercetak.",
      starter: `import numpy as np
from sklearn.linear_model import LinearRegression
X = np.array([[50], [80], [120]])
y = np.array([500, 800, 1200])
model = LinearRegression().fit(X, y)
baru = np.array([100])
print(model.predict(baru).round())`,
      solution: `import numpy as np
from sklearn.linear_model import LinearRegression
X = np.array([[50], [80], [120]])
y = np.array([500, 800, 1200])
model = LinearRegression().fit(X, y)
baru = np.array([100]).reshape(-1, 1)
print(model.predict(baru).round())`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "baru berbentuk 2D (1, 1)", expr: "baru.shape == (1, 1)" },
        { desc: "Prediksi ≈ 1000", expr: "abs(model.predict(baru)[0] - 1000) < 1e-6" },
      ],
      hints: ["Konsep: data baru juga harus 2D.", "Ubah `baru` dengan reshape.", "`np.array([100]).reshape(-1, 1)`"],
      explanation: "Data untuk `predict` harus punya bentuk yang sama dengan data latih: (n_sampel, n_fitur).",
    },
    {
      id: "np-reshape-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Susun matriks fitur",
      prompt: "Dari tiga array 1D `luas`, `kamar`, `umur`, buat matriks `X` berbentuk (4, 3) dengan `np.column_stack`. Cetak `X.shape` dan baris pertama X.",
      starter: `import numpy as np
luas = np.array([120, 80, 200, 70])
kamar = np.array([3, 2, 4, 1])
umur = np.array([5, 15, 2, 22])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
luas = np.array([120, 80, 200, 70])
kamar = np.array([3, 2, 4, 1])
umur = np.array([5, 15, 2, 22])
X = np.column_stack([luas, kamar, umur])
print(X.shape)
print(X[0])`,
      tests: [
        { desc: "X.shape == (4, 3)", expr: "X.shape == (4, 3)" },
        { desc: "Baris pertama [120, 3, 5]", expr: "list(X[0]) == [120, 3, 5]" },
        { desc: "Kolom kedua = kamar", expr: "list(X[:, 1]) == [3, 2, 4, 1]" },
      ],
      hints: ["Konsep: menyusun array 1D sebagai kolom.", "`np.column_stack([a, b, c])`", "Cek `X.shape`."],
      explanation: "Setiap array 1D menjadi satu kolom fitur.",
    },
    {
      id: "np-reshape-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Data harian menjadi mingguan",
      prompt: [
        "Array `harian` berisi PM2.5 selama 28 hari. Ubah menjadi bentuk (4, 7) — 4 minggu × 7 hari — dengan `reshape`, lalu hitung `rata_mingguan` (rata-rata setiap minggu).",
        "Cetak `rata_mingguan` dibulatkan 1 desimal.",
      ],
      starter: `import numpy as np
harian = np.array([60, 62, 65, 70, 68, 66, 64,
                   70, 75, 80, 85, 82, 78, 76,
                   90, 95, 100, 98, 92, 88, 85,
                   70, 68, 65, 62, 60, 58, 55])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
harian = np.array([60, 62, 65, 70, 68, 66, 64,
                   70, 75, 80, 85, 82, 78, 76,
                   90, 95, 100, 98, 92, 88, 85,
                   70, 68, 65, 62, 60, 58, 55])
mingguan = harian.reshape(4, 7)
rata_mingguan = mingguan.mean(axis=1)
print(rata_mingguan.round(1))`,
      tests: [
        { desc: "rata_mingguan berisi 4 nilai", expr: "len(rata_mingguan) == 4" },
        { desc: "Minggu pertama benar", expr: "abs(rata_mingguan[0] - harian[:7].mean()) < 1e-9" },
        { desc: "Minggu ketiga tertinggi", expr: "rata_mingguan.argmax() == 2" },
      ],
      hints: ["Konsep: reshape + agregasi per baris.", "`harian.reshape(4, 7)`", "`mean(axis=1)` untuk rata-rata tiap minggu."],
      explanation: "Reshape memungkinkan agregasi per periode tanpa loop — teknik umum pada data deret waktu dengan panjang periode tetap.",
    },
  ],
  quiz: [
    { id: "np-reshape-q1", type: "mcq", prompt: "Array 1D panjang 20 di-reshape dengan `reshape(-1, 4)`. Shape hasilnya?", options: ["(4, 5)", "(5, 4)", "(20, 4)", "Error"], answer: 1, explanation: "20 / 4 = 5 baris." },
    { id: "np-reshape-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.arange(4).reshape(2, 2).T)`, options: ["[[0 1]\n [2 3]]", "[[0 2]\n [1 3]]", "[0 2 1 3]", "[[0 1 2 3]]"], answer: 1, explanation: "Transpose menukar baris dan kolom." },
    { id: "np-reshape-q3", type: "tf", prompt: "Reshape mengubah urutan elemen array.", answer: false, explanation: "Urutan tetap; hanya penataannya." },
    { id: "np-reshape-q4", type: "fill", prompt: "Lengkapi untuk mengubah array 1D `x` menjadi satu kolom: `x.reshape(____)`", answer: ["-1, 1", "-1,1"], explanation: "`x.reshape(-1, 1)`." },
    { id: "np-reshape-q5", type: "case", prompt: "Muncul error *Expected 2D array, got 1D array instead* saat `model.fit(x, y)` dengan satu fitur. Perbaikannya?", options: ["y.reshape(-1, 1)", "x.reshape(-1, 1)", "x.ravel()", "Ganti model"], answer: 1, explanation: "X harus 2D; y tetap 1D." },
  ],
  challenge: {
    id: "np-reshape-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fitur kuadrat",
    prompt: [
      "Diberikan satu fitur `x = np.array([1, 2, 3, 4, 5])`. Buat matriks `X_poly` berbentuk (5, 2) yang kolom pertamanya `x` dan kolom keduanya `x ** 2` (fitur polinomial).",
      "Cetak `X_poly.shape` dan baris terakhir: `(5, 2)` lalu `[ 5 25]`.",
    ],
    starter: `import numpy as np
x = np.array([1, 2, 3, 4, 5])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
x = np.array([1, 2, 3, 4, 5])
X_poly = np.column_stack([x, x ** 2])
print(X_poly.shape)
print(X_poly[-1])`,
    alternatives: [`import numpy as np
x = np.array([1, 2, 3, 4, 5])
X_poly = np.hstack([x.reshape(-1, 1), (x ** 2).reshape(-1, 1)])
print(X_poly.shape)
print(X_poly[-1])`],
    tests: [
      { desc: "X_poly.shape == (5, 2)", expr: "X_poly.shape == (5, 2)" },
      { desc: "Kolom kedua = x²", expr: "list(X_poly[:, 1]) == [1, 4, 9, 16, 25]" },
      { desc: "Output sesuai", expr: "_lines == ['(5, 2)', '[ 5 25]']" },
    ],
    hints: ["Konsep: menyusun kolom fitur baru.", "Buat x ** 2 lalu gabungkan.", "`np.column_stack([x, x ** 2])`"],
    explanation: "Menambah fitur x² memungkinkan model linear menangkap pola melengkung — dasar Polynomial Regression (Module 11). scikit-learn menyediakan `PolynomialFeatures` untuk ini.",
  },
  summary: [
    "`reshape(r, c)` menata ulang tanpa mengubah isi; jumlah elemen harus sama.",
    "`-1` = ukuran dihitung otomatis; `reshape(-1, 1)` = satu kolom.",
    "`ravel()`/`flatten()` meratakan ke 1D; `.T` transpose.",
    "`column_stack`, `vstack`, `concatenate` untuk menggabungkan.",
    "scikit-learn: X harus 2D (termasuk data baru untuk predict).",
  ],
  cheatsheet: [
    { syntax: "x.reshape(-1, 1)", desc: "Satu fitur → 2D" },
    { syntax: "x.reshape(1, -1)", desc: "Satu sampel → 2D" },
    { syntax: "A.ravel()", desc: "Rata ke 1D" },
    { syntax: "np.column_stack([a, b])", desc: "Gabung sebagai kolom" },
    { syntax: "np.vstack([A, B])", desc: "Tumpuk baris" },
  ],
  flashcards: [
    { q: "Ubah array 1D x menjadi satu kolom 2D", a: "x.reshape(-1, 1)" },
    { q: "Ratakan matriks M menjadi 1D", a: "M.ravel()" },
    { q: "Gabungkan array 1D a dan b sebagai dua kolom", a: "np.column_stack([a, b])" },
  ],
  references: [
    numpyDoc("numpy.reshape", "reference/generated/numpy.reshape.html"),
    numpyDoc("numpy.column_stack", "reference/generated/numpy.column_stack.html"),
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
    sklearnDoc("Getting Started — fitting and predicting (X sebagai array 2D)", "getting_started.html"),
  ],
};
