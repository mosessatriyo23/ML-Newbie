import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-set",
  title: "Set",
  minutes: 30,
  prerequisites: ["py-list"],
  objectives: [
    "Membuat set dan memahami bahwa set hanya menyimpan nilai unik tanpa urutan.",
    "Menghapus duplikat dari list dengan `set()`.",
    "Menambah dan menghapus elemen: `add()`, `discard()`, `remove()`.",
    "Melakukan operasi himpunan: union `|`, intersection `&`, difference `-`.",
    "Memakai set untuk membandingkan kategori/kolom antar-dataset.",
  ],
  definition: [
    "**Set** adalah koleksi berisi **nilai unik** (tidak ada duplikat) dan **tidak berurutan** (tidak punya index). Set ditulis dengan kurung kurawal: `{\"Jakarta\", \"Bandung\"}`.",
    "Karena tidak berurutan, `kota[0]` tidak bisa dipakai pada set. Urutan tampilan set juga tidak dijamin — jangan mengandalkannya. Gunakan `sorted(set)` jika perlu urutan.",
    "Set kosong dibuat dengan `set()`, **bukan** `{}` — karena `{}` adalah dictionary kosong.",
    "Set mendukung operasi **himpunan** seperti di matematika: gabungan (union), irisan (intersection), dan selisih (difference).",
  ],
  why: [
    "Di EDA kamu sering bertanya: \"ada berapa kategori unik di kolom ini?\" atau \"apakah kategori di data test juga ada di data train?\". Set menjawabnya dengan cepat.",
    "Mengecek keanggotaan (`x in set`) jauh lebih cepat pada set daripada list untuk data besar.",
  ],
  when: [
    "- Menghapus duplikat dari list.",
    "- Mencari kategori unik.",
    "- Membandingkan dua kumpulan nilai (kolom yang hilang, kategori baru).",
    "- Jangan gunakan set bila urutan atau duplikat penting.",
  ],
  analogy: "Set seperti **daftar hadir tamu undangan**: setiap nama hanya dicatat sekali walaupun orangnya datang dua kali, dan urutan nama tidak penting — yang penting hadir atau tidak.",
  syntax: {
    code: `s = {a, b, c}
s = set(list_data)     # list -> set (duplikat hilang)
s.add(x)
s.discard(x)
a | b    a & b    a - b`,
  },
  anatomy: [
    ["{ }", "Kurung kurawal berisi nilai → set. (Berisi pasangan `key: value` → dict.)"],
    ["set()", "Set kosong, atau konversi dari list/string."],
    [".add(x)", "Menambah elemen (tidak berpengaruh jika sudah ada)."],
    [".discard(x)", "Menghapus x jika ada; tidak error jika tidak ada."],
    [".remove(x)", "Menghapus x; KeyError jika tidak ada."],
    ["a | b", "Union: semua elemen dari a dan b."],
    ["a & b", "Intersection: elemen yang ada di keduanya."],
    ["a - b", "Difference: elemen di a yang tidak ada di b."],
  ],
  examples: [
    {
      title: "Contoh 1 — Duplikat otomatis hilang",
      code: `kota = ["Jakarta", "Bandung", "Jakarta", "Medan", "Bandung"]
kota_unik = set(kota)
print(len(kota), len(kota_unik))
print(sorted(kota_unik))`,
      output: "5 3\n['Bandung', 'Jakarta', 'Medan']",
      explain: [
        ["kota_unik = set(kota)", "Mengubah list menjadi set — duplikat dibuang."],
        ["len(kota), len(kota_unik)", "5 data, tetapi hanya 3 kota unik."],
        ["sorted(kota_unik)", "Set tidak berurutan; `sorted()` mengembalikan list terurut untuk ditampilkan."],
      ],
    },
    {
      title: "Contoh 2 — Menambah dan menghapus",
      code: `label = {"setosa", "versicolor"}
label.add("virginica")
label.add("setosa")
print(len(label))
label.discard("tidak_ada")
label.remove("versicolor")
print(sorted(label))`,
      output: "3\n['setosa', 'virginica']",
      explain: [
        ["label.add(\"setosa\")", "Sudah ada, jadi tidak ditambahkan lagi."],
        ["label.discard(\"tidak_ada\")", "Aman: tidak error walaupun elemennya tidak ada."],
        ["label.remove(\"versicolor\")", "Menghapus elemen yang ada."],
      ],
      change: "Set bisa diubah (mutable) dengan add/discard/remove.",
    },
    {
      title: "Contoh 3 — Operasi himpunan untuk membandingkan kolom",
      code: `kolom_train = {"age", "income", "city", "churn"}
kolom_test = {"age", "income", "gender"}

print(sorted(kolom_train & kolom_test))
print(sorted(kolom_train - kolom_test))
print(sorted(kolom_test - kolom_train))
print(len(kolom_train | kolom_test))`,
      output: "['age', 'income']\n['churn', 'city']\n['gender']\n5",
      explain: [
        ["kolom_train & kolom_test", "Intersection: kolom yang ada di keduanya."],
        ["kolom_train - kolom_test", "Kolom yang ada di train tetapi hilang di test."],
        ["kolom_test - kolom_train", "Kolom baru yang hanya ada di test."],
        ["kolom_train | kolom_test", "Union: semua kolom unik dari keduanya (5)."],
      ],
      change: "Contoh ini memakai operasi himpunan untuk masalah nyata: memastikan data test punya kolom yang sama dengan data train.",
    },
    {
      title: "Contoh 4 — Set kosong dan pengecekan keanggotaan",
      code: `kosong = set()
salah = {}
print(type(kosong).__name__, type(salah).__name__)

kategori_valid = {"DSL", "Fiber optic", "No"}
print("Fiber optic" in kategori_valid, "5G" in kategori_valid)`,
      output: "set dict\nTrue False",
      explain: [
        ["kosong = set()", "Cara benar membuat set kosong."],
        ["salah = {}", "`{}` adalah dict kosong, bukan set."],
        ["\"Fiber optic\" in kategori_valid", "Membership pada set sangat cepat."],
      ],
      change: "Kita mengenali jebakan `{}` dan memakai set untuk validasi kategori.",
    },
  ],
  io: { title: "Input → Output", input: `a = {1, 2, 3}\nb = {2, 3, 4}\nprint(sorted(a & b), sorted(a | b))`, output: "[2, 3] [1, 2, 3, 4]" },
  tryIt: `kontrak = ["Month-to-month", "One year", "Month-to-month", "Two year", "One year"]
unik = set(kontrak)
print("Jumlah kategori:", len(unik))
print("Kategori:", sorted(unik))`,
  mistakes: [
    {
      title: "Mengakses set dengan index",
      wrong: `s = {"a", "b", "c"}
print(s[0])`,
      error: "TypeError",
      fix: `s = {"a", "b", "c"}
print(sorted(s)[0])`,
      explain: "Set tidak punya urutan sehingga tidak bisa diakses dengan index. Ubah ke list terurut terlebih dahulu.",
    },
    {
      title: "Membuat set kosong dengan {}",
      wrong: `unik = {}
unik.add("Jakarta")`,
      error: "AttributeError",
      fix: `unik = set()
unik.add("Jakarta")
print(unik)`,
      explain: "`{}` adalah dict, yang tidak punya method `add`.",
    },
    {
      title: "remove elemen yang tidak ada",
      wrong: `s = {"a"}
s.remove("b")`,
      error: "KeyError",
      fix: `s = {"a"}
s.discard("b")
print(s)`,
      explain: "Gunakan `discard()` bila tidak yakin elemen ada.",
    },
  ],
  bestPractices: [
    "Gunakan `sorted(set)` saat menampilkan isi set agar output konsisten.",
    "Gunakan set untuk pengecekan keanggotaan pada daftar besar.",
    "Di Pandas, padanan cepat untuk kategori unik adalah `df[\"kolom\"].unique()` dan `nunique()`.",
  ],
  exercises: [
    {
      id: "py-set-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Hapus duplikat",
      prompt: "Lengkapi agar `unik` berisi nilai unik dari list `kelas`.",
      starter: `kelas = [0, 1, 1, 0, 2, 2, 2]
unik = ____(kelas)
print(sorted(unik))`,
      solution: `kelas = [0, 1, 1, 0, 2, 2, 2]
unik = set(kelas)
print(sorted(unik))`,
      tests: [
        { desc: "unik = {0, 1, 2}", expr: "unik == {0, 1, 2}" },
        { desc: "Output [0, 1, 2]", expr: "_lines == ['[0, 1, 2]']" },
      ],
      hints: ["Konsep: konversi list ke set.", "Nama fungsinya sama dengan nama tipe.", "`unik = set(kelas)`"],
      explanation: "Set otomatis membuang duplikat — cara cepat melihat kelas unik pada target.",
    },
    {
      id: "py-set-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `a = {1, 2, 3, 4}
b = {3, 4, 5}
print(sorted(a - b))
print(sorted(b - a))
print(len(a | b), len(a & b))`,
      answer: "[1, 2]\n[5]\n5 2",
      hints: ["Konsep: difference, union, intersection.", "a - b = elemen a yang tidak di b.", "Union {1..5}, irisan {3, 4}."],
      explanation: "a − b = {1, 2}; b − a = {5}; |a ∪ b| = 5; |a ∩ b| = 2.",
    },
    {
      id: "py-set-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kumpulkan kategori",
      prompt: "Perbaiki kode agar set `kategori` berisi \"A\" dan \"B\", lalu tampilkan `['A', 'B']`.",
      starter: `kategori = {}
kategori.add("A")
kategori.add("B")
print(kategori[0], kategori[1])`,
      solution: `kategori = set()
kategori.add("A")
kategori.add("B")
print(sorted(kategori))`,
      tests: [
        { desc: "kategori adalah set {'A', 'B'}", expr: "kategori == {'A', 'B'} and isinstance(kategori, set)" },
        { desc: "Output ['A', 'B']", expr: "_lines == [\"['A', 'B']\"]" },
      ],
      hints: ["Konsep: set kosong dan set tidak ber-index.", "Gunakan `set()` dan `sorted()`.", "`print(sorted(kategori))`"],
      explanation: "Dua kesalahan klasik: `{}` adalah dict, dan set tidak bisa diakses dengan index.",
    },
    {
      id: "py-set-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Kategori baru di data test",
      prompt: [
        "Kategori kota di data train: `[\"Jakarta\", \"Bandung\", \"Surabaya\", \"Jakarta\"]`; di data test: `[\"Bandung\", \"Medan\", \"Jakarta\", \"Bali\"]`.",
        "Buat `baru` = kota yang ada di test tetapi TIDAK ada di train (gunakan set). Cetak `sorted(baru)`: `['Bali', 'Medan']`",
      ],
      starter: `train_kota = ["Jakarta", "Bandung", "Surabaya", "Jakarta"]
test_kota = ["Bandung", "Medan", "Jakarta", "Bali"]
# Tulis kodemu di sini
`,
      solution: `train_kota = ["Jakarta", "Bandung", "Surabaya", "Jakarta"]
test_kota = ["Bandung", "Medan", "Jakarta", "Bali"]
baru = set(test_kota) - set(train_kota)
print(sorted(baru))`,
      tests: [
        { desc: "baru = {'Bali', 'Medan'}", expr: "baru == {'Bali', 'Medan'}" },
        { desc: "Output ['Bali', 'Medan']", expr: "_lines == [\"['Bali', 'Medan']\"]" },
      ],
      hints: ["Konsep: difference.", "Ubah kedua list menjadi set.", "`set(test_kota) - set(train_kota)`"],
      explanation: "Kategori yang tidak pernah dilihat saat training (unseen categories) bisa membuat One-Hot Encoding gagal — nanti ditangani dengan `handle_unknown=\"ignore\"`.",
    },
    {
      id: "py-set-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Kolom yang hilang",
      prompt: [
        "Model membutuhkan kolom `wajib = {\"age\", \"tenure_months\", \"monthly_charges\", \"contract\"}`. Data baru hanya punya `[\"age\", \"contract\", \"gender\"]`.",
        "Buat `hilang` (kolom wajib yang tidak ada) dan `lengkap` (True jika tidak ada yang hilang). Cetak `sorted(hilang)` lalu `lengkap`.",
      ],
      starter: `wajib = {"age", "tenure_months", "monthly_charges", "contract"}
kolom_baru = ["age", "contract", "gender"]
# Tulis kodemu di sini
`,
      solution: `wajib = {"age", "tenure_months", "monthly_charges", "contract"}
kolom_baru = ["age", "contract", "gender"]
hilang = wajib - set(kolom_baru)
lengkap = len(hilang) == 0
print(sorted(hilang))
print(lengkap)`,
      tests: [
        { desc: "hilang benar", expr: "hilang == {'tenure_months', 'monthly_charges'}" },
        { desc: "lengkap False", expr: "lengkap is False" },
        { desc: "Output benar", expr: "_lines == [\"['monthly_charges', 'tenure_months']\", 'False']" },
      ],
      hints: ["Konsep: difference + boolean dari len.", "`hilang = wajib - set(kolom_baru)`", "`lengkap = len(hilang) == 0`"],
      explanation: "Validasi kolom seperti ini dipakai sebelum melakukan prediksi pada data baru di tahap deployment.",
    },
  ],
  quiz: [
    { id: "py-set-q1", type: "predict", prompt: "Apa outputnya?", code: `print(len({1, 1, 2, 2, 3}))`, options: ["5", "3", "2", "Error"], answer: 1, explanation: "Duplikat dibuang: {1, 2, 3}." },
    { id: "py-set-q2", type: "mcq", prompt: "Bagaimana membuat set kosong?", options: ["{}", "set()", "[]", "()"], answer: 1, explanation: "`{}` adalah dict kosong." },
    { id: "py-set-q3", type: "tf", prompt: "Elemen set dapat diakses dengan index seperti `s[0]`.", answer: false, explanation: "Set tidak berurutan sehingga tidak punya index." },
    { id: "py-set-q4", type: "fill", prompt: "Operator untuk irisan (elemen yang ada di kedua set) adalah ____", answer: ["&"], explanation: "`a & b` = intersection (juga `a.intersection(b)`)." },
    { id: "py-set-q5", type: "case", prompt: "Kamu ingin tahu berapa banyak jenis `internet_service` di dataset (berisi ratusan baris). Cara paling sederhana dengan Python murni?", options: ["len(data)", "len(set(data))", "max(data)", "sorted(data)"], answer: 1, explanation: "Set membuang duplikat; len menghitung kategori unik." },
  ],
  challenge: {
    id: "py-set-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Audit kategori",
    prompt: [
      "Label dari dua anotator untuk dataset gambar:",
      "`anotator_a = [\"kucing\", \"anjing\", \"burung\", \"kucing\"]` dan `anotator_b = [\"anjing\", \"kelinci\", \"kucing\"]`.",
      "Hitung: `semua` (union), `disepakati` (intersection), `hanya_a`, `hanya_b`. Cetak 4 baris persis:",
      "```\nSemua: ['anjing', 'burung', 'kelinci', 'kucing']\nDisepakati: ['anjing', 'kucing']\nHanya A: ['burung']\nHanya B: ['kelinci']\n```",
    ],
    starter: `anotator_a = ["kucing", "anjing", "burung", "kucing"]
anotator_b = ["anjing", "kelinci", "kucing"]
# Tulis kodemu di sini
`,
    solution: `anotator_a = ["kucing", "anjing", "burung", "kucing"]
anotator_b = ["anjing", "kelinci", "kucing"]
a = set(anotator_a)
b = set(anotator_b)
semua = a | b
disepakati = a & b
hanya_a = a - b
hanya_b = b - a
print("Semua:", sorted(semua))
print("Disepakati:", sorted(disepakati))
print("Hanya A:", sorted(hanya_a))
print("Hanya B:", sorted(hanya_b))`,
    tests: [
      { desc: "semua benar", expr: "semua == {'anjing', 'burung', 'kelinci', 'kucing'}" },
      { desc: "disepakati benar", expr: "disepakati == {'anjing', 'kucing'}" },
      { desc: "hanya_a dan hanya_b benar", expr: "hanya_a == {'burung'} and hanya_b == {'kelinci'}" },
      { desc: "Output sesuai", expr: "_lines == [\"Semua: ['anjing', 'burung', 'kelinci', 'kucing']\", \"Disepakati: ['anjing', 'kucing']\", \"Hanya A: ['burung']\", \"Hanya B: ['kelinci']\"]" },
    ],
    hints: ["Konsep: keempat operasi himpunan.", "Ubah kedua list menjadi set dahulu.", "`|`, `&`, `-` lalu tampilkan dengan `sorted()`."],
    explanation: "Analisis ini membantu menemukan inkonsistensi label sebelum melatih model klasifikasi.",
  },
  summary: [
    "Set: koleksi nilai unik, tidak berurutan, tanpa index; ditulis `{a, b}`.",
    "Set kosong: `set()`; `{}` adalah dict kosong.",
    "`set(list)` menghapus duplikat; `sorted(set)` untuk menampilkan berurutan.",
    "`add`, `discard` (aman), `remove` (KeyError jika tidak ada).",
    "Operasi himpunan: `|` union, `&` intersection, `-` difference.",
  ],
  cheatsheet: [
    { syntax: "set(data)", desc: "Nilai unik" },
    { syntax: "len(set(data))", desc: "Jumlah kategori unik" },
    { syntax: "s.add(x) / s.discard(x)", desc: "Tambah / hapus aman" },
    { syntax: "a | b, a & b, a - b", desc: "Union, irisan, selisih" },
    { syntax: "sorted(s)", desc: "Tampilkan terurut" },
  ],
  flashcards: [
    { q: "Hitung jumlah nilai unik pada list data", a: "len(set(data))" },
    { q: "Kolom di train yang tidak ada di test (keduanya set)", a: "train_cols - test_cols" },
    { q: "Membuat set kosong", a: "set()" },
  ],
  references: [
    pyDoc("The Python Tutorial — 5.4 Sets", "tutorial/datastructures.html#sets"),
    pyDoc("Built-in Types — Set Types (set, frozenset)", "library/stdtypes.html#set-types-set-frozenset"),
  ],
};
