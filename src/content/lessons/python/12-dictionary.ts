import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-dictionary",
  title: "Dictionary",
  minutes: 45,
  prerequisites: ["py-list", "py-tuple"],
  objectives: [
    "Membuat dictionary berisi pasangan `key: value`.",
    "Mengakses nilai dengan `d[key]` dan `d.get(key, default)`.",
    "Menambah, mengubah, dan menghapus pasangan key-value (`update`, `pop`, `del`).",
    "Memakai `keys()`, `values()`, `items()`, dan `in` pada dictionary.",
    "Merepresentasikan satu baris data dan kumpulan kolom (dict of lists) — cikal bakal DataFrame.",
  ],
  definition: [
    "**Dictionary** (`dict`) menyimpan data dalam bentuk pasangan **key → value**. Key adalah \"label\" untuk mencari, value adalah isinya. Contoh: `siswa = {\"nama\": \"Andi\", \"umur\": 21}`.",
    "Berbeda dengan list yang diakses dengan nomor urut (index), dictionary diakses dengan **key**: `siswa[\"nama\"]` menghasilkan `\"Andi\"`.",
    "Aturan penting:\n- Key harus **unik** — key yang sama ditulis dua kali akan menimpa nilai sebelumnya.\n- Key harus bertipe immutable (string, angka, tuple). String adalah key paling umum.\n- Value boleh apa saja: angka, string, list, bahkan dictionary lain.\n- Sejak Python 3.7, dictionary **mempertahankan urutan penambahan** key.",
  ],
  why: [
    "Dictionary ada di mana-mana dalam Machine Learning:\n- Satu baris data/record (`{\"age\": 30, \"city\": \"Bandung\"}`) dan format JSON.\n- Membuat DataFrame: `pd.DataFrame({\"nama\": [...], \"umur\": [...]})`.\n- Hyperparameter grid untuk tuning: `{\"n_neighbors\": [3, 5, 7]}`.\n- Mapping label: `{0: \"benign\", 1: \"malignant\"}` dan `df[\"kolom\"].map(dict)`.\n- Menyimpan hasil banyak model: `{\"KNN\": 0.91, \"SVM\": 0.94}`.",
  ],
  when: [
    "- Saat data punya **nama/label** yang lebih bermakna daripada nomor urut.",
    "- Saat butuh pencarian cepat berdasarkan key.",
    "- Untuk konfigurasi dan parameter.",
  ],
  analogy: "Dictionary seperti **kamus** atau **buku telepon**: kamu mencari berdasarkan kata/nama (key), lalu mendapatkan arti/nomornya (value). Kamu tidak mencari \"halaman ke-37\", melainkan langsung ke kata yang dicari.",
  syntax: {
    code: `d = {"key1": value1, "key2": value2}
d["key1"]                 # akses
d.get("key3", default)    # akses aman
d["key3"] = value3        # tambah / ubah
d.pop("key1")             # hapus & ambil
d.keys()  d.values()  d.items()`,
  },
  anatomy: [
    ["{ }", "Kurung kurawal; isinya pasangan `key: value` dipisah koma."],
    ["\"nama\": \"Andi\"", "Satu pasangan: key `\"nama\"`, value `\"Andi\"`. Titik dua memisahkan key dan value."],
    ["d[key]", "Mengambil value; **KeyError** jika key tidak ada."],
    ["d.get(key, default)", "Mengambil value; mengembalikan `default` (atau None) jika key tidak ada."],
    ["d[key] = v", "Menambah key baru atau mengubah value key lama."],
    ["d.update({...})", "Menambah/mengubah banyak pasangan sekaligus."],
    ["d.items()", "Pasangan (key, value) — dipakai bersama for loop."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat dan mengakses dictionary",
      code: `siswa = {"nama": "Andi", "umur": 21, "kota": "Jakarta"}
print(siswa["nama"])
print(siswa["umur"] + 1)
print(len(siswa))`,
      output: "Andi\n22\n3",
      explain: [
        ["siswa = {\"nama\": \"Andi\", \"umur\": 21, \"kota\": \"Jakarta\"}", "Dictionary dengan 3 pasangan key-value."],
        ["siswa[\"nama\"]", "Mengakses value dengan key `\"nama\"`."],
        ["len(siswa)", "Jumlah pasangan key-value: 3."],
      ],
    },
    {
      title: "Contoh 2 — Menambah, mengubah, menghapus",
      code: `params = {"n_neighbors": 5, "weights": "uniform"}
params["n_neighbors"] = 7
params["metric"] = "euclidean"
params.update({"weights": "distance", "p": 2})
hapus = params.pop("p")
print(params)
print("Dihapus:", hapus)`,
      output: "{'n_neighbors': 7, 'weights': 'distance', 'metric': 'euclidean'}\nDihapus: 2",
      explain: [
        ["params[\"n_neighbors\"] = 7", "Key sudah ada → value diubah."],
        ["params[\"metric\"] = \"euclidean\"", "Key baru → ditambahkan di akhir."],
        ["params.update({\"weights\": \"distance\", \"p\": 2})", "Mengubah `weights` dan menambah `p` sekaligus."],
        ["hapus = params.pop(\"p\")", "Menghapus key `p` dan mengembalikan value-nya (2)."],
      ],
      change: "Dictionary bersifat mutable — mirip cara mengatur hyperparameter model.",
    },
    {
      title: "Contoh 3 — get(), in, keys(), values(), items()",
      code: `skor = {"KNN": 0.91, "SVM": 0.94, "Tree": 0.88}
print(skor.get("SVM"))
print(skor.get("XGBoost", "belum dilatih"))
print("Tree" in skor)
print(list(skor.keys()))
print(list(skor.values()))
print(list(skor.items())[0])
print(max(skor, key=skor.get))`,
      output: "0.94\nbelum dilatih\nTrue\n['KNN', 'SVM', 'Tree']\n[0.91, 0.94, 0.88]\n('KNN', 0.91)\nSVM",
      explain: [
        ["skor.get(\"XGBoost\", \"belum dilatih\")", "Key tidak ada → mengembalikan nilai default, tanpa error."],
        ["\"Tree\" in skor", "`in` pada dictionary memeriksa **key**, bukan value."],
        ["list(skor.keys())", "Semua key dijadikan list."],
        ["list(skor.items())[0]", "Pasangan pertama berupa tuple (key, value)."],
        ["max(skor, key=skor.get)", "Key dengan value terbesar → model terbaik. Parameter `key` menentukan dasar perbandingan."],
      ],
      change: "Kita membaca isi dictionary dengan berbagai cara yang aman.",
    },
    {
      title: "Contoh 4 — Mapping label",
      code: `label_map = {0: "malignant", 1: "benign"}
prediksi = 1
print("Hasil diagnosis:", label_map[prediksi])

kode_kota = {"Jakarta": "JKT", "Bandung": "BDG"}
print(kode_kota.get("Medan", "LAINNYA"))`,
      output: "Hasil diagnosis: benign\nLAINNYA",
      explain: [
        ["label_map = {0: \"malignant\", 1: \"benign\"}", "Key boleh berupa angka. Ini pengodean target dataset Breast Cancer di scikit-learn."],
        ["label_map[prediksi]", "Mengubah angka hasil prediksi menjadi label yang mudah dipahami."],
        ["kode_kota.get(\"Medan\", \"LAINNYA\")", "Kategori yang tidak dikenal diberi nilai default."],
      ],
      change: "Dictionary sebagai tabel konversi — nanti dipakai dengan `df[\"kolom\"].map(label_map)`.",
    },
    {
      title: "Contoh 5 — Dict of lists: bentuk dasar sebuah tabel",
      code: `data = {
    "nama": ["Andi", "Budi", "Citra"],
    "umur": [21, 22, 20],
    "nilai": [85, 78, 92],
}
print(data["nilai"])
print(data["nama"][2], data["nilai"][2])
print(sum(data["nilai"]) / len(data["nilai"]))
print(list(data.keys()))`,
      output: "[85, 78, 92]\nCitra 92\n85.0\n['nama', 'umur', 'nilai']",
      explain: [
        ["data = {", "Setiap key adalah nama kolom, setiap value adalah list isi kolom."],
        ["data[\"nilai\"]", "Mengambil satu \"kolom\"."],
        ["data[\"nama\"][2], data[\"nilai\"][2]", "Baris ketiga: key → list → index."],
        ["sum(data[\"nilai\"]) / len(data[\"nilai\"])", "Rata-rata satu kolom."],
      ],
      change: "Struktur ini persis yang diterima `pd.DataFrame(data)` di Module 03 — dictionary adalah jembatan menuju Pandas.",
    },
  ],
  params: [
    {
      title: "Method dictionary penting",
      items: [
        { name: ".get(key, default=None)", type: "method", desc: "Ambil value tanpa KeyError." },
        { name: ".keys() / .values() / .items()", type: "method", desc: "View berisi key, value, atau pasangan (key, value)." },
        { name: ".update(other)", type: "method", desc: "Tambah/ubah banyak pasangan dari dict lain." },
        { name: ".pop(key, default)", type: "method", desc: "Hapus key dan kembalikan value-nya." },
        { name: "del d[key]", type: "statement", desc: "Hapus key (KeyError jika tidak ada)." },
        { name: ".copy()", type: "method", desc: "Salinan dangkal dictionary." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `d = {"a": 1, "b": 2}\nd["c"] = d["a"] + d["b"]\nprint(d)`, output: "{'a': 1, 'b': 2, 'c': 3}" },
  tryIt: `pelanggan = {"id": "C0001", "tenure_months": 68, "contract": "Two year"}
print(pelanggan["contract"])
pelanggan["churn"] = 0
print(pelanggan)
print("Punya kolom age?", "age" in pelanggan)
print(pelanggan.get("age", "tidak ada"))`,
  mistakes: [
    {
      title: "Mengakses key yang tidak ada",
      wrong: `skor = {"KNN": 0.91}
print(skor["SVM"])`,
      error: "KeyError",
      fix: `skor = {"KNN": 0.91}
print(skor.get("SVM", "belum ada"))`,
      explain: "Gunakan `.get()` atau cek dengan `in` lebih dulu bila key belum tentu ada.",
    },
    {
      title: "Key salah huruf besar-kecil",
      wrong: `data = {"Age": 30}
print(data["age"])`,
      error: "KeyError",
      fix: `data = {"Age": 30}
print(data["Age"])`,
      explain: "Key string bersifat case-sensitive — kesalahan yang sangat umum saat mengakses kolom DataFrame.",
    },
    {
      title: "Memakai list sebagai key",
      wrong: `d = {["a", "b"]: 1}`,
      error: "TypeError",
      fix: `d = {("a", "b"): 1}
print(d)`,
      explain: "Key harus immutable (*hashable*). Gunakan tuple, bukan list.",
    },
    {
      title: "Mengira `in` memeriksa value",
      wrong: `label = {0: "benign", 1: "malignant"}
print("benign" in label)   # False!`,
      fix: `label = {0: "benign", 1: "malignant"}
print("benign" in label.values())`,
      explain: "`in` pada dict memeriksa key. Untuk value gunakan `.values()`.",
    },
  ],
  bestPractices: [
    "Gunakan key string yang konsisten (snake_case) seperti nama kolom dataset.",
    "Gunakan `.get(key, default)` untuk data yang mungkin tidak lengkap.",
    "Simpan hasil eksperimen dalam dict `{nama_model: skor}` agar mudah dibandingkan.",
    "Untuk data tabel yang besar, ubah dict of lists menjadi Pandas DataFrame.",
  ],
  exercises: [
    {
      id: "py-dict-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Akses aman",
      prompt: "Lengkapi method agar kode tidak error dan mencetak `0` ketika key `\"support_tickets\"` tidak ada.",
      starter: `pelanggan = {"age": 34, "tenure_months": 12}
tiket = pelanggan.____("support_tickets", 0)
print(tiket)`,
      solution: `pelanggan = {"age": 34, "tenure_months": 12}
tiket = pelanggan.get("support_tickets", 0)
print(tiket)`,
      tests: [
        { desc: "tiket = 0", expr: "tiket == 0" },
        { desc: "Output 0", expr: "_lines == ['0']" },
      ],
      hints: ["Konsep: akses dictionary yang aman.", "Method ini mengembalikan default bila key tidak ada.", "`pelanggan.get(\"support_tickets\", 0)`"],
      explanation: "`.get()` mengembalikan default alih-alih memunculkan KeyError.",
    },
    {
      id: "py-dict-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `d = {"a": 1, "b": 2}
d["a"] = 10
d["c"] = d["a"] + d["b"]
print(d)
print(len(d), "b" in d, 2 in d)`,
      answer: "{'a': 10, 'b': 2, 'c': 12}\n3 True False",
      hints: ["Konsep: mengubah dan menambah key; `in` memeriksa key.", "a diganti 10; c = 10 + 2.", "`2 in d` memeriksa apakah 2 adalah key."],
      explanation: "d menjadi {'a': 10, 'b': 2, 'c': 12}. `2 in d` False karena 2 hanya muncul sebagai value.",
    },
    {
      id: "py-dict-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — KeyError",
      prompt: "Perbaiki kode agar mencetak `Akurasi SVM: 0.94`. Jangan mengubah isi dictionary.",
      starter: `hasil = {"knn": 0.91, "svm": 0.94}
print("Akurasi SVM:", hasil["SVM"])`,
      solution: `hasil = {"knn": 0.91, "svm": 0.94}
print("Akurasi SVM:", hasil["svm"])`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output benar", expr: "_lines == ['Akurasi SVM: 0.94']" },
        { desc: "Dictionary tidak diubah", expr: "hasil == {'knn': 0.91, 'svm': 0.94}" },
      ],
      hints: ["Konsep: key case-sensitive.", "Lihat bagaimana key ditulis di dalam dictionary.", "`hasil[\"svm\"]`"],
      explanation: "\"SVM\" dan \"svm\" adalah dua key berbeda.",
    },
    {
      id: "py-dict-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Parameter grid",
      prompt: [
        "Buat dictionary `param_grid` dengan key `\"n_neighbors\"` bernilai list `[3, 5, 7]` dan key `\"weights\"` bernilai list `[\"uniform\", \"distance\"]`.",
        "Hitung `n_kombinasi` = jumlah elemen n_neighbors × jumlah elemen weights. Cetak `Kombinasi: 6`.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `param_grid = {"n_neighbors": [3, 5, 7], "weights": ["uniform", "distance"]}
n_kombinasi = len(param_grid["n_neighbors"]) * len(param_grid["weights"])
print("Kombinasi:", n_kombinasi)`,
      tests: [
        { desc: "param_grid benar", expr: "param_grid == {'n_neighbors': [3, 5, 7], 'weights': ['uniform', 'distance']}" },
        { desc: "n_kombinasi = 6 dihitung dari len", expr: "n_kombinasi == 6 and 'len(' in _code" },
        { desc: "Output 'Kombinasi: 6'", expr: "_lines == ['Kombinasi: 6']" },
      ],
      hints: ["Konsep: dict berisi list.", "`len(param_grid[\"n_neighbors\"])` = 3.", "Kalikan dua len()."],
      explanation: "GridSearchCV mencoba setiap kombinasi parameter — 3 × 2 = 6 model untuk grid ini.",
    },
    {
      id: "py-dict-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Pilih model terbaik",
      prompt: [
        "Diberikan `hasil = {\"Logistic Regression\": 0.82, \"Random Forest\": 0.87, \"KNN\": 0.79}`.",
        "Tambahkan hasil `\"Gradient Boosting\"` = 0.89. Lalu simpan nama model dengan skor tertinggi ke `terbaik` dan skornya ke `skor_terbaik`. Cetak `Terbaik: Gradient Boosting (0.89)`.",
      ],
      starter: `hasil = {"Logistic Regression": 0.82, "Random Forest": 0.87, "KNN": 0.79}
# Tulis kodemu di sini
`,
      solution: `hasil = {"Logistic Regression": 0.82, "Random Forest": 0.87, "KNN": 0.79}
hasil["Gradient Boosting"] = 0.89
terbaik = max(hasil, key=hasil.get)
skor_terbaik = hasil[terbaik]
print(f"Terbaik: {terbaik} ({skor_terbaik})")`,
      tests: [
        { desc: "Gradient Boosting ditambahkan", expr: "hasil.get('Gradient Boosting') == 0.89 and len(hasil) == 4" },
        { desc: "terbaik = 'Gradient Boosting'", expr: "terbaik == 'Gradient Boosting'" },
        { desc: "skor_terbaik = 0.89", expr: "skor_terbaik == 0.89" },
        { desc: "Output sesuai", expr: "_lines == ['Terbaik: Gradient Boosting (0.89)']" },
      ],
      hints: ["Konsep: menambah key dan mencari key dengan value terbesar.", "`max(hasil, key=hasil.get)`", "`skor_terbaik = hasil[terbaik]`"],
      explanation: "Pola `max(dict, key=dict.get)` sering dipakai untuk memilih model terbaik dari hasil eksperimen.",
    },
  ],
  quiz: [
    { id: "py-dict-q1", type: "predict", prompt: "Apa outputnya?", code: `d = {"x": 1, "x": 2}\nprint(d)`, options: ["{'x': 1, 'x': 2}", "{'x': 2}", "{'x': 1}", "Error"], answer: 1, explanation: "Key harus unik; nilai terakhir menimpa." },
    { id: "py-dict-q2", type: "mcq", prompt: "Cara mengambil value tanpa error jika key mungkin tidak ada?", options: ["d[key]", "d.get(key)", "d.key", "d(key)"], answer: 1, explanation: "`.get()` mengembalikan None/default." },
    { id: "py-dict-q3", type: "tf", prompt: "`\"benign\" in {0: \"benign\"}` bernilai True.", answer: false, explanation: "`in` memeriksa key; key-nya adalah 0." },
    { id: "py-dict-q4", type: "fill", prompt: "Method yang mengembalikan pasangan (key, value) dari dictionary adalah `.____()`", answer: ["items"], explanation: "`d.items()`." },
    { id: "py-dict-q5", type: "case", prompt: "Kamu ingin mengubah prediksi angka 0/1 menjadi label \"tidak churn\"/\"churn\". Struktur data paling tepat?", options: ["list", "set", "dict {0: \"tidak churn\", 1: \"churn\"}", "tuple"], answer: 2, explanation: "Dictionary memetakan key ke value — ideal untuk mapping label." },
  ],
  challenge: {
    id: "py-dict-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Dataset mini sebagai dict of lists",
    prompt: [
      "Buat dictionary `data` dengan 3 kolom: `\"hours\"` = [2, 4, 6, 8], `\"score\"` = [55, 65, 78, 90], `\"passed\"` = [False, True, True, True].",
      "Hitung: `n_rows` (jumlah baris dari panjang salah satu kolom), `mean_score` (rata-rata score), `pass_rate` (jumlah True / n_rows).",
      "Tambahkan kolom baru `\"grade\"` = [\"D\", \"C\", \"B\", \"A\"]. Cetak:",
      "```\nKolom: ['hours', 'score', 'passed', 'grade']\nBaris: 4 | Rata-rata: 72.0 | Lulus: 75%\n```",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `data = {
    "hours": [2, 4, 6, 8],
    "score": [55, 65, 78, 90],
    "passed": [False, True, True, True],
}
n_rows = len(data["score"])
mean_score = sum(data["score"]) / n_rows
pass_rate = sum(data["passed"]) / n_rows
data["grade"] = ["D", "C", "B", "A"]
print("Kolom:", list(data.keys()))
print(f"Baris: {n_rows} | Rata-rata: {mean_score} | Lulus: {pass_rate:.0%}")`,
    tests: [
      { desc: "data punya 4 kolom dengan urutan benar", expr: "list(data.keys()) == ['hours', 'score', 'passed', 'grade']" },
      { desc: "n_rows = 4", expr: "n_rows == 4" },
      { desc: "mean_score = 72.0", expr: "mean_score == 72.0" },
      { desc: "pass_rate = 0.75", expr: "pass_rate == 0.75" },
      { desc: "Output sesuai", expr: "_lines == [\"Kolom: ['hours', 'score', 'passed', 'grade']\", 'Baris: 4 | Rata-rata: 72.0 | Lulus: 75%']" },
    ],
    hints: ["Konsep: dict of lists + sum pada boolean.", "`sum(data[\"passed\"])` menghitung jumlah True.", "Format persen tanpa desimal: `{pass_rate:.0%}`."],
    explanation: "Kamu baru saja membangun \"DataFrame\" manual. Di Module 03, `pd.DataFrame(data)` melakukan semua ini dan jauh lebih banyak lagi.",
  },
  summary: [
    "Dictionary menyimpan pasangan `key: value`; diakses dengan key, bukan index.",
    "Key unik dan immutable; value bebas.",
    "`d[key]` (KeyError bila tidak ada) vs `d.get(key, default)` (aman).",
    "Ubah dengan `d[key] = v`, `update`, `pop`, `del`; baca dengan `keys`, `values`, `items`.",
    "`in` memeriksa key. Dict of lists = bentuk dasar tabel/DataFrame.",
  ],
  cheatsheet: [
    { syntax: 'd = {"a": 1, "b": 2}', desc: "Buat dict" },
    { syntax: 'd["a"]', desc: "Akses value" },
    { syntax: 'd.get("c", 0)', desc: "Akses aman" },
    { syntax: 'd["c"] = 3', desc: "Tambah/ubah" },
    { syntax: 'd.pop("a")', desc: "Hapus & ambil" },
    { syntax: "d.keys(), d.values(), d.items()", desc: "Isi dict" },
    { syntax: "max(d, key=d.get)", desc: "Key dengan value terbesar" },
  ],
  flashcards: [
    { q: "Ambil value key \"age\" dengan default 0", a: 'd.get("age", 0)' },
    { q: "Tambahkan key \"metric\" bernilai \"euclidean\" ke params", a: 'params["metric"] = "euclidean"' },
    { q: "Cari nama model dengan skor tertinggi dari dict skor", a: "max(skor, key=skor.get)" },
    { q: "Cek apakah key \"churn\" ada di dict data", a: '"churn" in data' },
  ],
  references: [
    pyDoc("The Python Tutorial — 5.5 Dictionaries", "tutorial/datastructures.html#dictionaries"),
    pyDoc("Built-in Types — Mapping Types (dict)", "library/stdtypes.html#mapping-types-dict"),
    pyDoc("Built-in Functions — max() (parameter key)", "library/functions.html#max"),
    kagglePy("Strings and Dictionaries (Kaggle Learn Python)", "strings-and-dictionaries"),
  ],
};
