import type { Lesson } from "../../../types.ts";
import { pandasDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-excel-files",
  title: "Loading Excel Files",
  minutes: 35,
  prerequisites: ["load-loading-csv-files"],
  objectives: [
    "Membaca file Excel (.xlsx) dengan `pd.read_excel` dan engine `openpyxl`.",
    "Memilih sheet dengan `sheet_name` dan membaca semua sheet sekaligus.",
    "Menangani judul/baris tambahan di atas tabel dengan `skiprows`, `header`, `usecols`, dan `nrows`.",
    "Menulis beberapa sheet sekaligus dengan `pd.ExcelWriter`.",
  ],
  definition: [
    "File Excel (.xlsx) adalah **workbook** berisi satu atau lebih **sheet**. Berbeda dengan CSV, Excel menyimpan tipe sel (angka, teks, tanggal), format, dan rumus.",
    "`pd.read_excel(path, sheet_name=0)` membaca satu sheet menjadi DataFrame. `sheet_name` bisa berupa posisi (0 = sheet pertama), nama sheet, list, atau `None` (semua sheet → **dictionary** {nama_sheet: DataFrame}).",
    "pandas membutuhkan library **engine**: `openpyxl` untuk .xlsx. Di situs ini openpyxl dimuat otomatis saat kode memakai `read_excel`/`to_excel`; di komputer/Colab instal dengan `pip install openpyxl` jika belum ada.",
    "File Excel buatan manusia sering punya judul, catatan, atau baris kosong di atas tabel; gunakan `skiprows`/`header` untuk menunjuk baris header yang benar.",
  ],
  why: [
    "Banyak data bisnis dan pemerintahan dibagikan dalam Excel: laporan penjualan, data BPS, rekap kualitas udara per bulan. Kemampuan membacanya dengan benar menghemat waktu menyalin manual.",
    "Hasil analisis juga sering diminta dalam Excel (satu sheet per ringkasan) agar mudah dibaca tim non-teknis.",
  ],
  when: [
    "- Data diberikan dalam .xlsx.",
    "- Satu file berisi banyak sheet (per bulan, per wilayah).",
    "- Mengirim laporan ringkasan ke pengguna Excel.",
  ],
  analogy: "Workbook Excel seperti **map berisi beberapa lembar kertas** (sheet). `read_excel` mengambil satu lembar, sedangkan `sheet_name=None` mengambil seluruh isi map sekaligus dan memberi label nama setiap lembar.",
  syntax: {
    code: `pd.read_excel("file.xlsx")                          # sheet pertama
pd.read_excel("file.xlsx", sheet_name="Jakarta")     # berdasarkan nama
semua = pd.read_excel("file.xlsx", sheet_name=None)  # dict semua sheet
pd.read_excel("file.xlsx", skiprows=2, usecols="A:D", nrows=100)

with pd.ExcelWriter("laporan.xlsx") as w:
    df1.to_excel(w, sheet_name="Ringkasan", index=False)
    df2.to_excel(w, sheet_name="Detail", index=False)`,
  },
  anatomy: [
    ["sheet_name", "0, \"nama\", [list], atau None (semua)."],
    ["skiprows / header", "Lewati judul di atas tabel."],
    ["usecols=\"A:D\"", "Rentang kolom gaya Excel, atau list nama."],
    ["pd.ExcelWriter", "Menulis beberapa sheet ke satu file."],
  ],
  examples: [
    {
      title: "Contoh 1 — Membuat lalu membaca file Excel",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv").head(5)
df.to_excel("nilai.xlsx", index=False, sheet_name="Nilai")

baca = pd.read_excel("nilai.xlsx")
print(baca)
print(baca.dtypes.to_dict())`,
      output: "  student_id  hours_studied  attendance  previous_score  final_score\n0       S001            8.0          97              70           96\n1       S002            4.9          90              87           89\n2       S003            8.7          75              88           95\n3       S004            7.3          99              67           95\n4       S005            1.8          76              91           67\n{'student_id': <StringDtype(storage='python', na_value=nan)>, 'hours_studied': dtype('float64'), 'attendance': dtype('int64'), 'previous_score': dtype('int64'), 'final_score': dtype('int64')}",
      explain: [
        ["df.to_excel(\"nilai.xlsx\", index=False, sheet_name=\"Nilai\")", "Menulis DataFrame ke file Excel (engine openpyxl)."],
        ["pd.read_excel(\"nilai.xlsx\")", "Membaca sheet pertama."],
        ["baca.dtypes", "Excel menyimpan tipe sel, sehingga angka tetap angka."],
      ],
    },
    {
      title: "Contoh 2 — Banyak sheet",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
with pd.ExcelWriter("rumah_per_kota.xlsx") as w:
    for kota, sub in df.groupby("city"):
        sub.to_excel(w, sheet_name=kota, index=False)

satu = pd.read_excel("rumah_per_kota.xlsx", sheet_name="Bandung")
print(satu.shape)

semua = pd.read_excel("rumah_per_kota.xlsx", sheet_name=None)
print(type(semua).__name__, list(semua))
print({k: len(v) for k, v in semua.items()})`,
      output: "(64, 8)\ndict ['Bandung', 'Jakarta', 'Surabaya', 'Yogyakarta']\n{'Bandung': 64, 'Jakarta': 114, 'Surabaya': 82, 'Yogyakarta': 40}",
      explain: [
        ["with pd.ExcelWriter(\"rumah_per_kota.xlsx\") as w:", "Satu file, banyak sheet."],
        ["sheet_name=\"Bandung\"", "Membaca sheet berdasarkan nama."],
        ["sheet_name=None", "Semua sheet → dictionary {nama: DataFrame}."],
      ],
      change: "Satu file berisi beberapa tabel.",
    },
    {
      title: "Contoh 3 — Menggabungkan semua sheet",
      code: `import pandas as pd

df = pd.read_csv("house_prices.csv")
with pd.ExcelWriter("rumah_per_kota.xlsx") as w:      # file dari Contoh 2
    for kota, sub in df.groupby("city"):
        sub.to_excel(w, sheet_name=kota, index=False)

semua = pd.read_excel("rumah_per_kota.xlsx", sheet_name=None)
gabung = pd.concat(semua.values(), ignore_index=True)
print(gabung.shape)
print(gabung["city"].value_counts().to_dict())

dengan_label = pd.concat(semua, names=["sheet", "baris"]).reset_index(level="sheet")
print(dengan_label[["sheet", "city"]].head(3))`,
      output: "(300, 8)\n{'Jakarta': 114, 'Surabaya': 82, 'Bandung': 64, 'Yogyakarta': 40}\n         sheet     city\nbaris                  \n0      Bandung  Bandung\n1      Bandung  Bandung\n2      Bandung  Bandung",
      explain: [
        ["pd.concat(semua.values(), ignore_index=True)", "Tumpuk semua sheet menjadi satu tabel."],
        ["pd.concat(semua, names=[\"sheet\", \"baris\"])", "concat dari dictionary memakai key sebagai label asal."],
        ["reset_index(level=\"sheet\")", "Nama sheet menjadi kolom — berguna jika data di sheet tidak punya kolom penanda sendiri."],
      ],
      change: "Data yang terpecah per sheet disatukan untuk analisis.",
    },
    {
      title: "Contoh 4 — Laporan dengan judul di atas tabel",
      code: `import pandas as pd
from openpyxl import Workbook

wb = Workbook()
ws = wb.active
ws.title = "Rekap"
ws.append(["REKAP KUALITAS UDARA JANUARI 2025"])
ws.append(["Sumber: simulasi untuk latihan"])
ws.append([])
ws.append(["tanggal", "stasiun", "pm25"])
ws.append(["2025-01-01", "DKI1", 55.2])
ws.append(["2025-01-02", "DKI1", 47.9])
ws.append(["2025-01-03", "DKI1", None])
wb.save("rekap.xlsx")

salah = pd.read_excel("rekap.xlsx")
print(salah.columns.tolist())

benar = pd.read_excel("rekap.xlsx", skiprows=3, parse_dates=["tanggal"])
print(benar)
print(benar.dtypes.astype(str).to_dict())`,
      output: "['REKAP KUALITAS UDARA JANUARI 2025', 'Unnamed: 1', 'Unnamed: 2']\n     tanggal stasiun  pm25\n0 2025-01-01    DKI1  55.2\n1 2025-01-02    DKI1  47.9\n2 2025-01-03    DKI1   NaN\n{'tanggal': 'datetime64[us]', 'stasiun': 'str', 'pm25': 'float64'}",
      explain: [
        ["from openpyxl import Workbook", "openpyxl dipakai langsung untuk membuat file seperti laporan buatan manusia."],
        ["salah = pd.read_excel(\"rekap.xlsx\")", "Judul laporan terbaca sebagai header → nama kolom kacau."],
        ["skiprows=3", "Lewati tiga baris (judul, sumber, baris kosong); baris keempat menjadi header."],
        ["parse_dates=[\"tanggal\"]", "Teks tanggal diubah menjadi datetime; sel kosong menjadi NaN."],
      ],
      change: "File Excel yang tidak rapi — kasus paling umum di dunia nyata.",
    },
  ],
  params: [
    {
      title: "read_excel",
      items: [
        { name: "sheet_name=0", desc: "Posisi, nama, list, atau None." },
        { name: "header=0, skiprows=None", desc: "Lokasi header / baris yang dilewati." },
        { name: "usecols=None", desc: "\"A:D\", \"A,C,E\", list nama, atau list posisi." },
        { name: "nrows=None", desc: "Jumlah baris yang dibaca." },
        { name: "dtype, na_values, parse_dates", desc: "Sama seperti read_csv." },
        { name: "engine=None", desc: "Otomatis openpyxl untuk .xlsx; xlrd untuk .xls lama." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import pandas as pd\npd.DataFrame({"a": [1, 2]}).to_excel("t.xlsx", index=False, sheet_name="S1")\nprint(list(pd.read_excel("t.xlsx", sheet_name=None)), pd.read_excel("t.xlsx")["a"].sum())`, output: "['S1'] 3" },
  tryIt: `import pandas as pd

df = pd.read_csv("iris.csv")
ringkas = df.groupby("species").mean().round(2)
with pd.ExcelWriter("laporan_iris.xlsx") as w:
    ringkas.to_excel(w, sheet_name="Ringkasan")
    df.to_excel(w, sheet_name="Data", index=False)
print(list(pd.read_excel("laporan_iris.xlsx", sheet_name=None)))`,
  mistakes: [
    {
      title: "Nama sheet salah",
      wrong: `import pandas as pd
pd.DataFrame({"a": [1]}).to_excel("x.xlsx", index=False, sheet_name="Data")
print(pd.read_excel("x.xlsx", sheet_name="data"))`,
      error: "ValueError",
      fix: `import pandas as pd
pd.DataFrame({"a": [1]}).to_excel("x.xlsx", index=False, sheet_name="Data")
print(list(pd.read_excel("x.xlsx", sheet_name=None)))
print(pd.read_excel("x.xlsx", sheet_name="Data"))`,
      explain: "*Worksheet named 'data' not found* — nama sheet case-sensitive. Lihat daftar sheet dengan `sheet_name=None`.",
    },
    {
      title: "Mengira sheet_name=None menghasilkan DataFrame",
      wrong: `import pandas as pd
pd.DataFrame({"a": [1]}).to_excel("y.xlsx", index=False)
df = pd.read_excel("y.xlsx", sheet_name=None)
print(df.shape)`,
      error: "AttributeError",
      fix: `import pandas as pd
pd.DataFrame({"a": [1]}).to_excel("y.xlsx", index=False)
semua = pd.read_excel("y.xlsx", sheet_name=None)
print({k: v.shape for k, v in semua.items()})`,
      explain: "sheet_name=None mengembalikan dictionary; akses tiap DataFrame dengan nama sheet.",
    },
    {
      title: "Kolom index ikut tersimpan",
      wrong: `import pandas as pd
pd.DataFrame({"a": [1, 2]}).to_excel("z.xlsx")
print(pd.read_excel("z.xlsx").columns.tolist())   # ['Unnamed: 0', 'a']`,
      fix: `import pandas as pd
pd.DataFrame({"a": [1, 2]}).to_excel("z.xlsx", index=False)
print(pd.read_excel("z.xlsx").columns.tolist())`,
      explain: "Seperti to_csv, gunakan `index=False` kecuali index bermakna.",
    },
  ],
  bestPractices: [
    "Buka file di Excel/Sheets dulu untuk melihat letak tabel, judul, dan sheet.",
    "Gunakan `sheet_name=None` untuk melihat daftar sheet sebelum memilih.",
    "Konversi data ke CSV/Parquet setelah dibersihkan — lebih cepat dibaca berulang kali.",
    "Hindari mengandalkan warna/format sel sebagai informasi; ubah menjadi kolom eksplisit.",
  ],
  exercises: [
    {
      id: "load-xl-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Baca sheet tertentu",
      prompt: "Lengkapi agar `jkt` berisi sheet bernama \"Jakarta\".",
      starter: `import pandas as pd
df = pd.read_csv("house_prices.csv")
with pd.ExcelWriter("kota.xlsx") as w:
    for kota, sub in df.groupby("city"):
        sub.to_excel(w, sheet_name=kota, index=False)
jkt = pd.read_excel("kota.xlsx", ____="Jakarta")
print(jkt.shape)`,
      solution: `import pandas as pd
df = pd.read_csv("house_prices.csv")
with pd.ExcelWriter("kota.xlsx") as w:
    for kota, sub in df.groupby("city"):
        sub.to_excel(w, sheet_name=kota, index=False)
jkt = pd.read_excel("kota.xlsx", sheet_name="Jakarta")
print(jkt.shape)`,
      tests: [{ desc: "Semua baris Jakarta", expr: "len(jkt) == (df['city'] == 'Jakarta').sum() and (jkt['city'] == 'Jakarta').all()" }],
      hints: ["Konsep: memilih sheet.", "Parameter bernama sheet_...", "`sheet_name=\"Jakarta\"`"],
      explanation: "sheet_name menerima nama sheet.",
    },
    {
      id: "load-xl-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
with pd.ExcelWriter("dua.xlsx") as w:
    pd.DataFrame({"x": [1, 2, 3]}).to_excel(w, sheet_name="A", index=False)
    pd.DataFrame({"x": [10, 20]}).to_excel(w, sheet_name="B", index=False)
s = pd.read_excel("dua.xlsx", sheet_name=None)
print(list(s), type(s).__name__)
print(pd.read_excel("dua.xlsx", sheet_name=1)["x"].sum())`,
      answer: "['A', 'B'] dict\n30",
      hints: ["Konsep: sheet_name=None dan posisi.", "Posisi 1 = sheet kedua.", "10 + 20."],
      explanation: "['A', 'B'] dict; sheet kedua berjumlah 30.",
    },
    {
      id: "load-xl-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Judul di atas tabel",
      prompt: "File `laporan.xlsx` punya 2 baris judul di atas header. Perbaiki pembacaan agar kolomnya `bulan` dan `penjualan`.",
      starter: `import pandas as pd
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for row in [["LAPORAN PENJUALAN"], [], ["bulan", "penjualan"], ["Jan", 120], ["Feb", 95]]:
    ws.append(row)
wb.save("laporan.xlsx")
df = pd.read_excel("laporan.xlsx")
print(df.columns.tolist())`,
      solution: `import pandas as pd
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for row in [["LAPORAN PENJUALAN"], [], ["bulan", "penjualan"], ["Jan", 120], ["Feb", 95]]:
    ws.append(row)
wb.save("laporan.xlsx")
df = pd.read_excel("laporan.xlsx", skiprows=2)
print(df.columns.tolist())`,
      tests: [
        { desc: "Kolom benar", expr: "df.columns.tolist() == ['bulan', 'penjualan']" },
        { desc: "2 baris data", expr: "df['penjualan'].tolist() == [120, 95]" },
      ],
      alternatives: [
        `import pandas as pd
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for row in [["LAPORAN PENJUALAN"], [], ["bulan", "penjualan"], ["Jan", 120], ["Feb", 95]]:
    ws.append(row)
wb.save("laporan.xlsx")
df = pd.read_excel("laporan.xlsx", header=2)
print(df.columns.tolist())`,
      ],
      hints: ["Konsep: melewati baris judul.", "Header berada di baris ke-3 (index 2).", "`skiprows=2` atau `header=2`."],
      explanation: "Baris kosong di Excel juga dihitung sebagai baris yang dilewati.",
    },
    {
      id: "load-xl-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Laporan dua sheet",
      prompt: "Dari `customer_churn.csv`, buat file `churn_report.xlsx` berisi sheet \"Ringkasan\" (churn rate dan jumlah pelanggan per `contract`, `as_index=False`) dan sheet \"Berisiko\" (pelanggan Month-to-month dengan support_tickets ≥ 4). Baca kembali semua sheet dan cetak `{nama: shape}`.",
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
ringkas = df.groupby("contract", as_index=False).agg(n=("churn", "size"), churn_rate=("churn", "mean"))
berisiko = df[(df["contract"] == "Month-to-month") & (df["support_tickets"] >= 4)]
with pd.ExcelWriter("churn_report.xlsx") as w:
    ringkas.to_excel(w, sheet_name="Ringkasan", index=False)
    berisiko.to_excel(w, sheet_name="Berisiko", index=False)
hasil = pd.read_excel("churn_report.xlsx", sheet_name=None)
print({k: v.shape for k, v in hasil.items()})`,
      tests: [
        { desc: "Dua sheet bernama benar", expr: "list(pd.read_excel('churn_report.xlsx', sheet_name=None)) == ['Ringkasan', 'Berisiko']" },
        { desc: "Ringkasan 3 baris", expr: "pd.read_excel('churn_report.xlsx', sheet_name='Ringkasan').shape[0] == df['contract'].nunique()" },
        { desc: "Berisiko benar", expr: "len(pd.read_excel('churn_report.xlsx', sheet_name='Berisiko')) == ((df['contract'] == 'Month-to-month') & (df['support_tickets'] >= 4)).sum()" },
      ],
      hints: ["Konsep: ExcelWriter untuk banyak sheet.", "Buat dua DataFrame lalu tulis dalam satu blok `with`.", "Baca kembali dengan sheet_name=None."],
      explanation: "Laporan Excel multi-sheet adalah cara praktis membagikan hasil analisis ke tim bisnis.",
    },
    {
      id: "load-xl-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Data per bulan dalam sheet terpisah",
      prompt: [
        "Simulasikan file dari instansi: dari `online_shoppers.csv`, tulis satu sheet per nilai `Month` ke `sesi_per_bulan.xlsx` (hanya kolom `Month`, `PageValues`, `Revenue`).",
        "Lalu baca semua sheet, gabungkan menjadi `gabung`, dan cetak jumlah sheet, `gabung.shape`, serta conversion rate per bulan (3 desimal, urut menurun).",
      ],
      starter: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("online_shoppers.csv")
with pd.ExcelWriter("sesi_per_bulan.xlsx") as w:
    for bulan, sub in df.groupby("Month"):
        sub[["Month", "PageValues", "Revenue"]].to_excel(w, sheet_name=bulan, index=False)
semua = pd.read_excel("sesi_per_bulan.xlsx", sheet_name=None)
gabung = pd.concat(semua.values(), ignore_index=True)
print(len(semua), gabung.shape)
print(gabung.groupby("Month")["Revenue"].mean().sort_values(ascending=False).round(3))`,
      tests: [
        { desc: "Jumlah sheet = jumlah bulan", expr: "len(pd.read_excel('sesi_per_bulan.xlsx', sheet_name=None)) == df['Month'].nunique()" },
        { desc: "Tidak ada baris hilang", expr: "gabung.shape == (len(df), 3)" },
        { desc: "Revenue tetap boolean/biner", expr: "set(gabung['Revenue'].unique()) <= {True, False, 0, 1}" },
      ],
      hints: ["Konsep: tulis per kelompok, baca semua, gabungkan.", "`for bulan, sub in df.groupby(\"Month\")`", "`pd.concat(semua.values(), ignore_index=True)`"],
      explanation: "Pola baca-semua-sheet lalu concat sangat umum untuk data rekap bulanan dari instansi.",
    },
  ],
  quiz: [
    { id: "load-xl-q1", type: "mcq", prompt: "`pd.read_excel(f, sheet_name=None)` mengembalikan…", options: ["DataFrame sheet pertama", "Dictionary {nama_sheet: DataFrame}", "List nama sheet", "Error"], answer: 1, explanation: "Semua sheet dalam dictionary." },
    { id: "load-xl-q2", type: "predict", prompt: "Apa outputnya?", code: `import pandas as pd\npd.DataFrame({"a": [5, 6]}).to_excel("q.xlsx", index=False)\nprint(pd.read_excel("q.xlsx").shape)`, options: ["(2, 2)", "(2, 1)", "(1, 2)", "(3, 1)"], answer: 1, explanation: "2 baris, 1 kolom." },
    { id: "load-xl-q3", type: "tf", prompt: "Untuk file .xlsx, pandas memakai engine openpyxl.", answer: true, explanation: "openpyxl untuk .xlsx; xlrd untuk .xls lama." },
    { id: "load-xl-q4", type: "fill", prompt: "Menulis beberapa sheet ke satu file: `with pd.____(\"f.xlsx\") as w:`", answer: ["ExcelWriter"], explanation: "pd.ExcelWriter." },
    { id: "load-xl-q5", type: "case", prompt: "Setelah read_excel, nama kolom menjadi ['LAPORAN BULANAN', 'Unnamed: 1', ...]. Penyebabnya?", options: ["File rusak", "Ada baris judul di atas tabel; gunakan skiprows/header", "Engine salah", "Perlu sheet_name=None"], answer: 1, explanation: "Judul laporan terbaca sebagai header." },
  ],
  challenge: {
    id: "load-xl-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Temukan baris header otomatis",
    prompt: [
      "Tulis fungsi `cari_header(path, kolom_kunci)` yang membaca sheet pertama dengan `header=None`, lalu mencari **baris pertama** yang berisi semua nama di `kolom_kunci`. Kembalikan nomor barisnya (int), atau `None` jika tidak ketemu.",
      "Gunakan hasilnya untuk membaca ulang dengan `header=...`. Uji pada file `rekap2.xlsx` yang dibuat di starter dan cetak nomor baris serta DataFrame hasilnya.",
    ],
    starter: `import pandas as pd
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for row in [["Dinas Lingkungan Hidup"], ["Rekap PM2.5"], [], ["Catatan: data sementara"], ["tanggal", "pm25", "stasiun"], ["2025-02-01", 44.1, "DKI2"], ["2025-02-02", 51.7, "DKI2"]]:
    ws.append(row)
wb.save("rekap2.xlsx")
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
from openpyxl import Workbook
wb = Workbook(); ws = wb.active
for row in [["Dinas Lingkungan Hidup"], ["Rekap PM2.5"], [], ["Catatan: data sementara"], ["tanggal", "pm25", "stasiun"], ["2025-02-01", 44.1, "DKI2"], ["2025-02-02", 51.7, "DKI2"]]:
    ws.append(row)
wb.save("rekap2.xlsx")

def cari_header(path, kolom_kunci):
    mentah = pd.read_excel(path, header=None)
    for i, baris in mentah.iterrows():
        isi = set(baris.dropna().astype(str))
        if set(kolom_kunci) <= isi:
            return int(i)
    return None

h = cari_header("rekap2.xlsx", ["tanggal", "pm25"])
df = pd.read_excel("rekap2.xlsx", header=h)
print(h)
print(df)`,
    tests: [
      { desc: "Header ditemukan", expr: "cari_header('rekap2.xlsx', ['tanggal', 'pm25']) is not None" },
      { desc: "DataFrame benar", expr: "df.columns.tolist() == ['tanggal', 'pm25', 'stasiun'] and df['pm25'].tolist() == [44.1, 51.7]" },
      { desc: "None jika tidak ada", expr: "cari_header('rekap2.xlsx', ['tidak_ada']) is None" },
    ],
    hints: ["Konsep: membaca mentah lalu mencari pola.", "`pd.read_excel(path, header=None)` lalu `iterrows()`.", "Cek `set(kolom_kunci) <= set(baris.dropna().astype(str))`."],
    explanation: "Dengan header=None, nomor baris hasil pembacaan mentah sama dengan posisi baris di file (baris kosong ikut terbaca sebagai baris NaN), sehingga nomor itu bisa langsung dipakai untuk parameter header. Fungsi seperti ini berguna untuk memproses puluhan file rekap dengan format judul yang berbeda-beda.",
  },
  summary: [
    "`pd.read_excel` membaca sheet; engine openpyxl untuk .xlsx.",
    "`sheet_name`: posisi, nama, list, atau None (dictionary semua sheet).",
    "`skiprows`/`header`/`usecols`/`nrows` untuk tabel yang tidak dimulai dari A1.",
    "`pd.ExcelWriter` untuk menulis banyak sheet; gunakan `index=False`.",
  ],
  cheatsheet: [
    { syntax: "pd.read_excel(f, sheet_name=\"S\")", desc: "Sheet tertentu" },
    { syntax: "pd.read_excel(f, sheet_name=None)", desc: "Semua sheet (dict)" },
    { syntax: "pd.read_excel(f, skiprows=3)", desc: "Lewati judul" },
    { syntax: "pd.concat(d.values(), ignore_index=True)", desc: "Gabung sheet" },
    { syntax: "with pd.ExcelWriter(f) as w: df.to_excel(w, sheet_name=..)", desc: "Banyak sheet" },
  ],
  flashcards: [
    { q: "Baca semua sheet Excel", a: "pd.read_excel(f, sheet_name=None) → dict" },
    { q: "Engine pandas untuk .xlsx", a: "openpyxl" },
    { q: "Lewati 2 baris judul di atas tabel Excel", a: "pd.read_excel(f, skiprows=2) atau header=2" },
  ],
  references: [
    pandasDoc("IO tools — Excel files", "user_guide/io.html#excel-files"),
    pandasDoc("pandas.read_excel", "reference/api/pandas.read_excel.html"),
    pandasDoc("pandas.ExcelWriter", "reference/api/pandas.ExcelWriter.html"),
    { source: "openpyxl Documentation", title: "openpyxl — A Python library to read/write Excel 2010 xlsx/xlsm files", url: "https://openpyxl.readthedocs.io/en/stable/" },
  ],
};
