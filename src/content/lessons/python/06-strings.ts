import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-strings",
  title: "Strings",
  minutes: 50,
  prerequisites: ["py-data-types", "py-numbers"],
  objectives: [
    "Membuat string dengan tanda kutip tunggal, ganda, dan tiga.",
    "Menyambung (`+`), mengulang (`*`), dan menghitung panjang string (`len()`).",
    "Mengambil karakter dengan indexing dan bagian string dengan slicing.",
    "Memakai method string penting: `lower()`, `upper()`, `strip()`, `replace()`, `split()`, `startswith()`.",
    "Memformat output dengan f-string, termasuk format angka `{x:.2f}`.",
  ],
  definition: [
    "**String** (`str`) adalah urutan karakter (huruf, angka, spasi, simbol) yang diapit tanda kutip. `\"Data Science\"` adalah string berisi 12 karakter.",
    "Setiap karakter punya **index** (posisi) yang dimulai dari **0**. Index negatif dihitung dari belakang: `-1` adalah karakter terakhir.",
    "String punya banyak **method** — fungsi yang \"menempel\" pada sebuah objek dan dipanggil dengan titik: `teks.lower()`. Method string **tidak mengubah** string aslinya (string bersifat *immutable*), melainkan menghasilkan string baru.",
    "**f-string** (formatted string literal) ditulis dengan huruf `f` sebelum tanda kutip: `f\"Akurasi: {akurasi}\"`. Bagian di dalam `{ }` diganti dengan nilai variabel/ekspresi.",
  ],
  why: [
    "Data kategorikal (kota, gender, label kelas) adalah string. Data nyata sering kotor: `\" Jakarta\"`, `\"JAKARTA\"`, `\"jakarta \"` — tiga penulisan untuk satu kota. Method `strip()` dan `lower()` adalah alat cleaning paling dasar.",
    "f-string adalah cara paling rapi menampilkan hasil eksperimen, misalnya `f\"Akurasi: {acc:.2%}\"`.",
  ],
  when: [
    "- Membersihkan teks: spasi berlebih, huruf besar/kecil tidak konsisten, karakter tidak diinginkan.",
    "- Memecah teks menjadi bagian (`split`) — misalnya satu baris CSV.",
    "- Menampilkan laporan hasil model dengan f-string.",
  ],
  analogy: "String seperti **kalung manik-manik huruf**. Setiap manik punya nomor urut mulai dari 0. Kamu bisa melihat manik tertentu (indexing), memotong sebagian kalung (slicing), atau membuat kalung baru yang semua hurufnya kecil — kalung lama tetap utuh.",
  syntax: {
    code: `teks = "Machine Learning"
teks[0]          # karakter pertama
teks[0:7]        # slicing: index 0 sampai 6
len(teks)        # panjang
teks.lower()     # method
f"Nilai: {x:.2f}"  # f-string`,
  },
  anatomy: [
    ["teks[i]", "Indexing: karakter pada posisi i. Mulai dari 0."],
    ["teks[a:b]", "Slicing: dari index a sampai **sebelum** b."],
    ["len(teks)", "Jumlah karakter (termasuk spasi)."],
    [".method()", "Memanggil method milik string, misalnya `.upper()`."],
    ["f\"...{x}...\"", "f-string: nilai x disisipkan ke dalam teks."],
    ["{x:.2f}", "Format spec: tampilkan x sebagai float dengan 2 angka desimal."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat dan menyambung string",
      code: `depan = "Machine"
belakang = "Learning"
gabung = depan + " " + belakang
print(gabung)
print(len(gabung))
print("-" * 16)`,
      output: "Machine Learning\n16\n----------------",
      explain: [
        ["depan + \" \" + belakang", "`+` menyambung tiga string: \"Machine\", spasi, dan \"Learning\"."],
        ["len(gabung)", "Panjang \"Machine Learning\" adalah 16 (7 + 1 spasi + 8)."],
        ["\"-\" * 16", "`*` mengulang string 16 kali — cara cepat membuat garis."],
      ],
    },
    {
      title: "Contoh 2 — Indexing dan slicing",
      code: `kode = "IRIS-SETOSA"
print(kode[0])
print(kode[-1])
print(kode[0:4])
print(kode[5:])
print(kode[:4].lower())`,
      output: "I\nA\nIRIS\nSETOSA\niris",
      explain: [
        ["kode[0]", "Karakter pertama (index 0): `I`."],
        ["kode[-1]", "Karakter terakhir: `A`."],
        ["kode[0:4]", "Index 0, 1, 2, 3 → `IRIS`. Index 4 (tanda `-`) tidak ikut."],
        ["kode[5:]", "Dari index 5 sampai akhir → `SETOSA`."],
        ["kode[:4].lower()", "Slicing dulu (`IRIS`), lalu hasilnya diubah ke huruf kecil. Method bisa dirangkai (*chaining*)."],
      ],
      change: "Kita mengambil sebagian string. Aturan `[start:stop]` yang sama akan dipakai pada list, NumPy array, dan Pandas `iloc`.",
    },
    {
      title: "Contoh 3 — Method untuk membersihkan teks",
      code: `kota = "  JaKarta  "
bersih = kota.strip().lower()
print(bersih)
print(bersih.title())
print("Rp 20.000".replace("Rp ", "").replace(".", ""))
print(kota)`,
      output: "jakarta\nJakarta\n20000\n  JaKarta  ",
      explain: [
        ["kota.strip()", "Menghapus spasi di awal dan akhir string."],
        [".lower()", "Mengubah ke huruf kecil semua. Dirangkai setelah strip()."],
        ["bersih.title()", "Huruf pertama setiap kata menjadi kapital."],
        [".replace(\"Rp \", \"\")", "Mengganti `\"Rp \"` dengan string kosong (menghapusnya). Lalu `replace(\".\", \"\")` menghapus titik ribuan."],
        ["print(kota)", "String asli **tidak berubah** — method menghasilkan string baru."],
      ],
      change: "Sekarang kita memakai method untuk data cleaning, bukan hanya mengambil bagian string.",
    },
    {
      title: "Contoh 4 — split() dan startswith()",
      code: `baris = "Andi,21,Jakarta,85"
kolom = baris.split(",")
print(kolom)
print(kolom[2])
print(int(kolom[3]) + 5)

file = "data_train.csv"
print(file.startswith("data_"), file.endswith(".csv"))`,
      output: "['Andi', '21', 'Jakarta', '85']\nJakarta\n90\nTrue True",
      explain: [
        ["baris.split(\",\")", "Memecah string di setiap koma → menghasilkan **list** berisi 4 string."],
        ["kolom[2]", "Elemen ke-3 dari list: `Jakarta`."],
        ["int(kolom[3]) + 5", "Hasil split selalu string, jadi `\"85\"` diubah ke int dulu."],
        ["file.startswith(\"data_\")", "`True` jika string diawali teks tersebut."],
      ],
      change: "`split()` mengubah satu string menjadi banyak bagian — inilah cara kerja sederhana di balik pembacaan file CSV.",
    },
    {
      title: "Contoh 5 — f-string dan format angka",
      code: `model = "Random Forest"
akurasi = 0.91847
n_test = 81

print(f"Model: {model}")
print(f"Akurasi: {akurasi:.2f}")
print(f"Akurasi: {akurasi:.1%}")
print(f"Data test: {n_test} baris, {n_test * 0.5} menit")
print(f"{'Model':<15}|{'Skor':>6}")`,
      output: "Model: Random Forest\nAkurasi: 0.92\nAkurasi: 91.8%\nData test: 81 baris, 40.5 menit\nModel          |  Skor",
      explain: [
        ["f\"Model: {model}\"", "`{model}` diganti isi variabel model."],
        ["{akurasi:.2f}", "`.2f` = float 2 angka desimal → 0.92."],
        ["{akurasi:.1%}", "`.1%` = dikali 100, tambah tanda %, 1 desimal → 91.8%."],
        ["{n_test * 0.5}", "Di dalam `{ }` boleh ada ekspresi/perhitungan."],
        ["{'Model':<15}", "`<15` rata kiri dengan lebar 15 karakter; `>6` rata kanan lebar 6. Berguna membuat tabel."],
      ],
      change: "f-string menggantikan penyambungan `+` dan `str()` yang panjang. Ini cara yang direkomendasikan di Python modern.",
    },
  ],
  params: [
    {
      title: "Method string yang paling sering dipakai",
      items: [
        { name: ".lower() / .upper()", type: "method", desc: "Huruf kecil / besar semua." },
        { name: ".strip(chars=None)", type: "method", desc: "Hapus spasi (atau karakter `chars`) di awal & akhir. Ada juga `.lstrip()` dan `.rstrip()`." },
        { name: ".replace(old, new)", type: "method", desc: "Ganti semua `old` dengan `new`." },
        { name: ".split(sep=None)", type: "method", desc: "Pecah menjadi list. Tanpa argumen: dipecah di spasi/whitespace." },
        { name: ".startswith(x) / .endswith(x)", type: "method", desc: "Cek awalan/akhiran, hasil True/False." },
        { name: ".count(x)", type: "method", desc: "Hitung berapa kali x muncul." },
        { name: "\"sep\".join(list)", type: "method", desc: "Kebalikan split: gabungkan list string dengan pemisah." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `nama = " budi santoso "\nprint(nama.strip().title())`, output: "Budi Santoso" },
  tryIt: `label = "  Iris-Versicolor "
# Bersihkan label: hapus spasi, huruf kecil, ambil nama setelah tanda "-"
bersih = label.strip().lower()
print(bersih)
print(bersih.split("-")[1])
print(f"Panjang label bersih: {len(bersih)} karakter")`,
  mistakes: [
    {
      title: "Index di luar jangkauan",
      wrong: `kata = "data"
print(kata[4])`,
      error: "IndexError",
      fix: `kata = "data"
print(kata[3])`,
      explain: "\"data\" punya 4 karakter dengan index 0–3. Index terakhir = `len(kata) - 1` atau `-1`.",
    },
    {
      title: "Mencoba mengubah karakter string secara langsung",
      wrong: `kata = "data"
kata[0] = "D"`,
      error: "TypeError",
      fix: `kata = "data"
kata = "D" + kata[1:]
print(kata)`,
      explain: "String immutable (tidak bisa diubah sebagian). Buat string baru lalu simpan ke variabel.",
    },
    {
      title: "Lupa menyimpan hasil method",
      wrong: `kota = "  Bandung "
kota.strip()
print(f"[{kota}]")`,
      fix: `kota = "  Bandung "
kota = kota.strip()
print(f"[{kota}]")`,
      explain: "`strip()` menghasilkan string baru. Tanpa disimpan ke variabel, hasilnya hilang dan `kota` tetap berspasi.",
    },
    {
      title: "Lupa huruf f pada f-string",
      wrong: `skor = 90
print("Skor: {skor}")`,
      fix: `skor = 90
print(f"Skor: {skor}")`,
      explain: "Tanpa `f`, Python mencetak teks `{skor}` apa adanya, bukan nilai variabelnya.",
    },
  ],
  bestPractices: [
    "Gunakan f-string untuk menampilkan hasil; format angka dengan `:.2f` atau `:.1%`.",
    "Saat membersihkan kategori, standarkan dengan `.strip().lower()` sebelum membandingkan.",
    "Ingat hasil `split()` berupa string — konversi ke angka bila perlu.",
    "Pilih satu gaya tanda kutip (ganda atau tunggal) secara konsisten dalam satu proyek.",
  ],
  exercises: [
    {
      id: "py-strings-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Bersihkan label",
      prompt: "Lengkapi method agar `bersih` berisi `\"churn\"` (tanpa spasi, huruf kecil).",
      starter: `label = "  CHURN "
bersih = label.____().____()
print(bersih)`,
      solution: `label = "  CHURN "
bersih = label.strip().lower()
print(bersih)`,
      alternatives: [`label = "  CHURN "
bersih = label.lower().strip()
print(bersih)`],
      tests: [
        { desc: "bersih == 'churn'", expr: "bersih == 'churn'" },
        { desc: "Output 'churn'", expr: "_lines == ['churn']" },
      ],
      hints: ["Konsep: method chaining untuk cleaning.", "Satu method menghapus spasi, satu lagi mengecilkan huruf.", "`label.strip().lower()`"],
      explanation: "Urutan strip/lower boleh dibalik; hasilnya sama. Itulah sebabnya kedua solusi diterima.",
    },
    {
      id: "py-strings-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `s = "Python"
print(s[1:4])
print(s[-2:])
print(len(s) * 2)
print(s.upper().count("O"))`,
      answer: "yth\non\n12\n1",
      hints: ["Konsep: slicing [a:b] tidak termasuk b.", "`s[-2:]` = dua karakter terakhir.", "\"PYTHON\" memiliki satu huruf O."],
      explanation: "s[1:4] = index 1,2,3 = 'yth'. s[-2:] = 'on'. len = 6, ×2 = 12. 'PYTHON'.count('O') = 1.",
    },
    {
      id: "py-strings-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — f-string",
      prompt: "Perbaiki kode agar output-nya `Akurasi model: 0.88` (2 desimal).",
      starter: `akurasi = 0.8765
print("Akurasi model: {akurasi:.2f}")`,
      solution: `akurasi = 0.8765
print(f"Akurasi model: {akurasi:.2f}")`,
      tests: [{ desc: "Output 'Akurasi model: 0.88'", expr: "_lines == ['Akurasi model: 0.88']" }],
      hints: ["Konsep: f-string.", "Ada satu huruf yang hilang sebelum tanda kutip.", "`print(f\"...\")`"],
      explanation: "Tanpa awalan `f`, teks dalam kurung kurawal tidak diproses.",
    },
    {
      id: "py-strings-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Pecah baris CSV",
      prompt: [
        "Diberikan `baris = \"Dewi;23;Jakarta;88\"` (dipisah titik koma).",
        "Pecah menjadi bagian, simpan nama ke `nama`, umur sebagai int ke `umur`, dan nilai sebagai int ke `nilai`.",
        "Cetak dengan f-string: `Dewi (23 th) nilai 88`",
      ],
      starter: `baris = "Dewi;23;Jakarta;88"
# Tulis kodemu di sini
`,
      solution: `baris = "Dewi;23;Jakarta;88"
bagian = baris.split(";")
nama = bagian[0]
umur = int(bagian[1])
nilai = int(bagian[3])
print(f"{nama} ({umur} th) nilai {nilai}")`,
      tests: [
        { desc: "nama == 'Dewi'", expr: "nama == 'Dewi'" },
        { desc: "umur int 23", expr: "umur == 23 and type(umur) is int" },
        { desc: "nilai int 88", expr: "nilai == 88 and type(nilai) is int" },
        { desc: "Output sesuai", expr: "_lines == ['Dewi (23 th) nilai 88']" },
      ],
      hints: ["Konsep: split dengan pemisah tertentu + konversi tipe.", "`baris.split(\";\")` menghasilkan list 4 elemen.", "`f\"{nama} ({umur} th) nilai {nilai}\"`"],
      explanation: "Inilah yang dilakukan `pd.read_csv(..., sep=\";\")` untuk setiap baris file, secara otomatis.",
    },
    {
      id: "py-strings-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Standarkan nama kota",
      prompt: [
        "Tiga entri kota ditulis berbeda: `k1 = \" JAKARTA\"`, `k2 = \"jakarta \"`, `k3 = \"Jakarta\"`.",
        "Buat `s1`, `s2`, `s3` versi bersih dalam format Title Case (`Jakarta`), lalu buat `sama` = apakah ketiganya identik (gunakan `==` dan `and`).",
        "Cetak: `Jakarta Jakarta Jakarta True`",
      ],
      starter: `k1 = " JAKARTA"
k2 = "jakarta "
k3 = "Jakarta"
# Tulis kodemu di sini
`,
      solution: `k1 = " JAKARTA"
k2 = "jakarta "
k3 = "Jakarta"
s1 = k1.strip().title()
s2 = k2.strip().title()
s3 = k3.strip().title()
sama = s1 == s2 and s2 == s3
print(s1, s2, s3, sama)`,
      tests: [
        { desc: "s1, s2, s3 semuanya 'Jakarta'", expr: "s1 == s2 == s3 == 'Jakarta'" },
        { desc: "sama bernilai True", expr: "sama is True" },
        { desc: "Output benar", expr: "_lines == ['Jakarta Jakarta Jakarta True']" },
      ],
      hints: ["Konsep: data inconsistent → standarisasi teks.", "Gunakan `.strip()` lalu `.title()` pada tiap variabel.", "`sama = s1 == s2 and s2 == s3`"],
      explanation: "Tanpa standarisasi, model akan menganggap \" JAKARTA\" dan \"jakarta \" sebagai dua kategori berbeda.",
    },
  ],
  quiz: [
    { id: "py-strings-q1", type: "predict", prompt: "Apa outputnya?", code: `t = "dataset"\nprint(t[2:5])`, options: ["tas", "ata", "tase", "atas"], answer: 0, explanation: "Index 2, 3, 4 → 't', 'a', 's'." },
    { id: "py-strings-q2", type: "mcq", prompt: "Method untuk menghapus spasi di awal dan akhir string adalah…", options: [".trim()", ".strip()", ".clean()", ".remove()"], answer: 1, explanation: "Python memakai `.strip()`. `.trim()` adalah nama di bahasa lain." },
    { id: "py-strings-q3", type: "tf", prompt: "`kata.upper()` mengubah isi variabel `kata` secara permanen.", answer: false, explanation: "String immutable; method mengembalikan string baru. Simpan dengan `kata = kata.upper()`." },
    { id: "py-strings-q4", type: "fill", prompt: "Lengkapi format agar 0.8567 tampil sebagai 0.86: `f\"{x:____}\"`", answer: [".2f"], explanation: "`.2f` = float dengan 2 desimal." },
    { id: "py-strings-q5", type: "predict", prompt: "Apa outputnya?", code: `print("a,b,,c".split(","))`, options: ["['a', 'b', 'c']", "['a', 'b', '', 'c']", "['a,b,,c']", "['a', 'b', None, 'c']"], answer: 1, explanation: "Dua koma berurutan menghasilkan string kosong di antaranya — mirip sel kosong (missing value) di CSV." },
  ],
  challenge: {
    id: "py-strings-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Laporan klasifikasi rapi",
    prompt: [
      "Diberikan `nama_model = \"  logistic regression \"`, `acc = 0.93456`, `n = 114`.",
      "Bersihkan nama model menjadi Title Case, lalu cetak tabel 3 baris persis seperti ini (lebar kolom kiri 10, rata kiri):",
      "```\nModel     : Logistic Regression\nAccuracy  : 93.46%\nTest size : 114\n```",
      "Petunjuk: `{'Model':<10}` dan format persen `.2%`.",
    ],
    starter: `nama_model = "  logistic regression "
acc = 0.93456
n = 114
# Tulis kodemu di sini
`,
    solution: `nama_model = "  logistic regression "
acc = 0.93456
n = 114
nama = nama_model.strip().title()
print(f"{'Model':<10}: {nama}")
print(f"{'Accuracy':<10}: {acc:.2%}")
print(f"{'Test size':<10}: {n}")`,
    tests: [
      { desc: "Baris 1", expr: "len(_lines) == 3 and _lines[0] == 'Model     : Logistic Regression'" },
      { desc: "Baris 2", expr: "len(_lines) == 3 and _lines[1] == 'Accuracy  : 93.46%'" },
      { desc: "Baris 3", expr: "len(_lines) == 3 and _lines[2] == 'Test size : 114'" },
      { desc: "Memakai f-string", expr: "'f\"' in _code or \"f'\" in _code" },
    ],
    hints: ["Konsep: strip/title + f-string dengan alignment dan format persen.", "`{'Model':<10}` membuat teks 'Model' selebar 10 karakter.", "`f\"{'Accuracy':<10}: {acc:.2%}\"`"],
    explanation: "Format spec di f-string membuat laporan sejajar tanpa menghitung spasi manual.",
  },
  summary: [
    "String = urutan karakter dalam tanda kutip; index mulai 0, index negatif dari belakang.",
    "Slicing `s[a:b]` mengambil index a sampai sebelum b.",
    "Method penting: `strip`, `lower`, `upper`, `title`, `replace`, `split`, `startswith`, `count`, `join`.",
    "String immutable — simpan hasil method ke variabel.",
    "f-string: `f\"{x}\"`, `{x:.2f}`, `{x:.1%}`, `{teks:<10}`.",
  ],
  cheatsheet: [
    { syntax: "s[0], s[-1]", desc: "Karakter pertama / terakhir" },
    { syntax: "s[a:b]", desc: "Slicing" },
    { syntax: "s.strip().lower()", desc: "Bersihkan teks" },
    { syntax: 's.split(",")', desc: "Pecah jadi list" },
    { syntax: 's.replace("a", "b")', desc: "Ganti teks" },
    { syntax: 'f"{x:.2f}"', desc: "Format 2 desimal" },
    { syntax: 'f"{x:.1%}"', desc: "Format persen" },
  ],
  flashcards: [
    { q: "Hapus spasi di awal & akhir string s", a: "s.strip()" },
    { q: "Pecah \"a;b;c\" menjadi list berdasarkan titik koma", a: '"a;b;c".split(";")' },
    { q: "Tampilkan acc = 0.9123 sebagai 91.23% dengan f-string", a: 'f"{acc:.2%}"' },
    { q: "Ambil 3 karakter pertama string s", a: "s[:3]" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3.1.2 Text (strings)", "tutorial/introduction.html#text"),
    pyDoc("Built-in Types — String Methods", "library/stdtypes.html#string-methods"),
    pyDoc("The Python Tutorial — 7.1.1 Formatted String Literals", "tutorial/inputoutput.html#formatted-string-literals"),
    pyDoc("string — Format Specification Mini-Language", "library/string.html#format-specification-mini-language"),
    kagglePy("Strings and Dictionaries (Kaggle Learn Python)", "strings-and-dictionaries"),
  ],
};
