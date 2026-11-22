import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-reading-and-writing-files",
  title: "Reading and Writing Files",
  minutes: 50,
  prerequisites: ["py-for-loop", "py-error-handling", "py-importing-modules"],
  objectives: [
    "Membuka file dengan `open()` dan memahami mode `\"r\"`, `\"w\"`, `\"a\"`.",
    "Memakai `with` agar file selalu ditutup otomatis.",
    "Menulis teks ke file dan membacanya kembali (`write`, `read`, iterasi per baris).",
    "Membaca file CSV dengan modul `csv` (`reader` dan `DictReader`).",
    "Menyimpan dan memuat data terstruktur dengan modul `json`.",
  ],
  definition: [
    "Data biasanya tersimpan di **file**: CSV, TXT, JSON, Excel. Python membaca file dengan fungsi bawaan `open(nama_file, mode, encoding=...)` yang mengembalikan **file object**.",
    "**Mode** menentukan apa yang boleh dilakukan:\n- `\"r\"` (read, default) — membaca; error jika file tidak ada.\n- `\"w\"` (write) — menulis; **menimpa** isi lama, atau membuat file baru.\n- `\"a\"` (append) — menambah di akhir file tanpa menghapus isi lama.",
    "Statement **`with`** (context manager) membuka file dan **menutupnya otomatis** setelah blok selesai — bahkan jika terjadi error. Ini cara yang dianjurkan dokumentasi Python.",
    "Selalu sebutkan `encoding=\"utf-8\"` agar karakter non-ASCII (é, ñ, huruf beraksen, emoji) terbaca dengan benar di semua sistem operasi.",
    "Untuk format terstruktur, gunakan modul standar: `csv` untuk data tabel, `json` untuk data bersarang (dict/list). Di Module 04 kamu akan memakai `pd.read_csv()` yang jauh lebih praktis — tetapi memahami cara manual ini membuatmu paham apa yang dilakukan Pandas di balik layar.",
  ],
  why: [
    "Langkah pertama setiap proyek ML adalah **memuat data**. Kadang data tidak rapi (log, teks, JSON dari API) sehingga perlu dibaca secara manual sebelum menjadi DataFrame.",
    "Menyimpan hasil (log training, metrik, konfigurasi) ke file membuat eksperimen terdokumentasi dan bisa direproduksi.",
  ],
  when: [
    "- Membaca dataset atau file konfigurasi.",
    "- Menyimpan hasil eksperimen, log, atau prediksi.",
    "- Mengolah file teks baris per baris yang terlalu besar untuk dimuat sekaligus.",
  ],
  analogy: "Membuka file seperti **meminjam buku di perpustakaan**: kamu meminjam (open), membaca atau menulis catatan (read/write), lalu wajib mengembalikannya (close). Statement `with` adalah petugas yang otomatis mengembalikan buku untukmu ketika kamu selesai — kamu tidak mungkin lupa.",
  syntax: {
    code: `with open("file.txt", "w", encoding="utf-8") as f:
    f.write("teks\\n")

with open("file.txt", "r", encoding="utf-8") as f:
    isi = f.read()

import csv
with open("data.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        ...`,
  },
  anatomy: [
    ["open(nama, mode)", "Membuka file dan mengembalikan file object."],
    ["\"r\" / \"w\" / \"a\"", "Mode baca / tulis (menimpa) / tambah."],
    ["encoding=\"utf-8\"", "Cara karakter disimpan sebagai byte; UTF-8 adalah standar modern."],
    ["with ... as f:", "Context manager: `f` adalah file object; file ditutup otomatis di akhir blok."],
    ["f.write(teks)", "Menulis string. Tidak menambah baris baru otomatis — tulis `\\n` sendiri."],
    ["f.read()", "Membaca seluruh isi sebagai satu string."],
    ["for line in f:", "Membaca baris per baris (hemat memori)."],
    ["csv.DictReader(f)", "Membaca CSV; setiap baris menjadi dict {nama_kolom: nilai}."],
  ],
  examples: [
    {
      title: "Contoh 1 — Menulis lalu membaca file teks",
      code: `with open("catatan.txt", "w", encoding="utf-8") as f:
    f.write("Eksperimen 1: KNN\\n")
    f.write("Eksperimen 2: SVM\\n")

with open("catatan.txt", "r", encoding="utf-8") as f:
    isi = f.read()
print(isi)
print(type(isi).__name__, len(isi))`,
      output: "Eksperimen 1: KNN\nEksperimen 2: SVM\n\nstr 36",
      explain: [
        ["with open(\"catatan.txt\", \"w\", encoding=\"utf-8\") as f:", "Membuka (atau membuat) file untuk ditulis; isi lama akan ditimpa."],
        ["    f.write(\"Eksperimen 1: KNN\\n\")", "`\\n` adalah karakter baris baru — write tidak menambahkannya otomatis."],
        ["    isi = f.read()", "Membaca seluruh isi file menjadi satu string."],
        ["print(isi)", "Ada baris kosong ekstra karena isi diakhiri `\\n` dan print menambah `\\n` lagi."],
      ],
    },
    {
      title: "Contoh 2 — Mode append dan membaca per baris",
      code: `with open("log.txt", "w", encoding="utf-8") as f:
    f.write("epoch 1 loss 0.90\\n")

with open("log.txt", "a", encoding="utf-8") as f:
    f.write("epoch 2 loss 0.71\\n")
    f.write("epoch 3 loss 0.55\\n")

with open("log.txt", encoding="utf-8") as f:
    for nomor, baris in enumerate(f, start=1):
        print(nomor, baris.strip())`,
      output: "1 epoch 1 loss 0.90\n2 epoch 2 loss 0.71\n3 epoch 3 loss 0.55",
      explain: [
        ["with open(\"log.txt\", \"a\", encoding=\"utf-8\") as f:", "Mode `\"a\"` menambahkan di akhir tanpa menghapus baris pertama."],
        ["with open(\"log.txt\", encoding=\"utf-8\") as f:", "Mode default adalah `\"r\"`."],
        ["    for nomor, baris in enumerate(f, start=1):", "File object bisa di-loop baris per baris."],
        ["baris.strip()", "Menghapus `\\n` di akhir setiap baris."],
      ],
      change: "Kita memakai mode append dan membaca baris demi baris — pola untuk log training.",
    },
    {
      title: "Contoh 3 — Membaca CSV dengan csv.reader",
      intro: "File `data.csv` sudah tersedia di folder kerja editor (6 baris: Name, Age, City, Score).",
      code: `import csv

with open("data.csv", encoding="utf-8", newline="") as f:
    reader = csv.reader(f)
    header = next(reader)
    rows = list(reader)

print(header)
print(rows[0])
print("Jumlah baris data:", len(rows))
print(type(rows[0][1]).__name__)`,
      output: "['Name', 'Age', 'City', 'Score']\n['Andi', '21', 'Jakarta', '85']\nJumlah baris data: 6\nstr",
      explain: [
        ["newline=\"\"", "Dianjurkan dokumentasi modul csv saat membuka file CSV."],
        ["reader = csv.reader(f)", "Membuat pembaca CSV; setiap baris menjadi list string."],
        ["header = next(reader)", "`next()` mengambil satu baris berikutnya — di sini baris judul kolom."],
        ["rows = list(reader)", "Sisa baris dijadikan list of lists."],
        ["type(rows[0][1]).__name__", "Semua nilai dibaca sebagai **str**, termasuk umur — perlu konversi manual."],
      ],
      change: "Dari file teks bebas ke file tabel (CSV) memakai modul standar.",
    },
    {
      title: "Contoh 4 — csv.DictReader dan konversi tipe",
      code: `import csv

skor = []
with open("data.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        if row["City"] == "Jakarta":
            skor.append(int(row["Score"]))

print("Skor dari Jakarta:", skor)
print("Rata-rata:", sum(skor) / len(skor))`,
      output: "Skor dari Jakarta: [85, 88]\nRata-rata: 86.5",
      explain: [
        ["for row in csv.DictReader(f):", "Setiap baris menjadi dict, misalnya `{'Name': 'Andi', 'Age': '21', ...}`."],
        ["row[\"City\"] == \"Jakarta\"", "Akses berdasarkan nama kolom — lebih jelas daripada index."],
        ["int(row[\"Score\"])", "Konversi teks ke angka sebelum dihitung."],
      ],
      change: "Filter + agregasi manual. Di Pandas: `df[df[\"City\"] == \"Jakarta\"][\"Score\"].mean()`.",
    },
    {
      title: "Contoh 5 — Menyimpan dan memuat JSON",
      code: `import json

hasil = {"model": "KNN", "params": {"n_neighbors": 5}, "accuracy": 0.93}
with open("hasil.json", "w", encoding="utf-8") as f:
    json.dump(hasil, f, indent=2)

with open("hasil.json", encoding="utf-8") as f:
    dimuat = json.load(f)
print(dimuat["params"]["n_neighbors"], dimuat == hasil)

with open("hasil.json", encoding="utf-8") as f:
    print(f.read())`,
      output: "5 True\n{\n  \"model\": \"KNN\",\n  \"params\": {\n    \"n_neighbors\": 5\n  },\n  \"accuracy\": 0.93\n}",
      explain: [
        ["json.dump(hasil, f, indent=2)", "Menyimpan dictionary ke file JSON dengan indentasi 2 spasi agar mudah dibaca."],
        ["dimuat = json.load(f)", "Membaca JSON kembali menjadi dictionary Python."],
        ["dimuat == hasil", "Data kembali utuh."],
      ],
      change: "JSON cocok untuk menyimpan konfigurasi dan hasil eksperimen yang bersarang.",
    },
  ],
  params: [
    {
      title: "open(file, mode=\"r\", encoding=None, newline=None)",
      items: [
        { name: "file", type: "str", desc: "Nama/path file. Path relatif dihitung dari folder kerja." },
        { name: "mode", type: "str", default: "\"r\"", desc: "`\"r\"` baca, `\"w\"` tulis (menimpa), `\"a\"` tambah, `\"x\"` buat baru (error jika sudah ada), `\"b\"` mode biner." },
        { name: "encoding", type: "str", default: "tergantung OS", desc: "Gunakan `\"utf-8\"` agar konsisten di semua sistem." },
        { name: "newline", type: "str", default: "None", desc: "Untuk file CSV, dokumentasi modul csv menganjurkan `newline=\"\"`." },
      ],
    },
    {
      title: "Method file object",
      items: [
        { name: "f.read()", desc: "Seluruh isi sebagai string." },
        { name: "f.readline()", desc: "Satu baris berikutnya." },
        { name: "f.readlines()", desc: "List berisi semua baris (masih mengandung `\\n`)." },
        { name: "f.write(s)", desc: "Menulis string s; mengembalikan jumlah karakter yang ditulis." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `with open("x.txt", "w", encoding="utf-8") as f:\n    f.write("a\\nb\\nc\\n")\nwith open("x.txt", encoding="utf-8") as f:\n    print(f.readlines())`, output: "['a\\n', 'b\\n', 'c\\n']" },
  tryIt: `# File bawaan yang tersedia: data.csv, iris.csv, student_scores.csv, dll.
with open("student_scores.csv", encoding="utf-8") as f:
    for i, baris in enumerate(f):
        print(baris.strip())
        if i == 3:
            break`,
  mistakes: [
    {
      title: "File tidak ditemukan",
      wrong: `with open("dataset.csv", encoding="utf-8") as f:
    isi = f.read()`,
      error: "FileNotFoundError",
      fix: `with open("data.csv", encoding="utf-8") as f:
    isi = f.read()
print(len(isi) > 0)`,
      explain: "Periksa nama, ekstensi, dan folder. Di Playground, tekan **Files → Muat** untuk melihat file yang tersedia.",
    },
    {
      title: "Mode \"w\" menghapus isi lama",
      wrong: `with open("log.txt", "w", encoding="utf-8") as f:
    f.write("baris 1\\n")
with open("log.txt", "w", encoding="utf-8") as f:
    f.write("baris 2\\n")
print(open("log.txt", encoding="utf-8").read())   # baris 1 hilang`,
      fix: `with open("log.txt", "w", encoding="utf-8") as f:
    f.write("baris 1\\n")
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("baris 2\\n")
with open("log.txt", encoding="utf-8") as f:
    print(f.read())`,
      explain: "Gunakan `\"a\"` untuk menambahkan. Gunakan `\"w\"` hanya jika memang ingin menimpa.",
    },
    {
      title: "Menulis angka langsung",
      wrong: `with open("skor.txt", "w", encoding="utf-8") as f:
    f.write(0.93)`,
      error: "TypeError",
      fix: `with open("skor.txt", "w", encoding="utf-8") as f:
    f.write(str(0.93))`,
      explain: "`write()` hanya menerima string. Konversi dengan `str()` atau f-string.",
    },
    {
      title: "Membaca file setelah ditutup",
      wrong: `with open("data.csv", encoding="utf-8") as f:
    pass
print(f.read())`,
      error: "ValueError",
      fix: `with open("data.csv", encoding="utf-8") as f:
    isi = f.read()
print(isi[:4])`,
      explain: "Setelah blok `with` selesai, file sudah tertutup (*I/O operation on closed file*). Baca di dalam blok.",
    },
  ],
  bestPractices: [
    "Selalu gunakan `with open(...)` agar file pasti tertutup.",
    "Selalu tulis `encoding=\"utf-8\"`.",
    "Gunakan modul `csv`/`json` untuk format terstruktur — jangan memecah CSV dengan `split(\",\")` jika data bisa berisi koma di dalam tanda kutip.",
    "Untuk data tabel, gunakan `pd.read_csv()` (Module 04) yang menangani tipe data, missing value, dan pemisah secara otomatis.",
    "Simpan hasil eksperimen (parameter + metrik) ke JSON agar mudah dibandingkan nanti.",
  ],
  exercises: [
    {
      id: "py-file-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Mode tulis",
      prompt: "Lengkapi mode agar file `pesan.txt` dibuat dan berisi `Halo ML`, lalu dibaca kembali.",
      starter: `with open("pesan.txt", "____", encoding="utf-8") as f:
    f.write("Halo ML")

with open("pesan.txt", "____", encoding="utf-8") as f:
    print(f.read())`,
      solution: `with open("pesan.txt", "w", encoding="utf-8") as f:
    f.write("Halo ML")

with open("pesan.txt", "r", encoding="utf-8") as f:
    print(f.read())`,
      tests: [
        { desc: "Output 'Halo ML'", expr: "_lines == ['Halo ML']" },
        { desc: "File berisi 'Halo ML'", expr: "open('pesan.txt', encoding='utf-8').read() == 'Halo ML'" },
      ],
      hints: ["Konsep: mode file.", "Satu huruf untuk write, satu huruf untuk read.", "`\"w\"` lalu `\"r\"`"],
      explanation: "`\"w\"` membuat/menimpa file; `\"r\"` membaca.",
    },
    {
      id: "py-file-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `with open("t.txt", "w", encoding="utf-8") as f:
    f.write("A\\n")
with open("t.txt", "a", encoding="utf-8") as f:
    f.write("B\\n")
with open("t.txt", "w", encoding="utf-8") as f:
    f.write("C\\n")
with open("t.txt", encoding="utf-8") as f:
    print(len(f.readlines()))`,
      answer: "1",
      hints: ["Konsep: mode \"w\" menimpa.", "Setelah langkah ketiga, isi lama hilang.", "File hanya berisi \"C\\n\"."],
      explanation: "Mode \"w\" terakhir menimpa A dan B, sehingga hanya ada satu baris.",
    },
    {
      id: "py-file-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Menyimpan metrik",
      prompt: "Perbaiki kode agar menulis `accuracy=0.91` ke `metrik.txt` lalu mencetak isinya.",
      starter: `acc = 0.91
with open("metrik.txt", "w", encoding="utf-8") as f:
    f.write("accuracy=" + acc)
print(f.read())`,
      solution: `acc = 0.91
with open("metrik.txt", "w", encoding="utf-8") as f:
    f.write("accuracy=" + str(acc))
with open("metrik.txt", encoding="utf-8") as f:
    print(f.read())`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "File berisi 'accuracy=0.91'", expr: "open('metrik.txt', encoding='utf-8').read() == 'accuracy=0.91'" },
        { desc: "Output 'accuracy=0.91'", expr: "_lines == ['accuracy=0.91']" },
      ],
      hints: ["Konsep: write butuh string; file harus dibaca saat terbuka.", "Konversi acc dengan str(); buka ulang file dengan mode baca.", "Tambahkan blok `with open(\"metrik.txt\", encoding=\"utf-8\") as f:` untuk membaca."],
      explanation: "Dua kesalahan: str + float, dan membaca file yang sudah ditutup (serta dibuka dalam mode tulis).",
    },
    {
      id: "py-file-ex4",
      type: "code",
      kind: "dataset",
      level: 4,
      title: "Dataset Challenge — Rata-rata nilai siswa",
      prompt: [
        "Baca `student_scores.csv` dengan `csv.DictReader`. Kumpulkan kolom `final_score` (ubah ke int) ke list `scores`.",
        "Hitung `mean_score` (rata-rata) dan `n_lulus` (jumlah skor ≥ 75). Cetak `n=30 mean=… lulus=…` dengan mean 2 desimal.",
      ],
      starter: `import csv
scores = []
# Tulis kodemu di sini
`,
      solution: `import csv
scores = []
with open("student_scores.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        scores.append(int(row["final_score"]))
mean_score = sum(scores) / len(scores)
n_lulus = sum(1 for s in scores if s >= 75)
print(f"n={len(scores)} mean={mean_score:.2f} lulus={n_lulus}")`,
      tests: [
        { desc: "scores berisi 30 int", expr: "len(scores) == 30 and all(type(s) is int for s in scores)" },
        { desc: "mean_score sesuai data", expr: "(lambda rows: abs(mean_score - sum(int(r['final_score']) for r in rows) / len(rows)) < 1e-9)(list(__import__('csv').DictReader(open('student_scores.csv', encoding='utf-8'))))" },
        { desc: "n_lulus sesuai data", expr: "(lambda rows: n_lulus == sum(1 for r in rows if int(r['final_score']) >= 75))(list(__import__('csv').DictReader(open('student_scores.csv', encoding='utf-8'))))" },
        { desc: "Format output", expr: "len(_lines) == 1 and _lines[0].startswith('n=30 mean=') and ' lulus=' in _lines[0]" },
      ],
      hints: ["Konsep: membaca CSV + konversi + agregasi.", "`for row in csv.DictReader(f): scores.append(int(row[\"final_score\"]))`", "`n_lulus` bisa dihitung dengan loop + if atau `sum(1 for s in scores if s >= 75)`."],
      explanation: "Test menghitung jawaban langsung dari file, sehingga solusimu dinilai dari hasil, bukan dari teks kode.",
    },
    {
      id: "py-file-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Ringkasan Iris ke JSON",
      prompt: [
        "Baca `iris.csv` dan hitung jumlah sampel per spesies (kolom `species`) ke dict `counts`.",
        "Simpan `counts` ke `iris_counts.json` dengan `json.dump`, lalu muat kembali dan cetak hasilnya: `{'setosa': 50, 'versicolor': 50, 'virginica': 50}`.",
      ],
      starter: `import csv
import json
counts = {}
# Tulis kodemu di sini
`,
      solution: `import csv
import json
counts = {}
with open("iris.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        sp = row["species"]
        counts[sp] = counts.get(sp, 0) + 1

with open("iris_counts.json", "w", encoding="utf-8") as f:
    json.dump(counts, f)

with open("iris_counts.json", encoding="utf-8") as f:
    print(json.load(f))`,
      tests: [
        { desc: "counts benar", expr: "counts == {'setosa': 50, 'versicolor': 50, 'virginica': 50}" },
        { desc: "File JSON berisi counts", expr: "__import__('json').load(open('iris_counts.json', encoding='utf-8')) == counts" },
        { desc: "Output benar", expr: "_lines == [\"{'setosa': 50, 'versicolor': 50, 'virginica': 50}\"]" },
      ],
      hints: ["Konsep: DictReader + dict penghitung + json.dump/load.", "`counts[sp] = counts.get(sp, 0) + 1`", "`json.dump(counts, f)` dalam mode \"w\"."],
      explanation: "Dataset Iris seimbang: 50 sampel per kelas — informasi penting untuk memilih metrik evaluasi.",
    },
  ],
  quiz: [
    { id: "py-file-q1", type: "mcq", prompt: "Mode `open()` untuk menambahkan isi di akhir file tanpa menghapus isi lama adalah…", options: ["\"r\"", "\"w\"", "\"a\"", "\"x\""], answer: 2, explanation: "`\"a\"` = append." },
    { id: "py-file-q2", type: "tf", prompt: "Dengan `with open(...) as f:`, file otomatis ditutup ketika blok selesai.", answer: true, explanation: "Itulah fungsi context manager." },
    { id: "py-file-q3", type: "predict", prompt: "Apa outputnya?", code: `with open("n.txt", "w", encoding="utf-8") as f:\n    f.write("10\\n20\\n")\nwith open("n.txt", encoding="utf-8") as f:\n    print(sum(int(x) for x in f))`, options: ["30", "1020", "Error", "10\n20"], answer: 0, explanation: "`int(\"10\\n\")` berhasil karena spasi/newline di tepi diabaikan oleh int()." },
    { id: "py-file-q4", type: "fill", prompt: "Fungsi modul json untuk menyimpan dict ke file adalah `json.____(data, f)`", answer: ["dump"], explanation: "`json.dump` (ke file) vs `json.dumps` (ke string)." },
    { id: "py-file-q5", type: "case", prompt: "Saat membaca CSV dengan modul csv, kolom `Age` bertipe apa?", options: ["int", "float", "str", "Otomatis sesuai isi"], answer: 2, explanation: "Modul csv membaca semua nilai sebagai string. `pd.read_csv()` yang menebak tipe secara otomatis." },
  ],
  challenge: {
    id: "py-file-challenge",
    type: "code",
    kind: "dataset",
    level: 5,
    title: "Mini Challenge — Laporan churn per kontrak",
    prompt: [
      "Baca `customer_churn.csv` dengan `csv.DictReader`. Untuk setiap nilai `contract`, hitung jumlah pelanggan dan jumlah yang churn (kolom `churn` bernilai `\"1\"`).",
      "Simpan ke dict `laporan` dengan bentuk `{kontrak: {\"total\": n, \"churn\": m, \"rate\": m / n}}`.",
      "Tulis `laporan` ke `churn_report.json` (indent=2), lalu cetak setiap kontrak terurut alfabet dengan format `Month-to-month: 45.3% churn (n=...)` (rate 1 desimal).",
    ],
    starter: `import csv
import json
laporan = {}
# Tulis kodemu di sini
`,
    solution: `import csv
import json
laporan = {}
with open("customer_churn.csv", encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        k = row["contract"]
        if k not in laporan:
            laporan[k] = {"total": 0, "churn": 0}
        laporan[k]["total"] += 1
        if row["churn"] == "1":
            laporan[k]["churn"] += 1

for k in laporan:
    laporan[k]["rate"] = laporan[k]["churn"] / laporan[k]["total"]

with open("churn_report.json", "w", encoding="utf-8") as f:
    json.dump(laporan, f, indent=2)

for k in sorted(laporan):
    print(f"{k}: {laporan[k]['rate']:.1%} churn (n={laporan[k]['total']})")`,
    tests: [
      { desc: "Tiga jenis kontrak", expr: "sorted(laporan) == ['Month-to-month', 'One year', 'Two year']" },
      { desc: "Total sesuai jumlah baris data (403)", expr: "sum(v['total'] for v in laporan.values()) == 403" },
      { desc: "rate = churn / total", expr: "all(abs(v['rate'] - v['churn'] / v['total']) < 1e-12 for v in laporan.values())" },
      { desc: "Jumlah churn sesuai data", expr: "(lambda rows: all(laporan[k]['churn'] == sum(1 for r in rows if r['contract'] == k and r['churn'] == '1') for k in laporan))(list(__import__('csv').DictReader(open('customer_churn.csv', encoding='utf-8'))))" },
      { desc: "File JSON tersimpan", expr: "__import__('json').load(open('churn_report.json', encoding='utf-8')) == laporan" },
      { desc: "Output 3 baris diawali nama kontrak terurut", expr: "len(_lines) == 3 and _lines[0].startswith('Month-to-month: ') and _lines[2].startswith('Two year: ')" },
    ],
    hints: ["Konsep: DictReader + dict bersarang + json.", "Inisialisasi `laporan[k] = {\"total\": 0, \"churn\": 0}` saat kontrak pertama kali muncul.", "Setelah loop, hitung `rate` untuk setiap kontrak, lalu `json.dump`."],
    explanation: "Analisis seperti ini (churn rate per kategori) adalah bagian dari EDA bivariat. Di Pandas cukup: `df.groupby(\"contract\")[\"churn\"].mean()`.",
  },
  summary: [
    "`open(file, mode, encoding=\"utf-8\")`; mode `\"r\"` baca, `\"w\"` tulis-timpa, `\"a\"` tambah.",
    "Gunakan `with` agar file selalu ditutup otomatis.",
    "`f.read()`, `f.readlines()`, atau `for line in f:` untuk membaca; `f.write(str)` untuk menulis.",
    "Modul `csv`: `reader`/`DictReader`; semua nilai dibaca sebagai string.",
    "Modul `json`: `dump`/`load` untuk dict/list bersarang.",
  ],
  cheatsheet: [
    { syntax: 'with open("f.txt", "w", encoding="utf-8") as f:\n    f.write("teks\\n")', desc: "Tulis file" },
    { syntax: 'with open("f.txt", encoding="utf-8") as f:\n    isi = f.read()', desc: "Baca file" },
    { syntax: "for line in f:\n    line.strip()", desc: "Baca per baris" },
    { syntax: "csv.DictReader(f)", desc: "CSV → dict per baris" },
    { syntax: "json.dump(d, f, indent=2)", desc: "Simpan JSON" },
    { syntax: "json.load(f)", desc: "Muat JSON" },
  ],
  flashcards: [
    { q: "Buka file untuk ditulis dengan encoding UTF-8 (context manager)", a: 'with open("hasil.txt", "w", encoding="utf-8") as f:' },
    { q: "Baca CSV per baris sebagai dictionary", a: "for row in csv.DictReader(f):" },
    { q: "Simpan dictionary hasil ke file JSON", a: "json.dump(hasil, f, indent=2)" },
    { q: "Mode open untuk menambah isi di akhir file", a: '"a"' },
  ],
  references: [
    pyDoc("The Python Tutorial — 7.2 Reading and Writing Files", "tutorial/inputoutput.html#reading-and-writing-files"),
    pyDoc("The Python Tutorial — 7.2.1 Methods of File Objects", "tutorial/inputoutput.html#methods-of-file-objects"),
    pyDoc("The Python Tutorial — 7.2.2 Saving structured data with json", "tutorial/inputoutput.html#saving-structured-data-with-json"),
    pyDoc("csv — CSV File Reading and Writing", "library/csv.html"),
    pyDoc("Built-in Functions — open()", "library/functions.html#open"),
  ],
};
