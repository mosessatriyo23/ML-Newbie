import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-dtypes",
  title: "df.dtypes",
  minutes: 30,
  prerequisites: ["load-df-info", "np-array-data-types"],
  objectives: [
    "Membaca tipe setiap kolom dengan `df.dtypes` dan mengenal dtype utama pandas.",
    "Mengonversi tipe dengan `astype`, `pd.to_numeric`, `pd.to_datetime`, dan `category`.",
    "Memahami tipe yang mendukung missing value (nullable `Int64`, `boolean`) dan dtype `str` pandas 3.",
    "Mengelompokkan kolom berdasarkan tipe untuk preprocessing.",
  ],
  definition: [
    "`df.dtypes` adalah Series berisi **tipe data** setiap kolom. Dtype utama:\n- `int64`, `float64` — angka (NumPy)\n- `bool` — True/False\n- `str` — teks (default pandas 3; versi lama memakai `object`)\n- `datetime64[ns]` / `datetime64[us]` — tanggal & waktu\n- `category` — kategori dengan jumlah nilai unik terbatas\n- nullable: `Int64` (I besar), `Float64`, `boolean` — angka/boolean yang bisa menyimpan missing (`<NA>`) tanpa berubah menjadi float",
    "Kolom integer yang mengandung NaN otomatis menjadi `float64` karena NaN adalah float. Jika ingin tetap bilangan bulat, gunakan `Int64`.",
    "Konversi: `astype(tipe)` untuk konversi langsung; `pd.to_numeric(..., errors=\"coerce\")` dan `pd.to_datetime(..., errors=\"coerce\", format=...)` untuk data kotor.",
  ],
  why: [
    "Tipe menentukan operasi yang mungkin: tanggal teks tidak bisa memakai `.dt`, angka teks tidak bisa dirata-rata, kategori nominal tidak boleh di-scaling.",
    "Preprocessing scikit-learn (`ColumnTransformer`) biasanya memisahkan kolom numerik dan kategori berdasarkan dtype — tipe yang salah membuat kolom masuk ke pipeline yang salah.",
  ],
  when: [
    "- Setelah memuat data.",
    "- Sebelum memilih preprocessing per kolom.",
    "- Saat operasi gagal karena tipe (TypeError, AttributeError .dt).",
    "- Mengoptimalkan memori.",
  ],
  analogy: "dtype seperti **label jenis wadah**: wadah \"cairan\" (float) bisa dituang dan diukur, wadah \"berkas\" (str) hanya bisa dibaca, wadah \"kalender\" (datetime) bisa dihitung selisih harinya. Salah label → alat yang salah dipakai.",
  syntax: {
    code: `df.dtypes
df["umur"] = df["umur"].astype("Int64")
df["harga"] = pd.to_numeric(df["harga"], errors="coerce")
df["tanggal"] = pd.to_datetime(df["tanggal"], format="%Y-%m-%d")
df["kota"] = df["kota"].astype("category")
df.select_dtypes(include=["number"]).columns`,
  },
  anatomy: [
    ["df.dtypes", "Series tipe per kolom."],
    ["astype(\"Int64\")", "Integer nullable."],
    ["to_datetime(format=...)", "Teks → tanggal dengan format eksplisit."],
    ["select_dtypes(include=...)", "Pilih kolom berdasarkan tipe."],
  ],
  examples: [
    {
      title: "Contoh 1 — dtypes dataset nyata",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
print(df.dtypes)
print(df.dtypes.value_counts())`,
      output: "age               int64\nworkclass           str\nfnlwgt            int64\neducation           str\neducation_num     int64\nmarital_status      str\noccupation          str\nrelationship        str\nrace                str\nsex                 str\ncapital_gain      int64\ncapital_loss      int64\nhours_per_week    int64\nnative_country      str\nincome              str\ndtype: object\nstr      9\nint64    6\nName: count, dtype: int64",
      explain: [
        ["df.dtypes", "Tipe setiap kolom: int64 untuk angka, str untuk teks."],
        ["df.dtypes.value_counts()", "Rekap jumlah kolom per tipe."],
      ],
    },
    {
      title: "Contoh 2 — Integer dengan missing value",
      code: `import numpy as np
import pandas as pd

s = pd.Series([3, 1, np.nan, 2])
print(s.dtype, s.tolist())
s_int = s.astype("Int64")
print(s_int.dtype, s_int.tolist())
print(s_int.sum(), s_int.isna().sum())`,
      output: "float64 [3.0, 1.0, nan, 2.0]\nInt64 [3, 1, <NA>, 2]\n6 1",
      explain: [
        ["pd.Series([3, 1, np.nan, 2])", "Ada NaN → menjadi float64 (3.0, 1.0, …)."],
        ["astype(\"Int64\")", "Nullable integer: tetap bilangan bulat, missing ditampilkan <NA>."],
        ["s_int.sum()", "Operasi tetap berjalan dan mengabaikan <NA>."],
      ],
      change: "Tipe nullable untuk integer yang bolong.",
    },
    {
      title: "Contoh 3 — Konversi tipe yang umum",
      code: `import pandas as pd

df = pd.DataFrame({
    "tanggal": ["01/01/2026", "02/01/2026", "03/01/2026"],
    "jumlah": ["10", "15", "x"],
    "aktif": ["ya", "tidak", "ya"],
    "kota": ["Bogor", "Depok", "Bogor"],
})
print(df.dtypes.astype(str).to_dict())

df["tanggal"] = pd.to_datetime(df["tanggal"], format="%d/%m/%Y")
df["jumlah"] = pd.to_numeric(df["jumlah"], errors="coerce").astype("Int64")
df["aktif"] = df["aktif"].map({"ya": True, "tidak": False})
df["kota"] = df["kota"].astype("category")
print(df.dtypes.astype(str).to_dict())
print(df)`,
      output: "{'tanggal': 'str', 'jumlah': 'str', 'aktif': 'str', 'kota': 'str'}\n{'tanggal': 'datetime64[us]', 'jumlah': 'Int64', 'aktif': 'bool', 'kota': 'category'}\n     tanggal  jumlah  aktif   kota\n0 2026-01-01      10   True  Bogor\n1 2026-01-02      15  False  Depok\n2 2026-01-03    <NA>   True  Bogor",
      explain: [
        ["pd.to_datetime(df[\"tanggal\"], format=\"%d/%m/%Y\")", "Format eksplisit: hari/bulan/tahun (format Indonesia) — mencegah 02/01 dibaca 1 Februari."],
        ["errors=\"coerce\").astype(\"Int64\")", "\"x\" menjadi <NA>, sisanya bilangan bulat."],
        ["map({\"ya\": True, \"tidak\": False})", "Teks ya/tidak → boolean."],
        ["astype(\"category\")", "Kolom kategori."],
      ],
      change: "Setiap kolom dikonversi ke tipe yang sesuai artinya.",
    },
    {
      title: "Contoh 4 — Mengelompokkan kolom untuk preprocessing",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
X = df.drop(columns=["customer_id", "churn"])
num_cols = X.select_dtypes(include="number").columns.tolist()
cat_cols = X.select_dtypes(exclude="number").columns.tolist()
print("numerik :", num_cols)
print("kategori:", cat_cols)
print("tipe kategori:", X[cat_cols].dtypes.astype(str).unique().tolist())`,
      output: "numerik : ['age', 'tenure_months', 'monthly_charges', 'support_tickets', 'total_charges']\nkategori: ['gender', 'contract', 'internet_service']\ntipe kategori: ['str']",
      explain: [
        ["select_dtypes(include=\"number\")", "Kolom yang akan di-scaling/imputasi numerik."],
        ["select_dtypes(exclude=\"number\")", "Kolom yang akan di-encode."],
      ],
      change: "dtype menentukan jalur preprocessing setiap kolom.",
    },
  ],
  params: [
    {
      title: "Tipe & konversi",
      items: [
        { name: "astype(dtype)", desc: "\"int64\", \"float64\", \"Int64\", \"boolean\", \"str\", \"category\"." },
        { name: "pd.to_numeric(arg, errors=\"coerce\", downcast=None)", desc: "Ke angka; downcast=\"integer\"/\"float\" untuk hemat memori." },
        { name: "pd.to_datetime(arg, format=None, errors=\"raise\", dayfirst=False)", desc: "Ke tanggal." },
        { name: "df.convert_dtypes()", desc: "Konversi otomatis ke tipe nullable terbaik." },
        { name: "select_dtypes(include, exclude)", desc: "\"number\", \"str\", \"category\", \"datetime\", \"bool\"." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2], "b": [1.5, None], "c": ["x", "y"]})\nprint(df.dtypes.astype(str).to_dict(), df["b"].astype("Float64").isna().sum())`, output: "{'a': 'int64', 'b': 'float64', 'c': 'str'} 1" },
  tryIt: `import pandas as pd

df = pd.read_csv("bank_marketing.csv")
print(df.dtypes)
print(df.convert_dtypes().dtypes.astype(str).value_counts())`,
  mistakes: [
    {
      title: "astype(int) pada kolom berisi NaN",
      wrong: `import numpy as np
import pandas as pd
s = pd.Series([1, np.nan, 3])
print(s.astype(int))`,
      error: "IntCastingNaNError",
      fix: `import numpy as np
import pandas as pd
s = pd.Series([1, np.nan, 3])
print(s.astype("Int64"))`,
      explain: "int64 NumPy tidak bisa menyimpan NaN. Gunakan nullable `Int64` atau isi NaN terlebih dahulu.",
    },
    {
      title: "Tanggal format hari/bulan terbaca terbalik",
      wrong: `import pandas as pd
s = pd.to_datetime(pd.Series(["01/02/2026", "03/04/2026"]), format="%m/%d/%Y")
print(s.dt.month.tolist())   # [1, 3] — dibaca bulan/hari`,
      fix: `import pandas as pd
s = pd.to_datetime(pd.Series(["01/02/2026", "03/04/2026"]), format="%d/%m/%Y")
print(s.dt.month.tolist())`,
      explain: "Data Indonesia biasanya hari/bulan/tahun. Selalu tentukan `format` yang sesuai sumber data.",
    },
    {
      title: "astype(float) pada teks kotor",
      wrong: `import pandas as pd
print(pd.Series(["1.5", "2,5"]).astype(float))`,
      error: "ValueError",
      fix: `import pandas as pd
s = pd.Series(["1.5", "2,5"]).str.replace(",", ".", regex=False)
print(s.astype(float).tolist())`,
      explain: "astype gagal jika ada satu nilai tidak valid. Bersihkan teks atau gunakan to_numeric(errors=\"coerce\").",
    },
  ],
  bestPractices: [
    "Periksa dtypes segera setelah membaca data.",
    "Tentukan format tanggal secara eksplisit.",
    "Gunakan nullable Int64/boolean untuk kolom bilangan bulat/boolean yang bolong.",
    "Gunakan category untuk kolom teks berulang (hemat memori, jelas maksudnya).",
  ],
  exercises: [
    {
      id: "load-dtype-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Integer nullable",
      prompt: "Lengkapi agar `s2` tetap bilangan bulat walaupun ada missing value.",
      starter: `import numpy as np
import pandas as pd
s = pd.Series([4, np.nan, 6])
s2 = s.astype("____")
print(s2)`,
      solution: `import numpy as np
import pandas as pd
s = pd.Series([4, np.nan, 6])
s2 = s.astype("Int64")
print(s2)`,
      tests: [{ desc: "dtype Int64", expr: "str(s2.dtype) == 'Int64' and s2.isna().sum() == 1" }],
      hints: ["Konsep: nullable integer.", "Huruf I besar.", "`\"Int64\"`"],
      explanation: "Int64 menyimpan missing sebagai <NA>.",
    },
    {
      id: "load-dtype-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [1.0, 2.5], "c": [True, False], "d": ["x", "y"]})
print(df.dtypes.astype(str).tolist())
print(df.select_dtypes(include="number").columns.tolist())`,
      answer: "['int64', 'float64', 'bool', 'str']\n['a', 'b']",
      hints: ["Konsep: dtype dasar.", "bool bukan 'number' untuk select_dtypes.", "Teks bertipe str di pandas 3."],
      explanation: "['int64', 'float64', 'bool', 'str']; ['a', 'b'].",
    },
    {
      id: "load-dtype-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Format tanggal Indonesia",
      prompt: "Tanggal ditulis hari/bulan/tahun. Perbaiki konversi agar `bulan` = [1, 2, 12].",
      starter: `import pandas as pd
s = pd.Series(["15/01/2026", "03/02/2026", "25/12/2025"])
t = pd.to_datetime(s, format="%m/%d/%Y", errors="coerce")
bulan = t.dt.month.tolist()
print(bulan)`,
      solution: `import pandas as pd
s = pd.Series(["15/01/2026", "03/02/2026", "25/12/2025"])
t = pd.to_datetime(s, format="%d/%m/%Y", errors="coerce")
bulan = t.dt.month.tolist()
print(bulan)`,
      tests: [{ desc: "bulan benar", expr: "bulan == [1, 2, 12]" }],
      hints: ["Konsep: format tanggal.", "Urutan hari/bulan/tahun.", "`%d/%m/%Y`"],
      explanation: "Format yang salah membuat sebagian tanggal gagal (NaT) dan sebagian tertukar diam-diam.",
    },
    {
      id: "load-dtype-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Perbaiki semua tipe",
      prompt: "Ubah `df` agar: `tanggal` datetime (format \"%Y-%m-%d\"), `jumlah` Int64 (teks tidak valid → missing), `promo` boolean dari \"Y\"/\"N\", dan `toko` category. Cetak `df.dtypes.astype(str).to_dict()`.",
      starter: `import pandas as pd
df = pd.DataFrame({
    "tanggal": ["2026-01-05", "2026-01-06", "2026-01-07"],
    "jumlah": ["12", "-", "9"],
    "promo": ["Y", "N", "N"],
    "toko": ["T1", "T2", "T1"],
})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.DataFrame({
    "tanggal": ["2026-01-05", "2026-01-06", "2026-01-07"],
    "jumlah": ["12", "-", "9"],
    "promo": ["Y", "N", "N"],
    "toko": ["T1", "T2", "T1"],
})
df["tanggal"] = pd.to_datetime(df["tanggal"], format="%Y-%m-%d")
df["jumlah"] = pd.to_numeric(df["jumlah"], errors="coerce").astype("Int64")
df["promo"] = df["promo"].map({"Y": True, "N": False}).astype("boolean")
df["toko"] = df["toko"].astype("category")
print(df.dtypes.astype(str).to_dict())`,
      tests: [
        { desc: "tanggal datetime", expr: "str(df['tanggal'].dtype).startswith('datetime64')" },
        { desc: "jumlah Int64 dengan 1 NA", expr: "str(df['jumlah'].dtype) == 'Int64' and df['jumlah'].isna().sum() == 1" },
        { desc: "promo & toko", expr: "str(df['promo'].dtype) in ('boolean', 'bool') and df['promo'].tolist() == [True, False, False] and str(df['toko'].dtype) == 'category'" },
      ],
      hints: ["Konsep: konversi per kolom sesuai arti.", "to_numeric(errors=\"coerce\") lalu astype(\"Int64\").", "map untuk Y/N."],
      explanation: "Tipe yang tepat membuat setiap operasi berikutnya (filter tanggal, agregasi, encoding) bekerja tanpa trik tambahan.",
    },
    {
      id: "load-dtype-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Optimasi tipe Bank Marketing",
      prompt: [
        "Baca `bank_marketing.csv`. Catat memori awal (deep, KB). Ubah semua kolom teks menjadi `category` dan kolom integer menjadi tipe terkecil dengan `pd.to_numeric(..., downcast=\"integer\")`.",
        "Cetak memori akhir, persentase penghematan (1 desimal), dan `df.dtypes.astype(str).value_counts()`.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
awal = df.memory_usage(deep=True).sum() / 1024
for c in df.select_dtypes(include="str").columns:
    df[c] = df[c].astype("category")
for c in df.select_dtypes(include="integer").columns:
    df[c] = pd.to_numeric(df[c], downcast="integer")
akhir = df.memory_usage(deep=True).sum() / 1024
hemat = round((1 - akhir / awal) * 100, 1)
print(round(akhir), "KB, hemat", hemat, "%")
print(df.dtypes.astype(str).value_counts())`,
      tests: [
        { desc: "Tidak ada kolom str", expr: "len(df.select_dtypes(include='str').columns) == 0" },
        { desc: "Penghematan > 50%", expr: "hemat > 50" },
        { desc: "Nilai tidak berubah", expr: "df['balance'].sum() == __import__('pandas').read_csv('bank_marketing.csv')['balance'].sum()" },
      ],
      hints: ["Konsep: tipe hemat memori.", "Loop kolom str → category.", "`pd.to_numeric(df[c], downcast=\"integer\")`"],
      explanation: "Optimasi tipe bisa mengecilkan memori berkali-kali lipat tanpa mengubah nilai — penting untuk dataset jutaan baris.",
    },
  ],
  quiz: [
    { id: "load-dtype-q1", type: "mcq", prompt: "Kolom integer yang berisi NaN secara default menjadi…", options: ["int64", "float64", "str", "category"], answer: 1, explanation: "NaN adalah float." },
    { id: "load-dtype-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(pd.Series(["1", "2", "?"]).pipe(pd.to_numeric, errors="coerce").dtype)`, options: ["int64", "float64", "str", "Int64"], answer: 1, explanation: "Ada NaN → float64." },
    { id: "load-dtype-q3", type: "tf", prompt: "Di pandas 3, kolom teks secara default bertipe `str`.", answer: true, explanation: "Dtype string baru menggantikan object sebagai default." },
    { id: "load-dtype-q4", type: "fill", prompt: "Mengubah kolom teks berulang menjadi kategori: `s.astype(\"____\")`", answer: ["category"], explanation: "category." },
    { id: "load-dtype-q5", type: "case", prompt: "`df[\"tanggal\"].dt.month` error AttributeError. Penyebab paling mungkin?", options: ["Kolom kosong", "Kolom tanggal masih bertipe str", "pandas versi lama", "Terlalu banyak baris"], answer: 1, explanation: "Ubah dengan pd.to_datetime dulu." },
  ],
  challenge: {
    id: "load-dtype-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Skema tipe yang ditegakkan",
    prompt: [
      "Tulis fungsi `terapkan_skema(df, skema)` dengan `skema` = dict `{kolom: tipe}` di mana tipe salah satu: \"int\", \"float\", \"bool\", \"date\", \"cat\", \"str\". Aturan konversi:",
      "- int → `to_numeric(errors=\"coerce\").astype(\"Int64\")`\n- float → `to_numeric(errors=\"coerce\")`\n- bool → map {\"ya\"/\"y\"/\"true\"/\"1\": True, \"tidak\"/\"n\"/\"false\"/\"0\": False} (setelah `str.lower().str.strip()`), lalu astype(\"boolean\")\n- date → `to_datetime(errors=\"coerce\", format=\"%Y-%m-%d\")`\n- cat → astype(\"category\"); str → astype(\"str\")",
      "Kembalikan `(df_baru, laporan)` dengan laporan = dict `{kolom: jumlah nilai yang menjadi missing akibat konversi}`. Uji pada `mentah` dan cetak dtypes serta laporan.",
    ],
    starter: `import pandas as pd
mentah = pd.DataFrame({
    "id": ["1", "2", "3", "x"],
    "tanggal": ["2026-01-01", "2026-13-01", "2026-01-03", "2026-01-04"],
    "pm25": ["55.2", "41", "n/a", "38.9"],
    "libur": ["Ya", "tidak", "TIDAK", "1"],
    "stasiun": ["DKI1", "DKI2", "DKI1", "DKI1"],
})
skema = {"id": "int", "tanggal": "date", "pm25": "float", "libur": "bool", "stasiun": "cat"}
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
mentah = pd.DataFrame({
    "id": ["1", "2", "3", "x"],
    "tanggal": ["2026-01-01", "2026-13-01", "2026-01-03", "2026-01-04"],
    "pm25": ["55.2", "41", "n/a", "38.9"],
    "libur": ["Ya", "tidak", "TIDAK", "1"],
    "stasiun": ["DKI1", "DKI2", "DKI1", "DKI1"],
})
skema = {"id": "int", "tanggal": "date", "pm25": "float", "libur": "bool", "stasiun": "cat"}
PETA_BOOL = {"ya": True, "y": True, "true": True, "1": True, "tidak": False, "n": False, "false": False, "0": False}

def terapkan_skema(df, skema):
    baru = df.copy()
    laporan = {}
    for kol, tipe in skema.items():
        s = df[kol]
        if tipe == "int":
            h = pd.to_numeric(s, errors="coerce").astype("Int64")
        elif tipe == "float":
            h = pd.to_numeric(s, errors="coerce")
        elif tipe == "bool":
            h = s.astype(str).str.lower().str.strip().map(PETA_BOOL).astype("boolean")
        elif tipe == "date":
            h = pd.to_datetime(s, errors="coerce", format="%Y-%m-%d")
        elif tipe == "cat":
            h = s.astype("category")
        else:
            h = s.astype("str")
        laporan[kol] = int(h.isna().sum() - s.isna().sum())
        baru[kol] = h
    return baru, laporan

df, laporan = terapkan_skema(mentah, skema)
print(df.dtypes.astype(str).to_dict())
print(laporan)`,
    tests: [
      { desc: "Tipe benar", expr: "terapkan_skema(mentah, skema)[0].dtypes.astype(str).to_dict() == {'id': 'Int64', 'tanggal': str(terapkan_skema(mentah, skema)[0]['tanggal'].dtype), 'pm25': 'float64', 'libur': 'boolean', 'stasiun': 'category'} and str(terapkan_skema(mentah, skema)[0]['tanggal'].dtype).startswith('datetime64')" },
      { desc: "Laporan benar", expr: "terapkan_skema(mentah, skema)[1] == {'id': 1, 'tanggal': 1, 'pm25': 1, 'libur': 0, 'stasiun': 0}" },
      { desc: "Boolean benar", expr: "terapkan_skema(mentah, skema)[0]['libur'].tolist() == [True, False, False, True]" },
      { desc: "Data asli tidak berubah", expr: "mentah['id'].tolist() == ['1', '2', '3', 'x']" },
    ],
    hints: ["Konsep: skema eksplisit + laporan konversi.", "if/elif untuk setiap tipe.", "Missing baru = isna setelah − isna sebelum."],
    explanation: "Skema tipe yang ditegakkan dengan laporan membuat masalah data (tanggal 2026-13-01, \"x\" pada id) langsung terlihat, bukan tersembunyi sebagai NaN.",
  },
  summary: [
    "`df.dtypes` = tipe per kolom: int64, float64, bool, str, datetime64, category, nullable Int64/boolean.",
    "Integer + NaN → float64; gunakan Int64 untuk tetap bulat.",
    "Konversi: astype, to_numeric(errors=\"coerce\"), to_datetime(format=...), category.",
    "select_dtypes memisahkan kolom untuk preprocessing.",
  ],
  cheatsheet: [
    { syntax: "df.dtypes", desc: "Tipe per kolom" },
    { syntax: "s.astype(\"Int64\")", desc: "Integer nullable" },
    { syntax: "pd.to_datetime(s, format=\"%d/%m/%Y\")", desc: "Tanggal Indonesia" },
    { syntax: "s.astype(\"category\")", desc: "Kategori" },
    { syntax: "pd.to_numeric(s, downcast=\"integer\")", desc: "Hemat memori" },
  ],
  flashcards: [
    { q: "Mengapa kolom int berubah menjadi float?", a: "Ada NaN, dan NaN bertipe float" },
    { q: "Tipe integer yang bisa menyimpan missing", a: "\"Int64\" (nullable, I besar)" },
    { q: "Konversi tanggal hari/bulan/tahun", a: "pd.to_datetime(s, format=\"%d/%m/%Y\")" },
  ],
  references: [
    pandasDoc("Essential basic functionality — dtypes", "user_guide/basics.html#dtypes"),
    pandasDoc("Nullable integer data type", "user_guide/integer_na.html"),
    pandasDoc("pandas.to_datetime", "reference/api/pandas.to_datetime.html"),
    pandasDoc("Migration guide — The new string data type", "user_guide/migration.html#the-new-string-data-type"),
  ],
};
