import type { Lesson } from "../../../types.ts";
import { KAGGLE_PYTHON_COURSE, kagglePy, pep8, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-python-syntax",
  title: "Python Syntax",
  minutes: 35,
  objectives: [
    "Memahami apa itu sintaks (syntax) dan mengapa Python membaca kode baris demi baris dari atas ke bawah.",
    "Menggunakan fungsi `print()` untuk menampilkan teks dan angka.",
    "Memahami tanda kurung `()`, tanda kutip `\"...\"`, dan tanda koma `,` di dalam `print()`.",
    "Memahami indentation (indentasi) sebagai penanda blok kode di Python.",
    "Membaca pesan error sederhana seperti `NameError` dan `SyntaxError`.",
  ],
  definition: [
    "**Syntax** (sintaks) adalah *aturan penulisan* kode. Sama seperti bahasa Indonesia memiliki aturan tata bahasa, Python juga punya aturan: kata apa yang boleh dipakai, di mana tanda kurung diletakkan, dan bagaimana baris kode disusun.",
    "Program Python adalah kumpulan **statement** (perintah). Setiap baris biasanya berisi satu statement. Python menjalankan statement **dari atas ke bawah**, satu per satu.",
    "Perintah pertama yang hampir selalu dipelajari adalah `print()`. `print` adalah **function** (fungsi) bawaan Python yang tugasnya *menampilkan* sesuatu ke layar (disebut **output**). Sesuatu yang ingin ditampilkan ditulis di dalam tanda kurung `()`.",
    "Teks di Python ditulis di dalam tanda kutip, misalnya `\"Halo\"` atau `'Halo'`. Teks seperti ini disebut **string**. Angka ditulis tanpa tanda kutip, misalnya `150`.",
    "Python juga memakai **indentation** (spasi di awal baris) untuk menandai *blok kode* — sekelompok baris yang menjadi satu kesatuan. Bahasa lain memakai kurung kurawal `{ }`, sedangkan Python memakai indentasi. Karena itu spasi di awal baris **bukan hiasan**: salah indentasi = error.",
  ],
  why: [
    "Semua materi berikutnya — NumPy, Pandas, hingga melatih model Machine Learning — ditulis dengan sintaks Python. Jika aturan dasarnya belum dipahami, error kecil seperti lupa tanda kutip akan terasa membingungkan.",
    "Di Machine Learning, `print()` adalah alat utama untuk *memeriksa* data: jumlah baris dataset, nilai akurasi model, atau isi sebuah variabel. Data scientist yang baik selalu mencetak hasil antara untuk memastikan kodenya benar.",
  ],
  when: [
    "- Setiap kali menulis kode Python apa pun.",
    "- Ketika ingin melihat hasil perhitungan atau isi data (`print()`).",
    "- Ketika membaca pesan error: memahami sintaks membantu menemukan baris yang salah.",
  ],
  analogy: [
    "Bayangkan kamu memberi instruksi kepada asisten yang **sangat teliti tetapi sangat harfiah**. Ia mengerjakan instruksi satu per satu dari atas ke bawah, dan menolak bekerja jika ada ejaan yang salah. Kalau kamu menulis \"Prnt\" alih-alih \"print\", ia tidak menebak maksudmu — ia berhenti dan memberi tahu ada yang salah. Itulah Python.",
    "Indentasi seperti **sub-poin pada daftar belanja**: barang yang ditulis menjorok di bawah \"Buah:\" berarti termasuk kelompok buah.",
  ],
  syntax: {
    code: `print(nilai)
print(nilai1, nilai2, sep=" ", end="\\n")`,
    note: "Bagian `sep` dan `end` boleh tidak ditulis. Jika tidak ditulis, Python memakai nilai default-nya.",
  },
  anatomy: [
    ["print", "Nama fungsi bawaan Python untuk menampilkan output."],
    ["( )", "Tanda kurung: tempat memberikan nilai (argument) kepada fungsi. Wajib ditulis, walaupun kosong: `print()`."],
    ["\"Halo\"", "String (teks). Harus diapit tanda kutip ganda \" \" atau tunggal ' ' yang sama di awal dan akhir."],
    ["150", "Angka (number). Ditulis tanpa tanda kutip."],
    [",", "Pemisah antar-argument. `print(\"A\", \"B\")` menampilkan A dan B dipisah satu spasi."],
    ["sep=\" | \"", "Parameter `sep` (separator): teks pemisah di antara nilai. Default-nya satu spasi."],
    ["end=\"\\n\"", "Parameter `end`: teks yang dicetak di akhir. Default-nya `\\n` (baris baru)."],
    [":", "Titik dua di akhir baris seperti `if ...:` menandakan blok kode akan dimulai pada baris berikutnya."],
    ["4 spasi", "Indentasi standar Python (PEP 8) untuk isi sebuah blok."],
  ],
  examples: [
    {
      title: "Contoh 1 — Program pertama: menampilkan teks",
      intro: "Kode paling sederhana di Python: satu baris, satu perintah.",
      code: `print("Halo, dunia!")`,
      output: "Halo, dunia!",
      explain: [
        ["print", "Memanggil fungsi bawaan `print` — perintah untuk menampilkan sesuatu."],
        ["(", "Membuka tempat argument, yaitu nilai yang akan ditampilkan."],
        ["\"Halo, dunia!\"", "Sebuah string (teks). Tanda kutip tidak ikut tampil di output — tanda kutip hanya memberi tahu Python bahwa ini teks."],
        [")", "Menutup pemanggilan fungsi. Setiap `(` harus punya pasangan `)`."],
      ],
    },
    {
      title: "Contoh 2 — Beberapa statement dijalankan berurutan",
      intro: "Python membaca dari baris 1, lalu baris 2, lalu baris 3. Urutan output mengikuti urutan kode.",
      code: `print("Belajar Python")
print("untuk Machine Learning")
print(2026)`,
      output: "Belajar Python\nuntuk Machine Learning\n2026",
      explain: [
        ["print(\"Belajar Python\")", "Statement pertama, dijalankan lebih dulu."],
        ["print(\"untuk Machine Learning\")", "Statement kedua. Setiap `print()` otomatis pindah ke baris baru setelah selesai."],
        ["print(2026)", "Mencetak angka. Perhatikan: angka ditulis **tanpa** tanda kutip."],
      ],
      change: "Sekarang ada tiga statement. Kita melihat bahwa Python mengeksekusi kode dari atas ke bawah, dan `print()` bisa menampilkan angka maupun teks.",
    },
    {
      title: "Contoh 3 — Beberapa nilai dalam satu print() dan parameter sep",
      intro: "Satu `print()` bisa menerima beberapa nilai yang dipisah koma.",
      code: `print("Jumlah data:", 150)
print("Python", "NumPy", "Pandas")
print("Python", "NumPy", "Pandas", sep=" | ")`,
      output: "Jumlah data: 150\nPython NumPy Pandas\nPython | NumPy | Pandas",
      explain: [
        ["print(\"Jumlah data:\", 150)", "Dua argument: string `\"Jumlah data:\"` dan angka `150`. Python otomatis memberi satu spasi di antaranya."],
        ["print(\"Python\", \"NumPy\", \"Pandas\")", "Tiga string; dipisah satu spasi karena nilai default `sep` adalah spasi."],
        ["sep=\" | \"", "Kita mengganti pemisahnya. `sep` adalah **parameter**; `\" | \"` adalah nilai yang kita berikan (disebut *keyword argument* karena ditulis dengan nama)."],
      ],
      change: "Contoh ini memperkenalkan **parameter** pertama kita: `sep`. Parameter adalah \"pengaturan\" sebuah fungsi yang bisa kita ubah.",
    },
    {
      title: "Contoh 4 — Parameter end: tidak pindah baris",
      intro: "Secara default `print()` diakhiri baris baru. Parameter `end` mengubahnya.",
      code: `print("Loading", end="...")
print("selesai")
print("A", end=" ")
print("B")`,
      output: "Loading...selesai\nA B",
      explain: [
        ["end=\"...\"", "Setelah mencetak `Loading`, Python mencetak `...` (bukan baris baru). Jadi print berikutnya melanjutkan di baris yang sama."],
        ["print(\"selesai\")", "Dicetak tepat setelah `...`, lalu pindah baris (end default)."],
        ["print(\"A\", end=\" \")", "Diakhiri satu spasi, sehingga `B` muncul di baris yang sama."],
      ],
      change: "Sekarang kita mengenal parameter kedua, `end`. Kamu akan sering melihat `sep` dan `end` saat merapikan output.",
    },
    {
      title: "Contoh 5 — Indentation menandai blok kode",
      intro: "Kita belum belajar `if` (akan dibahas di Conditional Statements). Fokus pada **bentuknya**: baris yang diakhiri `:` diikuti baris yang menjorok 4 spasi.",
      code: `if 5 > 3:
    print("5 lebih besar dari 3")
    print("Baris ini juga di dalam blok if")
print("Baris ini di luar blok if")`,
      output: "5 lebih besar dari 3\nBaris ini juga di dalam blok if\nBaris ini di luar blok if",
      explain: [
        ["if 5 > 3:", "Baris pembuka blok. Diakhiri titik dua `:`."],
        ["    print(\"5 lebih besar dari 3\")", "Menjorok 4 spasi → termasuk *di dalam* blok `if`."],
        ["    print(\"Baris ini juga di dalam blok if\")", "Indentasi sama (4 spasi) → masih satu blok."],
        ["print(\"Baris ini di luar blok if\")", "Kembali ke kolom paling kiri → blok sudah selesai."],
      ],
      change: "Contoh ini memperlihatkan aturan sintaks terpenting Python: **indentasi menentukan struktur program**.",
    },
  ],
  params: [
    {
      title: "Parameter penting print()",
      items: [
        { name: "*objects", type: "nilai apa saja", default: "—", desc: "Nilai-nilai yang ingin ditampilkan, dipisah koma. Boleh string, angka, atau tipe lain." },
        { name: "sep", type: "str", default: "\" \" (satu spasi)", desc: "Pemisah di antara nilai-nilai yang dicetak." },
        { name: "end", type: "str", default: "\"\\n\" (baris baru)", desc: "Teks yang ditambahkan setelah nilai terakhir." },
      ],
    },
  ],
  io: {
    title: "Input → Output",
    input: `print("Akurasi model:", 0.95, sep=" = ")`,
    output: "Akurasi model: = 0.95",
    note: "Perhatikan bahwa `sep` diletakkan di antara SEMUA nilai, termasuk setelah tanda titik dua.",
  },
  tryIt: `# Ubah teks di bawah, lalu tekan Run (atau Ctrl+Enter)
print("Halo, nama saya ...")
print("Saya sedang belajar", "Machine Learning")
print("Python", "NumPy", "Pandas", sep=" -> ")`,
  mistakes: [
    {
      title: "Huruf besar-kecil salah (Python case-sensitive)",
      wrong: `Print("Halo")`,
      error: "NameError",
      fix: `print("Halo")`,
      explain: "`Print` dan `print` adalah dua nama yang berbeda. Fungsi bawaannya adalah `print` dengan huruf kecil semua.",
    },
    {
      title: "Tanda kutip tidak ditutup",
      wrong: `print("Halo)`,
      error: "SyntaxError",
      fix: `print("Halo")`,
      explain: "String harus dibuka dan ditutup dengan tanda kutip yang sama. Pesan error 3.14: *unterminated string literal*.",
    },
    {
      title: "Tanda kurung kurang",
      wrong: `print("Halo"`,
      error: "SyntaxError",
      fix: `print("Halo")`,
      explain: "Setiap `(` wajib punya pasangan `)`. Python akan melapor bahwa tanda kurung *was never closed*.",
    },
    {
      title: "Indentasi tidak sesuai",
      wrong: `print("Mulai")
    print("Baris ini menjorok tanpa alasan")`,
      error: "IndentationError",
      fix: `print("Mulai")
print("Baris ini sejajar")`,
      explain: "Indentasi hanya boleh dipakai di dalam blok (setelah baris yang diakhiri `:`). Baris biasa harus mulai dari kolom paling kiri.",
    },
  ],
  bestPractices: [
    "Gunakan **4 spasi** untuk setiap tingkat indentasi (standar PEP 8). Jangan mencampur tab dan spasi.",
    "Tulis satu statement per baris agar mudah dibaca dan mudah dicari jika ada error.",
    "Saat bereksperimen, cetak hasil antara dengan `print()` untuk memastikan kode berjalan seperti yang kamu pikirkan.",
    "Baca pesan error dari **baris paling bawah**: di situ tertulis jenis error dan penyebabnya.",
  ],
  exercises: [
    {
      id: "py-syntax-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Lengkapi print",
      prompt: "Ganti `____` agar program menampilkan teks: `Halo, Machine Learning!`",
      starter: `____("Halo, Machine Learning!")`,
      solution: `print("Halo, Machine Learning!")`,
      tests: [{ desc: "Output adalah 'Halo, Machine Learning!'", expr: "_output.strip() == 'Halo, Machine Learning!'" }],
      hints: [
        "Konsep: kita butuh fungsi bawaan untuk menampilkan output ke layar.",
        "Nama fungsinya diawali huruf `p` dan terdiri dari 5 huruf kecil.",
        "Sintaks: `print(\"teks\")`",
      ],
      explanation: "`print()` menampilkan nilai di dalam kurung ke layar. Tanda kutip menandai bahwa nilainya adalah teks (string).",
    },
    {
      id: "py-syntax-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tanpa menjalankan kode, tuliskan output yang akan muncul.",
      code: `print("A", "B", sep="-")
print("C", end="")
print("D")`,
      answer: "A-B\nCD",
      hints: [
        "Konsep: `sep` mengatur pemisah, `end` mengatur akhir baris.",
        "`end=\"\"` berarti tidak ada baris baru setelah `C`.",
        "Baris pertama `A-B`; baris kedua gabungan `C` dan `D`.",
      ],
      explanation: "`sep=\"-\"` menaruh tanda `-` di antara A dan B. `end=\"\"` membuat `D` dicetak tepat setelah `C` di baris yang sama.",
    },
    {
      id: "py-syntax-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging Challenge",
      prompt: "Kode ini error. Perbaiki sehingga menampilkan dua baris: `Belajar Python` lalu `Langkah demi langkah`.",
      starter: `Print("Belajar Python")
print("Langkah demi langkah)`,
      solution: `print("Belajar Python")
print("Langkah demi langkah")`,
      tests: [
        { desc: "Kode berjalan tanpa error", expr: "_error is None" },
        { desc: "Baris 1 = 'Belajar Python'", expr: "len(_lines) >= 1 and _lines[0] == 'Belajar Python'" },
        { desc: "Baris 2 = 'Langkah demi langkah'", expr: "len(_lines) >= 2 and _lines[1] == 'Langkah demi langkah'" },
      ],
      hints: [
        "Konsep: ada dua kesalahan — satu soal huruf besar/kecil, satu soal tanda kutip.",
        "Python case-sensitive; dan setiap string perlu tanda kutip penutup.",
        "Baris 1 harus `print(...)` huruf kecil; baris 2 tambahkan `\"` sebelum `)`.",
      ],
      explanation: "`Print` tidak dikenal (NameError) karena nama fungsinya `print`. String di baris 2 belum ditutup (SyntaxError).",
    },
    {
      id: "py-syntax-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code from Scratch — Perkenalan",
      prompt: [
        "Tulis program yang menampilkan **tepat 3 baris**:",
        "1. `Nama: <nama kamu>`\n2. `Jurusan: Informatika`\n3. `Target: Machine Learning Engineer`",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `print("Nama: Budi")
print("Jurusan: Informatika")
print("Target: Machine Learning Engineer")`,
      alternatives: [`print("Nama: Sari", "Jurusan: Informatika", "Target: Machine Learning Engineer", sep="\\n")`],
      tests: [
        { desc: "Ada tepat 3 baris output", expr: "len(_lines) == 3" },
        { desc: "Baris 1 diawali 'Nama: ' dan berisi nama", expr: "len(_lines) == 3 and _lines[0].startswith('Nama: ') and len(_lines[0]) > 6" },
        { desc: "Baris 2 = 'Jurusan: Informatika'", expr: "len(_lines) == 3 and _lines[1] == 'Jurusan: Informatika'" },
        { desc: "Baris 3 = 'Target: Machine Learning Engineer'", expr: "len(_lines) == 3 and _lines[2] == 'Target: Machine Learning Engineer'" },
      ],
      hints: [
        "Konsep: setiap `print()` menghasilkan satu baris.",
        "Gunakan fungsi `print` tiga kali.",
        "Contoh baris pertama: `print(\"Nama: Budi\")`",
      ],
      explanation: "Tiga `print()` menghasilkan tiga baris. Solusi alternatif dengan `sep=\"\\n\"` juga benar karena outputnya sama — penilaian memeriksa output, bukan teks kode.",
    },
    {
      id: "py-syntax-ex5",
      type: "arrange",
      level: 5,
      title: "Code Arrangement — Laporan Model",
      prompt: "Susun baris-baris kode agar menghasilkan laporan dengan urutan: judul, garis, lalu dua baris metrik (Accuracy dulu, kemudian Recall). Hasil yang benar:\n\n```\nLAPORAN MODEL\n-------------\nAccuracy: 0.9\nRecall: 0.75\n```",
      lines: [
        `print("LAPORAN MODEL")`,
        `print("-------------")`,
        `print("Accuracy:", 0.9)`,
        `print("Recall:", 0.75)`,
      ],
      tests: [{ desc: "Output sesuai urutan laporan", expr: "_lines == ['LAPORAN MODEL', '-------------', 'Accuracy: 0.9', 'Recall: 0.75']" }],
      hints: [
        "Konsep: Python mengeksekusi baris dari atas ke bawah.",
        "Judul harus dicetak paling awal.",
        "Urutan: judul → garis → Accuracy → Recall.",
      ],
      explanation: "Karena eksekusi berurutan, urutan baris kode = urutan output.",
    },
  ],
  quiz: [
    {
      id: "py-syntax-q1",
      type: "mcq",
      prompt: "Bagaimana Python menandai sebuah blok kode (misalnya isi dari `if`)?",
      options: ["Dengan kurung kurawal { }", "Dengan indentasi (spasi di awal baris)", "Dengan titik koma ;", "Dengan kata kunci end"],
      answer: 1,
      explanation: "Python memakai indentasi untuk menandai blok. Standarnya 4 spasi per tingkat.",
    },
    {
      id: "py-syntax-q2",
      type: "tf",
      prompt: "`print` dan `Print` dianggap sama oleh Python.",
      answer: false,
      explanation: "Python bersifat case-sensitive. `Print` akan menghasilkan NameError.",
    },
    {
      id: "py-syntax-q3",
      type: "predict",
      prompt: "Apa output kode berikut?",
      code: `print("ML", "AI", sep="&")`,
      options: ["ML AI", "ML&AI", "ML & AI", "MLAI"],
      answer: 1,
      explanation: "`sep=\"&\"` mengganti pemisah default (spasi) dengan `&` tanpa spasi tambahan.",
    },
    {
      id: "py-syntax-q4",
      type: "fill",
      prompt: "Lengkapi nama parameter agar dua print berikut tampil di satu baris: `print(\"Halo\", ____=\" \")` lalu `print(\"Dunia\")`.",
      answer: ["end"],
      explanation: "Parameter `end` menentukan apa yang dicetak di akhir. Dengan `end=\" \"`, tidak ada baris baru.",
    },
    {
      id: "py-syntax-q5",
      type: "case",
      prompt: "Kamu melihat error `SyntaxError: unterminated string literal`. Apa penyebab yang paling mungkin?",
      options: ["Nama fungsi salah ketik", "Ada string yang tanda kutipnya belum ditutup", "Indentasi kurang", "Angka ditulis dengan tanda kutip"],
      answer: 1,
      explanation: "*Unterminated string literal* berarti string dibuka dengan tanda kutip tetapi tidak ditutup.",
    },
  ],
  challenge: {
    id: "py-syntax-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Kartu Ringkasan Dataset",
    prompt: [
      "Kamu baru memuat dataset Iris. Buat \"kartu ringkasan\" dengan output **persis** seperti ini:",
      "```\n=== Dataset Iris ===\nJumlah baris: 150\nJumlah kolom: 5\nTarget: species\nFitur: sepal_length, sepal_width, petal_length, petal_width\n```",
      "Syarat: baris terakhir harus dibuat dengan **satu** `print()` yang memakai parameter `sep`.",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `print("=== Dataset Iris ===")
print("Jumlah baris:", 150)
print("Jumlah kolom:", 5)
print("Target:", "species")
print("Fitur: sepal_length", "sepal_width", "petal_length", "petal_width", sep=", ")`,
    tests: [
      { desc: "Baris 1 judul", expr: "len(_lines) == 5 and _lines[0] == '=== Dataset Iris ==='" },
      { desc: "Baris 2 jumlah baris", expr: "len(_lines) == 5 and _lines[1] == 'Jumlah baris: 150'" },
      { desc: "Baris 3 jumlah kolom", expr: "len(_lines) == 5 and _lines[2] == 'Jumlah kolom: 5'" },
      { desc: "Baris 4 target", expr: "len(_lines) == 5 and _lines[3] == 'Target: species'" },
      { desc: "Baris 5 daftar fitur", expr: "len(_lines) == 5 and _lines[4] == 'Fitur: sepal_length, sepal_width, petal_length, petal_width'" },
      { desc: "Menggunakan parameter sep", expr: "'sep' in _code" },
    ],
    hints: [
      "Konsep: setiap baris = satu `print()`; angka boleh ditulis tanpa tanda kutip.",
      "Untuk baris terakhir, berikan beberapa string lalu `sep=\", \"`.",
      "`print(\"Fitur: sepal_length\", \"sepal_width\", ..., sep=\", \")`",
    ],
    explanation: "Ketika `sep=\", \"`, setiap nilai dipisahkan koma dan spasi — persis format daftar fitur.",
  },
  summary: [
    "**Syntax** adalah aturan penulisan kode; Python menjalankan statement dari atas ke bawah.",
    "`print()` menampilkan output. Teks ditulis dalam tanda kutip, angka tanpa tanda kutip.",
    "Parameter `sep` mengatur pemisah antar-nilai; parameter `end` mengatur akhir output.",
    "Python **case-sensitive** dan memakai **indentasi** (4 spasi) untuk menandai blok kode.",
    "Baca error dari baris paling bawah: `NameError`, `SyntaxError`, dan `IndentationError` adalah yang paling sering ditemui pemula.",
  ],
  cheatsheet: [
    { syntax: `print("teks")`, desc: "Menampilkan teks" },
    { syntax: `print("Total:", 10)`, desc: "Beberapa nilai, dipisah spasi" },
    { syntax: `print(a, b, sep=", ")`, desc: "Mengganti pemisah" },
    { syntax: `print("x", end="")`, desc: "Tidak pindah baris" },
    { syntax: `if kondisi:\n    statement`, desc: "Blok kode dengan indentasi 4 spasi" },
  ],
  flashcards: [
    { q: "Fungsi untuk menampilkan output ke layar?", a: `print("Halo")` },
    { q: "Mencetak A dan B dipisah tanda koma dan spasi?", a: `print("A", "B", sep=", ")` },
    { q: "Mencetak teks tanpa pindah baris di akhir?", a: `print("Loading", end="")` },
    { q: "Berapa spasi indentasi standar Python?", a: "4 spasi (PEP 8)" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3. An Informal Introduction to Python", "tutorial/introduction.html"),
    pyDoc("Built-in Functions — print()", "library/functions.html#print"),
    pyDoc("Lexical analysis — 2.1.8 Indentation", "reference/lexical_analysis.html#indentation"),
    pyDoc("The Python Tutorial — 8.1 Syntax Errors", "tutorial/errors.html#syntax-errors"),
    pep8("PEP 8 — Indentation", "#indentation"),
    kagglePy("Hello, Python (Kaggle Learn Python, Lesson 1)", "hello-python"),
    KAGGLE_PYTHON_COURSE,
  ],
};
