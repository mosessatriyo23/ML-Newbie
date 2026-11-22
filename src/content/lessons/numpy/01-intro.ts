import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-introduction-to-numpy",
  title: "Introduction to NumPy",
  minutes: 40,
  prerequisites: ["py-list", "py-importing-modules"],
  objectives: [
    "Menjelaskan apa itu NumPy dan mengapa hampir semua library Data Science dibangun di atasnya.",
    "Mengimpor NumPy dengan konvensi `import numpy as np`.",
    "Membuat array pertama dengan `np.array()` dari sebuah list.",
    "Membedakan perilaku list Python dan NumPy array pada operasi matematika.",
    "Memahami istilah vectorization dan mengapa NumPy jauh lebih cepat.",
  ],
  definition: [
    "**NumPy** (*Numerical Python*) adalah library untuk komputasi numerik. Objek utamanya adalah **ndarray** (*n-dimensional array*): wadah berisi banyak angka dengan **tipe data yang sama**, disusun dalam satu atau beberapa dimensi (baris, kolom, dan seterusnya).",
    "Berbeda dengan list Python yang bisa berisi campuran tipe dan menyimpan setiap elemen sebagai objek terpisah, NumPy array menyimpan angka secara rapat di memori. Akibatnya operasi pada jutaan angka bisa dilakukan sekaligus oleh kode C yang sangat cepat.",
    "Konsep kuncinya adalah **vectorization**: kamu menulis operasi untuk seluruh array (`harga * 1.1`), bukan menulis for loop untuk setiap elemen. NumPy yang mengerjakan pengulangannya secara internal.",
    "Pandas, scikit-learn, Matplotlib, dan seaborn semuanya memakai NumPy di dalamnya. Kolom DataFrame pada dasarnya adalah array NumPy, dan `model.predict()` mengembalikan array NumPy.",
  ],
  why: [
    "Machine Learning adalah operasi matematika pada banyak angka sekaligus: menghitung error untuk ribuan prediksi, menormalkan fitur, mengalikan matriks bobot. NumPy membuat semua itu ringkas dan cepat.",
    "Hampir setiap hasil scikit-learn berupa NumPy array (`y_pred`, `model.coef_`, `predict_proba`). Tanpa memahami array, kamu akan kesulitan membaca dan mengolah hasil model.",
  ],
  when: [
    "- Saat melakukan perhitungan numerik pada banyak nilai (rata-rata, standar deviasi, operasi elemen per elemen).",
    "- Saat bekerja dengan data berbentuk matriks (gambar, fitur model).",
    "- Untuk data tabular dengan nama kolom dan tipe campuran, gunakan Pandas (yang dibangun di atas NumPy).",
  ],
  analogy: "List Python seperti **tas belanja**: bisa berisi apa saja (apel, buku, kunci), tetapi untuk memproses isinya kamu harus mengambilnya satu per satu. NumPy array seperti **rak telur**: semua isinya sejenis dan tersusun rapi, sehingga satu perintah bisa diterapkan ke seluruh rak sekaligus — misalnya \"cap semua telur dengan tanggal\".",
  syntax: {
    code: `import numpy as np

arr = np.array([1, 2, 3])
arr * 2          # operasi untuk semua elemen
arr.mean()       # method statistik`,
    note: "`np` adalah alias yang dipakai di seluruh dokumentasi resmi dan komunitas. Selalu gunakan alias ini.",
  },
  anatomy: [
    ["import numpy as np", "Memuat library NumPy dan memberinya nama pendek `np`."],
    ["np.array(list)", "Fungsi untuk membuat ndarray dari list (atau list bersarang)."],
    ["arr * 2", "Operasi vectorized: setiap elemen dikali 2 tanpa for loop."],
    ["arr.mean()", "Method milik array; menghitung rata-rata semua elemen."],
    ["ndarray", "Nama tipe objek array NumPy (`numpy.ndarray`)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Array pertama",
      code: `import numpy as np

nilai = np.array([80, 90, 75, 95])
print(nilai)
print(type(nilai))`,
      output: "[80 90 75 95]\n<class 'numpy.ndarray'>",
      explain: [
        ["import numpy as np", "Memuat NumPy dengan alias `np`."],
        ["nilai = np.array([80, 90, 75, 95])", "List Python diubah menjadi NumPy array."],
        ["print(nilai)", "Array dicetak **tanpa koma** di antara elemen — cara cepat membedakan array dari list."],
        ["print(type(nilai))", "Tipenya `numpy.ndarray`."],
      ],
    },
    {
      title: "Contoh 2 — List vs array pada operasi matematika",
      intro: "Operator yang sama memberi hasil yang sangat berbeda.",
      code: `import numpy as np

daftar = [1, 2, 3]
arr = np.array([1, 2, 3])

print(daftar * 2)
print(arr * 2)
print(daftar + daftar)
print(arr + arr)`,
      output: "[1, 2, 3, 1, 2, 3]\n[2 4 6]\n[1, 2, 3, 1, 2, 3]\n[2 4 6]",
      explain: [
        ["print(daftar * 2)", "Pada list, `* 2` berarti **mengulang** list."],
        ["print(arr * 2)", "Pada array, `* 2` berarti **mengalikan setiap elemen**."],
        ["print(daftar + daftar)", "Pada list, `+` berarti **menyambung**."],
        ["print(arr + arr)", "Pada array, `+` berarti **menjumlahkan elemen yang seposisi**."],
      ],
      change: "Contoh ini memperlihatkan perbedaan terpenting: array berperilaku seperti vektor matematika.",
    },
    {
      title: "Contoh 3 — Vectorization menggantikan for loop",
      code: `import numpy as np

harga = [10000, 25000, 40000]

# Cara list: butuh loop
harga_baru = []
for h in harga:
    harga_baru.append(h * 1.1)
print(harga_baru)

# Cara NumPy: satu baris
print(np.array(harga) * 1.1)`,
      output: "[11000.0, 27500.000000000004, 44000.0]\n[11000. 27500. 44000.]",
      explain: [
        ["for h in harga:", "Dengan list, setiap elemen diproses satu per satu."],
        ["harga_baru.append(h * 1.1)", "Hasil `27500.000000000004` adalah efek presisi float (lihat materi Numbers). NumPy menyimpan nilai yang sama, tetapi menampilkannya secara ringkas."],
        ["print(np.array(harga) * 1.1)", "Dengan NumPy, satu ekspresi berlaku untuk semua elemen. Perhatikan format cetakan array (titik di akhir angka desimal bulat)."],
      ],
      change: "Kode menjadi lebih pendek. Untuk jutaan data, versi NumPy juga puluhan kali lebih cepat.",
    },
    {
      title: "Contoh 4 — Method statistik bawaan",
      code: `import numpy as np

skor = np.array([0.82, 0.91, 0.77, 0.88])
print("Rata-rata:", skor.mean())
print("Maksimum:", skor.max())
print("Indeks maksimum:", skor.argmax())
print("Jumlah elemen:", skor.size)`,
      output: "Rata-rata: 0.845\nMaksimum: 0.91\nIndeks maksimum: 1\nJumlah elemen: 4",
      explain: [
        ["skor.mean()", "Rata-rata seluruh elemen."],
        ["skor.max()", "Nilai terbesar."],
        ["skor.argmax()", "**Posisi** (index) nilai terbesar — berguna untuk mencari model/fold terbaik."],
        ["skor.size", "Jumlah elemen (atribut, tanpa tanda kurung)."],
      ],
      change: "Array membawa method statistiknya sendiri, sehingga tidak perlu `sum(x) / len(x)` lagi.",
    },
  ],
  params: [
    {
      title: "np.array(object, dtype=None)",
      items: [
        { name: "object", type: "list / list bersarang / tuple", desc: "Data yang diubah menjadi array." },
        { name: "dtype", type: "tipe data", default: "None (ditebak otomatis)", desc: "Paksa tipe elemen, misalnya `float` atau `int`. Dibahas di materi Array Data Types." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nprint(np.array([3, 4]) ** 2)`, output: "[ 9 16]" },
  tryIt: `import numpy as np

y_true = np.array([3.0, 5.0, 7.0])
y_pred = np.array([2.5, 5.0, 8.0])

error = y_true - y_pred
print("Error per data:", error)
print("MAE:", np.abs(error).mean())`,
  mistakes: [
    {
      title: "Lupa import numpy",
      wrong: `arr = np.array([1, 2, 3])`,
      error: "NameError",
      fix: `import numpy as np
arr = np.array([1, 2, 3])
print(arr)`,
      explain: "Nama `np` hanya ada setelah `import numpy as np`.",
    },
    {
      title: "Lupa kurung siku di dalam np.array",
      wrong: `import numpy as np
arr = np.array(1, 2, 3)`,
      error: "TypeError",
      fix: `import numpy as np
arr = np.array([1, 2, 3])
print(arr)`,
      explain: "`np.array` menerima **satu** objek (list). Angka-angka harus dibungkus kurung siku.",
    },
    {
      title: "Mengira list ikut vectorized",
      wrong: `harga = [100, 200]
print(harga * 1.1)`,
      error: "TypeError",
      fix: `import numpy as np
harga = np.array([100, 200])
print(harga * 1.1)`,
      explain: "List tidak bisa dikali float. Ubah dulu menjadi array.",
    },
  ],
  bestPractices: [
    "Selalu `import numpy as np` di bagian atas notebook.",
    "Gunakan operasi vectorized, hindari for loop untuk perhitungan numerik.",
    "Simpan data numerik yang sejenis dalam array; gunakan Pandas untuk tabel bercampur tipe.",
    "Periksa tipe hasil dengan `type()` saat ragu apakah sesuatu list atau array.",
  ],
  exercises: [
    {
      id: "np-intro-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Buat array",
      prompt: "Lengkapi kode agar `berat` menjadi NumPy array dari list `[50, 62, 71]`.",
      starter: `import numpy as np
berat = np.____([50, 62, 71])
print(berat)`,
      solution: `import numpy as np
berat = np.array([50, 62, 71])
print(berat)`,
      tests: [
        { desc: "berat adalah ndarray", expr: "type(berat).__name__ == 'ndarray'" },
        { desc: "isi berat [50, 62, 71]", expr: "berat.tolist() == [50, 62, 71]" },
      ],
      hints: ["Konsep: membuat array dari list.", "Nama fungsinya sama dengan nama struktur datanya.", "`np.array([...])`"],
      explanation: "`np.array()` mengubah list menjadi ndarray.",
    },
    {
      id: "np-intro-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([1, 2, 3])
print(a + 10)
print([1, 2] * 2)`,
      answer: "[11 12 13]\n[1, 2, 1, 2]",
      hints: ["Konsep: operasi array vs list.", "Array: setiap elemen ditambah 10.", "List dikali 2 berarti diulang."],
      explanation: "Array menjumlahkan 10 ke setiap elemen; list yang dikali 2 diulang dua kali.",
    },
    {
      id: "np-intro-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Diskon 20%",
      prompt: "Kode ini error. Perbaiki agar `diskon` berisi semua harga dikali 0.8.",
      starter: `harga = [100000, 250000, 80000]
diskon = harga * 0.8
print(diskon)`,
      solution: `import numpy as np
harga = np.array([100000, 250000, 80000])
diskon = harga * 0.8
print(diskon)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "diskon benar", expr: "list(diskon) == [80000.0, 200000.0, 64000.0]" },
      ],
      hints: ["Konsep: list tidak mendukung operasi vectorized.", "Ubah list menjadi array NumPy.", "`import numpy as np` lalu `np.array(harga)`"],
      explanation: "Dengan array, `* 0.8` diterapkan ke setiap elemen.",
    },
    {
      id: "np-intro-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Konversi suhu",
      prompt: "Buat array `celcius` berisi 0, 25, 37, 100. Hitung `fahrenheit = celcius * 9 / 5 + 32` tanpa loop, lalu cetak hasilnya.",
      starter: `# Tulis kodemu di sini
`,
      solution: `import numpy as np
celcius = np.array([0, 25, 37, 100])
fahrenheit = celcius * 9 / 5 + 32
print(fahrenheit)`,
      tests: [
        { desc: "celcius array [0, 25, 37, 100]", expr: "list(celcius) == [0, 25, 37, 100]" },
        { desc: "fahrenheit benar", expr: "list(fahrenheit) == [32.0, 77.0, 98.6, 212.0]" },
        { desc: "Tanpa for loop", expr: "'for ' not in _code" },
      ],
      hints: ["Konsep: vectorization.", "Tulis rumusnya langsung pada array.", "`fahrenheit = celcius * 9 / 5 + 32`"],
      explanation: "Satu ekspresi menghitung keempat konversi sekaligus.",
    },
    {
      id: "np-intro-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Model terbaik",
      prompt: [
        "Diberikan nama model `nama = [\"KNN\", \"SVM\", \"Tree\", \"Forest\"]` dan skor `skor = np.array([0.81, 0.88, 0.79, 0.90])`.",
        "Tanpa loop, cari posisi skor tertinggi dengan `argmax()`, simpan nama model terbaik ke `terbaik`, dan cetak `Forest 0.9`.",
      ],
      starter: `import numpy as np
nama = ["KNN", "SVM", "Tree", "Forest"]
skor = np.array([0.81, 0.88, 0.79, 0.90])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
nama = ["KNN", "SVM", "Tree", "Forest"]
skor = np.array([0.81, 0.88, 0.79, 0.90])
i = skor.argmax()
terbaik = nama[i]
print(terbaik, skor[i])`,
      tests: [
        { desc: "terbaik = 'Forest'", expr: "terbaik == 'Forest'" },
        { desc: "Memakai argmax", expr: "'argmax' in _code" },
        { desc: "Output 'Forest 0.9'", expr: "_lines == ['Forest 0.9']" },
      ],
      hints: ["Konsep: argmax memberi posisi nilai terbesar.", "`i = skor.argmax()` lalu `nama[i]`.", "Cetak `nama[i]` dan `skor[i]`."],
      explanation: "argmax sering dipakai untuk memilih kelas dengan probabilitas tertinggi atau model dengan skor terbaik.",
    },
  ],
  quiz: [
    { id: "np-intro-q1", type: "mcq", prompt: "Alias standar untuk NumPy adalah…", options: ["nu", "np", "num", "npy"], answer: 1, explanation: "`import numpy as np`." },
    { id: "np-intro-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.array([2, 4, 6]) / 2)`, options: ["[1, 2, 3]", "[1. 2. 3.]", "[1 2 3]", "Error"], answer: 1, explanation: "Pembagian `/` menghasilkan float; array dicetak tanpa koma." },
    { id: "np-intro-q3", type: "tf", prompt: "Elemen di dalam satu NumPy array umumnya memiliki tipe data yang sama.", answer: true, explanation: "Itulah yang membuat NumPy cepat dan hemat memori." },
    { id: "np-intro-q4", type: "fill", prompt: "Istilah untuk menulis operasi pada seluruh array sekaligus tanpa for loop adalah ____", answer: ["vectorization", "vektorisasi"], explanation: "Vectorization." },
    { id: "np-intro-q5", type: "case", prompt: "Kamu punya 1 juta prediksi dan ingin menghitung selisih absolut dengan nilai asli. Cara paling tepat?", options: ["For loop pada list", "Operasi vectorized NumPy: np.abs(y - y_pred)", "Menghitung manual", "Mengubah ke string"], answer: 1, explanation: "Vectorized NumPy jauh lebih cepat dan ringkas." },
  ],
  challenge: {
    id: "np-intro-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Metrik regresi tanpa loop",
    prompt: [
      "Diberikan `y_true = np.array([200, 150, 300, 250])` (harga asli, juta) dan `y_pred = np.array([210, 140, 280, 260])`.",
      "Hitung **tanpa for loop**: `mae` (rata-rata |error|), `mse` (rata-rata error²), `rmse` (akar mse). Cetak `MAE=12.5 MSE=175.0 RMSE=13.23` (RMSE dibulatkan 2 desimal).",
    ],
    starter: `import numpy as np
y_true = np.array([200, 150, 300, 250])
y_pred = np.array([210, 140, 280, 260])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
y_true = np.array([200, 150, 300, 250])
y_pred = np.array([210, 140, 280, 260])
error = y_true - y_pred
mae = np.abs(error).mean()
mse = (error ** 2).mean()
rmse = mse ** 0.5
print(f"MAE={mae} MSE={mse} RMSE={round(rmse, 2)}")`,
    tests: [
      { desc: "mae = 12.5", expr: "mae == 12.5" },
      { desc: "mse = 175.0", expr: "mse == 175.0" },
      { desc: "rmse ≈ 13.23", expr: "abs(rmse - 175 ** 0.5) < 1e-9" },
      { desc: "Tanpa for loop", expr: "'for ' not in _code" },
      { desc: "Output sesuai", expr: "_lines == ['MAE=12.5 MSE=175.0 RMSE=13.23']" },
    ],
    hints: ["Konsep: operasi vectorized + method mean().", "`error = y_true - y_pred`, lalu `np.abs(error).mean()`.", "`mse = (error ** 2).mean()`; `rmse = mse ** 0.5`."],
    explanation: "Inilah cara scikit-learn menghitung MAE/MSE di balik layar — semuanya operasi array.",
  },
  summary: [
    "NumPy adalah fondasi komputasi numerik Python; objek utamanya `ndarray`.",
    "`import numpy as np` lalu `np.array(list)` untuk membuat array.",
    "Operasi pada array berlaku untuk setiap elemen (vectorization) — berbeda dari list.",
    "Array punya method statistik: `mean()`, `max()`, `argmax()`, dan atribut `size`.",
    "Pandas dan scikit-learn memakai NumPy array di dalamnya.",
  ],
  cheatsheet: [
    { syntax: "import numpy as np", desc: "Import NumPy" },
    { syntax: "np.array([1, 2, 3])", desc: "Buat array" },
    { syntax: "arr * 2, arr + arr", desc: "Operasi per elemen" },
    { syntax: "arr.mean(), arr.max()", desc: "Statistik" },
    { syntax: "arr.argmax()", desc: "Posisi nilai terbesar" },
  ],
  flashcards: [
    { q: "Import NumPy dengan alias standar", a: "import numpy as np" },
    { q: "Ubah list x menjadi NumPy array", a: "np.array(x)" },
    { q: "Posisi elemen terbesar pada array skor", a: "skor.argmax()" },
  ],
  references: [
    numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"),
    numpyDoc("What is NumPy?", "user/whatisnumpy.html"),
    numpyDoc("NumPy quickstart", "user/quickstart.html"),
    numpyDoc("numpy.array", "reference/generated/numpy.array.html"),
  ],
};
