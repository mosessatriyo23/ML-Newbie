import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-list",
  title: "List",
  minutes: 50,
  prerequisites: ["py-strings", "py-operators"],
  visual: "list-index",
  objectives: [
    "Membuat list dan memahami bahwa list menyimpan banyak nilai secara berurutan.",
    "Mengakses elemen dengan indexing (positif & negatif) dan slicing.",
    "Mengubah list: mengganti elemen, `append()`, `insert()`, `remove()`, `pop()`.",
    "Mengurutkan dengan `sort()` (mengubah list) dan `sorted()` (membuat list baru).",
    "Memahami list bersarang (nested list) sebagai bentuk sederhana tabel data.",
  ],
  definition: [
    "**List** adalah tipe data koleksi yang menyimpan **banyak nilai berurutan** di dalam satu variabel. List ditulis dengan kurung siku: `nilai = [80, 90, 75]`. Setiap nilai di dalamnya disebut **elemen** (item).",
    "List bersifat:\n- **Ordered** — urutan elemen tetap dan punya index mulai 0.\n- **Mutable** — isinya boleh diubah, ditambah, atau dihapus setelah dibuat (berbeda dengan string dan tuple).\n- **Boleh berisi tipe campuran** dan **boleh duplikat**: `[1, \"a\", 1, True]`.",
    "Aturan indexing dan slicing list sama dengan string: `data[0]` elemen pertama, `data[-1]` elemen terakhir, `data[1:3]` index 1 sampai sebelum 3. Coba visualisasi interaktif di bawah.",
    "Karena mutable, hati-hati: `b = a` membuat **dua nama untuk list yang sama**. Mengubah `b` juga mengubah `a`. Gunakan `a.copy()` untuk membuat salinan.",
  ],
  why: [
    "List adalah fondasi sebelum NumPy array dan kolom Pandas. Daftar nama kolom (`[\"age\", \"income\"]`), daftar model yang dibandingkan, dan daftar skor cross-validation semuanya berupa list.",
    "Banyak fungsi scikit-learn dan Pandas menerima list sebagai argumen, misalnya `df[[\"Name\", \"Age\"]]` atau `pd.read_csv(..., usecols=[\"Name\", \"Age\"])`.",
  ],
  when: [
    "- Menyimpan sekumpulan nilai yang urutannya penting (nilai per epoch, daftar fitur).",
    "- Mengumpulkan hasil satu per satu dengan `append()` (terutama di dalam loop).",
    "- Untuk data numerik berukuran besar, nanti gunakan NumPy array karena jauh lebih cepat.",
  ],
  analogy: "List seperti **gerbong kereta bernomor**. Gerbong pertama bernomor 0. Kamu bisa menambah gerbong di belakang (`append`), menyisipkan di tengah (`insert`), atau melepas gerbong (`pop`). Slicing seperti mengambil rangkaian gerbong nomor 1 sampai 3.",
  syntax: {
    code: `data = [a, b, c]
data[0]            # elemen pertama
data[1:3]          # slicing
data.append(x)     # tambah di akhir
data.pop()         # ambil & hapus elemen terakhir
len(data)          # jumlah elemen`,
  },
  anatomy: [
    ["[ ]", "Kurung siku untuk membuat list. `[]` = list kosong."],
    ["data[i]", "Elemen pada index i."],
    ["data[i] = x", "Mengganti elemen index i (bisa karena list mutable)."],
    [".append(x)", "Menambah x di akhir list."],
    [".insert(i, x)", "Menyisipkan x di posisi i."],
    [".remove(x)", "Menghapus kemunculan pertama nilai x."],
    [".pop(i)", "Menghapus dan **mengembalikan** elemen index i (default terakhir)."],
    [".sort()", "Mengurutkan list itu sendiri (in-place), mengembalikan None."],
    ["sorted(data)", "Fungsi yang mengembalikan list baru yang terurut."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat list, len(), dan indexing",
      code: `nilai = [80, 90, 75, 95]
print(nilai)
print(len(nilai))
print(nilai[0], nilai[-1])`,
      output: "[80, 90, 75, 95]\n4\n80 95",
      explain: [
        ["nilai = [80, 90, 75, 95]", "List berisi 4 angka."],
        ["len(nilai)", "Jumlah elemen: 4."],
        ["nilai[0], nilai[-1]", "Elemen pertama (index 0) dan terakhir (index -1)."],
      ],
    },
    {
      title: "Contoh 2 — Slicing dan membership",
      code: `fitur = ["sepal_length", "sepal_width", "petal_length", "petal_width", "species"]
print(fitur[:4])
print(fitur[2:4])
print(fitur[-1])
print("species" in fitur)`,
      output: "['sepal_length', 'sepal_width', 'petal_length', 'petal_width']\n['petal_length', 'petal_width']\nspecies\nTrue",
      explain: [
        ["fitur[:4]", "Index 0–3: empat fitur numerik (tanpa kolom target)."],
        ["fitur[2:4]", "Index 2 dan 3."],
        ["fitur[-1]", "Elemen terakhir — kolom target."],
        ["\"species\" in fitur", "Membership operator pada list."],
      ],
      change: "Slicing pada list menghasilkan list baru — persis cara memisahkan fitur dan target secara manual.",
    },
    {
      title: "Contoh 3 — Mengubah list: ganti, append, insert, remove, pop",
      code: `models = ["KNN", "SVM"]
models.append("Random Forest")
models.insert(0, "Logistic Regression")
print(models)

models[1] = "KNN (k=5)"
models.remove("SVM")
terakhir = models.pop()
print(models)
print("Di-pop:", terakhir)`,
      output: "['Logistic Regression', 'KNN', 'SVM', 'Random Forest']\n['Logistic Regression', 'KNN (k=5)']\nDi-pop: Random Forest",
      explain: [
        ["models.append(\"Random Forest\")", "Menambah di akhir list."],
        ["models.insert(0, \"Logistic Regression\")", "Menyisipkan di index 0 (paling depan); elemen lain bergeser."],
        ["models[1] = \"KNN (k=5)\"", "Mengganti elemen index 1."],
        ["models.remove(\"SVM\")", "Menghapus elemen bernilai \"SVM\"."],
        ["terakhir = models.pop()", "Menghapus elemen terakhir sekaligus menyimpannya ke variabel."],
      ],
      change: "Sekarang list kita ubah isinya. Perhatikan: method ini mengubah list secara langsung (in-place).",
    },
    {
      title: "Contoh 4 — sort() vs sorted(), sum/min/max",
      code: `skor = [0.82, 0.91, 0.77, 0.88]
urut = sorted(skor)
print(urut)
print(skor)

skor.sort(reverse=True)
print(skor)
print(max(skor), min(skor), round(sum(skor) / len(skor), 3))`,
      output: "[0.77, 0.82, 0.88, 0.91]\n[0.82, 0.91, 0.77, 0.88]\n[0.91, 0.88, 0.82, 0.77]\n0.91 0.77 0.845",
      explain: [
        ["urut = sorted(skor)", "`sorted()` membuat list **baru** yang terurut; `skor` tidak berubah."],
        ["skor.sort(reverse=True)", "`.sort()` mengurutkan `skor` **itu sendiri**. `reverse=True` = dari besar ke kecil."],
        ["max(skor), min(skor)", "Nilai terbesar dan terkecil (detail di Built-in Functions)."],
        ["sum(skor) / len(skor)", "Rata-rata = jumlah / banyaknya elemen."],
      ],
      change: "Kita membedakan operasi yang mengubah list asli (`sort`) dan yang membuat list baru (`sorted`).",
    },
    {
      title: "Contoh 5 — Nested list dan jebakan aliasing",
      code: `data = [
    ["Andi", 21, 85],
    ["Budi", 22, 78],
]
print(data[1])
print(data[1][2])

a = [1, 2, 3]
b = a
c = a.copy()
b.append(4)
print(a, c)`,
      output: "['Budi', 22, 78]\n78\n[1, 2, 3, 4] [1, 2, 3]",
      explain: [
        ["data = [", "List berisi list — setiap list dalam adalah satu baris data (seperti tabel)."],
        ["data[1]", "Baris kedua."],
        ["data[1][2]", "Baris kedua, kolom ketiga: nilai 78. Index pertama = baris, kedua = kolom."],
        ["b = a", "b dan a menunjuk list yang **sama**."],
        ["c = a.copy()", "c adalah salinan terpisah."],
        ["b.append(4)", "Mengubah b juga mengubah a, tetapi c tidak terpengaruh."],
      ],
      change: "Nested list adalah bentuk sederhana tabel — cikal bakal DataFrame. Aliasing menjelaskan mengapa Pandas punya method `.copy()`.",
    },
  ],
  params: [
    {
      title: "Method list penting",
      items: [
        { name: ".append(x)", type: "method", desc: "Tambah satu elemen di akhir. Mengembalikan None." },
        { name: ".insert(i, x)", type: "method", desc: "Sisipkan x sebelum index i." },
        { name: ".extend(iterable)", type: "method", desc: "Tambahkan semua elemen dari list lain." },
        { name: ".remove(x)", type: "method", desc: "Hapus kemunculan pertama x; ValueError jika tidak ada." },
        { name: ".pop(i=-1)", type: "method", default: "-1", desc: "Hapus & kembalikan elemen index i." },
        { name: ".sort(key=None, reverse=False)", type: "method", desc: "Urutkan in-place. Mengembalikan None." },
        { name: ".index(x)", type: "method", desc: "Index kemunculan pertama x." },
        { name: ".count(x)", type: "method", desc: "Berapa kali x muncul." },
        { name: ".copy()", type: "method", desc: "Salinan dangkal (shallow copy) list." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `x = [3, 1, 2]\nx.append(0)\nprint(sorted(x), x)`, output: "[0, 1, 2, 3] [3, 1, 2, 0]" },
  tryIt: `epoch_loss = [0.92, 0.71, 0.55]
epoch_loss.append(0.48)          # loss epoch ke-4
print("Semua loss:", epoch_loss)
print("Loss terakhir:", epoch_loss[-1])
print("Loss terbaik:", min(epoch_loss))
print("3 epoch pertama:", epoch_loss[:3])`,
  mistakes: [
    {
      title: "Index di luar jangkauan",
      wrong: `kelas = ["setosa", "versicolor", "virginica"]
print(kelas[3])`,
      error: "IndexError",
      fix: `kelas = ["setosa", "versicolor", "virginica"]
print(kelas[2])`,
      explain: "3 elemen → index 0, 1, 2. Elemen terakhir bisa juga diambil dengan `kelas[-1]`.",
    },
    {
      title: "Menyimpan hasil .sort() atau .append()",
      wrong: `angka = [3, 1, 2]
angka = angka.sort()
print(angka)`,
      fix: `angka = [3, 1, 2]
angka.sort()
print(angka)`,
      explain: "`.sort()` dan `.append()` mengubah list in-place dan mengembalikan `None`. Kode yang salah mencetak `None`.",
    },
    {
      title: "remove nilai yang tidak ada",
      wrong: `kolom = ["age", "income"]
kolom.remove("gender")`,
      error: "ValueError",
      fix: `kolom = ["age", "income"]
if "gender" in kolom:
    kolom.remove("gender")
print(kolom)`,
      explain: "Periksa keberadaan dengan `in` sebelum menghapus. (`if` dibahas di Conditional Statements.)",
    },
  ],
  bestPractices: [
    "Gunakan nama jamak untuk list: `models`, `scores`, `features`.",
    "Ingat perbedaan `sort()` (in-place, return None) dan `sorted()` (list baru).",
    "Gunakan `.copy()` bila ingin memodifikasi salinan tanpa mengubah list asli.",
    "Untuk perhitungan numerik pada ribuan data, gunakan NumPy array (Module 02), bukan list.",
  ],
  exercises: [
    {
      id: "py-list-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Tambah elemen",
      prompt: "Lengkapi method agar `\"Decision Tree\"` ditambahkan di akhir list.",
      starter: `models = ["KNN", "SVM"]
models.____("Decision Tree")
print(models)`,
      solution: `models = ["KNN", "SVM"]
models.append("Decision Tree")
print(models)`,
      tests: [{ desc: "models = ['KNN', 'SVM', 'Decision Tree']", expr: "models == ['KNN', 'SVM', 'Decision Tree']" }],
      hints: ["Konsep: menambah elemen di akhir list.", "Method-nya berarti 'menambahkan' dalam bahasa Inggris.", "`models.append(\"Decision Tree\")`"],
      explanation: "`append()` menambahkan satu elemen di akhir list.",
    },
    {
      id: "py-list-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `x = [10, 20, 30, 40, 50]
print(x[1:4])
print(x[-2:])
x[0] = 99
x.pop(1)
print(x)`,
      answer: "[20, 30, 40]\n[40, 50]\n[99, 30, 40, 50]",
      hints: ["Konsep: slicing tidak termasuk stop; pop(1) menghapus index 1.", "x[1:4] → index 1, 2, 3.", "Setelah x[0] = 99: [99, 20, 30, 40, 50], lalu hapus index 1."],
      explanation: "Slicing [1:4] = [20, 30, 40]; [-2:] = [40, 50]; ganti index 0 lalu hapus index 1 (nilai 20).",
    },
    {
      id: "py-list-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Urutkan skor",
      prompt: "Kode ini seharusnya mencetak skor tertinggi pertama: `[0.95, 0.9, 0.85]`, tetapi mencetak `None`. Perbaiki.",
      starter: `skor = [0.9, 0.85, 0.95]
skor = skor.sort(reverse=True)
print(skor)`,
      solution: `skor = [0.9, 0.85, 0.95]
skor.sort(reverse=True)
print(skor)`,
      alternatives: [`skor = [0.9, 0.85, 0.95]
skor = sorted(skor, reverse=True)
print(skor)`],
      tests: [
        { desc: "skor terurut menurun", expr: "skor == [0.95, 0.9, 0.85]" },
        { desc: "Output benar", expr: "_lines == ['[0.95, 0.9, 0.85]']" },
      ],
      hints: ["Konsep: sort() mengembalikan None.", "Jangan menyimpan hasil `.sort()`, atau gunakan `sorted()`.", "Hapus `skor = ` di baris 2."],
      explanation: "Dua solusi diterima: `skor.sort(...)` in-place, atau `skor = sorted(skor, ...)`.",
    },
    {
      id: "py-list-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Pisahkan fitur dan target",
      prompt: [
        "Diberikan `kolom = [\"hours_studied\", \"attendance\", \"previous_score\", \"final_score\"]`.",
        "Buat `fitur` berisi semua kolom kecuali yang terakhir (pakai slicing) dan `target` berisi kolom terakhir (string). Cetak keduanya pada baris terpisah.",
      ],
      starter: `kolom = ["hours_studied", "attendance", "previous_score", "final_score"]
# Tulis kodemu di sini
`,
      solution: `kolom = ["hours_studied", "attendance", "previous_score", "final_score"]
fitur = kolom[:-1]
target = kolom[-1]
print(fitur)
print(target)`,
      tests: [
        { desc: "fitur berisi 3 kolom pertama", expr: "fitur == ['hours_studied', 'attendance', 'previous_score']" },
        { desc: "target = 'final_score'", expr: "target == 'final_score'" },
        { desc: "Memakai slicing", expr: "':' in _code" },
      ],
      hints: ["Konsep: slicing dengan index negatif.", "`[:-1]` = semua kecuali elemen terakhir.", "`fitur = kolom[:-1]` dan `target = kolom[-1]`"],
      explanation: "Pola ini sama dengan memilih X dan y: semua kolom kecuali target menjadi fitur.",
    },
    {
      id: "py-list-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Statistik skor cross-validation",
      prompt: [
        "Skor 5-fold cross-validation: `cv = [0.81, 0.86, 0.79, 0.84, 0.85]`.",
        "Hitung `rata` (rata-rata), `terbaik` (maks), `terburuk` (min), dan `rentang` = terbaik − terburuk. Cetak:\n`Rata: 0.83 | Terbaik: 0.86 | Rentang: 0.07` (bulatkan rata & rentang 2 desimal).",
      ],
      starter: `cv = [0.81, 0.86, 0.79, 0.84, 0.85]
# Tulis kodemu di sini
`,
      solution: `cv = [0.81, 0.86, 0.79, 0.84, 0.85]
rata = sum(cv) / len(cv)
terbaik = max(cv)
terburuk = min(cv)
rentang = terbaik - terburuk
print(f"Rata: {rata:.2f} | Terbaik: {terbaik} | Rentang: {rentang:.2f}")`,
      tests: [
        { desc: "rata ≈ 0.83", expr: "abs(rata - 0.83) < 1e-9" },
        { desc: "terbaik 0.86 dan terburuk 0.79", expr: "terbaik == 0.86 and terburuk == 0.79" },
        { desc: "rentang ≈ 0.07", expr: "abs(rentang - 0.07) < 1e-9" },
        { desc: "Output sesuai", expr: "_lines == ['Rata: 0.83 | Terbaik: 0.86 | Rentang: 0.07']" },
      ],
      hints: ["Konsep: sum, len, max, min pada list.", "Rata-rata = `sum(cv) / len(cv)`.", "Format: `f\"Rata: {rata:.2f} | ...\"`"],
      explanation: "Rentang skor menunjukkan seberapa stabil model di setiap fold — rentang kecil berarti performa konsisten.",
    },
  ],
  quiz: [
    { id: "py-list-q1", type: "predict", prompt: "Apa outputnya?", code: `a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))`, options: ["3", "4", "Error", "None"], answer: 1, explanation: "b dan a menunjuk list yang sama (aliasing)." },
    { id: "py-list-q2", type: "mcq", prompt: "Perbedaan `sorted(x)` dan `x.sort()`?", options: ["Tidak ada", "sorted membuat list baru; sort mengubah x dan mengembalikan None", "sort membuat list baru; sorted mengubah x", "sorted hanya untuk angka"], answer: 1, explanation: "`sorted()` → list baru; `.sort()` → in-place." },
    { id: "py-list-q3", type: "tf", prompt: "List di Python boleh berisi elemen dengan tipe data berbeda.", answer: true, explanation: "Contoh: `[\"Andi\", 21, True]`." },
    { id: "py-list-q4", type: "fill", prompt: "Lengkapi untuk mengambil elemen terakhir list `data`: `data[____]`", answer: ["-1"], explanation: "Index -1 = elemen terakhir." },
    { id: "py-list-q5", type: "predict", prompt: "Apa outputnya?", code: `t = [[1, 2], [3, 4], [5, 6]]\nprint(t[2][0] + t[0][1])`, options: ["7", "6", "8", "3"], answer: 0, explanation: "t[2][0] = 5, t[0][1] = 2 → 7." },
  ],
  challenge: {
    id: "py-list-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Kelola daftar fitur",
    prompt: [
      "Kamu punya `kolom = [\"customer_id\", \"age\", \"tenure_months\", \"monthly_charges\", \"churn\"]`.",
      "1. Simpan kolom target (`\"churn\"`, elemen terakhir) ke variabel `target` dengan `pop()`.",
      "2. Hapus `\"customer_id\"` dengan `remove()` karena ID tidak berguna untuk prediksi.",
      "3. Tambahkan fitur baru `\"total_charges\"` dengan `append()`.",
      "4. Urutkan `kolom` secara alfabet (in-place).",
      "Cetak `kolom` lalu `target`:\n```\n['age', 'monthly_charges', 'tenure_months', 'total_charges']\nchurn\n```",
    ],
    starter: `kolom = ["customer_id", "age", "tenure_months", "monthly_charges", "churn"]
# Tulis kodemu di sini
`,
    solution: `kolom = ["customer_id", "age", "tenure_months", "monthly_charges", "churn"]
target = kolom.pop()
kolom.remove("customer_id")
kolom.append("total_charges")
kolom.sort()
print(kolom)
print(target)`,
    tests: [
      { desc: "target = 'churn'", expr: "target == 'churn'" },
      { desc: "kolom akhir benar", expr: "kolom == ['age', 'monthly_charges', 'tenure_months', 'total_charges']" },
      { desc: "Memakai pop, remove, append, sort", expr: "all(m in _code for m in ['.pop(', '.remove(', '.append(', '.sort('])" },
      { desc: "Output sesuai", expr: "_lines == [\"['age', 'monthly_charges', 'tenure_months', 'total_charges']\", 'churn']" },
    ],
    hints: ["Konsep: method list yang mengubah list in-place.", "`target = kolom.pop()` mengambil elemen terakhir sekaligus menghapusnya.", "Urutan: pop → remove → append → sort → print."],
    explanation: "Inilah langkah persiapan daftar fitur sebelum membuat `X = df[kolom]` dan `y = df[target]`.",
  },
  summary: [
    "List: koleksi berurutan, mutable, boleh campuran & duplikat; dibuat dengan `[ ]`.",
    "Indexing `x[i]`, index negatif `x[-1]`, slicing `x[a:b]`.",
    "Ubah list: `x[i] = v`, `append`, `insert`, `remove`, `pop`, `extend`.",
    "`sort()` in-place (return None) vs `sorted()` list baru.",
    "`b = a` adalah alias; gunakan `a.copy()` untuk salinan. Nested list = tabel sederhana.",
  ],
  cheatsheet: [
    { syntax: "x = [1, 2, 3]", desc: "Buat list" },
    { syntax: "x[0], x[-1], x[1:3]", desc: "Index & slicing" },
    { syntax: "x.append(4)", desc: "Tambah di akhir" },
    { syntax: "x.pop()", desc: "Ambil & hapus terakhir" },
    { syntax: "x.remove(v)", desc: "Hapus nilai v" },
    { syntax: "sorted(x, reverse=True)", desc: "List baru terurut menurun" },
    { syntax: "sum(x) / len(x)", desc: "Rata-rata" },
  ],
  flashcards: [
    { q: "Tambahkan \"SVM\" di akhir list models", a: 'models.append("SVM")' },
    { q: "Semua elemen list kecuali yang terakhir", a: "x[:-1]" },
    { q: "Urutkan list skor dari besar ke kecil (in-place)", a: "skor.sort(reverse=True)" },
    { q: "Buat salinan list a yang terpisah", a: "b = a.copy()" },
  ],
  references: [
    pyDoc("The Python Tutorial — 3.1.3 Lists", "tutorial/introduction.html#lists"),
    pyDoc("The Python Tutorial — 5.1 More on Lists", "tutorial/datastructures.html#more-on-lists"),
    pyDoc("Built-in Types — Sequence Types: Lists", "library/stdtypes.html#lists"),
    pyDoc("Built-in Functions — sorted()", "library/functions.html#sorted"),
    kagglePy("Lists (Kaggle Learn Python)", "lists"),
  ],
};
