import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-for-loop",
  title: "For Loop",
  minutes: 55,
  prerequisites: ["py-list", "py-dictionary", "py-conditional-statements"],
  visual: "loop-trace",
  objectives: [
    "Mengulang kode untuk setiap elemen list, string, tuple, set, dan dictionary.",
    "Memakai `range(start, stop, step)` untuk mengulang sejumlah kali tertentu.",
    "Mengakumulasi hasil (total, hitungan, list baru) di dalam loop.",
    "Memakai `enumerate()` untuk mendapatkan index sekaligus nilai, dan `.items()` untuk dictionary.",
    "Mengontrol loop dengan `break`, `continue`, dan menggabungkannya dengan `if`.",
  ],
  definition: [
    "**For loop** mengulang sebuah blok kode **untuk setiap elemen** dari sebuah koleksi (disebut *iterable*). Di setiap putaran (**iterasi**), variabel loop berisi satu elemen.",
    "`for nilai in daftar:` dibaca: \"untuk setiap `nilai` di dalam `daftar`, jalankan blok di bawah\". Variabel loop (`nilai`) boleh diberi nama apa saja.",
    "`range()` menghasilkan deretan angka: `range(5)` → 0, 1, 2, 3, 4; `range(2, 6)` → 2, 3, 4, 5; `range(0, 10, 3)` → 0, 3, 6, 9. Seperti slicing, nilai `stop` **tidak** ikut.",
    "`break` menghentikan loop sepenuhnya; `continue` melompati sisa blok dan lanjut ke iterasi berikutnya.",
  ],
  why: [
    "Loop menghilangkan pengulangan kode manual. Dengan loop kamu bisa melatih 5 model berbeda, menguji 10 nilai K pada KNN (Elbow/tuning), atau memproses setiap file dataset hanya dengan beberapa baris.",
    "Catatan penting: untuk operasi numerik pada data besar, NumPy dan Pandas menyediakan operasi **vectorized** yang jauh lebih cepat daripada for loop. Namun memahami for loop tetap wajib karena konsep iterasi ada di mana-mana (epoch training, cross-validation fold, dsb.).",
  ],
  when: [
    "- Memproses setiap elemen koleksi (membersihkan, menghitung, mencetak).",
    "- Mengulang sejumlah kali tertentu (`range`).",
    "- Mencoba banyak kombinasi parameter atau banyak model.",
  ],
  analogy: "For loop seperti **guru yang memeriksa tumpukan lembar ujian**: ambil lembar pertama, periksa, beri nilai; ambil lembar berikutnya, lakukan hal yang sama… sampai tumpukan habis. Langkahnya ditulis sekali, diterapkan ke setiap lembar.",
  syntax: {
    code: `for item in koleksi:
    blok_kode

for i in range(start, stop, step):
    blok_kode

for i, item in enumerate(koleksi):
    blok_kode

for key, value in d.items():
    blok_kode`,
  },
  anatomy: [
    ["for", "Kata kunci awal loop."],
    ["item", "Variabel loop: berisi elemen saat ini pada setiap iterasi."],
    ["in", "Diikuti koleksi yang akan diulang."],
    [":", "Akhir baris for; blok di bawahnya diindentasi."],
    ["range(5)", "Angka 0 sampai 4 (5 angka)."],
    ["enumerate(x)", "Menghasilkan pasangan (index, elemen)."],
    ["break / continue", "Berhenti total / lompat ke iterasi berikutnya."],
  ],
  examples: [
    {
      title: "Contoh 1 — Loop pada list",
      code: `models = ["KNN", "SVM", "Random Forest"]
for model in models:
    print("Melatih", model)
print("Semua model selesai")`,
      output: "Melatih KNN\nMelatih SVM\nMelatih Random Forest\nSemua model selesai",
      explain: [
        ["for model in models:", "Tiga iterasi; `model` berisi \"KNN\", lalu \"SVM\", lalu \"Random Forest\"."],
        ["    print(\"Melatih\", model)", "Blok yang diulang (menjorok)."],
        ["print(\"Semua model selesai\")", "Di luar loop — dijalankan sekali setelah loop selesai."],
      ],
    },
    {
      title: "Contoh 2 — range() dan akumulasi",
      code: `total = 0
for i in range(1, 6):
    total += i
print("Jumlah 1..5 =", total)

for epoch in range(0, 10, 3):
    print("Epoch", epoch)`,
      output: "Jumlah 1..5 = 15\nEpoch 0\nEpoch 3\nEpoch 6\nEpoch 9",
      explain: [
        ["total = 0", "Variabel akumulator dibuat **sebelum** loop."],
        ["for i in range(1, 6):", "i = 1, 2, 3, 4, 5 (6 tidak termasuk)."],
        ["    total += i", "Setiap iterasi menambah i ke total."],
        ["range(0, 10, 3)", "Mulai 0, berhenti sebelum 10, langkah 3."],
      ],
      change: "Kita memakai range untuk mengulang berdasarkan angka, dan pola akumulator yang sangat umum.",
    },
    {
      title: "Contoh 3 — Loop dengan if: menghitung dan memfilter",
      code: `nilai = [85, 42, 77, 90, 58, 66]
lulus = []
jumlah_remedial = 0
for n in nilai:
    if n >= 60:
        lulus.append(n)
    else:
        jumlah_remedial += 1
print("Lulus:", lulus)
print("Remedial:", jumlah_remedial)
print("Rata-rata yang lulus:", sum(lulus) / len(lulus))`,
      output: "Lulus: [85, 77, 90, 66]\nRemedial: 2\nRata-rata yang lulus: 79.5",
      explain: [
        ["lulus = []", "List kosong untuk menampung hasil filter."],
        ["    if n >= 60:", "If di dalam loop — indentasinya 8 spasi untuk isi blok if."],
        ["        lulus.append(n)", "Menambahkan nilai yang memenuhi syarat."],
        ["        jumlah_remedial += 1", "Menghitung yang tidak memenuhi."],
      ],
      change: "Loop digabung dengan percabangan — inilah \"filtering\" manual yang nanti dilakukan Pandas dengan satu baris.",
    },
    {
      title: "Contoh 4 — enumerate() dan loop dictionary",
      code: `kelas = ["setosa", "versicolor", "virginica"]
for i, nama in enumerate(kelas):
    print(i, nama)

skor = {"KNN": 0.91, "SVM": 0.94}
for model, s in skor.items():
    print(f"{model}: {s:.0%}")`,
      output: "0 setosa\n1 versicolor\n2 virginica\nKNN: 91%\nSVM: 94%",
      explain: [
        ["for i, nama in enumerate(kelas):", "`enumerate` memberi pasangan (index, elemen) yang di-unpack ke `i` dan `nama`."],
        ["for model, s in skor.items():", "`.items()` memberi pasangan (key, value)."],
      ],
      change: "Kita mendapatkan dua nilai per iterasi berkat unpacking tuple.",
    },
    {
      title: "Contoh 5 — break dan continue",
      code: `losses = [0.9, 0.7, None, 0.5, 0.48, 0.47]
for epoch, loss in enumerate(losses):
    if loss is None:
        print(f"Epoch {epoch}: data hilang, dilewati")
        continue
    if loss < 0.49:
        print(f"Epoch {epoch}: loss {loss} sudah cukup kecil, berhenti")
        break
    print(f"Epoch {epoch}: loss {loss}")`,
      output: "Epoch 0: loss 0.9\nEpoch 1: loss 0.7\nEpoch 2: data hilang, dilewati\nEpoch 3: loss 0.5\nEpoch 4: loss 0.48 sudah cukup kecil, berhenti",
      explain: [
        ["        continue", "Lompat ke iterasi berikutnya; `print` di bawahnya tidak dijalankan untuk epoch 2."],
        ["        break", "Hentikan loop; epoch 5 tidak pernah diproses."],
      ],
      change: "Kontrol alur di dalam loop — konsep yang mirip dengan *early stopping* saat melatih model.",
    },
  ],
  params: [
    {
      title: "range(start, stop, step)",
      items: [
        { name: "start", type: "int", default: "0", desc: "Angka awal (ikut)." },
        { name: "stop", type: "int", desc: "Batas akhir (tidak ikut). Wajib." },
        { name: "step", type: "int", default: "1", desc: "Selisih antar-angka; boleh negatif untuk hitung mundur." },
      ],
    },
    {
      title: "enumerate(iterable, start=0)",
      items: [
        { name: "iterable", type: "list/str/...", desc: "Koleksi yang diulang." },
        { name: "start", type: "int", default: "0", desc: "Index awal yang dihasilkan, misalnya `start=1`." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `for huruf in "ML":\n    print(huruf * 3)`, output: "MMM\nLLL", note: "String juga iterable — loop berjalan per karakter." },
  tryIt: `# Coba ubah daftar K dan lihat hasilnya
k_values = [1, 3, 5, 7, 9]
for k in k_values:
    tipe = "ganjil" if k % 2 == 1 else "genap"
    print(f"K = {k} ({tipe})")`,
  mistakes: [
    {
      title: "Lupa indentasi isi loop",
      wrong: `for i in range(3):
print(i)`,
      error: "IndentationError",
      fix: `for i in range(3):
    print(i)`,
      explain: "Isi loop wajib menjorok.",
    },
    {
      title: "Akumulator dibuat di dalam loop",
      wrong: `for n in [1, 2, 3]:
    total = 0
    total += n
print(total)   # 3, bukan 6`,
      fix: `total = 0
for n in [1, 2, 3]:
    total += n
print(total)`,
      explain: "Jika `total = 0` di dalam loop, nilainya di-reset setiap iterasi.",
    },
    {
      title: "Mengira range(5) berisi 1–5",
      wrong: `for i in range(5):
    print(i, end=" ")   # 0 1 2 3 4`,
      fix: `for i in range(1, 6):
    print(i, end=" ")`,
      explain: "range dimulai dari 0 dan berhenti sebelum stop.",
    },
    {
      title: "Loop pada angka, bukan range",
      wrong: `for i in 5:
    print(i)`,
      error: "TypeError",
      fix: `for i in range(5):
    print(i)`,
      explain: "Angka tidak bisa diiterasi (*'int' object is not iterable*). Bungkus dengan `range()`.",
    },
  ],
  bestPractices: [
    "Beri nama variabel loop yang bermakna: `for model in models`, `for col in columns`.",
    "Gunakan `enumerate()` daripada `range(len(x))` bila butuh index dan nilai.",
    "Inisialisasi akumulator (total, list hasil) sebelum loop.",
    "Untuk perhitungan numerik besar, gunakan operasi vectorized NumPy/Pandas — for loop di Python relatif lambat.",
    "Jangan menambah/menghapus elemen list yang sedang di-loop; buat list baru.",
  ],
  exercises: [
    {
      id: "py-for-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Loop list",
      prompt: "Lengkapi kata kunci agar setiap nama kolom dicetak dalam huruf besar.",
      starter: `kolom = ["age", "income", "city"]
____ c ____ kolom:
    print(c.upper())`,
      solution: `kolom = ["age", "income", "city"]
for c in kolom:
    print(c.upper())`,
      tests: [{ desc: "Output AGE, INCOME, CITY", expr: "_lines == ['AGE', 'INCOME', 'CITY']" }],
      hints: ["Konsep: for loop.", "Dua kata kunci: satu di awal, satu sebelum koleksi.", "`for c in kolom:`"],
      explanation: "`for c in kolom:` menjalankan blok untuk setiap elemen kolom.",
    },
    {
      id: "py-for-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `hasil = []
for i in range(2, 11, 4):
    hasil.append(i * 10)
print(hasil)
for i, c in enumerate("ab", start=1):
    print(i, c)`,
      answer: "[20, 60, 100]\n1 a\n2 b",
      hints: ["Konsep: range dengan step dan enumerate dengan start.", "range(2, 11, 4) → 2, 6, 10.", "start=1 membuat index mulai dari 1."],
      explanation: "i = 2, 6, 10 → dikali 10. enumerate start=1 memberi index 1 dan 2.",
    },
    {
      id: "py-for-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Total penjualan",
      prompt: "Kode seharusnya mencetak `Total: 450` tetapi hasilnya salah. Perbaiki.",
      starter: `penjualan = [100, 200, 150]
for p in penjualan:
    total = 0
    total = total + p
print("Total:", total)`,
      solution: `penjualan = [100, 200, 150]
total = 0
for p in penjualan:
    total = total + p
print("Total:", total)`,
      tests: [
        { desc: "total = 450", expr: "total == 450" },
        { desc: "Output 'Total: 450'", expr: "_lines == ['Total: 450']" },
      ],
      hints: ["Konsep: posisi inisialisasi akumulator.", "`total = 0` di-reset setiap iterasi.", "Pindahkan `total = 0` ke atas loop."],
      explanation: "Akumulator harus dibuat sekali, sebelum loop dimulai.",
    },
    {
      id: "py-for-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Hitung kelas",
      prompt: [
        "Diberikan label `y = [\"churn\", \"stay\", \"stay\", \"churn\", \"stay\", \"stay\"]`.",
        "Gunakan for loop untuk mengisi dictionary `hitung` berisi jumlah setiap label. Cetak `hitung`: `{'churn': 2, 'stay': 4}`",
      ],
      starter: `y = ["churn", "stay", "stay", "churn", "stay", "stay"]
hitung = {}
# Tulis kodemu di sini
`,
      solution: `y = ["churn", "stay", "stay", "churn", "stay", "stay"]
hitung = {}
for label in y:
    hitung[label] = hitung.get(label, 0) + 1
print(hitung)`,
      alternatives: [`y = ["churn", "stay", "stay", "churn", "stay", "stay"]
hitung = {}
for label in y:
    if label in hitung:
        hitung[label] += 1
    else:
        hitung[label] = 1
print(hitung)`],
      tests: [
        { desc: "hitung = {'churn': 2, 'stay': 4}", expr: "hitung == {'churn': 2, 'stay': 4}" },
        { desc: "Memakai for loop", expr: "'for ' in _code" },
      ],
      hints: ["Konsep: loop + dictionary sebagai penghitung.", "Untuk setiap label, tambahkan 1 pada nilainya.", "`hitung[label] = hitung.get(label, 0) + 1`"],
      explanation: "Ini cara manual melihat **class distribution**. Di Pandas: `df[\"churn\"].value_counts()`.",
    },
    {
      id: "py-for-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Cari K terbaik",
      prompt: [
        "Hasil validasi KNN untuk beberapa K: `hasil = {1: 0.84, 3: 0.89, 5: 0.92, 7: 0.91, 9: 0.88}`.",
        "Gunakan for loop dengan `.items()` untuk mencari `best_k` dan `best_score` **tanpa** memakai `max()`. Cetak `K terbaik: 5 (0.92)`.",
      ],
      starter: `hasil = {1: 0.84, 3: 0.89, 5: 0.92, 7: 0.91, 9: 0.88}
best_k = None
best_score = 0
# Tulis kodemu di sini
`,
      solution: `hasil = {1: 0.84, 3: 0.89, 5: 0.92, 7: 0.91, 9: 0.88}
best_k = None
best_score = 0
for k, skor in hasil.items():
    if skor > best_score:
        best_score = skor
        best_k = k
print(f"K terbaik: {best_k} ({best_score})")`,
      tests: [
        { desc: "best_k = 5", expr: "best_k == 5" },
        { desc: "best_score = 0.92", expr: "best_score == 0.92" },
        { desc: "Tidak memakai max()", expr: "'max(' not in _code" },
        { desc: "Output sesuai", expr: "_lines == ['K terbaik: 5 (0.92)']" },
      ],
      hints: ["Konsep: mencari nilai terbaik dengan loop.", "Bandingkan setiap skor dengan best_score; jika lebih besar, perbarui keduanya.", "`for k, skor in hasil.items():` lalu `if skor > best_score:`"],
      explanation: "Pola \"simpan yang terbaik sejauh ini\" adalah inti dari hyperparameter tuning sederhana.",
    },
  ],
  quiz: [
    { id: "py-for-q1", type: "predict", prompt: "Apa outputnya?", code: `s = 0\nfor i in range(4):\n    s += i\nprint(s)`, options: ["10", "6", "4", "3"], answer: 1, explanation: "0 + 1 + 2 + 3 = 6." },
    { id: "py-for-q2", type: "mcq", prompt: "`range(3, 9, 2)` menghasilkan…", options: ["3, 5, 7, 9", "3, 5, 7", "3, 4, 5, 6, 7, 8", "2, 4, 6, 8"], answer: 1, explanation: "Mulai 3, langkah 2, berhenti sebelum 9." },
    { id: "py-for-q3", type: "tf", prompt: "`continue` menghentikan loop sepenuhnya.", answer: false, explanation: "Itu `break`. `continue` hanya melompati sisa iterasi saat ini." },
    { id: "py-for-q4", type: "fill", prompt: "Fungsi yang memberikan index dan elemen sekaligus di dalam for loop adalah ____()", answer: ["enumerate", "enumerate()"], explanation: "`for i, x in enumerate(data):`" },
    { id: "py-for-q5", type: "predict", prompt: "Apa outputnya?", code: `for x in [1, 2, 3, 4]:\n    if x == 3:\n        break\n    print(x)`, options: ["1\n2", "1\n2\n3", "1\n2\n4", "3"], answer: 0, explanation: "Loop berhenti saat x == 3 sebelum mencetaknya." },
  ],
  challenge: {
    id: "py-for-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Evaluasi prediksi manual",
    prompt: [
      "Label asli `y_true = [1, 0, 1, 1, 0, 1, 0, 0]` dan prediksi `y_pred = [1, 0, 0, 1, 0, 1, 1, 0]`.",
      "Dengan **satu** for loop (petunjuk: `zip(y_true, y_pred)` memasangkan elemen kedua list), hitung:",
      "- `tp` (asli 1, prediksi 1), `tn` (0, 0), `fp` (asli 0, prediksi 1), `fn` (asli 1, prediksi 0)",
      "- `accuracy` = (tp + tn) / jumlah data",
      "Cetak:\n```\nTP=3 TN=3 FP=1 FN=1\nAccuracy: 0.75\n```",
    ],
    starter: `y_true = [1, 0, 1, 1, 0, 1, 0, 0]
y_pred = [1, 0, 0, 1, 0, 1, 1, 0]
tp = tn = fp = fn = 0
# Tulis kodemu di sini
`,
    solution: `y_true = [1, 0, 1, 1, 0, 1, 0, 0]
y_pred = [1, 0, 0, 1, 0, 1, 1, 0]
tp = tn = fp = fn = 0
for asli, pred in zip(y_true, y_pred):
    if asli == 1 and pred == 1:
        tp += 1
    elif asli == 0 and pred == 0:
        tn += 1
    elif asli == 0 and pred == 1:
        fp += 1
    else:
        fn += 1
accuracy = (tp + tn) / len(y_true)
print(f"TP={tp} TN={tn} FP={fp} FN={fn}")
print("Accuracy:", accuracy)`,
    tests: [
      { desc: "tp=3, tn=3, fp=1, fn=1", expr: "(tp, tn, fp, fn) == (3, 3, 1, 1)" },
      { desc: "accuracy = 0.75", expr: "accuracy == 0.75" },
      { desc: "Output sesuai", expr: "_lines == ['TP=3 TN=3 FP=1 FN=1', 'Accuracy: 0.75']" },
    ],
    hints: ["Konsep: for loop + if/elif + zip.", "`for asli, pred in zip(y_true, y_pred):`", "Empat cabang untuk empat kombinasi; tambahkan 1 ke counter yang sesuai."],
    explanation: "Kamu baru saja membuat **confusion matrix** secara manual — fondasi Module 14 Model Evaluation.",
  },
  summary: [
    "`for x in koleksi:` mengulang blok untuk setiap elemen.",
    "`range(start, stop, step)` — stop tidak ikut; default start 0.",
    "Pola akumulator: inisialisasi sebelum loop, perbarui di dalam loop.",
    "`enumerate()` → (index, elemen); `d.items()` → (key, value); `zip(a, b)` → pasangan.",
    "`break` menghentikan loop; `continue` melompat ke iterasi berikutnya.",
  ],
  cheatsheet: [
    { syntax: "for x in data:", desc: "Loop koleksi" },
    { syntax: "for i in range(n):", desc: "Ulang n kali" },
    { syntax: "for i, x in enumerate(data):", desc: "Index + elemen" },
    { syntax: "for k, v in d.items():", desc: "Loop dictionary" },
    { syntax: "for a, b in zip(x, y):", desc: "Loop dua list berpasangan" },
    { syntax: "break / continue", desc: "Kontrol loop" },
  ],
  flashcards: [
    { q: "Ulangi untuk angka 1 sampai 10", a: "for i in range(1, 11):" },
    { q: "Loop dictionary skor untuk mendapat nama model dan nilainya", a: "for model, s in skor.items():" },
    { q: "Loop list dengan index dan nilai", a: "for i, x in enumerate(data):" },
    { q: "Loop dua list y_true dan y_pred berpasangan", a: "for a, p in zip(y_true, y_pred):" },
  ],
  references: [
    pyDoc("The Python Tutorial — 4.2 for Statements", "tutorial/controlflow.html#for-statements"),
    pyDoc("The Python Tutorial — 4.3 The range() Function", "tutorial/controlflow.html#the-range-function"),
    pyDoc("The Python Tutorial — 4.4 break and continue Statements", "tutorial/controlflow.html#break-and-continue-statements"),
    pyDoc("The Python Tutorial — 5.6 Looping Techniques", "tutorial/datastructures.html#looping-techniques"),
    kagglePy("Loops and List Comprehensions (Kaggle Learn Python)", "loops-and-list-comprehensions"),
  ],
};
