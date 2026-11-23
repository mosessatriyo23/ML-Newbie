import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-categorical-data",
  title: "Categorical Data",
  minutes: 35,
  prerequisites: ["load-numerical-data", "pd-series"],
  objectives: [
    "Membedakan data kategori **nominal** dan **ordinal**.",
    "Menghitung frekuensi, kardinalitas, dan kategori langka.",
    "Membersihkan kategori yang tidak konsisten (huruf besar/kecil, spasi, sinonim).",
    "Memakai dtype `category` (termasuk urutan untuk ordinal) di pandas.",
  ],
  definition: [
    "**Data kategori** (kualitatif) menyatakan kelompok atau label, bukan besaran. Dua jenis:\n- **Nominal** — tanpa urutan: kota, jenis kelamin, metode pembayaran, spesies\n- **Ordinal** — ada urutan alami, tetapi jarak antar-level tidak pasti: pendidikan (SD < SMP < SMA < S1), kategori ISPU (Baik < Sedang < Tidak Sehat), rating bintang",
    "**Kardinalitas** = jumlah kategori unik. Kardinalitas rendah (2–10) mudah di-encode; kardinalitas tinggi (ratusan nama produk/kota) butuh strategi khusus (pengelompokan kategori langka, target encoding).",
    "pandas menyediakan dtype `category` yang hemat memori dan bisa menyimpan **urutan**: `pd.Categorical(s, categories=[...], ordered=True)` sehingga perbandingan seperti `s > \"SMA\"` dan sorting mengikuti urutan logis, bukan alfabet.",
  ],
  why: [
    "Model ML membutuhkan angka, sehingga kategori harus di-encode (Module 08). Jenisnya menentukan cara encoding: nominal → One-Hot; ordinal → Ordinal Encoding sesuai urutan.",
    "Kategori yang tidak konsisten (\"Jakarta\", \"jakarta \", \"DKI Jakarta\") membuat satu kelompok terpecah menjadi beberapa, merusak statistik dan model.",
  ],
  when: [
    "- Memeriksa kolom teks/kode sebelum encoding.",
    "- Menemukan kategori langka atau salah ketik.",
    "- Menyimpan urutan level untuk data ordinal.",
  ],
  analogy: "Nominal seperti **warna kaos tim** — merah tidak \"lebih besar\" dari biru. Ordinal seperti **ukuran kaos S, M, L, XL** — ada urutan jelas, tetapi selisih S→M belum tentu sama dengan L→XL.",
  syntax: {
    code: `s.value_counts(normalize=True)
s.nunique()
s.str.strip().str.title()
pd.Categorical(s, categories=["SD", "SMP", "SMA", "S1"], ordered=True)
df.describe(include="str")`,
  },
  anatomy: [
    ["value_counts()", "Frekuensi setiap kategori."],
    ["nunique()", "Kardinalitas."],
    ["str.strip().str.lower()", "Menyeragamkan penulisan."],
    ["ordered=True", "Kategori punya urutan."],
  ],
  examples: [
    {
      title: "Contoh 1 — Frekuensi dan kardinalitas",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
kat = df.select_dtypes(include="str")
print(kat.nunique().sort_values())
print(df["race"].value_counts(normalize=True).round(3))`,
      output: "sex                2\nincome             2\nrace               5\nrelationship       6\nmarital_status     7\nworkclass          8\noccupation        14\neducation         16\nnative_country    41\ndtype: int64\nrace\nWhite                 0.854\nBlack                 0.096\nAsian-Pac-Islander    0.032\nAmer-Indian-Eskimo    0.010\nOther                 0.008\nName: proportion, dtype: float64",
      explain: [
        ["kat.nunique().sort_values()", "Kardinalitas setiap kolom kategori: sex 2, ... native_country puluhan."],
        ["value_counts(normalize=True)", "Proporsi setiap kategori — ada kategori yang sangat jarang."],
      ],
    },
    {
      title: "Contoh 2 — Membersihkan kategori tidak konsisten",
      code: `import pandas as pd

kota = pd.Series(["Jakarta", "jakarta ", "DKI Jakarta", "Bandung", " bandung", "Surabaya", "SBY"])
print(kota.nunique(), "kategori sebelum")

bersih = kota.str.strip().str.title()
bersih = bersih.replace({"Dki Jakarta": "Jakarta", "Sby": "Surabaya"})
print(bersih.value_counts().to_dict())
print(bersih.nunique(), "kategori sesudah")`,
      output: "7 kategori sebelum\n{'Jakarta': 3, 'Bandung': 2, 'Surabaya': 2}\n3 kategori sesudah",
      explain: [
        ["kota.str.strip().str.title()", "Buang spasi tepi dan seragamkan kapitalisasi."],
        ["replace({\"Dki Jakarta\": \"Jakarta\", \"Sby\": \"Surabaya\"})", "Gabungkan sinonim/singkatan dengan kamus pemetaan."],
      ],
      change: "Data kotor dibersihkan sebelum dihitung.",
    },
    {
      title: "Contoh 3 — Kategori ordinal dengan urutan",
      code: `import pandas as pd

ispu = pd.Series(["Sedang", "Baik", "Tidak Sehat", "Sedang", "Sangat Tidak Sehat", "Baik"])
print(sorted(ispu.unique()))        # urutan alfabet — salah

urutan = ["Baik", "Sedang", "Tidak Sehat", "Sangat Tidak Sehat", "Berbahaya"]
ispu_ord = pd.Series(pd.Categorical(ispu, categories=urutan, ordered=True))
print(ispu_ord.sort_values().tolist())
print((ispu_ord > "Sedang").tolist())
print(ispu_ord.cat.codes.tolist())`,
      output: "['Baik', 'Sangat Tidak Sehat', 'Sedang', 'Tidak Sehat']\n['Baik', 'Baik', 'Sedang', 'Sedang', 'Tidak Sehat', 'Sangat Tidak Sehat']\n[False, False, True, False, True, False]\n[1, 0, 2, 1, 3, 0]",
      explain: [
        ["sorted(ispu.unique())", "Urutan alfabet tidak sesuai tingkat bahaya."],
        ["pd.Categorical(ispu, categories=urutan, ordered=True)", "Tetapkan urutan logis sesuai kategori ISPU."],
        ["ispu_ord > \"Sedang\"", "Perbandingan mengikuti urutan."],
        ["ispu_ord.cat.codes", "Kode integer sesuai urutan (0 = Baik) — dasar ordinal encoding."],
      ],
      change: "Kategori punya urutan yang harus dijaga.",
    },
    {
      title: "Contoh 4 — Kategori langka dan target per kategori",
      code: `import pandas as pd

df = pd.read_csv("adult_income.csv")
prop = df["native_country"].value_counts(normalize=True)
langka = prop[prop < 0.005].index
print(len(prop), "negara,", len(langka), "di antaranya < 0.5%")

df["negara_grup"] = df["native_country"].where(~df["native_country"].isin(langka), "Lainnya")
print(df["negara_grup"].nunique(), "kategori setelah dikelompokkan")
kaya = (df["income"] == ">50K")
print(kaya.groupby(df["education"]).mean().sort_values(ascending=False).head(4).round(3))`,
      output: "41 negara, 38 di antaranya < 0.5%\n4 kategori setelah dikelompokkan\neducation\nDoctorate      0.741\nProf-school    0.734\nMasters        0.557\nBachelors      0.415\nName: income, dtype: float64",
      explain: [
        ["prop[prop < 0.005].index", "Kategori dengan proporsi di bawah 0.5%."],
        ["where(~df[\"native_country\"].isin(langka), \"Lainnya\")", "Kategori langka digabung menjadi \"Lainnya\"."],
        ["kaya.groupby(df[\"education\"]).mean()", "Proporsi berpenghasilan >50K per tingkat pendidikan — tingkat pendidikan juga ordinal."],
      ],
      change: "Mengelola kardinalitas tinggi dan melihat hubungan kategori dengan target.",
    },
  ],
  params: [
    {
      title: "Alat untuk kategori",
      items: [
        { name: "s.value_counts(normalize=False, dropna=True)", desc: "Frekuensi/proporsi." },
        { name: "s.nunique(), s.unique()", desc: "Kardinalitas dan daftar kategori." },
        { name: "s.str.strip/lower/title, s.replace(dict)", desc: "Menyeragamkan penulisan." },
        { name: "pd.Categorical(values, categories, ordered)", desc: "dtype category dengan urutan." },
        { name: "s.cat.codes, s.cat.categories", desc: "Kode integer dan daftar level." },
        { name: "df.describe(include=\"str\")", desc: "count, unique, top, freq." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ns = pd.Series(["b", "a", "b", "c", "b"])\nprint(s.nunique(), s.value_counts().index[0], s.value_counts().iloc[0])`, output: "3 b 3" },
  tryIt: `import pandas as pd

df = pd.read_csv("bank_marketing.csv")
print(df.describe(include="str").T)
print(df["education"].value_counts())`,
  mistakes: [
    {
      title: "Mengurutkan ordinal secara alfabet",
      wrong: `import pandas as pd
s = pd.Series(["Sedang", "Tinggi", "Rendah"])
print(s.sort_values().tolist())   # ['Rendah', 'Sedang', 'Tinggi'] kebetulan benar?`,
      fix: `import pandas as pd
s = pd.Series(pd.Categorical(["Sedang", "Tinggi", "Rendah", "Sangat Tinggi"], categories=["Rendah", "Sedang", "Tinggi", "Sangat Tinggi"], ordered=True))
print(s.sort_values().tolist())`,
      explain: "Urutan alfabet kadang kebetulan benar, tetapi gagal untuk level seperti \"Sangat Tinggi\". Tetapkan urutan secara eksplisit.",
    },
    {
      title: "Perbandingan pada kategori tanpa urutan",
      wrong: `import pandas as pd
s = pd.Series(pd.Categorical(["S", "M", "L"]))
print(s > "M")`,
      error: "TypeError",
      fix: `import pandas as pd
s = pd.Series(pd.Categorical(["S", "M", "L"], categories=["S", "M", "L"], ordered=True))
print((s > "M").tolist())`,
      explain: "Perbandingan < > hanya bisa pada kategori `ordered=True`.",
    },
    {
      title: "Kategori terpecah karena spasi",
      wrong: `import pandas as pd
s = pd.Series(["Ya", "Ya ", "ya"])
print(s.value_counts().to_dict())   # 3 kategori berbeda`,
      fix: `import pandas as pd
s = pd.Series(["Ya", "Ya ", "ya"])
print(s.str.strip().str.lower().value_counts().to_dict())`,
      explain: "Selalu periksa `unique()` dan seragamkan penulisan sebelum analisis.",
    },
  ],
  bestPractices: [
    "Tentukan untuk setiap kolom kategori: nominal atau ordinal — dan tulis urutannya jika ordinal.",
    "Periksa `unique()` untuk menemukan salah ketik dan sinonim.",
    "Gabungkan kategori langka sebelum One-Hot Encoding agar kolom tidak meledak.",
    "Bersihkan kategori dengan fungsi yang sama untuk train dan test.",
  ],
  exercises: [
    {
      id: "load-cat-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Kardinalitas",
      prompt: "Lengkapi agar `k` berisi jumlah kategori unik kolom `occupation`.",
      starter: `import pandas as pd
df = pd.read_csv("adult_income.csv")
k = df["occupation"].____()
print(k)`,
      solution: `import pandas as pd
df = pd.read_csv("adult_income.csv")
k = df["occupation"].nunique()
print(k)`,
      tests: [{ desc: "k benar", expr: "k == df['occupation'].nunique()" }],
      hints: ["Konsep: jumlah nilai unik.", "n + unique.", "`nunique()`"],
      explanation: "Kardinalitas = nunique().",
    },
    {
      id: "load-cat-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
s = pd.Series(pd.Categorical(["L", "S", "XL", "M"], categories=["S", "M", "L", "XL"], ordered=True))
print(s.sort_values().tolist())
print(s.cat.codes.tolist())
print((s >= "L").sum())`,
      answer: "['S', 'M', 'L', 'XL']\n[2, 0, 3, 1]\n2",
      hints: ["Konsep: urutan kategori.", "codes mengikuti posisi di categories.", "L dan XL ≥ L."],
      explanation: "['S', 'M', 'L', 'XL']; kode [2, 0, 3, 1]; 2 elemen.",
    },
    {
      id: "load-cat-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kategori terpecah",
      prompt: "Perbaiki agar `jumlah` menghitung metode pembayaran dengan benar (3 kategori: \"cash\", \"qris\", \"transfer\").",
      starter: `import pandas as pd
bayar = pd.Series(["Cash", "QRIS", "cash ", "Transfer", "qris", " QRIS"])
jumlah = bayar.value_counts()
print(jumlah.to_dict())`,
      solution: `import pandas as pd
bayar = pd.Series(["Cash", "QRIS", "cash ", "Transfer", "qris", " QRIS"])
jumlah = bayar.str.strip().str.lower().value_counts()
print(jumlah.to_dict())`,
      tests: [{ desc: "3 kategori benar", expr: "jumlah.to_dict() == {'qris': 3, 'cash': 2, 'transfer': 1}" }],
      hints: ["Konsep: menyeragamkan teks.", "Buang spasi lalu huruf kecil.", "`bayar.str.strip().str.lower()`"],
      explanation: "Setelah dibersihkan, QRIS paling sering dipakai.",
    },
    {
      id: "load-cat-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Ordinal pendidikan",
      prompt: "Ubah `pendidikan` menjadi kategori berurutan SD < SMP < SMA < D3 < S1 < S2. Simpan di `p`, lalu cetak `p.cat.codes.tolist()` dan jumlah orang dengan pendidikan minimal S1.",
      starter: `import pandas as pd
pendidikan = pd.Series(["SMA", "S1", "SD", "S2", "SMP", "S1", "D3"])
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
pendidikan = pd.Series(["SMA", "S1", "SD", "S2", "SMP", "S1", "D3"])
urutan = ["SD", "SMP", "SMA", "D3", "S1", "S2"]
p = pd.Series(pd.Categorical(pendidikan, categories=urutan, ordered=True))
print(p.cat.codes.tolist())
print((p >= "S1").sum())`,
      tests: [
        { desc: "Kode benar", expr: "p.cat.codes.tolist() == [2, 4, 0, 5, 1, 4, 3]" },
        { desc: "Berurutan", expr: "p.cat.ordered" },
        { desc: "Mencetak 3", expr: "_lines[-1] == '3'" },
      ],
      hints: ["Konsep: Categorical ordered.", "`pd.Categorical(..., categories=urutan, ordered=True)`", "Bandingkan dengan `>= \"S1\"`."],
      explanation: "Kode 0–5 mempertahankan urutan — siap dipakai sebagai ordinal encoding.",
    },
    {
      id: "load-cat-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Profil kategori Bank Marketing",
      prompt: [
        "Baca `bank_marketing.csv`. Buat DataFrame `profil` dengan index nama kolom teks (kecuali `y`) dan kolom: `kardinalitas`, `top` (kategori paling sering), `pct_top` (proporsi kategori teratas, 3 desimal), dan `ada_unknown` (True jika ada nilai \"unknown\").",
        "Urutkan berdasarkan kardinalitas menurun dan cetak.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
kat = df.select_dtypes(include="str").drop(columns="y")
profil = pd.DataFrame({
    "kardinalitas": kat.nunique(),
    "top": kat.mode().iloc[0],
    "pct_top": kat.apply(lambda s: s.value_counts(normalize=True).iloc[0]).round(3),
    "ada_unknown": (kat == "unknown").any(),
}).sort_values("kardinalitas", ascending=False)
print(profil)`,
      tests: [
        { desc: "Semua kolom teks kecuali y", expr: "set(profil.index) == set(df.select_dtypes(include='str').columns) - {'y'}" },
        { desc: "Kolom profil", expr: "profil.columns.tolist() == ['kardinalitas', 'top', 'pct_top', 'ada_unknown']" },
        { desc: "Nilai benar untuk job", expr: "profil.loc['job', 'kardinalitas'] == df['job'].nunique() and profil.loc['job', 'top'] == df['job'].value_counts().index[0] and bool(profil.loc['job', 'ada_unknown'])" },
        { desc: "Terurut", expr: "profil['kardinalitas'].is_monotonic_decreasing" },
      ],
      hints: ["Konsep: ringkasan kolom kategori.", "`kat.mode().iloc[0]` memberi kategori tersering per kolom.", "`(kat == \"unknown\").any()`"],
      explanation: "Dataset ini memakai \"unknown\" sebagai penanda missing value — harus diputuskan apakah dianggap kategori sendiri atau NaN.",
    },
  ],
  quiz: [
    { id: "load-cat-q1", type: "mcq", prompt: "Mana yang termasuk ordinal?", options: ["Kota asal", "Golongan darah", "Tingkat kepuasan: rendah/sedang/tinggi", "Warna mobil"], answer: 2, explanation: "Ada urutan alami." },
    { id: "load-cat-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ns = pd.Series(["a", "A ", "a"])\nprint(s.str.strip().str.lower().nunique())`, options: ["3", "1", "2", "0"], answer: 1, explanation: "Semua menjadi \"a\"." },
    { id: "load-cat-q3", type: "tf", prompt: "Kategori nominal sebaiknya di-encode dengan angka 0, 1, 2 berurutan agar model memahami urutannya.", answer: false, explanation: "Nominal tidak punya urutan; gunakan One-Hot." },
    { id: "load-cat-q4", type: "fill", prompt: "Jumlah kategori unik dalam satu kolom disebut ____", answer: ["kardinalitas", "cardinality"], explanation: "Kardinalitas." },
    { id: "load-cat-q5", type: "case", prompt: "Kolom `kota` punya 400 kategori; 350 di antaranya muncul < 5 kali. Langkah awal yang masuk akal sebelum One-Hot?", options: ["Hapus semua baris", "Gabungkan kategori langka menjadi \"Lainnya\"", "Ubah ke angka 1–400", "Biarkan saja"], answer: 1, explanation: "Mengurangi kardinalitas tanpa membuang data." },
  ],
  challenge: {
    id: "load-cat-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Pembersih kategori yang dapat dipakai ulang",
    prompt: [
      "Tulis fungsi `bersihkan_kategori(s, sinonim=None, min_prop=0.0, lainnya=\"Lainnya\")` yang:",
      "1. Membuang spasi tepi dan mengubah ke huruf kecil.\n2. Mengganti sinonim memakai dict `sinonim` (kunci juga huruf kecil).\n3. Mengganti kategori dengan proporsi < `min_prop` menjadi `lainnya`.\n4. Mempertahankan NaN apa adanya.",
      "Uji pada `kota` di starter dengan `sinonim={\"dki jakarta\": \"jakarta\", \"sby\": \"surabaya\"}` dan `min_prop=0.15`, cetak `value_counts(dropna=False)`.",
    ],
    starter: `import numpy as np
import pandas as pd
kota = pd.Series(["Jakarta", "jakarta ", "DKI Jakarta", "Bandung", " bandung", "SBY", "Surabaya", "Medan", np.nan, "Jakarta"])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
import pandas as pd
kota = pd.Series(["Jakarta", "jakarta ", "DKI Jakarta", "Bandung", " bandung", "SBY", "Surabaya", "Medan", np.nan, "Jakarta"])

def bersihkan_kategori(s, sinonim=None, min_prop=0.0, lainnya="Lainnya"):
    hasil = s.str.strip().str.lower()
    if sinonim:
        hasil = hasil.replace(sinonim)
    prop = hasil.value_counts(normalize=True)
    langka = prop[prop < min_prop].index
    return hasil.where(~hasil.isin(langka), lainnya)

hasil = bersihkan_kategori(kota, {"dki jakarta": "jakarta", "sby": "surabaya"}, min_prop=0.15)
print(hasil.value_counts(dropna=False))`,
    tests: [
      { desc: "Hitungan benar", expr: "bersihkan_kategori(kota, {'dki jakarta': 'jakarta', 'sby': 'surabaya'}, min_prop=0.15).value_counts().to_dict() == {'jakarta': 4, 'bandung': 2, 'surabaya': 2, 'Lainnya': 1}" },
      { desc: "NaN dipertahankan", expr: "bersihkan_kategori(kota, {'dki jakarta': 'jakarta'}).isna().sum() == 1" },
      { desc: "Tanpa sinonim & min_prop tetap bekerja", expr: "bersihkan_kategori(__import__('pandas').Series([' A', 'a'])).tolist() == ['a', 'a']" },
    ],
    hints: ["Konsep: pipeline pembersihan kategori.", "`.str.strip().str.lower()` mempertahankan NaN.", "Proporsi dihitung tanpa NaN (default value_counts)."],
    explanation: "Fungsi seperti ini dipakai di train dan test agar kategori konsisten — langkah penting sebelum encoding.",
  },
  summary: [
    "Kategori nominal (tanpa urutan) dan ordinal (berurutan).",
    "Kardinalitas = nunique(); kategori langka bisa digabung.",
    "Bersihkan penulisan: strip, lower/title, replace sinonim.",
    "`pd.Categorical(..., ordered=True)` menyimpan urutan; `.cat.codes` memberi kode integer.",
  ],
  cheatsheet: [
    { syntax: "s.value_counts(normalize=True)", desc: "Proporsi kategori" },
    { syntax: "s.nunique()", desc: "Kardinalitas" },
    { syntax: "s.str.strip().str.lower()", desc: "Seragamkan" },
    { syntax: "pd.Categorical(s, categories=u, ordered=True)", desc: "Ordinal" },
    { syntax: "df.describe(include=\"str\")", desc: "Ringkasan kategori" },
  ],
  flashcards: [
    { q: "Perbedaan nominal dan ordinal", a: "Nominal tanpa urutan; ordinal punya urutan alami" },
    { q: "Buat kategori berurutan Rendah < Sedang < Tinggi", a: "pd.Categorical(s, categories=[\"Rendah\", \"Sedang\", \"Tinggi\"], ordered=True)" },
    { q: "Apa itu kardinalitas tinggi?", a: "Kolom kategori dengan sangat banyak nilai unik" },
  ],
  references: [
    pandasDoc("Categorical data", "user_guide/categorical.html"),
    pandasDoc("Working with text data", "user_guide/text.html"),
    { source: "Google Machine Learning Crash Course", title: "Working with categorical data", url: "https://developers.google.com/machine-learning/crash-course/categorical-data" },
    { source: "OpenIntro Statistics", title: "Chapter 1.2 — Types of variables (nominal, ordinal)", url: "https://www.openintro.org/book/os/" },
  ],
};
