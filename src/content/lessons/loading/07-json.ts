import type { Lesson } from "../../../types.ts";
import { pandasDoc, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-json-files",
  title: "Loading JSON Files",
  minutes: 40,
  prerequisites: ["load-loading-csv-files", "py-dictionary"],
  objectives: [
    "Memahami struktur JSON: object (dictionary), array (list), dan nesting.",
    "Membaca JSON dengan `pd.read_json` untuk format records dan JSON Lines (`lines=True`).",
    "Meratakan JSON bersarang menjadi tabel dengan `pd.json_normalize` (`record_path`, `meta`).",
    "Memakai modul `json` Python untuk memeriksa dan menyimpan data.",
  ],
  definition: [
    "**JSON** (*JavaScript Object Notation*) adalah format teks untuk data terstruktur, sangat umum pada **API web**. Bentuk dasarnya: object `{\"kunci\": nilai}` (seperti dictionary Python) dan array `[...]` (seperti list). Nilai bisa bersarang (nested).",
    "Bentuk JSON tabular yang sering ditemui:\n- **records**: array of objects `[{\"kota\": \"Jakarta\", \"pm25\": 55}, ...]` — setiap object = satu baris\n- **JSON Lines (.jsonl)**: satu object JSON per baris file — umum untuk log dan data besar\n- **nested**: object yang berisi list/object lain (misalnya satu stasiun berisi daftar pengukuran harian)",
    "`pd.read_json` membaca JSON yang sudah berbentuk tabel. Untuk data bersarang gunakan `json.load` lalu `pd.json_normalize`, yang meratakan field bersarang menjadi kolom seperti `lokasi.lat`.",
    "Di pandas 3, teks JSON literal harus dibungkus `io.StringIO(teks)`; memberikan string JSON langsung ke `read_json` tidak lagi didukung (dulu berstatus deprecated).",
  ],
  why: [
    "Data kualitas udara, cuaca, media sosial, dan transaksi aplikasi biasanya tersedia lewat API yang mengembalikan JSON. Mengubahnya menjadi DataFrame adalah langkah pertama analisis.",
    "Banyak dataset modern (misalnya dataset teks/NLP) disimpan sebagai JSON Lines karena mudah diproses baris demi baris.",
  ],
  when: [
    "- Data dari API web.",
    "- File konfigurasi atau metadata dataset.",
    "- Log aplikasi dalam format JSON Lines.",
    "- Data bersarang yang perlu diratakan menjadi tabel.",
  ],
  analogy: "JSON seperti **kotak bertingkat**: satu kotak \"stasiun\" berisi label nama dan lokasi, plus kotak-kotak kecil berisi pengukuran harian. `json_normalize` membongkar semua kotak kecil itu dan menyusunnya menjadi satu tabel rapi, sambil menempelkan label stasiun di setiap baris.",
  syntax: {
    code: `import io, json
import pandas as pd

pd.read_json("data.json")                      # records / array of objects
pd.read_json("data.jsonl", lines=True)         # JSON Lines
pd.read_json(io.StringIO(teks_json))           # dari teks

with open("nested.json") as f:
    data = json.load(f)
pd.json_normalize(data, record_path="harian", meta=["stasiun"])`,
  },
  anatomy: [
    ["json.load(f) / json.loads(teks)", "JSON → objek Python (dict/list)."],
    ["pd.read_json(..., lines=True)", "Satu object per baris."],
    ["pd.json_normalize(data)", "Field bersarang → kolom bertitik."],
    ["record_path / meta", "List bersarang yang menjadi baris / field induk yang disalin."],
  ],
  examples: [
    {
      title: "Contoh 1 — JSON records",
      code: `import io
import json
import pandas as pd

teks = '[{"kota": "Jakarta", "pm25": 55.2, "aman": false}, {"kota": "Bandung", "pm25": 28.4, "aman": true}]'
data = json.loads(teks)
print(type(data).__name__, type(data[0]).__name__, data[0]["kota"])

df = pd.read_json(io.StringIO(teks))
print(df)
print(df.dtypes.astype(str).to_dict())`,
      output: "list dict Jakarta\n      kota  pm25   aman\n0  Jakarta  55.2  False\n1  Bandung  28.4   True\n{'kota': 'str', 'pm25': 'float64', 'aman': 'bool'}",
      explain: [
        ["json.loads(teks)", "JSON → list of dict Python; false menjadi False."],
        ["pd.read_json(io.StringIO(teks))", "Setiap object menjadi satu baris; tipe dikenali dari JSON (angka, boolean)."],
      ],
    },
    {
      title: "Contoh 2 — JSON Lines dan menyimpan JSON",
      code: `import pandas as pd

df = pd.read_csv("student_scores.csv").head(3)
df.to_json("siswa.jsonl", orient="records", lines=True)
print(open("siswa.jsonl").read())

baca = pd.read_json("siswa.jsonl", lines=True)
print(baca.shape, baca.equals(df))`,
      output: "{\"student_id\":\"S001\",\"hours_studied\":8.0,\"attendance\":97,\"previous_score\":70,\"final_score\":96}\n{\"student_id\":\"S002\",\"hours_studied\":4.9,\"attendance\":90,\"previous_score\":87,\"final_score\":89}\n{\"student_id\":\"S003\",\"hours_studied\":8.7,\"attendance\":75,\"previous_score\":88,\"final_score\":95}\n\n(3, 5) True",
      explain: [
        ["to_json(\"siswa.jsonl\", orient=\"records\", lines=True)", "Menyimpan satu object per baris."],
        ["pd.read_json(\"siswa.jsonl\", lines=True)", "Membaca kembali JSON Lines."],
        ["baca.equals(df)", "Data kembali utuh (round-trip)."],
      ],
      change: "Format per baris, ditulis dan dibaca ulang.",
    },
    {
      title: "Contoh 3 — JSON bersarang dari API",
      code: `import json
import pandas as pd

respons = {
    "sumber": "API kualitas udara (simulasi)",
    "stasiun": [
        {"id": "DKI1", "lokasi": {"lat": -6.18, "lon": 106.83},
         "harian": [{"tanggal": "2025-01-01", "pm25": 55.2}, {"tanggal": "2025-01-02", "pm25": 47.9}]},
        {"id": "DKI2", "lokasi": {"lat": -6.24, "lon": 106.80},
         "harian": [{"tanggal": "2025-01-01", "pm25": 61.0}]},
    ],
}
with open("respons.json", "w") as f:
    json.dump(respons, f)

with open("respons.json") as f:
    data = json.load(f)
print(pd.json_normalize(data["stasiun"])[["id", "lokasi.lat", "lokasi.lon"]])

harian = pd.json_normalize(data["stasiun"], record_path="harian", meta=["id", ["lokasi", "lat"]])
print(harian)`,
      output: "     id  lokasi.lat  lokasi.lon\n0  DKI1       -6.18      106.83\n1  DKI2       -6.24      106.80\n      tanggal  pm25    id lokasi.lat\n0  2025-01-01  55.2  DKI1      -6.18\n1  2025-01-02  47.9  DKI1      -6.18\n2  2025-01-01  61.0  DKI2      -6.24",
      explain: [
        ["json.dump(respons, f)", "Simulasi file respons API (di dunia nyata didapat dari requests)."],
        ["pd.json_normalize(data[\"stasiun\"])", "Object bersarang lokasi diratakan menjadi lokasi.lat dan lokasi.lon."],
        ["record_path=\"harian\", meta=[\"id\", [\"lokasi\", \"lat\"]]", "Setiap pengukuran harian menjadi satu baris; id dan lokasi.lat disalin dari induknya."],
      ],
      change: "Data bersarang diratakan menjadi tabel.",
    },
    {
      title: "Contoh 4 — Dari JSON ke analisis",
      code: `import json
import pandas as pd

data = {"stasiun": [   # isi yang sama dengan respons.json di Contoh 3
    {"id": "DKI1", "harian": [{"tanggal": "2025-01-01", "pm25": 55.2}, {"tanggal": "2025-01-02", "pm25": 47.9}]},
    {"id": "DKI2", "harian": [{"tanggal": "2025-01-01", "pm25": 61.0}]},
]}
harian = pd.json_normalize(data["stasiun"], record_path="harian", meta=["id"])
harian["tanggal"] = pd.to_datetime(harian["tanggal"])
pivot = harian.pivot_table(index="tanggal", columns="id", values="pm25")
print(pivot)
print("Rata-rata per stasiun:", harian.groupby("id")["pm25"].mean().round(2).to_dict())
harian.to_csv("harian.csv", index=False)
print(open("harian.csv").read())`,
      output: "id          DKI1  DKI2\ntanggal               \n2025-01-01  55.2  61.0\n2025-01-02  47.9   NaN\nRata-rata per stasiun: {'DKI1': 51.55, 'DKI2': 61.0}\ntanggal,pm25,id\n2025-01-01,55.2,DKI1\n2025-01-02,47.9,DKI1\n2025-01-01,61.0,DKI2",
      explain: [
        ["pd.to_datetime(harian[\"tanggal\"])", "JSON tidak punya tipe tanggal; teks harus dikonversi."],
        ["pivot_table(index=\"tanggal\", columns=\"id\", values=\"pm25\")", "Satu baris per tanggal, satu kolom per stasiun; DKI2 tidak punya data 2 Januari → NaN."],
        ["harian.to_csv(\"harian.csv\", index=False)", "Simpan hasil rata sebagai CSV untuk dipakai ulang."],
      ],
      change: "Data JSON siap dianalisis dan disimpan.",
    },
  ],
  params: [
    {
      title: "Fungsi JSON",
      items: [
        { name: "pd.read_json(path_or_buf, orient=None, lines=False, dtype=None)", desc: "Membaca JSON berbentuk tabel." },
        { name: "df.to_json(path, orient=\"records\", lines=False, date_format=\"iso\")", desc: "Menyimpan JSON." },
        { name: "pd.json_normalize(data, record_path=None, meta=None, sep=\".\")", desc: "Meratakan JSON bersarang." },
        { name: "json.load(f), json.loads(s), json.dump(obj, f), json.dumps(obj, indent=2)", desc: "Modul json standar Python." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import io\nimport pandas as pd\ndf = pd.read_json(io.StringIO('{"a": 1, "b": 2}\\n{"a": 3, "b": 4}'), lines=True)\nprint(df.shape, df["b"].sum())`, output: "(2, 2) 6" },
  tryIt: `import json
import pandas as pd

data = [{"nama": "Ani", "kontak": {"email": "ani@contoh.id", "kota": "Bogor"}, "nilai": [80, 90]},
        {"nama": "Budi", "kontak": {"email": "budi@contoh.id", "kota": "Depok"}, "nilai": [70]}]
print(json.dumps(data[0], indent=2))
print(pd.json_normalize(data))`,
  mistakes: [
    {
      title: "Memberi string JSON langsung ke read_json",
      wrong: `import pandas as pd
print(pd.read_json('[{"a": 1}]'))`,
      error: "FileNotFoundError",
      fix: `import io
import pandas as pd
print(pd.read_json(io.StringIO('[{"a": 1}]')))`,
      explain: "Di pandas 3, string dianggap path file. Bungkus teks JSON dengan `io.StringIO`.",
    },
    {
      title: "JSON Lines tanpa lines=True",
      wrong: `import io
import pandas as pd
teks = '{"a": 1}\\n{"a": 2}'
print(pd.read_json(io.StringIO(teks)))`,
      error: "ValueError",
      fix: `import io
import pandas as pd
teks = '{"a": 1}\\n{"a": 2}'
print(pd.read_json(io.StringIO(teks), lines=True))`,
      explain: "*Trailing data* — beberapa object berurutan adalah JSON Lines; gunakan `lines=True`.",
    },
    {
      title: "Kutip tunggal bukan JSON valid",
      wrong: `import json
print(json.loads("{'a': 1}"))`,
      error: "JSONDecodeError",
      fix: `import json
print(json.loads('{"a": 1}'))`,
      explain: "JSON wajib memakai tanda kutip ganda untuk string dan kunci. Teks dengan kutip tunggal adalah representasi dict Python, bukan JSON.",
    },
  ],
  bestPractices: [
    "Lihat struktur JSON dulu (`json.dumps(obj, indent=2)` atau `obj.keys()`).",
    "Gunakan `json_normalize` dengan `record_path` dan `meta` untuk data bersarang.",
    "Konversi kolom tanggal setelah membaca JSON.",
    "Simpan hasil yang sudah diratakan ke CSV/Parquet agar tidak perlu memproses ulang.",
  ],
  exercises: [
    {
      id: "load-json-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — JSON Lines",
      prompt: "Lengkapi agar file JSON Lines terbaca menjadi 3 baris.",
      starter: `import pandas as pd
with open("log.jsonl", "w") as f:
    f.write('{"user": "a", "klik": 3}\\n{"user": "b", "klik": 5}\\n{"user": "a", "klik": 1}\\n')
df = pd.read_json("log.jsonl", ____=True)
print(df)`,
      solution: `import pandas as pd
with open("log.jsonl", "w") as f:
    f.write('{"user": "a", "klik": 3}\\n{"user": "b", "klik": 5}\\n{"user": "a", "klik": 1}\\n')
df = pd.read_json("log.jsonl", lines=True)
print(df)`,
      tests: [{ desc: "3 baris", expr: "df.shape == (3, 2) and df['klik'].sum() == 9" }],
      hints: ["Konsep: satu object per baris.", "Parameter bernama seperti \"baris\" dalam bahasa Inggris.", "`lines=True`"],
      explanation: "lines=True untuk JSON Lines.",
    },
    {
      id: "load-json-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import pandas as pd
data = [{"id": 1, "info": {"umur": 20, "kota": "Bogor"}}, {"id": 2, "info": {"umur": 25}}]
df = pd.json_normalize(data)
print(df.columns.tolist())
print(df["info.kota"].isna().sum())`,
      answer: "['id', 'info.umur', 'info.kota']\n1",
      hints: ["Konsep: field bersarang menjadi kolom bertitik.", "info.umur dan info.kota.", "Baris kedua tidak punya kota."],
      explanation: "['id', 'info.umur', 'info.kota']; 1 NaN.",
    },
    {
      id: "load-json-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Teks JSON",
      prompt: "Kode error karena string JSON diberikan langsung. Perbaiki agar `df` terbaca.",
      starter: `import pandas as pd
teks = '[{"produk": "kopi", "harga": 18000}, {"produk": "teh", "harga": 12000}]'
df = pd.read_json(teks)
print(df)`,
      solution: `import io
import pandas as pd
teks = '[{"produk": "kopi", "harga": 18000}, {"produk": "teh", "harga": 12000}]'
df = pd.read_json(io.StringIO(teks))
print(df)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "df benar", expr: "df['harga'].tolist() == [18000, 12000]" },
      ],
      hints: ["Konsep: teks harus berperilaku seperti file.", "Gunakan modul io.", "`pd.read_json(io.StringIO(teks))`"],
      explanation: "pandas 3 menganggap string sebagai path; StringIO membungkus teks menjadi objek file.",
    },
    {
      id: "load-json-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Meratakan pesanan",
      prompt: "Dari `pesanan` (setiap pesanan berisi list `item`), buat `df` dengan satu baris per item memakai `pd.json_normalize(pesanan, record_path=\"item\", meta=[\"id_pesanan\", \"pelanggan\"])`. Tambahkan kolom `subtotal` = qty × harga, lalu cetak total per pesanan.",
      starter: `import pandas as pd
pesanan = [
    {"id_pesanan": "P1", "pelanggan": "Ani", "item": [{"produk": "kopi", "qty": 2, "harga": 18000}, {"produk": "roti", "qty": 1, "harga": 15000}]},
    {"id_pesanan": "P2", "pelanggan": "Budi", "item": [{"produk": "teh", "qty": 3, "harga": 12000}]},
]
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
pesanan = [
    {"id_pesanan": "P1", "pelanggan": "Ani", "item": [{"produk": "kopi", "qty": 2, "harga": 18000}, {"produk": "roti", "qty": 1, "harga": 15000}]},
    {"id_pesanan": "P2", "pelanggan": "Budi", "item": [{"produk": "teh", "qty": 3, "harga": 12000}]},
]
df = pd.json_normalize(pesanan, record_path="item", meta=["id_pesanan", "pelanggan"])
df["subtotal"] = df["qty"] * df["harga"]
print(df.groupby("id_pesanan")["subtotal"].sum())`,
      tests: [
        { desc: "3 baris item", expr: "len(df) == 3 and set(['produk', 'qty', 'harga', 'id_pesanan', 'pelanggan', 'subtotal']) <= set(df.columns)" },
        { desc: "Total benar", expr: "df.groupby('id_pesanan')['subtotal'].sum().to_dict() == {'P1': 51000, 'P2': 36000}" },
      ],
      hints: ["Konsep: record_path dan meta.", "record_path = list bersarang yang menjadi baris.", "meta = field induk yang disalin ke setiap baris."],
      explanation: "Struktur pesanan → item adalah pola JSON paling umum dari aplikasi e-commerce.",
    },
    {
      id: "load-json-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Ekspor & impor dataset sebagai JSON",
      prompt: [
        "Baca `wholesale_customers.csv`. Simpan 50 baris pertama sebagai JSON records ke `wholesale.json` (`orient=\"records\"`, `indent=2`).",
        "Baca kembali dengan `json.load` dan `pd.DataFrame(...)` → `kembali`. Cetak jumlah object, kunci object pertama, dan apakah `kembali` sama dengan 50 baris asli (`equals`).",
      ],
      starter: `import json
import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
# Tulis kodemu di sini
`,
      solution: `import json
import pandas as pd
df = pd.read_csv("wholesale_customers.csv")
awal = df.head(50)
awal.to_json("wholesale.json", orient="records", indent=2)
with open("wholesale.json") as f:
    data = json.load(f)
kembali = pd.DataFrame(data)
print(len(data), list(data[0].keys()))
print(kembali.equals(awal))`,
      tests: [
        { desc: "50 object", expr: "len(json.load(open('wholesale.json'))) == 50" },
        { desc: "Kunci = nama kolom", expr: "list(json.load(open('wholesale.json'))[0].keys()) == df.columns.tolist()" },
        { desc: "Round-trip utuh", expr: "kembali.equals(df.head(50))" },
      ],
      hints: ["Konsep: round-trip JSON.", "`to_json(..., orient=\"records\", indent=2)`", "`pd.DataFrame(list_of_dict)`"],
      explanation: "orient=\"records\" adalah format yang paling mudah dibaca manusia dan paling umum dipakai API.",
    },
  ],
  quiz: [
    { id: "load-json-q1", type: "mcq", prompt: "Fungsi untuk meratakan JSON bersarang menjadi tabel?", options: ["pd.read_csv", "pd.json_normalize", "json.dumps", "df.explode"], answer: 1, explanation: "json_normalize." },
    { id: "load-json-q2", type: "predict", prompt: "Apa outputnya?", code: `import json\nprint(json.loads('{"aktif": true, "skor": null}'))`, options: ["{'aktif': true, 'skor': null}", "{'aktif': True, 'skor': None}", "Error", "{'aktif': 'true'}"], answer: 1, explanation: "true → True, null → None." },
    { id: "load-json-q3", type: "tf", prompt: "Dalam JSON, string boleh memakai tanda kutip tunggal.", answer: false, explanation: "JSON mewajibkan kutip ganda." },
    { id: "load-json-q4", type: "fill", prompt: "File dengan satu object JSON per baris dibaca dengan `pd.read_json(f, ____=True)`", answer: ["lines"], explanation: "lines=True." },
    { id: "load-json-q5", type: "case", prompt: "API mengembalikan {\"stasiun\": \"DKI1\", \"data\": [{\"jam\": 1, \"pm25\": 40}, ...]}. Cara cepat mendapat tabel per jam dengan kolom stasiun?", options: ["pd.read_csv", "pd.json_normalize(obj, record_path=\"data\", meta=[\"stasiun\"])", "json.dumps(obj)", "pd.DataFrame(obj)"], answer: 1, explanation: "record_path untuk list, meta untuk field induk." },
  ],
  challenge: {
    id: "load-json-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Respons API berhalaman",
    prompt: [
      "API sering membagi hasil menjadi beberapa **halaman**. Diberikan list `halaman` (3 respons JSON sebagai teks). Setiap respons berisi `page`, `total_pages`, dan `results` (list pengukuran dengan field bersarang `lokasi.kota`).",
      "1. Parse setiap teks dengan `json.loads`.\n2. Gabungkan semua `results` → `json_normalize` → `df`.\n3. Pastikan jumlah halaman yang diproses sama dengan `total_pages` (`assert`).\n4. Ubah `waktu` menjadi datetime, urutkan, dan hapus duplikat berdasarkan `id`.",
      "Cetak `df.shape`, kolom, dan rata-rata `pm25` per `lokasi.kota`.",
    ],
    starter: `import json
import pandas as pd
halaman = [
    '{"page": 1, "total_pages": 3, "results": [{"id": 1, "waktu": "2025-01-01T01:00", "pm25": 40.5, "lokasi": {"kota": "Jakarta"}}, {"id": 2, "waktu": "2025-01-01T02:00", "pm25": 42.0, "lokasi": {"kota": "Jakarta"}}]}',
    '{"page": 2, "total_pages": 3, "results": [{"id": 3, "waktu": "2025-01-01T01:00", "pm25": 25.1, "lokasi": {"kota": "Bandung"}}, {"id": 2, "waktu": "2025-01-01T02:00", "pm25": 42.0, "lokasi": {"kota": "Jakarta"}}]}',
    '{"page": 3, "total_pages": 3, "results": [{"id": 4, "waktu": "2025-01-01T00:00", "pm25": 38.4, "lokasi": {"kota": "Jakarta"}}]}',
]
# Tulis kodemu di sini
`,
    solution: `import json
import pandas as pd
halaman = [
    '{"page": 1, "total_pages": 3, "results": [{"id": 1, "waktu": "2025-01-01T01:00", "pm25": 40.5, "lokasi": {"kota": "Jakarta"}}, {"id": 2, "waktu": "2025-01-01T02:00", "pm25": 42.0, "lokasi": {"kota": "Jakarta"}}]}',
    '{"page": 2, "total_pages": 3, "results": [{"id": 3, "waktu": "2025-01-01T01:00", "pm25": 25.1, "lokasi": {"kota": "Bandung"}}, {"id": 2, "waktu": "2025-01-01T02:00", "pm25": 42.0, "lokasi": {"kota": "Jakarta"}}]}',
    '{"page": 3, "total_pages": 3, "results": [{"id": 4, "waktu": "2025-01-01T00:00", "pm25": 38.4, "lokasi": {"kota": "Jakarta"}}]}',
]
respons = [json.loads(h) for h in halaman]
assert len(respons) == respons[0]["total_pages"]
semua = [r for res in respons for r in res["results"]]
df = pd.json_normalize(semua)
df["waktu"] = pd.to_datetime(df["waktu"])
df = df.sort_values("waktu").drop_duplicates("id").reset_index(drop=True)
print(df.shape)
print(df.columns.tolist())
print(df.groupby("lokasi.kota")["pm25"].mean().round(2).to_dict())`,
    tests: [
      { desc: "4 pengukuran unik", expr: "df.shape[0] == 4 and df['id'].is_unique" },
      { desc: "Kolom bertitik", expr: "'lokasi.kota' in df.columns" },
      { desc: "Terurut waktu & tipe datetime", expr: "df['waktu'].is_monotonic_increasing and str(df['waktu'].dtype).startswith('datetime64')" },
      { desc: "Rata-rata Jakarta benar", expr: "round(df[df['lokasi.kota'] == 'Jakarta']['pm25'].mean(), 2) == round((40.5 + 42.0 + 38.4) / 3, 2)" },
    ],
    hints: ["Konsep: menggabungkan halaman API.", "List comprehension bertingkat: `[r for res in respons for r in res[\"results\"]]`.", "Halaman bisa tumpang tindih → drop_duplicates(\"id\")."],
    explanation: "Duplikat antar-halaman dan urutan yang tidak terjamin adalah masalah nyata saat mengumpulkan data dari API — selalu deduplikasi dan urutkan.",
  },
  summary: [
    "JSON = object {} dan array [] yang bisa bersarang; umum pada API.",
    "`pd.read_json` untuk records; `lines=True` untuk JSON Lines; teks dibungkus `io.StringIO`.",
    "`json_normalize(record_path, meta)` meratakan data bersarang.",
    "Modul `json`: load/loads untuk membaca, dump/dumps untuk menulis.",
  ],
  cheatsheet: [
    { syntax: "pd.read_json(f, lines=True)", desc: "JSON Lines" },
    { syntax: "pd.read_json(io.StringIO(teks))", desc: "Dari teks" },
    { syntax: "pd.json_normalize(d, record_path=\"x\", meta=[\"id\"])", desc: "Ratakan" },
    { syntax: "json.loads(s), json.dumps(o, indent=2)", desc: "Teks ↔ objek" },
    { syntax: "df.to_json(f, orient=\"records\")", desc: "Simpan JSON" },
  ],
  flashcards: [
    { q: "Ratakan list bersarang `harian` sambil menyalin `id`", a: "pd.json_normalize(data, record_path=\"harian\", meta=[\"id\"])" },
    { q: "Baca file .jsonl", a: "pd.read_json(\"f.jsonl\", lines=True)" },
    { q: "Mengapa pd.read_json(teks) error di pandas 3?", a: "String dianggap path; bungkus dengan io.StringIO(teks)" },
  ],
  references: [
    pandasDoc("IO tools — JSON", "user_guide/io.html#json"),
    pandasDoc("pandas.json_normalize", "reference/api/pandas.json_normalize.html"),
    pandasDoc("pandas.read_json", "reference/api/pandas.read_json.html"),
    pyDoc("json — JSON encoder and decoder", "library/json.html"),
  ],
};
