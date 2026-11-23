import type { Lesson } from "../../../types.ts";
import { pandasDoc, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-uploading-dataset",
  title: "Uploading Dataset",
  minutes: 30,
  prerequisites: ["load-loading-csv-files"],
  objectives: [
    "Mengunggah file dataset ke lingkungan kerja: Playground situs ini, Jupyter lokal, dan Google Colab.",
    "Membaca file yang diunggah dalam bentuk path maupun bytes (`io.BytesIO`).",
    "Memeriksa file yang diunggah: nama, ekstensi, ukuran, dan encoding.",
    "Memvalidasi isi dataset unggahan sebelum dianalisis.",
  ],
  definition: [
    "**Mengunggah dataset** berarti memindahkan file dari komputermu ke lingkungan tempat kode Python berjalan. Caranya berbeda per lingkungan:\n- **Playground situs ini** — tombol *Upload CSV dataset* menyalin file (.csv, .txt, .json, .tsv) ke sistem file Python di browser; file dapat dibaca dengan namanya, misalnya `pd.read_csv(\"data_saya.csv\")`. File hanya ada selama sesi tab berjalan dan tidak dikirim ke server mana pun.\n- **Jupyter/VS Code lokal** — taruh file di folder yang sama dengan notebook, atau tulis path lengkapnya.\n- **Google Colab** — `from google.colab import files; uploaded = files.upload()` mengembalikan dictionary `{nama_file: bytes}`; file juga tersimpan di folder kerja `/content` (hilang saat runtime berakhir).",
    "Jika file diterima sebagai **bytes** (seperti hasil `files.upload()`), bungkus dengan `io.BytesIO(...)` agar bisa dibaca pandas tanpa menyimpan ke disk.",
    "File dari sumber berbeda bisa memakai **encoding** selain UTF-8 (misalnya ekspor Excel lama memakai `latin-1`/`cp1252`). Encoding yang salah memunculkan `UnicodeDecodeError`.",
  ],
  why: [
    "Data proyek nyata (data sekolah, data toko, data kompetisi) berada di komputermu dan harus diunggah sebelum diolah.",
    "Memvalidasi file unggahan (ekstensi, ukuran, kolom wajib) mencegah analisis berjalan pada file yang salah — kesalahan yang sering terjadi saat tim bertukar banyak versi file.",
  ],
  when: [
    "- Memakai dataset milik sendiri di Playground atau Colab.",
    "- Menerima file dari rekan tim.",
    "- Membangun alat sederhana yang menerima file pengguna.",
  ],
  analogy: "Mengunggah file seperti **menyerahkan berkas ke loket**: petugas (kode) mengecek nama dan jenis berkas, memastikan halamannya lengkap (kolom wajib), dan membaca dengan bahasa yang benar (encoding) sebelum memprosesnya.",
  syntax: {
    code: `# Playground situs ini: klik "Upload CSV dataset", lalu
df = pd.read_csv("nama_file_kamu.csv")

# Google Colab (hanya berjalan di Colab):
# from google.colab import files
# uploaded = files.upload()                       # {nama: bytes}
# df = pd.read_csv(io.BytesIO(uploaded["data.csv"]))

# Encoding non-UTF-8
df = pd.read_csv("file.csv", encoding="latin-1")`,
  },
  anatomy: [
    ["pd.read_csv(\"nama.csv\")", "File unggahan dibaca dengan namanya."],
    ["io.BytesIO(bytes)", "Bytes di memori diperlakukan seperti file."],
    ["encoding=\"latin-1\"", "Untuk file yang bukan UTF-8."],
    ["os.path.getsize(path)", "Ukuran file dalam byte."],
  ],
  examples: [
    {
      title: "Contoh 1 — Melihat file yang tersedia",
      code: `import os

semua = os.listdir(".")   # daftar file di folder kerja
print("iris.csv tersedia?", "iris.csv" in semua)
print("data_saya.csv tersedia?", "data_saya.csv" in semua, "(muncul setelah kamu mengunggahnya)")
for f in ["iris.csv", "house_prices.csv"]:
    print(f, round(os.path.getsize(f) / 1024, 1), "KB")`,
      output: "iris.csv tersedia? True\ndata_saya.csv tersedia? False (muncul setelah kamu mengunggahnya)\niris.csv 3.8 KB\nhouse_prices.csv 9.9 KB",
      explain: [
        ["os.listdir(\".\")", "Daftar file di folder kerja Python — file yang kamu unggah di Playground juga muncul di sini."],
        ["os.path.getsize(f)", "Ukuran file dalam byte; dibagi 1024 untuk KB."],
      ],
    },
    {
      title: "Contoh 2 — Membaca file dari bytes (pola files.upload Colab)",
      code: `import io
import pandas as pd

# Simulasi hasil files.upload(): dictionary {nama_file: bytes}
with open("student_scores.csv", "rb") as f:
    uploaded = {"student_scores.csv": f.read()}

for nama, isi in uploaded.items():
    print(nama, type(isi).__name__, len(isi), "byte")
    df = pd.read_csv(io.BytesIO(isi))
    print(df.shape)`,
      output: "student_scores.csv bytes 609 byte\n(30, 5)",
      explain: [
        ["uploaded = {\"student_scores.csv\": f.read()}", "Bentuk yang sama dengan hasil `files.upload()` di Colab."],
        ["io.BytesIO(isi)", "Membungkus bytes agar bisa dibaca seperti file."],
      ],
      change: "File berbentuk bytes di memori, bukan path.",
    },
    {
      title: "Contoh 3 — Encoding yang berbeda",
      code: `import pandas as pd

teks = "nama,kota\\nJosé,São Paulo\\nAndré,Bogotá\\n"
with open("latin.csv", "wb") as f:
    f.write(teks.encode("latin-1"))

try:
    pd.read_csv("latin.csv")
except UnicodeDecodeError as e:
    print("UnicodeDecodeError:", str(e)[:60])

df = pd.read_csv("latin.csv", encoding="latin-1")
print(df)`,
      output: "UnicodeDecodeError: 'utf-8' codec can't decode byte 0xe9 in position 13: invalid\n    nama       kota\n0   José  São Paulo\n1  André     Bogotá",
      explain: [
        ["f.write(teks.encode(\"latin-1\"))", "Simulasi file ekspor sistem lama berencoding latin-1."],
        ["pd.read_csv(\"latin.csv\")", "Default UTF-8 gagal membaca huruf beraksen."],
        ["encoding=\"latin-1\"", "Tentukan encoding yang benar."],
      ],
      change: "File dari sistem berbeda membutuhkan encoding yang tepat.",
    },
    {
      title: "Contoh 4 — Memvalidasi file unggahan",
      code: `import os
import pandas as pd

def validasi_unggahan(path, kolom_wajib, maks_mb=50):
    masalah = []
    if not path.lower().endswith((".csv", ".tsv")):
        masalah.append("bukan file CSV/TSV")
    elif os.path.getsize(path) > maks_mb * 1024 * 1024:
        masalah.append(f"lebih dari {maks_mb} MB")
    else:
        sep = "\\t" if path.lower().endswith(".tsv") else ","
        kolom = pd.read_csv(path, sep=sep, nrows=0).columns
        hilang = [k for k in kolom_wajib if k not in kolom]
        if hilang:
            masalah.append(f"kolom hilang: {hilang}")
    return masalah or ["OK"]

print(validasi_unggahan("house_prices.csv", ["city", "price_million"]))
print(validasi_unggahan("house_prices.csv", ["city", "harga"]))
print(validasi_unggahan("laporan.pdf", ["a"]))`,
      output: "['OK']\n[\"kolom hilang: ['harga']\"]\n['bukan file CSV/TSV']",
      explain: [
        ["path.lower().endswith((\".csv\", \".tsv\"))", "Cek ekstensi."],
        ["os.path.getsize(path) > maks_mb * 1024 * 1024", "Cek ukuran sebelum membaca seluruh file."],
        ["pd.read_csv(path, sep=sep, nrows=0).columns", "nrows=0 hanya membaca header — cepat untuk memeriksa kolom."],
      ],
      change: "File diperiksa sebelum dibaca penuh.",
    },
  ],
  params: [
    {
      title: "Alat untuk file unggahan",
      items: [
        { name: "os.listdir(path), os.path.exists(path), os.path.getsize(path)", desc: "Informasi file." },
        { name: "io.BytesIO(b), io.StringIO(s)", desc: "Bytes/teks di memori sebagai file." },
        { name: "pd.read_csv(..., encoding=\"utf-8\")", desc: "\"latin-1\", \"cp1252\", \"utf-8-sig\" (UTF-8 dengan BOM dari Excel)." },
        { name: "pd.read_csv(..., nrows=0)", desc: "Hanya header." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import io\nimport pandas as pd\nb = "x,y\\n1,2\\n3,4".encode("utf-8")\nprint(pd.read_csv(io.BytesIO(b)).sum().to_dict(), len(b))`, output: "{'x': 4, 'y': 6} 11" },
  tryIt: `import pandas as pd

# 1) Buka Playground → klik "Upload CSV dataset" → pilih file CSV milikmu.
# 2) Ganti nama file di bawah dengan nama file yang kamu unggah.
nama_file = "iris.csv"
df = pd.read_csv(nama_file)
print(df.shape)
print(df.head())`,
  mistakes: [
    {
      title: "Membaca bytes langsung sebagai path",
      wrong: `import pandas as pd
isi = b"a,b\\n1,2"
print(pd.read_csv(isi))`,
      error: "TypeError",
      fix: `import io
import pandas as pd
isi = b"a,b\\n1,2"
print(pd.read_csv(io.BytesIO(isi)))`,
      explain: "Bytes bukan path. Bungkus dengan `io.BytesIO`.",
    },
    {
      title: "UTF-8 BOM dari Excel membuat nama kolom aneh",
      wrong: `import pandas as pd
with open("bom.csv", "wb") as f:
    f.write("nama,umur\\nAni,21".encode("utf-8-sig"))
df = pd.read_csv("bom.csv", encoding="latin-1")
print(df.columns.tolist())   # ['ï»¿nama', 'umur']`,
      fix: `import pandas as pd
with open("bom.csv", "wb") as f:
    f.write("nama,umur\\nAni,21".encode("utf-8-sig"))
df = pd.read_csv("bom.csv", encoding="utf-8-sig")
print(df.columns.tolist())`,
      explain: "Excel sering menyimpan \"CSV UTF-8\" dengan BOM (byte penanda di awal). Encoding yang salah membuat karakter aneh menempel di nama kolom pertama; gunakan `encoding=\"utf-8-sig\"`.",
    },
    {
      title: "Nama file unggahan berbeda dari yang ditulis di kode",
      wrong: `import pandas as pd
df = pd.read_csv("Data Penjualan (1).csv")`,
      error: "FileNotFoundError",
      fix: `import os
print([f for f in os.listdir(".") if f.endswith(".csv")][:3])`,
      explain: "Browser/OS sering menambahkan \"(1)\" atau spasi pada nama file. Cek nama persisnya dengan `os.listdir` dan ganti nama file agar sederhana (tanpa spasi).",
    },
  ],
  bestPractices: [
    "Gunakan nama file sederhana tanpa spasi (`penjualan_2025.csv`).",
    "Validasi ekstensi, ukuran, dan kolom wajib sebelum analisis.",
    "Jangan mengunggah data pribadi/rahasia ke layanan yang tidak kamu percayai; di Playground situs ini file tetap berada di browsermu.",
    "Di Colab, simpan file penting ke Google Drive karena folder /content terhapus saat runtime berakhir.",
  ],
  exercises: [
    {
      id: "load-up-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Bytes ke DataFrame",
      prompt: "Lengkapi agar `df` terbaca dari bytes `isi`.",
      starter: `import io
import pandas as pd
isi = b"produk,qty\\nkopi,3\\nteh,5"
df = pd.read_csv(io.____(isi))
print(df)`,
      solution: `import io
import pandas as pd
isi = b"produk,qty\\nkopi,3\\nteh,5"
df = pd.read_csv(io.BytesIO(isi))
print(df)`,
      tests: [{ desc: "df benar", expr: "df['qty'].sum() == 8" }],
      hints: ["Konsep: bytes di memori.", "Kelas io untuk bytes.", "`io.BytesIO(isi)`"],
      explanation: "BytesIO = file virtual dari bytes.",
    },
    {
      id: "load-up-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import io
import pandas as pd
b = "kota;jumlah\\nBogor;3\\nDepok;4".encode("utf-8")
df = pd.read_csv(io.BytesIO(b), sep=";", nrows=0)
print(df.columns.tolist(), len(df))`,
      answer: "['kota', 'jumlah'] 0",
      hints: ["Konsep: nrows=0 hanya membaca header.", "Delimiter titik koma.", "Tidak ada baris data."],
      explanation: "['kota', 'jumlah'] 0.",
    },
    {
      id: "load-up-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Encoding",
      prompt: "File `cafe.csv` disimpan dengan encoding latin-1. Perbaiki pembacaan agar tidak error.",
      starter: `import pandas as pd
with open("cafe.csv", "wb") as f:
    f.write("menu,harga\\nCafé latte,25000\\nCrème brûlée,30000\\n".encode("latin-1"))
df = pd.read_csv("cafe.csv")
print(df)`,
      solution: `import pandas as pd
with open("cafe.csv", "wb") as f:
    f.write("menu,harga\\nCafé latte,25000\\nCrème brûlée,30000\\n".encode("latin-1"))
df = pd.read_csv("cafe.csv", encoding="latin-1")
print(df)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Huruf beraksen terbaca", expr: "df['menu'].tolist() == ['Café latte', 'Crème brûlée']" },
      ],
      hints: ["Konsep: encoding file.", "Tentukan encoding saat membaca.", "`encoding=\"latin-1\"`"],
      explanation: "UnicodeDecodeError hampir selalu berarti encoding yang dipakai salah.",
    },
    {
      id: "load-up-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Baca semua file unggahan",
      prompt: "Simulasikan `uploaded = {nama: bytes}` berisi dua file (`data.csv` dan `data_semicolon.csv`, baca bytes-nya dari file yang tersedia). Baca setiap file dengan `io.BytesIO` — gunakan `sep=\";\"` jika nama mengandung \"semicolon\". Simpan dalam dict `tabel = {nama: DataFrame}` lalu cetak shape masing-masing.",
      starter: `import io
import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import io
import pandas as pd
uploaded = {}
for nama in ["data.csv", "data_semicolon.csv"]:
    with open(nama, "rb") as f:
        uploaded[nama] = f.read()
tabel = {}
for nama, isi in uploaded.items():
    sep = ";" if "semicolon" in nama else ","
    tabel[nama] = pd.read_csv(io.BytesIO(isi), sep=sep)
print({k: v.shape for k, v in tabel.items()})`,
      tests: [
        { desc: "Dua tabel", expr: "set(tabel) == {'data.csv', 'data_semicolon.csv'}" },
        { desc: "Shape sama (4 kolom)", expr: "tabel['data.csv'].shape == tabel['data_semicolon.csv'].shape and tabel['data.csv'].shape[1] == 4" },
      ],
      hints: ["Konsep: memproses dictionary hasil upload.", "Baca bytes dengan open(nama, \"rb\").", "Pilih sep berdasarkan nama file."],
      explanation: "Pola loop atas hasil `files.upload()` memungkinkan mengunggah banyak file sekaligus di Colab.",
    },
    {
      id: "load-up-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Validasi file kompetisi",
      prompt: [
        "Tim menerima file `train.csv` dari rekan (simulasikan dengan menyalin `customer_churn.csv`). Tulis fungsi `cek_train(path)` yang mengembalikan dict `{\"ok\": bool, \"pesan\": list}` dengan aturan: kolom wajib [\"customer_id\", \"churn\"] ada, `churn` hanya bernilai 0/1, dan tidak ada `customer_id` kosong.",
        "Uji pada salinan file dan pada file rusak (`train_rusak.csv`: hapus kolom churn). Cetak kedua hasil.",
      ],
      starter: `import shutil
import pandas as pd
shutil.copy("customer_churn.csv", "train.csv")
pd.read_csv("customer_churn.csv").drop(columns="churn").to_csv("train_rusak.csv", index=False)
# Tulis kodemu di sini
`,
      solution: `import shutil
import pandas as pd
shutil.copy("customer_churn.csv", "train.csv")
pd.read_csv("customer_churn.csv").drop(columns="churn").to_csv("train_rusak.csv", index=False)

def cek_train(path):
    pesan = []
    df = pd.read_csv(path)
    for k in ["customer_id", "churn"]:
        if k not in df.columns:
            pesan.append(f"kolom {k} tidak ada")
    if "churn" in df.columns and not df["churn"].isin([0, 1]).all():
        pesan.append("churn bukan 0/1")
    if "customer_id" in df.columns and df["customer_id"].isna().any():
        pesan.append("customer_id kosong")
    return {"ok": not pesan, "pesan": pesan}

print(cek_train("train.csv"))
print(cek_train("train_rusak.csv"))`,
      tests: [
        { desc: "File asli lolos", expr: "cek_train('train.csv') == {'ok': True, 'pesan': []}" },
        { desc: "File rusak terdeteksi", expr: "cek_train('train_rusak.csv') == {'ok': False, 'pesan': ['kolom churn tidak ada']}" },
      ],
      hints: ["Konsep: validasi isi file.", "Kumpulkan pesan di list.", "`df[\"churn\"].isin([0, 1]).all()`"],
      explanation: "Validasi otomatis saat menerima file dari rekan mencegah tim melatih model dengan versi file yang salah.",
    },
  ],
  quiz: [
    { id: "load-up-q1", type: "mcq", prompt: "Di Google Colab, `files.upload()` mengembalikan…", options: ["DataFrame", "Dictionary {nama_file: bytes}", "List path", "String"], answer: 1, explanation: "Dictionary nama → bytes." },
    { id: "load-up-q2", type: "predict", prompt: "Apa outputnya?", code: `import io\nimport pandas as pd\nprint(pd.read_csv(io.BytesIO(b"a\\n1\\n2\\n3")).shape)`, options: ["(4, 1)", "(3, 1)", "(1, 3)", "Error"], answer: 1, explanation: "Header a, tiga baris data." },
    { id: "load-up-q3", type: "tf", prompt: "File yang diunggah ke folder /content di Colab tetap ada setelah runtime diputus.", answer: false, explanation: "/content terhapus; simpan ke Drive." },
    { id: "load-up-q4", type: "fill", prompt: "CSV UTF-8 dengan BOM dari Excel dibaca dengan `encoding=\"____\"`", answer: ["utf-8-sig"], explanation: "utf-8-sig." },
    { id: "load-up-q5", type: "case", prompt: "Saat membaca file dari rekan muncul UnicodeDecodeError. Langkah pertama?", options: ["Ketik ulang data", "Coba encoding lain seperti latin-1 atau utf-8-sig", "Hapus baris pertama", "Ubah ke Excel"], answer: 1, explanation: "Error tersebut menandakan encoding tidak cocok." },
  ],
  challenge: {
    id: "load-up-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Pembaca file serba bisa",
    prompt: [
      "Tulis fungsi `baca_unggahan(nama, isi)` yang menerima nama file dan bytes, lalu:",
      "- `.json` → `pd.read_json(io.BytesIO(isi))`\n- `.tsv` → read_csv dengan `sep=\"\\t\"`\n- `.csv` → deteksi delimiter: jika baris pertama (didecode) mengandung \";\" dan tidak mengandung \",\" gunakan `;`, selain itu `,`\n- encoding: coba \"utf-8-sig\" dulu, jika UnicodeDecodeError ulangi dengan \"latin-1\"\n- ekstensi lain → `raise ValueError(\"Format tidak didukung\")`",
      "Uji pada 4 file di starter dan cetak shape masing-masing.",
    ],
    starter: `import io
import pandas as pd
files = {
    "a.csv": "x,y\\n1,2\\n3,4".encode("utf-8"),
    "b.csv": "nama;kota\\nJosé;Bogotá".encode("latin-1"),
    "c.tsv": "p\\tq\\n5\\t6".encode("utf-8"),
    "d.json": '[{"k": 1}, {"k": 2}, {"k": 3}]'.encode("utf-8"),
}
# Tulis kodemu di sini
`,
    solution: `import io
import pandas as pd
files = {
    "a.csv": "x,y\\n1,2\\n3,4".encode("utf-8"),
    "b.csv": "nama;kota\\nJosé;Bogotá".encode("latin-1"),
    "c.tsv": "p\\tq\\n5\\t6".encode("utf-8"),
    "d.json": '[{"k": 1}, {"k": 2}, {"k": 3}]'.encode("utf-8"),
}

def baca_unggahan(nama, isi):
    nama = nama.lower()
    if nama.endswith(".json"):
        return pd.read_json(io.BytesIO(isi))
    if not nama.endswith((".csv", ".tsv")):
        raise ValueError("Format tidak didukung")
    for enc in ["utf-8-sig", "latin-1"]:
        try:
            teks = isi.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    if nama.endswith(".tsv"):
        sep = "\\t"
    else:
        baris1 = teks.splitlines()[0]
        sep = ";" if ";" in baris1 and "," not in baris1 else ","
    return pd.read_csv(io.StringIO(teks), sep=sep)

for nama, isi in files.items():
    print(nama, baca_unggahan(nama, isi).shape)`,
    tests: [
      { desc: "Semua shape benar", expr: "{k: baca_unggahan(k, v).shape for k, v in files.items()} == {'a.csv': (2, 2), 'b.csv': (1, 2), 'c.tsv': (1, 2), 'd.json': (3, 1)}" },
      { desc: "Latin-1 terbaca benar", expr: "baca_unggahan('b.csv', files['b.csv']).iloc[0].tolist() == ['José', 'Bogotá']" },
      { desc: "Format lain ditolak", expr: "_raises(baca_unggahan, 'x.pdf', b'') == ('ValueError', 'Format tidak didukung')" },
    ],
    hints: ["Konsep: memilih cara baca berdasarkan ekstensi & isi.", "Decode bytes sendiri dengan try/except, lalu baca dari io.StringIO.", "Deteksi delimiter dari baris pertama."],
    explanation: "Fungsi ini merangkum masalah nyata file unggahan: format berbeda, delimiter berbeda, dan encoding berbeda.",
  },
  summary: [
    "Playground: tombol Upload → baca dengan nama file. Colab: `files.upload()` → {nama: bytes}.",
    "Bytes dibaca dengan `io.BytesIO`; teks dengan `io.StringIO`.",
    "UnicodeDecodeError → coba encoding lain (utf-8-sig, latin-1).",
    "Validasi ekstensi, ukuran, dan kolom wajib sebelum analisis.",
  ],
  cheatsheet: [
    { syntax: "pd.read_csv(io.BytesIO(b))", desc: "Dari bytes" },
    { syntax: "pd.read_csv(f, encoding=\"latin-1\")", desc: "Encoding lain" },
    { syntax: "pd.read_csv(f, nrows=0).columns", desc: "Cek header saja" },
    { syntax: "os.path.getsize(f)", desc: "Ukuran file" },
    { syntax: "files.upload()  # Colab", desc: "Unggah di Colab" },
  ],
  flashcards: [
    { q: "Baca CSV dari bytes hasil upload", a: "pd.read_csv(io.BytesIO(isi))" },
    { q: "Arti UnicodeDecodeError saat membaca CSV", a: "Encoding file tidak cocok (coba latin-1/utf-8-sig)" },
    { q: "Di mana file unggahan Playground situs ini disimpan?", a: "Di sistem file Python dalam browser selama sesi; tidak dikirim ke server" },
  ],
  references: [
    { source: "Google Colab (kode sumber resmi)", title: "googlecolab/colabtools — google/colab/files.py (files.upload & files.download)", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/google/colab/files.py" },
    pyDoc("io — BytesIO and StringIO", "library/io.html"),
    pyDoc("codecs — Standard Encodings", "library/codecs.html#standard-encodings"),
    pandasDoc("pandas.read_csv — encoding parameter", "reference/api/pandas.read_csv.html"),
  ],
};
