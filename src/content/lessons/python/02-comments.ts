import type { Lesson } from "../../../types.ts";
import { kagglePy, pep8, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-comments",
  title: "Comments",
  minutes: 25,
  prerequisites: ["py-python-syntax"],
  objectives: [
    "Menulis comment satu baris dengan tanda `#`.",
    "Menulis inline comment (comment di ujung baris kode).",
    "Memahami bahwa comment tidak dijalankan oleh Python.",
    "Menggunakan comment untuk menonaktifkan kode sementara (commenting out).",
    "Membedakan comment `#` dengan docstring `\"\"\"...\"\"\"`.",
  ],
  definition: [
    "**Comment** (komentar) adalah catatan di dalam kode yang **diabaikan** oleh Python. Comment ditulis untuk manusia — untuk dirimu di masa depan atau rekan satu tim — bukan untuk komputer.",
    "Di Python, comment diawali tanda pagar `#`. Semua teks setelah `#` sampai akhir baris tidak dijalankan.",
    "Ada juga **docstring**: teks dalam tiga tanda kutip `\"\"\"...\"\"\"` yang diletakkan di awal file atau di awal function untuk menjelaskan kegunaannya. Secara teknis docstring adalah string, bukan comment, tetapi dipakai untuk dokumentasi. Docstring akan dibahas lagi di materi Functions.",
  ],
  why: [
    "Notebook Machine Learning sering panjang: memuat data, membersihkan, melatih, mengevaluasi. Comment membantu menjelaskan **mengapa** suatu langkah dilakukan, misalnya `# drop kolom ID karena tidak berguna untuk prediksi`.",
    "Saat debugging, kamu bisa \"mematikan\" sebuah baris dengan menambahkan `#` di depannya tanpa menghapusnya.",
  ],
  when: [
    "- Menjelaskan tujuan sebuah blok kode atau keputusan penting (mengapa, bukan sekadar apa).",
    "- Memberi judul bagian, misalnya `# === 1. Load data ===`.",
    "- Menonaktifkan kode sementara saat mencoba-coba.",
    "- Tidak perlu memberi comment pada kode yang sudah jelas, seperti `x = 5  # isi x dengan 5`.",
  ],
  analogy: "Comment seperti **catatan pensil di pinggir buku resep**: \"kurangi gula kalau untuk anak-anak\". Catatan itu membantu pembaca, tetapi bukan bagian dari langkah memasak itu sendiri.",
  syntax: {
    code: `# ini comment satu baris
print("Halo")  # ini inline comment

"""Ini docstring:
bisa lebih dari satu baris."""`,
    note: "Untuk inline comment, PEP 8 menyarankan minimal **dua spasi** sebelum `#` dan satu spasi setelahnya.",
  },
  anatomy: [
    ["#", "Tanda awal comment. Python mengabaikan semua teks setelahnya pada baris yang sama."],
    ["# teks", "Satu spasi setelah `#` membuat comment lebih mudah dibaca (anjuran PEP 8)."],
    ["kode  # catatan", "Inline comment: kode di kiri tetap dijalankan, catatan di kanan diabaikan."],
    ["\"\"\" ... \"\"\"", "Triple-quoted string. Dipakai sebagai docstring untuk dokumentasi."],
  ],
  examples: [
    {
      title: "Contoh 1 — Comment satu baris",
      code: `# Program pertama untuk belajar comment
print("Belajar Machine Learning")`,
      output: "Belajar Machine Learning",
      explain: [
        ["# Program pertama untuk belajar comment", "Baris comment. Python melewatinya sepenuhnya."],
        ["print(\"Belajar Machine Learning\")", "Satu-satunya baris yang benar-benar dijalankan."],
      ],
    },
    {
      title: "Contoh 2 — Inline comment",
      code: `print("Jumlah sampel:", 150)  # dataset Iris punya 150 baris
print("Jumlah fitur:", 4)  # 4 ukuran bunga`,
      output: "Jumlah sampel: 150\nJumlah fitur: 4",
      explain: [
        ["print(\"Jumlah sampel:\", 150)", "Bagian kode — dijalankan."],
        ["# dataset Iris punya 150 baris", "Inline comment — menjelaskan arti angka 150 bagi pembaca."],
      ],
      change: "Comment sekarang berada di ujung baris kode, bukan di baris sendiri.",
    },
    {
      title: "Contoh 3 — Menonaktifkan kode (commenting out)",
      intro: "Baris yang diawali `#` tidak dijalankan, sehingga outputnya hilang.",
      code: `print("Langkah 1: load data")
# print("Langkah 2: tampilkan semua data")
print("Langkah 3: latih model")`,
      output: "Langkah 1: load data\nLangkah 3: latih model",
      explain: [
        ["# print(\"Langkah 2: tampilkan semua data\")", "Baris ini kode yang sengaja dinonaktifkan. Hapus `#` untuk mengaktifkannya kembali."],
      ],
      change: "Kita memakai `#` bukan untuk catatan, melainkan untuk mematikan sebuah baris.",
    },
    {
      title: "Contoh 4 — Tanda # di dalam string BUKAN comment",
      intro: "Jika `#` berada di dalam tanda kutip, ia hanyalah karakter biasa.",
      code: `print("Tagar: #MachineLearning")  # yang ini baru comment`,
      output: "Tagar: #MachineLearning",
      explain: [
        ["\"Tagar: #MachineLearning\"", "`#` berada di dalam string, jadi ikut dicetak."],
        ["# yang ini baru comment", "`#` di luar tanda kutip → comment."],
      ],
      change: "Kita belajar batas aturan comment: `#` hanya menjadi comment bila di luar string.",
    },
    {
      title: "Contoh 5 — Docstring dan comment judul bagian",
      code: `"""Analisis sederhana dataset siswa.
Penulis: Budi
"""

# === 1. Data ===
print("Jumlah siswa: 30")

# === 2. Ringkasan ===
print("Rata-rata nilai: 78.5")`,
      output: "Jumlah siswa: 30\nRata-rata nilai: 78.5",
      explain: [
        ["\"\"\"Analisis sederhana dataset siswa.", "Awal docstring yang menjelaskan isi file. Tidak menghasilkan output karena tidak dicetak."],
        ["# === 1. Data ===", "Comment sebagai judul bagian agar notebook/skrip mudah dinavigasi."],
      ],
      change: "Contoh ini menunjukkan gaya penulisan yang rapi seperti di proyek Data Science sungguhan.",
    },
  ],
  io: {
    title: "Input → Output",
    input: `# print("A")
print("B")  # print("C")`,
    output: "B",
    note: "Hanya `print(\"B\")` yang dijalankan. `print(\"C\")` berada setelah `#` sehingga menjadi bagian dari comment.",
  },
  tryIt: `# Coba tambahkan comment-mu sendiri di bawah ini

print("Data berhasil dimuat")  # ubah pesan ini
# print("Baris ini tidak dijalankan. Hapus # untuk mengaktifkan.")`,
  mistakes: [
    {
      title: "Lupa tanda # pada catatan",
      wrong: `ini adalah catatan
print("Halo")`,
      error: "SyntaxError",
      fix: `# ini adalah catatan
print("Halo")`,
      explain: "Tanpa `#`, Python mencoba menjalankan teks catatan sebagai kode dan gagal memahaminya.",
    },
    {
      title: "Memakai // seperti bahasa lain",
      wrong: `// ini comment ala JavaScript
print("Halo")`,
      error: "SyntaxError",
      fix: `# comment di Python memakai tanda pagar
print("Halo")`,
      explain: "`//` dipakai untuk comment di JavaScript/C/Java. Di Python, `//` adalah operator pembagian bulat.",
    },
    {
      title: "Comment yang hanya mengulang kode",
      wrong: `x = 150  # x sama dengan 150`,
      fix: `n_samples = 150  # jumlah baris pada dataset Iris`,
      explain: "Comment yang baik menjelaskan **makna** atau **alasan**. Lebih baik lagi: pakai nama variabel yang jelas.",
    },
  ],
  bestPractices: [
    "Tulis comment yang menjelaskan **mengapa**, bukan mengulang **apa** yang sudah jelas dari kode.",
    "Gunakan satu spasi setelah `#`, dan dua spasi sebelum inline comment (PEP 8).",
    "Perbarui comment ketika kode berubah — comment yang salah lebih menyesatkan daripada tidak ada comment.",
    "Di notebook, gunakan comment judul (`# === Load data ===`) atau sel Markdown untuk memisahkan tahap workflow.",
  ],
  exercises: [
    {
      id: "py-comments-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Jadikan comment",
      prompt: "Baris pertama seharusnya catatan, bukan kode. Ganti `____` dengan simbol yang tepat agar program hanya mencetak `Siap belajar!`.",
      starter: `____ Ini adalah catatan untuk diri sendiri
print("Siap belajar!")`,
      solution: `# Ini adalah catatan untuk diri sendiri
print("Siap belajar!")`,
      tests: [
        { desc: "Kode berjalan tanpa error", expr: "_error is None" },
        { desc: "Output hanya 'Siap belajar!'", expr: "_lines == ['Siap belajar!']" },
      ],
      hints: ["Konsep: catatan di Python harus diawali simbol khusus.", "Simbolnya adalah tanda pagar.", "Baris pertama: `# Ini adalah catatan untuk diri sendiri`"],
      explanation: "Tanda `#` membuat Python mengabaikan sisa baris tersebut.",
    },
    {
      id: "py-comments-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output dari kode berikut.",
      code: `print("1")  # print("2")
# print("3")
print("4 # 5")`,
      answer: "1\n4 # 5",
      hints: ["Konsep: `#` di luar string memulai comment.", "Baris 2 seluruhnya comment.", "Pada baris 3, `#` berada di dalam string."],
      explanation: "Baris 1 mencetak `1` (bagian `print(\"2\")` adalah comment). Baris 2 diabaikan. Baris 3 mencetak string `4 # 5` utuh karena `#` berada di dalam tanda kutip.",
    },
    {
      id: "py-comments-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging Challenge",
      prompt: "Program ini error karena catatan tidak ditulis dengan benar. Perbaiki tanpa menghapus teks catatannya, sehingga output-nya `Model dilatih`.",
      starter: `Langkah berikut melatih model
print("Model dilatih")`,
      solution: `# Langkah berikut melatih model
print("Model dilatih")`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output 'Model dilatih'", expr: "_lines == ['Model dilatih']" },
        { desc: "Teks catatan masih ada di kode", expr: "'Langkah berikut melatih model' in _code" },
      ],
      hints: ["Konsep: teks biasa tanpa penanda akan dianggap kode.", "Tambahkan penanda comment di awal baris 1.", "`# Langkah berikut melatih model`"],
      explanation: "Dengan `#` di depannya, teks catatan menjadi comment dan tidak lagi menyebabkan SyntaxError.",
    },
    {
      id: "py-comments-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Skrip yang terdokumentasi",
      prompt: [
        "Tulis program yang mencetak dua baris: `Load data` lalu `Train model`.",
        "Syarat: tambahkan **minimal 2 comment** (baris yang diawali `#`) dan satu **inline comment**.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `# === Tahap 1 ===
print("Load data")  # membaca dataset

# === Tahap 2 ===
print("Train model")`,
      tests: [
        { desc: "Output: 'Load data' lalu 'Train model'", expr: "_lines == ['Load data', 'Train model']" },
        { desc: "Minimal 2 baris comment yang diawali #", expr: "sum(1 for ln in _code.splitlines() if ln.strip().startswith('#')) >= 2" },
        { desc: "Ada inline comment (kode lalu # pada baris yang sama)", expr: "any(('#' in ln) and not ln.strip().startswith('#') and ln.strip().startswith('print') for ln in _code.splitlines())" },
      ],
      hints: ["Konsep: comment baris sendiri dan inline comment.", "Gunakan `#` di awal baris, dan `  #` setelah kode.", "`print(\"Load data\")  # membaca dataset`"],
      explanation: "Penilaian memeriksa output dan struktur comment. Isi comment bebas — yang penting maknanya membantu pembaca.",
    },
    {
      id: "py-comments-ex5",
      type: "code",
      kind: "debug",
      level: 5,
      title: "Apply — Nonaktifkan baris debug",
      prompt: "Skrip laporan ini masih mencetak dua baris debug (`DEBUG: ...`). Nonaktifkan keduanya dengan **comment** (jangan dihapus) sehingga output hanya berisi laporan akhir.",
      starter: `print("DEBUG: mulai")
print("Akurasi: 0.92")
print("DEBUG: selesai")
print("Recall: 0.88")`,
      solution: `# print("DEBUG: mulai")
print("Akurasi: 0.92")
# print("DEBUG: selesai")
print("Recall: 0.88")`,
      tests: [
        { desc: "Output hanya Akurasi dan Recall", expr: "_lines == ['Akurasi: 0.92', 'Recall: 0.88']" },
        { desc: "Baris debug masih ada di kode sebagai comment", expr: "_code.count('DEBUG') == 2" },
      ],
      hints: ["Konsep: commenting out.", "Tambahkan `#` di depan baris yang berisi DEBUG.", "`# print(\"DEBUG: mulai\")`"],
      explanation: "Commenting out berguna saat debugging: baris bisa diaktifkan lagi kapan saja dengan menghapus `#`.",
    },
  ],
  quiz: [
    { id: "py-comments-q1", type: "mcq", prompt: "Simbol apa yang memulai comment satu baris di Python?", options: ["//", "#", "--", "/*"], answer: 1, explanation: "Python memakai `#`. `//` di Python adalah operator pembagian bulat." },
    { id: "py-comments-q2", type: "tf", prompt: "Comment ikut dijalankan oleh Python, hanya saja tidak menampilkan output.", answer: false, explanation: "Comment sama sekali tidak dijalankan — Python mengabaikannya." },
    { id: "py-comments-q3", type: "predict", prompt: "Apa output kode berikut?", code: `print("A")  # print("B")\nprint("#C")`, options: ["A\nB\n#C", "A\n#C", "A", "#C"], answer: 1, explanation: "`print(\"B\")` ada di dalam comment. `#C` berada di dalam string sehingga dicetak." },
    { id: "py-comments-q4", type: "fill", prompt: "Teks dalam tiga tanda kutip di awal file/function yang dipakai untuk dokumentasi disebut ____.", answer: ["docstring", "docstrings"], explanation: "Docstring ditulis dengan `\"\"\"...\"\"\"`." },
    { id: "py-comments-q5", type: "case", prompt: "Mana comment yang paling bermanfaat dalam notebook ML?", options: ["`df = df.dropna()  # dropna`", "`df = df.dropna()  # hapus baris kosong karena hanya 0.5% data`", "`df = df.dropna()  # kode`", "Tidak perlu comment sama sekali"], answer: 1, explanation: "Comment terbaik menjelaskan alasan (mengapa aman menghapus: hanya 0,5% data)." },
  ],
  challenge: {
    id: "py-comments-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Rapikan skrip workflow",
    prompt: [
      "Buat skrip yang mencetak urutan workflow berikut (persis):",
      "```\nLoad data\nCek missing value\nSplit data\nLatih model\nEvaluasi\n```",
      "Syarat: awali skrip dengan **docstring** (`\"\"\"...\"\"\"`) yang menjelaskan isi skrip, dan beri **comment judul** sebelum setiap `print`.",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `"""Skrip ringkas tahapan workflow Machine Learning."""

# Tahap 1
print("Load data")
# Tahap 2
print("Cek missing value")
# Tahap 3
print("Split data")
# Tahap 4
print("Latih model")
# Tahap 5
print("Evaluasi")`,
    tests: [
      { desc: "Output sesuai urutan workflow", expr: "_lines == ['Load data', 'Cek missing value', 'Split data', 'Latih model', 'Evaluasi']" },
      { desc: "Skrip diawali docstring", expr: "_code.lstrip().startswith('\"\"\"') or _code.lstrip().startswith(\"'''\")" },
      { desc: "Minimal 5 baris comment", expr: "sum(1 for ln in _code.splitlines() if ln.strip().startswith('#')) >= 5" },
    ],
    hints: ["Konsep: docstring di baris paling atas + comment per bagian.", "Docstring: `\"\"\"Penjelasan.\"\"\"`; comment: `# Tahap 1`.", "Pola tiap tahap: `# Tahap 1` lalu `print(\"Load data\")`."],
    explanation: "Docstring menjelaskan file secara keseluruhan; comment judul memudahkan navigasi antar-tahap.",
  },
  summary: [
    "Comment diawali `#` dan diabaikan oleh Python.",
    "Inline comment ditulis setelah kode pada baris yang sama (dua spasi sebelum `#`).",
    "`#` di dalam tanda kutip bukan comment, melainkan karakter biasa.",
    "Commenting out = menonaktifkan kode sementara dengan menambahkan `#`.",
    "Docstring `\"\"\"...\"\"\"` dipakai untuk dokumentasi file dan function.",
  ],
  cheatsheet: [
    { syntax: "# catatan", desc: "Comment satu baris" },
    { syntax: "kode  # catatan", desc: "Inline comment" },
    { syntax: "# print(x)", desc: "Menonaktifkan kode" },
    { syntax: '"""Penjelasan."""', desc: "Docstring" },
  ],
  flashcards: [
    { q: "Simbol comment satu baris di Python?", a: "# ini comment" },
    { q: "Bagaimana menulis inline comment sesuai PEP 8?", a: 'print("Halo")  # dua spasi sebelum #' },
    { q: "Bagaimana menulis docstring?", a: '"""Penjelasan singkat file atau function."""' },
  ],
  references: [
    pyDoc("The Python Tutorial — 3. An Informal Introduction (bagian tentang comment)", "tutorial/introduction.html"),
    pyDoc("Lexical analysis — 2.1.3 Comments", "reference/lexical_analysis.html#comments"),
    pep8("PEP 8 — Comments", "#comments"),
    pep8("PEP 8 — Documentation Strings", "#documentation-strings"),
    kagglePy("Hello, Python (Kaggle Learn Python)", "hello-python"),
  ],
};
