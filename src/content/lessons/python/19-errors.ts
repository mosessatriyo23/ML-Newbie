import type { Lesson } from "../../../types.ts";
import { pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-error-handling",
  title: "Error Handling",
  minutes: 45,
  prerequisites: ["py-functions"],
  objectives: [
    "Membaca traceback dan mengenali jenis error yang paling umum.",
    "Menangani error dengan `try` dan `except` tanpa menghentikan program.",
    "Menangkap jenis exception tertentu dan mengakses pesan error-nya (`as e`).",
    "Memakai `else` dan `finally` pada blok try.",
    "Memunculkan error sendiri dengan `raise` untuk validasi input.",
  ],
  definition: [
    "Ada dua jenis kesalahan di Python:\n- **Syntax error** — penulisan kode salah; program tidak bisa dijalankan sama sekali.\n- **Exception** — kode benar secara sintaks, tetapi terjadi masalah saat dijalankan (membagi nol, file tidak ada, key tidak ditemukan).",
    "Saat exception terjadi, Python menampilkan **traceback**: urutan pemanggilan yang menuju error. Baca dari **bawah**: baris terakhir berisi **jenis error** dan **pesannya**; baris di atasnya menunjukkan **lokasi** (file dan nomor baris).",
    "Blok `try`/`except` memungkinkan program **menangani** exception: kode berisiko diletakkan di `try`, dan penanganannya di `except`. Jika tidak terjadi error, blok `except` dilewati.",
    "`raise` dipakai untuk **memunculkan** exception secara sengaja, misalnya ketika input tidak valid. Ini lebih baik daripada membiarkan program berjalan dengan data yang salah.",
  ],
  why: [
    "Pipeline data nyata penuh data kotor: teks di kolom angka, file hilang, pembagian dengan nol pada kelompok kosong. Error handling membuat pipeline tidak berhenti total karena satu baris rusak, sekaligus mencatat masalahnya.",
    "Kemampuan membaca traceback adalah keterampilan terpenting agar tidak selalu bergantung pada AI saat kode error.",
  ],
  when: [
    "- Saat memproses input dari luar (file, user, API) yang mungkin tidak valid.",
    "- Saat konversi tipe data yang bisa gagal (`float(\"abc\")`).",
    "- **Jangan** memakai try/except untuk menyembunyikan bug di kodemu sendiri — perbaiki bug-nya.",
  ],
  analogy: "try/except seperti **jaring pengaman pemain trapeze**. Pemain tetap mencoba aksinya (try); jika jatuh (exception), jaring menangkapnya (except) sehingga pertunjukan bisa berlanjut. Namun jaring bukan alasan untuk berlatih asal-asalan.",
  syntax: {
    code: `try:
    kode_berisiko
except JenisError as e:
    penanganan
else:
    dijalankan_jika_tidak_ada_error
finally:
    selalu_dijalankan

raise ValueError("pesan")`,
  },
  anatomy: [
    ["try:", "Blok kode yang mungkin menimbulkan exception."],
    ["except ValueError:", "Menangkap jenis error tertentu."],
    ["as e", "Menyimpan objek error ke variabel `e`; `str(e)` berisi pesannya."],
    ["else:", "Dijalankan hanya jika `try` sukses tanpa error."],
    ["finally:", "Selalu dijalankan, ada error atau tidak (misalnya untuk membersihkan resource)."],
    ["raise", "Memunculkan exception secara sengaja."],
  ],
  examples: [
    {
      title: "Contoh 1 — Exception menghentikan program",
      intro: "Contoh ini sengaja error. Perhatikan traceback-nya ketika dijalankan di editor: baris terakhir berisi `ZeroDivisionError: division by zero`.",
      code: `jumlah_data = 0
rata_rata = 100 / jumlah_data
print("Baris ini tidak pernah dijalankan")`,
      expectError: "ZeroDivisionError",
      explain: [
        ["rata_rata = 100 / jumlah_data", "Pembagian dengan nol → exception. Program berhenti di sini."],
        ["print(\"Baris ini tidak pernah dijalankan\")", "Tidak pernah tercapai."],
      ],
    },
    {
      title: "Contoh 2 — try dan except",
      code: `nilai_teks = "delapan puluh"
try:
    nilai = float(nilai_teks)
except ValueError:
    nilai = None
    print("Tidak bisa dikonversi:", nilai_teks)
print("Nilai:", nilai)`,
      output: "Tidak bisa dikonversi: delapan puluh\nNilai: None",
      explain: [
        ["try:", "Mencoba konversi yang mungkin gagal."],
        ["except ValueError:", "Hanya menangkap ValueError (konversi gagal)."],
        ["    nilai = None", "Menandai data sebagai missing, mirip NaN di Pandas."],
        ["print(\"Nilai:\", nilai)", "Program tetap berlanjut."],
      ],
      change: "Program tidak lagi berhenti; error ditangani dengan cara yang masuk akal.",
    },
    {
      title: "Contoh 3 — Beberapa except dan as e",
      code: `data = {"age": 30, "income": 0}

def rasio(kolom_a, kolom_b):
    try:
        return data[kolom_a] / data[kolom_b]
    except KeyError as e:
        print("Kolom tidak ditemukan:", e)
    except ZeroDivisionError:
        print("Pembagi bernilai nol")
    return None

print(rasio("age", "gender"))
print(rasio("age", "income"))`,
      output: "Kolom tidak ditemukan: 'gender'\nNone\nPembagi bernilai nol\nNone",
      explain: [
        ["except KeyError as e:", "Menangkap KeyError dan menyimpan objek error ke `e`."],
        ["print(\"Kolom tidak ditemukan:\", e)", "Pesan error KeyError adalah nama key-nya."],
        ["except ZeroDivisionError:", "Penanganan berbeda untuk jenis error berbeda."],
        ["return None", "Dijalankan setelah salah satu except menangani error."],
      ],
      change: "Kita membedakan penanganan berdasarkan jenis exception.",
    },
    {
      title: "Contoh 4 — else dan finally",
      code: `def baca_angka(teks):
    try:
        angka = int(teks)
    except ValueError:
        print(f"'{teks}' gagal dibaca")
        angka = 0
    else:
        print(f"'{teks}' berhasil dibaca")
    finally:
        print("-- selesai memproses", teks)
    return angka

total = baca_angka("12") + baca_angka("x")
print("Total:", total)`,
      output: "'12' berhasil dibaca\n-- selesai memproses 12\n'x' gagal dibaca\n-- selesai memproses x\nTotal: 12",
      explain: [
        ["    else:", "Hanya dijalankan ketika try sukses."],
        ["    finally:", "Selalu dijalankan — untuk \"12\" maupun \"x\"."],
      ],
      change: "Struktur lengkap try/except/else/finally.",
    },
    {
      title: "Contoh 5 — raise untuk validasi",
      code: `def set_test_size(test_size):
    if not 0 < test_size < 1:
        raise ValueError(f"test_size harus di antara 0 dan 1, didapat {test_size}")
    return test_size

print(set_test_size(0.2))
try:
    set_test_size(20)
except ValueError as e:
    print("Error:", e)`,
      output: "0.2\nError: test_size harus di antara 0 dan 1, didapat 20",
      explain: [
        ["raise ValueError(f\"test_size harus di antara 0 dan 1, didapat {test_size}\")", "Menghentikan fungsi dan memunculkan ValueError dengan pesan yang jelas."],
        ["set_test_size(20)", "Input tidak valid → exception, lalu ditangkap di luar fungsi."],
      ],
      change: "Kita tidak hanya menangani error, tetapi juga **membuatnya** — persis cara scikit-learn memvalidasi parameter (`InvalidParameterError` turunan dari ValueError).",
    },
  ],
  params: [
    {
      title: "Exception yang paling sering ditemui",
      items: [
        { name: "SyntaxError / IndentationError", desc: "Penulisan atau indentasi salah." },
        { name: "NameError", desc: "Nama variabel/fungsi belum didefinisikan atau salah ketik." },
        { name: "TypeError", desc: "Operasi pada tipe yang tidak cocok, atau jumlah argument salah." },
        { name: "ValueError", desc: "Tipe benar tetapi nilai tidak valid (`int(\"abc\")`)." },
        { name: "IndexError", desc: "Index di luar jangkauan list." },
        { name: "KeyError", desc: "Key tidak ada di dict (juga nama kolom DataFrame)." },
        { name: "AttributeError", desc: "Objek tidak punya atribut/method tersebut." },
        { name: "ZeroDivisionError", desc: "Pembagian dengan nol." },
        { name: "FileNotFoundError", desc: "File tidak ditemukan." },
        { name: "ModuleNotFoundError", desc: "Modul belum diinstal atau salah nama." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `try:\n    print([1, 2, 3][5])\nexcept IndexError as e:\n    print("Error:", e)`, output: "Error: list index out of range" },
  tryIt: `data_mentah = ["12", "7.5", "", "abc", "20"]
bersih = []
gagal = 0
for teks in data_mentah:
    try:
        bersih.append(float(teks))
    except ValueError:
        gagal += 1
print("Data bersih:", bersih)
print("Gagal dikonversi:", gagal)`,
  mistakes: [
    {
      title: "except kosong yang menelan semua error",
      wrong: `try:
    hasil = 10 / int("abc")
except:
    pass
print("lanjut")   # error disembunyikan`,
      fix: `try:
    hasil = 10 / int("abc")
except ValueError as e:
    print("Input tidak valid:", e)
    hasil = None`,
      explain: "`except:` tanpa jenis error menangkap SEMUA exception (termasuk bug), lalu `pass` menyembunyikannya. Tangkap jenis error spesifik dan tampilkan pesannya.",
    },
    {
      title: "try terlalu besar",
      wrong: `try:
    data = [1, 2, 3]
    total = sum(data)
    rata = total / len(data)
    print(rata)
except ZeroDivisionError:
    print("kosong")`,
      fix: `data = [1, 2, 3]
total = sum(data)
try:
    rata = total / len(data)
except ZeroDivisionError:
    rata = None
print(rata)`,
      explain: "Letakkan hanya baris yang berisiko di dalam try agar jelas error apa yang ditangani.",
    },
    {
      title: "Salah menyebut jenis exception",
      wrong: `try:
    int("x")
except TypeError:
    print("tertangani?")`,
      error: "ValueError",
      fix: `try:
    int("x")
except ValueError:
    print("tertangani")`,
      explain: "`int(\"x\")` memunculkan ValueError, bukan TypeError — sehingga tidak tertangkap. Jalankan dulu tanpa try untuk melihat jenis error sebenarnya.",
    },
  ],
  bestPractices: [
    "Baca traceback dari bawah: jenis error → pesan → baris kode penyebab.",
    "Tangkap exception yang spesifik (`except ValueError`), bukan `except:` kosong.",
    "Jangan sembunyikan error dengan `pass` tanpa mencatatnya.",
    "Gunakan `raise` dengan pesan yang menjelaskan nilai yang salah dan nilai yang diharapkan.",
    "Saat membersihkan data, hitung dan laporkan berapa baris yang gagal diproses.",
  ],
  exercises: [
    {
      id: "py-err-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — try/except",
      prompt: "Lengkapi kata kunci sehingga konversi yang gagal ditangani dan output-nya `Bukan angka`.",
      starter: `____:
    x = int("dua")
____ ValueError:
    print("Bukan angka")`,
      solution: `try:
    x = int("dua")
except ValueError:
    print("Bukan angka")`,
      tests: [
        { desc: "Tidak ada error yang lolos", expr: "_error is None" },
        { desc: "Output 'Bukan angka'", expr: "_lines == ['Bukan angka']" },
      ],
      hints: ["Konsep: blok penanganan error.", "Dua kata kunci: mencoba, lalu menangkap.", "`try:` dan `except ValueError:`"],
      explanation: "`int(\"dua\")` memunculkan ValueError yang ditangkap oleh except.",
    },
    {
      id: "py-err-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `def f(x):
    try:
        hasil = 10 // x
    except ZeroDivisionError:
        return "nol"
    else:
        return hasil
    finally:
        print("cek", x)

print(f(3))
print(f(0))`,
      answer: "cek 3\n3\ncek 0\nnol",
      hints: ["Konsep: finally selalu dijalankan, bahkan saat return.", "f(3): else → return 3, tetapi finally mencetak dulu.", "f(0): except → return 'nol', finally tetap mencetak."],
      explanation: "finally dijalankan sebelum fungsi benar-benar mengembalikan nilai, sehingga 'cek ...' muncul sebelum hasil dicetak.",
    },
    {
      id: "py-err-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Exception yang salah",
      prompt: "Kode masih berhenti dengan error karena jenis exception yang ditangkap keliru. Perbaiki agar mencetak `Kolom tidak ada: 'price'`.",
      starter: `row = {"area": 120, "rooms": 3}
try:
    harga = row["price"]
except IndexError as e:
    print("Kolom tidak ada:", e)`,
      solution: `row = {"area": 120, "rooms": 3}
try:
    harga = row["price"]
except KeyError as e:
    print("Kolom tidak ada:", e)`,
      tests: [
        { desc: "Tidak ada error yang lolos", expr: "_error is None" },
        { desc: "Output benar", expr: "_lines == [\"Kolom tidak ada: 'price'\"]" },
      ],
      hints: ["Konsep: setiap situasi punya jenis exception sendiri.", "Mengakses key dict yang tidak ada bukan IndexError.", "Ganti dengan `KeyError`."],
      explanation: "IndexError untuk list; KeyError untuk dictionary (dan kolom DataFrame).",
    },
    {
      id: "py-err-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Fungsi konversi aman",
      prompt: [
        "Tulis fungsi `to_float(teks)` yang mengembalikan `float(teks)` jika berhasil, dan `None` jika gagal (ValueError).",
        "Cetak `[to_float(\"3.5\"), to_float(\"abc\"), to_float(\"10\")]` → `[3.5, None, 10.0]`.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `def to_float(teks):
    try:
        return float(teks)
    except ValueError:
        return None

print([to_float("3.5"), to_float("abc"), to_float("10")])`,
      tests: [
        { desc: "to_float('3.5') == 3.5", expr: "to_float('3.5') == 3.5" },
        { desc: "to_float('abc') is None", expr: "to_float('abc') is None" },
        { desc: "to_float('') is None", expr: "to_float('') is None" },
        { desc: "Memakai try/except", expr: "'try' in _code and 'except' in _code" },
      ],
      hints: ["Konsep: try/except di dalam fungsi.", "Return di dalam try, return None di except.", "`except ValueError: return None`"],
      explanation: "Fungsi semacam ini mirip `pd.to_numeric(..., errors=\"coerce\")` yang mengubah nilai gagal menjadi NaN.",
    },
    {
      id: "py-err-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Validasi dengan raise",
      prompt: [
        "Tulis fungsi `validasi_k(k, n_data)` untuk KNN: jika `k` bukan int atau `k < 1` → `raise ValueError(\"k harus bilangan bulat positif\")`; jika `k > n_data` → `raise ValueError(\"k tidak boleh melebihi jumlah data\")`; selain itu kembalikan `k`.",
        "Panggil dalam try/except untuk k = 0 dan cetak pesan error-nya: `k harus bilangan bulat positif`.",
      ],
      starter: `# Tulis kodemu di sini
`,
      solution: `def validasi_k(k, n_data):
    if not isinstance(k, int) or k < 1:
        raise ValueError("k harus bilangan bulat positif")
    if k > n_data:
        raise ValueError("k tidak boleh melebihi jumlah data")
    return k

try:
    validasi_k(0, 100)
except ValueError as e:
    print(e)`,
      tests: [
        { desc: "k valid dikembalikan", expr: "validasi_k(5, 100) == 5" },
        { desc: "k = 0 → ValueError 'k harus bilangan bulat positif'", expr: "_raises(validasi_k, 0, 100) == ('ValueError', 'k harus bilangan bulat positif')" },
        { desc: "k = 2.5 (bukan int) → ValueError", expr: "_raises(validasi_k, 2.5, 100) == ('ValueError', 'k harus bilangan bulat positif')" },
        { desc: "k = 200 untuk 100 data → ValueError 'k tidak boleh melebihi jumlah data'", expr: "_raises(validasi_k, 200, 100) == ('ValueError', 'k tidak boleh melebihi jumlah data')" },
        { desc: "Output pesan error k = 0", expr: "_lines == ['k harus bilangan bulat positif']" },
      ],
      hints: ["Konsep: raise untuk validasi input.", "Periksa tipe dengan isinstance, lalu periksa rentang.", "`raise ValueError(\"k harus bilangan bulat positif\")`"],
      explanation: "Library yang baik memvalidasi input dan memberi pesan error yang jelas — kebiasaan yang perlu kamu tiru dalam kode sendiri.",
    },
  ],
  quiz: [
    { id: "py-err-q1", type: "mcq", prompt: "Saat membaca traceback, bagian mana yang dibaca pertama untuk mengetahui jenis error?", options: ["Baris paling atas", "Baris paling bawah", "Baris tengah", "Nama file"], answer: 1, explanation: "Baris terakhir berisi jenis exception dan pesannya." },
    { id: "py-err-q2", type: "predict", prompt: "Apa outputnya?", code: `try:\n    print("A")\n    x = 1 / 0\n    print("B")\nexcept ZeroDivisionError:\n    print("C")`, options: ["A\nB\nC", "A\nC", "C", "A"], answer: 1, explanation: "Setelah error di baris kedua try, sisa try dilewati dan langsung ke except." },
    { id: "py-err-q3", type: "tf", prompt: "Blok `finally` hanya dijalankan jika terjadi error.", answer: false, explanation: "finally selalu dijalankan." },
    { id: "py-err-q4", type: "fill", prompt: "Kata kunci untuk memunculkan exception secara sengaja adalah ____", answer: ["raise"], explanation: "`raise ValueError(\"pesan\")`." },
    { id: "py-err-q5", type: "case", prompt: "Saat mengakses `df[\"Harga\"]` muncul `KeyError: 'Harga'`. Penyebab paling mungkin?", options: ["Data kosong", "Nama kolom berbeda (misalnya 'harga' atau ada spasi)", "Library belum diinstal", "Pembagian nol"], answer: 1, explanation: "KeyError = key/kolom tidak ditemukan. Periksa `df.columns`." },
  ],
  challenge: {
    id: "py-err-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Pembersih data dengan laporan error",
    prompt: [
      "Diberikan `rows = [\"Andi,21\", \"Budi,dua puluh\", \"Citra\", \"Dewi,23\"]` (format `nama,umur`).",
      "Untuk setiap baris: pecah dengan `split(\",\")`, ambil nama dan umur (int). Tangani dua jenis error:",
      "- `IndexError` (kolom umur tidak ada) → catat ke list `errors` sebagai `\"Citra: kolom kurang\"`",
      "- `ValueError` (umur bukan angka) → catat `\"Budi: umur tidak valid\"`",
      "Baris yang valid disimpan ke dictionary `valid` {nama: umur}. Cetak `valid` lalu `errors`:",
      "```\n{'Andi': 21, 'Dewi': 23}\n['Budi: umur tidak valid', 'Citra: kolom kurang']\n```",
    ],
    starter: `rows = ["Andi,21", "Budi,dua puluh", "Citra", "Dewi,23"]
valid = {}
errors = []
# Tulis kodemu di sini
`,
    solution: `rows = ["Andi,21", "Budi,dua puluh", "Citra", "Dewi,23"]
valid = {}
errors = []
for row in rows:
    bagian = row.split(",")
    nama = bagian[0]
    try:
        umur = int(bagian[1])
    except IndexError:
        errors.append(f"{nama}: kolom kurang")
    except ValueError:
        errors.append(f"{nama}: umur tidak valid")
    else:
        valid[nama] = umur
print(valid)
print(errors)`,
    tests: [
      { desc: "valid benar", expr: "valid == {'Andi': 21, 'Dewi': 23}" },
      { desc: "errors benar", expr: "errors == ['Budi: umur tidak valid', 'Citra: kolom kurang']" },
      { desc: "Menangani IndexError dan ValueError", expr: "'IndexError' in _code and 'ValueError' in _code" },
      { desc: "Output sesuai", expr: "_lines == [\"{'Andi': 21, 'Dewi': 23}\", \"['Budi: umur tidak valid', 'Citra: kolom kurang']\"]" },
    ],
    hints: ["Konsep: loop + try dengan dua except + else.", "`int(bagian[1])` bisa memunculkan IndexError atau ValueError.", "Simpan ke `valid` di blok `else`."],
    explanation: "Pembersih data yang baik tidak berhenti di baris rusak pertama — ia mencatat masalah dan memproses sisanya.",
  },
  summary: [
    "Syntax error = penulisan salah; exception = masalah saat program berjalan.",
    "Baca traceback dari bawah: jenis error, pesan, lalu lokasi.",
    "`try`/`except JenisError as e` menangani error; `else` jika sukses; `finally` selalu.",
    "Tangkap exception spesifik; jangan menyembunyikan error dengan `except: pass`.",
    "`raise ValueError(\"pesan\")` untuk validasi input.",
  ],
  cheatsheet: [
    { syntax: "try:\n    ...\nexcept ValueError as e:\n    print(e)", desc: "Tangani error spesifik" },
    { syntax: "except (KeyError, IndexError):", desc: "Beberapa jenis sekaligus" },
    { syntax: "else: / finally:", desc: "Sukses / selalu" },
    { syntax: 'raise ValueError("pesan")', desc: "Munculkan error" },
  ],
  flashcards: [
    { q: "Tangkap ValueError dan cetak pesannya", a: "try:\n    ...\nexcept ValueError as e:\n    print(e)" },
    { q: "Error saat mengakses key dict yang tidak ada?", a: "KeyError" },
    { q: "Munculkan error jika k < 1", a: 'if k < 1:\n    raise ValueError("k harus >= 1")' },
    { q: "Bagian traceback yang dibaca pertama?", a: "Baris paling bawah (jenis error dan pesan)" },
  ],
  references: [
    pyDoc("The Python Tutorial — 8. Errors and Exceptions", "tutorial/errors.html"),
    pyDoc("The Python Tutorial — 8.3 Handling Exceptions", "tutorial/errors.html#handling-exceptions"),
    pyDoc("The Python Tutorial — 8.4 Raising Exceptions", "tutorial/errors.html#raising-exceptions"),
    pyDoc("Built-in Exceptions", "library/exceptions.html"),
  ],
};
