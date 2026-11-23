import type { Lesson } from "../../../types.ts";
import { sklearnDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-features-and-target",
  title: "Features and Target",
  minutes: 35,
  prerequisites: ["load-introduction-to-dataset", "pd-removing-columns"],
  visual: "split",
  objectives: [
    "Membedakan **fitur** (X, input) dan **target** (y, output yang diprediksi).",
    "Menentukan target dari pertanyaan bisnis dan memilih fitur yang valid.",
    "Membedakan target regresi (angka) dan klasifikasi (kategori).",
    "Memisahkan X dan y dari DataFrame dengan konvensi scikit-learn.",
  ],
  definition: [
    "**Fitur** (*feature*, variabel independen, input) adalah kolom yang dipakai model untuk membuat prediksi. Kumpulan fitur ditulis **X** (huruf besar karena berbentuk matriks 2D: n_sampel × n_fitur).",
    "**Target** (*label*, variabel dependen, output) adalah kolom yang ingin diprediksi, ditulis **y** (huruf kecil karena vektor 1D: n_sampel). Model supervised belajar fungsi f sehingga f(X) ≈ y.",
    "Jenis target menentukan jenis masalah:\n- **Regresi** — target angka kontinu (harga rumah, PM2.5, nilai ujian)\n- **Klasifikasi** — target kategori (churn ya/tidak, spesies bunga, kualitas wine baik/buruk)\n- **Tanpa target** — clustering/unsupervised (segmentasi pelanggan)",
    "Fitur yang valid harus **tersedia pada saat prediksi dibuat**. Kolom yang baru diketahui setelah target terjadi (atau turunan langsung target) adalah **data leakage**, sedangkan ID unik biasanya tidak membawa pola.",
  ],
  why: [
    "Seluruh API scikit-learn memakai pola `model.fit(X, y)` lalu `model.predict(X_baru)`. Salah memisahkan X dan y (misalnya target ikut masuk X) membuat akurasi palsu 100%.",
    "Memilih target yang tepat adalah keputusan bisnis: \"memprediksi apakah pelanggan akan churn bulan depan\" berbeda dengan \"memprediksi berapa lama pelanggan bertahan\".",
  ],
  when: [
    "- Tepat setelah memahami dataset dan pertanyaan.",
    "- Sebelum splitting data dan preprocessing.",
    "- Saat mengevaluasi apakah sebuah kolom boleh menjadi fitur.",
  ],
  analogy: "Fitur adalah **gejala** yang diperiksa dokter (suhu, tekanan darah, umur), sedangkan target adalah **diagnosis** yang ingin ditebak. Dokter tidak boleh melihat hasil lab yang baru keluar besok (leakage) saat membuat diagnosis hari ini.",
  syntax: {
    code: `X = df.drop(columns=["target", "id"])   # fitur: DataFrame 2D
y = df["target"]                          # target: Series 1D
print(X.shape, y.shape)                   # (n, p) (n,)
# model.fit(X, y)`,
  },
  anatomy: [
    ["X", "Matriks fitur (n_sampel × n_fitur)."],
    ["y", "Vektor target (n_sampel,)."],
    ["df.drop(columns=[...])", "Semua kolom kecuali target dan non-fitur."],
    ["model.fit(X, y)", "Konvensi scikit-learn."],
  ],
  examples: [
    {
      title: "Contoh 1 — Memisahkan X dan y",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
X = df.drop(columns=["house_id", "price_million"])
y = df["price_million"]
print("X:", X.shape, X.columns.tolist())
print("y:", y.shape, y.name)`,
      output: "X: (300, 6) ['city', 'area_m2', 'bedrooms', 'bathrooms', 'age_years', 'distance_to_center_km']\ny: (300,) price_million",
      explain: [
        ["X = df.drop(columns=[\"house_id\", \"price_million\"])", "Buang ID (bukan fitur) dan target."],
        ["y = df[\"price_million\"]", "Target harga → masalah regresi."],
        ["X.shape", "300 rumah × 6 fitur; y berbentuk (300,)."],
      ],
    },
    {
      title: "Contoh 2 — Regresi atau klasifikasi?",
      code: `import pandas as pd

def jenis_masalah(y):
    if y.dtype == "str" or y.dtype == "bool" or y.nunique() <= 10:
        return f"klasifikasi ({y.nunique()} kelas)"
    return "regresi"

print("Harga rumah :", jenis_masalah(pd.read_csv("house_prices.csv")["price_million"]))
print("Spesies iris:", jenis_masalah(pd.read_csv("iris.csv")["species"]))
print("Churn       :", jenis_masalah(pd.read_csv("customer_churn.csv")["churn"]))
print("MPG mobil   :", jenis_masalah(pd.read_csv("auto_mpg.csv")["mpg"]))`,
      output: "Harga rumah : regresi\nSpesies iris: klasifikasi (3 kelas)\nChurn       : klasifikasi (2 kelas)\nMPG mobil   : regresi",
      explain: [
        ["def jenis_masalah(y):", "Heuristik sederhana: teks/boolean atau sedikit nilai unik → klasifikasi."],
        ["y.nunique() <= 10", "Batas 10 hanyalah aturan praktis; keputusan akhir tetap dari arti target (misalnya skor quality 3–8 bisa keduanya)."],
      ],
      change: "Kita menilai jenis masalah dari target beberapa dataset.",
    },
    {
      title: "Contoh 3 — Satu dataset, target berbeda",
      code: `import pandas as pd

df = pd.read_csv("student_performance.csv")
y_reg = df["G3"]
y_clf = (df["G3"] >= 10).astype(int)
X = df.drop(columns=["G3"])
print("Regresi:", y_reg.describe()[["mean", "min", "max"]].round(2).to_dict())
print("Klasifikasi:", y_clf.value_counts().to_dict())
print("Fitur:", X.shape[1], "kolom — termasuk G1 dan G2 (nilai periode sebelumnya)")`,
      output: "Regresi: {'mean': 10.42, 'min': 0.0, 'max': 20.0}\nKlasifikasi: {1: 265, 0: 130}\nFitur: 32 kolom — termasuk G1 dan G2 (nilai periode sebelumnya)",
      explain: [
        ["y_reg = df[\"G3\"]", "Prediksi nilai akhir 0–20."],
        ["y_clf = (df[\"G3\"] >= 10).astype(int)", "Prediksi lulus/tidak (target biner)."],
        ["X = df.drop(columns=[\"G3\"])", "G1 dan G2 tetap menjadi fitur — tetapi lihat contoh berikutnya."],
      ],
      change: "Target dibentuk dari pertanyaan yang berbeda.",
    },
    {
      title: "Contoh 4 — Fitur yang valid tergantung waktu prediksi",
      code: `import pandas as pd

df = pd.read_csv("student_performance.csv")
korelasi = df[["G1", "G2", "studytime", "failures", "absences"]].corrwith(df["G3"]).round(3)
print(korelasi.sort_values(ascending=False))

# Skenario A: prediksi di akhir periode 2 → G1, G2 sudah diketahui (boleh)
X_akhir = df.drop(columns=["G3"])
# Skenario B: prediksi di awal tahun → G1, G2 belum ada (harus dibuang)
X_awal = df.drop(columns=["G3", "G1", "G2"])
print(X_akhir.shape[1], "fitur vs", X_awal.shape[1], "fitur")`,
      output: "G2           0.905\nG1           0.801\nstudytime    0.098\nabsences     0.034\nfailures    -0.360\ndtype: float64\n32 fitur vs 30 fitur",
      explain: [
        ["corrwith(df[\"G3\"])", "G1 dan G2 berkorelasi sangat tinggi dengan G3."],
        ["X_akhir = df.drop(columns=[\"G3\"])", "Valid jika prediksi dibuat setelah G1, G2 keluar."],
        ["X_awal = df.drop(columns=[\"G3\", \"G1\", \"G2\"])", "Untuk deteksi dini di awal tahun, G1/G2 belum tersedia — memakainya = leakage. Penulis dataset (Cortez & Silva, 2008) membandingkan kedua skenario ini."],
      ],
      change: "Pemilihan fitur bergantung pada kapan prediksi akan dipakai.",
    },
  ],
  params: [
    {
      title: "Istilah",
      items: [
        { name: "Fitur / X / input / variabel independen", desc: "Informasi untuk memprediksi." },
        { name: "Target / y / label / variabel dependen", desc: "Yang diprediksi." },
        { name: "Regresi", desc: "y numerik kontinu." },
        { name: "Klasifikasi biner / multikelas", desc: "y dua kelas / lebih dari dua kelas." },
        { name: "Data leakage", desc: "Fitur berisi informasi yang tidak tersedia saat prediksi." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.read_csv("iris.csv")\nX, y = df.drop(columns="species"), df["species"]\nprint(X.shape, y.shape, y.nunique())`, output: "(150, 4) (150,) 3" },
  tryIt: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
X = df.drop(columns=["customer_id", "churn"])
y = df["churn"]
print(X.columns.tolist())
print(y.value_counts(normalize=True).round(3))`,
  mistakes: [
    {
      title: "Target ikut masuk ke X",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv")
X = df
y = df["species"]
print("species" in X.columns)   # True → model curang`,
      fix: `import pandas as pd
df = pd.read_csv("iris.csv")
X = df.drop(columns="species")
y = df["species"]
print("species" in X.columns)`,
      explain: "Jika target ada di X, model cukup \"menyalin\" kolom itu. Selalu buang target dari X.",
    },
    {
      title: "y berbentuk DataFrame, bukan Series",
      wrong: `import pandas as pd
df = pd.read_csv("house_prices.csv")
y = df[["price_million"]]
print(y.shape)   # (300, 1) — banyak model memberi warning`,
      fix: `import pandas as pd
df = pd.read_csv("house_prices.csv")
y = df["price_million"]
print(y.shape)`,
      explain: "Untuk satu target, gunakan Series 1D (`df[\"kolom\"]`). Shape (n, 1) bisa memicu DataConversionWarning dan bug broadcasting.",
    },
    {
      title: "Nama target salah ketik",
      wrong: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
X = df.drop(columns="Churn")`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
X = df.drop(columns="churn")
print(X.shape)`,
      explain: "Nama kolom case-sensitive. Periksa `df.columns` terlebih dahulu.",
    },
  ],
  bestPractices: [
    "Tulis pertanyaan prediksi dalam satu kalimat: \"Memprediksi [target] untuk [unit] pada [waktu] memakai informasi yang tersedia pada [waktu]\".",
    "Simpan nama target dalam variabel (`TARGET = \"churn\"`) agar konsisten.",
    "Buang ID dan kolom leakage dari X; dokumentasikan alasannya.",
    "Periksa distribusi y (`value_counts` atau `describe`) sebelum memilih metrik.",
  ],
  exercises: [
    {
      id: "load-ft-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Target",
      prompt: "Lengkapi agar `y` berisi kolom target `final_score`.",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
X = df.drop(columns=["student_id", "final_score"])
y = df____
print(X.shape, y.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
X = df.drop(columns=["student_id", "final_score"])
y = df["final_score"]
print(X.shape, y.shape)`,
      tests: [{ desc: "y Series final_score", expr: "type(y).__name__ == 'Series' and y.name == 'final_score'" }],
      hints: ["Konsep: target sebagai Series 1D.", "Pilih satu kolom dengan nama.", "`df[\"final_score\"]`"],
      explanation: "Satu kurung siku → Series.",
    },
    {
      id: "load-ft-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"id": [1, 2, 3], "umur": [20, 30, 40], "gaji": [5, 7, 9], "beli": [0, 1, 1]})
X = df.drop(columns=["id", "beli"])
y = df["beli"]
print(X.shape, y.shape)
print(X.columns.tolist())`,
      answer: "(3, 2) (3,)\n['umur', 'gaji']",
      hints: ["Konsep: drop id dan target.", "Tersisa umur dan gaji.", "y 1D."],
      explanation: "(3, 2) (3,); ['umur', 'gaji'].",
    },
    {
      id: "load-ft-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Target bocor",
      prompt: "X masih berisi target `species`. Perbaiki agar X hanya berisi 4 fitur numerik.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
X = df
y = df["species"]
print(X.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
X = df.drop(columns="species")
y = df["species"]
print(X.shape)`,
      tests: [{ desc: "X (150, 4) tanpa species", expr: "X.shape == (150, 4) and 'species' not in X.columns" }],
      hints: ["Konsep: memisahkan target.", "Gunakan drop.", "`df.drop(columns=\"species\")`"],
      explanation: "Target tidak boleh menjadi fitur.",
    },
    {
      id: "load-ft-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi pisah X y",
      prompt: "Tulis fungsi `pisah(df, target, buang=())` yang mengembalikan `(X, y)`: y = kolom target, X = df tanpa target dan tanpa kolom di `buang`. Uji pada `heart_disease.csv` dengan target `num`, lalu ubah y menjadi biner `(y > 0).astype(int)` dan cetak `X.shape` serta `y.value_counts()`.",
      starter: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("heart_disease.csv")

def pisah(df, target, buang=()):
    y = df[target]
    X = df.drop(columns=[target, *buang])
    return X, y

X, y = pisah(df, "num")
y = (y > 0).astype(int)
print(X.shape)
print(y.value_counts())`,
      tests: [
        { desc: "X tanpa num", expr: "X.shape == (303, 13) and 'num' not in X.columns" },
        { desc: "y biner", expr: "set(y.unique()) == {0, 1}" },
        { desc: "Parameter buang bekerja", expr: "pisah(df, 'num', buang=('age',))[0].shape[1] == 12" },
      ],
      hints: ["Konsep: fungsi yang dapat dipakai ulang.", "`df.drop(columns=[target, *buang])`", "Return dua nilai."],
      explanation: "Target num 0–4 diubah menjadi biner sesuai dokumentasi UCI: ada atau tidak ada penyakit.",
    },
    {
      id: "load-ft-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Fitur realistis untuk deteksi dini",
      prompt: [
        "Sekolah ingin mendeteksi siswa berisiko tidak lulus **di awal tahun ajaran**. Dari `student_performance.csv` buat `y = (df[\"G3\"] < 10).astype(int)` (1 = berisiko).",
        "Buat `X` yang hanya memakai informasi yang tersedia di awal tahun (buang G1, G2, G3). Cetak `X.shape`, proporsi siswa berisiko (3 desimal), dan apakah ada kolom yang diawali \"G\" di X.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("student_performance.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("student_performance.csv")
y = (df["G3"] < 10).astype(int)
X = df.drop(columns=["G1", "G2", "G3"])
print(X.shape)
print(round(y.mean(), 3))
print(any(c.startswith("G") for c in X.columns))`,
      tests: [
        { desc: "X tanpa G1-G3", expr: "X.shape == (395, 30) and not any(c in X.columns for c in ['G1', 'G2', 'G3'])" },
        { desc: "y benar", expr: "(y == (df['G3'] < 10).astype(int)).all()" },
      ],
      hints: ["Konsep: fitur harus tersedia saat prediksi.", "Nilai periode belum ada di awal tahun.", "drop G1, G2, G3."],
      explanation: "Tanpa G1/G2 model akan lebih lemah, tetapi bisa dipakai lebih awal untuk intervensi — trade-off yang nyata dalam desain sistem ML.",
    },
  ],
  quiz: [
    { id: "load-ft-q1", type: "mcq", prompt: "Memprediksi harga rumah adalah masalah…", options: ["Klasifikasi", "Regresi", "Clustering", "Bukan ML"], answer: 1, explanation: "Target numerik kontinu." },
    { id: "load-ft-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2], "y": [0, 1]})\nprint(df["y"].ndim, df[["a"]].ndim)`, options: ["2 1", "1 2", "1 1", "2 2"], answer: 1, explanation: "Series 1D, DataFrame 2D." },
    { id: "load-ft-q3", type: "tf", prompt: "Kolom yang baru diketahui setelah kejadian target boleh dipakai sebagai fitur asalkan meningkatkan akurasi.", answer: false, explanation: "Itu data leakage; model tidak akan bekerja di dunia nyata." },
    { id: "load-ft-q4", type: "fill", prompt: "Dalam konvensi scikit-learn, matriks fitur ditulis dengan huruf ____ (besar/kecil)", answer: ["besar", "X"], explanation: "X besar (2D), y kecil (1D)." },
    { id: "load-ft-q5", type: "case", prompt: "Kompetisi memprediksi PM2.5 harian 1 Jan–31 Mar 2026; test.csv hanya berisi kalender libur. Fitur mana yang TIDAK tersedia untuk test?", options: ["Bulan", "Hari dalam seminggu", "PM2.5 aktual hari yang sama", "Penanda hari libur"], answer: 2, explanation: "PM2.5 hari itu justru targetnya." },
  ],
  challenge: {
    id: "load-ft-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Validasi pemisahan X/y",
    prompt: [
      "Tulis fungsi `cek_xy(X, y, id_cols=())` yang mengembalikan list pesan masalah (list kosong jika aman):",
      "- \"panjang berbeda\" jika `len(X) != len(y)`\n- \"y bukan 1D\" jika `y.ndim != 1`\n- \"target ada di X\" jika `y.name in X.columns`\n- \"ID di X: <nama>\" untuk setiap kolom di `id_cols` yang ada di X\n- \"y punya missing\" jika y mengandung NaN",
      "Uji pada pemisahan yang benar dan salah dari `customer_churn.csv`, cetak hasil keduanya.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")

def cek_xy(X, y, id_cols=()):
    masalah = []
    if len(X) != len(y):
        masalah.append("panjang berbeda")
    if y.ndim != 1:
        masalah.append("y bukan 1D")
    if getattr(y, "name", None) in X.columns:
        masalah.append("target ada di X")
    for c in id_cols:
        if c in X.columns:
            masalah.append(f"ID di X: {c}")
    if pd.isna(y).any().any() if y.ndim > 1 else pd.isna(y).any():
        masalah.append("y punya missing")
    return masalah

benar = cek_xy(df.drop(columns=["customer_id", "churn"]), df["churn"], id_cols=["customer_id"])
salah = cek_xy(df, df["churn"], id_cols=["customer_id"])
print(benar)
print(salah)`,
    tests: [
      { desc: "Pemisahan benar → []", expr: "cek_xy(df.drop(columns=['customer_id', 'churn']), df['churn'], id_cols=['customer_id']) == []" },
      { desc: "Target & ID terdeteksi", expr: "cek_xy(df, df['churn'], id_cols=['customer_id']) == ['target ada di X', 'ID di X: customer_id']" },
      { desc: "Panjang berbeda terdeteksi", expr: "'panjang berbeda' in cek_xy(df.drop(columns='churn').head(10), df['churn'])" },
      { desc: "Missing y terdeteksi", expr: "'y punya missing' in cek_xy(df[['tenure_months']], df['age'])" },
    ],
    hints: ["Konsep: pemeriksaan otomatis (assertion) sebelum training.", "Kumpulkan pesan di list dengan if bertingkat (bukan elif).", "`y.name in X.columns`, `pd.isna(y).any()`."],
    explanation: "Pemeriksaan sederhana seperti ini mencegah bug paling mahal di proyek ML: target bocor, ID ikut terlatih, atau baris X dan y tidak sejajar.",
  },
  summary: [
    "X = fitur (2D), y = target (1D); model belajar f(X) ≈ y.",
    "Target numerik → regresi; kategori → klasifikasi; tanpa target → unsupervised.",
    "Fitur valid harus tersedia saat prediksi dibuat — selain itu leakage.",
    "Buang target, ID, dan kolom leakage dari X.",
  ],
  cheatsheet: [
    { syntax: "X = df.drop(columns=[target, id])", desc: "Fitur" },
    { syntax: "y = df[target]", desc: "Target" },
    { syntax: "y.value_counts(normalize=True)", desc: "Distribusi kelas" },
    { syntax: "y.describe()", desc: "Distribusi target regresi" },
    { syntax: "model.fit(X, y)", desc: "Konvensi scikit-learn" },
  ],
  flashcards: [
    { q: "Mengapa X huruf besar dan y huruf kecil?", a: "X matriks 2D (n × p), y vektor 1D (n,)" },
    { q: "Syarat fitur yang valid", a: "Tersedia pada saat prediksi dibuat (bukan informasi masa depan/turunan target)" },
    { q: "Target \"lulus/tidak lulus\" termasuk masalah apa?", a: "Klasifikasi biner" },
  ],
  references: [
    sklearnDoc("Getting started — Fitting and predicting: estimator basics", "getting_started.html#fitting-and-predicting-estimator-basics"),
    sklearnDoc("Glossary — X and y", "glossary.html#term-X"),
    { source: "Google Machine Learning Crash Course", title: "Framing an ML problem — features and labels", url: "https://developers.google.com/machine-learning/problem-framing" },
    { source: "UCI Machine Learning Repository", title: "Student Performance — Cortez & Silva (2008)", url: "https://archive.ics.uci.edu/dataset/320/student+performance" },
  ],
};
