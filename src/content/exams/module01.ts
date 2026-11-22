import type { CodeTask, ExamDef, QuizQuestion } from "../../types.ts";

const q = (x: Omit<QuizQuestion, "skill">): QuizQuestion => ({ ...x, skill: "python" });

const BANK: QuizQuestion[] = [
  q({ id: "m01-q1", type: "predict", lessonId: "py-python-syntax", prompt: "Apa output kode berikut?", code: `print("A", "B", sep="")\nprint("C", end="-")\nprint("D")`, options: ["AB\nC-D", "A B\nC-\nD", "AB\nC\n-D", "A B\nC-D"], answer: 0, explanation: "sep=\"\" menghapus spasi; end=\"-\" mengganti baris baru dengan tanda minus." }),
  q({ id: "m01-q2", type: "mcq", lessonId: "py-comments", prompt: "Baris mana yang TIDAK dijalankan Python?", options: ["print(\"# halo\")", "# print(\"halo\")", "x = 5  # catatan", "print(5)  # lima"], answer: 1, explanation: "Seluruh baris yang diawali # adalah comment." }),
  q({ id: "m01-q3", type: "predict", lessonId: "py-variables", prompt: "Apa outputnya?", code: `a = 2\nb = a\na = a + 3\nprint(a, b)`, options: ["5 5", "5 2", "2 5", "3 2"], answer: 1, explanation: "b tetap menunjuk nilai lama (2)." }),
  q({ id: "m01-q4", type: "mcq", lessonId: "py-variables", prompt: "Nama variabel mana yang valid dan sesuai PEP 8?", options: ["TestSize", "test-size", "test_size", "1test_size"], answer: 2, explanation: "snake_case, tidak diawali angka, tanpa tanda minus." }),
  q({ id: "m01-q5", type: "predict", lessonId: "py-data-types", prompt: "Apa outputnya?", code: `print(type(10 / 5).__name__, int("7") + int(2.9))`, options: ["int 9", "float 9", "float 10", "int 10"], answer: 1, explanation: "`/` selalu float; int(2.9) = 2 → 7 + 2 = 9." }),
  q({ id: "m01-q6", type: "tf", lessonId: "py-data-types", prompt: "`bool(\"0\")` bernilai False.", answer: false, explanation: "String tidak kosong selalu True." }),
  q({ id: "m01-q7", type: "predict", lessonId: "py-numbers", prompt: "Apa outputnya?", code: `print(17 // 4, 17 % 4, 2 ** 4)`, options: ["4.25 1 8", "4 1 16", "4 1 8", "5 1 16"], answer: 1, explanation: "17 = 4 × 4 + 1; 2⁴ = 16." }),
  q({ id: "m01-q8", type: "mcq", lessonId: "py-numbers", prompt: "Hasil `round(2.5)` di Python adalah…", options: ["3", "2", "2.5", "Error"], answer: 1, explanation: "Banker's rounding: .5 dibulatkan ke bilangan genap terdekat." }),
  q({ id: "m01-q9", type: "predict", lessonId: "py-strings", prompt: "Apa outputnya?", code: `s = "  Data Science "\nprint(s.strip().lower().split(" "))`, options: ["['data', 'science']", "['Data', 'Science']", "['  data', 'science ']", "'data science'"], answer: 0, explanation: "strip → lower → split di spasi." }),
  q({ id: "m01-q10", type: "fill", lessonId: "py-strings", prompt: "Lengkapi f-string agar 0.8765 tampil sebagai `87.65%`: `f\"{acc:____}\"`", answer: [".2%"], explanation: "Format persen dengan 2 desimal." }),
  q({ id: "m01-q11", type: "predict", lessonId: "py-boolean", prompt: "Apa outputnya?", code: `x = 15\nprint(x > 10 and x % 2 == 0, x > 10 or x < 0, not x == 15)`, options: ["False True False", "True True False", "False False True", "True False False"], answer: 0, explanation: "15 ganjil → and False; or True; not True → False." }),
  q({ id: "m01-q12", type: "mcq", lessonId: "py-operators", prompt: "Cara yang benar memeriksa apakah `model` belum diisi?", options: ["model == None", "model is None", "model = None", "None in model"], answer: 1, explanation: "Gunakan `is None`." }),
  q({ id: "m01-q13", type: "predict", lessonId: "py-operators", prompt: "Apa outputnya?", code: `n = 3\nn += 2\nn *= 2\nprint(n, "py" in "python")`, options: ["10 True", "8 True", "10 False", "7 True"], answer: 0, explanation: "(3 + 2) × 2 = 10." }),
  q({ id: "m01-q14", type: "predict", lessonId: "py-list", prompt: "Apa outputnya?", code: `x = [5, 3, 8]\ny = x\ny.append(1)\nprint(len(x), sorted(x)[0])`, options: ["3 3", "4 1", "4 3", "3 1"], answer: 1, explanation: "y adalah alias dari x." }),
  q({ id: "m01-q15", type: "mcq", lessonId: "py-list", prompt: "Hasil dari `[1, 2, 3].sort()` adalah…", options: ["[1, 2, 3]", "None", "[3, 2, 1]", "Error"], answer: 1, explanation: ".sort() mengubah list in-place dan mengembalikan None." }),
  q({ id: "m01-q16", type: "predict", lessonId: "py-tuple", prompt: "Apa outputnya?", code: `shape = (150, 5)\nrows, cols = shape\nprint(rows * cols, type((5,)).__name__)`, options: ["750 int", "750 tuple", "155 tuple", "Error"], answer: 1, explanation: "Unpacking; (5,) adalah tuple." }),
  q({ id: "m01-q17", type: "tf", lessonId: "py-tuple", prompt: "Elemen tuple dapat diubah dengan `t[0] = 10`.", answer: false, explanation: "Tuple immutable." }),
  q({ id: "m01-q18", type: "predict", lessonId: "py-set", prompt: "Apa outputnya?", code: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a - b), len(a | b))`, options: ["[1] 4", "[4] 4", "[1] 6", "[2, 3] 4"], answer: 0, explanation: "a − b = {1}; union = {1, 2, 3, 4}." }),
  q({ id: "m01-q19", type: "mcq", lessonId: "py-set", prompt: "Cara membuat set kosong adalah…", options: ["{}", "set()", "[]", "set[]"], answer: 1, explanation: "{} adalah dict kosong." }),
  q({ id: "m01-q20", type: "predict", lessonId: "py-dictionary", prompt: "Apa outputnya?", code: `d = {"knn": 0.9, "svm": 0.95}\nd["tree"] = 0.85\nprint(max(d, key=d.get), "rf" in d, d.get("rf", 0))`, options: ["svm False 0", "tree False 0", "svm True 0", "0.95 False None"], answer: 0, explanation: "Key dengan value terbesar = svm; 'rf' bukan key; get dengan default 0." }),
  q({ id: "m01-q21", type: "fill", lessonId: "py-dictionary", prompt: "Method dictionary untuk mendapatkan pasangan (key, value) di dalam for loop: `d.____()`", answer: ["items"], explanation: "`for k, v in d.items():`" }),
  q({ id: "m01-q22", type: "predict", lessonId: "py-conditional-statements", prompt: "Apa outputnya?", code: `skor = 72\nif skor >= 60:\n    print("C")\nelif skor >= 70:\n    print("B")\nelse:\n    print("D")`, options: ["B", "C", "C\nB", "D"], answer: 1, explanation: "Kondisi pertama yang True (>= 60) dijalankan; elif tidak dicek lagi." }),
  q({ id: "m01-q23", type: "case", lessonId: "py-conditional-statements", prompt: "Kamu ingin label = 1 jika prob ≥ 0.3, selain itu 0. Kode yang benar?", options: ["label = 1 if prob >= 0.3 else 0", "label = prob >= 0.3 ? 1 : 0", "if prob >= 0.3 label = 1", "label = 1 elif prob >= 0.3"], answer: 0, explanation: "Conditional expression Python." }),
  q({ id: "m01-q24", type: "predict", lessonId: "py-for-loop", prompt: "Apa outputnya?", code: `hasil = []\nfor i, x in enumerate([10, 20, 30]):\n    if i == 1:\n        continue\n    hasil.append(x)\nprint(hasil)`, options: ["[10, 30]", "[20]", "[10, 20, 30]", "[10]"], answer: 0, explanation: "continue melewati index 1." }),
  q({ id: "m01-q25", type: "mcq", lessonId: "py-for-loop", prompt: "`range(2, 10, 3)` menghasilkan…", options: ["2, 5, 8", "2, 5, 8, 11", "3, 6, 9", "2, 4, 6, 8"], answer: 0, explanation: "Mulai 2, langkah 3, berhenti sebelum 10." }),
  q({ id: "m01-q26", type: "predict", lessonId: "py-while-loop", prompt: "Apa outputnya?", code: `x = 64\nn = 0\nwhile x > 1:\n    x //= 2\n    n += 1\nprint(n)`, options: ["5", "6", "7", "32"], answer: 1, explanation: "64 → 32 → 16 → 8 → 4 → 2 → 1: enam langkah." }),
  q({ id: "m01-q27", type: "predict", lessonId: "py-functions", prompt: "Apa outputnya?", code: `def f(a, b=10):\n    return a + b\ndef g():\n    print("hi")\nprint(f(1), f(1, b=1), g())`, options: ["11 2 None", "hi\n11 2 None", "11 2 hi", "hi\n11 2 hi"], answer: 1, explanation: "Argument print dievaluasi dulu: g() mencetak 'hi' dan mengembalikan None." }),
  q({ id: "m01-q28", type: "mcq", lessonId: "py-built-in-functions", prompt: "Cara mengurutkan list `kata` berdasarkan panjang string?", options: ["sorted(kata, key=len)", "sorted(kata, key=len())", "kata.sort(len)", "sort(kata, len)"], answer: 0, explanation: "key menerima fungsi tanpa tanda kurung." }),
  q({ id: "m01-q29", type: "mcq", lessonId: "py-importing-modules", prompt: "Baris import yang sesuai konvensi komunitas Data Science?", options: ["import numpy as n", "import pandas as pd", "from pandas import *", "import matplotlib as plt"], answer: 1, explanation: "`import pandas as pd`. Untuk plot: `import matplotlib.pyplot as plt`." }),
  q({ id: "m01-q30", type: "case", lessonId: "py-error-handling", prompt: "Saat menjalankan `row[\"Price\"]` muncul `KeyError: 'Price'`, padahal `row` berisi key `\"price\"`. Penyebabnya?", options: ["Bug Python", "Key bersifat case-sensitive", "Harus memakai index angka", "Dictionary kosong"], answer: 1, explanation: "\"Price\" ≠ \"price\"." }),
  q({ id: "m01-q31", type: "predict", lessonId: "py-reading-and-writing-files", prompt: "Apa outputnya?", code: `with open("a.txt", "w", encoding="utf-8") as f:\n    f.write("1\\n")\nwith open("a.txt", "a", encoding="utf-8") as f:\n    f.write("2\\n")\nwith open("a.txt", encoding="utf-8") as f:\n    print(f.read().split())`, options: ["['1', '2']", "['2']", "['1\\n', '2\\n']", "[1, 2]"], answer: 0, explanation: "Mode a menambahkan; split() tanpa argumen memecah di whitespace termasuk baris baru." }),
];

const TASKS: CodeTask[] = [
  {
    id: "m01-code1",
    title: "Statistik ringkas",
    skill: "python",
    lessonId: "py-built-in-functions",
    prompt: "Tulis fungsi `ringkas(data)` yang mengembalikan tuple `(minimum, maksimum, rata_rata)` dari list angka. Contoh: `ringkas([2, 4, 9])` → `(2, 9, 5.0)`.",
    starter: `def ringkas(data):
    # tulis kodemu
    pass
`,
    solution: `def ringkas(data):
    return min(data), max(data), sum(data) / len(data)
`,
    tests: [
      { desc: "ringkas([2, 4, 9]) == (2, 9, 5.0)", expr: "ringkas([2, 4, 9]) == (2, 9, 5.0)" },
      { desc: "ringkas([5]) == (5, 5, 5.0)", expr: "ringkas([5]) == (5, 5, 5.0)" },
      { desc: "ringkas([-1, 1]) == (-1, 1, 0.0)", expr: "ringkas([-1, 1]) == (-1, 1, 0.0)" },
    ],
    explanation: "Gunakan min, max, sum, dan len; kembalikan tiga nilai sebagai tuple.",
  },
  {
    id: "m01-code2",
    title: "Hitung frekuensi label",
    skill: "python",
    lessonId: "py-for-loop",
    prompt: "Tulis fungsi `frekuensi(labels)` yang mengembalikan dictionary jumlah kemunculan setiap label. Contoh: `frekuensi([\"a\", \"b\", \"a\"])` → `{\"a\": 2, \"b\": 1}`.",
    starter: `def frekuensi(labels):
    # tulis kodemu
    pass
`,
    solution: `def frekuensi(labels):
    hasil = {}
    for lab in labels:
        hasil[lab] = hasil.get(lab, 0) + 1
    return hasil
`,
    tests: [
      { desc: "Contoh soal", expr: "frekuensi(['a', 'b', 'a']) == {'a': 2, 'b': 1}" },
      { desc: "List kosong → {}", expr: "frekuensi([]) == {}" },
      { desc: "Angka sebagai label", expr: "frekuensi([0, 1, 1, 1]) == {0: 1, 1: 3}" },
    ],
    explanation: "Pola dictionary penghitung dengan `.get(key, 0) + 1`.",
  },
  {
    id: "m01-code3",
    title: "Threshold prediksi",
    skill: "python",
    lessonId: "py-functions",
    prompt: "Tulis fungsi `to_labels(probs, threshold=0.5)` yang mengubah list probabilitas menjadi list label 0/1 (1 jika prob ≥ threshold).",
    starter: `def to_labels(probs, threshold=0.5):
    # tulis kodemu
    pass
`,
    solution: `def to_labels(probs, threshold=0.5):
    labels = []
    for p in probs:
        labels.append(1 if p >= threshold else 0)
    return labels
`,
    tests: [
      { desc: "Default threshold", expr: "to_labels([0.2, 0.5, 0.9]) == [0, 1, 1]" },
      { desc: "threshold=0.3", expr: "to_labels([0.2, 0.31, 0.29], threshold=0.3) == [0, 1, 0]" },
      { desc: "List kosong", expr: "to_labels([]) == []" },
    ],
    explanation: "Loop + conditional expression + default parameter.",
  },
  {
    id: "m01-code4",
    title: "Bersihkan nama kota",
    skill: "python",
    lessonId: "py-strings",
    prompt: "Tulis fungsi `bersihkan(kota_list)` yang mengembalikan list kota unik dalam format Title Case dan terurut alfabet. Contoh: `bersihkan([\" jakarta\", \"BANDUNG \", \"Jakarta\"])` → `[\"Bandung\", \"Jakarta\"]`.",
    starter: `def bersihkan(kota_list):
    # tulis kodemu
    pass
`,
    solution: `def bersihkan(kota_list):
    unik = set()
    for k in kota_list:
        unik.add(k.strip().title())
    return sorted(unik)
`,
    tests: [
      { desc: "Contoh soal", expr: "bersihkan([' jakarta', 'BANDUNG ', 'Jakarta']) == ['Bandung', 'Jakarta']" },
      { desc: "Satu kota", expr: "bersihkan(['medan']) == ['Medan']" },
      { desc: "Mengembalikan list", expr: "isinstance(bersihkan(['a']), list)" },
    ],
    explanation: "strip + title untuk standarisasi, set untuk unik, sorted untuk urutan.",
  },
  {
    id: "m01-code5",
    title: "Akurasi aman",
    skill: "python",
    lessonId: "py-error-handling",
    prompt: "Tulis fungsi `akurasi(y_true, y_pred)` yang mengembalikan proporsi prediksi benar. Jika panjang kedua list berbeda, `raise ValueError(\"panjang berbeda\")`. Jika list kosong, kembalikan 0.0.",
    starter: `def akurasi(y_true, y_pred):
    # tulis kodemu
    pass
`,
    solution: `def akurasi(y_true, y_pred):
    if len(y_true) != len(y_pred):
        raise ValueError("panjang berbeda")
    if len(y_true) == 0:
        return 0.0
    benar = 0
    for a, p in zip(y_true, y_pred):
        if a == p:
            benar += 1
    return benar / len(y_true)
`,
    tests: [
      { desc: "akurasi([1, 0, 1, 1], [1, 1, 1, 1]) == 0.75", expr: "akurasi([1, 0, 1, 1], [1, 1, 1, 1]) == 0.75" },
      { desc: "List kosong → 0.0", expr: "akurasi([], []) == 0.0" },
      { desc: "Panjang berbeda → ValueError('panjang berbeda')", expr: "_raises(akurasi, [1], [1, 0]) == ('ValueError', 'panjang berbeda')" },
    ],
    explanation: "Validasi input dengan raise, tangani kasus kosong, lalu hitung dengan zip.",
  },
  {
    id: "m01-code6",
    title: "Rata-rata per kelompok",
    skill: "python",
    lessonId: "py-dictionary",
    prompt: "Tulis fungsi `mean_per_group(groups, values)` yang mengembalikan dictionary rata-rata `values` untuk setiap `groups`. Contoh: `mean_per_group([\"A\", \"B\", \"A\"], [10, 20, 30])` → `{\"A\": 20.0, \"B\": 20.0}`.",
    starter: `def mean_per_group(groups, values):
    # tulis kodemu
    pass
`,
    solution: `def mean_per_group(groups, values):
    total = {}
    count = {}
    for g, v in zip(groups, values):
        total[g] = total.get(g, 0) + v
        count[g] = count.get(g, 0) + 1
    return {g: total[g] / count[g] for g in total}
`,
    tests: [
      { desc: "Contoh soal", expr: "mean_per_group(['A', 'B', 'A'], [10, 20, 30]) == {'A': 20.0, 'B': 20.0}" },
      { desc: "Satu kelompok", expr: "mean_per_group(['x', 'x'], [1, 2]) == {'x': 1.5}" },
    ],
    explanation: "Versi manual dari `df.groupby(\"g\")[\"v\"].mean()`. Solusi memakai dict comprehension, tetapi loop biasa juga diterima selama hasilnya benar.",
  },
  {
    id: "m01-code7",
    title: "Baca CSV dan filter",
    skill: "python",
    lessonId: "py-reading-and-writing-files",
    prompt: "Baca `data.csv` dengan modul `csv`. Simpan ke list `nama_tinggi` nama-nama (kolom `Name`) yang `Score`-nya ≥ 85, dalam urutan file. Cetak list tersebut.",
    starter: `import csv
nama_tinggi = []
# tulis kodemu
`,
    solution: `import csv
nama_tinggi = []
with open("data.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        if int(row["Score"]) >= 85:
            nama_tinggi.append(row["Name"])
print(nama_tinggi)
`,
    tests: [
      { desc: "nama_tinggi benar", expr: "nama_tinggi == ['Andi', 'Citra', 'Dewi', 'Fajar']" },
      { desc: "Output sesuai", expr: "_lines == [\"['Andi', 'Citra', 'Dewi', 'Fajar']\"]" },
    ],
    explanation: "DictReader + konversi int + filter dengan if.",
  },
  {
    id: "m01-code8",
    title: "Konvergensi sederhana",
    skill: "python",
    lessonId: "py-while-loop",
    prompt: "Mulai dari `x = 10.0`. Selama `x > 1`, bagi x dengan 2 dan hitung jumlah langkah di variabel `langkah`. Cetak `langkah` dan `x` dipisah spasi.",
    starter: `x = 10.0
langkah = 0
# tulis kodemu
`,
    solution: `x = 10.0
langkah = 0
while x > 1:
    x = x / 2
    langkah += 1
print(langkah, x)
`,
    tests: [
      { desc: "langkah = 4", expr: "langkah == 4" },
      { desc: "x = 0.625", expr: "x == 0.625" },
      { desc: "Output '4 0.625'", expr: "_lines == ['4 0.625']" },
    ],
    explanation: "10 → 5 → 2.5 → 1.25 → 0.625: empat langkah.",
  },
];

export const MODULE01_EXAM: ExamDef = {
  id: "module-01",
  title: "Ujian Module 01 — Python Fundamentals",
  description: "Bank 31 soal (prediksi output, pilihan ganda, isian, benar/salah, studi kasus) mencakup seluruh 20 subbab Python. Setiap paket mengambil 20 soal dengan urutan dan pilihan jawaban berbeda.",
  kind: "module",
  moduleId: "m01",
  pick: 20,
  timeLimitMin: 30,
  available: true,
  questions: BANK,
  codeTasks: TASKS,
  pickCode: 3,
};

export const PYTHON_CODING_EXAM: ExamDef = {
  id: "coding-python",
  title: "Coding Examination — Python",
  description: "Tulis kode sendiri dari nol untuk 5 tugas (dipilih dari 8). Dinilai dengan test case otomatis, sehingga solusi alternatif yang benar tetap diterima. Mode Memory Test: tanpa hint dan tanpa materi.",
  kind: "coding",
  moduleId: "m01",
  pick: 0,
  timeLimitMin: 45,
  available: true,
  questions: [],
  codeTasks: TASKS,
  pickCode: 5,
};
