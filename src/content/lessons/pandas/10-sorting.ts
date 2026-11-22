import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-sorting-data",
  title: "Sorting Data",
  minutes: 30,
  prerequisites: ["pd-filtering-data"],
  objectives: [
    "Mengurutkan DataFrame berdasarkan satu atau beberapa kolom dengan `sort_values`.",
    "Mengatur arah urutan per kolom dan posisi nilai kosong (`na_position`).",
    "Mengurutkan berdasarkan index dengan `sort_index`.",
    "Mengambil n nilai teratas/terbawah dengan `nlargest`/`nsmallest` dan membuat peringkat dengan `rank`.",
  ],
  definition: [
    "`df.sort_values(by, ascending=True)` mengembalikan DataFrame **baru** yang barisnya diurutkan berdasarkan kolom `by`. Label index ikut berpindah bersama barisnya.",
    "Beberapa kolom: `by=[\"kota\", \"harga\"]` mengurutkan berdasarkan kota dulu, lalu harga di dalam setiap kota. Arah bisa berbeda per kolom: `ascending=[True, False]`.",
    "Nilai kosong (NaN) diletakkan di akhir secara default (`na_position=\"last\"`).",
    "`df.sort_index()` mengurutkan berdasarkan label index — penting untuk data time series dengan index tanggal.",
    "`df.nlargest(n, \"kolom\")` / `nsmallest` mengambil n baris dengan nilai terbesar/terkecil (lebih cepat daripada sort lalu head). `s.rank()` memberi peringkat setiap nilai.",
  ],
  why: [
    "Data time series **wajib** diurutkan berdasarkan waktu sebelum membuat fitur lag/rolling atau melakukan split berurutan — urutan yang salah menghasilkan fitur yang salah tanpa error.",
    "Sorting membantu EDA (melihat nilai ekstrem), membuat leaderboard model, dan mencari observasi dengan error prediksi terbesar.",
  ],
  when: [
    "- Mengurutkan data berdasarkan tanggal.",
    "- Melihat nilai tertinggi/terendah.",
    "- Membuat peringkat (ranking).",
    "- Menyusun tabel perbandingan hasil model.",
  ],
  analogy: "Sorting dengan beberapa kolom seperti **menyusun buku di perpustakaan**: pertama berdasarkan rak kategori (kolom pertama), lalu di dalam setiap rak berdasarkan nama penulis (kolom kedua).",
  syntax: {
    code: `df.sort_values("harga")                          # naik
df.sort_values("harga", ascending=False)         # turun
df.sort_values(["kota", "harga"], ascending=[True, False])
df.sort_index()
df.nlargest(5, "harga")
df["nilai"].rank(ascending=False)`,
  },
  anatomy: [
    ["by", "Kolom (atau list kolom) acuan."],
    ["ascending", "True = kecil → besar; bisa list per kolom."],
    ["na_position", "\"last\" (default) atau \"first\"."],
    ["ignore_index=True", "Label hasil menjadi 0..n−1."],
  ],
  examples: [
    {
      title: "Contoh 1 — Satu kolom, naik dan turun",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df.sort_values("final_score").head(3)[["student_id", "final_score"]])
print(df.sort_values("final_score", ascending=False).head(3)[["student_id", "final_score"]])`,
      output: "   student_id  final_score\n27       S028           58\n8        S009           62\n17       S018           64\n  student_id  final_score\n5       S006          100\n6       S007          100\n7       S008          100",
      explain: [
        ["df.sort_values(\"final_score\")", "Dari nilai terkecil."],
        ["ascending=False", "Dari nilai terbesar. Perhatikan label index ikut berpindah."],
      ],
    },
    {
      title: "Contoh 2 — Beberapa kolom dengan arah berbeda",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
urut = df.sort_values(["city", "price_million"], ascending=[True, False], ignore_index=True)
print(urut[["city", "price_million"]].head(6))
print(urut.groupby("city").head(1)[["city", "house_id", "price_million"]])`,
      output: "      city  price_million\n0  Bandung           3379\n1  Bandung           3349\n2  Bandung           3187\n3  Bandung           3179\n4  Bandung           3150\n5  Bandung           3116\n           city house_id  price_million\n0       Bandung     H116           3379\n64      Jakarta     H299           5141\n178    Surabaya     H251           4014\n260  Yogyakarta     H187           3198",
      explain: [
        ["[\"city\", \"price_million\"], ascending=[True, False]", "Kota A→Z, lalu harga tertinggi lebih dulu di setiap kota."],
        ["ignore_index=True", "Index hasil 0, 1, 2, … sehingga lebih rapi."],
        ["urut.groupby(\"city\").head(1)", "Baris pertama setiap kota = rumah termahal di kota itu."],
      ],
      change: "Urutan bertingkat dengan arah berbeda.",
    },
    {
      title: "Contoh 3 — nlargest, nsmallest, dan rank",
      code: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")
print(df.nlargest(3, "mpg")[["car_name", "mpg"]])
print(df.nsmallest(3, "mpg")[["car_name", "mpg"]])

kecil = pd.DataFrame({"nama": ["A", "B", "C", "D"], "skor": [90, 85, 90, 70]})
kecil["peringkat"] = kecil["skor"].rank(ascending=False, method="min").astype(int)
print(kecil)`,
      output: "                 car_name   mpg\n322             mazda glc  46.6\n329   honda civic 1500 gl  44.6\n325  vw rabbit c (diesel)  44.3\n     car_name   mpg\n28   hi 1200d   9.0\n25  ford f250  10.0\n26  chevy c20  10.0\n  nama  skor  peringkat\n0    A    90          1\n1    B    85          3\n2    C    90          1\n3    D    70          4",
      explain: [
        ["df.nlargest(3, \"mpg\")", "Tiga mobil paling irit."],
        ["df.nsmallest(3, \"mpg\")", "Tiga mobil paling boros."],
        ["rank(ascending=False, method=\"min\")", "Peringkat 1 untuk skor tertinggi; skor sama mendapat peringkat terkecil yang sama (seperti olimpiade)."],
      ],
      change: "Tidak perlu mengurutkan seluruh data untuk mengambil nilai ekstrem.",
    },
    {
      title: "Contoh 4 — Mengurutkan time series sebelum membuat fitur",
      code: `import pandas as pd

df = pd.DataFrame({
    "tanggal": pd.to_datetime(["2026-01-03", "2026-01-01", "2026-01-04", "2026-01-02"]),
    "pm25": [52, 41, 47, 38],
})
salah = df.assign(pm25_kemarin=df["pm25"].shift(1))
print(salah)

benar = df.sort_values("tanggal", ignore_index=True)
benar["pm25_kemarin"] = benar["pm25"].shift(1)
print(benar)`,
      output: "     tanggal  pm25  pm25_kemarin\n0 2026-01-03    52           NaN\n1 2026-01-01    41          52.0\n2 2026-01-04    47          41.0\n3 2026-01-02    38          47.0\n     tanggal  pm25  pm25_kemarin\n0 2026-01-01    41           NaN\n1 2026-01-02    38          41.0\n2 2026-01-03    52          38.0\n3 2026-01-04    47          52.0",
      explain: [
        ["df[\"pm25\"].shift(1)", "Fitur lag: nilai baris sebelumnya."],
        ["salah = df.assign(pm25_kemarin=df[\"pm25\"].shift(1))", "Tanpa sorting, \"kemarin\" untuk 2026-01-01 adalah nilai 2026-01-03 — fitur salah tanpa error."],
        ["benar = df.sort_values(\"tanggal\", ignore_index=True)", "Urutkan berdasarkan waktu lebih dulu, baru buat lag."],
      ],
      change: "Sorting menjadi syarat kebenaran feature engineering time series.",
    },
  ],
  params: [
    {
      title: "sort_values & kawan-kawan",
      items: [
        { name: "sort_values(by, ascending=True, na_position=\"last\", ignore_index=False, kind=\"quicksort\")", desc: "Urutkan berdasarkan nilai; kind=\"stable\" menjaga urutan asli untuk nilai sama." },
        { name: "sort_index(ascending=True)", desc: "Urutkan berdasarkan label index." },
        { name: "nlargest(n, columns), nsmallest(n, columns)", desc: "n terbesar/terkecil." },
        { name: "rank(method=\"average\", ascending=True)", desc: "Peringkat; method min/max/dense/first." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"k": ["b", "a", "b", "a"], "v": [1, 4, 3, 2]})\nprint(df.sort_values(["k", "v"], ascending=[True, False])["v"].tolist())`, output: "[4, 2, 3, 1]" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
print(df.nlargest(5, "hours_per_week")[["age", "occupation", "hours_per_week", "income"]])
print(df.sort_values(["education_num", "age"], ascending=[False, True]).head())`,
  mistakes: [
    {
      title: "Mengira sort_values mengubah df",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [3, 1, 2]})
df.sort_values("a")
print(df["a"].tolist())   # tetap [3, 1, 2]`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [3, 1, 2]})
df = df.sort_values("a")
print(df["a"].tolist())`,
      explain: "sort_values mengembalikan DataFrame baru. Simpan hasilnya ke variabel.",
    },
    {
      title: "Panjang ascending tidak sama dengan by",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.sort_values(["a", "b"], ascending=[True]))`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.sort_values(["a", "b"], ascending=[True, False]))`,
      explain: "Jika ascending berupa list, panjangnya harus sama dengan jumlah kolom di by.",
    },
    {
      title: "Tanggal tersimpan sebagai teks",
      wrong: `import pandas as pd
df = pd.DataFrame({"tgl": ["9/1/2026", "10/1/2026", "2/1/2026"]})
print(df.sort_values("tgl")["tgl"].tolist())   # urutan teks, bukan tanggal`,
      fix: `import pandas as pd
df = pd.DataFrame({"tgl": ["9/1/2026", "10/1/2026", "2/1/2026"]})
df["tgl"] = pd.to_datetime(df["tgl"], format="%d/%m/%Y")
print(df.sort_values("tgl")["tgl"].dt.strftime("%Y-%m-%d").tolist())`,
      explain: "Teks diurutkan karakter demi karakter (\"10\" < \"2\" < \"9\"). Ubah ke datetime dengan format yang tepat sebelum sorting.",
    },
  ],
  bestPractices: [
    "Untuk time series: ubah kolom tanggal ke datetime, lalu `sort_values(\"tanggal\")` sebelum feature engineering.",
    "Gunakan `nlargest`/`nsmallest` untuk mengambil nilai ekstrem.",
    "Gunakan `kind=\"stable\"` jika urutan asli nilai yang sama penting.",
    "Gunakan `ignore_index=True` jika label lama tidak lagi bermakna.",
  ],
  exercises: [
    {
      id: "pd-sort-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Urutan turun",
      prompt: "Lengkapi agar `urut` berisi rumah dari harga tertinggi.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
urut = df.sort_values("price_million", ascending=____)
print(urut.head(3))`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
urut = df.sort_values("price_million", ascending=False)
print(urut.head(3))`,
      tests: [{ desc: "Terurut menurun", expr: "urut['price_million'].is_monotonic_decreasing" }],
      hints: ["Konsep: arah urutan.", "Default True = naik.", "`ascending=False`"],
      explanation: "False → besar ke kecil.",
    },
    {
      id: "pd-sort-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
s = pd.Series([30, 10, 20, 10])
print(s.sort_values().index.tolist())
print(s.rank(method="min").tolist())
print(s.nlargest(2).tolist())`,
      answer: "[1, 3, 2, 0]\n[4.0, 1.0, 3.0, 1.0]\n[30, 20]",
      hints: ["Konsep: label ikut berpindah.", "Nilai 10 ada di label 1 dan 3.", "rank min: nilai sama → peringkat terkecil."],
      explanation: "Label terurut [1, 3, 2, 0]; rank [4, 1, 3, 1]; dua terbesar [30, 20].",
    },
    {
      id: "pd-sort-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Hasil sorting hilang",
      prompt: "Perbaiki agar `df` benar-benar terurut berdasarkan `tanggal`.",
      starter: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.to_datetime(["2026-01-03", "2026-01-01", "2026-01-02"]), "pm25": [50, 40, 45]})
df.sort_values("tanggal")
print(df["pm25"].tolist())`,
      solution: `import pandas as pd
df = pd.DataFrame({"tanggal": pd.to_datetime(["2026-01-03", "2026-01-01", "2026-01-02"]), "pm25": [50, 40, 45]})
df = df.sort_values("tanggal")
print(df["pm25"].tolist())`,
      tests: [{ desc: "df terurut tanggal", expr: "df['tanggal'].is_monotonic_increasing and df['pm25'].tolist() == [40, 45, 50]" }],
      hints: ["Konsep: method mengembalikan objek baru.", "Simpan hasil sort_values.", "`df = df.sort_values(\"tanggal\")`"],
      explanation: "Tanpa assignment, hasil sorting dibuang.",
    },
    {
      id: "pd-sort-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Leaderboard model",
      prompt: "Urutkan `hasil` berdasarkan `mae` naik, dan jika sama, berdasarkan `waktu_detik` naik. Tambahkan kolom `peringkat` = 1, 2, 3, … sesuai urutan (gunakan `ignore_index=True` lalu `hasil.index + 1`). Cetak hasilnya.",
      starter: `import pandas as pd
hasil = pd.DataFrame({
    "model": ["LinReg", "RandomForest", "KNN", "GradBoost"],
    "mae": [12.4, 9.8, 11.1, 9.8],
    "waktu_detik": [0.1, 4.2, 0.5, 2.9],
})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
hasil = pd.DataFrame({
    "model": ["LinReg", "RandomForest", "KNN", "GradBoost"],
    "mae": [12.4, 9.8, 11.1, 9.8],
    "waktu_detik": [0.1, 4.2, 0.5, 2.9],
})
hasil = hasil.sort_values(["mae", "waktu_detik"], ignore_index=True)
hasil["peringkat"] = hasil.index + 1
print(hasil)`,
      tests: [
        { desc: "Urutan model benar", expr: "hasil['model'].tolist() == ['GradBoost', 'RandomForest', 'KNN', 'LinReg']" },
        { desc: "Peringkat 1..4", expr: "hasil['peringkat'].tolist() == [1, 2, 3, 4]" },
      ],
      hints: ["Konsep: sorting bertingkat.", "`sort_values([\"mae\", \"waktu_detik\"], ignore_index=True)`", "`hasil.index + 1`"],
      explanation: "Saat skor sama, model yang lebih cepat lebih disukai — kolom kedua menjadi tie-breaker.",
    },
    {
      id: "pd-sort-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Tiga wine terbaik per kualitas",
      prompt: [
        "Baca `winequality-red.csv` (sep=\";\"). Urutkan berdasarkan `quality` turun lalu `alcohol` turun (`ignore_index=True`) → `urut`.",
        "Buat `top3` = 3 baris pertama dari setiap nilai quality (`urut.groupby(\"quality\").head(3)`). Cetak `top3[[\"quality\", \"alcohol\"]]` dan jumlah barisnya.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
urut = df.sort_values(["quality", "alcohol"], ascending=[False, False], ignore_index=True)
top3 = urut.groupby("quality").head(3)
print(top3[["quality", "alcohol"]])
print(len(top3))`,
      tests: [
        { desc: "urut benar", expr: "urut['quality'].is_monotonic_decreasing and urut.iloc[0]['alcohol'] == df[df['quality'] == df['quality'].max()]['alcohol'].max()" },
        { desc: "3 baris per kualitas", expr: "(top3['quality'].value_counts() <= 3).all() and len(top3) == 3 * df['quality'].nunique()" },
        { desc: "Setiap kelompok berisi alkohol tertinggi", expr: "all(top3[top3['quality'] == q]['alcohol'].max() == df[df['quality'] == q]['alcohol'].max() for q in df['quality'].unique())" },
      ],
      hints: ["Konsep: sort bertingkat + groupby().head().", "ascending=[False, False].", "groupby(\"quality\").head(3) mempertahankan urutan."],
      explanation: "Pola sort lalu groupby().head(n) adalah cara cepat mengambil \"top-n per kelompok\".",
    },
  ],
  quiz: [
    { id: "pd-sort-q1", type: "mcq", prompt: "Mengambil 10 baris dengan nilai `pm25` terbesar paling efisien dengan…", options: ["df.sort_values(\"pm25\").tail(10)", "df.nlargest(10, \"pm25\")", "df.head(10)", "df.max()"], answer: 1, explanation: "nlargest tidak perlu mengurutkan seluruh data." },
    { id: "pd-sort-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [2, None, 1]})\nprint(df.sort_values("a")["a"].tolist())`, options: ["[nan, 1.0, 2.0]", "[1.0, 2.0, nan]", "[2.0, 1.0, nan]", "Error"], answer: 1, explanation: "NaN diletakkan di akhir secara default." },
    { id: "pd-sort-q3", type: "tf", prompt: "sort_values mempertahankan label index asli setiap baris (kecuali ignore_index=True).", answer: true, explanation: "Label ikut berpindah." },
    { id: "pd-sort-q4", type: "fill", prompt: "Mengurutkan berdasarkan label index: `df.____()`", answer: ["sort_index"], explanation: "`sort_index()`." },
    { id: "pd-sort-q5", type: "case", prompt: "Kamu membuat fitur `pm25_kemarin = df[\"pm25\"].shift(1)` tetapi data belum terurut tanggal. Akibatnya?", options: ["Error", "Fitur salah tanpa error — nilai \"kemarin\" bukan dari hari sebelumnya", "Tidak ada pengaruh", "Model otomatis memperbaiki"], answer: 1, explanation: "shift bekerja berdasarkan urutan baris." },
  ],
  challenge: {
    id: "pd-sort-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Hari terburuk per bulan",
    prompt: [
      "Diberikan data PM2.5 harian acak (tidak terurut). Buat kolom `bulan` (`df[\"tanggal\"].dt.month`), lalu ambil `terburuk` = satu hari dengan pm25 tertinggi di setiap bulan, terurut berdasarkan bulan.",
      "Petunjuk: urutkan berdasarkan `[\"bulan\", \"pm25\"]` dengan arah `[True, False]`, lalu `groupby(\"bulan\").head(1)`. Cetak `terburuk[[\"tanggal\", \"pm25\"]]`.",
    ],
    starter: `import numpy as np
import pandas as pd
rng = np.random.default_rng(3)
tanggal = pd.date_range("2025-01-01", "2025-03-31", freq="D")
df = pd.DataFrame({"tanggal": tanggal, "pm25": rng.integers(20, 120, len(tanggal))}).sample(frac=1, random_state=1)
# Tulis kodemu di sini
`,
    solution: `import numpy as np
import pandas as pd
rng = np.random.default_rng(3)
tanggal = pd.date_range("2025-01-01", "2025-03-31", freq="D")
df = pd.DataFrame({"tanggal": tanggal, "pm25": rng.integers(20, 120, len(tanggal))}).sample(frac=1, random_state=1)
df["bulan"] = df["tanggal"].dt.month
terburuk = df.sort_values(["bulan", "pm25"], ascending=[True, False]).groupby("bulan").head(1)
print(terburuk[["tanggal", "pm25"]])`,
    tests: [
      { desc: "Satu baris per bulan", expr: "terburuk['bulan'].tolist() == [1, 2, 3]" },
      { desc: "pm25 = maksimum bulan itu", expr: "terburuk['pm25'].tolist() == df.groupby('bulan')['pm25'].max().tolist()" },
    ],
    alternatives: [
      `import numpy as np
import pandas as pd
rng = np.random.default_rng(3)
tanggal = pd.date_range("2025-01-01", "2025-03-31", freq="D")
df = pd.DataFrame({"tanggal": tanggal, "pm25": rng.integers(20, 120, len(tanggal))}).sample(frac=1, random_state=1)
df["bulan"] = df["tanggal"].dt.month
terburuk = df.loc[df.groupby("bulan")["pm25"].idxmax()]
print(terburuk[["tanggal", "pm25"]])`,
    ],
    hints: ["Konsep: top-1 per kelompok.", "`df[\"tanggal\"].dt.month` untuk bulan.", "Sort bertingkat lalu `groupby(\"bulan\").head(1)`."],
    explanation: "Cara lain: `df.loc[df.groupby(\"bulan\")[\"pm25\"].idxmax()]`. Analisis hari ekstrem membantu memahami pola musiman polusi.",
  },
  summary: [
    "`sort_values(by, ascending)` mengurutkan dan mengembalikan DataFrame baru.",
    "Beberapa kolom: list `by` dan list `ascending`.",
    "`sort_index` untuk label index; `nlargest`/`nsmallest` untuk nilai ekstrem; `rank` untuk peringkat.",
    "Time series wajib diurutkan berdasarkan tanggal sebelum shift/rolling/split.",
  ],
  cheatsheet: [
    { syntax: "df.sort_values(\"x\", ascending=False)", desc: "Turun" },
    { syntax: "df.sort_values([\"a\", \"b\"], ascending=[True, False])", desc: "Bertingkat" },
    { syntax: "df.nlargest(5, \"x\")", desc: "Top 5" },
    { syntax: "s.rank(ascending=False)", desc: "Peringkat" },
    { syntax: "df.sort_values(k).groupby(g).head(1)", desc: "Top-1 per kelompok" },
  ],
  flashcards: [
    { q: "Urutkan df berdasarkan kota A–Z lalu harga tertinggi", a: "df.sort_values([\"kota\", \"harga\"], ascending=[True, False])" },
    { q: "Ambil 3 baris dengan mpg terkecil", a: "df.nsmallest(3, \"mpg\")" },
    { q: "Mengapa sort_values perlu disimpan ke variabel?", a: "Karena mengembalikan DataFrame baru, tidak mengubah df" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.sort_values", "reference/api/pandas.DataFrame.sort_values.html"),
    pandasDoc("Essential basic functionality — Sorting", "user_guide/basics.html#sorting"),
    pandasDoc("pandas.DataFrame.nlargest", "reference/api/pandas.DataFrame.nlargest.html"),
    pandasDoc("pandas.Series.rank", "reference/api/pandas.Series.rank.html"),
  ],
};
