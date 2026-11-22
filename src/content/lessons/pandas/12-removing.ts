import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "pd-removing-columns",
  title: "Removing Columns",
  minutes: 30,
  prerequisites: ["pd-selecting-columns"],
  objectives: [
    "Menghapus satu atau beberapa kolom dengan `drop(columns=...)`.",
    "Menghapus baris berdasarkan label dengan `drop(index=...)`.",
    "Memahami parameter `errors=\"ignore\"` dan perbedaan `drop`, `del`, serta `pop`.",
    "Memutuskan kolom mana yang sebaiknya dibuang: ID, konstan, terlalu banyak missing, atau penyebab leakage.",
  ],
  definition: [
    "`df.drop(columns=[...])` mengembalikan DataFrame **baru** tanpa kolom yang disebut; df asli tidak berubah (kecuali hasilnya disimpan kembali ke variabel yang sama).",
    "`df.drop(index=[...])` menghapus baris berdasarkan **label** index. Untuk menghapus baris berdasarkan kondisi, lebih umum memakai filter: `df = df[~kondisi]`.",
    "`errors=\"ignore\"` membuat drop tidak error jika kolom tidak ada — berguna dalam fungsi yang dipakai untuk beberapa dataset.",
    "Alternatif: `del df[\"kolom\"]` (mengubah df langsung) dan `s = df.pop(\"kolom\")` (menghapus sekaligus mengembalikan kolom sebagai Series — praktis untuk memisahkan target).",
  ],
  why: [
    "Tidak semua kolom layak menjadi fitur:\n- **ID** (customer_id) — unik per baris, tidak membawa pola, justru membuat model menghafal\n- **Kolom konstan** — tidak ada variasi, tidak ada informasi\n- **Terlalu banyak missing** — sulit diimputasi dengan andal\n- **Leakage** — kolom yang baru diketahui setelah target terjadi (misalnya `durasi_telepon` pada prediksi apakah nasabah akan berlangganan, atau `total_charges` yang terkait langsung dengan tenure)",
    "Menghapus kolom yang tidak relevan membuat model lebih cepat, lebih sederhana, dan sering lebih akurat.",
  ],
  when: [
    "- Membuang ID dan kolom teks bebas sebelum modeling.",
    "- Membuang target dari X.",
    "- Membuang kolom konstan atau hampir kosong.",
    "- Membuang kolom penyebab data leakage.",
  ],
  analogy: "Menghapus kolom seperti **merapikan koper sebelum bepergian**: barang yang tidak berguna (ID, kolom konstan) hanya menambah beban, dan barang terlarang (leakage) bisa membuat kamu \"ditahan di bandara\" — model terlihat bagus saat latihan tetapi gagal di dunia nyata.",
  syntax: {
    code: `df = df.drop(columns=["id", "catatan"])
df = df.drop(index=[0, 5])
df = df.drop(columns=["mungkin_tidak_ada"], errors="ignore")
y = df.pop("target")          # hapus + ambil
del df["kolom"]`,
  },
  anatomy: [
    ["drop(columns=...)", "Hapus kolom (DataFrame baru)."],
    ["drop(index=...)", "Hapus baris berdasarkan label."],
    ["errors=\"ignore\"", "Abaikan nama yang tidak ada."],
    ["df.pop(\"col\")", "Hapus kolom dari df dan kembalikan sebagai Series."],
  ],
  examples: [
    {
      title: "Contoh 1 — drop kolom dan baris",
      code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
print(df.shape)
tanpa_id = df.drop(columns="customer_id")
print(tanpa_id.shape, "| df asli:", df.shape)

dua_kolom = df.drop(columns=["customer_id", "gender"])
print(dua_kolom.columns.tolist())
print(df.drop(index=[0, 1, 2]).index[:3].tolist())`,
      output: "(403, 10)\n(403, 9) | df asli: (403, 10)\n['age', 'tenure_months', 'contract', 'internet_service', 'monthly_charges', 'support_tickets', 'churn', 'total_charges']\n[3, 4, 5]",
      explain: [
        ["df.drop(columns=\"customer_id\")", "Satu kolom; df asli tetap 10 kolom."],
        ["df.drop(columns=[\"customer_id\", \"gender\"])", "Beberapa kolom dengan list."],
        ["df.drop(index=[0, 1, 2])", "Baris berlabel 0, 1, 2 dihapus; label lain tidak berubah."],
      ],
    },
    {
      title: "Contoh 2 — pop untuk memisahkan target",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
X = df.drop(columns="student_id")
y = X.pop("final_score")
print(X.columns.tolist())
print(y.name, y.shape)`,
      output: "['hours_studied', 'attendance', 'previous_score']\nfinal_score (30,)",
      explain: [
        ["X = df.drop(columns=\"student_id\")", "Salinan tanpa ID."],
        ["y = X.pop(\"final_score\")", "Kolom target dihapus dari X dan dikembalikan sebagai Series y."],
      ],
      change: "Menghapus sekaligus mengambil kolom.",
    },
    {
      title: "Contoh 3 — Mendeteksi kolom yang layak dibuang",
      code: `import numpy as np
import pandas as pd

df = pd.DataFrame({
    "id": range(1, 7),
    "negara": ["ID"] * 6,
    "umur": [25, 31, np.nan, 45, 38, 29],
    "hobi": [np.nan, np.nan, "lari", np.nan, np.nan, np.nan],
    "gaji": [5, 8, 7, 12, 9, 6],
})
n = len(df)
unik_semua = [c for c in df.columns if df[c].nunique() == n]
konstan = [c for c in df.columns if df[c].nunique(dropna=False) == 1]
banyak_kosong = [c for c in df.columns if df[c].isna().mean() > 0.5]
print("ID-like     :", unik_semua)
print("Konstan     :", konstan)
print(">50% kosong :", banyak_kosong)

bersih = df.drop(columns=unik_semua + konstan + banyak_kosong)
print(bersih.columns.tolist())`,
      output: "ID-like     : ['id', 'gaji']\nKonstan     : ['negara']\n>50% kosong : ['hobi']\n['umur']",
      explain: [
        ["df[c].nunique() == n", "Setiap baris unik → kemungkinan ID. (Hati-hati: kolom numerik kontinu juga bisa unik — selalu periksa manual.)"],
        ["df[c].nunique(dropna=False) == 1", "Hanya satu nilai → tidak informatif."],
        ["df[c].isna().mean() > 0.5", "Lebih dari separuh kosong."],
        ["df.drop(columns=unik_semua + konstan + banyak_kosong)", "Gabungan list kolom yang dibuang."],
      ],
      change: "Kolom dipilih untuk dibuang secara sistematis, bukan ditebak.",
    },
    {
      title: "Contoh 4 — Leakage: kolom yang diketahui setelah hasil",
      code: `import pandas as pd

df = pd.read_csv("bank_marketing.csv")
df["y_num"] = (df["y"] == "yes").astype(int)
print(df.groupby(pd.qcut(df["duration"], 4), observed=True)["y_num"].mean().round(3))

X = df.drop(columns=["y", "y_num", "duration"])
print("Fitur realistis:", X.shape[1], "kolom")`,
      output: "duration\n(3.999, 104.0]     0.016\n(104.0, 185.0]     0.040\n(185.0, 329.0]     0.109\n(329.0, 3025.0]    0.297\nName: y_num, dtype: float64\nFitur realistis: 15 kolom",
      explain: [
        ["pd.qcut(df[\"duration\"], 4)", "Durasi telepon dibagi 4 kuartil."],
        ["[\"y_num\"].mean()", "Tingkat berlangganan naik drastis seiring durasi — tampak seperti fitur hebat."],
        ["X = df.drop(columns=[\"y\", \"y_num\", \"duration\"])", "Namun durasi baru diketahui SETELAH telepon selesai (saat hasilnya sudah jelas). Dokumentasi dataset UCI menyarankan membuangnya untuk model prediktif yang realistis."],
      ],
      change: "Alasan membuang kolom bukan teknis, tetapi logika waktu: kapan informasi tersedia.",
    },
  ],
  params: [
    {
      title: "Cara menghapus",
      items: [
        { name: "df.drop(columns=None, index=None, errors=\"raise\")", desc: "Hapus kolom/baris; mengembalikan DataFrame baru." },
        { name: "df.pop(item)", desc: "Hapus kolom dan kembalikan sebagai Series (mengubah df)." },
        { name: "del df[col]", desc: "Hapus kolom langsung." },
        { name: "df.dropna(axis=1, thresh=k)", desc: "Hapus kolom dengan non-null < k (materi Preprocessing)." },
        { name: "df.loc[:, df.nunique() > 1]", desc: "Pertahankan hanya kolom tidak konstan." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"a": [1], "b": [2], "c": [3]})\nprint(df.drop(columns=["a", "z"], errors="ignore").columns.tolist(), df.columns.tolist())`, output: "['b', 'c'] ['a', 'b', 'c']" },
  tryIt: `import pandas as pd

df = pd.read_csv("adult_income.csv")
print(df.nunique().sort_values())
X = df.drop(columns=["income", "fnlwgt", "education"])
print(X.columns.tolist())`,
  mistakes: [
    {
      title: "Menghapus kolom yang tidak ada",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
print(df.drop(columns=["c"]))`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
print(df.drop(columns=["c"], errors="ignore"))`,
      explain: "Periksa nama kolom, atau gunakan errors=\"ignore\" bila memang opsional.",
    },
    {
      title: "Lupa menyimpan hasil drop",
      wrong: `import pandas as pd
df = pd.DataFrame({"id": [1, 2], "x": [3, 4]})
df.drop(columns="id")
print(df.columns.tolist())   # id masih ada`,
      fix: `import pandas as pd
df = pd.DataFrame({"id": [1, 2], "x": [3, 4]})
df = df.drop(columns="id")
print(df.columns.tolist())`,
      explain: "drop mengembalikan DataFrame baru; simpan ke variabel.",
    },
    {
      title: "drop tanpa columns= menghapus baris",
      wrong: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
print(df.drop("a"))`,
      error: "KeyError",
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1], "b": [2]})
print(df.drop(columns="a"))`,
      explain: "Tanpa keyword, drop menafsirkan argumen sebagai label BARIS (axis=0). Selalu tulis `columns=` agar jelas.",
    },
  ],
  bestPractices: [
    "Selalu tulis `columns=` atau `index=` secara eksplisit.",
    "Dokumentasikan alasan setiap kolom dibuang (ID, konstan, leakage, missing).",
    "Pertanyaan kunci untuk leakage: \"Apakah informasi ini tersedia pada saat prediksi dibuat?\"",
    "Simpan data asli; buat DataFrame baru untuk hasil pembersihan.",
  ],
  exercises: [
    {
      id: "pd-drop-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Buang ID",
      prompt: "Lengkapi agar `X` tidak memiliki kolom `house_id`.",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
X = df.drop(____="house_id")
print(X.columns.tolist())`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
X = df.drop(columns="house_id")
print(X.columns.tolist())`,
      tests: [{ desc: "house_id terbuang", expr: "'house_id' not in X.columns and X.shape[1] == df.shape[1] - 1" }],
      hints: ["Konsep: drop kolom.", "Gunakan keyword yang menyatakan kita menghapus kolom.", "`columns=`"],
      explanation: "`drop(columns=...)` menghapus kolom.",
    },
    {
      id: "pd-drop-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6], "c": [7, 8, 9]})
s = df.pop("b")
print(df.columns.tolist(), s.tolist())
print(df.drop(index=[1]).index.tolist())`,
      answer: "['a', 'c'] [4, 5, 6]\n[0, 2]",
      hints: ["Konsep: pop mengubah df.", "b keluar dari df.", "drop(index=[1]) menghapus label 1."],
      explanation: "['a', 'c'] [4, 5, 6]; index [0, 2].",
    },
    {
      id: "pd-drop-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Kolom target masih ikut",
      prompt: "Kolom target `species` masih ada di `X` karena hasil drop tidak disimpan. Perbaiki.",
      starter: `import pandas as pd
X = pd.read_csv("iris.csv")
X.drop(columns="species")
print(X.columns.tolist())`,
      solution: `import pandas as pd
X = pd.read_csv("iris.csv")
X = X.drop(columns="species")
print(X.columns.tolist())`,
      tests: [{ desc: "species tidak ada di X", expr: "'species' not in X.columns and X.shape == (150, 4)" }],
      hints: ["Konsep: drop mengembalikan objek baru.", "Simpan kembali ke X.", "`X = X.drop(columns=\"species\")`"],
      explanation: "Jika target ikut ke X, model \"curang\" dan akurasinya palsu 100%.",
    },
    {
      id: "pd-drop-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Buang kolom konstan & hampir kosong",
      prompt: "Dari `df`, buat `bersih` dengan membuang kolom yang hanya punya satu nilai (`nunique(dropna=False) == 1`) dan kolom yang > 40% kosong. Cetak `bersih.columns.tolist()`.",
      starter: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "a": [1, 2, 3, 4, 5],
    "versi": ["v1"] * 5,
    "b": [np.nan, np.nan, np.nan, 1.0, 2.0],
    "c": [0.5, np.nan, 0.7, 0.9, 1.1],
})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
df = pd.DataFrame({
    "a": [1, 2, 3, 4, 5],
    "versi": ["v1"] * 5,
    "b": [np.nan, np.nan, np.nan, 1.0, 2.0],
    "c": [0.5, np.nan, 0.7, 0.9, 1.1],
})
konstan = [c for c in df.columns if df[c].nunique(dropna=False) == 1]
kosong = [c for c in df.columns if df[c].isna().mean() > 0.4]
bersih = df.drop(columns=konstan + kosong)
print(bersih.columns.tolist())`,
      tests: [
        { desc: "Kolom tersisa a dan c", expr: "bersih.columns.tolist() == ['a', 'c']" },
        { desc: "df asli utuh", expr: "df.shape == (5, 4)" },
      ],
      hints: ["Konsep: memilih kolom yang dibuang secara sistematis.", "List comprehension dengan nunique dan isna().mean().", "Gabungkan list lalu drop."],
      explanation: "Kolom b 60% kosong; versi konstan. c hanya 20% kosong — layak diimputasi.",
    },
    {
      id: "pd-drop-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Fitur realistis Bank Marketing",
      prompt: [
        "Baca `bank_marketing.csv`. Pisahkan target dengan `y = (df.pop(\"y\") == \"yes\").astype(int)`.",
        "Buat `X` dengan membuang `duration` (leakage). Simpan `n_fitur` dan cetak `X.shape`, `n_fitur`, dan proporsi y = 1 (3 desimal).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("bank_marketing.csv")
y = (df.pop("y") == "yes").astype(int)
X = df.drop(columns="duration")
n_fitur = X.shape[1]
print(X.shape, n_fitur, round(y.mean(), 3))`,
      tests: [
        { desc: "y biner 0/1", expr: "set(y.unique()) == {0, 1} and len(y) == 4521" },
        { desc: "X tanpa y dan duration", expr: "'y' not in X.columns and 'duration' not in X.columns" },
        { desc: "n_fitur = 15", expr: "n_fitur == 15" },
      ],
      hints: ["Konsep: pop + drop.", "pop menghapus y dari df.", "Lalu `df.drop(columns=\"duration\")`."],
      explanation: "Hanya ~11.5% nasabah berlangganan. Tanpa `duration`, skor model akan lebih rendah — tetapi jujur dan bisa dipakai sebelum menelepon.",
    },
  ],
  quiz: [
    { id: "pd-drop-q1", type: "mcq", prompt: "Kolom mana yang paling tepat dibuang sebelum modeling?", options: ["umur", "customer_id", "gaji", "kota"], answer: 1, explanation: "ID unik tidak membawa pola." },
    { id: "pd-drop-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1], "b": [2]})\ndf2 = df.drop(columns="a")\nprint(df.shape[1], df2.shape[1])`, options: ["1 1", "2 1", "2 2", "1 2"], answer: 1, explanation: "df tetap 2 kolom." },
    { id: "pd-drop-q3", type: "tf", prompt: "`df.pop(\"y\")` menghapus kolom y dari df dan mengembalikannya.", answer: true, explanation: "pop = hapus + kembalikan." },
    { id: "pd-drop-q4", type: "fill", prompt: "Agar drop tidak error jika kolom tidak ada: `errors=\"____\"`", answer: ["ignore"], explanation: "errors=\"ignore\"." },
    { id: "pd-drop-q5", type: "case", prompt: "Model prediksi pasien rawat inap memakai kolom `lama_rawat_hari` dan akurasinya 99%. Apa yang mencurigakan?", options: ["Tidak ada", "lama_rawat_hari baru diketahui setelah pasien dirawat → leakage", "Data terlalu sedikit", "Modelnya terlalu sederhana"], answer: 1, explanation: "Informasi tersebut tidak tersedia saat prediksi dibuat." },
  ],
  challenge: {
    id: "pd-drop-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fungsi seleksi kolom dengan laporan",
    prompt: [
      "Tulis fungsi `buang_kolom(df, target, leakage=(), max_missing=0.5)` yang mengembalikan `(X, y, laporan)`:",
      "- `y` = kolom target; `X` = df tanpa target\n- buang dari X: kolom di `leakage`, kolom konstan, kolom ID-like (teks dengan rasio nilai unik ≥ 0.95 — tidak harus 100% karena data nyata bisa punya baris duplikat), dan kolom dengan proporsi missing > `max_missing`\n- `laporan` = dict `{nama_kolom: alasan}` dengan alasan \"leakage\", \"konstan\", \"id\", atau \"missing\"",
      "Uji pada `customer_churn.csv` dengan target `churn` dan cetak `laporan` serta `X.columns.tolist()`.",
    ],
    starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")

def buang_kolom(df, target, leakage=(), max_missing=0.5):
    y = df[target]
    X = df.drop(columns=target)
    laporan = {}
    n = len(X)
    for c in X.columns:
        if c in leakage:
            laporan[c] = "leakage"
        elif X[c].nunique(dropna=False) == 1:
            laporan[c] = "konstan"
        elif X[c].dtype == "str" and X[c].nunique() / n >= 0.95:
            laporan[c] = "id"
        elif X[c].isna().mean() > max_missing:
            laporan[c] = "missing"
    return X.drop(columns=list(laporan)), y, laporan

X, y, laporan = buang_kolom(df, "churn")
print(laporan)
print(X.columns.tolist())`,
    tests: [
      { desc: "customer_id terdeteksi sebagai id", expr: "buang_kolom(df, 'churn')[2] == {'customer_id': 'id'}" },
      { desc: "X tanpa target & id", expr: "'churn' not in X.columns and 'customer_id' not in X.columns and X.shape[1] == 8" },
      { desc: "Leakage dibuang", expr: "buang_kolom(df, 'churn', leakage=('total_charges',))[2].get('total_charges') == 'leakage'" },
      { desc: "Konstan & missing terdeteksi", expr: "buang_kolom(__import__('pandas').DataFrame({'t': [0, 1, 0, 1], 'k': [1, 1, 1, 1], 'm': [None, None, None, 2.0], 'x': [1, 2, 3, 1]}), 't')[2] == {'k': 'konstan', 'm': 'missing'}" },
    ],
    hints: ["Konsep: aturan pembuangan kolom yang terdokumentasi.", "Periksa aturan berurutan dengan if/elif.", "ID-like: dtype teks dan `X[c].nunique() / n >= 0.95`."],
    explanation: "Laporan alasan membuat keputusan tim transparan dan mudah ditinjau — praktik penting saat bekerja bertiga di satu kompetisi.",
  },
  summary: [
    "`drop(columns=...)`/`drop(index=...)` mengembalikan DataFrame baru.",
    "`pop` menghapus sekaligus mengambil kolom; `del` menghapus langsung.",
    "`errors=\"ignore\"` untuk kolom opsional.",
    "Buang ID, kolom konstan, kolom hampir kosong, dan kolom penyebab leakage.",
  ],
  cheatsheet: [
    { syntax: "df.drop(columns=[...])", desc: "Hapus kolom" },
    { syntax: "df.drop(index=[...])", desc: "Hapus baris (label)" },
    { syntax: "y = df.pop(\"target\")", desc: "Ambil & hapus target" },
    { syntax: "df.loc[:, df.nunique() > 1]", desc: "Buang kolom konstan" },
    { syntax: "errors=\"ignore\"", desc: "Abaikan yang tidak ada" },
  ],
  flashcards: [
    { q: "Hapus kolom id dan catatan dari df", a: "df = df.drop(columns=[\"id\", \"catatan\"])" },
    { q: "Pertanyaan kunci untuk mendeteksi leakage", a: "Apakah informasi ini tersedia saat prediksi dibuat?" },
    { q: "Pisahkan target y dari df sekaligus menghapusnya", a: "y = df.pop(\"target\")" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.drop", "reference/api/pandas.DataFrame.drop.html"),
    pandasDoc("pandas.DataFrame.pop", "reference/api/pandas.DataFrame.pop.html"),
    { source: "UCI Machine Learning Repository", title: "Bank Marketing — catatan atribut duration", url: "https://archive.ics.uci.edu/dataset/222/bank+marketing" },
    { source: "Kaggle Learn", title: "Intermediate Machine Learning — Data Leakage", url: "https://www.kaggle.com/code/alexisbcook/data-leakage" },
  ],
};
