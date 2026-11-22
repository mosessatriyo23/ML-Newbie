import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-tuple",
  title: "Tuple",
  minutes: 30,
  prerequisites: ["py-list"],
  objectives: [
    "Membuat tuple dan memahami sifatnya yang immutable (tidak bisa diubah).",
    "Mengakses elemen tuple dengan indexing dan slicing.",
    "Melakukan tuple packing dan unpacking.",
    "Membuat tuple satu elemen dengan benar: `(5,)`.",
    "Mengenali tuple di dunia Data Science, seperti `df.shape`.",
  ],
  definition: [
    "**Tuple** adalah koleksi berurutan seperti list, tetapi **immutable**: setelah dibuat, isinya tidak dapat diubah, ditambah, atau dihapus. Tuple ditulis dengan kurung biasa: `ukuran = (150, 5)`.",
    "Yang sebenarnya membuat tuple adalah **koma**, bukan kurung. `t = 1, 2` juga tuple. Karena itu tuple berisi satu elemen harus ditulis `(5,)` — tanpa koma, `(5)` hanyalah angka 5 di dalam kurung.",
    "**Packing** = memasukkan beberapa nilai ke satu tuple (`t = 1, 2, 3`). **Unpacking** = membongkar tuple ke beberapa variabel (`a, b, c = t`). Kamu sebenarnya sudah memakai unpacking di materi Variables: `a, b = b, a`.",
  ],
  why: [
    "Banyak hasil di Data Science berbentuk tuple: `df.shape` menghasilkan `(jumlah_baris, jumlah_kolom)`, dan fungsi yang mengembalikan beberapa nilai sebenarnya mengembalikan tuple.",
    "`X_train, X_test, y_train, y_test = train_test_split(X, y)` adalah unpacking — memahami tuple membuat sintaks ini tidak lagi terasa \"ajaib\".",
    "Immutable berarti aman: data yang seharusnya tetap (misalnya ukuran gambar `(224, 224)`) tidak tidak sengaja berubah.",
  ],
  when: [
    "- Menyimpan nilai yang tidak boleh berubah: koordinat, ukuran, konfigurasi.",
    "- Mengembalikan beberapa nilai dari satu fungsi.",
    "- Gunakan list jika isinya perlu ditambah/diubah.",
  ],
  analogy: "Tuple seperti **KTP**: berisi beberapa data (nama, tanggal lahir, alamat) dalam urutan tetap, dan tidak bisa kamu coret-coret sendiri. List seperti **catatan belanja** yang bisa ditambah dan dicoret kapan saja.",
  syntax: {
    code: `t = (a, b, c)
t = a, b, c          # packing (kurung opsional)
x, y, z = t          # unpacking
satu = (5,)          # tuple satu elemen`,
  },
  anatomy: [
    ["( , )", "Kurung dan koma membuat tuple. Komanya yang wajib."],
    ["t[0]", "Indexing sama seperti list."],
    ["x, y = t", "Unpacking: jumlah variabel harus sama dengan jumlah elemen."],
    ["(5,)", "Tuple satu elemen; koma wajib ada."],
    [".count(x) / .index(x)", "Dua method tuple (karena immutable, tidak ada append/remove)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat dan mengakses tuple",
      code: `shape = (150, 5)
print(shape)
print("Baris:", shape[0])
print("Kolom:", shape[1])
print(type(shape))`,
      output: "(150, 5)\nBaris: 150\nKolom: 5\n<class 'tuple'>",
      explain: [
        ["shape = (150, 5)", "Tuple berisi jumlah baris dan kolom — persis format `df.shape` di Pandas."],
        ["shape[0]", "Indexing sama seperti list."],
      ],
    },
    {
      title: "Contoh 2 — Tuple tidak bisa diubah",
      code: `ukuran_gambar = (224, 224)
ukuran_gambar[0] = 128`,
      expectError: "TypeError",
      explain: [
        ["ukuran_gambar[0] = 128", "Mengubah elemen tuple → `TypeError: 'tuple' object does not support item assignment`."],
      ],
      change: "Contoh ini sengaja error untuk memperlihatkan sifat immutable.",
    },
    {
      title: "Contoh 3 — Packing dan unpacking",
      code: `hasil = 0.92, 0.88, 0.90
print(hasil)

accuracy, precision, recall = hasil
print("Recall:", recall)

n_baris, n_kolom = (403, 10)
print(f"Dataset: {n_baris} baris, {n_kolom} kolom")`,
      output: "(0.92, 0.88, 0.9)\nRecall: 0.9\nDataset: 403 baris, 10 kolom",
      explain: [
        ["hasil = 0.92, 0.88, 0.90", "Packing: tiga nilai dikemas jadi satu tuple (kurung tidak wajib)."],
        ["accuracy, precision, recall = hasil", "Unpacking: setiap elemen masuk ke variabel sesuai urutan."],
        ["n_baris, n_kolom = (403, 10)", "Pola yang nanti kamu pakai: `n_baris, n_kolom = df.shape`."],
      ],
      change: "Kita tidak hanya membuat tuple, tetapi juga membongkarnya ke beberapa variabel.",
    },
    {
      title: "Contoh 4 — Tuple satu elemen dan konversi",
      code: `a = (5)
b = (5,)
print(type(a).__name__, type(b).__name__)

daftar = ["setosa", "versicolor"]
t = tuple(daftar)
print(t, len(t))
print(list(t))`,
      output: "int tuple\n('setosa', 'versicolor') 2\n['setosa', 'versicolor']",
      explain: [
        ["a = (5)", "Tanpa koma, ini hanya angka 5 dalam kurung → int."],
        ["b = (5,)", "Dengan koma → tuple."],
        ["t = tuple(daftar)", "Mengubah list menjadi tuple."],
        ["list(t)", "Kebalikannya: tuple menjadi list (jika perlu diubah)."],
      ],
      change: "Detail penting yang sering membingungkan: koma, bukan kurung, yang membuat tuple.",
    },
  ],
  io: { title: "Input → Output", input: `lebar, tinggi = (1920, 1080)\nprint(lebar * tinggi)`, output: "2073600" },
  tryIt: `# Hasil train_test_split nanti berbentuk banyak nilai yang di-unpack
ukuran = (403, 10)
n_baris, n_kolom = ukuran
print(f"{n_baris} baris dan {n_kolom} kolom")

titik = (3, 4)
x, y = titik
print("Jarak ke (0,0):", (x ** 2 + y ** 2) ** 0.5)`,
  mistakes: [
    {
      title: "Mengubah isi tuple",
      wrong: `t = (1, 2, 3)
t.append(4)`,
      error: "AttributeError",
      fix: `t = (1, 2, 3)
t = t + (4,)
print(t)`,
      explain: "Tuple tidak punya `append`. Buat tuple baru dengan menggabungkan `+`, atau gunakan list.",
    },
    {
      title: "Jumlah variabel unpacking tidak cocok",
      wrong: `a, b = (1, 2, 3)`,
      error: "ValueError",
      fix: `a, b, c = (1, 2, 3)
print(a, b, c)`,
      explain: "Jumlah variabel harus sama dengan jumlah elemen: *too many values to unpack*.",
    },
    {
      title: "Lupa koma pada tuple satu elemen",
      wrong: `kolom = ("age")
print(len(kolom))   # mengira 1, ternyata 3`,
      fix: `kolom = ("age",)
print(len(kolom))`,
      explain: "`(\"age\")` hanyalah string \"age\" (3 karakter). Tambahkan koma.",
    },
  ],
  bestPractices: [
    "Gunakan tuple untuk data yang tidak boleh berubah, list untuk data yang akan dimodifikasi.",
    "Gunakan unpacking dengan nama variabel yang jelas: `n_rows, n_cols = df.shape`.",
    "Gunakan `_` untuk nilai yang tidak dipakai: `n_rows, _ = df.shape`.",
  ],
  exercises: [
    {
      id: "py-tuple-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Unpacking shape",
      prompt: "Lengkapi agar `n_baris` berisi 569 dan `n_kolom` berisi 32 dari tuple `shape`.",
      starter: `shape = (569, 32)
____, ____ = shape
print(n_baris, n_kolom)`,
      solution: `shape = (569, 32)
n_baris, n_kolom = shape
print(n_baris, n_kolom)`,
      tests: [
        { desc: "n_baris = 569", expr: "n_baris == 569" },
        { desc: "n_kolom = 32", expr: "n_kolom == 32" },
      ],
      hints: ["Konsep: unpacking.", "Tulis dua nama variabel dipisah koma di kiri `=`.", "`n_baris, n_kolom = shape`"],
      explanation: "Unpacking membagikan elemen tuple ke variabel sesuai urutan.",
    },
    {
      id: "py-tuple-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `t = (10, 20, 30, 20)
print(t[1:3])
print(t.count(20), t.index(30))
a = (7)
b = (7,)
print(a * 2, b * 2)`,
      answer: "(20, 30)\n2 2\n14 (7, 7)",
      hints: ["Konsep: slicing tuple, count/index, dan (7) vs (7,).", "Slicing tuple menghasilkan tuple.", "`(7,) * 2` mengulang tuple."],
      explanation: "t[1:3] = (20, 30). 20 muncul 2×, 30 di index 2. (7) adalah int → 14. (7,) * 2 = (7, 7).",
    },
    {
      id: "py-tuple-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Ubah konfigurasi",
      prompt: "Konfigurasi gambar disimpan sebagai tuple, tetapi kita perlu mengganti lebarnya menjadi 128. Perbaiki **tanpa mengubah baris pertama**: ubah ke list, ganti elemen, lalu kembalikan ke tuple. Output: `(128, 224)`",
      starter: `ukuran = (224, 224)
ukuran[0] = 128
print(ukuran)`,
      solution: `ukuran = (224, 224)
sementara = list(ukuran)
sementara[0] = 128
ukuran = tuple(sementara)
print(ukuran)`,
      alternatives: [`ukuran = (224, 224)
ukuran = (128,) + ukuran[1:]
print(ukuran)`],
      tests: [
        { desc: "ukuran = (128, 224) bertipe tuple", expr: "ukuran == (128, 224) and type(ukuran) is tuple" },
        { desc: "Baris pertama tidak diubah", expr: "_code.strip().splitlines()[0] == 'ukuran = (224, 224)'" },
      ],
      hints: ["Konsep: tuple immutable, list mutable.", "`list(ukuran)` lalu `tuple(...)`.", "Ubah elemen pada list sementara, lalu konversi balik."],
      explanation: "Karena tuple tidak bisa diubah, kita membuat tuple **baru**. Menggabungkan `(128,) + ukuran[1:]` juga benar.",
    },
    {
      id: "py-tuple-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Metrik dalam tuple",
      prompt: "Buat tuple `metrik` berisi tiga nilai: 0.91, 0.84, 0.87 (accuracy, precision, recall). Lalu unpack ke `acc`, `prec`, `rec` dan cetak `Precision: 0.84`.",
      starter: `# Tulis kodemu di sini
`,
      solution: `metrik = (0.91, 0.84, 0.87)
acc, prec, rec = metrik
print("Precision:", prec)`,
      tests: [
        { desc: "metrik adalah tuple (0.91, 0.84, 0.87)", expr: "metrik == (0.91, 0.84, 0.87) and type(metrik) is tuple" },
        { desc: "acc, prec, rec benar", expr: "(acc, prec, rec) == (0.91, 0.84, 0.87)" },
        { desc: "Output 'Precision: 0.84'", expr: "_lines == ['Precision: 0.84']" },
      ],
      hints: ["Konsep: packing lalu unpacking.", "Buat tuple dengan kurung dan koma.", "`acc, prec, rec = metrik`"],
      explanation: "Banyak fungsi evaluasi mengembalikan beberapa nilai sekaligus dalam bentuk tuple.",
    },
    {
      id: "py-tuple-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Jarak dua titik",
      prompt: [
        "Dua pelanggan direpresentasikan sebagai titik `(umur, pendapatan)`: `p1 = (25, 40)` dan `p2 = (28, 44)`.",
        "Unpack masing-masing ke `x1, y1` dan `x2, y2`, lalu hitung `jarak` Euclidean = akar((x2−x1)² + (y2−y1)²). Cetak `Jarak: 5.0`.",
      ],
      starter: `p1 = (25, 40)
p2 = (28, 44)
# Tulis kodemu di sini
`,
      solution: `p1 = (25, 40)
p2 = (28, 44)
x1, y1 = p1
x2, y2 = p2
jarak = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5
print("Jarak:", jarak)`,
      tests: [
        { desc: "jarak = 5.0", expr: "jarak == 5.0" },
        { desc: "Memakai unpacking", expr: "'= p1' in _code and '= p2' in _code" },
        { desc: "Output 'Jarak: 5.0'", expr: "_lines == ['Jarak: 5.0']" },
      ],
      hints: ["Konsep: unpacking + rumus jarak Euclidean.", "`x1, y1 = p1`", "`((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5`"],
      explanation: "Euclidean distance adalah dasar algoritma KNN dan K-Means yang akan kamu pelajari nanti.",
    },
  ],
  quiz: [
    { id: "py-tuple-q1", type: "mcq", prompt: "Mana yang merupakan tuple berisi satu elemen?", options: ["(5)", "[5]", "(5,)", "{5}"], answer: 2, explanation: "Koma membuat tuple." },
    { id: "py-tuple-q2", type: "tf", prompt: "Tuple dapat diubah dengan method `append()`.", answer: false, explanation: "Tuple immutable dan tidak punya append." },
    { id: "py-tuple-q3", type: "predict", prompt: "Apa outputnya?", code: `a, b, c = (1, 2, 3)\nprint(b * c)`, options: ["2", "6", "3", "(2, 3)"], answer: 1, explanation: "b = 2, c = 3 → 6." },
    { id: "py-tuple-q4", type: "fill", prompt: "Atribut DataFrame Pandas yang mengembalikan tuple (baris, kolom) adalah `df.____`", answer: ["shape"], explanation: "`df.shape`, misalnya `(150, 5)`." },
    { id: "py-tuple-q5", type: "case", prompt: "Kamu ingin menyimpan ukuran input model (224, 224, 3) yang tidak boleh berubah selama program berjalan. Tipe data yang paling tepat?", options: ["list", "tuple", "str", "dict"], answer: 1, explanation: "Tuple immutable sehingga aman dari perubahan tak sengaja." },
  ],
  challenge: {
    id: "py-tuple-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Ringkasan pembagian data",
    prompt: [
      "Diberikan `shape = (403, 10)` dan `test_ratio = 0.2`.",
      "Unpack shape ke `n_rows` dan `n_cols` (`n_cols` tidak dipakai — boleh pakai nama `_`). Hitung `n_test = round(n_rows * test_ratio)` dan `n_train = n_rows - n_test`.",
      "Simpan hasil ke tuple `split_sizes = (n_train, n_test)` dan cetak: `Split (train, test): (322, 81)`",
    ],
    starter: `shape = (403, 10)
test_ratio = 0.2
# Tulis kodemu di sini
`,
    solution: `shape = (403, 10)
test_ratio = 0.2
n_rows, _ = shape
n_test = round(n_rows * test_ratio)
n_train = n_rows - n_test
split_sizes = (n_train, n_test)
print("Split (train, test):", split_sizes)`,
    tests: [
      { desc: "n_rows = 403", expr: "n_rows == 403" },
      { desc: "split_sizes = (322, 81) bertipe tuple", expr: "split_sizes == (322, 81) and type(split_sizes) is tuple" },
      { desc: "Output sesuai", expr: "_lines == ['Split (train, test): (322, 81)']" },
    ],
    hints: ["Konsep: unpacking dengan `_` dan packing hasil.", "`n_rows, _ = shape`", "`split_sizes = (n_train, n_test)`"],
    explanation: "round(80.6) = 81. `_` adalah konvensi untuk variabel yang sengaja tidak dipakai.",
  },
  summary: [
    "Tuple: koleksi berurutan yang immutable, ditulis `(a, b)`; koma yang membuatnya tuple.",
    "Tuple satu elemen: `(x,)`.",
    "Packing `t = a, b` dan unpacking `a, b = t`; jumlah variabel harus cocok.",
    "Konversi: `tuple(list)` dan `list(tuple)`.",
    "Contoh nyata: `df.shape`, hasil `train_test_split`, fungsi yang mengembalikan banyak nilai.",
  ],
  cheatsheet: [
    { syntax: "t = (1, 2)", desc: "Buat tuple" },
    { syntax: "t = (5,)", desc: "Tuple satu elemen" },
    { syntax: "a, b = t", desc: "Unpacking" },
    { syntax: "n_rows, _ = df.shape", desc: "Abaikan nilai dengan _" },
    { syntax: "tuple(x), list(t)", desc: "Konversi" },
  ],
  flashcards: [
    { q: "Buat tuple satu elemen berisi 5", a: "(5,)" },
    { q: "Unpack shape (150, 5) ke n_rows dan n_cols", a: "n_rows, n_cols = shape" },
    { q: "Apa beda utama list dan tuple?", a: "list mutable (bisa diubah), tuple immutable" },
  ],
  references: [
    pyDoc("The Python Tutorial — 5.3 Tuples and Sequences", "tutorial/datastructures.html#tuples-and-sequences"),
    pyDoc("Built-in Types — Tuples", "library/stdtypes.html#tuples"),
    pyDoc("Built-in Types — Common Sequence Operations", "library/stdtypes.html#typesseq-common"),
  ],
};
