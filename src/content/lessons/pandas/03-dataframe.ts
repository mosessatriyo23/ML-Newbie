import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-dataframe",
  title: "DataFrame",
  minutes: 35,
  prerequisites: ["pd-series"],
  objectives: [
    "Memahami anatomi DataFrame: baris, kolom, index, dan columns.",
    "Memakai atribut penting: `shape`, `columns`, `index`, `dtypes`, `size`, `ndim`.",
    "Melihat ringkasan data dengan `info()` dan `describe()`.",
    "Mengubah DataFrame ke array NumPy untuk dipakai model.",
  ],
  definition: [
    "**DataFrame** adalah struktur data dua dimensi berlabel: kumpulan **kolom** (masing-masing Series) yang berbagi satu **index** (label baris). Setiap kolom boleh punya tipe data berbeda.",
    "Dalam ML, satu **baris** = satu observasi/sampel (satu pelanggan, satu rumah, satu hari), dan satu **kolom** = satu variabel (fitur atau target).",
    "Atribut utama:\n- `df.shape` — (baris, kolom)\n- `df.columns` — nama-nama kolom\n- `df.index` — label baris\n- `df.dtypes` — tipe setiap kolom\n- `df.size` — jumlah sel (baris × kolom)\n- `df.ndim` — selalu 2",
    "`df.info()` menampilkan jumlah nilai non-null dan dtype per kolom (cepat melihat missing value), sedangkan `df.describe()` menampilkan statistik ringkas.",
  ],
  why: [
    "Model scikit-learn menerima fitur dalam bentuk tabel 2D (X) — DataFrame adalah wadah alami untuk X, sedangkan target (y) adalah Series.",
    "Memahami struktur DataFrame (berapa sampel, berapa fitur, tipe apa, ada missing atau tidak) menentukan langkah preprocessing yang dibutuhkan.",
  ],
  when: [
    "- Setiap kali bekerja dengan dataset tabular.",
    "- Memeriksa struktur sebelum EDA dan preprocessing.",
    "- Menyiapkan X (fitur) dan y (target).",
  ],
  analogy: "DataFrame seperti **lembar kerja Excel**: kolom punya judul (columns), baris punya nomor (index), dan setiap kolom berisi satu jenis informasi. Bedanya, semua operasi dilakukan dengan kode sehingga bisa diulang dan dibagikan.",
  syntax: {
    code: `df.shape     df.columns   df.index
df.dtypes    df.size      df.ndim
df.info()    df.describe()
df.to_numpy()                   # ke array NumPy`,
  },
  anatomy: [
    ["df.columns", "Index berisi nama kolom."],
    ["df.index", "Label baris (default RangeIndex 0..n−1)."],
    ["df.info()", "Non-null count + dtype + memori."],
    ["df.to_numpy()", "Isi tabel sebagai array 2D."],
  ],
  examples: [
    {
      title: "Contoh 1 — Atribut DataFrame",
      code: `import pandas as pd

df = pd.DataFrame({
    "nama": ["Ani", "Budi", "Citra", "Dodi"],
    "umur": [21, 25, 23, 30],
    "ipk": [3.5, 3.1, 3.8, 2.9],
})
print(df)
print("shape  :", df.shape)
print("columns:", df.columns.tolist())
print("index  :", df.index)
print("size   :", df.size, "| ndim:", df.ndim)`,
      output: "    nama  umur  ipk\n0    Ani    21  3.5\n1   Budi    25  3.1\n2  Citra    23  3.8\n3   Dodi    30  2.9\nshape  : (4, 3)\ncolumns: ['nama', 'umur', 'ipk']\nindex  : RangeIndex(start=0, stop=4, step=1)\nsize   : 12 | ndim: 2",
      explain: [
        ["df.shape", "4 baris (mahasiswa), 3 kolom (variabel)."],
        ["df.columns.tolist()", "Nama kolom sebagai list."],
        ["df.index", "RangeIndex dari 0 sampai 4 (eksklusif)."],
        ["df.size", "4 × 3 = 12 sel."],
      ],
    },
    {
      title: "Contoh 2 — Setiap kolom adalah Series",
      code: `import pandas as pd

df = pd.DataFrame({"nama": ["Ani", "Budi"], "umur": [21, 25], "ipk": [3.5, 3.1]})
print(df.dtypes)
kolom = df["ipk"]
print(type(kolom).__name__, kolom.name)
print(df["umur"].mean())`,
      output: "nama        str\numur      int64\nipk     float64\ndtype: object\nSeries ipk\n23.0",
      explain: [
        ["df.dtypes", "Tipe tiap kolom berbeda: str, int64, float64."],
        ["df[\"ipk\"]", "Mengambil satu kolom → Series bernama \"ipk\"."],
        ["df[\"umur\"].mean()", "Semua method Series berlaku untuk kolom."],
      ],
      change: "Melihat hubungan DataFrame ↔ Series.",
    },
    {
      title: "Contoh 3 — info() untuk struktur dan missing value",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
df.info()`,
      output: "<class 'pandas.DataFrame'>\nRangeIndex: 403 entries, 0 to 402\nData columns (total 10 columns):\n #   Column            Non-Null Count  Dtype  \n---  ------            --------------  -----  \n 0   customer_id       403 non-null    str    \n 1   gender            403 non-null    str    \n 2   age               398 non-null    float64\n 3   tenure_months     403 non-null    int64  \n 4   contract          403 non-null    str    \n 5   internet_service  403 non-null    str    \n 6   monthly_charges   403 non-null    float64\n 7   support_tickets   403 non-null    int64  \n 8   churn             403 non-null    int64  \n 9   total_charges     396 non-null    float64\ndtypes: float64(3), int64(3), str(4)\nmemory usage: 25.3 KB",
      explain: [
        ["df.info()", "Mencetak langsung (tidak perlu print): jumlah baris, setiap kolom dengan Non-Null Count dan Dtype."],
      ],
      change: "Dataset nyata: perhatikan kolom yang Non-Null Count-nya lebih kecil dari jumlah baris — itu tanda missing value.",
    },
    {
      title: "Contoh 4 — Dari DataFrame ke X dan y",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
X = df[["hours_studied", "attendance", "previous_score"]]
y = df["final_score"]
print(type(X).__name__, X.shape)
print(type(y).__name__, y.shape)
arr = X.to_numpy()
print(type(arr).__name__, arr.dtype, arr[:2])`,
      output: "DataFrame (30, 3)\nSeries (30,)\nndarray float64 [[ 8.  97.  70. ]\n [ 4.9 90.  87. ]]",
      explain: [
        ["X = df[[\"hours_studied\", ", "Beberapa kolom (list di dalam []) → DataFrame fitur."],
        ["y = df[\"final_score\"]", "Satu kolom → Series target."],
        ["X.to_numpy()", "Array 2D float — format yang dipakai di balik layar oleh model."],
      ],
      change: "DataFrame dipecah menjadi fitur dan target — langkah wajib sebelum melatih model.",
    },
  ],
  params: [
    {
      title: "Atribut & method struktur",
      items: [
        { name: "df.shape, df.size, df.ndim", desc: "Ukuran tabel." },
        { name: "df.columns, df.index", desc: "Label kolom dan baris." },
        { name: "df.dtypes", desc: "Tipe per kolom." },
        { name: "df.info(verbose=None, show_counts=None)", desc: "Ringkasan struktur." },
        { name: "df.describe(include=None)", desc: "Statistik; include=\"all\" untuk semua kolom." },
        { name: "df.to_numpy()", desc: "Konversi ke ndarray." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3], "b": [0.5, 1.5, 2.5]})\nprint(df.shape, df.size, df.columns.tolist(), df["b"].sum())`, output: "(3, 2) 6 ['a', 'b'] 4.5" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv")
df.info()
print(df.describe().round(1))`,
  mistakes: [
    {
      title: "Mengambil beberapa kolom tanpa list",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
print(df["a", "b"])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
print(df[["a", "b"]])`,
      explain: "Beberapa kolom harus dibungkus list: `df[[\"a\", \"b\"]]` (kurung siku ganda).",
    },
    {
      title: "Panjang kolom berbeda",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5]})`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
print(df.shape)`,
      explain: "*All arrays must be of the same length* — setiap kolom harus punya jumlah baris yang sama.",
    },
    {
      title: "Mencetak info()",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]})
print(df.info())   # mencetak ringkasan lalu "None"`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]})
df.info()`,
      explain: "`info()` mencetak sendiri dan mengembalikan None. Panggil tanpa print.",
    },
  ],
  bestPractices: [
    "Jalankan `df.info()` segera setelah memuat data.",
    "Gunakan nama kolom yang konsisten (huruf kecil, garis bawah) agar mudah diakses.",
    "Pisahkan X dan y sedini mungkin dan beri nama yang jelas.",
    "Gunakan `describe(include=\"all\")` untuk melihat ringkasan kolom kategori juga.",
  ],
  exercises: [
    {
      id: "pd-df-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Nama kolom",
      prompt: "Lengkapi agar `nama_kolom` berisi list nama kolom.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
nama_kolom = df.____.tolist()
print(nama_kolom)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
nama_kolom = df.columns.tolist()
print(nama_kolom)`,
      tests: [{ desc: "Berisi 5 nama kolom iris", expr: "nama_kolom == list(df.columns) and len(nama_kolom) == 5" }],
      hints: ["Konsep: atribut label kolom.", "Atribut ini bernama sama dengan istilah \"kolom\" dalam bahasa Inggris.", "`df.columns`"],
      explanation: "`df.columns` adalah Index; `.tolist()` mengubahnya ke list.",
    },
    {
      id: "pd-df-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"x": [1, 2, 3, 4, 5], "y": [2, 4, 6, 8, 10], "z": list("abcde")})
print(df.shape, df.size, df.ndim)
print(type(df[["x"]]).__name__, type(df["x"]).__name__)`,
      answer: "(5, 3) 15 2\nDataFrame Series",
      hints: ["Konsep: atribut ukuran.", "size = baris × kolom.", "[[...]] → DataFrame, [...] → Series."],
      explanation: "(5, 3) 15 2; df[[\"x\"]] DataFrame, df[\"x\"] Series.",
    },
    {
      id: "pd-df-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Memilih fitur",
      prompt: "Kode error saat memilih dua kolom fitur. Perbaiki.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
X = df["area_m2", "bedrooms"]
print(X.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
X = df[["area_m2", "bedrooms"]]
print(X.shape)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "X berisi 2 kolom", expr: "list(X.columns) == ['area_m2', 'bedrooms']" },
      ],
      hints: ["Konsep: memilih beberapa kolom.", "Nama kolom harus dalam list.", "`df[[\"area_m2\", \"bedrooms\"]]`"],
      explanation: "Kurung luar = seleksi; kurung dalam = list nama kolom.",
    },
    {
      id: "pd-df-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Pisahkan X dan y",
      prompt: "Dari `iris.csv`, buat `X` = semua kolom kecuali `species` (gunakan `df.drop(columns=\"species\")`) dan `y` = kolom `species`. Cetak `X.shape` dan `y.shape`.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
X = df.drop(columns="species")
y = df["species"]
print(X.shape, y.shape)`,
      tests: [
        { desc: "X shape (150, 4)", expr: "X.shape == (150, 4) and 'species' not in X.columns" },
        { desc: "y adalah Series species", expr: "type(y).__name__ == 'Series' and y.name == 'species'" },
        { desc: "df asli tidak berubah", expr: "df.shape == (150, 5)" },
      ],
      hints: ["Konsep: fitur vs target.", "`df.drop(columns=\"species\")` membuat DataFrame baru tanpa kolom itu.", "`y = df[\"species\"]`"],
      explanation: "`drop` tidak mengubah df asli; ia mengembalikan DataFrame baru.",
    },
    {
      id: "pd-df-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Struktur Online Shoppers",
      prompt: [
        "Baca `online_shoppers.csv`. Simpan `n_sampel`, `n_fitur` (semua kolom kecuali `Revenue`), `tipe` = `df.dtypes.value_counts()` (jumlah kolom per dtype), dan `pct_beli` = persentase `Revenue == True` (2 desimal).",
        "Cetak semuanya.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
n_sampel = df.shape[0]
n_fitur = df.shape[1] - 1
tipe = df.dtypes.value_counts()
pct_beli = round(df["Revenue"].mean() * 100, 2)
print(n_sampel, n_fitur)
print(tipe)
print(pct_beli)`,
      tests: [
        { desc: "n_sampel & n_fitur benar", expr: "n_sampel == 12330 and n_fitur == 17" },
        { desc: "tipe menghitung semua kolom", expr: "tipe.sum() == df.shape[1]" },
        { desc: "pct_beli benar", expr: "pct_beli == round((df['Revenue'] == True).mean() * 100, 2)" },
      ],
      hints: ["Konsep: membaca struktur dataset.", "`df.dtypes.value_counts()`", "Kolom boolean: `.mean()` = proporsi True."],
      explanation: "Hanya sekitar 15% sesi berakhir dengan pembelian — informasi penting untuk memilih metrik dan strategi split.",
    },
  ],
  quiz: [
    { id: "pd-df-q1", type: "mcq", prompt: "Dalam dataset ML, satu baris DataFrame biasanya mewakili…", options: ["Satu fitur", "Satu sampel/observasi", "Satu model", "Satu tipe data"], answer: 1, explanation: "Baris = sampel; kolom = variabel." },
    { id: "pd-df-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})\nprint(df.size)`, options: ["3", "6", "(3, 2)", "2"], answer: 1, explanation: "3 × 2 = 6." },
    { id: "pd-df-q3", type: "tf", prompt: "Semua kolom dalam satu DataFrame wajib bertipe data sama.", answer: false, explanation: "Setiap kolom boleh punya dtype berbeda." },
    { id: "pd-df-q4", type: "fill", prompt: "Method yang menampilkan Non-Null Count dan dtype setiap kolom: `df.____()`", answer: ["info"], explanation: "`df.info()`." },
    { id: "pd-df-q5", type: "case", prompt: "`df.info()` menunjukkan 1000 entries, tetapi kolom `income` hanya 870 non-null. Artinya?", options: ["Kolom income bertipe teks", "Ada 130 missing value di income", "Ada 130 duplikat", "Data rusak semua"], answer: 1, explanation: "1000 − 870 = 130 nilai kosong." },
  ],
  challenge: {
    id: "pd-df-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Laporan kolom",
    prompt: [
      "Buat DataFrame `laporan` dengan satu baris per kolom dari `customer_churn.csv` dan kolom: `dtype` (sebagai teks, `df.dtypes.astype(str)`), `n_missing` (`df.isna().sum()`), `pct_missing` (persen, 1 desimal), dan `n_unik` (`df.nunique()`).",
      "Urutkan `laporan` dari `n_missing` terbesar (`sort_values`) dan cetak.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
laporan = pd.DataFrame({
    "dtype": df.dtypes.astype(str),
    "n_missing": df.isna().sum(),
    "pct_missing": (df.isna().mean() * 100).round(1),
    "n_unik": df.nunique(),
})
laporan = laporan.sort_values("n_missing", ascending=False)
print(laporan)`,
    tests: [
      { desc: "Satu baris per kolom", expr: "len(laporan) == df.shape[1] and set(laporan.index) == set(df.columns)" },
      { desc: "Kolom laporan lengkap", expr: "list(laporan.columns) == ['dtype', 'n_missing', 'pct_missing', 'n_unik']" },
      { desc: "n_missing benar", expr: "(laporan['n_missing'] == df.isna().sum()[laporan.index]).all()" },
      { desc: "Terurut menurun", expr: "laporan['n_missing'].is_monotonic_decreasing" },
    ],
    hints: ["Konsep: DataFrame dari beberapa Series dengan index yang sama.", "`df.isna().sum()` adalah Series berindeks nama kolom.", "`.sort_values(\"n_missing\", ascending=False)`"],
    explanation: "Laporan seperti ini adalah titik awal Data Cleaning: terlihat kolom mana yang perlu imputasi dan kolom mana yang berkardinalitas tinggi.",
  },
  summary: [
    "DataFrame = tabel 2D; setiap kolom adalah Series yang berbagi index.",
    "Baris = sampel, kolom = variabel.",
    "`shape`, `columns`, `index`, `dtypes` untuk struktur; `info()` dan `describe()` untuk ringkasan.",
    "`df[[...]]` → DataFrame (X), `df[\"...\"]` → Series (y).",
  ],
  cheatsheet: [
    { syntax: "df.shape", desc: "(baris, kolom)" },
    { syntax: "df.columns.tolist()", desc: "Nama kolom" },
    { syntax: "df.info()", desc: "Struktur + missing" },
    { syntax: "X = df.drop(columns=\"target\")", desc: "Fitur" },
    { syntax: "y = df[\"target\"]", desc: "Target" },
  ],
  flashcards: [
    { q: "Pilih dua kolom a dan b dari df", a: "df[[\"a\", \"b\"]]" },
    { q: "Pisahkan fitur tanpa kolom target", a: "X = df.drop(columns=\"target\")" },
    { q: "Lihat Non-Null Count setiap kolom", a: "df.info()" },
  ],
  references: [
    pandasDoc("Intro to data structures — DataFrame", "user_guide/dsintro.html#dataframe"),
    pandasDoc("pandas.DataFrame", "reference/api/pandas.DataFrame.html"),
    pandasDoc("pandas.DataFrame.info", "reference/api/pandas.DataFrame.info.html"),
    pandasDoc("Getting started — How do I read and write tabular data?", "getting_started/intro_tutorials/02_read_write.html"),
  ],
};
