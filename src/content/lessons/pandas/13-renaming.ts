import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-renaming-columns",
  title: "Renaming Columns",
  minutes: 25,
  prerequisites: ["pd-selecting-columns"],
  objectives: [
    "Mengganti nama kolom tertentu dengan `rename(columns={...})`.",
    "Mengganti semua nama kolom sekaligus dengan `df.columns = [...]`.",
    "Membersihkan nama kolom secara massal dengan method string (`str.strip`, `str.lower`, `str.replace`).",
    "Menambah prefix/suffix nama kolom dan mengganti label index.",
  ],
  definition: [
    "`df.rename(columns={\"lama\": \"baru\"})` mengembalikan DataFrame baru dengan nama kolom yang diganti; kolom yang tidak disebut tetap. Argumen `columns` juga bisa berupa **fungsi** yang diterapkan ke setiap nama, misalnya `str.lower`.",
    "`df.columns = [\"a\", \"b\", \"c\"]` mengganti **semua** nama sekaligus — jumlahnya harus sama persis dengan jumlah kolom.",
    "`df.columns.str...` menyediakan method string untuk seluruh nama kolom: `str.strip()`, `str.lower()`, `str.replace(\" \", \"_\")`.",
    "`add_prefix(\"x_\")` / `add_suffix(\"_rata\")` menambah awalan/akhiran. `rename(index={...})` mengganti label baris.",
  ],
  why: [
    "Nama kolom yang konsisten (huruf kecil, tanpa spasi, pakai garis bawah — *snake_case*) membuat kode lebih mudah ditulis, mencegah KeyError karena spasi tersembunyi, dan memungkinkan notasi `df.nama_kolom`.",
    "Saat menggabungkan beberapa tabel (merge), nama kolom harus seragam. Prefix membantu menandai asal fitur (misalnya `cams_pm25` vs `ispu_pm25`).",
  ],
  when: [
    "- Tepat setelah memuat data mentah.",
    "- Sebelum merge tabel dengan penamaan berbeda.",
    "- Memberi nama yang lebih jelas untuk laporan.",
    "- Menandai asal fitur dengan prefix.",
  ],
  analogy: "Mengganti nama kolom seperti **memberi label yang rapi pada toples dapur**: isinya sama, tetapi label \"  Gula Pasir  \" yang berantakan menjadi \"gula_pasir\" sehingga semua orang mudah menemukannya.",
  syntax: {
    code: `df = df.rename(columns={"Harga (Rp)": "harga"})
df.columns = ["a", "b", "c"]
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
df = df.rename(columns=str.upper)
df = df.add_prefix("cams_")`,
  },
  anatomy: [
    ["rename(columns={lama: baru})", "Ganti sebagian nama; DataFrame baru."],
    ["df.columns = [...]", "Ganti semua nama (panjang harus sama)."],
    ["df.columns.str.lower()", "Method string untuk semua nama."],
    ["add_prefix / add_suffix", "Tambah awalan/akhiran."],
  ],
  examples: [
    {
      title: "Contoh 1 — rename sebagian kolom",
      code: `import pandas as pd

df = pd.DataFrame({"Nama Siswa": ["Ani", "Budi"], "Nilai Akhir": [88, 75], "kelas": ["A", "B"]})
df2 = df.rename(columns={"Nama Siswa": "nama", "Nilai Akhir": "nilai"})
print(df2.columns.tolist())
print(df.columns.tolist())`,
      output: "['nama', 'nilai', 'kelas']\n['Nama Siswa', 'Nilai Akhir', 'kelas']",
      explain: [
        ["df.rename(columns={\"Nama Siswa\": \"nama\", \"Nilai Akhir\": \"nilai\"})", "Hanya dua kolom yang diganti; kelas tetap."],
        ["print(df.columns.tolist())", "df asli tidak berubah."],
      ],
    },
    {
      title: "Contoh 2 — Membersihkan semua nama sekaligus",
      code: `import pandas as pd

df = pd.read_csv("winequality-red.csv", sep=";")
print(df.columns.tolist()[:4])
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")
print(df.columns.tolist()[:4])
print(df.fixed_acidity.mean().round(3))`,
      output: "['fixed acidity', 'volatile acidity', 'citric acid', 'residual sugar']\n['fixed_acidity', 'volatile_acidity', 'citric_acid', 'residual_sugar']\n8.32",
      explain: [
        ["df.columns.str.strip().str.lower().str.replace(\" \", \"_\")", "Rantai method string: buang spasi tepi, huruf kecil, spasi → garis bawah."],
        ["df.fixed_acidity", "Setelah dibersihkan, notasi titik bisa dipakai."],
      ],
      change: "Bukan satu per satu, tetapi seluruh nama dengan satu baris.",
    },
    {
      title: "Contoh 3 — Mengganti semua nama dan memakai fungsi",
      code: `import pandas as pd

df = pd.DataFrame([[1, 2, 3]], columns=["A", "B", "C"])
df.columns = ["fitur_1", "fitur_2", "target"]
print(df.columns.tolist())
print(df.rename(columns=str.upper).columns.tolist())
print(df.rename(columns=lambda c: c.replace("fitur_", "x")).columns.tolist())`,
      output: "['fitur_1', 'fitur_2', 'target']\n['FITUR_1', 'FITUR_2', 'TARGET']\n['x1', 'x2', 'target']",
      explain: [
        ["df.columns = [\"fitur_1\", \"fitur_2\", \"target\"]", "Ganti semua nama; jumlah harus 3."],
        ["df.rename(columns=str.upper)", "Fungsi diterapkan ke setiap nama."],
        ["lambda c: c.replace(\"fitur_\", \"x\")", "Fungsi kustom untuk pola penggantian."],
      ],
      change: "rename juga menerima fungsi, bukan hanya dictionary.",
    },
    {
      title: "Contoh 4 — Prefix sebelum menggabungkan dua sumber data",
      code: `import pandas as pd

ispu = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02"], "pm25": [62, 55], "o3": [30, 28]})
cams = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02"], "pm25": [48.2, 44.9], "o3": [25.1, 26.3]})

ispu = ispu.set_index("tanggal").add_prefix("ispu_")
cams = cams.set_index("tanggal").add_prefix("cams_")
gabung = ispu.join(cams)
print(gabung)`,
      output: "            ispu_pm25  ispu_o3  cams_pm25  cams_o3\ntanggal                                           \n2025-01-01         62       30       48.2     25.1\n2025-01-02         55       28       44.9     26.3",
      explain: [
        ["set_index(\"tanggal\").add_prefix(\"ispu_\")", "Tanggal dijadikan index (tidak diberi prefix), kolom lain diberi awalan sumbernya."],
        ["ispu.join(cams)", "Digabung berdasarkan index tanggal; tanpa prefix, nama pm25 dan o3 akan bentrok."],
      ],
      change: "Penamaan dipakai untuk mencegah bentrok saat menggabungkan data.",
    },
  ],
  params: [
    {
      title: "Alat penamaan",
      items: [
        { name: "rename(columns=dict|fungsi, index=dict|fungsi, errors=\"ignore\")", desc: "Ganti sebagian; errors=\"raise\" jika nama harus ada." },
        { name: "df.columns = list", desc: "Ganti semua." },
        { name: "df.columns.str.*", desc: "strip, lower, upper, replace, contains." },
        { name: "add_prefix(p), add_suffix(s)", desc: "Awalan/akhiran." },
        { name: "df.set_axis(labels, axis=1)", desc: "Alternatif mengganti semua nama secara chaining." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({" Umur ": [1], "Gaji Bulanan": [2]})\nprint(df.columns.str.strip().str.lower().str.replace(" ", "_").tolist())`, output: "['umur', 'gaji_bulanan']" },
  tryIt: `import pandas as pd

df = pd.read_csv("online_shoppers.csv")
print(df.columns.tolist())
df.columns = df.columns.str.lower()
print(df.columns.tolist())`,
  mistakes: [
    {
      title: "Jumlah nama tidak sama",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
df.columns = ["x", "y"]`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2], "c": [3]})
df.columns = ["x", "y", "z"]
print(df.columns.tolist())`,
      explain: "*Length mismatch* — list nama harus sepanjang jumlah kolom. Untuk sebagian kolom gunakan rename.",
    },
    {
      title: "rename tanpa columns=",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1]})
df = df.rename({"a": "x"}, axis=0)
print(df.columns.tolist())   # tetap ['a']`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1]})
df = df.rename(columns={"a": "x"})
print(df.columns.tolist())`,
      explain: "axis=0 mengganti label baris. Tulis `columns=` secara eksplisit.",
    },
    {
      title: "Salah ketik nama lama → diam-diam tidak berubah",
      wrong: `import pandas as pd
df = pd.DataFrame({"harga": [1]})
df = df.rename(columns={"Harga": "price"})
print(df.columns.tolist())   # ['harga']`,
      fix: `import pandas as pd
df = pd.DataFrame({"harga": [1]})
df = df.rename(columns={"harga": "price"}, errors="raise")
print(df.columns.tolist())`,
      explain: "Default rename mengabaikan nama yang tidak ada. `errors=\"raise\"` membuat salah ketik langsung ketahuan.",
    },
  ],
  bestPractices: [
    "Standarkan nama kolom ke snake_case sekali di awal notebook.",
    "Gunakan `errors=\"raise\"` saat rename untuk mendeteksi salah ketik.",
    "Beri prefix sumber data sebelum menggabungkan beberapa tabel.",
    "Hindari nama kolom yang bentrok dengan method (count, size, mean).",
  ],
  exercises: [
    {
      id: "pd-rename-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — rename",
      prompt: "Lengkapi agar kolom `price_million` berganti nama menjadi `harga`.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
df = df.rename(____={"price_million": "harga"})
print(df.columns.tolist())`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
df = df.rename(columns={"price_million": "harga"})
print(df.columns.tolist())`,
      tests: [{ desc: "Kolom harga ada", expr: "'harga' in df.columns and 'price_million' not in df.columns" }],
      hints: ["Konsep: rename kolom.", "Keyword yang sama dengan drop untuk kolom.", "`columns=`"],
      explanation: "rename(columns={lama: baru}).",
    },
    {
      id: "pd-rename-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"A B": [1], "c": [2]})
print(df.rename(columns={"c": "C", "zzz": "q"}).columns.tolist())
print(df.add_suffix("_v1").columns.tolist())
print(df.columns.str.replace(" ", "_").tolist())`,
      answer: "['A B', 'C']\n['A B_v1', 'c_v1']\n['A_B', 'c']",
      hints: ["Konsep: rename mengabaikan nama yang tidak ada.", "add_suffix menambah di akhir.", "Spasi diganti garis bawah."],
      explanation: "['A B', 'C']; ['A B_v1', 'c_v1']; ['A_B', 'c'].",
    },
    {
      id: "pd-rename-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Ganti semua nama",
      prompt: "Kode error karena jumlah nama kurang. Perbaiki agar kolom bernama `nama`, `umur`, `kota`.",
      starter: `import pandas as pd
df = pd.DataFrame([["Ani", 21, "Bogor"]], columns=["n", "u", "k"])
df.columns = ["nama", "umur"]
print(df)`,
      solution: `import pandas as pd
df = pd.DataFrame([["Ani", 21, "Bogor"]], columns=["n", "u", "k"])
df.columns = ["nama", "umur", "kota"]
print(df)`,
      tests: [{ desc: "Nama kolom benar", expr: "df.columns.tolist() == ['nama', 'umur', 'kota']" }],
      hints: ["Konsep: panjang list nama.", "Ada 3 kolom.", "Tambahkan \"kota\"."],
      explanation: "Jumlah nama harus sama dengan jumlah kolom.",
    },
    {
      id: "pd-rename-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi pembersih nama",
      prompt: "Tulis fungsi `rapikan_nama(df)` yang mengembalikan DataFrame baru dengan nama kolom: tanpa spasi di tepi, huruf kecil, spasi dan tanda hubung diganti `_`. Uji pada `df` di starter.",
      starter: `import pandas as pd
df = pd.DataFrame({"  Customer ID": [1], "Monthly-Charges ": [70.5], "Total Charges": [800.0]})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.DataFrame({"  Customer ID": [1], "Monthly-Charges ": [70.5], "Total Charges": [800.0]})

def rapikan_nama(df):
    baru = df.columns.str.strip().str.lower().str.replace(" ", "_").str.replace("-", "_")
    return df.set_axis(baru, axis=1)

print(rapikan_nama(df).columns.tolist())`,
      tests: [
        { desc: "Nama rapi", expr: "rapikan_nama(df).columns.tolist() == ['customer_id', 'monthly_charges', 'total_charges']" },
        { desc: "df asli tidak berubah", expr: "df.columns.tolist() == ['  Customer ID', 'Monthly-Charges ', 'Total Charges']" },
      ],
      alternatives: [
        `import pandas as pd
df = pd.DataFrame({"  Customer ID": [1], "Monthly-Charges ": [70.5], "Total Charges": [800.0]})

def rapikan_nama(df):
    return df.rename(columns=lambda c: c.strip().lower().replace(" ", "_").replace("-", "_"))

print(rapikan_nama(df).columns.tolist())`,
      ],
      hints: ["Konsep: method string pada nama kolom.", "Rantai strip → lower → replace.", "`set_axis(baru, axis=1)` atau `rename(columns=lambda c: ...)` agar df asli aman."],
      explanation: "Fungsi kecil ini layak disimpan di utilitas tim dan dipakai di setiap dataset baru.",
    },
    {
      id: "pd-rename-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Nama kolom Credit Card yang bermakna",
      prompt: [
        "Baca `credit_card_default.csv`. Ganti nama `default payment next month` → `default`, `PAY_0` → `PAY_1` (agar berurutan dengan BILL_AMT1), dan semua nama menjadi huruf kecil.",
        "Simpan di `df` lalu cetak 8 nama kolom pertama dan rata-rata `default` (3 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("credit_card_default.csv")
df = df.rename(columns={"default payment next month": "default", "PAY_0": "PAY_1"}, errors="raise")
df.columns = df.columns.str.lower()
print(df.columns.tolist()[:8])
print(round(df["default"].mean(), 3))`,
      tests: [
        { desc: "Kolom default ada", expr: "'default' in df.columns and 'default payment next month' not in df.columns" },
        { desc: "pay_1 menggantikan pay_0", expr: "'pay_1' in df.columns and 'pay_0' not in df.columns" },
        { desc: "Semua huruf kecil", expr: "all(c == c.lower() for c in df.columns)" },
      ],
      hints: ["Konsep: rename dengan dictionary + method string.", "rename dulu, baru lower (atau sebaliknya dengan nama huruf kecil).", "`df.columns = df.columns.str.lower()`"],
      explanation: "Dokumentasi UCI dataset ini menyebut PAY_0 sebagai status September — menamainya PAY_1 membuatnya sejajar dengan BILL_AMT1 dan PAY_AMT1 untuk bulan yang sama.",
    },
  ],
  quiz: [
    { id: "pd-rename-q1", type: "mcq", prompt: "Cara mengganti nama SEBAGIAN kolom?", options: ["df.columns = [...]", "df.rename(columns={...})", "df.drop(...)", "df.set_index(...)"], answer: 1, explanation: "rename hanya mengubah yang disebut." },
    { id: "pd-rename-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1], "b": [2]})\nprint(df.add_prefix("x_").columns.tolist())`, options: ["['a', 'b']", "['x_a', 'x_b']", "['a_x', 'b_x']", "Error"], answer: 1, explanation: "Awalan ditambahkan." },
    { id: "pd-rename-q3", type: "tf", prompt: "Secara default, rename akan error jika nama lama tidak ditemukan.", answer: false, explanation: "Default errors=\"ignore\"; gunakan errors=\"raise\"." },
    { id: "pd-rename-q4", type: "fill", prompt: "Membuat semua nama kolom huruf kecil: `df.columns = df.columns.str.____()`", answer: ["lower"], explanation: "`str.lower()`." },
    { id: "pd-rename-q5", type: "case", prompt: "Dua tabel sama-sama punya kolom `pm25` dari sumber berbeda dan akan di-join. Langkah tepat?", options: ["Hapus salah satu", "Beri prefix sumber (add_prefix) sebelum join", "Biarkan saja", "Ubah ke huruf besar"], answer: 1, explanation: "Prefix menjaga kedua informasi dan mencegah bentrok." },
  ],
  challenge: {
    id: "pd-rename-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Kamus nama dua bahasa",
    prompt: [
      "Tim kamu memakai kamus nama kolom Indonesia. Diberikan `kamus` (dict Inggris → Indonesia).",
      "1. Ganti nama kolom `house_prices.csv` memakai `kamus` dengan `errors=\"raise\"` → `df_id`.\n2. Buat `belum` = list kolom `df_id` yang **tidak** termasuk nilai kamus (belum diterjemahkan).\n3. Buat `balik` = dict kebalikan kamus, dan pastikan `df_id.rename(columns=balik)` menghasilkan nama kolom yang sama dengan file asli.",
      "Cetak `df_id.columns.tolist()` dan `belum`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
kamus = {"city": "kota", "area_m2": "luas_m2", "bedrooms": "kamar_tidur", "bathrooms": "kamar_mandi", "price_million": "harga_juta"}
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
kamus = {"city": "kota", "area_m2": "luas_m2", "bedrooms": "kamar_tidur", "bathrooms": "kamar_mandi", "price_million": "harga_juta"}
df_id = df.rename(columns=kamus, errors="raise")
belum = [c for c in df_id.columns if c not in kamus.values()]
balik = {v: k for k, v in kamus.items()}
assert df_id.rename(columns=balik).columns.tolist() == df.columns.tolist()
print(df_id.columns.tolist())
print(belum)`,
    tests: [
      { desc: "Nama terjemahan benar", expr: "df_id.columns.tolist() == ['house_id', 'kota', 'luas_m2', 'kamar_tidur', 'kamar_mandi', 'age_years', 'distance_to_center_km', 'harga_juta']" },
      { desc: "belum benar", expr: "belum == ['house_id', 'age_years', 'distance_to_center_km']" },
      { desc: "balik mengembalikan nama asli", expr: "df_id.rename(columns=balik).columns.tolist() == df.columns.tolist()" },
    ],
    hints: ["Konsep: rename dengan dictionary + dict comprehension.", "`{v: k for k, v in kamus.items()}` membalik kamus.", "`c not in kamus.values()`"],
    explanation: "Kamus nama terpusat menjaga konsistensi antaranggota tim, dan kamus balik memungkinkan hasil dikembalikan ke format asli kompetisi.",
  },
  summary: [
    "`rename(columns={lama: baru})` mengganti sebagian; `df.columns = [...]` mengganti semua.",
    "`df.columns.str.strip().str.lower().str.replace(\" \", \"_\")` membersihkan nama massal.",
    "rename menerima fungsi; `errors=\"raise\"` mendeteksi salah ketik.",
    "`add_prefix`/`add_suffix` menandai asal fitur sebelum merge/join.",
  ],
  cheatsheet: [
    { syntax: "df.rename(columns={\"a\": \"b\"})", desc: "Ganti sebagian" },
    { syntax: "df.columns = [...]", desc: "Ganti semua" },
    { syntax: "df.columns.str.lower()", desc: "Huruf kecil" },
    { syntax: "df.add_prefix(\"x_\")", desc: "Awalan" },
    { syntax: "rename(..., errors=\"raise\")", desc: "Deteksi salah ketik" },
  ],
  flashcards: [
    { q: "Ganti nama kolom \"Harga (Rp)\" menjadi \"harga\"", a: "df.rename(columns={\"Harga (Rp)\": \"harga\"})" },
    { q: "Ubah semua nama kolom menjadi snake_case sederhana", a: "df.columns = df.columns.str.strip().str.lower().str.replace(\" \", \"_\")" },
    { q: "Tambah awalan cams_ ke semua kolom", a: "df.add_prefix(\"cams_\")" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.rename", "reference/api/pandas.DataFrame.rename.html"),
    pandasDoc("Essential basic functionality — Renaming / mapping labels", "user_guide/basics.html#renaming-mapping-labels"),
    pandasDoc("pandas.DataFrame.add_prefix", "reference/api/pandas.DataFrame.add_prefix.html"),
    { source: "UCI Machine Learning Repository", title: "Default of Credit Card Clients — variable information", url: "https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients" },
  ],
};
