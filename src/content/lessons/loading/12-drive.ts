import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-connecting-google-colab-to-google-drive",
  title: "Connecting Google Colab to Google Drive",
  minutes: 30,
  prerequisites: ["load-loading-dataset-in-google-colab"],
  objectives: [
    "Menghubungkan (mount) Google Drive ke Colab dengan `drive.mount`.",
    "Memahami struktur path Drive di Colab: `/content/drive/MyDrive/...`.",
    "Membaca dan menyimpan dataset, model, serta submission di Drive.",
    "Mengorganisasi folder proyek tim dan menemukan banyak file dengan `glob`.",
  ],
  definition: [
    "**Mount Google Drive** berarti menjadikan isi Drive-mu terlihat sebagai folder biasa di runtime Colab. Setelah `drive.mount(\"/content/drive\")` dan memberi izin akses, folder \"My Drive\" tersedia di `/content/drive/MyDrive/`.",
    "File di Drive **permanen** — tetap ada setelah runtime berakhir — sehingga cocok untuk dataset, model terlatih, log eksperimen, dan submission.",
    "Folder yang dibagikan orang lain (\"Shared with me\") tidak otomatis muncul di MyDrive; tambahkan pintasan (*Add shortcut to Drive*) agar bisa diakses lewat path. Untuk tim, buat satu folder bersama dan setiap anggota menambahkan pintasannya.",
    "Kode `google.colab.drive` hanya berjalan di Colab. Contoh di situs ini **menyimulasikan** struktur folder `/content/drive/MyDrive` di sistem file virtual agar pola kodenya (path, glob, simpan/baca) bisa dipraktikkan; perintah mount ditunjukkan di bagian sintaks.",
  ],
  why: [
    "Tanpa Drive, setiap kali runtime habis kamu harus mengunggah ulang data dan kehilangan model yang sudah dilatih. Dengan Drive, pekerjaan berlanjut dari titik terakhir.",
    "Untuk tim kompetisi, folder Drive bersama menjadi \"satu sumber kebenaran\": data mentah, data bersih, dan setiap versi submission tersimpan rapi dan dapat dilacak.",
  ],
  when: [
    "- Dataset terlalu besar untuk diunggah berulang kali.",
    "- Menyimpan model dan hasil training panjang.",
    "- Bekerja bersama tim di satu folder.",
    "- Menyimpan log eksperimen dan versi submission.",
  ],
  analogy: "Mount Drive seperti **menyambungkan flashdisk** ke komputer pinjaman: isinya muncul sebagai folder, kamu bisa membaca dan menyimpan file, dan semuanya tetap ada di flashdisk setelah komputer dimatikan.",
  syntax: {
    code: `# === HANYA di Google Colab ===
from google.colab import drive
drive.mount("/content/drive")          # muncul jendela izin akses

import pandas as pd
DRIVE = "/content/drive/MyDrive/pm25-jakarta"
train = pd.read_csv(f"{DRIVE}/data/train.csv")
sub.to_csv(f"{DRIVE}/submission/sub_v3.csv", index=False)

drive.flush_and_unmount()              # opsional: pastikan semua tersimpan`,
  },
  anatomy: [
    ["drive.mount(\"/content/drive\")", "Menghubungkan Drive (butuh izin)."],
    ["/content/drive/MyDrive/", "Akar \"My Drive\"."],
    ["Path.glob(\"*.csv\")", "Mencari banyak file dengan pola."],
    ["drive.flush_and_unmount()", "Menyelesaikan penulisan & melepas Drive."],
  ],
  examples: [
    {
      title: "Contoh 1 — Struktur folder proyek di Drive (simulasi)",
      code: `from pathlib import Path

DRIVE = Path("/content/drive/MyDrive/pm25-jakarta")   # di Colab tersedia setelah drive.mount
for sub in ["data/raw", "data/processed", "notebooks", "models", "submissions"]:
    (DRIVE / sub).mkdir(parents=True, exist_ok=True)

for p in sorted(DRIVE.rglob("*")):
    print("  " * (len(p.relative_to(DRIVE).parts) - 1) + p.name + "/")`,
      output: "data/\n  processed/\n  raw/\nmodels/\nnotebooks/\nsubmissions/",
      explain: [
        ["DRIVE = Path(\"/content/drive/MyDrive/pm25-jakarta\")", "Folder proyek tim di Drive."],
        ["(DRIVE / sub).mkdir(parents=True, exist_ok=True)", "Struktur standar: data mentah, data olahan, notebook, model, submission."],
        ["DRIVE.rglob(\"*\")", "Menelusuri semua isi folder secara rekursif."],
      ],
    },
    {
      title: "Contoh 2 — Menyimpan dan membaca data di Drive",
      code: `from pathlib import Path
import shutil
import pandas as pd

DRIVE = Path("/content/drive/MyDrive/pm25-jakarta")
(DRIVE / "data/raw").mkdir(parents=True, exist_ok=True)
shutil.copy("customer_churn.csv", DRIVE / "data/raw/train.csv")   # anggap ini file asli tim

train = pd.read_csv(DRIVE / "data/raw/train.csv")
bersih = train.drop_duplicates().dropna(subset=["age"])
(DRIVE / "data/processed").mkdir(parents=True, exist_ok=True)
bersih.to_csv(DRIVE / "data/processed/train_clean.csv", index=False)
print(train.shape, "→", bersih.shape)
print(sorted(p.name for p in (DRIVE / "data").rglob("*.csv")))`,
      output: "(403, 10) → (395, 10)\n['train.csv', 'train_clean.csv']",
      explain: [
        ["pd.read_csv(DRIVE / \"data/raw/train.csv\")", "Membaca dari Drive sama seperti membaca file biasa."],
        ["bersih.to_csv(DRIVE / \"data/processed/train_clean.csv\", index=False)", "Hasil pembersihan disimpan terpisah — data mentah tidak ditimpa."],
      ],
      change: "Alur raw → processed di Drive.",
    },
    {
      title: "Contoh 3 — Banyak file dengan glob",
      code: `from pathlib import Path
import pandas as pd

raw = Path("/content/drive/MyDrive/pm25-jakarta/data/raw/harian")
raw.mkdir(parents=True, exist_ok=True)
for tahun, nilai in [(2023, [48, 52]), (2024, [45, 50]), (2025, [41, 47])]:
    pd.DataFrame({"tahun": tahun, "pm25": nilai}).to_csv(raw / f"pm25_{tahun}.csv", index=False)

files = sorted(raw.glob("pm25_*.csv"))
print([f.name for f in files])
semua = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
print(semua.groupby("tahun")["pm25"].mean().to_dict())`,
      output: "['pm25_2023.csv', 'pm25_2024.csv', 'pm25_2025.csv']\n{2023: 50.0, 2024: 47.5, 2025: 44.0}",
      explain: [
        ["raw.glob(\"pm25_*.csv\")", "Semua file yang namanya cocok dengan pola."],
        ["files = sorted(raw.glob(", "glob tidak menjamin urutan; urutkan agar hasil konsisten."],
        ["pd.concat([pd.read_csv(f) for f in files], ignore_index=True)", "Gabungkan data per tahun menjadi satu tabel."],
      ],
      change: "Membaca puluhan file sekaligus dari folder Drive.",
    },
    {
      title: "Contoh 4 — Log eksperimen tim di Drive",
      code: `from pathlib import Path
import pandas as pd

log_path = Path("/content/drive/MyDrive/pm25-jakarta/experiments.csv")
log_path.parent.mkdir(parents=True, exist_ok=True)
if log_path.exists():
    log_path.unlink()            # mulai bersih untuk contoh ini

def catat(anggota, model, mae, catatan=""):
    baris = pd.DataFrame([{"anggota": anggota, "model": model, "mae": mae, "catatan": catatan}])
    baris.to_csv(log_path, mode="a", header=not log_path.exists(), index=False)

catat("Ani", "baseline_median_bulan", 14.8)
catat("Budi", "LinearRegression+lag", 11.2, "lag 1-7 hari")
catat("Citra", "RandomForest+kalender", 9.6, "tambah fitur libur")
log = pd.read_csv(log_path)
print(log.sort_values("mae"))`,
      output: "  anggota                  model   mae             catatan\n2   Citra  RandomForest+kalender   9.6  tambah fitur libur\n1    Budi   LinearRegression+lag  11.2        lag 1-7 hari\n0     Ani  baseline_median_bulan  14.8                 NaN",
      explain: [
        ["mode=\"a\"", "Append: menambah baris tanpa menimpa isi file."],
        ["header=not log_path.exists()", "Header hanya ditulis saat file pertama kali dibuat."],
        ["log.sort_values(\"mae\")", "Leaderboard internal tim — semua anggota melihat hasil terbaru di Drive."],
      ],
      change: "Drive dipakai untuk kolaborasi, bukan hanya penyimpanan.",
    },
  ],
  params: [
    {
      title: "Drive & file",
      items: [
        { name: "drive.mount(mountpoint, force_remount=False)", desc: "Hubungkan Drive; force_remount=True untuk menyambung ulang." },
        { name: "Path.glob(pola), Path.rglob(pola)", desc: "Cari file (rekursif dengan rglob)." },
        { name: "to_csv(path, mode=\"a\", header=False)", desc: "Menambah baris ke file yang ada." },
        { name: "shutil.copy(src, dst), shutil.copytree(src, dst)", desc: "Salin file/folder (misalnya /content → Drive)." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `from pathlib import Path\np = Path("/content/drive/MyDrive/tim/data")\np.mkdir(parents=True, exist_ok=True)\n(p / "a.csv").write_text("x\\n1")\nprint([f.name for f in p.glob("*.csv")], p.parent.name)`, output: "['a.csv'] tim" },
  tryIt: `from pathlib import Path

DRIVE = Path("/content/drive/MyDrive/proyek-saya")
for f in ["data", "models", "submissions"]:
    (DRIVE / f).mkdir(parents=True, exist_ok=True)
print(sorted(p.name for p in DRIVE.iterdir()))`,
  mistakes: [
    {
      title: "Path tanpa MyDrive",
      wrong: `import pandas as pd
df = pd.read_csv("/content/drive/pm25-jakarta/train.csv")`,
      error: "FileNotFoundError",
      fix: `from pathlib import Path
print(Path("/content/drive/MyDrive") / "pm25-jakarta" / "train.csv")`,
      explain: "Isi \"My Drive\" berada di `/content/drive/MyDrive/` (tanpa spasi). Salin path dari panel Files Colab (klik kanan → Copy path) agar tepat.",
    },
    {
      title: "Menimpa data mentah",
      wrong: `import pandas as pd
from pathlib import Path
p = Path("/content/drive/MyDrive/x"); p.mkdir(parents=True, exist_ok=True)
pd.DataFrame({"a": [1, None]}).to_csv(p / "train.csv", index=False)
df = pd.read_csv(p / "train.csv").dropna()
df.to_csv(p / "train.csv", index=False)   # data asli hilang`,
      fix: `import pandas as pd
from pathlib import Path
p = Path("/content/drive/MyDrive/x"); p.mkdir(parents=True, exist_ok=True)
pd.DataFrame({"a": [1, None]}).to_csv(p / "train.csv", index=False)
df = pd.read_csv(p / "train.csv").dropna()
df.to_csv(p / "train_clean.csv", index=False)
print(sorted(f.name for f in p.glob("*.csv")))`,
      explain: "Simpan hasil olahan dengan nama baru (atau di folder processed); data mentah adalah titik awal yang harus selalu bisa diulang.",
    },
    {
      title: "Hasil glob tidak terurut",
      wrong: `from pathlib import Path
import pandas as pd
d = Path("/content/g"); d.mkdir(exist_ok=True)
for n in ["b", "a", "c"]:
    (d / f"{n}.csv").write_text("v\\n1")
files = list(d.glob("*.csv"))   # urutan tidak dijamin`,
      fix: `from pathlib import Path
d = Path("/content/g"); d.mkdir(exist_ok=True)
for n in ["b", "a", "c"]:
    (d / f"{n}.csv").write_text("v\\n1")
files = sorted(d.glob("*.csv"))
print([f.name for f in files])`,
      explain: "Urutan glob bergantung sistem file; selalu `sorted()` agar penggabungan data konsisten di semua komputer.",
    },
  ],
  bestPractices: [
    "Struktur folder tetap: data/raw, data/processed, models, submissions, notebooks.",
    "Jangan pernah menimpa data mentah.",
    "Beri versi pada setiap submission (`sub_v3_rf_kalender.csv`) dan catat skornya.",
    "Untuk dataset sangat besar, salin dulu dari Drive ke /content sebelum training (membaca dari /content lebih cepat).",
  ],
  exercises: [
    {
      id: "load-drive-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Path My Drive",
      prompt: "Lengkapi agar `p` menunjuk ke `train.csv` di folder `kompetisi` pada My Drive.",
      starter: `from pathlib import Path
p = Path("/content/drive/____/kompetisi/train.csv")
print(p)`,
      solution: `from pathlib import Path
p = Path("/content/drive/MyDrive/kompetisi/train.csv")
print(p)`,
      tests: [{ desc: "Path benar", expr: "str(p) == '/content/drive/MyDrive/kompetisi/train.csv'" }],
      hints: ["Konsep: akar My Drive di Colab.", "Tanpa spasi.", "`MyDrive`"],
      explanation: "My Drive dipetakan ke /content/drive/MyDrive.",
    },
    {
      id: "load-drive-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `from pathlib import Path
d = Path("/content/drive/MyDrive/latihan")
d.mkdir(parents=True, exist_ok=True)
for f in ["sub_v2.csv", "sub_v10.csv", "sub_v1.csv", "catatan.txt"]:
    (d / f).write_text("x")
print([f.name for f in sorted(d.glob("sub_*.csv"))])`,
      answer: "['sub_v1.csv', 'sub_v10.csv', 'sub_v2.csv']",
      hints: ["Konsep: glob + sorted (urutan teks).", "\"sub_v10\" < \"sub_v2\" secara teks.", "catatan.txt tidak cocok pola."],
      explanation: "['sub_v1.csv', 'sub_v10.csv', 'sub_v2.csv'] — pengurutan teks; gunakan nomor berangka nol seperti v01, v02, v10 agar terurut benar.",
    },
    {
      id: "load-drive-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Jangan timpa data mentah",
      prompt: "Kode menimpa `train.csv`. Perbaiki agar hasil bersih disimpan sebagai `train_clean.csv` di folder `processed`, dan `train.csv` tetap berisi 3 baris.",
      starter: `from pathlib import Path
import pandas as pd
base = Path("/content/drive/MyDrive/proyek")
(base / "raw").mkdir(parents=True, exist_ok=True)
pd.DataFrame({"x": [1, 1, 2]}).to_csv(base / "raw/train.csv", index=False)
df = pd.read_csv(base / "raw/train.csv").drop_duplicates()
df.to_csv(base / "raw/train.csv", index=False)
print(len(pd.read_csv(base / "raw/train.csv")))`,
      solution: `from pathlib import Path
import pandas as pd
base = Path("/content/drive/MyDrive/proyek")
(base / "raw").mkdir(parents=True, exist_ok=True)
pd.DataFrame({"x": [1, 1, 2]}).to_csv(base / "raw/train.csv", index=False)
df = pd.read_csv(base / "raw/train.csv").drop_duplicates()
(base / "processed").mkdir(parents=True, exist_ok=True)
df.to_csv(base / "processed/train_clean.csv", index=False)
print(len(pd.read_csv(base / "raw/train.csv")))`,
      tests: [
        { desc: "Data mentah utuh", expr: "len(pd.read_csv(base / 'raw/train.csv')) == 3" },
        { desc: "Data bersih tersimpan", expr: "len(pd.read_csv(base / 'processed/train_clean.csv')) == 2" },
      ],
      hints: ["Konsep: raw vs processed.", "Buat folder processed.", "Simpan dengan nama dan folder berbeda."],
      explanation: "Dengan data mentah utuh, setiap langkah cleaning bisa diulang atau diubah kapan saja.",
    },
    {
      id: "load-drive-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Simpan submission berversi",
      prompt: "Tulis fungsi `simpan_submission(df, folder, nama_model)` yang menyimpan `df` sebagai `sub_v{n:02d}_{nama_model}.csv` dengan `n` = jumlah file `sub_v*.csv` yang sudah ada + 1, lalu mengembalikan Path-nya. Panggil tiga kali dan cetak nama file.",
      starter: `from pathlib import Path
import pandas as pd
folder = Path("/content/drive/MyDrive/pm25/submissions")
folder.mkdir(parents=True, exist_ok=True)
for f in folder.glob("sub_v*.csv"):
    f.unlink()
sub = pd.DataFrame({"id": [1, 2], "pm25": [40.1, 45.3]})
# Tulis kodemu di sini
`,
      solution: `from pathlib import Path
import pandas as pd
folder = Path("/content/drive/MyDrive/pm25/submissions")
folder.mkdir(parents=True, exist_ok=True)
for f in folder.glob("sub_v*.csv"):
    f.unlink()
sub = pd.DataFrame({"id": [1, 2], "pm25": [40.1, 45.3]})

def simpan_submission(df, folder, nama_model):
    n = len(list(folder.glob("sub_v*.csv"))) + 1
    path = folder / f"sub_v{n:02d}_{nama_model}.csv"
    df.to_csv(path, index=False)
    return path

for m in ["baseline", "linreg", "rf"]:
    print(simpan_submission(sub, folder, m).name)`,
      tests: [
        { desc: "Nama berurutan", expr: "_lines == ['sub_v01_baseline.csv', 'sub_v02_linreg.csv', 'sub_v03_rf.csv']" },
        { desc: "Isi file benar", expr: "pd.read_csv(folder / 'sub_v03_rf.csv').equals(sub)" },
      ],
      hints: ["Konsep: versi otomatis.", "Hitung file yang ada dengan glob.", "Format `{n:02d}` → 01, 02, …"],
      explanation: "Nomor versi berangka nol menjaga urutan file benar saat diurutkan dan memudahkan tim melacak submission terbaik.",
    },
    {
      id: "load-drive-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Gabungkan data per kota dari Drive",
      prompt: [
        "Simulasikan folder Drive tim: dari `house_prices.csv` tulis satu file per kota ke `/content/drive/MyDrive/rumah/raw/<kota>.csv`.",
        "Lalu baca semua file dengan `sorted(glob(\"*.csv\"))`, tambahkan kolom `sumber_file` (nama file), gabungkan menjadi `gabung`, dan cetak jumlah file, `gabung.shape`, serta jumlah baris per `sumber_file`.",
      ],
      starter: `from pathlib import Path
import pandas as pd
df = pd.read_csv("house_prices.csv")
# Tulis kodemu di sini
`,
      solution: `from pathlib import Path
import pandas as pd
df = pd.read_csv("house_prices.csv")
raw = Path("/content/drive/MyDrive/rumah/raw")
raw.mkdir(parents=True, exist_ok=True)
for kota, sub in df.groupby("city"):
    sub.to_csv(raw / f"{kota}.csv", index=False)

files = sorted(raw.glob("*.csv"))
gabung = pd.concat([pd.read_csv(f).assign(sumber_file=f.name) for f in files], ignore_index=True)
print(len(files), gabung.shape)
print(gabung["sumber_file"].value_counts().sort_index().to_dict())`,
      tests: [
        { desc: "Satu file per kota", expr: "len(files) == df['city'].nunique()" },
        { desc: "Tidak ada baris hilang", expr: "gabung.shape == (len(df), df.shape[1] + 1)" },
        { desc: "sumber_file benar", expr: "(gabung['sumber_file'] == gabung['city'] + '.csv').all()" },
      ],
      hints: ["Konsep: tulis per kelompok, baca dengan glob.", "`pd.read_csv(f).assign(sumber_file=f.name)`", "concat semua dengan ignore_index=True."],
      explanation: "Kolom sumber_file menjaga jejak asal setiap baris — penting saat menelusuri data yang aneh kembali ke file aslinya.",
    },
  ],
  quiz: [
    { id: "load-drive-q1", type: "mcq", prompt: "Setelah `drive.mount(\"/content/drive\")`, isi My Drive berada di…", options: ["/drive", "/content/drive/MyDrive", "/content/MyDrive", "/home/drive"], answer: 1, explanation: "/content/drive/MyDrive." },
    { id: "load-drive-q2", type: "predict", prompt: "Apa outputnya?", code: `from pathlib import Path\nprint(Path("/content/drive/MyDrive/a/b.csv").relative_to("/content/drive/MyDrive"))`, options: ["/a/b.csv", "a/b.csv", "b.csv", "MyDrive/a/b.csv"], answer: 1, explanation: "Path relatif terhadap My Drive." },
    { id: "load-drive-q3", type: "tf", prompt: "File yang disimpan di /content/drive/MyDrive tetap ada setelah runtime Colab berakhir.", answer: true, explanation: "Disimpan di Google Drive." },
    { id: "load-drive-q4", type: "fill", prompt: "Mencari semua file .csv secara rekursif dalam folder: `folder.____(\"*.csv\")`", answer: ["rglob"], explanation: "rglob = recursive glob." },
    { id: "load-drive-q5", type: "case", prompt: "Folder kompetisi dibagikan rekan dan muncul di \"Shared with me\", tetapi path-nya tidak ditemukan di Colab. Solusinya?", options: ["Unduh semua file manual", "Tambahkan shortcut folder itu ke My Drive", "Ganti akun", "Gunakan /content"], answer: 1, explanation: "Shortcut membuat folder bersama muncul di MyDrive." },
  ],
  challenge: {
    id: "load-drive-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Inventaris folder data tim",
    prompt: [
      "Tulis fungsi `inventaris(folder)` yang menelusuri semua file `.csv` di dalam folder (rekursif) dan mengembalikan DataFrame berkolom `path` (relatif terhadap folder, teks), `baris`, `kolom`, dan `kb` (ukuran file, 1 desimal), terurut berdasarkan `path`.",
      "Siapkan struktur di starter, panggil fungsi, lalu cetak hasilnya dan total baris semua file.",
    ],
    starter: `from pathlib import Path
import pandas as pd
base = Path("/content/drive/MyDrive/inventaris")
(base / "raw").mkdir(parents=True, exist_ok=True)
(base / "processed").mkdir(parents=True, exist_ok=True)
pd.read_csv("iris.csv").to_csv(base / "raw/iris.csv", index=False)
pd.read_csv("student_scores.csv").to_csv(base / "raw/siswa.csv", index=False)
pd.read_csv("iris.csv").head(50).to_csv(base / "processed/iris_setosa.csv", index=False)
(base / "README.txt").write_text("bukan csv")
# Tulis kodemu di sini
`,
    solution: `from pathlib import Path
import pandas as pd
base = Path("/content/drive/MyDrive/inventaris")
(base / "raw").mkdir(parents=True, exist_ok=True)
(base / "processed").mkdir(parents=True, exist_ok=True)
pd.read_csv("iris.csv").to_csv(base / "raw/iris.csv", index=False)
pd.read_csv("student_scores.csv").to_csv(base / "raw/siswa.csv", index=False)
pd.read_csv("iris.csv").head(50).to_csv(base / "processed/iris_setosa.csv", index=False)
(base / "README.txt").write_text("bukan csv")

def inventaris(folder):
    baris = []
    for f in sorted(folder.rglob("*.csv")):
        df = pd.read_csv(f)
        baris.append({"path": str(f.relative_to(folder)), "baris": df.shape[0], "kolom": df.shape[1], "kb": round(f.stat().st_size / 1024, 1)})
    return pd.DataFrame(baris).sort_values("path", ignore_index=True)

inv = inventaris(base)
print(inv)
print("Total baris:", inv["baris"].sum())`,
    tests: [
      { desc: "3 file CSV", expr: "inventaris(base)['path'].tolist() == ['processed/iris_setosa.csv', 'raw/iris.csv', 'raw/siswa.csv']" },
      { desc: "Baris & kolom benar", expr: "inventaris(base)[['baris', 'kolom']].values.tolist() == [[50, 5], [150, 5], [30, 5]]" },
      { desc: "Kolom lengkap", expr: "inventaris(base).columns.tolist() == ['path', 'baris', 'kolom', 'kb']" },
    ],
    hints: ["Konsep: rglob + ringkasan setiap file.", "`f.relative_to(folder)` untuk path relatif.", "`f.stat().st_size` untuk ukuran byte."],
    explanation: "Inventaris otomatis membantu tim mengetahui file apa saja yang ada, ukurannya, dan versi mana yang sudah diproses — tanpa membuka satu per satu.",
  },
  summary: [
    "`drive.mount(\"/content/drive\")` menghubungkan Drive; My Drive ada di /content/drive/MyDrive.",
    "Drive permanen → simpan data, model, log, dan submission di sana.",
    "Gunakan struktur folder tetap dan jangan menimpa data mentah.",
    "`glob`/`rglob` + `sorted` untuk membaca banyak file; `mode=\"a\"` untuk log.",
  ],
  cheatsheet: [
    { syntax: "drive.mount(\"/content/drive\")", desc: "Mount (Colab)" },
    { syntax: "Path(\"/content/drive/MyDrive/proyek\")", desc: "Folder proyek" },
    { syntax: "sorted(p.glob(\"*.csv\"))", desc: "Banyak file" },
    { syntax: "df.to_csv(f, mode=\"a\", header=not f.exists())", desc: "Tambah ke log" },
    { syntax: "shutil.copy(src, dst)", desc: "Salin ke/dari Drive" },
  ],
  flashcards: [
    { q: "Path My Drive setelah mount di Colab", a: "/content/drive/MyDrive/" },
    { q: "Mengapa simpan submission di Drive?", a: "Drive permanen; /content hilang saat runtime berakhir" },
    { q: "Folder bersama tidak muncul di MyDrive. Solusi?", a: "Add shortcut to Drive" },
  ],
  references: [
    { source: "Google Colab (kode sumber resmi)", title: "googlecolab/colabtools — google/colab/drive.py (drive.mount & flush_and_unmount)", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/google/colab/drive.py" },
    { source: "Google Colab (repositori resmi)", title: "googlecolab/colabtools — README", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/README.md" },
    pyDoc("pathlib — Path.glob and Path.rglob", "library/pathlib.html"),
    pyDoc("shutil — High-level file operations", "library/shutil.html"),
  ],
};
