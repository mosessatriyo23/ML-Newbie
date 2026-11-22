import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-creating-dataframes",
  title: "Creating DataFrames",
  minutes: 35,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Membuat DataFrame dari dictionary of lists, list of dictionaries, list of lists, dan array NumPy.",
    "Menentukan nama kolom dan index secara eksplisit.",
    "Membuat DataFrame dari file (CSV) dan dari teks dengan `io.StringIO`.",
    "Menyimpan DataFrame ke CSV dengan `to_csv(index=False)`.",
  ],
  definition: [
    "`pd.DataFrame(data, index=None, columns=None)` menerima beberapa bentuk data:\n- **dict of lists** — `{\"kolom\": [nilai, ...]}`: setiap key adalah satu kolom (paling umum)\n- **list of dicts** — `[{\"kolom\": nilai}, ...]`: setiap dictionary adalah satu baris (umum dari JSON/API)\n- **list of lists / array 2D** — setiap list dalam adalah satu baris; nama kolom diberikan lewat `columns=`",
    "Pada list of dicts, key yang tidak ada di suatu baris otomatis diisi `NaN`.",
    "Dalam praktik, DataFrame lebih sering dibuat dari file: `pd.read_csv`, `pd.read_excel`, `pd.read_json` (dibahas di Module 04). Sebaliknya, `df.to_csv(\"file.csv\", index=False)` menyimpan DataFrame ke file.",
  ],
  why: [
    "Membuat DataFrame kecil secara manual sangat berguna untuk menguji kode, membuat contoh, dan menyusun tabel hasil (misalnya tabel perbandingan skor model).",
    "Data dari API/JSON biasanya berbentuk list of dicts, sedangkan hasil model (prediksi, probabilitas) berupa array NumPy — keduanya perlu diubah ke DataFrame agar mudah dianalisis dan disimpan, misalnya file `submission.csv` untuk kompetisi Kaggle.",
  ],
  when: [
    "- Membuat data uji kecil.",
    "- Mengubah hasil API/JSON menjadi tabel.",
    "- Membungkus array hasil model dengan nama kolom.",
    "- Membuat tabel ringkasan atau file submission.",
  ],
  analogy: "Membuat DataFrame seperti **mengisi formulir pendaftaran**: kamu bisa mengisinya per kolom (semua nama dulu, lalu semua umur — dict of lists) atau per orang (formulir satu per satu — list of dicts). Hasil akhirnya tabel yang sama.",
  syntax: {
    code: `pd.DataFrame({"a": [1, 2], "b": [3, 4]})          # dict of lists
pd.DataFrame([{"a": 1, "b": 3}, {"a": 2, "b": 4}])  # list of dicts
pd.DataFrame([[1, 3], [2, 4]], columns=["a", "b"])  # list of lists
df.to_csv("hasil.csv", index=False)`,
  },
  anatomy: [
    ["columns=[...]", "Nama kolom untuk data tanpa label."],
    ["index=[...]", "Label baris kustom."],
    ["to_csv(..., index=False)", "Simpan tanpa kolom index tambahan."],
  ],
  examples: [
    {
      title: "Contoh 1 — Dict of lists (per kolom)",
      code: `import pandas as pd

df = pd.DataFrame({
    "produk": ["Kopi", "Teh", "Jus"],
    "harga": [18000, 12000, 22000],
    "stok": [40, 25, 10],
})
print(df)`,
      output: "  produk  harga  stok\n0   Kopi  18000    40\n1    Teh  12000    25\n2    Jus  22000    10",
      explain: [
        ["\"produk\": [\"Kopi\", \"Teh\", \"Jus\"]", "Key = nama kolom, list = isi kolom."],
        ["print(df)", "Index 0, 1, 2 dibuat otomatis."],
      ],
    },
    {
      title: "Contoh 2 — List of dicts (per baris) dan NaN otomatis",
      code: `import pandas as pd

data_api = [
    {"kota": "Jakarta", "pm25": 55.2, "aqi": 152},
    {"kota": "Bandung", "pm25": 28.1},
    {"kota": "Surabaya", "pm25": 35.6, "aqi": 101},
]
df = pd.DataFrame(data_api)
print(df)
print(df.isna().sum().to_dict())`,
      output: "       kota  pm25    aqi\n0   Jakarta  55.2  152.0\n1   Bandung  28.1    NaN\n2  Surabaya  35.6  101.0\n{'kota': 0, 'pm25': 0, 'aqi': 1}",
      explain: [
        ["data_api = [", "Bentuk data yang umum diterima dari API/JSON."],
        ["df = pd.DataFrame(data_api)", "Setiap dictionary menjadi satu baris."],
        ["df.isna().sum()", "Bandung tidak punya key \"aqi\" → NaN, dan kolom aqi menjadi float."],
      ],
      change: "Data disusun per baris, dan ada nilai yang hilang.",
    },
    {
      title: "Contoh 3 — Array NumPy dengan nama kolom dan index",
      code: `import numpy as np
import pandas as pd

prob = np.array([[0.9, 0.1], [0.3, 0.7], [0.55, 0.45]])
df = pd.DataFrame(prob, columns=["p_tidak", "p_ya"], index=["C01", "C02", "C03"])
df["prediksi"] = (df["p_ya"] >= 0.5).astype(int)
print(df)`,
      output: "     p_tidak  p_ya  prediksi\nC01     0.90  0.10         0\nC02     0.30  0.70         1\nC03     0.55  0.45         0",
      explain: [
        ["pd.DataFrame(prob, columns=[\"p_tidak\", \"p_ya\"], index=[\"C01\", \"C02\", \"C03\"])", "Array 2D diberi nama kolom dan label baris."],
        ["df[\"prediksi\"] = (df[\"p_ya\"] >= 0.5).astype(int)", "Menambah kolom baru dari kolom lain."],
      ],
      change: "Sumber data adalah output model (array), bukan data manual.",
    },
    {
      title: "Contoh 4 — Dari teks CSV, lalu simpan ke file",
      code: `import io
import pandas as pd

teks = """id,tanggal,pm25
1,2026-01-01,41.5
2,2026-01-02,38.0
3,2026-01-03,52.3"""
df = pd.read_csv(io.StringIO(teks), parse_dates=["tanggal"])
print(df.dtypes)

df[["id", "pm25"]].to_csv("submission.csv", index=False)
print(open("submission.csv").read())`,
      output: "id                  int64\ntanggal    datetime64[us]\npm25              float64\ndtype: object\nid,pm25\n1,41.5\n2,38.0\n3,52.3",
      explain: [
        ["pd.read_csv(io.StringIO(teks), parse_dates=[\"tanggal\"])", "StringIO membuat teks berperilaku seperti file; parse_dates mengubah kolom tanggal menjadi datetime."],
        ["to_csv(\"submission.csv\", index=False)", "Menyimpan tanpa kolom index — format yang diminta kebanyakan kompetisi Kaggle."],
        ["open(\"submission.csv\").read()", "Membuktikan isi file yang tersimpan."],
      ],
      change: "Siklus lengkap: teks → DataFrame → file.",
    },
  ],
  params: [
    {
      title: "pd.DataFrame & to_csv",
      items: [
        { name: "data", desc: "dict, list of dicts, list of lists, ndarray, Series." },
        { name: "columns", desc: "Nama kolom (atau memilih/mengurutkan kolom dari dict)." },
        { name: "index", desc: "Label baris." },
        { name: "dtype", desc: "Paksa tipe data seluruh kolom." },
        { name: "to_csv(path, index=True, sep=\",\")", desc: "Simpan; gunakan index=False untuk submission." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame([[1, "a"], [2, "b"]], columns=["no", "huruf"])\nprint(df.to_csv(index=False))`, output: "no,huruf\n1,a\n2,b" },
  tryIt: `import pandas as pd

hasil_model = pd.DataFrame({
    "model": ["Linear Regression", "Random Forest", "KNN"],
    "mae": [12.4, 9.8, 11.1],
})
print(hasil_model.sort_values("mae"))`,
  mistakes: [
    {
      title: "Jumlah nama kolom tidak cocok",
      wrong: `import pandas as pd
df = pd.DataFrame([[1, 2, 3], [4, 5, 6]], columns=["a", "b"])`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame([[1, 2, 3], [4, 5, 6]], columns=["a", "b", "c"])
print(df)`,
      explain: "Setiap baris punya 3 nilai, jadi harus ada 3 nama kolom.",
    },
    {
      title: "Dictionary berisi skalar saja",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": 1, "b": 2})`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
print(df)`,
      explain: "*If using all scalar values, you must pass an index* — bungkus nilai dalam list.",
    },
    {
      title: "Kolom index ikut tersimpan",
      wrong: `import pandas as pd
df = pd.DataFrame({"id": [1, 2], "pred": [10, 20]})
df.to_csv("sub.csv")
print(open("sub.csv").read())   # ada kolom tanpa nama di depan`,
      fix: `import pandas as pd
df = pd.DataFrame({"id": [1, 2], "pred": [10, 20]})
df.to_csv("sub.csv", index=False)
print(open("sub.csv").read())`,
      explain: "Tanpa `index=False`, index ikut ditulis sebagai kolom pertama — submission bisa ditolak.",
    },
  ],
  bestPractices: [
    "Gunakan dict of lists untuk data kecil yang diketik manual.",
    "Selalu beri nama kolom saat membuat DataFrame dari array.",
    "Simpan file hasil dengan `index=False` kecuali index memang bermakna.",
    "Gunakan `parse_dates` saat membaca kolom tanggal.",
  ],
  exercises: [
    {
      id: "pd-create-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Nama kolom dari array",
      prompt: "Lengkapi agar DataFrame memiliki kolom `x` dan `y`.",
      starter: `import numpy as np
import pandas as pd
arr = np.array([[1, 2], [3, 4], [5, 6]])
df = pd.DataFrame(arr, ____=["x", "y"])
print(df)`,
      solution: `import numpy as np
import pandas as pd
arr = np.array([[1, 2], [3, 4], [5, 6]])
df = pd.DataFrame(arr, columns=["x", "y"])
print(df)`,
      tests: [{ desc: "Kolom x dan y", expr: "list(df.columns) == ['x', 'y'] and df['y'].tolist() == [2, 4, 6]" }],
      hints: ["Konsep: memberi nama kolom.", "Parameter bernama sama dengan atribut df.columns.", "`columns=[\"x\", \"y\"]`"],
      explanation: "`columns=` memberi label untuk setiap kolom array.",
    },
    {
      id: "pd-create-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame([{"a": 1, "b": 2}, {"a": 3}, {"b": 4, "c": 5}])
print(df.shape)
print(df.isna().sum().sum())
print(df.columns.tolist())`,
      answer: "(3, 3)\n4\n['a', 'b', 'c']",
      hints: ["Konsep: list of dicts.", "Kolom = gabungan semua key.", "Hitung sel yang tidak punya nilai."],
      explanation: "3 baris × 3 kolom (a, b, c); 4 sel kosong.",
    },
    {
      id: "pd-create-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Submission",
      prompt: "File submission seharusnya hanya berisi kolom `id,pred`. Perbaiki baris penyimpanan.",
      starter: `import pandas as pd
sub = pd.DataFrame({"id": [101, 102], "pred": [45.2, 38.7]})
sub.to_csv("submission.csv")
isi = open("submission.csv").read()
print(isi)`,
      solution: `import pandas as pd
sub = pd.DataFrame({"id": [101, 102], "pred": [45.2, 38.7]})
sub.to_csv("submission.csv", index=False)
isi = open("submission.csv").read()
print(isi)`,
      tests: [{ desc: "Header file = id,pred", expr: "isi.splitlines()[0] == 'id,pred'" }],
      hints: ["Konsep: index ikut tersimpan.", "Ada parameter untuk mematikan penulisan index.", "`index=False`"],
      explanation: "Tanpa index=False, header menjadi `,id,pred`.",
    },
    {
      id: "pd-create-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Dari list of dicts",
      prompt: "Ubah `transaksi` menjadi DataFrame `df`, lalu tambahkan kolom `total` = `qty` × `harga`. Cetak `df` dan jumlah seluruh `total`.",
      starter: `import pandas as pd
transaksi = [
    {"produk": "Kopi", "qty": 2, "harga": 18000},
    {"produk": "Teh", "qty": 3, "harga": 12000},
    {"produk": "Jus", "qty": 1, "harga": 22000},
]
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
transaksi = [
    {"produk": "Kopi", "qty": 2, "harga": 18000},
    {"produk": "Teh", "qty": 3, "harga": 12000},
    {"produk": "Jus", "qty": 1, "harga": 22000},
]
df = pd.DataFrame(transaksi)
df["total"] = df["qty"] * df["harga"]
print(df)
print(df["total"].sum())`,
      tests: [
        { desc: "df 3 baris", expr: "len(df) == 3" },
        { desc: "Kolom total benar", expr: "df['total'].tolist() == [36000, 36000, 22000]" },
        { desc: "Mencetak 94000", expr: "_lines[-1] == '94000'" },
      ],
      hints: ["Konsep: list of dicts → DataFrame.", "`df = pd.DataFrame(transaksi)`", "`df[\"total\"] = df[\"qty\"] * df[\"harga\"]`"],
      explanation: "Kolom baru dihitung vectorized dari kolom yang ada.",
    },
    {
      id: "pd-create-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Tabel ringkasan per spesies",
      prompt: [
        "Baca `iris.csv`. Buat DataFrame `ringkas` dengan satu baris per spesies dan kolom `spesies`, `n`, `rata_petal` (rata-rata `petal_length`, 2 desimal).",
        "Bangun dengan list of dicts dan loop `for sp in df[\"species\"].unique():`. Cetak `ringkas`.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
baris = []
for sp in df["species"].unique():
    sub = df[df["species"] == sp]
    baris.append({"spesies": sp, "n": len(sub), "rata_petal": round(sub["petal_length"].mean(), 2)})
ringkas = pd.DataFrame(baris)
print(ringkas)`,
      tests: [
        { desc: "3 baris, kolom benar", expr: "ringkas.shape == (3, 3) and list(ringkas.columns) == ['spesies', 'n', 'rata_petal']" },
        { desc: "n = 50 per spesies", expr: "ringkas['n'].tolist() == [50, 50, 50]" },
        { desc: "rata_petal benar", expr: "ringkas.set_index('spesies')['rata_petal'].to_dict() == df.groupby('species')['petal_length'].mean().round(2).to_dict()" },
      ],
      hints: ["Konsep: membangun tabel baris demi baris.", "Kumpulkan dictionary di list, lalu `pd.DataFrame(baris)` sekali di akhir.", "Filter: `df[df[\"species\"] == sp]`."],
      explanation: "Pola \"kumpulkan list of dicts, lalu buat DataFrame\" sangat umum untuk menyusun tabel hasil eksperimen. Nanti `groupby` melakukannya dalam satu baris.",
    },
  ],
  quiz: [
    { id: "pd-create-q1", type: "mcq", prompt: "Pada `pd.DataFrame([{\"a\": 1}, {\"a\": 2}])`, setiap dictionary menjadi…", options: ["Satu kolom", "Satu baris", "Satu index", "Satu file"], answer: 1, explanation: "List of dicts: satu dict = satu baris." },
    { id: "pd-create-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3]}, index=["x", "y", "z"])\nprint(df.index.tolist())`, options: ["[0, 1, 2]", "['x', 'y', 'z']", "['a']", "[1, 2, 3]"], answer: 1, explanation: "Index kustom." },
    { id: "pd-create-q3", type: "tf", prompt: "`df.to_csv(\"f.csv\")` secara default ikut menyimpan index.", answer: true, explanation: "Gunakan index=False untuk mencegahnya." },
    { id: "pd-create-q4", type: "fill", prompt: "Agar teks berperilaku seperti file untuk read_csv, gunakan `io.____(teks)`", answer: ["StringIO"], explanation: "`io.StringIO`." },
    { id: "pd-create-q5", type: "case", prompt: "Model menghasilkan array `pred` (1000,) dan kamu punya `test[\"id\"]`. Cara membuat file submission?", options: ["np.save(pred)", "pd.DataFrame({\"id\": test[\"id\"], \"pred\": pred}).to_csv(\"submission.csv\", index=False)", "print(pred)", "pred.to_csv()"], answer: 1, explanation: "Bungkus dengan DataFrame lalu simpan tanpa index." },
  ],
  challenge: {
    id: "pd-create-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Submission dari sample_submission",
    prompt: [
      "Kompetisi biasanya memberi `sample_submission.csv` sebagai format. Diberikan teks `sample` (format) dan dictionary `prediksi` (id → nilai).",
      "1. Baca `sample` dengan `io.StringIO` ke `sub`.\n2. Isi kolom `pm25` dengan `sub[\"id\"].map(prediksi)`.\n3. Pastikan tidak ada NaN (`assert`), kolom dan urutan sama dengan sample.\n4. Simpan ke `submission.csv` tanpa index dan cetak isinya.",
    ],
    starter: `import io
import pandas as pd
sample = """id,pm25
2026-01-01,0
2026-01-02,0
2026-01-03,0"""
prediksi = {"2026-01-02": 38.4, "2026-01-01": 41.0, "2026-01-03": 47.9}
# Tulis kodemu di sini
`,
    solution: `import io
import pandas as pd
sample = """id,pm25
2026-01-01,0
2026-01-02,0
2026-01-03,0"""
prediksi = {"2026-01-02": 38.4, "2026-01-01": 41.0, "2026-01-03": 47.9}
sub = pd.read_csv(io.StringIO(sample))
sub["pm25"] = sub["id"].map(prediksi)
assert sub["pm25"].notna().all()
sub.to_csv("submission.csv", index=False)
print(open("submission.csv").read())`,
    tests: [
      { desc: "Kolom sama dengan sample", expr: "list(sub.columns) == ['id', 'pm25']" },
      { desc: "Urutan id sama dengan sample", expr: "sub['id'].tolist() == ['2026-01-01', '2026-01-02', '2026-01-03']" },
      { desc: "Nilai prediksi terpasang benar", expr: "sub['pm25'].tolist() == [41.0, 38.4, 47.9]" },
      { desc: "File tersimpan tanpa index", expr: "open('submission.csv').read().splitlines()[0] == 'id,pm25'" },
    ],
    hints: ["Konsep: memakai format resmi sebagai kerangka.", "`sub[\"id\"].map(prediksi)` mencocokkan berdasarkan id, bukan urutan.", "`assert sub[\"pm25\"].notna().all()` menjaga tidak ada id yang terlewat."],
    explanation: "Memakai sample_submission sebagai kerangka mencegah kesalahan format dan urutan — penyebab paling umum skor 0 di kompetisi.",
  },
  summary: [
    "DataFrame bisa dibuat dari dict of lists (per kolom), list of dicts (per baris), list of lists/array (dengan `columns=`).",
    "Key yang hilang di list of dicts → NaN.",
    "`io.StringIO` membuat teks bisa dibaca `read_csv`; `parse_dates` untuk tanggal.",
    "`to_csv(path, index=False)` untuk menyimpan.",
  ],
  cheatsheet: [
    { syntax: "pd.DataFrame({\"a\": [..]})", desc: "Per kolom" },
    { syntax: "pd.DataFrame([{...}, {...}])", desc: "Per baris" },
    { syntax: "pd.DataFrame(arr, columns=[..])", desc: "Dari array" },
    { syntax: "pd.read_csv(io.StringIO(teks))", desc: "Dari teks" },
    { syntax: "df.to_csv(\"f.csv\", index=False)", desc: "Simpan" },
  ],
  flashcards: [
    { q: "Buat DataFrame dari array arr dengan kolom x dan y", a: "pd.DataFrame(arr, columns=[\"x\", \"y\"])" },
    { q: "Simpan df ke submission.csv tanpa index", a: "df.to_csv(\"submission.csv\", index=False)" },
    { q: "Bentuk data per baris yang umum dari API", a: "List of dicts → pd.DataFrame(list_of_dicts)" },
  ],
  references: [
    pandasDoc("Intro to data structures — DataFrame (from dict, list of dicts, ndarray)", "user_guide/dsintro.html#dataframe"),
    pandasDoc("pandas.DataFrame.to_csv", "reference/api/pandas.DataFrame.to_csv.html"),
    pandasDoc("pandas.read_csv", "reference/api/pandas.read_csv.html"),
    { source: "Kaggle Learn", title: "Pandas — Creating, Reading and Writing", url: "https://www.kaggle.com/learn/pandas" },
  ],
};
