import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-mean-median-and-standard-deviation",
  title: "Mean, Median, and Standard Deviation",
  minutes: 45,
  prerequisites: ["np-array-operations", "np-array-dimensions"],
  visual: "mean-median",
  objectives: [
    "Menghitung mean, median, standar deviasi, dan varians dengan NumPy.",
    "Memahami kapan memakai mean dan kapan median (pengaruh outlier).",
    "Memahami perbedaan `ddof=0` (populasi) dan `ddof=1` (sampel).",
    "Menghitung statistik per kolom dengan `axis` dan mengabaikan NaN.",
    "Menerapkan standardisasi z-score secara manual.",
  ],
  definition: [
    "**Mean** (rata-rata) = jumlah semua nilai ÷ banyaknya nilai. **Median** = nilai tengah setelah data diurutkan (rata-rata dua nilai tengah jika jumlahnya genap).",
    "**Varians** mengukur seberapa jauh data menyebar dari mean: rata-rata kuadrat selisih terhadap mean. **Standar deviasi (std)** = akar varians, sehingga satuannya sama dengan data asli.",
    "Perhitungan manual untuk data [2, 4, 4, 4, 5, 5, 7, 9]: mean = 40/8 = 5. Selisih kuadrat: 9, 1, 1, 1, 0, 0, 4, 16 → total 32. Varians populasi = 32/8 = 4, std = 2.",
    "`np.std` default memakai **ddof=0** (pembagi n, populasi). Pandas `.std()` default memakai **ddof=1** (pembagi n − 1, sampel). Perbedaan kecil ini sering membingungkan — selalu sadari mana yang dipakai.",
    "Mean sangat dipengaruhi **outlier**, median tidak. Coba visualisasi di bawah.",
  ],
  why: [
    "Statistik ini adalah langkah pertama memahami fitur (EDA), dasar **StandardScaler** (z = (x − mean) / std), dan dasar strategi imputasi missing value (isi dengan mean atau median).",
    "Pada data miring (pendapatan, AQI saat kebakaran hutan), median lebih mewakili \"nilai tipikal\". Untuk metrik MAE, prediksi yang optimal secara teoritis adalah median.",
  ],
  when: [
    "- Ringkasan cepat setiap fitur numerik.",
    "- Memilih nilai imputasi (median untuk data miring/ber-outlier).",
    "- Scaling fitur sebelum KNN/SVM/Logistic Regression.",
    "- Mengukur stabilitas skor cross-validation (std kecil = stabil).",
  ],
  analogy: "Lima orang di kafe berpenghasilan 5, 6, 7, 8, 9 juta. Mean dan median sama-sama 7. Lalu seorang miliarder masuk: mean melonjak ke ratusan juta, tetapi median hampir tidak berubah. Median menggambarkan \"orang biasa\" di kafe itu; mean tertarik oleh satu nilai ekstrem.",
  syntax: {
    code: `np.mean(a)    np.median(a)
np.std(a)     np.std(a, ddof=1)
np.var(a)
X.mean(axis=0)            # per kolom
np.nanmedian(a)           # abaikan NaN
z = (X - X.mean(axis=0)) / X.std(axis=0)`,
  },
  anatomy: [
    ["np.mean(a)", "Rata-rata."],
    ["np.median(a)", "Nilai tengah setelah diurutkan."],
    ["np.std(a, ddof=0)", "Standar deviasi populasi (default NumPy)."],
    ["ddof=1", "Delta degrees of freedom: pembagi n − 1 (standar deviasi sampel)."],
    ["np.percentile(a, 50)", "Persentil ke-50 = median."],
  ],
  examples: [
    {
      title: "Contoh 1 — Hitung manual vs NumPy",
      code: `import numpy as np

x = np.array([2, 4, 4, 4, 5, 5, 7, 9])
mean = x.sum() / len(x)
var = ((x - mean) ** 2).sum() / len(x)
print("Manual:", mean, var, var ** 0.5)
print("NumPy :", np.mean(x), np.var(x), np.std(x))
print("Median:", np.median(x))`,
      output: "Manual: 5.0 4.0 2.0\nNumPy : 5.0 4.0 2.0\nMedian: 4.5",
      explain: [
        ["mean = x.sum() / len(x)", "Definisi mean."],
        ["var = ((x - mean) ** 2).sum() / len(x)", "Varians populasi: rata-rata kuadrat selisih."],
        ["np.mean(x), np.var(x), np.std(x)", "Hasil NumPy sama dengan hitungan manual."],
        ["np.median(x)", "Urutan sudah terurut; dua nilai tengah 4 dan 5 → 4.5."],
      ],
    },
    {
      title: "Contoh 2 — Pengaruh outlier",
      code: `import numpy as np

gaji = np.array([5, 6, 7, 8, 9])
print(np.mean(gaji), np.median(gaji))

gaji2 = np.append(gaji, 500)
print(np.mean(gaji2).round(1), np.median(gaji2))`,
      output: "7.0 7.0\n89.2 7.5",
      explain: [
        ["np.append(gaji, 500)", "Menambah satu nilai ekstrem (array baru)."],
        ["np.mean(gaji2)", "Mean melonjak drastis."],
        ["np.median(gaji2)", "Median hanya bergeser sedikit."],
      ],
      change: "Satu outlier cukup untuk membuat mean menyesatkan.",
    },
    {
      title: "Contoh 3 — ddof: populasi vs sampel",
      code: `import numpy as np
import pandas as pd

nilai = np.array([70, 85, 90, 65, 80])
print("np.std ddof=0:", np.std(nilai).round(4))
print("np.std ddof=1:", np.std(nilai, ddof=1).round(4))
print("Pandas .std():", pd.Series(nilai).std().round(4))`,
      output: "np.std ddof=0: 9.2736\nnp.std ddof=1: 10.3682\nPandas .std(): 10.3682",
      explain: [
        ["np.std(nilai)", "Pembagi n = 5."],
        ["np.std(nilai, ddof=1)", "Pembagi n − 1 = 4 → sedikit lebih besar."],
        ["pd.Series(nilai).std()", "Pandas memakai ddof=1 secara default — sama dengan baris sebelumnya."],
      ],
      change: "Dua fungsi \"std\" memberi angka berbeda karena konvensi pembaginya berbeda.",
    },
    {
      title: "Contoh 4 — Statistik per fitur dan z-score",
      code: `import numpy as np
import pandas as pd

X = pd.read_csv("iris.csv").drop(columns="species").to_numpy()
mean = X.mean(axis=0)
std = X.std(axis=0)
print("Mean per fitur:", mean.round(2))
print("Std per fitur :", std.round(2))

Z = (X - mean) / std
print("Mean setelah z-score:", Z.mean(axis=0).round(6))
print("Std setelah z-score :", Z.std(axis=0).round(6))`,
      output: "Mean per fitur: [5.84 3.06 3.76 1.2 ]\nStd per fitur : [0.83 0.43 1.76 0.76]\nMean setelah z-score: [-0. -0. -0. -0.]\nStd setelah z-score : [1. 1. 1. 1.]",
      explain: [
        ["mean = X.mean(axis=0)", "Rata-rata setiap kolom."],
        ["Z = (X - mean) / std", "Standardisasi manual: setiap fitur dikurangi mean-nya lalu dibagi std-nya (broadcasting)."],
        ["Z.mean(axis=0).round(6)", "Setelah standardisasi, mean setiap fitur ≈ 0 …"],
        ["Z.std(axis=0).round(6)", "… dan std setiap fitur = 1. Inilah yang dilakukan StandardScaler."],
      ],
      change: "Statistik dasar digabung menjadi teknik preprocessing yang penting.",
    },
  ],
  params: [
    {
      title: "Fungsi statistik",
      items: [
        { name: "np.mean(a, axis=None)", desc: "Rata-rata." },
        { name: "np.median(a, axis=None)", desc: "Median." },
        { name: "np.std(a, axis=None, ddof=0)", desc: "Standar deviasi; ddof=1 untuk sampel." },
        { name: "np.var(a, ddof=0)", desc: "Varians." },
        { name: "np.nanmean, np.nanmedian, np.nanstd", desc: "Versi yang mengabaikan NaN." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\na = np.array([1, 3, 3, 9])\nprint(np.mean(a), np.median(a), np.std(a))`, output: "4.0 3.0 3.0" },
  tryIt: `import numpy as np

aqi = np.array([45, 52, 60, 58, 55, 250, 62, 57])   # satu hari kebakaran hutan
print("Mean  :", np.mean(aqi))
print("Median:", np.median(aqi))
print("Std   :", np.std(aqi).round(2))
# Coba hapus nilai 250 dan bandingkan`,
  mistakes: [
    {
      title: "Mean pada data dengan NaN",
      wrong: `import numpy as np
print(np.mean(np.array([10, np.nan, 30])))   # nan`,
      fix: `import numpy as np
print(np.nanmean(np.array([10, np.nan, 30])))`,
      explain: "Gunakan versi `nan*` untuk data yang punya nilai hilang.",
    },
    {
      title: "Membandingkan std NumPy dan Pandas tanpa ddof",
      wrong: `import numpy as np
import pandas as pd
a = np.array([1, 2, 3, 4])
print(np.std(a) == pd.Series(a).std())   # False`,
      fix: `import numpy as np
import pandas as pd
a = np.array([1, 2, 3, 4])
print(np.isclose(np.std(a, ddof=1), pd.Series(a).std()))`,
      explain: "Samakan ddof sebelum membandingkan. Gunakan `np.isclose` untuk membandingkan float.",
    },
    {
      title: "Standardisasi dengan statistik seluruh array, bukan per kolom",
      wrong: `import numpy as np
X = np.array([[1, 100], [2, 200], [3, 300]])
Z = (X - X.mean()) / X.std()   # satu mean untuk semua kolom
print(Z.mean(axis=0).round(2))`,
      fix: `import numpy as np
X = np.array([[1, 100], [2, 200], [3, 300]])
Z = (X - X.mean(axis=0)) / X.std(axis=0)
print(Z.mean(axis=0).round(2))`,
      explain: "Setiap fitur harus distandardisasi dengan mean dan std miliknya sendiri (`axis=0`).",
    },
  ],
  bestPractices: [
    "Selalu laporkan mean bersama median untuk mendeteksi kemiringan dan outlier.",
    "Gunakan median untuk imputasi pada data miring.",
    "Hitung mean/std untuk scaling **hanya dari training data** (Module 07–08) agar tidak terjadi data leakage.",
    "Saat membandingkan dengan Pandas, ingat perbedaan ddof.",
  ],
  exercises: [
    {
      id: "np-stats-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Median",
      prompt: "Lengkapi agar `m` berisi median dari `data`.",
      starter: `import numpy as np
data = np.array([7, 1, 9, 3, 5])
m = np.____(data)
print(m)`,
      solution: `import numpy as np
data = np.array([7, 1, 9, 3, 5])
m = np.median(data)
print(m)`,
      tests: [{ desc: "m == 5", expr: "m == 5" }],
      hints: ["Konsep: nilai tengah.", "Nama fungsinya sama dengan istilah statistiknya.", "`np.median(data)`"],
      explanation: "Urutan: 1, 3, 5, 7, 9 → tengahnya 5.",
    },
    {
      id: "np-stats-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([1, 2, 3, 4, 100])
print(np.mean(a), np.median(a))
print(np.std(np.array([5, 5, 5])))`,
      answer: "22.0 3.0\n0.0",
      hints: ["Konsep: outlier memengaruhi mean.", "Mean = 110 / 5.", "Data identik → std 0."],
      explanation: "Mean 22.0 tertarik outlier; median 3.0; std data identik = 0.",
    },
    {
      id: "np-stats-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Std sampel",
      prompt: "Tim ingin std **sampel** (sama dengan Pandas) untuk skor CV. Perbaiki baris perhitungan `s`.",
      starter: `import numpy as np
cv = np.array([0.81, 0.84, 0.79, 0.86, 0.83])
s = np.std(cv)
print(round(s, 4))`,
      solution: `import numpy as np
cv = np.array([0.81, 0.84, 0.79, 0.86, 0.83])
s = np.std(cv, ddof=1)
print(round(s, 4))`,
      tests: [{ desc: "s = std sampel", expr: "abs(s - __import__('pandas').Series(cv).std()) < 1e-12" }],
      hints: ["Konsep: ddof.", "Std sampel memakai pembagi n − 1.", "`np.std(cv, ddof=1)`"],
      explanation: "ddof=1 menyamakan hasil dengan `pd.Series.std()`.",
    },
    {
      id: "np-stats-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Imputasi median",
      prompt: "Array `umur` punya NaN. Hitung median tanpa NaN (`np.nanmedian`), lalu buat `umur_isi` di mana NaN diganti median (`np.where(np.isnan(umur), median, umur)`). Cetak `umur_isi`.",
      starter: `import numpy as np
umur = np.array([25, np.nan, 40, 31, np.nan, 52])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
umur = np.array([25, np.nan, 40, 31, np.nan, 52])
median = np.nanmedian(umur)
umur_isi = np.where(np.isnan(umur), median, umur)
print(umur_isi)`,
      tests: [
        { desc: "Tidak ada NaN tersisa", expr: "not __import__('numpy').isnan(umur_isi).any()" },
        { desc: "NaN diganti median 35.5", expr: "umur_isi[1] == 35.5 and umur_isi[4] == 35.5" },
        { desc: "Nilai lain tidak berubah", expr: "umur_isi[0] == 25 and umur_isi[5] == 52" },
      ],
      hints: ["Konsep: imputasi median.", "`np.nanmedian(umur)` = 35.5.", "`np.where(kondisi, nilai_jika_true, nilai_jika_false)`"],
      explanation: "Inilah yang dilakukan `SimpleImputer(strategy=\"median\")` di scikit-learn.",
    },
    {
      id: "np-stats-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Statistik Student Performance",
      prompt: [
        "Baca `student_performance.csv`. Untuk kolom `absences`, hitung `mean`, `median`, dan `std` (ddof=0).",
        "Buat `miring = mean > median`. Cetak keempatnya — data ketidakhadiran biasanya miring ke kanan.",
      ],
      starter: `import numpy as np
import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
absences = pd.read_csv("student_performance.csv")["absences"].to_numpy()
mean = np.mean(absences)
median = np.median(absences)
std = np.std(absences)
miring = mean > median
print(round(mean, 2), median, round(std, 2), miring)`,
      tests: [
        { desc: "mean sesuai data", expr: "abs(mean - __import__('pandas').read_csv('student_performance.csv')['absences'].mean()) < 1e-9" },
        { desc: "median sesuai data", expr: "median == __import__('pandas').read_csv('student_performance.csv')['absences'].median()" },
        { desc: "miring True", expr: "bool(miring) is True" },
      ],
      hints: ["Konsep: mean vs median pada data nyata.", "Ambil kolom dengan `pd.read_csv(...)[\"absences\"].to_numpy()`.", "`miring = mean > median`"],
      explanation: "Banyak siswa jarang absen, sedikit siswa sangat sering absen → ekor kanan panjang, mean > median.",
    },
  ],
  quiz: [
    { id: "np-stats-q1", type: "mcq", prompt: "Ukuran pemusatan yang paling tahan terhadap outlier?", options: ["Mean", "Median", "Std", "Varians"], answer: 1, explanation: "Median tidak terpengaruh nilai ekstrem." },
    { id: "np-stats-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.median(np.array([4, 1, 3, 2])))`, options: ["3.0", "2.5", "2.0", "2.25"], answer: 1, explanation: "Urutan 1, 2, 3, 4 → (2 + 3) / 2 = 2.5." },
    { id: "np-stats-q3", type: "tf", prompt: "`np.std(a)` dan `pd.Series(a).std()` memakai ddof yang sama secara default.", answer: false, explanation: "NumPy ddof=0, Pandas ddof=1." },
    { id: "np-stats-q4", type: "fill", prompt: "Standar deviasi adalah akar dari ____", answer: ["varians", "variance"], explanation: "std = √varians." },
    { id: "np-stats-q5", type: "case", prompt: "Data AQI harian punya beberapa hari ekstrem akibat kebakaran. Untuk mengisi hari yang tidak tercatat, nilai paling aman?", options: ["Mean seluruh data", "Median (misalnya median bulan yang sama)", "Nilai maksimum", "0"], answer: 1, explanation: "Median tidak terdistorsi oleh hari ekstrem." },
  ],
  challenge: {
    id: "np-stats-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — StandardScaler manual",
    prompt: [
      "Tulis fungsi `standardize(X_train, X_test)` yang menghitung mean dan std **hanya dari X_train** (per kolom), lalu mengembalikan `(Z_train, Z_test)`.",
      "Uji dengan data di starter dan cetak `Z_train.mean(axis=0).round(6)` serta `Z_test` dibulatkan 2 desimal.",
    ],
    starter: `import numpy as np
X_train = np.array([[1.0, 100.0], [2.0, 200.0], [3.0, 300.0]])
X_test = np.array([[4.0, 150.0]])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
X_train = np.array([[1.0, 100.0], [2.0, 200.0], [3.0, 300.0]])
X_test = np.array([[4.0, 150.0]])

def standardize(X_train, X_test):
    mean = X_train.mean(axis=0)
    std = X_train.std(axis=0)
    return (X_train - mean) / std, (X_test - mean) / std

Z_train, Z_test = standardize(X_train, X_test)
print(Z_train.mean(axis=0).round(6))
print(Z_test.round(2))`,
    tests: [
      { desc: "Z_train mean per kolom ≈ 0", expr: "abs(Z_train.mean(axis=0)).max() < 1e-9" },
      { desc: "Z_train std per kolom = 1", expr: "abs(Z_train.std(axis=0) - 1).max() < 1e-9" },
      { desc: "Z_test memakai statistik train", expr: "[round(v, 2) for v in Z_test[0]] == [2.45, -0.61]" },
      { desc: "Fungsi bekerja untuk data lain", expr: "abs(standardize(__import__('numpy').array([[0.0], [2.0]]), __import__('numpy').array([[1.0]]))[1][0][0]) < 1e-12" },
    ],
    hints: ["Konsep: fit pada train, transform train & test.", "Hitung mean/std dari X_train dengan axis=0.", "Kembalikan dua array dalam satu tuple."],
    explanation: "Test tidak boleh ikut memengaruhi mean/std — inilah prinsip mencegah data leakage yang dipakai StandardScaler (`fit` pada train, `transform` pada test).",
  },
  summary: [
    "Mean = jumlah/n; median = nilai tengah; std = akar varians.",
    "Median tahan outlier; mean tidak.",
    "`np.std` ddof=0 (populasi), Pandas ddof=1 (sampel).",
    "Statistik per fitur: `axis=0`; abaikan NaN dengan `nan*`.",
    "Z-score: (x − mean) / std dengan statistik dari training data.",
  ],
  cheatsheet: [
    { syntax: "np.mean(a), np.median(a)", desc: "Pemusatan" },
    { syntax: "np.std(a, ddof=1)", desc: "Std sampel" },
    { syntax: "X.mean(axis=0)", desc: "Mean per fitur" },
    { syntax: "np.nanmedian(a)", desc: "Median tanpa NaN" },
    { syntax: "(X - mu) / sd", desc: "Z-score" },
  ],
  flashcards: [
    { q: "Standar deviasi sampel array a", a: "np.std(a, ddof=1)" },
    { q: "Median yang mengabaikan NaN", a: "np.nanmedian(a)" },
    { q: "Standardisasi kolom X dengan mean & std train", a: "(X - X_train.mean(axis=0)) / X_train.std(axis=0)" },
  ],
  references: [
    numpyDoc("Statistics routines", "reference/routines.statistics.html"),
    numpyDoc("numpy.std (parameter ddof)", "reference/generated/numpy.std.html"),
    numpyDoc("numpy.median", "reference/generated/numpy.median.html"),
    { source: "OpenIntro Statistics", title: "Chapter 2 — Summarizing data (mean, median, variance, standard deviation)", url: "https://www.openintro.org/book/os/" },
  ],
};
