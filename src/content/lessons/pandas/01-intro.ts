import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-introduction-to-pandas",
  title: "Introduction to Pandas",
  minutes: 30,
  prerequisites: ["np-introduction-to-numpy"],
  objectives: [
    "Menjelaskan apa itu Pandas dan perannya dalam alur kerja Machine Learning.",
    "Mengimpor Pandas dengan konvensi `import pandas as pd` dan mengecek versinya.",
    "Mengenal dua struktur data utama: Series dan DataFrame.",
    "Membaca file CSV dan melihat isinya dengan `head()`, `shape`, dan `dtypes`.",
  ],
  definition: [
    "**Pandas** adalah library Python open-source untuk mengolah dan menganalisis **data tabular** — data berbentuk tabel seperti spreadsheet atau tabel database. Pandas dibangun di atas NumPy, jadi setiap kolom angka sebenarnya disimpan sebagai array NumPy.",
    "Dua struktur data utama:\n- **Series** — satu kolom data berlabel (1 dimensi)\n- **DataFrame** — tabel dua dimensi berisi banyak kolom; setiap kolom adalah Series, dan semua kolom berbagi **index** (label baris) yang sama",
    "Kelebihan dibanding NumPy: setiap kolom boleh punya tipe data berbeda (angka, teks, tanggal), baris dan kolom punya **label/nama**, serta tersedia fungsi siap pakai untuk membaca file, menangani missing value, filter, groupby, dan merge.",
    "Materi ini memakai **pandas 3.x**. Dua perubahan penting dibanding versi lama: teks disimpan dengan dtype `str` (bukan `object`), dan **Copy-on-Write** selalu aktif — setiap hasil seleksi berperilaku seperti salinan sehingga tidak ada lagi perubahan data \"diam-diam\".",
  ],
  why: [
    "Hampir semua proyek ML dimulai dengan data tabel: CSV dari Kaggle, ekspor Excel, atau hasil query database. Pandas adalah alat standar untuk membaca, membersihkan, mengeksplorasi, dan menyiapkan data tersebut sebelum masuk ke scikit-learn.",
    "Dalam alur kerja ML, Pandas dipakai pada tahap: Load Data → Understand Data → EDA → Data Cleaning → Feature Engineering. Model scikit-learn menerima DataFrame secara langsung.",
  ],
  when: [
    "- Membaca dataset (CSV, Excel, JSON).",
    "- Melihat ringkasan dan struktur data.",
    "- Membersihkan, memfilter, dan mengubah data.",
    "- Merangkum data per kelompok dan menggabungkan beberapa tabel.",
  ],
  analogy: "Jika NumPy adalah **kalkulator super cepat**, Pandas adalah **spreadsheet yang bisa diprogram**: kolom punya nama, baris punya label, dan semua yang biasa kamu lakukan dengan klik di Excel (filter, sort, pivot) bisa ditulis sebagai kode yang dapat diulang.",
  syntax: {
    code: `import pandas as pd

df = pd.read_csv("nama_file.csv")   # baca file
df.head()                           # 5 baris pertama
df.shape                            # (jumlah baris, jumlah kolom)
df.dtypes                           # tipe data setiap kolom`,
  },
  anatomy: [
    ["import pandas as pd", "Konvensi resmi: alias `pd`."],
    ["pd.read_csv(...)", "Membaca file CSV menjadi DataFrame."],
    ["df.head()", "Menampilkan beberapa baris pertama (default 5)."],
    ["df.shape", "Atribut (tanpa tanda kurung): tuple (baris, kolom)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Impor dan cek versi",
      code: `import pandas as pd
import numpy as np

print("pandas", pd.__version__)
print("numpy ", np.__version__)`,
      output: "pandas 3.0.2\nnumpy  2.4.6",
      explain: [
        ["import pandas as pd", "Mengimpor Pandas dengan alias standar."],
        ["pd.__version__", "Versi Pandas — penting saat membaca dokumentasi atau mencari solusi error."],
      ],
    },
    {
      title: "Contoh 2 — Series dan DataFrame pertama",
      code: `import pandas as pd

nilai = pd.Series([80, 92, 75], name="nilai")
print(nilai)
print()

df = pd.DataFrame({
    "nama": ["Ani", "Budi", "Citra"],
    "nilai": [80, 92, 75],
})
print(df)`,
      output: "0    80\n1    92\n2    75\nName: nilai, dtype: int64\n\n    nama  nilai\n0    Ani     80\n1   Budi     92\n2  Citra     75",
      explain: [
        ["pd.Series([80, 92, 75], name=\"nilai\")", "Satu kolom data; index 0, 1, 2 dibuat otomatis."],
        ["df = pd.DataFrame({", "Tabel dari dictionary: key = nama kolom, value = isi kolom."],
        ["print(df)", "Kolom paling kiri (0, 1, 2) adalah index."],
      ],
      change: "Dari satu kolom (Series) menjadi tabel beberapa kolom (DataFrame).",
    },
    {
      title: "Contoh 3 — Membaca dataset nyata",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df.head())
print("Shape:", df.shape)
print(df.dtypes)`,
      output: "  student_id  hours_studied  attendance  previous_score  final_score\n0       S001            8.0          97              70           96\n1       S002            4.9          90              87           89\n2       S003            8.7          75              88           95\n3       S004            7.3          99              67           95\n4       S005            1.8          76              91           67\nShape: (30, 5)\nstudent_id            str\nhours_studied     float64\nattendance          int64\nprevious_score      int64\nfinal_score         int64\ndtype: object",
      explain: [
        ["pd.read_csv(\"student_scores.csv\")", "Membaca file CSV menjadi DataFrame."],
        ["df.head()", "Lima baris pertama untuk melihat isi data."],
        ["df.shape", "Jumlah baris dan kolom."],
        ["df.dtypes", "Tipe data per kolom: int64, float64, dan str untuk teks (pandas 3)."],
      ],
      change: "Data tidak lagi diketik manual, tetapi dibaca dari file.",
    },
    {
      title: "Contoh 4 — Ringkasan cepat sebuah dataset",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df["final_score"].mean().round(2))
print(df["hours_studied"].max())
print(df.describe().round(1))`,
      output: "85.3\n9.8\n       hours_studied  attendance  previous_score  final_score\ncount           30.0        30.0            30.0         30.0\nmean             6.0        81.1            72.7         85.3\nstd              2.7        11.3            12.7         13.6\nmin              1.4        63.0            50.0         58.0\n25%              4.2        73.0            61.2         75.2\n50%              6.8        79.0            74.0         88.0\n75%              8.1        90.8            85.0         96.0\nmax              9.8        99.0            91.0        100.0",
      explain: [
        ["df[\"final_score\"].mean()", "Rata-rata satu kolom — sama seperti NumPy, tetapi dengan nama kolom."],
        ["df.describe()", "Statistik ringkas setiap kolom numerik: count, mean, std, min, kuartil, max."],
      ],
      change: "Selain melihat data, kita langsung menghitung ringkasan statistik.",
    },
  ],
  params: [
    {
      title: "Perintah pertama yang wajib dikenal",
      items: [
        { name: "pd.read_csv(path)", desc: "Membaca CSV → DataFrame." },
        { name: "df.head(n=5) / df.tail(n=5)", desc: "Baris awal / akhir." },
        { name: "df.shape", desc: "Atribut: (baris, kolom)." },
        { name: "df.dtypes", desc: "Atribut: tipe data per kolom." },
        { name: "df.describe()", desc: "Statistik ringkas kolom numerik." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"x": [1, 2, 3], "y": ["a", "b", "c"]})\nprint(df.shape, list(df.columns))`, output: "(3, 2) ['x', 'y']" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.head(3))
print(df.shape)
# Coba: df.tail(), df.dtypes, df["price_million"].mean()`,
  mistakes: [
    {
      title: "Lupa mengimpor Pandas",
      wrong: `df = pd.read_csv("student_scores.csv")`,
      error: "NameError",
      fix: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape)`,
      explain: "`pd` baru dikenal setelah `import pandas as pd`.",
    },
    {
      title: "Memanggil shape seperti fungsi",
      wrong: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape())`,
      error: "TypeError",
      fix: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape)`,
      explain: "`shape` dan `dtypes` adalah atribut (tanpa tanda kurung); `head()` dan `describe()` adalah method (dengan tanda kurung).",
    },
    {
      title: "Nama file salah",
      wrong: `import pandas as pd
df = pd.read_csv("student_score.csv")`,
      error: "FileNotFoundError",
      fix: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape)`,
      explain: "Periksa ejaan nama file dan lokasinya. Di Playground, daftar file tersedia di panel dataset.",
    },
  ],
  bestPractices: [
    "Gunakan alias standar `pd` agar kode mudah dibaca orang lain.",
    "Setelah membaca data, selalu cek `head()`, `shape`, dan `dtypes` sebelum analisis.",
    "Simpan data mentah tanpa diubah; buat DataFrame baru untuk hasil olahan.",
    "Catat versi Pandas di notebook proyek agar hasil dapat direproduksi.",
  ],
  exercises: [
    {
      id: "pd-intro-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Membaca CSV",
      prompt: "Lengkapi agar `df` berisi data dari `iris.csv`.",
      starter: `import pandas as pd
df = pd.____("iris.csv")
print(df.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
print(df.shape)`,
      tests: [
        { desc: "df adalah DataFrame", expr: "type(df).__name__ == 'DataFrame'" },
        { desc: "Shape (150, 5)", expr: "df.shape == (150, 5)" },
      ],
      hints: ["Konsep: membaca file.", "Nama fungsinya \"read\" + format file.", "`pd.read_csv(\"iris.csv\")`"],
      explanation: "`read_csv` membaca file CSV menjadi DataFrame.",
    },
    {
      id: "pd-intro-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3, 4], "b": [5, 6, 7, 8], "c": ["x", "y", "z", "w"]})
print(df.shape)
print(len(df))
print(df["a"].sum())`,
      answer: "(4, 3)\n4\n10",
      hints: ["Konsep: shape = (baris, kolom).", "len(df) = jumlah baris.", "1 + 2 + 3 + 4."],
      explanation: "4 baris × 3 kolom; len menghitung baris; jumlah kolom a = 10.",
    },
    {
      id: "pd-intro-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Atribut vs method",
      prompt: "Kode error. Perbaiki agar mencetak shape dan 2 baris pertama.",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape())
print(df.head(2))`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
print(df.shape)
print(df.head(2))`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Mencetak shape", expr: "_lines[0] == str(df.shape)" },
      ],
      hints: ["Konsep: atribut tidak dipanggil.", "Hapus tanda kurung pada shape.", "`print(df.shape)`"],
      explanation: "shape adalah tuple, bukan fungsi.",
    },
    {
      id: "pd-intro-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — DataFrame dari dictionary",
      prompt: "Buat DataFrame `df` dengan kolom `kota` = [\"Jakarta\", \"Bandung\", \"Surabaya\"] dan `aqi` = [152, 88, 101]. Simpan rata-rata AQI di `rata` lalu cetak `df` dan `rata`.",
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.DataFrame({"kota": ["Jakarta", "Bandung", "Surabaya"], "aqi": [152, 88, 101]})
rata = df["aqi"].mean()
print(df)
print(rata)`,
      tests: [
        { desc: "Kolom benar", expr: "list(df.columns) == ['kota', 'aqi']" },
        { desc: "Isi benar", expr: "df['aqi'].tolist() == [152, 88, 101] and df['kota'].tolist() == ['Jakarta', 'Bandung', 'Surabaya']" },
        { desc: "rata benar", expr: "abs(rata - 341 / 3) < 1e-9" },
      ],
      hints: ["Konsep: dictionary → DataFrame.", "`pd.DataFrame({\"kota\": [...], \"aqi\": [...]})`", "`df[\"aqi\"].mean()`"],
      explanation: "Key dictionary menjadi nama kolom, list menjadi isi kolom.",
    },
    {
      id: "pd-intro-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Kenali dataset Auto MPG",
      prompt: [
        "Baca `auto_mpg.csv` ke `df`. Simpan `n_baris`, `n_kolom` (dari shape), `kolom_teks` = list nama kolom yang bertipe teks (`df.select_dtypes(include=\"str\").columns.tolist()`), dan `mpg_rata` = rata-rata `mpg` dibulatkan 2 desimal.",
        "Cetak keempatnya.",
      ],
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
n_baris, n_kolom = df.shape
kolom_teks = df.select_dtypes(include="str").columns.tolist()
mpg_rata = round(df["mpg"].mean(), 2)
print(n_baris, n_kolom, kolom_teks, mpg_rata)`,
      tests: [
        { desc: "Shape benar", expr: "(n_baris, n_kolom) == df.shape" },
        { desc: "kolom_teks = ['car_name']", expr: "kolom_teks == ['car_name']" },
        { desc: "mpg_rata benar", expr: "mpg_rata == round(df['mpg'].mean(), 2)" },
      ],
      hints: ["Konsep: memahami struktur dataset.", "Unpack tuple: `n_baris, n_kolom = df.shape`.", "`df.select_dtypes(include=\"str\")` memilih kolom teks."],
      explanation: "Tiga pertanyaan pertama setiap dataset: berapa besar, kolom apa saja, dan apa tipenya.",
    },
  ],
  quiz: [
    { id: "pd-intro-q1", type: "mcq", prompt: "Struktur data Pandas untuk tabel dua dimensi?", options: ["Series", "DataFrame", "ndarray", "list"], answer: 1, explanation: "DataFrame = tabel; Series = satu kolom." },
    { id: "pd-intro-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2], "b": [3, 4], "c": [5, 6]})\nprint(df.shape)`, options: ["(3, 2)", "(2, 3)", "6", "(2,)"], answer: 1, explanation: "2 baris, 3 kolom." },
    { id: "pd-intro-q3", type: "tf", prompt: "Pandas dibangun di atas NumPy.", answer: true, explanation: "Kolom numerik disimpan sebagai array NumPy." },
    { id: "pd-intro-q4", type: "fill", prompt: "Konvensi impor Pandas: `import pandas as ____`", answer: ["pd"], explanation: "`pd`." },
    { id: "pd-intro-q5", type: "case", prompt: "Kamu baru mengunduh dataset dari Kaggle. Langkah pertama yang paling tepat setelah membacanya?", options: ["Langsung melatih model", "Cek head(), shape, dan dtypes", "Menghapus kolom acak", "Mengubah ke list"], answer: 1, explanation: "Pahami struktur data sebelum apa pun." },
  ],
  challenge: {
    id: "pd-intro-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Profil dataset otomatis",
    prompt: [
      "Tulis fungsi `profil(df)` yang mengembalikan dictionary berisi: `baris`, `kolom`, `numerik` (jumlah kolom numerik, `df.select_dtypes(include=\"number\")`), `teks` (jumlah kolom teks), dan `missing` (total nilai kosong, `df.isna().sum().sum()`).",
      "Uji pada `customer_churn.csv` dan cetak hasilnya.",
    ],
    starter: `import pandas as pd
# Tulis kodemu di sini
`,
    solution: `import pandas as pd

def profil(df):
    return {
        "baris": df.shape[0],
        "kolom": df.shape[1],
        "numerik": df.select_dtypes(include="number").shape[1],
        "teks": df.select_dtypes(include="str").shape[1],
        "missing": int(df.isna().sum().sum()),
    }

df = pd.read_csv("customer_churn.csv")
print(profil(df))`,
    tests: [
      { desc: "baris & kolom benar", expr: "profil(df)['baris'] == len(df) and profil(df)['kolom'] == df.shape[1]" },
      { desc: "numerik + teks = jumlah kolom", expr: "profil(df)['numerik'] + profil(df)['teks'] == df.shape[1]" },
      { desc: "missing benar", expr: "profil(df)['missing'] == int(df.isna().sum().sum())" },
      { desc: "Bekerja untuk DataFrame lain", expr: "profil(__import__('pandas').DataFrame({'a': [1, None], 'b': ['x', 'y']})) == {'baris': 2, 'kolom': 2, 'numerik': 1, 'teks': 1, 'missing': 1}" },
    ],
    hints: ["Konsep: ringkasan struktur.", "`df.select_dtypes(include=\"number\").shape[1]` = jumlah kolom numerik.", "`df.isna().sum().sum()` = total missing."],
    explanation: "Fungsi kecil seperti ini menghemat waktu di setiap proyek baru — kamu akan memperluasnya di Module 04 dan 06.",
  },
  summary: [
    "Pandas = library untuk data tabular, dibangun di atas NumPy.",
    "Series = satu kolom berlabel; DataFrame = tabel banyak kolom dengan index bersama.",
    "`pd.read_csv` membaca file; `head`, `shape`, `dtypes`, `describe` memberi gambaran awal.",
    "pandas 3: teks bertipe `str`, Copy-on-Write selalu aktif.",
  ],
  cheatsheet: [
    { syntax: "import pandas as pd", desc: "Impor" },
    { syntax: "pd.read_csv(\"f.csv\")", desc: "Baca CSV" },
    { syntax: "df.head(), df.tail()", desc: "Lihat baris" },
    { syntax: "df.shape, df.dtypes", desc: "Struktur" },
    { syntax: "df.describe()", desc: "Statistik ringkas" },
  ],
  flashcards: [
    { q: "Baca file data.csv ke DataFrame", a: "df = pd.read_csv(\"data.csv\")" },
    { q: "Jumlah baris dan kolom DataFrame", a: "df.shape" },
    { q: "Dua struktur data utama Pandas", a: "Series dan DataFrame" },
  ],
  references: [
    pandasDoc("10 minutes to pandas", "user_guide/10min.html"),
    pandasDoc("Getting started — What kind of data does pandas handle?", "getting_started/intro_tutorials/01_table_oriented.html"),
    pandasDoc("Copy-on-Write (CoW)", "user_guide/copy_on_write.html"),
    { source: "Kaggle Learn", title: "Pandas — Creating, Reading and Writing", url: "https://www.kaggle.com/learn/pandas" },
  ],
};
