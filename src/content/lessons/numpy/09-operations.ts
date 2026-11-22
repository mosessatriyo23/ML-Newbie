import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-array-operations",
  title: "Array Operations",
  minutes: 40,
  prerequisites: ["np-introduction-to-numpy", "np-array-shape"],
  objectives: [
    "Melakukan operasi aritmetika element-wise antara array dan skalar, serta antar-array.",
    "Memakai operasi perbandingan untuk menghasilkan array boolean.",
    "Menggunakan agregasi: `sum`, `min`, `max`, `argmin`, `argmax`, `cumsum`.",
    "Membedakan perkalian element-wise (`*`) dan perkalian matriks (`@`).",
  ],
  definition: [
    "Operasi NumPy bersifat **element-wise**: operator diterapkan pada setiap pasangan elemen yang seposisi. `[1, 2, 3] + [10, 20, 30]` = `[11, 22, 33]`. Kedua array harus memiliki shape yang sama (atau kompatibel — lihat materi Broadcasting).",
    "Operasi dengan **skalar** (satu angka) diterapkan ke setiap elemen: `arr * 2`, `arr - arr.mean()`.",
    "Operasi perbandingan (`>`, `==`, …) juga element-wise dan menghasilkan **array boolean** — dasar dari filtering data.",
    "**Agregasi** merangkum array menjadi satu nilai (atau satu nilai per axis): `sum`, `mean`, `min`, `max`. `argmin`/`argmax` mengembalikan posisi, dan `cumsum` menghasilkan jumlah kumulatif.",
    "`*` adalah perkalian element-wise, sedangkan `@` adalah **perkalian matriks** (dot product) — operasi inti model linear: prediksi = X @ w + b.",
  ],
  why: [
    "Menghitung error (`y - y_pred`), menormalkan fitur (`(X - mean) / std`), dan menghitung prediksi model linear (`X @ w`) semuanya operasi array.",
    "Agregasi memberi ringkasan cepat: total penjualan, nilai tertinggi, hari dengan polusi terburuk (`argmax`).",
  ],
  when: [
    "- Perhitungan pada setiap elemen tanpa loop.",
    "- Membandingkan nilai dengan threshold.",
    "- Menghitung ringkasan dan posisi nilai ekstrem.",
    "- Perkalian matriks pada model linear dan neural network.",
  ],
  analogy: "Operasi element-wise seperti **dua barisan siswa yang saling berpasangan** — siswa pertama dengan siswa pertama, kedua dengan kedua. Perkalian matriks (`@`) seperti **menghitung total belanja**: kalikan setiap jumlah barang dengan harganya, lalu jumlahkan semuanya menjadi satu angka.",
  syntax: {
    code: `a + b   a - b   a * b   a / b   a ** 2   # element-wise
a > 5                                    # boolean array
a.sum()  a.min()  a.argmax()  a.cumsum()
X @ w                                    # perkalian matriks`,
  },
  anatomy: [
    ["a * b", "Perkalian elemen seposisi (shape harus cocok)."],
    ["a > 5", "Array boolean: True di posisi yang memenuhi."],
    ["a.argmax()", "Posisi nilai maksimum."],
    ["a.cumsum()", "Jumlah kumulatif: [a0, a0+a1, a0+a1+a2, …]."],
    ["X @ w", "Perkalian matriks: setiap baris X dikalikan dengan w lalu dijumlahkan."],
  ],
  examples: [
    {
      title: "Contoh 1 — Operasi antar-array",
      code: `import numpy as np

y_true = np.array([3, 5, 7, 9])
y_pred = np.array([2.5, 5.5, 6.0, 9.5])
print(y_true - y_pred)
print((y_true - y_pred) ** 2)
print(y_pred / y_true)`,
      output: "[ 0.5 -0.5  1.  -0.5]\n[0.25 0.25 1.   0.25]\n[0.83333333 1.1        0.85714286 1.05555556]",
      explain: [
        ["y_true - y_pred", "Error untuk setiap data."],
        ["(y_true - y_pred) ** 2", "Squared error per data — dasar MSE."],
        ["y_pred / y_true", "Rasio prediksi terhadap nilai asli."],
      ],
    },
    {
      title: "Contoh 2 — Perbandingan menghasilkan boolean",
      code: `import numpy as np

aqi = np.array([45, 78, 120, 160, 95])
tidak_sehat = aqi > 100
print(tidak_sehat)
print("Jumlah hari > 100:", tidak_sehat.sum())
print("Persentase:", tidak_sehat.mean())`,
      output: "[False False  True  True False]\nJumlah hari > 100: 2\nPersentase: 0.4",
      explain: [
        ["tidak_sehat = aqi > 100", "Setiap hari dibandingkan dengan 100 → array True/False."],
        ["tidak_sehat.sum()", "True = 1, jadi sum menghitung jumlah hari yang memenuhi."],
        ["tidak_sehat.mean()", "Proporsi hari yang memenuhi."],
      ],
      change: "Operasi tidak hanya aritmetika — perbandingan juga element-wise.",
    },
    {
      title: "Contoh 3 — Agregasi dan posisi",
      code: `import numpy as np

penjualan = np.array([120, 95, 150, 80, 200, 170, 90])
hari = np.array(["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"])
print("Total:", penjualan.sum())
print("Terendah:", penjualan.min(), "pada", hari[penjualan.argmin()])
print("Tertinggi:", penjualan.max(), "pada", hari[penjualan.argmax()])
print("Kumulatif:", penjualan.cumsum())`,
      output: "Total: 905\nTerendah: 80 pada Kam\nTertinggi: 200 pada Jum\nKumulatif: [120 215 365 445 645 815 905]",
      explain: [
        ["penjualan.argmin()", "Index nilai terkecil, dipakai untuk mencari nama hari."],
        ["hari[penjualan.argmax()]", "Kombinasi argmax + indexing."],
        ["penjualan.cumsum()", "Total berjalan dari hari ke hari."],
      ],
      change: "Agregasi merangkum array; argmin/argmax memberi lokasi nilai ekstrem.",
    },
    {
      title: "Contoh 4 — Perkalian element-wise vs perkalian matriks",
      code: `import numpy as np

X = np.array([[1, 2],
              [3, 4],
              [5, 6]])          # 3 sampel, 2 fitur
w = np.array([0.5, 2.0])        # bobot setiap fitur
b = 1.0

print(X * w)                    # element-wise per kolom
print(X @ w)                    # satu nilai per sampel
print(X @ w + b)                # prediksi model linear`,
      output: "[[ 0.5  4. ]\n [ 1.5  8. ]\n [ 2.5 12. ]]\n[ 4.5  9.5 14.5]\n[ 5.5 10.5 15.5]",
      explain: [
        ["X * w", "Setiap kolom dikalikan bobotnya (broadcasting), hasil tetap (3, 2)."],
        ["X @ w", "Perkalian matriks: setiap baris → 1×0.5 + 2×2.0, dst. Hasil (3,)."],
        ["X @ w + b", "Rumus prediksi regresi linear: ŷ = Xw + b."],
      ],
      change: "Inilah cara model linear menghitung prediksi untuk banyak sampel sekaligus.",
    },
  ],
  params: [
    {
      title: "Operasi dan agregasi",
      items: [
        { name: "+ - * / ** //", desc: "Aritmetika element-wise." },
        { name: "> < >= <= == !=", desc: "Perbandingan → array boolean." },
        { name: "sum, mean, min, max (axis=None)", desc: "Agregasi; axis untuk per baris/kolom." },
        { name: "argmin, argmax", desc: "Posisi nilai minimum/maksimum." },
        { name: "cumsum", desc: "Jumlah kumulatif." },
        { name: "@ / np.dot", desc: "Perkalian matriks." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\na = np.array([1, 2, 3])\nprint(a * a, a @ a, (a >= 2).sum())`, output: "[1 4 9] 14 2" },
  tryIt: `import numpy as np

nilai = np.array([72, 85, 90, 64, 78])
print("Selisih dari rata-rata:", nilai - nilai.mean())
print("Lulus (>= 75):", nilai >= 75)
print("Jumlah lulus:", (nilai >= 75).sum())`,
  mistakes: [
    {
      title: "Shape tidak cocok",
      wrong: `import numpy as np
print(np.array([1, 2, 3]) + np.array([1, 2]))`,
      error: "ValueError",
      fix: `import numpy as np
print(np.array([1, 2, 3]) + np.array([1, 2, 3]))`,
      explain: "*operands could not be broadcast together*: operasi element-wise butuh shape yang sama atau kompatibel.",
    },
    {
      title: "Memakai * untuk perkalian matriks",
      wrong: `import numpy as np
X = np.array([[1, 2], [3, 4], [5, 6]])
w = np.array([0.5, 2.0])
print(X * w)   # bukan prediksi per sampel`,
      fix: `import numpy as np
X = np.array([[1, 2], [3, 4], [5, 6]])
w = np.array([0.5, 2.0])
print(X @ w)`,
      explain: "`*` mengalikan per elemen; `@` menjumlahkan hasil kali per baris.",
    },
    {
      title: "Membandingkan array dengan if",
      wrong: `import numpy as np
a = np.array([1, 5])
if a > 2:
    print("ya")`,
      error: "ValueError",
      fix: `import numpy as np
a = np.array([1, 5])
if (a > 2).any():
    print("ada yang > 2")`,
      explain: "*truth value of an array is ambiguous* — gunakan `.any()` (ada yang True) atau `.all()` (semua True).",
    },
  ],
  bestPractices: [
    "Gunakan operasi vectorized, bukan loop.",
    "Cek shape kedua operand sebelum operasi antar-array.",
    "Gunakan `.sum()`/`.mean()` pada array boolean untuk menghitung jumlah/proporsi.",
    "Gunakan `@` untuk perkalian matriks agar maksudnya jelas.",
  ],
  exercises: [
    {
      id: "np-ops-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Absolute error",
      prompt: "Lengkapi agar `ae` berisi |y_true − y_pred| untuk setiap data.",
      starter: `import numpy as np
y_true = np.array([10, 20, 30])
y_pred = np.array([12, 18, 33])
ae = np.abs(y_true ____ y_pred)
print(ae)`,
      solution: `import numpy as np
y_true = np.array([10, 20, 30])
y_pred = np.array([12, 18, 33])
ae = np.abs(y_true - y_pred)
print(ae)`,
      tests: [{ desc: "ae == [2, 2, 3]", expr: "list(ae) == [2, 2, 3]" }],
      hints: ["Konsep: operasi antar-array.", "Error = selisih.", "Operator `-`"],
      explanation: "Selisih element-wise lalu nilai mutlak = absolute error per data.",
    },
    {
      id: "np-ops-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([4, 1, 7, 3])
print(a.argmax(), a.argmin())
print(a.cumsum())
print((a > 2).sum())`,
      answer: "2 1\n[ 4  5 12 15]\n3",
      hints: ["Konsep: argmax/argmin memberi posisi.", "cumsum: 4, 5, 12, 15.", "Elemen > 2: 4, 7, 3."],
      explanation: "argmax = 2, argmin = 1; cumsum [4 5 12 15]; tiga elemen > 2.",
    },
    {
      id: "np-ops-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Cek ada nilai berbahaya",
      prompt: "Kode error saat memakai if pada array. Perbaiki agar mencetak `Ada hari berbahaya` jika **ada** AQI di atas 300.",
      starter: `import numpy as np
aqi = np.array([120, 310, 95])
if aqi > 300:
    print("Ada hari berbahaya")`,
      solution: `import numpy as np
aqi = np.array([120, 310, 95])
if (aqi > 300).any():
    print("Ada hari berbahaya")`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output sesuai", expr: "_lines == ['Ada hari berbahaya']" },
      ],
      hints: ["Konsep: array boolean tidak bisa langsung di-if.", "Gunakan method yang mengecek apakah ada True.", "`(aqi > 300).any()`"],
      explanation: "`.any()` True jika minimal satu elemen True.",
    },
    {
      id: "np-ops-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Prediksi model linear",
      prompt: "Diberikan fitur `X` (3 rumah × 2 fitur: luas, kamar), bobot `w = [9.5, 60]`, dan bias `b = 100`. Hitung `pred = X @ w + b` lalu cetak.",
      starter: `import numpy as np
X = np.array([[100, 2], [150, 3], [80, 1]])
w = np.array([9.5, 60])
b = 100
# Tulis kodemu di sini
`,
      solution: `import numpy as np
X = np.array([[100, 2], [150, 3], [80, 1]])
w = np.array([9.5, 60])
b = 100
pred = X @ w + b
print(pred)`,
      tests: [
        { desc: "pred benar", expr: "list(pred) == [1170.0, 1705.0, 920.0]" },
        { desc: "Memakai @ atau dot", expr: "'@' in _code or 'dot' in _code" },
      ],
      hints: ["Konsep: perkalian matriks.", "Operator `@`.", "`pred = X @ w + b`"],
      explanation: "Rumah 1: 100×9.5 + 2×60 + 100 = 1170. Inilah perhitungan `LinearRegression.predict`.",
    },
    {
      id: "np-ops-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Ringkasan Wholesale",
      prompt: [
        "Baca `wholesale_customers.csv`, ambil 6 kolom belanja (`Fresh` sampai `Delicassen`) sebagai array `B`.",
        "Hitung `total` belanja per pelanggan (axis=1), lalu `top` = index pelanggan dengan total terbesar, dan `porsi_fresh` = proporsi Fresh terhadap total seluruh belanja (2 desimal). Cetak `top` dan `porsi_fresh`.",
      ],
      starter: `import numpy as np
import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
produk = ["Fresh", "Milk", "Grocery", "Frozen", "Detergents_Paper", "Delicassen"]
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
produk = ["Fresh", "Milk", "Grocery", "Frozen", "Detergents_Paper", "Delicassen"]
B = df[produk].to_numpy()
total = B.sum(axis=1)
top = total.argmax()
porsi_fresh = round(B[:, 0].sum() / B.sum(), 2)
print(top, porsi_fresh)`,
      tests: [
        { desc: "total berisi 440 nilai", expr: "total.shape == (440,)" },
        { desc: "top = index total terbesar", expr: "top == total.argmax()" },
        { desc: "porsi_fresh sesuai", expr: "abs(porsi_fresh - round(B[:, 0].sum() / B.sum(), 2)) < 1e-9" },
      ],
      hints: ["Konsep: agregasi per baris + argmax.", "`total = B.sum(axis=1)`", "Proporsi = jumlah kolom Fresh ÷ jumlah semua."],
      explanation: "Analisis seperti ini adalah langkah awal sebelum segmentasi pelanggan.",
    },
  ],
  quiz: [
    { id: "np-ops-q1", type: "mcq", prompt: "Operator untuk perkalian matriks di NumPy adalah…", options: ["*", "@", "**", "x"], answer: 1, explanation: "`@` (atau `np.dot`)." },
    { id: "np-ops-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\na = np.array([2, 4, 6])\nprint(a / 2 + 1)`, options: ["[2 3 4]", "[2. 3. 4.]", "[1.5 2.5 3.5]", "[2, 3, 4]"], answer: 1, explanation: "a / 2 = [1. 2. 3.], lalu + 1." },
    { id: "np-ops-q3", type: "tf", prompt: "`(a > 0).sum()` menghitung jumlah elemen positif.", answer: true, explanation: "True = 1." },
    { id: "np-ops-q4", type: "fill", prompt: "Method untuk mendapatkan posisi nilai terkecil: `a.____()`", answer: ["argmin"], explanation: "`argmin()`." },
    { id: "np-ops-q5", type: "case", prompt: "Kamu ingin tahu apakah SEMUA prediksi berada di rentang 0–500. Ekspresi yang tepat?", options: ["if pred >= 0:", "((pred >= 0) & (pred <= 500)).all()", "pred.any()", "pred.max()"], answer: 1, explanation: "Gabungkan kondisi dengan `&` dan cek `.all()`." },
  ],
  challenge: {
    id: "np-ops-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Evaluasi lengkap regresi",
    prompt: [
      "Diberikan `y_true` dan `y_pred` (6 data AQI). Tanpa loop, hitung:",
      "- `mae`, `rmse`, dan `max_err` (error absolut terbesar)\n- `idx_terburuk` (posisi error absolut terbesar)\n- `pct_dalam_10` (proporsi prediksi dengan error absolut ≤ 10)",
      "Cetak: `MAE=7.0 RMSE=8.21 MaxErr=15 Idx=3 Within10=0.83`",
    ],
    starter: `import numpy as np
y_true = np.array([50, 80, 120, 150, 95, 60])
y_pred = np.array([55, 70, 125, 135, 100, 62])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
y_true = np.array([50, 80, 120, 150, 95, 60])
y_pred = np.array([55, 70, 125, 135, 100, 62])
err = np.abs(y_true - y_pred)
mae = err.mean()
rmse = np.sqrt((err ** 2).mean())
max_err = err.max()
idx_terburuk = err.argmax()
pct_dalam_10 = (err <= 10).mean()
print(f"MAE={mae} RMSE={rmse:.2f} MaxErr={max_err} Idx={idx_terburuk} Within10={pct_dalam_10:.2f}")`,
    tests: [
      { desc: "mae == 7.0", expr: "mae == 7.0" },
      { desc: "rmse benar", expr: "abs(rmse - (((y_true - y_pred) ** 2).mean()) ** 0.5) < 1e-9" },
      { desc: "max_err == 15 dan idx 3", expr: "max_err == 15 and idx_terburuk == 3" },
      { desc: "pct_dalam_10 = 5/6", expr: "abs(pct_dalam_10 - 5 / 6) < 1e-9" },
      { desc: "Tanpa loop", expr: "'for ' not in _code" },
    ],
    hints: ["Konsep: operasi + agregasi + perbandingan.", "`err = np.abs(y_true - y_pred)`", "`(err <= 10).mean()` untuk proporsi."],
    explanation: "Selain MAE, error maksimum dan proporsi prediksi \"cukup dekat\" membantu menjelaskan kualitas model kepada pengguna non-teknis.",
  },
  summary: [
    "Operasi aritmetika dan perbandingan bersifat element-wise.",
    "Perbandingan menghasilkan array boolean; `.sum()`/`.mean()` menghitung jumlah/proporsi True.",
    "Agregasi: sum, mean, min, max, argmin, argmax, cumsum.",
    "`*` element-wise; `@` perkalian matriks (ŷ = Xw + b).",
    "Gunakan `.any()`/`.all()` untuk kondisi pada array.",
  ],
  cheatsheet: [
    { syntax: "np.abs(y - y_pred).mean()", desc: "MAE" },
    { syntax: "(a > t).sum()", desc: "Jumlah elemen > t" },
    { syntax: "a.argmax()", desc: "Posisi maksimum" },
    { syntax: "a.cumsum()", desc: "Kumulatif" },
    { syntax: "X @ w + b", desc: "Prediksi linear" },
  ],
  flashcards: [
    { q: "Hitung MAE dari array y dan y_pred", a: "np.abs(y - y_pred).mean()" },
    { q: "Proporsi elemen array a yang lebih dari 100", a: "(a > 100).mean()" },
    { q: "Prediksi model linear dari X, w, b", a: "X @ w + b" },
  ],
  references: [
    numpyDoc("NumPy: the absolute basics for beginners — basic array operations", "user/absolute_beginners.html"),
    numpyDoc("Universal functions (ufunc) basics", "user/basics.ufuncs.html"),
    numpyDoc("numpy.matmul (operator @)", "reference/generated/numpy.matmul.html"),
    numpyDoc("numpy.cumsum", "reference/generated/numpy.cumsum.html"),
  ],
};
