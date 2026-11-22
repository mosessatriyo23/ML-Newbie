import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-concatenation",
  title: "Concatenation",
  minutes: 30,
  prerequisites: ["pd-dataframe"],
  objectives: [
    "Menumpuk DataFrame secara vertikal (baris) dengan `pd.concat`.",
    "Menyambung DataFrame secara horizontal (kolom) dengan `axis=1`.",
    "Mengatur index hasil dengan `ignore_index` dan menandai sumber dengan `keys`.",
    "Membedakan kapan memakai concat dan kapan merge.",
  ],
  definition: [
    "`pd.concat([df1, df2, ...])` **menumpuk** beberapa DataFrame. Secara default (`axis=0`) baris ditambahkan di bawah; kolom disejajarkan berdasarkan **nama** — kolom yang tidak ada di salah satu tabel diisi NaN.",
    "`axis=1` menyambung ke samping; baris disejajarkan berdasarkan **index**.",
    "`ignore_index=True` membuat index baru 0..n−1 (tanpa itu, label lama bisa duplikat). `keys=[\"a\", \"b\"]` menambah level index yang menandai asal baris.",
    "Perbedaan dengan merge: **concat** menumpuk/menyambung berdasarkan posisi label yang sudah sejajar; **merge** mencocokkan nilai kunci. Method lama `df.append` sudah dihapus sejak pandas 2.0 — gunakan `pd.concat`.",
  ],
  why: [
    "Data sering terpecah per file: data per tahun (2021.csv … 2025.csv), per kota, atau per batch. Concat menyatukannya menjadi satu tabel.",
    "Dalam kompetisi, train dan test sering digabung sementara agar preprocessing (encoding, fitur kalender) diterapkan konsisten, lalu dipisah lagi. Hasil prediksi dari beberapa model juga disusun dengan concat.",
  ],
  when: [
    "- Menggabungkan file berstruktur sama (per tahun/per kota).",
    "- Menyatukan train dan test sementara untuk transformasi yang tidak memakai target.",
    "- Menyambung fitur hasil encoding ke tabel asli (axis=1).",
    "- Menyusun tabel hasil eksperimen.",
  ],
  analogy: "Concat seperti **menumpuk lembar absensi** dari beberapa minggu menjadi satu bundel (vertikal), atau **menempelkan kolom tambahan** di sisi kanan lembar yang sama (horizontal). Merge, sebaliknya, seperti mencocokkan dua daftar berdasarkan nama siswa.",
  syntax: {
    code: `pd.concat([df_2024, df_2025], ignore_index=True)        # vertikal
pd.concat([X_num, X_dummies], axis=1)                   # horizontal
pd.concat([train, test], keys=["train", "test"])
pd.concat(list_of_dfs, ignore_index=True)`,
  },
  anatomy: [
    ["pd.concat([...])", "Menerima list DataFrame/Series."],
    ["axis=0 / axis=1", "Tumpuk baris / sambung kolom."],
    ["ignore_index=True", "Index baru 0..n−1."],
    ["keys=[...]", "Label asal setiap bagian."],
    ["join=\"inner\"", "Hanya kolom yang ada di semua tabel."],
  ],
  examples: [
    {
      title: "Contoh 1 — Menumpuk data per tahun",
      code: `import pandas as pd

d2024 = pd.DataFrame({"tanggal": ["2024-12-30", "2024-12-31"], "pm25": [58, 61]})
d2025 = pd.DataFrame({"tanggal": ["2025-01-01", "2025-01-02"], "pm25": [62, 55]})
semua = pd.concat([d2024, d2025])
print(semua)
print(semua.index.tolist())
semua = pd.concat([d2024, d2025], ignore_index=True)
print(semua.index.tolist())`,
      output: "      tanggal  pm25\n0  2024-12-30    58\n1  2024-12-31    61\n0  2025-01-01    62\n1  2025-01-02    55\n[0, 1, 0, 1]\n[0, 1, 2, 3]",
      explain: [
        ["pd.concat([d2024, d2025])", "Baris 2025 ditambahkan di bawah 2024."],
        ["semua.index.tolist()", "Tanpa ignore_index, label 0 dan 1 muncul dua kali."],
        ["ignore_index=True", "Index baru yang rapi."],
      ],
    },
    {
      title: "Contoh 2 — Kolom tidak sama dan keys",
      code: `import pandas as pd

a = pd.DataFrame({"kota": ["Jakarta"], "pm25": [62], "o3": [30]})
b = pd.DataFrame({"kota": ["Bandung"], "pm25": [35]})
print(pd.concat([a, b], ignore_index=True))
print(pd.concat([a, b], join="inner", ignore_index=True))
print(pd.concat([a, b], keys=["stasiun_a", "stasiun_b"]))`,
      output: "      kota  pm25    o3\n0  Jakarta    62  30.0\n1  Bandung    35   NaN\n      kota  pm25\n0  Jakarta    62\n1  Bandung    35\n                kota  pm25    o3\nstasiun_a 0  Jakarta    62  30.0\nstasiun_b 0  Bandung    35   NaN",
      explain: [
        ["pd.concat([a, b], ignore_index=True)", "Kolom o3 tidak ada di b → NaN."],
        ["join=\"inner\"", "Hanya kolom yang ada di semua tabel."],
        ["keys=[\"stasiun_a\", \"stasiun_b\"]", "Index bertingkat menandai asal baris."],
      ],
      change: "Struktur tabel tidak identik.",
    },
    {
      title: "Contoh 3 — Horizontal: menyambung fitur hasil encoding",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv").head(4)
num = df[["tenure_months", "monthly_charges"]]
dummies = pd.get_dummies(df["contract"], prefix="contract", dtype=int)
X = pd.concat([num, dummies], axis=1)
print(X)
print(X.shape)`,
      output: "   tenure_months  monthly_charges  contract_Month-to-month  contract_Two year\n0             68           103.35                        1                  0\n1             11            25.20                        0                  1\n2             36           112.48                        1                  0\n3             51            29.91                        1                  0\n(4, 4)",
      explain: [
        ["pd.get_dummies(df[\"contract\"], prefix=\"contract\", dtype=int)", "One-hot encoding sederhana: satu kolom 0/1 per kategori (dibahas di Module 08)."],
        ["pd.concat([num, dummies], axis=1)", "Disambung ke samping; baris disejajarkan berdasarkan index yang sama."],
      ],
      change: "axis=1: menambah kolom, bukan baris.",
    },
    {
      title: "Contoh 4 — Gabung train-test sementara lalu pisahkan kembali",
      code: `import pandas as pd

train = pd.DataFrame({"tanggal": pd.to_datetime(["2025-12-30", "2025-12-31"]), "pm25": [58, 61]})
test = pd.DataFrame({"tanggal": pd.to_datetime(["2026-01-01", "2026-01-02"])})

full = pd.concat([train, test], keys=["train", "test"])
full["bulan"] = full["tanggal"].dt.month
full["hari"] = full["tanggal"].dt.dayofweek
print(full)

train2 = full.loc["train"]
test2 = full.loc["test"].drop(columns="pm25")
print(train2.shape, test2.shape)`,
      output: "           tanggal  pm25  bulan  hari\ntrain 0 2025-12-30  58.0     12     1\n      1 2025-12-31  61.0     12     2\ntest  0 2026-01-01   NaN      1     3\n      1 2026-01-02   NaN      1     4\n(2, 4) (2, 3)",
      explain: [
        ["pd.concat([train, test], keys=[\"train\", \"test\"])", "Ditumpuk dengan penanda asal; test tidak punya pm25 → NaN."],
        ["full[\"bulan\"] = full[\"tanggal\"].dt.month", "Fitur yang TIDAK memakai target aman dihitung bersama."],
        ["full.loc[\"train\"]", "Pisahkan kembali dengan label keys."],
      ],
      change: "Concat dipakai sebagai bagian dari alur preprocessing kompetisi.",
    },
  ],
  params: [
    {
      title: "pd.concat",
      items: [
        { name: "objs", desc: "List DataFrame/Series." },
        { name: "axis=0", desc: "0 = baris, 1 = kolom." },
        { name: "join=\"outer\"", desc: "\"inner\" untuk hanya label yang sama." },
        { name: "ignore_index=False", desc: "True → index baru." },
        { name: "keys=None", desc: "Label level tambahan untuk asal data." },
        { name: "verify_integrity=False", desc: "True → error jika label hasil duplikat." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\na = pd.DataFrame({"x": [1, 2]})\nb = pd.DataFrame({"x": [3], "y": [9]})\nr = pd.concat([a, b], ignore_index=True)\nprint(r.shape, r["y"].isna().sum(), pd.concat([a, a], axis=1).shape)`, output: "(3, 2) 2 (2, 2)" },
  tryIt: `import pandas as pd

df = pd.read_csv("iris.csv")
bagian = [df[df["species"] == s].head(2) for s in df["species"].unique()]
print(pd.concat(bagian, ignore_index=True))`,
  mistakes: [
    {
      title: "Memakai df.append (sudah dihapus)",
      wrong: `import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(a.append(b))`,
      error: "AttributeError",
      fix: `import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(pd.concat([a, b], ignore_index=True))`,
      explain: "`DataFrame.append` dihapus di pandas 2.0. Gunakan `pd.concat`.",
    },
    {
      title: "Concat horizontal dengan index tidak sejajar",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3, 4]})
sub = df[df["a"] > 2]                          # index 2, 3
fitur = pd.DataFrame({"b": [10, 20]})           # index 0, 1
print(pd.concat([sub, fitur], axis=1))          # NaN di mana-mana`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3, 4]})
sub = df[df["a"] > 2].reset_index(drop=True)
fitur = pd.DataFrame({"b": [10, 20]})
print(pd.concat([sub, fitur], axis=1))`,
      explain: "axis=1 menyejajarkan berdasarkan index. Samakan index (misalnya `reset_index(drop=True)`) sebelum menyambung.",
    },
    {
      title: "Memberi DataFrame langsung, bukan list",
      wrong: `import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(pd.concat(a, b))`,
      error: "TypeError",
      fix: `import pandas as pd
a = pd.DataFrame({"x": [1]})
b = pd.DataFrame({"x": [2]})
print(pd.concat([a, b]))`,
      explain: "Argumen pertama concat adalah **list** (atau iterable) DataFrame.",
    },
  ],
  bestPractices: [
    "Kumpulkan DataFrame dalam list lalu concat sekali di akhir — jauh lebih cepat daripada concat di dalam loop.",
    "Gunakan `ignore_index=True` untuk tumpukan baris kecuali index bermakna.",
    "Saat menggabungkan train dan test, jangan menghitung fitur yang memakai target atau statistik gabungan yang bocor dari test (misalnya scaling).",
    "Periksa `shape` dan jumlah NaN setelah concat.",
  ],
  exercises: [
    {
      id: "pd-concat-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Index baru",
      prompt: "Lengkapi agar index hasil adalah 0, 1, 2, 3.",
      starter: `import pandas as pd
a = pd.DataFrame({"x": [1, 2]})
b = pd.DataFrame({"x": [3, 4]})
c = pd.concat([a, b], ____=True)
print(c.index.tolist())`,
      solution: `import pandas as pd
a = pd.DataFrame({"x": [1, 2]})
b = pd.DataFrame({"x": [3, 4]})
c = pd.concat([a, b], ignore_index=True)
print(c.index.tolist())`,
      tests: [{ desc: "Index 0..3", expr: "c.index.tolist() == [0, 1, 2, 3]" }],
      hints: ["Konsep: mengabaikan index lama.", "Parameter bernama \"ignore ...\".", "`ignore_index=True`"],
      explanation: "Index lama diabaikan, dibuat ulang.",
    },
    {
      id: "pd-concat-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
a = pd.DataFrame({"p": [1, 2], "q": [3, 4]})
b = pd.DataFrame({"q": [5], "r": [6]})
print(pd.concat([a, b], ignore_index=True).shape)
print(pd.concat([a, b], join="inner").columns.tolist())
print(pd.concat([a, b], axis=1).shape)`,
      answer: "(3, 3)\n['q']\n(2, 4)",
      hints: ["Konsep: outer vs inner, axis.", "Vertikal: 3 baris, kolom p, q, r.", "Horizontal: index 0, 1 dan 0 → 2 baris, 4 kolom."],
      explanation: "(3, 3); ['q']; (2, 4).",
    },
    {
      id: "pd-concat-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — append",
      prompt: "Kode memakai method lama yang sudah dihapus. Perbaiki agar `log` berisi semua baris hasil.",
      starter: `import pandas as pd
log = pd.DataFrame({"model": ["LinReg"], "mae": [12.4]})
baru = pd.DataFrame({"model": ["RF"], "mae": [9.8]})
log = log.append(baru, ignore_index=True)
print(log)`,
      solution: `import pandas as pd
log = pd.DataFrame({"model": ["LinReg"], "mae": [12.4]})
baru = pd.DataFrame({"model": ["RF"], "mae": [9.8]})
log = pd.concat([log, baru], ignore_index=True)
print(log)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "log 2 baris", expr: "log['model'].tolist() == ['LinReg', 'RF']" },
      ],
      hints: ["Konsep: pengganti append.", "Gunakan fungsi tingkat atas pandas.", "`pd.concat([log, baru], ignore_index=True)`"],
      explanation: "pd.concat adalah cara resmi sejak pandas 2.0.",
    },
    {
      id: "pd-concat-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Gabungkan hasil loop",
      prompt: "Untuk setiap `k` di [1, 3, 5], buat DataFrame satu baris `{\"k\": k, \"skor\": 1 / k}` dan kumpulkan di list `bagian`. Setelah loop, gabungkan dengan concat (ignore_index) menjadi `hasil`. Cetak `hasil`.",
      starter: `import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
bagian = []
for k in [1, 3, 5]:
    bagian.append(pd.DataFrame({"k": [k], "skor": [1 / k]}))
hasil = pd.concat(bagian, ignore_index=True)
print(hasil)`,
      tests: [
        { desc: "3 baris", expr: "hasil['k'].tolist() == [1, 3, 5]" },
        { desc: "skor benar", expr: "abs(hasil['skor'] - 1 / hasil['k']).max() < 1e-12" },
        { desc: "concat sekali di akhir", expr: "_code.count('concat') == 1" },
      ],
      hints: ["Konsep: kumpulkan dulu, concat sekali.", "`bagian.append(pd.DataFrame({...}))` (append milik list Python).", "`pd.concat(bagian, ignore_index=True)`"],
      explanation: "list.append milik Python tetap boleh; yang dihapus adalah DataFrame.append.",
    },
    {
      id: "pd-concat-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Satukan potongan dataset",
      prompt: [
        "Simulasikan data yang terpecah: baca `student_performance.csv`, lalu pecah menjadi `sekolah_gp` (school == \"GP\") dan `sekolah_ms` (school == \"MS\").",
        "Satukan kembali dengan `pd.concat([...], keys=[\"GP\", \"MS\"])` → `gabung`. Cetak jumlah baris per level pertama (`gabung.groupby(level=0).size()`) dan pastikan total baris sama dengan data asli.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("student_performance.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("student_performance.csv")
sekolah_gp = df[df["school"] == "GP"]
sekolah_ms = df[df["school"] == "MS"]
gabung = pd.concat([sekolah_gp, sekolah_ms], keys=["GP", "MS"])
print(gabung.groupby(level=0).size())
print(len(gabung) == len(df))`,
      tests: [
        { desc: "Total baris sama", expr: "len(gabung) == len(df)" },
        { desc: "Keys benar", expr: "sorted(set(gabung.index.get_level_values(0))) == ['GP', 'MS']" },
        { desc: "Isi level GP benar", expr: "(gabung.loc['GP', 'school'] == 'GP').all()" },
      ],
      hints: ["Konsep: concat dengan keys.", "Filter dua kelompok dulu.", "`gabung.groupby(level=0).size()`"],
      explanation: "keys menyimpan asal data — berguna ketika file dari beberapa sumber/sekolah/stasiun disatukan.",
    },
  ],
  quiz: [
    { id: "pd-concat-q1", type: "mcq", prompt: "Menggabungkan data 2024.csv dan 2025.csv yang kolomnya sama, fungsi yang tepat?", options: ["pd.merge", "pd.concat", "df.join", "df.append"], answer: 1, explanation: "Menumpuk baris = concat." },
    { id: "pd-concat-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\na = pd.DataFrame({"x": [1]})\nprint(pd.concat([a, a, a]).shape)`, options: ["(1, 3)", "(3, 1)", "(1, 1)", "(3, 3)"], answer: 1, explanation: "Tiga baris, satu kolom." },
    { id: "pd-concat-q3", type: "tf", prompt: "`pd.concat(..., axis=1)` menyejajarkan baris berdasarkan index.", answer: true, explanation: "Karena itu index harus cocok." },
    { id: "pd-concat-q4", type: "fill", prompt: "Hanya kolom yang ada di semua tabel: `pd.concat([a, b], join=\"____\")`", answer: ["inner"], explanation: "join=\"inner\"." },
    { id: "pd-concat-q5", type: "case", prompt: "Kamu menggabungkan train+test untuk membuat fitur. Fitur mana yang TIDAK aman dihitung pada data gabungan?", options: ["Bulan dari tanggal", "Penanda hari libur", "Rata-rata target per bulan", "Hari dalam seminggu"], answer: 2, explanation: "Fitur yang memakai target harus dihitung dari train saja." },
  ],
  challenge: {
    id: "pd-concat-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Preprocessing konsisten train & test",
    prompt: [
      "Kategori di test kadang berbeda dengan train, sehingga `get_dummies` terpisah menghasilkan kolom berbeda.",
      "1. Gabungkan `train` dan `test` dengan `keys=[\"train\", \"test\"]` → `full`.\n2. Buat `dummies = pd.get_dummies(full[\"kota\"], prefix=\"kota\", dtype=int)` lalu `full2 = pd.concat([full.drop(columns=\"kota\"), dummies], axis=1)`.\n3. Pisahkan `X_train = full2.loc[\"train\"].drop(columns=\"y\")`, `X_test = full2.loc[\"test\"].drop(columns=\"y\")`.",
      "Cetak kolom X_train dan X_test — harus identik.",
    ],
    starter: `import pandas as pd
train = pd.DataFrame({"kota": ["Jakarta", "Bandung", "Jakarta"], "luas": [100, 80, 120], "y": [1, 0, 1]})
test = pd.DataFrame({"kota": ["Surabaya", "Bandung"], "luas": [90, 70]})
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
train = pd.DataFrame({"kota": ["Jakarta", "Bandung", "Jakarta"], "luas": [100, 80, 120], "y": [1, 0, 1]})
test = pd.DataFrame({"kota": ["Surabaya", "Bandung"], "luas": [90, 70]})
full = pd.concat([train, test], keys=["train", "test"])
dummies = pd.get_dummies(full["kota"], prefix="kota", dtype=int)
full2 = pd.concat([full.drop(columns="kota"), dummies], axis=1)
X_train = full2.loc["train"].drop(columns="y")
X_test = full2.loc["test"].drop(columns="y")
print(X_train.columns.tolist())
print(X_test.columns.tolist())`,
    tests: [
      { desc: "Kolom identik", expr: "X_train.columns.tolist() == X_test.columns.tolist()" },
      { desc: "Kolom kota lengkap", expr: "X_train.columns.tolist() == ['luas', 'kota_Bandung', 'kota_Jakarta', 'kota_Surabaya']" },
      { desc: "Ukuran benar", expr: "X_train.shape == (3, 4) and X_test.shape == (2, 4)" },
      { desc: "Encoding test benar", expr: "X_test['kota_Surabaya'].tolist() == [1, 0]" },
    ],
    hints: ["Konsep: concat dengan keys untuk transformasi bersama.", "get_dummies pada kolom kota gabungan.", "Sambung horizontal, lalu pisahkan dengan `.loc[\"train\"]`."],
    explanation: "Cara yang lebih kokoh di produksi adalah `OneHotEncoder(handle_unknown=\"ignore\")` dari scikit-learn yang di-fit pada train (Module 08) — tetapi pola concat ini sering dipakai untuk analisis cepat.",
  },
  summary: [
    "`pd.concat([...])` menumpuk baris (axis=0) atau menyambung kolom (axis=1).",
    "Kolom/baris disejajarkan berdasarkan label; yang tidak ada → NaN (join=\"inner\" untuk irisan).",
    "`ignore_index=True` untuk index baru; `keys` untuk menandai asal.",
    "concat = tumpuk/sambung; merge = cocokkan kunci. `df.append` sudah dihapus.",
  ],
  cheatsheet: [
    { syntax: "pd.concat([a, b], ignore_index=True)", desc: "Tumpuk baris" },
    { syntax: "pd.concat([X, d], axis=1)", desc: "Sambung kolom" },
    { syntax: "pd.concat([tr, te], keys=[\"train\", \"test\"])", desc: "Tandai asal" },
    { syntax: "full.loc[\"train\"]", desc: "Pisahkan lagi" },
    { syntax: "pd.concat(list_df)", desc: "Gabung hasil loop" },
  ],
  flashcards: [
    { q: "Tumpuk df_a dan df_b dengan index baru", a: "pd.concat([df_a, df_b], ignore_index=True)" },
    { q: "Pengganti df.append di pandas 2+", a: "pd.concat([df, baru])" },
    { q: "Perbedaan concat dan merge", a: "concat menumpuk/menyambung berdasarkan label; merge mencocokkan nilai kunci" },
  ],
  references: [
    pandasDoc("Merge, join, concatenate and compare — concat", "user_guide/merging.html#concat"),
    pandasDoc("pandas.concat", "reference/api/pandas.concat.html"),
    pandasDoc("What's new in 2.0.0 — Removal of DataFrame.append", "whatsnew/v2.0.0.html#removal-of-prior-version-deprecations-changes"),
    pandasDoc("pandas.get_dummies", "reference/api/pandas.get_dummies.html"),
  ],
};
