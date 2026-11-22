import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-indexing",
  title: "Indexing",
  minutes: 40,
  prerequisites: ["np-array-shape", "py-list"],
  objectives: [
    "Mengambil satu elemen array 1D dengan index positif dan negatif.",
    "Mengambil elemen array 2D dengan notasi `arr[baris, kolom]`.",
    "Mengambil satu baris atau satu kolom penuh dengan `:`.",
    "Mengambil beberapa elemen sekaligus dengan fancy indexing (list index).",
    "Mengubah nilai elemen melalui indexing.",
  ],
  definition: [
    "**Indexing** adalah cara menunjuk elemen tertentu di dalam array. Untuk array 1D aturannya sama dengan list: index dimulai dari 0, dan index negatif dihitung dari belakang.",
    "Untuk array 2D, NumPy memakai **satu pasang kurung dengan koma**: `arr[i, j]` = baris ke-i, kolom ke-j. Ini lebih ringkas daripada `arr[i][j]` ala list bersarang.",
    "Tanda `:` berarti \"semua\" pada dimensi tersebut: `arr[2, :]` = seluruh baris 2, `arr[:, 1]` = seluruh kolom 1.",
    "**Fancy indexing**: memberikan list/array berisi index untuk mengambil banyak elemen sekaligus, misalnya `arr[[0, 2, 4]]`.",
  ],
  why: [
    "Indexing dipakai untuk mengambil satu fitur dari X (`X[:, 0]`), satu sampel (`X[5]`), atau probabilitas kelas positif dari `predict_proba` (`proba[:, 1]`) — pola yang akan sangat sering kamu tulis.",
  ],
  when: [
    "- Mengambil satu nilai, satu baris, atau satu kolom tertentu.",
    "- Memilih sampel tertentu berdasarkan daftar index (misalnya sampel yang salah diprediksi).",
    "- Mengubah nilai tertentu (misalnya mengganti nilai aneh).",
  ],
  analogy: "Array 2D seperti **kursi bioskop**: `arr[baris, kolom]` sama dengan tiket \"baris C, kursi 7\". `arr[:, 7]` berarti semua kursi nomor 7 di setiap baris — satu kolom penuh.",
  syntax: {
    code: `a[0], a[-1]          # 1D
X[i, j]              # 2D: baris i, kolom j
X[i]  atau  X[i, :]  # satu baris
X[:, j]              # satu kolom
a[[0, 2, 4]]         # fancy indexing`,
  },
  anatomy: [
    ["X[i, j]", "Satu elemen pada baris i, kolom j."],
    [":", "Semua elemen pada dimensi itu."],
    ["X[:, 1]", "Kolom index 1 (fitur kedua) untuk semua baris."],
    ["a[[0, 2]]", "Kurung siku ganda: list index di dalam indexing."],
  ],
  examples: [
    {
      title: "Contoh 1 — Indexing array 1D",
      code: `import numpy as np

skor = np.array([0.81, 0.88, 0.79, 0.90, 0.85])
print(skor[0])
print(skor[-1])
print(skor[2] + skor[3])`,
      output: "0.81\n0.85\n1.69",
      explain: [
        ["skor[0]", "Elemen pertama."],
        ["skor[-1]", "Elemen terakhir."],
        ["skor[2] + skor[3]", "Elemen hasil indexing adalah angka biasa yang bisa dihitung."],
      ],
    },
    {
      title: "Contoh 2 — Indexing array 2D",
      code: `import numpy as np

X = np.array([[5.1, 3.5, 1.4],
              [4.9, 3.0, 1.4],
              [6.2, 3.4, 5.4]])
print(X[0, 1])
print(X[2, -1])
print(X[1])
print(X[:, 0])`,
      output: "3.5\n5.4\n[4.9 3.  1.4]\n[5.1 4.9 6.2]",
      explain: [
        ["X[0, 1]", "Baris 0, kolom 1 → 3.5."],
        ["X[2, -1]", "Baris 2, kolom terakhir → 5.4."],
        ["X[1]", "Satu baris penuh (sampel kedua)."],
        ["X[:, 0]", "Kolom 0 untuk semua baris — satu fitur."],
      ],
      change: "Sekarang array punya dua dimensi sehingga butuh dua index.",
    },
    {
      title: "Contoh 3 — Fancy indexing",
      code: `import numpy as np

nama = np.array(["Andi", "Budi", "Citra", "Dewi", "Eko"])
nilai = np.array([85, 78, 92, 88, 70])

idx = [0, 2, 3]
print(nama[idx])
print(nilai[idx])
urutan = np.argsort(nilai)[::-1]
print(nama[urutan])`,
      output: "['Andi' 'Citra' 'Dewi']\n[85 92 88]\n['Citra' 'Dewi' 'Andi' 'Budi' 'Eko']",
      explain: [
        ["idx = [0, 2, 3]", "Daftar posisi yang ingin diambil."],
        ["nama[idx]", "Mengambil beberapa elemen sekaligus."],
        ["np.argsort(nilai)[::-1]", "`argsort` memberi index yang mengurutkan nilai dari kecil; `[::-1]` membalik agar dari besar."],
        ["nama[urutan]", "Fancy indexing untuk menyusun nama berdasarkan peringkat nilai."],
      ],
      change: "Index tidak harus satu angka — bisa daftar index.",
    },
    {
      title: "Contoh 4 — Mengubah nilai lewat index & probabilitas kelas",
      code: `import numpy as np

suhu = np.array([30.5, 31.0, -999.0, 29.8])
suhu[2] = np.nan
print(suhu)

proba = np.array([[0.9, 0.1],
                  [0.3, 0.7],
                  [0.45, 0.55]])
p_positif = proba[:, 1]
print(p_positif)`,
      output: "[30.5 31.   nan 29.8]\n[0.1  0.7  0.55]",
      explain: [
        ["suhu[2] = np.nan", "Nilai sensor yang tidak valid (-999) diganti `np.nan` (Not a Number) sebagai penanda missing."],
        ["proba[:, 1]", "Output `predict_proba` berbentuk (sampel, kelas). Kolom 1 = probabilitas kelas positif."],
      ],
      change: "Indexing juga dipakai untuk menulis nilai dan untuk membaca hasil model.",
    },
  ],
  params: [
    {
      title: "Bentuk indexing",
      items: [
        { name: "a[i]", desc: "Elemen i (1D) atau baris i (2D)." },
        { name: "X[i, j]", desc: "Elemen baris i kolom j." },
        { name: "X[:, j]", desc: "Kolom j → array 1D." },
        { name: "a[[i1, i2]]", desc: "Fancy indexing; hasilnya salinan (copy)." },
        { name: "np.argsort(a)", desc: "Index yang akan mengurutkan a dari kecil ke besar." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nm = np.arange(9).reshape(3, 3)\nprint(m[1, 2], m[:, 2], m[[0, 2], 0])`, output: "5 [2 5 8] [0 6]" },
  tryIt: `import numpy as np
import pandas as pd

X = pd.read_csv("iris.csv").drop(columns="species").to_numpy()
print("Sampel pertama:", X[0])
print("Petal length 5 sampel pertama:", X[:5, 2])
print("Nilai baris 50, kolom 3:", X[50, 3])`,
  mistakes: [
    {
      title: "Index di luar jangkauan",
      wrong: `import numpy as np
X = np.zeros((3, 2))
print(X[0, 2])`,
      error: "IndexError",
      fix: `import numpy as np
X = np.zeros((3, 2))
print(X[0, 1])`,
      explain: "Kolom yang tersedia hanya 0 dan 1. Cek `X.shape` sebelum mengakses.",
    },
    {
      title: "Lupa kurung ganda pada fancy indexing",
      wrong: `import numpy as np
a = np.array([10, 20, 30, 40])
print(a[0, 2])`,
      error: "IndexError",
      fix: `import numpy as np
a = np.array([10, 20, 30, 40])
print(a[[0, 2]])`,
      explain: "`a[0, 2]` berarti baris 0 kolom 2 (butuh array 2D). Untuk beberapa elemen 1D gunakan list: `a[[0, 2]]`.",
    },
    {
      title: "Memasukkan NaN ke array integer",
      wrong: `import numpy as np
a = np.array([1, 2, 3])
a[0] = np.nan`,
      error: "ValueError",
      fix: `import numpy as np
a = np.array([1, 2, 3], dtype=float)
a[0] = np.nan
print(a)`,
      explain: "NaN adalah nilai float. Array integer tidak bisa menyimpannya — ubah dtype menjadi float.",
    },
  ],
  bestPractices: [
    "Gunakan `X[i, j]` (satu kurung) daripada `X[i][j]` untuk array NumPy.",
    "Simpan hasil `X[:, j]` ke variabel bernama jelas, misalnya `petal_length = X[:, 2]`.",
    "Ingat: `predict_proba(X)[:, 1]` = probabilitas kelas positif.",
    "Gunakan `np.nan` (bukan -999 atau 0) untuk menandai nilai hilang.",
  ],
  exercises: [
    {
      id: "np-idx-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Ambil satu kolom",
      prompt: "Lengkapi agar `kolom2` berisi kolom index 2 dari `X` untuk semua baris.",
      starter: `import numpy as np
X = np.arange(12).reshape(4, 3)
kolom2 = X[____]
print(kolom2)`,
      solution: `import numpy as np
X = np.arange(12).reshape(4, 3)
kolom2 = X[:, 2]
print(kolom2)`,
      tests: [{ desc: "kolom2 == [2, 5, 8, 11]", expr: "list(kolom2) == [2, 5, 8, 11]" }],
      hints: ["Konsep: `:` berarti semua baris.", "Format: [baris, kolom].", "`X[:, 2]`"],
      explanation: "`:` memilih semua baris, `2` memilih kolom ketiga.",
    },
    {
      id: "np-idx-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
m = np.array([[1, 2, 3],
              [4, 5, 6]])
print(m[1, 0])
print(m[0])
print(m[:, -1])`,
      answer: "4\n[1 2 3]\n[3 6]",
      hints: ["Konsep: [baris, kolom].", "m[0] = baris pertama.", "m[:, -1] = kolom terakhir."],
      explanation: "m[1, 0] = 4; baris 0 = [1 2 3]; kolom terakhir = [3 6].",
    },
    {
      id: "np-idx-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Ganti nilai sensor rusak",
      prompt: "Kode ini error. Perbaiki agar elemen index 1 diganti `np.nan` dan array dicetak.",
      starter: `import numpy as np
pm25 = np.array([55, -1, 60, 58])
pm25[1] = np.nan
print(pm25)`,
      solution: `import numpy as np
pm25 = np.array([55, -1, 60, 58], dtype=float)
pm25[1] = np.nan
print(pm25)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "pm25[1] adalah NaN", expr: "__import__('numpy').isnan(pm25[1])" },
        { desc: "Nilai lain tetap", expr: "pm25[0] == 55 and pm25[3] == 58" },
      ],
      hints: ["Konsep: NaN hanya bisa disimpan di array float.", "Atur dtype saat membuat array.", "`np.array([...], dtype=float)`"],
      explanation: "Array integer tidak bisa menyimpan NaN (ValueError). Dengan dtype float, NaN bisa disimpan.",
    },
    {
      id: "np-idx-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Probabilitas kelas positif",
      prompt: "Diberikan `proba` berbentuk (4, 2) hasil `predict_proba`. Ambil probabilitas kelas positif (kolom 1) ke `p1`, lalu buat `pred = (p1 >= 0.5).astype(int)`. Cetak `pred`.",
      starter: `import numpy as np
proba = np.array([[0.8, 0.2], [0.4, 0.6], [0.55, 0.45], [0.1, 0.9]])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
proba = np.array([[0.8, 0.2], [0.4, 0.6], [0.55, 0.45], [0.1, 0.9]])
p1 = proba[:, 1]
pred = (p1 >= 0.5).astype(int)
print(pred)`,
      tests: [
        { desc: "p1 benar", expr: "list(p1) == [0.2, 0.6, 0.45, 0.9]" },
        { desc: "pred == [0, 1, 0, 1]", expr: "list(pred) == [0, 1, 0, 1]" },
      ],
      hints: ["Konsep: kolom kelas positif.", "`p1 = proba[:, 1]`", "Bandingkan dengan threshold lalu `.astype(int)`."],
      explanation: "Inilah yang dilakukan `model.predict()` untuk klasifikasi biner dengan threshold 0.5.",
    },
    {
      id: "np-idx-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Tiga sampel dengan alkohol tertinggi",
      prompt: [
        "Baca `winequality-red.csv` (sep `;`) menjadi `X = df.to_numpy()`. Kolom `alcohol` ada di index 10 dan `quality` di index 11.",
        "Dengan `np.argsort`, cari index 3 anggur dengan alkohol tertinggi (`top3`, urut dari tertinggi), lalu cetak nilai quality ketiganya.",
      ],
      starter: `import numpy as np
import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
X = df.to_numpy()
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
X = df.to_numpy()
alcohol = X[:, 10]
top3 = np.argsort(alcohol)[::-1][:3]
print(X[top3, 11])`,
      tests: [
        { desc: "top3 berisi 3 index", expr: "len(top3) == 3" },
        { desc: "top3 adalah alkohol tertinggi", expr: "sorted(X[top3, 10].tolist(), reverse=True) == sorted(X[:, 10].tolist(), reverse=True)[:3]" },
        { desc: "Memakai argsort", expr: "'argsort' in _code" },
      ],
      hints: ["Konsep: argsort + fancy indexing.", "`np.argsort(alcohol)[::-1]` mengurutkan dari terbesar.", "Ambil `[:3]` lalu `X[top3, 11]`."],
      explanation: "Kombinasi argsort dan fancy indexing sering dipakai untuk melihat sampel ekstrem atau prediksi paling yakin.",
    },
  ],
  quiz: [
    { id: "np-idx-q1", type: "mcq", prompt: "Cara mengambil seluruh kolom index 3 dari matriks X?", options: ["X[3]", "X[:, 3]", "X[3, :]", "X[[3]]"], answer: 1, explanation: "`:` untuk semua baris, 3 untuk kolom." },
    { id: "np-idx-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\na = np.array([5, 10, 15, 20])\nprint(a[[3, 0]])`, options: ["[20, 5]", "[20  5]", "20 5", "Error"], answer: 1, explanation: "Fancy indexing mengambil index 3 lalu 0." },
    { id: "np-idx-q3", type: "tf", prompt: "Pada NumPy, `X[1, 2]` dan `X[1][2]` memberi hasil yang sama untuk array 2D.", answer: true, explanation: "Hasilnya sama, tetapi `X[1, 2]` lebih ringkas dan efisien." },
    { id: "np-idx-q4", type: "fill", prompt: "Fungsi NumPy yang mengembalikan index pengurut array (dari kecil ke besar) adalah `np.____()`", answer: ["argsort"], explanation: "`np.argsort(a)`." },
    { id: "np-idx-q5", type: "case", prompt: "`proba = model.predict_proba(X_test)` berbentuk (100, 2). Cara mengambil probabilitas kelas 1?", options: ["proba[1]", "proba[:, 1]", "proba[1, :]", "proba[-1]"], answer: 1, explanation: "Kolom = kelas, baris = sampel." },
  ],
  challenge: {
    id: "np-idx-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Prediksi yang salah",
    prompt: [
      "Diberikan `y_true = np.array([1, 0, 1, 1, 0, 1, 0])` dan `y_pred = np.array([1, 0, 0, 1, 1, 1, 0])`.",
      "Buat list `salah` berisi index di mana prediksi berbeda dari label asli (gunakan loop atau `np.where(y_true != y_pred)[0]`).",
      "Ambil label asli pada index tersebut dengan fancy indexing ke `label_salah`. Cetak `Index salah: [2 4]` dan `Label asli: [1 0]`.",
    ],
    starter: `import numpy as np
y_true = np.array([1, 0, 1, 1, 0, 1, 0])
y_pred = np.array([1, 0, 0, 1, 1, 1, 0])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
y_true = np.array([1, 0, 1, 1, 0, 1, 0])
y_pred = np.array([1, 0, 0, 1, 1, 1, 0])
salah = np.where(y_true != y_pred)[0]
label_salah = y_true[salah]
print("Index salah:", salah)
print("Label asli:", label_salah)`,
    tests: [
      { desc: "salah berisi index 2 dan 4", expr: "list(salah) == [2, 4]" },
      { desc: "label_salah == [1, 0]", expr: "list(label_salah) == [1, 0]" },
      { desc: "Output sesuai", expr: "_lines == ['Index salah: [2 4]', 'Label asli: [1 0]']" },
    ],
    hints: ["Konsep: mencari posisi, lalu fancy indexing.", "`np.where(kondisi)[0]` memberi index elemen yang True.", "`y_true[salah]`"],
    explanation: "Index 2 adalah false negative (asli 1, diprediksi 0) dan index 4 false positive. Menganalisis kesalahan seperti ini membantu memperbaiki model.",
  },
  summary: [
    "1D: `a[i]`, index negatif dari belakang.",
    "2D: `X[baris, kolom]`; `X[i]` satu baris; `X[:, j]` satu kolom.",
    "Fancy indexing: `a[[i1, i2, …]]`.",
    "`np.argsort` memberi index pengurut; `np.where(kondisi)[0]` memberi index yang memenuhi kondisi.",
    "NaN butuh array float.",
  ],
  cheatsheet: [
    { syntax: "X[i, j]", desc: "Satu elemen" },
    { syntax: "X[:, j]", desc: "Satu kolom" },
    { syntax: "a[[0, 2, 4]]", desc: "Fancy indexing" },
    { syntax: "np.argsort(a)[::-1]", desc: "Index dari terbesar" },
    { syntax: "proba[:, 1]", desc: "Probabilitas kelas positif" },
  ],
  flashcards: [
    { q: "Ambil kolom ke-0 dari semua baris matriks X", a: "X[:, 0]" },
    { q: "Ambil elemen index 1, 3, 5 dari array a", a: "a[[1, 3, 5]]" },
    { q: "Index elemen yang memenuhi kondisi y_true != y_pred", a: "np.where(y_true != y_pred)[0]" },
  ],
  references: [
    numpyDoc("Indexing on ndarrays", "user/basics.indexing.html"),
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
    numpyDoc("numpy.argsort", "reference/generated/numpy.argsort.html"),
    numpyDoc("numpy.where", "reference/generated/numpy.where.html"),
  ],
};
