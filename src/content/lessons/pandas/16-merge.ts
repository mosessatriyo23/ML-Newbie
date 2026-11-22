import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-merge-and-join",
  title: "Merge and Join",
  minutes: 45,
  prerequisites: ["pd-groupby"],
  objectives: [
    "Menggabungkan dua tabel berdasarkan kolom kunci dengan `pd.merge` / `df.merge`.",
    "Membedakan jenis join: inner, left, right, outer.",
    "Menangani nama kunci berbeda (`left_on`/`right_on`) dan kolom bentrok (`suffixes`).",
    "Memeriksa hasil merge dengan `indicator=True` dan `validate` untuk mencegah duplikasi baris.",
  ],
  definition: [
    "**Merge** menggabungkan kolom dari dua tabel dengan mencocokkan nilai **kunci** — konsep yang sama dengan JOIN di SQL.",
    "Jenis join (`how=`):\n- **inner** (default) — hanya kunci yang ada di kedua tabel\n- **left** — semua baris tabel kiri; kolom kanan NaN jika tidak ada pasangan\n- **right** — semua baris tabel kanan\n- **outer** — semua kunci dari keduanya",
    "Jika kunci di tabel kanan **tidak unik**, setiap baris kiri bisa terduplikasi — jumlah baris hasil bertambah tanpa disadari. Parameter `validate=\"many_to_one\"` membuat pandas error jika kunci kanan tidak unik, dan `indicator=True` menambah kolom `_merge` (both / left_only / right_only).",
    "`df.join(other)` adalah versi singkat untuk menggabungkan berdasarkan **index**.",
  ],
  why: [
    "Data nyata jarang berada dalam satu tabel. Kompetisi forecasting PM2.5, misalnya, memberi `train.csv`, data `ispu_jakarta.csv`, dan `cams_kualitas_udara.csv` — semuanya harus digabung berdasarkan tanggal sebelum modeling.",
    "Fitur agregat (misalnya ringkasan transaksi per pelanggan) dibuat dengan groupby lalu digabung kembali ke tabel utama dengan merge.",
  ],
  when: [
    "- Menambah fitur dari tabel lain (lookup).",
    "- Menggabungkan data utama dengan data pendukung berdasarkan tanggal/ID.",
    "- Menempelkan hasil agregasi ke tabel utama.",
    "- Mencari data yang tidak punya pasangan (anti-join).",
  ],
  analogy: "Merge seperti **mencocokkan daftar hadir dengan daftar nilai** berdasarkan nomor induk siswa. Left join: semua siswa di daftar hadir tetap tercantum, meskipun nilainya belum ada. Inner join: hanya siswa yang ada di kedua daftar.",
  syntax: {
    code: `pd.merge(kiri, kanan, on="id", how="left")
kiri.merge(kanan, left_on="kode", right_on="id")
kiri.merge(kanan, on="tanggal", how="left", suffixes=("_ispu", "_cams"))
kiri.merge(kanan, on="id", how="left", validate="many_to_one", indicator=True)
kiri.join(kanan_berindeks)`,
  },
  anatomy: [
    ["on=\"id\"", "Nama kolom kunci di kedua tabel."],
    ["how=\"left\"", "Pertahankan semua baris kiri."],
    ["left_on / right_on", "Nama kunci berbeda di kedua tabel."],
    ["suffixes", "Akhiran untuk kolom bernama sama."],
    ["validate, indicator", "Pemeriksaan keamanan merge."],
  ],
  examples: [
    {
      title: "Contoh 1 — Empat jenis join",
      code: `import pandas as pd

siswa = pd.DataFrame({"id": [1, 2, 3, 4], "nama": ["Ani", "Budi", "Citra", "Dodi"]})
nilai = pd.DataFrame({"id": [2, 3, 5], "nilai": [80, 92, 70]})
for how in ["inner", "left", "right", "outer"]:
    hasil = siswa.merge(nilai, on="id", how=how)
    print(how, "→", len(hasil), "baris")
print(siswa.merge(nilai, on="id", how="left"))`,
      output: "inner → 2 baris\nleft → 4 baris\nright → 3 baris\nouter → 5 baris\n   id   nama  nilai\n0   1    Ani    NaN\n1   2   Budi   80.0\n2   3  Citra   92.0\n3   4   Dodi    NaN",
      explain: [
        ["siswa.merge(nilai, on=\"id\", how=how)", "Mencocokkan kolom id."],
        ["inner", "Hanya id 2 dan 3 (ada di keduanya)."],
        ["left", "Semua siswa; Ani dan Dodi mendapat NaN pada nilai."],
        ["outer", "Semua id dari kedua tabel (1–5)."],
      ],
    },
    {
      title: "Contoh 2 — Kunci berbeda nama dan kolom bentrok",
      code: `import pandas as pd

ispu = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02", "2025-01-03"], "pm25": [62, 55, 70]})
cams = pd.DataFrame({"date": ["2025-01-01", "2025-01-02", "2025-01-04"], "pm25": [48.2, 44.9, 51.0]})
g = ispu.merge(cams, left_on="tanggal", right_on="date", how="left", suffixes=("_ispu", "_cams"))
print(g)
g = g.drop(columns="date")
print(g.columns.tolist())`,
      output: "      tanggal  pm25_ispu        date  pm25_cams\n0  2025-01-01         62  2025-01-01       48.2\n1  2025-01-02         55  2025-01-02       44.9\n2  2025-01-03         70         NaN        NaN\n['tanggal', 'pm25_ispu', 'pm25_cams']",
      explain: [
        ["left_on=\"tanggal\", right_on=\"date\"", "Kunci dengan nama berbeda."],
        ["suffixes=(\"_ispu\", \"_cams\")", "Kolom pm25 dari kedua tabel diberi akhiran agar tidak bentrok."],
        ["g.drop(columns=\"date\")", "Kunci kanan ikut tersimpan; buang jika tidak perlu."],
      ],
      change: "Nama kunci dan kolom tidak seragam — kondisi yang umum pada data dari sumber berbeda.",
    },
    {
      title: "Contoh 3 — Jebakan duplikasi dan validate",
      code: `import pandas as pd

trx = pd.DataFrame({"pelanggan": ["A", "B", "A"], "nilai": [100, 50, 70]})
profil = pd.DataFrame({"pelanggan": ["A", "A", "B"], "kota": ["Bogor", "Bogor", "Depok"]})   # A tercatat dua kali!

hasil = trx.merge(profil, on="pelanggan", how="left")
print(len(trx), "→", len(hasil), "baris | total nilai:", trx["nilai"].sum(), "→", hasil["nilai"].sum())
try:
    trx.merge(profil, on="pelanggan", how="left", validate="many_to_one")
except Exception as e:
    print(type(e).__name__, "-", e)

profil_unik = profil.drop_duplicates("pelanggan")
aman = trx.merge(profil_unik, on="pelanggan", how="left", validate="many_to_one")
print(len(aman), aman["nilai"].sum())`,
      output: "3 → 5 baris | total nilai: 220 → 390\nMergeError - Merge keys are not unique in right dataset; not a many-to-one merge\n\nDuplicates in right:\n pelanggan\n        A ...\n3 220",
      explain: [
        ["hasil = trx.merge(profil, on=\"pelanggan\", how=\"left\")", "Kunci A muncul dua kali di profil → setiap transaksi A terduplikasi; total nilai menjadi salah."],
        ["validate=\"many_to_one\"", "Menegaskan kunci kanan harus unik — pandas memberi MergeError."],
        ["profil.drop_duplicates(\"pelanggan\")", "Perbaiki sumbernya, lalu merge dengan aman."],
      ],
      change: "Merge bisa diam-diam menambah baris — pemeriksaan wajib dilakukan.",
    },
    {
      title: "Contoh 4 — Menempelkan agregat dan anti-join",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
stat_kota = df.groupby("city", as_index=False).agg(median_kota=("price_million", "median"), n_kota=("house_id", "size"))
df2 = df.merge(stat_kota, on="city", how="left", validate="many_to_one")
print(df2[["house_id", "city", "price_million", "median_kota", "n_kota"]].head(3))
print(df.shape, "→", df2.shape)

kota_target = pd.DataFrame({"city": ["Jakarta", "Bandung", "Medan"]})
cek = kota_target.merge(df[["city"]].drop_duplicates(), on="city", how="left", indicator=True)
print(cek)
print("Tidak ada di data:", cek.loc[cek["_merge"] == "left_only", "city"].tolist())`,
      output: "  house_id      city  price_million  median_kota  n_kota\n0     H001   Jakarta           4828       2620.5     114\n1     H002   Bandung           1429       1797.0      64\n2     H003  Surabaya            250       1785.0      82\n(300, 8) → (300, 10)\n      city     _merge\n0  Jakarta       both\n1  Bandung       both\n2    Medan  left_only\nTidak ada di data: ['Medan']",
      explain: [
        ["stat_kota = df.groupby(\"city\", as_index=False).agg(", "Statistik per kota sebagai tabel kecil."],
        ["df.merge(stat_kota, on=\"city\", how=\"left\", validate=\"many_to_one\")", "Ditempel ke setiap rumah; jumlah baris tetap 300."],
        ["indicator=True", "Kolom _merge menunjukkan asal setiap baris."],
        ["cek[\"_merge\"] == \"left_only\"", "Anti-join: kota yang tidak punya pasangan di data."],
      ],
      change: "Merge dipakai untuk feature engineering dan pemeriksaan kelengkapan data.",
    },
  ],
  params: [
    {
      title: "pd.merge",
      items: [
        { name: "how=\"inner\"", desc: "inner, left, right, outer, cross." },
        { name: "on / left_on / right_on", desc: "Kolom kunci." },
        { name: "left_index / right_index", desc: "Gunakan index sebagai kunci." },
        { name: "suffixes=(\"_x\", \"_y\")", desc: "Akhiran kolom bentrok." },
        { name: "validate", desc: "\"one_to_one\", \"one_to_many\", \"many_to_one\", \"many_to_many\"." },
        { name: "indicator=False", desc: "True → kolom _merge." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\na = pd.DataFrame({"k": [1, 2, 3], "x": ["p", "q", "r"]})\nb = pd.DataFrame({"k": [2, 3, 4], "y": [20, 30, 40]})\nprint(len(a.merge(b, on="k")), len(a.merge(b, on="k", how="outer")), a.merge(b, on="k", how="left")["y"].tolist())`, output: "2 4 [nan, 20.0, 30.0]" },
  tryIt: `import pandas as pd

harga = pd.DataFrame({"produk": ["Kopi", "Teh", "Jus"], "harga": [18000, 12000, 22000]})
jual = pd.DataFrame({"produk": ["Kopi", "Jus", "Kopi", "Roti"], "qty": [2, 1, 3, 5]})
g = jual.merge(harga, on="produk", how="left", indicator=True)
g["total"] = g["qty"] * g["harga"]
print(g)`,
  mistakes: [
    {
      title: "Tipe kunci berbeda",
      wrong: `import pandas as pd
a = pd.DataFrame({"id": [1, 2], "x": [10, 20]})
b = pd.DataFrame({"id": ["1", "2"], "y": [5, 6]})
print(a.merge(b, on="id"))`,
      error: "ValueError",
      fix: `import pandas as pd
a = pd.DataFrame({"id": [1, 2], "x": [10, 20]})
b = pd.DataFrame({"id": ["1", "2"], "y": [5, 6]})
b["id"] = b["id"].astype(int)
print(a.merge(b, on="id"))`,
      explain: "Kunci int dan teks tidak bisa dicocokkan. Samakan tipe dengan `astype` (atau `pd.to_datetime` untuk tanggal).",
    },
    {
      title: "Baris bertambah karena kunci duplikat",
      wrong: `import pandas as pd
a = pd.DataFrame({"id": [1, 2], "x": [10, 20]})
b = pd.DataFrame({"id": [1, 1, 2], "y": [5, 6, 7]})
print(len(a.merge(b, on="id", how="left")))   # 3, bukan 2`,
      fix: `import pandas as pd
a = pd.DataFrame({"id": [1, 2], "x": [10, 20]})
b = pd.DataFrame({"id": [1, 1, 2], "y": [5, 6, 7]})
b1 = b.groupby("id", as_index=False)["y"].mean()
print(len(a.merge(b1, on="id", how="left", validate="many_to_one")))`,
      explain: "Pastikan kunci tabel lookup unik (agregasi atau drop_duplicates), dan gunakan validate.",
    },
    {
      title: "Lupa how=\"left\" sehingga baris hilang",
      wrong: `import pandas as pd
test = pd.DataFrame({"tanggal": ["d1", "d2", "d3"]})
cuaca = pd.DataFrame({"tanggal": ["d1", "d3"], "hujan": [5, 0]})
print(len(test.merge(cuaca, on="tanggal")))   # 2 — satu hari test hilang!`,
      fix: `import pandas as pd
test = pd.DataFrame({"tanggal": ["d1", "d2", "d3"]})
cuaca = pd.DataFrame({"tanggal": ["d1", "d3"], "hujan": [5, 0]})
print(len(test.merge(cuaca, on="tanggal", how="left")))`,
      explain: "Default inner join membuang baris tanpa pasangan. Untuk data test/submission, selalu gunakan left join agar tidak ada baris yang hilang.",
    },
  ],
  bestPractices: [
    "Bandingkan `len()` sebelum dan sesudah merge.",
    "Gunakan `how=\"left\"` dari tabel utama, dan `validate=\"many_to_one\"` untuk tabel lookup.",
    "Samakan tipe kunci (int, str, datetime) sebelum merge.",
    "Gunakan `indicator=True` untuk memeriksa baris tanpa pasangan.",
  ],
  exercises: [
    {
      id: "pd-merge-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Left join",
      prompt: "Lengkapi agar semua pesanan tetap ada meskipun produknya tidak ada di katalog.",
      starter: `import pandas as pd
pesanan = pd.DataFrame({"kode": ["A", "B", "Z"], "qty": [1, 2, 3]})
katalog = pd.DataFrame({"kode": ["A", "B"], "harga": [100, 200]})
g = pesanan.merge(katalog, on="kode", how="____")
print(g)`,
      solution: `import pandas as pd
pesanan = pd.DataFrame({"kode": ["A", "B", "Z"], "qty": [1, 2, 3]})
katalog = pd.DataFrame({"kode": ["A", "B"], "harga": [100, 200]})
g = pesanan.merge(katalog, on="kode", how="left")
print(g)`,
      tests: [
        { desc: "3 baris", expr: "len(g) == 3" },
        { desc: "Z mendapat NaN", expr: "g.loc[g['kode'] == 'Z', 'harga'].isna().all()" },
      ],
      hints: ["Konsep: jenis join.", "Pertahankan semua baris tabel kiri.", "`how=\"left\"`"],
      explanation: "Left join mempertahankan semua baris kiri.",
    },
    {
      id: "pd-merge-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
a = pd.DataFrame({"k": ["x", "y", "z"], "v": [1, 2, 3]})
b = pd.DataFrame({"k": ["y", "z", "z", "w"], "u": [10, 20, 30, 40]})
print(len(a.merge(b, on="k")))
print(len(a.merge(b, on="k", how="left")))
print(len(a.merge(b, on="k", how="outer")))`,
      answer: "3\n4\n5",
      hints: ["Konsep: duplikasi kunci di kanan.", "z muncul dua kali di b.", "outer: x, y, z, z, w."],
      explanation: "inner 3 (y, z, z); left 4 (x + 3); outer 5.",
    },
    {
      id: "pd-merge-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kunci tanggal",
      prompt: "Merge gagal karena satu kolom tanggal bertipe teks dan satunya datetime. Perbaiki agar `g` berisi 3 baris dengan kolom `hujan` terisi.",
      starter: `import pandas as pd
pm = pd.DataFrame({"tanggal": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-01-03"]), "pm25": [60, 55, 70]})
cuaca = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02", "2025-01-03"], "hujan": [0.0, 12.5, 3.1]})
g = pm.merge(cuaca, on="tanggal", how="left")
print(g)`,
      solution: `import pandas as pd
pm = pd.DataFrame({"tanggal": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-01-03"]), "pm25": [60, 55, 70]})
cuaca = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02", "2025-01-03"], "hujan": [0.0, 12.5, 3.1]})
cuaca["tanggal"] = pd.to_datetime(cuaca["tanggal"])
g = pm.merge(cuaca, on="tanggal", how="left")
print(g)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "hujan terisi", expr: "g['hujan'].tolist() == [0.0, 12.5, 3.1]" },
      ],
      hints: ["Konsep: tipe kunci harus sama.", "Ubah kolom teks menjadi datetime.", "`pd.to_datetime(cuaca[\"tanggal\"])`"],
      explanation: "Selalu samakan tipe kunci sebelum merge.",
    },
    {
      id: "pd-merge-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Tempelkan ringkasan pelanggan",
      prompt: "Dari `trx`, buat `ringkas` = jumlah transaksi (`n_trx`) dan total nilai (`total`) per pelanggan (named aggregation, `as_index=False`). Gabungkan ke `pelanggan` dengan left join dan `validate=\"one_to_one\"`. Pelanggan tanpa transaksi harus punya `n_trx` = 0 dan `total` = 0 (`fillna(0)`). Cetak hasil `g`.",
      starter: `import pandas as pd
pelanggan = pd.DataFrame({"pelanggan": ["A", "B", "C"], "kota": ["Bogor", "Depok", "Bekasi"]})
trx = pd.DataFrame({"pelanggan": ["A", "A", "B"], "nilai": [100, 50, 70]})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
pelanggan = pd.DataFrame({"pelanggan": ["A", "B", "C"], "kota": ["Bogor", "Depok", "Bekasi"]})
trx = pd.DataFrame({"pelanggan": ["A", "A", "B"], "nilai": [100, 50, 70]})
ringkas = trx.groupby("pelanggan", as_index=False).agg(n_trx=("nilai", "size"), total=("nilai", "sum"))
g = pelanggan.merge(ringkas, on="pelanggan", how="left", validate="one_to_one")
g[["n_trx", "total"]] = g[["n_trx", "total"]].fillna(0)
print(g)`,
      tests: [
        { desc: "3 baris", expr: "len(g) == 3" },
        { desc: "n_trx benar", expr: "g['n_trx'].tolist() == [2, 1, 0]" },
        { desc: "total benar", expr: "g['total'].tolist() == [150, 70, 0]" },
      ],
      hints: ["Konsep: groupby → merge.", "Agregasi dulu agar kunci unik.", "fillna(0) untuk pelanggan tanpa transaksi."],
      explanation: "Pola agregasi lalu merge adalah cara standar membuat fitur dari tabel relasional.",
    },
    {
      id: "pd-merge-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Lookup kategori Wholesale",
      prompt: [
        "Di `wholesale_customers.csv`, `Channel` dan `Region` berupa kode angka. Buat tabel lookup `channel_map` (1 → \"Horeca\", 2 → \"Retail\") dan `region_map` (1 → \"Lisbon\", 2 → \"Oporto\", 3 → \"Other\") sebagai DataFrame.",
        "Gabungkan keduanya ke data dengan left join + validate, lalu cetak `crosstab` nama channel × nama region. Jumlah baris harus tetap 440.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
channel_map = pd.DataFrame({"Channel": [1, 2], "channel_nama": ["Horeca", "Retail"]})
region_map = pd.DataFrame({"Region": [1, 2, 3], "region_nama": ["Lisbon", "Oporto", "Other"]})
g = (df.merge(channel_map, on="Channel", how="left", validate="many_to_one")
       .merge(region_map, on="Region", how="left", validate="many_to_one"))
print(len(g))
print(pd.crosstab(g["channel_nama"], g["region_nama"]))`,
      tests: [
        { desc: "Baris tetap 440", expr: "len(g) == 440" },
        { desc: "Tidak ada nama kosong", expr: "g['channel_nama'].notna().all() and g['region_nama'].notna().all()" },
        { desc: "Pemetaan benar", expr: "(g.loc[g['Channel'] == 1, 'channel_nama'] == 'Horeca').all() and (g.loc[g['Region'] == 3, 'region_nama'] == 'Other').all()" },
      ],
      hints: ["Konsep: tabel lookup.", "Merge dua kali secara berantai.", "`validate=\"many_to_one\"` karena banyak pelanggan per kode."],
      explanation: "Arti kode diambil dari dokumentasi dataset UCI (Horeca = Hotel/Restaurant/Café). Lookup membuat analisis lebih mudah dibaca.",
    },
  ],
  quiz: [
    { id: "pd-merge-q1", type: "mcq", prompt: "Join yang mempertahankan semua baris tabel kiri?", options: ["inner", "left", "right", "cross"], answer: 1, explanation: "left join." },
    { id: "pd-merge-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\na = pd.DataFrame({"k": [1, 2]})\nb = pd.DataFrame({"k": [2, 3]})\nprint(a.merge(b, on="k", how="outer", indicator=True)["_merge"].tolist())`, options: ["['both', 'both', 'both']", "['left_only', 'both', 'right_only']", "['left_only', 'right_only']", "Error"], answer: 1, explanation: "1 hanya kiri, 2 keduanya, 3 hanya kanan." },
    { id: "pd-merge-q3", type: "tf", prompt: "Left join tidak pernah menambah jumlah baris tabel kiri.", answer: false, explanation: "Jika kunci kanan duplikat, baris kiri terduplikasi." },
    { id: "pd-merge-q4", type: "fill", prompt: "Parameter untuk akhiran kolom bentrok: `____=(\"_a\", \"_b\")`", answer: ["suffixes"], explanation: "`suffixes`." },
    { id: "pd-merge-q5", type: "case", prompt: "Setelah menggabungkan test.csv (90 hari) dengan data cuaca, baris test menjadi 88. Penyebab paling mungkin?", options: ["Model salah", "Memakai inner join dan ada 2 tanggal tanpa data cuaca", "Pandas error", "Kolom bentrok"], answer: 1, explanation: "Gunakan how=\"left\" untuk tabel test." },
  ],
  challenge: {
    id: "pd-merge-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Gabungkan tiga sumber data harian",
    prompt: [
      "Seperti pada kompetisi forecasting: `train` (tanggal, pm25 target), `ispu` (tanggal, o3, no2), dan `cams` (tanggal, cams_pm25) yang memiliki tanggal duplikat.",
      "1. Pastikan kolom tanggal ketiga tabel bertipe datetime.\n2. Hilangkan duplikat `cams` dengan rata-rata per tanggal.\n3. Gabungkan: `train` ← ispu ← cams dengan left join dan `validate=\"one_to_one\"` → `data`.\n4. `hilang` = jumlah NaN per kolom di `data`.",
      "Cetak `data` dan `hilang`. Jumlah baris `data` harus sama dengan `train`.",
    ],
    starter: `import pandas as pd
train = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04"], "pm25": [62, 55, 70, 48]})
ispu = pd.DataFrame({"tanggal": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-01-04"]), "o3": [30, 28, 35], "no2": [21, 19, 25]})
cams = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04"], "cams_pm25": [47.0, 49.0, 44.9, 58.1, 40.2]})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
train = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04"], "pm25": [62, 55, 70, 48]})
ispu = pd.DataFrame({"tanggal": pd.to_datetime(["2025-01-01", "2025-01-02", "2025-01-04"]), "o3": [30, 28, 35], "no2": [21, 19, 25]})
cams = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-01", "2025-01-02", "2025-01-03", "2025-01-04"], "cams_pm25": [47.0, 49.0, 44.9, 58.1, 40.2]})
train["tanggal"] = pd.to_datetime(train["tanggal"])
cams["tanggal"] = pd.to_datetime(cams["tanggal"])
cams_harian = cams.groupby("tanggal", as_index=False)["cams_pm25"].mean()
data = (train.merge(ispu, on="tanggal", how="left", validate="one_to_one")
             .merge(cams_harian, on="tanggal", how="left", validate="one_to_one"))
hilang = data.isna().sum()
print(data)
print(hilang)`,
    tests: [
      { desc: "Jumlah baris = train", expr: "len(data) == 4" },
      { desc: "Kolom lengkap", expr: "data.columns.tolist() == ['tanggal', 'pm25', 'o3', 'no2', 'cams_pm25']" },
      { desc: "Duplikat cams dirata-rata", expr: "data.loc[0, 'cams_pm25'] == 48.0" },
      { desc: "Missing ISPU 2025-01-03 terdeteksi", expr: "hilang['o3'] == 1 and hilang['no2'] == 1 and hilang['cams_pm25'] == 0" },
    ],
    hints: ["Konsep: samakan tipe, unikkan kunci, left join berantai.", "`cams.groupby(\"tanggal\", as_index=False)[\"cams_pm25\"].mean()`", "Rantai `.merge(...).merge(...)` dengan validate=\"one_to_one\"."],
    explanation: "Inilah tahap \"build dataset\" sebelum EDA: satu baris per tanggal dengan semua fitur dari berbagai sumber, dan laporan missing value untuk langkah imputasi berikutnya.",
  },
  summary: [
    "`merge` mencocokkan kunci: inner, left, right, outer.",
    "`left_on`/`right_on` untuk nama kunci berbeda; `suffixes` untuk kolom bentrok.",
    "Kunci duplikat di kanan menduplikasi baris — gunakan `validate` dan periksa `len()`.",
    "`indicator=True` menunjukkan asal baris; `join` untuk merge berbasis index.",
  ],
  cheatsheet: [
    { syntax: "a.merge(b, on=\"id\", how=\"left\")", desc: "Left join" },
    { syntax: "a.merge(b, left_on=\"x\", right_on=\"y\")", desc: "Kunci beda nama" },
    { syntax: "validate=\"many_to_one\"", desc: "Kunci kanan unik" },
    { syntax: "indicator=True", desc: "Kolom _merge" },
    { syntax: "a.join(b)", desc: "Berdasarkan index" },
  ],
  flashcards: [
    { q: "Gabungkan test dengan cuaca tanpa kehilangan baris test", a: "test.merge(cuaca, on=\"tanggal\", how=\"left\")" },
    { q: "Pastikan tabel lookup punya kunci unik saat merge", a: "validate=\"many_to_one\"" },
    { q: "Temukan baris kiri tanpa pasangan", a: "merge(..., how=\"left\", indicator=True) lalu _merge == \"left_only\"" },
  ],
  references: [
    pandasDoc("Merge, join, concatenate and compare — merge", "user_guide/merging.html#merge"),
    pandasDoc("pandas.merge", "reference/api/pandas.merge.html"),
    pandasDoc("Getting started — How to combine data from multiple tables", "getting_started/intro_tutorials/08_combine_dataframes.html"),
    pandasDoc("Comparison with SQL — JOIN", "getting_started/comparison/comparison_with_sql.html#join"),
  ],
};
