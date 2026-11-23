import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-understanding-rows-and-columns",
  title: "Understanding Rows and Columns",
  minutes: 35,
  prerequisites: ["pd-dataframe", "load-introduction-to-dataset"],
  objectives: [
    "Memahami prinsip **tidy data**: setiap variabel satu kolom, setiap observasi satu baris.",
    "Memahami **axis**: `axis=0` (sepanjang baris, hasil per kolom) dan `axis=1` (sepanjang kolom, hasil per baris).",
    "Mengubah data *wide* menjadi *long* dengan `melt` dan sebaliknya dengan `pivot`.",
    "Mengakses baris sebagai Series dan menghindari loop baris yang lambat.",
  ],
  definition: [
    "**Tidy data** (istilah Hadley Wickham, dipakai luas di data science): \n1. setiap **variabel** menjadi satu **kolom**\n2. setiap **observasi** menjadi satu **baris**\n3. setiap **nilai** berada di satu sel\nData yang tidak tidy, misalnya kolom `pm25_jan`, `pm25_feb`, `pm25_mar` (nilai bulan tersimpan di nama kolom), perlu dirapikan sebelum dianalisis atau dipakai model.",
    "**axis** menentukan arah operasi:\n- `axis=0` (\"index\") — bergerak **turun** menyusuri baris → menghasilkan satu nilai **per kolom** (`df.mean(axis=0)`)\n- `axis=1` (\"columns\") — bergerak **ke samping** menyusuri kolom → menghasilkan satu nilai **per baris** (`df.mean(axis=1)`)",
    "`df.melt(id_vars=..., var_name=..., value_name=...)` mengubah format **wide** (banyak kolom) menjadi **long** (banyak baris); `df.pivot(index, columns, values)` melakukan kebalikannya.",
    "Satu baris (`df.iloc[i]`) adalah Series berindeks nama kolom. Loop per baris (`iterrows`) jauh lebih lambat daripada operasi kolom vectorized; gunakan hanya bila benar-benar perlu.",
  ],
  why: [
    "Model scikit-learn mengharuskan format tidy: satu baris = satu sampel, satu kolom = satu fitur. Data dari laporan/Excel sering berbentuk wide dan harus diubah dulu.",
    "Salah memilih axis adalah bug klasik pemula: ingin rata-rata per siswa (baris) tetapi mendapat rata-rata per mata pelajaran (kolom).",
  ],
  when: [
    "- Memeriksa apakah dataset sudah tidy.",
    "- Mengubah laporan wide menjadi tabel long untuk analisis/plot.",
    "- Menghitung agregasi per baris atau per kolom.",
    "- Menentukan granularitas data untuk model.",
  ],
  analogy: "Format wide seperti **jadwal pelajaran** (hari sebagai kolom): enak dibaca manusia, tetapi sulit dihitung. Format long seperti **buku catatan harian**: satu baris per kejadian — membosankan dibaca, tetapi sangat mudah difilter, dikelompokkan, dan dipakai mesin.",
  syntax: {
    code: `df.mean(axis=0)        # per kolom
df.mean(axis=1)        # per baris
long = wide.melt(id_vars="kota", var_name="bulan", value_name="pm25")
wide = long.pivot(index="kota", columns="bulan", values="pm25")
baris = df.iloc[0]     # Series`,
  },
  anatomy: [
    ["axis=0", "Turun sepanjang baris → hasil per kolom."],
    ["axis=1", "Menyamping sepanjang kolom → hasil per baris."],
    ["melt", "Wide → long."],
    ["pivot", "Long → wide."],
  ],
  examples: [
    {
      title: "Contoh 1 — axis=0 vs axis=1",
      code: `import pandas as pd

nilai = pd.DataFrame(
    {"matematika": [80, 65, 90], "fisika": [70, 75, 85], "kimia": [90, 60, 80]},
    index=["Ani", "Budi", "Citra"],
)
print(nilai)
print("Rata-rata per mapel (axis=0):", nilai.mean(axis=0).round(1).to_dict())
print("Rata-rata per siswa (axis=1):", nilai.mean(axis=1).round(1).to_dict())`,
      output: "       matematika  fisika  kimia\nAni            80      70     90\nBudi           65      75     60\nCitra          90      85     80\nRata-rata per mapel (axis=0): {'matematika': 78.3, 'fisika': 76.7, 'kimia': 76.7}\nRata-rata per siswa (axis=1): {'Ani': 80.0, 'Budi': 66.7, 'Citra': 85.0}",
      explain: [
        ["nilai.mean(axis=0)", "Bergerak turun di setiap kolom → satu nilai per mata pelajaran."],
        ["nilai.mean(axis=1)", "Bergerak menyamping di setiap baris → satu nilai per siswa."],
      ],
    },
    {
      title: "Contoh 2 — Data wide menjadi long (melt)",
      code: `import pandas as pd

wide = pd.DataFrame({
    "kota": ["Jakarta", "Bandung"],
    "pm25_jan": [55, 30], "pm25_feb": [48, 28], "pm25_mar": [52, 33],
})
long = wide.melt(id_vars="kota", var_name="bulan", value_name="pm25")
long["bulan"] = long["bulan"].str.replace("pm25_", "")
print(long)
print(long.groupby("kota")["pm25"].mean().to_dict())`,
      output: "      kota bulan  pm25\n0  Jakarta   jan    55\n1  Bandung   jan    30\n2  Jakarta   feb    48\n3  Bandung   feb    28\n4  Jakarta   mar    52\n5  Bandung   mar    33\n{'Bandung': 30.333333333333332, 'Jakarta': 51.666666666666664}",
      explain: [
        ["wide.melt(id_vars=\"kota\", var_name=\"bulan\", value_name=\"pm25\")", "Setiap pasangan (kota, bulan) menjadi satu baris."],
        ["str.replace(\"pm25_\", \"\")", "Nama kolom lama berisi informasi bulan — dirapikan menjadi nilai."],
        ["long.groupby(\"kota\")", "Format long langsung bisa dikelompokkan."],
      ],
      change: "Bentuk tabel diubah agar tidy.",
    },
    {
      title: "Contoh 3 — Long kembali ke wide (pivot)",
      code: `import pandas as pd

long = pd.DataFrame({
    "tanggal": ["2025-01-01", "2025-01-01", "2025-01-02", "2025-01-02"],
    "stasiun": ["DKI1", "DKI2", "DKI1", "DKI2"],
    "pm25": [55.2, 61.0, 47.9, 58.3],
})
wide = long.pivot(index="tanggal", columns="stasiun", values="pm25")
print(wide)
wide["rata_stasiun"] = wide.mean(axis=1)
print(wide.round(2))`,
      output: "stasiun     DKI1  DKI2\ntanggal               \n2025-01-01  55.2  61.0\n2025-01-02  47.9  58.3\nstasiun     DKI1  DKI2  rata_stasiun\ntanggal                             \n2025-01-01  55.2  61.0          58.1\n2025-01-02  47.9  58.3          53.1",
      explain: [
        ["long.pivot(index=\"tanggal\", columns=\"stasiun\", values=\"pm25\")", "Satu baris per tanggal, satu kolom per stasiun — format yang cocok untuk fitur model harian."],
        ["wide.mean(axis=1)", "Rata-rata semua stasiun per hari (per baris)."],
      ],
      change: "Arah sebaliknya: dari long ke wide.",
    },
    {
      title: "Contoh 4 — Baris sebagai Series dan menghindari loop",
      code: `import time
import pandas as pd

df = pd.read_csv("adult_income.csv")
baris = df.iloc[0]
print(type(baris).__name__, baris.index[:3].tolist(), baris["age"])

t0 = time.perf_counter()
total = 0
for _, r in df.head(5000).iterrows():
    total += r["hours_per_week"]
t_loop = time.perf_counter() - t0

t0 = time.perf_counter()
total2 = df.head(5000)["hours_per_week"].sum()
t_vec = time.perf_counter() - t0
print("Hasil sama:", total == total2, "| vectorized lebih cepat:", t_vec < t_loop)`,
      output: "Series ['age', 'workclass', 'fnlwgt'] 39\nHasil sama: True | vectorized lebih cepat: True",
      explain: [
        ["baris = df.iloc[0]", "Satu baris = Series; index-nya nama kolom."],
        ["for _, r in df.head(5000).iterrows():", "Loop baris membuat Series baru untuk setiap baris — lambat."],
        ["df.head(5000)[\"hours_per_week\"].sum()", "Operasi kolom vectorized: hasil sama, jauh lebih cepat."],
      ],
      change: "Fokus pada performa saat bekerja dengan baris.",
    },
  ],
  params: [
    {
      title: "Bentuk data",
      items: [
        { name: "axis=0 / \"index\"", desc: "Hasil per kolom." },
        { name: "axis=1 / \"columns\"", desc: "Hasil per baris." },
        { name: "melt(id_vars, value_vars, var_name, value_name)", desc: "Wide → long." },
        { name: "pivot(index, columns, values)", desc: "Long → wide (kombinasi harus unik; jika tidak gunakan pivot_table)." },
        { name: "df.T", desc: "Transpose: baris ↔ kolom." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2], "b": [3, 4]})\nprint(df.sum(axis=0).tolist(), df.sum(axis=1).tolist(), df.T.shape)`, output: "[3, 7] [4, 6] (2, 2)" },
  tryIt: `import pandas as pd

df = pd.read_csv("wholesale_customers.csv")
produk = ["Fresh", "Milk", "Grocery", "Frozen", "Detergents_Paper", "Delicassen"]
print("Total per produk :", df[produk].sum(axis=0).head(3).to_dict())
print("Total per pelanggan:", df[produk].sum(axis=1).head(3).tolist())`,
  mistakes: [
    {
      title: "Axis tertukar",
      wrong: `import pandas as pd
df = pd.DataFrame({"m": [80, 60], "f": [70, 90]}, index=["Ani", "Budi"])
print(df.mean().to_dict())   # dikira rata-rata per siswa`,
      fix: `import pandas as pd
df = pd.DataFrame({"m": [80, 60], "f": [70, 90]}, index=["Ani", "Budi"])
print(df.mean(axis=1).to_dict())`,
      explain: "Default axis=0 menghasilkan per kolom. Untuk per baris gunakan axis=1.",
    },
    {
      title: "pivot dengan kombinasi duplikat",
      wrong: `import pandas as pd
long = pd.DataFrame({"t": ["d1", "d1"], "s": ["A", "A"], "v": [1, 2]})
print(long.pivot(index="t", columns="s", values="v"))`,
      error: "ValueError",
      fix: `import pandas as pd
long = pd.DataFrame({"t": ["d1", "d1"], "s": ["A", "A"], "v": [1, 2]})
print(long.pivot_table(index="t", columns="s", values="v", aggfunc="mean"))`,
      explain: "*Index contains duplicate entries* — pivot butuh kombinasi unik. Gunakan pivot_table dengan agregasi.",
    },
    {
      title: "Mengubah DataFrame lewat iterrows",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]})
for _, r in df.iterrows():
    r["a"] = r["a"] * 10
print(df["a"].tolist())   # tidak berubah`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2]})
df["a"] = df["a"] * 10
print(df["a"].tolist())`,
      explain: "Baris dari iterrows adalah salinan; mengubahnya tidak mengubah df. Gunakan operasi kolom.",
    },
  ],
  bestPractices: [
    "Periksa: apakah ada nilai yang tersimpan di nama kolom (bulan, tahun, kategori)? Jika ya, gunakan melt.",
    "Tulis axis secara eksplisit (`axis=0`/`axis=1`) agar kode jelas.",
    "Gunakan operasi vectorized, bukan iterrows.",
    "Tentukan granularitas target sejak awal (per hari? per pelanggan?) dan bentuk tabel sesuai granularitas itu.",
  ],
  exercises: [
    {
      id: "load-rc-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Total per baris",
      prompt: "Lengkapi agar `total` berisi total belanja setiap pelanggan (per baris).",
      starter: `import pandas as pd
df = pd.DataFrame({"jan": [100, 50], "feb": [80, 70], "mar": [120, 60]}, index=["P1", "P2"])
total = df.sum(axis=____)
print(total)`,
      solution: `import pandas as pd
df = pd.DataFrame({"jan": [100, 50], "feb": [80, 70], "mar": [120, 60]}, index=["P1", "P2"])
total = df.sum(axis=1)
print(total)`,
      tests: [{ desc: "total per baris", expr: "total.to_dict() == {'P1': 300, 'P2': 180}" }],
      hints: ["Konsep: axis.", "Per baris = menyusuri kolom.", "`axis=1`"],
      explanation: "axis=1 menjumlahkan ke samping.",
    },
    {
      id: "load-rc-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
w = pd.DataFrame({"id": [1, 2], "q1": [5, 7], "q2": [6, 8]})
l = w.melt(id_vars="id", var_name="kuartal", value_name="jual")
print(l.shape)
print(l["kuartal"].tolist())
print(l.groupby("id")["jual"].sum().tolist())`,
      answer: "(4, 3)\n['q1', 'q1', 'q2', 'q2']\n[11, 15]",
      hints: ["Konsep: melt menumpuk kolom.", "2 id × 2 kuartal = 4 baris.", "Urutan: semua q1 dulu, lalu q2."],
      explanation: "(4, 3); ['q1', 'q1', 'q2', 'q2']; [11, 15].",
    },
    {
      id: "load-rc-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Rata-rata per siswa",
      prompt: "Perbaiki agar `rata_siswa` berisi rata-rata setiap siswa (bukan setiap mapel).",
      starter: `import pandas as pd
nilai = pd.DataFrame({"mtk": [80, 60, 90], "ipa": [70, 80, 100]}, index=["A", "B", "C"])
rata_siswa = nilai.mean()
print(rata_siswa)`,
      solution: `import pandas as pd
nilai = pd.DataFrame({"mtk": [80, 60, 90], "ipa": [70, 80, 100]}, index=["A", "B", "C"])
rata_siswa = nilai.mean(axis=1)
print(rata_siswa)`,
      tests: [{ desc: "Per siswa", expr: "rata_siswa.to_dict() == {'A': 75.0, 'B': 70.0, 'C': 95.0}" }],
      hints: ["Konsep: arah agregasi.", "Default axis=0.", "Tambahkan axis=1."],
      explanation: "Per siswa = per baris = axis=1.",
    },
    {
      id: "load-rc-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Rapikan laporan wide",
      prompt: "Ubah `laporan` (kolom tahun 2023–2025) menjadi `long` berkolom `kota`, `tahun` (int), `pm25`. Urutkan berdasarkan kota lalu tahun (`ignore_index=True`) dan cetak.",
      starter: `import pandas as pd
laporan = pd.DataFrame({"kota": ["Jakarta", "Bandung"], "2023": [48.1, 30.2], "2024": [45.6, 29.8], "2025": [43.9, 28.5]})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
laporan = pd.DataFrame({"kota": ["Jakarta", "Bandung"], "2023": [48.1, 30.2], "2024": [45.6, 29.8], "2025": [43.9, 28.5]})
long = laporan.melt(id_vars="kota", var_name="tahun", value_name="pm25")
long["tahun"] = long["tahun"].astype(int)
long = long.sort_values(["kota", "tahun"], ignore_index=True)
print(long)`,
      tests: [
        { desc: "Kolom & ukuran", expr: "long.columns.tolist() == ['kota', 'tahun', 'pm25'] and len(long) == 6" },
        { desc: "tahun int", expr: "long['tahun'].dtype.kind == 'i'" },
        { desc: "Urutan benar", expr: "long['kota'].tolist()[:3] == ['Bandung'] * 3 and long['tahun'].tolist()[:3] == [2023, 2024, 2025]" },
      ],
      hints: ["Konsep: melt + konversi tipe.", "Nama kolom tahun menjadi nilai teks; ubah dengan astype(int).", "sort_values([\"kota\", \"tahun\"])"],
      explanation: "Setelah long, tren per kota bisa dianalisis dengan groupby atau diplot dengan mudah.",
    },
    {
      id: "load-rc-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Nilai siswa ke format long",
      prompt: [
        "Baca `student_performance.csv`. Tambahkan kolom `siswa_id` = index. Ubah kolom `G1`, `G2`, `G3` menjadi format long (`periode`, `nilai`) dengan `id_vars=[\"siswa_id\", \"school\"]` → `long`.",
        "Cetak `long.shape` dan rata-rata nilai per periode per sekolah dengan `pivot_table(index=\"school\", columns=\"periode\", values=\"nilai\")` (2 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("student_performance.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("student_performance.csv")
df["siswa_id"] = df.index
long = df.melt(id_vars=["siswa_id", "school"], value_vars=["G1", "G2", "G3"], var_name="periode", value_name="nilai")
print(long.shape)
print(long.pivot_table(index="school", columns="periode", values="nilai").round(2))`,
      tests: [
        { desc: "Shape long", expr: "long.shape == (len(df) * 3, 4)" },
        { desc: "Kolom long", expr: "long.columns.tolist() == ['siswa_id', 'school', 'periode', 'nilai']" },
        { desc: "Rata-rata G3 GP benar", expr: "abs(long[(long['school'] == 'GP') & (long['periode'] == 'G3')]['nilai'].mean() - df[df['school'] == 'GP']['G3'].mean()) < 1e-12" },
      ],
      hints: ["Konsep: melt dengan value_vars.", "id_vars mempertahankan identitas siswa.", "pivot_table untuk ringkasan."],
      explanation: "Format long memudahkan melihat tren nilai dari periode ke periode untuk setiap sekolah.",
    },
  ],
  quiz: [
    { id: "load-rc-q1", type: "mcq", prompt: "`df.max(axis=1)` menghasilkan…", options: ["Nilai maksimum per kolom", "Nilai maksimum per baris", "Satu nilai", "Error"], answer: 1, explanation: "axis=1 → per baris." },
    { id: "load-rc-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nw = pd.DataFrame({"k": ["a"], "x1": [1], "x2": [2], "x3": [3]})\nprint(w.melt(id_vars="k").shape)`, options: ["(1, 4)", "(3, 3)", "(3, 2)", "(4, 1)"], answer: 1, explanation: "3 baris (x1–x3) × kolom k, variable, value." },
    { id: "load-rc-q3", type: "tf", prompt: "Pada tidy data, setiap variabel menempati satu kolom dan setiap observasi satu baris.", answer: true, explanation: "Definisi tidy data." },
    { id: "load-rc-q4", type: "fill", prompt: "Mengubah data wide menjadi long: `df.____(id_vars=...)`", answer: ["melt"], explanation: "melt." },
    { id: "load-rc-q5", type: "case", prompt: "Laporan polusi punya kolom `jan_2025`, `feb_2025`, …, satu baris per stasiun. Untuk model harian/bulanan, langkah pertama?", options: ["Langsung training", "melt menjadi (stasiun, bulan, pm25)", "Hapus kolom", "Transpose saja"], answer: 1, explanation: "Nilai waktu tersimpan di nama kolom — rapikan menjadi long." },
  ],
  challenge: {
    id: "load-rc-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Dari laporan multi-variabel ke tabel fitur",
    prompt: [
      "Laporan `wide` punya kolom berpola `<polutan>_<tanggal>` (misalnya `pm25_2025-01-01`, `o3_2025-01-01`). Ubah menjadi tabel fitur harian per stasiun dengan kolom `stasiun`, `tanggal` (datetime), `o3`, `pm25`:",
      "1. melt dengan `id_vars=\"stasiun\"`.\n2. Pisahkan nama kolom lama menjadi `polutan` dan `tanggal` dengan `str.split(\"_\", n=1, expand=True)`.\n3. pivot_table dengan index [\"stasiun\", \"tanggal\"], columns \"polutan\", lalu `reset_index()` dan hapus nama axis kolom (`columns.name = None`).",
      "Cetak hasilnya terurut stasiun dan tanggal.",
    ],
    starter: `import pandas as pd
wide = pd.DataFrame({
    "stasiun": ["DKI1", "DKI2"],
    "pm25_2025-01-01": [55.2, 61.0], "pm25_2025-01-02": [47.9, 58.3],
    "o3_2025-01-01": [30.1, 28.4], "o3_2025-01-02": [33.5, 29.0],
})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
wide = pd.DataFrame({
    "stasiun": ["DKI1", "DKI2"],
    "pm25_2025-01-01": [55.2, 61.0], "pm25_2025-01-02": [47.9, 58.3],
    "o3_2025-01-01": [30.1, 28.4], "o3_2025-01-02": [33.5, 29.0],
})
long = wide.melt(id_vars="stasiun", var_name="kolom", value_name="nilai")
long[["polutan", "tanggal"]] = long["kolom"].str.split("_", n=1, expand=True)
long["tanggal"] = pd.to_datetime(long["tanggal"])
fitur = long.pivot_table(index=["stasiun", "tanggal"], columns="polutan", values="nilai").reset_index()
fitur.columns.name = None
fitur = fitur.sort_values(["stasiun", "tanggal"], ignore_index=True)
print(fitur)`,
    tests: [
      { desc: "Kolom benar", expr: "fitur.columns.tolist() == ['stasiun', 'tanggal', 'o3', 'pm25']" },
      { desc: "4 baris (2 stasiun × 2 hari)", expr: "len(fitur) == 4" },
      { desc: "Nilai benar", expr: "fitur.loc[(fitur['stasiun'] == 'DKI2') & (fitur['tanggal'] == '2025-01-02'), ['o3', 'pm25']].values.tolist() == [[29.0, 58.3]]" },
      { desc: "tanggal datetime", expr: "str(fitur['tanggal'].dtype).startswith('datetime64')" },
    ],
    hints: ["Konsep: melt → split → pivot.", "`str.split(\"_\", n=1, expand=True)` memisahkan di garis bawah pertama.", "pivot_table lalu reset_index."],
    explanation: "Pola melt–split–pivot merapikan hampir semua laporan berformat \"variabel_waktu\" menjadi tabel fitur tidy yang siap untuk model.",
  },
  summary: [
    "Tidy data: variabel = kolom, observasi = baris, nilai = sel.",
    "axis=0 → hasil per kolom; axis=1 → hasil per baris.",
    "melt: wide → long; pivot/pivot_table: long → wide.",
    "Baris adalah Series; hindari iterrows, gunakan operasi kolom.",
  ],
  cheatsheet: [
    { syntax: "df.mean(axis=1)", desc: "Per baris" },
    { syntax: "df.melt(id_vars=\"id\")", desc: "Wide → long" },
    { syntax: "df.pivot(index=, columns=, values=)", desc: "Long → wide" },
    { syntax: "df.pivot_table(..., aggfunc=\"mean\")", desc: "Pivot dengan duplikat" },
    { syntax: "df.T", desc: "Transpose" },
  ],
  flashcards: [
    { q: "Arti axis=0 dan axis=1", a: "axis=0 hasil per kolom; axis=1 hasil per baris" },
    { q: "Tiga aturan tidy data", a: "Variabel = kolom, observasi = baris, satu nilai per sel" },
    { q: "Ubah kolom bulan menjadi baris", a: "df.melt(id_vars=\"kota\", var_name=\"bulan\", value_name=\"nilai\")" },
  ],
  references: [
    pandasDoc("Reshaping and pivot tables — melt and pivot", "user_guide/reshaping.html"),
    pandasDoc("Getting started — How to reshape the layout of tables", "getting_started/intro_tutorials/07_reshape_table_layout.html"),
    { source: "R for Data Science (2e) — Hadley Wickham et al. (sumber buku)", title: "Chapter — Data tidying", url: "https://raw.githubusercontent.com/hadley/r4ds/main/data-tidy.qmd" },
    pandasDoc("Essential basic functionality — Iteration", "user_guide/basics.html#iteration"),
  ],
};
