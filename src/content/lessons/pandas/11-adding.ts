import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-adding-columns",
  title: "Adding Columns",
  minutes: 40,
  prerequisites: ["pd-loc"],
  objectives: [
    "Menambah kolom dari nilai tetap, list/array, dan perhitungan kolom lain.",
    "Membuat kolom bersyarat dengan `np.where`, `np.select`, dan `pd.cut`.",
    "Mengekstrak fitur tanggal dengan accessor `.dt`.",
    "Menambah beberapa kolom sekaligus dengan `assign` (method chaining).",
  ],
  definition: [
    "Kolom baru dibuat dengan assignment: `df[\"kolom_baru\"] = nilai`. Nilai bisa berupa skalar (sama untuk semua baris), list/array sepanjang jumlah baris, atau Series hasil perhitungan (diselaraskan berdasarkan index).",
    "Kolom turunan dari kolom lain adalah bentuk dasar **feature engineering**: rasio (`harga / luas`), selisih, log, interaksi, dan kategori dari angka.",
    "Untuk kolom bersyarat:\n- `np.where(kondisi, a, b)` — dua pilihan\n- `np.select([k1, k2], [a, b], default=c)` — banyak pilihan\n- `pd.cut(x, bins, labels)` — membagi angka ke dalam rentang (binning)",
    "`df.assign(a=..., b=lambda d: ...)` mengembalikan DataFrame **baru** dengan kolom tambahan — cocok untuk method chaining dan tidak mengubah df asli.",
    "`df.insert(posisi, nama, nilai)` menambah kolom pada posisi tertentu (mengubah df langsung).",
  ],
  why: [
    "Model sering lebih akurat dengan fitur yang bermakna: harga per m², umur bangunan dalam kelompok, hari dalam seminggu, akhir pekan atau bukan, hari libur. Untuk forecasting PM2.5, fitur tanggal (bulan, hari, musim) sering sangat berpengaruh.",
    "Feature engineering yang baik biasanya memberi peningkatan lebih besar daripada mengganti algoritma.",
  ],
  when: [
    "- Membuat fitur turunan (rasio, selisih, log).",
    "- Membuat kategori dari angka.",
    "- Mengekstrak informasi dari tanggal.",
    "- Menambah kolom prediksi/error untuk analisis.",
  ],
  analogy: "Menambah kolom seperti **menambah kolom rumus di Excel**: kamu menulis rumus sekali (`=B2*C2`), dan semua baris langsung terhitung.",
  syntax: {
    code: `df["total"] = df["qty"] * df["harga"]
df["sumber"] = "online"                         # skalar
df["mahal"] = np.where(df["harga"] > 100, 1, 0)
df["kelompok"] = pd.cut(df["umur"], bins=[0, 17, 35, 60, 120], labels=["anak", "muda", "dewasa", "lansia"])
df["bulan"] = df["tanggal"].dt.month
df2 = df.assign(log_harga=np.log1p(df["harga"]))`,
  },
  anatomy: [
    ["df[\"baru\"] = ...", "Membuat (atau menimpa) kolom."],
    ["np.where(c, a, b)", "Nilai bersyarat."],
    ["pd.cut(x, bins, labels)", "Rentang (a, b] → label kategori."],
    ["s.dt.month / .dayofweek", "Bagian dari tanggal."],
    ["df.assign(...)", "DataFrame baru + kolom tambahan."],
  ],
  examples: [
    {
      title: "Contoh 1 — Dari perhitungan kolom lain",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
df["harga_per_m2"] = df["price_million"] / df["area_m2"]
df["kamar_total"] = df["bedrooms"] + df["bathrooms"]
df["sumber"] = "survei2025"
print(df[["area_m2", "price_million", "harga_per_m2", "kamar_total", "sumber"]].head(3).round(2))
print(df.groupby("city")["harga_per_m2"].mean().round(2).sort_values())`,
      output: "   area_m2  price_million  harga_per_m2  kamar_total      sumber\n0      300           4828         16.09           11  survei2025\n1      145           1429          9.86            5  survei2025\n2       37            250          6.76            3  survei2025\ncity\nYogyakarta     9.80\nBandung       10.26\nSurabaya      11.15\nJakarta       14.97\nName: harga_per_m2, dtype: float64",
      explain: [
        ["df[\"harga_per_m2\"] = df[\"price_million\"] / df[\"area_m2\"]", "Rasio: harga per meter persegi (juta/m²)."],
        ["df[\"kamar_total\"] = df[\"bedrooms\"] + df[\"bathrooms\"]", "Jumlah dua kolom."],
        ["df[\"sumber\"] = \"survei2025\"", "Skalar → sama untuk semua baris."],
        ["df.groupby(\"city\")[\"harga_per_m2\"].mean()", "Fitur baru langsung memberi insight: kota termahal per m²."],
      ],
    },
    {
      title: "Contoh 2 — Kolom bersyarat",
      code: `import numpy as np
import pandas as pd

df = pd.DataFrame({"aqi": [35, 75, 120, 180, 260, 320]})
df["tidak_sehat"] = np.where(df["aqi"] > 100, 1, 0)
df["kategori"] = np.select(
    [df["aqi"] <= 50, df["aqi"] <= 100, df["aqi"] <= 199, df["aqi"] <= 299],
    ["Baik", "Sedang", "Tidak Sehat", "Sangat Tidak Sehat"],
    default="Berbahaya",
)
print(df)`,
      output: "   aqi  tidak_sehat            kategori\n0   35            0                Baik\n1   75            0              Sedang\n2  120            1         Tidak Sehat\n3  180            1         Tidak Sehat\n4  260            1  Sangat Tidak Sehat\n5  320            1           Berbahaya",
      explain: [
        ["np.where(df[\"aqi\"] > 100, 1, 0)", "Dua pilihan: biner 1/0."],
        ["default=\"Berbahaya\",", "Kondisi diperiksa berurutan; yang pertama True dipakai. Kategori mengikuti rentang ISPU (Indeks Standar Pencemar Udara)."],
      ],
      change: "Nilai kolom bergantung pada kondisi, bukan rumus aritmetika.",
    },
    {
      title: "Contoh 3 — Binning dengan pd.cut dan pd.qcut",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
df["kelompok_umur"] = pd.cut(df["age"], bins=[16, 25, 35, 50, 65, 100],
                             labels=["17-25", "26-35", "36-50", "51-65", "66+"])
print(df["kelompok_umur"].value_counts().sort_index())
print((df["income"] == ">50K").groupby(df["kelompok_umur"], observed=True).mean().round(3))

df["kuartil_jam"] = pd.qcut(df["hours_per_week"], q=4, duplicates="drop")
print(df["kuartil_jam"].value_counts().sort_index())`,
      output: "kelompok_umur\n17-25     6411\n26-35     8514\n36-50    11176\n51-65     5302\n66+       1158\nName: count, dtype: int64\nkelompok_umur\n17-25    0.018\n26-35    0.187\n36-50    0.361\n51-65    0.352\n66+      0.201\nName: income, dtype: float64\nkuartil_jam\n(0.999, 40.0]    22980\n(40.0, 45.0]      2442\n(45.0, 99.0]      7139\nName: count, dtype: int64",
      explain: [
        ["pd.cut(df[\"age\"], bins=[16, 25, 35, 50, 65, 100],", "Rentang (16, 25], (25, 35], … diberi label."],
        ["groupby(df[\"kelompok_umur\"], observed=True).mean()", "Proporsi berpenghasilan >50K per kelompok umur."],
        ["pd.qcut(df[\"hours_per_week\"], q=4, duplicates=\"drop\")", "Rentang berdasarkan kuantil (jumlah data per kelompok kira-kira sama); duplicates=\"drop\" karena banyak nilai 40 jam."],
      ],
      change: "Angka kontinu diubah menjadi kategori rentang.",
    },
    {
      title: "Contoh 4 — Fitur tanggal dan assign",
      code: `import pandas as pd

df = pd.DataFrame({"tanggal": pd.date_range("2025-12-27", periods=8, freq="D"),
                   "pm25": [48, 52, 39, 41, 30, 33, 55, 58]})
libur = pd.to_datetime(["2025-12-25", "2026-01-01"])

fitur = df.assign(
    bulan=df["tanggal"].dt.month,
    hari=df["tanggal"].dt.dayofweek,              # Senin = 0
    akhir_pekan=lambda d: (d["hari"] >= 5).astype(int),
    libur=df["tanggal"].isin(libur).astype(int),
    pm25_kemarin=df["pm25"].shift(1),
)
print(fitur)
print("Kolom df asli:", df.columns.tolist())`,
      output: "     tanggal  pm25  bulan  hari  akhir_pekan  libur  pm25_kemarin\n0 2025-12-27    48     12     5            1      0           NaN\n1 2025-12-28    52     12     6            1      0          48.0\n2 2025-12-29    39     12     0            0      0          52.0\n3 2025-12-30    41     12     1            0      0          39.0\n4 2025-12-31    30     12     2            0      0          41.0\n5 2026-01-01    33      1     3            0      1          30.0\n6 2026-01-02    55      1     4            0      0          33.0\n7 2026-01-03    58      1     5            1      0          55.0\nKolom df asli: ['tanggal', 'pm25']",
      explain: [
        ["df[\"tanggal\"].dt.month", "Accessor `.dt` untuk bagian tanggal."],
        ["df[\"tanggal\"].dt.dayofweek", "0 = Senin … 6 = Minggu."],
        ["akhir_pekan=lambda d: (d[\"hari\"] >= 5).astype(int)", "lambda menerima DataFrame yang sedang dibangun, sehingga bisa memakai kolom `hari` yang baru dibuat."],
        ["libur=df[\"tanggal\"].isin(libur).astype(int)", "Penanda hari libur — sangat relevan untuk forecasting polusi (lalu lintas berkurang)."],
        ["print(\"Kolom df asli:\", df.columns.tolist())", "assign tidak mengubah df asli."],
      ],
      change: "Feature engineering lengkap untuk data harian dengan method chaining.",
    },
  ],
  params: [
    {
      title: "Alat menambah kolom",
      items: [
        { name: "df[col] = value", desc: "Skalar, list/array (panjang = n baris), atau Series." },
        { name: "np.where(cond, a, b), np.select(conds, choices, default)", desc: "Bersyarat." },
        { name: "pd.cut(x, bins, labels=None, right=True)", desc: "Binning rentang tetap." },
        { name: "pd.qcut(x, q, labels=None, duplicates=\"raise\")", desc: "Binning berdasarkan kuantil." },
        { name: "s.dt.year/month/day/dayofweek/dayofyear", desc: "Fitur tanggal." },
        { name: "df.assign(**kolom), df.insert(loc, col, value)", desc: "Banyak kolom / posisi tertentu." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3]})\ndf["b"] = df["a"] ** 2\ndf["c"] = pd.cut(df["a"], bins=[0, 1, 3], labels=["kecil", "besar"])\nprint(df.to_dict("list"))`, output: "{'a': [1, 2, 3], 'b': [1, 4, 9], 'c': ['kecil', 'besar', 'besar']}" },
  tryIt: `import numpy as np
import pandas as pd

df = pd.read_csv("customer_churn.csv")
df["avg_per_bulan"] = df["total_charges"] / df["tenure_months"].replace(0, np.nan)
df["pelanggan_baru"] = np.where(df["tenure_months"] < 6, 1, 0)
print(df.groupby("pelanggan_baru")["churn"].mean().round(3))`,
  mistakes: [
    {
      title: "Panjang list tidak sesuai jumlah baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
df["b"] = [10, 20]`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
df["b"] = [10, 20, 30]
print(df)`,
      explain: "*Length of values does not match length of index* — list harus sepanjang jumlah baris.",
    },
    {
      title: "Accessor .dt pada kolom teks",
      wrong: `import pandas as pd
df = pd.DataFrame({"tgl": ["2026-01-01", "2026-01-02"]})
df["bulan"] = df["tgl"].dt.month`,
      error: "AttributeError",
      fix: `import pandas as pd
df = pd.DataFrame({"tgl": ["2026-01-01", "2026-01-02"]})
df["tgl"] = pd.to_datetime(df["tgl"])
df["bulan"] = df["tgl"].dt.month
print(df)`,
      explain: "`.dt` hanya untuk kolom datetime. Ubah dulu dengan `pd.to_datetime`.",
    },
    {
      title: "Pembagian dengan nol menghasilkan inf",
      wrong: `import pandas as pd
df = pd.DataFrame({"total": [100, 50], "bulan": [10, 0]})
df["rata"] = df["total"] / df["bulan"]
print(df["rata"].tolist())   # [10.0, inf]`,
      fix: `import numpy as np
import pandas as pd
df = pd.DataFrame({"total": [100, 50], "bulan": [10, 0]})
df["rata"] = df["total"] / df["bulan"].replace(0, np.nan)
print(df["rata"].tolist())`,
      explain: "inf merusak statistik dan model. Ganti penyebut 0 dengan NaN, lalu tangani NaN di tahap imputasi.",
    },
  ],
  bestPractices: [
    "Beri nama kolom baru yang menjelaskan isinya (`harga_per_m2`, bukan `x1`).",
    "Hindari fitur yang memakai informasi target atau masa depan (data leakage) — misalnya `shift(-1)` pada forecasting.",
    "Waspadai pembagian dengan nol dan nilai inf.",
    "Kumpulkan pembuatan fitur dalam satu fungsi agar bisa diterapkan sama persis ke train dan test.",
  ],
  exercises: [
    {
      id: "pd-add-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Kolom hasil kali",
      prompt: "Lengkapi agar kolom `total` = `qty` × `harga`.",
      starter: `import pandas as pd
df = pd.DataFrame({"qty": [2, 1, 4], "harga": [5000, 12000, 3000]})
df____ = df["qty"] * df["harga"]
print(df)`,
      solution: `import pandas as pd
df = pd.DataFrame({"qty": [2, 1, 4], "harga": [5000, 12000, 3000]})
df["total"] = df["qty"] * df["harga"]
print(df)`,
      tests: [{ desc: "Kolom total benar", expr: "df['total'].tolist() == [10000, 12000, 12000]" }],
      hints: ["Konsep: assignment kolom baru.", "Gunakan kurung siku dengan nama kolom.", "`df[\"total\"]`"],
      explanation: "Operasi antar-kolom vectorized untuk semua baris.",
    },
    {
      id: "pd-add-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"x": [5, 15, 25, 35]})
df["grup"] = pd.cut(df["x"], bins=[0, 10, 30, 40], labels=["A", "B", "C"])
print(df["grup"].tolist())
df2 = df.assign(y=df["x"] * 2)
print(df.shape[1], df2.shape[1])`,
      answer: "['A', 'B', 'B', 'C']\n2 3",
      hints: ["Konsep: rentang (a, b] dan assign.", "15 dan 25 masuk (10, 30].", "assign tidak mengubah df."],
      explanation: "['A', 'B', 'B', 'C']; df tetap 2 kolom, df2 punya 3 kolom.",
    },
    {
      id: "pd-add-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Fitur hari",
      prompt: "Kode error. Perbaiki agar kolom `hari` berisi nomor hari dalam seminggu (Senin = 0).",
      starter: `import pandas as pd
df = pd.DataFrame({"tanggal": ["2026-01-05", "2026-01-10", "2026-01-11"]})
df["hari"] = df["tanggal"].dt.dayofweek
print(df)`,
      solution: `import pandas as pd
df = pd.DataFrame({"tanggal": ["2026-01-05", "2026-01-10", "2026-01-11"]})
df["tanggal"] = pd.to_datetime(df["tanggal"])
df["hari"] = df["tanggal"].dt.dayofweek
print(df)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "hari benar (Senin, Sabtu, Minggu)", expr: "df['hari'].tolist() == [0, 5, 6]" },
      ],
      hints: ["Konsep: .dt butuh datetime.", "Ubah kolom teks menjadi datetime.", "`pd.to_datetime(df[\"tanggal\"])`"],
      explanation: "5 Januari 2026 adalah hari Senin.",
    },
    {
      id: "pd-add-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Kategori BMI",
      prompt: "Tambahkan kolom `bmi` = berat / (tinggi/100)² (1 desimal) dan `status` dengan `np.select`: < 18.5 \"kurus\", < 25 \"normal\", < 30 \"gemuk\", lainnya \"obesitas\". Cetak `df`.",
      starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({"tinggi": [160, 175, 168, 155], "berat": [45, 70, 82, 80]})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({"tinggi": [160, 175, 168, 155], "berat": [45, 70, 82, 80]})
df["bmi"] = (df["berat"] / (df["tinggi"] / 100) ** 2).round(1)
df["status"] = np.select(
    [df["bmi"] < 18.5, df["bmi"] < 25, df["bmi"] < 30],
    ["kurus", "normal", "gemuk"],
    default="obesitas",
)
print(df)`,
      tests: [
        { desc: "bmi benar", expr: "df['bmi'].tolist() == [17.6, 22.9, 29.1, 33.3]" },
        { desc: "status benar", expr: "df['status'].tolist() == ['kurus', 'normal', 'gemuk', 'obesitas']" },
      ],
      alternatives: [
        `import numpy as np
import pandas as pd
df = pd.DataFrame({"tinggi": [160, 175, 168, 155], "berat": [45, 70, 82, 80]})
df["bmi"] = (df["berat"] / (df["tinggi"] / 100) ** 2).round(1)
df["status"] = pd.cut(df["bmi"], bins=[0, 18.5, 25, 30, 100], labels=["kurus", "normal", "gemuk", "obesitas"], right=False).astype(str)
print(df)`,
      ],
      hints: ["Konsep: kolom turunan + kolom bersyarat.", "`(df[\"tinggi\"] / 100) ** 2`", "np.select memeriksa kondisi dari atas ke bawah."],
      explanation: "Rumus + kategori adalah pola feature engineering paling umum.",
    },
    {
      id: "pd-add-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Fitur riwayat kredit",
      prompt: [
        "Baca `credit_card_default.csv`. Tambahkan fitur:",
        "- `telat_maks` = nilai maksimum kolom PAY_0, PAY_2, …, PAY_6 per baris (`df[kolom].max(axis=1)`)\n- `bulan_telat` = jumlah bulan dengan status > 0 (`(df[kolom] > 0).sum(axis=1)`)\n- `utilisasi` = BILL_AMT1 / LIMIT_BAL",
        "Lalu cetak tingkat default (`default payment next month` mean) per `bulan_telat` dibulatkan 3 desimal.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
kolom = ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"]
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
kolom = ["PAY_0", "PAY_2", "PAY_3", "PAY_4", "PAY_5", "PAY_6"]
df["telat_maks"] = df[kolom].max(axis=1)
df["bulan_telat"] = (df[kolom] > 0).sum(axis=1)
df["utilisasi"] = df["BILL_AMT1"] / df["LIMIT_BAL"]
print(df.groupby("bulan_telat")["default payment next month"].mean().round(3))`,
      tests: [
        { desc: "telat_maks benar", expr: "(df['telat_maks'] == df[kolom].max(axis=1)).all()" },
        { desc: "bulan_telat 0..6", expr: "df['bulan_telat'].between(0, 6).all() and (df['bulan_telat'] == (df[kolom] > 0).sum(axis=1)).all()" },
        { desc: "utilisasi benar", expr: "abs(df['utilisasi'] - df['BILL_AMT1'] / df['LIMIT_BAL']).max() < 1e-12" },
      ],
      hints: ["Konsep: agregasi per baris sebagai fitur.", "`axis=1` untuk menghitung per baris.", "Groupby fitur baru lalu mean target."],
      explanation: "Tingkat default naik tajam seiring jumlah bulan terlambat — fitur ringkasan seperti ini sering lebih informatif daripada kolom mentah satu per satu.",
    },
  ],
  quiz: [
    { id: "pd-add-q1", type: "mcq", prompt: "Fungsi untuk membagi angka ke kategori rentang tetap?", options: ["pd.qcut", "pd.cut", "np.where", "df.assign"], answer: 1, explanation: "`pd.cut` dengan bins tetap; qcut berdasarkan kuantil." },
    { id: "pd-add-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nimport pandas as pd\ndf = pd.DataFrame({"a": [3, 8, 1]})\ndf["b"] = np.where(df["a"] > 2, "ya", "tidak")\nprint(df["b"].tolist())`, options: ["['tidak', 'ya', 'tidak']", "['ya', 'ya', 'tidak']", "[True, True, False]", "['ya', 'ya', 'ya']"], answer: 1, explanation: "3 dan 8 > 2." },
    { id: "pd-add-q3", type: "tf", prompt: "`df.assign(x=1)` mengubah df asli.", answer: false, explanation: "assign mengembalikan DataFrame baru." },
    { id: "pd-add-q4", type: "fill", prompt: "Accessor untuk bagian tanggal (bulan, hari): `df[\"tgl\"].____.month`", answer: ["dt"], explanation: "`.dt`." },
    { id: "pd-add-q5", type: "case", prompt: "Untuk forecasting PM2.5 besok, fitur mana yang menyebabkan data leakage?", options: ["pm25 kemarin (shift(1))", "Bulan dari tanggal", "pm25 besok (shift(-1)) sebagai fitur", "Penanda hari libur"], answer: 2, explanation: "shift(-1) memakai nilai masa depan yang tidak tersedia saat prediksi." },
  ],
  challenge: {
    id: "pd-add-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fungsi fitur kalender",
    prompt: [
      "Tulis fungsi `fitur_kalender(df, libur)` yang menerima DataFrame dengan kolom `tanggal` (datetime) dan list tanggal libur, lalu mengembalikan DataFrame **baru** (gunakan `assign`) dengan kolom: `tahun`, `bulan`, `hari_minggu` (dayofweek), `hari_tahun` (dayofyear), `akhir_pekan` (0/1), `libur` (0/1), `musim_hujan` (1 jika bulan di 11, 12, 1, 2, 3; selain itu 0).",
      "Uji pada `df` di starter dan cetak hasilnya. df asli tidak boleh berubah.",
    ],
    starter: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.to_datetime(["2025-12-31", "2026-01-01", "2026-01-03", "2026-06-15"])})
libur = ["2026-01-01"]
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.to_datetime(["2025-12-31", "2026-01-01", "2026-01-03", "2026-06-15"])})
libur = ["2026-01-01"]

def fitur_kalender(df, libur):
    t = df["tanggal"]
    return df.assign(
        tahun=t.dt.year,
        bulan=t.dt.month,
        hari_minggu=t.dt.dayofweek,
        hari_tahun=t.dt.dayofyear,
        akhir_pekan=(t.dt.dayofweek >= 5).astype(int),
        libur=t.isin(pd.to_datetime(libur)).astype(int),
        musim_hujan=t.dt.month.isin([11, 12, 1, 2, 3]).astype(int),
    )

hasil = fitur_kalender(df, libur)
print(hasil)`,
    tests: [
      { desc: "df asli tidak berubah", expr: "df.columns.tolist() == ['tanggal']" },
      { desc: "Kolom lengkap", expr: "fitur_kalender(df, libur).columns.tolist() == ['tanggal', 'tahun', 'bulan', 'hari_minggu', 'hari_tahun', 'akhir_pekan', 'libur', 'musim_hujan']" },
      { desc: "akhir_pekan & libur benar", expr: "fitur_kalender(df, libur)['akhir_pekan'].tolist() == [0, 0, 1, 0] and fitur_kalender(df, libur)['libur'].tolist() == [0, 1, 0, 0]" },
      { desc: "musim_hujan benar", expr: "fitur_kalender(df, libur)['musim_hujan'].tolist() == [1, 1, 1, 0]" },
    ],
    hints: ["Konsep: assign + accessor .dt.", "`t.dt.dayofweek >= 5` untuk Sabtu/Minggu.", "`t.isin(pd.to_datetime(libur))` dan `t.dt.month.isin([...])`."],
    explanation: "Fungsi seperti ini bisa dipakai langsung untuk train dan test di kompetisi forecasting yang hanya memberikan kalender libur di data test.",
  },
  summary: [
    "`df[\"baru\"] = ...` dari skalar, list/array, atau perhitungan kolom.",
    "Kolom bersyarat: `np.where`, `np.select`; binning: `pd.cut`, `pd.qcut`.",
    "Fitur tanggal dengan `.dt` (year, month, dayofweek, dayofyear).",
    "`assign` membuat DataFrame baru dengan banyak kolom sekaligus.",
    "Hindari fitur yang memakai informasi masa depan/target.",
  ],
  cheatsheet: [
    { syntax: "df[\"r\"] = df.a / df.b", desc: "Rasio" },
    { syntax: "np.where(c, 1, 0)", desc: "Biner" },
    { syntax: "pd.cut(x, bins, labels)", desc: "Binning" },
    { syntax: "df.t.dt.dayofweek", desc: "Hari (Senin=0)" },
    { syntax: "df.assign(a=..., b=lambda d: ...)", desc: "Chaining" },
  ],
  flashcards: [
    { q: "Buat kolom 1/0 jika aqi > 100", a: "df[\"tidak_sehat\"] = np.where(df[\"aqi\"] > 100, 1, 0)" },
    { q: "Ambil bulan dari kolom datetime tgl", a: "df[\"tgl\"].dt.month" },
    { q: "Bagi umur ke 4 kelompok dengan jumlah data seimbang", a: "pd.qcut(df[\"umur\"], q=4)" },
  ],
  references: [
    pandasDoc("Getting started — How to create new columns derived from existing columns", "getting_started/intro_tutorials/05_add_columns.html"),
    pandasDoc("pandas.DataFrame.assign", "reference/api/pandas.DataFrame.assign.html"),
    pandasDoc("pandas.cut", "reference/api/pandas.cut.html"),
    pandasDoc("Time series / date functionality — .dt accessor", "user_guide/timeseries.html"),
    { source: "Kaggle Learn", title: "Feature Engineering — Creating Features", url: "https://www.kaggle.com/learn/feature-engineering" },
  ],
};
