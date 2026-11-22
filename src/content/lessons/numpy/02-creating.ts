import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-creating-arrays",
  title: "Creating Arrays",
  minutes: 40,
  prerequisites: ["np-introduction-to-numpy"],
  objectives: [
    "Membuat array dari list dengan `np.array()`, termasuk array 2D dari list bersarang.",
    "Membuat array berisi nilai awal dengan `np.zeros()`, `np.ones()`, dan `np.full()`.",
    "Membuat deret angka dengan `np.arange()` dan `np.linspace()` serta memahami perbedaannya.",
    "Memilih fungsi pembuat array yang tepat untuk kebutuhan Data Science.",
  ],
  definition: [
    "NumPy menyediakan beberapa cara membuat array:",
    "- **Dari data yang sudah ada**: `np.array([...])` — list biasa menjadi array 1D, list berisi list menjadi array 2D (tabel/matriks).\n- **Berisi nilai awal**: `np.zeros(n)` (semua 0), `np.ones(n)` (semua 1), `np.full(n, nilai)` (semua bernilai sama). Berguna sebagai wadah hasil yang akan diisi.\n- **Deret angka**: `np.arange(start, stop, step)` mirip `range()` tetapi menghasilkan array dan menerima langkah desimal; `np.linspace(start, stop, num)` membuat `num` titik berjarak sama **termasuk** titik akhir.",
    "Untuk array 2D atau lebih, ukuran ditulis sebagai **tuple**: `np.zeros((2, 3))` berarti 2 baris dan 3 kolom. Perhatikan kurung ganda — tuple ukuran adalah satu argumen.",
  ],
  why: [
    "`np.linspace` dipakai untuk membuat sumbu x yang halus saat menggambar kurva model, atau daftar nilai hyperparameter (misalnya learning rate).",
    "`np.zeros` berguna sebagai tempat menyimpan hasil (misalnya skor setiap fold), dan `np.arange` untuk membuat indeks atau deret waktu sederhana.",
  ],
  when: [
    "- `np.array`: data sudah ada dalam list.",
    "- `np.zeros/ones/full`: butuh array berukuran tertentu sebelum diisi.",
    "- `np.arange`: butuh deret dengan **langkah** tertentu.",
    "- `np.linspace`: butuh **jumlah titik** tertentu di antara dua batas.",
  ],
  analogy: "`np.zeros` seperti **menyiapkan rak kosong** sebelum barang datang. `np.arange` seperti **meteran** dengan garis tiap 5 cm (kamu tentukan jaraknya). `np.linspace` seperti **membagi tali** menjadi sejumlah potongan sama panjang (kamu tentukan jumlah titiknya).",
  syntax: {
    code: `np.array([[1, 2], [3, 4]])     # 2D dari list bersarang
np.zeros((2, 3))                # 2 baris x 3 kolom berisi 0
np.ones(4)                      # [1. 1. 1. 1.]
np.full(3, 7)                   # [7 7 7]
np.arange(0, 10, 2)             # 0, 2, 4, 6, 8
np.linspace(0, 1, 5)            # 5 titik dari 0 sampai 1`,
  },
  anatomy: [
    ["np.zeros((2, 3))", "Ukuran sebagai tuple (baris, kolom). Hasil bertipe float secara default."],
    ["np.full(3, 7)", "Array panjang 3 yang semua elemennya 7."],
    ["np.arange(start, stop, step)", "Seperti range: stop tidak ikut. Boleh langkah desimal."],
    ["np.linspace(start, stop, num)", "`num` titik berjarak sama; stop **ikut** secara default."],
  ],
  examples: [
    {
      title: "Contoh 1 — Array 1D dan 2D dari list",
      code: `import numpy as np

a = np.array([1, 2, 3])
b = np.array([[1, 2, 3],
              [4, 5, 6]])
print(a)
print(b)
print(b.shape)`,
      output: "[1 2 3]\n[[1 2 3]\n [4 5 6]]\n(2, 3)",
      explain: [
        ["a = np.array([1, 2, 3])", "List biasa → array 1 dimensi."],
        ["b = np.array([[1, 2, 3],", "List berisi list → array 2 dimensi. Setiap list dalam adalah satu baris."],
        ["print(b.shape)", "`(2, 3)`: 2 baris, 3 kolom (dibahas di Array Shape)."],
      ],
    },
    {
      title: "Contoh 2 — zeros, ones, full",
      code: `import numpy as np

print(np.zeros(4))
print(np.ones((2, 3)))
print(np.full(3, 7))
print(np.zeros(3, dtype=int))`,
      output: "[0. 0. 0. 0.]\n[[1. 1. 1.]\n [1. 1. 1.]]\n[7 7 7]\n[0 0 0]",
      explain: [
        ["np.zeros(4)", "Empat angka 0 bertipe float (ditampilkan `0.`)."],
        ["np.ones((2, 3))", "Matriks 2×3 berisi 1. Ukuran ditulis sebagai tuple."],
        ["np.full(3, 7)", "Tiga elemen bernilai 7."],
        ["np.zeros(3, dtype=int)", "Parameter `dtype` memaksa tipe integer."],
      ],
      change: "Kita membuat array tanpa menulis isinya satu per satu.",
    },
    {
      title: "Contoh 3 — arange vs linspace",
      code: `import numpy as np

print(np.arange(5))
print(np.arange(0, 1, 0.25))
print(np.linspace(0, 1, 5))
print(len(np.linspace(0, 10, 50)))`,
      output: "[0 1 2 3 4]\n[0.   0.25 0.5  0.75]\n[0.   0.25 0.5  0.75 1.  ]\n50",
      explain: [
        ["np.arange(5)", "0 sampai 4, seperti `range(5)`."],
        ["np.arange(0, 1, 0.25)", "Langkah desimal 0.25; angka 1 tidak ikut."],
        ["np.linspace(0, 1, 5)", "5 titik berjarak sama dari 0 sampai **1 (ikut)**."],
        ["len(np.linspace(0, 10, 50))", "linspace menjamin jumlah titik persis 50."],
      ],
      change: "Dua cara membuat deret: berdasarkan **langkah** atau berdasarkan **jumlah titik**.",
    },
    {
      title: "Contoh 4 — Kandidat hyperparameter",
      intro: "Pola nyata: membuat daftar nilai yang akan dicoba saat tuning.",
      code: `import numpy as np

k_values = np.arange(1, 16, 2)
alphas = np.linspace(0.1, 1.0, 4)
skor_fold = np.zeros(5)

print("K untuk KNN:", k_values)
print("Alpha:", alphas)
print("Tempat skor 5 fold:", skor_fold)`,
      output: "K untuk KNN: [ 1  3  5  7  9 11 13 15]\nAlpha: [0.1 0.4 0.7 1. ]\nTempat skor 5 fold: [0. 0. 0. 0. 0.]",
      explain: [
        ["k_values = np.arange(1, 16, 2)", "Nilai K ganjil 1–15 (K ganjil menghindari seri pada KNN biner)."],
        ["alphas = np.linspace(0.1, 1.0, 4)", "4 nilai alpha berjarak sama untuk Ridge/Lasso."],
        ["skor_fold = np.zeros(5)", "Wadah untuk menyimpan skor setiap fold cross-validation."],
      ],
      change: "Fungsi-fungsi pembuat array dipakai untuk menyiapkan eksperimen Machine Learning.",
    },
  ],
  params: [
    {
      title: "Fungsi pembuat array",
      items: [
        { name: "np.zeros(shape, dtype=float)", desc: "Array berisi 0. `shape` berupa int atau tuple." },
        { name: "np.ones(shape, dtype=float)", desc: "Array berisi 1." },
        { name: "np.full(shape, fill_value)", desc: "Array berisi `fill_value`." },
        { name: "np.arange(start=0, stop, step=1)", desc: "Deret dengan langkah tetap; stop tidak termasuk." },
        { name: "np.linspace(start, stop, num=50, endpoint=True)", desc: "`num` titik berjarak sama; `endpoint=False` agar stop tidak ikut." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nprint(np.arange(10, 0, -3))`, output: "[10  7  4  1]", note: "Langkah negatif membuat deret menurun." },
  tryIt: `import numpy as np

# Ubah angka-angka berikut dan amati hasilnya
print(np.arange(0, 20, 5))
print(np.linspace(0, 100, 6))
print(np.full((2, 2), 9))`,
  mistakes: [
    {
      title: "Ukuran 2D tanpa tuple",
      wrong: `import numpy as np
print(np.zeros(2, 3))`,
      error: "TypeError",
      fix: `import numpy as np
print(np.zeros((2, 3)))`,
      explain: "Argumen kedua `np.zeros` adalah `dtype`. Ukuran multi-dimensi harus dibungkus tuple: `(2, 3)`.",
    },
    {
      title: "Mengira arange menyertakan stop",
      wrong: `import numpy as np
print(np.arange(1, 5))   # mengira 1..5`,
      fix: `import numpy as np
print(np.arange(1, 6))`,
      explain: "Seperti `range`, stop tidak ikut. Untuk menyertakan titik akhir secara pasti, pakai `linspace`.",
    },
    {
      title: "Baris list bersarang tidak sama panjang",
      wrong: `import numpy as np
x = np.array([[1, 2, 3], [4, 5]])`,
      error: "ValueError",
      fix: `import numpy as np
x = np.array([[1, 2, 3], [4, 5, 6]])
print(x.shape)`,
      explain: "Array 2D harus berbentuk persegi panjang: setiap baris sama panjang (*inhomogeneous shape*).",
    },
  ],
  bestPractices: [
    "Gunakan `linspace` saat butuh jumlah titik pasti (sumbu grafik), `arange` saat butuh langkah pasti.",
    "Hindari `arange` dengan langkah desimal untuk batas yang harus tepat — pembulatan float bisa menambah/mengurangi satu elemen; `linspace` lebih aman.",
    "Tulis ukuran multi-dimensi sebagai tuple `(baris, kolom)`.",
  ],
  exercises: [
    {
      id: "np-create-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Matriks nol",
      prompt: "Lengkapi agar `m` adalah array berisi 0 berukuran 3 baris × 4 kolom.",
      starter: `import numpy as np
m = np.zeros(____)
print(m.shape)`,
      solution: `import numpy as np
m = np.zeros((3, 4))
print(m.shape)`,
      tests: [
        { desc: "m.shape == (3, 4)", expr: "m.shape == (3, 4)" },
        { desc: "Semua elemen 0", expr: "m.sum() == 0" },
      ],
      hints: ["Konsep: ukuran 2D ditulis sebagai tuple.", "Tuple berisi (baris, kolom).", "`np.zeros((3, 4))`"],
      explanation: "Kurung ganda: kurung luar untuk fungsi, kurung dalam untuk tuple ukuran.",
    },
    {
      id: "np-create-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
print(np.arange(2, 11, 4))
print(np.linspace(0, 6, 4))`,
      answer: "[ 2  6 10]\n[0. 2. 4. 6.]",
      hints: ["Konsep: arange dengan langkah, linspace dengan jumlah titik.", "arange: 2, 6, 10 (stop 11 tidak ikut).", "linspace: 4 titik dari 0 sampai 6, jaraknya 2."],
      explanation: "arange(2, 11, 4) → 2, 6, 10. linspace(0, 6, 4) → 0, 2, 4, 6 (float).",
    },
    {
      id: "np-create-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Array 2D",
      prompt: "Perbaiki kode agar `data` menjadi array 2×3 berisi nilai 1 sampai 6 dan tercetak shape `(2, 3)`.",
      starter: `import numpy as np
data = np.array([1, 2, 3], [4, 5, 6])
print(data.shape)`,
      solution: `import numpy as np
data = np.array([[1, 2, 3], [4, 5, 6]])
print(data.shape)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "data.shape == (2, 3)", expr: "data.shape == (2, 3)" },
        { desc: "Isi benar", expr: "data.tolist() == [[1, 2, 3], [4, 5, 6]]" },
      ],
      hints: ["Konsep: np.array menerima satu objek.", "Kedua baris harus dibungkus satu list luar.", "`np.array([[1, 2, 3], [4, 5, 6]])`"],
      explanation: "Tanpa kurung siku luar, list kedua dianggap argumen `dtype` dan memunculkan TypeError.",
    },
    {
      id: "np-create-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Kandidat learning rate",
      prompt: "Buat `lr` berisi 5 nilai berjarak sama dari 0.01 sampai 0.05 (termasuk kedua ujung) dan `epochs` berisi 10, 20, …, 50 dengan `arange`. Cetak keduanya.",
      starter: `import numpy as np
# Tulis kodemu di sini
`,
      solution: `import numpy as np
lr = np.linspace(0.01, 0.05, 5)
epochs = np.arange(10, 51, 10)
print(lr)
print(epochs)`,
      tests: [
        { desc: "lr punya 5 elemen dari 0.01 sampai 0.05", expr: "len(lr) == 5 and abs(lr[0] - 0.01) < 1e-12 and abs(lr[-1] - 0.05) < 1e-12" },
        { desc: "epochs = [10, 20, 30, 40, 50]", expr: "list(epochs) == [10, 20, 30, 40, 50]" },
        { desc: "Memakai linspace dan arange", expr: "'linspace' in _code and 'arange' in _code" },
      ],
      hints: ["Konsep: linspace untuk jumlah titik, arange untuk langkah.", "`np.linspace(0.01, 0.05, 5)`", "Stop arange harus lebih dari 50, misalnya 51."],
      explanation: "linspace menjamin kedua ujung ikut; arange membutuhkan stop yang melewati nilai terakhir.",
    },
    {
      id: "np-create-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Simpan skor fold",
      prompt: [
        "Buat array `skor = np.zeros(5)`. Isi dengan nilai `[0.81, 0.84, 0.79, 0.86, 0.83]` memakai for loop dan `enumerate` (simulasi menyimpan hasil cross-validation per fold).",
        "Cetak rata-rata dengan 3 desimal: `Rata-rata CV: 0.826`.",
      ],
      starter: `import numpy as np
hasil = [0.81, 0.84, 0.79, 0.86, 0.83]
skor = np.zeros(5)
# Tulis kodemu di sini
`,
      solution: `import numpy as np
hasil = [0.81, 0.84, 0.79, 0.86, 0.83]
skor = np.zeros(5)
for i, s in enumerate(hasil):
    skor[i] = s
print(f"Rata-rata CV: {skor.mean():.3f}")`,
      tests: [
        { desc: "skor terisi benar", expr: "[round(x, 2) for x in skor] == [0.81, 0.84, 0.79, 0.86, 0.83]" },
        { desc: "Output sesuai", expr: "_lines == ['Rata-rata CV: 0.826']" },
      ],
      hints: ["Konsep: mengisi array yang sudah disiapkan.", "`for i, s in enumerate(hasil):`", "`skor[i] = s` lalu `skor.mean()`."],
      explanation: "Pola \"siapkan array kosong lalu isi\" sering dipakai saat menyimpan hasil eksperimen.",
    },
  ],
  quiz: [
    { id: "np-create-q1", type: "mcq", prompt: "Fungsi untuk membuat 5 titik berjarak sama dari 0 sampai 1 (termasuk 1)?", options: ["np.arange(0, 1, 5)", "np.linspace(0, 1, 5)", "np.zeros(5)", "np.full(5, 1)"], answer: 1, explanation: "linspace(start, stop, num)." },
    { id: "np-create-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.full(3, 2) * np.arange(3))`, options: ["[2 2 2]", "[0 2 4]", "[0 1 2]", "[2 3 4]"], answer: 1, explanation: "[2 2 2] × [0 1 2] = [0 2 4]." },
    { id: "np-create-q3", type: "tf", prompt: "`np.zeros(3)` menghasilkan array bertipe integer.", answer: false, explanation: "Default dtype adalah float64 (`[0. 0. 0.]`)." },
    { id: "np-create-q4", type: "fill", prompt: "Lengkapi agar array berukuran 2 baris 5 kolom berisi 1: `np.ones(____)`", answer: ["(2, 5)", "(2,5)"], explanation: "Ukuran ditulis sebagai tuple." },
    { id: "np-create-q5", type: "case", prompt: "Kamu ingin menggambar kurva prediksi model yang halus untuk x dari 0 sampai 10. Fungsi yang paling tepat?", options: ["np.zeros(10)", "np.linspace(0, 10, 200)", "np.full(10, 0)", "np.array([0, 10])"], answer: 1, explanation: "Banyak titik berjarak sama membuat kurva terlihat halus." },
  ],
  challenge: {
    id: "np-create-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Tabel suhu sederhana",
    prompt: [
      "Buat array `jam` berisi 0, 3, 6, …, 21 dengan `arange` (8 nilai).",
      "Buat array 2D `tabel` berukuran 2 × 8 dengan `np.zeros`, lalu isi baris 0 dengan `jam` dan baris 1 dengan `25 + jam * 0.5` (suhu).",
      "Cetak `tabel.shape` lalu baris suhu: `(2, 8)` dan `[25.  26.5 28.  29.5 31.  32.5 34.  35.5]`.",
    ],
    starter: `import numpy as np
# Tulis kodemu di sini
`,
    solution: `import numpy as np
jam = np.arange(0, 24, 3)
tabel = np.zeros((2, 8))
tabel[0] = jam
tabel[1] = 25 + jam * 0.5
print(tabel.shape)
print(tabel[1])`,
    tests: [
      { desc: "jam = 0, 3, …, 21", expr: "list(jam) == [0, 3, 6, 9, 12, 15, 18, 21]" },
      { desc: "tabel.shape == (2, 8)", expr: "tabel.shape == (2, 8)" },
      { desc: "Baris suhu benar", expr: "list(tabel[1]) == [25.0, 26.5, 28.0, 29.5, 31.0, 32.5, 34.0, 35.5]" },
      { desc: "Output baris 1 '(2, 8)'", expr: "len(_lines) >= 1 and _lines[0] == '(2, 8)'" },
    ],
    hints: ["Konsep: membuat wadah lalu mengisi per baris.", "`tabel[0] = jam` mengisi seluruh baris 0.", "`np.arange(0, 24, 3)` menghasilkan 8 nilai."],
    explanation: "`tabel[i] = ...` mengisi satu baris sekaligus — konsep indexing 2D yang dibahas di subbab Indexing.",
  },
  summary: [
    "`np.array` dari list; list bersarang menghasilkan array 2D.",
    "`np.zeros`, `np.ones`, `np.full` membuat array berisi nilai awal; ukuran 2D ditulis sebagai tuple.",
    "`np.arange(start, stop, step)`: langkah tetap, stop tidak ikut.",
    "`np.linspace(start, stop, num)`: jumlah titik tetap, stop ikut.",
    "Default tipe zeros/ones/linspace adalah float.",
  ],
  cheatsheet: [
    { syntax: "np.array([[1, 2], [3, 4]])", desc: "Array 2D" },
    { syntax: "np.zeros((r, c))", desc: "Matriks nol" },
    { syntax: "np.full(n, v)", desc: "Array berisi v" },
    { syntax: "np.arange(a, b, step)", desc: "Deret langkah tetap" },
    { syntax: "np.linspace(a, b, n)", desc: "n titik berjarak sama" },
  ],
  flashcards: [
    { q: "Buat array 0 berukuran 3×4", a: "np.zeros((3, 4))" },
    { q: "Deret 0, 5, 10, …, 50", a: "np.arange(0, 51, 5)" },
    { q: "100 titik berjarak sama dari 0 sampai 1", a: "np.linspace(0, 1, 100)" },
  ],
  references: [
    numpyDoc("Array creation", "user/basics.creation.html"),
    numpyDoc("numpy.zeros", "reference/generated/numpy.zeros.html"),
    numpyDoc("numpy.arange", "reference/generated/numpy.arange.html"),
    numpyDoc("numpy.linspace", "reference/generated/numpy.linspace.html"),
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
  ],
};
