import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-conditional-statements",
  title: "Conditional Statements",
  minutes: 45,
  prerequisites: ["py-boolean", "py-operators"],
  objectives: [
    "Menulis percabangan dengan `if`, `elif`, dan `else`.",
    "Memahami bahwa hanya satu cabang yang dijalankan dan urutan pengecekan itu penting.",
    "Menggabungkan kondisi dengan `and`/`or` di dalam `if`.",
    "Menulis nested if dan conditional expression satu baris.",
    "Menerapkan percabangan untuk threshold klasifikasi dan aturan bisnis.",
  ],
  definition: [
    "**Conditional statement** (percabangan) membuat program **memilih** blok kode mana yang dijalankan berdasarkan kondisi True/False.",
    "Strukturnya:\n- `if kondisi:` — jalankan blok jika kondisi True.\n- `elif kondisi_lain:` — (else if) dicek hanya jika semua kondisi sebelumnya False. Boleh lebih dari satu.\n- `else:` — jalankan jika semua kondisi di atasnya False. Opsional, maksimal satu, selalu di akhir.",
    "Python mengecek kondisi **dari atas ke bawah** dan berhenti di kondisi pertama yang True. Karena itu **urutan** `elif` sangat penting.",
    "Setiap baris `if/elif/else` diakhiri titik dua `:`, dan isi bloknya menjorok 4 spasi — aturan indentasi yang kamu pelajari di Python Syntax.",
  ],
  why: [
    "Model klasifikasi menghasilkan probabilitas; mengubahnya menjadi keputusan memakai aturan: `if prob >= 0.5: prediksi = 1`.",
    "Percabangan dipakai untuk membuat kategori baru (feature engineering), misalnya mengelompokkan umur menjadi \"muda\"/\"dewasa\"/\"senior\", dan untuk validasi data sebelum diproses.",
  ],
  when: [
    "- Mengambil keputusan berdasarkan nilai (threshold, grade, kategori risiko).",
    "- Menangani kasus khusus (data kosong, nilai tidak valid).",
    "- Menjalankan langkah tertentu hanya jika syarat terpenuhi.",
  ],
  analogy: "Percabangan seperti **lampu lalu lintas**: *jika* merah → berhenti; *jika tidak, dan jika* kuning → hati-hati; *selain itu* → jalan. Pengemudi hanya melakukan satu tindakan, sesuai kondisi pertama yang cocok.",
  syntax: {
    code: `if kondisi1:
    blok1
elif kondisi2:
    blok2
else:
    blok3

hasil = nilai_a if kondisi else nilai_b   # conditional expression`,
  },
  anatomy: [
    ["if", "Kata kunci awal percabangan."],
    ["kondisi", "Ekspresi yang bernilai True/False (atau truthy/falsy)."],
    [":", "Wajib di akhir baris if/elif/else."],
    ["blok", "Baris-baris yang menjorok 4 spasi; dijalankan jika kondisi True."],
    ["elif", "Kondisi alternatif; dicek bila kondisi sebelumnya False."],
    ["else", "Cabang terakhir tanpa kondisi."],
    ["a if k else b", "Conditional expression: menghasilkan a jika k True, selain itu b."],
  ],
  examples: [
    {
      title: "Contoh 1 — if sederhana",
      code: `akurasi = 0.93
if akurasi >= 0.9:
    print("Model sangat baik")
print("Evaluasi selesai")`,
      output: "Model sangat baik\nEvaluasi selesai",
      explain: [
        ["if akurasi >= 0.9:", "Kondisi True, jadi blok di bawahnya dijalankan."],
        ["    print(\"Model sangat baik\")", "Berada di dalam blok if (menjorok)."],
        ["print(\"Evaluasi selesai\")", "Di luar blok — selalu dijalankan."],
      ],
    },
    {
      title: "Contoh 2 — if dan else: threshold klasifikasi",
      code: `prob_churn = 0.37
threshold = 0.5

if prob_churn >= threshold:
    prediksi = 1
else:
    prediksi = 0
print("Prediksi:", prediksi)`,
      output: "Prediksi: 0",
      explain: [
        ["if prob_churn >= threshold:", "0.37 ≥ 0.5 → False, jadi blok if dilewati."],
        ["else:", "Dijalankan karena kondisi if False."],
        ["    prediksi = 0", "Variabel yang dibuat di dalam blok tetap bisa dipakai setelah blok selesai."],
      ],
      change: "Ada dua cabang; tepat satu yang dijalankan.",
    },
    {
      title: "Contoh 3 — if, elif, else: kategori nilai",
      code: `nilai = 78
if nilai >= 85:
    grade = "A"
elif nilai >= 70:
    grade = "B"
elif nilai >= 55:
    grade = "C"
else:
    grade = "D"
print(f"Nilai {nilai} -> grade {grade}")`,
      output: "Nilai 78 -> grade B",
      explain: [
        ["if nilai >= 85:", "78 ≥ 85? False → lanjut ke elif."],
        ["elif nilai >= 70:", "78 ≥ 70? True → grade = \"B\". Sisa elif/else **tidak dicek lagi**."],
        ["else:", "Hanya dijalankan jika semua kondisi di atas False."],
      ],
      change: "Banyak cabang. Urutannya dari batas tertinggi ke terendah — jika urutannya dibalik, semua nilai ≥ 55 akan mendapat \"C\".",
    },
    {
      title: "Contoh 4 — Kondisi gabungan dan nested if",
      code: `umur = 45
tenure = 3
kontrak = "Month-to-month"

if kontrak == "Month-to-month" and tenure < 6:
    risiko = "tinggi"
elif kontrak == "Month-to-month" or tenure < 12:
    risiko = "sedang"
else:
    risiko = "rendah"
print("Risiko churn:", risiko)

if umur >= 40:
    if risiko == "tinggi":
        print("Hubungi dengan penawaran khusus")`,
      output: "Risiko churn: tinggi\nHubungi dengan penawaran khusus",
      explain: [
        ["if kontrak == \"Month-to-month\" and tenure < 6:", "Kedua syarat terpenuhi → risiko \"tinggi\"."],
        ["if umur >= 40:", "If di luar…"],
        ["    if risiko == \"tinggi\":", "…dan if di dalamnya (nested). Indentasi bertambah 4 spasi lagi."],
      ],
      change: "Kondisi digabung dengan `and`/`or`, dan if diletakkan di dalam if lain.",
    },
    {
      title: "Contoh 5 — Conditional expression dan truthiness",
      code: `prob = 0.81
label = "churn" if prob >= 0.5 else "tidak churn"
print(label)

daftar_error = []
if not daftar_error:
    print("Tidak ada error pada data")`,
      output: "churn\nTidak ada error pada data",
      explain: [
        ["label = \"churn\" if prob >= 0.5 else \"tidak churn\"", "if-else versi satu baris untuk memilih nilai."],
        ["if not daftar_error:", "List kosong bernilai False, jadi `not []` → True. Cara Pythonic memeriksa koleksi kosong."],
      ],
      change: "Bentuk ringkas untuk kasus dua pilihan sederhana, plus pemanfaatan truthiness.",
    },
  ],
  io: { title: "Input → Output", input: `x = -3\nif x > 0:\n    print("positif")\nelif x == 0:\n    print("nol")\nelse:\n    print("negatif")`, output: "negatif" },
  tryIt: `# Ubah bmi lalu jalankan ulang
bmi = 23.4

if bmi < 18.5:
    kategori = "kurus"
elif bmi < 25:
    kategori = "normal"
elif bmi < 30:
    kategori = "berlebih"
else:
    kategori = "obesitas"
print(f"BMI {bmi}: {kategori}")`,
  mistakes: [
    {
      title: "Lupa titik dua",
      wrong: `x = 5
if x > 3
    print("besar")`,
      error: "SyntaxError",
      fix: `x = 5
if x > 3:
    print("besar")`,
      explain: "Pesan error 3.14: *expected ':'*.",
    },
    {
      title: "Isi blok tidak menjorok",
      wrong: `x = 5
if x > 3:
print("besar")`,
      error: "IndentationError",
      fix: `x = 5
if x > 3:
    print("besar")`,
      explain: "Blok setelah `:` wajib diindentasi.",
    },
    {
      title: "Urutan elif yang salah",
      wrong: `nilai = 95
if nilai >= 55:
    grade = "C"
elif nilai >= 85:
    grade = "A"
print(grade)   # C — salah!`,
      fix: `nilai = 95
if nilai >= 85:
    grade = "A"
elif nilai >= 55:
    grade = "C"
print(grade)`,
      explain: "Python berhenti di kondisi True pertama. Periksa kondisi yang paling ketat lebih dulu.",
    },
    {
      title: "Memakai = di dalam kondisi",
      wrong: `x = 5
if x = 5:
    print("lima")`,
      error: "SyntaxError",
      fix: `x = 5
if x == 5:
    print("lima")`,
      explain: "Kondisi memakai operator perbandingan `==`.",
    },
  ],
  bestPractices: [
    "Urutkan `elif` dari kondisi paling spesifik/ketat ke paling umum.",
    "Hindari nested if yang terlalu dalam — gabungkan dengan `and` jika memungkinkan.",
    "Pastikan setiap cabang mengisi variabel yang sama, agar variabel selalu terdefinisi setelah percabangan.",
    "Simpan angka threshold dalam variabel bernama (`threshold = 0.5`).",
  ],
  exercises: [
    {
      id: "py-if-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — if/else",
      prompt: "Lengkapi kata kunci sehingga `status` bernilai `\"lulus\"` jika skor ≥ 70, selain itu `\"remedial\"`.",
      starter: `skor = 64
____ skor >= 70:
    status = "lulus"
____:
    status = "remedial"
print(status)`,
      solution: `skor = 64
if skor >= 70:
    status = "lulus"
else:
    status = "remedial"
print(status)`,
      tests: [
        { desc: "status = 'remedial' untuk skor 64", expr: "status == 'remedial'" },
        { desc: "Output 'remedial'", expr: "_lines == ['remedial']" },
      ],
      hints: ["Konsep: dua cabang.", "Kata kunci pertama `if`, kedua untuk \"selain itu\".", "`if ...:` dan `else:`"],
      explanation: "Skor 64 tidak memenuhi kondisi if, sehingga cabang else dijalankan.",
    },
    {
      id: "py-if-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `n = 15
if n % 3 == 0 and n % 5 == 0:
    print("FizzBuzz")
elif n % 3 == 0:
    print("Fizz")
else:
    print(n)
print("selesai" if n > 10 else "awal")`,
      answer: "FizzBuzz\nselesai",
      hints: ["Konsep: and di dalam if, urutan elif.", "15 habis dibagi 3 dan 5.", "Conditional expression: n > 10."],
      explanation: "Kondisi pertama True sehingga cetak FizzBuzz; sisa cabang diabaikan. 15 > 10 → 'selesai'.",
    },
    {
      id: "py-if-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kategori umur",
      prompt: "Kode ini memberi kategori yang salah (dan ada error sintaks). Perbaiki agar umur 70 → `senior`, umur 35 → `dewasa`, umur 15 → `remaja`. Variabel `umur` diuji dengan nilai 70.",
      starter: `umur = 70
if umur >= 18
    kategori = "dewasa"
elif umur >= 60:
    kategori = "senior"
else:
    kategori = "remaja"
print(kategori)`,
      solution: `umur = 70
if umur >= 60:
    kategori = "senior"
elif umur >= 18:
    kategori = "dewasa"
else:
    kategori = "remaja"
print(kategori)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "umur 70 → senior", expr: "kategori == 'senior'" },
        { desc: "Urutan benar: kondisi >= 60 dicek sebelum >= 18", expr: "_code.find('>= 60') < _code.find('>= 18')" },
      ],
      hints: ["Konsep: titik dua dan urutan elif.", "Kondisi paling ketat (≥ 60) harus dicek lebih dulu.", "Tukar posisi dua kondisi dan tambahkan `:`."],
      explanation: "Dengan urutan awal, umur 70 berhenti di `>= 18` → \"dewasa\". Kondisi tertinggi harus dicek pertama.",
    },
    {
      id: "py-if-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Interpretasi korelasi",
      prompt: [
        "Variabel `r = -0.82` adalah koefisien korelasi. Buat variabel `kekuatan` dengan aturan berdasarkan nilai mutlak r (`abs(r)`):",
        "- ≥ 0.7 → `\"kuat\"`\n- ≥ 0.4 → `\"sedang\"`\n- selain itu → `\"lemah\"`",
        "Buat juga `arah` = `\"positif\"` jika r > 0, selain itu `\"negatif\"`. Cetak `kuat negatif`.",
      ],
      starter: `r = -0.82
# Tulis kodemu di sini
`,
      solution: `r = -0.82
if abs(r) >= 0.7:
    kekuatan = "kuat"
elif abs(r) >= 0.4:
    kekuatan = "sedang"
else:
    kekuatan = "lemah"
arah = "positif" if r > 0 else "negatif"
print(kekuatan, arah)`,
      tests: [
        { desc: "kekuatan = 'kuat'", expr: "kekuatan == 'kuat'" },
        { desc: "arah = 'negatif'", expr: "arah == 'negatif'" },
        { desc: "Memakai elif", expr: "'elif' in _code" },
        { desc: "Output 'kuat negatif'", expr: "_lines == ['kuat negatif']" },
      ],
      hints: ["Konsep: if/elif/else dengan abs().", "Bandingkan `abs(r)` dengan 0.7 lalu 0.4.", "`arah = \"positif\" if r > 0 else \"negatif\"`"],
      explanation: "Korelasi -0.82 berarti hubungan kuat dengan arah berlawanan. (Batas 0.7/0.4 adalah aturan praktis, bukan standar mutlak.)",
    },
    {
      id: "py-if-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Pilih metrik evaluasi",
      prompt: [
        "Berdasarkan `jenis_tugas` dan `seimbang`, tentukan `metrik`:",
        "- `\"regresi\"` → `\"RMSE\"`\n- `\"klasifikasi\"` dan data seimbang → `\"accuracy\"`\n- `\"klasifikasi\"` dan tidak seimbang → `\"F1-score\"`\n- selain itu → `\"silhouette\"`",
        "Uji dengan `jenis_tugas = \"klasifikasi\"` dan `seimbang = False`, lalu cetak metrik.",
      ],
      starter: `jenis_tugas = "klasifikasi"
seimbang = False
# Tulis kodemu di sini
`,
      solution: `jenis_tugas = "klasifikasi"
seimbang = False
if jenis_tugas == "regresi":
    metrik = "RMSE"
elif jenis_tugas == "klasifikasi" and seimbang:
    metrik = "accuracy"
elif jenis_tugas == "klasifikasi":
    metrik = "F1-score"
else:
    metrik = "silhouette"
print(metrik)`,
      tests: [
        { desc: "metrik = 'F1-score'", expr: "metrik == 'F1-score'" },
        { desc: "Output 'F1-score'", expr: "_lines == ['F1-score']" },
      ],
      hints: ["Konsep: elif dengan kondisi gabungan.", "Kasus klasifikasi seimbang dicek sebelum kasus klasifikasi umum.", "`elif jenis_tugas == \"klasifikasi\" and seimbang:`"],
      explanation: "Pada data tidak seimbang, accuracy bisa menyesatkan — materi lengkapnya di Module 14 Model Evaluation.",
    },
  ],
  quiz: [
    { id: "py-if-q1", type: "predict", prompt: "Apa outputnya?", code: `x = 10\nif x > 5:\n    print("A")\nelif x > 8:\n    print("B")\nelse:\n    print("C")`, options: ["A", "B", "A\nB", "C"], answer: 0, explanation: "Hanya cabang True pertama yang dijalankan." },
    { id: "py-if-q2", type: "tf", prompt: "Satu struktur if boleh memiliki lebih dari satu `else`.", answer: false, explanation: "Hanya satu `else`, di akhir. Yang boleh banyak adalah `elif`." },
    { id: "py-if-q3", type: "mcq", prompt: "Conditional expression yang benar untuk memberi label 1 jika prob ≥ 0.5, selain itu 0?", options: ["label = 1 if prob >= 0.5 else 0", "label = if prob >= 0.5: 1 else 0", "label = prob >= 0.5 ? 1 : 0", "label = 1 when prob >= 0.5"], answer: 0, explanation: "Sintaks Python: `a if kondisi else b`." },
    { id: "py-if-q4", type: "fill", prompt: "Kata kunci untuk \"else if\" di Python adalah ____", answer: ["elif"], explanation: "`elif`." },
    { id: "py-if-q5", type: "case", prompt: "Model fraud detection lebih baik salah curiga daripada melewatkan fraud. Bagaimana mengubah aturan `if prob >= 0.5:`?", options: ["Naikkan threshold menjadi 0.8", "Turunkan threshold, misalnya 0.3", "Hapus if", "Gunakan else saja"], answer: 1, explanation: "Threshold lebih rendah → lebih banyak transaksi ditandai positif → recall naik (materi Classification Threshold)." },
  ],
  challenge: {
    id: "py-if-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Aturan persetujuan kredit",
    prompt: [
      "Tentukan `keputusan` untuk pengajuan kredit dengan aturan berurutan:",
      "1. Jika `umur < 21` → `\"ditolak: umur\"`",
      "2. Jika `skor_kredit >= 750` → `\"disetujui\"`",
      "3. Jika `skor_kredit >= 650` dan `rasio_utang < 0.4` → `\"disetujui dengan syarat\"`",
      "4. Selain itu → `\"ditolak: risiko\"`",
      "Uji dengan `umur = 30`, `skor_kredit = 690`, `rasio_utang = 0.35`. Buat juga `perlu_review` = True jika keputusan diawali kata \"disetujui\" **dan** `rasio_utang >= 0.3`. Cetak:\n```\nKeputusan: disetujui dengan syarat\nPerlu review: True\n```",
    ],
    starter: `umur = 30
skor_kredit = 690
rasio_utang = 0.35
# Tulis kodemu di sini
`,
    solution: `umur = 30
skor_kredit = 690
rasio_utang = 0.35
if umur < 21:
    keputusan = "ditolak: umur"
elif skor_kredit >= 750:
    keputusan = "disetujui"
elif skor_kredit >= 650 and rasio_utang < 0.4:
    keputusan = "disetujui dengan syarat"
else:
    keputusan = "ditolak: risiko"
perlu_review = keputusan.startswith("disetujui") and rasio_utang >= 0.3
print("Keputusan:", keputusan)
print("Perlu review:", perlu_review)`,
    tests: [
      { desc: "keputusan benar", expr: "keputusan == 'disetujui dengan syarat'" },
      { desc: "perlu_review True", expr: "perlu_review is True" },
      { desc: "Output sesuai", expr: "_lines == ['Keputusan: disetujui dengan syarat', 'Perlu review: True']" },
    ],
    hints: ["Konsep: if/elif/else berurutan + startswith.", "Aturan 1–4 menjadi if, elif, elif, else.", "`perlu_review = keputusan.startswith(\"disetujui\") and rasio_utang >= 0.3`"],
    explanation: "Sistem berbasis aturan (rule-based) seperti ini sering menjadi **baseline** sebelum membangun model Credit Risk berbasis Machine Learning.",
  },
  summary: [
    "`if` → `elif` (boleh banyak) → `else` (opsional, satu, di akhir).",
    "Hanya cabang True pertama yang dijalankan; urutan kondisi penting.",
    "Setiap baris kondisi diakhiri `:`; isi blok menjorok 4 spasi.",
    "Kondisi bisa digabung dengan `and`/`or`; if bisa bersarang (nested).",
    "Conditional expression: `a if kondisi else b`.",
  ],
  cheatsheet: [
    { syntax: "if x > 0:\n    ...", desc: "if" },
    { syntax: "if ...:\n    ...\nelse:\n    ...", desc: "if-else" },
    { syntax: "if ...:\nelif ...:\nelse:", desc: "Banyak cabang" },
    { syntax: "y = 1 if p >= 0.5 else 0", desc: "Conditional expression" },
    { syntax: "if not data:", desc: "Cek koleksi kosong" },
  ],
  flashcards: [
    { q: "Ubah prob menjadi label 1/0 dengan threshold 0.5 (satu baris)", a: "label = 1 if prob >= 0.5 else 0" },
    { q: "Struktur 3 cabang: nilai >= 85 'A', >= 70 'B', selain itu 'C'", a: 'if nilai >= 85:\n    grade = "A"\nelif nilai >= 70:\n    grade = "B"\nelse:\n    grade = "C"' },
    { q: "Cek list errors kosong secara Pythonic", a: "if not errors:" },
  ],
  references: [
    pyDoc("The Python Tutorial — 4.1 if Statements", "tutorial/controlflow.html#if-statements"),
    pyDoc("Compound statements — The if statement", "reference/compound_stmts.html#the-if-statement"),
    pyDoc("Expressions — Conditional expressions", "reference/expressions.html#conditional-expressions"),
    kagglePy("Booleans and Conditionals (Kaggle Learn Python)", "booleans-and-conditionals"),
  ],
};
