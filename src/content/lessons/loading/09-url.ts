import type { Lesson } from "../../../types.ts";
import { pandasDoc, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-dataset-from-url",
  title: "Loading Dataset from URL",
  minutes: 35,
  prerequisites: ["load-loading-csv-files", "py-strings"],
  objectives: [
    "Membaca dataset langsung dari URL dengan `pd.read_csv(url)` di Jupyter/Colab.",
    "Mengubah tautan halaman GitHub dan Google Drive menjadi tautan file mentah (*raw/direct download*).",
    "Memahami bagian-bagian URL dengan `urllib.parse`.",
    "Menyimpan salinan lokal dan mencatat sumber agar analisis dapat direproduksi.",
  ],
  definition: [
    "`pd.read_csv` (juga `read_json`, `read_excel`) menerima **URL** http/https sebagai pengganti path. pandas mengunduh isi file lalu membacanya — praktis untuk dataset publik.",
    "URL harus menunjuk ke **file mentah**, bukan halaman web yang menampilkannya:\n- GitHub: `https://github.com/user/repo/blob/main/data.csv` adalah halaman HTML; versi mentahnya `https://raw.githubusercontent.com/user/repo/main/data.csv`\n- Google Drive: tautan berbagi `https://drive.google.com/file/d/<ID>/view` perlu diubah menjadi `https://drive.google.com/uc?id=<ID>` (file harus dibagikan \"siapa saja yang memiliki link\")",
    "Bagian URL: *scheme* (https), *netloc* (domain), *path*, dan *query* (`?id=...`). Modul `urllib.parse` memecah dan menyusun URL dengan benar.",
    "**Catatan situs ini**: Python di Playground berjalan di browser tanpa akses internet langsung. Contoh yang dijalankan di sini memakai salinan lokal dataset dan latihan manipulasi URL; kode `pd.read_csv(url)` di bagian sintaks dapat dijalankan apa adanya di Google Colab atau Jupyter.",
  ],
  why: [
    "Banyak dataset latihan dan riset dibagikan lewat URL (GitHub, repositori universitas, portal data pemerintah). Membaca langsung dari URL membuat notebook mudah dibagikan tanpa mengirim file.",
    "Namun data di URL bisa berubah atau hilang. Menyimpan salinan lokal beserta tanggal unduh dan sumbernya menjaga hasil tetap bisa direproduksi.",
  ],
  when: [
    "- Dataset publik di GitHub, UCI, atau portal open data.",
    "- Berbagi notebook yang memuat data sendiri.",
    "- Mengambil versi terbaru data yang diperbarui berkala.",
  ],
  analogy: "URL halaman GitHub seperti **etalase toko** yang memajang buku di balik kaca; URL raw adalah **buku itu sendiri** yang bisa kamu bawa pulang dan baca. pandas butuh bukunya, bukan etalasenya.",
  syntax: {
    code: `# Berjalan di Colab / Jupyter (butuh internet):
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
df = pd.read_csv(url)
df.to_csv("iris_lokal.csv", index=False)   # simpan salinan

from urllib.parse import urlparse
urlparse(url).netloc   # 'raw.githubusercontent.com'`,
  },
  anatomy: [
    ["pd.read_csv(url)", "Unduh + baca langsung."],
    ["raw.githubusercontent.com", "Domain file mentah GitHub."],
    ["drive.google.com/uc?id=...", "Unduhan langsung Google Drive."],
    ["urlparse(url)", "Memecah URL menjadi bagian-bagiannya."],
  ],
  examples: [
    {
      title: "Contoh 1 — Bagian-bagian URL",
      code: `from urllib.parse import urlparse, parse_qs

url = "https://archive.ics.uci.edu/static/public/53/iris.zip?versi=1&format=zip"
u = urlparse(url)
print("scheme:", u.scheme)
print("netloc:", u.netloc)
print("path  :", u.path)
print("query :", parse_qs(u.query))
print("nama file:", u.path.split("/")[-1])`,
      output: "scheme: https\nnetloc: archive.ics.uci.edu\npath  : /static/public/53/iris.zip\nquery : {'versi': ['1'], 'format': ['zip']}\nnama file: iris.zip",
      explain: [
        ["urlparse(url)", "Memecah URL secara benar (lebih aman daripada split manual)."],
        ["parse_qs(u.query)", "Query string → dictionary."],
        ["u.path.split(\"/\")[-1]", "Nama file dari path — berguna untuk menyimpan salinan lokal."],
      ],
    },
    {
      title: "Contoh 2 — Mengubah URL GitHub menjadi raw",
      code: `def github_ke_raw(url):
    if "raw.githubusercontent.com" in url:
        return url
    url = url.replace("https://github.com/", "https://raw.githubusercontent.com/")
    return url.replace("/blob/", "/", 1)

halaman = "https://github.com/mwaskom/seaborn-data/blob/master/iris.csv"
print(github_ke_raw(halaman))
print(github_ke_raw("https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv"))`,
      output: "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv\nhttps://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv",
      explain: [
        ["url.replace(\"https://github.com/\", \"https://raw.githubusercontent.com/\")", "Ganti domain halaman dengan domain file mentah."],
        ["url.replace(\"/blob/\", \"/\", 1)", "Hapus segmen /blob/ (hanya kemunculan pertama)."],
        ["if \"raw.githubusercontent.com\" in url:", "URL yang sudah raw dikembalikan apa adanya."],
      ],
      change: "Bukan membaca URL, tetapi memperbaiki URL agar bisa dibaca.",
    },
    {
      title: "Contoh 3 — Tautan berbagi Google Drive",
      code: `import re

def drive_ke_unduhan(url):
    cocok = re.search(r"/d/([A-Za-z0-9_-]+)", url) or re.search(r"[?&]id=([A-Za-z0-9_-]+)", url)
    if not cocok:
        raise ValueError("ID file tidak ditemukan")
    return f"https://drive.google.com/uc?id={cocok.group(1)}"

print(drive_ke_unduhan("https://drive.google.com/file/d/1AbC_dEf-123/view?usp=sharing"))
print(drive_ke_unduhan("https://drive.google.com/open?id=1XyZ987"))`,
      output: "https://drive.google.com/uc?id=1AbC_dEf-123\nhttps://drive.google.com/uc?id=1XyZ987",
      explain: [
        ["re.search(r\"/d/([A-Za-z0-9_-]+)\", url)", "Regex mengambil ID file dari pola /d/<ID>/."],
        ["or re.search(r\"[?&]id=([A-Za-z0-9_-]+)\", url)", "Format lain: ?id=<ID>."],
        ["f\"https://drive.google.com/uc?id={cocok.group(1)}\"", "Format unduhan langsung yang bisa dibaca pandas (file harus dibagikan publik)."],
      ],
      change: "Format tautan lain yang juga sering dipakai berbagi dataset.",
    },
    {
      title: "Contoh 4 — Pola \"unduh sekali, simpan lokal\"",
      code: `import os
from datetime import date
import pandas as pd

URL = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv"
LOKAL = "iris_cache.csv"

def muat(url, lokal):
    if os.path.exists(lokal):
        return pd.read_csv(lokal), "cache lokal"
    df = pd.read_csv(url)              # baris ini butuh internet (Colab/Jupyter)
    df.to_csv(lokal, index=False)
    return df, "unduhan baru"

# Di situs ini tidak ada internet, jadi kita siapkan cache dari salinan dataset yang sama:
pd.read_csv("iris.csv").to_csv(LOKAL, index=False)
df, asal = muat(URL, LOKAL)
print(df.shape, "dari", asal)
catatan = {"sumber": URL, "diunduh": str(date(2026, 1, 15)), "baris": len(df)}
print(catatan)`,
      output: "(150, 5) dari cache lokal\n{'sumber': 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/iris.csv', 'diunduh': '2026-01-15', 'baris': 150}",
      explain: [
        ["if os.path.exists(lokal):", "Jika salinan sudah ada, pakai itu — cepat dan stabil."],
        ["df = pd.read_csv(url)", "Hanya dijalankan saat cache belum ada (di Colab/Jupyter dengan internet)."],
        ["catatan = {\"sumber\": URL, ", "Catat sumber dan tanggal unduh untuk reproducibility."],
      ],
      change: "Membaca dari URL dibungkus dengan cache dan dokumentasi sumber.",
    },
  ],
  params: [
    {
      title: "Alat URL",
      items: [
        { name: "pd.read_csv(url, storage_options=None)", desc: "Membaca dari http/https (dan s3/gcs dengan library tambahan)." },
        { name: "urllib.parse.urlparse(url)", desc: "scheme, netloc, path, query." },
        { name: "urllib.parse.parse_qs(query)", desc: "Query string → dict." },
        { name: "urllib.parse.urljoin(base, rel)", desc: "Menggabungkan URL dasar dan path." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `from urllib.parse import urlparse, urljoin\nbase = "https://raw.githubusercontent.com/user/repo/main/"\nprint(urljoin(base, "data/train.csv"), urlparse(base).netloc)`, output: "https://raw.githubusercontent.com/user/repo/main/data/train.csv raw.githubusercontent.com" },
  tryIt: `from urllib.parse import urlparse

urls = [
    "https://github.com/mwaskom/seaborn-data/blob/master/tips.csv",
    "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv",
]
for u in urls:
    p = urlparse(u)
    print(p.netloc, "→", "file mentah" if p.netloc.startswith("raw.") else "halaman HTML")`,
  mistakes: [
    {
      title: "Memakai URL halaman GitHub (HTML)",
      wrong: `url = "https://github.com/mwaskom/seaborn-data/blob/master/iris.csv"
print("raw" in url)   # False → pd.read_csv akan membaca HTML, bukan CSV`,
      fix: `url = "https://github.com/mwaskom/seaborn-data/blob/master/iris.csv"
raw = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/")
print(raw)`,
      explain: "URL halaman mengembalikan HTML sehingga read_csv menghasilkan tabel aneh atau ParserError. Gunakan URL raw (tombol \"Raw\" di GitHub).",
    },
    {
      title: "Memecah URL dengan split manual",
      wrong: `url = "https://contoh.id/data.csv?token=abc"
print(url.split("/")[-1])   # 'data.csv?token=abc' — query ikut`,
      fix: `from urllib.parse import urlparse
url = "https://contoh.id/data.csv?token=abc"
print(urlparse(url).path.split("/")[-1])`,
      explain: "urlparse memisahkan path dan query dengan benar.",
    },
    {
      title: "ID Google Drive tidak ditemukan",
      wrong: `import re
url = "https://drive.google.com/drive/folders/abc"
print(re.search(r"/d/([A-Za-z0-9_-]+)", url).group(1))`,
      error: "AttributeError",
      fix: `import re
url = "https://drive.google.com/drive/folders/abc"
m = re.search(r"/d/([A-Za-z0-9_-]+)", url)
print(m.group(1) if m else "Bukan tautan file — ini folder")`,
      explain: "re.search mengembalikan None jika pola tidak cocok; selalu cek sebelum `.group()`. Tautan folder tidak bisa dibaca sebagai satu file.",
    },
  ],
  bestPractices: [
    "Gunakan URL file mentah (raw/direct download).",
    "Simpan salinan lokal dan catat URL + tanggal unduh.",
    "Untuk data penting, simpan juga versi yang dipakai (commit hash GitHub, nomor versi dataset).",
    "Jangan menaruh token/password di URL yang ikut dibagikan dalam notebook.",
  ],
  exercises: [
    {
      id: "load-url-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Domain URL",
      prompt: "Lengkapi agar `domain` berisi bagian domain dari URL.",
      starter: `from urllib.parse import urlparse
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv"
domain = urlparse(url).____
print(domain)`,
      solution: `from urllib.parse import urlparse
url = "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv"
domain = urlparse(url).netloc
print(domain)`,
      tests: [{ desc: "domain benar", expr: "domain == 'raw.githubusercontent.com'" }],
      hints: ["Konsep: bagian URL.", "Network location.", "`.netloc`"],
      explanation: "netloc = network location (domain).",
    },
    {
      id: "load-url-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `from urllib.parse import urlparse, parse_qs
u = urlparse("https://data.go.id/api/pm25.csv?kota=jakarta&tahun=2025")
print(u.path)
print(parse_qs(u.query)["kota"], u.path.split("/")[-1])`,
      answer: "/api/pm25.csv\n['jakarta'] pm25.csv",
      hints: ["Konsep: path dan query.", "parse_qs mengembalikan list untuk setiap kunci.", "Nama file = segmen terakhir path."],
      explanation: "/api/pm25.csv; ['jakarta'] pm25.csv.",
    },
    {
      id: "load-url-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — URL raw",
      prompt: "Fungsi `ke_raw` belum menghapus segmen `/blob/`. Perbaiki agar menghasilkan URL raw yang benar.",
      starter: `def ke_raw(url):
    return url.replace("https://github.com/", "https://raw.githubusercontent.com/")

print(ke_raw("https://github.com/user/repo/blob/main/data/train.csv"))`,
      solution: `def ke_raw(url):
    return url.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/", 1)

print(ke_raw("https://github.com/user/repo/blob/main/data/train.csv"))`,
      tests: [{ desc: "URL raw benar", expr: "ke_raw('https://github.com/user/repo/blob/main/data/train.csv') == 'https://raw.githubusercontent.com/user/repo/main/data/train.csv'" }],
      hints: ["Konsep: struktur URL raw.", "Segmen /blob/ tidak ada di URL raw.", "`.replace(\"/blob/\", \"/\", 1)`"],
      explanation: "URL raw: raw.githubusercontent.com/<user>/<repo>/<branch>/<path>.",
    },
    {
      id: "load-url-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Daftar URL dataset",
      prompt: "Diberikan `base` (URL folder raw) dan list `nama_file`. Buat dict `urls = {nama_tanpa_ekstensi: url_lengkap}` memakai `urljoin`. Cetak `urls`.",
      starter: `from urllib.parse import urljoin
base = "https://raw.githubusercontent.com/tim-kita/pm25-jakarta/main/data/"
nama_file = ["train.csv", "test.csv", "sample_submission.csv"]
# Tulis kodemu di sini
`,
      solution: `from urllib.parse import urljoin
base = "https://raw.githubusercontent.com/tim-kita/pm25-jakarta/main/data/"
nama_file = ["train.csv", "test.csv", "sample_submission.csv"]
urls = {f.rsplit(".", 1)[0]: urljoin(base, f) for f in nama_file}
print(urls)`,
      tests: [
        { desc: "Kunci benar", expr: "list(urls) == ['train', 'test', 'sample_submission']" },
        { desc: "URL benar", expr: "urls['test'] == 'https://raw.githubusercontent.com/tim-kita/pm25-jakarta/main/data/test.csv'" },
      ],
      hints: ["Konsep: menyusun URL.", "`urljoin(base, nama)`; base harus diakhiri \"/\".", "`f.rsplit(\".\", 1)[0]` membuang ekstensi."],
      explanation: "Menyimpan base URL di satu tempat memudahkan tim berganti sumber data.",
    },
    {
      id: "load-url-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Cache dataset UCI",
      prompt: [
        "Tulis fungsi `muat_dengan_cache(url, lokal, unduh)` — `unduh` adalah fungsi yang mengembalikan DataFrame dari URL (di Colab: `pd.read_csv`). Jika file `lokal` ada, baca dari sana; jika tidak, panggil `unduh(url)`, simpan ke `lokal`, lalu kembalikan. Kembalikan juga string asal (\"cache\"/\"unduh\").",
        "Uji dengan `unduh_palsu = lambda u: pd.read_csv(\"heart_disease.csv\")` (simulasi), panggil dua kali, dan cetak asal setiap panggilan.",
      ],
      starter: `import os
import pandas as pd
URL = "https://archive.ics.uci.edu/dataset/45/heart+disease"
if os.path.exists("heart_cache.csv"):
    os.remove("heart_cache.csv")
unduh_palsu = lambda u: pd.read_csv("heart_disease.csv")
# Tulis kodemu di sini
`,
      solution: `import os
import pandas as pd
URL = "https://archive.ics.uci.edu/dataset/45/heart+disease"
if os.path.exists("heart_cache.csv"):
    os.remove("heart_cache.csv")
unduh_palsu = lambda u: pd.read_csv("heart_disease.csv")

def muat_dengan_cache(url, lokal, unduh):
    if os.path.exists(lokal):
        return pd.read_csv(lokal), "cache"
    df = unduh(url)
    df.to_csv(lokal, index=False)
    return df, "unduh"

for _ in range(2):
    df, asal = muat_dengan_cache(URL, "heart_cache.csv", unduh_palsu)
    print(df.shape, asal)`,
      tests: [
        { desc: "Panggilan pertama unduh, kedua cache", expr: "_lines == ['(303, 14) unduh', '(303, 14) cache']" },
        { desc: "File cache tersimpan", expr: "os.path.exists('heart_cache.csv')" },
      ],
      hints: ["Konsep: cache lokal.", "Cek `os.path.exists(lokal)` dulu.", "Fungsi `unduh` dioper sebagai argumen (fungsi adalah objek)."],
      explanation: "Memisahkan fungsi unduh membuat kode bisa diuji tanpa internet — teknik yang sama dipakai di proyek profesional.",
    },
  ],
  quiz: [
    { id: "load-url-q1", type: "mcq", prompt: "URL mana yang bisa dibaca langsung oleh pd.read_csv sebagai CSV?", options: ["https://github.com/u/r/blob/main/d.csv", "https://raw.githubusercontent.com/u/r/main/d.csv", "https://github.com/u/r", "https://drive.google.com/drive/folders/x"], answer: 1, explanation: "URL raw berisi isi file." },
    { id: "load-url-q2", type: "predict", prompt: "Apa outputnya?", code: `from urllib.parse import urlparse\nprint(urlparse("https://a.com/x/y.csv?z=1").path)`, options: ["/x/y.csv?z=1", "/x/y.csv", "a.com", "y.csv"], answer: 1, explanation: "path tanpa query." },
    { id: "load-url-q3", type: "tf", prompt: "Dataset di URL publik dijamin tidak pernah berubah.", answer: false, explanation: "Data bisa diperbarui/dihapus; simpan salinan dan catat versinya." },
    { id: "load-url-q4", type: "fill", prompt: "Domain file mentah GitHub: raw.____.com", answer: ["githubusercontent"], explanation: "raw.githubusercontent.com." },
    { id: "load-url-q5", type: "case", prompt: "pd.read_csv(url_github) menghasilkan ratusan kolom aneh berisi tag HTML. Penyebabnya?", options: ["Delimiter salah", "URL halaman, bukan raw", "Encoding", "File terlalu besar"], answer: 1, explanation: "Yang terbaca adalah HTML halaman GitHub." },
  ],
  challenge: {
    id: "load-url-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Normalisasi tautan dataset",
    prompt: [
      "Tulis fungsi `normalisasi_url(url)` yang mengembalikan tuple `(jenis, url_unduhan)`:",
      "- GitHub halaman (`github.com/.../blob/...`) → (\"github\", URL raw)\n- GitHub raw → (\"github\", url apa adanya)\n- Google Drive file (`/file/d/<ID>` atau `?id=<ID>`) → (\"drive\", \"https://drive.google.com/uc?id=<ID>\")\n- URL lain yang path-nya diakhiri .csv/.json/.xlsx → (\"langsung\", url)\n- selain itu → `raise ValueError(\"Tidak dikenali: <url>\")`",
      "Uji pada list `contoh` di starter dan cetak hasilnya (tangkap ValueError).",
    ],
    starter: `contoh = [
    "https://github.com/mwaskom/seaborn-data/blob/master/penguins.csv",
    "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv",
    "https://drive.google.com/file/d/1AbCdE_f-9/view?usp=sharing",
    "https://archive.ics.uci.edu/static/public/186/winequality-red.csv",
    "https://www.kaggle.com/datasets/uciml/iris",
]
# Tulis kodemu di sini
`,
    solution: `import re
from urllib.parse import urlparse

contoh = [
    "https://github.com/mwaskom/seaborn-data/blob/master/penguins.csv",
    "https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv",
    "https://drive.google.com/file/d/1AbCdE_f-9/view?usp=sharing",
    "https://archive.ics.uci.edu/static/public/186/winequality-red.csv",
    "https://www.kaggle.com/datasets/uciml/iris",
]

def normalisasi_url(url):
    p = urlparse(url)
    if p.netloc == "raw.githubusercontent.com":
        return ("github", url)
    if p.netloc == "github.com" and "/blob/" in p.path:
        return ("github", url.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/", 1))
    if p.netloc == "drive.google.com":
        m = re.search(r"/d/([A-Za-z0-9_-]+)", url) or re.search(r"[?&]id=([A-Za-z0-9_-]+)", url)
        if m:
            return ("drive", f"https://drive.google.com/uc?id={m.group(1)}")
    if p.path.lower().endswith((".csv", ".json", ".xlsx")):
        return ("langsung", url)
    raise ValueError(f"Tidak dikenali: {url}")

for u in contoh:
    try:
        print(normalisasi_url(u))
    except ValueError as e:
        print("Error:", e)`,
    tests: [
      { desc: "GitHub halaman → raw", expr: "normalisasi_url(contoh[0]) == ('github', 'https://raw.githubusercontent.com/mwaskom/seaborn-data/master/penguins.csv')" },
      { desc: "Raw tetap", expr: "normalisasi_url(contoh[1]) == ('github', contoh[1])" },
      { desc: "Drive → uc?id", expr: "normalisasi_url(contoh[2]) == ('drive', 'https://drive.google.com/uc?id=1AbCdE_f-9')" },
      { desc: "Langsung & tidak dikenali", expr: "normalisasi_url(contoh[3])[0] == 'langsung' and _raises(normalisasi_url, contoh[4])[0] == 'ValueError'" },
    ],
    hints: ["Konsep: aturan berdasarkan domain dan path.", "`urlparse(url).netloc` untuk domain.", "Regex untuk ID Drive; cek ekstensi dengan `path.endswith((...))`."],
    explanation: "Halaman dataset Kaggle bukan file langsung — untuk Kaggle gunakan Kaggle API atau unduh manual (materi Introduction to Kaggle Datasets).",
  },
  summary: [
    "pd.read_csv/read_json/read_excel menerima URL file mentah (butuh internet: Colab/Jupyter).",
    "GitHub: gunakan raw.githubusercontent.com; Drive: drive.google.com/uc?id=<ID>.",
    "urllib.parse untuk memecah dan menyusun URL.",
    "Simpan salinan lokal dan catat sumber + tanggal unduh.",
  ],
  cheatsheet: [
    { syntax: "pd.read_csv(url_raw)", desc: "Baca dari URL" },
    { syntax: "url.replace(\"/blob/\", \"/\")", desc: "GitHub → raw (dengan ganti domain)" },
    { syntax: "f\"https://drive.google.com/uc?id={ID}\"", desc: "Drive unduhan langsung" },
    { syntax: "urlparse(url).netloc", desc: "Domain" },
    { syntax: "urljoin(base, \"train.csv\")", desc: "Susun URL" },
  ],
  flashcards: [
    { q: "Ubah github.com/u/r/blob/main/d.csv ke URL raw", a: "https://raw.githubusercontent.com/u/r/main/d.csv" },
    { q: "Mengapa menyimpan salinan lokal dataset dari URL?", a: "Data di URL bisa berubah/hilang; salinan menjaga reproducibility" },
    { q: "Ambil domain dari URL dengan Python", a: "urllib.parse.urlparse(url).netloc" },
  ],
  references: [
    pandasDoc("IO tools — Reading remote files", "user_guide/io.html#reading-remote-files"),
    pyDoc("urllib.parse — Parse URLs into components", "library/urllib.parse.html"),
    { source: "GitHub Docs", title: "Viewing and understanding files — raw file URLs", url: "https://docs.github.com/en/repositories/working-with-files/using-files/viewing-and-understanding-files" },
    { source: "Google Colaboratory", title: "External data: Local Files, Drive, Sheets, and Cloud Storage", url: "https://colab.research.google.com/notebooks/io.ipynb" },
  ],
};
