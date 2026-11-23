import type { Lesson } from "../../../types.ts";

export const lesson: Lesson = {
  id: "load-introduction-to-kaggle-datasets",
  title: "Introduction to Kaggle Datasets",
  minutes: 35,
  prerequisites: ["load-loading-dataset-in-google-colab"],
  objectives: [
    "Mengenal Kaggle: Datasets, Competitions, Notebooks, dan Discussion.",
    "Membaca halaman dataset/kompetisi: deskripsi, file, lisensi, metrik evaluasi, dan aturan.",
    "Memahami struktur file kompetisi (train/test/sample_submission) dan path di Kaggle Notebook (`/kaggle/input`, `/kaggle/working`).",
    "Mengunduh data dengan Kaggle API dan memvalidasi file submission.",
  ],
  definition: [
    "**Kaggle** adalah platform komunitas data science milik Google yang menyediakan:\n- **Datasets** — ribuan dataset publik dengan halaman dokumentasi, lisensi, dan *usability score*\n- **Competitions** — tantangan dengan leaderboard; peserta mengirim prediksi untuk data test\n- **Notebooks** — lingkungan Jupyter gratis (CPU/GPU) yang bisa langsung membaca data Kaggle\n- **Discussion & Learn** — forum dan kursus singkat (Python, Pandas, Intro to ML, Feature Engineering)",
    "Kompetisi umumnya memberi:\n- `train.csv` — fitur + target untuk melatih model\n- `test.csv` — fitur saja; targetnya disembunyikan\n- `sample_submission.csv` — format file jawaban (id + kolom prediksi)\nSkor dihitung dengan **metrik evaluasi** yang tertulis di tab *Evaluation* (misalnya MAE, RMSE, AUC). Leaderboard publik dihitung dari sebagian test; leaderboard privat (final) dari sisanya.",
    "Di **Kaggle Notebook**, data yang ditambahkan ada di `/kaggle/input/<nama>/` (hanya-baca) dan hasil disimpan ke `/kaggle/working/` (folder output notebook).",
    "Di luar Kaggle (Colab/laptop), gunakan **Kaggle API** (`pip install kaggle`) dengan token `kaggle.json` dari halaman Settings akun. Contoh di situs ini menyimulasikan struktur folder Kaggle; perintah API ditunjukkan di bagian sintaks.",
  ],
  why: [
    "Kaggle adalah tempat terbaik untuk berlatih dengan data nyata dan masalah nyata, serta belajar dari notebook peserta lain.",
    "Kesalahan paling umum pemula di kompetisi bukan model yang lemah, melainkan format submission salah, metrik yang tidak dipahami, atau melanggar aturan (misalnya memakai data eksternal yang dilarang). Membaca halaman kompetisi dengan teliti mencegah semua itu.",
  ],
  when: [
    "- Mencari dataset latihan dengan dokumentasi dan lisensi jelas.",
    "- Mengikuti kompetisi (termasuk kompetisi kampus/komunitas di Kaggle).",
    "- Belajar teknik dari notebook dan diskusi peserta lain.",
  ],
  analogy: "Kompetisi Kaggle seperti **ujian dengan kunci jawaban tersembunyi**: train.csv adalah soal latihan beserta jawabannya, test.csv adalah soal ujian tanpa jawaban, dan sample_submission.csv adalah **lembar jawaban kosong** — jawaban yang ditulis di format lain tidak akan dinilai.",
  syntax: {
    code: `# === Kaggle API (di Colab/laptop, butuh internet & kaggle.json) ===
# !pip install -q kaggle
# !mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
# !kaggle competitions download -c nama-kompetisi
# !kaggle datasets download -d uciml/iris --unzip
# !kaggle competitions submit -c nama-kompetisi -f submission.csv -m "v1 baseline"

# === Di Kaggle Notebook ===
import pandas as pd
train = pd.read_csv("/kaggle/input/nama-kompetisi/train.csv")
sub.to_csv("/kaggle/working/submission.csv", index=False)`,
  },
  anatomy: [
    ["/kaggle/input/<nama>/", "Data yang ditambahkan ke notebook (read-only)."],
    ["/kaggle/working/", "Folder output notebook."],
    ["kaggle competitions download -c", "Unduh data kompetisi."],
    ["sample_submission.csv", "Format resmi jawaban."],
  ],
  examples: [
    {
      title: "Contoh 1 — Dataset di situs ini yang juga ada di Kaggle",
      code: `import pandas as pd

kaggle = pd.DataFrame([
    ("iris.csv", "uciml/iris"),
    ("heart_disease.csv", "cherngs/heart-disease-cleveland-uci"),
    ("winequality-red.csv", "uciml/red-wine-quality-cortez-et-al-2009"),
    ("adult_income.csv", "uciml/adult-census-income"),
    ("student_performance.csv", "uciml/student-alcohol-consumption"),
], columns=["file", "slug"])
kaggle["url"] = "https://www.kaggle.com/datasets/" + kaggle["slug"]
kaggle["perintah_api"] = "kaggle datasets download -d " + kaggle["slug"]
print(kaggle[["file", "url"]].to_string(index=False))
print(kaggle.loc[0, "perintah_api"])`,
      output: "                   file                                                                      url\n               iris.csv                               https://www.kaggle.com/datasets/uciml/iris\n      heart_disease.csv      https://www.kaggle.com/datasets/cherngs/heart-disease-cleveland-uci\n    winequality-red.csv https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009\n       adult_income.csv                https://www.kaggle.com/datasets/uciml/adult-census-income\nstudent_performance.csv        https://www.kaggle.com/datasets/uciml/student-alcohol-consumption\nkaggle datasets download -d uciml/iris",
      explain: [
        ["(\"iris.csv\", \"uciml/iris\")", "Slug dataset = <pemilik>/<nama-dataset> — bagian dari URL Kaggle."],
        ["\"https://www.kaggle.com/datasets/\" + kaggle[\"slug\"]", "URL halaman dataset."],
        ["\"kaggle datasets download -d \" + kaggle[\"slug\"]", "Perintah API untuk mengunduhnya di Colab/laptop."],
      ],
    },
    {
      title: "Contoh 2 — Simulasi struktur /kaggle/input",
      code: `from pathlib import Path
import pandas as pd

comp = Path("/kaggle/input/pm25-jakarta")
comp.mkdir(parents=True, exist_ok=True)
tgl_train = pd.date_range("2025-01-01", "2025-12-31", freq="D")
tgl_test = pd.date_range("2026-01-01", "2026-03-31", freq="D")
pd.DataFrame({"id": tgl_train.strftime("%Y-%m-%d"), "pm25": 40.0}).to_csv(comp / "train.csv", index=False)
pd.DataFrame({"id": tgl_test.strftime("%Y-%m-%d"), "libur": 0}).to_csv(comp / "test.csv", index=False)
pd.DataFrame({"id": tgl_test.strftime("%Y-%m-%d"), "pm25": 0}).to_csv(comp / "sample_submission.csv", index=False)

for f in sorted(comp.iterdir()):
    df = pd.read_csv(f)
    print(f"{f.name:22} {str(df.shape):10} {df.columns.tolist()}")`,
      output: "sample_submission.csv  (90, 2)    ['id', 'pm25']\ntest.csv               (90, 2)    ['id', 'libur']\ntrain.csv              (365, 2)   ['id', 'pm25']",
      explain: [
        ["comp = Path(\"/kaggle/input/pm25-jakarta\")", "Lokasi data di Kaggle Notebook (di sini disimulasikan)."],
        ["tgl_test = pd.date_range(\"2026-01-01\", \"2026-03-31\", freq=\"D\")", "90 hari periode prediksi."],
        ["for f in sorted(comp.iterdir()):", "Langkah pertama di setiap kompetisi: lihat semua file, shape, dan kolomnya."],
      ],
      change: "Dari daftar dataset ke struktur file kompetisi.",
    },
    {
      title: "Contoh 3 — Membandingkan train, test, dan sample submission",
      code: `from pathlib import Path
import pandas as pd

comp = Path("/kaggle/input/pm25-jakarta")         # file dari Contoh 2
comp.mkdir(parents=True, exist_ok=True)
tr, te = pd.date_range("2025-01-01", "2025-12-31"), pd.date_range("2026-01-01", "2026-03-31")
pd.DataFrame({"id": tr.strftime("%Y-%m-%d"), "pm25": 40.0}).to_csv(comp / "train.csv", index=False)
pd.DataFrame({"id": te.strftime("%Y-%m-%d"), "libur": 0}).to_csv(comp / "test.csv", index=False)
pd.DataFrame({"id": te.strftime("%Y-%m-%d"), "pm25": 0}).to_csv(comp / "sample_submission.csv", index=False)
train = pd.read_csv(comp / "train.csv")
test = pd.read_csv(comp / "test.csv")
sample = pd.read_csv(comp / "sample_submission.csv")

print("Kolom hanya di train:", sorted(set(train.columns) - set(test.columns)))
print("Kolom hanya di test :", sorted(set(test.columns) - set(train.columns)))
print("Target (kolom sample selain id):", [c for c in sample.columns if c != "id"])
print("id test == id sample?", test["id"].equals(sample["id"]))
print("Rentang train:", train["id"].min(), "s.d.", train["id"].max())
print("Rentang test :", test["id"].min(), "s.d.", test["id"].max())`,
      output: "Kolom hanya di train: ['pm25']\nKolom hanya di test : ['libur']\nTarget (kolom sample selain id): ['pm25']\nid test == id sample? True\nRentang train: 2025-01-01 s.d. 2025-12-31\nRentang test : 2026-01-01 s.d. 2026-03-31",
      explain: [
        ["set(train.columns) - set(test.columns)", "Kolom yang hanya ada di train biasanya target."],
        ["set(test.columns) - set(train.columns)", "Kolom yang hanya ada di test (misalnya kalender libur) harus dicari padanannya untuk train."],
        ["test[\"id\"].equals(sample[\"id\"])", "Urutan dan isi id submission harus sama dengan sample."],
        ["print(\"Rentang test :\", ", "Test berada SETELAH train → masalah forecasting; validasi harus berbasis waktu."],
      ],
      change: "Membaca \"aturan main\" langsung dari file.",
    },
    {
      title: "Contoh 4 — Membuat dan memvalidasi submission",
      code: `from pathlib import Path
import pandas as pd

comp = Path("/kaggle/input/pm25-jakarta")         # file dari Contoh 2
comp.mkdir(parents=True, exist_ok=True)
tr, te = pd.date_range("2025-01-01", "2025-12-31"), pd.date_range("2026-01-01", "2026-03-31")
pd.DataFrame({"id": tr.strftime("%Y-%m-%d"), "pm25": 40.0}).to_csv(comp / "train.csv", index=False)
pd.DataFrame({"id": te.strftime("%Y-%m-%d"), "libur": 0}).to_csv(comp / "test.csv", index=False)
pd.DataFrame({"id": te.strftime("%Y-%m-%d"), "pm25": 0}).to_csv(comp / "sample_submission.csv", index=False)
train = pd.read_csv(comp / "train.csv")
sample = pd.read_csv(comp / "sample_submission.csv")

sub = sample.copy()
sub["pm25"] = train["pm25"].median()          # baseline: median data latih

assert list(sub.columns) == list(sample.columns), "kolom berbeda"
assert len(sub) == len(sample), "jumlah baris berbeda"
assert sub["id"].equals(sample["id"]), "id/urutan berbeda"
assert sub["pm25"].notna().all(), "ada prediksi kosong"

out = Path("/kaggle/working")
out.mkdir(parents=True, exist_ok=True)
sub.to_csv(out / "submission.csv", index=False)
print(open(out / "submission.csv").read()[:60])
print("Valid ✔", sub.shape)`,
      output: "id,pm25\n2026-01-01,40.0\n2026-01-02,40.0\n2026-01-03,40.0\n2026\nValid ✔ (90, 2)",
      explain: [
        ["sub = sample.copy()", "Mulai dari sample_submission agar format pasti benar."],
        ["sub[\"pm25\"] = train[\"pm25\"].median()", "Baseline paling sederhana — skor ini menjadi patokan yang harus dikalahkan model."],
        ["assert sub[\"id\"].equals(sample[\"id\"])", "Empat pemeriksaan wajib sebelum submit."],
        ["out / \"submission.csv\"", "Di Kaggle Notebook, file di /kaggle/working bisa langsung disubmit."],
      ],
      change: "Siklus lengkap: baca → prediksi → validasi → simpan.",
    },
  ],
  params: [
    {
      title: "Bagian halaman kompetisi yang wajib dibaca",
      items: [
        { name: "Overview", desc: "Tujuan, periode, hadiah." },
        { name: "Data", desc: "Penjelasan file dan kolom." },
        { name: "Evaluation", desc: "Metrik (MAE, RMSE, AUC, …) dan format submission." },
        { name: "Rules", desc: "Batas submission per hari, data eksternal, ukuran tim, lisensi." },
        { name: "Leaderboard (public/private)", desc: "Skor publik dari sebagian test; peringkat final dari bagian privat." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `slug = "uciml/iris"\nprint("https://www.kaggle.com/datasets/" + slug)\nprint("kaggle datasets download -d " + slug + " --unzip")`, output: "https://www.kaggle.com/datasets/uciml/iris\nkaggle datasets download -d uciml/iris --unzip" },
  tryIt: `import pandas as pd

# Struktur khas data kompetisi: periksa kolom & bentuk
train = pd.read_csv("house_prices.csv")
test = train.tail(30).drop(columns="price_million")
print("train:", train.shape, "test:", test.shape)
print("target:", sorted(set(train.columns) - set(test.columns)))`,
  mistakes: [
    {
      title: "Menulis ke /kaggle/input",
      wrong: `from pathlib import Path
import pandas as pd
inp = Path("/kaggle/input/x"); inp.mkdir(parents=True, exist_ok=True)
pd.DataFrame({"id": [1], "y": [0]}).to_csv(inp / "submission.csv", index=False)
print("Di Kaggle asli: OSError Read-only file system")`,
      fix: `from pathlib import Path
import pandas as pd
out = Path("/kaggle/working"); out.mkdir(parents=True, exist_ok=True)
pd.DataFrame({"id": [1], "y": [0]}).to_csv(out / "submission.csv", index=False)
print(sorted(p.name for p in out.iterdir()))`,
      explain: "/kaggle/input bersifat hanya-baca di Kaggle Notebook. Simpan semua output ke /kaggle/working.",
    },
    {
      title: "Urutan id submission berbeda",
      wrong: `import pandas as pd
sample = pd.DataFrame({"id": [3, 1, 2], "y": 0})
sub = pd.DataFrame({"id": [1, 2, 3], "y": [0.1, 0.2, 0.3]})
print(sub["id"].equals(sample["id"]))   # False → baris tertukar`,
      fix: `import pandas as pd
sample = pd.DataFrame({"id": [3, 1, 2], "y": 0})
pred = pd.DataFrame({"id": [1, 2, 3], "y": [0.1, 0.2, 0.3]})
sub = sample[["id"]].merge(pred, on="id", how="left")
print(sub["id"].equals(sample["id"]), sub["y"].tolist())`,
      explain: "Selaraskan prediksi dengan urutan sample_submission menggunakan merge (bukan menempel array begitu saja).",
    },
    {
      title: "Kolom index ikut tersimpan",
      wrong: `import pandas as pd
sub = pd.DataFrame({"id": [1, 2], "y": [0.5, 0.7]})
sub.to_csv("submission.csv")
print(open("submission.csv").readline().strip())   # ",id,y" → ditolak`,
      fix: `import pandas as pd
sub = pd.DataFrame({"id": [1, 2], "y": [0.5, 0.7]})
sub.to_csv("submission.csv", index=False)
print(open("submission.csv").readline().strip())`,
      explain: "Header harus persis sama dengan sample_submission; gunakan index=False.",
    },
  ],
  bestPractices: [
    "Baca tab Overview, Data, Evaluation, dan Rules sebelum menulis kode.",
    "Buat baseline sederhana (mean/median) dan submit lebih dulu untuk memastikan format benar.",
    "Selalu mulai submission dari salinan sample_submission.",
    "Jangan membagikan kaggle.json; simpan sebagai rahasia (Colab Secrets) dan jangan di-commit ke GitHub.",
  ],
  exercises: [
    {
      id: "load-kaggle-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — URL dataset Kaggle",
      prompt: "Lengkapi agar `url` menjadi URL halaman dataset dari slug.",
      starter: `slug = "uciml/adult-census-income"
url = "https://www.kaggle.com/____/" + slug
print(url)`,
      solution: `slug = "uciml/adult-census-income"
url = "https://www.kaggle.com/datasets/" + slug
print(url)`,
      tests: [{ desc: "URL benar", expr: "url == 'https://www.kaggle.com/datasets/uciml/adult-census-income'" }],
      hints: ["Konsep: struktur URL Kaggle.", "Segmen sebelum slug.", "`datasets`"],
      explanation: "Halaman dataset: kaggle.com/datasets/<pemilik>/<nama>.",
    },
    {
      id: "load-kaggle-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
train = pd.DataFrame({"id": [1, 2], "luas": [50, 70], "harga": [500, 700]})
test = pd.DataFrame({"id": [3, 4, 5], "luas": [60, 80, 90]})
print(sorted(set(train.columns) - set(test.columns)))
print(len(test), test.columns.tolist())`,
      answer: "['harga']\n3 ['id', 'luas']",
      hints: ["Konsep: target hanya ada di train.", "Selisih himpunan kolom.", "test punya 3 baris."],
      explanation: "['harga']; 3 ['id', 'luas'].",
    },
    {
      id: "load-kaggle-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Submission salah format",
      prompt: "Perbaiki agar `submission.csv` memiliki header persis `id,pm25`.",
      starter: `import pandas as pd
sample = pd.DataFrame({"id": ["2026-01-01", "2026-01-02"], "pm25": 0})
sub = sample.copy()
sub["pm25"] = [41.2, 44.8]
sub.to_csv("submission.csv")
header = open("submission.csv").readline().strip()
print(header)`,
      solution: `import pandas as pd
sample = pd.DataFrame({"id": ["2026-01-01", "2026-01-02"], "pm25": 0})
sub = sample.copy()
sub["pm25"] = [41.2, 44.8]
sub.to_csv("submission.csv", index=False)
header = open("submission.csv").readline().strip()
print(header)`,
      tests: [{ desc: "Header benar", expr: "header == 'id,pm25'" }],
      hints: ["Konsep: index ikut tersimpan.", "Matikan penulisan index.", "`index=False`"],
      explanation: "Header \",id,pm25\" akan ditolak sistem penilaian.",
    },
    {
      id: "load-kaggle-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Validator submission",
      prompt: "Tulis fungsi `validasi(sub, sample)` yang mengembalikan list pesan error (kosong jika valid): \"kolom berbeda\", \"jumlah baris berbeda\", \"id berbeda\", \"ada NaN\". Periksa berurutan; jika kolom atau jumlah baris berbeda, langsung kembalikan pesan itu. Uji pada submission valid dan tidak valid.",
      starter: `import numpy as np
import pandas as pd
sample = pd.DataFrame({"id": [10, 11, 12], "y": 0.0})
baik = sample.assign(y=[0.2, 0.4, 0.6])
buruk = pd.DataFrame({"id": [10, 12, 11], "y": [0.2, np.nan, 0.6]})
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
sample = pd.DataFrame({"id": [10, 11, 12], "y": 0.0})
baik = sample.assign(y=[0.2, 0.4, 0.6])
buruk = pd.DataFrame({"id": [10, 12, 11], "y": [0.2, np.nan, 0.6]})

def validasi(sub, sample):
    if list(sub.columns) != list(sample.columns):
        return ["kolom berbeda"]
    if len(sub) != len(sample):
        return ["jumlah baris berbeda"]
    pesan = []
    if not sub["id"].reset_index(drop=True).equals(sample["id"].reset_index(drop=True)):
        pesan.append("id berbeda")
    if sub.isna().any().any():
        pesan.append("ada NaN")
    return pesan

print(validasi(baik, sample))
print(validasi(buruk, sample))`,
      tests: [
        { desc: "Valid → []", expr: "validasi(baik, sample) == []" },
        { desc: "id & NaN terdeteksi", expr: "validasi(buruk, sample) == ['id berbeda', 'ada NaN']" },
        { desc: "Kolom berbeda", expr: "validasi(baik.rename(columns={'y': 'pred'}), sample) == ['kolom berbeda']" },
        { desc: "Baris berbeda", expr: "validasi(baik.head(2), sample) == ['jumlah baris berbeda']" },
      ],
      hints: ["Konsep: pemeriksaan sebelum submit.", "Return lebih awal untuk kolom/baris.", "Bandingkan id dengan `.equals` setelah reset_index."],
      explanation: "Validator ini sebaiknya dijalankan otomatis sebelum setiap submission.",
    },
    {
      id: "load-kaggle-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Baseline untuk data bergaya kompetisi",
      prompt: [
        "Dari `customer_churn.csv` buat `train` = 300 baris pertama, `test` = sisanya tanpa kolom `churn`, dan `sample` = DataFrame `customer_id` test + `churn` = 0.",
        "Buat dua baseline: `sub_mayoritas` (semua prediksi = kelas terbanyak di train) dan `sub_kontrak` (prediksi = 1 jika `contract` == \"Month-to-month\" selain 0). Validasi keduanya punya kolom & id yang sama dengan sample, lalu cetak proporsi prediksi 1 masing-masing.",
      ],
      starter: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
df = pd.read_csv("customer_churn.csv")
train = df.iloc[:300]
test = df.iloc[300:].drop(columns="churn")
sample = pd.DataFrame({"customer_id": test["customer_id"].values, "churn": 0})

mayoritas = train["churn"].mode()[0]
sub_mayoritas = sample.assign(churn=mayoritas)
sub_kontrak = sample.assign(churn=(test["contract"].values == "Month-to-month").astype(int))
for s in [sub_mayoritas, sub_kontrak]:
    assert list(s.columns) == list(sample.columns) and s["customer_id"].equals(sample["customer_id"])
print(sub_mayoritas["churn"].mean(), round(sub_kontrak["churn"].mean(), 3))`,
      tests: [
        { desc: "Ukuran benar", expr: "len(sample) == len(df) - 300 and list(sample.columns) == ['customer_id', 'churn']" },
        { desc: "Baseline mayoritas", expr: "(sub_mayoritas['churn'] == df.iloc[:300]['churn'].mode()[0]).all()" },
        { desc: "Baseline kontrak", expr: "(sub_kontrak['churn'].values == (df.iloc[300:]['contract'].values == 'Month-to-month').astype(int)).all()" },
      ],
      hints: ["Konsep: baseline sederhana.", "`train[\"churn\"].mode()[0]` = kelas terbanyak.", "Gunakan `.values` agar tidak terjadi penyelarasan index."],
      explanation: "Baseline aturan sederhana sering sudah cukup kuat; model ML harus terbukti mengalahkannya pada validasi.",
    },
  ],
  quiz: [
    { id: "load-kaggle-q1", type: "mcq", prompt: "File yang berisi fitur tanpa target pada kompetisi Kaggle?", options: ["train.csv", "test.csv", "sample_submission.csv", "README"], answer: 1, explanation: "Target test disembunyikan." },
    { id: "load-kaggle-q2", type: "predict", prompt: "Apa outputnya?", code: `from pathlib import Path\nprint(Path("/kaggle/input/pm25/train.csv").parts[2])`, options: ["kaggle", "input", "pm25", "train.csv"], answer: 1, explanation: "parts = ('/', 'kaggle', 'input', 'pm25', 'train.csv')." },
    { id: "load-kaggle-q3", type: "tf", prompt: "Peringkat akhir kompetisi Kaggle ditentukan oleh leaderboard publik.", answer: false, explanation: "Peringkat final dari leaderboard privat." },
    { id: "load-kaggle-q4", type: "fill", prompt: "Di Kaggle Notebook, output disimpan di folder `/kaggle/____`", answer: ["working"], explanation: "/kaggle/working." },
    { id: "load-kaggle-q5", type: "case", prompt: "Tab Evaluation menyebut metrik MAE. Apa implikasinya untuk baseline?", options: ["Gunakan mean", "Median adalah baseline konstan terbaik untuk MAE", "Gunakan nilai maksimum", "Tidak ada pengaruh"], answer: 1, explanation: "Konstanta yang meminimalkan MAE adalah median." },
  ],
  challenge: {
    id: "load-kaggle-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Laporan awal kompetisi",
    prompt: [
      "Tulis fungsi `laporan_kompetisi(folder)` yang membaca `train.csv`, `test.csv`, dan `sample_submission.csv` dari folder dan mengembalikan dict:",
      "- `shape`: dict {nama_file: shape}\n- `target`: list kolom di sample selain kolom pertama (id)\n- `fitur_hanya_test`: kolom yang ada di test tetapi tidak di train\n- `id_cocok`: apakah id test sama dengan id sample\n- `missing_train`: dict {kolom: jumlah NaN} hanya untuk kolom yang punya NaN",
      "Uji pada folder simulasi di starter dan cetak hasilnya.",
    ],
    starter: `from pathlib import Path
import numpy as np
import pandas as pd
comp = Path("/kaggle/input/latihan-rumah")
comp.mkdir(parents=True, exist_ok=True)
df = pd.read_csv("house_prices.csv")
df.loc[[3, 10], "age_years"] = np.nan
df.iloc[:250].to_csv(comp / "train.csv", index=False)
df.iloc[250:].drop(columns="price_million").assign(promo=0).to_csv(comp / "test.csv", index=False)
pd.DataFrame({"house_id": df.iloc[250:]["house_id"], "price_million": 0}).to_csv(comp / "sample_submission.csv", index=False)
# Tulis kodemu di sini
`,
    solution: `from pathlib import Path
import numpy as np
import pandas as pd
comp = Path("/kaggle/input/latihan-rumah")
comp.mkdir(parents=True, exist_ok=True)
df = pd.read_csv("house_prices.csv")
df.loc[[3, 10], "age_years"] = np.nan
df.iloc[:250].to_csv(comp / "train.csv", index=False)
df.iloc[250:].drop(columns="price_million").assign(promo=0).to_csv(comp / "test.csv", index=False)
pd.DataFrame({"house_id": df.iloc[250:]["house_id"], "price_million": 0}).to_csv(comp / "sample_submission.csv", index=False)

def laporan_kompetisi(folder):
    folder = Path(folder)
    train = pd.read_csv(folder / "train.csv")
    test = pd.read_csv(folder / "test.csv")
    sample = pd.read_csv(folder / "sample_submission.csv")
    id_col = sample.columns[0]
    na = train.isna().sum()
    return {
        "shape": {"train": train.shape, "test": test.shape, "sample": sample.shape},
        "target": list(sample.columns[1:]),
        "fitur_hanya_test": sorted(set(test.columns) - set(train.columns)),
        "id_cocok": test[id_col].equals(sample[id_col]),
        "missing_train": {k: int(v) for k, v in na[na > 0].items()},
    }

for k, v in laporan_kompetisi(comp).items():
    print(k, ":", v)`,
    tests: [
      { desc: "shape benar", expr: "laporan_kompetisi(comp)['shape'] == {'train': (250, 8), 'test': (50, 8), 'sample': (50, 2)}" },
      { desc: "target & fitur_hanya_test", expr: "laporan_kompetisi(comp)['target'] == ['price_million'] and laporan_kompetisi(comp)['fitur_hanya_test'] == ['promo']" },
      { desc: "id cocok & missing", expr: "laporan_kompetisi(comp)['id_cocok'] is True and laporan_kompetisi(comp)['missing_train'] == {'age_years': 2}" },
    ],
    hints: ["Konsep: membaca aturan main dari file.", "Kolom pertama sample = id.", "Filter Series NaN: `na[na > 0]`."],
    explanation: "Laporan seperti ini sebaiknya menjadi sel pertama notebook kompetisi — langsung terlihat target, fitur khusus test (seperti kalender libur di kompetisi PM2.5), dan masalah data.",
  },
  summary: [
    "Kaggle: Datasets, Competitions, Notebooks, Discussion, Learn.",
    "Kompetisi: train (fitur+target), test (fitur), sample_submission (format jawaban); baca Evaluation & Rules.",
    "Kaggle Notebook: /kaggle/input (read-only), /kaggle/working (output). Di luar Kaggle: Kaggle API + kaggle.json.",
    "Mulai submission dari sample_submission, validasi, lalu kirim baseline lebih dulu.",
  ],
  cheatsheet: [
    { syntax: "kaggle datasets download -d owner/name --unzip", desc: "Unduh dataset" },
    { syntax: "kaggle competitions download -c nama", desc: "Unduh data kompetisi" },
    { syntax: "pd.read_csv(\"/kaggle/input/<nama>/train.csv\")", desc: "Baca di Kaggle Notebook" },
    { syntax: "sub.to_csv(\"/kaggle/working/submission.csv\", index=False)", desc: "Simpan submission" },
    { syntax: "set(train.columns) - set(test.columns)", desc: "Temukan target" },
  ],
  flashcards: [
    { q: "Tiga file standar kompetisi Kaggle", a: "train.csv, test.csv, sample_submission.csv" },
    { q: "Folder output Kaggle Notebook", a: "/kaggle/working" },
    { q: "Baseline konstan terbaik untuk metrik MAE", a: "Median target data latih" },
  ],
  references: [
    { source: "Kaggle", title: "Kaggle Datasets documentation", url: "https://www.kaggle.com/docs/datasets" },
    { source: "Kaggle", title: "Kaggle Competitions documentation", url: "https://www.kaggle.com/docs/competitions" },
    { source: "Kaggle", title: "Kaggle Notebooks documentation", url: "https://www.kaggle.com/docs/notebooks" },
    { source: "Kaggle", title: "Kaggle API documentation (official command line tool)", url: "https://www.kaggle.com/docs/api" },
  ],
};
