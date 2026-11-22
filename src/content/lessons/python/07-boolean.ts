import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-boolean",
  title: "Boolean",
  minutes: 35,
  prerequisites: ["py-numbers", "py-strings"],
  visual: "truth-table",
  objectives: [
    "Memahami tipe `bool` dengan dua nilai: `True` dan `False`.",
    "Menghasilkan boolean dari operator perbandingan: `==`, `!=`, `>`, `<`, `>=`, `<=`.",
    "Menggabungkan kondisi dengan `and`, `or`, dan `not`.",
    "Memahami truthiness: nilai apa yang dianggap True/False oleh `bool()`.",
    "Menghitung jumlah True karena `True` bernilai 1 dan `False` bernilai 0.",
  ],
  definition: [
    "**Boolean** (`bool`) adalah tipe data dengan hanya dua nilai: `True` (benar) dan `False` (salah). Namanya berasal dari matematikawan George Boole.",
    "Boolean biasanya dihasilkan dari **perbandingan**. `5 > 3` menghasilkan `True`; `\"a\" == \"b\"` menghasilkan `False`. Perhatikan: `=` untuk menyimpan, `==` untuk membandingkan.",
    "Beberapa kondisi digabung dengan operator logika: `and` (keduanya harus True), `or` (minimal satu True), `not` (membalik nilai). Coba visualisasi di bawah.",
    "Di Python, `bool` adalah turunan dari `int`: `True` bernilai 1 dan `False` bernilai 0. Karena itu `True + True` = 2 — sifat ini dipakai untuk **menghitung** berapa banyak kondisi yang benar.",
  ],
  why: [
    "Boolean adalah dasar pengambilan keputusan (`if`) dan **filtering data**. Di Pandas, `df[df[\"umur\"] > 30]` bekerja dengan membuat boolean `True/False` untuk setiap baris.",
    "Di klasifikasi biner, label sering berupa True/False atau 1/0 (churn atau tidak, spam atau tidak). Akurasi bisa dihitung dengan menjumlahkan prediksi yang benar (True = 1).",
  ],
  when: [
    "- Memeriksa syarat: apakah nilai di atas threshold, apakah data kosong.",
    "- Menggabungkan beberapa syarat filter dengan `and` / `or`.",
    "- Menghitung jumlah data yang memenuhi kondisi.",
  ],
  analogy: "Boolean seperti **saklar lampu**: hanya ON (True) atau OFF (False). `and` seperti dua saklar yang dipasang seri — lampu menyala hanya jika keduanya ON. `or` seperti dua saklar paralel — cukup satu ON.",
  syntax: {
    code: `a == b   a != b   a > b   a < b   a >= b   a <= b
kondisi1 and kondisi2
kondisi1 or kondisi2
not kondisi
bool(nilai)`,
  },
  anatomy: [
    ["==", "Sama dengan (membandingkan). Jangan tertukar dengan `=`."],
    ["!=", "Tidak sama dengan."],
    [">=, <=", "Lebih besar/kecil atau sama dengan."],
    ["and", "True jika kedua sisi True."],
    ["or", "True jika minimal satu sisi True."],
    ["not", "Membalik: `not True` → False."],
    ["0 < x < 10", "Perbandingan berantai (chained comparison): sama dengan `0 < x and x < 10`."],
  ],
  examples: [
    {
      title: "Contoh 1 — Perbandingan menghasilkan boolean",
      code: `akurasi = 0.87
print(akurasi > 0.8)
print(akurasi == 0.9)
print(akurasi != 0.9)
print(type(akurasi > 0.8))`,
      output: "True\nFalse\nTrue\n<class 'bool'>",
      explain: [
        ["akurasi > 0.8", "0.87 lebih besar dari 0.8 → True."],
        ["akurasi == 0.9", "`==` membandingkan, hasilnya False."],
        ["akurasi != 0.9", "Tidak sama → True."],
        ["type(akurasi > 0.8)", "Hasil perbandingan bertipe `bool`."],
      ],
    },
    {
      title: "Contoh 2 — Menggabungkan kondisi dengan and, or, not",
      code: `umur = 25
gaji = 8_000_000

print(umur >= 21 and gaji > 5_000_000)
print(umur < 18 or gaji > 10_000_000)
print(not umur < 18)
print(18 <= umur <= 30)`,
      output: "True\nFalse\nTrue\nTrue",
      explain: [
        ["umur >= 21 and gaji > 5_000_000", "Keduanya benar → True."],
        ["umur < 18 or gaji > 10_000_000", "Keduanya salah → False."],
        ["not umur < 18", "`umur < 18` False, dibalik menjadi True."],
        ["18 <= umur <= 30", "Chained comparison: apakah umur di antara 18 dan 30."],
      ],
      change: "Sekarang beberapa kondisi digabung — persis seperti filter data dengan banyak syarat.",
    },
    {
      title: "Contoh 3 — Perbandingan string",
      code: `kota = "Jakarta"
print(kota == "jakarta")
print(kota.lower() == "jakarta")
print("Jak" in kota)`,
      output: "False\nTrue\nTrue",
      explain: [
        ["kota == \"jakarta\"", "Perbandingan string case-sensitive: J ≠ j → False."],
        ["kota.lower() == \"jakarta\"", "Samakan huruf dulu, baru bandingkan → True."],
        ["\"Jak\" in kota", "Operator `in` memeriksa apakah teks ada di dalam string (dibahas lagi di Operators)."],
      ],
      change: "Boolean juga berlaku untuk teks, bukan hanya angka.",
    },
    {
      title: "Contoh 4 — Truthiness dengan bool()",
      code: `print(bool(0), bool(0.0), bool(""), bool(None))
print(bool(1), bool(-2.5), bool("0"), bool(" "))
print(bool([]), bool([0]))`,
      output: "False False False False\nTrue True True True\nFalse True",
      explain: [
        ["bool(0), bool(0.0), bool(\"\"), bool(None)", "Nilai \"kosong\" dianggap False (*falsy*)."],
        ["bool(\"0\")", "String `\"0\"` tidak kosong → True! Jebakan umum saat membaca data dari file."],
        ["bool([]), bool([0])", "List kosong False; list berisi satu elemen (meskipun 0) True."],
      ],
      change: "Kita melihat bahwa bukan hanya True/False — semua nilai punya \"nilai kebenaran\" (truthiness).",
    },
    {
      title: "Contoh 5 — Menghitung True sebagai angka",
      code: `pred1 = 1 == 1   # prediksi benar
pred2 = 0 == 1   # prediksi salah
pred3 = 1 == 1   # prediksi benar

jumlah_benar = pred1 + pred2 + pred3
print("Jumlah benar:", jumlah_benar)
print("Akurasi:", jumlah_benar / 3)
print(True + True, int(False))`,
      output: "Jumlah benar: 2\nAkurasi: 0.6666666666666666\n2 0",
      explain: [
        ["pred1 = 1 == 1", "Hasil perbandingan disimpan ke variabel: True."],
        ["pred1 + pred2 + pred3", "True + False + True = 1 + 0 + 1 = 2."],
        ["jumlah_benar / 3", "Akurasi = benar / total."],
        ["True + True, int(False)", "Bukti bahwa True = 1 dan False = 0."],
      ],
      change: "Contoh ini memperlihatkan cara menghitung akurasi dari boolean — konsep yang sama dipakai `(y_pred == y_test).mean()` di NumPy/Pandas.",
    },
  ],
  io: { title: "Input → Output", input: `x = 7\nprint(x > 5 and x % 2 == 0)`, output: "False", note: "7 > 5 True, tetapi 7 % 2 == 0 False (ganjil). `and` → False." },
  tryIt: `probabilitas = 0.72
threshold = 0.5

prediksi_churn = probabilitas >= threshold
print("Prediksi churn?", prediksi_churn)
print("Yakin sekali?", probabilitas > 0.9)`,
  mistakes: [
    {
      title: "Memakai = untuk membandingkan",
      wrong: `x = 5
print(x = 5)`,
      error: "TypeError",
      fix: `x = 5
print(x == 5)`,
      explain: "`=` adalah assignment. Di dalam `print()`, `x = 5` dibaca sebagai keyword argument bernama x yang tidak dikenal → TypeError.",
    },
    {
      title: "Menulis true/false huruf kecil",
      wrong: `lulus = false`,
      error: "NameError",
      fix: `lulus = False`,
      explain: "Boolean ditulis `True` dan `False` dengan huruf kapital di awal.",
    },
    {
      title: "Mengira bool(\"False\") bernilai False",
      wrong: `status = "False"   # dibaca dari file teks
print(bool(status))`,
      fix: `status = "False"
print(status == "True")`,
      explain: "String apa pun yang tidak kosong adalah True. Bandingkan teksnya secara eksplisit.",
    },
  ],
  bestPractices: [
    "Gunakan tanda kurung untuk kondisi kompleks agar maksudnya jelas: `(a > 1) and (b < 5)`.",
    "Untuk mengecek None gunakan `x is None`, bukan `x == None`.",
    "Manfaatkan True = 1 untuk menghitung jumlah kondisi yang terpenuhi.",
    "Hati-hati dengan data teks `\"0\"`/`\"False\"`: ubah ke tipe yang benar sebelum memakai `bool()`.",
  ],
  exercises: [
    {
      id: "py-bool-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Threshold",
      prompt: "Lengkapi operator agar `positif` bernilai True jika `prob` **lebih besar atau sama dengan** 0.5.",
      starter: `prob = 0.5
positif = prob ____ 0.5
print(positif)`,
      solution: `prob = 0.5
positif = prob >= 0.5
print(positif)`,
      tests: [
        { desc: "positif True", expr: "positif is True" },
        { desc: "Memakai >=", expr: "'>=' in _code" },
      ],
      hints: ["Konsep: operator perbandingan.", "Butuh \"lebih besar ATAU sama dengan\".", "`prob >= 0.5`"],
      explanation: "Dengan `>`, prob = 0.5 akan menjadi False. Threshold klasifikasi biasanya memakai `>=`.",
    },
    {
      id: "py-bool-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `a = 10
b = 3
print(a > 5 and b > 5)
print(a > 5 or b > 5)
print(not (a == 10))
print((a > b) + (b > 0))`,
      answer: "False\nTrue\nFalse\n2",
      hints: ["Konsep: and/or/not dan True = 1.", "b > 5 bernilai False.", "Baris terakhir: True + True."],
      explanation: "and → False (b>5 salah). or → True. not True → False. True + True = 2.",
    },
    {
      id: "py-bool-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kondisi rentang",
      prompt: "Kode ini harus mencetak `True` karena umur 25 berada di rentang 18–30, tetapi error. Perbaiki.",
      starter: `umur = 25
dalam_rentang = umur >= 18 & umur <= 30
print(dalam_rentang)
valid = True
print(valid = True)`,
      solution: `umur = 25
dalam_rentang = umur >= 18 and umur <= 30
print(dalam_rentang)
valid = True
print(valid == True)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "dalam_rentang True", expr: "dalam_rentang is True" },
        { desc: "Memakai and (bukan &) untuk boolean Python", expr: "'&' not in _code and ' and ' in _code" },
        { desc: "Output dua baris True", expr: "_lines == ['True', 'True']" },
      ],
      hints: ["Konsep: operator logika Python dan perbandingan ==.", "`&` adalah operator bit; untuk boolean Python biasa gunakan `and`. Baris terakhir butuh `==`.", "`umur >= 18 and umur <= 30` dan `print(valid == True)`"],
      explanation: "`&` adalah operator bit dengan prioritas lebih tinggi dari `>=`, sehingga ekspresi dihitung sebagai `umur >= (18 & umur) <= 30` — hasilnya kebetulan True untuk umur 25, tetapi salah untuk nilai lain (misalnya umur 40 juga menghasilkan True). (Catatan: di Pandas nanti `&` justru dipakai, dengan setiap kondisi wajib dalam kurung.)",
    },
    {
      id: "py-bool-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Syarat beasiswa",
      prompt: [
        "Syarat beasiswa: IPK minimal 3.5 **dan** (penghasilan orang tua di bawah 5 juta **atau** prestasi lomba True).",
        "Diberikan `ipk = 3.6`, `penghasilan = 7_000_000`, `prestasi = True`. Simpan hasil ke `layak` lalu cetak.",
      ],
      starter: `ipk = 3.6
penghasilan = 7_000_000
prestasi = True
# Tulis kodemu di sini
`,
      solution: `ipk = 3.6
penghasilan = 7_000_000
prestasi = True
layak = ipk >= 3.5 and (penghasilan < 5_000_000 or prestasi)
print(layak)`,
      tests: [
        { desc: "layak True untuk data ini", expr: "layak is True" },
        { desc: "Output True", expr: "_lines == ['True']" },
        { desc: "Memakai and dan or", expr: "' and ' in _code and ' or ' in _code" },
      ],
      hints: ["Konsep: kombinasi and/or dengan tanda kurung.", "Bagian 'atau' harus dikurung.", "`ipk >= 3.5 and (penghasilan < 5_000_000 or prestasi)`"],
      explanation: "Tanda kurung memastikan bagian `or` dievaluasi lebih dulu, sesuai maksud aturan.",
    },
    {
      id: "py-bool-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Hitung prediksi benar",
      prompt: [
        "Label asli: `y1, y2, y3, y4 = 1, 0, 1, 1`. Prediksi: `p1, p2, p3, p4 = 1, 0, 0, 1`.",
        "Hitung `benar` = jumlah posisi yang sama (gunakan `==` dan jumlahkan boolean), lalu `akurasi` = benar / 4. Cetak `Benar: 3, Akurasi: 0.75`.",
      ],
      starter: `y1, y2, y3, y4 = 1, 0, 1, 1
p1, p2, p3, p4 = 1, 0, 0, 1
# Tulis kodemu di sini
`,
      solution: `y1, y2, y3, y4 = 1, 0, 1, 1
p1, p2, p3, p4 = 1, 0, 0, 1
benar = (y1 == p1) + (y2 == p2) + (y3 == p3) + (y4 == p4)
akurasi = benar / 4
print(f"Benar: {benar}, Akurasi: {akurasi}")`,
      tests: [
        { desc: "benar = 3", expr: "benar == 3" },
        { desc: "akurasi = 0.75", expr: "akurasi == 0.75" },
        { desc: "Output sesuai", expr: "_lines == ['Benar: 3, Akurasi: 0.75']" },
      ],
      hints: ["Konsep: True = 1, sehingga boolean bisa dijumlahkan.", "Bandingkan setiap pasangan dengan `==` dalam kurung.", "`(y1 == p1) + (y2 == p2) + ...`"],
      explanation: "Ini cara manual menghitung accuracy. NumPy nanti melakukannya untuk ribuan data sekaligus: `(y == p).mean()`.",
    },
  ],
  quiz: [
    { id: "py-bool-q1", type: "predict", prompt: "Apa outputnya?", code: `print(3 > 2 and 2 > 3, 3 > 2 or 2 > 3)`, options: ["True True", "False True", "False False", "True False"], answer: 1, explanation: "and butuh keduanya benar; or cukup satu." },
    { id: "py-bool-q2", type: "mcq", prompt: "Nilai mana yang dianggap False oleh `bool()`?", options: ["\"0\"", "[0]", "0.0", "\" \""], answer: 2, explanation: "0.0 falsy. \"0\", [0], dan \" \" tidak kosong sehingga True." },
    { id: "py-bool-q3", type: "tf", prompt: "`True + True + False` bernilai 2.", answer: true, explanation: "True = 1, False = 0." },
    { id: "py-bool-q4", type: "fill", prompt: "Operator untuk \"tidak sama dengan\" adalah ____", answer: ["!="], explanation: "`!=`." },
    { id: "py-bool-q5", type: "case", prompt: "Kamu ingin memfilter pelanggan berusia 25–40 tahun. Kondisi mana yang benar?", options: ["umur > 25 or umur < 40", "25 <= umur <= 40", "umur == 25 and umur == 40", "not umur > 25"], answer: 1, explanation: "Chained comparison `25 <= umur <= 40` mencakup rentang termasuk batasnya." },
  ],
  challenge: {
    id: "py-bool-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Deteksi transaksi mencurigakan",
    prompt: [
      "Sebuah transaksi dianggap **mencurigakan** jika: jumlah > 10 juta **dan** dilakukan malam hari (jam < 5 atau jam >= 23), **atau** negara bukan \"ID\".",
      "Diberikan `jumlah = 12_500_000`, `jam = 2`, `negara = \"ID\"`. Simpan hasil ke `mencurigakan`.",
      "Lalu buat `alasan_malam` (apakah jam termasuk malam) dan cetak dua baris:\n```\nMalam: True\nMencurigakan: True\n```",
    ],
    starter: `jumlah = 12_500_000
jam = 2
negara = "ID"
# Tulis kodemu di sini
`,
    solution: `jumlah = 12_500_000
jam = 2
negara = "ID"
alasan_malam = jam < 5 or jam >= 23
mencurigakan = (jumlah > 10_000_000 and alasan_malam) or negara != "ID"
print(f"Malam: {alasan_malam}")
print(f"Mencurigakan: {mencurigakan}")`,
    tests: [
      { desc: "alasan_malam True", expr: "alasan_malam is True" },
      { desc: "mencurigakan True", expr: "mencurigakan is True" },
      { desc: "Output sesuai", expr: "_lines == ['Malam: True', 'Mencurigakan: True']" },
    ],
    hints: ["Konsep: memecah kondisi kompleks menjadi variabel boolean.", "`alasan_malam = jam < 5 or jam >= 23`", "`mencurigakan = (jumlah > 10_000_000 and alasan_malam) or negara != \"ID\"`"],
    explanation: "Memecah kondisi panjang menjadi variabel bernama membuat aturan bisnis mudah dibaca dan diuji — cikal bakal feature engineering.",
  },
  summary: [
    "`bool` hanya punya `True` dan `False`; dihasilkan oleh perbandingan.",
    "Perbandingan: `== != > < >= <=`; ingat `=` untuk menyimpan, `==` untuk membandingkan.",
    "`and` (keduanya), `or` (salah satu), `not` (membalik). Gunakan kurung untuk kondisi kompleks.",
    "Falsy: `0`, `0.0`, `\"\"`, `None`, koleksi kosong. Sisanya truthy (termasuk `\"0\"`).",
    "True = 1, False = 0 → boolean bisa dijumlahkan untuk menghitung.",
  ],
  cheatsheet: [
    { syntax: "a == b, a != b", desc: "Sama / tidak sama" },
    { syntax: "x >= 0.5", desc: "Threshold" },
    { syntax: "a and b, a or b, not a", desc: "Operator logika" },
    { syntax: "18 <= umur <= 30", desc: "Rentang" },
    { syntax: "x is None", desc: "Cek None" },
    { syntax: "(a == b) + (c == d)", desc: "Menghitung kondisi benar" },
  ],
  flashcards: [
    { q: "Cek apakah prob minimal 0.5", a: "prob >= 0.5" },
    { q: "Cek umur antara 18 dan 30 (inklusif)", a: "18 <= umur <= 30" },
    { q: "Hasil True + True?", a: "2" },
    { q: "Sebutkan 4 nilai falsy", a: '0, 0.0, "", None  (juga list/dict kosong)' },
  ],
  references: [
    pyDoc("Built-in Types — Truth Value Testing", "library/stdtypes.html#truth-value-testing"),
    pyDoc("Built-in Types — Boolean Operations (and, or, not)", "library/stdtypes.html#boolean-operations-and-or-not"),
    pyDoc("Built-in Types — Comparisons", "library/stdtypes.html#comparisons"),
    pyDoc("The Python Tutorial — 5.7 More on Conditions", "tutorial/datastructures.html#more-on-conditions"),
    kagglePy("Booleans and Conditionals (Kaggle Learn Python)", "booleans-and-conditionals"),
  ],
};
