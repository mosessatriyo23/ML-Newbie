import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-head",
  title: "df.head()",
  minutes: 25,
  prerequisites: ["pd-selecting-rows"],
  objectives: [
    "Menampilkan baris pertama DataFrame dengan `df.head(n)`.",
    "Memahami `n` negatif dan pemakaian head pada Series dan hasil groupby.",
    "Mengatur tampilan dengan `pd.set_option` (jumlah kolom, lebar, desimal) dan `to_string`.",
    "Mengetahui keterbatasan head (data terurut) dan kapan memakai `sample`.",
  ],
  definition: [
    "`df.head(n=5)` mengembalikan **n baris pertama** sebagai DataFrame baru (default 5). Ini adalah perintah pertama yang hampir selalu dijalankan setelah memuat data untuk melihat isi, nama kolom, format nilai, dan penanda missing.",
    "`n` negatif mengambil **semua baris kecuali n terakhir**: `df.head(-3)`.",
    "head berlaku juga untuk Series (`df[\"kolom\"].head()`) dan untuk setiap kelompok: `df.groupby(\"k\").head(2)` mengambil 2 baris pertama per kelompok.",
    "Pandas meringkas tampilan tabel lebar dengan `...`. Atur dengan `pd.set_option(\"display.max_columns\", None)` atau gunakan `df.head().T` (transpose) untuk dataset dengan banyak kolom.",
  ],
  why: [
    "Melihat data mentah menemukan masalah yang tidak terlihat dari statistik: angka disimpan sebagai teks, tanggal dengan format aneh, penanda missing seperti \"?\" atau \"unknown\", atau kolom yang bergeser.",
    "Namun head hanya menunjukkan bagian awal; jika file terurut (per tanggal atau per kelas), head bisa memberi gambaran yang salah tentang keseluruhan data.",
  ],
  when: [
    "- Tepat setelah membaca file.",
    "- Setelah setiap transformasi besar (merge, feature engineering) untuk mengecek hasil.",
    "- Mengambil n teratas setelah sorting.",
  ],
  analogy: "head seperti **membaca halaman pertama buku** di toko: memberi kesan gaya dan isi, tetapi tidak menceritakan seluruh cerita — untuk itu kamu membuka halaman acak (sample) juga.",
  syntax: {
    code: `df.head()          # 5 baris pertama
df.head(10)
df.head(-3)        # semua kecuali 3 terakhir
df.head().T        # transpose untuk banyak kolom
df.groupby("k").head(2)
pd.set_option("display.max_columns", None)`,
  },
  anatomy: [
    ["head(n=5)", "n baris pertama (DataFrame baru)."],
    ["head(-n)", "Semua kecuali n terakhir."],
    [".T", "Baris ↔ kolom agar semua kolom terlihat."],
    ["set_option(\"display.max_columns\", None)", "Tampilkan semua kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — head default dan dengan n",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.head())
print(df.head(2))
print(len(df.head(-295)))`,
      output: "  house_id      city  area_m2  ...  age_years  distance_to_center_km  price_million\n0     H001   Jakarta      300  ...         18                   27.6           4828\n1     H002   Bandung      145  ...         25                   18.0           1429\n2     H003  Surabaya       37  ...         13                   29.0            250\n3     H004   Jakarta      288  ...         21                   26.2           4491\n4     H005  Surabaya       41  ...         11                   10.2            376\n\n[5 rows x 8 columns]\n  house_id     city  area_m2  ...  age_years  distance_to_center_km  price_million\n0     H001  Jakarta      300  ...         18                   27.6           4828\n1     H002  Bandung      145  ...         25                   18.0           1429\n\n[2 rows x 8 columns]\n5",
      explain: [
        ["df.head()", "5 baris pertama — index 0 sampai 4."],
        ["df.head(2)", "Hanya 2 baris."],
        ["df.head(-295)", "Semua kecuali 295 terakhir → 300 − 295 = 5 baris."],
      ],
    },
    {
      title: "Contoh 2 — Dataset dengan banyak kolom",
      code: `import pandas as pd

df = pd.read_csv("student_performance.csv")
print(df.shape)
print(df.head(3).T.head(12))`,
      output: "(395, 33)\n                0        1        2\nschool         GP       GP       GP\nsex             F        F        F\nage            18       17       15\naddress         U        U        U\nfamsize       GT3      GT3      LE3\nPstatus         A        T        T\nMedu            4        1        1\nFedu            4        1        1\nMjob      at_home  at_home  at_home\nFjob      teacher    other    other\nreason     course   course    other\nguardian   mother   father   mother",
      explain: [
        ["df.shape", "33 kolom — terlalu lebar untuk ditampilkan dalam satu tabel."],
        ["df.head(3).T", "Transpose: setiap kolom menjadi satu baris, sehingga semua nama kolom terbaca vertikal."],
        [".head(12)", "Hanya 12 kolom pertama yang ditampilkan di contoh ini."],
      ],
      change: "head digabung dengan transpose untuk dataset lebar.",
    },
    {
      title: "Contoh 3 — head bisa menyesatkan pada data terurut",
      code: `import pandas as pd

df = pd.read_csv("iris.csv")
print("head(10):", df.head(10)["species"].value_counts().to_dict())
print("sample(10):", df.sample(10, random_state=0)["species"].value_counts().to_dict())
print("head per kelas:")
print(df.groupby("species").head(1))`,
      output: "head(10): {'setosa': 10}\nsample(10): {'versicolor': 4, 'virginica': 3, 'setosa': 3}\nhead per kelas:\n     sepal_length  sepal_width  petal_length  petal_width     species\n0             5.1          3.5           1.4          0.2      setosa\n50            7.0          3.2           4.7          1.4  versicolor\n100           6.3          3.3           6.0          2.5   virginica",
      explain: [
        ["df.head(10)[\"species\"]", "File iris terurut per spesies — head hanya menampilkan setosa."],
        ["df.sample(10, random_state=0)", "Sampel acak menunjukkan ketiga spesies."],
        ["df.groupby(\"species\").head(1)", "Satu contoh dari setiap kelas."],
      ],
      change: "Membandingkan head dengan alternatif yang lebih representatif.",
    },
    {
      title: "Contoh 4 — Opsi tampilan",
      code: `import pandas as pd

df = pd.read_csv("winequality-red.csv", sep=";")
with pd.option_context("display.max_columns", 6, "display.width", 80, "display.precision", 2):
    print(df.head(3))
print(df.head(3).to_string(columns=["alcohol", "pH", "quality"], index=False))`,
      output: "   fixed acidity  volatile acidity  citric acid  ...  sulphates  alcohol  \\\n0            7.4              0.70         0.00  ...       0.56      9.4   \n1            7.8              0.88         0.00  ...       0.68      9.8   \n2            7.8              0.76         0.04  ...       0.65      9.8   \n\n   quality  \n0        5  \n1        5  \n2        5  \n\n[3 rows x 12 columns]\n alcohol   pH  quality\n     9.4 3.51        5\n     9.8 3.20        5\n     9.8 3.26        5",
      explain: [
        ["with pd.option_context(", "Mengubah opsi tampilan hanya di dalam blok with (tidak permanen)."],
        ["\"display.max_columns\", 6", "Maksimal 6 kolom; sisanya diringkas dengan ..."],
        ["to_string(columns=[\"alcohol\", \"pH\", \"quality\"], index=False)", "Teks tabel berisi kolom pilihan tanpa index — cocok untuk laporan."],
      ],
      change: "Mengatur cara tabel ditampilkan.",
    },
  ],
  params: [
    {
      title: "head & tampilan",
      items: [
        { name: "df.head(n=5)", desc: "n baris pertama; n negatif = semua kecuali n terakhir." },
        { name: "groupby(k).head(n)", desc: "n baris pertama per kelompok." },
        { name: "pd.set_option(\"display.max_columns\", None)", desc: "Tampilkan semua kolom (permanen di sesi)." },
        { name: "pd.option_context(...)", desc: "Opsi sementara dalam blok with." },
        { name: "display.precision", desc: "Jumlah desimal yang ditampilkan (nilai asli tidak berubah)." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"x": range(10)})\nprint(df.head(3)["x"].tolist(), len(df.head(-4)))`, output: "[0, 1, 2] 6" },
  tryIt: `import pandas as pd

df = pd.read_csv("bank_marketing.csv")
print(df.head())
print(df.head(3).T)`,
  mistakes: [
    {
      title: "Mengira head mengubah DataFrame",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv")
df.head(5)
print(len(df))   # tetap 150`,
      fix: `import pandas as pd
df = pd.read_csv("iris.csv")
kecil = df.head(5)
print(len(df), len(kecil))`,
      explain: "head mengembalikan DataFrame baru; simpan ke variabel jika ingin dipakai.",
    },
    {
      title: "Menyimpulkan distribusi dari head",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv")
print("Hanya ada:", df.head(20)["species"].unique())   # kesimpulan salah`,
      fix: `import pandas as pd
df = pd.read_csv("iris.csv")
print("Kelas:", df["species"].unique())`,
      explain: "Untuk distribusi gunakan seluruh data (`unique`, `value_counts`), bukan head.",
    },
    {
      title: "Memanggil head pada list",
      wrong: `data = [1, 2, 3, 4, 5, 6]
print(data.head(3))`,
      error: "AttributeError",
      fix: `import pandas as pd
data = [1, 2, 3, 4, 5, 6]
print(data[:3], pd.Series(data).head(3).tolist())`,
      explain: "head adalah method pandas. Untuk list gunakan slicing `data[:3]`.",
    },
  ],
  bestPractices: [
    "Jalankan `head()` dan `sample()` setelah memuat data.",
    "Untuk dataset lebar gunakan `head().T`.",
    "Gunakan `option_context` untuk mengubah tampilan sementara.",
    "Jangan menarik kesimpulan statistik dari head.",
  ],
  exercises: [
    {
      id: "load-head-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Tiga baris pertama",
      prompt: "Lengkapi agar `awal` berisi 3 baris pertama.",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
awal = df.head(____)
print(awal)`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
awal = df.head(3)
print(awal)`,
      tests: [{ desc: "3 baris pertama", expr: "awal.index.tolist() == [0, 1, 2]" }],
      hints: ["Konsep: argumen n.", "Jumlah baris yang diinginkan.", "`3`"],
      explanation: "head(3) → index 0, 1, 2.",
    },
    {
      id: "load-head-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"k": ["a", "a", "a", "b", "b"], "v": [1, 2, 3, 4, 5]})
print(df.head(-2)["v"].tolist())
print(df.groupby("k").head(1)["v"].tolist())
print(df.sort_values("v", ascending=False).head(2)["v"].tolist())`,
      answer: "[1, 2, 3]\n[1, 4]\n[5, 4]",
      hints: ["Konsep: head negatif, per kelompok, setelah sort.", "head(-2) membuang 2 terakhir.", "Baris pertama setiap kelompok: v 1 dan 4."],
      explanation: "[1, 2, 3]; [1, 4]; [5, 4].",
    },
    {
      id: "load-head-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Lima rumah termahal",
      prompt: "Kode menampilkan 5 rumah pertama, bukan 5 termahal. Perbaiki agar `top5` berisi 5 rumah dengan harga tertinggi.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
top5 = df.head(5)
print(top5[["house_id", "price_million"]])`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
top5 = df.sort_values("price_million", ascending=False).head(5)
print(top5[["house_id", "price_million"]])`,
      tests: [{ desc: "5 harga tertinggi", expr: "sorted(top5['price_million'].tolist(), reverse=True) == df['price_million'].nlargest(5).tolist()" }],
      alternatives: [
        `import pandas as pd
df = pd.read_csv("house_prices.csv")
top5 = df.nlargest(5, "price_million")
print(top5[["house_id", "price_million"]])`,
      ],
      hints: ["Konsep: head setelah sorting.", "Urutkan harga menurun dulu.", "Atau gunakan nlargest."],
      explanation: "head selalu mengambil baris teratas sesuai urutan saat ini.",
    },
    {
      id: "load-head-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Contoh per kategori",
      prompt: "Dari `customer_churn.csv`, buat `contoh` = 2 pelanggan pertama untuk setiap jenis `contract` (gunakan groupby + head). Cetak kolom `customer_id`, `contract`, `churn` dari `contoh` dan jumlah barisnya.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
contoh = df.groupby("contract").head(2)
print(contoh[["customer_id", "contract", "churn"]])
print(len(contoh))`,
      tests: [
        { desc: "2 per kontrak", expr: "(contoh['contract'].value_counts() == 2).all() and len(contoh) == 2 * df['contract'].nunique()" },
        { desc: "Baris pertama setiap kelompok", expr: "contoh.groupby('contract').head(1).index.tolist() == df.groupby('contract').head(1).index.tolist()" },
      ],
      hints: ["Konsep: head per kelompok.", "`df.groupby(\"contract\").head(2)`", "Urutan baris asli dipertahankan."],
      explanation: "Melihat contoh dari setiap kategori lebih informatif daripada head biasa.",
    },
    {
      id: "load-head-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pemeriksaan visual cepat",
      prompt: [
        "Tulis fungsi `intip(df, n=3)` yang mengembalikan DataFrame transpose dari `df.head(n)` dengan kolom tambahan `dtype` (teks) — sehingga setiap baris hasil adalah satu kolom asli beserta contoh nilai dan tipenya.",
        "Uji pada `adult_income.csv` dan cetak hasilnya.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")

def intip(df, n=3):
    hasil = df.head(n).T
    hasil["dtype"] = df.dtypes.astype(str)
    return hasil

print(intip(df))`,
      tests: [
        { desc: "Satu baris per kolom asli", expr: "intip(df).index.tolist() == df.columns.tolist()" },
        { desc: "n contoh + dtype", expr: "intip(df).shape == (df.shape[1], 4) and intip(df, 2).shape[1] == 3" },
        { desc: "dtype benar", expr: "intip(df).loc['age', 'dtype'] == 'int64' and intip(df).loc['income', 'dtype'] == 'str'" },
      ],
      hints: ["Konsep: head + transpose + dtypes.", "`df.head(n).T` → index = nama kolom.", "`df.dtypes.astype(str)` sejajar dengan index itu."],
      explanation: "Tampilan vertikal ini memudahkan memeriksa dataset dengan puluhan kolom sekaligus melihat tipenya.",
    },
  ],
  quiz: [
    { id: "load-head-q1", type: "mcq", prompt: "`df.head()` tanpa argumen menampilkan…", options: ["10 baris", "5 baris pertama", "Semua baris", "5 baris acak"], answer: 1, explanation: "Default n=5." },
    { id: "load-head-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(len(pd.DataFrame({"a": range(8)}).head(-5)))`, options: ["5", "3", "8", "0"], answer: 1, explanation: "8 − 5 = 3." },
    { id: "load-head-q3", type: "tf", prompt: "head selalu memberi gambaran representatif tentang seluruh dataset.", answer: false, explanation: "Data terurut membuat head bias; gunakan sample juga." },
    { id: "load-head-q4", type: "fill", prompt: "Menampilkan semua kolom: `pd.set_option(\"display.max_columns\", ____)`", answer: ["None"], explanation: "None = tanpa batas." },
    { id: "load-head-q5", type: "case", prompt: "Dataset punya 80 kolom dan head() terpotong \"...\". Cara cepat melihat semua nama kolom beserta contohnya?", options: ["df.head(80)", "df.head().T", "df.tail()", "df.shape"], answer: 1, explanation: "Transpose menampilkan kolom secara vertikal." },
  ],
  challenge: {
    id: "load-head-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Deteksi penanda missing tersembunyi",
    prompt: [
      "head sering memperlihatkan penanda missing yang tidak dikenali pandas (\"?\", \"unknown\", \"-\", \"N/A\"). Tulis fungsi `penanda_tersembunyi(df, penanda=(\"?\", \"unknown\", \"-\", \"N/A\", \"\"))` yang mengembalikan dict `{kolom: jumlah}` hanya untuk kolom teks yang mengandung salah satu penanda (setelah `str.strip()`).",
      "Uji pada `bank_marketing.csv` dan cetak hasilnya, lalu cetak `head(3)` kolom-kolom yang terdeteksi.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")

def penanda_tersembunyi(df, penanda=("?", "unknown", "-", "N/A", "")):
    hasil = {}
    for c in df.select_dtypes(include="str").columns:
        n = int(df[c].str.strip().isin(penanda).sum())
        if n > 0:
            hasil[c] = n
    return hasil

temuan = penanda_tersembunyi(df)
print(temuan)
print(df[list(temuan)].head(3))`,
    tests: [
      { desc: "Kolom terdeteksi", expr: "set(penanda_tersembunyi(df)) == {'job', 'education', 'contact', 'poutcome'}" },
      { desc: "Jumlah benar", expr: "penanda_tersembunyi(df)['poutcome'] == (df['poutcome'] == 'unknown').sum()" },
      { desc: "Bekerja untuk data lain", expr: "penanda_tersembunyi(__import__('pandas').DataFrame({'a': ['x', ' ? ', 'y'], 'b': [1, 2, 3]})) == {'a': 1}" },
    ],
    hints: ["Konsep: missing yang tersamar sebagai teks.", "Loop kolom teks dari select_dtypes(include=\"str\").", "`df[c].str.strip().isin(penanda).sum()`"],
    explanation: "Missing value tersembunyi tidak terhitung oleh `isna()` — padahal di dataset ini kolom poutcome sebagian besar \"unknown\". Keputusan menanganinya diambil di tahap preprocessing.",
  },
  summary: [
    "`df.head(n)` menampilkan n baris pertama (default 5); n negatif = semua kecuali n terakhir.",
    "`groupby().head(n)` untuk contoh per kelompok; `head().T` untuk dataset lebar.",
    "Atur tampilan dengan set_option/option_context.",
    "head bisa bias pada data terurut — gunakan sample juga.",
  ],
  cheatsheet: [
    { syntax: "df.head(10)", desc: "10 baris pertama" },
    { syntax: "df.head().T", desc: "Lihat semua kolom" },
    { syntax: "df.groupby(k).head(2)", desc: "Contoh per kelompok" },
    { syntax: "df.sort_values(c, ascending=False).head()", desc: "Top 5" },
    { syntax: "pd.set_option(\"display.max_columns\", None)", desc: "Semua kolom" },
  ],
  flashcards: [
    { q: "Lihat 5 baris pertama setiap spesies", a: "df.groupby(\"species\").head(5)" },
    { q: "Dataset lebar terpotong saat head. Solusi?", a: "df.head().T atau set_option(\"display.max_columns\", None)" },
    { q: "Arti df.head(-3)", a: "Semua baris kecuali 3 terakhir" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.head", "reference/api/pandas.DataFrame.head.html"),
    pandasDoc("Options and settings", "user_guide/options.html"),
    pandasDoc("Getting started — How do I read and write tabular data? (head)", "getting_started/intro_tutorials/02_read_write.html"),
    { source: "Kaggle Learn", title: "Pandas — Creating, Reading and Writing (head)", url: "https://www.kaggle.com/learn/pandas" },
  ],
};
