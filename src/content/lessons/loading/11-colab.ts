import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-dataset-in-google-colab",
  title: "Loading Dataset in Google Colab",
  minutes: 30,
  prerequisites: ["load-uploading-dataset", "load-loading-dataset-from-url"],
  objectives: [
    "Memahami lingkungan Google Colab: runtime, folder `/content`, dan sifatnya yang sementara.",
    "Memuat dataset di Colab dengan tiga cara: unggah file, URL, dan Google Drive.",
    "Menjalankan perintah shell (`!ls`, `!pip install`, `!wget`) dan magic command di sel notebook.",
    "Menulis kode yang berjalan baik di Colab maupun di komputer lokal (deteksi lingkungan dan path).",
  ],
  definition: [
    "**Google Colaboratory (Colab)** adalah layanan notebook Jupyter gratis dari Google yang berjalan di cloud. Setiap notebook terhubung ke **runtime** (mesin virtual) yang sudah berisi Python, pandas, scikit-learn, dan library populer lainnya, dengan opsi GPU/TPU.",
    "Folder kerja default adalah `/content`. Isi folder ini **sementara**: semua file hilang ketika runtime diputus, di-restart dari awal, atau habis waktu idle. Simpan file penting ke Google Drive.",
    "Cara memuat data di Colab:\n- **Unggah** — `from google.colab import files; files.upload()` atau panel Files di sisi kiri\n- **URL** — `pd.read_csv(url)` atau `!wget url`\n- **Google Drive** — `drive.mount(\"/content/drive\")` (materi berikutnya)\n- **Kaggle** — Kaggle API dengan token `kaggle.json`",
    "Sel diawali `!` menjalankan perintah shell Linux (`!ls`, `!pip install openpyxl`). Kode Colab-khusus (`google.colab`) tidak bisa berjalan di situs ini; contoh yang dijalankan di sini menyimulasikan struktur folder Colab dan pola kodenya, sedangkan kode Colab asli ditunjukkan di bagian sintaks.",
  ],
  why: [
    "Colab adalah tempat paling mudah bagi pemula dan tim kecil untuk menjalankan notebook ML tanpa instalasi — cocok untuk kompetisi bersama tiga orang karena notebook bisa dibagikan seperti Google Docs.",
    "Memahami bahwa /content bersifat sementara mencegah kehilangan hasil kerja (model, submission) setelah berjam-jam training.",
  ],
  when: [
    "- Belajar ML tanpa memasang Python di laptop.",
    "- Membutuhkan GPU gratis.",
    "- Berbagi notebook dengan rekan tim.",
    "- Mengerjakan kompetisi dengan data dari Kaggle/Drive.",
  ],
  analogy: "Runtime Colab seperti **meja di ruang belajar perpustakaan**: kamu bisa memakai semua fasilitasnya, tetapi saat waktu habis meja dibersihkan. Google Drive adalah **loker pribadimu** — barang penting harus disimpan di sana sebelum pergi.",
  syntax: {
    code: `# === Kode di bawah HANYA berjalan di Google Colab ===
# Cek lokasi dan isi folder
!pwd
!ls -lh /content

# Unggah file dari laptop
from google.colab import files
uploaded = files.upload()
df = pd.read_csv(next(iter(uploaded)))

# Unduh file dari internet ke /content
!wget -q https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv

# Instal library yang belum ada
!pip install -q openpyxl

# Unduh hasil (submission) ke laptop
files.download("submission.csv")`,
  },
  anatomy: [
    ["/content", "Folder kerja Colab (sementara)."],
    ["!perintah", "Menjalankan shell di sel notebook."],
    ["files.upload() / files.download(f)", "Unggah/unduh antara laptop dan runtime."],
    ["\"google.colab\" in sys.modules", "Mendeteksi apakah kode berjalan di Colab."],
  ],
  examples: [
    {
      title: "Contoh 1 — Mendeteksi lingkungan",
      code: `import sys
import platform

DI_COLAB = "google.colab" in sys.modules
print("Berjalan di Colab?", DI_COLAB)
print("Python:", platform.python_version())
print("Platform:", sys.platform)`,
      output: "Berjalan di Colab? False\nPython: 3.14.2\nPlatform: emscripten",
      explain: [
        ["\"google.colab\" in sys.modules", "Modul google.colab selalu dimuat di Colab — cara umum mendeteksi lingkungan."],
        ["sys.platform", "Di situs ini Python berjalan di browser (emscripten); di Colab hasilnya linux."],
      ],
    },
    {
      title: "Contoh 2 — Path yang bekerja di Colab dan lokal",
      code: `import sys
from pathlib import Path

DI_COLAB = "google.colab" in sys.modules
BASE = Path("/content") if DI_COLAB else Path(".")
DATA = BASE / "data"
OUTPUT = BASE / "output"
for folder in [DATA, OUTPUT]:
    folder.mkdir(parents=True, exist_ok=True)

print("Data   :", DATA)
print("Output :", OUTPUT)
print("Train  :", DATA / "train.csv")`,
      output: "Data   : data\nOutput : output\nTrain  : data/train.csv",
      explain: [
        ["BASE = Path(\"/content\") if DI_COLAB else Path(\".\")", "Satu variabel menentukan lokasi dasar sesuai lingkungan."],
        ["DATA / \"train.csv\"", "Operator / pada Path menyusun path dengan benar di semua OS."],
        ["mkdir(parents=True, exist_ok=True)", "Membuat folder jika belum ada, tanpa error jika sudah ada."],
      ],
      change: "Kode tidak lagi bergantung pada satu lingkungan.",
    },
    {
      title: "Contoh 3 — Simulasi struktur /content dan pola files.upload",
      code: `import io
from pathlib import Path
import pandas as pd

content = Path("/content")                 # di Colab folder ini sudah ada
content.mkdir(exist_ok=True)

# files.upload() di Colab mengembalikan {nama: bytes}; kita simulasikan:
uploaded = {"train.csv": Path("customer_churn.csv").read_bytes()}
for nama, isi in uploaded.items():
    (content / nama).write_bytes(isi)       # Colab juga menyimpan file ke /content
    print("Diunggah:", nama, len(isi), "byte")

df = pd.read_csv(content / "train.csv")
print(df.shape)
print(sorted(p.name for p in content.iterdir()))`,
      output: "Diunggah: train.csv 23102 byte\n(403, 10)\n['train.csv']",
      explain: [
        ["content = Path(\"/content\")", "Struktur folder yang sama dengan Colab (di Colab tidak perlu mkdir)."],
        ["uploaded = {\"train.csv\": ", "Bentuk hasil `files.upload()`."],
        ["(content / nama).write_bytes(isi)", "Colab menyimpan file unggahan di /content."],
      ],
      change: "Pola kode unggah Colab disimulasikan agar bisa dijalankan di sini.",
    },
    {
      title: "Contoh 4 — Simpan hasil sebelum runtime berakhir",
      code: `import time
from pathlib import Path
import pandas as pd

out = Path("/content/output")
out.mkdir(parents=True, exist_ok=True)
sub = pd.DataFrame({"id": [1, 2, 3], "pred": [0.12, 0.87, 0.45]})

versi = time.strftime("%Y%m%d", time.gmtime(0))   # di notebook: time.strftime("%Y%m%d_%H%M")
file = out / f"submission_{versi}.csv"
sub.to_csv(file, index=False)
print("Tersimpan:", file, file.stat().st_size, "byte")
# Di Colab lanjutkan dengan salah satu:
#   files.download(str(file))                       → unduh ke laptop
#   !cp {file} /content/drive/MyDrive/kompetisi/     → salin ke Google Drive`,
      output: "Tersimpan: /content/output/submission_19700101.csv 29 byte",
      explain: [
        ["f\"submission_{versi}.csv\"", "Beri versi/tanggal pada nama file agar tidak saling menimpa."],
        ["time.gmtime(0)", "Dipakai di sini agar output contoh selalu sama; di notebook gunakan waktu sekarang."],
        ["#   files.download(str(file))", "Dua cara menyelamatkan hasil dari /content yang sementara."],
      ],
      change: "Fokus pada menyimpan hasil, bukan memuat data.",
    },
  ],
  params: [
    {
      title: "Perintah Colab yang sering dipakai",
      items: [
        { name: "!ls, !pwd, !head -5 file.csv", desc: "Melihat file dan isi." },
        { name: "!pip install -q paket", desc: "Instal library." },
        { name: "!wget -q URL / !unzip -q file.zip", desc: "Unduh & ekstrak." },
        { name: "files.upload(), files.download(path)", desc: "Pertukaran file dengan laptop." },
        { name: "%%time, %timeit", desc: "Magic command untuk mengukur waktu." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `from pathlib import Path\nbase = Path("/content")\nprint(base / "data" / "train.csv", (base / "data" / "train.csv").suffix)`, output: "/content/data/train.csv .csv" },
  tryIt: `import sys
from pathlib import Path

DI_COLAB = "google.colab" in sys.modules
BASE = Path("/content") if DI_COLAB else Path(".")
print("Lingkungan:", "Colab" if DI_COLAB else "bukan Colab")
print("File CSV di BASE:", sorted(p.name for p in BASE.glob("*.csv"))[:5])`,
  mistakes: [
    {
      title: "Mengimpor google.colab di luar Colab",
      wrong: `from google.colab import files`,
      error: "ModuleNotFoundError",
      fix: `import sys
if "google.colab" in sys.modules:
    from google.colab import files
else:
    print("Bukan di Colab: taruh file di folder kerja dan baca dengan pd.read_csv")`,
      explain: "Modul google.colab hanya ada di Colab. Bungkus dengan pengecekan lingkungan agar notebook tetap jalan di tempat lain.",
    },
    {
      title: "Path Windows di notebook Colab",
      wrong: `import pandas as pd
df = pd.read_csv("C:/Users/ani/Downloads/train.csv")`,
      error: "FileNotFoundError",
      fix: `from pathlib import Path
print(Path("/content") / "train.csv")   # unggah dulu, lalu baca dari /content`,
      explain: "Colab berjalan di server Linux, bukan di laptopmu. File laptop harus diunggah dulu ke runtime atau Drive.",
    },
    {
      title: "Hasil hilang setelah runtime restart",
      wrong: `from pathlib import Path
Path("/content").mkdir(exist_ok=True)
Path("/content/model_terbaik.txt").write_text("skor=0.91")
print("Tersimpan hanya di /content — akan hilang saat runtime berakhir")`,
      fix: `from pathlib import Path
drive = Path("/content/drive/MyDrive/kompetisi")   # tersedia setelah drive.mount
drive.mkdir(parents=True, exist_ok=True)           # (disimulasikan di sini)
(drive / "model_terbaik.txt").write_text("skor=0.91")
print("Tersimpan di Drive:", drive / "model_terbaik.txt")`,
      explain: "Simpan model, submission, dan catatan eksperimen ke Google Drive, bukan hanya /content.",
    },
  ],
  bestPractices: [
    "Taruh semua path di satu sel konfigurasi (`BASE`, `DATA`, `OUTPUT`).",
    "Simpan hasil penting ke Drive secara berkala selama training panjang.",
    "Tulis versi library di awal notebook (`pd.__version__`, `sklearn.__version__`).",
    "Bagikan notebook ke rekan tim dengan akses \"Commenter/Editor\", tetapi jangan tempel token (kaggle.json) di sel notebook.",
  ],
  exercises: [
    {
      id: "load-colab-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Deteksi Colab",
      prompt: "Lengkapi agar `DI_COLAB` bernilai True hanya jika modul google.colab sudah dimuat.",
      starter: `import sys
DI_COLAB = "google.colab" in sys.____
print(DI_COLAB)`,
      solution: `import sys
DI_COLAB = "google.colab" in sys.modules
print(DI_COLAB)`,
      tests: [{ desc: "DI_COLAB boolean & False di sini", expr: "DI_COLAB is False" }],
      hints: ["Konsep: daftar modul yang sudah dimuat.", "Atribut sys berupa dictionary modul.", "`sys.modules`"],
      explanation: "sys.modules berisi semua modul yang sudah diimpor.",
    },
    {
      id: "load-colab-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `from pathlib import Path
p = Path("/content/drive/MyDrive/data/train.csv")
print(p.name, p.suffix, p.stem)
print(p.parent.name, p.parts[1])`,
      answer: "train.csv .csv train\ndata content",
      hints: ["Konsep: bagian path.", "name = nama file, stem = tanpa ekstensi.", "parts[0] adalah '/'."],
      explanation: "train.csv .csv train; data content.",
    },
    {
      id: "load-colab-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Impor yang aman",
      prompt: "Notebook ini harus bisa dijalankan di Colab maupun di luar Colab. Perbaiki agar tidak error di sini dan mencetak \"mode lokal\".",
      starter: `from google.colab import drive
drive.mount("/content/drive")
print("mode colab")`,
      solution: `import sys
if "google.colab" in sys.modules:
    from google.colab import drive
    drive.mount("/content/drive")
    print("mode colab")
else:
    print("mode lokal")`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Mencetak mode lokal", expr: "_lines == ['mode lokal']" },
      ],
      hints: ["Konsep: impor bersyarat.", "Cek lingkungan dengan sys.modules.", "Letakkan impor google.colab di dalam if."],
      explanation: "Pola ini membuat satu notebook bisa dipakai seluruh anggota tim di lingkungan berbeda.",
    },
    {
      id: "load-colab-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Konfigurasi path proyek",
      prompt: "Tulis fungsi `buat_path(di_colab)` yang mengembalikan dict `{\"data\": Path, \"output\": Path, \"model\": Path}` dengan base `/content/drive/MyDrive/pm25` jika di_colab True, atau `./pm25` jika False. Fungsi juga membuat ketiga folder. Uji dengan False dan cetak dict-nya sebagai string.",
      starter: `from pathlib import Path
# Tulis kodemu di sini
`,
      solution: `from pathlib import Path

def buat_path(di_colab):
    base = Path("/content/drive/MyDrive/pm25") if di_colab else Path("pm25")
    paths = {k: base / k for k in ["data", "output", "model"]}
    for p in paths.values():
        p.mkdir(parents=True, exist_ok=True)
    return paths

paths = buat_path(False)
print({k: str(v) for k, v in paths.items()})`,
      tests: [
        { desc: "Path lokal benar", expr: "{k: str(v) for k, v in buat_path(False).items()} == {'data': 'pm25/data', 'output': 'pm25/output', 'model': 'pm25/model'}" },
        { desc: "Folder dibuat", expr: "all(p.is_dir() for p in buat_path(False).values())" },
        { desc: "Path Colab benar", expr: "str(buat_path(True)['data']) == '/content/drive/MyDrive/pm25/data'" },
      ],
      hints: ["Konsep: satu sumber konfigurasi path.", "Path / \"nama\" untuk menyusun.", "`mkdir(parents=True, exist_ok=True)`"],
      explanation: "Dengan konfigurasi terpusat, berpindah dari laptop ke Colab hanya mengubah satu nilai.",
    },
    {
      id: "load-colab-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Siapkan folder kompetisi",
      prompt: [
        "Simulasikan persiapan kompetisi di `/content/kompetisi`: buat folder `data/`, salin `house_prices.csv` menjadi `data/train.csv` (`shutil.copy`), buat `data/test.csv` = 20 baris terakhir tanpa kolom `price_million`, dan `data/sample_submission.csv` berisi `house_id` test dan `price_million` = 0.",
        "Baca ketiganya, cetak shape masing-masing, dan pastikan kolom test = kolom train tanpa target (`assert`).",
      ],
      starter: `import shutil
from pathlib import Path
import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import shutil
from pathlib import Path
import pandas as pd
data = Path("/content/kompetisi/data")
data.mkdir(parents=True, exist_ok=True)
shutil.copy("house_prices.csv", data / "train.csv")
asli = pd.read_csv("house_prices.csv")
test = asli.tail(20).drop(columns="price_million")
test.to_csv(data / "test.csv", index=False)
pd.DataFrame({"house_id": test["house_id"], "price_million": 0}).to_csv(data / "sample_submission.csv", index=False)

train = pd.read_csv(data / "train.csv")
test = pd.read_csv(data / "test.csv")
sample = pd.read_csv(data / "sample_submission.csv")
assert test.columns.tolist() == train.drop(columns="price_million").columns.tolist()
print(train.shape, test.shape, sample.shape)`,
      tests: [
        { desc: "File tersedia", expr: "all((Path('/content/kompetisi/data') / f).exists() for f in ['train.csv', 'test.csv', 'sample_submission.csv'])" },
        { desc: "Shape benar", expr: "(train.shape, test.shape, sample.shape) == ((300, 8), (20, 7), (20, 2))" },
        { desc: "sample id = test id", expr: "(sample['house_id'] == test['house_id']).all()" },
      ],
      hints: ["Konsep: struktur file kompetisi.", "`Path(...).mkdir(parents=True, exist_ok=True)` lalu shutil.copy.", "Test = fitur tanpa target; sample = id + kolom prediksi."],
      explanation: "Struktur train/test/sample_submission adalah format standar hampir semua kompetisi Kaggle, termasuk kompetisi PM2.5.",
    },
  ],
  quiz: [
    { id: "load-colab-q1", type: "mcq", prompt: "Folder kerja default Google Colab adalah…", options: ["/home/colab", "/content", "C:/colab", "/drive"], answer: 1, explanation: "/content." },
    { id: "load-colab-q2", type: "predict", prompt: "Apa outputnya (di situs ini)?", code: `import sys\nprint("google.colab" in sys.modules)`, options: ["True", "False", "Error", "None"], answer: 1, explanation: "Bukan Colab → False." },
    { id: "load-colab-q3", type: "tf", prompt: "File di /content tetap ada setelah runtime Colab diputus dan dihubungkan ulang keesokan harinya.", answer: false, explanation: "/content bersifat sementara." },
    { id: "load-colab-q4", type: "fill", prompt: "Di sel Colab, perintah shell diawali tanda ____", answer: ["!"], explanation: "Contoh: !ls." },
    { id: "load-colab-q5", type: "case", prompt: "Tim bertiga bekerja di Colab. Di mana sebaiknya menyimpan train.csv dan hasil submission bersama?", options: ["/content masing-masing", "Folder Google Drive bersama yang di-mount", "Laptop salah satu anggota", "Di sel notebook sebagai teks"], answer: 1, explanation: "Drive bersifat permanen dan bisa dibagikan." },
  ],
  challenge: {
    id: "load-colab-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Loader lintas lingkungan",
    prompt: [
      "Tulis fungsi `cari_file(nama, lokasi)` yang mencari file `nama` di beberapa folder kandidat (list `lokasi`, urut prioritas) dan mengembalikan Path pertama yang ada; jika tidak ditemukan `raise FileNotFoundError` dengan pesan yang menyebut semua lokasi yang dicoba.",
      "Kandidat: `/content/drive/MyDrive/pm25/data`, `/content`, `/kaggle/input/pm25`, `.`. Uji dengan `iris.csv` (ada di `.`) dan `rahasia.csv` (tidak ada, tangkap errornya), lalu cetak hasil.",
    ],
    starter: `from pathlib import Path
LOKASI = ["/content/drive/MyDrive/pm25/data", "/content", "/kaggle/input/pm25", "."]
# Tulis kodemu di sini
`,
    solution: `from pathlib import Path
LOKASI = ["/content/drive/MyDrive/pm25/data", "/content", "/kaggle/input/pm25", "."]

def cari_file(nama, lokasi):
    for folder in lokasi:
        p = Path(folder) / nama
        if p.exists():
            return p
    raise FileNotFoundError(f"{nama} tidak ditemukan di: {', '.join(lokasi)}")

print(cari_file("iris.csv", LOKASI))
try:
    cari_file("rahasia.csv", LOKASI)
except FileNotFoundError as e:
    print("Error:", e)`,
    tests: [
      { desc: "iris.csv ditemukan", expr: "cari_file('iris.csv', LOKASI) == Path('iris.csv')" },
      { desc: "Prioritas dihormati", expr: "(Path('/content') / 'prioritas.txt').write_text('x') and cari_file('prioritas.txt', ['/content', '.']) == Path('/content/prioritas.txt')" },
      { desc: "Pesan error lengkap", expr: "_raises(cari_file, 'rahasia.csv', LOKASI) == ('FileNotFoundError', 'rahasia.csv tidak ditemukan di: /content/drive/MyDrive/pm25/data, /content, /kaggle/input/pm25, .')" },
    ],
    hints: ["Konsep: mencoba beberapa lokasi berurutan.", "Loop + `Path(folder) / nama` + `.exists()`.", "Gabungkan lokasi dengan `', '.join(lokasi)` di pesan error."],
    explanation: "Satu fungsi pencari file membuat notebook yang sama berjalan di Colab (Drive), Kaggle Notebook (/kaggle/input), dan laptop.",
  },
  summary: [
    "Colab = notebook Jupyter di cloud; folder kerja /content bersifat sementara.",
    "Muat data dengan files.upload(), URL (!wget / pd.read_csv), Drive, atau Kaggle API.",
    "`!` menjalankan shell; `\"google.colab\" in sys.modules` mendeteksi lingkungan.",
    "Gunakan konfigurasi path terpusat dan simpan hasil ke Drive.",
  ],
  cheatsheet: [
    { syntax: "from google.colab import files; files.upload()", desc: "Unggah (Colab)" },
    { syntax: "files.download(\"submission.csv\")", desc: "Unduh ke laptop (Colab)" },
    { syntax: "!wget -q URL", desc: "Unduh ke /content" },
    { syntax: "\"google.colab\" in sys.modules", desc: "Deteksi Colab" },
    { syntax: "BASE = Path(\"/content\") if DI_COLAB else Path(\".\")", desc: "Path lintas lingkungan" },
  ],
  flashcards: [
    { q: "Mengapa file di /content Colab bisa hilang?", a: "Runtime bersifat sementara; isi dihapus saat runtime berakhir/di-reset" },
    { q: "Instal library di sel Colab", a: "!pip install -q nama_paket" },
    { q: "Deteksi apakah notebook berjalan di Colab", a: "\"google.colab\" in sys.modules" },
  ],
  references: [
    { source: "Google Colab (repositori resmi)", title: "googlecolab/colabtools — README", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/README.md" },
    { source: "Google Colab (kode sumber resmi)", title: "googlecolab/colabtools — google/colab/files.py (files.upload & files.download)", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/google/colab/files.py" },
    { source: "Google Colab (kode sumber resmi)", title: "googlecolab/colabtools — google/colab/drive.py (drive.mount & flush_and_unmount)", url: "https://raw.githubusercontent.com/googlecolab/colabtools/main/google/colab/drive.py" },
    pyDoc("pathlib — Object-oriented filesystem paths", "library/pathlib.html"),
  ],
};
