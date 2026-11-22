import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-selecting-rows",
  title: "Selecting Rows",
  minutes: 30,
  prerequisites: ["pd-selecting-columns"],
  objectives: [
    "Memilih baris dengan slicing posisi (`df[2:5]`), `head`, dan `tail`.",
    "Memahami bahwa kurung siku dengan slice/boolean memilih baris, sedangkan dengan nama memilih kolom.",
    "Mengambil sampel acak baris dengan `sample` (dengan `random_state`).",
    "Mengenal `loc` dan `iloc` sebagai cara eksplisit memilih baris (dibahas mendalam di materi berikutnya).",
  ],
  definition: [
    "Kurung siku DataFrame punya dua perilaku:\n- **nama kolom / list nama** → memilih **kolom**\n- **slice** (`df[0:3]`) atau **array boolean** (`df[df[\"umur\"] > 30]`) → memilih **baris**",
    "Cara memilih baris:\n- `df.head(n)` / `df.tail(n)` — n baris pertama/terakhir\n- `df[a:b]` — slice posisi (b eksklusif)\n- `df.sample(n, random_state=...)` — n baris acak\n- `df.iloc[i]` — baris berdasarkan posisi\n- `df.loc[label]` — baris berdasarkan label index",
    "Satu baris yang diambil dengan `iloc[i]`/`loc[label]` dikembalikan sebagai **Series** yang index-nya adalah nama kolom.",
  ],
  why: [
    "Melihat contoh baris membantu memahami data mentah; sampel acak lebih representatif daripada `head()` jika data terurut (misalnya berdasarkan tanggal atau kelas).",
    "Memilih baris adalah dasar filtering, membuat subset data latih, dan memeriksa data yang salah diprediksi model.",
  ],
  when: [
    "- Melihat beberapa baris awal/akhir/acak.",
    "- Mengambil potongan data berdasarkan posisi.",
    "- Mengambil satu observasi untuk diperiksa.",
    "- Membuat subset kecil untuk eksperimen cepat.",
  ],
  analogy: "Jika memilih kolom seperti memilih **jenis informasi** di formulir (nama, umur), memilih baris seperti mengambil **formulir orang tertentu** dari tumpukan — bisa dari atas (head), dari bawah (tail), atau diambil acak (sample).",
  syntax: {
    code: `df.head(3)   df.tail(3)
df[10:15]                       # baris posisi 10..14
df.sample(5, random_state=42)
df.iloc[0]                      # baris pertama (Series)
df.loc[label]                   # baris dengan label`,
  },
  anatomy: [
    ["df[10:15]", "Slice baris berdasarkan posisi, akhir eksklusif."],
    ["sample(n, random_state)", "Baris acak yang dapat diulang."],
    ["sample(frac=0.1)", "10% baris secara acak."],
    ["df.iloc[0]", "Satu baris → Series."],
  ],
  examples: [
    {
      title: "Contoh 1 — head, tail, dan slice",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df.head(2))
print(df.tail(2))
print(df[10:13])`,
      output: "  student_id  hours_studied  attendance  previous_score  final_score\n0       S001            8.0          97              70           96\n1       S002            4.9          90              87           89\n   student_id  hours_studied  attendance  previous_score  final_score\n28       S029            2.4          91              61           66\n29       S030            7.1          94              55           91\n   student_id  hours_studied  attendance  previous_score  final_score\n10       S011            4.3          92              88           86\n11       S012            9.3          67              59           96\n12       S013            6.8          78              87           87",
      explain: [
        ["df.head(2)", "Dua baris pertama."],
        ["df.tail(2)", "Dua baris terakhir (perhatikan index 28, 29)."],
        ["df[10:13]", "Slice posisi: baris ke-10, 11, 12."],
      ],
    },
    {
      title: "Contoh 2 — Satu baris sebagai Series",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
siswa = df.iloc[0]
print(siswa)
print(type(siswa).__name__)
print("Nilai akhir:", siswa["final_score"])`,
      output: "student_id        S001\nhours_studied      8.0\nattendance          97\nprevious_score      70\nfinal_score         96\nName: 0, dtype: object\nSeries\nNilai akhir: 96",
      explain: [
        ["siswa = df.iloc[0]", "Baris posisi pertama."],
        ["print(siswa)", "Index Series = nama kolom; nilainya = isi baris."],
        ["siswa[\"final_score\"]", "Akses nilai kolom tertentu pada baris itu."],
      ],
      change: "Dari beberapa baris (DataFrame) menjadi satu baris (Series).",
    },
    {
      title: "Contoh 3 — Sampel acak yang dapat diulang",
      code: `import pandas as pd

df = pd.read_csv("iris.csv")
print(df.head(3)["species"].tolist())          # data terurut per kelas
s1 = df.sample(5, random_state=42)
s2 = df.sample(5, random_state=42)
print(s1["species"].tolist())
print(s1.index.equals(s2.index))
print(len(df.sample(frac=0.2, random_state=0)))`,
      output: "['setosa', 'setosa', 'setosa']\n['versicolor', 'setosa', 'virginica', 'versicolor', 'versicolor']\nTrue\n30",
      explain: [
        ["df.head(3)[\"species\"]", "head hanya menampilkan setosa karena data terurut."],
        ["df.sample(5, random_state=42)", "Lima baris acak dari seluruh kelas."],
        ["s1.index.equals(s2.index)", "random_state sama → baris yang sama."],
        ["df.sample(frac=0.2, random_state=0)", "20% dari 150 baris = 30."],
      ],
      change: "head bisa menyesatkan pada data terurut; sample memberi gambaran lebih adil.",
    },
    {
      title: "Contoh 4 — Kurung siku: kolom atau baris?",
      code: `import pandas as pd

df = pd.DataFrame({"nama": ["Ani", "Budi", "Citra", "Dodi"], "nilai": [80, 65, 92, 70]})
print(df["nilai"].tolist())          # nama → kolom
print(df[1:3])                       # slice → baris
print(df[df["nilai"] >= 75])         # boolean → baris`,
      output: "[80, 65, 92, 70]\n    nama  nilai\n1   Budi     65\n2  Citra     92\n    nama  nilai\n0    Ani     80\n2  Citra     92",
      explain: [
        ["df[\"nilai\"]", "String → kolom."],
        ["df[1:3]", "Slice → baris posisi 1 dan 2."],
        ["df[df[\"nilai\"] >= 75]", "Series boolean → baris yang True (materi Filtering Data)."],
      ],
      change: "Satu operator, tiga perilaku — inilah alasan `loc`/`iloc` lebih disarankan untuk kejelasan.",
    },
  ],
  params: [
    {
      title: "Cara memilih baris",
      items: [
        { name: "df.head(n=5), df.tail(n=5)", desc: "Awal/akhir." },
        { name: "df[start:stop]", desc: "Slice posisi." },
        { name: "df.sample(n=None, frac=None, replace=False, random_state=None)", desc: "Acak." },
        { name: "df.iloc[pos]", desc: "Berdasarkan posisi." },
        { name: "df.loc[label]", desc: "Berdasarkan label." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": range(10)})\nprint(df[3:6]["a"].tolist(), df.tail(2)["a"].tolist(), len(df.sample(frac=0.5, random_state=1)))`, output: "[3, 4, 5] [8, 9] 5" },
  tryIt: `import pandas as pd

df = pd.read_csv("house_prices.csv")
print(df.sample(3, random_state=7))
print(df.iloc[-1])`,
  mistakes: [
    {
      title: "Mengambil satu baris dengan df[0]",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df[0])`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.iloc[0])`,
      explain: "`df[0]` mencari KOLOM bernama 0. Untuk baris gunakan `df.iloc[0]`.",
    },
    {
      title: "Sampel lebih besar dari data tanpa replace",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
print(df.sample(5))`,
      error: "ValueError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3]})
print(df.sample(5, replace=True, random_state=0))`,
      explain: "Tanpa pengembalian, n tidak boleh lebih dari jumlah baris.",
    },
    {
      title: "Sampel tanpa random_state",
      wrong: `import pandas as pd
df = pd.read_csv("iris.csv")
print(df.sample(3).index.tolist())   # berbeda setiap dijalankan`,
      fix: `import pandas as pd
df = pd.read_csv("iris.csv")
print(df.sample(3, random_state=42).index.tolist())`,
      explain: "Tetapkan random_state agar hasil bisa diulang.",
    },
  ],
  bestPractices: [
    "Gunakan `sample(..., random_state=...)` selain `head()` untuk melihat data.",
    "Gunakan `iloc`/`loc` untuk memilih baris agar maksud kode jelas.",
    "Untuk eksperimen cepat di data besar, kerjakan dulu di `df.sample(frac=0.1, random_state=0)`.",
  ],
  exercises: [
    {
      id: "pd-selrow-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Lima baris terakhir",
      prompt: "Lengkapi agar `akhir` berisi 5 baris terakhir `df`.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.____(5)
print(akhir)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.tail(5)
print(akhir)`,
      tests: [{ desc: "Index 145..149", expr: "akhir.index.tolist() == [145, 146, 147, 148, 149]" }],
      hints: ["Konsep: baris akhir.", "Kebalikan dari head.", "`df.tail(5)`"],
      explanation: "`tail` = ekor data.",
    },
    {
      id: "pd-selrow-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"x": [10, 20, 30, 40, 50]}, index=["a", "b", "c", "d", "e"])
print(df[1:4]["x"].tolist())
print(df.iloc[-1]["x"])
print(df.loc["c", "x"])`,
      answer: "[20, 30, 40]\n50\n30",
      hints: ["Konsep: slice posisi, iloc, loc.", "Slice 1:4 → posisi 1, 2, 3.", "loc memakai label \"c\"."],
      explanation: "[20, 30, 40]; baris terakhir 50; label c → 30.",
    },
    {
      id: "pd-selrow-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Baris ketiga",
      prompt: "Perbaiki agar `baris` berisi baris pada posisi ketiga (index posisi 2).",
      starter: `import pandas as pd
df = pd.read_csv("student_scores.csv")
baris = df[2]
print(baris)`,
      solution: `import pandas as pd
df = pd.read_csv("student_scores.csv")
baris = df.iloc[2]
print(baris)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "baris = baris posisi 2", expr: "baris['student_id'] == df['student_id'].iloc[2]" },
      ],
      hints: ["Konsep: [] dengan angka mencari kolom.", "Gunakan pemilih berdasarkan posisi.", "`df.iloc[2]`"],
      explanation: "`iloc` = integer location untuk baris.",
    },
    {
      id: "pd-selrow-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Subset eksperimen",
      prompt: "Dari `adult_income.csv`, buat `kecil` = sampel 10% baris dengan `random_state=0`. Cetak `len(kecil)` dan proporsi `income` di `kecil` (normalize, 3 desimal).",
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")
kecil = df.sample(frac=0.1, random_state=0)
print(len(kecil))
print(kecil["income"].value_counts(normalize=True).round(3))`,
      tests: [
        { desc: "10% baris", expr: "len(kecil) == round(len(df) * 0.1)" },
        { desc: "Reproducible", expr: "kecil.index.equals(df.sample(frac=0.1, random_state=0).index)" },
      ],
      hints: ["Konsep: sampel acak berdasarkan fraksi.", "`df.sample(frac=0.1, random_state=0)`", "Lalu value_counts(normalize=True)."],
      explanation: "Proporsi kelas di sampel acak mendekati populasi — cocok untuk eksperimen cepat.",
    },
    {
      id: "pd-selrow-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Periksa rumah termahal",
      prompt: [
        "Baca `house_prices.csv`. Cari posisi rumah termahal dengan `df[\"price_million\"].to_numpy().argmax()` → `pos`, lalu ambil barisnya dengan `iloc` → `termahal` (Series).",
        "Cetak `termahal` dan rasio harganya terhadap median harga (`rasio`, 2 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
pos = df["price_million"].to_numpy().argmax()
termahal = df.iloc[pos]
rasio = round(termahal["price_million"] / df["price_million"].median(), 2)
print(termahal)
print(rasio)`,
      tests: [
        { desc: "termahal adalah baris harga maksimum", expr: "termahal['price_million'] == df['price_million'].max()" },
        { desc: "termahal Series", expr: "type(termahal).__name__ == 'Series'" },
        { desc: "rasio benar", expr: "rasio == round(df['price_million'].max() / df['price_million'].median(), 2)" },
      ],
      hints: ["Konsep: posisi → iloc.", "argmax memberi posisi.", "`termahal[\"price_million\"] / df[\"price_million\"].median()`"],
      explanation: "Memeriksa observasi ekstrem satu per satu membantu memutuskan apakah itu outlier yang valid atau kesalahan data.",
    },
  ],
  quiz: [
    { id: "pd-selrow-q1", type: "mcq", prompt: "`df[2:5]` memilih…", options: ["Kolom 2 sampai 5", "Baris posisi 2, 3, 4", "Baris 2 sampai 5 inklusif", "Error"], answer: 1, explanation: "Slice pada [] memilih baris, akhir eksklusif." },
    { id: "pd-selrow-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [5, 6, 7]})\nprint(df.iloc[1]["a"])`, options: ["5", "6", "7", "Error"], answer: 1, explanation: "Posisi 1 → 6." },
    { id: "pd-selrow-q3", type: "tf", prompt: "`df.sample(5, random_state=1)` mengembalikan baris yang sama setiap dijalankan.", answer: true, explanation: "random_state menetapkan seed." },
    { id: "pd-selrow-q4", type: "fill", prompt: "Mengambil 25% baris secara acak: `df.sample(____=0.25)`", answer: ["frac"], explanation: "Parameter `frac`." },
    { id: "pd-selrow-q5", type: "case", prompt: "Dataset terurut berdasarkan kelas. `head(10)` hanya menampilkan satu kelas. Apa yang sebaiknya dilakukan untuk melihat contoh data?", options: ["head(1000)", "df.sample(10, random_state=0)", "tail(10)", "Hapus kelas lain"], answer: 1, explanation: "Sampel acak mewakili seluruh kelas." },
  ],
  challenge: {
    id: "pd-selrow-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Sampel per kelas",
    prompt: [
      "Buat `contoh` = 2 baris acak dari setiap spesies di `iris.csv` (total 6 baris), dengan `random_state=1` untuk setiap sampel.",
      "Gunakan loop atas `df[\"species\"].unique()`, ambil `df[df[\"species\"] == sp].sample(2, random_state=1)`, kumpulkan dalam list, lalu gabungkan dengan `pd.concat(list)`. Cetak `contoh`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("iris.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("iris.csv")
bagian = []
for sp in df["species"].unique():
    bagian.append(df[df["species"] == sp].sample(2, random_state=1))
contoh = pd.concat(bagian)
print(contoh)`,
    tests: [
      { desc: "6 baris", expr: "len(contoh) == 6" },
      { desc: "2 per spesies", expr: "contoh['species'].value_counts().tolist() == [2, 2, 2]" },
      { desc: "Baris berasal dari df", expr: "contoh.equals(df.loc[contoh.index])" },
    ],
    alternatives: [
      `import pandas as pd
df = pd.read_csv("iris.csv")
contoh = df.groupby("species").sample(2, random_state=1)
print(contoh)`,
    ],
    hints: ["Konsep: sampel berlapis (stratified).", "Filter per spesies lalu sample(2).", "`pd.concat(bagian)` menggabungkan DataFrame secara vertikal."],
    explanation: "Sampel per kelas adalah ide dasar *stratified sampling* (Module 07). Pandas juga menyediakan `df.groupby(\"species\").sample(2)`.",
  },
  summary: [
    "Kurung siku: nama → kolom; slice/boolean → baris.",
    "`head`, `tail`, `df[a:b]` untuk baris berdasarkan posisi.",
    "`sample(n/frac, random_state)` untuk baris acak yang dapat diulang.",
    "`iloc[pos]`/`loc[label]` mengambil satu baris sebagai Series.",
  ],
  cheatsheet: [
    { syntax: "df.head(n), df.tail(n)", desc: "Awal/akhir" },
    { syntax: "df[a:b]", desc: "Slice baris" },
    { syntax: "df.sample(n, random_state=0)", desc: "Acak" },
    { syntax: "df.iloc[0]", desc: "Baris pertama" },
    { syntax: "df.groupby(k).sample(2)", desc: "Sampel per kelompok" },
  ],
  flashcards: [
    { q: "Ambil 5 baris acak yang dapat diulang", a: "df.sample(5, random_state=42)" },
    { q: "Ambil baris posisi pertama sebagai Series", a: "df.iloc[0]" },
    { q: "Mengapa df[0] tidak mengambil baris pertama?", a: "[] dengan nama/angka mencari kolom; gunakan df.iloc[0]" },
  ],
  references: [
    pandasDoc("Indexing and selecting data — Slicing ranges", "user_guide/indexing.html#slicing-ranges"),
    pandasDoc("pandas.DataFrame.sample", "reference/api/pandas.DataFrame.sample.html"),
    pandasDoc("pandas.DataFrame.head", "reference/api/pandas.DataFrame.head.html"),
    pandasDoc("Getting started — How do I select a subset of a DataFrame?", "getting_started/intro_tutorials/03_subset_data.html"),
  ],
};
