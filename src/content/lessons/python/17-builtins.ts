import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-built-in-functions",
  title: "Built-in Functions",
  minutes: 45,
  prerequisites: ["py-functions"],
  objectives: [
    "Mengenal fungsi bawaan Python yang paling sering dipakai di Data Science.",
    "Memakai `len`, `sum`, `min`, `max`, `abs`, `round` untuk ringkasan data.",
    "Memakai `sorted` dengan parameter `key` dan `reverse`.",
    "Memakai `zip`, `enumerate`, `range`, `map`, `any`, `all`.",
    "Mencari bantuan dengan `help()`, `type()`, dan `dir()`.",
  ],
  definition: [
    "**Built-in functions** adalah fungsi yang langsung tersedia di Python tanpa `import`. Kamu sudah memakai beberapa di antaranya: `print`, `len`, `type`, `int`, `range`.",
    "Fungsi bawaan ditulis dalam bahasa C sehingga cepat dan teruji. Sebelum menulis loop sendiri untuk menjumlahkan, mencari maksimum, atau mengurutkan — gunakan fungsi bawaan.",
    "Beberapa fungsi menerima parameter **`key`**, yaitu sebuah *fungsi* yang menentukan dasar perbandingan. Contoh: `sorted(kata, key=len)` mengurutkan berdasarkan panjang. Di sini kita memberikan nama fungsi **tanpa** tanda kurung — fungsinya diserahkan, bukan dipanggil.",
  ],
  why: [
    "Statistik ringkas (jumlah, rata-rata, min, max) adalah langkah pertama memahami data. Fungsi bawaan memberikannya dalam satu baris.",
    "`zip` dan `enumerate` membuat loop lebih rapi saat membandingkan `y_true` dan `y_pred`. `any`/`all` berguna untuk validasi (misalnya: apakah ada nilai negatif?).",
    "`help()` dan `dir()` melatih kemandirian: kamu bisa menyelidiki fungsi dan objek apa pun tanpa bertanya ke AI.",
  ],
  when: [
    "- Ringkasan cepat list: `len`, `sum`, `min`, `max`.",
    "- Mengurutkan berdasarkan kriteria: `sorted(..., key=..., reverse=True)`.",
    "- Iterasi berpasangan atau dengan index: `zip`, `enumerate`.",
    "- Validasi: `any`, `all`, `isinstance`.",
  ],
  analogy: "Fungsi bawaan seperti **peralatan standar di dapur** (pisau, panci, sendok) yang sudah tersedia saat kamu pindah ke rumah baru. Kamu tidak perlu membuatnya sendiri — cukup tahu kapan memakai alat yang tepat.",
  syntax: {
    code: `len(x)  sum(x)  min(x)  max(x)
sorted(x, key=fungsi, reverse=True)
zip(a, b)  enumerate(x)  range(n)
any(kondisi)  all(kondisi)
help(fungsi)  dir(objek)`,
  },
  anatomy: [
    ["len(x)", "Jumlah elemen."],
    ["sum(x)", "Jumlah semua angka."],
    ["min(x) / max(x)", "Nilai terkecil / terbesar; menerima `key=`."],
    ["sorted(x, key=f)", "List baru terurut berdasarkan hasil f(elemen)."],
    ["zip(a, b)", "Memasangkan elemen a dan b berdasarkan posisi."],
    ["map(f, x)", "Menerapkan f ke setiap elemen x (hasilnya diubah ke list agar terlihat)."],
    ["any(x) / all(x)", "True jika minimal satu / semua elemen truthy."],
    ["help(f)", "Menampilkan dokumentasi f."],
  ],
  examples: [
    {
      title: "Contoh 1 — Ringkasan data dengan len, sum, min, max",
      code: `harga = [450, 1200, 875, 980, 620]
print("Jumlah data:", len(harga))
print("Total:", sum(harga))
print("Min/Max:", min(harga), max(harga))
print("Rata-rata:", sum(harga) / len(harga))
print("Rentang:", max(harga) - min(harga))`,
      output: "Jumlah data: 5\nTotal: 4125\nMin/Max: 450 1200\nRata-rata: 825.0\nRentang: 750",
      explain: [
        ["len(harga)", "Banyaknya elemen."],
        ["sum(harga)", "Total seluruh nilai."],
        ["sum(harga) / len(harga)", "Rata-rata (mean) — rumus statistik pertama di Module 05."],
        ["max(harga) - min(harga)", "Range: ukuran sebaran data paling sederhana."],
      ],
    },
    {
      title: "Contoh 2 — sorted() dengan key dan reverse",
      code: `fitur = ["age", "monthly_charges", "tenure", "city"]
print(sorted(fitur))
print(sorted(fitur, key=len))
print(sorted(fitur, key=len, reverse=True)[0])

skor = {"KNN": 0.91, "SVM": 0.94, "Tree": 0.88}
peringkat = sorted(skor, key=skor.get, reverse=True)
print(peringkat)`,
      output: "['age', 'city', 'monthly_charges', 'tenure']\n['age', 'city', 'tenure', 'monthly_charges']\nmonthly_charges\n['SVM', 'KNN', 'Tree']",
      explain: [
        ["sorted(fitur)", "Urut alfabet."],
        ["sorted(fitur, key=len)", "Urut berdasarkan panjang string; `len` diberikan tanpa kurung."],
        ["sorted(fitur, key=len, reverse=True)[0]", "Nama kolom terpanjang."],
        ["sorted(skor, key=skor.get, reverse=True)", "Mengurutkan nama model berdasarkan skornya — leaderboard sederhana."],
      ],
      change: "Parameter `key` memungkinkan pengurutan berdasarkan kriteria apa pun.",
    },
    {
      title: "Contoh 3 — zip(), enumerate(), map()",
      code: `y_true = [3.0, 5.0, 2.5]
y_pred = [2.5, 5.0, 3.0]
for i, (a, p) in enumerate(zip(y_true, y_pred), start=1):
    print(f"Data {i}: asli={a}, prediksi={p}, error={a - p}")

teks = ["10", "20", "30"]
angka = list(map(int, teks))
print(angka, sum(angka))`,
      output: "Data 1: asli=3.0, prediksi=2.5, error=0.5\nData 2: asli=5.0, prediksi=5.0, error=0.0\nData 3: asli=2.5, prediksi=3.0, error=-0.5\n[10, 20, 30] 60",
      explain: [
        ["zip(y_true, y_pred)", "Memasangkan elemen ke-i dari kedua list."],
        ["enumerate(zip(y_true, y_pred), start=1)", "Menambahkan nomor urut mulai 1 pada setiap pasangan."],
        ["(a, p)", "Unpacking pasangan dari zip di dalam enumerate."],
        ["list(map(int, teks))", "Menerapkan `int` ke setiap elemen — mengubah semua teks menjadi angka."],
      ],
      change: "Fungsi-fungsi ini membuat loop pada beberapa list sekaligus menjadi ringkas.",
    },
    {
      title: "Contoh 4 — any() dan all() untuk validasi data",
      code: `umur = [25, 31, -2, 40]
print("Ada umur negatif?", any(u < 0 for u in umur))
print("Semua umur >= 18?", all(u >= 18 for u in umur))

kolom = ["age", "income"]
print(all(isinstance(c, str) for c in kolom))`,
      output: "Ada umur negatif? True\nSemua umur >= 18? False\nTrue",
      explain: [
        ["any(u < 0 for u in umur)", "Memeriksa setiap umur; True jika **minimal satu** negatif. Bentuk `(... for u in umur)` adalah *generator expression* — seperti for loop yang ditulis di dalam kurung."],
        ["all(u >= 18 for u in umur)", "True hanya jika **semua** memenuhi syarat."],
      ],
      change: "Validasi kualitas data dalam satu baris. (Generator expression di sini cukup dipahami polanya; detail comprehension dibahas sebagai materi lanjutan.)",
    },
    {
      title: "Contoh 5 — Mencari bantuan sendiri: help(), type(), dir()",
      code: `def hitung_mae(y_true, y_pred):
    """Menghitung Mean Absolute Error."""
    return sum(abs(a - p) for a, p in zip(y_true, y_pred)) / len(y_true)

help(hitung_mae)
print(type(hitung_mae).__name__)
print([m for m in dir("teks") if m.startswith("st")])`,
      output: "Help on function hitung_mae in module __main__:\n\nhitung_mae(y_true, y_pred)\n    Menghitung Mean Absolute Error.\n\nfunction\n['startswith', 'strip']",
      explain: [
        ["help(hitung_mae)", "Menampilkan tanda tangan fungsi dan docstring-nya. Coba juga `help(sorted)` atau `help(str.split)`."],
        ["type(hitung_mae).__name__", "Fungsi juga objek, tipenya `function`."],
        ["dir(\"teks\")", "Daftar semua atribut/method yang dimiliki string. Di sini disaring yang diawali \"st\"."],
      ],
      change: "Alat untuk belajar mandiri: menyelidiki fungsi dan method tanpa membuka internet.",
    },
  ],
  params: [
    {
      title: "Parameter penting",
      items: [
        { name: "sorted(iterable, key=None, reverse=False)", desc: "`key` = fungsi kriteria; `reverse=True` untuk menurun." },
        { name: "max(iterable, key=None, default=...)", desc: "`key` menentukan dasar perbandingan; `default` dipakai bila iterable kosong." },
        { name: "sum(iterable, start=0)", desc: "Jumlahkan; `start` adalah nilai awal." },
        { name: "round(number, ndigits=None)", desc: "Pembulatan (banker's rounding untuk .5)." },
        { name: "enumerate(iterable, start=0)", desc: "Index mulai dari `start`." },
        { name: "zip(*iterables, strict=False)", desc: "Berhenti di list terpendek; `strict=True` memunculkan error bila panjang berbeda." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `x = [4, -9, 2]\nprint(max(x, key=abs), sorted(x, key=abs))`, output: "-9 [2, 4, -9]" },
  tryIt: `nilai = [78, 92, 65, 88, 71]
print("n =", len(nilai))
print("mean =", sum(nilai) / len(nilai))
print("terurut:", sorted(nilai, reverse=True))
print("semua lulus (>=70)?", all(n >= 70 for n in nilai))`,
  mistakes: [
    {
      title: "Menimpa nama fungsi bawaan",
      wrong: `sum = 10
print(sum([1, 2, 3]))`,
      error: "TypeError",
      fix: `total = 10
print(sum([1, 2, 3]))`,
      explain: "Setelah `sum = 10`, nama `sum` menunjuk angka, bukan fungsi lagi. Jangan memakai nama bawaan untuk variabel.",
    },
    {
      title: "Memanggil fungsi pada parameter key",
      wrong: `print(sorted(["aa", "b"], key=len()))`,
      error: "TypeError",
      fix: `print(sorted(["aa", "b"], key=len))`,
      explain: "`key` menerima fungsinya sendiri (`len`), bukan hasil pemanggilannya (`len()`).",
    },
    {
      title: "max() pada list kosong",
      wrong: `print(max([]))`,
      error: "ValueError",
      fix: `print(max([], default=0))`,
      explain: "Gunakan `default` atau pastikan data tidak kosong.",
    },
    {
      title: "sum() pada list string",
      wrong: `print(sum(["1", "2"]))`,
      error: "TypeError",
      fix: `print(sum(map(int, ["1", "2"])))`,
      explain: "`sum` hanya untuk angka; konversi terlebih dahulu.",
    },
  ],
  bestPractices: [
    "Utamakan fungsi bawaan daripada menulis loop manual untuk operasi umum.",
    "Jangan pernah memberi nama variabel `sum`, `max`, `min`, `list`, `dict`, `type`, `input`.",
    "Gunakan `help()` saat lupa urutan parameter — kebiasaan yang membuatmu tidak bergantung pada AI.",
    "Gunakan `zip(..., strict=True)` saat dua list wajib sama panjang (misalnya y_true dan y_pred).",
  ],
  exercises: [
    {
      id: "py-builtin-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Statistik ringkas",
      prompt: "Lengkapi agar program mencetak jumlah data dan nilai maksimum: `5 0.97`.",
      starter: `akurasi = [0.91, 0.88, 0.97, 0.85, 0.93]
print(____(akurasi), ____(akurasi))`,
      solution: `akurasi = [0.91, 0.88, 0.97, 0.85, 0.93]
print(len(akurasi), max(akurasi))`,
      tests: [{ desc: "Output '5 0.97'", expr: "_lines == ['5 0.97']" }],
      hints: ["Konsep: fungsi bawaan ringkasan.", "Satu menghitung banyaknya elemen, satu mencari yang terbesar.", "`len(...)` dan `max(...)`"],
      explanation: "`len` = banyak data, `max` = nilai terbesar.",
    },
    {
      id: "py-builtin-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `kata = ["data", "ai", "model"]
print(sorted(kata, key=len))
print(max(kata, key=len), min(kata))
print(list(zip([1, 2, 3], "ab")))`,
      answer: "['ai', 'data', 'model']\nmodel ai\n[(1, 'a'), (2, 'b')]",
      hints: ["Konsep: key=len, min alfabet, zip berhenti di yang terpendek.", "min tanpa key membandingkan secara alfabet.", "zip hanya membentuk 2 pasangan."],
      explanation: "Urut panjang: ai(2), data(4), model(5). min alfabet = 'ai'. zip berhenti saat 'ab' habis.",
    },
    {
      id: "py-builtin-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Nama bawaan tertimpa",
      prompt: "Kode ini error karena nama fungsi bawaan dipakai sebagai variabel. Perbaiki (ganti nama variabelnya) agar mencetak `Total 60, rata-rata 20.0`.",
      starter: `sum = 0
data = [10, 20, 30]
total = sum(data)
print(f"Total {total}, rata-rata {total / len(data)}")`,
      solution: `awal = 0
data = [10, 20, 30]
total = sum(data)
print(f"Total {total}, rata-rata {total / len(data)}")`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output benar", expr: "_lines == ['Total 60, rata-rata 20.0']" },
        { desc: "Tidak ada baris 'sum = '", expr: "'sum =' not in _code and 'sum=' not in _code" },
      ],
      hints: ["Konsep: shadowing nama bawaan.", "Baris pertama menimpa fungsi sum.", "Ganti nama variabel di baris 1 (atau hapus baris itu)."],
      explanation: "Setelah `sum = 0`, `sum(data)` berarti `0(data)` → TypeError: 'int' object is not callable.",
    },
    {
      id: "py-builtin-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Leaderboard model",
      prompt: [
        "Diberikan `skor = {\"Logistic\": 0.81, \"Forest\": 0.89, \"KNN\": 0.84, \"Boosting\": 0.91}`.",
        "Buat `peringkat` = list nama model terurut dari skor tertinggi memakai `sorted` dengan `key` dan `reverse`. Lalu cetak setiap model dengan nomor urut mulai 1 memakai `enumerate`:",
        "```\n1. Boosting (0.91)\n2. Forest (0.89)\n3. KNN (0.84)\n4. Logistic (0.81)\n```",
      ],
      starter: `skor = {"Logistic": 0.81, "Forest": 0.89, "KNN": 0.84, "Boosting": 0.91}
# Tulis kodemu di sini
`,
      solution: `skor = {"Logistic": 0.81, "Forest": 0.89, "KNN": 0.84, "Boosting": 0.91}
peringkat = sorted(skor, key=skor.get, reverse=True)
for i, nama in enumerate(peringkat, start=1):
    print(f"{i}. {nama} ({skor[nama]})")`,
      tests: [
        { desc: "peringkat benar", expr: "peringkat == ['Boosting', 'Forest', 'KNN', 'Logistic']" },
        { desc: "Memakai sorted dan enumerate", expr: "'sorted(' in _code and 'enumerate(' in _code" },
        { desc: "Output sesuai", expr: "_lines == ['1. Boosting (0.91)', '2. Forest (0.89)', '3. KNN (0.84)', '4. Logistic (0.81)']" },
      ],
      hints: ["Konsep: sorted dengan key + enumerate start=1.", "`sorted(skor, key=skor.get, reverse=True)`", "`for i, nama in enumerate(peringkat, start=1):`"],
      explanation: "Kombinasi `sorted` + `enumerate` adalah cara rapi menampilkan hasil perbandingan model.",
    },
    {
      id: "py-builtin-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Validasi kolom numerik",
      prompt: [
        "Satu kolom data terbaca sebagai teks: `raw = [\"12\", \"7\", \"30\", \"18\"]`.",
        "Ubah menjadi list angka `nilai` dengan `map`, lalu buat `semua_positif` (apakah semua > 0, pakai `all`) dan `ada_outlier` (apakah ada yang > 25, pakai `any`). Cetak `[12, 7, 30, 18] True True`.",
      ],
      starter: `raw = ["12", "7", "30", "18"]
# Tulis kodemu di sini
`,
      solution: `raw = ["12", "7", "30", "18"]
nilai = list(map(int, raw))
semua_positif = all(v > 0 for v in nilai)
ada_outlier = any(v > 25 for v in nilai)
print(nilai, semua_positif, ada_outlier)`,
      tests: [
        { desc: "nilai = [12, 7, 30, 18]", expr: "nilai == [12, 7, 30, 18]" },
        { desc: "semua_positif True", expr: "semua_positif is True" },
        { desc: "ada_outlier True", expr: "ada_outlier is True" },
        { desc: "Memakai map, all, any", expr: "all(f in _code for f in ['map(', 'all(', 'any('])" },
      ],
      hints: ["Konsep: map untuk konversi, all/any untuk validasi.", "`list(map(int, raw))`", "`all(v > 0 for v in nilai)` dan `any(v > 25 for v in nilai)`"],
      explanation: "Validasi semacam ini dilakukan sebelum preprocessing untuk menemukan data tidak wajar.",
    },
  ],
  quiz: [
    { id: "py-builtin-q1", type: "predict", prompt: "Apa outputnya?", code: `print(sum([1, 2, 3], 10), max([3, -7, 5], key=abs))`, options: ["16 -7", "6 5", "16 5", "Error"], answer: 0, explanation: "sum dengan start 10 → 16; max berdasarkan nilai mutlak → -7." },
    { id: "py-builtin-q2", type: "mcq", prompt: "Fungsi untuk menampilkan dokumentasi sebuah fungsi di Python adalah…", options: ["doc()", "help()", "info()", "man()"], answer: 1, explanation: "`help(nama_fungsi)`." },
    { id: "py-builtin-q3", type: "tf", prompt: "`all([])` (list kosong) bernilai True.", answer: true, explanation: "Secara logika, \"semua elemen\" dari himpunan kosong memenuhi syarat (vacuous truth). `any([])` bernilai False." },
    { id: "py-builtin-q4", type: "fill", prompt: "Fungsi bawaan untuk memasangkan elemen dua list berdasarkan posisi adalah ____()", answer: ["zip", "zip()"], explanation: "`zip(a, b)`." },
    { id: "py-builtin-q5", type: "case", prompt: "Kamu menulis `max = max(skor)` di awal notebook, lalu 20 sel kemudian `max(nilai)` error. Penyebabnya?", options: ["Bug Python", "Nama fungsi bawaan max tertimpa oleh variabel", "list nilai kosong", "max hanya untuk dict"], answer: 1, explanation: "Shadowing nama bawaan — restart kernel dan ganti nama variabel." },
  ],
  challenge: {
    id: "py-builtin-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Ringkasan statistik satu kolom",
    prompt: [
      "Tulis fungsi `describe(data)` yang mengembalikan **dictionary** dengan key: `count`, `mean`, `min`, `max`, `range` — memakai fungsi bawaan (tanpa loop manual).",
      "Uji: `print(describe([450, 1200, 875, 980, 620]))` →\n`{'count': 5, 'mean': 825.0, 'min': 450, 'max': 1200, 'range': 750}`",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `def describe(data):
    return {
        "count": len(data),
        "mean": sum(data) / len(data),
        "min": min(data),
        "max": max(data),
        "range": max(data) - min(data),
    }

print(describe([450, 1200, 875, 980, 620]))`,
    tests: [
      { desc: "Contoh soal", expr: "describe([450, 1200, 875, 980, 620]) == {'count': 5, 'mean': 825.0, 'min': 450, 'max': 1200, 'range': 750}" },
      { desc: "Data lain", expr: "describe([2, 4]) == {'count': 2, 'mean': 3.0, 'min': 2, 'max': 4, 'range': 2}" },
      { desc: "Tanpa for loop manual", expr: "'for ' not in _code" },
    ],
    hints: ["Konsep: fungsi bawaan di dalam fungsi buatan sendiri.", "Kembalikan dictionary dengan 5 key.", "`\"mean\": sum(data) / len(data)`"],
    explanation: "Inilah versi mini dari `df.describe()` di Pandas yang akan kamu pelajari di Module 04.",
  },
  summary: [
    "Fungsi bawaan tersedia tanpa import: `len`, `sum`, `min`, `max`, `abs`, `round`, `sorted`, `zip`, `enumerate`, `map`, `any`, `all`.",
    "Parameter `key` menerima fungsi (tanpa kurung) sebagai dasar perbandingan.",
    "`zip` memasangkan list; `enumerate` menambahkan index.",
    "`any`/`all` untuk validasi cepat.",
    "`help()`, `type()`, `dir()` untuk belajar mandiri.",
  ],
  cheatsheet: [
    { syntax: "sum(x) / len(x)", desc: "Rata-rata" },
    { syntax: "sorted(x, key=len, reverse=True)", desc: "Urut dengan kriteria" },
    { syntax: "sorted(d, key=d.get, reverse=True)", desc: "Urut key dict berdasarkan value" },
    { syntax: "list(map(int, x))", desc: "Konversi semua elemen" },
    { syntax: "any(v < 0 for v in x)", desc: "Ada yang negatif?" },
    { syntax: "help(fungsi)", desc: "Dokumentasi" },
  ],
  flashcards: [
    { q: "Urutkan list kata berdasarkan panjangnya", a: "sorted(kata, key=len)" },
    { q: "Ubah list string angka menjadi list int", a: "list(map(int, teks))" },
    { q: "Cek apakah ada nilai negatif di list x", a: "any(v < 0 for v in x)" },
    { q: "Lihat dokumentasi fungsi sorted", a: "help(sorted)" },
  ],
  references: [
    pyDoc("Built-in Functions (daftar lengkap)", "library/functions.html"),
    pyDoc("Built-in Functions — sorted()", "library/functions.html#sorted"),
    pyDoc("Built-in Functions — zip()", "library/functions.html#zip"),
    pyDoc("Built-in Functions — help()", "library/functions.html#help"),
    pyDoc("Sorting Techniques (HOWTO)", "howto/sorting.html"),
    kagglePy("Functions and Getting Help (Kaggle Learn Python)", "functions-and-getting-help"),
  ],
};
