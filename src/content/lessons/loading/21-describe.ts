import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-describe",
  title: "df.describe()",
  minutes: 35,
  prerequisites: ["load-df-dtypes", "np-mean-median-and-standard-deviation"],
  visual: "mean-median",
  objectives: [
    "Membaca setiap baris `describe()` untuk kolom numerik: count, mean, std, min, 25%, 50%, 75%, max.",
    "Membaca describe untuk kolom kategori: count, unique, top, freq.",
    "Menarik kesimpulan awal: missing, skala berbeda, kemiringan, dan outlier/nilai mustahil.",
    "Mengatur persentil, memilih tipe kolom, dan membandingkan statistik per kelompok.",
  ],
  definition: [
    "`df.describe()` menghitung **statistik ringkas** setiap kolom numerik:\n- `count` — jumlah nilai terisi (bukan NaN)\n- `mean` — rata-rata; `std` — standar deviasi sampel (ddof=1)\n- `min`, `max` — nilai terkecil/terbesar\n- `25%`, `50%`, `75%` — kuartil (50% = median)",
    "Untuk kolom kategori/teks (`include=\"str\"` atau `include=\"all\"`) hasilnya: `count`, `unique` (jumlah kategori), `top` (kategori tersering), dan `freq` (frekuensi top).",
    "Cara membaca cepat:\n- count < jumlah baris → ada missing\n- mean jauh di atas median (50%) → miring ke kanan / ada nilai besar ekstrem\n- max jauh di atas 75% → kemungkinan outlier\n- min/max tidak masuk akal (umur −5, PM2.5 negatif) → kesalahan data\n- skala antarkolom sangat berbeda → perlu scaling untuk model berbasis jarak",
  ],
  why: [
    "describe adalah ringkasan statistik tercepat untuk EDA awal: satu perintah menunjukkan rentang, pusat, sebaran, dan anomali setiap fitur.",
    "Keputusan preprocessing (imputasi median vs mean, log transform, clipping outlier, scaling) sering langsung terlihat dari tabel describe.",
  ],
  when: [
    "- Setelah info/dtypes saat memahami dataset baru.",
    "- Membandingkan train dan test (apakah distribusinya mirip?).",
    "- Membandingkan statistik antar-kelompok target.",
    "- Memeriksa hasil preprocessing (misalnya setelah scaling, mean ≈ 0 dan std ≈ 1).",
  ],
  analogy: "describe seperti **rapor kelas**: rata-rata nilai, nilai tertinggi dan terendah, serta posisi kuartil. Guru langsung tahu apakah ada siswa dengan nilai mencurigakan (salah input) atau kelas yang nilainya timpang.",
  syntax: {
    code: `df.describe()                         # kolom numerik
df.describe(include="str")            # kolom teks
df.describe(include="all")            # semua kolom
df.describe(percentiles=[.05, .5, .95])
df.describe().T                       # transpose: satu baris per kolom
df.groupby("target")["fitur"].describe()`,
  },
  anatomy: [
    ["count", "Nilai terisi."],
    ["mean / std", "Rata-rata / sebaran."],
    ["25% / 50% / 75%", "Kuartil; 50% = median."],
    ["unique / top / freq", "Untuk kolom kategori."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membaca describe numerik",
      code: `import pandas as pd

df = pd.read_csv("student_performance.csv")
print(df[["age", "absences", "G1", "G3"]].describe().round(2))`,
      output: "          age  absences      G1      G3\ncount  395.00    395.00  395.00  395.00\nmean    16.70      5.71   10.91   10.42\nstd      1.28      8.00    3.32    4.58\nmin     15.00      0.00    3.00    0.00\n25%     16.00      0.00    8.00    8.00\n50%     17.00      4.00   11.00   11.00\n75%     18.00      8.00   13.00   14.00\nmax     22.00     75.00   19.00   20.00",
      explain: [
        ["describe()", "Semua count = 395 → tidak ada missing."],
        ["absences", "mean 5.71 > median 4, max 75 jauh di atas 75% (8) → sangat miring dengan outlier."],
        ["G3", "min 0 — nilai akhir 0 dicatat untuk siswa yang tidak ikut ujian; perlu diperhatikan saat modeling."],
      ],
    },
    {
      title: "Contoh 2 — Kolom kategori",
      code: `import pandas as pd

df = pd.read_csv("bank_marketing.csv")
print(df.describe(include="str").T)`,
      output: "          count unique         top  freq\njob        4521     12  management   969\nmarital    4521      3     married  2797\neducation  4521      4   secondary  2306\ndefault    4521      2          no  4445\nhousing    4521      2         yes  2559\nloan       4521      2          no  3830\ncontact    4521      3    cellular  2896\nmonth      4521     12         may  1398\npoutcome   4521      4     unknown  3705\ny          4521      2          no  4000",
      explain: [
        ["describe(include=\"str\")", "count, unique, top, freq untuk setiap kolom teks."],
        [".T", "Transpose agar satu baris per kolom — lebih mudah dibaca."],
        ["print(df.describe(include=\"str\").T)", "poutcome paling sering \"unknown\" dan y paling sering \"no\" (imbalanced)."],
      ],
      change: "describe untuk data kategori.",
    },
    {
      title: "Contoh 3 — Persentil kustom untuk mendeteksi outlier",
      code: `import pandas as pd

df = pd.read_csv("wholesale_customers.csv")
d = df[["Fresh", "Milk", "Grocery"]].describe(percentiles=[0.5, 0.95, 0.99]).T
d["max/p99"] = (d["max"] / d["99%"]).round(1)
d["mean/median"] = (d["mean"] / d["50%"]).round(2)
print(d[["mean", "50%", "95%", "99%", "max", "max/p99", "mean/median"]].round(0))`,
      output: "            mean     50%      95%      99%       max  max/p99  mean/median\nFresh    12000.0  8504.0  36818.0  56083.0  112151.0      2.0          1.0\nMilk      5796.0  3627.0  16843.0  37610.0   73498.0      2.0          2.0\nGrocery   7951.0  4756.0  24033.0  43436.0   92780.0      2.0          2.0",
      explain: [
        ["percentiles=[0.5, 0.95, 0.99]", "Persentil ekor atas untuk melihat seberapa ekstrem nilai terbesar."],
        ["d[\"max\"] / d[\"99%\"]", "Rasio max terhadap persentil 99: rasio besar = segelintir pelanggan sangat besar."],
        ["d[\"mean\"] / d[\"50%\"]", "Mean jauh di atas median → distribusi miring kanan (kandidat log transform)."],
      ],
      change: "Persentil disesuaikan untuk analisis ekor distribusi.",
    },
    {
      title: "Contoh 4 — describe per kelompok target",
      code: `import pandas as pd

df = pd.read_csv("heart_disease.csv")
df["sakit"] = (df["num"] > 0).astype(int)
print(df.groupby("sakit")["thalach"].describe().round(1))
print(df.groupby("sakit")[["age", "chol"]].median())`,
      output: "       count   mean   std   min    25%    50%    75%    max\nsakit                                                      \n0      164.0  158.4  19.2  96.0  148.8  161.0  172.0  202.0\n1      139.0  139.3  22.6  71.0  125.0  142.0  156.5  195.0\n        age   chol\nsakit             \n0      52.0  234.5\n1      58.0  249.0",
      explain: [
        ["df.groupby(\"sakit\")[\"thalach\"].describe()", "Statistik detak jantung maksimum untuk pasien sehat vs sakit."],
        ["median()", "Median umur dan kolesterol per kelompok — pasien sakit cenderung lebih tua dengan detak maksimum lebih rendah."],
      ],
      change: "describe dipakai untuk membandingkan kelompok target.",
    },
  ],
  params: [
    {
      title: "df.describe()",
      items: [
        { name: "percentiles=None", desc: "List antara 0–1; default [.25, .5, .75]." },
        { name: "include=None", desc: "\"all\", \"number\", \"str\", \"category\", atau list tipe." },
        { name: "exclude=None", desc: "Tipe yang dikecualikan." },
        { name: ".T", desc: "Transpose hasil untuk banyak kolom." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ns = pd.Series([1, 2, 3, 4, 100])\nd = s.describe()\nprint(d["count"], d["50%"], d["mean"], d["max"])`, output: "5.0 3.0 22.0 100.0" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.describe().T.round(1))
print(df.describe(include="str"))`,
  mistakes: [
    {
      title: "Mengira std describe sama dengan np.std",
      wrong: `import numpy as np
import pandas as pd
s = pd.Series([2, 4, 4, 4, 5, 5, 7, 9])
print(s.describe()["std"] == np.std(s))   # False`,
      fix: `import numpy as np
import pandas as pd
s = pd.Series([2, 4, 4, 4, 5, 5, 7, 9])
print(np.isclose(s.describe()["std"], np.std(s, ddof=1)))`,
      explain: "describe memakai std sampel (ddof=1), sedangkan np.std default ddof=0.",
    },
    {
      title: "Kolom teks tidak muncul",
      wrong: `import pandas as pd
df = pd.DataFrame({"kota": ["A", "B", "A"], "n": [1, 2, 3]})
print(df.describe().columns.tolist())   # hanya ['n']`,
      fix: `import pandas as pd
df = pd.DataFrame({"kota": ["A", "B", "A"], "n": [1, 2, 3]})
print(df.describe(include="all").columns.tolist())`,
      explain: "Default describe hanya kolom numerik. Gunakan include=\"all\" atau include=\"str\".",
    },
    {
      title: "Persentil di luar rentang 0–1",
      wrong: `import pandas as pd
print(pd.Series([1, 2, 3]).describe(percentiles=[90]))`,
      error: "ValueError",
      fix: `import pandas as pd
print(pd.Series([1, 2, 3]).describe(percentiles=[0.9]))`,
      explain: "percentiles ditulis sebagai pecahan 0–1 (0.9 = persentil 90).",
    },
  ],
  bestPractices: [
    "Bandingkan mean dengan median (50%) di setiap kolom untuk melihat kemiringan.",
    "Periksa min/max terhadap batas logis domain.",
    "Gunakan `describe().T` untuk dataset dengan banyak kolom.",
    "Bandingkan describe train vs test untuk mendeteksi perbedaan distribusi.",
  ],
  exercises: [
    {
      id: "load-desc-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Semua kolom",
      prompt: "Lengkapi agar describe mencakup kolom numerik dan teks.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
d = df.describe(include="____")
print(d.columns.tolist())`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
d = df.describe(include="all")
print(d.columns.tolist())`,
      tests: [{ desc: "Semua kolom", expr: "d.columns.tolist() == df.columns.tolist()" }],
      hints: ["Konsep: include.", "Bukan hanya numerik.", "`\"all\"`"],
      explanation: "include=\"all\" menampilkan semua kolom; statistik yang tidak berlaku diisi NaN.",
    },
    {
      id: "load-desc-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
s = pd.Series([10, 20, 30, 40, None])
d = s.describe()
print(d["count"], d["min"], d["50%"], d["max"])
print(pd.Series(["a", "b", "a", "a"]).describe().tolist())`,
      answer: "4.0 10.0 25.0 40.0\n[np.int64(4), 2, 'a', np.int64(3)]",
      hints: ["Konsep: count tanpa NaN.", "Median 10, 20, 30, 40 = 25.", "Kategori: count, unique, top, freq."],
      explanation: "4.0 10.0 25.0 40.0; [4, 2, 'a', 3].",
    },
    {
      id: "load-desc-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Persentil 95",
      prompt: "Perbaiki agar `p95` berisi persentil ke-95 dari `pm25` lewat describe.",
      starter: `import pandas as pd
pm25 = pd.Series(range(1, 101))
d = pm25.describe(percentiles=[95])
p95 = d["95%"]
print(p95)`,
      solution: `import pandas as pd
pm25 = pd.Series(range(1, 101))
d = pm25.describe(percentiles=[0.95])
p95 = d["95%"]
print(p95)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "p95 benar", expr: "abs(p95 - 95.05) < 1e-9" },
      ],
      hints: ["Konsep: persentil sebagai pecahan.", "95% ditulis 0.95.", "`percentiles=[0.95]`"],
      explanation: "Persentil 95 dengan interpolasi linear: 95.05.",
    },
    {
      id: "load-desc-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Deteksi kemiringan dari describe",
      prompt: "Tulis fungsi `kolom_miring(df, rasio=1.2)` yang mengembalikan list kolom numerik dengan `mean / median > rasio` (median > 0), dihitung dari `df.describe().T`. Uji pada `wholesale_customers.csv` (abaikan Channel & Region) dan cetak hasilnya.",
      starter: `import pandas as pd
df = pd.read_csv("wholesale_customers.csv").drop(columns=["Channel", "Region"])
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("wholesale_customers.csv").drop(columns=["Channel", "Region"])

def kolom_miring(df, rasio=1.2):
    d = df.describe().T
    d = d[d["50%"] > 0]
    return d.index[d["mean"] / d["50%"] > rasio].tolist()

print(kolom_miring(df))`,
      tests: [
        { desc: "Hasil sesuai definisi", expr: "kolom_miring(df) == [c for c in df.columns if df[c].median() > 0 and df[c].mean() / df[c].median() > 1.2]" },
        { desc: "Semua kolom belanja miring", expr: "len(kolom_miring(df)) == 6" },
        { desc: "Rasio tinggi menyaring", expr: "len(kolom_miring(df, rasio=2.0)) < 6" },
      ],
      hints: ["Konsep: mean vs median.", "describe().T → baris per kolom.", "Filter rasio dengan mask."],
      explanation: "Semua kategori belanja grosir miring ke kanan — kandidat kuat untuk log transform sebelum clustering.",
    },
    {
      id: "load-desc-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Bandingkan train dan test",
      prompt: [
        "Dari `auto_mpg.csv`, urutkan berdasarkan `model_year` lalu split 80/20 berurutan (`train`, `test`). Buat `banding` = DataFrame berisi `mean` train, `mean` test, dan `selisih_pct` = (test − train) / train × 100 (1 desimal) untuk kolom `mpg`, `weight`, `horsepower`, `displacement`.",
        "Cetak `banding` — mobil di test (tahun lebih baru) seharusnya lebih ringan dan lebih irit.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv").sort_values("model_year", kind="stable")
n = int(len(df) * 0.8)
train, test = df.iloc[:n], df.iloc[n:]
kol = ["mpg", "weight", "horsepower", "displacement"]
banding = pd.DataFrame({
    "train": train[kol].describe().loc["mean"],
    "test": test[kol].describe().loc["mean"],
})
banding["selisih_pct"] = ((banding["test"] - banding["train"]) / banding["train"] * 100).round(1)
print(banding.round(1))`,
      tests: [
        { desc: "Kolom banding", expr: "banding.columns.tolist() == ['train', 'test', 'selisih_pct'] and banding.index.tolist() == ['mpg', 'weight', 'horsepower', 'displacement']" },
        { desc: "mpg naik, weight turun", expr: "banding.loc['mpg', 'selisih_pct'] > 0 and banding.loc['weight', 'selisih_pct'] < 0" },
        { desc: "Mean benar", expr: "abs(banding.loc['mpg', 'train'] - df.sort_values('model_year', kind='stable').iloc[:int(len(df) * 0.8)]['mpg'].mean()) < 1e-9" },
      ],
      hints: ["Konsep: membandingkan distribusi train/test.", "describe().loc[\"mean\"] untuk baris mean.", "Selisih persen relatif terhadap train."],
      explanation: "Perbedaan besar antara train dan test (distribution shift) memperingatkan bahwa skor validasi acak bisa terlalu optimis — penting untuk forecasting.",
    },
  ],
  quiz: [
    { id: "load-desc-q1", type: "mcq", prompt: "Baris `50%` pada describe adalah…", options: ["Mean", "Median", "Setengah jumlah data", "Std"], answer: 1, explanation: "Persentil 50 = median." },
    { id: "load-desc-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(pd.Series([1, 1, 2, 10]).describe()[["mean", "50%"]].tolist())`, options: ["[1.5, 3.5]", "[3.5, 1.5]", "[3.5, 2.0]", "[1.0, 1.5]"], answer: 1, explanation: "Mean 3.5, median 1.5." },
    { id: "load-desc-q3", type: "tf", prompt: "Jika `count` sebuah kolom lebih kecil dari jumlah baris, kolom itu punya missing value.", answer: true, explanation: "count hanya menghitung nilai terisi." },
    { id: "load-desc-q4", type: "fill", prompt: "Statistik describe untuk kategori tersering: `____`", answer: ["top"], explanation: "top (dengan freq)." },
    { id: "load-desc-q5", type: "case", prompt: "describe menunjukkan kolom `umur`: min = −3, max = 230. Kesimpulan?", options: ["Data normal", "Ada kesalahan input yang harus dibersihkan", "Perlu scaling saja", "Kolom harus dihapus"], answer: 1, explanation: "Nilai di luar batas logis = kesalahan data." },
  ],
  challenge: {
    id: "load-desc-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Alarm otomatis dari describe",
    prompt: [
      "Tulis fungsi `alarm(df, batas)` dengan `batas` = dict `{kolom: (min_logis, max_logis)}`. Berdasarkan `df.describe().T` untuk kolom numerik, kembalikan list pesan:",
      "- \"<kol>: missing <n>\" jika count < jumlah baris\n- \"<kol>: di bawah batas\" / \"<kol>: di atas batas\" jika min/max melanggar batas (hanya kolom di `batas`)\n- \"<kol>: miring\" jika mean/median > 1.5 (median > 0)\n- \"<kol>: outlier ekstrem\" jika max > 75% + 3 × (75% − 25%)",
      "Uji pada `student_performance.csv` dengan batas {\"age\": (15, 22), \"absences\": (0, 93), \"G3\": (1, 20)} dan cetak pesannya.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("student_performance.csv")[["age", "absences", "G1", "G3", "failures"]]
batas = {"age": (15, 22), "absences": (0, 93), "G3": (1, 20)}
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("student_performance.csv")[["age", "absences", "G1", "G3", "failures"]]
batas = {"age": (15, 22), "absences": (0, 93), "G3": (1, 20)}

def alarm(df, batas):
    pesan = []
    d = df.describe().T
    for kol, r in d.iterrows():
        if r["count"] < len(df):
            pesan.append(f"{kol}: missing {int(len(df) - r['count'])}")
        if kol in batas:
            lo, hi = batas[kol]
            if r["min"] < lo:
                pesan.append(f"{kol}: di bawah batas")
            if r["max"] > hi:
                pesan.append(f"{kol}: di atas batas")
        if r["50%"] > 0 and r["mean"] / r["50%"] > 1.5:
            pesan.append(f"{kol}: miring")
        if r["max"] > r["75%"] + 3 * (r["75%"] - r["25%"]):
            pesan.append(f"{kol}: outlier ekstrem")
    return pesan

for p in alarm(df, batas):
    print(p)`,
    tests: [
      { desc: "Pesan benar", expr: "alarm(df, batas) == ['absences: outlier ekstrem', 'G3: di bawah batas', 'failures: outlier ekstrem']" },
      { desc: "Missing terdeteksi", expr: "alarm(df.assign(x=[None] + [1.0] * (len(df) - 1))[['x']], {}) == ['x: missing 1']" },
      { desc: "Miring terdeteksi", expr: "'v: miring' in alarm(__import__('pandas').DataFrame({'v': [1, 1, 1, 2, 50]}), {})" },
    ],
    hints: ["Konsep: aturan di atas tabel describe.", "Iterasi `describe().T.iterrows()` — sedikit baris, jadi aman.", "IQR = 75% − 25%."],
    explanation: "absences punya nilai ekstrem (75 hari), dan G3 berisi nilai 0 di bawah batas logis 1 — keduanya perlu diputuskan penanganannya sebelum modeling. Perhatikan juga failures: kuartilnya semua 0 sehingga IQR = 0 dan setiap nilai di atas 0 dianggap \"outlier\" — aturan IQR tidak cocok untuk kolom diskrit yang hampir selalu 0. Alarm otomatis tetap perlu dibaca dengan akal sehat.",
  },
  summary: [
    "describe numerik: count, mean, std (ddof=1), min, 25%, 50%, 75%, max.",
    "describe kategori: count, unique, top, freq (include=\"str\"/\"all\").",
    "Baca: count < n → missing; mean ≫ median → miring; max ≫ 75% → outlier; min/max tidak logis → error data.",
    "Gunakan percentiles kustom, .T, dan groupby().describe() untuk analisis lebih dalam.",
  ],
  cheatsheet: [
    { syntax: "df.describe().T", desc: "Ringkasan per kolom" },
    { syntax: "df.describe(include=\"str\")", desc: "Kategori" },
    { syntax: "df.describe(percentiles=[.05, .95])", desc: "Persentil kustom" },
    { syntax: "df.groupby(t)[c].describe()", desc: "Per kelompok" },
    { syntax: "d[\"mean\"] / d[\"50%\"]", desc: "Indikasi kemiringan" },
  ],
  flashcards: [
    { q: "Tanda distribusi miring ke kanan di describe", a: "mean jauh lebih besar dari median (50%)" },
    { q: "describe untuk kolom teks menghasilkan apa?", a: "count, unique, top, freq" },
    { q: "Std di describe memakai ddof berapa?", a: "ddof=1 (std sampel)" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.describe", "reference/api/pandas.DataFrame.describe.html"),
    pandasDoc("Getting started — How to calculate summary statistics", "getting_started/intro_tutorials/06_calculate_statistics.html"),
    { source: "OpenIntro Statistics", title: "Chapter 2 — Summarizing data (box plots, quartiles, IQR)", url: "https://www.openintro.org/book/os/" },
    { source: "UCI Machine Learning Repository", title: "Student Performance — variable information (G1, G2, G3, absences)", url: "https://archive.ics.uci.edu/dataset/320/student+performance" },
  ],
};
