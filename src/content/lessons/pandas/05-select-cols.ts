import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-selecting-columns",
  title: "Selecting Columns",
  minutes: 30,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Memilih satu kolom (Series) dan beberapa kolom (DataFrame).",
    "Memahami perbedaan `df[\"a\"]`, `df[[\"a\"]]`, dan `df.a`.",
    "Memilih kolom berdasarkan tipe data dengan `select_dtypes`.",
    "Memilih kolom berdasarkan pola nama dengan list comprehension dan `filter`.",
  ],
  definition: [
    "Kurung siku `[]` pada DataFrame memilih **kolom**:\n- `df[\"umur\"]` — satu nama → **Series**\n- `df[[\"umur\", \"gaji\"]]` — list nama → **DataFrame** (urutan kolom mengikuti list)\n- `df[[\"umur\"]]` — list berisi satu nama → DataFrame satu kolom",
    "Notasi titik `df.umur` juga bisa, tetapi hanya untuk nama kolom yang valid sebagai nama variabel (tanpa spasi, tidak bentrok dengan nama method seperti `count` atau `size`). Notasi `df[\"...\"]` selalu aman.",
    "`df.select_dtypes(include=\"number\")` memilih semua kolom numerik; `include=\"str\"` (pandas 3) atau `include=\"object\"` untuk teks; `exclude=` untuk kebalikannya.",
    "`df.filter(like=\"PAY_\")` atau `df.filter(regex=\"^BILL\")` memilih kolom berdasarkan nama.",
  ],
  why: [
    "Pemilihan kolom adalah cara membentuk **X** (fitur) dan **y** (target). Memilih kolom numerik vs kategori menentukan preprocessing (scaling vs encoding) — scikit-learn `ColumnTransformer` membutuhkan daftar kolom seperti ini.",
    "Dataset nyata sering punya puluhan kolom berpola (`PAY_0`…`PAY_6`, `BILL_AMT1`…`BILL_AMT6`); memilihnya dengan pola nama jauh lebih aman daripada mengetik satu per satu.",
  ],
  when: [
    "- Membentuk X dan y.",
    "- Fokus menganalisis beberapa variabel.",
    "- Memisahkan kolom numerik dan kategori untuk preprocessing.",
    "- Mengurutkan ulang kolom.",
  ],
  analogy: "Memilih kolom seperti **menyembunyikan kolom di Excel**: kamu hanya menampilkan kolom yang relevan, sementara data aslinya tetap utuh.",
  syntax: {
    code: `df["a"]                         # Series
df[["a", "b"]]                  # DataFrame
df.select_dtypes(include="number")
df.filter(like="PAY_")
[c for c in df.columns if c.startswith("BILL")]`,
  },
  anatomy: [
    ["df[\"a\"]", "Satu kolom, hasil Series."],
    ["df[[\"a\", \"b\"]]", "Kurung luar = seleksi, kurung dalam = list."],
    ["select_dtypes(include=...)", "Berdasarkan tipe: \"number\", \"str\", \"bool\", \"datetime\"."],
    ["filter(like=..., regex=...)", "Berdasarkan pola nama kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — Satu kolom vs beberapa kolom",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
harga = df["price_million"]
print(type(harga).__name__, harga.shape)

fitur = df[["area_m2", "bedrooms", "city"]]
print(type(fitur).__name__, fitur.shape)
print(fitur.head(3))`,
      output: "Series (300,)\nDataFrame (300, 3)\n   area_m2  bedrooms      city\n0      300         6   Jakarta\n1      145         3   Bandung\n2       37         2  Surabaya",
      explain: [
        ["harga = df[\"price_million\"]", "Satu kolom → Series (1D)."],
        ["fitur = df[[\"area_m2\", \"bedrooms\", \"city\"]]", "Beberapa kolom → DataFrame (2D), dengan urutan sesuai list."],
      ],
    },
    {
      title: "Contoh 2 — df[\"a\"] vs df[[\"a\"]] vs df.a",
      code: `import pandas as pd

df = pd.DataFrame({"umur": [21, 25], "count": [3, 5]})
print(df["umur"].shape, df[["umur"]].shape)
print(df.umur.tolist())
print(type(df.count).__name__)     # method, bukan kolom!
print(df["count"].tolist())`,
      output: "(2,) (2, 1)\n[21, 25]\nmethod\n[3, 5]",
      explain: [
        ["df[\"umur\"].shape, df[[\"umur\"]].shape", "(2,) Series vs (2, 1) DataFrame."],
        ["df.umur", "Notasi titik bekerja untuk nama sederhana."],
        ["df.count", "Bentrok dengan method DataFrame.count — notasi titik mengembalikan method."],
        ["df[\"count\"]", "Kurung siku selalu mengambil kolom."],
      ],
      change: "Membandingkan tiga cara akses dan jebakannya.",
    },
    {
      title: "Contoh 3 — Berdasarkan tipe data",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
num = df.select_dtypes(include="number")
kat = df.select_dtypes(include="str")
print("Numerik:", num.columns.tolist())
print("Kategori:", kat.columns.tolist())`,
      output: "Numerik: ['age', 'tenure_months', 'monthly_charges', 'support_tickets', 'churn', 'total_charges']\nKategori: ['customer_id', 'gender', 'contract', 'internet_service']",
      explain: [
        ["df.select_dtypes(include=\"number\")", "Semua kolom int dan float."],
        ["df.select_dtypes(include=\"str\")", "Semua kolom teks (dtype str di pandas 3)."],
      ],
      change: "Seleksi tidak lagi dengan nama, tetapi dengan tipe — dasar memilih preprocessing.",
    },
    {
      title: "Contoh 4 — Berdasarkan pola nama (dataset Credit Card Default)",
      code: `import pandas as pd

df = pd.read_csv("credit_card_default.csv")
pay = df.filter(like="PAY_")
bill = [c for c in df.columns if c.startswith("BILL_AMT")]
print(pay.columns.tolist())
print(bill)
X = df.drop(columns=["ID", "default payment next month"])
print(X.shape)`,
      output: "['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6', 'PAY_AMT1', 'PAY_AMT2', 'PAY_AMT3', 'PAY_AMT4', 'PAY_AMT5', 'PAY_AMT6']\n['BILL_AMT1', 'BILL_AMT2', 'BILL_AMT3', 'BILL_AMT4', 'BILL_AMT5', 'BILL_AMT6']\n(30000, 23)",
      explain: [
        ["df.filter(like=\"PAY_\")", "Semua kolom yang namanya mengandung \"PAY_\" (status pembayaran 6 bulan dan jumlah pembayaran)."],
        ["[c for c in df.columns if c.startswith(\"BILL_AMT\")]", "List comprehension untuk pola yang lebih spesifik."],
        ["df.drop(columns=[\"ID\", \"default payment next month\"])", "Cara lain membentuk X: buang ID (bukan fitur) dan target."],
      ],
      change: "Seleksi puluhan kolom dengan pola, pada dataset nyata.",
    },
  ],
  params: [
    {
      title: "Cara memilih kolom",
      items: [
        { name: "df[col] / df[[col1, col2]]", desc: "Series / DataFrame." },
        { name: "df.select_dtypes(include=None, exclude=None)", desc: "Berdasarkan dtype." },
        { name: "df.filter(items=None, like=None, regex=None, axis=1)", desc: "Berdasarkan nama." },
        { name: "df.drop(columns=[...])", desc: "Semua kecuali kolom tertentu." },
        { name: "df.loc[:, \"a\":\"c\"]", desc: "Rentang kolom berdasarkan label (materi loc[])." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1], "b": ["x"], "c": [2.5]})\nprint(df[["c", "a"]].columns.tolist(), df.select_dtypes("number").columns.tolist())`, output: "['c', 'a'] ['a', 'c']" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
print(df.select_dtypes(include="number").columns.tolist())
print(df.select_dtypes(include="str").columns.tolist())
print(df[["age", "education", "income"]].head())`,
  mistakes: [
    {
      title: "Nama kolom salah ketik / beda huruf besar",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv")
print(df["Species"])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.read_csv("iris.csv")
print(df.columns.tolist())
print(df["species"].head(2))`,
      explain: "Nama kolom case-sensitive. Cetak `df.columns` untuk melihat nama yang tepat.",
    },
    {
      title: "Spasi tersembunyi di nama kolom",
      wrong: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("nama, umur\\nAni, 21"))
print(df["umur"])`,
      error: "KeyError",
      fix: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("nama, umur\\nAni, 21"))
df.columns = df.columns.str.strip()
print(df["umur"])`,
      explain: "Header `nama, umur` menghasilkan kolom \" umur\" (dengan spasi). Bersihkan dengan `df.columns.str.strip()`.",
    },
    {
      title: "Notasi titik untuk nama dengan spasi",
      wrong: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
print(df.fixed acidity)`,
      error: "SyntaxError",
      fix: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
print(df["fixed acidity"].head(3))`,
      explain: "Gunakan `df[\"nama kolom\"]` untuk nama yang mengandung spasi atau karakter khusus.",
    },
  ],
  bestPractices: [
    "Biasakan memakai `df[\"kolom\"]`, bukan notasi titik.",
    "Simpan daftar kolom di variabel (`fitur_num = [...]`) agar dipakai konsisten di seluruh notebook.",
    "Bentuk X dengan `drop(columns=[target, id])` agar fitur baru otomatis ikut.",
    "Bersihkan nama kolom (strip, huruf kecil) sekali di awal.",
  ],
  exercises: [
    {
      id: "pd-selcol-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Dua kolom",
      prompt: "Lengkapi agar `sub` berisi kolom `sepal_length` dan `species`.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
sub = df____
print(sub.head(2))`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
sub = df[["sepal_length", "species"]]
print(sub.head(2))`,
      tests: [{ desc: "Kolom benar", expr: "list(sub.columns) == ['sepal_length', 'species']" }],
      hints: ["Konsep: beberapa kolom.", "Gunakan list nama kolom di dalam kurung siku.", "`df[[\"sepal_length\", \"species\"]]`"],
      explanation: "Kurung siku ganda menghasilkan DataFrame.",
    },
    {
      id: "pd-selcol-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3], "b": ["x", "y", "z"], "c": [0.1, 0.2, 0.3]})
print(df["a"].ndim, df[["a"]].ndim)
print(df[["c", "a"]].columns.tolist())
print(df.select_dtypes(exclude="number").columns.tolist())`,
      answer: "1 2\n['c', 'a']\n['b']",
      hints: ["Konsep: Series 1D vs DataFrame 2D.", "Urutan kolom mengikuti list.", "exclude=\"number\" menyisakan kolom teks."],
      explanation: "1 2; ['c', 'a']; ['b'].",
    },
    {
      id: "pd-selcol-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kolom dengan spasi",
      prompt: "Perbaiki agar `alkohol` berisi kolom `alcohol` dan `kadar` berisi kolom `volatile acidity` dari dataset wine.",
      starter: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
alkohol = df.alcohol
kadar = df.volatile_acidity
print(alkohol.mean(), kadar.mean())`,
      solution: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
alkohol = df["alcohol"]
kadar = df["volatile acidity"]
print(alkohol.mean(), kadar.mean())`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "kadar = kolom volatile acidity", expr: "kadar.name == 'volatile acidity'" },
      ],
      hints: ["Konsep: nama kolom dengan spasi.", "Nama aslinya memakai spasi, bukan garis bawah.", "`df[\"volatile acidity\"]`"],
      explanation: "Notasi titik tidak bisa untuk nama berspasi; kurung siku selalu bisa.",
    },
    {
      id: "pd-selcol-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Daftar fitur numerik & kategori",
      prompt: "Dari `customer_churn.csv`, buat `X = df.drop(columns=[\"customer_id\", \"churn\"])`, lalu `fitur_num` = list kolom numerik X dan `fitur_kat` = list kolom teks X. Cetak keduanya.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
X = df.drop(columns=["customer_id", "churn"])
fitur_num = X.select_dtypes(include="number").columns.tolist()
fitur_kat = X.select_dtypes(include="str").columns.tolist()
print(fitur_num)
print(fitur_kat)`,
      tests: [
        { desc: "X tanpa id & target", expr: "'customer_id' not in X.columns and 'churn' not in X.columns" },
        { desc: "fitur_num benar", expr: "fitur_num == ['age', 'tenure_months', 'monthly_charges', 'support_tickets', 'total_charges']" },
        { desc: "fitur_kat benar", expr: "fitur_kat == ['gender', 'contract', 'internet_service']" },
      ],
      hints: ["Konsep: select_dtypes pada X.", "Buang id dan target terlebih dahulu.", "`.columns.tolist()` untuk list."],
      explanation: "Dua list ini akan dipakai ColumnTransformer: scaling untuk numerik, One-Hot untuk kategori (Module 08).",
    },
    {
      id: "pd-selcol-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Fitur riwayat pembayaran",
      prompt: [
        "Baca `credit_card_default.csv`. Buat `pay_status` = DataFrame kolom yang diawali `PAY_` tetapi **bukan** `PAY_AMT` (status keterlambatan: PAY_0, PAY_2, …, PAY_6), dan `pay_amt` = kolom yang diawali `PAY_AMT`.",
        "Cetak nama kolom keduanya dan rata-rata `pay_amt` per kolom (dibulatkan 0 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
status_cols = [c for c in df.columns if c.startswith("PAY_") and not c.startswith("PAY_AMT")]
pay_status = df[status_cols]
pay_amt = df.filter(regex="^PAY_AMT")
print(pay_status.columns.tolist())
print(pay_amt.columns.tolist())
print(pay_amt.mean().round(0))`,
      tests: [
        { desc: "pay_status 6 kolom status", expr: "pay_status.columns.tolist() == ['PAY_0', 'PAY_2', 'PAY_3', 'PAY_4', 'PAY_5', 'PAY_6']" },
        { desc: "pay_amt 6 kolom", expr: "pay_amt.columns.tolist() == ['PAY_AMT' + str(i) for i in range(1, 7)]" },
        { desc: "Jumlah baris utuh", expr: "len(pay_status) == len(df) == len(pay_amt)" },
      ],
      hints: ["Konsep: seleksi dengan pola nama.", "List comprehension dengan dua syarat startswith.", "`df.filter(regex=\"^PAY_AMT\")`"],
      explanation: "Status keterlambatan dan jumlah pembayaran punya makna berbeda — memisahkannya membantu feature engineering (misalnya rata-rata keterlambatan).",
    },
  ],
  quiz: [
    { id: "pd-selcol-q1", type: "mcq", prompt: "`df[[\"umur\"]]` menghasilkan…", options: ["Series", "DataFrame satu kolom", "list", "Error"], answer: 1, explanation: "List nama kolom → DataFrame." },
    { id: "pd-selcol-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"x": [1, 2], "y": [3, 4]})\nprint(type(df["x"]).__name__)`, options: ["DataFrame", "Series", "list", "ndarray"], answer: 1, explanation: "Satu nama → Series." },
    { id: "pd-selcol-q3", type: "tf", prompt: "Notasi `df.count` selalu mengambil kolom bernama \"count\".", answer: false, explanation: "Bentrok dengan method count; gunakan df[\"count\"]." },
    { id: "pd-selcol-q4", type: "fill", prompt: "Memilih semua kolom numerik: `df.select_dtypes(include=\"____\")`", answer: ["number"], explanation: "include=\"number\"." },
    { id: "pd-selcol-q5", type: "case", prompt: "Kamu menambah fitur baru ke df berkali-kali. Cara membentuk X yang paling tahan perubahan?", options: ["Ketik ulang semua nama fitur setiap kali", "X = df.drop(columns=[\"id\", \"target\"])", "X = df", "X = df.iloc[:, :5]"], answer: 1, explanation: "Semua kolom selain id dan target otomatis menjadi fitur." },
  ],
  challenge: {
    id: "pd-selcol-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Pemilih fitur otomatis",
    prompt: [
      "Tulis fungsi `bagi_fitur(df, target, drop=())` yang mengembalikan tuple `(X, y, num_cols, cat_cols)`:",
      "- `y` = kolom target\n- `X` = semua kolom kecuali target dan kolom di `drop`\n- `num_cols` = kolom numerik X; `cat_cols` = kolom teks X",
      "Uji pada `adult_income.csv` dengan target `income` dan `drop=(\"fnlwgt\",)`, lalu cetak `X.shape`, `num_cols`, `cat_cols`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")

def bagi_fitur(df, target, drop=()):
    y = df[target]
    X = df.drop(columns=[target, *drop])
    num_cols = X.select_dtypes(include="number").columns.tolist()
    cat_cols = X.select_dtypes(include="str").columns.tolist()
    return X, y, num_cols, cat_cols

X, y, num_cols, cat_cols = bagi_fitur(df, "income", drop=("fnlwgt",))
print(X.shape)
print(num_cols)
print(cat_cols)`,
    tests: [
      { desc: "X tanpa target dan fnlwgt", expr: "X.shape == (len(df), 13) and 'income' not in X and 'fnlwgt' not in X" },
      { desc: "num + kat = semua kolom X", expr: "sorted(num_cols + cat_cols) == sorted(X.columns)" },
      { desc: "y benar", expr: "y.name == 'income'" },
      { desc: "Default drop kosong", expr: "bagi_fitur(df, 'income')[0].shape[1] == 14" },
    ],
    hints: ["Konsep: seleksi kolom dalam fungsi yang dapat dipakai ulang.", "`df.drop(columns=[target, *drop])`", "Kembalikan 4 nilai dalam tuple."],
    explanation: "Fungsi ini menjadi langkah standar sebelum membangun pipeline preprocessing.",
  },
  summary: [
    "`df[\"a\"]` → Series; `df[[\"a\", \"b\"]]` → DataFrame.",
    "Notasi titik praktis tetapi rawan; kurung siku selalu aman.",
    "`select_dtypes` memilih berdasarkan tipe; `filter`/list comprehension berdasarkan nama.",
    "`drop(columns=...)` untuk \"semua kecuali\".",
  ],
  cheatsheet: [
    { syntax: "df[\"a\"]", desc: "Satu kolom" },
    { syntax: "df[[\"a\", \"b\"]]", desc: "Beberapa kolom" },
    { syntax: "df.select_dtypes(\"number\")", desc: "Kolom numerik" },
    { syntax: "df.filter(like=\"PAY_\")", desc: "Pola nama" },
    { syntax: "df.columns.str.strip()", desc: "Bersihkan nama" },
  ],
  flashcards: [
    { q: "Pilih kolom teks di pandas 3", a: "df.select_dtypes(include=\"str\")" },
    { q: "Pilih kolom yang namanya mengandung \"BILL\"", a: "df.filter(like=\"BILL\")" },
    { q: "Perbedaan df[\"a\"] dan df[[\"a\"]]", a: "Series (1D) vs DataFrame (2D)" },
  ],
  references: [
    pandasDoc("Getting started — How do I select a subset of a DataFrame?", "getting_started/intro_tutorials/03_subset_data.html"),
    pandasDoc("Indexing and selecting data — Basics", "user_guide/indexing.html#basics"),
    pandasDoc("pandas.DataFrame.select_dtypes", "reference/api/pandas.DataFrame.select_dtypes.html"),
    pandasDoc("pandas.DataFrame.filter", "reference/api/pandas.DataFrame.filter.html"),
  ],
};
