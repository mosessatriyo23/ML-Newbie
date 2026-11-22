import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-operators",
  title: "Operators",
  minutes: 35,
  prerequisites: ["py-numbers", "py-boolean"],
  objectives: [
    "Mengelompokkan operator Python: aritmetika, perbandingan, logika, assignment, membership, dan identity.",
    "Memakai augmented assignment: `+=`, `-=`, `*=`, `/=`.",
    "Memakai membership operator `in` dan `not in`.",
    "Membedakan `is` (identitas objek) dan `==` (kesamaan nilai).",
    "Memahami urutan prioritas operator (operator precedence).",
  ],
  definition: [
    "**Operator** adalah simbol atau kata kunci yang melakukan operasi pada satu atau lebih nilai (disebut **operand**). Pada `3 + 4`, `+` adalah operator, sedangkan 3 dan 4 adalah operand.",
    "Kelompok operator yang perlu kamu kuasai:\n- **Aritmetika**: `+ - * / // % **` (lihat materi Numbers)\n- **Perbandingan**: `== != > < >= <=` (lihat materi Boolean)\n- **Logika**: `and or not`\n- **Assignment**: `=` dan versi singkatnya `+= -= *= /= //= %= **=`\n- **Membership**: `in`, `not in` — apakah sebuah nilai ada di dalam koleksi/teks\n- **Identity**: `is`, `is not` — apakah dua nama menunjuk **objek yang sama persis**",
    "Ketika satu baris berisi banyak operator, Python mengikuti **precedence** (prioritas): kurung → `**` → `* / // %` → `+ -` → perbandingan → `not` → `and` → `or`.",
  ],
  why: [
    "`+=` sangat sering dipakai untuk mengakumulasi, misalnya menjumlahkan total loss di setiap iterasi training.",
    "`in` dipakai untuk mengecek apakah sebuah kolom ada di dataset (`\"price\" in df.columns`) atau kategori valid.",
    "`is None` adalah cara benar mengecek nilai kosong.",
  ],
  when: [
    "- `+=` untuk penghitung (counter) dan akumulasi.",
    "- `in` / `not in` untuk validasi keanggotaan.",
    "- `is None` / `is not None` untuk memeriksa nilai yang belum diisi.",
  ],
  analogy: "Operator seperti **tombol pada kalkulator dan mesin penyortir**: ada tombol untuk menghitung (+, ×), tombol untuk membandingkan (lebih besar?), dan tombol pemeriksa (apakah barang ini ada di daftar? → `in`).",
  syntax: {
    code: `total += 5          # total = total + 5
"a" in "data"       # membership
x is None           # identity
not (a or b)        # logika`,
  },
  anatomy: [
    ["+=", "Tambahkan lalu simpan: `x += 1` sama dengan `x = x + 1`."],
    ["*=", "Kalikan lalu simpan: `x *= 2` sama dengan `x = x * 2`."],
    ["in", "True bila nilai kiri ada di dalam nilai kanan (string, list, set, keys dict)."],
    ["not in", "Kebalikan `in`."],
    ["is", "True bila kedua nama menunjuk **objek yang sama**. Gunakan untuk `None`, `True`, `False`."],
  ],
  examples: [
    {
      title: "Contoh 1 — Augmented assignment",
      code: `total_loss = 0
total_loss += 0.8
total_loss += 0.5
total_loss += 0.3
print(round(total_loss, 2))

langkah = 10
langkah -= 3
langkah *= 2
print(langkah)`,
      output: "1.6\n14",
      explain: [
        ["total_loss += 0.8", "Sama dengan `total_loss = total_loss + 0.8`."],
        ["round(total_loss, 2)", "Dibulatkan agar tidak tampil 1.6000000000000003 (efek presisi float)."],
        ["langkah -= 3", "10 − 3 = 7."],
        ["langkah *= 2", "7 × 2 = 14."],
      ],
    },
    {
      title: "Contoh 2 — Membership operator in",
      code: `print("Learn" in "Machine Learning")
print("learn" in "Machine Learning")
kolom = ["nama", "umur", "kota"]
print("umur" in kolom)
print("gaji" not in kolom)`,
      output: "True\nFalse\nTrue\nTrue",
      explain: [
        ["\"Learn\" in \"Machine Learning\"", "Mencari potongan teks di dalam string → True."],
        ["\"learn\" in \"Machine Learning\"", "Case-sensitive → False."],
        ["\"umur\" in kolom", "Mencari elemen di dalam list (materi List) → True."],
        ["\"gaji\" not in kolom", "\"gaji\" tidak ada → `not in` menghasilkan True."],
      ],
      change: "Operator baru `in` bekerja pada teks dan koleksi.",
    },
    {
      title: "Contoh 3 — Identity: is vs ==",
      code: `hasil = None
print(hasil is None)

a = [1, 2]
b = [1, 2]
c = a
print(a == b)
print(a is b)
print(a is c)`,
      output: "True\nTrue\nFalse\nTrue",
      explain: [
        ["hasil is None", "Cara yang dianjurkan untuk mengecek None."],
        ["a == b", "Isi kedua list sama → True."],
        ["a is b", "Tetapi a dan b adalah dua objek berbeda di memori → False."],
        ["a is c", "`c = a` membuat c menunjuk objek yang sama dengan a → True."],
      ],
      change: "`==` membandingkan **isi**, `is` membandingkan **identitas objek**.",
    },
    {
      title: "Contoh 4 — Operator precedence",
      code: `print(2 + 3 * 2 ** 2)
print(10 - 4 > 3 and not 5 == 6)
print(True or False and False)
print((True or False) and False)`,
      output: "14\nTrue\nTrue\nFalse",
      explain: [
        ["2 + 3 * 2 ** 2", "`**` dulu (2² = 4), lalu `*` (3 × 4 = 12), lalu `+` → 14."],
        ["10 - 4 > 3 and not 5 == 6", "Aritmetika → perbandingan → not → and: `6 > 3` True, `not False` True → True."],
        ["True or False and False", "`and` lebih kuat dari `or`: `True or (False and False)` → True."],
        ["(True or False) and False", "Kurung mengubah urutan → False."],
      ],
      change: "Kita melihat bagaimana Python memutuskan urutan ketika banyak operator digabung.",
    },
  ],
  params: [
    {
      title: "Tabel precedence (tinggi → rendah)",
      items: [
        { name: "( )", desc: "Tanda kurung" },
        { name: "**", desc: "Pangkat" },
        { name: "-x, +x", desc: "Tanda negatif/positif (unary)" },
        { name: "* / // %", desc: "Perkalian & pembagian" },
        { name: "+ -", desc: "Penjumlahan & pengurangan" },
        { name: "in, not in, is, is not, <, <=, >, >=, !=, ==", desc: "Perbandingan, membership, identity" },
        { name: "not", desc: "Negasi logika" },
        { name: "and", desc: "Logika DAN" },
        { name: "or", desc: "Logika ATAU" },
      ],
    },
  ],
  io: { title: "Input → Output", input: `skor = 70\nskor += 15\nprint(skor, skor in [85, 90])`, output: "85 True" },
  tryIt: `kategori_valid = ["Month-to-month", "One year", "Two year"]
kontrak = "One year"

print("Kontrak valid?", kontrak in kategori_valid)
jumlah_cek = 0
jumlah_cek += 1
print("Jumlah pengecekan:", jumlah_cek)`,
  mistakes: [
    {
      title: "Memakai ++ seperti bahasa lain",
      wrong: `i = 0
i++`,
      error: "SyntaxError",
      fix: `i = 0
i += 1
print(i)`,
      explain: "Python tidak punya operator `++`. Gunakan `+= 1`.",
    },
    {
      title: "Memakai is untuk membandingkan angka/string",
      wrong: `x = 1000
print(x is 1000)`,
      fix: `x = 1000
print(x == 1000)`,
      explain: "`is` memeriksa identitas objek, bukan nilai; hasilnya tidak bisa diandalkan untuk angka/string (Python bahkan memberi SyntaxWarning). Gunakan `==`.",
    },
    {
      title: "+= pada variabel yang belum dibuat",
      wrong: `total += 5`,
      error: "NameError",
      fix: `total = 0
total += 5
print(total)`,
      explain: "`total += 5` butuh nilai lama `total`. Inisialisasi dulu dengan 0.",
    },
  ],
  bestPractices: [
    "Gunakan `+=` untuk akumulasi — lebih ringkas dan jelas.",
    "Gunakan `is` hanya untuk `None`, `True`, dan `False`; gunakan `==` untuk nilai lain.",
    "Jangan menghafal seluruh tabel precedence — gunakan tanda kurung bila ragu.",
    "Gunakan `in` untuk validasi sebelum mengakses kolom/kunci agar terhindar dari KeyError.",
  ],
  exercises: [
    {
      id: "py-ops-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Counter",
      prompt: "Lengkapi operator agar `jumlah_epoch` bertambah 1, sehingga output-nya `3`.",
      starter: `jumlah_epoch = 2
jumlah_epoch ____ 1
print(jumlah_epoch)`,
      solution: `jumlah_epoch = 2
jumlah_epoch += 1
print(jumlah_epoch)`,
      tests: [
        { desc: "jumlah_epoch = 3", expr: "jumlah_epoch == 3" },
        { desc: "Memakai augmented assignment", expr: "'+=' in _code" },
      ],
      hints: ["Konsep: augmented assignment.", "Gabungan `+` dan `=`.", "`jumlah_epoch += 1`"],
      explanation: "`x += 1` = `x = x + 1`.",
    },
    {
      id: "py-ops-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `x = 5
x *= 3
x -= 5
print(x)
print("py" in "python", "Py" in "python")
print(not x > 5 or x == 10)`,
      answer: "10\nTrue False\nTrue",
      hints: ["Konsep: augmented assignment, in, precedence not/or.", "x: 5 → 15 → 10.", "`not x > 5` False, `x == 10` True → or → True."],
      explanation: "x = 10. 'py' ada di 'python' (True), 'Py' tidak (False). not (10 > 5) = False; False or True = True.",
    },
    {
      id: "py-ops-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Cek None",
      prompt: "Perbaiki dua kesalahan: inisialisasi skor dan cara mengecek None. Output harus `True` lalu `10`.",
      starter: `model = None
print(model = None)
skor += 10
print(skor)`,
      solution: `model = None
print(model is None)
skor = 0
skor += 10
print(skor)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output True lalu 10", expr: "_lines == ['True', '10']" },
        { desc: "Memakai 'is None'", expr: "'is None' in _code" },
      ],
      hints: ["Konsep: identity operator dan inisialisasi variabel.", "Gunakan `is None`; buat `skor = 0` sebelum `+=`.", "`print(model is None)` lalu `skor = 0`"],
      explanation: "`is None` adalah pengecekan None yang benar; `+=` memerlukan nilai awal.",
    },
    {
      id: "py-ops-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Validasi kolom",
      prompt: [
        "Diberikan `kolom = [\"age\", \"income\", \"spending_score\"]`.",
        "Buat `ada_age` (apakah \"age\" ada) dan `tanpa_target` (apakah \"churn\" TIDAK ada) memakai membership operator. Cetak keduanya: `True True`.",
      ],
      starter: `kolom = ["age", "income", "spending_score"]
# Tulis kodemu di sini
`,
      solution: `kolom = ["age", "income", "spending_score"]
ada_age = "age" in kolom
tanpa_target = "churn" not in kolom
print(ada_age, tanpa_target)`,
      tests: [
        { desc: "ada_age True", expr: "ada_age is True" },
        { desc: "tanpa_target True", expr: "tanpa_target is True" },
        { desc: "Memakai not in", expr: "'not in' in _code" },
        { desc: "Output 'True True'", expr: "_lines == ['True True']" },
      ],
      hints: ["Konsep: membership operator.", "`in` dan `not in`.", "`tanpa_target = \"churn\" not in kolom`"],
      explanation: "Dataset segmentasi tidak punya kolom target — ciri khas unsupervised learning.",
    },
    {
      id: "py-ops-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Akumulasi loss",
      prompt: [
        "Loss di 4 epoch: 0.9, 0.6, 0.4, 0.3. Mulai dari `total = 0`, tambahkan setiap loss dengan `+=` (4 baris), lalu hitung `rata_rata = total / 4`.",
        "Cetak `Rata-rata loss: 0.55` (bulatkan 2 desimal).",
      ],
      starter: `total = 0
# Tulis kodemu di sini
`,
      solution: `total = 0
total += 0.9
total += 0.6
total += 0.4
total += 0.3
rata_rata = total / 4
print("Rata-rata loss:", round(rata_rata, 2))`,
      tests: [
        { desc: "total ≈ 2.2", expr: "abs(total - 2.2) < 1e-9" },
        { desc: "rata_rata ≈ 0.55", expr: "abs(rata_rata - 0.55) < 1e-9" },
        { desc: "Memakai += minimal 4 kali", expr: "_code.count('+=') >= 4" },
        { desc: "Output sesuai", expr: "_lines == ['Rata-rata loss: 0.55']" },
      ],
      hints: ["Konsep: akumulasi dengan +=.", "Satu baris `total += ...` untuk setiap epoch.", "`rata_rata = total / 4` lalu `round(rata_rata, 2)`."],
      explanation: "Nanti dengan for loop, empat baris `+=` cukup ditulis sekali di dalam loop.",
    },
  ],
  quiz: [
    { id: "py-ops-q1", type: "predict", prompt: "Apa outputnya?", code: `n = 4\nn **= 2\nn //= 3\nprint(n)`, options: ["5", "5.33", "16", "6"], answer: 0, explanation: "4² = 16; 16 // 3 = 5." },
    { id: "py-ops-q2", type: "mcq", prompt: "Cara yang dianjurkan untuk mengecek apakah variabel bernilai None?", options: ["x == None", "x is None", "x = None", "None in x"], answer: 1, explanation: "`is None` (PEP 8)." },
    { id: "py-ops-q3", type: "tf", prompt: "Pada `True or False and False`, bagian `and` dihitung lebih dulu.", answer: true, explanation: "`and` memiliki precedence lebih tinggi dari `or`." },
    { id: "py-ops-q4", type: "fill", prompt: "Operator untuk mengecek apakah nilai TIDAK ada di dalam list adalah ____", answer: ["not in"], explanation: "`x not in daftar`." },
    { id: "py-ops-q5", type: "case", prompt: "Kode `count++` menghasilkan SyntaxError. Penggantinya yang benar?", options: ["count + 1", "count += 1", "++count", "count = +1"], answer: 1, explanation: "`count += 1`. Opsi `count = +1` justru mengisi count dengan 1." },
  ],
  challenge: {
    id: "py-ops-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Validasi input model",
    prompt: [
      "Model churn hanya menerima `kontrak` dalam `[\"Month-to-month\", \"One year\", \"Two year\"]` dan `tenure` yang bukan None serta ≥ 0.",
      "Diberikan `kontrak = \"One year\"` dan `tenure = 12`. Buat variabel `kontrak_ok`, `tenure_ok`, `valid` (keduanya ok), lalu hitung `jumlah_error` dimulai dari 0 dan tambahkan 1 dengan `+=` **untuk setiap** pengecekan yang gagal (gunakan perkalian boolean: `jumlah_error += not kontrak_ok`).",
      "Cetak: `Valid: True | Error: 0`",
    ],
    starter: `kontrak = "One year"
tenure = 12
# Tulis kodemu di sini
`,
    solution: `kontrak = "One year"
tenure = 12
kontrak_ok = kontrak in ["Month-to-month", "One year", "Two year"]
tenure_ok = tenure is not None and tenure >= 0
valid = kontrak_ok and tenure_ok
jumlah_error = 0
jumlah_error += not kontrak_ok
jumlah_error += not tenure_ok
print(f"Valid: {valid} | Error: {jumlah_error}")`,
    tests: [
      { desc: "kontrak_ok True", expr: "kontrak_ok is True" },
      { desc: "tenure_ok True", expr: "tenure_ok is True" },
      { desc: "valid True", expr: "valid is True" },
      { desc: "jumlah_error 0", expr: "jumlah_error == 0" },
      { desc: "Memakai is not None", expr: "'is not None' in _code" },
      { desc: "Output sesuai", expr: "_lines == ['Valid: True | Error: 0']" },
    ],
    hints: ["Konsep: in, is not None, and, dan += dengan boolean.", "`tenure_ok = tenure is not None and tenure >= 0`", "`jumlah_error += not kontrak_ok` menambah 1 jika kontrak tidak ok."],
    explanation: "Urutan `tenure is not None and tenure >= 0` penting: jika tenure None, bagian kedua tidak dievaluasi (short-circuit) sehingga tidak terjadi TypeError.",
  },
  summary: [
    "Kelompok operator: aritmetika, perbandingan, logika, assignment, membership, identity.",
    "`+=`, `-=`, `*=`, `/=` adalah bentuk singkat operasi lalu simpan.",
    "`in` / `not in` memeriksa keanggotaan pada teks dan koleksi.",
    "`is` memeriksa identitas objek — gunakan untuk `None`; gunakan `==` untuk nilai.",
    "Precedence: kurung → `**` → `* /` → `+ -` → perbandingan → `not` → `and` → `or`.",
  ],
  cheatsheet: [
    { syntax: "x += 1", desc: "Tambah 1" },
    { syntax: "total += loss", desc: "Akumulasi" },
    { syntax: '"umur" in kolom', desc: "Cek keanggotaan" },
    { syntax: "x not in daftar", desc: "Cek tidak ada" },
    { syntax: "x is None", desc: "Cek None" },
  ],
  flashcards: [
    { q: "Tambahkan 1 ke variabel i (Python tidak punya ++)", a: "i += 1" },
    { q: "Cek apakah kolom \"price\" ada di list kolom", a: '"price" in kolom' },
    { q: "Cek variabel model belum diisi (None)", a: "model is None" },
    { q: "Mana yang dihitung dulu: and atau or?", a: "and (precedence lebih tinggi dari or)" },
  ],
  references: [
    pyDoc("Expressions — 6.17 Operator precedence", "reference/expressions.html#operator-precedence"),
    pyDoc("Expressions — Membership test operations", "reference/expressions.html#membership-test-operations"),
    pyDoc("Expressions — Identity comparisons", "reference/expressions.html#is-not"),
    pyDoc("Simple statements — Augmented assignment statements", "reference/simple_stmts.html#augmented-assignment-statements"),
  ],
};
