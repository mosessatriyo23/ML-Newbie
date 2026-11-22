import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-aggregation",
  title: "Aggregation",
  minutes: 40,
  prerequisites: ["pd-groupby"],
  objectives: [
    "Memakai `agg` dengan list fungsi, dictionary per kolom, dan *named aggregation*.",
    "Menulis fungsi agregasi kustom (misalnya persentil, rentang).",
    "Membuat tabel ringkasan dua dimensi dengan `pivot_table` dan `pd.crosstab`.",
    "Merangkum data harian menjadi mingguan/bulanan dengan `resample`.",
  ],
  definition: [
    "**Agregasi** mengubah banyak nilai menjadi satu ringkasan: sum, mean, median, min, max, count, std, nunique, first, last.",
    "`agg` memberi kendali penuh:\n- list fungsi: `.agg([\"mean\", \"max\"])`\n- dictionary per kolom: `.agg({\"harga\": \"mean\", \"luas\": \"max\"})`\n- **named aggregation** (paling jelas): `.agg(harga_rata=(\"harga\", \"mean\"), n=(\"harga\", \"size\"))` — nama kolom hasil ditentukan sendiri",
    "`pivot_table(index, columns, values, aggfunc)` membuat tabel silang seperti PivotTable Excel. `pd.crosstab(a, b, normalize=...)` menghitung frekuensi/proporsi kombinasi dua kategori.",
    "Untuk data ber-index waktu, `df.resample(\"W\").mean()` / `resample(\"MS\")` mengagregasi per minggu/bulan.",
  ],
  why: [
    "Ringkasan per kelompok adalah bahan utama laporan EDA dan fitur model. Contoh: total belanja, jumlah transaksi, dan hari sejak transaksi terakhir per pelanggan (fitur RFM untuk segmentasi).",
    "Untuk forecasting, data mentah per jam sering perlu diagregasi menjadi rata-rata harian — misalnya data CAMS per jam menjadi PM2.5 harian agar sejajar dengan target.",
  ],
  when: [
    "- Membuat tabel ringkasan multi-statistik.",
    "- Membuat fitur level entitas dari data transaksi.",
    "- Tabel silang dua kategori.",
    "- Mengubah frekuensi data waktu (jam → hari → bulan).",
  ],
  analogy: "Agregasi seperti **membuat rapor** dari ratusan nilai harian: setiap mata pelajaran diringkas menjadi rata-rata, nilai tertinggi, dan jumlah tugas — satu halaman yang mewakili satu semester.",
  syntax: {
    code: `g = df.groupby("kota")
g["harga"].agg(["mean", "median", "max"])
g.agg({"harga": "mean", "luas": ["min", "max"]})
g.agg(rata=("harga", "mean"), n=("harga", "size"))
df.pivot_table(index="kota", columns="tipe", values="harga", aggfunc="mean")
pd.crosstab(df["a"], df["b"], normalize="index")
df.set_index("tanggal").resample("MS")["pm25"].mean()`,
  },
  anatomy: [
    ["agg([...])", "Beberapa fungsi untuk kolom yang sama."],
    ["agg({kol: fungsi})", "Fungsi berbeda per kolom."],
    ["agg(nama=(kol, fungsi))", "Named aggregation — nama hasil jelas."],
    ["pivot_table(...)", "Tabel silang dengan agregasi."],
    ["resample(\"MS\")", "Kelompok waktu: awal bulan (Month Start)."],
  ],
  examples: [
    {
      title: "Contoh 1 — List fungsi dan dictionary",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
g = df.groupby("city")
print(g["price_million"].agg(["mean", "median", "max"]).round(0))
print(g.agg({"price_million": "median", "area_m2": ["min", "max"]}))`,
      output: "              mean  median   max\ncity                            \nBandung     1742.0  1797.0  3379\nJakarta     2672.0  2620.0  5141\nSurabaya    1898.0  1785.0  4014\nYogyakarta  1658.0  1386.0  3198\n           price_million area_m2     \n                  median     min  max\ncity                                 \nBandung           1797.0      40  299\nJakarta           2620.5      38  300\nSurabaya          1785.0      37  299\nYogyakarta        1385.5      59  293",
      explain: [
        ["g[\"price_million\"].agg([\"mean\", \"median\", \"max\"])", "Tiga statistik untuk satu kolom."],
        ["g.agg({\"price_million\": \"median\", \"area_m2\": [\"min\", \"max\"]})", "Fungsi berbeda per kolom; hasilnya punya kolom bertingkat (MultiIndex)."],
      ],
    },
    {
      title: "Contoh 2 — Named aggregation",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
ringkas = df.groupby("contract", as_index=False).agg(
    n_pelanggan=("customer_id", "nunique"),
    tenure_median=("tenure_months", "median"),
    tagihan_rata=("monthly_charges", "mean"),
    churn_rate=("churn", "mean"),
)
print(ringkas.round(2))`,
      output: "         contract  n_pelanggan  tenure_median  tagihan_rata  churn_rate\n0  Month-to-month          224           36.0         73.12        0.52\n1        One year           97           27.0         70.13        0.26\n2        Two year           79           37.0         71.08        0.11",
      explain: [
        ["n_pelanggan=(\"customer_id\", \"nunique\")", "Format: nama_hasil=(kolom, fungsi)."],
        ["churn_rate=(\"churn\", \"mean\")", "Nama kolom hasil langsung bermakna — tidak perlu rename atau meratakan MultiIndex."],
      ],
      change: "Nama kolom hasil ditentukan sendiri.",
    },
    {
      title: "Contoh 3 — Fungsi kustom, pivot_table, dan crosstab",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
def rentang(x):
    return x.max() - x.min()

print(df.groupby("sex")["hours_per_week"].agg(["median", rentang, lambda x: x.quantile(0.9)]))

df["kaya"] = (df["income"] == ">50K").astype(int)
print(df.pivot_table(index="race", columns="sex", values="kaya", aggfunc="mean").round(3))
print(pd.crosstab(df["sex"], df["income"], normalize="index").round(3))`,
      output: "        median  rentang  <lambda_0>\nsex                                \nFemale    40.0       98        48.0\nMale      40.0       98        60.0\nsex                 Female   Male\nrace                             \nAmer-Indian-Eskimo   0.101  0.125\nAsian-Pac-Islander   0.124  0.336\nBlack                0.058  0.189\nOther                0.055  0.117\nWhite                0.119  0.318\nincome  <=50K   >50K\nsex                 \nFemale  0.891  0.109\nMale    0.694  0.306",
      explain: [
        ["def rentang(x):", "Fungsi kustom menerima Series satu kelompok dan mengembalikan satu nilai."],
        ["lambda x: x.quantile(0.9)", "Persentil ke-90 per kelompok."],
        ["df.pivot_table(index=\"race\", columns=\"sex\", values=\"kaya\", aggfunc=\"mean\")", "Proporsi >50K untuk setiap kombinasi race × sex."],
        ["pd.crosstab(df[\"sex\"], df[\"income\"], normalize=\"index\")", "Proporsi kategori income di setiap baris (sex) — setiap baris berjumlah 1."],
      ],
      change: "Ringkasan dua dimensi dan fungsi buatan sendiri.",
    },
    {
      title: "Contoh 4 — resample data waktu",
      code: `import numpy as np
import pandas as pd

rng = np.random.default_rng(0)
jam = pd.date_range("2025-01-01", "2025-03-31 23:00", freq="h")
df = pd.DataFrame({"waktu": jam, "pm25": rng.gamma(4, 10, len(jam)).round(1)})

harian = df.set_index("waktu").resample("D")["pm25"].mean()
print(len(df), "jam →", len(harian), "hari")
print(harian.head(3).round(2))

bulanan = df.set_index("waktu").resample("MS")["pm25"].agg(["mean", "max"])
print(bulanan.round(1))`,
      output: "2160 jam → 90 hari\nwaktu\n2025-01-01    36.55\n2025-01-02    41.11\n2025-01-03    37.68\nFreq: D, Name: pm25, dtype: float64\n            mean    max\nwaktu                  \n2025-01-01  39.6  123.8\n2025-02-01  40.0  116.2\n2025-03-01  40.9  122.4",
      explain: [
        ["pd.date_range(\"2025-01-01\", \"2025-03-31 23:00\", freq=\"h\")", "Data simulasi per jam selama 3 bulan."],
        ["resample(\"D\")[\"pm25\"].mean()", "Rata-rata harian — mirip mengubah data CAMS per jam menjadi target harian."],
        ["resample(\"MS\")[\"pm25\"].agg([\"mean\", \"max\"])", "Ringkasan per bulan (MS = label awal bulan)."],
      ],
      change: "Kelompok bukan kategori, tetapi rentang waktu.",
    },
  ],
  params: [
    {
      title: "Fungsi agregasi",
      items: [
        { name: "\"sum\", \"mean\", \"median\", \"min\", \"max\", \"std\", \"var\"", desc: "Statistik numerik." },
        { name: "\"count\", \"size\", \"nunique\"", desc: "Non-null / semua / unik." },
        { name: "\"first\", \"last\"", desc: "Nilai pertama/terakhir dalam kelompok." },
        { name: "pivot_table(index, columns, values, aggfunc=\"mean\", fill_value=None, margins=False)", desc: "Tabel silang." },
        { name: "pd.crosstab(index, columns, normalize=False)", desc: "Frekuensi; normalize=\"index\"/\"columns\"/\"all\"." },
        { name: "resample(rule)", desc: "\"h\", \"D\", \"W\", \"MS\", \"ME\", \"YS\"." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"k": ["a", "a", "b"], "v": [1, 5, 4]})\nprint(df.groupby("k").agg(total=("v", "sum"), n=("v", "size")).to_dict("index"))`, output: "{'a': {'total': 6, 'n': 2}, 'b': {'total': 4, 'n': 1}}" },
  tryIt: `import pandas as pd

df = pd.read_csv("wholesale_customers.csv")
print(df.groupby("Channel")[["Fresh", "Milk", "Grocery"]].agg(["mean", "median"]).round(0))
print(pd.crosstab(df["Channel"], df["Region"]))`,
  mistakes: [
    {
      title: "Nama fungsi salah ketik",
      wrong: `import pandas as pd
df = pd.DataFrame({"k": ["a"], "v": [1]})
print(df.groupby("k")["v"].agg(["average"]))`,
      error: "AttributeError",
      fix: `import pandas as pd
df = pd.DataFrame({"k": ["a"], "v": [1]})
print(df.groupby("k")["v"].agg(["mean"]))`,
      explain: "Nama fungsi string harus nama method pandas: \"mean\", bukan \"average\".",
    },
    {
      title: "resample tanpa index datetime",
      wrong: `import pandas as pd
df = pd.DataFrame({"t": pd.date_range("2025-01-01", periods=3), "v": [1, 2, 3]})
print(df.resample("D").mean())`,
      error: "TypeError",
      fix: `import pandas as pd
df = pd.DataFrame({"t": pd.date_range("2025-01-01", periods=3), "v": [1, 2, 3]})
print(df.set_index("t").resample("D").mean())`,
      explain: "resample membutuhkan DatetimeIndex (atau parameter `on=\"t\"`).",
    },
    {
      title: "Kolom MultiIndex yang sulit diakses",
      wrong: `import pandas as pd
df = pd.DataFrame({"k": ["a", "b"], "v": [1, 2]})
hasil = df.groupby("k").agg({"v": ["mean", "max"]})
print(hasil["v_mean"])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"k": ["a", "b"], "v": [1, 2]})
hasil = df.groupby("k").agg(v_mean=("v", "mean"), v_max=("v", "max"))
print(hasil["v_mean"])`,
      explain: "Dictionary dengan list fungsi menghasilkan kolom bertingkat (\"v\", \"mean\"). Named aggregation menghasilkan nama datar yang mudah dipakai.",
    },
  ],
  bestPractices: [
    "Gunakan named aggregation untuk hasil yang mudah dibaca dan di-merge.",
    "Sertakan jumlah data (`size`) di setiap tabel ringkasan.",
    "Untuk time series, gunakan resample dengan aturan yang jelas (\"D\", \"MS\") dan periksa hari yang hilang.",
    "Fitur agregat untuk model dihitung dari data latih saja (atau hanya dari masa lalu untuk time series).",
  ],
  exercises: [
    {
      id: "pd-agg-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Beberapa statistik",
      prompt: "Lengkapi agar `hasil` berisi min dan max `petal_width` per spesies.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
hasil = df.groupby("species")["petal_width"].____(["min", "max"])
print(hasil)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
hasil = df.groupby("species")["petal_width"].agg(["min", "max"])
print(hasil)`,
      tests: [{ desc: "Kolom min & max", expr: "hasil.columns.tolist() == ['min', 'max'] and hasil.loc['setosa', 'max'] == 0.6" }],
      hints: ["Konsep: beberapa fungsi agregasi.", "Method singkatan aggregate.", "`.agg([...])`"],
      explanation: "agg menerima list nama fungsi.",
    },
    {
      id: "pd-agg-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": ["x", "x", "y", "y"], "b": ["p", "q", "p", "p"]})
print(pd.crosstab(df["a"], df["b"]).values.tolist())
print(pd.crosstab(df["a"], df["b"], normalize="index").values.tolist())`,
      answer: "[[1, 1], [2, 0]]\n[[0.5, 0.5], [1.0, 0.0]]",
      hints: ["Konsep: crosstab menghitung kombinasi.", "x: p 1, q 1; y: p 2, q 0.", "normalize=\"index\" → setiap baris berjumlah 1."],
      explanation: "[[1, 1], [2, 0]] dan [[0.5, 0.5], [1.0, 0.0]].",
    },
    {
      id: "pd-agg-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Resample",
      prompt: "Kode error karena resample dipanggil tanpa index datetime. Perbaiki agar `mingguan` berisi total penjualan per minggu.",
      starter: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.date_range("2026-01-05", periods=14, freq="D"), "jual": range(1, 15)})
mingguan = df.resample("W")["jual"].sum()
print(mingguan)`,
      solution: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.date_range("2026-01-05", periods=14, freq="D"), "jual": range(1, 15)})
mingguan = df.set_index("tanggal").resample("W")["jual"].sum()
print(mingguan)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Dua minggu: 28 dan 77", expr: "mingguan.tolist() == [28, 77]" },
      ],
      alternatives: [
        `import pandas as pd
df = pd.DataFrame({"tanggal": pd.date_range("2026-01-05", periods=14, freq="D"), "jual": range(1, 15)})
mingguan = df.resample("W", on="tanggal")["jual"].sum()
print(mingguan)`,
      ],
      hints: ["Konsep: resample butuh waktu sebagai index.", "`set_index(\"tanggal\")` atau `on=\"tanggal\"`.", "5 Januari 2026 hari Senin; minggu berakhir hari Minggu."],
      explanation: "Minggu pertama 1+…+7 = 28; minggu kedua 8+…+14 = 77.",
    },
    {
      id: "pd-agg-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fitur RFM pelanggan",
      prompt: "Dari tabel transaksi `trx`, buat `rfm` per pelanggan dengan named aggregation: `frekuensi` (jumlah transaksi), `total` (sum nilai), `rata` (mean nilai), `terakhir` (max tanggal). Lalu `recency_hari` = (tanggal_acuan − terakhir) dalam hari (`.dt.days`). Cetak `rfm`.",
      starter: `import pandas as pd
trx = pd.DataFrame({
    "pelanggan": ["A", "B", "A", "C", "B", "A"],
    "tanggal": pd.to_datetime(["2026-01-02", "2026-01-05", "2026-01-10", "2026-01-11", "2026-01-20", "2026-01-25"]),
    "nilai": [120, 80, 60, 200, 40, 100],
})
tanggal_acuan = pd.Timestamp("2026-01-31")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
trx = pd.DataFrame({
    "pelanggan": ["A", "B", "A", "C", "B", "A"],
    "tanggal": pd.to_datetime(["2026-01-02", "2026-01-05", "2026-01-10", "2026-01-11", "2026-01-20", "2026-01-25"]),
    "nilai": [120, 80, 60, 200, 40, 100],
})
tanggal_acuan = pd.Timestamp("2026-01-31")
rfm = trx.groupby("pelanggan").agg(
    frekuensi=("nilai", "size"),
    total=("nilai", "sum"),
    rata=("nilai", "mean"),
    terakhir=("tanggal", "max"),
)
rfm["recency_hari"] = (tanggal_acuan - rfm["terakhir"]).dt.days
print(rfm)`,
      tests: [
        { desc: "frekuensi & total benar", expr: "rfm['frekuensi'].to_dict() == {'A': 3, 'B': 2, 'C': 1} and rfm['total'].to_dict() == {'A': 280, 'B': 120, 'C': 200}" },
        { desc: "recency benar", expr: "rfm['recency_hari'].to_dict() == {'A': 6, 'B': 11, 'C': 20}" },
      ],
      hints: ["Konsep: named aggregation dari data transaksi.", "`agg(frekuensi=(\"nilai\", \"size\"), ...)`", "Selisih dua tanggal → Timedelta; `.dt.days` untuk angka hari."],
      explanation: "Recency, Frequency, Monetary adalah fitur klasik untuk segmentasi pelanggan (Module 13).",
    },
    {
      id: "pd-agg-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pivot status pernikahan & pendidikan",
      prompt: [
        "Baca `bank_marketing.csv`. Buat kolom `ya` = (y == \"yes\") sebagai int.",
        "Buat `pivot` = `pivot_table(index=\"education\", columns=\"marital\", values=\"ya\", aggfunc=\"mean\")` dan `n` = `pd.crosstab(df[\"education\"], df[\"marital\"])`. Cetak keduanya (pivot dibulatkan 3 desimal) dan simpan `sel_terbaik` = (education, marital) dengan rate tertinggi menggunakan `pivot.stack().idxmax()`.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
df["ya"] = (df["y"] == "yes").astype(int)
pivot = df.pivot_table(index="education", columns="marital", values="ya", aggfunc="mean")
n = pd.crosstab(df["education"], df["marital"])
sel_terbaik = pivot.stack().idxmax()
print(pivot.round(3))
print(n)
print(sel_terbaik)`,
      tests: [
        { desc: "pivot benar", expr: "abs(pivot.loc['tertiary', 'single'] - df[(df['education'] == 'tertiary') & (df['marital'] == 'single')]['ya'].mean()) < 1e-12" },
        { desc: "n menghitung semua baris", expr: "n.values.sum() == len(df)" },
        { desc: "sel_terbaik = argmax pivot", expr: "pivot.loc[sel_terbaik] == pivot.max().max()" },
      ],
      hints: ["Konsep: tabel silang rate dan jumlah.", "pivot_table untuk rate, crosstab untuk jumlah.", "`pivot.stack().idxmax()` memberi pasangan (baris, kolom)."],
      explanation: "Selalu baca rate bersama jumlah datanya: rate tinggi pada sel berisi sedikit data bisa kebetulan.",
    },
  ],
  quiz: [
    { id: "pd-agg-q1", type: "mcq", prompt: "Format named aggregation yang benar?", options: ["agg(\"rata\"=\"harga\")", "agg(rata=(\"harga\", \"mean\"))", "agg(harga=mean)", "agg([\"rata\", \"harga\"])"], answer: 1, explanation: "nama=(kolom, fungsi)." },
    { id: "pd-agg-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"k": ["a", "a", "b"], "v": [3, 7, 5]})\nprint(df.groupby("k")["v"].agg(lambda x: x.max() - x.min()).tolist())`, options: ["[7, 5]", "[4, 0]", "[10, 5]", "[3, 5]"], answer: 1, explanation: "a: 7 − 3 = 4; b: 0." },
    { id: "pd-agg-q3", type: "tf", prompt: "`resample` membutuhkan data dengan index (atau kolom `on`) bertipe datetime.", answer: true, explanation: "Kelompok berdasarkan waktu." },
    { id: "pd-agg-q4", type: "fill", prompt: "Tabel frekuensi dua kategori: `pd.____(df[\"a\"], df[\"b\"])`", answer: ["crosstab"], explanation: "`pd.crosstab`." },
    { id: "pd-agg-q5", type: "case", prompt: "Target kompetisi adalah PM2.5 harian, tetapi data pendukung CAMS tersedia per jam. Langkah yang tepat?", options: ["Buang data CAMS", "Agregasi CAMS per hari (resample(\"D\").mean(), max, dsb.) lalu gabungkan dengan tanggal", "Gunakan data per jam langsung sebagai baris target", "Ambil satu jam acak per hari"], answer: 1, explanation: "Samakan granularitas fitur dengan target." },
  ],
  challenge: {
    id: "pd-agg-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fitur harian dari data per jam",
    prompt: [
      "Diberikan data simulasi PM2.5 per jam `jam_df`. Buat `harian` (satu baris per tanggal, index tanggal) dengan named aggregation dari `resample(\"D\")`: `pm25_mean`, `pm25_max`, `pm25_min`, `n_jam` (count).",
      "Tambahkan `pm25_mean_lag1` = `pm25_mean` hari sebelumnya, dan `pm25_mean_roll3` = rata-rata 3 hari **sebelumnya** (`shift(1).rolling(3).mean()`). Cetak 5 baris pertama dibulatkan 2 desimal.",
    ],
    starter: `import numpy as np
import pandas as pd
rng = np.random.default_rng(42)
waktu = pd.date_range("2025-01-01", periods=24 * 10, freq="h")
jam_df = pd.DataFrame({"waktu": waktu, "pm25": rng.gamma(4, 10, len(waktu))})
# Tulis kodemu di sini
`,
    solution: `import numpy as np
import pandas as pd
rng = np.random.default_rng(42)
waktu = pd.date_range("2025-01-01", periods=24 * 10, freq="h")
jam_df = pd.DataFrame({"waktu": waktu, "pm25": rng.gamma(4, 10, len(waktu))})
harian = jam_df.set_index("waktu").resample("D").agg(
    pm25_mean=("pm25", "mean"),
    pm25_max=("pm25", "max"),
    pm25_min=("pm25", "min"),
    n_jam=("pm25", "count"),
)
harian["pm25_mean_lag1"] = harian["pm25_mean"].shift(1)
harian["pm25_mean_roll3"] = harian["pm25_mean"].shift(1).rolling(3).mean()
print(harian.head().round(2))`,
    tests: [
      { desc: "10 hari, 24 jam per hari", expr: "len(harian) == 10 and (harian['n_jam'] == 24).all()" },
      { desc: "pm25_mean benar", expr: "abs(harian['pm25_mean'].iloc[0] - jam_df['pm25'].iloc[:24].mean()) < 1e-9" },
      { desc: "lag1 benar", expr: "harian['pm25_mean_lag1'].iloc[1] == harian['pm25_mean'].iloc[0] and __import__('math').isnan(harian['pm25_mean_lag1'].iloc[0])" },
      { desc: "roll3 hanya memakai masa lalu", expr: "abs(harian['pm25_mean_roll3'].iloc[3] - harian['pm25_mean'].iloc[0:3].mean()) < 1e-9" },
    ],
    hints: ["Konsep: resample + named aggregation + fitur lag.", "`jam_df.set_index(\"waktu\").resample(\"D\").agg(pm25_mean=(\"pm25\", \"mean\"), ...)`", "`shift(1)` sebelum `rolling(3)` agar hari ini tidak ikut."],
    explanation: "Ini adalah kerangka feature engineering untuk forecasting PM2.5: agregasi ke granularitas target, lalu fitur lag dan rolling yang hanya memakai informasi masa lalu.",
  },
  summary: [
    "`agg` menerima list fungsi, dictionary per kolom, atau named aggregation `nama=(kolom, fungsi)`.",
    "Fungsi kustom/lambda bisa dipakai sebagai agregasi.",
    "`pivot_table` dan `crosstab` untuk tabel dua dimensi.",
    "`resample(\"D\"/\"W\"/\"MS\")` untuk agregasi berbasis waktu.",
  ],
  cheatsheet: [
    { syntax: "g[\"v\"].agg([\"mean\", \"max\"])", desc: "Beberapa statistik" },
    { syntax: "g.agg(n=(\"v\", \"size\"))", desc: "Named aggregation" },
    { syntax: "df.pivot_table(index=a, columns=b, values=v)", desc: "Pivot" },
    { syntax: "pd.crosstab(a, b, normalize=\"index\")", desc: "Proporsi silang" },
    { syntax: "df.set_index(t).resample(\"D\").mean()", desc: "Agregasi harian" },
  ],
  flashcards: [
    { q: "Ringkasan per kota dengan nama kolom rata dan n", a: "df.groupby(\"kota\").agg(rata=(\"harga\", \"mean\"), n=(\"harga\", \"size\"))" },
    { q: "Ubah data per jam menjadi rata-rata harian", a: "df.set_index(\"waktu\").resample(\"D\").mean()" },
    { q: "Proporsi income per jenis kelamin", a: "pd.crosstab(df[\"sex\"], df[\"income\"], normalize=\"index\")" },
  ],
  references: [
    pandasDoc("Group by — Aggregation (named aggregation)", "user_guide/groupby.html#named-aggregation"),
    pandasDoc("Reshaping and pivot tables — pivot_table", "user_guide/reshaping.html#pivot-table"),
    pandasDoc("pandas.crosstab", "reference/api/pandas.crosstab.html"),
    pandasDoc("Time series — Resampling", "user_guide/timeseries.html#resampling"),
  ],
};
