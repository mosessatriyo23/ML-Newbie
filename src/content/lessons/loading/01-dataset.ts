import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-introduction-to-dataset",
  title: "Introduction to Dataset",
  minutes: 30,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Menjelaskan apa itu dataset dan perannya dalam Machine Learning.",
    "Mengenal bentuk dataset tabular: observasi (baris) dan variabel (kolom).",
    "Mengenal jenis sumber dataset: file, API, database, library, dan repositori publik (UCI, Kaggle).",
    "Membaca kartu dataset (dataset card): sumber, lisensi, ukuran, arti kolom, dan target.",
  ],
  definition: [
    "**Dataset** adalah kumpulan data yang terstruktur untuk dianalisis atau dipakai melatih model. Dalam ML tabular, dataset berbentuk tabel: setiap **baris** adalah satu **observasi/sampel** (satu pasien, satu rumah, satu hari), dan setiap **kolom** adalah satu **variabel** (umur, luas, PM2.5).",
    "Model ML belajar pola dari dataset. Menurut Google Machine Learning Crash Course, kualitas dan kuantitas data sering lebih menentukan keberhasilan model daripada pilihan algoritma — prinsip *garbage in, garbage out*.",
    "Sumber dataset yang umum:\n- **File**: CSV, Excel, JSON, Parquet\n- **Repositori publik**: UCI Machine Learning Repository, Kaggle Datasets, OpenML\n- **Library**: `sklearn.datasets`, `seaborn.load_dataset`\n- **API / database**: data cuaca, transaksi, sensor kualitas udara",
    "Sebelum memakai dataset, baca **dokumentasinya** (*dataset card*): siapa pembuatnya, bagaimana dikumpulkan, lisensi, jumlah baris/kolom, arti setiap kolom, dan kolom mana yang menjadi target.",
  ],
  why: [
    "Langkah pertama alur kerja ML adalah memahami data. Salah memahami arti satu kolom (misalnya mengira kolom ID adalah fitur, atau tidak tahu nilai 0 berarti \"tidak tercatat\") bisa membuat seluruh model salah.",
    "Lisensi menentukan apakah dataset boleh dipakai untuk kompetisi, publikasi, atau produk komersial.",
  ],
  when: [
    "- Setiap kali memulai proyek atau kompetisi baru.",
    "- Memilih dataset latihan yang sesuai dengan jenis masalah (klasifikasi/regresi/clustering).",
    "- Menilai apakah data cukup dan relevan untuk pertanyaan yang ingin dijawab.",
  ],
  analogy: "Dataset seperti **bahan masakan**. Sehebat apa pun koki (algoritma), masakan tidak akan enak jika bahannya busuk atau salah. Dataset card seperti **label kemasan**: asal bahan, tanggal, komposisi — wajib dibaca sebelum memasak.",
  syntax: {
    code: `import pandas as pd

df = pd.read_csv("nama_dataset.csv")
print(df.shape)        # (jumlah observasi, jumlah variabel)
print(df.head())       # contoh observasi
print(df.columns)      # daftar variabel`,
  },
  anatomy: [
    ["baris", "Observasi / sampel / record."],
    ["kolom", "Variabel / fitur / atribut."],
    ["target", "Kolom yang ingin diprediksi (jika ada)."],
    ["dataset card", "Dokumentasi: sumber, lisensi, arti kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — Dataset kecil buatan sendiri",
      code: `import pandas as pd

df = pd.DataFrame({
    "tanggal": ["2025-01-01", "2025-01-02", "2025-01-03"],
    "suhu_c": [27.5, 28.1, 26.9],
    "hujan_mm": [12.0, 0.0, 30.5],
    "pm25": [41, 58, 33],
})
print(df)
print("Observasi:", df.shape[0], "| Variabel:", df.shape[1])`,
      output: "      tanggal  suhu_c  hujan_mm  pm25\n0  2025-01-01    27.5      12.0    41\n1  2025-01-02    28.1       0.0    58\n2  2025-01-03    26.9      30.5    33\nObservasi: 3 | Variabel: 4",
      explain: [
        ["df = pd.DataFrame({", "Tiga hari observasi, empat variabel."],
        ["df.shape[0]", "Jumlah baris = jumlah observasi."],
        ["df.shape[1]", "Jumlah kolom = jumlah variabel."],
      ],
    },
    {
      title: "Contoh 2 — Dataset nyata dari UCI",
      code: `import pandas as pd

df = pd.read_csv("heart_disease.csv")
print(df.shape)
print(df.head(3))
print(df.columns.tolist())`,
      output: "(303, 14)\n    age  sex   cp  trestbps   chol  fbs  ...  exang  oldpeak  slope   ca  thal  num\n0  63.0  1.0  1.0     145.0  233.0  1.0  ...    0.0      2.3    3.0  0.0   6.0    0\n1  67.0  1.0  4.0     160.0  286.0  0.0  ...    1.0      1.5    2.0  3.0   3.0    2\n2  67.0  1.0  4.0     120.0  229.0  0.0  ...    1.0      2.6    2.0  2.0   7.0    1\n\n[3 rows x 14 columns]\n['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg', 'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal', 'num']",
      explain: [
        ["pd.read_csv(\"heart_disease.csv\")", "Dataset Heart Disease (Cleveland) dari UCI Machine Learning Repository."],
        ["df.shape", "303 pasien × 14 variabel."],
        ["df.columns.tolist()", "Nama kolom berupa singkatan (cp, trestbps, thalach…) — artinya harus dibaca di dokumentasi UCI."],
      ],
      change: "Dari data buatan menjadi data riset nyata yang perlu dokumentasi.",
    },
    {
      title: "Contoh 3 — Membuat \"kartu dataset\" sederhana",
      code: `import pandas as pd

df = pd.read_csv("heart_disease.csv")
kartu = {
    "nama": "Heart Disease (Cleveland)",
    "sumber": "UCI Machine Learning Repository",
    "lisensi": "CC BY 4.0",
    "observasi": df.shape[0],
    "variabel": df.shape[1],
    "target": "num (0 = tidak ada penyakit, 1-4 = ada)",
    "missing_total": int(df.isna().sum().sum()),
}
for k, v in kartu.items():
    print(f"{k:13}: {v}")`,
      output: "nama         : Heart Disease (Cleveland)\nsumber       : UCI Machine Learning Repository\nlisensi      : CC BY 4.0\nobservasi    : 303\nvariabel     : 14\ntarget       : num (0 = tidak ada penyakit, 1-4 = ada)\nmissing_total: 6",
      explain: [
        ["\"lisensi\": \"CC BY 4.0\"", "Lisensi yang tercantum di halaman UCI — boleh dipakai ulang dengan menyebut sumber."],
        ["\"target\": \"num (0 = tidak ada penyakit, 1-4 = ada)\"", "Arti target diambil dari dokumentasi dataset, bukan ditebak."],
        ["int(df.isna().sum().sum())", "Jumlah sel kosong — kolom ca dan thal punya beberapa missing value."],
      ],
      change: "Bukan hanya membaca data, tetapi mendokumentasikannya.",
    },
    {
      title: "Contoh 4 — Satu dataset, beberapa jenis pertanyaan",
      code: `import pandas as pd

df = pd.read_csv("student_performance.csv")
print("Regresi     → prediksi nilai akhir G3 (0-20):", df["G3"].min(), "-", df["G3"].max())
print("Klasifikasi → lulus (G3 >= 10)?", (df["G3"] >= 10).value_counts().to_dict())
print("Analisis    → rata-rata G3 per sekolah:", df.groupby("school")["G3"].mean().round(2).to_dict())`,
      output: "Regresi     → prediksi nilai akhir G3 (0-20): 0 - 20\nKlasifikasi → lulus (G3 >= 10)? {True: 265, False: 130}\nAnalisis    → rata-rata G3 per sekolah: {'GP': 10.49, 'MS': 9.85}",
      explain: [
        ["df[\"G3\"].min(), \"-\", df[\"G3\"].max()", "Target numerik → masalah regresi."],
        ["(df[\"G3\"] >= 10)", "Target diubah menjadi kategori lulus/tidak → masalah klasifikasi."],
        ["df.groupby(\"school\")[\"G3\"].mean()", "Pertanyaan analisis tanpa model."],
      ],
      change: "Jenis masalah ML ditentukan oleh pertanyaan dan target, bukan oleh datasetnya saja.",
    },
  ],
  params: [
    {
      title: "Istilah dataset",
      items: [
        { name: "Observasi / sampel / baris", desc: "Satu unit yang diamati." },
        { name: "Variabel / fitur / kolom", desc: "Karakteristik yang diukur." },
        { name: "Target / label", desc: "Variabel yang ingin diprediksi." },
        { name: "Granularitas", desc: "Satu baris mewakili apa (per hari, per pelanggan, per transaksi)." },
        { name: "Lisensi", desc: "Aturan penggunaan data (CC BY 4.0, CC0, MIT, dsb.)." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.read_csv("iris.csv")\nprint(df.shape, df.columns.tolist())`, output: "(150, 5) ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']" },
  tryIt: `import pandas as pd

df = pd.read_csv("winequality-red.csv", sep=";")
print(df.shape)
print(df.head())
# Apa targetnya? Apa granularitasnya (satu baris = satu ...)?`,
  mistakes: [
    {
      title: "Menebak arti kolom tanpa dokumentasi",
      wrong: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
print((df["num"] == 1).mean())   # dikira proporsi pasien sakit`,
      fix: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
print((df["num"] > 0).mean().round(3))   # num 1-4 semuanya berarti ada penyakit`,
      explain: "Dokumentasi UCI menyebut num bernilai 0–4; nilai 1 sampai 4 semuanya berarti ada penyakit. Tanpa membaca dokumentasi, proporsinya salah besar.",
    },
    {
      title: "Membuka file yang tidak ada",
      wrong: `import pandas as pd
df = pd.read_csv("heart.csv")`,
      error: "FileNotFoundError",
      fix: `import os
import pandas as pd
print([f for f in os.listdir(".") if f.endswith(".csv")][:5])
df = pd.read_csv("heart_disease.csv")`,
      explain: "Lihat daftar file yang tersedia dengan `os.listdir` sebelum membaca.",
    },
    {
      title: "Granularitas tidak dipahami",
      wrong: `import pandas as pd
trx = pd.DataFrame({"pelanggan": ["A", "A", "B"], "nilai": [10, 20, 5]})
print("Jumlah pelanggan:", len(trx))   # 3, padahal 2`,
      fix: `import pandas as pd
trx = pd.DataFrame({"pelanggan": ["A", "A", "B"], "nilai": [10, 20, 5]})
print("Jumlah transaksi:", len(trx), "| pelanggan:", trx["pelanggan"].nunique())`,
      explain: "Satu baris = satu transaksi, bukan satu pelanggan. Pastikan tahu \"satu baris mewakili apa\".",
    },
  ],
  bestPractices: [
    "Baca dataset card/dokumentasi sebelum menulis kode.",
    "Catat sumber, lisensi, dan tanggal unduh di notebook.",
    "Tuliskan granularitas: \"satu baris = …\".",
    "Simpan file mentah tanpa diubah; olah di salinan.",
  ],
  exercises: [
    {
      id: "load-ds-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Jumlah observasi",
      prompt: "Lengkapi agar `n_obs` berisi jumlah baris dataset iris.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
n_obs = df.shape[____]
print(n_obs)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
n_obs = df.shape[0]
print(n_obs)`,
      tests: [{ desc: "n_obs == 150", expr: "n_obs == 150" }],
      hints: ["Konsep: shape = (baris, kolom).", "Index pertama tuple.", "`df.shape[0]`"],
      explanation: "Index 0 = jumlah baris (observasi).",
    },
    {
      id: "load-ds-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
trx = pd.DataFrame({"hari": ["Sen", "Sen", "Sel", "Rab", "Rab", "Rab"], "jual": [5, 3, 4, 2, 6, 1]})
print(len(trx), trx["hari"].nunique())
print(trx.groupby("hari", sort=False)["jual"].sum().tolist())`,
      answer: "6 3\n[8, 4, 9]",
      hints: ["Konsep: granularitas.", "Satu baris = satu transaksi.", "Sen: 8, Sel: 4, Rab: 9."],
      explanation: "6 transaksi dari 3 hari; total per hari [8, 4, 9].",
    },
    {
      id: "load-ds-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Proporsi pasien sakit",
      prompt: "Menurut dokumentasi UCI, kolom `num` bernilai 0 (tidak ada penyakit) dan 1–4 (ada penyakit). Perbaiki perhitungan `p_sakit`.",
      starter: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
p_sakit = (df["num"] == 1).mean()
print(round(p_sakit, 3))`,
      solution: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
p_sakit = (df["num"] > 0).mean()
print(round(p_sakit, 3))`,
      tests: [{ desc: "p_sakit benar", expr: "abs(p_sakit - (df['num'] > 0).mean()) < 1e-12" }],
      hints: ["Konsep: arti nilai target dari dokumentasi.", "Semua nilai di atas 0 berarti sakit.", "`(df[\"num\"] > 0).mean()`"],
      explanation: "Sekitar 46% pasien memiliki penyakit jantung.",
    },
    {
      id: "load-ds-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi kartu dataset",
      prompt: "Tulis fungsi `kartu(df, nama, target)` yang mengembalikan dict berisi `nama`, `baris`, `kolom`, `target`, `missing` (total sel kosong), dan `duplikat` (`df.duplicated().sum()`). Uji pada `customer_churn.csv` dengan target `churn`.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")

def kartu(df, nama, target):
    return {
        "nama": nama,
        "baris": df.shape[0],
        "kolom": df.shape[1],
        "target": target,
        "missing": int(df.isna().sum().sum()),
        "duplikat": int(df.duplicated().sum()),
    }

print(kartu(df, "Customer Churn", "churn"))`,
      tests: [
        { desc: "Isi benar", expr: "kartu(df, 'X', 'churn') == {'nama': 'X', 'baris': 403, 'kolom': 10, 'target': 'churn', 'missing': 12, 'duplikat': 3}" },
        { desc: "Bekerja untuk DataFrame lain", expr: "kartu(__import__('pandas').DataFrame({'a': [1, 1]}), 'k', 'a')['duplikat'] == 1" },
      ],
      hints: ["Konsep: ringkasan dataset.", "`df.isna().sum().sum()` dan `df.duplicated().sum()`.", "Bungkus dengan int() agar hasilnya angka Python biasa."],
      explanation: "Kartu ini memberi gambaran cepat kualitas data sebelum EDA.",
    },
    {
      id: "load-ds-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Pertanyaan ML untuk Wine Quality",
      prompt: [
        "Baca `winequality-red.csv` (sep=\";\"). Simpan `n_obs`, `n_fitur` (semua kolom kecuali `quality`), dan `nilai_target` = list nilai unik `quality` yang terurut.",
        "Buat juga `bagus` = proporsi wine dengan quality ≥ 7 (3 desimal) — jika dijadikan klasifikasi biner, kelas \"bagus\" sangat sedikit. Cetak semuanya.",
      ],
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("winequality-red.csv", sep=";")
n_obs = df.shape[0]
n_fitur = df.shape[1] - 1
nilai_target = sorted(df["quality"].unique().tolist())
bagus = round((df["quality"] >= 7).mean(), 3)
print(n_obs, n_fitur, nilai_target, bagus)`,
      tests: [
        { desc: "n_obs & n_fitur", expr: "n_obs == 1599 and n_fitur == 11" },
        { desc: "nilai_target", expr: "nilai_target == [3, 4, 5, 6, 7, 8]" },
        { desc: "bagus benar", expr: "bagus == round((df['quality'] >= 7).mean(), 3)" },
      ],
      hints: ["Konsep: memahami target.", "Ingat sep=\";\".", "`sorted(df[\"quality\"].unique().tolist())`"],
      explanation: "Target quality bisa diperlakukan sebagai regresi (skor 3–8) atau klasifikasi (bagus/tidak). Hanya ~13.6% yang \"bagus\" — data imbalanced.",
    },
  ],
  quiz: [
    { id: "load-ds-q1", type: "mcq", prompt: "Dalam dataset tabular, satu baris biasanya disebut…", options: ["Fitur", "Observasi/sampel", "Target", "Lisensi"], answer: 1, explanation: "Baris = observasi." },
    { id: "load-ds-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})\nprint(df.shape[1])`, options: ["3", "2", "6", "(3, 2)"], answer: 1, explanation: "Dua kolom." },
    { id: "load-ds-q3", type: "tf", prompt: "Lisensi dataset tidak perlu diperhatikan jika data diunduh dari internet.", answer: false, explanation: "Lisensi menentukan cara data boleh dipakai." },
    { id: "load-ds-q4", type: "fill", prompt: "Prinsip \"data buruk menghasilkan model buruk\" dikenal sebagai garbage in, garbage ____", answer: ["out"], explanation: "Garbage in, garbage out." },
    { id: "load-ds-q5", type: "case", prompt: "Kolom `kode_wilayah` berisi angka 1, 2, 3. Apa langkah pertama yang tepat?", options: ["Langsung hitung rata-ratanya", "Cek dokumentasi untuk arti setiap kode", "Hapus kolom", "Kalikan 100"], answer: 1, explanation: "Angka bisa berupa kode kategori; dokumentasi menjelaskan artinya." },
  ],
  challenge: {
    id: "load-ds-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Kamus data (data dictionary)",
    prompt: [
      "Buat DataFrame `kamus` untuk `auto_mpg.csv` dengan satu baris per kolom dan kolom: `kolom`, `dtype` (teks), `contoh` (nilai pertama yang tidak kosong, sebagai teks), `n_unik`, `n_missing`, dan `peran` (\"target\" untuk mpg, \"id\" untuk car_name, selain itu \"fitur\").",
      "Cetak `kamus`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
baris = []
for c in df.columns:
    peran = "target" if c == "mpg" else ("id" if c == "car_name" else "fitur")
    baris.append({
        "kolom": c,
        "dtype": str(df[c].dtype),
        "contoh": str(df[c].dropna().iloc[0]),
        "n_unik": df[c].nunique(),
        "n_missing": int(df[c].isna().sum()),
        "peran": peran,
    })
kamus = pd.DataFrame(baris)
print(kamus)`,
    tests: [
      { desc: "Satu baris per kolom", expr: "kamus['kolom'].tolist() == df.columns.tolist()" },
      { desc: "Kolom kamus lengkap", expr: "kamus.columns.tolist() == ['kolom', 'dtype', 'contoh', 'n_unik', 'n_missing', 'peran']" },
      { desc: "Peran benar", expr: "kamus.set_index('kolom')['peran'].to_dict()['mpg'] == 'target' and kamus.set_index('kolom')['peran'].to_dict()['car_name'] == 'id' and (kamus['peran'] == 'fitur').sum() == 7" },
      { desc: "n_missing horsepower = 6", expr: "kamus.set_index('kolom').loc['horsepower', 'n_missing'] == 6" },
    ],
    hints: ["Konsep: dokumentasi struktur data.", "Loop setiap kolom dan kumpulkan dict.", "`df[c].dropna().iloc[0]` untuk contoh nilai."],
    explanation: "Kamus data adalah dokumen pertama yang dibuat tim profesional — semua anggota tim memahami arti dan peran setiap kolom dengan cara yang sama.",
  },
  summary: [
    "Dataset = kumpulan observasi (baris) dan variabel (kolom).",
    "Sumber: file, repositori publik (UCI, Kaggle), library, API/database.",
    "Baca dokumentasi: sumber, lisensi, arti kolom, target, granularitas.",
    "Jenis masalah ML ditentukan oleh pertanyaan dan target.",
  ],
  cheatsheet: [
    { syntax: "df.shape", desc: "(observasi, variabel)" },
    { syntax: "df.head()", desc: "Contoh observasi" },
    { syntax: "df.columns.tolist()", desc: "Daftar variabel" },
    { syntax: "df.isna().sum().sum()", desc: "Total missing" },
    { syntax: "df.duplicated().sum()", desc: "Baris duplikat" },
  ],
  flashcards: [
    { q: "Apa itu granularitas dataset?", a: "Satu baris mewakili apa (per hari, per pelanggan, per transaksi)" },
    { q: "Hal yang wajib dibaca di dokumentasi dataset", a: "Sumber, lisensi, arti kolom, target, cara pengumpulan" },
    { q: "Dua repositori dataset publik populer", a: "UCI Machine Learning Repository dan Kaggle Datasets" },
  ],
  references: [
    { source: "Google Machine Learning Crash Course", title: "Working with numerical data — data quality", url: "https://developers.google.com/machine-learning/crash-course/numerical-data" },
    { source: "UCI Machine Learning Repository", title: "Heart Disease dataset (variable information & license)", url: "https://archive.ics.uci.edu/dataset/45/heart+disease" },
    { source: "Kaggle", title: "Kaggle Datasets documentation", url: "https://www.kaggle.com/docs/datasets" },
    pandasDoc("Getting started — What kind of data does pandas handle?", "getting_started/intro_tutorials/01_table_oriented.html"),
  ],
};
