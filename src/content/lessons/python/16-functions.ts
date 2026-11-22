import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-functions",
  title: "Functions",
  minutes: 55,
  prerequisites: ["py-for-loop", "py-conditional-statements"],
  objectives: [
    "Mendefinisikan function dengan `def` dan memanggilnya.",
    "Membedakan parameter (di definisi) dan argument (saat pemanggilan).",
    "Mengembalikan nilai dengan `return`, termasuk beberapa nilai sekaligus (tuple).",
    "Memakai default parameter dan keyword argument.",
    "Menulis docstring dan memahami scope variabel lokal.",
  ],
  definition: [
    "**Function** (fungsi) adalah blok kode bernama yang bisa dipanggil berulang kali. Kamu sudah memakai fungsi bawaan seperti `print()`, `len()`, dan `sum()`. Sekarang kamu membuat fungsimu sendiri.",
    "Fungsi didefinisikan dengan kata kunci `def`, diikuti nama fungsi, tanda kurung berisi **parameter**, dan titik dua. Isi fungsi menjorok 4 spasi.",
    "**Parameter** adalah nama variabel di dalam definisi fungsi (`def luas(panjang, lebar)`). **Argument** adalah nilai nyata yang dikirim saat memanggil (`luas(3, 4)`).",
    "`return` mengirim hasil keluar dari fungsi dan **langsung menghentikan** fungsi. Fungsi tanpa `return` mengembalikan `None`. Perhatikan beda `print` (menampilkan ke layar) dan `return` (mengembalikan nilai yang bisa disimpan/dipakai lagi).",
    "Variabel yang dibuat di dalam fungsi bersifat **lokal** — hanya ada selama fungsi berjalan dan tidak bisa diakses dari luar.",
  ],
  why: [
    "Prinsip **DRY** (*Don't Repeat Yourself*): kode yang dipakai berulang (misalnya menghitung metrik, membersihkan kolom) cukup ditulis sekali.",
    "Seluruh scikit-learn dan Pandas adalah kumpulan fungsi dan method. Memahami parameter, default, dan keyword argument membuat dokumentasi seperti `train_test_split(X, y, test_size=0.2, random_state=42)` mudah dibaca.",
    "Di tahap deployment, kamu akan membuat fungsi `predict(data_baru)` yang memuat model dan mengembalikan prediksi.",
  ],
  when: [
    "- Saat kode yang sama ditulis lebih dari dua kali.",
    "- Saat ingin memberi nama pada sebuah langkah agar program mudah dibaca (`clean_data()`, `evaluate_model()`).",
    "- Saat ingin menguji satu bagian logika secara terpisah.",
  ],
  analogy: "Function seperti **resep di aplikasi masak**: resep \"Nasi Goreng\" ditulis sekali dengan bahan (parameter) seperti jumlah porsi dan tingkat pedas. Setiap kali memasak, kamu cukup memanggil resepnya dengan nilai bahan yang berbeda (argument), dan hasilnya (return) adalah sepiring nasi goreng yang bisa kamu sajikan atau simpan.",
  syntax: {
    code: `def nama_fungsi(param1, param2=nilai_default):
    """Docstring: penjelasan singkat fungsi."""
    hasil = ...
    return hasil

nilai = nama_fungsi(arg1, param2=arg2)`,
  },
  anatomy: [
    ["def", "Kata kunci untuk mendefinisikan fungsi."],
    ["nama_fungsi", "Nama fungsi (snake_case, sebaiknya kata kerja: `hitung_mae`)."],
    ["(param1, param2=...)", "Parameter. `param2=nilai` adalah default parameter (opsional saat dipanggil)."],
    ["\"\"\"Docstring\"\"\"", "Dokumentasi fungsi; bisa dibaca dengan `help(nama_fungsi)`."],
    ["return", "Mengembalikan nilai dan mengakhiri fungsi."],
    ["nama_fungsi(arg1, param2=arg2)", "Pemanggilan: positional argument lalu keyword argument."],
  ],
  examples: [
    {
      title: "Contoh 1 — Fungsi tanpa parameter dan tanpa return",
      code: `def sapa():
    print("Halo, selamat belajar ML!")

sapa()
sapa()`,
      output: "Halo, selamat belajar ML!\nHalo, selamat belajar ML!",
      explain: [
        ["def sapa():", "Mendefinisikan fungsi bernama `sapa` tanpa parameter. Belum ada yang dijalankan."],
        ["    print(\"Halo, selamat belajar ML!\")", "Isi fungsi."],
        ["sapa()", "Memanggil fungsi — barulah isinya dijalankan. Tanda kurung wajib."],
      ],
    },
    {
      title: "Contoh 2 — Parameter dan return",
      code: `def hitung_akurasi(benar, total):
    akurasi = benar / total
    return akurasi

acc = hitung_akurasi(45, 50)
print(acc)
print(hitung_akurasi(9, 10) * 100, "%")`,
      output: "0.9\n90.0 %",
      explain: [
        ["def hitung_akurasi(benar, total):", "Dua parameter."],
        ["    return akurasi", "Mengirim hasil ke pemanggil."],
        ["acc = hitung_akurasi(45, 50)", "Argument 45 masuk ke `benar`, 50 ke `total`. Hasil return disimpan ke `acc`."],
        ["hitung_akurasi(9, 10) * 100", "Hasil return bisa langsung dipakai dalam ekspresi lain."],
      ],
      change: "Fungsi sekarang menerima input dan mengembalikan output yang bisa dipakai ulang.",
    },
    {
      title: "Contoh 3 — Default parameter dan keyword argument",
      code: `def prediksi_label(prob, threshold=0.5):
    if prob >= threshold:
        return 1
    return 0

print(prediksi_label(0.42))
print(prediksi_label(0.42, 0.4))
print(prediksi_label(prob=0.42, threshold=0.3))`,
      output: "0\n1\n1",
      explain: [
        ["def prediksi_label(prob, threshold=0.5):", "`threshold` punya nilai default 0.5."],
        ["        return 1", "`return` langsung mengakhiri fungsi, sehingga `return 0` tidak dijalankan."],
        ["prediksi_label(0.42)", "threshold memakai default 0.5 → 0."],
        ["prediksi_label(0.42, 0.4)", "Argument kedua mengganti default → 1."],
        ["prediksi_label(prob=0.42, threshold=0.3)", "Keyword argument: menyebut nama parameter, urutan bebas dan lebih jelas."],
      ],
      change: "Pola yang sama dipakai di seluruh scikit-learn: parameter opsional dengan nilai default.",
    },
    {
      title: "Contoh 4 — Mengembalikan beberapa nilai",
      code: `def ringkasan(data):
    """Mengembalikan (minimum, maksimum, rata-rata) dari list angka."""
    rata = sum(data) / len(data)
    return min(data), max(data), rata

nilai = [70, 85, 90, 65]
mn, mx, avg = ringkasan(nilai)
print(mn, mx, avg)
print(ringkasan.__doc__)`,
      output: "65 90 77.5\nMengembalikan (minimum, maksimum, rata-rata) dari list angka.",
      explain: [
        ["    \"\"\"Mengembalikan (minimum, maksimum, rata-rata) dari list angka.\"\"\"", "Docstring menjelaskan apa yang dikembalikan fungsi."],
        ["    return min(data), max(data), rata", "Tiga nilai dikembalikan sebagai satu tuple."],
        ["mn, mx, avg = ringkasan(nilai)", "Tuple di-unpack — sama seperti `X_train, X_test, ... = train_test_split(...)`."],
        ["ringkasan.__doc__", "Mengakses docstring fungsi."],
      ],
      change: "Fungsi kini mengembalikan beberapa nilai dan memiliki dokumentasi.",
    },
    {
      title: "Contoh 5 — Scope dan print vs return",
      code: `def kuadrat_cetak(x):
    print(x ** 2)

def kuadrat(x):
    hasil = x ** 2
    return hasil

a = kuadrat_cetak(3)
b = kuadrat(3)
print("a =", a)
print("b =", b)
print("hasil" in dir())`,
      output: "9\na = None\nb = 9\nFalse",
      explain: [
        ["a = kuadrat_cetak(3)", "Fungsi mencetak 9 tetapi **tidak** mengembalikan apa pun → a = None."],
        ["b = kuadrat(3)", "Fungsi mengembalikan 9 → b = 9."],
        ["print(\"hasil\" in dir())", "`dir()` mendaftar nama variabel di luar fungsi. `hasil` adalah variabel lokal, jadi tidak ada di luar → False."],
      ],
      change: "Contoh ini menegaskan dua miskonsepsi pemula: print ≠ return, dan variabel lokal tidak bocor ke luar fungsi.",
    },
  ],
  params: [
    {
      title: "Jenis argument saat memanggil fungsi",
      items: [
        { name: "Positional argument", desc: "Dicocokkan berdasarkan urutan: `f(1, 2)`." },
        { name: "Keyword argument", desc: "Menyebut nama parameter: `f(b=2, a=1)`. Harus ditulis setelah positional argument." },
        { name: "Default parameter", desc: "Parameter dengan nilai bawaan: `def f(a, b=10)`. Parameter tanpa default harus ditulis lebih dulu." },
        { name: "return", desc: "Tanpa return, fungsi mengembalikan `None`." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `def luas(p, l=1):\n    return p * l\nprint(luas(4), luas(4, 3), luas(l=2, p=5))`, output: "4 12 10" },
  tryIt: `def hitung_mae(y_true, y_pred):
    """Mean Absolute Error untuk dua list."""
    total = 0
    for a, p in zip(y_true, y_pred):
        total += abs(a - p)
    return total / len(y_true)

print(hitung_mae([3, 5, 7], [2.5, 5, 8]))`,
  mistakes: [
    {
      title: "Memanggil fungsi sebelum didefinisikan",
      wrong: `print(dobel(4))
def dobel(x):
    return x * 2`,
      error: "NameError",
      fix: `def dobel(x):
    return x * 2
print(dobel(4))`,
      explain: "Python membaca dari atas; definisi harus dijalankan sebelum pemanggilan.",
    },
    {
      title: "Jumlah argument tidak sesuai",
      wrong: `def bagi(a, b):
    return a / b
print(bagi(10))`,
      error: "TypeError",
      fix: `def bagi(a, b):
    return a / b
print(bagi(10, 2))`,
      explain: "*missing 1 required positional argument: 'b'* — berikan semua argument wajib.",
    },
    {
      title: "Memakai print padahal butuh return",
      wrong: `def tambah(a, b):
    print(a + b)
total = tambah(2, 3) * 10`,
      error: "TypeError",
      fix: `def tambah(a, b):
    return a + b
total = tambah(2, 3) * 10
print(total)`,
      explain: "Fungsi tanpa return mengembalikan None; `None * 10` → TypeError.",
    },
    {
      title: "Mengakses variabel lokal dari luar",
      wrong: `def latih():
    akurasi = 0.9
latih()
print(akurasi)`,
      error: "NameError",
      fix: `def latih():
    akurasi = 0.9
    return akurasi
akurasi = latih()
print(akurasi)`,
      explain: "Kembalikan nilai dengan `return` lalu simpan di luar fungsi.",
    },
  ],
  bestPractices: [
    "Satu fungsi, satu tugas. Beri nama berupa kata kerja: `load_data`, `hitung_rmse`.",
    "Gunakan `return` untuk hasil; `print` hanya untuk menampilkan informasi.",
    "Tulis docstring yang menjelaskan parameter dan nilai kembalian.",
    "Gunakan keyword argument untuk parameter opsional agar pemanggilan mudah dibaca.",
    "Jangan memakai list/dict sebagai nilai default (`def f(x=[])`) — gunakan `None` lalu buat di dalam fungsi.",
  ],
  exercises: [
    {
      id: "py-func-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Definisikan fungsi",
      prompt: "Lengkapi kata kunci agar fungsi `kali_dua` mengembalikan dua kali nilai x.",
      starter: `____ kali_dua(x):
    ____ x * 2

print(kali_dua(21))`,
      solution: `def kali_dua(x):
    return x * 2

print(kali_dua(21))`,
      tests: [
        { desc: "kali_dua(21) == 42", expr: "kali_dua(21) == 42" },
        { desc: "kali_dua(-3) == -6", expr: "kali_dua(-3) == -6" },
        { desc: "Output 42", expr: "_lines == ['42']" },
      ],
      hints: ["Konsep: definisi fungsi dan return.", "Kata kunci definisi 3 huruf; kata kunci pengembalian 6 huruf.", "`def kali_dua(x):` dan `return x * 2`"],
      explanation: "Test memanggil fungsimu dengan beberapa input — fungsi dinilai dari perilakunya, bukan teksnya.",
    },
    {
      id: "py-func-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `def f(a, b=2):
    return a ** b

def g(x):
    print(x)

print(f(3))
print(f(2, b=3))
print(g(5))`,
      answer: "9\n8\n5\nNone",
      hints: ["Konsep: default parameter dan fungsi tanpa return.", "f(3) memakai b = 2.", "g(5) mencetak 5 lalu mengembalikan None, yang kemudian dicetak."],
      explanation: "3² = 9; 2³ = 8; g(5) mencetak 5 dan mengembalikan None.",
    },
    {
      id: "py-func-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Fungsi RMSE",
      prompt: "Fungsi ini seharusnya mengembalikan RMSE, tetapi `hasil` bernilai None dan ada error. Perbaiki fungsi agar `rmse([3, 5], [1, 5])` mengembalikan `1.4142135623730951`.",
      starter: `def rmse(y_true, y_pred):
    total = 0
    for a, p in zip(y_true, y_pred):
        total += (a - p) ** 2
    print((total / len(y_true)) ** 0.5)

hasil = rmse([3, 5], [1, 5])
print(round(hasil, 3))`,
      solution: `def rmse(y_true, y_pred):
    total = 0
    for a, p in zip(y_true, y_pred):
        total += (a - p) ** 2
    return (total / len(y_true)) ** 0.5

hasil = rmse([3, 5], [1, 5])
print(round(hasil, 3))`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "rmse([3, 5], [1, 5]) ≈ 1.41421", expr: "abs(rmse([3, 5], [1, 5]) - 2 ** 0.5) < 1e-12" },
        { desc: "rmse([1, 2, 3], [1, 2, 3]) == 0", expr: "rmse([1, 2, 3], [1, 2, 3]) == 0" },
        { desc: "Output 1.414", expr: "_lines[-1] == '1.414'" },
      ],
      hints: ["Konsep: print vs return.", "Fungsi menampilkan hasil tetapi tidak mengembalikannya.", "Ganti `print(...)` di baris terakhir fungsi dengan `return ...`."],
      explanation: "Tanpa return, `hasil` adalah None sehingga `round(None, 3)` memunculkan TypeError.",
    },
    {
      id: "py-func-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi kategori BMI",
      prompt: [
        "Tulis fungsi `kategori_bmi(berat, tinggi)` yang menghitung BMI = berat / tinggi² (tinggi dalam meter) dan **mengembalikan** string:",
        "- BMI < 18.5 → `\"kurus\"`\n- BMI < 25 → `\"normal\"`\n- selain itu → `\"berlebih\"`",
        "Panggil `print(kategori_bmi(60, 1.70))` → `normal`.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `def kategori_bmi(berat, tinggi):
    bmi = berat / tinggi ** 2
    if bmi < 18.5:
        return "kurus"
    elif bmi < 25:
        return "normal"
    else:
        return "berlebih"

print(kategori_bmi(60, 1.70))`,
      tests: [
        { desc: "kategori_bmi(60, 1.70) == 'normal'", expr: "kategori_bmi(60, 1.70) == 'normal'" },
        { desc: "kategori_bmi(45, 1.70) == 'kurus'", expr: "kategori_bmi(45, 1.70) == 'kurus'" },
        { desc: "kategori_bmi(90, 1.70) == 'berlebih'", expr: "kategori_bmi(90, 1.70) == 'berlebih'" },
        { desc: "Mengembalikan nilai (bukan hanya print)", expr: "isinstance(kategori_bmi(60, 1.7), str)" },
      ],
      hints: ["Konsep: fungsi + if/elif/else + return.", "Hitung `bmi = berat / tinggi ** 2` di dalam fungsi.", "Setiap cabang memakai `return \"...\"`."],
      explanation: "Test mencoba tiga input berbeda untuk memastikan semua cabang benar.",
    },
    {
      id: "py-func-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Fungsi split sederhana",
      prompt: [
        "Tulis fungsi `split_data(data, test_ratio=0.2)` yang mengembalikan dua list: `train` (bagian awal) dan `test` (bagian akhir). Jumlah data test = `round(len(data) * test_ratio)`.",
        "Contoh: `train, test = split_data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])` → train = [1..8], test = [9, 10].",
        "Cetak `len(train)` dan `len(test)` → `8 2`.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `def split_data(data, test_ratio=0.2):
    n_test = round(len(data) * test_ratio)
    n_train = len(data) - n_test
    return data[:n_train], data[n_train:]

train, test = split_data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
print(len(train), len(test))`,
      tests: [
        { desc: "Default 0.2 pada 10 data → 8 dan 2", expr: "[len(x) for x in split_data(list(range(10)))] == [8, 2]" },
        { desc: "test_ratio=0.3 pada 10 data → 7 dan 3", expr: "[len(x) for x in split_data(list(range(10)), test_ratio=0.3)] == [7, 3]" },
        { desc: "Isi test adalah bagian akhir", expr: "split_data([1, 2, 3, 4, 5])[1] == [5]" },
        { desc: "Output '8 2'", expr: "_lines == ['8 2']" },
      ],
      hints: ["Konsep: default parameter + return dua nilai + slicing.", "Hitung n_test lalu n_train = len(data) − n_test.", "`return data[:n_train], data[n_train:]`"],
      explanation: "Versi sungguhan, `train_test_split`, juga **mengacak** data sebelum membagi (parameter `shuffle=True` dan `random_state`) — dipelajari di Module 07.",
    },
  ],
  quiz: [
    { id: "py-func-q1", type: "predict", prompt: "Apa outputnya?", code: `def f(x):\n    return x + 1\n    print("tidak tercetak")\nprint(f(1))`, options: ["2", "tidak tercetak\n2", "2\ntidak tercetak", "None"], answer: 0, explanation: "`return` mengakhiri fungsi; baris setelahnya tidak dijalankan." },
    { id: "py-func-q2", type: "mcq", prompt: "Pada `def latih(model, epochs=10):`, apa itu `epochs=10`?", options: ["Keyword argument", "Default parameter", "Return value", "Variabel global"], answer: 1, explanation: "Parameter dengan nilai default; boleh tidak diisi saat memanggil." },
    { id: "py-func-q3", type: "tf", prompt: "Fungsi yang tidak memiliki `return` mengembalikan `None`.", answer: true, explanation: "Benar." },
    { id: "py-func-q4", type: "fill", prompt: "Kata kunci untuk mendefinisikan fungsi di Python adalah ____", answer: ["def"], explanation: "`def nama():`" },
    { id: "py-func-q5", type: "case", prompt: "Di dokumentasi scikit-learn tertulis `train_test_split(*arrays, test_size=None, random_state=None, ...)`. Apa arti `test_size=None`?", options: ["test_size wajib diisi", "test_size adalah parameter opsional dengan default None (scikit-learn lalu memakai 0.25)", "test_size selalu None", "Fungsi tidak punya parameter test_size"], answer: 1, explanation: "Default None; dokumentasi menjelaskan bahwa bila test_size dan train_size sama-sama None, test_size = 0.25." },
  ],
  challenge: {
    id: "py-func-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fungsi evaluasi klasifikasi",
    prompt: [
      "Tulis fungsi `evaluasi(y_true, y_pred)` yang mengembalikan **tiga nilai**: `accuracy`, `precision`, `recall` untuk label biner (1 = positif).",
      "- precision = TP / (TP + FP), recall = TP / (TP + FN). Jika pembagi 0, kembalikan 0.0 untuk metrik tersebut.",
      "Uji: `acc, prec, rec = evaluasi([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1])` lalu cetak `0.67 0.75 0.75` (format 2 desimal dengan f-string).",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `def evaluasi(y_true, y_pred):
    tp = fp = fn = benar = 0
    for a, p in zip(y_true, y_pred):
        if a == p:
            benar += 1
        if a == 1 and p == 1:
            tp += 1
        elif a == 0 and p == 1:
            fp += 1
        elif a == 1 and p == 0:
            fn += 1
    accuracy = benar / len(y_true)
    precision = tp / (tp + fp) if tp + fp > 0 else 0.0
    recall = tp / (tp + fn) if tp + fn > 0 else 0.0
    return accuracy, precision, recall

acc, prec, rec = evaluasi([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1])
print(f"{acc:.2f} {prec:.2f} {rec:.2f}")`,
    tests: [
      { desc: "Contoh soal", expr: "[round(v, 4) for v in evaluasi([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1])] == [0.6667, 0.75, 0.75]" },
      { desc: "Semua benar → (1.0, 1.0, 1.0)", expr: "evaluasi([1, 0, 1], [1, 0, 1]) == (1.0, 1.0, 1.0)" },
      { desc: "Tidak ada prediksi positif → precision 0.0 tanpa error", expr: "evaluasi([1, 0], [0, 0]) == (0.5, 0.0, 0.0)" },
      { desc: "Output sesuai", expr: "_lines == ['0.67 0.75 0.75']" },
    ],
    hints: ["Konsep: fungsi + loop + if + return beberapa nilai.", "Hitung TP, FP, FN, dan jumlah benar dalam satu loop zip.", "`precision = tp / (tp + fp) if tp + fp > 0 else 0.0`"],
    explanation: "Penanganan pembagi nol meniru perilaku `zero_division` di `sklearn.metrics.precision_score`.",
  },
  summary: [
    "`def nama(param):` mendefinisikan fungsi; `nama(arg)` memanggilnya.",
    "Parameter = nama di definisi; argument = nilai saat memanggil.",
    "`return` mengirim hasil dan mengakhiri fungsi; tanpa return → None.",
    "Default parameter (`b=2`) dan keyword argument (`f(b=3)`) seperti di scikit-learn.",
    "Variabel di dalam fungsi bersifat lokal; tulis docstring untuk dokumentasi.",
  ],
  cheatsheet: [
    { syntax: "def f(x):\n    return x * 2", desc: "Fungsi sederhana" },
    { syntax: "def f(x, n=2):", desc: "Default parameter" },
    { syntax: "f(x=1, n=3)", desc: "Keyword argument" },
    { syntax: "return a, b", desc: "Kembalikan beberapa nilai" },
    { syntax: "a, b = f(x)", desc: "Unpack hasil" },
    { syntax: '"""Docstring."""', desc: "Dokumentasi fungsi" },
  ],
  flashcards: [
    { q: "Definisikan fungsi kuadrat(x) yang mengembalikan x pangkat 2", a: "def kuadrat(x):\n    return x ** 2" },
    { q: "Fungsi dengan parameter threshold default 0.5", a: "def prediksi(prob, threshold=0.5):" },
    { q: "Kembalikan dua nilai a dan b dari fungsi", a: "return a, b" },
    { q: "Apa yang dikembalikan fungsi tanpa return?", a: "None" },
  ],
  references: [
    pyDoc("The Python Tutorial — 4.8 Defining Functions", "tutorial/controlflow.html#defining-functions"),
    pyDoc("The Python Tutorial — 4.9 More on Defining Functions (default & keyword arguments)", "tutorial/controlflow.html#more-on-defining-functions"),
    pyDoc("The Python Tutorial — 4.9.7 Documentation Strings", "tutorial/controlflow.html#documentation-strings"),
    kagglePy("Functions and Getting Help (Kaggle Learn Python)", "functions-and-getting-help"),
  ],
};
