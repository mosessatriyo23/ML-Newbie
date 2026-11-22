import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-mathematical-operations",
  title: "Mathematical Operations",
  minutes: 40,
  prerequisites: ["np-array-operations"],
  objectives: [
    "Memakai universal functions (ufunc): `np.sqrt`, `np.exp`, `np.log`, `np.log1p`, `np.abs`.",
    "Membulatkan dan membatasi nilai dengan `np.round`, `np.floor`, `np.ceil`, `np.clip`.",
    "Memahami fungsi matematika yang sering muncul di ML: sigmoid, log transform, dan jarak Euclidean.",
    "Menangani nilai tak terdefinisi (log 0, akar negatif) dengan aman.",
  ],
  definition: [
    "**Universal function (ufunc)** adalah fungsi NumPy yang bekerja element-wise pada array. Berbeda dengan modul `math` yang hanya menerima satu angka, `np.sqrt(arr)` menghitung akar setiap elemen sekaligus.",
    "Kelompok penting:\n- **Pangkat & akar**: `np.sqrt`, `np.square`, `np.power`\n- **Eksponen & logaritma**: `np.exp`, `np.log` (natural), `np.log10`, `np.log1p` (= log(1 + x), aman untuk x = 0)\n- **Pembulatan**: `np.round`, `np.floor` (ke bawah), `np.ceil` (ke atas)\n- **Pembatasan**: `np.clip(a, min, max)` — nilai di luar rentang dipotong ke batasnya\n- **Lainnya**: `np.abs`, `np.sign`, `np.maximum`/`np.minimum` (element-wise antar-array)",
  ],
  why: [
    "**Log transform** (`np.log1p`) mengecilkan data yang sangat miring ke kanan, seperti pendapatan dan belanja — membuat model lebih stabil.",
    "**Sigmoid** 1 / (1 + e^(−z)) mengubah skor menjadi probabilitas 0–1 — inti Logistic Regression.",
    "**Clip** memastikan prediksi masuk akal (misalnya AQI tidak negatif). **Sqrt** dipakai di RMSE dan jarak Euclidean (KNN, K-Means).",
  ],
  when: [
    "- Data miring/berskala sangat lebar → log transform.",
    "- Mengubah skor ke probabilitas → sigmoid (`np.exp`).",
    "- Prediksi harus dalam rentang tertentu → `np.clip`.",
    "- Menghitung jarak dan RMSE → `np.sqrt`.",
  ],
  analogy: "Ufunc seperti **mesin cetak kaos**: sekali disetel desainnya (fungsi), semua kaos yang lewat (elemen array) dicetak dengan desain yang sama. `np.clip` seperti **pagar pembatas jalan** — mobil boleh bergerak bebas, tetapi tidak bisa keluar dari batas kiri dan kanan.",
  syntax: {
    code: `np.sqrt(a)   np.exp(a)   np.log(a)   np.log1p(a)
np.round(a, 2)   np.floor(a)   np.ceil(a)
np.clip(a, 0, 500)
np.maximum(a, 0)       # nilai negatif jadi 0`,
  },
  anatomy: [
    ["np.log1p(x)", "log(1 + x); aman untuk x = 0 (log 0 = −∞)."],
    ["np.expm1(y)", "Kebalikan log1p: e^y − 1, untuk mengembalikan ke skala asli."],
    ["np.clip(a, lo, hi)", "Nilai < lo menjadi lo, > hi menjadi hi."],
    ["np.maximum(a, 0)", "Element-wise max — sama dengan fungsi ReLU."],
  ],
  examples: [
    {
      title: "Contoh 1 — Ufunc dasar",
      code: `import numpy as np

a = np.array([1, 4, 9, 16])
print(np.sqrt(a))
print(np.square(a))
print(np.exp([0, 1, 2]).round(3))
print(np.log([1, np.e, 100]).round(3))`,
      output: "[1. 2. 3. 4.]\n[  1  16  81 256]\n[1.    2.718 7.389]\n[0.    1.    4.605]",
      explain: [
        ["np.sqrt(a)", "Akar setiap elemen."],
        ["np.square(a)", "Kuadrat setiap elemen."],
        ["np.exp([0, 1, 2])", "e pangkat setiap elemen (list otomatis diubah ke array)."],
        ["np.log([1, np.e, 100])", "Logaritma natural; log(e) = 1."],
      ],
    },
    {
      title: "Contoh 2 — Log transform data miring",
      code: `import numpy as np

pendapatan = np.array([3, 5, 8, 12, 250])   # juta, ada nilai ekstrem
print("Asli:", pendapatan)
print("Rasio max/min asli:", pendapatan.max() / pendapatan.min())

log_p = np.log1p(pendapatan)
print("log1p:", log_p.round(2))
print("Rasio max/min log:", (log_p.max() / log_p.min()).round(2))
print("Kembali:", np.expm1(log_p).round())`,
      output: "Asli: [  3   5   8  12 250]\nRasio max/min asli: 83.33333333333333\nlog1p: [1.39 1.79 2.2  2.56 5.53]\nRasio max/min log: 3.99\nKembali: [  3.   5.   8.  12. 250.]",
      explain: [
        ["np.log1p(pendapatan)", "log(1 + x): jarak antar-nilai besar dipersempit."],
        ["log_p.max() / log_p.min()", "Nilai ekstrem tidak lagi mendominasi."],
        ["np.expm1(log_p)", "Kebalikan log1p untuk kembali ke skala asli (penting saat model memprediksi pada skala log)."],
      ],
      change: "Fungsi matematika dipakai untuk mentransformasi fitur.",
    },
    {
      title: "Contoh 3 — Sigmoid: skor menjadi probabilitas",
      code: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

skor = np.array([-4, -1, 0, 1, 4])
prob = sigmoid(skor)
print(prob.round(3))
print((prob >= 0.5).astype(int))`,
      output: "[0.018 0.269 0.5   0.731 0.982]\n[0 0 1 1 1]",
      explain: [
        ["return 1 / (1 + np.exp(-z))", "Rumus sigmoid, bekerja untuk seluruh array karena memakai ufunc."],
        ["prob.round(3)", "Skor negatif → probabilitas < 0.5; skor 0 → tepat 0.5."],
        ["(prob >= 0.5).astype(int)", "Threshold 0.5 mengubah probabilitas menjadi kelas."],
      ],
      change: "Kita membangun fungsi inti Logistic Regression dari ufunc.",
    },
    {
      title: "Contoh 4 — Membulatkan dan membatasi prediksi",
      code: `import numpy as np

pred = np.array([-12.4, 35.6, 87.2, 512.9, 150.5])
print(np.round(pred))
print(np.floor(pred), np.ceil(pred))
print(np.clip(pred, 0, 500))
print(np.maximum(pred, 0))`,
      output: "[-12.  36.  87. 513. 150.]\n[-13.  35.  87. 512. 150.] [-12.  36.  88. 513. 151.]\n[  0.   35.6  87.2 500.  150.5]\n[  0.   35.6  87.2 512.9 150.5]",
      explain: [
        ["np.round(pred)", "Pembulatan ke bilangan bulat terdekat (banker's rounding untuk .5)."],
        ["np.floor(pred), np.ceil(pred)", "Ke bawah dan ke atas."],
        ["np.clip(pred, 0, 500)", "AQI negatif menjadi 0; di atas 500 menjadi 500."],
        ["np.maximum(pred, 0)", "Hanya membatasi bawah — sama dengan fungsi ReLU di neural network."],
      ],
      change: "Pasca-pemrosesan prediksi agar masuk akal secara domain.",
    },
  ],
  params: [
    {
      title: "Ufunc penting",
      items: [
        { name: "np.sqrt, np.square, np.power(a, p)", desc: "Akar, kuadrat, pangkat." },
        { name: "np.exp, np.log, np.log10, np.log1p, np.expm1", desc: "Eksponen dan logaritma." },
        { name: "np.round(a, decimals=0)", desc: "Pembulatan." },
        { name: "np.floor, np.ceil", desc: "Ke bawah/ke atas." },
        { name: "np.clip(a, a_min, a_max)", desc: "Batas bawah & atas." },
        { name: "np.maximum(a, b), np.minimum(a, b)", desc: "Maks/min element-wise." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nprint(np.clip(np.array([-5, 3, 12]), 0, 10), np.sqrt(np.array([2.25, 6.25])))`, output: "[ 0  3 10] [1.5 2.5]" },
  tryIt: `import numpy as np

# Jarak Euclidean dua pelanggan (umur, pendapatan)
a = np.array([25, 40])
b = np.array([28, 44])
print("Jarak:", np.sqrt(np.sum((a - b) ** 2)))

# Sigmoid
z = np.linspace(-3, 3, 7)
print((1 / (1 + np.exp(-z))).round(2))`,
  mistakes: [
    {
      title: "Memakai math untuk array",
      wrong: `import math
import numpy as np
print(math.sqrt(np.array([4, 9])))`,
      error: "TypeError",
      fix: `import numpy as np
print(np.sqrt(np.array([4, 9])))`,
      explain: "Fungsi `math` hanya untuk satu angka. Untuk array gunakan versi `np.`.",
    },
    {
      title: "log dari 0 menghasilkan -inf",
      wrong: `import numpy as np
print(np.log(np.array([0, 10])))   # [-inf, 2.30] + RuntimeWarning`,
      fix: `import numpy as np
print(np.log1p(np.array([0, 10])))`,
      explain: "Gunakan `log1p` untuk data yang bisa bernilai 0 (misalnya jumlah pembelian).",
    },
    {
      title: "Lupa mengembalikan skala setelah log",
      wrong: `import numpy as np
pred_log = np.array([3.0, 4.0])
print(pred_log)   # dikira harga asli`,
      fix: `import numpy as np
pred_log = np.array([3.0, 4.0])
print(np.expm1(pred_log).round(1))`,
      explain: "Jika model dilatih pada target log1p, prediksinya harus dikembalikan dengan expm1 sebelum dievaluasi.",
    },
  ],
  bestPractices: [
    "Gunakan `np.log1p`/`np.expm1` sebagai pasangan transformasi.",
    "Clip prediksi ke rentang yang masuk akal secara domain.",
    "Bulatkan hanya saat menampilkan; simpan nilai presisi penuh untuk perhitungan.",
  ],
  exercises: [
    {
      id: "np-math-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Batasi prediksi",
      prompt: "Lengkapi agar semua nilai `pred` berada di rentang 0–100.",
      starter: `import numpy as np
pred = np.array([-5, 50, 130])
aman = np.____(pred, 0, 100)
print(aman)`,
      solution: `import numpy as np
pred = np.array([-5, 50, 130])
aman = np.clip(pred, 0, 100)
print(aman)`,
      tests: [{ desc: "aman == [0, 50, 100]", expr: "list(aman) == [0, 50, 100]" }],
      hints: ["Konsep: membatasi rentang.", "Nama fungsinya berarti \"menjepit\".", "`np.clip(pred, 0, 100)`"],
      explanation: "clip memotong nilai di luar batas ke batas terdekat.",
    },
    {
      id: "np-math-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
x = np.array([2.3, 2.7, -2.3])
print(np.floor(x))
print(np.ceil(x))
print(np.maximum(x, 0))`,
      answer: "[ 2.  2. -3.]\n[ 3.  3. -2.]\n[2.3 2.7 0. ]",
      hints: ["Konsep: floor ke bawah, ceil ke atas.", "floor(-2.3) = -3.", "maximum dengan 0 menghapus nilai negatif."],
      explanation: "floor → [2 2 -3], ceil → [3 3 -2], maximum(x, 0) → [2.3 2.7 0].",
    },
    {
      id: "np-math-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Akar dari array",
      prompt: "Kode error. Perbaiki agar `rmse` dihitung dari array `mse_fold`.",
      starter: `import math
import numpy as np
mse_fold = np.array([25.0, 16.0, 36.0])
rmse = math.sqrt(mse_fold)
print(rmse)`,
      solution: `import numpy as np
mse_fold = np.array([25.0, 16.0, 36.0])
rmse = np.sqrt(mse_fold)
print(rmse)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "rmse == [5, 4, 6]", expr: "list(rmse) == [5.0, 4.0, 6.0]" },
      ],
      hints: ["Konsep: math vs numpy.", "math.sqrt hanya untuk satu angka.", "`np.sqrt(mse_fold)`"],
      explanation: "Ufunc NumPy bekerja pada seluruh array.",
    },
    {
      id: "np-math-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi sigmoid",
      prompt: "Tulis fungsi `sigmoid(z)` = 1 / (1 + e^(−z)) yang bekerja untuk array. Hitung `p = sigmoid(np.array([-2, 0, 2]))` dan cetak dibulatkan 3 desimal.",
      starter: `import numpy as np
# Tulis kodemu di sini
`,
      solution: `import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

p = sigmoid(np.array([-2, 0, 2]))
print(p.round(3))`,
      tests: [
        { desc: "sigmoid(0) == 0.5", expr: "sigmoid(0) == 0.5" },
        { desc: "Hasil untuk array benar", expr: "[round(v, 3) for v in sigmoid(__import__('numpy').array([-2, 0, 2]))] == [0.119, 0.5, 0.881]" },
        { desc: "Simetris: sigmoid(z) + sigmoid(-z) = 1", expr: "abs(sigmoid(3) + sigmoid(-3) - 1) < 1e-12" },
      ],
      hints: ["Konsep: ufunc exp di dalam fungsi.", "`np.exp(-z)`", "`return 1 / (1 + np.exp(-z))`"],
      explanation: "Logistic Regression menghitung z = Xw + b, lalu sigmoid(z) sebagai probabilitas.",
    },
    {
      id: "np-math-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Log transform belanja grosir",
      prompt: [
        "Baca `wholesale_customers.csv`, ambil kolom `Fresh` sebagai `fresh`.",
        "Hitung `skew_asli` = (mean − median) / std pada data asli, dan `skew_log` pada `np.log1p(fresh)` (gunakan `np.mean`, `np.median`, `np.std`). Cetak keduanya dibulatkan 3 desimal — skew_log seharusnya jauh lebih kecil (bahkan bisa negatif).",
      ],
      starter: `import numpy as np
import pandas as pd
fresh = pd.read_csv("wholesale_customers.csv")["Fresh"].to_numpy()
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
fresh = pd.read_csv("wholesale_customers.csv")["Fresh"].to_numpy()
skew_asli = (np.mean(fresh) - np.median(fresh)) / np.std(fresh)
log_f = np.log1p(fresh)
skew_log = (np.mean(log_f) - np.median(log_f)) / np.std(log_f)
print(round(skew_asli, 3), round(skew_log, 3))`,
      tests: [
        { desc: "skew_asli positif", expr: "skew_asli > 0.2" },
        { desc: "|skew_log| lebih kecil dari skew_asli", expr: "abs(skew_log) < skew_asli" },
        { desc: "Memakai log1p", expr: "'log1p' in _code" },
      ],
      hints: ["Konsep: log mengurangi kemiringan.", "Ukuran kemiringan sederhana: (mean − median) / std.", "`log_f = np.log1p(fresh)`"],
      explanation: "Mean jauh di atas median menandakan ekor kanan panjang. Setelah log1p, distribusi lebih simetris — membantu K-Means dan model linear.",
    },
  ],
  quiz: [
    { id: "np-math-q1", type: "mcq", prompt: "Fungsi yang tepat untuk log transform data yang mengandung nilai 0?", options: ["np.log", "np.log1p", "np.exp", "np.sqrt"], answer: 1, explanation: "log1p(0) = 0, sedangkan log(0) = −∞." },
    { id: "np-math-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.clip(np.array([1, 5, 9]), 2, 6))`, options: ["[1 5 9]", "[2 5 6]", "[2 6 6]", "[2 5 9]"], answer: 1, explanation: "1 → 2, 5 tetap, 9 → 6." },
    { id: "np-math-q3", type: "tf", prompt: "Sigmoid selalu menghasilkan nilai antara 0 dan 1.", answer: true, explanation: "Karena itu cocok sebagai probabilitas." },
    { id: "np-math-q4", type: "fill", prompt: "Kebalikan dari `np.log1p` adalah `np.____`", answer: ["expm1"], explanation: "expm1(y) = e^y − 1." },
    { id: "np-math-q5", type: "case", prompt: "Model forecasting AQI kadang memprediksi nilai negatif. Pasca-pemrosesan sederhana yang masuk akal?", options: ["Kalikan -1", "np.clip(pred, 0, None) atau np.maximum(pred, 0)", "Hapus prediksi", "np.log(pred)"], answer: 1, explanation: "AQI tidak mungkin negatif, jadi batasi di 0." },
  ],
  challenge: {
    id: "np-math-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Matriks jarak Euclidean",
    prompt: [
      "Diberikan 3 pelanggan `P` (umur, pendapatan) dan satu pelanggan baru `q`. Tanpa loop, hitung `jarak` Euclidean dari `q` ke setiap pelanggan: √Σ(P − q)² per baris.",
      "Simpan `terdekat` = index pelanggan dengan jarak terkecil. Cetak `jarak` (2 desimal) dan `terdekat`.",
    ],
    starter: `import numpy as np
P = np.array([[25, 40], [45, 55], [30, 42]])
q = np.array([28, 45])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
P = np.array([[25, 40], [45, 55], [30, 42]])
q = np.array([28, 45])
jarak = np.sqrt(((P - q) ** 2).sum(axis=1))
terdekat = jarak.argmin()
print(jarak.round(2))
print(terdekat)`,
    tests: [
      { desc: "jarak berisi 3 nilai", expr: "jarak.shape == (3,)" },
      { desc: "jarak ke pelanggan 0 benar", expr: "abs(jarak[0] - (9 + 25) ** 0.5) < 1e-9" },
      { desc: "terdekat == 2", expr: "terdekat == 2" },
      { desc: "Tanpa loop", expr: "'for ' not in _code" },
    ],
    hints: ["Konsep: broadcasting + sqrt + sum per baris.", "`P - q` mengurangkan q dari setiap baris.", "`np.sqrt(((P - q) ** 2).sum(axis=1))`"],
    explanation: "Inilah langkah inti KNN: hitung jarak ke semua data, lalu ambil yang terdekat.",
  },
  summary: [
    "Ufunc (`np.sqrt`, `np.exp`, `np.log`, …) bekerja element-wise; jangan pakai `math` untuk array.",
    "`np.log1p`/`np.expm1` untuk transformasi data miring yang mengandung 0.",
    "Sigmoid = 1 / (1 + e^(−z)) mengubah skor menjadi probabilitas.",
    "`np.round`, `np.floor`, `np.ceil` untuk pembulatan; `np.clip`/`np.maximum` untuk membatasi.",
  ],
  cheatsheet: [
    { syntax: "np.sqrt(a)", desc: "Akar" },
    { syntax: "np.log1p(a), np.expm1(a)", desc: "Log transform & kebalikannya" },
    { syntax: "1 / (1 + np.exp(-z))", desc: "Sigmoid" },
    { syntax: "np.clip(a, lo, hi)", desc: "Batasi rentang" },
    { syntax: "np.sqrt(((P - q) ** 2).sum(axis=1))", desc: "Jarak Euclidean" },
  ],
  flashcards: [
    { q: "Log transform aman untuk nilai 0", a: "np.log1p(x)" },
    { q: "Batasi prediksi ke rentang 0–500", a: "np.clip(pred, 0, 500)" },
    { q: "Rumus sigmoid dengan NumPy", a: "1 / (1 + np.exp(-z))" },
  ],
  references: [
    numpyDoc("Mathematical functions", "reference/routines.math.html"),
    numpyDoc("Universal functions (ufunc) basics", "user/basics.ufuncs.html"),
    numpyDoc("numpy.log1p", "reference/generated/numpy.log1p.html"),
    numpyDoc("numpy.clip", "reference/generated/numpy.clip.html"),
    { source: "Google Machine Learning Crash Course", title: "Logistic regression: Calculating a probability with the sigmoid function", url: "https://developers.google.com/machine-learning/crash-course/logistic-regression/sigmoid-function" },
  ],
};
