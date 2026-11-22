import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-broadcasting",
  title: "Broadcasting",
  minutes: 45,
  prerequisites: ["np-array-shape", "np-reshaping-arrays", "np-array-operations"],
  visual: "standardization",
  objectives: [
    "Memahami aturan broadcasting NumPy untuk operasi antar-array berbeda shape.",
    "Memprediksi shape hasil operasi atau mendeteksi kapan broadcasting gagal.",
    "Memakai `reshape`/`np.newaxis`/`keepdims=True` agar shape kompatibel.",
    "Menerapkan broadcasting untuk scaling fitur, normalisasi baris, dan matriks jarak.",
  ],
  definition: [
    "**Broadcasting** adalah cara NumPy menjalankan operasi element-wise pada array dengan shape berbeda, dengan \"merentangkan\" array yang lebih kecil secara virtual (tanpa benar-benar menyalin data).",
    "Aturannya (dari dokumentasi resmi NumPy): bandingkan shape kedua array **dari dimensi paling kanan**. Dua dimensi kompatibel jika:\n1. sama besar, atau\n2. salah satunya bernilai 1.\nJika salah satu array punya dimensi lebih sedikit, ia dianggap memiliki dimensi 1 di sebelah kiri.",
    "Contoh: `(3, 4) + (4,)` → (4,) dianggap (1, 4) → direntangkan menjadi (3, 4) ✔. `(3, 4) + (3,)` → bandingkan 4 dengan 3 ✘ → ValueError. `(3, 1) + (1, 4)` → hasil (3, 4) ✔.",
    "Operasi dengan skalar (`arr * 2`) sebenarnya juga broadcasting: skalar dianggap shape () dan direntangkan ke semua elemen.",
  ],
  why: [
    "Broadcasting membuat preprocessing ringkas dan cepat: `(X - X.mean(axis=0)) / X.std(axis=0)` menstandardisasi semua fitur sekaligus — mean berbentuk (n_fitur,) direntangkan ke setiap baris.",
    "Banyak bug \"diam-diam\" di ML berasal dari broadcasting yang tidak disengaja: `y` shape (n, 1) dikurangi `y_pred` shape (n,) menghasilkan matriks (n, n), bukan error per data. Memahami aturannya mencegah kesalahan ini.",
  ],
  when: [
    "- Scaling/normalisasi per kolom atau per baris.",
    "- Menambahkan bias ke setiap baris.",
    "- Menghitung jarak semua pasangan titik (KNN, K-Means).",
    "- Membuat tabel kombinasi (perkalian, grid).",
  ],
  analogy: "Bayangkan tabel nilai 3 siswa × 4 mata pelajaran, dan guru ingin menambah bonus berbeda untuk setiap mata pelajaran. Cukup tulis bonusnya **sekali** dalam satu baris — NumPy akan \"menyalin\" baris bonus itu ke bawah untuk setiap siswa secara otomatis.",
  syntax: {
    code: `X.shape        # (n, m)
X - X.mean(axis=0)                  # (n, m) - (m,)   → per kolom
X / X.sum(axis=1, keepdims=True)    # (n, m) / (n, 1) → per baris
a[:, np.newaxis] + b                # (n, 1) + (k,)   → (n, k)`,
  },
  anatomy: [
    ["(n, m) op (m,)", "Vektor diterapkan ke setiap baris."],
    ["(n, m) op (n, 1)", "Kolom diterapkan ke setiap kolom (per baris)."],
    ["keepdims=True", "Agregasi mempertahankan dimensi sehingga hasilnya (n, 1), bukan (n,)."],
    ["np.newaxis", "Menambah dimensi berukuran 1 (sama dengan None)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Skalar dan vektor",
      code: `import numpy as np

nilai = np.array([[70, 80, 90, 60],
                  [85, 75, 95, 70],
                  [60, 90, 80, 85]])   # 3 siswa × 4 mapel
print(nilai + 5)                         # skalar
bonus = np.array([0, 5, 0, 10])          # bonus per mapel
print(nilai.shape, bonus.shape)
print(nilai + bonus)`,
      output: "[[ 75  85  95  65]\n [ 90  80 100  75]\n [ 65  95  85  90]]\n(3, 4) (4,)\n[[70 85 90 70]\n [85 80 95 80]\n [60 95 80 95]]",
      explain: [
        ["nilai + 5", "Skalar direntangkan ke semua elemen."],
        ["bonus = np.array([0, 5, 0, 10])", "Shape (4,) cocok dengan dimensi terakhir (4)."],
        ["nilai + bonus", "Baris bonus ditambahkan ke setiap siswa → hasil (3, 4)."],
      ],
    },
    {
      title: "Contoh 2 — Per kolom vs per baris (keepdims)",
      code: `import numpy as np

X = np.array([[1.0, 2.0, 7.0],
              [4.0, 4.0, 2.0]])
# Per kolom: kurangi mean setiap fitur
print(X - X.mean(axis=0))

# Per baris: ubah setiap baris menjadi proporsi
total = X.sum(axis=1, keepdims=True)
print(total.shape)
print((X / total).round(2))`,
      output: "[[-1.5 -1.   2.5]\n [ 1.5  1.  -2.5]]\n(2, 1)\n[[0.1 0.2 0.7]\n [0.4 0.4 0.2]]",
      explain: [
        ["X - X.mean(axis=0)", "(2, 3) − (3,) → setiap kolom dikurangi mean-nya."],
        ["X.sum(axis=1, keepdims=True)", "Total per baris dengan shape (2, 1)."],
        ["X / total", "(2, 3) / (2, 1) → setiap baris dibagi totalnya sendiri; jumlah setiap baris menjadi 1."],
      ],
      change: "Arah broadcasting dikendalikan oleh shape: (m,) untuk kolom, (n, 1) untuk baris.",
    },
    {
      title: "Contoh 3 — Saat broadcasting gagal dan cara memperbaikinya",
      code: `import numpy as np

X = np.ones((3, 4))
per_baris = np.array([10, 20, 30])        # (3,)
try:
    X * per_baris
except ValueError as e:
    print("Error:", e)

print((X * per_baris.reshape(3, 1)).shape)
print(X * per_baris[:, np.newaxis])`,
      output: "Error: operands could not be broadcast together with shapes (3,4) (3,) \n(3, 4)\n[[10. 10. 10. 10.]\n [20. 20. 20. 20.]\n [30. 30. 30. 30.]]",
      explain: [
        ["X * per_baris", "Bandingkan dari kanan: 4 vs 3 → tidak kompatibel."],
        ["per_baris.reshape(3, 1)", "Ubah menjadi kolom (3, 1) → kompatibel dengan (3, 4)."],
        ["per_baris[:, np.newaxis]", "Cara lain menambah dimensi berukuran 1."],
      ],
      change: "Kita sengaja membuat shape tidak cocok, lalu memperbaikinya.",
    },
    {
      title: "Contoh 4 — Bug tersembunyi: (n, 1) vs (n,)",
      code: `import numpy as np

y_true = np.array([[3.0], [5.0], [7.0]])   # (3, 1), misalnya hasil reshape
y_pred = np.array([2.5, 5.0, 8.0])         # (3,)

salah = y_true - y_pred
print("Shape salah:", salah.shape)
print("MAE salah:", np.abs(salah).mean().round(3))

benar = y_true.ravel() - y_pred
print("Shape benar:", benar.shape)
print("MAE benar:", np.abs(benar).mean().round(3))`,
      output: "Shape salah: (3, 3)\nMAE salah: 2.278\nShape benar: (3,)\nMAE benar: 0.5",
      explain: [
        ["salah = y_true - y_pred", "(3, 1) − (3,) → broadcasting menjadi (3, 3): setiap y_true dikurangi SEMUA prediksi. Tidak ada error!"],
        ["np.abs(salah).mean()", "MAE yang dihasilkan keliru."],
        ["y_true.ravel() - y_pred", "Ratakan dulu menjadi (3,) sehingga pengurangan per data."],
      ],
      change: "Broadcasting yang tidak disengaja menghasilkan angka salah tanpa error — selalu cek shape.",
    },
  ],
  params: [
    {
      title: "Alat bantu shape",
      items: [
        { name: "a.reshape(-1, 1)", desc: "Menjadi kolom (n, 1)." },
        { name: "a[:, np.newaxis] / a[np.newaxis, :]", desc: "Tambah dimensi 1 di kanan/kiri." },
        { name: "agg(axis=..., keepdims=True)", desc: "Hasil agregasi mempertahankan dimensi." },
        { name: "np.broadcast_shapes(s1, s2)", desc: "Cek shape hasil broadcasting tanpa menghitung." },
        { name: "a.ravel()", desc: "Ratakan menjadi 1D." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nprint(np.broadcast_shapes((3, 1), (4,)), (np.arange(3)[:, None] * np.arange(4)).shape)`, output: "(3, 4) (3, 4)" },
  tryIt: `import numpy as np

# Tabel perkalian 1–5 dengan broadcasting
a = np.arange(1, 6)
print(a[:, np.newaxis] * a)
# Coba: a[:, np.newaxis] + a`,
  mistakes: [
    {
      title: "Membagi per baris dengan vektor (n,)",
      wrong: `import numpy as np
X = np.array([[1.0, 3.0], [2.0, 2.0], [5.0, 5.0]])
print(X / X.sum(axis=1))`,
      error: "ValueError",
      fix: `import numpy as np
X = np.array([[1.0, 3.0], [2.0, 2.0], [5.0, 5.0]])
print(X / X.sum(axis=1, keepdims=True))`,
      explain: "`X.sum(axis=1)` shape (3,) dibandingkan dengan dimensi terakhir X (2) → gagal. `keepdims=True` memberi (3, 1).",
    },
    {
      title: "Selisih (n, 1) dan (n,) membuat matriks",
      wrong: `import numpy as np
y = np.array([1.0, 2.0, 3.0]).reshape(-1, 1)
p = np.array([1.0, 2.0, 3.0])
print((y - p).shape)   # (3, 3), bukan (3,)`,
      fix: `import numpy as np
y = np.array([1.0, 2.0, 3.0]).reshape(-1, 1)
p = np.array([1.0, 2.0, 3.0])
print((y.ravel() - p).shape)`,
      explain: "Pastikan kedua array 1D sebelum menghitung error.",
    },
    {
      title: "Mengira broadcasting mencocokkan dari kiri",
      wrong: `import numpy as np
X = np.zeros((2, 3))
print(X + np.array([1, 2]))`,
      error: "ValueError",
      fix: `import numpy as np
X = np.zeros((2, 3))
print(X + np.array([1, 2])[:, None])`,
      explain: "Pencocokan dimulai dari dimensi paling kanan; (2,) dibandingkan dengan 3. Ubah menjadi (2, 1) untuk operasi per baris.",
    },
  ],
  bestPractices: [
    "Tulis atau cetak shape setiap array sebelum operasi antar-array.",
    "Gunakan `keepdims=True` saat hasil agregasi akan dipakai kembali untuk operasi per baris.",
    "Ratakan target dan prediksi menjadi 1D (`ravel`) sebelum menghitung metrik.",
    "Hindari broadcasting yang menghasilkan array sangat besar (misalnya (100000, 100000)) — memori bisa habis.",
  ],
  exercises: [
    {
      id: "np-bc-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Normalisasi per baris",
      prompt: "Lengkapi agar setiap baris `X` dibagi dengan totalnya sendiri.",
      starter: `import numpy as np
X = np.array([[2.0, 2.0], [1.0, 3.0]])
P = X / X.sum(axis=1, ____=True)
print(P)`,
      solution: `import numpy as np
X = np.array([[2.0, 2.0], [1.0, 3.0]])
P = X / X.sum(axis=1, keepdims=True)
print(P)`,
      tests: [
        { desc: "Setiap baris berjumlah 1", expr: "list(P.sum(axis=1)) == [1.0, 1.0]" },
        { desc: "P[1] == [0.25, 0.75]", expr: "list(P[1]) == [0.25, 0.75]" },
      ],
      hints: ["Konsep: agregasi yang mempertahankan dimensi.", "Hasil harus shape (2, 1).", "`keepdims=True`"],
      explanation: "keepdims membuat total per baris berbentuk kolom sehingga broadcasting berlaku per baris.",
    },
    {
      id: "np-bc-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output (shape hasil setiap operasi).",
      code: `import numpy as np
print((np.ones((4, 3)) + np.ones(3)).shape)
print((np.ones((4, 1)) * np.ones((1, 5))).shape)
print((np.ones((2, 1, 3)) + np.ones((4, 1))).shape)`,
      answer: "(4, 3)\n(4, 5)\n(2, 4, 3)",
      hints: ["Konsep: aturan broadcasting dari kanan.", "Dimensi 1 direntangkan.", "(2, 1, 3) dan (4, 1) → (1, 4, 1) → hasil (2, 4, 3)."],
      explanation: "(4, 3); (4, 5); (2, 4, 3).",
    },
    {
      id: "np-bc-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — MAE salah",
      prompt: "MAE yang dihasilkan salah karena broadcasting tidak disengaja (tidak ada error!). Perbaiki agar `mae` = 0.5.",
      starter: `import numpy as np
y_true = np.array([1.0, 2.0, 3.0, 4.0]).reshape(-1, 1)
y_pred = np.array([1.5, 2.5, 2.5, 4.5])
mae = np.abs(y_true - y_pred).mean()
print(mae)`,
      solution: `import numpy as np
y_true = np.array([1.0, 2.0, 3.0, 4.0]).reshape(-1, 1)
y_pred = np.array([1.5, 2.5, 2.5, 4.5])
mae = np.abs(y_true.ravel() - y_pred).mean()
print(mae)`,
      tests: [{ desc: "mae == 0.5", expr: "mae == 0.5" }],
      hints: ["Konsep: (n, 1) − (n,) menjadi (n, n).", "Ratakan y_true.", "`y_true.ravel()`"],
      explanation: "Setelah diratakan, pengurangan dilakukan per pasangan data.",
    },
    {
      id: "np-bc-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Min-Max scaling per fitur",
      prompt: "Skalakan setiap kolom `X` ke rentang 0–1: `(X - min) / (max - min)` dengan min/max per kolom (axis=0). Simpan di `X_scaled` dan cetak.",
      starter: `import numpy as np
X = np.array([[10.0, 200.0], [20.0, 400.0], [30.0, 300.0]])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
X = np.array([[10.0, 200.0], [20.0, 400.0], [30.0, 300.0]])
mn = X.min(axis=0)
mx = X.max(axis=0)
X_scaled = (X - mn) / (mx - mn)
print(X_scaled)`,
      tests: [
        { desc: "Min per kolom = 0", expr: "list(X_scaled.min(axis=0)) == [0.0, 0.0]" },
        { desc: "Max per kolom = 1", expr: "list(X_scaled.max(axis=0)) == [1.0, 1.0]" },
        { desc: "Nilai tengah benar", expr: "list(X_scaled[1]) == [0.5, 1.0]" },
      ],
      hints: ["Konsep: broadcasting (n, m) dengan (m,).", "`X.min(axis=0)` memberi min setiap kolom.", "`(X - mn) / (mx - mn)`"],
      explanation: "Inilah rumus `MinMaxScaler` di scikit-learn.",
    },
    {
      id: "np-bc-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pola belanja per pelanggan",
      prompt: [
        "Baca `wholesale_customers.csv` dan ambil 6 kolom belanja sebagai `B` (shape (440, 6)).",
        "Hitung `porsi` = proporsi belanja setiap kategori terhadap total belanja pelanggan itu (per baris, gunakan `keepdims=True`). Lalu hitung `rata_porsi = porsi.mean(axis=0)` dan cetak dibulatkan 3 desimal.",
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
B = df[produk].to_numpy().astype(float)
porsi = B / B.sum(axis=1, keepdims=True)
rata_porsi = porsi.mean(axis=0)
print(rata_porsi.round(3))`,
      tests: [
        { desc: "porsi shape (440, 6)", expr: "porsi.shape == (440, 6)" },
        { desc: "Setiap baris berjumlah 1", expr: "abs(porsi.sum(axis=1) - 1).max() < 1e-9" },
        { desc: "rata_porsi berjumlah 1", expr: "abs(rata_porsi.sum() - 1) < 1e-9" },
      ],
      hints: ["Konsep: normalisasi per baris dengan broadcasting.", "`B.sum(axis=1, keepdims=True)` → (440, 1).", "`porsi.mean(axis=0)` merata-rata per kategori."],
      explanation: "Fitur proporsi seperti ini menangkap *pola* belanja (bukan besarnya), dan sering membuat hasil clustering lebih bermakna.",
    },
  ],
  quiz: [
    { id: "np-bc-q1", type: "mcq", prompt: "Shape hasil `np.ones((5, 3)) + np.ones((5, 1))`?", options: ["(5, 1)", "(5, 3)", "Error", "(5, 5)"], answer: 1, explanation: "Dimensi 1 direntangkan menjadi 3." },
    { id: "np-bc-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.array([[1], [2]]) + np.array([10, 20, 30]))`, options: ["[11 22 33]", "[[11 21 31]\n [12 22 32]]", "Error", "[[11 21 31]]"], answer: 1, explanation: "(2, 1) + (3,) → (2, 3)." },
    { id: "np-bc-q3", type: "tf", prompt: "Pencocokan dimensi broadcasting dimulai dari dimensi paling kiri.", answer: false, explanation: "Dimulai dari paling kanan." },
    { id: "np-bc-q4", type: "fill", prompt: "Agar `X.mean(axis=1)` berbentuk (n, 1), tambahkan argumen `____=True`", answer: ["keepdims"], explanation: "`keepdims=True`." },
    { id: "np-bc-q5", type: "case", prompt: "MAE modelmu tiba-tiba jauh lebih besar dari biasanya, padahal tidak ada error. Kamu baru saja mengubah y menjadi `y.reshape(-1, 1)`. Apa yang dicek pertama?", options: ["Ganti model", "Shape y dan y_pred — mungkin (n, 1) − (n,) menjadi (n, n)", "Tambah data", "Ubah learning rate"], answer: 1, explanation: "Broadcasting tidak disengaja adalah penyebab klasik." },
  ],
  challenge: {
    id: "np-bc-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Satu langkah K-Means",
    prompt: [
      "Diberikan titik `P` (6, 2) dan dua centroid `C` (2, 2). Tanpa loop:",
      "1. Hitung matriks jarak `D` shape (6, 2): jarak Euclidean setiap titik ke setiap centroid. Petunjuk: `P[:, np.newaxis, :] - C[np.newaxis, :, :]` berbentuk (6, 2, 2).\n2. `label = D.argmin(axis=1)` — centroid terdekat untuk setiap titik.\n3. `C_baru` = rata-rata titik di setiap cluster (boleh memakai list comprehension untuk 2 cluster).",
      "Cetak `label` dan `C_baru`.",
    ],
    starter: `import numpy as np
P = np.array([[1, 1], [1.5, 2], [2, 1], [8, 8], [9, 8.5], [8.5, 9]])
C = np.array([[0.0, 0.0], [10.0, 10.0]])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
P = np.array([[1, 1], [1.5, 2], [2, 1], [8, 8], [9, 8.5], [8.5, 9]])
C = np.array([[0.0, 0.0], [10.0, 10.0]])
D = np.sqrt(((P[:, np.newaxis, :] - C[np.newaxis, :, :]) ** 2).sum(axis=2))
label = D.argmin(axis=1)
C_baru = np.array([P[label == k].mean(axis=0) for k in range(len(C))])
print(label)
print(C_baru)`,
    tests: [
      { desc: "D shape (6, 2)", expr: "D.shape == (6, 2)" },
      { desc: "D[0, 0] = jarak (1,1) ke (0,0)", expr: "abs(D[0, 0] - 2 ** 0.5) < 1e-9" },
      { desc: "label benar", expr: "list(label) == [0, 0, 0, 1, 1, 1]" },
      { desc: "C_baru benar", expr: "abs(C_baru - __import__('numpy').array([[1.5, 4 / 3], [8.5, 8.5]])).max() < 1e-9" },
    ],
    hints: ["Konsep: broadcasting 3D untuk semua pasangan.", "(6, 1, 2) − (1, 2, 2) → (6, 2, 2); jumlahkan pada axis=2.", "Centroid baru: `P[label == k].mean(axis=0)`."],
    explanation: "Inilah satu iterasi algoritma K-Means: assign ke centroid terdekat, lalu perbarui centroid. Mengulanginya sampai label tidak berubah = K-Means lengkap (Module 13).",
  },
  summary: [
    "Broadcasting merentangkan array kecil agar cocok dengan array besar tanpa menyalin data.",
    "Bandingkan shape dari kanan: dimensi harus sama atau salah satunya 1.",
    "(n, m) op (m,) → per kolom; (n, m) op (n, 1) → per baris.",
    "Gunakan `reshape`, `np.newaxis`, `keepdims=True` untuk mengatur arah.",
    "Waspadai (n, 1) − (n,) yang diam-diam menjadi (n, n).",
  ],
  cheatsheet: [
    { syntax: "(X - X.mean(0)) / X.std(0)", desc: "Standardisasi per fitur" },
    { syntax: "X / X.sum(1, keepdims=True)", desc: "Normalisasi per baris" },
    { syntax: "a[:, None] * b", desc: "Tabel kombinasi (outer)" },
    { syntax: "np.broadcast_shapes(s1, s2)", desc: "Cek shape hasil" },
    { syntax: "y.ravel() - y_pred", desc: "Hindari (n, n)" },
  ],
  flashcards: [
    { q: "Aturan kompatibilitas broadcasting", a: "Dari kanan: dimensi sama, atau salah satunya 1" },
    { q: "Bagi setiap baris X dengan totalnya", a: "X / X.sum(axis=1, keepdims=True)" },
    { q: "Ubah vektor a (n,) menjadi kolom (n, 1)", a: "a[:, np.newaxis] atau a.reshape(-1, 1)" },
  ],
  references: [
    numpyDoc("Broadcasting", "user/basics.broadcasting.html"),
    numpyDoc("General broadcasting rules", "user/basics.broadcasting.html#general-broadcasting-rules"),
    numpyDoc("numpy.broadcast_shapes", "reference/generated/numpy.broadcast_shapes.html"),
    { source: "scikit-learn", title: "Preprocessing data — Standardization", url: "https://scikit-learn.org/stable/modules/preprocessing.html#standardization-or-mean-removal-and-variance-scaling" },
  ],
};
