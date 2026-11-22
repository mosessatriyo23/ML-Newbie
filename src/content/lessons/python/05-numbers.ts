import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-numbers",
  title: "Numbers",
  minutes: 40,
  prerequisites: ["py-data-types"],
  objectives: [
    "Menggunakan operator aritmetika: `+`, `-`, `*`, `/`, `//`, `%`, `**`.",
    "Memahami perbedaan pembagian `/` (hasil float) dan `//` (floor division).",
    "Memakai `round()` dan `abs()` serta memahami pembulatan banker's rounding.",
    "Memahami keterbatasan presisi float (`0.1 + 0.2`).",
    "Menulis angka besar/kecil dengan notasi ilmiah dan underscore (`1e-3`, `1_000_000`).",
  ],
  definition: [
    "Python punya dua tipe angka utama: `int` (bulat) dan `float` (desimal). Operasi antara `int` dan `float` menghasilkan `float`.",
    "Operator aritmetika:\n- `+` tambah, `-` kurang, `*` kali\n- `/` bagi — **selalu** menghasilkan float\n- `//` floor division — hasil bagi dibulatkan ke bawah\n- `%` modulo — **sisa** pembagian\n- `**` pangkat",
    "Urutan operasi mengikuti aturan matematika: `**` dahulu, lalu `*` `/` `//` `%`, lalu `+` `-`. Gunakan tanda kurung `( )` agar urutan jelas.",
    "Float disimpan dalam bentuk biner, sehingga beberapa desimal tidak bisa disimpan persis. Akibatnya `0.1 + 0.2` menghasilkan `0.30000000000000004`. Ini bukan bug Python, melainkan sifat floating-point di hampir semua bahasa pemrograman.",
  ],
  why: [
    "Machine Learning adalah komputasi angka: menghitung rata-rata, error, akurasi, learning rate, dan sebagainya. Rumus seperti **MSE** = rata-rata dari `(y - y_pred) ** 2` memakai operator yang kamu pelajari di sini.",
    "Memahami presisi float mencegah kesalahan seperti membandingkan dua float dengan `==` secara langsung.",
  ],
  when: [
    "- Menghitung metrik (akurasi = benar / total).",
    "- `%` untuk mengecek genap/ganjil atau melakukan sesuatu setiap N langkah.",
    "- `//` untuk membagi data menjadi kelompok berukuran sama.",
    "- `round()` untuk merapikan angka sebelum ditampilkan.",
  ],
  analogy: "`//` dan `%` seperti membagi 17 kue ke dalam kotak berisi 5: kamu mendapat `17 // 5 = 3` kotak penuh, dan `17 % 5 = 2` kue tersisa.",
  syntax: {
    code: `a + b    a - b    a * b
a / b     # pembagian (float)
a // b    # floor division
a % b     # sisa bagi (modulo)
a ** b    # pangkat
round(x, n)   abs(x)`,
  },
  anatomy: [
    ["/", "Pembagian biasa, hasil selalu float: `10 / 2` → `5.0`."],
    ["//", "Floor division: `17 // 5` → `3`."],
    ["%", "Modulo (sisa bagi): `17 % 5` → `2`."],
    ["**", "Pangkat: `2 ** 3` → `8`. Akar kuadrat: `x ** 0.5`."],
    ["round(x, n)", "Membulatkan x ke n angka di belakang koma."],
    ["abs(x)", "Nilai mutlak (jarak dari nol): `abs(-4)` → `4`."],
    ["1e-3", "Notasi ilmiah: 1 × 10⁻³ = 0.001. Sering dipakai untuk learning rate."],
  ],
  examples: [
    {
      title: "Contoh 1 — Operator dasar",
      code: `print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 / 2)
print(2 ** 3)`,
      output: "10\n4\n21\n3.5\n8",
      explain: [
        ["print(7 / 2)", "Pembagian menghasilkan float 3.5."],
        ["print(2 ** 3)", "2 pangkat 3 = 8."],
      ],
    },
    {
      title: "Contoh 2 — Floor division dan modulo",
      code: `jumlah_data = 17
batch_size = 5
print("Batch penuh:", jumlah_data // batch_size)
print("Sisa data:", jumlah_data % batch_size)
print("Genap?", 10 % 2 == 0)`,
      output: "Batch penuh: 3\nSisa data: 2\nGenap? True",
      explain: [
        ["jumlah_data // batch_size", "17 dibagi 5 = 3 sisa 2. `//` mengambil hasil bulatnya: 3."],
        ["jumlah_data % batch_size", "`%` mengambil sisanya: 2."],
        ["10 % 2 == 0", "Bilangan genap jika sisa bagi 2 adalah 0. `==` membandingkan (dibahas di Boolean)."],
      ],
      change: "Dua operator baru yang sangat berguna untuk membagi data ke dalam batch.",
    },
    {
      title: "Contoh 3 — Urutan operasi dan tanda kurung",
      code: `print(2 + 3 * 4)
print((2 + 3) * 4)
print(-3 ** 2)
print((-3) ** 2)`,
      output: "14\n20\n-9\n9",
      explain: [
        ["print(2 + 3 * 4)", "Perkalian dulu: 3 × 4 = 12, lalu + 2 = 14."],
        ["print((2 + 3) * 4)", "Kurung dihitung dulu: 5 × 4 = 20."],
        ["print(-3 ** 2)", "`**` lebih kuat dari tanda minus: -(3²) = -9. Jebakan klasik!"],
        ["print((-3) ** 2)", "Dengan kurung: (-3)² = 9."],
      ],
      change: "Kita belajar bahwa urutan operasi memengaruhi hasil — penting saat menulis rumus error seperti `(y - y_pred) ** 2`.",
    },
    {
      title: "Contoh 4 — round(), abs(), dan presisi float",
      code: `print(0.1 + 0.2)
print(round(0.1 + 0.2, 2))
print(round(3.14159, 3))
print(round(2.5), round(3.5))
print(abs(-7.5))`,
      output: "0.30000000000000004\n0.3\n3.142\n2 4\n7.5",
      explain: [
        ["print(0.1 + 0.2)", "Efek presisi float: hasilnya sangat sedikit lebih dari 0.3."],
        ["round(0.1 + 0.2, 2)", "Dibulatkan ke 2 angka desimal → 0.3."],
        ["round(2.5), round(3.5)", "Python memakai **banker's rounding**: angka .5 dibulatkan ke bilangan **genap** terdekat. Jadi 2.5 → 2 dan 3.5 → 4."],
        ["abs(-7.5)", "Nilai mutlak. Dipakai di rumus MAE (Mean Absolute Error)."],
      ],
      change: "Fungsi bawaan `round()` dan `abs()` melengkapi operator aritmetika.",
    },
    {
      title: "Contoh 5 — Rumus kecil: squared error dan akar",
      intro: "Menggabungkan semua operator untuk menghitung error satu prediksi.",
      code: `y_true = 80
y_pred = 74.5
error = y_true - y_pred
squared_error = error ** 2
akar = squared_error ** 0.5
learning_rate = 1e-3

print("Error:", error)
print("Squared error:", squared_error)
print("Akar squared error:", akar)
print("Learning rate:", learning_rate)
print("Angka besar:", 1_000_000)`,
      output: "Error: 5.5\nSquared error: 30.25\nAkar squared error: 5.5\nLearning rate: 0.001\nAngka besar: 1000000",
      explain: [
        ["error = y_true - y_pred", "Selisih nilai asli dan prediksi."],
        ["squared_error = error ** 2", "Dikuadratkan agar selalu positif — dasar dari MSE."],
        ["akar = squared_error ** 0.5", "Pangkat 0.5 = akar kuadrat — dasar dari RMSE."],
        ["learning_rate = 1e-3", "Notasi ilmiah untuk 0.001."],
        ["1_000_000", "Underscore boleh dipakai sebagai pemisah ribuan agar mudah dibaca."],
      ],
      change: "Contoh ini memperlihatkan bagaimana operator sederhana membentuk rumus metrik regresi yang akan kamu pelajari di Module 11 dan 14.",
    },
  ],
  params: [
    {
      title: "round(number, ndigits=None)",
      items: [
        { name: "number", type: "int/float", desc: "Angka yang dibulatkan." },
        { name: "ndigits", type: "int", default: "None", desc: "Jumlah angka di belakang koma. Jika tidak diisi, hasilnya int." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `print(25 // 4, 25 % 4, 25 / 4)`, output: "6 1 6.25" },
  tryIt: `# Hitung jumlah batch untuk data training
n_train = 1000
batch_size = 32

batch_penuh = n_train // batch_size
sisa = n_train % batch_size
print("Batch penuh:", batch_penuh, "| sisa data:", sisa)`,
  mistakes: [
    {
      title: "Membagi dengan nol",
      wrong: `total = 0
rata_rata = 100 / total`,
      error: "ZeroDivisionError",
      fix: `total = 4
rata_rata = 100 / total`,
      explain: "Pembagian dengan nol tidak terdefinisi. Pastikan pembagi tidak nol (misalnya dataset tidak kosong) sebelum membagi.",
    },
    {
      title: "Menggunakan ^ untuk pangkat",
      wrong: `print(2 ^ 3)  # mengira hasilnya 8`,
      fix: `print(2 ** 3)`,
      explain: "`^` di Python adalah operator XOR bit (hasilnya 1), bukan pangkat. Pangkat memakai `**`.",
    },
    {
      title: "Membandingkan float dengan == secara langsung",
      wrong: `print(0.1 + 0.2 == 0.3)`,
      fix: `print(round(0.1 + 0.2, 9) == 0.3)`,
      explain: "Hasil pertama `False` karena presisi float. Bulatkan dulu, atau di NumPy gunakan `np.isclose()`.",
    },
  ],
  bestPractices: [
    "Gunakan tanda kurung untuk memperjelas urutan operasi, walaupun tidak wajib.",
    "Bulatkan angka hanya saat **menampilkan**, bukan di tengah perhitungan, agar tidak kehilangan presisi.",
    "Tulis angka penting sebagai variabel bernama (`learning_rate = 1e-3`).",
    "Ingat `/` selalu menghasilkan float; gunakan `//` jika memang butuh bilangan bulat.",
  ],
  exercises: [
    {
      id: "py-numbers-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Kuadrat error",
      prompt: "Lengkapi operator agar `squared_error` berisi kuadrat dari `error`, dan output-nya `16`.",
      starter: `error = -4
squared_error = error ____ 2
print(squared_error)`,
      solution: `error = -4
squared_error = error ** 2
print(squared_error)`,
      tests: [
        { desc: "squared_error = 16", expr: "squared_error == 16" },
        { desc: "Output 16", expr: "_lines == ['16']" },
      ],
      hints: ["Konsep: pangkat.", "Operator pangkat terdiri dari dua karakter yang sama.", "`error ** 2`"],
      explanation: "`**` adalah operator pangkat; (-4)² = 16.",
    },
    {
      id: "py-numbers-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `print(20 // 6)
print(20 % 6)
print(20 / 5)
print(round(4.5))`,
      answer: "3\n2\n4.0\n4",
      hints: ["Konsep: //, %, /, dan banker's rounding.", "20 = 6 × 3 + 2.", "round(4.5) dibulatkan ke genap terdekat."],
      explanation: "20 // 6 = 3, 20 % 6 = 2, 20 / 5 = 4.0 (float), round(4.5) = 4 (genap terdekat).",
    },
    {
      id: "py-numbers-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Rata-rata yang salah",
      prompt: "Kode berikut seharusnya menghitung rata-rata dari tiga nilai (80, 90, 70) = 80.0, tetapi hasilnya salah. Perbaiki rumusnya.",
      starter: `a = 80
b = 90
c = 70
rata = a + b + c / 3
print(rata)`,
      solution: `a = 80
b = 90
c = 70
rata = (a + b + c) / 3
print(rata)`,
      tests: [
        { desc: "rata = 80.0", expr: "rata == 80.0" },
        { desc: "Output 80.0", expr: "_lines == ['80.0']" },
      ],
      hints: ["Konsep: urutan operasi.", "Pembagian dikerjakan sebelum penjumlahan.", "Bungkus penjumlahan dengan tanda kurung."],
      explanation: "Tanpa kurung, hanya `c` yang dibagi 3. Dengan kurung, jumlah seluruhnya dibagi 3.",
    },
    {
      id: "py-numbers-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Mean Absolute Error dua prediksi",
      prompt: [
        "Ada dua data: `y1 = 10`, `pred1 = 12`, `y2 = 20`, `pred2 = 17`.",
        "Hitung `mae` = (|y1 − pred1| + |y2 − pred2|) / 2 menggunakan `abs()`, lalu cetak `MAE: 2.5`.",
      ],
      starter: `y1, pred1 = 10, 12
y2, pred2 = 20, 17
# Tulis kodemu di sini
`,
      solution: `y1, pred1 = 10, 12
y2, pred2 = 20, 17
mae = (abs(y1 - pred1) + abs(y2 - pred2)) / 2
print("MAE:", mae)`,
      tests: [
        { desc: "mae = 2.5", expr: "mae == 2.5" },
        { desc: "Memakai abs()", expr: "'abs(' in _code" },
        { desc: "Output 'MAE: 2.5'", expr: "_lines == ['MAE: 2.5']" },
      ],
      hints: ["Konsep: nilai mutlak dan rata-rata.", "`abs(y1 - pred1)` = 2, `abs(y2 - pred2)` = 3.", "`mae = (abs(...) + abs(...)) / 2`"],
      explanation: "MAE adalah rata-rata dari nilai mutlak error: (2 + 3) / 2 = 2.5.",
    },
    {
      id: "py-numbers-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Pembagian data train/test",
      prompt: [
        "Dataset berisi `n = 403` baris. Kamu ingin 20% untuk test.",
        "Hitung `n_test` = 20% dari n **dibulatkan ke atas** (petunjuk: `-(-a // b)` adalah trik ceiling division), dan `n_train = n - n_test`.",
        "Cetak `Train: 322 Test: 81`.",
      ],
      starter: `n = 403
# Tulis kodemu di sini
`,
      solution: `n = 403
n_test = -(-n * 20 // 100)
n_train = n - n_test
print("Train:", n_train, "Test:", n_test)`,
      alternatives: [`import math
n = 403
n_test = math.ceil(n * 0.2)
n_train = n - n_test
print("Train:", n_train, "Test:", n_test)`],
      tests: [
        { desc: "n_test = 81", expr: "n_test == 81" },
        { desc: "n_train = 322", expr: "n_train == 322" },
        { desc: "Output benar", expr: "_lines == ['Train: 322 Test: 81']" },
      ],
      hints: ["Konsep: 20% dari 403 = 80.6 → dibulatkan ke atas 81.", "Ceiling division: `-(-a // b)`; dengan a = n * 20 dan b = 100.", "`n_test = -(-n * 20 // 100)`"],
      explanation: "`train_test_split` di scikit-learn juga membulatkan jumlah test ke atas (ceil). Solusi dengan `math.ceil` (materi Importing Modules) juga diterima.",
    },
  ],
  quiz: [
    { id: "py-numbers-q1", type: "predict", prompt: "Apa output kode berikut?", code: `print(9 // 2, 9 % 2)`, options: ["4.5 1", "4 1", "4 0.5", "5 1"], answer: 1, explanation: "9 = 2 × 4 + 1." },
    { id: "py-numbers-q2", type: "mcq", prompt: "Operator untuk pangkat di Python adalah…", options: ["^", "**", "pow^", "//"], answer: 1, explanation: "`**`. Operator `^` adalah XOR bit." },
    { id: "py-numbers-q3", type: "tf", prompt: "`10 / 5` menghasilkan `2` (int).", answer: false, explanation: "Pembagian `/` selalu menghasilkan float: `2.0`." },
    { id: "py-numbers-q4", type: "fill", prompt: "Fungsi bawaan untuk nilai mutlak (misalnya mengubah -3 menjadi 3) adalah ____()", answer: ["abs", "abs()"], explanation: "`abs(-3)` → 3." },
    { id: "py-numbers-q5", type: "case", prompt: "Kamu menulis `rmse = mse ** 1/2` untuk menghitung akar MSE. Apa masalahnya?", options: ["Tidak ada masalah", "`**` dihitung dulu sehingga hasilnya mse / 2, bukan akar", "Harus memakai `^`", "Akar tidak bisa dihitung di Python"], answer: 1, explanation: "`mse ** 1/2` = `(mse ** 1) / 2`. Tulis `mse ** 0.5` atau `mse ** (1/2)`." },
  ],
  challenge: {
    id: "py-numbers-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — MSE dan RMSE tiga prediksi",
    prompt: [
      "Data aktual: 3, 5, 7. Prediksi model: 2.5, 5, 8.",
      "Hitung `mse` = rata-rata kuadrat selisih (aktual − prediksi), lalu `rmse` = akar dari mse.",
      "Cetak hasil dengan `round(..., 3)`:\n```\nMSE: 0.417\nRMSE: 0.645\n```",
    ],
    starter: `a1, a2, a3 = 3, 5, 7
p1, p2, p3 = 2.5, 5, 8
# Tulis kodemu di sini
`,
    solution: `a1, a2, a3 = 3, 5, 7
p1, p2, p3 = 2.5, 5, 8
mse = ((a1 - p1) ** 2 + (a2 - p2) ** 2 + (a3 - p3) ** 2) / 3
rmse = mse ** 0.5
print("MSE:", round(mse, 3))
print("RMSE:", round(rmse, 3))`,
    tests: [
      { desc: "mse ≈ 0.41667", expr: "abs(mse - 1.25/3) < 1e-9" },
      { desc: "rmse = akar mse", expr: "abs(rmse - (1.25/3) ** 0.5) < 1e-9" },
      { desc: "Output sesuai", expr: "_lines == ['MSE: 0.417', 'RMSE: 0.645']" },
    ],
    hints: ["Konsep: kuadrat, rata-rata, akar, urutan operasi.", "Jumlahkan tiga `(a - p) ** 2` di dalam kurung, lalu bagi 3.", "`rmse = mse ** 0.5`"],
    explanation: "(0.25 + 0 + 1) / 3 = 0.41667; akar-nya 0.6455. Inilah MSE dan RMSE yang nanti dihitung otomatis oleh scikit-learn.",
  },
  summary: [
    "Operator: `+ - * / // % **`. `/` selalu float, `//` floor division, `%` sisa bagi.",
    "Urutan: `**` → `* / // %` → `+ -`. Gunakan kurung untuk memperjelas.",
    "`round(x, n)` membulatkan (banker's rounding untuk .5); `abs(x)` nilai mutlak.",
    "Float tidak selalu presisi (`0.1 + 0.2`); jangan bandingkan float dengan `==` secara langsung.",
    "Notasi ilmiah `1e-3` dan underscore `1_000` mempermudah membaca angka.",
  ],
  cheatsheet: [
    { syntax: "a / b", desc: "Pembagian (float)" },
    { syntax: "a // b", desc: "Floor division" },
    { syntax: "a % b", desc: "Sisa bagi" },
    { syntax: "a ** 2", desc: "Kuadrat" },
    { syntax: "x ** 0.5", desc: "Akar kuadrat" },
    { syntax: "round(x, 2)", desc: "Bulatkan 2 desimal" },
    { syntax: "abs(x)", desc: "Nilai mutlak" },
  ],
  flashcards: [
    { q: "Sisa bagi 17 dengan 5", a: "17 % 5   # 2" },
    { q: "Hasil bagi bulat 17 dengan 5", a: "17 // 5   # 3" },
    { q: "Akar kuadrat dari mse", a: "mse ** 0.5" },
    { q: "Bulatkan 3.14159 menjadi 2 desimal", a: "round(3.14159, 2)" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3.1.1 Numbers", "tutorial/introduction.html#numbers"),
    pyDoc("Built-in Types — Numeric Types", "library/stdtypes.html#numeric-types-int-float-complex"),
    pyDoc("Built-in Functions — round()", "library/functions.html#round"),
    pyDoc("Floating-Point Arithmetic: Issues and Limitations", "tutorial/floatingpoint.html"),
    kagglePy("Hello, Python — arithmetic operators", "hello-python"),
  ],
};
