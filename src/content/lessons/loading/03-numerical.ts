import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-numerical-data",
  title: "Numerical Data",
  minutes: 35,
  prerequisites: ["load-features-and-target"],
  objectives: [
    "Membedakan data numerik **kontinu** dan **diskrit**.",
    "Mengenali angka yang sebenarnya kategori (kode, ID, kode pos).",
    "Memeriksa rentang, satuan, dan nilai tidak masuk akal pada kolom numerik.",
    "Mengubah kolom angka yang terbaca sebagai teks menjadi numerik dengan `pd.to_numeric`.",
  ],
  definition: [
    "**Data numerik** (kuantitatif) adalah nilai yang bisa diukur atau dihitung dan operasi aritmetikanya bermakna (rata-rata, selisih).",
    "Dua jenis:\n- **Kontinu** — bisa bernilai berapa pun dalam rentang (tinggi 172.4 cm, PM2.5 41.7 µg/m³, harga)\n- **Diskrit** — hasil hitungan, biasanya bilangan bulat (jumlah kamar, jumlah absen, jumlah tiket komplain)",
    "Tidak semua angka adalah data numerik. Kode wilayah (1, 2, 3), ID pelanggan, kode pos, dan nomor telepon adalah **kategori/identitas** — rata-ratanya tidak bermakna.",
    "Di pandas, kolom numerik bertipe `int64` atau `float64`. Jika satu sel berisi teks (\"?\", \"n/a\", \"1.234,5\"), seluruh kolom bisa terbaca sebagai teks; `pd.to_numeric(s, errors=\"coerce\")` mengubahnya dan menjadikan nilai yang gagal sebagai NaN.",
  ],
  why: [
    "Model hanya memahami angka, tetapi memperlakukan angka kategori sebagai numerik membuat model menganggap \"Region 3 = tiga kali Region 1\" — asumsi yang keliru.",
    "Google MLCC menekankan memeriksa data numerik sebelum modeling: rentang, outlier, satuan, dan distribusinya menentukan apakah perlu scaling, clipping, atau log transform.",
  ],
  when: [
    "- Saat pertama kali memeriksa tipe setiap kolom.",
    "- Saat kolom yang seharusnya angka terbaca sebagai teks.",
    "- Saat memilih preprocessing (scaling untuk numerik, encoding untuk kategori).",
  ],
  analogy: "Nomor punggung pemain sepak bola adalah angka, tetapi pemain bernomor 10 tidak \"dua kali lebih hebat\" dari pemain bernomor 5. Nomor punggung adalah label, bukan ukuran — sama seperti kode wilayah di dataset.",
  syntax: {
    code: `df.select_dtypes(include="number").columns
df["kolom"].describe()
pd.to_numeric(df["kolom"], errors="coerce")
df["kolom"].between(batas_bawah, batas_atas).all()`,
  },
  anatomy: [
    ["select_dtypes(include=\"number\")", "Semua kolom int/float."],
    ["describe()", "count, mean, std, min, kuartil, max."],
    ["to_numeric(errors=\"coerce\")", "Teks → angka; yang gagal menjadi NaN."],
    ["nunique()", "Sedikit nilai unik → mungkin diskrit atau kode kategori."],
  ],
  examples: [
    {
      title: "Contoh 1 — Kontinu vs diskrit",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
for c in ["area_m2", "distance_to_center_km", "price_million", "bedrooms", "bathrooms"]:
    s = df[c]
    print(f"{c:22} dtype={str(s.dtype):8} unik={s.nunique():4} contoh={s.iloc[:3].tolist()}")`,
      output: "area_m2                dtype=int64    unik= 174 contoh=[300, 145, 37]\ndistance_to_center_km  dtype=float64  unik= 176 contoh=[27.6, 18.0, 29.0]\nprice_million          dtype=int64    unik= 288 contoh=[4828, 1429, 250]\nbedrooms               dtype=int64    unik=   6 contoh=[6, 3, 2]\nbathrooms              dtype=int64    unik=   5 contoh=[5, 2, 1]",
      explain: [
        ["for c in [\"area_m2\", ", "Bandingkan beberapa kolom sekaligus."],
        ["s.nunique()", "Kolom kontinu (jarak, harga) punya banyak nilai unik; diskrit (kamar) hanya sedikit."],
      ],
    },
    {
      title: "Contoh 2 — Angka yang sebenarnya kategori",
      code: `import pandas as pd

df = pd.read_csv("wholesale_customers.csv")
print(df[["Channel", "Region"]].dtypes.to_dict())
print(df["Region"].value_counts().sort_index().to_dict())
print("Rata-rata Region:", df["Region"].mean().round(2), "← tidak bermakna!")

df["Region"] = df["Region"].map({1: "Lisbon", 2: "Oporto", 3: "Other"})
print(df["Region"].value_counts().to_dict())`,
      output: "{'Channel': dtype('int64'), 'Region': dtype('int64')}\n{1: 77, 2: 47, 3: 316}\nRata-rata Region: 2.54 ← tidak bermakna!\n{'Other': 316, 'Lisbon': 77, 'Oporto': 47}",
      explain: [
        ["df[[\"Channel\", \"Region\"]].dtypes", "Tersimpan sebagai int64, padahal kode kategori."],
        ["df[\"Region\"].mean()", "Rata-rata 2.54 tidak punya arti apa pun."],
        ["map({1: \"Lisbon\", 2: \"Oporto\", 3: \"Other\"})", "Ubah ke label sesuai dokumentasi UCI agar diperlakukan sebagai kategori."],
      ],
      change: "Tipe int64 tidak menjamin data benar-benar numerik.",
    },
    {
      title: "Contoh 3 — Angka yang terbaca sebagai teks",
      code: `import io
import pandas as pd

teks = """kota,pm25,suhu
Jakarta,55.2,29.1
Bogor,?,26.4
Depok,41.0,n/a
Bekasi,60.3,30.2"""
df = pd.read_csv(io.StringIO(teks))
print(df.dtypes.to_dict())

df["pm25"] = pd.to_numeric(df["pm25"], errors="coerce")
df2 = pd.read_csv(io.StringIO(teks), na_values=["?", "n/a"])
print(df["pm25"].tolist())
print(df2.dtypes.to_dict())`,
      output: "{'kota': <StringDtype(storage='python', na_value=nan)>, 'pm25': <StringDtype(storage='python', na_value=nan)>, 'suhu': dtype('float64')}\n[55.2, nan, 41.0, 60.3]\n{'kota': <StringDtype(storage='python', na_value=nan)>, 'pm25': dtype('float64'), 'suhu': dtype('float64')}",
      explain: [
        ["df.dtypes", "pm25 dan suhu terbaca sebagai str karena ada \"?\" dan \"n/a\"."],
        ["pd.to_numeric(df[\"pm25\"], errors=\"coerce\")", "Konversi; \"?\" menjadi NaN."],
        ["na_values=[\"?\", \"n/a\"]", "Cara yang lebih rapi: beri tahu read_csv penanda missing value sejak awal."],
      ],
      change: "Masalah tipe data diperbaiki saat konversi maupun saat membaca file.",
    },
    {
      title: "Contoh 4 — Memeriksa rentang dan satuan",
      code: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")
num = df.select_dtypes(include="number")
print(num.describe().loc[["min", "max"]].round(1))

print("Berat dalam lbs (1613–5140) → kg:", (df["weight"] * 0.4536).round(0).agg(["min", "max"]).tolist())
print("mpg → km/L:", (df["mpg"] * 0.4251).round(1).agg(["min", "max"]).tolist())`,
      output: "      mpg  cylinders  displacement  ...  acceleration  model_year  origin\nmin   9.0        3.0          68.0  ...           8.0        70.0     1.0\nmax  46.6        8.0         455.0  ...          24.8        82.0     3.0\n\n[2 rows x 8 columns]\nBerat dalam lbs (1613–5140) → kg: [732.0, 2332.0]\nmpg → km/L: [3.8, 19.8]",
      explain: [
        ["num.describe().loc[[\"min\", \"max\"]]", "Rentang setiap kolom numerik untuk mendeteksi nilai mustahil."],
        ["df[\"weight\"] * 0.4536", "Dokumentasi menunjukkan satuan pound (lbs); 1 lb = 0.4536 kg."],
        ["df[\"mpg\"] * 0.4251", "1 mile per gallon (US) ≈ 0.4251 km per liter."],
      ],
      change: "Memahami satuan membuat interpretasi model benar.",
    },
  ],
  params: [
    {
      title: "Alat untuk data numerik",
      items: [
        { name: "select_dtypes(include=\"number\")", desc: "Pilih kolom numerik." },
        { name: "pd.to_numeric(arg, errors=\"raise\"|\"coerce\")", desc: "Konversi ke angka." },
        { name: "read_csv(na_values=[...], decimal=\",\", thousands=\".\")", desc: "Penanda missing dan format angka lokal." },
        { name: "s.describe(), s.between(a, b)", desc: "Ringkasan dan cek rentang." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ns = pd.Series(["10", "20", "x", "40"])\nprint(pd.to_numeric(s, errors="coerce").tolist())`, output: "[10.0, 20.0, nan, 40.0]" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
num = df.select_dtypes(include="number")
print(num.nunique().sort_values())
print(num.describe().round(1))`,
  mistakes: [
    {
      title: "Operasi aritmetika pada kolom teks",
      wrong: `import pandas as pd
s = pd.Series(["10", "20", "30"])
print(s.mean())`,
      error: "TypeError",
      fix: `import pandas as pd
s = pd.Series(["10", "20", "30"])
print(pd.to_numeric(s).mean())`,
      explain: "Kolom bertipe teks harus dikonversi dulu dengan `pd.to_numeric` atau `astype(float)`.",
    },
    {
      title: "to_numeric tanpa coerce pada data kotor",
      wrong: `import pandas as pd
s = pd.Series(["10", "?", "30"])
print(pd.to_numeric(s))`,
      error: "ValueError",
      fix: `import pandas as pd
s = pd.Series(["10", "?", "30"])
print(pd.to_numeric(s, errors="coerce"))`,
      explain: "Default errors=\"raise\". Gunakan `errors=\"coerce\"` lalu periksa jumlah NaN yang muncul.",
    },
    {
      title: "Format angka Indonesia (koma desimal)",
      wrong: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("harga;luas\\n1.250.000,50;36,5"), sep=";")
print(df.dtypes.to_dict())   # teks, bukan angka`,
      fix: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("harga;luas\\n1.250.000,50;36,5"), sep=";", decimal=",", thousands=".")
print(df.dtypes.to_dict(), df.iloc[0].tolist())`,
      explain: "File dari Excel berbahasa Indonesia sering memakai titik untuk ribuan dan koma untuk desimal. Atur `decimal=\",\"` dan `thousands=\".\"`.",
    },
  ],
  bestPractices: [
    "Untuk setiap kolom angka tanya: apakah rata-ratanya bermakna? Jika tidak, perlakukan sebagai kategori.",
    "Catat satuan setiap kolom numerik di kamus data.",
    "Gunakan `na_values` saat membaca file yang memakai penanda missing khusus.",
    "Setelah `to_numeric(errors=\"coerce\")`, selalu hitung NaN baru yang muncul.",
  ],
  exercises: [
    {
      id: "load-num-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Konversi teks ke angka",
      prompt: "Lengkapi agar `angka` berisi nilai numerik dengan teks tidak valid menjadi NaN.",
      starter: `import pandas as pd
s = pd.Series(["5", "7.5", "tidak ada", "10"])
angka = pd.to_numeric(s, errors="____")
print(angka.tolist())`,
      solution: `import pandas as pd
s = pd.Series(["5", "7.5", "tidak ada", "10"])
angka = pd.to_numeric(s, errors="coerce")
print(angka.tolist())`,
      tests: [{ desc: "Hasil benar", expr: "angka.isna().tolist() == [False, False, True, False] and angka.sum() == 22.5" }],
      hints: ["Konsep: konversi paksa.", "Nilai yang gagal dipaksa menjadi NaN.", "`errors=\"coerce\"`"],
      explanation: "coerce = paksa; yang gagal dikonversi menjadi NaN.",
    },
    {
      id: "load-num-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import io
import pandas as pd
df = pd.read_csv(io.StringIO("a,b,c\\n1,2.5,x\\n3,?,y"), na_values=["?"])
print(df.dtypes.astype(str).tolist())
print(df["b"].isna().sum())`,
      answer: "['int64', 'float64', 'str']\n1",
      hints: ["Konsep: na_values.", "\"?\" dibaca sebagai NaN sehingga b tetap numerik.", "c berisi teks."],
      explanation: "['int64', 'float64', 'str']; satu NaN.",
    },
    {
      id: "load-num-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Rata-rata horsepower",
      prompt: "Kolom `hp` terbaca sebagai teks karena ada \"?\". Perbaiki agar `rata` adalah rata-rata horsepower yang valid.",
      starter: `import pandas as pd
df = pd.DataFrame({"hp": ["130", "165", "?", "150"]})
rata = df["hp"].mean()
print(rata)`,
      solution: `import pandas as pd
df = pd.DataFrame({"hp": ["130", "165", "?", "150"]})
rata = pd.to_numeric(df["hp"], errors="coerce").mean()
print(rata)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "rata benar", expr: "abs(rata - 445 / 3) < 1e-9" },
      ],
      hints: ["Konsep: tipe data kolom.", "Konversi ke numerik dulu.", "`pd.to_numeric(..., errors=\"coerce\")`"],
      explanation: "Dataset Auto MPG asli dari UCI memang memakai \"?\" untuk horsepower yang hilang.",
    },
    {
      id: "load-num-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Deteksi angka yang mungkin kategori",
      prompt: "Tulis fungsi `curiga_kategori(df, max_unik=10)` yang mengembalikan list kolom numerik dengan jumlah nilai unik ≤ `max_unik`. Uji pada `heart_disease.csv` dan cetak hasilnya.",
      starter: `import pandas as pd
df = pd.read_csv("heart_disease.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("heart_disease.csv")

def curiga_kategori(df, max_unik=10):
    num = df.select_dtypes(include="number")
    return [c for c in num.columns if num[c].nunique() <= max_unik]

print(curiga_kategori(df))`,
      tests: [
        { desc: "Hasil benar", expr: "curiga_kategori(df) == ['sex', 'cp', 'fbs', 'restecg', 'exang', 'slope', 'ca', 'thal', 'num']" },
        { desc: "Parameter bekerja", expr: "curiga_kategori(df, 2) == ['sex', 'fbs', 'exang']" },
      ],
      hints: ["Konsep: sedikit nilai unik → kemungkinan kode kategori.", "Pilih kolom numerik dengan select_dtypes.", "List comprehension dengan nunique()."],
      explanation: "cp (tipe nyeri dada) dan thal adalah kode kategori menurut dokumentasi UCI — perlu one-hot encoding, bukan scaling. Kolom seperti ca (jumlah pembuluh 0–3) tetap bisa dianggap diskrit: keputusan akhir selalu dari dokumentasi.",
    },
    {
      id: "load-num-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Cek kewajaran data numerik",
      prompt: [
        "Baca `customer_churn.csv`. Buat dictionary `aturan` = {\"age\": (17, 100), \"tenure_months\": (0, 120), \"monthly_charges\": (0, 500)}.",
        "Untuk setiap aturan hitung jumlah nilai **tidak kosong** di luar rentang (`~s.dropna().between(a, b)`). Simpan di dict `pelanggaran` dan cetak.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
aturan = {"age": (17, 100), "tenure_months": (0, 120), "monthly_charges": (0, 500)}
pelanggaran = {}
for kol, (a, b) in aturan.items():
    s = df[kol].dropna()
    pelanggaran[kol] = int((~s.between(a, b)).sum())
print(pelanggaran)`,
      tests: [
        { desc: "Kunci lengkap", expr: "set(pelanggaran) == {'age', 'tenure_months', 'monthly_charges'}" },
        { desc: "Hitungan benar", expr: "all(pelanggaran[k] == int((~df[k].dropna().between(*aturan[k])).sum()) for k in aturan)" },
      ],
      hints: ["Konsep: validasi rentang domain.", "Loop `for kol, (a, b) in aturan.items():`", "`(~s.between(a, b)).sum()`"],
      explanation: "Aturan domain (umur pelanggan minimal 17, tenure tidak negatif) menangkap kesalahan input yang tidak terlihat dari tipe data.",
    },
  ],
  quiz: [
    { id: "load-num-q1", type: "mcq", prompt: "Mana yang merupakan data numerik diskrit?", options: ["Tinggi badan", "Jumlah anak", "Suhu udara", "Harga rumah"], answer: 1, explanation: "Hasil hitungan bilangan bulat." },
    { id: "load-num-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(pd.to_numeric(pd.Series(["1", "2", "a"]), errors="coerce").sum())`, options: ["Error", "3.0", "nan", "12a"], answer: 1, explanation: "NaN diabaikan saat sum → 3.0." },
    { id: "load-num-q3", type: "tf", prompt: "Kolom bertipe int64 selalu merupakan data numerik yang rata-ratanya bermakna.", answer: false, explanation: "Bisa berupa kode kategori atau ID." },
    { id: "load-num-q4", type: "fill", prompt: "Agar read_csv membaca koma sebagai pemisah desimal: `decimal=\"____\"`", answer: [","], explanation: "decimal=\",\"." },
    { id: "load-num-q5", type: "case", prompt: "Kolom `kode_pos` (contoh 16810, 40115) akan dipakai sebagai fitur. Perlakuan yang tepat?", options: ["Scaling sebagai angka", "Perlakukan sebagai kategori/turunkan ke wilayah", "Hitung rata-ratanya", "Log transform"], answer: 1, explanation: "Kode pos adalah identitas lokasi, bukan besaran." },
  ],
  challenge: {
    id: "load-num-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Membersihkan kolom angka dari Excel lokal",
    prompt: [
      "Kolom `harga` berisi teks seperti \"Rp 1.250.000\", \"Rp1.500.000,50\", \"-\", dan \" 975.000 \". Tulis fungsi `ke_angka(s)` yang:",
      "1. Membuang \"Rp\" dan spasi (`str.replace`, `str.strip`).\n2. Membuang titik ribuan dan mengganti koma desimal dengan titik.\n3. Mengonversi dengan `pd.to_numeric(..., errors=\"coerce\")`.",
      "Cetak hasil untuk `harga` dan jumlah NaN-nya.",
    ],
    starter: `import pandas as pd
harga = pd.Series(["Rp 1.250.000", "Rp1.500.000,50", "-", " 975.000 ", "Rp 2.000.000"])
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
harga = pd.Series(["Rp 1.250.000", "Rp1.500.000,50", "-", " 975.000 ", "Rp 2.000.000"])

def ke_angka(s):
    bersih = (s.str.replace("Rp", "", regex=False)
               .str.strip()
               .str.replace(".", "", regex=False)
               .str.replace(",", ".", regex=False))
    return pd.to_numeric(bersih, errors="coerce")

hasil = ke_angka(harga)
print(hasil.tolist())
print(hasil.isna().sum())`,
    tests: [
      { desc: "Nilai benar", expr: "ke_angka(harga).fillna(-1).tolist() == [1250000.0, 1500000.5, -1.0, 975000.0, 2000000.0]" },
      { desc: "Satu NaN", expr: "ke_angka(harga).isna().sum() == 1" },
      { desc: "Bekerja untuk input lain", expr: "ke_angka(__import__('pandas').Series(['Rp 10,5'])).tolist() == [10.5]" },
    ],
    hints: ["Konsep: rantai method .str lalu to_numeric.", "Gunakan `regex=False` agar titik dibaca harfiah.", "Urutan penting: buang titik dulu, baru ganti koma."],
    explanation: "Format mata uang lokal adalah sumber kesalahan paling umum saat memakai data dari spreadsheet Indonesia.",
  },
  summary: [
    "Data numerik: kontinu (diukur) dan diskrit (dihitung).",
    "Angka yang berupa kode/ID adalah kategori — rata-ratanya tidak bermakna.",
    "Teks kotor membuat kolom angka terbaca sebagai str: gunakan `na_values` atau `pd.to_numeric(errors=\"coerce\")`.",
    "Periksa rentang dan satuan setiap kolom numerik.",
  ],
  cheatsheet: [
    { syntax: "df.select_dtypes(\"number\")", desc: "Kolom numerik" },
    { syntax: "pd.to_numeric(s, errors=\"coerce\")", desc: "Teks → angka" },
    { syntax: "read_csv(na_values=[\"?\"])", desc: "Penanda missing" },
    { syntax: "read_csv(decimal=\",\", thousands=\".\")", desc: "Format lokal" },
    { syntax: "s.between(a, b)", desc: "Cek rentang" },
  ],
  flashcards: [
    { q: "Perbedaan data kontinu dan diskrit", a: "Kontinu = hasil pengukuran (bisa pecahan); diskrit = hasil hitungan (bilangan bulat)" },
    { q: "Ubah kolom teks berisi angka & \"?\" menjadi numerik", a: "pd.to_numeric(s, errors=\"coerce\")" },
    { q: "Contoh angka yang sebenarnya kategori", a: "Kode wilayah, kode pos, ID, nomor telepon" },
  ],
  references: [
    { source: "Google Machine Learning Crash Course", title: "Working with numerical data", url: "https://developers.google.com/machine-learning/crash-course/numerical-data" },
    pandasDoc("pandas.to_numeric", "reference/api/pandas.to_numeric.html"),
    pandasDoc("IO tools — NA and NaN handling (na_values)", "user_guide/io.html#na-values"),
    { source: "OpenIntro Statistics", title: "Chapter 1.2 — Data basics (types of variables)", url: "https://www.openintro.org/book/os/" },
  ],
};
