import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-csv-files",
  title: "Loading CSV Files",
  minutes: 40,
  prerequisites: ["pd-introduction-to-pandas"],
  objectives: [
    "Memahami format CSV: header, delimiter, quoting, dan encoding.",
    "Memakai parameter penting `pd.read_csv`: `sep`, `header`, `names`, `usecols`, `dtype`, `na_values`, `parse_dates`, `index_col`, `nrows`.",
    "Membaca file besar secara efisien (memilih kolom, tipe data, `chunksize`).",
    "Memverifikasi hasil pembacaan dan menyimpan kembali dengan `to_csv`.",
  ],
  definition: [
    "**CSV** (*Comma-Separated Values*) adalah file teks di mana setiap baris = satu record dan nilai dipisahkan delimiter (biasanya koma). Baris pertama umumnya **header** (nama kolom). Nilai yang mengandung koma dibungkus tanda kutip: `\"Jakarta, Indonesia\"`.",
    "Format ini sederhana dan universal, tetapi tidak menyimpan tipe data — pandas **menebak** tipe setiap kolom. Karena itu hasil `read_csv` selalu perlu diperiksa (`dtypes`, `head`).",
    "Variasi yang sering ditemui:\n- delimiter titik koma (`;`, umum di Excel berbahasa Eropa/Indonesia) atau tab (`\\t`)\n- tanpa header\n- penanda missing khusus (\"?\", \"NA\", \"-\")\n- encoding selain UTF-8 (misalnya `latin-1`)\n- kolom tanggal yang perlu di-*parse*",
  ],
  why: [
    "CSV adalah format paling umum untuk dataset ML: hampir semua kompetisi Kaggle (train.csv, test.csv, sample_submission.csv) dan banyak dataset UCI memakai CSV.",
    "Membaca dengan parameter yang tepat sejak awal mencegah bug seperti angka terbaca sebagai teks, tanggal tidak terurut, atau seluruh baris masuk ke satu kolom karena delimiter salah.",
  ],
  when: [
    "- Memuat dataset kompetisi atau repositori publik.",
    "- Membaca ekspor dari Excel/Google Sheets/database.",
    "- Membaca sebagian kolom/baris dari file besar.",
  ],
  analogy: "read_csv seperti **petugas yang menyalin formulir kertas ke komputer**. Kamu perlu memberi tahu: tanda pemisah kolomnya apa, baris pertama judul atau bukan, tanda \"-\" berarti kosong, dan kolom tanggal ditulis dengan format apa. Tanpa instruksi, ia hanya menebak.",
  syntax: {
    code: `pd.read_csv(
    "file.csv",
    sep=",",                 # delimiter
    header=0,                # baris header (None jika tidak ada)
    names=None,              # nama kolom manual
    usecols=None,            # hanya kolom tertentu
    dtype=None,              # tipe per kolom
    na_values=None,          # penanda missing tambahan
    parse_dates=None,        # kolom tanggal
    index_col=None,          # kolom index
    nrows=None,              # baca n baris pertama
    encoding="utf-8",
)`,
  },
  anatomy: [
    ["sep", "Pemisah kolom: \",\", \";\", \"\\t\"."],
    ["header / names", "Header di file atau nama manual."],
    ["usecols / nrows", "Membaca sebagian data."],
    ["dtype / na_values / parse_dates", "Mengontrol tipe dan missing."],
  ],
  examples: [
    {
      title: "Contoh 1 — CSV standar",
      code: `import pandas as pd

print(open("data.csv").read()[:80])
df = pd.read_csv("data.csv")
print(df.head(3))
print(df.dtypes.to_dict())`,
      output: "Name,Age,City,Score\nAndi,21,Jakarta,85\nBudi,22,Bandung,78\nCitra,20,Surabaya,92\nD\n    Name  Age      City  Score\n0   Andi   21   Jakarta     85\n1   Budi   22   Bandung     78\n2  Citra   20  Surabaya     92\n{'Name': <StringDtype(storage='python', na_value=nan)>, 'Age': dtype('int64'), 'City': <StringDtype(storage='python', na_value=nan)>, 'Score': dtype('int64')}",
      explain: [
        ["open(\"data.csv\").read()[:80]", "Lihat isi mentah file terlebih dahulu: header dan delimiter."],
        ["pd.read_csv(\"data.csv\")", "Default: koma sebagai delimiter, baris pertama header."],
        ["df.dtypes", "Tipe yang ditebak pandas."],
      ],
    },
    {
      title: "Contoh 2 — Delimiter titik koma dan file tanpa header",
      code: `import io
import pandas as pd

salah = pd.read_csv("data_semicolon.csv")
print(salah.shape, salah.columns.tolist())

benar = pd.read_csv("data_semicolon.csv", sep=";")
print(benar.shape, benar.columns.tolist())

tanpa_header = "Andi,21,85\\nBudi,22,78"
df = pd.read_csv(io.StringIO(tanpa_header), header=None, names=["nama", "umur", "nilai"])
print(df)`,
      output: "(6, 1) ['Name;Age;City;Score']\n(6, 4) ['Name', 'Age', 'City', 'Score']\n   nama  umur  nilai\n0  Andi    21     85\n1  Budi    22     78",
      explain: [
        ["salah = pd.read_csv(\"data_semicolon.csv\")", "Delimiter salah → semua isi masuk ke satu kolom."],
        ["sep=\";\"", "Tentukan delimiter yang benar."],
        ["header=None, names=[\"nama\", \"umur\", \"nilai\"]", "File tanpa header: beri nama kolom sendiri."],
      ],
      change: "File tidak mengikuti format default.",
    },
    {
      title: "Contoh 3 — Missing value, tanggal, dan tipe data",
      code: `import io
import pandas as pd

teks = """tanggal,stasiun,pm25,status
2025-01-03,DKI1,55.2,valid
2025-01-01,DKI1,-,rusak
2025-01-02,DKI2,41.0,valid"""
df = pd.read_csv(
    io.StringIO(teks),
    na_values=["-"],
    parse_dates=["tanggal"],
    dtype={"stasiun": "category"},
)
print(df.dtypes.to_dict())
print(df.sort_values("tanggal"))`,
      output: "{'tanggal': dtype('<M8[us]'), 'stasiun': CategoricalDtype(categories=['DKI1', 'DKI2'], ordered=False, categories_dtype=str), 'pm25': dtype('float64'), 'status': <StringDtype(storage='python', na_value=nan)>}\n     tanggal stasiun  pm25 status\n1 2025-01-01    DKI1   NaN  rusak\n2 2025-01-02    DKI2  41.0  valid\n0 2025-01-03    DKI1  55.2  valid",
      explain: [
        ["na_values=[\"-\"]", "\"-\" dibaca sebagai NaN sehingga pm25 tetap float."],
        ["parse_dates=[\"tanggal\"]", "Kolom tanggal menjadi datetime64 — bisa diurutkan dan dipakai `.dt`."],
        ["dtype={\"stasiun\": \"category\"}", "Tipe ditetapkan sendiri, tidak ditebak."],
      ],
      change: "Parameter dipakai untuk mendapatkan tipe yang benar sejak awal.",
    },
    {
      title: "Contoh 4 — Membaca sebagian dari file besar",
      code: `import pandas as pd

kolom = ["age", "education", "hours_per_week", "income"]
df = pd.read_csv("adult_income.csv", usecols=kolom, nrows=1000)
print(df.shape)

total, kaya = 0, 0
for chunk in pd.read_csv("adult_income.csv", usecols=["income"], chunksize=10_000):
    total += len(chunk)
    kaya += (chunk["income"] == ">50K").sum()
print(total, "baris dibaca per 10.000 | proporsi >50K:", round(kaya / total, 3))

lengkap = pd.read_csv("adult_income.csv")
print("Memori semua kolom (KB):", round(lengkap.memory_usage(deep=True).sum() / 1024))
print("Memori 4 kolom (KB):", round(pd.read_csv("adult_income.csv", usecols=kolom).memory_usage(deep=True).sum() / 1024))`,
      output: "(1000, 4)\n32561 baris dibaca per 10.000 | proporsi >50K: 0.241\nMemori semua kolom (KB): 11177\nMemori 4 kolom (KB): 2518",
      explain: [
        ["usecols=kolom, nrows=1000", "Hanya 4 kolom dan 1000 baris pertama — cepat untuk eksplorasi."],
        ["chunksize=10_000", "Membaca bertahap; berguna jika file lebih besar dari memori."],
        ["memory_usage(deep=True)", "Memilih kolom sejak awal menghemat memori secara nyata."],
      ],
      change: "Fokus pada efisiensi untuk data besar.",
    },
  ],
  params: [
    {
      title: "Parameter read_csv yang paling sering dipakai",
      items: [
        { name: "sep=\",\"", desc: "Delimiter; sep=None + engine=\"python\" untuk menebak otomatis." },
        { name: "header=0, names=None", desc: "Header atau nama manual." },
        { name: "usecols, nrows, skiprows", desc: "Sebagian kolom/baris." },
        { name: "dtype, na_values, keep_default_na", desc: "Tipe dan missing." },
        { name: "parse_dates, date_format", desc: "Kolom tanggal dan formatnya." },
        { name: "index_col, encoding, decimal, thousands, chunksize", desc: "Index, encoding, format angka lokal, pembacaan bertahap." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import io\nimport pandas as pd\ndf = pd.read_csv(io.StringIO("a;b\\n1;x\\n2;y"), sep=";")\nprint(df.shape, df["a"].sum())`, output: "(2, 2) 3" },
  tryIt: `import pandas as pd

df = pd.read_csv("winequality-red.csv", sep=";", usecols=["alcohol", "pH", "quality"])
print(df.head())
print(df.dtypes)`,
  mistakes: [
    {
      title: "Delimiter salah",
      wrong: `import pandas as pd
df = pd.read_csv("winequality-red.csv")
print(df.shape)   # (1599, 1) — semua dalam satu kolom`,
      fix: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
print(df.shape)`,
      explain: "Jika shape hanya 1 kolom dan nama kolomnya mengandung \";\", delimiter-nya bukan koma.",
    },
    {
      title: "usecols dengan nama yang tidak ada",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv", usecols=["sepal_length", "Species"])`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.read_csv("iris.csv", usecols=["sepal_length", "species"])
print(df.columns.tolist())`,
      explain: "*Usecols do not match columns* — cocokkan nama persis (case-sensitive).",
    },
    {
      title: "Header ikut terbaca sebagai data",
      wrong: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("nama,umur\\nAni,21"), header=None)
print(df.iloc[:, 1].tolist())   # ['umur', '21'] — header jadi data`,
      fix: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("nama,umur\\nAni,21"))
print(df["umur"].tolist())`,
      explain: "header=None hanya untuk file yang benar-benar tidak punya header; jika tidak, nama kolom ikut menjadi baris data dan kolom menjadi teks.",
    },
  ],
  bestPractices: [
    "Intip isi mentah file (beberapa baris pertama) sebelum memilih parameter.",
    "Setelah membaca, selalu cek `shape`, `head()`, dan `dtypes`.",
    "Gunakan `parse_dates` untuk kolom tanggal dan `na_values` untuk penanda missing khusus.",
    "Untuk file besar: `usecols` + `dtype` + (jika perlu) `chunksize`.",
  ],
  exercises: [
    {
      id: "load-csv-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Delimiter",
      prompt: "Lengkapi agar file `data_semicolon.csv` terbaca dengan 4 kolom.",
      starter: `import pandas as pd
df = pd.read_csv("data_semicolon.csv", sep="____")
print(df.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("data_semicolon.csv", sep=";")
print(df.shape)`,
      tests: [{ desc: "4 kolom", expr: "df.shape[1] == 4 and 'Score' in df.columns" }],
      hints: ["Konsep: delimiter.", "Lihat nama file.", "`sep=\";\"`"],
      explanation: "Delimiter titik koma.",
    },
    {
      id: "load-csv-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import io
import pandas as pd
teks = "id,nilai,catatan\\n1,80,ok\\n2,NA,-\\n3,95,ok"
df = pd.read_csv(io.StringIO(teks), na_values=["-"], usecols=["id", "nilai", "catatan"], index_col="id")
print(df.shape)
print(df.isna().sum().tolist())
print(df.index.tolist())`,
      answer: "(3, 2)\n[1, 1]\n[1, 2, 3]",
      hints: ["Konsep: index_col dan na_values.", "\"NA\" sudah dikenal sebagai missing secara default.", "id menjadi index, bukan kolom."],
      explanation: "(3, 2); [1, 1]; [1, 2, 3].",
    },
    {
      id: "load-csv-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Tanggal tidak terurut benar",
      prompt: "Kolom `tgl` terbaca sebagai teks sehingga `.dt` error. Perbaiki pembacaan agar `bulan` berisi nomor bulan.",
      starter: `import io
import pandas as pd
teks = "tgl,penjualan\\n2026-02-10,5\\n2026-01-05,3"
df = pd.read_csv(io.StringIO(teks))
bulan = df["tgl"].dt.month.tolist()
print(bulan)`,
      solution: `import io
import pandas as pd
teks = "tgl,penjualan\\n2026-02-10,5\\n2026-01-05,3"
df = pd.read_csv(io.StringIO(teks), parse_dates=["tgl"])
bulan = df["tgl"].dt.month.tolist()
print(bulan)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "bulan == [2, 1]", expr: "bulan == [2, 1]" },
      ],
      hints: ["Konsep: parse tanggal saat membaca.", "Parameter read_csv untuk tanggal.", "`parse_dates=[\"tgl\"]`"],
      explanation: "parse_dates mengubah kolom menjadi datetime64.",
    },
    {
      id: "load-csv-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Baca dengan nama kolom sendiri",
      prompt: "Teks `raw` tidak punya header. Baca dengan `header=None` dan `names=[\"kota\", \"tanggal\", \"pm25\"]`, parse kolom tanggal, dan jadikan `?` sebagai missing. Cetak `df.dtypes.astype(str).to_dict()` dan rata-rata pm25.",
      starter: `import io
import pandas as pd
raw = """Jakarta,2025-03-01,61.5
Jakarta,2025-03-02,?
Jakarta,2025-03-03,48.5"""
# Tulis kodemu di sini
`,
      solution: `import io
import pandas as pd
raw = """Jakarta,2025-03-01,61.5
Jakarta,2025-03-02,?
Jakarta,2025-03-03,48.5"""
df = pd.read_csv(io.StringIO(raw), header=None, names=["kota", "tanggal", "pm25"], parse_dates=["tanggal"], na_values=["?"])
print(df.dtypes.astype(str).to_dict())
print(df["pm25"].mean())`,
      tests: [
        { desc: "3 baris, kolom benar", expr: "df.shape == (3, 3) and df.columns.tolist() == ['kota', 'tanggal', 'pm25']" },
        { desc: "Tipe benar", expr: "str(df['tanggal'].dtype).startswith('datetime64') and df['pm25'].dtype == 'float64'" },
        { desc: "Rata-rata 55.0", expr: "df['pm25'].mean() == 55.0" },
      ],
      hints: ["Konsep: kombinasi parameter read_csv.", "header=None + names.", "parse_dates dan na_values."],
      explanation: "Banyak ekspor sensor tidak memiliki header — names memberi struktur yang jelas.",
    },
    {
      id: "load-csv-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Membaca efisien Credit Card Default",
      prompt: [
        "Baca `credit_card_default.csv` hanya kolom `LIMIT_BAL`, `AGE`, `PAY_0`, dan `default payment next month` dengan dtype `int32` untuk keempatnya.",
        "Simpan di `df`, lalu cetak `df.shape`, `df.dtypes.astype(str).tolist()`, dan memori (KB, dibulatkan) — bandingkan dengan memori membaca semua kolom (`semua`).",
      ],
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
kolom = ["LIMIT_BAL", "AGE", "PAY_0", "default payment next month"]
df = pd.read_csv("credit_card_default.csv", usecols=kolom, dtype={c: "int32" for c in kolom})
semua = pd.read_csv("credit_card_default.csv")
print(df.shape)
print(df.dtypes.astype(str).tolist())
print(round(df.memory_usage(deep=True).sum() / 1024), "KB vs", round(semua.memory_usage(deep=True).sum() / 1024), "KB")`,
      tests: [
        { desc: "Shape (30000, 4)", expr: "df.shape == (30000, 4)" },
        { desc: "Semua int32", expr: "df.dtypes.astype(str).tolist() == ['int32'] * 4" },
        { desc: "Memori jauh lebih kecil", expr: "df.memory_usage(deep=True).sum() * 5 < semua.memory_usage(deep=True).sum()" },
      ],
      hints: ["Konsep: usecols + dtype.", "Dict comprehension: `{c: \"int32\" for c in kolom}`.", "`memory_usage(deep=True).sum()`"],
      explanation: "4 dari 25 kolom dengan int32 (bukan int64) menghemat memori lebih dari 10 kali — penting untuk dataset jutaan baris.",
    },
  ],
  quiz: [
    { id: "load-csv-q1", type: "mcq", prompt: "Parameter untuk membaca hanya kolom tertentu?", options: ["nrows", "usecols", "names", "header"], answer: 1, explanation: "usecols." },
    { id: "load-csv-q2", type: "predict", prompt: "Apa outputnya?", code: `import io\nimport pandas as pd\nprint(pd.read_csv(io.StringIO("a,b\\n1,2\\n3,4\\n5,6"), nrows=2).shape)`, options: ["(3, 2)", "(2, 2)", "(2, 3)", "(1, 2)"], answer: 1, explanation: "Dua baris data." },
    { id: "load-csv-q3", type: "tf", prompt: "File CSV menyimpan informasi tipe data setiap kolom.", answer: false, explanation: "CSV hanya teks; pandas menebak tipe." },
    { id: "load-csv-q4", type: "fill", prompt: "Untuk file tanpa header gunakan `header=____`", answer: ["None"], explanation: "header=None." },
    { id: "load-csv-q5", type: "case", prompt: "Setelah read_csv, df.shape = (5000, 1) dan nama kolomnya \"id;tanggal;pm25\". Apa masalahnya?", options: ["File rusak", "Delimiter sebenarnya titik koma — gunakan sep=\";\"", "Perlu encoding", "Data terlalu besar"], answer: 1, explanation: "Semua isi masuk satu kolom karena delimiter salah." },
  ],
  challenge: {
    id: "load-csv-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Loader yang memverifikasi dirinya",
    prompt: [
      "Tulis fungsi `muat_csv(path, kolom_wajib, **kwargs)` yang membaca CSV dengan `pd.read_csv(path, **kwargs)` lalu memverifikasi:",
      "- jika hanya ada 1 kolom dan namanya mengandung \";\" → `raise ValueError(\"Delimiter salah, coba sep=';'\")`\n- jika ada kolom wajib yang tidak ada → `raise ValueError(\"Kolom hilang: [...]\")` (list terurut)\n- jika semua aman → kembalikan DataFrame",
      "Uji pada `data_semicolon.csv` tanpa dan dengan `sep=\";\"`, menangkap error dengan try/except dan mencetak pesannya.",
    ],
    starter: `import pandas as pd
# Tulis kodemu di sini
`,
    solution: `import pandas as pd

def muat_csv(path, kolom_wajib, **kwargs):
    df = pd.read_csv(path, **kwargs)
    if df.shape[1] == 1 and ";" in df.columns[0]:
        raise ValueError("Delimiter salah, coba sep=';'")
    hilang = sorted(set(kolom_wajib) - set(df.columns))
    if hilang:
        raise ValueError(f"Kolom hilang: {hilang}")
    return df

for kw in [{}, {"sep": ";"}]:
    try:
        df = muat_csv("data_semicolon.csv", ["Name", "Score"], **kw)
        print("OK", df.shape)
    except ValueError as e:
        print("Error:", e)`,
    tests: [
      { desc: "Delimiter salah terdeteksi", expr: "_raises(muat_csv, 'data_semicolon.csv', ['Name']) == ('ValueError', \"Delimiter salah, coba sep=';'\")" },
      { desc: "Sukses dengan sep=';'", expr: "muat_csv('data_semicolon.csv', ['Name', 'Score'], sep=';').shape[1] == 4" },
      { desc: "Output menunjukkan error lalu OK", expr: "_lines[0].startswith('Error: Delimiter salah') and _lines[1].startswith('OK')" },
      { desc: "Kolom hilang terdeteksi", expr: "_raises(muat_csv, 'data.csv', ['Name', 'Gaji', 'Alamat']) == ('ValueError', \"Kolom hilang: ['Alamat', 'Gaji']\")" },
    ],
    hints: ["Konsep: validasi setelah membaca.", "`**kwargs` meneruskan parameter ke read_csv.", "`sorted(set(kolom_wajib) - set(df.columns))`"],
    explanation: "Loader yang gagal dengan pesan jelas jauh lebih baik daripada DataFrame salah yang diam-diam masuk ke pipeline.",
  },
  summary: [
    "CSV = teks berdelimiter; pandas menebak tipe, jadi hasil harus diperiksa.",
    "Parameter kunci: sep, header/names, usecols, nrows, dtype, na_values, parse_dates, index_col.",
    "File besar: usecols + dtype + chunksize.",
    "Selalu cek shape, head, dan dtypes setelah membaca.",
  ],
  cheatsheet: [
    { syntax: "pd.read_csv(f, sep=\";\")", desc: "Delimiter titik koma" },
    { syntax: "pd.read_csv(f, header=None, names=[...])", desc: "Tanpa header" },
    { syntax: "pd.read_csv(f, na_values=[\"?\", \"-\"])", desc: "Penanda missing" },
    { syntax: "pd.read_csv(f, parse_dates=[\"tgl\"])", desc: "Tanggal" },
    { syntax: "pd.read_csv(f, usecols=[...], nrows=1000)", desc: "Sebagian data" },
  ],
  flashcards: [
    { q: "Baca CSV dengan kolom tanggal sebagai datetime", a: "pd.read_csv(f, parse_dates=[\"tanggal\"])" },
    { q: "Tanda delimiter salah setelah read_csv", a: "Hanya 1 kolom dan namanya berisi delimiter lain (misal ;)" },
    { q: "Membaca file besar bertahap", a: "for chunk in pd.read_csv(f, chunksize=10000): ..." },
  ],
  references: [
    pandasDoc("IO tools — CSV & text files", "user_guide/io.html#csv-text-files"),
    pandasDoc("pandas.read_csv", "reference/api/pandas.read_csv.html"),
    pandasDoc("Scaling to large datasets", "user_guide/scale.html"),
    { source: "Python Official Documentation", title: "csv — CSV File Reading and Writing", url: "https://docs.python.org/3/library/csv.html" },
  ],
};
