import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-columns",
  title: "df.columns",
  minutes: 25,
  prerequisites: ["pd-selecting-columns"],
  objectives: [
    "Membaca nama kolom dengan `df.columns` dan mengubahnya ke list.",
    "Mencari kolom dengan pola nama (`str.contains`, `str.startswith`) dan operasi himpunan.",
    "Mengatur ulang urutan kolom dan membersihkan nama kolom secara massal.",
    "Membandingkan kolom antar-DataFrame (train vs test).",
  ],
  definition: [
    "`df.columns` adalah objek **Index** berisi nama-nama kolom. Ia bisa diubah ke list (`.tolist()`), diiterasi, diperiksa keanggotaannya (`\"umur\" in df.columns`), dan punya accessor `.str` untuk operasi teks pada nama.",
    "Index kolom mendukung operasi himpunan: `difference`, `intersection`, `union` — berguna untuk membandingkan kolom dua tabel.",
    "Urutan kolom bisa diatur dengan memilih list nama: `df[[\"id\", \"tanggal\", \"pm25\"]]`, atau `df.reindex(columns=urutan)`.",
    "Nama kolom bisa diganti seluruhnya dengan `df.columns = [...]` atau dibersihkan dengan `df.columns.str.strip().str.lower()`.",
  ],
  why: [
    "Dataset nyata bisa punya puluhan sampai ratusan kolom. Memilih kolom dengan pola (semua `PAY_*`, semua kolom berawalan `cams_`) lebih aman dan cepat daripada mengetik manual.",
    "Kolom train dan test **harus** sama (kecuali target). Membandingkan `df.columns` mencegah error saat predict atau, lebih buruk, fitur yang tertukar urutannya.",
  ],
  when: [
    "- Melihat daftar kolom dataset baru.",
    "- Memilih kelompok kolom berdasarkan pola nama.",
    "- Menyamakan kolom train/test.",
    "- Mengurutkan kolom untuk laporan atau submission.",
  ],
  analogy: "`df.columns` seperti **daftar isi buku**: kamu bisa melihat semua bab, mencari bab yang judulnya mengandung kata tertentu, dan membandingkan daftar isi dua edisi untuk melihat bab mana yang baru atau hilang.",
  syntax: {
    code: `df.columns.tolist()
"umur" in df.columns
df.columns[df.columns.str.startswith("PAY_")]
train.columns.difference(test.columns)
df = df[["id", "tanggal", "pm25"]]          # urutkan ulang
df.columns = df.columns.str.strip().str.lower()`,
  },
  anatomy: [
    ["df.columns", "Index nama kolom."],
    ["columns.str.*", "Operasi teks pada nama."],
    ["difference / intersection", "Perbandingan himpunan kolom."],
    ["df[list_nama]", "Memilih & mengurutkan kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — Melihat dan memeriksa kolom",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.columns)
print(df.columns.tolist())
print("price_million" in df.columns, "harga" in df.columns)
print(len(df.columns), "kolom; kolom terakhir:", df.columns[-1])`,
      output: "Index(['house_id', 'city', 'area_m2', 'bedrooms', 'bathrooms', 'age_years',\n       'distance_to_center_km', 'price_million'],\n      dtype='str')\n['house_id', 'city', 'area_m2', 'bedrooms', 'bathrooms', 'age_years', 'distance_to_center_km', 'price_million']\nTrue False\n8 kolom; kolom terakhir: price_million",
      explain: [
        ["print(df.columns)", "Objek Index dengan dtype str."],
        ["\"price_million\" in df.columns", "Cek keberadaan kolom sebelum dipakai."],
        ["df.columns[-1]", "Indexing seperti list."],
      ],
    },
    {
      title: "Contoh 2 — Memilih kolom dengan pola",
      code: `import pandas as pd

df = pd.read_csv("credit_card_default.csv")
bill = df.columns[df.columns.str.startswith("BILL_AMT")]
pay_amt = [c for c in df.columns if c.startswith("PAY_AMT")]
mengandung_pay = df.columns[df.columns.str.contains("PAY")]
print(bill.tolist())
print(pay_amt)
print(len(mengandung_pay), "kolom mengandung 'PAY'")`,
      output: "['BILL_AMT1', 'BILL_AMT2', 'BILL_AMT3', 'BILL_AMT4', 'BILL_AMT5', 'BILL_AMT6']\n['PAY_AMT1', 'PAY_AMT2', 'PAY_AMT3', 'PAY_AMT4', 'PAY_AMT5', 'PAY_AMT6']\n12 kolom mengandung 'PAY'",
      explain: [
        ["df.columns.str.startswith(\"BILL_AMT\")", "Mask boolean pada nama kolom."],
        ["[c for c in df.columns if c.startswith(\"PAY_AMT\")]", "Cara alternatif dengan list comprehension."],
        ["df.columns.str.contains(\"PAY\")", "Mengandung teks — mencakup PAY_0..PAY_6 dan PAY_AMT1..6."],
      ],
      change: "Seleksi berdasarkan pola, bukan daftar manual.",
    },
    {
      title: "Contoh 3 — Membandingkan kolom train dan test",
      code: `import pandas as pd

train = pd.read_csv("house_prices.csv")
test = train.drop(columns="price_million").assign(promo=0)
print("Hanya di train:", train.columns.difference(test.columns).tolist())
print("Hanya di test :", test.columns.difference(train.columns).tolist())
print("Sama         :", train.columns.intersection(test.columns).tolist())

fitur = train.columns.intersection(test.columns).drop("house_id")
print("Fitur model  :", fitur.tolist())`,
      output: "Hanya di train: ['price_million']\nHanya di test : ['promo']\nSama         : ['house_id', 'city', 'area_m2', 'bedrooms', 'bathrooms', 'age_years', 'distance_to_center_km']\nFitur model  : ['city', 'area_m2', 'bedrooms', 'bathrooms', 'age_years', 'distance_to_center_km']",
      explain: [
        ["train.columns.difference(test.columns)", "Kolom yang tidak ada di test — biasanya target."],
        ["test.columns.difference(train.columns)", "Kolom baru di test — perlu dicari padanannya di train atau dibuang."],
        ["intersection(test.columns).drop(\"house_id\")", "Fitur = kolom bersama, tanpa ID."],
      ],
      change: "Membandingkan dua tabel.",
    },
    {
      title: "Contoh 4 — Mengurutkan dan membersihkan nama",
      code: `import pandas as pd

df = pd.DataFrame({" Total Charges": [800.5], "Customer ID ": ["C1"], "tenure-months": [12]})
print(df.columns.tolist())
df.columns = df.columns.str.strip().str.lower().str.replace(r"[\\s-]+", "_", regex=True)
print(df.columns.tolist())
urutan = ["customer_id", "tenure_months", "total_charges"]
df = df[urutan]
print(df)`,
      output: "[' Total Charges', 'Customer ID ', 'tenure-months']\n['total_charges', 'customer_id', 'tenure_months']\n  customer_id  tenure_months  total_charges\n0          C1             12          800.5",
      explain: [
        ["str.replace(r\"[\\s-]+\", \"_\", regex=True)", "Spasi atau tanda hubung (satu atau lebih) diganti garis bawah."],
        ["df = df[urutan]", "Urutan kolom mengikuti list."],
      ],
      change: "Nama dan urutan kolom dirapikan.",
    },
  ],
  params: [
    {
      title: "Operasi pada df.columns",
      items: [
        { name: ".tolist(), len(), in", desc: "Dasar." },
        { name: ".str.startswith/endswith/contains/replace/lower/strip", desc: "Operasi teks." },
        { name: ".difference(o), .intersection(o), .union(o)", desc: "Himpunan." },
        { name: ".get_loc(nama)", desc: "Posisi kolom." },
        { name: "df.reindex(columns=list, fill_value=0)", desc: "Urutkan & tambah kolom yang hilang." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\na = pd.DataFrame(columns=["id", "x1", "x2", "y"])\nb = pd.DataFrame(columns=["id", "x2", "x1"])\nprint(a.columns.difference(b.columns).tolist(), a.columns.str.startswith("x").sum())`, output: "['y'] 2" },
  tryIt: `import pandas as pd

df = pd.read_csv("student_performance.csv")
print(df.columns.tolist())
print([c for c in df.columns if c.endswith("edu")])
print(df.columns[df.columns.str.contains("job")].tolist())`,
  mistakes: [
    {
      title: "Mengakses kolom yang namanya ada spasi tersembunyi",
      wrong: `import pandas as pd
df = pd.DataFrame({"umur ": [21]})
print(df["umur"])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"umur ": [21]})
print(df.columns.tolist())
df.columns = df.columns.str.strip()
print(df["umur"].tolist())`,
      explain: "Cetak `df.columns.tolist()` untuk melihat spasi tersembunyi, lalu bersihkan.",
    },
    {
      title: "Urutan kolom test berbeda dengan train",
      wrong: `import numpy as np
from sklearn.linear_model import LinearRegression
import pandas as pd
train = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30], "y": [11, 22, 33]})
test = pd.DataFrame({"b": [40], "a": [4]})
m = LinearRegression().fit(train[["a", "b"]].to_numpy(), train["y"])
print(m.predict(test.to_numpy()).round(1))   # a dan b tertukar → prediksi salah`,
      fix: `from sklearn.linear_model import LinearRegression
import pandas as pd
train = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30], "y": [11, 22, 33]})
test = pd.DataFrame({"b": [40], "a": [4]})
fitur = ["a", "b"]
m = LinearRegression().fit(train[fitur], train["y"])
print(m.predict(test[fitur]).round(1))`,
      explain: "Saat memakai array, urutan kolom menentukan arti fitur. Selalu pilih kolom test dengan list fitur yang sama seperti train (`test[fitur]`).",
    },
    {
      title: "df.columns = list dengan panjang salah",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
df.columns = ["x"]`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
df.columns = ["x", "y"]
print(df.columns.tolist())`,
      explain: "Jumlah nama baru harus sama dengan jumlah kolom.",
    },
  ],
  bestPractices: [
    "Simpan daftar fitur dalam variabel (`FITUR = [...]`) dan pakai untuk train dan test.",
    "Bersihkan nama kolom sekali di awal.",
    "Gunakan `difference` untuk memeriksa kolom train vs test.",
    "Pilih kolom berpola dengan `str.startswith` daripada mengetik manual.",
  ],
  exercises: [
    {
      id: "load-cols-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Daftar kolom",
      prompt: "Lengkapi agar `kolom` berisi list nama kolom.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
kolom = df.columns.____()
print(kolom)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
kolom = df.columns.tolist()
print(kolom)`,
      tests: [{ desc: "list 5 kolom", expr: "type(kolom) is list and len(kolom) == 5" }],
      hints: ["Konsep: Index → list.", "Method \"to list\".", "`tolist()`"],
      explanation: "tolist() mengubah Index menjadi list Python.",
    },
    {
      id: "load-cols-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame(columns=["id", "cams_pm25", "cams_o3", "ispu_pm25", "target"])
print(df.columns[df.columns.str.startswith("cams_")].tolist())
print(df.columns.str.contains("pm25").sum())
print(df.columns.get_loc("target"))`,
      answer: "['cams_pm25', 'cams_o3']\n2\n4",
      hints: ["Konsep: pola nama kolom.", "Dua kolom berawalan cams_.", "Posisi dihitung dari 0."],
      explanation: "['cams_pm25', 'cams_o3']; 2; 4.",
    },
    {
      id: "load-cols-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Menyamakan urutan kolom test",
      prompt: "Kolom `test` berurutan berbeda dengan `fitur`. Perbaiki agar `X_test` memiliki kolom persis sama urutannya dengan `fitur`.",
      starter: `import pandas as pd
fitur = ["luas", "kamar", "umur"]
test = pd.DataFrame({"umur": [5], "luas": [120], "kamar": [3], "id": [9]})
X_test = test.drop(columns="id")
print(X_test.columns.tolist())`,
      solution: `import pandas as pd
fitur = ["luas", "kamar", "umur"]
test = pd.DataFrame({"umur": [5], "luas": [120], "kamar": [3], "id": [9]})
X_test = test[fitur]
print(X_test.columns.tolist())`,
      tests: [{ desc: "Urutan sama dengan fitur", expr: "X_test.columns.tolist() == fitur" }],
      hints: ["Konsep: memilih & mengurutkan kolom.", "Gunakan list fitur untuk seleksi.", "`test[fitur]`"],
      explanation: "Seleksi dengan list menentukan urutan kolom sekaligus membuang yang tidak perlu.",
    },
    {
      id: "load-cols-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Selaraskan kolom one-hot",
      prompt: "`X_train` dan `X_test` hasil one-hot punya kolom berbeda. Buat `X_test_aligned = X_test.reindex(columns=X_train.columns, fill_value=0)`. Cetak kolom yang hilang dari test sebelum disamakan (`difference`), dan `X_test_aligned`.",
      starter: `import pandas as pd
X_train = pd.DataFrame({"luas": [100, 80], "kota_Bandung": [0, 1], "kota_Jakarta": [1, 0]})
X_test = pd.DataFrame({"kota_Jakarta": [1], "luas": [90], "kota_Medan": [0]})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
X_train = pd.DataFrame({"luas": [100, 80], "kota_Bandung": [0, 1], "kota_Jakarta": [1, 0]})
X_test = pd.DataFrame({"kota_Jakarta": [1], "luas": [90], "kota_Medan": [0]})
print(X_train.columns.difference(X_test.columns).tolist())
X_test_aligned = X_test.reindex(columns=X_train.columns, fill_value=0)
print(X_test_aligned)`,
      tests: [
        { desc: "Kolom sama dengan train", expr: "X_test_aligned.columns.tolist() == X_train.columns.tolist()" },
        { desc: "Kolom hilang diisi 0", expr: "X_test_aligned['kota_Bandung'].tolist() == [0]" },
        { desc: "Kolom ekstra dibuang", expr: "'kota_Medan' not in X_test_aligned.columns" },
      ],
      hints: ["Konsep: reindex kolom.", "fill_value=0 untuk kategori yang tidak muncul.", "Kolom yang tidak ada di train otomatis dibuang."],
      explanation: "reindex menyamakan kolom test dengan train — kolom kategori baru di test diabaikan, kolom yang hilang diisi 0.",
    },
    {
      id: "load-cols-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Kelompok kolom Credit Card",
      prompt: [
        "Baca `credit_card_default.csv`. Buat dict `kelompok` berisi list kolom: `status` (diawali PAY_ tetapi bukan PAY_AMT), `tagihan` (diawali BILL_AMT), `bayar` (diawali PAY_AMT), `demografi` (SEX, EDUCATION, MARRIAGE, AGE), dan `lainnya` = kolom sisanya.",
        "Pastikan semua kolom masuk tepat satu kelompok (`assert`), lalu cetak jumlah kolom per kelompok.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
cols = df.columns
kelompok = {
    "status": [c for c in cols if c.startswith("PAY_") and not c.startswith("PAY_AMT")],
    "tagihan": cols[cols.str.startswith("BILL_AMT")].tolist(),
    "bayar": cols[cols.str.startswith("PAY_AMT")].tolist(),
    "demografi": ["SEX", "EDUCATION", "MARRIAGE", "AGE"],
}
terpakai = [c for v in kelompok.values() for c in v]
kelompok["lainnya"] = [c for c in cols if c not in terpakai]
semua = [c for v in kelompok.values() for c in v]
assert sorted(semua) == sorted(cols) and len(semua) == len(set(semua))
print({k: len(v) for k, v in kelompok.items()})`,
      tests: [
        { desc: "Jumlah per kelompok", expr: "{k: len(v) for k, v in kelompok.items()} == {'status': 6, 'tagihan': 6, 'bayar': 6, 'demografi': 4, 'lainnya': 3}" },
        { desc: "lainnya benar", expr: "kelompok['lainnya'] == ['ID', 'LIMIT_BAL', 'default payment next month']" },
      ],
      hints: ["Konsep: partisi kolom berdasarkan pola.", "Kumpulkan kolom yang sudah terpakai.", "Sisanya = lainnya; cek tidak ada duplikat."],
      explanation: "Mengelompokkan kolom memudahkan feature engineering per kelompok (misalnya rata-rata tagihan, total pembayaran, jumlah bulan terlambat).",
    },
  ],
  quiz: [
    { id: "load-cols-q1", type: "mcq", prompt: "Cara mengecek apakah kolom \"umur\" ada di df?", options: ["df.has(\"umur\")", "\"umur\" in df.columns", "df[\"umur\"].exists()", "df.umur is None"], answer: 1, explanation: "Operator in pada df.columns." },
    { id: "load-cols-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame(columns=["a", "b", "c"])\nprint(df.columns.difference(["b"]).tolist())`, options: ["['b']", "['a', 'c']", "['a', 'b', 'c']", "[]"], answer: 1, explanation: "Semua kecuali b." },
    { id: "load-cols-q3", type: "tf", prompt: "Urutan kolom tidak berpengaruh jika model dilatih dengan array NumPy.", answer: false, explanation: "Dengan array, posisi kolom menentukan fitur." },
    { id: "load-cols-q4", type: "fill", prompt: "Menyamakan kolom test dengan train: `X_test.____(columns=X_train.columns, fill_value=0)`", answer: ["reindex"], explanation: "reindex." },
    { id: "load-cols-q5", type: "case", prompt: "Dataset berisi 150 kolom sensor berawalan `s_`. Cara paling aman memilih semuanya?", options: ["Ketik 150 nama", "df.loc[:, df.columns.str.startswith(\"s_\")]", "df.iloc[:, :150]", "df.head(150)"], answer: 1, explanation: "Seleksi berdasarkan pola nama." },
  ],
  challenge: {
    id: "load-cols-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Laporan perbedaan skema",
    prompt: [
      "Tulis fungsi `beda_skema(a, b)` yang mengembalikan dict:",
      "- `hanya_a`, `hanya_b`: list kolom (terurut)\n- `beda_tipe`: dict `{kolom: (dtype_a, dtype_b)}` untuk kolom bersama yang dtype-nya berbeda (sebagai teks)\n- `urutan_sama`: apakah urutan kolom bersama di a dan b sama",
      "Uji pada `train` dan `test` di starter dan cetak hasilnya.",
    ],
    starter: `import pandas as pd
train = pd.DataFrame({"id": [1], "tanggal": pd.to_datetime(["2025-01-01"]), "suhu": [28.5], "libur": [0], "pm25": [55.0]})
test = pd.DataFrame({"id": [2], "libur": [False], "tanggal": ["2026-01-01"], "suhu": [27.9], "event": ["tahun baru"]})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
train = pd.DataFrame({"id": [1], "tanggal": pd.to_datetime(["2025-01-01"]), "suhu": [28.5], "libur": [0], "pm25": [55.0]})
test = pd.DataFrame({"id": [2], "libur": [False], "tanggal": ["2026-01-01"], "suhu": [27.9], "event": ["tahun baru"]})

def beda_skema(a, b):
    bersama = [c for c in a.columns if c in b.columns]
    return {
        "hanya_a": sorted(a.columns.difference(b.columns)),
        "hanya_b": sorted(b.columns.difference(a.columns)),
        "beda_tipe": {c: (str(a[c].dtype), str(b[c].dtype)) for c in bersama if str(a[c].dtype) != str(b[c].dtype)},
        "urutan_sama": bersama == [c for c in b.columns if c in a.columns],
    }

for k, v in beda_skema(train, test).items():
    print(k, ":", v)`,
    tests: [
      { desc: "hanya_a & hanya_b", expr: "beda_skema(train, test)['hanya_a'] == ['pm25'] and beda_skema(train, test)['hanya_b'] == ['event']" },
      { desc: "beda_tipe benar", expr: "set(beda_skema(train, test)['beda_tipe']) == {'tanggal', 'libur'} and beda_skema(train, test)['beda_tipe']['libur'] == ('int64', 'bool')" },
      { desc: "urutan_sama False", expr: "beda_skema(train, test)['urutan_sama'] is False" },
      { desc: "Skema identik", expr: "beda_skema(train, train) == {'hanya_a': [], 'hanya_b': [], 'beda_tipe': {}, 'urutan_sama': True}" },
    ],
    hints: ["Konsep: membandingkan nama, tipe, dan urutan kolom.", "difference untuk nama; dict comprehension untuk tipe.", "Bandingkan urutan kolom bersama di kedua tabel."],
    explanation: "Perbedaan tipe (tanggal teks vs datetime, libur bool vs int) sering muncul antara train dan test dari sumber berbeda — laporan ini menemukannya sebelum model gagal.",
  },
  summary: [
    "`df.columns` = Index nama kolom; `.tolist()`, `in`, indexing.",
    "`.str.*` untuk mencari/membersihkan nama; difference/intersection untuk membandingkan tabel.",
    "`df[list]` memilih dan mengurutkan; `reindex(columns=..., fill_value=0)` menyamakan skema.",
    "Gunakan daftar fitur yang sama untuk train dan test.",
  ],
  cheatsheet: [
    { syntax: "df.columns.tolist()", desc: "List kolom" },
    { syntax: "df.columns[df.columns.str.startswith(\"x\")]", desc: "Pola nama" },
    { syntax: "a.columns.difference(b.columns)", desc: "Kolom hanya di a" },
    { syntax: "test[fitur]", desc: "Urutan sama dengan train" },
    { syntax: "X_test.reindex(columns=X_train.columns, fill_value=0)", desc: "Samakan skema" },
  ],
  flashcards: [
    { q: "Kolom yang ada di train tetapi tidak di test", a: "train.columns.difference(test.columns)" },
    { q: "Pilih semua kolom berawalan BILL_", a: "df.loc[:, df.columns.str.startswith(\"BILL_\")]" },
    { q: "Samakan kolom test dengan train", a: "X_test.reindex(columns=X_train.columns, fill_value=0)" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.columns", "reference/api/pandas.DataFrame.columns.html"),
    pandasDoc("pandas.Index.difference", "reference/api/pandas.Index.difference.html"),
    pandasDoc("pandas.DataFrame.reindex", "reference/api/pandas.DataFrame.reindex.html"),
    pandasDoc("Working with text data — method summary (str accessor)", "user_guide/text.html#method-summary"),
  ],
};
