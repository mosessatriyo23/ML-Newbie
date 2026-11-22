import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-filtering-data",
  title: "Filtering Data",
  minutes: 40,
  prerequisites: ["pd-loc", "np-boolean-indexing"],
  objectives: [
    "Memfilter baris DataFrame dengan kondisi boolean satu atau lebih.",
    "Memakai `isin`, `between`, dan method string (`str.contains`, `str.startswith`).",
    "Memfilter nilai kosong dengan `isna`/`notna`.",
    "Menulis filter yang mudah dibaca dengan `query()`.",
  ],
  definition: [
    "Filtering = memilih **baris** yang memenuhi kondisi. Kondisi pada kolom menghasilkan Series boolean (mask), lalu `df[mask]` atau `df.loc[mask]` mengambil baris yang True — konsep yang sama dengan boolean indexing NumPy.",
    "Kondisi digabung dengan `&` (dan), `|` (atau), `~` (bukan), dan setiap kondisi wajib diberi tanda kurung.",
    "Method pembantu:\n- `s.isin([..])` — nilai termasuk dalam daftar\n- `s.between(a, b)` — a ≤ nilai ≤ b (inklusif secara default)\n- `s.str.contains(\"teks\")`, `s.str.startswith(\"x\")` — pola teks\n- `s.isna()`, `s.notna()` — nilai kosong/terisi",
    "`df.query(\"umur > 30 and kota == 'Bogor'\")` menulis kondisi sebagai string yang lebih ringkas; variabel Python dirujuk dengan `@nama`.",
  ],
  why: [
    "Filtering ada di setiap tahap: EDA (\"bagaimana pelanggan yang churn?\"), cleaning (\"buang baris dengan target kosong\"), analisis error (\"tampilkan prediksi yang meleset > 50\").",
    "Membandingkan statistik antar-kelompok hasil filter adalah cara paling sederhana menemukan fitur yang berpengaruh terhadap target.",
  ],
  when: [
    "- Menganalisis sub-kelompok data.",
    "- Membuang baris tidak valid atau target kosong.",
    "- Mencari data dengan pola teks tertentu.",
    "- Memeriksa kesalahan prediksi model.",
  ],
  analogy: "Filtering seperti **fitur filter di toko online**: pilih kategori \"Laptop\", harga 5–10 juta, merek A atau B — hanya produk yang memenuhi semua syarat yang ditampilkan.",
  syntax: {
    code: `df[df["umur"] > 30]
df[(df["umur"] > 30) & (df["kota"] == "Bogor")]
df[df["kota"].isin(["Bogor", "Depok"])]
df[df["gaji"].between(5, 10)]
df[df["nama"].str.contains("an", case=False)]
df[df["income"].notna()]
df.query("umur > 30 and kota == 'Bogor'")`,
  },
  anatomy: [
    ["df[mask]", "Baris yang mask-nya True."],
    ["(…) & (…)", "Gabungan kondisi; tanda kurung wajib."],
    ["isin([...])", "Pengganti banyak kondisi `==` dengan `|`."],
    ["between(a, b)", "Rentang inklusif."],
    ["query(\"…\")", "Kondisi sebagai string; @var untuk variabel."],
  ],
  examples: [
    {
      title: "Contoh 1 — Satu dan beberapa kondisi",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
mahal = df[df["price_million"] > 3000]
print(len(mahal), "rumah > 3 miliar")

besar_dekat = df[(df["area_m2"] >= 200) & (df["distance_to_center_km"] < 10)]
print(besar_dekat[["city", "area_m2", "distance_to_center_km", "price_million"]].head())`,
      output: "72 rumah > 3 miliar\n          city  area_m2  distance_to_center_km  price_million\n6     Surabaya      225                    5.0           2845\n10  Yogyakarta      293                    9.0           2988\n13     Bandung      260                    6.3           3150\n14    Surabaya      281                    6.4           3658\n20     Jakarta      280                    2.3           5131",
      explain: [
        ["df[df[\"price_million\"] > 3000]", "Satu kondisi."],
        ["(df[\"area_m2\"] >= 200) & (df[\"distance_to_center_km\"] < 10)", "Dua kondisi yang harus terpenuhi sekaligus."],
      ],
    },
    {
      title: "Contoh 2 — isin dan between",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
dua_kota = df[df["city"].isin(["Jakarta", "Bandung"])]
print(dua_kota["city"].value_counts())

menengah = df[df["price_million"].between(1000, 2000)]
print(len(menengah), menengah["price_million"].min(), menengah["price_million"].max())`,
      output: "city\nJakarta    114\nBandung     64\nName: count, dtype: int64\n91 1011 1978",
      explain: [
        ["df[\"city\"].isin([\"Jakarta\", \"Bandung\"])", "Sama dengan (city == \"Jakarta\") | (city == \"Bandung\"), tetapi lebih ringkas."],
        ["df[\"price_million\"].between(1000, 2000)", "1000 ≤ harga ≤ 2000."],
      ],
      change: "Kondisi berupa daftar nilai dan rentang.",
    },
    {
      title: "Contoh 3 — Pola teks dan nilai kosong",
      code: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")
toyota = df[df["car_name"].str.startswith("toyota")]
print(len(toyota), toyota["mpg"].mean().round(2))

wagon = df[df["car_name"].str.contains("wagon", case=False)]
print(len(wagon), "mobil wagon")

print("horsepower kosong:", df["horsepower"].isna().sum())
lengkap = df[df["horsepower"].notna()]
print(len(df), "→", len(lengkap))`,
      output: "25 28.37\n4 mobil wagon\nhorsepower kosong: 6\n398 → 392",
      explain: [
        ["df[\"car_name\"].str.startswith(\"toyota\")", "Nama diawali \"toyota\"."],
        ["str.contains(\"wagon\", case=False)", "Mengandung kata \"wagon\" tanpa memedulikan huruf besar/kecil."],
        ["df[df[\"horsepower\"].notna()]", "Hanya baris yang horsepower-nya terisi."],
      ],
      change: "Kondisi pada teks dan pada missing value.",
    },
    {
      title: "Contoh 4 — query() dan perbandingan kelompok",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
batas = 80
hasil = df.query("contract == 'Month-to-month' and monthly_charges > @batas")
print(len(hasil), "pelanggan, churn rate:", hasil["churn"].mean().round(3))

for kontrak in df["contract"].unique():
    sub = df[df["contract"] == kontrak]
    print(f"{kontrak:15} n={len(sub):3}  churn={sub['churn'].mean():.3f}")`,
      output: "106 pelanggan, churn rate: 0.698\nMonth-to-month  n=227  churn=0.524\nTwo year        n= 79  churn=0.114\nOne year        n= 97  churn=0.258",
      explain: [
        ["df.query(\"contract == 'Month-to-month' and monthly_charges > @batas\")", "Kondisi dalam string; `and` boleh dipakai di dalam query; @batas merujuk variabel Python."],
        ["sub = df[df[\"contract\"] == kontrak]", "Filter per kategori dalam loop."],
        ["sub['churn'].mean()", "Churn rate setiap jenis kontrak — fitur contract tampak sangat berpengaruh."],
      ],
      change: "Filtering dipakai untuk mencari insight terhadap target.",
    },
  ],
  params: [
    {
      title: "Alat filtering",
      items: [
        { name: "& | ~", desc: "AND, OR, NOT (dengan tanda kurung)." },
        { name: "s.isin(values)", desc: "Termasuk dalam daftar." },
        { name: "s.between(left, right, inclusive=\"both\")", desc: "Rentang." },
        { name: "s.str.contains(pat, case=True, na=None, regex=True)", desc: "Pola teks." },
        { name: "s.isna(), s.notna()", desc: "Kosong/terisi." },
        { name: "df.query(expr)", desc: "Kondisi sebagai string." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"k": ["a", "b", "c", "a"], "v": [1, 5, 9, 7]})\nprint(df[df["k"].isin(["a", "c"]) & (df["v"] > 2)]["v"].tolist())`, output: "[9, 7]" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
muda_kaya = df[(df["age"] < 30) & (df["income"] == ">50K")]
print(len(muda_kaya), "orang")
print(muda_kaya["education"].value_counts().head())`,
  mistakes: [
    {
      title: "and/or alih-alih &/|",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 5, 9]})
print(df[(df["a"] > 2) and (df["a"] < 8)])`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 5, 9]})
print(df[(df["a"] > 2) & (df["a"] < 8)])`,
      explain: "*The truth value of a Series is ambiguous* — gunakan `&`/`|` untuk Series. (Di dalam `query()` justru boleh memakai `and`/`or`.)",
    },
    {
      title: "Tanda kurung terlupa",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 5, 9], "b": [0, 1, 0]})
print(df[df["a"] > 2 & df["b"] == 1])`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 5, 9], "b": [0, 1, 0]})
print(df[(df["a"] > 2) & (df["b"] == 1)])`,
      explain: "`&` dievaluasi sebelum `>`/`==`, menghasilkan ekspresi yang salah. Bungkus setiap kondisi dengan tanda kurung.",
    },
    {
      title: "Nilai kategori beda huruf/spasi → 0 baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"kota": ["Jakarta ", "jakarta", "Bandung"]})
print(len(df[df["kota"] == "Jakarta"]))   # 0, padahal ada 2 data Jakarta`,
      fix: `import pandas as pd
df = pd.DataFrame({"kota": ["Jakarta ", "jakarta", "Bandung"]})
kota_bersih = df["kota"].str.strip().str.lower()
print(len(df[kota_bersih == "jakarta"]))`,
      explain: "Perbandingan teks case-sensitive dan spasi ikut dihitung. Cek `df[\"kota\"].unique()`, lalu bersihkan dengan `str.strip().str.lower()`.",
    },
  ],
  bestPractices: [
    "Simpan mask dalam variabel bernama jelas untuk kondisi yang rumit.",
    "Gunakan `isin` daripada rantai `==` dengan `|`.",
    "Cek `len()` hasil filter — filter yang menghasilkan 0 baris sering menandakan salah ketik nilai kategori.",
    "Gunakan `query()` untuk filter panjang agar lebih mudah dibaca.",
  ],
  exercises: [
    {
      id: "pd-filter-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Daftar kategori",
      prompt: "Lengkapi agar `pilih` berisi bunga spesies setosa atau virginica.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
pilih = df[df["species"].____(["setosa", "virginica"])]
print(pilih["species"].value_counts())`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
pilih = df[df["species"].isin(["setosa", "virginica"])]
print(pilih["species"].value_counts())`,
      tests: [{ desc: "100 baris dua spesies", expr: "len(pilih) == 100 and set(pilih['species']) == {'setosa', 'virginica'}" }],
      hints: ["Konsep: nilai termasuk dalam daftar.", "Method yang artinya \"is in\".", "`.isin([...])`"],
      explanation: "`isin` menggantikan beberapa kondisi `==` yang digabung `|`.",
    },
    {
      id: "pd-filter-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"n": ["ani", "Budi", "andi", "Citra"], "u": [20, 35, 28, 41]})
print(df[df["u"].between(25, 35)]["n"].tolist())
print(df[df["n"].str.startswith("a")]["n"].tolist())
print(len(df[~(df["u"] > 30)]))`,
      answer: "['Budi', 'andi']\n['ani', 'andi']\n2",
      hints: ["Konsep: between inklusif, startswith case-sensitive.", "u 28 dan 35 termasuk.", "~(u > 30) → u ≤ 30."],
      explanation: "['Budi', 'andi']; ['ani', 'andi']; 2 baris.",
    },
    {
      id: "pd-filter-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Dua kondisi",
      prompt: "Perbaiki filter agar `hasil` berisi pelanggan dengan `tenure_months < 12` **dan** `churn == 1`.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
hasil = df[df["tenure_months"] < 12 and df["churn"] == 1]
print(len(hasil))`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
hasil = df[(df["tenure_months"] < 12) & (df["churn"] == 1)]
print(len(hasil))`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Filter benar", expr: "len(hasil) == ((df['tenure_months'] < 12) & (df['churn'] == 1)).sum()" },
      ],
      hints: ["Konsep: & dan tanda kurung.", "Ganti `and` dengan `&`.", "`(df[\"tenure_months\"] < 12) & (df[\"churn\"] == 1)`"],
      explanation: "Series boolean digabung dengan `&`, setiap kondisi dalam kurung.",
    },
    {
      id: "pd-filter-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Membuang target kosong",
      prompt: "DataFrame `df` punya target `y` yang sebagian kosong. Buat `latih` = baris dengan `y` terisi, dan `prediksi_nanti` = baris dengan `y` kosong. Cetak jumlah baris keduanya.",
      starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({"x": [1, 2, 3, 4, 5, 6], "y": [10, np.nan, 30, 40, np.nan, 60]})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({"x": [1, 2, 3, 4, 5, 6], "y": [10, np.nan, 30, 40, np.nan, 60]})
latih = df[df["y"].notna()]
prediksi_nanti = df[df["y"].isna()]
print(len(latih), len(prediksi_nanti))`,
      tests: [
        { desc: "latih 4 baris tanpa NaN", expr: "len(latih) == 4 and latih['y'].notna().all()" },
        { desc: "prediksi_nanti 2 baris", expr: "prediksi_nanti['x'].tolist() == [2, 5]" },
      ],
      hints: ["Konsep: filter missing value.", "`notna()` untuk terisi, `isna()` untuk kosong.", "`df[df[\"y\"].notna()]`"],
      explanation: "Baris tanpa target tidak bisa dipakai melatih model supervised, tetapi bisa menjadi data yang akan diprediksi.",
    },
    {
      id: "pd-filter-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Konversi pengunjung toko online",
      prompt: [
        "Baca `online_shoppers.csv`. Hitung tingkat pembelian (`Revenue` mean) untuk tiga kelompok:",
        "- `rate_pv` — sesi dengan `PageValues > 0`\n- `rate_nopv` — sesi dengan `PageValues == 0`\n- `rate_nov_return` — sesi bulan `Nov` dengan `VisitorType == \"Returning_Visitor\"` (gunakan `query`)",
        "Cetak ketiganya dibulatkan 3 desimal.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
rate_pv = df[df["PageValues"] > 0]["Revenue"].mean()
rate_nopv = df[df["PageValues"] == 0]["Revenue"].mean()
rate_nov_return = df.query("Month == 'Nov' and VisitorType == 'Returning_Visitor'")["Revenue"].mean()
print(round(rate_pv, 3), round(rate_nopv, 3), round(rate_nov_return, 3))`,
      tests: [
        { desc: "rate_pv benar", expr: "abs(rate_pv - df.loc[df['PageValues'] > 0, 'Revenue'].mean()) < 1e-12" },
        { desc: "rate_nopv benar", expr: "abs(rate_nopv - df.loc[df['PageValues'] == 0, 'Revenue'].mean()) < 1e-12" },
        { desc: "rate_nov_return benar", expr: "abs(rate_nov_return - df.loc[(df['Month'] == 'Nov') & (df['VisitorType'] == 'Returning_Visitor'), 'Revenue'].mean()) < 1e-12" },
        { desc: "Memakai query", expr: "'query(' in _code" },
      ],
      hints: ["Konsep: membandingkan target antar-kelompok.", "Revenue bertipe bool → mean = proporsi True.", "Di query, teks diberi kutip tunggal: `Month == 'Nov'`."],
      explanation: "Sesi dengan PageValues > 0 punya tingkat pembelian jauh lebih tinggi — PageValues kemungkinan fitur terpenting untuk model.",
    },
  ],
  quiz: [
    { id: "pd-filter-q1", type: "mcq", prompt: "Cara benar memfilter umur 20–30 inklusif?", options: ["df[20 <= df.umur <= 30]", "df[df[\"umur\"].between(20, 30)]", "df[df[\"umur\"] in range(20, 30)]", "df.between(20, 30)"], answer: 1, explanation: "`between` inklusif secara default." },
    { id: "pd-filter-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3, 4]})\nprint(len(df[(df["a"] > 1) | (df["a"] == 1)]))`, options: ["3", "4", "1", "0"], answer: 1, explanation: "Semua baris memenuhi salah satu kondisi." },
    { id: "pd-filter-q3", type: "tf", prompt: "Di dalam `df.query()`, kita boleh memakai `and` dan `or`.", answer: true, explanation: "query mem-parsing string sendiri." },
    { id: "pd-filter-q4", type: "fill", prompt: "Baris yang kolom x-nya TIDAK kosong: `df[df[\"x\"].____()]`", answer: ["notna", "notnull"], explanation: "`notna()`." },
    { id: "pd-filter-q5", type: "case", prompt: "Filter `df[df[\"kota\"] == \"jakarta\"]` menghasilkan 0 baris, padahal ada data Jakarta. Penyebab paling mungkin?", options: ["Pandas error", "Nilai sebenarnya \"Jakarta\" (huruf besar) atau ada spasi", "Kolom kota numerik", "Data terlalu besar"], answer: 1, explanation: "Perbandingan teks case-sensitive; cek `df[\"kota\"].unique()`." },
  ],
  challenge: {
    id: "pd-filter-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Analisis kesalahan prediksi",
    prompt: [
      "Diberikan `df` hasil prediksi harga rumah (`price_million` asli dan `pred`). Tambahkan kolom `abs_err`, lalu:",
      "1. `meleset` = baris dengan `abs_err > 500`, diurutkan dari error terbesar (`sort_values`).\n2. `kota_terburuk` = kota yang paling sering muncul di `meleset` (`value_counts().idxmax()`).\n3. `pct_meleset` = persentase baris yang meleset (1 desimal).",
      "Cetak `len(meleset)`, `kota_terburuk`, dan `pct_meleset`.",
    ],
    starter: `import numpy as np
import pandas as pd
df = pd.read_csv("house_prices.csv")
rng = np.random.default_rng(0)
df["pred"] = df["price_million"] * rng.normal(1, 0.15, len(df))   # prediksi simulasi
# Tulis kodemu di sini
`,
    solution: `import numpy as np
import pandas as pd
df = pd.read_csv("house_prices.csv")
rng = np.random.default_rng(0)
df["pred"] = df["price_million"] * rng.normal(1, 0.15, len(df))   # prediksi simulasi
df["abs_err"] = (df["price_million"] - df["pred"]).abs()
meleset = df[df["abs_err"] > 500].sort_values("abs_err", ascending=False)
kota_terburuk = meleset["city"].value_counts().idxmax()
pct_meleset = round(len(meleset) / len(df) * 100, 1)
print(len(meleset), kota_terburuk, pct_meleset)`,
    tests: [
      { desc: "abs_err benar", expr: "abs((df['abs_err'] - (df['price_million'] - df['pred']).abs()).max()) < 1e-9" },
      { desc: "meleset terfilter & terurut", expr: "(meleset['abs_err'] > 500).all() and meleset['abs_err'].is_monotonic_decreasing and len(meleset) == (df['abs_err'] > 500).sum()" },
      { desc: "kota_terburuk benar", expr: "kota_terburuk == df[df['abs_err'] > 500]['city'].value_counts().idxmax()" },
      { desc: "pct_meleset benar", expr: "pct_meleset == round((df['abs_err'] > 500).mean() * 100, 1)" },
    ],
    hints: ["Konsep: filter + sort + value_counts.", "`(df[\"price_million\"] - df[\"pred\"]).abs()`", "`meleset[\"city\"].value_counts().idxmax()`"],
    explanation: "Error analysis seperti ini menunjukkan di mana model lemah (misalnya rumah mahal di kota tertentu) dan memberi petunjuk fitur apa yang perlu ditambahkan.",
  },
  summary: [
    "Filter = `df[mask]` atau `df.loc[mask]` dengan mask boolean dari kondisi kolom.",
    "Gabungkan dengan `&`, `|`, `~` dan tanda kurung.",
    "`isin`, `between`, `str.contains`/`str.startswith`, `isna`/`notna` mempermudah kondisi umum.",
    "`query()` untuk kondisi panjang; `@var` untuk variabel.",
  ],
  cheatsheet: [
    { syntax: "df[(c1) & (c2)]", desc: "Dua kondisi" },
    { syntax: "df[df.k.isin([...])]", desc: "Daftar nilai" },
    { syntax: "df[df.x.between(a, b)]", desc: "Rentang" },
    { syntax: "df[df.s.str.contains(p, na=False)]", desc: "Pola teks" },
    { syntax: "df.query(\"x > @t\")", desc: "Query string" },
  ],
  flashcards: [
    { q: "Filter baris dengan kota Bogor atau Depok", a: "df[df[\"kota\"].isin([\"Bogor\", \"Depok\"])]" },
    { q: "Filter baris dengan target y tidak kosong", a: "df[df[\"y\"].notna()]" },
    { q: "Merujuk variabel Python t di dalam query", a: "df.query(\"x > @t\")" },
  ],
  references: [
    pandasDoc("Getting started — How do I filter specific rows from a DataFrame?", "getting_started/intro_tutorials/03_subset_data.html"),
    pandasDoc("Indexing and selecting data — Boolean indexing", "user_guide/indexing.html#boolean-indexing"),
    pandasDoc("Indexing and selecting data — The query() method", "user_guide/indexing.html#the-query-method"),
    pandasDoc("pandas.Series.str.contains", "reference/api/pandas.Series.str.contains.html"),
  ],
};
