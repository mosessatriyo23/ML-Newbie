import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-groupby",
  title: "GroupBy",
  minutes: 45,
  prerequisites: ["pd-filtering-data"],
  objectives: [
    "Memahami pola **split–apply–combine** di balik `groupby`.",
    "Menghitung statistik per kelompok dengan satu atau beberapa kolom kunci.",
    "Membedakan hasil Series dan DataFrame, serta memakai `as_index=False`/`reset_index()`.",
    "Memakai `transform` untuk membuat fitur kelompok yang sejajar dengan baris asli.",
  ],
  definition: [
    "`groupby` mengikuti tiga langkah (istilah dari dokumentasi resmi pandas, dipopulerkan oleh Hadley Wickham dalam makalah *The Split-Apply-Combine Strategy for Data Analysis*, 2011):\n1. **Split** — pisahkan baris menjadi kelompok berdasarkan nilai kunci (misalnya kota)\n2. **Apply** — terapkan fungsi pada setiap kelompok (mean, sum, count, …)\n3. **Combine** — gabungkan hasilnya menjadi satu tabel",
    "`df.groupby(\"kota\")[\"harga\"].mean()` menghasilkan **Series** berindeks kota. Dengan beberapa kunci, `groupby([\"kota\", \"tipe\"])`, index-nya menjadi MultiIndex.",
    "`as_index=False` atau `.reset_index()` mengubah kunci kelompok kembali menjadi kolom biasa — lebih mudah untuk merge dan ekspor.",
    "`transform` mengembalikan hasil dengan **panjang sama seperti df asli** (setiap baris mendapat nilai kelompoknya), sehingga bisa langsung menjadi kolom baru: `df[\"rata_kota\"] = df.groupby(\"kota\")[\"harga\"].transform(\"mean\")`.",
    "Secara default, NaN di kolom kunci tidak membentuk kelompok (`dropna=True`).",
  ],
  why: [
    "GroupBy menjawab pertanyaan inti EDA: \"Apakah target berbeda antar-kelompok?\" — churn per jenis kontrak, harga per kota, default per jumlah bulan telat.",
    "Fitur berbasis kelompok (rata-rata harga di kota itu, jumlah transaksi per pelanggan, rata-rata PM2.5 bulan yang sama) termasuk teknik feature engineering paling efektif di kompetisi Kaggle.",
  ],
  when: [
    "- Membandingkan statistik antar-kategori.",
    "- Merangkum data transaksi per pelanggan/hari/bulan.",
    "- Membuat fitur agregat kelompok.",
    "- Imputasi missing value per kelompok (misalnya median per kota).",
  ],
  analogy: "GroupBy seperti **menghitung hasil ujian per kelas**: kertas ujian dipisahkan ke tumpukan per kelas (split), rata-rata setiap tumpukan dihitung (apply), lalu ditulis dalam satu tabel rekap (combine).",
  syntax: {
    code: `df.groupby("kota")["harga"].mean()
df.groupby(["kota", "tipe"])["harga"].median()
df.groupby("kota", as_index=False)["harga"].mean()
df.groupby("kota").size()
df["rata_kota"] = df.groupby("kota")["harga"].transform("mean")`,
  },
  anatomy: [
    ["groupby(\"kota\")", "Split berdasarkan kunci."],
    ["[\"harga\"]", "Kolom yang diolah."],
    [".mean()", "Apply + combine."],
    [".size()", "Jumlah baris per kelompok (termasuk NaN)."],
    [".transform(\"mean\")", "Hasil sejajar dengan baris asli."],
  ],
  examples: [
    {
      title: "Contoh 1 — Satu kunci, satu kolom",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.groupby("city")["price_million"].mean().round(1))
print(df.groupby("city").size())`,
      output: "city\nBandung       1742.0\nJakarta       2671.6\nSurabaya      1897.5\nYogyakarta    1658.0\nName: price_million, dtype: float64\ncity\nBandung        64\nJakarta       114\nSurabaya       82\nYogyakarta     40\ndtype: int64",
      explain: [
        ["df.groupby(\"city\")[\"price_million\"].mean()", "Rata-rata harga per kota → Series berindeks kota (terurut alfabetis)."],
        ["df.groupby(\"city\").size()", "Jumlah rumah per kota."],
      ],
    },
    {
      title: "Contoh 2 — Target per kelompok",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
churn = df.groupby("contract")["churn"].mean().sort_values(ascending=False)
print(churn.round(3))

tabel = df.groupby(["contract", "internet_service"], as_index=False)["churn"].mean()
print(tabel.round(3))`,
      output: "contract\nMonth-to-month    0.524\nOne year          0.258\nTwo year          0.114\nName: churn, dtype: float64\n         contract internet_service  churn\n0  Month-to-month              DSL  0.547\n1  Month-to-month      Fiber optic  0.505\n2  Month-to-month               No  0.529\n3        One year              DSL  0.282\n4        One year      Fiber optic  0.237\n5        One year               No  0.250\n6        Two year              DSL  0.120\n7        Two year      Fiber optic  0.147\n8        Two year               No  0.050",
      explain: [
        ["df.groupby(\"contract\")[\"churn\"].mean()", "churn bernilai 0/1, jadi mean = churn rate."],
        ["groupby([\"contract\", \"internet_service\"], as_index=False)", "Dua kunci; as_index=False menjadikan kunci kolom biasa."],
      ],
      change: "Dari harga per kota ke churn rate per kombinasi kategori.",
    },
    {
      title: "Contoh 3 — Beberapa statistik sekaligus",
      code: `import pandas as pd

df = pd.read_csv("iris.csv")
print(df.groupby("species")["petal_length"].agg(["mean", "std", "min", "max"]).round(2))
print(df.groupby("species").mean().round(2))`,
      output: "            mean   std  min  max\nspecies                         \nsetosa      1.46  0.17  1.0  1.9\nversicolor  4.26  0.47  3.0  5.1\nvirginica   5.55  0.55  4.5  6.9\n            sepal_length  sepal_width  petal_length  petal_width\nspecies                                                         \nsetosa              5.01         3.43          1.46         0.25\nversicolor          5.94         2.77          4.26         1.33\nvirginica           6.59         2.97          5.55         2.03",
      explain: [
        ["agg([\"mean\", \"std\", \"min\", \"max\"])", "Beberapa fungsi → DataFrame dengan satu kolom per fungsi (lebih lanjut di materi Aggregation)."],
        ["df.groupby(\"species\").mean()", "Tanpa memilih kolom: mean semua kolom numerik."],
      ],
      change: "Satu kelompok → banyak statistik.",
    },
    {
      title: "Contoh 4 — transform untuk fitur kelompok",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
df["harga_rata_kota"] = df.groupby("city")["price_million"].transform("mean")
df["rasio_vs_kota"] = df["price_million"] / df["harga_rata_kota"]
df["rank_di_kota"] = df.groupby("city")["price_million"].rank(ascending=False)
print(df[["city", "price_million", "harga_rata_kota", "rasio_vs_kota", "rank_di_kota"]].head().round(2))
print(df.shape)`,
      output: "       city  price_million  harga_rata_kota  rasio_vs_kota  rank_di_kota\n0   Jakarta           4828          2671.63           1.81           5.0\n1   Bandung           1429          1741.95           0.82          39.0\n2  Surabaya            250          1897.50           0.13          81.0\n3   Jakarta           4491          2671.63           1.68          15.0\n4  Surabaya            376          1897.50           0.20          78.0\n(300, 11)",
      explain: [
        ["transform(\"mean\")", "Setiap rumah mendapat rata-rata harga kotanya — panjang hasil = jumlah baris df."],
        ["df[\"price_million\"] / df[\"harga_rata_kota\"]", "Fitur relatif: lebih mahal/murah dibanding rata-rata kotanya."],
        ["groupby(\"city\")[\"price_million\"].rank(ascending=False)", "Peringkat di dalam kota masing-masing."],
      ],
      change: "Hasil groupby dikembalikan ke level baris sebagai fitur baru.",
    },
  ],
  params: [
    {
      title: "groupby",
      items: [
        { name: "by", desc: "Kolom kunci (atau list kolom, atau Series)." },
        { name: "as_index=True", desc: "False → kunci menjadi kolom biasa." },
        { name: "dropna=True", desc: "False → NaN menjadi kelompok sendiri." },
        { name: "observed", desc: "Untuk kunci Categorical: True hanya kategori yang muncul." },
        { name: "size(), count(), nunique()", desc: "Jumlah baris / non-null / nilai unik per kelompok." },
        { name: "transform(func)", desc: "Hasil sejajar dengan baris asli." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"k": ["a", "b", "a", "b"], "v": [1, 2, 3, 6]})\nprint(df.groupby("k")["v"].sum().to_dict(), df.groupby("k")["v"].transform("mean").tolist())`, output: "{'a': 4, 'b': 8} [2.0, 4.0, 2.0, 4.0]" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
df["kaya"] = (df["income"] == ">50K").astype(int)
print(df.groupby("education")["kaya"].mean().sort_values(ascending=False).round(3).head(8))`,
  mistakes: [
    {
      title: "Mean pada kolom teks",
      wrong: `import pandas as pd
df = pd.DataFrame({"k": ["a", "a"], "nama": ["x", "y"], "v": [1, 3]})
print(df.groupby("k").mean())`,
      error: "TypeError",
      fix: `import pandas as pd
df = pd.DataFrame({"k": ["a", "a"], "nama": ["x", "y"], "v": [1, 3]})
print(df.groupby("k").mean(numeric_only=True))`,
      explain: "Kolom teks tidak bisa dirata-rata. Pilih kolom numerik (`[\"v\"]`) atau gunakan `numeric_only=True`.",
    },
    {
      title: "Memakai agg saat butuh nilai per baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"k": ["a", "b", "a"], "v": [1, 2, 3]})
df["rata"] = df.groupby("k")["v"].mean()
print(df["rata"].tolist())   # [nan, nan, nan] — index tidak cocok`,
      fix: `import pandas as pd
df = pd.DataFrame({"k": ["a", "b", "a"], "v": [1, 2, 3]})
df["rata"] = df.groupby("k")["v"].transform("mean")
print(df["rata"].tolist())`,
      explain: "`mean()` menghasilkan satu baris per kelompok (index a, b) sehingga tidak sejajar dengan df. Gunakan `transform`.",
    },
    {
      title: "Kelompok NaN hilang tanpa disadari",
      wrong: `import numpy as np
import pandas as pd
df = pd.DataFrame({"kota": ["A", np.nan, "A", np.nan], "v": [1, 2, 3, 4]})
print(df.groupby("kota")["v"].sum().sum(), "dari", df["v"].sum())`,
      fix: `import numpy as np
import pandas as pd
df = pd.DataFrame({"kota": ["A", np.nan, "A", np.nan], "v": [1, 2, 3, 4]})
print(df.groupby("kota", dropna=False)["v"].sum())`,
      explain: "Baris dengan kunci NaN dibuang secara default. Gunakan `dropna=False` untuk melihatnya.",
    },
  ],
  bestPractices: [
    "Selalu pilih kolom yang diolah setelah groupby (`[\"kolom\"]`).",
    "Lihat juga ukuran kelompok (`size()`) — rata-rata dari 3 data tidak sekuat dari 3000 data.",
    "Gunakan `transform` untuk fitur kelompok; hitung statistiknya **hanya dari training data** agar tidak bocor ke test.",
    "Gunakan `as_index=False` jika hasil akan di-merge atau diekspor.",
  ],
  exercises: [
    {
      id: "pd-gb-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Rata-rata per kelompok",
      prompt: "Lengkapi agar `rata` berisi rata-rata `sepal_length` per spesies.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
rata = df.____("species")["sepal_length"].mean()
print(rata)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
rata = df.groupby("species")["sepal_length"].mean()
print(rata)`,
      tests: [{ desc: "rata benar", expr: "rata.round(3).to_dict() == {'setosa': 5.006, 'versicolor': 5.936, 'virginica': 6.588}" }],
      hints: ["Konsep: split-apply-combine.", "Method untuk mengelompokkan.", "`df.groupby(\"species\")`"],
      explanation: "Hasilnya Series berindeks spesies.",
    },
    {
      id: "pd-gb-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"g": ["x", "y", "x", "x", "y"], "v": [10, 20, 30, 50, 40]})
print(df.groupby("g")["v"].sum().tolist())
print(df.groupby("g").size().tolist())
print(df.groupby("g")["v"].transform("max").tolist())`,
      answer: "[90, 60]\n[3, 2]\n[50, 40, 50, 50, 40]",
      hints: ["Konsep: agregasi vs transform.", "x: 10, 30, 50; y: 20, 40.", "transform mengembalikan nilai per baris."],
      explanation: "sum [90, 60]; size [3, 2]; max per baris [50, 40, 50, 50, 40].",
    },
    {
      id: "pd-gb-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kolom NaN",
      prompt: "Kolom `rata_kota` berisi NaN karena index tidak cocok. Perbaiki agar setiap rumah mendapat rata-rata harga kotanya.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
df["rata_kota"] = df.groupby("city")["price_million"].mean()
print(df["rata_kota"].isna().sum())`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
df["rata_kota"] = df.groupby("city")["price_million"].transform("mean")
print(df["rata_kota"].isna().sum())`,
      tests: [
        { desc: "Tidak ada NaN", expr: "df['rata_kota'].notna().all()" },
        { desc: "Nilai benar", expr: "abs(df.loc[df['city'] == 'Bandung', 'rata_kota'].iloc[0] - df.loc[df['city'] == 'Bandung', 'price_million'].mean()) < 1e-9" },
      ],
      hints: ["Konsep: hasil sejajar baris.", "mean() memberi satu nilai per kota.", "`transform(\"mean\")`"],
      explanation: "transform mengembalikan Series dengan index yang sama seperti df.",
    },
    {
      id: "pd-gb-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Imputasi median per kelompok",
      prompt: "Isi NaN di kolom `harga` dengan median harga kota yang sama: `df[\"harga\"] = df[\"harga\"].fillna(df.groupby(\"kota\")[\"harga\"].transform(\"median\"))`. Cetak `df[\"harga\"].tolist()`.",
      starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({"kota": ["A", "A", "A", "B", "B"], "harga": [100, np.nan, 300, 50, np.nan]})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({"kota": ["A", "A", "A", "B", "B"], "harga": [100, np.nan, 300, 50, np.nan]})
df["harga"] = df["harga"].fillna(df.groupby("kota")["harga"].transform("median"))
print(df["harga"].tolist())`,
      tests: [{ desc: "NaN diisi median kota", expr: "df['harga'].tolist() == [100.0, 200.0, 300.0, 50.0, 50.0]" }],
      hints: ["Konsep: transform + fillna.", "Median A = 200, median B = 50.", "Isi NaN dengan Series hasil transform."],
      explanation: "Imputasi per kelompok lebih akurat daripada satu median global karena menghormati perbedaan antar-kota.",
    },
    {
      id: "pd-gb-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pola pembelian per bulan",
      prompt: [
        "Baca `online_shoppers.csv`. Buat `per_bulan` = DataFrame dengan kolom `Month`, `sesi` (jumlah baris), dan `conv` (rata-rata Revenue), memakai `groupby(\"Month\", as_index=False)` lalu `agg(sesi=(\"Revenue\", \"size\"), conv=(\"Revenue\", \"mean\"))`.",
        "Urutkan dari `conv` tertinggi dan cetak dengan `conv` dibulatkan 3 desimal.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
per_bulan = df.groupby("Month", as_index=False).agg(sesi=("Revenue", "size"), conv=("Revenue", "mean"))
per_bulan = per_bulan.sort_values("conv", ascending=False)
print(per_bulan.round(3))`,
      tests: [
        { desc: "Kolom benar", expr: "per_bulan.columns.tolist() == ['Month', 'sesi', 'conv']" },
        { desc: "Total sesi = jumlah baris", expr: "per_bulan['sesi'].sum() == len(df)" },
        { desc: "Terurut conv menurun", expr: "per_bulan['conv'].is_monotonic_decreasing" },
        { desc: "Nov tertinggi", expr: "per_bulan.iloc[0]['Month'] == 'Nov'" },
      ],
      hints: ["Konsep: named aggregation.", "agg(nama_baru=(kolom, fungsi)).", "Lalu sort_values(\"conv\", ascending=False)."],
      explanation: "November (musim belanja akhir tahun) punya konversi tertinggi — fitur bulan jelas relevan untuk model.",
    },
  ],
  quiz: [
    { id: "pd-gb-q1", type: "mcq", prompt: "Tiga langkah di balik groupby adalah…", options: ["Load–Clean–Train", "Split–Apply–Combine", "Sort–Filter–Merge", "Fit–Transform–Predict"], answer: 1, explanation: "Split-apply-combine." },
    { id: "pd-gb-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"k": ["a", "a", "b"], "v": [2, 4, 9]})\nprint(df.groupby("k")["v"].mean().tolist())`, options: ["[5.0]", "[3.0, 9.0]", "[3.0, 3.0, 9.0]", "[6, 9]"], answer: 1, explanation: "a = 3.0, b = 9.0." },
    { id: "pd-gb-q3", type: "tf", prompt: "`transform` menghasilkan Series dengan panjang sama seperti DataFrame asli.", answer: true, explanation: "Satu nilai per baris." },
    { id: "pd-gb-q4", type: "fill", prompt: "Jumlah baris per kelompok (termasuk NaN): `df.groupby(\"k\").____()`", answer: ["size"], explanation: "`size()`; count() hanya non-null." },
    { id: "pd-gb-q5", type: "case", prompt: "Kamu ingin fitur \"rata-rata PM2.5 bulan yang sama di tahun-tahun sebelumnya\". Alat yang tepat?", options: ["sort_values", "groupby bulan + transform/merge dari data latih", "drop", "rename"], answer: 1, explanation: "Statistik kelompok dari data historis sebagai fitur." },
  ],
  challenge: {
    id: "pd-gb-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Target encoding tanpa leakage",
    prompt: [
      "Target encoding mengganti kategori dengan rata-rata target kategori itu. Agar tidak bocor, rata-rata harus dihitung **hanya dari train**.",
      "1. Dari `customer_churn.csv`, pisahkan `train` = 300 baris pertama dan `test` = sisanya (iloc).\n2. `peta` = rata-rata churn per `contract` di train.\n3. Buat kolom `contract_te` di train dan test dengan `map(peta)`; kategori yang tidak ada di train diisi rata-rata churn global train.",
      "Cetak `peta` (3 desimal) dan 5 baris pertama `test[[\"contract\", \"contract_te\"]]`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
train = df.iloc[:300].copy()
test = df.iloc[300:].copy()
peta = train.groupby("contract")["churn"].mean()
global_mean = train["churn"].mean()
train["contract_te"] = train["contract"].map(peta).fillna(global_mean)
test["contract_te"] = test["contract"].map(peta).fillna(global_mean)
print(peta.round(3))
print(test[["contract", "contract_te"]].head())`,
    tests: [
      { desc: "peta dari train saja", expr: "peta.round(6).to_dict() == df.iloc[:300].groupby('contract')['churn'].mean().round(6).to_dict()" },
      { desc: "test diencode dengan peta train", expr: "abs(test['contract_te'] - test['contract'].map(df.iloc[:300].groupby('contract')['churn'].mean()).fillna(df.iloc[:300]['churn'].mean())).max() < 1e-12" },
      { desc: "Tidak ada NaN", expr: "train['contract_te'].notna().all() and test['contract_te'].notna().all()" },
      { desc: "Ukuran split benar", expr: "len(train) == 300 and len(test) == len(df) - 300" },
    ],
    hints: ["Konsep: groupby sebagai 'fit', map sebagai 'transform'.", "`peta = train.groupby(\"contract\")[\"churn\"].mean()`", "`test[\"contract\"].map(peta).fillna(global_mean)`"],
    explanation: "Pola fit-on-train/transform-on-test ini sama dengan cara kerja scikit-learn (`TargetEncoder`). Menghitung peta dari seluruh data akan membocorkan target test ke fitur.",
  },
  summary: [
    "groupby = split → apply → combine.",
    "`df.groupby(kunci)[kolom].fungsi()` → satu baris per kelompok.",
    "`as_index=False`/`reset_index()` menjadikan kunci kolom biasa.",
    "`transform` mengembalikan nilai per baris — untuk fitur kelompok dan imputasi per kelompok.",
    "Statistik kelompok untuk fitur harus dihitung dari training data saja.",
  ],
  cheatsheet: [
    { syntax: "df.groupby(\"k\")[\"v\"].mean()", desc: "Rata-rata per kelompok" },
    { syntax: "df.groupby([\"a\", \"b\"], as_index=False)[\"v\"].sum()", desc: "Dua kunci" },
    { syntax: "df.groupby(\"k\").size()", desc: "Ukuran kelompok" },
    { syntax: "df.groupby(\"k\")[\"v\"].transform(\"mean\")", desc: "Fitur kelompok" },
    { syntax: "s.fillna(df.groupby(\"k\")[\"v\"].transform(\"median\"))", desc: "Imputasi per kelompok" },
  ],
  flashcards: [
    { q: "Churn rate per jenis kontrak", a: "df.groupby(\"contract\")[\"churn\"].mean()" },
    { q: "Rata-rata kelompok sebagai kolom per baris", a: "df.groupby(\"k\")[\"v\"].transform(\"mean\")" },
    { q: "Perbedaan size() dan count()", a: "size menghitung semua baris; count hanya nilai non-null" },
  ],
  references: [
    pandasDoc("Group by: split-apply-combine", "user_guide/groupby.html"),
    pandasDoc("Group by — Transformation", "user_guide/groupby.html#transformation"),
    pandasDoc("Getting started — How to calculate summary statistics", "getting_started/intro_tutorials/06_calculate_statistics.html"),
    pandasDoc("Comparison with SQL — GROUP BY", "getting_started/comparison/comparison_with_sql.html#group-by"),
  ],
};
