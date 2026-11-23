import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-shape",
  title: "df.shape",
  minutes: 20,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Membaca ukuran DataFrame dengan `df.shape`, `len(df)`, `df.size`, dan `df.ndim`.",
    "Memakai shape untuk memverifikasi setiap langkah transformasi (filter, merge, drop).",
    "Memahami shape Series vs DataFrame, termasuk (n,) vs (n, 1).",
    "Menulis pemeriksaan otomatis dengan `assert` berbasis shape.",
  ],
  definition: [
    "`df.shape` adalah **atribut** (tanpa tanda kurung) berisi tuple `(jumlah_baris, jumlah_kolom)`. `len(df)` = jumlah baris; `df.size` = jumlah sel (baris × kolom); `df.ndim` = 2.",
    "Series memiliki shape `(n,)` — tuple satu elemen. Pemilihan satu kolom dengan `df[[\"a\"]]` menghasilkan DataFrame berbentuk `(n, 1)`.",
    "Shape adalah alat **audit** paling sederhana: setiap operasi punya ekspektasi ukuran — filter mengurangi baris, drop kolom mengurangi kolom, left join tidak boleh menambah baris, train + test = total.",
  ],
  why: [
    "Bug data paling mahal sering \"diam\": merge yang menduplikasi baris, filter yang membuang terlalu banyak, kolom yang hilang. Mencetak/mengecek shape sebelum dan sesudah setiap langkah menangkap bug ini segera.",
    "Model scikit-learn mewajibkan jumlah baris X dan y sama, dan jumlah kolom X saat predict sama dengan saat fit.",
  ],
  when: [
    "- Tepat setelah memuat data.",
    "- Sebelum dan sesudah setiap transformasi.",
    "- Sebelum fit/predict model.",
    "- Saat menyusun laporan ukuran dataset.",
  ],
  analogy: "shape seperti **timbangan di setiap pos pemeriksaan** gudang: jika paket masuk 300 kg tetapi keluar 450 kg, pasti ada yang salah di tengah jalan — walaupun tidak ada alarm yang berbunyi.",
  syntax: {
    code: `df.shape          # (baris, kolom)
n_baris, n_kolom = df.shape
len(df)           # baris
df.size           # baris × kolom
df["a"].shape     # (n,)
assert len(X) == len(y)`,
  },
  anatomy: [
    ["df.shape", "Atribut tuple (baris, kolom)."],
    ["df.shape[0] / df.shape[1]", "Baris / kolom."],
    ["len(df)", "Jumlah baris."],
    ["df.size", "Jumlah sel."],
  ],
  examples: [
    {
      title: "Contoh 1 — Ukuran dasar",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
print(df.shape)
n_baris, n_kolom = df.shape
print(n_baris, n_kolom, len(df), df.size, df.ndim)
print(df["churn"].shape, df[["churn"]].shape)`,
      output: "(403, 10)\n403 10 403 4030 2\n(403,) (403, 1)",
      explain: [
        ["n_baris, n_kolom = df.shape", "Unpacking tuple menjadi dua variabel."],
        ["df.size", "403 × 10 = 4030 sel."],
        ["df[\"churn\"].shape, df[[\"churn\"]].shape", "Series (403,) vs DataFrame (403, 1)."],
      ],
    },
    {
      title: "Contoh 2 — Melacak shape di setiap langkah",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
print("awal          :", df.shape)
df = df.drop_duplicates()
print("tanpa duplikat:", df.shape)
df = df.dropna(subset=["age"])
print("age terisi    :", df.shape)
X = df.drop(columns=["customer_id", "churn"])
y = df["churn"]
print("X, y          :", X.shape, y.shape)
assert len(X) == len(y)`,
      output: "awal          : (403, 10)\ntanpa duplikat: (400, 10)\nage terisi    : (395, 10)\nX, y          : (395, 8) (395,)",
      explain: [
        ["df.drop_duplicates()", "Baris berkurang 3 (duplikat)."],
        ["df.dropna(subset=[\"age\"])", "Baris dengan age kosong dibuang."],
        ["assert len(X) == len(y)", "Pemeriksaan wajib sebelum training."],
      ],
      change: "shape dipakai sebagai log setiap transformasi.",
    },
    {
      title: "Contoh 3 — Mendeteksi merge yang menduplikasi baris",
      code: `import pandas as pd

trx = pd.DataFrame({"pelanggan": ["A", "B", "C"], "nilai": [100, 50, 70]})
profil = pd.DataFrame({"pelanggan": ["A", "A", "B", "C"], "kota": ["Bogor", "Bogor", "Depok", "Bekasi"]})
gabung = trx.merge(profil, on="pelanggan", how="left")
print(trx.shape, "→", gabung.shape)
if len(gabung) != len(trx):
    print("PERINGATAN: merge menambah", len(gabung) - len(trx), "baris")`,
      output: "(3, 2) → (4, 3)\nPERINGATAN: merge menambah 1 baris",
      explain: [
        ["trx.merge(profil, on=\"pelanggan\", how=\"left\")", "Profil A tercatat dua kali."],
        ["len(gabung) != len(trx)", "Left join seharusnya tidak menambah baris — shape langsung membongkar masalah."],
      ],
      change: "shape sebagai alarm bug.",
    },
    {
      title: "Contoh 4 — Ringkasan ukuran banyak dataset",
      code: `import pandas as pd

files = ["iris.csv", "house_prices.csv", "student_performance.csv", "adult_income.csv"]
ringkas = pd.DataFrame(
    [(f, *pd.read_csv(f).shape) for f in files],
    columns=["file", "baris", "kolom"],
)
ringkas["sel"] = ringkas["baris"] * ringkas["kolom"]
print(ringkas.sort_values("sel", ascending=False).to_string(index=False))`,
      output: "                   file  baris  kolom    sel\n       adult_income.csv  32561     15 488415\nstudent_performance.csv    395     33  13035\n       house_prices.csv    300      8   2400\n               iris.csv    150      5    750",
      explain: [
        ["(f, *pd.read_csv(f).shape)", "Unpacking shape ke dalam tuple (file, baris, kolom)."],
        ["ringkas[\"baris\"] * ringkas[\"kolom\"]", "Jumlah sel — perkiraan kasar ukuran data."],
      ],
      change: "shape banyak file sekaligus.",
    },
  ],
  params: [
    {
      title: "Atribut ukuran",
      items: [
        { name: "df.shape", desc: "(baris, kolom)." },
        { name: "len(df)", desc: "Baris." },
        { name: "df.size", desc: "Baris × kolom." },
        { name: "df.ndim", desc: "2 untuk DataFrame, 1 untuk Series." },
        { name: "df.empty", desc: "True jika tidak ada baris/kolom." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})\nprint(df.shape, len(df), df.size, df["a"].shape, df.empty)`, output: "(3, 2) 3 6 (3,) False" },
  tryIt: `import pandas as pd

df = pd.read_csv("online_shoppers.csv")
print(df.shape)
beli = df[df["Revenue"]]
print(beli.shape, "→", round(len(beli) / len(df) * 100, 1), "% sesi membeli")`,
  mistakes: [
    {
      title: "Memanggil shape dengan tanda kurung",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.shape())`,
      error: "TypeError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.shape)`,
      explain: "*'tuple' object is not callable* — shape adalah atribut, bukan method.",
    },
    {
      title: "Jumlah baris X dan y berbeda",
      wrong: `from sklearn.linear_model import LinearRegression
import pandas as pd
df = pd.read_csv("student_scores.csv")
X = df[["hours_studied"]].dropna().head(20)
y = df["final_score"]
LinearRegression().fit(X, y)`,
      error: "ValueError",
      fix: `from sklearn.linear_model import LinearRegression
import pandas as pd
df = pd.read_csv("student_scores.csv").head(20)
X = df[["hours_studied"]]
y = df["final_score"]
print(X.shape, y.shape)
LinearRegression().fit(X, y)`,
      explain: "*Found input variables with inconsistent numbers of samples* — filter X dan y bersamaan dari DataFrame yang sama.",
    },
    {
      title: "Mengira size = jumlah baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4], "c": [5, 6]})
print("Jumlah baris:", df.size)   # 6, bukan 2`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4], "c": [5, 6]})
print("Jumlah baris:", len(df), "| sel:", df.size)`,
      explain: "size = baris × kolom. Untuk baris gunakan len(df) atau shape[0].",
    },
  ],
  bestPractices: [
    "Cetak shape sebelum & sesudah setiap transformasi penting.",
    "Gunakan `assert` untuk ekspektasi ukuran (misalnya setelah left join).",
    "Pastikan `len(X) == len(y)` sebelum fit.",
    "Catat shape awal dataset di kamus data/laporan.",
  ],
  exercises: [
    {
      id: "load-shape-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Jumlah kolom",
      prompt: "Lengkapi agar `n_kolom` berisi jumlah kolom.",
      starter: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
n_kolom = df.shape[____]
print(n_kolom)`,
      solution: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
n_kolom = df.shape[1]
print(n_kolom)`,
      tests: [{ desc: "14 kolom", expr: "n_kolom == 14" }],
      hints: ["Konsep: posisi di tuple shape.", "Index 0 baris, index 1 kolom.", "`1`"],
      explanation: "shape[1] = kolom.",
    },
    {
      id: "load-shape-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": range(6), "b": range(6), "c": range(6)})
f = df[df["a"] > 3]
print(f.shape, f.size)
print(df.drop(columns="c").shape, df[["a"]].shape, df["a"].shape)`,
      answer: "(2, 3) 6\n(6, 2) (6, 1) (6,)",
      hints: ["Konsep: shape setelah transformasi.", "a > 3 → 2 baris.", "Series shape satu elemen."],
      explanation: "(2, 3) 6; (6, 2) (6, 1) (6,).",
    },
    {
      id: "load-shape-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — X dan y tidak sejajar",
      prompt: "X dibuat dari data tanpa missing, tetapi y dari data asli, sehingga jumlah barisnya berbeda. Perbaiki agar X dan y dibuat dari DataFrame bersih yang sama.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
X = df.dropna()[["age", "tenure_months"]]
y = df["churn"]
print(X.shape, y.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
bersih = df.dropna()
X = bersih[["age", "tenure_months"]]
y = bersih["churn"]
print(X.shape, y.shape)`,
      tests: [
        { desc: "Baris sama", expr: "len(X) == len(y)" },
        { desc: "Index sejajar", expr: "X.index.equals(y.index)" },
      ],
      hints: ["Konsep: sumber yang sama untuk X dan y.", "Simpan hasil dropna ke variabel.", "Ambil X dan y dari variabel itu."],
      explanation: "X dan y harus berasal dari baris yang sama agar setiap fitur cocok dengan targetnya.",
    },
    {
      id: "load-shape-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Log transformasi",
      prompt: "Tulis fungsi `log_shape(nama, df, log)` yang menambahkan tuple `(nama, baris, kolom)` ke list `log` lalu mengembalikan df. Pakai untuk 3 langkah pada `house_prices.csv`: \"awal\", \"jakarta\" (filter city == \"Jakarta\"), \"tanpa_id\" (drop house_id). Cetak `log`.",
      starter: `import pandas as pd
log = []
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
log = []

def log_shape(nama, df, log):
    log.append((nama, *df.shape))
    return df

df = log_shape("awal", pd.read_csv("house_prices.csv"), log)
df = log_shape("jakarta", df[df["city"] == "Jakarta"], log)
df = log_shape("tanpa_id", df.drop(columns="house_id"), log)
print(log)`,
      tests: [
        { desc: "3 entri log", expr: "[l[0] for l in log] == ['awal', 'jakarta', 'tanpa_id']" },
        { desc: "Ukuran benar", expr: "log[0][1:] == (300, 8) and log[1][1] == 114 and log[2][1:] == (114, 7)" },
      ],
      hints: ["Konsep: mencatat shape.", "`log.append((nama, *df.shape))`", "Kembalikan df agar bisa dirantai."],
      explanation: "Log shape membuat pipeline data mudah diaudit oleh anggota tim lain.",
    },
    {
      id: "load-shape-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Verifikasi split train/test",
      prompt: [
        "Baca `adult_income.csv`. Acak dengan `sample(frac=1, random_state=42)`, lalu split 80/20 dengan iloc → `train`, `test`.",
        "Tulis tiga `assert`: jumlah baris train + test = total, kolom sama, dan tidak ada index yang tumpang tindih. Cetak shape keduanya.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")
acak = df.sample(frac=1, random_state=42)
n = int(len(acak) * 0.8)
train, test = acak.iloc[:n], acak.iloc[n:]
assert len(train) + len(test) == len(df)
assert train.shape[1] == test.shape[1] == df.shape[1]
assert len(train.index.intersection(test.index)) == 0
print(train.shape, test.shape)`,
      tests: [
        { desc: "Ukuran 80/20", expr: "len(train) == int(len(df) * 0.8) and len(test) == len(df) - int(len(df) * 0.8)" },
        { desc: "Tidak tumpang tindih", expr: "len(set(train.index) & set(test.index)) == 0" },
        { desc: "Memakai assert", expr: "_code.count('assert') >= 3" },
      ],
      hints: ["Konsep: verifikasi split dengan shape.", "`train.index.intersection(test.index)`", "Tiga assert terpisah."],
      explanation: "Pemeriksaan ini menangkap kebocoran (baris yang sama ada di train dan test) dan baris yang hilang saat split.",
    },
  ],
  quiz: [
    { id: "load-shape-q1", type: "mcq", prompt: "`df.shape` untuk DataFrame 100 baris dan 5 kolom adalah…", options: ["(5, 100)", "(100, 5)", "500", "100"], answer: 1, explanation: "(baris, kolom)." },
    { id: "load-shape-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3, 4]})\nprint(df["a"].shape, df.size)`, options: ["(4, 1) 4", "(4,) 4", "(1, 4) 4", "4 4"], answer: 1, explanation: "Series (4,), size 4." },
    { id: "load-shape-q3", type: "tf", prompt: "Left join yang benar tidak pernah menambah jumlah baris tabel kiri.", answer: true, explanation: "Jika baris bertambah, kunci kanan duplikat — bug." },
    { id: "load-shape-q4", type: "fill", prompt: "Jumlah sel DataFrame: `df.____`", answer: ["size"], explanation: "size = baris × kolom." },
    { id: "load-shape-q5", type: "case", prompt: "Setelah feature engineering, X_train punya 25 kolom tetapi X_test 24 kolom. Apa yang terjadi saat predict?", options: ["Berjalan normal", "Error karena jumlah fitur berbeda", "Kolom otomatis ditambah", "Akurasi naik"], answer: 1, explanation: "Model butuh jumlah & nama fitur yang sama." },
  ],
  challenge: {
    id: "load-shape-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Dekorator pemeriksa shape",
    prompt: [
      "Tulis fungsi `cek_baris(ekspektasi)` yang mengembalikan fungsi pembungkus: `cek_baris(\"sama\")(f)` menghasilkan fungsi baru yang menjalankan `f(df)` dan `raise AssertionError` jika jumlah baris hasil ≠ jumlah baris input; `cek_baris(\"kurang\")` memastikan hasil ≤ input.",
      "Bungkus dua fungsi: `tambah_fitur` (menambah kolom; harus \"sama\") dan `gabung_profil` (left join dengan profil duplikat; harus \"sama\" → gagal). Jalankan keduanya pada `trx`, tangkap AssertionError, dan cetak hasil.",
    ],
    starter: `import pandas as pd
trx = pd.DataFrame({"pelanggan": ["A", "B", "C"], "nilai": [100, 50, 70]})
profil = pd.DataFrame({"pelanggan": ["A", "A", "B", "C"], "kota": ["Bogor", "Bogor", "Depok", "Bekasi"]})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
trx = pd.DataFrame({"pelanggan": ["A", "B", "C"], "nilai": [100, 50, 70]})
profil = pd.DataFrame({"pelanggan": ["A", "A", "B", "C"], "kota": ["Bogor", "Bogor", "Depok", "Bekasi"]})

def cek_baris(ekspektasi):
    def pembungkus(f):
        def baru(df):
            hasil = f(df)
            if ekspektasi == "sama" and len(hasil) != len(df):
                raise AssertionError(f"{f.__name__}: baris {len(df)} → {len(hasil)}")
            if ekspektasi == "kurang" and len(hasil) > len(df):
                raise AssertionError(f"{f.__name__}: baris bertambah {len(df)} → {len(hasil)}")
            return hasil
        return baru
    return pembungkus

@cek_baris("sama")
def tambah_fitur(df):
    return df.assign(nilai_ribu=df["nilai"] / 1000)

@cek_baris("sama")
def gabung_profil(df):
    return df.merge(profil, on="pelanggan", how="left")

print(tambah_fitur(trx).shape)
try:
    gabung_profil(trx)
except AssertionError as e:
    print("Gagal:", e)`,
    tests: [
      { desc: "tambah_fitur lolos", expr: "tambah_fitur(trx).shape == (3, 3)" },
      { desc: "gabung_profil ditangkap", expr: "_raises(gabung_profil, trx) == ('AssertionError', 'gabung_profil: baris 3 → 4')" },
      { desc: "Mode kurang bekerja", expr: "cek_baris('kurang')(lambda d: d.head(1))(trx).shape[0] == 1 and _raises(cek_baris('kurang')(lambda d: __import__('pandas').concat([d, d])), trx)[0] == 'AssertionError'" },
    ],
    hints: ["Konsep: fungsi yang mengembalikan fungsi (decorator).", "Tiga lapis: cek_baris(ekspektasi) → pembungkus(f) → baru(df).", "`f.__name__` untuk nama fungsi di pesan."],
    explanation: "Decorator seperti ini membuat setiap langkah pipeline otomatis memeriksa dirinya — teknik yang dipakai library validasi data profesional.",
  },
  summary: [
    "`df.shape` = (baris, kolom); `len(df)` = baris; `df.size` = sel; Series shape (n,).",
    "shape adalah atribut (tanpa kurung).",
    "Cek shape sebelum/sesudah transformasi untuk menangkap bug diam.",
    "Pastikan len(X) == len(y) dan jumlah kolom train = test.",
  ],
  cheatsheet: [
    { syntax: "df.shape", desc: "(baris, kolom)" },
    { syntax: "n, p = df.shape", desc: "Unpack" },
    { syntax: "len(df)", desc: "Baris" },
    { syntax: "assert len(X) == len(y)", desc: "Cek sebelum fit" },
    { syntax: "assert len(merged) == len(left)", desc: "Cek left join" },
  ],
  flashcards: [
    { q: "Perbedaan df.shape, len(df), df.size", a: "(baris, kolom); jumlah baris; jumlah sel" },
    { q: "Shape Series 100 elemen", a: "(100,)" },
    { q: "Tanda merge salah dari shape", a: "Left join menambah jumlah baris tabel kiri" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.shape", "reference/api/pandas.DataFrame.shape.html"),
    pandasDoc("pandas.DataFrame.size", "reference/api/pandas.DataFrame.size.html"),
    pandasDoc("Merge — checking for duplicate keys (validate)", "user_guide/merging.html#merging-validation"),
    { source: "Python Official Documentation", title: "Glossary — decorator", url: "https://docs.python.org/3/glossary.html#term-decorator" },
  ],
};
