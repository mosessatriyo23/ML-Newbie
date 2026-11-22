import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-array-dimensions",
  title: "Array Dimensions",
  minutes: 35,
  prerequisites: ["np-creating-arrays"],
  objectives: [
    "Memahami arti dimensi (axis) pada array: 0D, 1D, 2D, dan 3D.",
    "Memeriksa jumlah dimensi dengan atribut `ndim`.",
    "Menghubungkan dimensi dengan data nyata: satu nilai, satu fitur, tabel dataset, dan gambar.",
    "Memahami istilah axis 0 (baris) dan axis 1 (kolom).",
  ],
  definition: [
    "**Dimensi** (atau **axis**) adalah banyaknya \"arah\" yang dimiliki array. Jumlah dimensi bisa dicek dengan atribut `ndim`.",
    "- **0D (scalar)**: satu angka, misalnya `np.array(5)`.\n- **1D (vektor)**: deretan angka, misalnya nilai satu kolom `[80, 90, 75]`.\n- **2D (matriks)**: tabel baris × kolom — bentuk standar dataset ML (baris = sampel, kolom = fitur).\n- **3D**: tumpukan matriks, misalnya gambar berwarna (tinggi × lebar × 3 kanal RGB).",
    "Setiap dimensi diberi nomor mulai dari 0. Pada array 2D, **axis 0 berjalan ke bawah (antar-baris)** dan **axis 1 berjalan ke samping (antar-kolom)**. Banyak fungsi NumPy menerima parameter `axis` untuk menentukan arah perhitungan.",
  ],
  why: [
    "scikit-learn mewajibkan fitur `X` berbentuk **2D** (sampel × fitur) dan target `y` berbentuk **1D**. Error paling umum pemula — *Expected 2D array, got 1D array instead* — terjadi karena salah dimensi.",
    "Memahami axis membuatmu bisa menghitung rata-rata **per kolom** (per fitur) atau **per baris** (per sampel) dengan benar.",
  ],
  when: [
    "- Sebelum memasukkan data ke model: pastikan X 2D dan y 1D.",
    "- Saat hasil perhitungan berbentuk tidak terduga — cek `ndim`.",
    "- Saat bekerja dengan gambar atau data deret waktu berlapis (3D ke atas).",
  ],
  analogy: "Dimensi seperti **alamat**: 0D = satu rumah, 1D = deretan rumah di satu jalan (cukup nomor rumah), 2D = kompleks perumahan (perlu blok dan nomor), 3D = kota dengan banyak kompleks (perlu kompleks, blok, dan nomor). Semakin banyak dimensi, semakin banyak \"koordinat\" untuk menunjuk satu nilai.",
  syntax: {
    code: `arr.ndim          # jumlah dimensi
np.array(5)       # 0D
np.array([1, 2])  # 1D
np.array([[1, 2], [3, 4]])  # 2D
arr.sum(axis=0)   # jumlahkan ke bawah (per kolom)`,
  },
  anatomy: [
    ["ndim", "Atribut (tanpa kurung) yang berisi jumlah dimensi."],
    ["axis=0", "Arah ke bawah, melintasi baris → hasil per kolom."],
    ["axis=1", "Arah ke samping, melintasi kolom → hasil per baris."],
    ["[[...]]", "Jumlah kurung siku pembuka di awal = jumlah dimensi."],
  ],
  examples: [
    {
      title: "Contoh 1 — Dari 0D sampai 3D",
      code: `import numpy as np

skalar = np.array(42)
vektor = np.array([1, 2, 3])
matriks = np.array([[1, 2, 3], [4, 5, 6]])
tensor = np.zeros((2, 3, 4))

print(skalar.ndim, vektor.ndim, matriks.ndim, tensor.ndim)`,
      output: "0 1 2 3",
      explain: [
        ["skalar = np.array(42)", "Satu angka → 0 dimensi."],
        ["vektor = np.array([1, 2, 3])", "Satu kurung siku → 1 dimensi."],
        ["matriks = np.array([[1, 2, 3], [4, 5, 6]])", "Dua kurung siku → 2 dimensi."],
        ["tensor = np.zeros((2, 3, 4))", "Tuple ukuran berisi 3 angka → 3 dimensi."],
      ],
    },
    {
      title: "Contoh 2 — Dataset sebagai array 2D",
      code: `import numpy as np

# 4 siswa (baris) x 3 fitur (kolom): jam belajar, kehadiran, nilai lalu
X = np.array([
    [8.0, 97, 70],
    [4.9, 90, 87],
    [8.7, 75, 88],
    [7.3, 99, 67],
])
y = np.array([96, 89, 95, 95])

print("X:", X.ndim, "dimensi")
print("y:", y.ndim, "dimensi")`,
      output: "X: 2 dimensi\ny: 1 dimensi",
      explain: [
        ["X = np.array([", "Fitur: setiap baris satu sampel, setiap kolom satu fitur → 2D."],
        ["y = np.array([96, 89, 95, 95])", "Target: satu nilai per sampel → 1D."],
      ],
      change: "Kita melihat konvensi Machine Learning: X 2D, y 1D.",
    },
    {
      title: "Contoh 3 — axis: per kolom vs per baris",
      code: `import numpy as np

nilai = np.array([[80, 90, 70],
                  [60, 75, 85]])
print("Total semua:", nilai.sum())
print("Per kolom (axis=0):", nilai.sum(axis=0))
print("Per baris (axis=1):", nilai.sum(axis=1))
print("Rata-rata per kolom:", nilai.mean(axis=0))`,
      output: "Total semua: 460\nPer kolom (axis=0): [140 165 155]\nPer baris (axis=1): [240 220]\nRata-rata per kolom: [70.  82.5 77.5]",
      explain: [
        ["nilai.sum()", "Tanpa axis: seluruh elemen dijumlahkan."],
        ["nilai.sum(axis=0)", "Menjumlahkan **ke bawah** → satu hasil untuk setiap kolom."],
        ["nilai.sum(axis=1)", "Menjumlahkan **ke samping** → satu hasil untuk setiap baris."],
        ["nilai.mean(axis=0)", "Rata-rata per fitur — dipakai StandardScaler untuk scaling."],
      ],
      change: "Dimensi bukan hanya untuk dicek, tetapi juga menentukan arah perhitungan.",
    },
    {
      title: "Contoh 4 — 1D vs 2D yang terlihat mirip",
      code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([[1, 2, 3]])
c = np.array([[1], [2], [3]])
print(a.ndim, b.ndim, c.ndim)
print(a.shape, b.shape, c.shape)`,
      output: "1 2 2\n(3,) (1, 3) (3, 1)",
      explain: [
        ["a = np.array([1, 2, 3])", "Vektor 1D."],
        ["b = np.array([[1, 2, 3]])", "Matriks 1 baris × 3 kolom (2D)."],
        ["c = np.array([[1], [2], [3]])", "Matriks 3 baris × 1 kolom (2D) — bentuk yang diminta scikit-learn untuk satu fitur."],
      ],
      change: "Isi angkanya sama, tetapi dimensinya berbeda — ini sumber error *Expected 2D array*.",
    },
  ],
  params: [
    {
      title: "Parameter axis pada fungsi agregasi",
      items: [
        { name: "axis=None", default: "None", desc: "Hitung untuk seluruh elemen." },
        { name: "axis=0", desc: "Hitung ke bawah (melintasi baris) → hasil per kolom." },
        { name: "axis=1", desc: "Hitung ke samping (melintasi kolom) → hasil per baris." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nm = np.ones((3, 2))\nprint(m.ndim, m.sum(axis=0), m.sum(axis=1))`, output: "2 [3. 3.] [2. 2. 2.]" },
  tryIt: `import numpy as np

nilai = np.array([[80, 90, 70],
                  [60, 75, 85],
                  [95, 85, 90]])
print("Dimensi:", nilai.ndim)
print("Rata-rata tiap mata pelajaran:", nilai.mean(axis=0))
print("Rata-rata tiap siswa:", nilai.mean(axis=1).round(1))`,
  mistakes: [
    {
      title: "Tertukar axis 0 dan 1",
      wrong: `import numpy as np
X = np.array([[1, 10], [3, 30]])
print(X.mean(axis=1))   # mengira rata-rata per fitur`,
      fix: `import numpy as np
X = np.array([[1, 10], [3, 30]])
print(X.mean(axis=0))   # rata-rata per fitur (kolom)`,
      explain: "Untuk statistik per fitur/kolom gunakan `axis=0`.",
    },
    {
      title: "Memakai ndim seperti method",
      wrong: `import numpy as np
print(np.array([1, 2]).ndim())`,
      error: "TypeError",
      fix: `import numpy as np
print(np.array([1, 2]).ndim)`,
      explain: "`ndim` adalah atribut, bukan method — tanpa tanda kurung.",
    },
    {
      title: "axis di luar jumlah dimensi",
      wrong: `import numpy as np
print(np.array([1, 2, 3]).sum(axis=1))`,
      error: "AxisError",
      fix: `import numpy as np
print(np.array([1, 2, 3]).sum(axis=0))`,
      explain: "Array 1D hanya punya axis 0.",
    },
  ],
  bestPractices: [
    "Cek `X.ndim` dan `y.ndim` sebelum melatih model: X harus 2, y harus 1.",
    "Ingat: axis=0 → hasil per kolom, axis=1 → hasil per baris.",
    "Gunakan nama variabel konvensi ML: `X` (huruf besar, matriks) dan `y` (huruf kecil, vektor).",
  ],
  exercises: [
    {
      id: "np-dim-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Cek dimensi",
      prompt: "Lengkapi agar `d` berisi jumlah dimensi array `m`.",
      starter: `import numpy as np
m = np.zeros((4, 2))
d = m.____
print(d)`,
      solution: `import numpy as np
m = np.zeros((4, 2))
d = m.ndim
print(d)`,
      tests: [{ desc: "d == 2", expr: "d == 2" }],
      hints: ["Konsep: atribut jumlah dimensi.", "Singkatan dari number of dimensions.", "`m.ndim`"],
      explanation: "`ndim` berisi jumlah dimensi; untuk matriks bernilai 2.",
    },
    {
      id: "np-dim-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([[1, 2], [3, 4], [5, 6]])
print(a.ndim)
print(a.sum(axis=0))
print(a.sum(axis=1))`,
      answer: "2\n[ 9 12]\n[ 3  7 11]",
      hints: ["Konsep: axis 0 ke bawah, axis 1 ke samping.", "Per kolom: 1+3+5 dan 2+4+6.", "Per baris: 1+2, 3+4, 5+6."],
      explanation: "axis=0 → [9 12]; axis=1 → [3 7 11].",
    },
    {
      id: "np-dim-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Rata-rata per fitur",
      prompt: "Kode ini error. Perbaiki agar `rata_fitur` berisi rata-rata setiap kolom: `[2. 20.]`.",
      starter: `import numpy as np
X = np.array([[1, 10], [3, 30]])
rata_fitur = X.mean(axis=2)
print(rata_fitur)`,
      solution: `import numpy as np
X = np.array([[1, 10], [3, 30]])
rata_fitur = X.mean(axis=0)
print(rata_fitur)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "rata_fitur == [2, 20]", expr: "list(rata_fitur) == [2.0, 20.0]" },
      ],
      hints: ["Konsep: array 2D hanya punya axis 0 dan 1.", "Per kolom = ke bawah.", "`axis=0`"],
      explanation: "axis=2 tidak ada pada array 2D (AxisError). Rata-rata per kolom memakai axis=0.",
    },
    {
      id: "np-dim-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Nilai per siswa",
      prompt: "Diberikan `nilai` (3 siswa × 4 mata pelajaran). Hitung `rata_siswa` (rata-rata setiap siswa) dan `rata_mapel` (rata-rata setiap mata pelajaran), lalu cetak keduanya.",
      starter: `import numpy as np
nilai = np.array([[80, 70, 90, 60],
                  [75, 85, 80, 90],
                  [60, 65, 70, 75]])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
nilai = np.array([[80, 70, 90, 60],
                  [75, 85, 80, 90],
                  [60, 65, 70, 75]])
rata_siswa = nilai.mean(axis=1)
rata_mapel = nilai.mean(axis=0)
print(rata_siswa)
print(rata_mapel)`,
      tests: [
        { desc: "rata_siswa benar", expr: "list(rata_siswa) == [75.0, 82.5, 67.5]" },
        { desc: "rata_mapel benar (4 nilai)", expr: "[round(v, 4) for v in rata_mapel] == [71.6667, 73.3333, 80.0, 75.0]" },
      ],
      hints: ["Konsep: axis menentukan arah rata-rata.", "Siswa = baris → axis=1.", "Mata pelajaran = kolom → axis=0."],
      explanation: "Per baris memakai axis=1, per kolom memakai axis=0.",
    },
    {
      id: "np-dim-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Validasi bentuk X dan y",
      prompt: [
        "Buat fungsi `cek_bentuk(X, y)` yang mengembalikan `True` jika `X.ndim == 2`, `y.ndim == 1`, dan jumlah baris X sama dengan panjang y; selain itu `False`.",
        "Uji dengan X 2D 3×2 dan y panjang 3 → cetak `True`.",
      ],
      starter: `import numpy as np
# Tulis kodemu di sini
`,
      solution: `import numpy as np

def cek_bentuk(X, y):
    return X.ndim == 2 and y.ndim == 1 and len(X) == len(y)

X = np.array([[1, 2], [3, 4], [5, 6]])
y = np.array([0, 1, 0])
print(cek_bentuk(X, y))`,
      tests: [
        { desc: "Kasus valid → True", expr: "cek_bentuk(__import__('numpy').zeros((3, 2)), __import__('numpy').zeros(3)) is True" },
        { desc: "X 1D → False", expr: "cek_bentuk(__import__('numpy').zeros(3), __import__('numpy').zeros(3)) is False" },
        { desc: "Jumlah baris berbeda → False", expr: "cek_bentuk(__import__('numpy').zeros((4, 2)), __import__('numpy').zeros(3)) is False" },
        { desc: "Output True", expr: "_lines == ['True']" },
      ],
      hints: ["Konsep: ndim dan len.", "`len(X)` = jumlah baris array 2D.", "Gabungkan tiga syarat dengan `and`."],
      explanation: "Pemeriksaan seperti ini mencegah error saat memanggil `model.fit(X, y)`.",
    },
  ],
  quiz: [
    { id: "np-dim-q1", type: "mcq", prompt: "Bentuk standar fitur X untuk scikit-learn adalah…", options: ["1D", "2D (sampel × fitur)", "3D", "0D"], answer: 1, explanation: "X harus 2D; y 1D." },
    { id: "np-dim-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.array([[[1]]]).ndim)`, options: ["1", "2", "3", "0"], answer: 2, explanation: "Tiga kurung siku → 3 dimensi." },
    { id: "np-dim-q3", type: "tf", prompt: "`X.mean(axis=0)` menghasilkan rata-rata setiap kolom.", answer: true, explanation: "axis=0 berjalan ke bawah, menghasilkan satu nilai per kolom." },
    { id: "np-dim-q4", type: "fill", prompt: "Atribut untuk melihat jumlah dimensi array `a` adalah `a.____`", answer: ["ndim"], explanation: "`a.ndim`." },
    { id: "np-dim-q5", type: "case", prompt: "Gambar berwarna 28×28 piksel dengan 3 kanal RGB disimpan sebagai array. Berapa dimensinya?", options: ["1", "2", "3", "4"], answer: 2, explanation: "Tinggi × lebar × kanal = 3 dimensi." },
  ],
  challenge: {
    id: "np-dim-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Ringkasan fitur",
    prompt: [
      "Diberikan `X` berisi 5 rumah × 3 fitur (luas, kamar, umur). Hitung tanpa loop:",
      "- `rata` = rata-rata setiap fitur\n- `minimum` = nilai minimum setiap fitur\n- `rentang` = maksimum − minimum setiap fitur",
      "Cetak `rentang`: `[130.   3.  20.]`.",
    ],
    starter: `import numpy as np
X = np.array([[120, 3, 5],
              [ 80, 2, 15],
              [200, 4, 2],
              [ 70, 1, 22],
              [150, 3, 10]])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
X = np.array([[120, 3, 5],
              [ 80, 2, 15],
              [200, 4, 2],
              [ 70, 1, 22],
              [150, 3, 10]])
rata = X.mean(axis=0)
minimum = X.min(axis=0)
rentang = (X.max(axis=0) - minimum).astype(float)
print(rentang)`,
    tests: [
      { desc: "rata benar", expr: "list(rata) == [124.0, 2.6, 10.8]" },
      { desc: "minimum benar", expr: "list(minimum) == [70, 1, 2]" },
      { desc: "rentang benar", expr: "list(rentang) == [130, 3, 20]" },
      { desc: "Tanpa for loop", expr: "'for ' not in _code" },
    ],
    hints: ["Konsep: statistik per kolom = axis=0.", "`X.min(axis=0)` dan `X.max(axis=0)`.", "Rentang = max − min."],
    explanation: "Rentang per fitur memperlihatkan perbedaan skala antar-fitur — alasan diperlukannya scaling sebelum KNN/SVM.",
  },
  summary: [
    "`ndim` = jumlah dimensi: 0D skalar, 1D vektor, 2D matriks, 3D+ tensor.",
    "Konvensi ML: X 2D (sampel × fitur), y 1D.",
    "axis=0 → hasil per kolom; axis=1 → hasil per baris.",
    "`[1, 2, 3]` (1D) berbeda dengan `[[1], [2], [3]]` (2D) meskipun angkanya sama.",
  ],
  cheatsheet: [
    { syntax: "arr.ndim", desc: "Jumlah dimensi" },
    { syntax: "X.mean(axis=0)", desc: "Rata-rata per kolom" },
    { syntax: "X.sum(axis=1)", desc: "Jumlah per baris" },
    { syntax: "X.min(axis=0), X.max(axis=0)", desc: "Min/max per fitur" },
  ],
  flashcards: [
    { q: "Jumlah dimensi array X", a: "X.ndim" },
    { q: "Rata-rata setiap kolom matriks X", a: "X.mean(axis=0)" },
    { q: "Total setiap baris matriks X", a: "X.sum(axis=1)" },
  ],
  references: [
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
    numpyDoc("numpy.ndarray.ndim", "reference/generated/numpy.ndarray.ndim.html"),
    numpyDoc("The N-dimensional array (ndarray)", "reference/arrays.ndarray.html"),
    numpyDoc("Glossary — axis", "glossary.html"),
  ],
};
