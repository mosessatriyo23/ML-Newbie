import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-while-loop",
  title: "While Loop",
  minutes: 35,
  prerequisites: ["py-for-loop"],
  objectives: [
    "Menulis while loop yang berulang selama kondisi bernilai True.",
    "Memastikan kondisi suatu saat menjadi False agar tidak terjadi infinite loop.",
    "Memakai `break` untuk keluar dari `while True`.",
    "Memilih antara for loop dan while loop sesuai situasi.",
    "Mensimulasikan proses iteratif seperti konvergensi dan early stopping.",
  ],
  definition: [
    "**While loop** mengulang blok kode **selama** (*while*) sebuah kondisi bernilai True. Kondisi diperiksa **sebelum** setiap iterasi; begitu False, loop berhenti.",
    "Perbedaan dengan for loop: for loop mengulang sebanyak elemen yang sudah diketahui; while loop dipakai ketika **jumlah pengulangan belum diketahui** dan bergantung pada suatu kondisi.",
    "Jika kondisi tidak pernah menjadi False, terjadi **infinite loop** (loop tanpa akhir). Di editor ML Academy, kode seperti itu bisa dihentikan dengan tombol **Stop**, dan akan dihentikan otomatis setelah batas waktu (default 30 detik).",
  ],
  why: [
    "Banyak algoritma Machine Learning bersifat **iteratif sampai konvergen**: gradient descent mengulang update parameter *selama* perubahan loss masih cukup besar; K-Means mengulang *selama* centroid masih berpindah.",
    "Memahami while loop membantu memahami parameter seperti `max_iter` dan `tol` (toleransi) pada model scikit-learn.",
  ],
  when: [
    "- Mengulang sampai sebuah target tercapai (loss < batas, saldo ≥ target).",
    "- Membaca/memproses sampai data habis.",
    "- Selalu sediakan batas maksimum iterasi untuk keamanan.",
  ],
  analogy: "While loop seperti **mengisi gelas dari dispenser**: terus tekan tombol *selama* gelas belum penuh. Kamu tidak tahu persis berapa detik — yang kamu periksa adalah kondisinya. Jika sensor \"penuh\" rusak (kondisi tak pernah False), air akan tumpah terus — itulah infinite loop.",
  syntax: {
    code: `while kondisi:
    blok_kode
    # ubah sesuatu agar kondisi suatu saat False

while True:
    ...
    if selesai:
        break`,
  },
  anatomy: [
    ["while", "Kata kunci awal loop."],
    ["kondisi", "Dicek sebelum setiap iterasi. Loop berjalan selama True."],
    [":", "Akhir baris while."],
    ["counter += 1", "Perubahan variabel di dalam loop agar kondisi bisa menjadi False."],
    ["while True:", "Loop yang hanya berhenti lewat `break`."],
  ],
  examples: [
    {
      title: "Contoh 1 — Hitung mundur",
      code: `n = 3
while n > 0:
    print("Hitung:", n)
    n -= 1
print("Mulai!")`,
      output: "Hitung: 3\nHitung: 2\nHitung: 1\nMulai!",
      explain: [
        ["while n > 0:", "Kondisi dicek: 3 > 0 True → masuk loop."],
        ["    n -= 1", "n berkurang setiap iterasi. Tanpa baris ini → infinite loop."],
        ["print(\"Mulai!\")", "Dijalankan setelah kondisi menjadi False (n = 0)."],
      ],
    },
    {
      title: "Contoh 2 — Ulang sampai target tercapai",
      code: `tabungan = 1_000_000
bunga = 0.06
target = 1_500_000
tahun = 0
while tabungan < target:
    tabungan = tabungan * (1 + bunga)
    tahun += 1
print(f"Target tercapai setelah {tahun} tahun: Rp{tabungan:,.0f}")`,
      output: "Target tercapai setelah 7 tahun: Rp1,503,630",
      explain: [
        ["while tabungan < target:", "Kita tidak tahu berapa tahun — loop berhenti otomatis saat target tercapai."],
        ["    tabungan = tabungan * (1 + bunga)", "Bunga majemuk 6% per tahun."],
        ["{tabungan:,.0f}", "Format angka dengan pemisah ribuan koma dan tanpa desimal."],
      ],
      change: "Jumlah iterasi kini tidak diketahui di awal — kasus ideal untuk while.",
    },
    {
      title: "Contoh 3 — Simulasi konvergensi (seperti gradient descent)",
      intro: "Kita mencari x yang meminimalkan f(x) = (x − 3)². Turunannya 2(x − 3). Setiap langkah, x digeser berlawanan arah turunan sebesar learning rate × turunan.",
      code: `x = 0.0
learning_rate = 0.25
langkah = 0
while abs(x - 3) > 0.01 and langkah < 100:
    gradien = 2 * (x - 3)
    x = x - learning_rate * gradien
    langkah += 1
print(f"x = {x:.4f} setelah {langkah} langkah")`,
      output: "x = 2.9941 setelah 9 langkah",
      explain: [
        ["while abs(x - 3) > 0.01 and langkah < 100:", "Berhenti jika sudah cukup dekat dengan minimum **atau** sudah 100 langkah (pengaman)."],
        ["    gradien = 2 * (x - 3)", "Kemiringan fungsi di titik x."],
        ["    x = x - learning_rate * gradien", "Update ala gradient descent."],
      ],
      change: "Kondisi berhenti berbasis **toleransi** dan **max iterasi** — persis parameter `tol` dan `max_iter` di scikit-learn.",
    },
    {
      title: "Contoh 4 — while True dengan break (early stopping)",
      code: `val_loss = [0.80, 0.62, 0.55, 0.56, 0.57, 0.58, 0.40]
terbaik = 999
tanpa_perbaikan = 0
patience = 3
epoch = 0
while True:
    loss = val_loss[epoch]
    if loss < terbaik:
        terbaik = loss
        tanpa_perbaikan = 0
    else:
        tanpa_perbaikan += 1
    if tanpa_perbaikan == patience:
        print(f"Early stopping di epoch {epoch}, loss terbaik {terbaik}")
        break
    epoch += 1`,
      output: "Early stopping di epoch 5, loss terbaik 0.55",
      explain: [
        ["while True:", "Loop tanpa kondisi; keluarnya hanya lewat `break`."],
        ["    if loss < terbaik:", "Jika loss membaik, simpan dan reset hitungan."],
        ["        tanpa_perbaikan += 1", "Jika tidak membaik, tambah hitungan."],
        ["    if tanpa_perbaikan == patience:", "Tiga epoch berturut-turut tanpa perbaikan → berhenti."],
      ],
      change: "Pola `while True` + `break` untuk kondisi berhenti yang kompleks. Perhatikan: epoch 6 (loss 0.40) tidak pernah dilihat — trade-off early stopping.",
    },
  ],
  io: { title: "Input → Output", input: `i = 1\nwhile i < 20:\n    i *= 3\nprint(i)`, output: "27", note: "1 → 3 → 9 → 27; 27 < 20 False sehingga berhenti." },
  tryIt: `# Ubah learning_rate (misal 0.1, 0.5, 0.9, 1.1) dan amati jumlah langkahnya
x = 0.0
learning_rate = 0.25
langkah = 0
while abs(x - 3) > 0.01 and langkah < 50:
    x = x - learning_rate * 2 * (x - 3)
    langkah += 1
print(f"x = {x:.4f}, langkah = {langkah}")`,
  mistakes: [
    {
      title: "Lupa mengubah variabel kondisi (infinite loop)",
      wrong: `i = 0
while i < 3:
    print(i)
# i tidak pernah bertambah -> loop tanpa akhir`,
      fix: `i = 0
while i < 3:
    print(i)
    i += 1`,
      explain: "Pastikan ada perubahan di dalam loop yang membuat kondisi menjadi False. (Contoh salah tidak dijalankan otomatis di sini karena tidak akan pernah selesai — tombol Stop di editor menangani kasus ini.)",
    },
    {
      title: "Kondisi sudah False sejak awal",
      wrong: `saldo = 100
while saldo > 500:
    saldo -= 10
print(saldo)   # loop tidak pernah berjalan`,
      fix: `saldo = 600
while saldo > 500:
    saldo -= 10
print(saldo)`,
      explain: "Kondisi dicek sebelum iterasi pertama. Jika False, blok tidak dijalankan sama sekali.",
    },
    {
      title: "Off-by-one: < vs <=",
      wrong: `i = 1
while i < 5:
    i += 1
print(i)   # 5 — mengira 4?`,
      fix: `i = 1
while i <= 4:
    print(i, end=" ")
    i += 1`,
      explain: "Telusuri nilai di setiap iterasi (gunakan print) untuk memastikan batasnya tepat.",
    },
  ],
  bestPractices: [
    "Selalu tambahkan batas maksimum iterasi pada proses iteratif (`and langkah < max_iter`).",
    "Gunakan for loop jika jumlah pengulangan sudah diketahui (lebih aman dari infinite loop).",
    "Cetak nilai variabel kunci saat debugging while loop.",
    "Gunakan nama variabel yang jelas untuk kondisi berhenti: `tol`, `max_iter`, `patience`.",
  ],
  exercises: [
    {
      id: "py-while-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Counter",
      prompt: "Lengkapi agar loop mencetak 1, 2, 3 lalu berhenti.",
      starter: `i = 1
____ i <= 3:
    print(i)
    i ____ 1`,
      solution: `i = 1
while i <= 3:
    print(i)
    i += 1`,
      tests: [
        { desc: "Output 1, 2, 3", expr: "_lines == ['1', '2', '3']" },
        { desc: "Memakai while", expr: "'while' in _code" },
      ],
      hints: ["Konsep: while + perubahan variabel kondisi.", "Kata kunci loop berbasis kondisi + operator tambah-simpan.", "`while i <= 3:` dan `i += 1`"],
      explanation: "Setiap iterasi i bertambah 1 hingga kondisi `i <= 3` menjadi False.",
    },
    {
      id: "py-while-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `n = 100
langkah = 0
while n > 10:
    n = n // 2
    langkah += 1
print(n, langkah)`,
      answer: "6 4",
      hints: ["Konsep: menelusuri nilai di setiap iterasi.", "100 → 50 → 25 → 12 → 6.", "Hitung berapa kali dibagi."],
      explanation: "Empat kali dibagi 2 (floor) hingga n = 6 ≤ 10.",
    },
    {
      id: "py-while-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Loop tidak berhenti",
      starterLoops: true,
      prompt: "Kode ini adalah infinite loop (tombol Stop akan menghentikannya). Perbaiki agar loss turun 10% per epoch sampai < 0.5 dan mencetak `Epoch: 7`.",
      starter: `loss = 1.0
epoch = 0
while loss >= 0.5:
    epoch += 1
print("Epoch:", epoch)`,
      solution: `loss = 1.0
epoch = 0
while loss >= 0.5:
    loss = loss * 0.9
    epoch += 1
print("Epoch:", epoch)`,
      tests: [
        { desc: "loss < 0.5 setelah loop", expr: "loss < 0.5" },
        { desc: "Output 'Epoch: 7'", expr: "_lines == ['Epoch: 7']" },
      ],
      hints: ["Konsep: variabel kondisi harus berubah.", "Loss tidak pernah turun di dalam loop.", "Tambahkan `loss = loss * 0.9` di dalam loop."],
      explanation: "0.9⁶ ≈ 0.531 dan 0.9⁷ ≈ 0.478, jadi butuh 7 epoch.",
    },
    {
      id: "py-while-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Kumpulkan data sampai cukup",
      prompt: [
        "Batch data datang dengan ukuran `batches = [120, 80, 150, 60, 200]`. Gunakan while loop untuk menjumlahkan batch satu per satu (mulai index 0) **sampai** total minimal 300.",
        "Simpan `total` dan `jumlah_batch` yang dipakai. Cetak `Total 350 dari 3 batch`.",
      ],
      starter: `batches = [120, 80, 150, 60, 200]
total = 0
jumlah_batch = 0
# Tulis kodemu di sini
`,
      solution: `batches = [120, 80, 150, 60, 200]
total = 0
jumlah_batch = 0
while total < 300:
    total += batches[jumlah_batch]
    jumlah_batch += 1
print(f"Total {total} dari {jumlah_batch} batch")`,
      tests: [
        { desc: "total = 350", expr: "total == 350" },
        { desc: "jumlah_batch = 3", expr: "jumlah_batch == 3" },
        { desc: "Memakai while", expr: "'while' in _code" },
        { desc: "Output sesuai", expr: "_lines == ['Total 350 dari 3 batch']" },
      ],
      hints: ["Konsep: while dengan kondisi akumulasi.", "Index batch = jumlah_batch.", "`while total < 300:` lalu tambahkan `batches[jumlah_batch]`."],
      explanation: "Jumlah iterasi bergantung pada data — alasan memakai while, bukan for.",
    },
    {
      id: "py-while-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Gradient descent dengan toleransi",
      prompt: [
        "Minimalkan f(w) = (w − 5)² mulai dari `w = 0`, `lr = 0.1`. Gradien = 2(w − 5).",
        "Ulangi update `w = w - lr * gradien` selama `abs(gradien) > 0.1` dan `iterasi < 1000`. (Hitung gradien sebelum mengecek kondisi berikutnya.)",
        "Cetak `w = 4.9539 (iterasi 21)` dengan format 4 desimal.",
      ],
      starter: `w = 0.0
lr = 0.1
iterasi = 0
gradien = 2 * (w - 5)
# Tulis kodemu di sini
`,
      solution: `w = 0.0
lr = 0.1
iterasi = 0
gradien = 2 * (w - 5)
while abs(gradien) > 0.1 and iterasi < 1000:
    w = w - lr * gradien
    iterasi += 1
    gradien = 2 * (w - 5)
print(f"w = {w:.4f} (iterasi {iterasi})")`,
      tests: [
        { desc: "|gradien| <= 0.1 di akhir", expr: "abs(gradien) <= 0.1" },
        { desc: "w ≈ 4.9539", expr: "abs(w - 4.9539) < 0.0001" },
        { desc: "Output sesuai", expr: "_lines == ['w = 4.9539 (iterasi 21)']" },
      ],
      hints: ["Konsep: loop iteratif dengan toleransi dan max_iter.", "Kondisi: `abs(gradien) > 0.1 and iterasi < 1000`.", "Di dalam loop: update w, iterasi += 1, hitung ulang gradien."],
      explanation: "Setiap langkah jarak ke minimum menyusut 20% (dikali 0.8), sehingga gradien = 10 × 0.8ⁿ baru ≤ 0.1 setelah 21 iterasi. Inilah mekanisme dasar optimasi model yang dipelajari di Module 10.",
    },
  ],
  quiz: [
    { id: "py-while-q1", type: "predict", prompt: "Apa outputnya?", code: `x = 1\nwhile x < 10:\n    x += 4\nprint(x)`, options: ["9", "13", "10", "5"], answer: 1, explanation: "1 → 5 → 9 → 13." },
    { id: "py-while-q2", type: "mcq", prompt: "Kapan while loop lebih tepat daripada for loop?", options: ["Saat jumlah pengulangan sudah pasti", "Saat pengulangan bergantung pada kondisi yang belum diketahui kapan terpenuhi", "Saat memproses setiap elemen list", "Tidak pernah"], answer: 1, explanation: "Contoh: ulang sampai konvergen." },
    { id: "py-while-q3", type: "tf", prompt: "Jika kondisi while bernilai False sejak awal, blok di dalamnya tetap dijalankan satu kali.", answer: false, explanation: "Kondisi dicek sebelum iterasi pertama." },
    { id: "py-while-q4", type: "fill", prompt: "Kata kunci untuk keluar dari `while True:` adalah ____", answer: ["break"], explanation: "`break`." },
    { id: "py-while-q5", type: "case", prompt: "Model scikit-learn memunculkan peringatan *ConvergenceWarning: max_iter reached*. Apa artinya?", options: ["Model gagal total", "Iterasi berhenti karena batas maksimum sebelum kondisi konvergen tercapai", "Data kosong", "Learning rate nol"], answer: 1, explanation: "Seperti `while not konvergen and iterasi < max_iter` yang berhenti karena syarat kedua. Solusi umum: scaling data atau menaikkan max_iter." },
  ],
  challenge: {
    id: "py-while-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Binary search ambang batas",
    prompt: [
      "Kamu ingin mencari threshold terkecil (antara 0 dan 1) yang membuat `recall(t) = 1 - t` **≥ 0.7**. Gunakan binary search: `low = 0.0`, `high = 1.0`, ulangi **selama** `high - low > 0.001`:",
      "- `mid = (low + high) / 2`\n- jika `1 - mid >= 0.7` → `low = mid` (threshold bisa dinaikkan), selain itu `high = mid`\n- tambah `iterasi`",
      "Cetak `Threshold maksimum ≈ 0.300 setelah 10 iterasi` (format `low` 3 desimal).",
    ],
    starter: `low = 0.0
high = 1.0
iterasi = 0
# Tulis kodemu di sini
`,
    solution: `low = 0.0
high = 1.0
iterasi = 0
while high - low > 0.001:
    mid = (low + high) / 2
    if 1 - mid >= 0.7:
        low = mid
    else:
        high = mid
    iterasi += 1
print(f"Threshold maksimum ≈ {low:.3f} setelah {iterasi} iterasi")`,
    tests: [
      { desc: "low ≈ 0.3", expr: "abs(low - 0.3) < 0.001" },
      { desc: "iterasi = 10", expr: "iterasi == 10" },
      { desc: "Output sesuai", expr: "_lines == ['Threshold maksimum ≈ 0.300 setelah 10 iterasi']" },
    ],
    hints: ["Konsep: while dengan kondisi presisi.", "Setiap iterasi membagi dua rentang pencarian.", "`while high - low > 0.001:` lalu if/else memperbarui low/high."],
    explanation: "Rentang 1.0 dibagi dua 10 kali menjadi < 0.001. Binary search adalah contoh algoritma iteratif yang efisien.",
  },
  summary: [
    "`while kondisi:` mengulang selama kondisi True; dicek sebelum setiap iterasi.",
    "Ubah variabel kondisi di dalam loop agar tidak terjadi infinite loop.",
    "`while True:` + `break` untuk kondisi berhenti yang kompleks.",
    "Gunakan for jika jumlah iterasi diketahui; while jika bergantung kondisi.",
    "Pola `tol` + `max_iter` adalah dasar algoritma iteratif di ML.",
  ],
  cheatsheet: [
    { syntax: "while i < n:\n    ...\n    i += 1", desc: "Loop dengan counter" },
    { syntax: "while abs(err) > tol and it < max_iter:", desc: "Konvergensi aman" },
    { syntax: "while True:\n    if selesai:\n        break", desc: "Keluar dengan break" },
  ],
  flashcards: [
    { q: "Loop yang berjalan selama loss lebih besar dari 0.1", a: "while loss > 0.1:" },
    { q: "Pola konvergensi dengan toleransi dan batas iterasi", a: "while abs(grad) > tol and it < max_iter:" },
    { q: "Apa penyebab infinite loop pada while?", a: "Kondisi tidak pernah menjadi False (variabel kondisi tidak berubah)" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3.2 First Steps Towards Programming (while loop)", "tutorial/introduction.html#first-steps-towards-programming"),
    pyDoc("Compound statements — The while statement", "reference/compound_stmts.html#the-while-statement"),
    pyDoc("The Python Tutorial — 4.4 break and continue Statements", "tutorial/controlflow.html#break-and-continue-statements"),
    { source: "Google Machine Learning Crash Course", title: "Linear regression: Gradient descent", url: "https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent" },
  ],
};
