import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-data-types",
  title: "Data Types",
  minutes: 40,
  prerequisites: ["py-variables"],
  objectives: [
    "Mengenal tipe data dasar Python: `int`, `float`, `str`, `bool`, dan `NoneType`.",
    "Memeriksa tipe data dengan `type()` dan `isinstance()`.",
    "Mengubah tipe data (type conversion/casting) dengan `int()`, `float()`, `str()`, dan `bool()`.",
    "Mengenali tipe koleksi (`list`, `tuple`, `set`, `dict`) yang akan dipelajari berikutnya.",
    "Menghubungkan tipe data Python dengan data numerik dan kategorikal di Machine Learning.",
  ],
  definition: [
    "**Data type** (tipe data) menentukan **jenis nilai** dan **operasi apa yang bisa dilakukan** padanya. Angka bisa dijumlahkan dan dibagi; teks bisa diubah menjadi huruf besar; nilai benar/salah bisa dipakai untuk mengambil keputusan.",
    "Tipe dasar yang paling sering dipakai:\n- `int` — bilangan bulat: `150`, `-3`, `0`\n- `float` — bilangan desimal: `0.95`, `3.14`, `1e-3`\n- `str` — teks (string): `\"setosa\"`, `'Jakarta'`\n- `bool` — nilai logika: `True` atau `False`\n- `NoneType` — hanya punya satu nilai: `None`, artinya \"tidak ada nilai\"",
    "Fungsi bawaan `type(nilai)` memberi tahu tipe sebuah nilai. Fungsi `isinstance(nilai, tipe)` menjawab pertanyaan ya/tidak: \"apakah nilai ini bertipe tersebut?\"",
    "Mengubah tipe disebut **type conversion** atau **casting**: `int(\"25\")` mengubah teks `\"25\"` menjadi angka 25. Konversi hanya berhasil jika isinya masuk akal — `int(\"dua puluh\")` akan gagal dengan `ValueError`.",
  ],
  why: [
    "Dataset nyata sering \"salah tipe\": kolom umur terbaca sebagai teks `\"25\"`, harga ditulis `\"Rp 20.000\"`. Model Machine Learning hanya bisa belajar dari angka, jadi kamu harus memeriksa dan mengubah tipe data.",
    "Konsep ini berlanjut di Pandas: `df.dtypes` menampilkan tipe setiap kolom (`int64`, `float64`, `str`/`object`, `bool`). Fitur **numerical** biasanya `int`/`float`, fitur **categorical** biasanya `str`.",
  ],
  when: [
    "- Saat hasil perhitungan terasa aneh — periksa tipenya dengan `type()`.",
    "- Saat menggabungkan teks dengan angka (perlu `str()`) atau menghitung dari teks berisi angka (perlu `int()`/`float()`).",
    "- Saat memeriksa apakah sebuah nilai kosong (`None`).",
  ],
  analogy: "Tipe data seperti **jenis wadah** di dapur: botol untuk cairan, toples untuk tepung, rak telur untuk telur. Kamu tidak bisa \"menuang\" telur dari rak telur seperti menuang air. Setiap wadah punya cara pakai sendiri — begitu juga setiap tipe data punya operasi yang cocok.",
  syntax: {
    code: `type(nilai)              # cek tipe
isinstance(nilai, int)   # True/False
int("25")                # str  -> int
float("3.5")             # str  -> float
str(100)                 # int  -> str`,
  },
  anatomy: [
    ["type(x)", "Mengembalikan tipe dari x, misalnya `<class 'int'>`."],
    ["isinstance(x, float)", "Mengembalikan `True` jika x bertipe float."],
    ["int(x)", "Mengubah x menjadi bilangan bulat. Dari float, bagian desimal **dipotong** (bukan dibulatkan)."],
    ["float(x)", "Mengubah x menjadi bilangan desimal."],
    ["str(x)", "Mengubah x menjadi teks."],
    ["None", "Nilai khusus yang berarti \"tidak ada\". Tipenya `NoneType`."],
  ],
  examples: [
    {
      title: "Contoh 1 — Lima tipe data dasar",
      code: `jumlah = 150
akurasi = 0.95
spesies = "setosa"
lulus = True
catatan = None

print(type(jumlah))
print(type(akurasi))
print(type(spesies))
print(type(lulus))
print(type(catatan))`,
      output: "<class 'int'>\n<class 'float'>\n<class 'str'>\n<class 'bool'>\n<class 'NoneType'>",
      explain: [
        ["jumlah = 150", "Bilangan bulat → `int`."],
        ["akurasi = 0.95", "Ada titik desimal → `float`. Python memakai **titik**, bukan koma."],
        ["spesies = \"setosa\"", "Diapit tanda kutip → `str`."],
        ["lulus = True", "`True` (huruf T besar) → `bool`."],
        ["catatan = None", "`None` berarti belum/tidak ada nilai."],
        ["print(type(jumlah))", "`type()` dipanggil dulu, hasilnya diberikan ke `print()`. Fungsi di dalam fungsi dijalankan dari dalam ke luar."],
      ],
    },
    {
      title: "Contoh 2 — Angka dalam tanda kutip adalah teks",
      code: `a = 25
b = "25"
print(type(a), type(b))
print(a + a)
print(b + b)`,
      output: "<class 'int'> <class 'str'>\n50\n2525",
      explain: [
        ["b = \"25\"", "Karena ada tanda kutip, `b` adalah **teks** yang kebetulan berisi karakter 2 dan 5."],
        ["print(a + a)", "Untuk int, `+` berarti penjumlahan: 50."],
        ["print(b + b)", "Untuk str, `+` berarti **menyambung teks**: `\"25\" + \"25\"` = `\"2525\"`."],
      ],
      change: "Kita melihat bahwa operator yang sama (`+`) berperilaku berbeda tergantung tipe data.",
    },
    {
      title: "Contoh 3 — Type conversion",
      code: `umur_teks = "21"
umur = int(umur_teks)
print(umur + 1)

harga = float("12500.5")
print(harga)

print(int(9.99))
print(str(2026) + " tahun")`,
      output: "22\n12500.5\n9\n2026 tahun",
      explain: [
        ["umur = int(umur_teks)", "Teks `\"21\"` diubah menjadi angka 21, sehingga bisa dijumlahkan."],
        ["harga = float(\"12500.5\")", "Teks berisi desimal diubah menjadi float."],
        ["print(int(9.99))", "`int()` **memotong** desimal → 9, bukan 10. Untuk pembulatan gunakan `round()` (materi Numbers)."],
        ["print(str(2026) + \" tahun\")", "Angka diubah ke teks agar bisa disambung dengan teks lain."],
      ],
      change: "Sekarang kita mengubah tipe secara sengaja dengan `int()`, `float()`, dan `str()`.",
    },
    {
      title: "Contoh 4 — isinstance() dan bool()",
      code: `nilai = 3.0
print(isinstance(nilai, float))
print(isinstance(nilai, int))

print(bool(0), bool(5))
print(bool(""), bool("teks"))`,
      output: "True\nFalse\nFalse True\nFalse True",
      explain: [
        ["isinstance(nilai, float)", "3.0 adalah float → `True`."],
        ["isinstance(nilai, int)", "Meskipun nilainya \"bulat\", tipenya tetap float → `False`."],
        ["bool(0), bool(5)", "Angka 0 dianggap `False`, angka lain `True`."],
        ["bool(\"\"), bool(\"teks\")", "String kosong `False`, string berisi `True`. (Dibahas lagi di materi Boolean.)"],
      ],
      change: "Kita menambahkan cara memeriksa tipe yang menghasilkan True/False, berguna untuk validasi data.",
    },
    {
      title: "Contoh 5 — Sekilas tipe koleksi",
      intro: "Selain tipe tunggal, Python punya tipe untuk menyimpan **banyak nilai**. Masing-masing dibahas di subbab tersendiri.",
      code: `nilai_ujian = [80, 90, 75]           # list
ukuran = (150, 5)                    # tuple
kota_unik = {"Jakarta", "Bandung"}   # set
siswa = {"nama": "Andi", "umur": 21} # dict

print(type(nilai_ujian).__name__)
print(type(ukuran).__name__)
print(type(kota_unik).__name__)
print(type(siswa).__name__)`,
      output: "list\ntuple\nset\ndict",
      explain: [
        ["nilai_ujian = [80, 90, 75]", "List memakai kurung siku `[ ]`."],
        ["ukuran = (150, 5)", "Tuple memakai kurung biasa `( )`. Contoh nyata: `df.shape` menghasilkan tuple."],
        ["kota_unik = {\"Jakarta\", \"Bandung\"}", "Set memakai kurung kurawal berisi nilai saja."],
        ["siswa = {\"nama\": \"Andi\", \"umur\": 21}", "Dict memakai kurung kurawal berisi pasangan `key: value`."],
        ["type(nilai_ujian).__name__", "`.__name__` mengambil nama tipenya saja sebagai teks."],
      ],
      change: "Contoh ini hanya pengenalan bentuk; detail setiap koleksi ada di subbab List, Tuple, Set, dan Dictionary.",
    },
  ],
  params: [
    {
      title: "Fungsi konversi & pemeriksaan tipe",
      items: [
        { name: "type(object)", type: "fungsi", desc: "Mengembalikan tipe object." },
        { name: "isinstance(object, classinfo)", type: "fungsi", desc: "`True` bila object bertipe classinfo. classinfo boleh tuple tipe, misalnya `(int, float)`." },
        { name: "int(x)", type: "fungsi", desc: "Ke bilangan bulat. Teks harus berisi angka bulat (`\"21\"`), float dipotong ke arah nol." },
        { name: "float(x)", type: "fungsi", desc: "Ke bilangan desimal. Menerima teks seperti `\"3.5\"` atau `\"1e-3\"`." },
        { name: "str(x)", type: "fungsi", desc: "Ke teks." },
        { name: "bool(x)", type: "fungsi", desc: "Ke True/False. 0, 0.0, \"\", None, dan koleksi kosong → False." },
      ],
    },
  ],
  io: {
    title: "Input → Output",
    input: `print(type(10 / 2))
print(int("7") * 2)`,
    output: "<class 'float'>\n14",
    note: "Pembagian `/` selalu menghasilkan float meskipun hasilnya bulat.",
  },
  tryIt: `# Ganti nilai x lalu lihat tipenya
x = "3.14"
print(type(x))

x_float = float(x)
print(x_float * 2, type(x_float))`,
  mistakes: [
    {
      title: "Menjumlahkan teks dengan angka",
      wrong: `umur = "21"
print(umur + 1)`,
      error: "TypeError",
      fix: `umur = "21"
print(int(umur) + 1)`,
      explain: "Python tidak otomatis mengubah teks menjadi angka. Ubah dulu dengan `int()`.",
    },
    {
      title: "Mengonversi teks yang bukan angka",
      wrong: `harga = int("Rp 20000")`,
      error: "ValueError",
      fix: `harga = int("20000")`,
      explain: "`int()` hanya menerima teks yang berisi angka. Bersihkan dulu karakter lain (dibahas di materi Strings & Data Cleaning).",
    },
    {
      title: "Desimal dengan koma",
      wrong: `nilai = float("3,5")`,
      error: "ValueError",
      fix: `nilai = float("3.5")`,
      explain: "Python memakai titik sebagai pemisah desimal. Dataset Indonesia/Eropa kadang memakai koma — perlu dibersihkan saat loading data.",
    },
    {
      title: "Menulis true/false dengan huruf kecil",
      wrong: `aktif = true`,
      error: "NameError",
      fix: `aktif = True`,
      explain: "Boolean di Python adalah `True` dan `False` dengan huruf kapital di awal.",
    },
  ],
  bestPractices: [
    "Selalu periksa tipe data setelah memuat dataset (nanti dengan `df.dtypes` / `df.info()`).",
    "Gunakan `isinstance()` untuk validasi, bukan membandingkan `type(x) == int`, karena isinstance juga mengenali turunan tipe.",
    "Gunakan `None` untuk menandai nilai yang belum ada, bukan string kosong atau angka 0 yang bisa disalahartikan.",
    "Ingat: `int()` memotong desimal. Gunakan `round()` bila maksudnya membulatkan.",
  ],
  exercises: [
    {
      id: "py-types-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Konversi teks ke angka",
      prompt: "Variabel `jumlah_teks` berisi teks. Lengkapi kode agar `jumlah` bertipe `int` dan output-nya `jumlah + 10 = 160`.",
      starter: `jumlah_teks = "150"
jumlah = ____(jumlah_teks)
print("jumlah + 10 =", jumlah + 10)`,
      solution: `jumlah_teks = "150"
jumlah = int(jumlah_teks)
print("jumlah + 10 =", jumlah + 10)`,
      tests: [
        { desc: "jumlah bertipe int", expr: "isinstance(jumlah, int)" },
        { desc: "Output benar", expr: "_lines == ['jumlah + 10 = 160']" },
      ],
      hints: ["Konsep: type conversion.", "Fungsinya bernama sama dengan tipe bilangan bulat.", "`jumlah = int(jumlah_teks)`"],
      explanation: "`int(\"150\")` menghasilkan angka 150 sehingga bisa dijumlahkan.",
    },
    {
      id: "py-types-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `print(type(7 / 7).__name__)
print(int(3.9))
print("3" + "4")
print(float(2))`,
      answer: "float\n3\n34\n2.0",
      hints: ["Konsep: `/` selalu float; int() memotong; + pada str menyambung.", "Baris 2 bukan pembulatan.", "float(2) menambahkan .0"],
      explanation: "7/7 = 1.0 (float). int(3.9) = 3 (dipotong). \"3\" + \"4\" = \"34\". float(2) = 2.0.",
    },
    {
      id: "py-types-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Gabungkan teks dan angka",
      prompt: "Kode ini error. Perbaiki baris kedua agar output-nya `Jumlah kelas: 3` dengan **menyambung string memakai +**.",
      starter: `n_kelas = 3
print("Jumlah kelas: " + n_kelas)`,
      solution: `n_kelas = 3
print("Jumlah kelas: " + str(n_kelas))`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output 'Jumlah kelas: 3'", expr: "_lines == ['Jumlah kelas: 3']" },
        { desc: "Tetap memakai operator + untuk menyambung", expr: "'+' in _code" },
      ],
      hints: ["Konsep: str + int tidak bisa langsung.", "Ubah angka menjadi teks terlebih dahulu.", "`str(n_kelas)`"],
      explanation: "Operator `+` antar-string menyambung teks; angka harus diubah dengan `str()` terlebih dahulu.",
    },
    {
      id: "py-types-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Bersihkan satu baris data",
      prompt: [
        "Satu baris data dari file CSV terbaca sebagai teks semua: `umur_raw = \"23\"`, `ipk_raw = \"3.45\"`, `aktif_raw = \"1\"`.",
        "Buat variabel `umur` (int), `ipk` (float), dan `aktif` (bool, dari angka 1). Lalu cetak ketiganya dalam satu `print`.",
        "Output yang diharapkan: `23 3.45 True`",
      ],
      starter: `umur_raw = "23"
ipk_raw = "3.45"
aktif_raw = "1"
# Tulis kodemu di sini
`,
      solution: `umur_raw = "23"
ipk_raw = "3.45"
aktif_raw = "1"
umur = int(umur_raw)
ipk = float(ipk_raw)
aktif = bool(int(aktif_raw))
print(umur, ipk, aktif)`,
      tests: [
        { desc: "umur bertipe int bernilai 23", expr: "type(umur) is int and umur == 23" },
        { desc: "ipk bertipe float bernilai 3.45", expr: "type(ipk) is float and ipk == 3.45" },
        { desc: "aktif bertipe bool bernilai True", expr: "aktif is True" },
        { desc: "Output '23 3.45 True'", expr: "_lines == ['23 3.45 True']" },
      ],
      hints: ["Konsep: konversi tipe per kolom.", "Untuk aktif: ubah dulu ke int, lalu ke bool.", "`aktif = bool(int(aktif_raw))`"],
      explanation: "Hati-hati: `bool(\"0\")` bernilai True karena string tidak kosong! Karena itu kita ubah ke int dulu sebelum ke bool.",
    },
    {
      id: "py-types-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Tentukan jenis fitur",
      prompt: [
        "Untuk dataset rumah, kamu punya nilai contoh `luas = 120`, `harga = 850.5`, `kota = \"Bandung\"`.",
        "Buat variabel `luas_numerik`, `harga_numerik`, `kota_numerik` yang berisi `True`/`False` dengan `isinstance(..., (int, float))` — apakah nilai tersebut numerik?",
        "Cetak ketiganya dalam satu baris: `True True False`",
      ],
      starter: `luas = 120
harga = 850.5
kota = "Bandung"
# Tulis kodemu di sini
`,
      solution: `luas = 120
harga = 850.5
kota = "Bandung"
luas_numerik = isinstance(luas, (int, float))
harga_numerik = isinstance(harga, (int, float))
kota_numerik = isinstance(kota, (int, float))
print(luas_numerik, harga_numerik, kota_numerik)`,
      tests: [
        { desc: "luas_numerik True", expr: "luas_numerik is True" },
        { desc: "harga_numerik True", expr: "harga_numerik is True" },
        { desc: "kota_numerik False", expr: "kota_numerik is False" },
        { desc: "Memakai isinstance", expr: "'isinstance' in _code" },
        { desc: "Output 'True True False'", expr: "_lines == ['True True False']" },
      ],
      hints: ["Konsep: isinstance dengan tuple tipe.", "`isinstance(x, (int, float))` memeriksa dua tipe sekaligus.", "`luas_numerik = isinstance(luas, (int, float))`"],
      explanation: "Ini cikal bakal memisahkan fitur numerical dan categorical sebelum preprocessing.",
    },
  ],
  quiz: [
    { id: "py-types-q1", type: "mcq", prompt: "Tipe data dari `\"0.75\"` adalah…", options: ["float", "str", "int", "bool"], answer: 1, explanation: "Ada tanda kutip, jadi string meskipun isinya angka." },
    { id: "py-types-q2", type: "predict", prompt: "Apa output kode berikut?", code: `print(int(7.8) + int("2"))`, options: ["9.8", "10", "9", "Error"], answer: 2, explanation: "int(7.8) = 7 (dipotong), int(\"2\") = 2. Jumlahnya 9." },
    { id: "py-types-q3", type: "tf", prompt: "`bool(\"False\")` bernilai False.", answer: false, explanation: "String tidak kosong selalu True — isinya tidak dibaca. `bool(\"False\")` adalah True." },
    { id: "py-types-q4", type: "fill", prompt: "Nilai khusus Python yang berarti \"tidak ada nilai\" adalah ____.", answer: ["None"], explanation: "`None` bertipe `NoneType`." },
    { id: "py-types-q5", type: "case", prompt: "Kolom `umur` di dataset terbaca sebagai teks (`\"25\"`, `\"31\"`). Apa yang harus dilakukan sebelum menghitung rata-rata umur?", options: ["Tidak perlu apa-apa", "Mengubah tipe menjadi angka (int/float)", "Mengubah menjadi bool", "Menghapus kolom umur"], answer: 1, explanation: "Perhitungan numerik membutuhkan tipe numerik. Di Pandas nanti memakai `astype()` atau `pd.to_numeric()`." },
  ],
  challenge: {
    id: "py-types-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Laporan tipe data",
    prompt: [
      "Diberikan satu baris data mentah:",
      "```\nnama = \"Citra\"\nnilai_raw = \"88.5\"\nhadir_raw = \"14\"\n```",
      "Ubah `nilai_raw` menjadi float bernama `nilai` dan `hadir_raw` menjadi int bernama `hadir`. Lalu buat variabel `bonus` = `nilai` + `hadir` × 0.5.",
      "Cetak persis:\n```\nCitra: nilai 88.5 (float), hadir 14 (int)\nBonus: 95.5\n```",
      "Petunjuk: nama tipe bisa diperoleh dengan `type(x).__name__`.",
    ],
    starter: `nama = "Citra"
nilai_raw = "88.5"
hadir_raw = "14"
# Tulis kodemu di sini
`,
    solution: `nama = "Citra"
nilai_raw = "88.5"
hadir_raw = "14"
nilai = float(nilai_raw)
hadir = int(hadir_raw)
bonus = nilai + hadir * 0.5
print(nama + ": nilai", nilai, "(" + type(nilai).__name__ + "), hadir", hadir, "(" + type(hadir).__name__ + ")")
print("Bonus:", bonus)`,
    tests: [
      { desc: "nilai float 88.5", expr: "type(nilai) is float and nilai == 88.5" },
      { desc: "hadir int 14", expr: "type(hadir) is int and hadir == 14" },
      { desc: "bonus = 95.5", expr: "bonus == 95.5" },
      { desc: "Baris 1 sesuai", expr: "len(_lines) == 2 and _lines[0] == 'Citra: nilai 88.5 (float), hadir 14 (int)'" },
      { desc: "Baris 2 sesuai", expr: "len(_lines) == 2 and _lines[1] == 'Bonus: 95.5'" },
    ],
    hints: ["Konsep: float(), int(), dan type().__name__.", "Susun string dengan `+` dan beberapa argument `print`.", "`\"(\" + type(nilai).__name__ + \")\"` menghasilkan `(float)`."],
    explanation: "Ada banyak cara menyusun output; penilaian hanya memeriksa nilai variabel dan teks akhirnya. Cara yang lebih rapi dengan f-string dipelajari di materi Strings.",
  },
  summary: [
    "Tipe dasar: `int`, `float`, `str`, `bool`, `NoneType`.",
    "`type()` menampilkan tipe; `isinstance()` memeriksa tipe dan menghasilkan True/False.",
    "Konversi: `int()`, `float()`, `str()`, `bool()`. `int()` memotong desimal.",
    "Angka di dalam tanda kutip adalah teks; operator `+` pada teks berarti menyambung.",
    "Di ML: fitur numerik = int/float; fitur kategorikal biasanya str.",
  ],
  cheatsheet: [
    { syntax: "type(x)", desc: "Cek tipe" },
    { syntax: "isinstance(x, (int, float))", desc: "Apakah x numerik?" },
    { syntax: 'int("25")', desc: "Teks → int" },
    { syntax: 'float("3.5")', desc: "Teks → float" },
    { syntax: "str(100)", desc: "Angka → teks" },
    { syntax: "x is None", desc: "Cek nilai kosong" },
  ],
  flashcards: [
    { q: "Cek tipe data variabel x", a: "type(x)" },
    { q: "Ubah teks \"42\" menjadi bilangan bulat", a: 'int("42")' },
    { q: "Cek apakah x adalah int ATAU float", a: "isinstance(x, (int, float))" },
    { q: "Hasil int(9.99)?", a: "9  (int() memotong, tidak membulatkan)" },
  ],
  references: [
    pyDoc("Built-in Types — Numeric Types (int, float, complex)", "library/stdtypes.html#numeric-types-int-float-complex"),
    pyDoc("Built-in Types — Text Sequence Type (str)", "library/stdtypes.html#text-sequence-type-str"),
    pyDoc("Built-in Functions — type()", "library/functions.html#type"),
    pyDoc("Built-in Functions — isinstance()", "library/functions.html#isinstance"),
    pyDoc("Built-in Functions — int()", "library/functions.html#int"),
    kagglePy("Hello, Python — numbers and types", "hello-python"),
  ],
};
