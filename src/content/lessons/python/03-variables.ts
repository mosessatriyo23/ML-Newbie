import type { Lesson } from "../../../types.ts";
import { kagglePy, pep8, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-variables",
  title: "Variables",
  minutes: 40,
  prerequisites: ["py-python-syntax", "py-comments"],
  visual: "variables",
  objectives: [
    "Memahami variable (variabel) sebagai nama yang menunjuk ke sebuah nilai.",
    "Membuat dan mengubah nilai variabel dengan operator assignment `=`.",
    "Menerapkan aturan dan konvensi penamaan variabel (snake_case).",
    "Memakai variabel di dalam perhitungan dan `print()`.",
    "Melakukan multiple assignment dan menukar nilai dua variabel.",
  ],
  definition: [
    "**Variable** (variabel) adalah **nama** yang kita berikan pada sebuah **nilai** agar nilai itu bisa dipakai lagi. Contoh: `jumlah_data = 150` berarti nama `jumlah_data` menunjuk ke angka 150.",
    "Tanda `=` di Python disebut **assignment operator** (operator penugasan). Artinya bukan \"sama dengan\" seperti di matematika, melainkan **\"simpan nilai di kanan ke nama di kiri\"**. Python selalu menghitung sisi kanan terlebih dahulu.",
    "Python adalah bahasa **dynamically typed**: kamu tidak perlu menulis tipe data saat membuat variabel. Python menentukan tipenya sendiri dari nilai yang diberikan, dan variabel yang sama boleh diisi nilai bertipe lain di kemudian waktu.",
    "Aturan nama variabel: hanya huruf, angka, dan garis bawah `_`; **tidak boleh diawali angka**; tidak boleh memakai kata kunci Python seperti `if`, `for`, `class`; dan **case-sensitive** (`Umur` ≠ `umur`).",
  ],
  why: [
    "Di Machine Learning hampir semua hal disimpan di variabel: dataset (`df`), fitur (`X`), target (`y`), model (`model`), hasil prediksi (`y_pred`), dan skor (`accuracy`).",
    "Nama variabel yang jelas membuat kode mudah dibaca. Bandingkan `a = b / c` dengan `accuracy = correct / total`.",
  ],
  when: [
    "- Setiap kali sebuah nilai akan dipakai lebih dari sekali.",
    "- Untuk menyimpan hasil perhitungan antara (intermediate result) supaya bisa diperiksa dengan `print()`.",
    "- Untuk memberi makna pada angka (*magic number*), misalnya `test_size = 0.2` lebih jelas daripada angka 0.2 di tengah kode.",
  ],
  analogy: [
    "Bayangkan **label nama** yang ditempel pada kotak penyimpanan. Label `nilai_ujian` ditempel ke kotak berisi angka 85. Saat kamu menulis `nilai_ujian = 90`, label dipindahkan ke kotak baru berisi 90.",
    "Lihat visualisasi di bawah: ketika `y = x` lalu `x` diubah, `y` tetap menunjuk nilai lama.",
  ],
  syntax: {
    code: `nama_variabel = nilai

x = 10
x = x + 5          # sisi kanan dihitung dulu
a, b = 1, 2        # multiple assignment`,
  },
  anatomy: [
    ["nama_variabel", "Nama yang kamu pilih. Gunakan **snake_case**: huruf kecil, kata dipisah `_`."],
    ["=", "Assignment: simpan nilai di kanan ke nama di kiri."],
    ["nilai", "Apa pun: angka, teks, hasil perhitungan, bahkan hasil fungsi seperti `pd.read_csv(...)`."],
    ["a, b = 1, 2", "Multiple assignment: `a` mendapat 1 dan `b` mendapat 2 dalam satu baris."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat variabel dan mencetaknya",
      code: `jumlah_data = 150
print(jumlah_data)`,
      output: "150",
      explain: [
        ["jumlah_data = 150", "Membuat variabel `jumlah_data` dan menyimpan angka 150."],
        ["print(jumlah_data)", "Mencetak **isi** variabel. Perhatikan: tanpa tanda kutip! `print(\"jumlah_data\")` akan mencetak teks nama variabelnya, bukan nilainya."],
      ],
    },
    {
      title: "Contoh 2 — Variabel dalam perhitungan",
      code: `benar = 45
total = 50
akurasi = benar / total
print("Akurasi:", akurasi)`,
      output: "Akurasi: 0.9",
      explain: [
        ["benar = 45", "Jumlah prediksi benar."],
        ["total = 50", "Jumlah seluruh prediksi."],
        ["akurasi = benar / total", "Sisi kanan dihitung (45 / 50 = 0.9), lalu hasilnya disimpan ke `akurasi`."],
        ["print(\"Akurasi:\", akurasi)", "Mencetak teks dan nilai variabel sekaligus."],
      ],
      change: "Sekarang variabel dipakai untuk menghitung variabel lain — ini persis cara menghitung metrik di Machine Learning.",
    },
    {
      title: "Contoh 3 — Mengubah nilai (reassignment)",
      code: `skor = 70
print("Skor awal:", skor)
skor = skor + 10
print("Skor setelah ditambah:", skor)`,
      output: "Skor awal: 70\nSkor setelah ditambah: 80",
      explain: [
        ["skor = 70", "Nilai awal."],
        ["skor = skor + 10", "Python menghitung `skor + 10` memakai nilai lama (70 + 10 = 80), lalu menyimpan 80 kembali ke `skor`."],
      ],
      change: "Variabel yang sama diisi ulang. Inilah alasan `=` bukan \"sama dengan\": secara matematika `skor = skor + 10` mustahil, tetapi di Python valid.",
    },
    {
      title: "Contoh 4 — Variabel menunjuk nilai, bukan variabel lain",
      code: `x = 5
y = x
x = 10
print("x =", x)
print("y =", y)`,
      output: "x = 10\ny = 5",
      explain: [
        ["y = x", "`y` menunjuk nilai yang sedang ditunjuk `x`, yaitu 5."],
        ["x = 10", "`x` dipindah ke nilai baru. `y` tidak ikut berubah."],
      ],
      change: "Contoh ini meluruskan miskonsepsi umum. (Catatan: untuk list yang *diubah isinya* perilakunya berbeda — dibahas di materi List.)",
    },
    {
      title: "Contoh 5 — Multiple assignment dan menukar nilai",
      code: `train_size, test_size = 0.8, 0.2
print(train_size, test_size)

a = "kiri"
b = "kanan"
a, b = b, a
print(a, b)`,
      output: "0.8 0.2\nkanan kiri",
      explain: [
        ["train_size, test_size = 0.8, 0.2", "Dua variabel diisi sekaligus, berpasangan sesuai urutan."],
        ["a, b = b, a", "Menukar nilai tanpa variabel sementara. Sisi kanan (`\"kanan\", \"kiri\"`) dihitung dulu, baru dibagikan ke `a` dan `b`."],
      ],
      change: "Pola `a, b = ...` akan sering kamu lihat, misalnya `X_train, X_test, y_train, y_test = train_test_split(...)`.",
    },
  ],
  io: {
    title: "Input → Output",
    input: `harga = 20000
jumlah = 3
total = harga * jumlah
print("Total bayar:", total)`,
    output: "Total bayar: 60000",
  },
  tryIt: `# Ubah nilai variabel lalu jalankan ulang
nama = "Andi"
jam_belajar = 2
target_jam = 3

print("Halo,", nama)
print("Sisa jam belajar hari ini:", target_jam - jam_belajar)`,
  mistakes: [
    {
      title: "Memakai variabel sebelum dibuat",
      wrong: `print(akurasi)
akurasi = 0.9`,
      error: "NameError",
      fix: `akurasi = 0.9
print(akurasi)`,
      explain: "Python berjalan dari atas ke bawah. Saat baris 1 dijalankan, `akurasi` belum ada.",
    },
    {
      title: "Nama variabel diawali angka",
      wrong: `2data = 100`,
      error: "SyntaxError",
      fix: `data2 = 100`,
      explain: "Nama variabel tidak boleh diawali angka, tetapi boleh mengandung angka di tengah atau akhir.",
    },
    {
      title: "Nama variabel memakai spasi atau tanda minus",
      wrong: `jumlah-data = 100`,
      error: "SyntaxError",
      fix: `jumlah_data = 100`,
      explain: "`-` dibaca sebagai operator pengurangan. Gunakan garis bawah `_` (snake_case).",
    },
    {
      title: "Salah huruf besar-kecil",
      wrong: `Skor = 80
print(skor)`,
      error: "NameError",
      fix: `skor = 80
print(skor)`,
      explain: "`Skor` dan `skor` adalah dua variabel berbeda.",
    },
  ],
  bestPractices: [
    "Gunakan **snake_case** dan nama yang bermakna: `jumlah_siswa`, `test_size`, `y_pred`.",
    "Hindari nama yang sama dengan fungsi bawaan seperti `print`, `list`, `sum`, `max` — menimpanya membuat fungsi aslinya tidak bisa dipakai.",
    "Konvensi Data Science: `df` untuk DataFrame, `X` untuk fitur (huruf besar karena matriks), `y` untuk target.",
    "Gunakan variabel untuk angka penting (`random_state = 42`) agar mudah diubah di satu tempat.",
  ],
  exercises: [
    {
      id: "py-variables-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Simpan nilai",
      prompt: "Lengkapi kode agar variabel `jumlah_fitur` berisi angka `4`, lalu dicetak.",
      starter: `jumlah_fitur ____ 4
print(jumlah_fitur)`,
      solution: `jumlah_fitur = 4
print(jumlah_fitur)`,
      tests: [
        { desc: "Variabel jumlah_fitur bernilai 4", expr: "jumlah_fitur == 4" },
        { desc: "Output adalah 4", expr: "_lines == ['4']" },
      ],
      hints: ["Konsep: assignment.", "Operatornya satu karakter.", "`jumlah_fitur = 4`"],
      explanation: "`=` menyimpan nilai di kanan ke nama di kiri.",
    },
    {
      id: "py-variables-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `a = 3
b = a
a = a * 2
b = b + 1
print(a, b)`,
      answer: "6 4",
      hints: ["Konsep: reassignment; sisi kanan dihitung dulu.", "Setelah `b = a`, b bernilai 3. Lalu a diubah menjadi 6.", "b = 3 + 1."],
      explanation: "a: 3 → 6. b mengambil nilai a saat itu (3), lalu b + 1 = 4. Perubahan a tidak memengaruhi b.",
    },
    {
      id: "py-variables-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging Challenge — Nama variabel",
      prompt: "Perbaiki semua kesalahan nama variabel sehingga program mencetak `Total sampel: 200`.",
      starter: `train-data = 160
1test_data = 40
total = train_data + test_data
print("Total sampel:", Total)`,
      solution: `train_data = 160
test_data = 40
total = train_data + test_data
print("Total sampel:", total)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output 'Total sampel: 200'", expr: "_lines == ['Total sampel: 200']" },
        { desc: "Variabel total bernilai 200", expr: "total == 200" },
      ],
      hints: ["Konsep: aturan penamaan dan case-sensitive.", "Ada 3 kesalahan: tanda minus, diawali angka, dan huruf kapital.", "Gunakan `train_data`, `test_data`, dan `total` (huruf kecil)."],
      explanation: "Nama variabel memakai snake_case, tidak diawali angka, dan konsisten huruf besar-kecilnya.",
    },
    {
      id: "py-variables-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Hitung persentase data test",
      prompt: [
        "Buat variabel `total_data` bernilai 500 dan `jumlah_test` bernilai 100.",
        "Hitung `persen_test` = jumlah_test dibagi total_data dikali 100, lalu cetak: `Persentase test: 20.0`",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `total_data = 500
jumlah_test = 100
persen_test = jumlah_test / total_data * 100
print("Persentase test:", persen_test)`,
      tests: [
        { desc: "total_data = 500", expr: "total_data == 500" },
        { desc: "jumlah_test = 100", expr: "jumlah_test == 100" },
        { desc: "persen_test = 20.0", expr: "persen_test == 20.0" },
        { desc: "Output 'Persentase test: 20.0'", expr: "_lines == ['Persentase test: 20.0']" },
      ],
      hints: ["Konsep: variabel di dalam perhitungan.", "Gunakan operator `/` lalu `*`.", "`persen_test = jumlah_test / total_data * 100`"],
      explanation: "Pembagian `/` di Python selalu menghasilkan float, sehingga hasilnya 20.0.",
    },
    {
      id: "py-variables-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Tukar train dan test",
      prompt: "Seorang rekan tertukar menulis ukuran data. Tukar isi `train` dan `test` **menggunakan multiple assignment satu baris** (tanpa mengetik ulang angkanya), lalu cetak `Train: 800 Test: 200`.",
      starter: `train = 200
test = 800
# tukar di sini

print("Train:", train, "Test:", test)`,
      solution: `train = 200
test = 800
train, test = test, train

print("Train:", train, "Test:", test)`,
      tests: [
        { desc: "train = 800 dan test = 200", expr: "train == 800 and test == 200" },
        { desc: "Output benar", expr: "_lines == ['Train: 800 Test: 200']" },
        { desc: "Angka 800 dan 200 hanya ditulis sekali", expr: "_code.count('800') == 1 and _code.count('200') == 1" },
      ],
      hints: ["Konsep: multiple assignment.", "Pola tukar: `a, b = b, a`.", "`train, test = test, train`"],
      explanation: "Sisi kanan `test, train` dievaluasi dulu menjadi `(800, 200)`, lalu dibagikan ke `train` dan `test`.",
    },
  ],
  quiz: [
    { id: "py-variables-q1", type: "mcq", prompt: "Nama variabel mana yang VALID?", options: ["2nd_model", "model-2", "model_2", "model 2"], answer: 2, explanation: "Hanya huruf, angka, dan `_`, serta tidak diawali angka." },
    { id: "py-variables-q2", type: "predict", prompt: "Apa outputnya?", code: `n = 10\nn = n - 3\nn = n * 2\nprint(n)`, options: ["10", "7", "14", "20"], answer: 2, explanation: "10 → 7 → 14." },
    { id: "py-variables-q3", type: "tf", prompt: "Di Python, `x = x + 1` adalah kode yang valid.", answer: true, explanation: "Sisi kanan dihitung dengan nilai lama x, lalu hasilnya disimpan kembali ke x." },
    { id: "py-variables-q4", type: "fill", prompt: "Gaya penamaan variabel yang dianjurkan PEP 8 (huruf kecil, dipisah garis bawah) disebut ____.", answer: ["snake_case", "snake case"], explanation: "Contoh: `jumlah_data`, `test_size`." },
    { id: "py-variables-q5", type: "case", prompt: "Dalam proyek ML kamu menulis `list = [1, 2, 3]`. Apa risikonya?", options: ["Tidak ada risiko", "Fungsi bawaan `list()` tertimpa dan tidak bisa dipakai lagi", "Python otomatis mengganti nama variabel", "Variabel menjadi konstanta"], answer: 1, explanation: "Menimpa nama bawaan (`list`, `sum`, `max`, ...) adalah kesalahan umum yang menyebabkan error membingungkan di baris lain." },
  ],
  challenge: {
    id: "py-variables-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Metrik sederhana",
    prompt: [
      "Sebuah model memprediksi 120 email: 96 prediksi benar.",
      "Buat variabel `total`, `benar`, `salah` (dihitung dari total − benar), `akurasi` (benar / total), dan `error_rate` (salah / total).",
      "Cetak tiga baris persis:\n```\nBenar: 96\nSalah: 24\nAkurasi: 0.8 | Error rate: 0.2\n```",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `total = 120
benar = 96
salah = total - benar
akurasi = benar / total
error_rate = salah / total
print("Benar:", benar)
print("Salah:", salah)
print("Akurasi:", akurasi, "| Error rate:", error_rate)`,
    tests: [
      { desc: "salah dihitung = 24", expr: "salah == 24" },
      { desc: "akurasi = 0.8", expr: "akurasi == 0.8" },
      { desc: "error_rate = 0.2", expr: "error_rate == 0.2" },
      { desc: "Output sesuai format", expr: "_lines == ['Benar: 96', 'Salah: 24', 'Akurasi: 0.8 | Error rate: 0.2']" },
      { desc: "salah tidak ditulis langsung sebagai angka 24", expr: "'= 24' not in _code and '=24' not in _code" },
    ],
    hints: ["Konsep: variabel yang dihitung dari variabel lain.", "`salah = total - benar`", "Baris terakhir: `print(\"Akurasi:\", akurasi, \"| Error rate:\", error_rate)`"],
    explanation: "Menghitung variabel dari variabel lain membuat kode tetap benar meskipun angka awalnya diganti.",
  },
  summary: [
    "Variabel adalah nama yang menunjuk ke sebuah nilai; dibuat dengan `=`.",
    "`=` berarti \"simpan\", bukan \"sama dengan\"; sisi kanan dihitung terlebih dahulu.",
    "Nama variabel: huruf/angka/`_`, tidak diawali angka, case-sensitive, gunakan snake_case.",
    "Multiple assignment `a, b = 1, 2` dan pola tukar `a, b = b, a`.",
    "Konvensi Data Science: `df`, `X`, `y`, `y_pred`, `model`.",
  ],
  cheatsheet: [
    { syntax: "x = 10", desc: "Membuat variabel" },
    { syntax: "x = x + 1", desc: "Mengubah nilai berdasarkan nilai lama" },
    { syntax: "a, b = 1, 2", desc: "Multiple assignment" },
    { syntax: "a, b = b, a", desc: "Menukar nilai" },
    { syntax: "print(x)", desc: "Mencetak isi variabel (tanpa tanda kutip)" },
  ],
  flashcards: [
    { q: "Buat variabel test_size bernilai 0.2", a: "test_size = 0.2" },
    { q: "Tukar isi variabel a dan b dalam satu baris", a: "a, b = b, a" },
    { q: "Isi dua variabel sekaligus: train 0.8, test 0.2", a: "train, test = 0.8, 0.2" },
    { q: "Gaya penamaan variabel Python yang dianjurkan?", a: "snake_case, contoh: jumlah_data" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3.1.1 Numbers (assignment dengan =)", "tutorial/introduction.html#numbers"),
    pyDoc("The Python Tutorial — 3.2 First Steps Towards Programming (multiple assignment)", "tutorial/introduction.html#first-steps-towards-programming"),
    pyDoc("Lexical analysis — 2.3 Names (identifiers and keywords)", "reference/lexical_analysis.html#identifiers"),
    pep8("PEP 8 — Naming Conventions", "#naming-conventions"),
    kagglePy("Hello, Python — variable assignment", "hello-python"),
  ],
};
