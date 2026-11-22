import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-loc",
  title: "loc[]",
  minutes: 40,
  prerequisites: ["pd-selecting-rows"],
  objectives: [
    "Memilih baris dan kolom berdasarkan **label** dengan `df.loc[baris, kolom]`.",
    "Memahami bahwa slice pada `loc` bersifat **inklusif** di kedua ujung.",
    "Menggabungkan `loc` dengan kondisi boolean untuk memilih baris dan kolom sekaligus.",
    "Mengubah nilai dengan aman memakai `df.loc[kondisi, kolom] = nilai` (Copy-on-Write).",
  ],
  definition: [
    "`df.loc[baris, kolom]` memilih data berdasarkan **label**: label index untuk baris, nama untuk kolom. Bagian baris dan kolom masing-masing boleh berupa:\n- satu label: `df.loc[\"C02\", \"umur\"]`\n- list label: `df.loc[[\"C01\", \"C03\"], [\"umur\", \"kota\"]]`\n- slice label: `df.loc[\"C01\":\"C03\", \"umur\":\"gaji\"]` — **ujung akhir ikut** (inklusif)\n- array boolean: `df.loc[df[\"umur\"] > 30, \"gaji\"]`\n- `:` untuk semua",
    "Bentuk hasil bergantung pada input: dua skalar → satu nilai; satu skalar + list/slice → Series; list/slice di keduanya → DataFrame.",
    "Untuk **mengubah** data, gunakan satu langkah `df.loc[kondisi, \"kolom\"] = nilai`. Di pandas 3 (Copy-on-Write), pola dua langkah seperti `df[df[\"a\"] > 0][\"b\"] = 1` (*chained assignment*) **tidak pernah** mengubah `df`.",
  ],
  why: [
    "Data cleaning sering berupa \"untuk baris yang memenuhi syarat X, ubah kolom Y\": mengganti umur tidak valid, memperbaiki kategori salah ketik, membuat label. `loc` melakukannya dengan jelas dan aman.",
    "Saat index bermakna (ID pelanggan, tanggal), `loc` memungkinkan mengambil data dengan label tersebut — misalnya `df.loc[\"2025-12-01\":\"2025-12-31\"]` untuk data harian bulan Desember.",
  ],
  when: [
    "- Mengambil data berdasarkan label index (ID, tanggal).",
    "- Memilih baris dengan kondisi sekaligus kolom tertentu.",
    "- Mengubah nilai pada baris yang memenuhi kondisi.",
    "- Memilih rentang kolom berdasarkan nama.",
  ],
  analogy: "`loc` seperti **mencari di buku telepon berdasarkan nama**: kamu menyebut nama orang (label baris) dan informasi yang dicari (label kolom). Rentang \"Ani sampai Citra\" berarti Citra juga ikut — seperti membaca daftar sampai nama terakhir yang disebut.",
  syntax: {
    code: `df.loc["C02"]                          # satu baris
df.loc["C02", "umur"]                  # satu nilai
df.loc[["C01", "C03"], ["umur", "kota"]]
df.loc["C01":"C03", "umur":"gaji"]     # inklusif!
df.loc[df["umur"] > 30, ["nama", "gaji"]]
df.loc[df["umur"] < 0, "umur"] = np.nan   # ubah nilai`,
  },
  anatomy: [
    ["df.loc[baris, kolom]", "Dua bagian dipisah koma: label baris, label kolom."],
    ["\"C01\":\"C03\"", "Slice label inklusif di kedua ujung."],
    ["df.loc[mask, kolom]", "Baris dari mask boolean, kolom dari label."],
    ["df.loc[mask, kolom] = v", "Assignment satu langkah — selalu mengubah df."],
  ],
  examples: [
    {
      title: "Contoh 1 — Label baris dan kolom",
      code: `import pandas as pd

df = pd.DataFrame(
    {"nama": ["Ani", "Budi", "Citra", "Dodi"], "umur": [21, 35, 28, 42], "kota": ["Bogor", "Depok", "Bekasi", "Bogor"]},
    index=["C01", "C02", "C03", "C04"],
)
print(df.loc["C02"])
print(df.loc["C02", "umur"])
print(df.loc[["C01", "C04"], ["nama", "kota"]])`,
      output: "nama     Budi\numur       35\nkota    Depok\nName: C02, dtype: object\n35\n     nama   kota\nC01   Ani  Bogor\nC04  Dodi  Bogor",
      explain: [
        ["index=[\"C01\", \"C02\", \"C03\", \"C04\"]", "Index berupa ID pelanggan."],
        ["df.loc[\"C02\"]", "Satu baris → Series."],
        ["df.loc[\"C02\", \"umur\"]", "Satu sel → nilai skalar."],
        ["df.loc[[\"C01\", \"C04\"], [\"nama\", \"kota\"]]", "List baris × list kolom → DataFrame."],
      ],
    },
    {
      title: "Contoh 2 — Slice label inklusif",
      code: `import pandas as pd

df = pd.DataFrame(
    {"a": [1, 2, 3, 4], "b": [5, 6, 7, 8], "c": [9, 10, 11, 12], "d": [13, 14, 15, 16]},
    index=["w", "x", "y", "z"],
)
print(df.loc["x":"z", "b":"c"])
print(df.loc[:, "c":])`,
      output: "   b   c\nx  6  10\ny  7  11\nz  8  12\n    c   d\nw   9  13\nx  10  14\ny  11  15\nz  12  16",
      explain: [
        ["df.loc[\"x\":\"z\", \"b\":\"c\"]", "Baris x sampai z DAN kolom b sampai c — ujung akhir ikut."],
        ["df.loc[:, \"c\":]", "Semua baris, kolom dari c sampai akhir."],
      ],
      change: "Bukan list label, tetapi rentang label.",
    },
    {
      title: "Contoh 3 — Kondisi + kolom tertentu",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
pelanggan_berisiko = df.loc[
    (df["contract"] == "Month-to-month") & (df["support_tickets"] >= 4),
    ["customer_id", "tenure_months", "monthly_charges", "churn"],
]
print(pelanggan_berisiko.head())
print(len(pelanggan_berisiko), "pelanggan | churn rate:", pelanggan_berisiko["churn"].mean().round(3))
print("Churn rate keseluruhan:", df["churn"].mean().round(3))`,
      output: "    customer_id  tenure_months  monthly_charges  churn\n32        C0033             57            52.84      0\n39        C0040             65            48.82      0\n66        C0067             55            96.39      1\n210       C0211             54            93.67      0\n250       C0251              7           118.91      1\n6 pelanggan | churn rate: 0.5\nChurn rate keseluruhan: 0.38",
      explain: [
        ["(df[\"contract\"] == \"Month-to-month\") & (df[\"support_tickets\"] >= 4)", "Mask boolean dua kondisi untuk bagian baris."],
        ["[\"customer_id\", \"tenure_months\", \"monthly_charges\", \"churn\"]", "Bagian kolom: hanya kolom yang relevan."],
        ["pelanggan_berisiko[\"churn\"].mean()", "Churn rate kelompok ini dibandingkan dengan keseluruhan."],
      ],
      change: "Bagian baris berupa kondisi, pada dataset nyata.",
    },
    {
      title: "Contoh 4 — Mengubah nilai dengan aman",
      code: `import numpy as np
import pandas as pd

df = pd.DataFrame({"nama": ["Ani", "Budi", "Citra"], "umur": [21, -5, 230]})

# Chained assignment: TIDAK mengubah df di pandas 3
df[df["umur"] < 0]["umur"] = np.nan
print(df["umur"].tolist())

# Cara benar: satu langkah dengan loc
df.loc[(df["umur"] < 0) | (df["umur"] > 120), "umur"] = np.nan
print(df["umur"].tolist())

df.loc[df["umur"].isna(), "umur_valid"] = False
df.loc[df["umur"].notna(), "umur_valid"] = True
print(df)`,
      output: "[21, -5, 230]\n[21.0, nan, nan]\n    nama  umur umur_valid\n0    Ani  21.0       True\n1   Budi   NaN      False\n2  Citra   NaN      False",
      explain: [
        ["df[df[\"umur\"] < 0][\"umur\"] = np.nan", "Dua langkah: seleksi pertama menghasilkan objek baru (CoW), jadi perubahan tidak sampai ke df. Pandas juga memberi ChainedAssignmentError warning."],
        ["df.loc[(df[\"umur\"] < 0) | (df[\"umur\"] > 120), \"umur\"] = np.nan", "Satu langkah: baris tidak valid, kolom umur → diganti NaN."],
        ["df.loc[df[\"umur\"].isna(), \"umur_valid\"] = False", "loc juga bisa membuat kolom baru untuk baris tertentu."],
      ],
      change: "loc tidak hanya membaca, tetapi juga menulis data.",
    },
  ],
  params: [
    {
      title: "Bentuk input loc",
      items: [
        { name: "label tunggal", desc: "\"C01\", 5 (jika index integer), \"umur\"." },
        { name: "list label", desc: "[\"C01\", \"C03\"]." },
        { name: "slice label", desc: "\"C01\":\"C03\" — inklusif." },
        { name: "array/Series boolean", desc: "Panjang = jumlah baris." },
        { name: "callable", desc: "lambda d: d[\"umur\"] > 30 (berguna dalam method chaining)." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"x": [1, 2, 3], "y": [4, 5, 6]}, index=["a", "b", "c"])\nprint(df.loc["a":"b", "y"].tolist(), df.loc["c", "x"])`, output: "[4, 5] 3" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv").set_index("house_id")
print(df.loc["H001"])
print(df.loc[df["city"] == "Bandung", ["area_m2", "price_million"]].head())`,
  mistakes: [
    {
      title: "Memakai posisi di loc",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]}, index=["x", "y"])
print(df.loc[0])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]}, index=["x", "y"])
print(df.iloc[0])`,
      explain: "loc hanya menerima label. Untuk posisi gunakan iloc.",
    },
    {
      title: "Chained assignment tidak mengubah data",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, -2, 3], "b": [0, 0, 0]})
df[df["a"] < 0]["b"] = 1
print(df["b"].tolist())   # tetap [0, 0, 0]`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, -2, 3], "b": [0, 0, 0]})
df.loc[df["a"] < 0, "b"] = 1
print(df["b"].tolist())`,
      explain: "Di pandas 3 (Copy-on-Write), assignment harus dilakukan dalam satu langkah `df.loc[...] = ...`.",
    },
    {
      title: "Lupa koma antara baris dan kolom",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]}, index=["x", "y"])
print(df.loc["x"]["a"], df.loc["a"])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]}, index=["x", "y"])
print(df.loc["x", "a"], df.loc[:, "a"].tolist())`,
      explain: "Satu argumen di loc selalu ditafsirkan sebagai label BARIS. Untuk kolom gunakan `df.loc[:, \"a\"]`.",
    },
  ],
  bestPractices: [
    "Gunakan `df.loc[mask, kolom] = nilai` untuk setiap perubahan bersyarat.",
    "Jadikan kolom ID/tanggal sebagai index (`set_index`) jika sering diakses berdasarkan label.",
    "Ingat: slice `loc` inklusif, slice `iloc` eksklusif.",
    "Simpan mask di variabel bernama jelas sebelum dipakai di loc.",
  ],
  exercises: [
    {
      id: "pd-loc-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Satu sel",
      prompt: "Lengkapi agar `harga` berisi harga rumah dengan ID `H003`.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv").set_index("house_id")
harga = df.____["H003", "price_million"]
print(harga)`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv").set_index("house_id")
harga = df.loc["H003", "price_million"]
print(harga)`,
      tests: [{ desc: "harga benar", expr: "harga == __import__('pandas').read_csv('house_prices.csv').query('house_id == \"H003\"')['price_million'].iloc[0]" }],
      hints: ["Konsep: akses berdasarkan label.", "Label baris H003, label kolom price_million.", "`df.loc[...]`"],
      explanation: "loc[label_baris, label_kolom] → satu nilai.",
    },
    {
      id: "pd-loc-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"v": [10, 20, 30, 40, 50]}, index=[1, 2, 3, 4, 5])
print(df.loc[2:4, "v"].tolist())
print(df.iloc[2:4, 0].tolist())`,
      answer: "[20, 30, 40]\n[30, 40]",
      hints: ["Konsep: loc inklusif, iloc eksklusif.", "loc[2:4] → label 2, 3, 4.", "iloc[2:4] → posisi 2, 3."],
      explanation: "loc: [20, 30, 40]; iloc: [30, 40].",
    },
    {
      id: "pd-loc-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Perubahan yang tidak tersimpan",
      prompt: "Kode ini tidak mengubah `df` (chained assignment). Perbaiki agar status pelanggan dengan `support_tickets >= 5` menjadi \"prioritas\".",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
df["status"] = "normal"
df[df["support_tickets"] >= 5]["status"] = "prioritas"
print(df["status"].value_counts())`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
df["status"] = "normal"
df.loc[df["support_tickets"] >= 5, "status"] = "prioritas"
print(df["status"].value_counts())`,
      tests: [{ desc: "Status prioritas terisi", expr: "(df['status'] == 'prioritas').sum() == (df['support_tickets'] >= 5).sum() > 0" }],
      hints: ["Konsep: assignment satu langkah.", "Gabungkan kondisi dan kolom dalam satu loc.", "`df.loc[df[\"support_tickets\"] >= 5, \"status\"] = \"prioritas\"`"],
      explanation: "Dengan Copy-on-Write, hanya `df.loc[...] = ...` yang mengubah df.",
    },
    {
      id: "pd-loc-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Bersihkan nilai tidak valid",
      prompt: "Pada `df`, ganti `nilai` yang < 0 atau > 100 menjadi `np.nan` memakai satu baris `loc`. Lalu cetak `df[\"nilai\"].tolist()`.",
      starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({"nama": ["A", "B", "C", "D", "E"], "nilai": [88, -1, 105, 72, 64]})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({"nama": ["A", "B", "C", "D", "E"], "nilai": [88, -1, 105, 72, 64]})
df.loc[(df["nilai"] < 0) | (df["nilai"] > 100), "nilai"] = np.nan
print(df["nilai"].tolist())`,
      tests: [
        { desc: "Dua nilai menjadi NaN", expr: "df['nilai'].isna().tolist() == [False, True, True, False, False]" },
        { desc: "Nilai valid tetap", expr: "df['nilai'].dropna().tolist() == [88.0, 72.0, 64.0]" },
        { desc: "Memakai loc", expr: "'.loc[' in _code" },
      ],
      hints: ["Konsep: loc dengan mask OR.", "`(df[\"nilai\"] < 0) | (df[\"nilai\"] > 100)`", "`df.loc[mask, \"nilai\"] = np.nan`"],
      explanation: "Nilai di luar rentang logis diubah menjadi missing, lalu ditangani di tahap imputasi.",
    },
    {
      id: "pd-loc-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Label kualitas wine",
      prompt: [
        "Baca `winequality-red.csv` (sep=\";\"). Buat kolom `label` berisi \"rendah\" (quality ≤ 5), \"sedang\" (6), dan \"tinggi\" (≥ 7) memakai tiga pernyataan `df.loc[kondisi, \"label\"] = ...`.",
        "Lalu buat `ringkas` = `df.loc[df[\"label\"] == \"tinggi\", [\"alcohol\", \"volatile acidity\"]].mean().round(3)` dan cetak `df[\"label\"].value_counts()` serta `ringkas`.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
df.loc[df["quality"] <= 5, "label"] = "rendah"
df.loc[df["quality"] == 6, "label"] = "sedang"
df.loc[df["quality"] >= 7, "label"] = "tinggi"
ringkas = df.loc[df["label"] == "tinggi", ["alcohol", "volatile acidity"]].mean().round(3)
print(df["label"].value_counts())
print(ringkas)`,
      tests: [
        { desc: "Semua baris berlabel", expr: "df['label'].notna().all()" },
        { desc: "Jumlah tinggi benar", expr: "(df['label'] == 'tinggi').sum() == (df['quality'] >= 7).sum()" },
        { desc: "ringkas benar", expr: "abs(ringkas['alcohol'] - df[df['quality'] >= 7]['alcohol'].mean()) < 1e-3" },
      ],
      hints: ["Konsep: loc untuk membuat kolom bersyarat.", "Pernyataan pertama membuat kolom label (baris lain sementara NaN).", "Seleksi kolom berspasi tetap pakai string: \"volatile acidity\"."],
      explanation: "Wine berkualitas tinggi rata-rata punya alkohol lebih tinggi dan volatile acidity lebih rendah — insight yang akan terlihat lagi di analisis korelasi.",
    },
  ],
  quiz: [
    { id: "pd-loc-q1", type: "mcq", prompt: "`df.loc[\"a\":\"c\"]` dengan index [\"a\", \"b\", \"c\", \"d\"] mengembalikan…", options: ["a, b", "a, b, c", "b, c", "a, b, c, d"], answer: 1, explanation: "Slice loc inklusif." },
    { id: "pd-loc-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3]})\ndf.loc[df["a"] > 1, "a"] = 0\nprint(df["a"].tolist())`, options: ["[1, 2, 3]", "[1, 0, 0]", "[0, 0, 0]", "[0, 2, 3]"], answer: 1, explanation: "Nilai > 1 diganti 0." },
    { id: "pd-loc-q3", type: "tf", prompt: "Di pandas 3, `df[df[\"a\"] > 0][\"b\"] = 1` mengubah df.", answer: false, explanation: "Chained assignment tidak pernah berhasil dengan Copy-on-Write." },
    { id: "pd-loc-q4", type: "fill", prompt: "Semua baris, kolom \"umur\": `df.loc[____, \"umur\"]`", answer: [":"], explanation: "`:` = semua." },
    { id: "pd-loc-q5", type: "case", prompt: "Kamu ingin mengganti kota \"Jkt\" menjadi \"Jakarta\" di kolom `kota`. Cara yang benar?", options: ["df[df[\"kota\"] == \"Jkt\"][\"kota\"] = \"Jakarta\"", "df.loc[df[\"kota\"] == \"Jkt\", \"kota\"] = \"Jakarta\"", "df.kota = \"Jakarta\"", "df.loc[\"Jkt\"] = \"Jakarta\""], answer: 1, explanation: "Satu langkah dengan loc." },
  ],
  challenge: {
    id: "pd-loc-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Data harian dengan index tanggal",
    prompt: [
      "Buat `df` dari teks `data` dengan `parse_dates=[\"tanggal\"]`, lalu `set_index(\"tanggal\")`.",
      "1. `minggu1` = baris 2026-01-01 sampai 2026-01-07 (slice label inklusif), kolom `pm25`.\n2. Ganti `pm25` yang bernilai -1 (sensor mati) menjadi NaN dengan loc.\n3. `rata_minggu1` = rata-rata pm25 minggu pertama setelah pembersihan (abaikan NaN), 2 desimal.",
      "Cetak `len(minggu1)` dan `rata_minggu1`.",
    ],
    starter: `import io
import numpy as np
import pandas as pd
data = """tanggal,pm25
2026-01-01,41
2026-01-02,-1
2026-01-03,38
2026-01-04,55
2026-01-05,47
2026-01-06,-1
2026-01-07,50
2026-01-08,62
2026-01-09,58"""
# Tulis kodemu di sini
`,
    solution: `import io
import numpy as np
import pandas as pd
data = """tanggal,pm25
2026-01-01,41
2026-01-02,-1
2026-01-03,38
2026-01-04,55
2026-01-05,47
2026-01-06,-1
2026-01-07,50
2026-01-08,62
2026-01-09,58"""
df = pd.read_csv(io.StringIO(data), parse_dates=["tanggal"]).set_index("tanggal")
df.loc[df["pm25"] == -1, "pm25"] = np.nan
minggu1 = df.loc["2026-01-01":"2026-01-07", "pm25"]
rata_minggu1 = round(minggu1.mean(), 2)
print(len(minggu1), rata_minggu1)`,
    tests: [
      { desc: "minggu1 berisi 7 hari", expr: "len(minggu1) == 7" },
      { desc: "Nilai -1 menjadi NaN", expr: "df['pm25'].isna().sum() == 2 and (df['pm25'] == -1).sum() == 0" },
      { desc: "rata_minggu1 == 46.2", expr: "rata_minggu1 == 46.2" },
    ],
    hints: ["Konsep: index datetime + slice label.", "Bersihkan dulu dengan `df.loc[df[\"pm25\"] == -1, \"pm25\"] = np.nan`.", "`df.loc[\"2026-01-01\":\"2026-01-07\", \"pm25\"]`"],
    explanation: "Index tanggal + loc adalah fondasi analisis time series seperti forecasting PM2.5: memilih periode, membersihkan sensor rusak, lalu menghitung statistik.",
  },
  summary: [
    "`df.loc[baris, kolom]` memilih berdasarkan label.",
    "Slice label inklusif di kedua ujung.",
    "Bagian baris boleh berupa mask boolean: `df.loc[mask, kolom]`.",
    "Ubah data dengan satu langkah `df.loc[mask, kolom] = nilai`; chained assignment tidak bekerja di pandas 3.",
  ],
  cheatsheet: [
    { syntax: "df.loc[\"id\", \"kol\"]", desc: "Satu nilai" },
    { syntax: "df.loc[\"a\":\"c\", :]", desc: "Rentang label (inklusif)" },
    { syntax: "df.loc[mask, [\"a\", \"b\"]]", desc: "Kondisi + kolom" },
    { syntax: "df.loc[mask, \"a\"] = v", desc: "Ubah nilai" },
    { syntax: "df.set_index(\"id\")", desc: "Jadikan kolom index" },
  ],
  flashcards: [
    { q: "Ganti nilai kolom b menjadi 0 untuk baris dengan a < 0", a: "df.loc[df[\"a\"] < 0, \"b\"] = 0" },
    { q: "Apakah slice loc inklusif?", a: "Ya, kedua ujung ikut" },
    { q: "Ambil kolom x dan y untuk baris dengan label r1 dan r2", a: "df.loc[[\"r1\", \"r2\"], [\"x\", \"y\"]]" },
  ],
  references: [
    pandasDoc("Indexing and selecting data — Selection by label", "user_guide/indexing.html#selection-by-label"),
    pandasDoc("pandas.DataFrame.loc", "reference/api/pandas.DataFrame.loc.html"),
    pandasDoc("Copy-on-Write — Chained assignment", "user_guide/migration.html#chained-assignment"),
    pandasDoc("pandas.DataFrame.set_index", "reference/api/pandas.DataFrame.set_index.html"),
  ],
};
