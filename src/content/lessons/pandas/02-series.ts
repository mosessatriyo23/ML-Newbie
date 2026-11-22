import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-series",
  title: "Series",
  minutes: 35,
  prerequisites: ["pd-introduction-to-pandas"],
  objectives: [
    "Membuat Series dari list, dictionary, dan array NumPy.",
    "Memahami bagian Series: values, index, dtype, dan name.",
    "Mengakses elemen dengan label maupun posisi.",
    "Memakai method penting: `value_counts`, `unique`, `nunique`, statistik dasar, dan operasi vectorized.",
  ],
  definition: [
    "**Series** adalah array satu dimensi berlabel. Setiap nilai punya pasangan **label** di **index**. Bayangkan sebagai satu kolom tabel lengkap dengan nomor/nama barisnya.",
    "Bagian-bagian Series:\n- `values` — data (array NumPy atau array Pandas)\n- `index` — label setiap nilai (default 0, 1, 2, …)\n- `dtype` — tipe data seluruh nilai\n- `name` — nama Series (menjadi nama kolom jika dimasukkan ke DataFrame)",
    "Operasi Series bersifat **vectorized** seperti NumPy (`s * 2`), tetapi operasi antar-Series **disejajarkan berdasarkan label index**, bukan posisi. Label yang tidak ada pasangannya menghasilkan `NaN`.",
    "Mengambil satu kolom DataFrame (`df[\"umur\"]`) menghasilkan Series — jadi semua yang dipelajari di sini langsung berlaku untuk kolom data.",
  ],
  why: [
    "Setiap kolom dataset adalah Series. Memeriksa distribusi kategori (`value_counts`), jumlah nilai unik, atau rata-rata kolom adalah langkah EDA paling dasar.",
    "Target `y` dalam ML biasanya berupa Series: `y = df[\"churn\"]`. `y.value_counts(normalize=True)` langsung menunjukkan apakah data imbalanced.",
  ],
  when: [
    "- Bekerja dengan satu kolom data.",
    "- Melihat distribusi kategori dan nilai unik.",
    "- Menghitung statistik satu variabel.",
    "- Menyimpan target (y) untuk model.",
  ],
  analogy: "Series seperti **daftar hadir kelas**: di kiri ada nama siswa (index/label), di kanan status hadirnya (nilai). Kamu bisa mencari berdasarkan nama (\"Budi\") atau berdasarkan nomor urut (baris ke-2).",
  syntax: {
    code: `s = pd.Series(data, index=None, name=None)
s.values  s.index  s.dtype  s.name
s["label"]       # akses dengan label
s.iloc[0]        # akses dengan posisi
s.value_counts()  s.unique()  s.nunique()`,
  },
  anatomy: [
    ["pd.Series([..])", "Membuat Series; index default 0..n−1."],
    ["index=[...]", "Label kustom untuk setiap nilai."],
    ["s[\"label\"]", "Akses dengan label index."],
    ["s.iloc[0]", "Akses dengan posisi (selalu berdasarkan urutan)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat Series dan melihat bagiannya",
      code: `import pandas as pd

s = pd.Series([72, 85, 90], name="nilai")
print(s)
print("values:", s.values)
print("index :", list(s.index))
print("dtype :", s.dtype, "| name:", s.name)`,
      output: "0    72\n1    85\n2    90\nName: nilai, dtype: int64\nvalues: [72 85 90]\nindex : [0, 1, 2]\ndtype : int64 | name: nilai",
      explain: [
        ["pd.Series([72, 85, 90], name=\"nilai\")", "Series dari list dengan nama."],
        ["s.values", "Data mentah sebagai array NumPy."],
        ["s.index", "Index default: RangeIndex 0, 1, 2."],
        ["s.dtype", "int64 karena semua bilangan bulat."],
      ],
    },
    {
      title: "Contoh 2 — Index berlabel dan dictionary",
      code: `import pandas as pd

aqi = pd.Series({"Jakarta": 152, "Bandung": 88, "Surabaya": 101})
print(aqi)
print(aqi["Bandung"])
print(aqi.iloc[0])
print(aqi[aqi > 100])`,
      output: "Jakarta     152\nBandung      88\nSurabaya    101\ndtype: int64\n88\n152\nJakarta     152\nSurabaya    101\ndtype: int64",
      explain: [
        ["aqi = pd.Series({", "Key dictionary menjadi index, value menjadi data."],
        ["aqi[\"Bandung\"]", "Akses dengan label."],
        ["aqi.iloc[0]", "Akses dengan posisi — elemen pertama."],
        ["aqi[aqi > 100]", "Boolean indexing seperti NumPy; label ikut terbawa."],
      ],
      change: "Index tidak lagi angka, tetapi nama kota.",
    },
    {
      title: "Contoh 3 — Operasi vectorized dan penyelarasan index",
      code: `import pandas as pd

minggu1 = pd.Series({"Ani": 3, "Budi": 5, "Citra": 2})
minggu2 = pd.Series({"Budi": 4, "Citra": 6, "Dodi": 1})
print(minggu1 * 10)
print(minggu1 + minggu2)
print(minggu1.add(minggu2, fill_value=0))`,
      output: "Ani      30\nBudi     50\nCitra    20\ndtype: int64\nAni      NaN\nBudi     9.0\nCitra    8.0\nDodi     NaN\ndtype: float64\nAni      3.0\nBudi     9.0\nCitra    8.0\nDodi     1.0\ndtype: float64",
      explain: [
        ["minggu1 * 10", "Operasi dengan skalar ke setiap elemen."],
        ["minggu1 + minggu2", "Dijumlahkan berdasarkan LABEL; Ani dan Dodi tidak punya pasangan → NaN."],
        ["minggu1.add(minggu2, fill_value=0)", "Label yang hilang dianggap 0, sehingga tidak ada NaN."],
      ],
      change: "Operasi antar-Series menyelaraskan label — berbeda dengan NumPy yang berdasarkan posisi.",
    },
    {
      title: "Contoh 4 — Kolom dataset sebagai Series",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
kontrak = df["contract"]
print(type(kontrak).__name__, kontrak.dtype)
print(kontrak.nunique(), "kategori:", kontrak.unique().tolist())
print(kontrak.value_counts())
print(df["churn"].value_counts(normalize=True).round(3))`,
      output: "Series str\n3 kategori: ['Month-to-month', 'Two year', 'One year']\ncontract\nMonth-to-month    227\nOne year           97\nTwo year           79\nName: count, dtype: int64\nchurn\n0    0.62\n1    0.38\nName: proportion, dtype: float64",
      explain: [
        ["df[\"contract\"]", "Satu kolom DataFrame = Series."],
        ["kontrak.nunique(), \"kategori:\", kontrak.unique()", "Jumlah dan daftar kategori unik."],
        ["kontrak.value_counts()", "Frekuensi setiap kategori, diurutkan dari terbanyak."],
        ["value_counts(normalize=True)", "Proporsi — langsung terlihat apakah target churn seimbang."],
      ],
      change: "Series dipakai untuk EDA kolom dataset nyata.",
    },
  ],
  params: [
    {
      title: "Method Series penting",
      items: [
        { name: "pd.Series(data, index=None, dtype=None, name=None)", desc: "Membuat Series." },
        { name: "s.value_counts(normalize=False, dropna=True)", desc: "Frekuensi/proporsi kategori." },
        { name: "s.unique(), s.nunique()", desc: "Nilai unik dan jumlahnya." },
        { name: "s.mean(), s.median(), s.std(), s.min(), s.max()", desc: "Statistik (std memakai ddof=1)." },
        { name: "s.isna(), s.astype(t), s.tolist()", desc: "Cek NaN, ubah tipe, ke list." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ns = pd.Series(["a", "b", "a", "c", "a"])\nprint(s.value_counts().to_dict(), s.nunique())`, output: "{'a': 3, 'b': 1, 'c': 1} 3" },
  tryIt: `import pandas as pd

kota = pd.Series(["Jakarta", "Bandung", "Jakarta", "Medan", "Jakarta", "Bandung"])
print(kota.value_counts())
print(kota.value_counts(normalize=True).round(2))
print(kota.nunique())`,
  mistakes: [
    {
      title: "Mengakses label yang tidak ada",
      wrong: `import pandas as pd
aqi = pd.Series({"Jakarta": 152, "Bandung": 88})
print(aqi["Medan"])`,
      error: "KeyError",
      fix: `import pandas as pd
aqi = pd.Series({"Jakarta": 152, "Bandung": 88})
print(aqi.get("Medan", "tidak ada data"))`,
      explain: "Gunakan `.get(label, default)` atau cek `\"Medan\" in aqi.index` terlebih dahulu.",
    },
    {
      title: "Mengira s[0] selalu berdasarkan posisi",
      wrong: `import pandas as pd
s = pd.Series([10, 20, 30], index=[2, 1, 0])
print(s[0])   # 30, bukan 10!`,
      fix: `import pandas as pd
s = pd.Series([10, 20, 30], index=[2, 1, 0])
print(s.iloc[0])`,
      explain: "Dengan index integer, `s[0]` mencari LABEL 0. Untuk posisi, selalu gunakan `.iloc`.",
    },
    {
      title: "NaN tak terduga saat menjumlahkan Series",
      wrong: `import pandas as pd
a = pd.Series([1, 2], index=["x", "y"])
b = pd.Series([3, 4], index=["y", "z"])
print(a + b)`,
      fix: `import pandas as pd
a = pd.Series([1, 2], index=["x", "y"])
b = pd.Series([3, 4], index=["y", "z"])
print(a.add(b, fill_value=0))`,
      explain: "Operasi menyelaraskan label. Gunakan `fill_value` jika label yang hilang harus dianggap 0.",
    },
  ],
  bestPractices: [
    "Gunakan `.iloc` untuk posisi dan `.loc`/`[]` untuk label agar tidak ambigu.",
    "Beri `name` pada Series agar jelas saat digabung ke DataFrame.",
    "Gunakan `value_counts(normalize=True)` untuk memeriksa keseimbangan target.",
    "Periksa `dtype` setelah membuat Series — angka yang terbaca sebagai teks harus diubah dengan `astype`.",
  ],
  exercises: [
    {
      id: "pd-series-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Frekuensi kategori",
      prompt: "Lengkapi agar `frek` berisi jumlah kemunculan setiap warna.",
      starter: `import pandas as pd
warna = pd.Series(["merah", "biru", "merah", "hijau", "merah"])
frek = warna.____()
print(frek)`,
      solution: `import pandas as pd
warna = pd.Series(["merah", "biru", "merah", "hijau", "merah"])
frek = warna.value_counts()
print(frek)`,
      tests: [{ desc: "frek benar", expr: "frek.to_dict() == {'merah': 3, 'biru': 1, 'hijau': 1}" }],
      hints: ["Konsep: menghitung frekuensi.", "Nama method: \"value\" + \"counts\".", "`warna.value_counts()`"],
      explanation: "`value_counts` menghitung dan mengurutkan frekuensi.",
    },
    {
      id: "pd-series-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
s = pd.Series([5, 3, 8], index=["a", "b", "c"])
print(s["b"])
print(s.iloc[-1])
print(s.idxmax())`,
      answer: "3\n8\nc",
      hints: ["Konsep: label vs posisi.", "iloc[-1] = elemen terakhir.", "idxmax mengembalikan LABEL nilai maksimum."],
      explanation: "s[\"b\"] = 3; iloc[-1] = 8; label nilai terbesar = c.",
    },
    {
      id: "pd-series-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Posisi pertama",
      prompt: "Index Series ini acak, sehingga `s[0]` tidak mengambil elemen pertama. Perbaiki agar `pertama` berisi elemen pada posisi pertama.",
      starter: `import pandas as pd
s = pd.Series([100, 200, 300], index=[3, 0, 1])
pertama = s[0]
print(pertama)`,
      solution: `import pandas as pd
s = pd.Series([100, 200, 300], index=[3, 0, 1])
pertama = s.iloc[0]
print(pertama)`,
      tests: [{ desc: "pertama == 100", expr: "pertama == 100" }],
      hints: ["Konsep: label vs posisi.", "Dengan index integer, [] memakai label.", "`s.iloc[0]`"],
      explanation: "`.iloc` selalu berdasarkan posisi.",
    },
    {
      id: "pd-series-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Series harga",
      prompt: "Buat Series `harga` dengan index [\"kopi\", \"teh\", \"jus\"] dan nilai [18000, 12000, 22000]. Buat `harga_diskon` = harga × 0.9, lalu cetak `harga_diskon` dan label produk termurah (`idxmin`).",
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
harga = pd.Series([18000, 12000, 22000], index=["kopi", "teh", "jus"])
harga_diskon = harga * 0.9
print(harga_diskon)
print(harga_diskon.idxmin())`,
      tests: [
        { desc: "harga benar", expr: "harga.to_dict() == {'kopi': 18000, 'teh': 12000, 'jus': 22000}" },
        { desc: "harga_diskon benar", expr: "harga_diskon.round(0).to_dict() == {'kopi': 16200.0, 'teh': 10800.0, 'jus': 19800.0}" },
        { desc: "Mencetak teh sebagai termurah", expr: "_lines[-1] == 'teh'" },
      ],
      hints: ["Konsep: Series berlabel + operasi vectorized.", "`pd.Series(nilai, index=label)`", "`harga_diskon.idxmin()`"],
      explanation: "Operasi skalar diterapkan ke setiap elemen; label tetap.",
    },
    {
      id: "pd-series-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Target Adult Income",
      prompt: [
        "Baca `adult_income.csv`. Simpan kolom `income` sebagai Series `y`.",
        "Hitung `n_kelas` (jumlah kelas unik), `proporsi` = `y.value_counts(normalize=True)`, dan `kelas_minor` = label kelas dengan proporsi terkecil. Cetak ketiganya.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")
y = df["income"]
n_kelas = y.nunique()
proporsi = y.value_counts(normalize=True)
kelas_minor = proporsi.idxmin()
print(n_kelas)
print(proporsi.round(3))
print(kelas_minor)`,
      tests: [
        { desc: "y adalah Series income", expr: "y.name == 'income' and len(y) == len(df)" },
        { desc: "n_kelas == 2", expr: "n_kelas == 2" },
        { desc: "Proporsi berjumlah 1", expr: "abs(proporsi.sum() - 1) < 1e-9" },
        { desc: "kelas_minor = '>50K'", expr: "kelas_minor == '>50K'" },
      ],
      hints: ["Konsep: memeriksa keseimbangan target.", "`y.value_counts(normalize=True)`", "`proporsi.idxmin()` memberi label terkecil."],
      explanation: "Sekitar 24% saja yang berpendapatan >50K — data imbalanced, sehingga akurasi saja tidak cukup sebagai metrik (Module 14).",
    },
  ],
  quiz: [
    { id: "pd-series-q1", type: "mcq", prompt: "Satu kolom DataFrame yang diambil dengan `df[\"umur\"]` bertipe…", options: ["list", "Series", "DataFrame", "ndarray"], answer: 1, explanation: "Satu kolom = Series." },
    { id: "pd-series-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\na = pd.Series([1, 2], index=["x", "y"])\nb = pd.Series([10, 20], index=["y", "x"])\nprint((a + b).tolist())`, options: ["[11, 22]", "[21, 12]", "[nan, nan]", "Error"], answer: 1, explanation: "Diselaraskan label: x = 1 + 20, y = 2 + 10." },
    { id: "pd-series-q3", type: "tf", prompt: "`s.iloc[0]` selalu mengambil elemen pertama berdasarkan posisi.", answer: true, explanation: "iloc = integer location." },
    { id: "pd-series-q4", type: "fill", prompt: "Method untuk jumlah nilai unik: `s.____()`", answer: ["nunique"], explanation: "`nunique()`." },
    { id: "pd-series-q5", type: "case", prompt: "Target fraud: 9.900 \"normal\", 100 \"fraud\". Perintah tercepat untuk melihat proporsinya?", options: ["y.mean()", "y.value_counts(normalize=True)", "y.unique()", "len(y)"], answer: 1, explanation: "Menampilkan 0.99 vs 0.01." },
  ],
  challenge: {
    id: "pd-series-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Kelompokkan kategori langka",
    prompt: [
      "Kategori yang sangat jarang sering digabung menjadi \"Lainnya\" sebelum encoding.",
      "Tulis fungsi `gabung_langka(s, min_prop)` yang mengganti setiap nilai di Series `s` dengan \"Lainnya\" jika proporsinya < `min_prop`. Petunjuk: hitung `prop = s.value_counts(normalize=True)`, ambil `langka = prop[prop < min_prop].index`, lalu `s.where(~s.isin(langka), \"Lainnya\")`.",
      "Uji pada kolom `native_country` di `adult_income.csv` dengan `min_prop=0.01` dan cetak `value_counts()` hasilnya.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")

def gabung_langka(s, min_prop):
    prop = s.value_counts(normalize=True)
    langka = prop[prop < min_prop].index
    return s.where(~s.isin(langka), "Lainnya")

hasil = gabung_langka(df["native_country"], 0.01)
print(hasil.value_counts())`,
    tests: [
      { desc: "Panjang tetap", expr: "len(gabung_langka(df['native_country'], 0.01)) == len(df)" },
      { desc: "Semua kategori tersisa (kecuali Lainnya) ≥ 1%", expr: "(gabung_langka(df['native_country'], 0.01).value_counts(normalize=True).drop('Lainnya') >= 0.01).all()" },
      { desc: "Ada kategori Lainnya", expr: "'Lainnya' in set(gabung_langka(df['native_country'], 0.01))" },
      { desc: "Bekerja untuk data kecil", expr: "gabung_langka(__import__('pandas').Series(['a', 'a', 'a', 'b']), 0.3).tolist() == ['a', 'a', 'a', 'Lainnya']" },
    ],
    hints: ["Konsep: value_counts + isin + where.", "`s.where(kondisi, pengganti)` mempertahankan nilai jika kondisi True.", "Kondisi: `~s.isin(langka)`."],
    explanation: "Mengurangi puluhan kategori langka menjadi satu mencegah One-Hot Encoding menghasilkan terlalu banyak kolom (Module 08).",
  },
  summary: [
    "Series = array 1D berlabel dengan values, index, dtype, name.",
    "Akses label dengan `s[\"x\"]`/`.loc`, posisi dengan `.iloc`.",
    "Operasi antar-Series diselaraskan berdasarkan label; label tanpa pasangan → NaN.",
    "`value_counts`, `unique`, `nunique`, `idxmax` adalah alat EDA kolom.",
  ],
  cheatsheet: [
    { syntax: "pd.Series(data, index=..., name=...)", desc: "Membuat Series" },
    { syntax: "s.iloc[0]", desc: "Elemen posisi pertama" },
    { syntax: "s.value_counts(normalize=True)", desc: "Proporsi kategori" },
    { syntax: "s.nunique()", desc: "Jumlah unik" },
    { syntax: "a.add(b, fill_value=0)", desc: "Jumlah tanpa NaN" },
  ],
  flashcards: [
    { q: "Proporsi setiap kelas di Series y", a: "y.value_counts(normalize=True)" },
    { q: "Ambil elemen posisi pertama Series s", a: "s.iloc[0]" },
    { q: "Label dari nilai terbesar di Series", a: "s.idxmax()" },
  ],
  references: [
    pandasDoc("Intro to data structures — Series", "user_guide/dsintro.html#series"),
    pandasDoc("pandas.Series", "reference/api/pandas.Series.html"),
    pandasDoc("pandas.Series.value_counts", "reference/api/pandas.Series.value_counts.html"),
    pandasDoc("pandas.Series.where", "reference/api/pandas.Series.where.html"),
  ],
};
