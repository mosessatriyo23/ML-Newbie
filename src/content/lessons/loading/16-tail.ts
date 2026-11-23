import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-df-tail",
  title: "df.tail()",
  minutes: 20,
  prerequisites: ["load-df-head"],
  objectives: [
    "Menampilkan baris terakhir DataFrame dengan `df.tail(n)`.",
    "Memakai tail untuk memeriksa akhir file: baris total, catatan kaki, dan baris rusak.",
    "Mengambil data terbaru pada time series yang terurut.",
    "Memahami `tail(-n)` dan `groupby().tail(n)`.",
  ],
  definition: [
    "`df.tail(n=5)` mengembalikan **n baris terakhir** DataFrame (default 5). `tail(-n)` mengembalikan semua baris **kecuali n pertama**.",
    "Pada data terurut waktu, tail menunjukkan **observasi terbaru** — misalnya 7 hari terakhir sebelum periode prediksi.",
    "File dari Excel atau sistem lama sering memiliki **baris tambahan di akhir**: total, rata-rata, catatan sumber, atau baris kosong. Baris ini merusak statistik jika tidak dibuang — tail adalah cara tercepat menemukannya.",
    "`df.groupby(\"k\").tail(n)` mengambil n baris terakhir dari setiap kelompok (misalnya transaksi terakhir setiap pelanggan).",
  ],
  why: [
    "Memeriksa awal (head) dan akhir (tail) file adalah langkah validasi dasar: memastikan seluruh file terbaca, tidak ada baris \"Total\" atau catatan kaki, dan rentang tanggal sesuai harapan.",
    "Untuk forecasting, nilai-nilai terakhir di train adalah informasi paling relevan bagi prediksi awal periode test (fitur lag).",
  ],
  when: [
    "- Setelah membaca file, untuk memeriksa bagian akhirnya.",
    "- Melihat observasi terbaru pada data waktu.",
    "- Mengambil kejadian terakhir per entitas.",
  ],
  analogy: "Jika head adalah halaman pertama buku, tail adalah **halaman terakhir** — tempat biasanya ada daftar pustaka atau catatan penerbit yang bukan bagian dari cerita (dan harus dipisahkan dari isi utama).",
  syntax: {
    code: `df.tail()           # 5 baris terakhir
df.tail(10)
df.tail(-2)         # semua kecuali 2 pertama
df.sort_values("tanggal").tail(7)
df.groupby("pelanggan").tail(1)`,
  },
  anatomy: [
    ["tail(n=5)", "n baris terakhir."],
    ["tail(-n)", "Semua kecuali n pertama."],
    ["groupby(k).tail(n)", "n terakhir per kelompok."],
    ["skipfooter=n (read_csv)", "Membuang n baris terakhir saat membaca (engine=\"python\")."],
  ],
  examples: [
    {
      title: "Contoh 1 — tail dasar",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv")
print(df.tail(3))
print(len(df), "baris; index terakhir:", df.index[-1])
print(df.tail(-27)["student_id"].tolist())`,
      output: "   student_id  hours_studied  attendance  previous_score  final_score\n27       S028            1.4          72              56           58\n28       S029            2.4          91              61           66\n29       S030            7.1          94              55           91\n30 baris; index terakhir: 29\n['S028', 'S029', 'S030']",
      explain: [
        ["df.tail(3)", "Tiga baris terakhir (index 27–29)."],
        ["df.index[-1]", "Label baris terakhir."],
        ["df.tail(-27)", "Semua kecuali 27 pertama → 3 baris."],
      ],
    },
    {
      title: "Contoh 2 — Menemukan baris total di akhir file",
      code: `import io
import pandas as pd

teks = """bulan,penjualan
Jan,120
Feb,95
Mar,140
TOTAL,355
Sumber: laporan internal,"""
df = pd.read_csv(io.StringIO(teks))
print(df.tail(3))
print(df.dtypes.astype(str).to_dict())

bersih = pd.read_csv(io.StringIO(teks), skipfooter=2, engine="python")
print(bersih, bersih["penjualan"].sum())`,
      output: "                      bulan  penjualan\n2                       Mar      140.0\n3                     TOTAL      355.0\n4  Sumber: laporan internal        NaN\n{'bulan': 'str', 'penjualan': 'float64'}\n  bulan  penjualan\n0   Jan        120\n1   Feb         95\n2   Mar        140 355",
      explain: [
        ["df.tail(3)", "Baris TOTAL dan catatan sumber terlihat di akhir."],
        ["df.dtypes", "Kolom penjualan masih numerik (catatan sumber menjadi NaN), tetapi total ikut terhitung jika kita menjumlahkan semua baris."],
        ["skipfooter=2, engine=\"python\"", "Buang 2 baris terakhir saat membaca."],
      ],
      change: "tail dipakai untuk validasi kebersihan file.",
    },
    {
      title: "Contoh 3 — Data terbaru pada time series",
      code: `import numpy as np
import pandas as pd

rng = np.random.default_rng(1)
df = pd.DataFrame({
    "tanggal": pd.date_range("2025-12-01", "2025-12-31", freq="D"),
    "pm25": rng.normal(45, 8, 31).round(1),
}).sample(frac=1, random_state=0)            # file tidak terurut

terbaru = df.sort_values("tanggal").tail(7)
print(terbaru)
print("Rata-rata 7 hari terakhir:", terbaru["pm25"].mean().round(2))`,
      output: "      tanggal  pm25\n24 2025-12-25  23.3\n25 2025-12-26  29.9\n26 2025-12-27  43.6\n27 2025-12-28  41.6\n28 2025-12-29  46.7\n29 2025-12-30  46.7\n30 2025-12-31  61.9\nRata-rata 7 hari terakhir: 41.96",
      explain: [
        ["sample(frac=1, random_state=0)", "Simulasi file yang barisnya teracak."],
        ["sort_values(\"tanggal\").tail(7)", "Urutkan dulu, lalu ambil 7 hari terakhir — bukan 7 baris terakhir file."],
        ["terbaru[\"pm25\"].mean()", "Rata-rata minggu terakhir: baseline sederhana untuk prediksi hari berikutnya."],
      ],
      change: "tail setelah sorting untuk data waktu.",
    },
    {
      title: "Contoh 4 — Transaksi terakhir per pelanggan",
      code: `import pandas as pd

trx = pd.DataFrame({
    "pelanggan": ["A", "B", "A", "C", "B", "A"],
    "tanggal": pd.to_datetime(["2026-01-02", "2026-01-05", "2026-01-10", "2026-01-11", "2026-01-20", "2026-01-25"]),
    "nilai": [120, 80, 60, 200, 40, 100],
})
terakhir = trx.sort_values("tanggal").groupby("pelanggan").tail(1).sort_values("pelanggan")
print(terakhir)`,
      output: "  pelanggan    tanggal  nilai\n5         A 2026-01-25    100\n4         B 2026-01-20     40\n3         C 2026-01-11    200",
      explain: [
        ["sort_values(\"tanggal\")", "Pastikan urutan waktu."],
        ["groupby(\"pelanggan\").tail(1)", "Baris terakhir setiap pelanggan = transaksi terbaru."],
      ],
      change: "tail per kelompok.",
    },
  ],
  params: [
    {
      title: "tail & kerabatnya",
      items: [
        { name: "df.tail(n=5)", desc: "n baris terakhir; n negatif = kecuali n pertama." },
        { name: "groupby(k).tail(n)", desc: "Per kelompok." },
        { name: "df.iloc[-n:]", desc: "Setara tail(n) dengan iloc." },
        { name: "read_csv(skipfooter=n, engine=\"python\")", desc: "Buang baris akhir file." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\ndf = pd.DataFrame({"x": range(10)})\nprint(df.tail(2)["x"].tolist(), df.tail(-8)["x"].tolist(), df.iloc[-2:]["x"].tolist())`, output: "[8, 9] [8, 9] [8, 9]" },
  tryIt: `import pandas as pd

df = pd.read_csv("auto_mpg.csv")
print(df.tail())
print(df.sort_values("model_year").tail(3)[["car_name", "model_year", "mpg"]])`,
  mistakes: [
    {
      title: "tail tanpa sorting pada data waktu",
      wrong: `import pandas as pd
df = pd.DataFrame({"tgl": pd.to_datetime(["2026-01-03", "2026-01-01", "2026-01-02"]), "v": [3, 1, 2]})
print(df.tail(1)["tgl"].dt.date.tolist())   # bukan tanggal terbaru`,
      fix: `import pandas as pd
df = pd.DataFrame({"tgl": pd.to_datetime(["2026-01-03", "2026-01-01", "2026-01-02"]), "v": [3, 1, 2]})
print(df.sort_values("tgl").tail(1)["tgl"].dt.date.tolist())`,
      explain: "tail mengambil baris terakhir sesuai urutan file, bukan tanggal terbaru.",
    },
    {
      title: "skipfooter dengan engine default",
      wrong: `import io
import pandas as pd
print(pd.read_csv(io.StringIO("a\\n1\\n2\\nTOTAL"), skipfooter=1, engine="c"))`,
      error: "ValueError",
      fix: `import io
import pandas as pd
print(pd.read_csv(io.StringIO("a\\n1\\n2\\nTOTAL"), skipfooter=1, engine="python"))`,
      explain: "skipfooter hanya didukung engine \"python\".",
    },
    {
      title: "Baris total ikut dijumlahkan",
      wrong: `import pandas as pd
df = pd.DataFrame({"bulan": ["Jan", "Feb", "TOTAL"], "jual": [10, 20, 30]})
print(df["jual"].sum())   # 60, seharusnya 30`,
      fix: `import pandas as pd
df = pd.DataFrame({"bulan": ["Jan", "Feb", "TOTAL"], "jual": [10, 20, 30]})
print(df[df["bulan"] != "TOTAL"]["jual"].sum())`,
      explain: "Periksa tail; buang baris ringkasan sebelum menghitung statistik.",
    },
  ],
  bestPractices: [
    "Selalu jalankan head() dan tail() setelah membaca file.",
    "Untuk data waktu, sort dulu sebelum tail.",
    "Buang baris total/catatan kaki saat membaca (skipfooter) atau dengan filter.",
    "Bandingkan tanggal terakhir di train dengan tanggal pertama di test.",
  ],
  exercises: [
    {
      id: "load-tail-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Dua baris terakhir",
      prompt: "Lengkapi agar `akhir` berisi 2 baris terakhir.",
      starter: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.____(2)
print(akhir)`,
      solution: `import pandas as pd
df = pd.read_csv("iris.csv")
akhir = df.tail(2)
print(akhir)`,
      tests: [{ desc: "Index 148, 149", expr: "akhir.index.tolist() == [148, 149]" }],
      hints: ["Konsep: baris akhir.", "Kebalikan head.", "`tail(2)`"],
      explanation: "tail = ekor data.",
    },
    {
      id: "load-tail-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
df = pd.DataFrame({"k": ["a", "b", "a", "b", "a"], "v": [1, 2, 3, 4, 5]})
print(df.tail(2)["v"].tolist())
print(df.groupby("k").tail(1)["v"].tolist())
print(len(df.tail(-1)))`,
      answer: "[4, 5]\n[4, 5]\n4",
      hints: ["Konsep: tail biasa dan per kelompok.", "Terakhir a = 5, terakhir b = 4 (urutan baris asli).", "tail(-1) membuang baris pertama."],
      explanation: "[4, 5]; [4, 5]; 4.",
    },
    {
      id: "load-tail-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Baris catatan di akhir file",
      prompt: "File diakhiri 1 baris catatan. Perbaiki pembacaan agar `df` hanya berisi 3 baris data dan `total` = 60.",
      starter: `import io
import pandas as pd
teks = "item,qty\\nA,10\\nB,20\\nC,30\\nDibuat otomatis oleh sistem,"
df = pd.read_csv(io.StringIO(teks))
total = df["qty"].sum()
print(len(df), total)`,
      solution: `import io
import pandas as pd
teks = "item,qty\\nA,10\\nB,20\\nC,30\\nDibuat otomatis oleh sistem,"
df = pd.read_csv(io.StringIO(teks), skipfooter=1, engine="python")
total = df["qty"].sum()
print(len(df), total)`,
      tests: [{ desc: "3 baris, total 60", expr: "len(df) == 3 and total == 60" }],
      alternatives: [
        `import io
import pandas as pd
teks = "item,qty\\nA,10\\nB,20\\nC,30\\nDibuat otomatis oleh sistem,"
df = pd.read_csv(io.StringIO(teks)).iloc[:-1]
total = df["qty"].sum()
print(len(df), total)`,
      ],
      hints: ["Konsep: buang baris akhir.", "Parameter read_csv untuk footer.", "`skipfooter=1, engine=\"python\"` (atau iloc[:-1])."],
      explanation: "Baris catatan bukan observasi — harus dibuang.",
    },
    {
      id: "load-tail-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fitur 3 hari terakhir",
      prompt: "Dari `df` (tanggal teracak), urutkan berdasarkan tanggal lalu ambil 3 hari terakhir → `akhir3`. Simpan `rata3` = rata-rata pm25 3 hari terakhir dan `tanggal_terakhir` (Timestamp). Cetak keduanya.",
      starter: `import pandas as pd
df = pd.DataFrame({
    "tanggal": pd.to_datetime(["2025-12-29", "2025-12-31", "2025-12-27", "2025-12-30", "2025-12-28"]),
    "pm25": [44.0, 52.0, 40.0, 49.0, 41.0],
})
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.DataFrame({
    "tanggal": pd.to_datetime(["2025-12-29", "2025-12-31", "2025-12-27", "2025-12-30", "2025-12-28"]),
    "pm25": [44.0, 52.0, 40.0, 49.0, 41.0],
})
akhir3 = df.sort_values("tanggal").tail(3)
rata3 = akhir3["pm25"].mean()
tanggal_terakhir = akhir3["tanggal"].max()
print(rata3, tanggal_terakhir.date())`,
      tests: [
        { desc: "rata3 benar", expr: "rata3 == (44 + 49 + 52) / 3" },
        { desc: "tanggal terakhir", expr: "str(tanggal_terakhir.date()) == '2025-12-31'" },
      ],
      hints: ["Konsep: sort lalu tail.", "3 hari terakhir: 29, 30, 31 Des.", "mean() dan max()."],
      explanation: "Rata-rata beberapa hari terakhir adalah fitur rolling sederhana untuk forecasting.",
    },
    {
      id: "load-tail-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Mobil terbaru per negara asal",
      prompt: [
        "Baca `auto_mpg.csv`. Urutkan berdasarkan `model_year` (`kind=\"stable\"`), lalu ambil 2 mobil terakhir untuk setiap `origin` (1 = USA, 2 = Eropa, 3 = Jepang) dengan `groupby().tail(2)` → `terbaru`.",
        "Cetak kolom `origin`, `car_name`, `model_year`, `mpg` dari `terbaru` (urut origin) dan rata-rata mpg-nya per origin.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("auto_mpg.csv")
terbaru = df.sort_values("model_year", kind="stable").groupby("origin").tail(2).sort_values("origin", kind="stable")
print(terbaru[["origin", "car_name", "model_year", "mpg"]])
print(terbaru.groupby("origin")["mpg"].mean().round(1).to_dict())`,
      tests: [
        { desc: "2 per origin", expr: "(terbaru['origin'].value_counts() == 2).all() and len(terbaru) == 6" },
        { desc: "Tahun terbaru", expr: "(terbaru.groupby('origin')['model_year'].max() == df.groupby('origin')['model_year'].max()).all()" },
      ],
      hints: ["Konsep: sort + groupby().tail().", "kind=\"stable\" menjaga urutan asli untuk tahun yang sama.", "Urutkan hasil berdasarkan origin untuk tampilan."],
      explanation: "Pola sort → groupby → tail(1) adalah cara standar mengambil \"kejadian terakhir\" setiap entitas.",
    },
  ],
  quiz: [
    { id: "load-tail-q1", type: "mcq", prompt: "`df.tail(3)` mengembalikan…", options: ["3 baris pertama", "3 baris terakhir", "3 baris acak", "3 kolom terakhir"], answer: 1, explanation: "Baris terakhir." },
    { id: "load-tail-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\nprint(pd.DataFrame({"a": [5, 6, 7, 8]}).tail(-3)["a"].tolist())`, options: ["[5, 6, 7]", "[8]", "[6, 7, 8]", "[]"], answer: 1, explanation: "Kecuali 3 pertama → [8]." },
    { id: "load-tail-q3", type: "tf", prompt: "Pada file yang tidak terurut, `tail(1)` selalu memberi tanggal terbaru.", answer: false, explanation: "Urutkan dulu." },
    { id: "load-tail-q4", type: "fill", prompt: "Parameter read_csv untuk membuang baris di akhir file: `____=2`", answer: ["skipfooter"], explanation: "skipfooter (engine=\"python\")." },
    { id: "load-tail-q5", type: "case", prompt: "Setelah membaca laporan Excel, df.tail() menunjukkan baris \"Rata-rata\". Langkah tepat?", options: ["Biarkan", "Buang baris tersebut sebelum analisis", "Jadikan target", "Gandakan baris itu"], answer: 1, explanation: "Baris ringkasan bukan observasi." },
  ],
  challenge: {
    id: "load-tail-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Deteksi baris non-data di akhir file",
    prompt: [
      "Tulis fungsi `buang_footer(df, kolom_angka)` yang membuang baris di **akhir** DataFrame selama kolom pertama mengandung kata \"total\", \"rata\", \"sumber\", atau \"catatan\" (tidak peka huruf besar) **atau** `kolom_angka` bernilai NaN. Berhenti di baris data pertama dari belakang. Kembalikan DataFrame bersih.",
      "Uji pada teks laporan di starter, cetak `tail(2)` hasil dan jumlah `jual`.",
    ],
    starter: `import io
import pandas as pd
teks = """bulan,jual
Jan,120
Feb,95
Mar,140
Total,355
Rata-rata,118.3
Catatan: angka sementara,"""
df = pd.read_csv(io.StringIO(teks))
# Tulis kodemu di sini
`,
    solution: `import io
import pandas as pd
teks = """bulan,jual
Jan,120
Feb,95
Mar,140
Total,355
Rata-rata,118.3
Catatan: angka sementara,"""
df = pd.read_csv(io.StringIO(teks))

def buang_footer(df, kolom_angka):
    kata = ("total", "rata", "sumber", "catatan")
    akhir = len(df)
    while akhir > 0:
        baris = df.iloc[akhir - 1]
        label = str(baris.iloc[0]).lower()
        if any(k in label for k in kata) or pd.isna(baris[kolom_angka]):
            akhir -= 1
        else:
            break
    return df.iloc[:akhir]

bersih = buang_footer(df, "jual")
print(bersih.tail(2))
print(bersih["jual"].sum())`,
    tests: [
      { desc: "3 baris data", expr: "buang_footer(df, 'jual')['bulan'].tolist() == ['Jan', 'Feb', 'Mar']" },
      { desc: "Total 355", expr: "buang_footer(df, 'jual')['jual'].sum() == 355" },
      { desc: "Data tanpa footer tidak berubah", expr: "len(buang_footer(df.iloc[:3], 'jual')) == 3" },
    ],
    hints: ["Konsep: memeriksa baris dari belakang.", "Loop while dengan indeks `akhir` yang berkurang.", "`df.iloc[:akhir]` untuk hasil."],
    explanation: "Laporan dari spreadsheet hampir selalu punya baris ringkasan di bawah; membuangnya secara otomatis mencegah total ikut terhitung sebagai observasi.",
  },
  summary: [
    "`df.tail(n)` = n baris terakhir; `tail(-n)` = kecuali n pertama.",
    "Gunakan tail untuk memeriksa baris total/catatan di akhir file.",
    "Untuk data waktu: sort lalu tail untuk observasi terbaru.",
    "`groupby().tail(1)` = kejadian terakhir per entitas.",
  ],
  cheatsheet: [
    { syntax: "df.tail(10)", desc: "10 baris terakhir" },
    { syntax: "df.sort_values(\"tgl\").tail(7)", desc: "7 hari terakhir" },
    { syntax: "df.groupby(k).tail(1)", desc: "Terakhir per kelompok" },
    { syntax: "read_csv(skipfooter=2, engine=\"python\")", desc: "Buang footer" },
    { syntax: "df.iloc[:-1]", desc: "Buang baris terakhir" },
  ],
  flashcards: [
    { q: "Ambil transaksi terakhir setiap pelanggan", a: "df.sort_values(\"tanggal\").groupby(\"pelanggan\").tail(1)" },
    { q: "Buang 2 baris terakhir saat membaca CSV", a: "pd.read_csv(f, skipfooter=2, engine=\"python\")" },
    { q: "Mengapa sort sebelum tail pada data waktu?", a: "tail mengikuti urutan baris file, bukan urutan tanggal" },
  ],
  references: [
    pandasDoc("pandas.DataFrame.tail", "reference/api/pandas.DataFrame.tail.html"),
    pandasDoc("pandas.read_csv — skipfooter", "reference/api/pandas.read_csv.html"),
    pandasDoc("Group by — Taking the first/last rows of each group", "user_guide/groupby.html#taking-the-first-rows-of-each-group"),
    pandasDoc("Getting started — How do I read and write tabular data?", "getting_started/intro_tutorials/02_read_write.html"),
  ],
};
