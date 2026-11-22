import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-slicing",
  title: "Slicing",
  minutes: 40,
  prerequisites: ["np-indexing"],
  visual: "list-index",
  objectives: [
    "Mengambil potongan array 1D dengan `a[start:stop:step]`.",
    "Memotong array 2D pada baris dan kolom sekaligus: `X[r1:r2, c1:c2]`.",
    "Memahami bahwa slice NumPy adalah **view** (bukan salinan) dan kapan perlu `.copy()`.",
    "Menerapkan slicing untuk memisahkan fitur, target, dan data berbasis waktu.",
  ],
  definition: [
    "**Slicing** mengambil **rentang** elemen. Aturannya sama dengan list dan string: `start` ikut, `stop` tidak ikut, `step` langkah. Bagian yang dikosongkan berarti \"dari awal\" atau \"sampai akhir\".",
    "Pada array 2D, setiap dimensi bisa di-slice sendiri dan dipisah koma: `X[:3, 1:]` = 3 baris pertama, kolom 1 sampai akhir.",
    "Perbedaan penting dengan list: **slice NumPy adalah view**, yaitu \"jendela\" ke data yang sama. Mengubah isi slice ikut mengubah array asli. Gunakan `.copy()` jika butuh salinan terpisah. (Fancy indexing dengan list index, sebaliknya, selalu menghasilkan salinan.)",
  ],
  why: [
    "Memisahkan fitur dan target dari satu matriks (`data[:, :-1]` dan `data[:, -1]`), mengambil n data terakhir sebagai test pada deret waktu (`series[-90:]`), atau melihat beberapa sampel pertama — semuanya slicing.",
    "Memahami view mencegah bug halus: data asli berubah tanpa disadari.",
  ],
  when: [
    "- Mengambil rentang baris/kolom yang berurutan.",
    "- Membagi data deret waktu berdasarkan urutan (train = awal, test = akhir).",
    "- Untuk pilihan yang tidak berurutan, gunakan fancy indexing atau boolean indexing.",
  ],
  analogy: "Slicing seperti **memotong roti tawar**: `[2:5]` mengambil potongan ke-2 sampai ke-4. View seperti **melihat roti lewat jendela etalase** — kalau seseorang mengoles selai pada roti itu, yang kamu lihat ikut berubah. `.copy()` berarti kamu membeli roti sendiri.",
  syntax: {
    code: `a[start:stop:step]
a[:3]   a[-3:]   a[::2]   a[::-1]
X[:5]            # 5 baris pertama
X[:, :-1]        # semua kolom kecuali terakhir
X[1:3, 0:2]      # sub-matriks
b = a[:3].copy() # salinan terpisah`,
  },
  anatomy: [
    ["start:stop", "Dari start sampai sebelum stop."],
    ["::step", "Langkah; `::-1` membalik urutan."],
    ["X[:, :-1]", "Semua baris, semua kolom kecuali terakhir (fitur)."],
    [".copy()", "Membuat salinan agar perubahan tidak memengaruhi array asli."],
  ],
  examples: [
    {
      title: "Contoh 1 — Slicing 1D",
      code: `import numpy as np

a = np.arange(10, 20)
print(a)
print(a[2:5])
print(a[:3], a[-3:])
print(a[::3])
print(a[::-1])`,
      output: "[10 11 12 13 14 15 16 17 18 19]\n[12 13 14]\n[10 11 12] [17 18 19]\n[10 13 16 19]\n[19 18 17 16 15 14 13 12 11 10]",
      explain: [
        ["a[2:5]", "Index 2, 3, 4."],
        ["a[:3], a[-3:]", "Tiga pertama dan tiga terakhir."],
        ["a[::3]", "Setiap elemen ketiga."],
        ["a[::-1]", "Urutan terbalik."],
      ],
    },
    {
      title: "Contoh 2 — Slicing 2D: baris dan kolom",
      code: `import numpy as np

X = np.arange(20).reshape(4, 5)
print(X)
print(X[:2])
print(X[:, 1:3])
print(X[1:3, -2:])`,
      output: "[[ 0  1  2  3  4]\n [ 5  6  7  8  9]\n [10 11 12 13 14]\n [15 16 17 18 19]]\n[[0 1 2 3 4]\n [5 6 7 8 9]]\n[[ 1  2]\n [ 6  7]\n [11 12]\n [16 17]]\n[[ 8  9]\n [13 14]]",
      explain: [
        ["X[:2]", "Dua baris pertama, semua kolom."],
        ["X[:, 1:3]", "Semua baris, kolom 1 dan 2."],
        ["X[1:3, -2:]", "Baris 1–2, dua kolom terakhir."],
      ],
      change: "Slicing dilakukan per dimensi dan dipisah koma.",
    },
    {
      title: "Contoh 3 — Memisahkan fitur dan target",
      code: `import numpy as np
import pandas as pd

data = pd.read_csv("student_scores.csv").drop(columns="student_id").to_numpy()
X = data[:, :-1]
y = data[:, -1]
print(data.shape, X.shape, y.shape)
print(X[:2])
print(y[:2])`,
      output: "(30, 4) (30, 3) (30,)\n[[ 8.  97.  70. ]\n [ 4.9 90.  87. ]]\n[96. 89.]",
      explain: [
        ["X = data[:, :-1]", "Semua kolom kecuali terakhir = fitur."],
        ["y = data[:, -1]", "Kolom terakhir (index, bukan slice) = target 1D."],
        ["print(data.shape, X.shape, y.shape)", "Perhatikan y menjadi 1D karena diambil dengan index, bukan slice."],
      ],
      change: "Slicing dipakai pada dataset nyata untuk membentuk X dan y.",
    },
    {
      title: "Contoh 4 — View vs copy",
      code: `import numpy as np

asli = np.array([1, 2, 3, 4, 5])
potong = asli[:3]
potong[0] = 99
print("asli setelah mengubah view:", asli)

asli2 = np.array([1, 2, 3, 4, 5])
salinan = asli2[:3].copy()
salinan[0] = 99
print("asli2 setelah mengubah copy:", asli2)`,
      output: "asli setelah mengubah view: [99  2  3  4  5]\nasli2 setelah mengubah copy: [1 2 3 4 5]",
      explain: [
        ["potong = asli[:3]", "Slice adalah view ke data yang sama."],
        ["potong[0] = 99", "Mengubah view → array asli ikut berubah!"],
        ["salinan = asli2[:3].copy()", "`.copy()` membuat data terpisah."],
      ],
      change: "Perilaku ini berbeda dari list Python, di mana slice selalu menghasilkan salinan.",
    },
  ],
  params: [
    {
      title: "Komponen slice",
      items: [
        { name: "start", default: "0 (atau akhir jika step negatif)", desc: "Index awal (ikut)." },
        { name: "stop", default: "akhir", desc: "Index akhir (tidak ikut)." },
        { name: "step", default: "1", desc: "Langkah; negatif untuk mundur." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nx = np.arange(8)\nprint(x[1:7:2], x[-2:])`, output: "[1 3 5] [6 7]" },
  tryIt: `import numpy as np

pm25 = np.array([55, 60, 72, 80, 65, 58, 90, 110, 95, 70])  # 10 hari
train = pm25[:-3]   # 7 hari pertama
test = pm25[-3:]    # 3 hari terakhir
print("Train:", train)
print("Test:", test)
print("Rata-rata 3 hari terakhir train:", train[-3:].mean())`,
  mistakes: [
    {
      title: "Mengira stop ikut terambil",
      wrong: `import numpy as np
a = np.arange(5)
print(a[1:3])   # mengira [1 2 3]`,
      fix: `import numpy as np
a = np.arange(5)
print(a[1:4])`,
      explain: "stop tidak ikut. Untuk index 1–3, tulis `1:4`.",
    },
    {
      title: "Mengubah slice tanpa sadar mengubah data asli",
      wrong: `import numpy as np
data = np.array([10, 20, 30])
bagian = data[:2]
bagian *= 0
print(data)   # [ 0  0 30]`,
      fix: `import numpy as np
data = np.array([10, 20, 30])
bagian = data[:2].copy()
bagian *= 0
print(data)`,
      explain: "Gunakan `.copy()` bila slice akan dimodifikasi tetapi data asli harus tetap.",
    },
    {
      title: "Terlalu banyak index untuk array 1D",
      wrong: `import numpy as np
a = np.arange(6)
print(a[:2, 1])`,
      error: "IndexError",
      fix: `import numpy as np
a = np.arange(6).reshape(2, 3)
print(a[:2, 1])`,
      explain: "Array 1D hanya menerima satu slice. Reshape menjadi 2D jika ingin memotong baris dan kolom.",
    },
  ],
  bestPractices: [
    "Untuk deret waktu, gunakan slicing berbasis urutan (`[:-n]` dan `[-n:]`), jangan acak.",
    "Gunakan `.copy()` saat akan memodifikasi potongan data.",
    "Ambil target dengan index (`data[:, -1]`) agar hasilnya 1D, bukan slice (`data[:, -1:]`) yang 2D.",
  ],
  exercises: [
    {
      id: "np-slice-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Lima data terakhir",
      prompt: "Lengkapi agar `akhir` berisi 5 elemen terakhir dari `a`.",
      starter: `import numpy as np
a = np.arange(100)
akhir = a[____]
print(akhir)`,
      solution: `import numpy as np
a = np.arange(100)
akhir = a[-5:]
print(akhir)`,
      tests: [{ desc: "akhir == [95..99]", expr: "list(akhir) == [95, 96, 97, 98, 99]" }],
      hints: ["Konsep: slicing dengan index negatif.", "Mulai dari -5 sampai akhir.", "`a[-5:]`"],
      explanation: "`-5:` = dari elemen kelima dari belakang sampai akhir.",
    },
    {
      id: "np-slice-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
m = np.arange(12).reshape(3, 4)
print(m[1:, :2])
print(m[0, ::2])`,
      answer: "[[4 5]\n [8 9]]\n[0 2]",
      hints: ["Konsep: slice per dimensi.", "Baris 1 dan 2, kolom 0 dan 1.", "Baris 0, kolom 0 dan 2."],
      explanation: "m[1:, :2] = [[4 5] [8 9]]; m[0, ::2] = [0 2].",
    },
    {
      id: "np-slice-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Target harus 1D",
      prompt: "`y` seharusnya array 1D berisi kolom terakhir, tetapi bentuknya (4, 1). Perbaiki.",
      starter: `import numpy as np
data = np.arange(16).reshape(4, 4)
X = data[:, :-1]
y = data[:, -1:]
print(y.shape)`,
      solution: `import numpy as np
data = np.arange(16).reshape(4, 4)
X = data[:, :-1]
y = data[:, -1]
print(y.shape)`,
      tests: [
        { desc: "y.shape == (4,)", expr: "y.shape == (4,)" },
        { desc: "y == [3, 7, 11, 15]", expr: "list(y) == [3, 7, 11, 15]" },
      ],
      hints: ["Konsep: index vs slice pada kolom.", "`-1:` mempertahankan dimensi kolom.", "Gunakan `data[:, -1]`."],
      explanation: "Index tunggal menghapus dimensi itu; slice mempertahankannya.",
    },
    {
      id: "np-slice-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Split deret waktu",
      prompt: "Diberikan `harian` (365 nilai). Buat `train` = semua kecuali 90 hari terakhir dan `test` = 90 hari terakhir. Cetak panjang keduanya: `275 90`.",
      starter: `import numpy as np
harian = np.arange(365)
# Tulis kodemu di sini
`,
      solution: `import numpy as np
harian = np.arange(365)
train = harian[:-90]
test = harian[-90:]
print(len(train), len(test))`,
      tests: [
        { desc: "len(train) == 275", expr: "len(train) == 275" },
        { desc: "test berisi 90 hari terakhir", expr: "list(test) == list(range(275, 365))" },
        { desc: "Output '275 90'", expr: "_lines == ['275 90']" },
      ],
      hints: ["Konsep: slicing berdasarkan urutan waktu.", "`harian[:-90]` dan `harian[-90:]`.", "Jangan mengacak data deret waktu."],
      explanation: "Untuk forecasting, data test harus berada **setelah** data train agar evaluasi realistis.",
    },
    {
      id: "np-slice-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Fitur & target Auto MPG",
      prompt: [
        "Baca `auto_mpg.csv`, buang kolom `car_name` dan `horsepower` (ada missing), lalu ubah ke NumPy `data`. Kolom pertama adalah target `mpg`.",
        "Buat `y = data[:, 0]` dan `X = data[:, 1:]`. Cetak `X.shape` dan `y.shape`.",
      ],
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
data = pd.read_csv("auto_mpg.csv").drop(columns=["car_name", "horsepower"]).to_numpy()
y = data[:, 0]
X = data[:, 1:]
print(X.shape)
print(y.shape)`,
      tests: [
        { desc: "X.shape == (398, 6)", expr: "X.shape == (398, 6)" },
        { desc: "y.shape == (398,)", expr: "y.shape == (398,)" },
        { desc: "y adalah kolom mpg", expr: "abs(y[:3].sum() - (18 + 15 + 18)) < 1e-9" },
      ],
      hints: ["Konsep: target di kolom pertama.", "`data[:, 0]` untuk y, `data[:, 1:]` untuk X.", "Buang kolom dengan `drop(columns=[...])`."],
      explanation: "Posisi target tidak selalu di kolom terakhir — slicing menyesuaikan.",
    },
  ],
  quiz: [
    { id: "np-slice-q1", type: "mcq", prompt: "`X[:, :-1]` menghasilkan…", options: ["Baris terakhir", "Semua kolom kecuali terakhir", "Kolom terakhir", "Semua baris kecuali terakhir"], answer: 1, explanation: "Dimensi kedua = kolom; `:-1` = semua kecuali terakhir." },
    { id: "np-slice-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\na = np.array([1, 2, 3, 4])\nb = a[1:3]\nb[0] = 0\nprint(a)`, options: ["[1 2 3 4]", "[1 0 3 4]", "[0 2 3 4]", "[1 0 0 4]"], answer: 1, explanation: "Slice adalah view: mengubah b mengubah a." },
    { id: "np-slice-q3", type: "tf", prompt: "Pada list Python, slice menghasilkan salinan; pada NumPy, slice menghasilkan view.", answer: true, explanation: "Karena itu `.copy()` penting di NumPy." },
    { id: "np-slice-q4", type: "fill", prompt: "Method untuk membuat salinan terpisah dari array adalah `.____()`", answer: ["copy"], explanation: "`arr.copy()`." },
    { id: "np-slice-q5", type: "case", prompt: "Kamu memprediksi PM2.5 90 hari ke depan dari data harian 5 tahun. Cara validasi yang benar?", options: ["Ambil 90 baris acak sebagai validasi", "Pakai 90 hari terakhir data historis sebagai validasi (slicing berdasarkan waktu)", "Validasi dengan data train", "Tidak perlu validasi"], answer: 1, explanation: "Validasi harus meniru masa depan: data setelah periode train." },
  ],
  challenge: {
    id: "np-slice-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Rata-rata bergerak 7 hari",
    prompt: [
      "Diberikan 14 hari data `aqi`. Buat array `ma7` berisi rata-rata 7 hari bergerak: untuk setiap hari i mulai index 6, `ma7` = rata-rata `aqi[i-6:i+1]`. Hasil berisi 8 nilai.",
      "Cetak `ma7` dibulatkan 1 desimal.",
    ],
    starter: `import numpy as np
aqi = np.array([60, 65, 70, 80, 75, 72, 68, 90, 95, 100, 85, 70, 66, 62])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
aqi = np.array([60, 65, 70, 80, 75, 72, 68, 90, 95, 100, 85, 70, 66, 62])
ma7 = np.zeros(len(aqi) - 6)
for i in range(6, len(aqi)):
    ma7[i - 6] = aqi[i - 6:i + 1].mean()
print(ma7.round(1))`,
    alternatives: [`import numpy as np
aqi = np.array([60, 65, 70, 80, 75, 72, 68, 90, 95, 100, 85, 70, 66, 62])
ma7 = np.array([aqi[i - 6:i + 1].mean() for i in range(6, len(aqi))])
print(ma7.round(1))`],
    tests: [
      { desc: "ma7 berisi 8 nilai", expr: "len(ma7) == 8" },
      { desc: "Nilai pertama = rata-rata 7 hari pertama", expr: "abs(ma7[0] - aqi[:7].mean()) < 1e-9" },
      { desc: "Nilai terakhir = rata-rata 7 hari terakhir", expr: "abs(ma7[-1] - aqi[-7:].mean()) < 1e-9" },
    ],
    hints: ["Konsep: slicing jendela waktu.", "Jendela hari i: `aqi[i-6:i+1]`.", "Loop i dari 6 sampai len(aqi) − 1."],
    explanation: "Rata-rata bergerak menghaluskan fluktuasi harian — fitur yang sering dipakai pada forecasting (di Pandas: `.rolling(7).mean()`).",
  },
  summary: [
    "`a[start:stop:step]`: start ikut, stop tidak ikut.",
    "2D: `X[r1:r2, c1:c2]`; `X[:, :-1]` fitur, `X[:, -1]` target 1D.",
    "Slice NumPy = view; gunakan `.copy()` untuk salinan.",
    "Deret waktu dipotong berdasarkan urutan: train di awal, test di akhir.",
  ],
  cheatsheet: [
    { syntax: "a[:n], a[-n:]", desc: "n pertama/terakhir" },
    { syntax: "a[::-1]", desc: "Membalik urutan" },
    { syntax: "X[:, :-1], X[:, -1]", desc: "Fitur & target" },
    { syntax: "X[1:3, 0:2]", desc: "Sub-matriks" },
    { syntax: "b = a[:3].copy()", desc: "Salinan terpisah" },
  ],
  flashcards: [
    { q: "Ambil semua kolom kecuali terakhir dari matriks data", a: "data[:, :-1]" },
    { q: "Ambil 30 elemen terakhir array a", a: "a[-30:]" },
    { q: "Buat salinan potongan agar data asli tidak berubah", a: "a[:10].copy()" },
  ],
  references: [
    numpyDoc("Indexing on ndarrays — slicing and striding", "user/basics.indexing.html"),
    numpyDoc("Copies and views", "user/basics.copies.html"),
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
  ],
};
