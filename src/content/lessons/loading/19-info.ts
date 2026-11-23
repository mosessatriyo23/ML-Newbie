import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-info",
  title: "df.info()",
  minutes: 25,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Membaca setiap bagian output `df.info()`: RangeIndex, Non-Null Count, Dtype, dan memory usage.",
    "Menemukan kolom dengan missing value dan tipe yang salah dari info.",
    "Menghitung pemakaian memori sebenarnya dengan `memory_usage=\"deep\"`.",
    "Mengubah informasi info menjadi tabel yang bisa diproses kode.",
  ],
  definition: [
    "`df.info()` mencetak **ringkasan struktur** DataFrame:\n- jenis index dan jumlah entri (`RangeIndex: 403 entries, 0 to 402`)\n- untuk setiap kolom: nomor, nama, **Non-Null Count** (jumlah nilai terisi), dan **Dtype**\n- rekap jumlah kolom per dtype\n- perkiraan **memory usage**",
    "Jika Non-Null Count sebuah kolom lebih kecil dari jumlah entri, kolom itu punya **missing value**: missing = entri − non-null.",
    "info mencetak langsung dan **mengembalikan None** — jangan dibungkus print. `memory_usage=\"deep\"` menghitung memori teks secara akurat (default hanya perkiraan untuk kolom teks, ditandai `+`).",
    "Untuk diproses kode, gunakan padanannya: `df.notna().sum()` (non-null), `df.dtypes`, dan `df.memory_usage(deep=True)`.",
  ],
  why: [
    "info adalah \"pemeriksaan kesehatan\" pertama: dalam satu tampilan terlihat ukuran data, kolom yang bolong, dan kolom yang tipenya mencurigakan (misalnya angka bertipe str).",
    "Untuk dataset besar, informasi memori membantu memutuskan optimasi tipe (category, int32) sebelum memori habis.",
  ],
  when: [
    "- Tepat setelah memuat data (bersama head).",
    "- Setelah merge/feature engineering untuk melihat kolom baru dan missing baru.",
    "- Saat data terasa berat/lambat.",
  ],
  analogy: "info seperti **hasil medical check-up singkat**: tinggi-berat (jumlah baris/kolom), golongan darah setiap organ (dtype), dan catatan bagian yang perlu perhatian (Non-Null Count rendah).",
  syntax: {
    code: `df.info()                          # ringkasan
df.info(memory_usage="deep")       # memori akurat
df.info(show_counts=True)          # paksa tampilkan non-null count
df.notna().sum()                   # non-null per kolom (Series)
df.memory_usage(deep=True).sum()   # total byte`,
  },
  anatomy: [
    ["RangeIndex: n entries", "Jumlah baris."],
    ["Non-Null Count", "Nilai terisi per kolom."],
    ["Dtype", "Tipe data kolom."],
    ["memory usage", "Perkiraan memori (\"+\" = belum akurat untuk teks)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membaca output info",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
df.info()`,
      output: "<class 'pandas.DataFrame'>\nRangeIndex: 403 entries, 0 to 402\nData columns (total 10 columns):\n #   Column            Non-Null Count  Dtype  \n---  ------            --------------  -----  \n 0   customer_id       403 non-null    str    \n 1   gender            403 non-null    str    \n 2   age               398 non-null    float64\n 3   tenure_months     403 non-null    int64  \n 4   contract          403 non-null    str    \n 5   internet_service  403 non-null    str    \n 6   monthly_charges   403 non-null    float64\n 7   support_tickets   403 non-null    int64  \n 8   churn             403 non-null    int64  \n 9   total_charges     396 non-null    float64\ndtypes: float64(3), int64(3), str(4)\nmemory usage: 25.3 KB",
      explain: [
        ["df.info()", "403 entries; age 398 non-null (5 missing), total_charges 396 non-null (7 missing); 4 kolom str, 3 float64, 3 int64."],
      ],
    },
    {
      title: "Contoh 2 — Dari info ke angka missing",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
non_null = df.notna().sum()
missing = len(df) - non_null
print(missing[missing > 0])
print((missing[missing > 0] / len(df) * 100).round(2).astype(str) + "%")`,
      output: "age              5\ntotal_charges    7\ndtype: int64\nage              1.24%\ntotal_charges    1.74%\ndtype: str",
      explain: [
        ["df.notna().sum()", "Angka yang sama dengan kolom Non-Null Count di info."],
        ["len(df) - non_null", "Missing = entri − non-null."],
        ["missing[missing > 0] / len(df) * 100", "Persentase missing per kolom."],
      ],
      change: "Informasi info diubah menjadi Series yang bisa diproses.",
    },
    {
      title: "Contoh 3 — Tipe mencurigakan terlihat di info",
      code: `import io
import pandas as pd

teks = """tanggal,pm25,suhu,stasiun
2025-01-01,55.2,28.1,DKI1
2025-01-02,?,27.9,DKI1
2025-01-03,47.0,29.3,DKI2"""
df = pd.read_csv(io.StringIO(teks))
df.info()
df = pd.read_csv(io.StringIO(teks), na_values=["?"], parse_dates=["tanggal"])
df.info()`,
      output: "<class 'pandas.DataFrame'>\nRangeIndex: 3 entries, 0 to 2\nData columns (total 4 columns):\n #   Column   Non-Null Count  Dtype  \n---  ------   --------------  -----  \n 0   tanggal  3 non-null      str    \n 1   pm25     3 non-null      str    \n 2   suhu     3 non-null      float64\n 3   stasiun  3 non-null      str    \ndtypes: float64(1), str(3)\nmemory usage: 132.0 bytes\n<class 'pandas.DataFrame'>\nRangeIndex: 3 entries, 0 to 2\nData columns (total 4 columns):\n #   Column   Non-Null Count  Dtype         \n---  ------   --------------  -----         \n 0   tanggal  3 non-null      datetime64[us]\n 1   pm25     2 non-null      float64       \n 2   suhu     3 non-null      float64       \n 3   stasiun  3 non-null      str           \ndtypes: datetime64[us](1), float64(2), str(1)\nmemory usage: 156.0 bytes",
      explain: [
        ["df.info()", "Pembacaan pertama: pm25 bertipe str (karena \"?\") dan tanggal juga str."],
        ["na_values=[\"?\"], parse_dates=[\"tanggal\"]", "Setelah diperbaiki: pm25 float64 dengan 2 non-null, tanggal datetime64."],
      ],
      change: "info dipakai untuk mendeteksi dan memverifikasi perbaikan tipe.",
    },
    {
      title: "Contoh 4 — Memori dan optimasi tipe",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
sebelum = df.memory_usage(deep=True).sum() / 1024 ** 2
for c in df.select_dtypes(include="str").columns:
    df[c] = df[c].astype("category")
sesudah = df.memory_usage(deep=True).sum() / 1024 ** 2
print(f"{sebelum:.2f} MB → {sesudah:.2f} MB")
df.info(memory_usage="deep")`,
      output: "10.92 MB → 1.77 MB\n<class 'pandas.DataFrame'>\nRangeIndex: 32561 entries, 0 to 32560\nData columns (total 15 columns):\n #   Column          Non-Null Count  Dtype   \n---  ------          --------------  -----   \n 0   age             32561 non-null  int64   \n 1   workclass       30725 non-null  category\n 2   fnlwgt          32561 non-null  int64   \n 3   education       32561 non-null  category\n 4   education_num   32561 non-null  int64   \n 5   marital_status  32561 non-null  category\n 6   occupation      30718 non-null  category\n 7   relationship    32561 non-null  category\n 8   race            32561 non-null  category\n 9   sex             32561 non-null  category\n 10  capital_gain    32561 non-null  int64   \n 11  capital_loss    32561 non-null  int64   \n 12  hours_per_week  32561 non-null  int64   \n 13  native_country  31978 non-null  category\n 14  income          32561 non-null  category\ndtypes: category(9), int64(6)\nmemory usage: 1.8 MB",
      explain: [
        ["memory_usage(deep=True)", "Memori sebenarnya termasuk isi teks."],
        ["astype(\"category\")", "Kolom teks berulang disimpan sebagai kode integer + daftar kategori."],
        ["df.info(memory_usage=\"deep\")", "Dtype kini category dan memori jauh lebih kecil."],
      ],
      change: "info dipakai untuk memantau memori.",
    },
  ],
  params: [
    {
      title: "df.info()",
      items: [
        { name: "verbose=None", desc: "True: tampilkan semua kolom; False: ringkas." },
        { name: "show_counts=None", desc: "Tampilkan Non-Null Count (otomatis dimatikan untuk data sangat lebar)." },
        { name: "memory_usage=None", desc: "\"deep\" untuk perhitungan akurat." },
        { name: "max_cols=None", desc: "Batas kolom sebelum ringkasan." },
        { name: "buf=None", desc: "Tulis ke objek file (misalnya io.StringIO) alih-alih layar." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\nimport numpy as np\ndf = pd.DataFrame({"a": [1, np.nan, 3], "b": ["x", "y", None]})\nprint(df.notna().sum().to_dict(), df.dtypes.astype(str).to_dict())`, output: "{'a': 2, 'b': 2} {'a': 'float64', 'b': 'str'}" },
  tryIt: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")
df.info()
# Kolom mana yang punya missing? Tipe apa yang perlu diubah?`,
  mistakes: [
    {
      title: "print(df.info())",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.info())   # ringkasan lalu "None"`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1]})
df.info()`,
      explain: "info mencetak sendiri dan mengembalikan None.",
    },
    {
      title: "Menyimpan hasil info ke variabel",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, None]})
ringkas = df.info()
print(ringkas["a"])`,
      error: "TypeError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, None]})
ringkas = df.notna().sum()
print(ringkas["a"])`,
      explain: "Hasil info adalah None. Untuk angka gunakan `df.notna().sum()`, `df.dtypes`, `df.isna().sum()`.",
    },
    {
      title: "Mengabaikan tanda + pada memory usage",
      wrong: `import pandas as pd
df = pd.read_csv("adult_income.csv")
df.info(verbose=False)   # memory usage: ... + (belum termasuk isi teks)`,
      fix: `import pandas as pd
df = pd.read_csv("adult_income.csv")
df.info(verbose=False, memory_usage="deep")`,
      explain: "Tanda \"+\" berarti memori kolom teks belum dihitung penuh. Gunakan memory_usage=\"deep\" untuk angka sebenarnya.",
    },
  ],
  bestPractices: [
    "Jalankan `df.info()` setelah memuat data dan setelah setiap merge.",
    "Bandingkan Non-Null Count dengan jumlah entri untuk menemukan missing.",
    "Waspadai kolom angka bertipe str — tanda ada teks pengganggu.",
    "Gunakan `memory_usage=\"deep\"` untuk data besar.",
  ],
  exercises: [
    {
      id: "load-info-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Non-null per kolom",
      prompt: "Lengkapi agar `isi` berisi jumlah nilai terisi per kolom (sama dengan Non-Null Count di info).",
      starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
isi = df.____().sum()
print(isi)`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
isi = df.notna().sum()
print(isi)`,
      tests: [{ desc: "horsepower 392 terisi", expr: "isi['horsepower'] == 392 and isi['mpg'] == 398" }],
      hints: ["Konsep: kebalikan isna.", "not + na.", "`notna()`"],
      explanation: "notna().sum() = Non-Null Count.",
    },
    {
      id: "load-info-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Berdasarkan info berikut, tulis output kode Python di bawahnya.",
      code: `import numpy as np
import pandas as pd
df = pd.DataFrame({"a": [1, 2, np.nan, 4], "b": ["x", None, None, "y"], "c": [1, 2, 3, 4]})
print(len(df) - df.notna().sum())
print(df.dtypes.astype(str).tolist())`,
      answer: "a    1\nb    2\nc    0\ndtype: int64\n['float64', 'str', 'int64']",
      hints: ["Konsep: missing = entri − non-null.", "a 1 missing, b 2, c 0.", "a menjadi float karena NaN."],
      explanation: "a 1, b 2, c 0; ['float64', 'str', 'int64'].",
    },
    {
      id: "load-info-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Hasil info",
      prompt: "Kode error karena hasil info disimpan ke variabel. Perbaiki agar `missing` berisi jumlah missing per kolom.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
ringkas = df.info()
missing = len(df) - ringkas
print(missing)`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
df.info()
missing = df.isna().sum()
print(missing)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "missing benar", expr: "missing['age'] == 5 and missing['total_charges'] == 7" },
      ],
      hints: ["Konsep: info mengembalikan None.", "Gunakan isna().sum() untuk angka.", "Panggil info tanpa disimpan."],
      explanation: "Pisahkan tampilan (info) dan perhitungan (isna().sum()).",
    },
    {
      id: "load-info-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — info sebagai DataFrame",
      prompt: "Tulis fungsi `info_tabel(df)` yang mengembalikan DataFrame berindeks nama kolom dengan kolom `non_null`, `missing`, `dtype` (teks), dan `memori_kb` (deep, 1 desimal). Uji pada `heart_disease.csv` dan cetak baris yang `missing > 0`.",
      starter: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("heart_disease.csv")

def info_tabel(df):
    return pd.DataFrame({
        "non_null": df.notna().sum(),
        "missing": df.isna().sum(),
        "dtype": df.dtypes.astype(str),
        "memori_kb": (df.memory_usage(deep=True, index=False) / 1024).round(1),
    })

t = info_tabel(df)
print(t[t["missing"] > 0])`,
      tests: [
        { desc: "Index = kolom", expr: "info_tabel(df).index.tolist() == df.columns.tolist()" },
        { desc: "Kolom tabel", expr: "info_tabel(df).columns.tolist() == ['non_null', 'missing', 'dtype', 'memori_kb']" },
        { desc: "Missing ca & thal", expr: "info_tabel(df).query('missing > 0').index.tolist() == ['ca', 'thal'] and (info_tabel(df)['non_null'] + info_tabel(df)['missing'] == len(df)).all()" },
      ],
      hints: ["Konsep: padanan info yang bisa diproses.", "Gabungkan Series berindeks nama kolom.", "`memory_usage(deep=True, index=False)` agar tidak ada baris Index."],
      explanation: "Versi tabel dari info bisa difilter, diurutkan, dan disimpan sebagai laporan.",
    },
    {
      id: "load-info-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pemeriksaan kesehatan Auto MPG",
      prompt: [
        "Baca `auto_mpg.csv`, jalankan `df.info()`. Dari informasinya, buat dict `temuan` dengan kunci `n_baris`, `kolom_missing` (list), `kolom_teks` (list), dan `memori_mb` (deep, 3 desimal).",
        "Cetak `temuan`.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
df.info()
temuan = {
    "n_baris": len(df),
    "kolom_missing": df.columns[df.isna().any()].tolist(),
    "kolom_teks": df.select_dtypes(include="str").columns.tolist(),
    "memori_mb": round(df.memory_usage(deep=True).sum() / 1024 ** 2, 3),
}
print(temuan)`,
      tests: [
        { desc: "Isi temuan", expr: "temuan['n_baris'] == 398 and temuan['kolom_missing'] == ['horsepower'] and temuan['kolom_teks'] == ['car_name']" },
        { desc: "Memori benar", expr: "temuan['memori_mb'] == round(df.memory_usage(deep=True).sum() / 1024 ** 2, 3)" },
      ],
      hints: ["Konsep: menerjemahkan info ke data.", "`df.columns[df.isna().any()]`", "select_dtypes(include=\"str\")."],
      explanation: "horsepower adalah satu-satunya kolom dengan missing value — 6 mobil (di file asli UCI ditulis \"?\").",
    },
  ],
  quiz: [
    { id: "load-info-q1", type: "mcq", prompt: "Di output info, kolom dengan missing value dikenali dari…", options: ["Dtype object", "Non-Null Count lebih kecil dari jumlah entri", "memory usage besar", "Nama kolom"], answer: 1, explanation: "Non-null < entries." },
    { id: "load-info-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(pd.DataFrame({"a": [1]}).info() is None)`, options: ["False", "<class 'pandas.DataFrame'>\nRangeIndex: 1 entries, 0 to 0\nData columns (total 1 columns):\n #   Column  Non-Null Count  Dtype\n---  ------  --------------  -----\n 0   a       1 non-null      int64\ndtypes: int64(1)\nmemory usage: 80.0 bytes\nTrue", "Error", "None"], answer: 1, explanation: "info mencetak ringkasan lalu mengembalikan None → True." },
    { id: "load-info-q3", type: "tf", prompt: "Tanda \"+\" pada memory usage berarti memori sebenarnya bisa lebih besar.", answer: true, explanation: "Kolom teks belum dihitung penuh." },
    { id: "load-info-q4", type: "fill", prompt: "Memori akurat: `df.info(memory_usage=\"____\")`", answer: ["deep"], explanation: "deep." },
    { id: "load-info-q5", type: "case", prompt: "info menunjukkan kolom `harga` bertipe str padahal berisi angka. Kemungkinan penyebab?", options: ["pandas error", "Ada teks pengganggu seperti \"?\", \"Rp\", atau koma ribuan", "Kolom terlalu panjang", "Memori penuh"], answer: 1, explanation: "Satu nilai non-angka membuat seluruh kolom teks." },
  ],
  challenge: {
    id: "load-info-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Menangkap output info sebagai teks",
    prompt: [
      "Kadang ringkasan info perlu disimpan ke file laporan. Gunakan `buf = io.StringIO()` lalu `df.info(buf=buf)` untuk menangkap teksnya.",
      "Tulis fungsi `simpan_info(df, path)` yang menulis teks info ke file `path` dan mengembalikan jumlah baris teks. Uji pada `customer_churn.csv` → `info_churn.txt`, cetak jumlah baris dan baris yang mengandung \"non-null\" untuk kolom `age`.",
    ],
    starter: `import io
import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
    solution: `import io
import pandas as pd
df = pd.read_csv("customer_churn.csv")

def simpan_info(df, path):
    buf = io.StringIO()
    df.info(buf=buf)
    teks = buf.getvalue()
    with open(path, "w") as f:
        f.write(teks)
    return len(teks.splitlines())

n = simpan_info(df, "info_churn.txt")
print(n)
baris_age = [b for b in open("info_churn.txt").read().splitlines() if " age " in b]
print(baris_age[0].split())`,
    tests: [
      { desc: "File dibuat", expr: "'non-null' in open('info_churn.txt').read() and 'RangeIndex: 403 entries' in open('info_churn.txt').read()" },
      { desc: "Jumlah baris dikembalikan", expr: "simpan_info(df, 'info_churn.txt') == len(open('info_churn.txt').read().splitlines())" },
      { desc: "Baris age benar", expr: "baris_age[0].split()[1:4] == ['age', '398', 'non-null']" },
    ],
    hints: ["Konsep: parameter buf pada info.", "`buf.getvalue()` mengambil teks.", "Tulis dengan open(path, \"w\")."],
    explanation: "Menyimpan info ke file berguna untuk dokumentasi otomatis setiap versi dataset yang diterima tim.",
  },
  summary: [
    "`df.info()` = entri, Non-Null Count, Dtype per kolom, rekap dtype, memori.",
    "Missing = entri − non-null; tipe salah terlihat dari Dtype.",
    "info mengembalikan None; untuk angka gunakan notna().sum(), dtypes, memory_usage().",
    "`memory_usage=\"deep\"` untuk memori akurat; `buf=` untuk menangkap teks.",
  ],
  cheatsheet: [
    { syntax: "df.info()", desc: "Ringkasan struktur" },
    { syntax: "df.info(memory_usage=\"deep\")", desc: "Memori akurat" },
    { syntax: "df.notna().sum()", desc: "Non-null count" },
    { syntax: "len(df) - df.notna().sum()", desc: "Missing" },
    { syntax: "df.info(buf=io.StringIO())", desc: "Tangkap sebagai teks" },
  ],
  flashcards: [
    { q: "Apa yang dikembalikan df.info()?", a: "None — ringkasannya hanya dicetak" },
    { q: "Hitung missing dari informasi info", a: "len(df) - df.notna().sum()" },
    { q: "Arti tanda + pada memory usage", a: "Memori kolom teks belum dihitung penuh (gunakan deep)" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.info", "reference/api/pandas.DataFrame.info.html"),
    pandasDoc("pandas.DataFrame.memory_usage", "reference/api/pandas.DataFrame.memory_usage.html"),
    pandasDoc("Getting started — How do I read and write tabular data? (info)", "getting_started/intro_tutorials/02_read_write.html"),
    pandasDoc("Scaling to large datasets — Use efficient datatypes", "user_guide/scale.html#use-efficient-datatypes"),
  ],
};
