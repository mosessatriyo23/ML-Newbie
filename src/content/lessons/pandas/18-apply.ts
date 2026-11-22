import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-apply-function",
  title: "Apply Function",
  minutes: 40,
  prerequisites: ["pd-adding-columns", "py-functions"],
  objectives: [
    "Menerapkan fungsi ke setiap elemen Series dengan `apply` dan `map`.",
    "Memakai `map` dengan dictionary untuk mengganti nilai kategori.",
    "Menerapkan fungsi per baris (`axis=1`) dan per kolom pada DataFrame.",
    "Memahami kapan apply lambat dan bagaimana menggantinya dengan operasi vectorized.",
  ],
  definition: [
    "`s.apply(func)` menjalankan `func` untuk **setiap elemen** Series dan mengumpulkan hasilnya menjadi Series baru.",
    "`s.map(arg)` menerima fungsi **atau dictionary/Series** sebagai peta nilai: `s.map({\"yes\": 1, \"no\": 0})`. Nilai yang tidak ada di dictionary menjadi NaN.",
    "`df.apply(func, axis=0)` menerapkan fungsi ke setiap **kolom** (func menerima Series kolom); `axis=1` ke setiap **baris** (func menerima Series baris, akses nilai dengan `row[\"kolom\"]`). `df.map(func)` menerapkan fungsi ke setiap sel.",
    "apply menjalankan fungsi Python berulang kali (seperti loop), sehingga jauh lebih **lambat** daripada operasi vectorized (`df[\"a\"] * 2`, `np.where`, method `.str`, `.dt`). Gunakan apply hanya jika logikanya tidak bisa ditulis secara vectorized.",
  ],
  why: [
    "Data nyata sering membutuhkan logika kustom: membersihkan teks tidak rapi, mengekstrak merek dari nama produk, mengubah kode menjadi label, atau aturan bisnis yang rumit per baris.",
    "Memahami kapan apply diperlukan dan kapan diganti operasi vectorized membuat kode cepat dan tetap mudah dibaca — data 1 juta baris bisa berbeda puluhan kali lipat waktunya.",
  ],
  when: [
    "- Mengganti nilai kategori dengan dictionary (`map`).",
    "- Transformasi teks kustom per elemen.",
    "- Aturan yang melibatkan beberapa kolom dengan logika if/else rumit (`axis=1`).",
    "- Menghitung ringkasan kustom per kolom.",
  ],
  analogy: "apply seperti **petugas yang memeriksa formulir satu per satu** dengan daftar aturan khusus — fleksibel tetapi lambat. Operasi vectorized seperti **mesin pemindai** yang memproses seluruh tumpukan sekaligus — cepat, tetapi hanya untuk aturan yang sederhana dan seragam.",
  syntax: {
    code: `s.apply(fungsi)                       # per elemen
s.map({"yes": 1, "no": 0})            # peta nilai
df.apply(fungsi, axis=1)              # per baris
df.apply(fungsi)                      # per kolom
df[["a", "b"]].map(round)             # per sel`,
  },
  anatomy: [
    ["s.apply(f)", "f(nilai) untuk setiap elemen."],
    ["s.map(dict)", "Ganti nilai berdasarkan dictionary; yang tidak ada → NaN."],
    ["df.apply(f, axis=1)", "f(row) untuk setiap baris; row[\"kolom\"]."],
    ["df.apply(f)", "f(kolom) untuk setiap kolom."],
  ],
  examples: [
    {
      title: "Contoh 1 — apply dan map pada Series",
      code: `import pandas as pd

nilai = pd.Series([45, 72, 88, 91, 60])

def grade(x):
    if x >= 85:
        return "A"
    elif x >= 70:
        return "B"
    elif x >= 55:
        return "C"
    return "D"

print(nilai.apply(grade).tolist())
print(nilai.apply(lambda x: x + 5).tolist())

status = pd.Series(["yes", "no", "yes", "maybe"])
print(status.map({"yes": 1, "no": 0}).tolist())`,
      output: "['D', 'B', 'A', 'A', 'C']\n[50, 77, 93, 96, 65]\n[1.0, 0.0, 1.0, nan]",
      explain: [
        ["nilai.apply(grade)", "Fungsi grade dijalankan untuk setiap nilai."],
        ["nilai.apply(lambda x: x + 5)", "Lambda untuk fungsi singkat (operasi ini sebenarnya cukup `nilai + 5`)."],
        ["status.map({\"yes\": 1, \"no\": 0})", "Peta nilai; \"maybe\" tidak ada di dictionary → NaN."],
      ],
    },
    {
      title: "Contoh 2 — Membersihkan teks dengan fungsi kustom",
      code: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")

def merek(nama):
    kata = nama.split()[0]
    perbaikan = {"chevy": "chevrolet", "vw": "volkswagen", "vokswagen": "volkswagen", "toyouta": "toyota", "maxda": "mazda", "chevroelt": "chevrolet", "mercedes-benz": "mercedes"}
    return perbaikan.get(kata, kata)

df["merek"] = df["car_name"].apply(merek)
print(df[["car_name", "merek"]].head(4))
print(df["merek"].nunique(), "merek")
print(df.groupby("merek")["mpg"].mean().nlargest(3).round(1))`,
      output: "                    car_name      merek\n0  chevrolet chevelle malibu  chevrolet\n1          buick skylark 320      buick\n2         plymouth satellite   plymouth\n3              amc rebel sst        amc\n30 merek\nmerek\nnissan     36.0\ntriumph    35.0\nhonda      33.8\nName: mpg, dtype: float64",
      explain: [
        ["kata = nama.split()[0]", "Kata pertama nama mobil = merek."],
        ["perbaikan.get(kata, kata)", "Memperbaiki salah ketik/singkatan yang ada di data; jika tidak ada, kembalikan kata aslinya."],
        ["df[\"car_name\"].apply(merek)", "Fitur kategori baru dari teks bebas."],
      ],
      change: "Fungsi berisi beberapa langkah logika — alasan yang tepat untuk memakai apply.",
    },
    {
      title: "Contoh 3 — Per baris (axis=1) dan per kolom",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv").head(5)

def risiko(row):
    if row["contract"] == "Month-to-month" and row["support_tickets"] >= 3:
        return "tinggi"
    if row["tenure_months"] < 6:
        return "sedang"
    return "rendah"

df["risiko"] = df.apply(risiko, axis=1)
print(df[["contract", "support_tickets", "tenure_months", "risiko"]])

num = df[["age", "monthly_charges", "total_charges"]]
print(num.apply(lambda kol: kol.max() - kol.min()).round(1))`,
      output: "         contract  support_tickets  tenure_months  risiko\n0  Month-to-month                0             68  rendah\n1        Two year                3             11  rendah\n2  Month-to-month                3             36  tinggi\n3  Month-to-month                3             51  tinggi\n4        Two year                2             36  rendah\nage                  43.0\nmonthly_charges      87.3\ntotal_charges      6493.4\ndtype: float64",
      explain: [
        ["def risiko(row):", "row adalah Series satu baris; akses kolom dengan row[\"nama\"]."],
        ["df.apply(risiko, axis=1)", "Aturan bisnis yang melibatkan beberapa kolom."],
        ["num.apply(lambda kol: kol.max() - kol.min())", "Default axis=0: fungsi menerima setiap kolom → rentang tiap kolom."],
      ],
      change: "Fungsi menerima satu baris atau satu kolom, bukan satu elemen.",
    },
    {
      title: "Contoh 4 — apply vs vectorized: hasil sama, kecepatan berbeda",
      code: `import time
import numpy as np
import pandas as pd

df = pd.read_csv("adult_income.csv")

t0 = time.perf_counter()
a = df.apply(lambda r: r["hours_per_week"] * 52 if r["age"] < 65 else 0, axis=1)
t_apply = time.perf_counter() - t0

t0 = time.perf_counter()
b = np.where(df["age"] < 65, df["hours_per_week"] * 52, 0)
t_vec = time.perf_counter() - t0

print("Hasil sama:", (a.to_numpy() == b).all())
print("Vectorized lebih cepat:", t_vec < t_apply)
# Coba sendiri: print(round(t_apply / t_vec), "kali lebih cepat")`,
      output: "Hasil sama: True\nVectorized lebih cepat: True",
      explain: [
        ["a = df.apply(lambda r: ", "Fungsi Python dijalankan 32.561 kali, satu per baris."],
        ["np.where(df[\"age\"] < 65, df[\"hours_per_week\"] * 52, 0)", "Logika yang sama secara vectorized: satu operasi untuk semua baris."],
        ["(a.to_numpy() == b).all()", "Hasilnya identik."],
        ["t_vec < t_apply", "Vectorized biasanya puluhan sampai ratusan kali lebih cepat (angka pasti bergantung perangkat)."],
      ],
      change: "Kita membandingkan dua cara untuk logika yang sama.",
    },
  ],
  params: [
    {
      title: "apply & map",
      items: [
        { name: "Series.apply(func, args=())", desc: "Per elemen." },
        { name: "Series.map(arg, na_action=None)", desc: "Fungsi atau dict/Series pemetaan." },
        { name: "DataFrame.apply(func, axis=0, result_type=None)", desc: "Per kolom (0) atau per baris (1)." },
        { name: "DataFrame.map(func)", desc: "Per sel (dulu bernama applymap)." },
        { name: "Alternatif vectorized", desc: "Operator aritmetika, np.where/np.select, .str, .dt, pd.cut, map(dict)." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ns = pd.Series(["Ya", "tidak", "YA"])\nprint(s.str.lower().map({"ya": 1, "tidak": 0}).tolist(), s.apply(len).tolist())`, output: "[1, 0, 1] [2, 5, 2]" },
  tryIt: `import pandas as pd

df = pd.read_csv("student_performance.csv")
peta = {"yes": 1, "no": 0}
for kol in ["schoolsup", "famsup", "paid", "internet"]:
    df[kol] = df[kol].map(peta)
print(df[["schoolsup", "famsup", "paid", "internet"]].mean().round(3))`,
  mistakes: [
    {
      title: "Lupa axis=1 untuk fungsi per baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.apply(lambda row: row["a"] + row["b"]))`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1, 2], "b": [3, 4]})
print(df.apply(lambda row: row["a"] + row["b"], axis=1))`,
      explain: "Default axis=0: fungsi menerima KOLOM, sehingga `row[\"a\"]` mencari label baris \"a\". Tambahkan `axis=1`.",
    },
    {
      title: "map dengan dictionary tidak lengkap",
      wrong: `import pandas as pd
s = pd.Series(["yes", "no", "Yes"])
print(s.map({"yes": 1, "no": 0}).tolist())   # [1.0, 0.0, nan]`,
      fix: `import pandas as pd
s = pd.Series(["yes", "no", "Yes"])
print(s.str.lower().map({"yes": 1, "no": 0}).tolist())`,
      explain: "Nilai di luar dictionary menjadi NaN. Bersihkan dulu (lower/strip), lalu periksa `isna().sum()` setelah map.",
    },
    {
      title: "Fungsi gagal pada NaN",
      wrong: `import numpy as np
import pandas as pd
s = pd.Series(["toyota corolla", np.nan])
print(s.apply(lambda x: x.split()[0]))`,
      error: "AttributeError",
      fix: `import numpy as np
import pandas as pd
s = pd.Series(["toyota corolla", np.nan])
print(s.str.split().str[0])`,
      explain: "NaN adalah float, tidak punya `.split()`. Method `.str` menangani NaN secara otomatis — dan juga vectorized.",
    },
  ],
  bestPractices: [
    "Cari dulu versi vectorized (`np.where`, `.str`, `.dt`, `map(dict)`) sebelum memakai apply.",
    "Gunakan apply untuk logika rumit yang sulit divectorisasi, dan tulis fungsinya terpisah agar bisa diuji.",
    "Setelah `map(dict)`, periksa NaN baru untuk mendeteksi kategori yang terlewat.",
    "Tangani NaN di dalam fungsi kustom (`if pd.isna(x): return ...`).",
  ],
  exercises: [
    {
      id: "pd-apply-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Peta nilai",
      prompt: "Lengkapi agar `y` berisi 1 untuk \">50K\" dan 0 untuk \"<=50K\".",
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
y = df["income"].____({">50K": 1, "<=50K": 0})
print(y.value_counts())`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")
y = df["income"].map({">50K": 1, "<=50K": 0})
print(y.value_counts())`,
      tests: [
        { desc: "Tidak ada NaN", expr: "y.notna().all()" },
        { desc: "Jumlah 1 benar", expr: "(y == 1).sum() == (df['income'] == '>50K').sum()" },
      ],
      hints: ["Konsep: pemetaan dengan dictionary.", "Method yang menerima dict.", "`.map({...})`"],
      explanation: "map(dict) adalah cara vectorized untuk mengganti nilai kategori.",
    },
    {
      id: "pd-apply-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3], "b": [10, 20, 30]})
print(df.apply(sum).tolist())
print(df.apply(sum, axis=1).tolist())
print(df["a"].map({1: "satu", 3: "tiga"}).tolist())`,
      answer: "[6, 60]\n[11, 22, 33]\n['satu', nan, 'tiga']",
      hints: ["Konsep: axis 0 vs 1.", "axis=0 → jumlah per kolom.", "Nilai 2 tidak ada di dictionary."],
      explanation: "[6, 60]; [11, 22, 33]; ['satu', nan, 'tiga'].",
    },
    {
      id: "pd-apply-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Fungsi per baris",
      prompt: "Perbaiki agar kolom `luas_per_kamar` = area_m2 / bedrooms dihitung per baris tanpa error.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv").head(5)
df["luas_per_kamar"] = df.apply(lambda r: r["area_m2"] / r["bedrooms"])
print(df[["area_m2", "bedrooms", "luas_per_kamar"]])`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv").head(5)
df["luas_per_kamar"] = df.apply(lambda r: r["area_m2"] / r["bedrooms"], axis=1)
print(df[["area_m2", "bedrooms", "luas_per_kamar"]])`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Nilai benar", expr: "abs(df['luas_per_kamar'] - df['area_m2'] / df['bedrooms']).max() < 1e-12" },
      ],
      alternatives: [
        `import pandas as pd
df = pd.read_csv("house_prices.csv").head(5)
df["luas_per_kamar"] = df["area_m2"] / df["bedrooms"]
print(df[["area_m2", "bedrooms", "luas_per_kamar"]])`,
      ],
      hints: ["Konsep: axis=1.", "Fungsi perlu menerima baris.", "Atau lebih baik: operasi vectorized `df[\"area_m2\"] / df[\"bedrooms\"]`."],
      explanation: "Solusi vectorized lebih cepat dan lebih sederhana untuk operasi aritmetika.",
    },
    {
      id: "pd-apply-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Normalisasi nomor telepon",
      prompt: "Tulis fungsi `rapikan(no)` yang membuang spasi dan tanda hubung, lalu mengganti awalan \"0\" dengan \"+62\" (awalan \"62\" menjadi \"+62\"). Terapkan ke `df[\"telp\"]` dengan apply menjadi kolom `telp_bersih`. Cetak kolom itu sebagai list.",
      starter: `import pandas as pd
df = pd.DataFrame({"telp": ["0812-3456-7890", "62 813 1111 2222", "+62 821 0000 1234", "0857 9999 0000"]})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.DataFrame({"telp": ["0812-3456-7890", "62 813 1111 2222", "+62 821 0000 1234", "0857 9999 0000"]})

def rapikan(no):
    no = no.replace(" ", "").replace("-", "")
    if no.startswith("0"):
        return "+62" + no[1:]
    if no.startswith("62"):
        return "+" + no
    return no

df["telp_bersih"] = df["telp"].apply(rapikan)
print(df["telp_bersih"].tolist())`,
      tests: [
        { desc: "Hasil benar", expr: "df['telp_bersih'].tolist() == ['+6281234567890', '+6281311112222', '+6282100001234', '+6285799990000']" },
        { desc: "Fungsi bekerja untuk input lain", expr: "rapikan('0811 22') == '+6281122'" },
      ],
      hints: ["Konsep: fungsi kustom multi-langkah + apply.", "Gunakan replace lalu startswith.", "Urutan cek: \"0\", lalu \"62\", lainnya biarkan."],
      explanation: "Logika berlapis seperti ini cocok untuk apply; menuliskannya sebagai fungsi terpisah membuatnya mudah diuji.",
    },
    {
      id: "pd-apply-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Encode kolom yes/no Student Performance",
      prompt: [
        "Baca `student_performance.csv`. Cari semua kolom teks yang nilai uniknya persis {\"yes\", \"no\"} → list `kolom_yn` (gunakan list comprehension dengan `set(df[c].unique()) == {\"yes\", \"no\"}`).",
        "Ubah semua kolom itu menjadi 0/1 dengan `df[kolom_yn] = df[kolom_yn].apply(lambda kol: kol.map({\"yes\": 1, \"no\": 0}))`. Cetak `kolom_yn` dan rata-rata kolom tersebut (3 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("student_performance.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("student_performance.csv")
kolom_yn = [c for c in df.columns if set(df[c].unique()) == {"yes", "no"}]
df[kolom_yn] = df[kolom_yn].apply(lambda kol: kol.map({"yes": 1, "no": 0}))
print(kolom_yn)
print(df[kolom_yn].mean().round(3))`,
      tests: [
        { desc: "8 kolom yes/no", expr: "kolom_yn == ['schoolsup', 'famsup', 'paid', 'activities', 'nursery', 'higher', 'internet', 'romantic']" },
        { desc: "Semua menjadi 0/1", expr: "all(set(df[c].unique()) <= {0, 1} for c in kolom_yn)" },
        { desc: "Tidak ada NaN", expr: "df[kolom_yn].notna().all().all()" },
      ],
      hints: ["Konsep: apply per kolom + map per elemen.", "Deteksi kolom dengan set nilai unik.", "`df[kolom_yn].apply(lambda kol: kol.map({...}))`"],
      explanation: "Encoding biner otomatis seperti ini menghemat waktu pada dataset dengan banyak kolom yes/no.",
    },
  ],
  quiz: [
    { id: "pd-apply-q1", type: "mcq", prompt: "Untuk mengganti \"yes\"/\"no\" menjadi 1/0, cara paling sederhana dan cepat?", options: ["for loop", "s.map({\"yes\": 1, \"no\": 0})", "df.apply(..., axis=1)", "s.sort_values()"], answer: 1, explanation: "map dengan dictionary." },
    { id: "pd-apply-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ns = pd.Series([1, 4, 9])\nprint(s.apply(lambda x: x ** 0.5).tolist())`, options: ["[1, 4, 9]", "[1.0, 2.0, 3.0]", "[1, 16, 81]", "Error"], answer: 1, explanation: "Akar setiap elemen." },
    { id: "pd-apply-q3", type: "tf", prompt: "`df.apply(f, axis=1)` biasanya lebih cepat daripada operasi vectorized yang setara.", answer: false, explanation: "apply menjalankan fungsi Python per baris — jauh lebih lambat." },
    { id: "pd-apply-q4", type: "fill", prompt: "Agar fungsi menerima setiap BARIS: `df.apply(f, axis=____)`", answer: ["1"], explanation: "axis=1." },
    { id: "pd-apply-q5", type: "case", prompt: "Kamu perlu kolom `tidak_sehat = 1 jika aqi > 100 selain 0` untuk 5 juta baris. Pilihan terbaik?", options: ["df.apply(lambda r: 1 if r[\"aqi\"] > 100 else 0, axis=1)", "(df[\"aqi\"] > 100).astype(int)", "Loop for", "df.map(...)"], answer: 1, explanation: "Vectorized: satu operasi untuk semua baris." },
  ],
  challenge: {
    id: "pd-apply-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Ubah apply menjadi vectorized",
    prompt: [
      "Fungsi `label_risiko` di starter dipakai dengan apply per baris. Tulis ulang logikanya secara **vectorized** dengan `np.select` → kolom `risiko_vec`.",
      "Bandingkan dengan `risiko_apply` (sudah dibuat) dan cetak apakah semua hasil sama. Kode kamu tidak boleh memakai `apply` untuk risiko_vec.",
    ],
    starter: `import numpy as np
import pandas as pd
df = pd.read_csv("customer_churn.csv")

def label_risiko(row):
    if row["contract"] == "Month-to-month" and row["support_tickets"] >= 3:
        return "tinggi"
    if row["tenure_months"] < 6 or row["monthly_charges"] > 100:
        return "sedang"
    return "rendah"

df["risiko_apply"] = df.apply(label_risiko, axis=1)
# Tulis kodemu di sini (tanpa apply)
`,
    solution: `import numpy as np
import pandas as pd
df = pd.read_csv("customer_churn.csv")

def label_risiko(row):
    if row["contract"] == "Month-to-month" and row["support_tickets"] >= 3:
        return "tinggi"
    if row["tenure_months"] < 6 or row["monthly_charges"] > 100:
        return "sedang"
    return "rendah"

df["risiko_apply"] = df.apply(label_risiko, axis=1)
kondisi = [
    (df["contract"] == "Month-to-month") & (df["support_tickets"] >= 3),
    (df["tenure_months"] < 6) | (df["monthly_charges"] > 100),
]
df["risiko_vec"] = np.select(kondisi, ["tinggi", "sedang"], default="rendah")
print((df["risiko_vec"] == df["risiko_apply"]).all())
print(df["risiko_vec"].value_counts())`,
    tests: [
      { desc: "Hasil identik dengan apply", expr: "(df['risiko_vec'] == df['risiko_apply']).all()" },
      { desc: "Memakai np.select", expr: "'select' in _code" },
      { desc: "apply hanya dipakai di baris yang diberikan", expr: "_code.count('.apply(') == 1" },
    ],
    hints: ["Konsep: if/elif → daftar kondisi berurutan.", "and → &, or → |, setiap kondisi dalam kurung.", "`np.select(kondisi, [\"tinggi\", \"sedang\"], default=\"rendah\")`"],
    explanation: "np.select memeriksa kondisi berurutan seperti if/elif, sehingga hasilnya identik dengan fungsi asli — tetapi bekerja pada seluruh kolom sekaligus.",
  },
  summary: [
    "`s.apply(f)` per elemen; `s.map(dict|f)` untuk pemetaan nilai.",
    "`df.apply(f)` per kolom; `df.apply(f, axis=1)` per baris; `df.map(f)` per sel.",
    "apply fleksibel tetapi lambat — utamakan operasi vectorized (`np.where`, `np.select`, `.str`, `.dt`, `map(dict)`).",
    "Periksa NaN setelah map dan tangani NaN di fungsi kustom.",
  ],
  cheatsheet: [
    { syntax: "s.map({\"yes\": 1, \"no\": 0})", desc: "Encode biner" },
    { syntax: "s.apply(fungsi)", desc: "Per elemen" },
    { syntax: "df.apply(f, axis=1)", desc: "Per baris" },
    { syntax: "np.select(conds, choices, default)", desc: "Pengganti if/elif per baris" },
    { syntax: "s.str.split().str[0]", desc: "Kata pertama (vectorized)" },
  ],
  flashcards: [
    { q: "Terapkan fungsi f ke setiap baris df", a: "df.apply(f, axis=1)" },
    { q: "Ganti nilai kategori dengan dictionary", a: "s.map({\"lama\": \"baru\", ...})" },
    { q: "Mengapa apply sebaiknya dihindari pada data besar?", a: "Menjalankan fungsi Python per baris; jauh lebih lambat dari vectorized" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.apply", "reference/api/pandas.DataFrame.apply.html"),
    pandasDoc("pandas.Series.map", "reference/api/pandas.Series.map.html"),
    pandasDoc("Essential basic functionality — Function application", "user_guide/basics.html#function-application"),
    pandasDoc("Enhancing performance", "user_guide/enhancingperf.html"),
  ],
};
