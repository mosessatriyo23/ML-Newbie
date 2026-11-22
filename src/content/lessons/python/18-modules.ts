import type { Lesson } from "../../../types.ts";
import { kagglePy, pyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "py-importing-modules",
  title: "Importing Modules",
  minutes: 45,
  prerequisites: ["py-functions", "py-built-in-functions"],
  objectives: [
    "Memahami module, package, dan library.",
    "Memakai `import modul`, `import modul as alias`, dan `from modul import nama`.",
    "Memakai modul standar `math`, `random`, dan `statistics`.",
    "Mengenal konvensi alias Data Science: `np`, `pd`, `plt`, `sns`.",
    "Membuat hasil acak yang dapat diulang dengan `random.seed()`.",
  ],
  definition: [
    "**Module** adalah file Python (`.py`) berisi fungsi, variabel, dan kelas yang bisa dipakai ulang. **Package** adalah kumpulan module dalam satu folder. **Library** adalah istilah umum untuk package yang menyediakan fitur tertentu, misalnya NumPy dan Pandas.",
    "Python punya **standard library** — modul bawaan yang langsung tersedia (seperti `math`, `random`, `statistics`, `csv`, `json`). Library pihak ketiga (NumPy, Pandas, scikit-learn) perlu diinstal terlebih dahulu (di komputer: `pip install pandas`). Di ML Academy, library utama sudah tersedia di runtime browser.",
    "`import` memuat modul. Cara pakainya:\n- `import math` → panggil dengan `math.sqrt(16)`\n- `import numpy as np` → `as` memberi **alias** (nama pendek)\n- `from math import sqrt` → ambil satu nama sehingga cukup ditulis `sqrt(16)`",
  ],
  why: [
    "Hampir setiap notebook Machine Learning diawali blok import:\n`import numpy as np`, `import pandas as pd`, `import matplotlib.pyplot as plt`, `from sklearn.model_selection import train_test_split`.",
    "Memahami import membuatmu tahu **dari mana** sebuah fungsi berasal, sehingga bisa mencari dokumentasinya sendiri.",
    "`random.seed()` mengenalkan konsep **reproducibility** — hasil yang sama setiap dijalankan — yang nanti muncul sebagai `random_state=42`.",
  ],
  when: [
    "- Di bagian paling atas skrip/notebook, sebelum kode lain.",
    "- Saat butuh fungsi matematika (`math`), angka acak (`random`), statistik dasar (`statistics`), atau library Data Science.",
  ],
  analogy: "Python seperti **dapur dasar**, dan module seperti **kotak peralatan tambahan**. `import pandas as pd` sama dengan mengambil kotak \"Pandas\" dari lemari dan menempelkan label pendek \"pd\" agar mudah dipanggil. `from math import sqrt` seperti mengambil satu alat saja dari kotaknya.",
  syntax: {
    code: `import math
import numpy as np
from math import sqrt, pi
from sklearn.model_selection import train_test_split

math.sqrt(16)   np.mean(x)   sqrt(16)`,
  },
  anatomy: [
    ["import math", "Memuat modul `math`. Isinya diakses dengan titik: `math.sqrt`."],
    ["as np", "Alias: nama pendek untuk modul."],
    ["from math import sqrt", "Mengambil nama `sqrt` langsung ke program."],
    ["math.pi", "Mengakses variabel di dalam modul."],
    ["sklearn.model_selection", "Sub-modul di dalam package scikit-learn (titik menunjukkan hierarki)."],
  ],
  examples: [
    {
      title: "Contoh 1 — import modul standar math",
      code: `import math

print(math.sqrt(25))
print(math.pi)
print(math.ceil(80.6), math.floor(80.6))
print(math.log(math.e))`,
      output: "5.0\n3.141592653589793\n81 80\n1.0",
      explain: [
        ["import math", "Memuat modul matematika bawaan."],
        ["math.sqrt(25)", "Akar kuadrat (hasil float)."],
        ["math.ceil(80.6), math.floor(80.6)", "Pembulatan ke atas dan ke bawah — ingat ceil dipakai menghitung ukuran data test."],
        ["math.log(math.e)", "Logaritma natural; dipakai di rumus log loss."],
      ],
    },
    {
      title: "Contoh 2 — Alias dan from ... import",
      code: `import statistics as st
from math import sqrt, pi

data = [70, 85, 90, 65, 80]
print(st.mean(data), st.median(data))
print(round(st.stdev(data), 2))
print(sqrt(2), round(pi, 2))`,
      output: "78 80\n10.37\n1.4142135623730951 3.14",
      explain: [
        ["import statistics as st", "Alias `st` untuk modul statistics."],
        ["from math import sqrt, pi", "Mengambil dua nama sekaligus; dipakai tanpa awalan `math.`."],
        ["st.mean(data), st.median(data)", "Rata-rata dan median (materi Module 05)."],
        ["st.stdev(data)", "Standar deviasi **sampel** (pembagi n − 1)."],
      ],
      change: "Dua gaya import baru: alias dan mengambil nama spesifik.",
    },
    {
      title: "Contoh 3 — random dan reproducibility dengan seed",
      code: `import random

random.seed(42)
a = [random.randint(1, 100) for _ in range(3)]
random.seed(42)
b = [random.randint(1, 100) for _ in range(3)]
print(a)
print(a == b)

data = [1, 2, 3, 4, 5]
random.seed(0)
random.shuffle(data)
print(data)`,
      output: "[82, 15, 4]\nTrue\n[3, 2, 1, 5, 4]",
      explain: [
        ["random.seed(42)", "Mengatur titik awal generator acak. Seed sama → urutan angka acak sama."],
        ["[random.randint(1, 100) for _ in range(3)]", "Membuat 3 angka acak 1–100. (Bentuk `[... for _ in range(3)]` adalah *list comprehension* — singkatnya: ulangi 3 kali dan kumpulkan hasilnya.)"],
        ["a == b", "Karena seed sama, kedua list identik → True."],
        ["random.shuffle(data)", "Mengacak urutan list in-place — seperti yang dilakukan train_test_split sebelum membagi data."],
      ],
      change: "Kita mengenal konsep reproducibility: angka acak yang bisa diulang.",
    },
    {
      title: "Contoh 4 — Konvensi import Data Science",
      intro: "Library pihak ketiga dimuat dengan alias standar komunitas. Pada run pertama, runtime browser perlu mengunduh paket (beberapa detik).",
      code: `import numpy as np
import pandas as pd

print(np.__version__.split(".")[0] >= "2")
nilai = np.array([70, 85, 90])
print(nilai.mean())

df = pd.DataFrame({"nama": ["Andi", "Budi"], "nilai": [80, 90]})
print(df.shape)`,
      output: "True\n81.66666666666667\n(2, 2)",
      explain: [
        ["import numpy as np", "Alias `np` dipakai hampir semua tutorial & dokumentasi resmi."],
        ["import pandas as pd", "Alias `pd`."],
        ["np.__version__", "Atribut versi library — berguna untuk mencocokkan dengan dokumentasi."],
        ["nilai.mean()", "NumPy array punya method statistik (Module 02)."],
        ["df = pd.DataFrame({\"nama\": [\"Andi\", \"Budi\"], \"nilai\": [80, 90]})", "Membuat tabel dari dictionary (Module 03)."],
      ],
      change: "Dari modul standar ke library Data Science sungguhan — pola import yang sama.",
    },
  ],
  params: [
    {
      title: "Modul standar yang berguna di Data Science",
      items: [
        { name: "math", desc: "sqrt, log, exp, ceil, floor, pi, e." },
        { name: "random", desc: "seed, random, randint, choice, shuffle, sample." },
        { name: "statistics", desc: "mean, median, mode, stdev, variance." },
        { name: "csv / json", desc: "Membaca & menulis file CSV dan JSON (materi Reading and Writing Files)." },
        { name: "os / pathlib", desc: "Bekerja dengan path dan folder." },
      ],
    },
    {
      title: "Alias standar komunitas",
      items: [
        { name: "import numpy as np", desc: "Komputasi numerik." },
        { name: "import pandas as pd", desc: "Data tabular." },
        { name: "import matplotlib.pyplot as plt", desc: "Visualisasi." },
        { name: "import seaborn as sns", desc: "Visualisasi statistik." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `from math import ceil\nprint(ceil(403 * 0.2))`, output: "81" },
  tryIt: `import random
import statistics as st

random.seed(7)            # ganti seed lalu jalankan ulang
sampel = [random.randint(50, 100) for _ in range(10)]
print("Sampel:", sampel)
print("Mean:", st.mean(sampel), "| Median:", st.median(sampel))`,
  mistakes: [
    {
      title: "Lupa import",
      wrong: `print(math.sqrt(9))`,
      error: "NameError",
      fix: `import math
print(math.sqrt(9))`,
      explain: "Nama modul belum dikenal sebelum di-import.",
    },
    {
      title: "Salah ketik nama modul",
      wrong: `import pandass as pd`,
      error: "ModuleNotFoundError",
      fix: `import pandas as pd
print(pd.__name__)`,
      explain: "Periksa ejaan. Di komputer sendiri, error ini juga muncul bila library belum diinstal (`pip install ...`).",
    },
    {
      title: "Memakai nama modul setelah from-import",
      wrong: `from math import sqrt
print(math.sqrt(4))`,
      error: "NameError",
      fix: `from math import sqrt
print(sqrt(4))`,
      explain: "`from math import sqrt` hanya membawa nama `sqrt`, bukan `math`.",
    },
    {
      title: "Memakai alias yang tidak lazim",
      wrong: `import pandas as p
df = p.DataFrame({"a": [1]})`,
      fix: `import pandas as pd
df = pd.DataFrame({"a": [1]})
print(df.shape)`,
      explain: "Kode tetap jalan, tetapi alias tidak standar membuat kode sulit dibaca orang lain. Gunakan `pd`, `np`, `plt`, `sns`.",
    },
  ],
  bestPractices: [
    "Letakkan semua import di bagian atas file/notebook.",
    "Gunakan alias standar komunitas (`np`, `pd`, `plt`, `sns`).",
    "Hindari `from modul import *` karena nama-nama bisa bertabrakan dan asal fungsi tidak jelas.",
    "Selalu tetapkan seed (`random.seed`, `random_state`) agar eksperimen bisa diulang.",
    "Catat versi library (`pd.__version__`) dan baca dokumentasi untuk versi yang sama.",
  ],
  exercises: [
    {
      id: "py-import-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Alias",
      prompt: "Lengkapi baris import agar `st.mean(...)` dapat dipakai dan output-nya `80`.",
      starter: `import statistics ____ st
print(st.mean([70, 80, 90]))`,
      solution: `import statistics as st
print(st.mean([70, 80, 90]))`,
      tests: [{ desc: "Output 80", expr: "_lines == ['80']" }],
      hints: ["Konsep: alias modul.", "Kata kunci dua huruf.", "`import statistics as st`"],
      explanation: "`as` memberi nama pendek untuk modul.",
    },
    {
      id: "py-import-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import math
from math import floor
print(math.ceil(2.1), floor(2.9))
print(math.sqrt(49) + math.pow(2, 3))`,
      answer: "3 2\n15.0",
      hints: ["Konsep: ceil ke atas, floor ke bawah.", "sqrt dan pow menghasilkan float.", "7.0 + 8.0."],
      explanation: "ceil(2.1) = 3, floor(2.9) = 2, sqrt(49) + 2³ = 7.0 + 8.0 = 15.0.",
    },
    {
      id: "py-import-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Import yang salah",
      prompt: "Perbaiki import agar kode berjalan dan mencetak `5.0 3.142`.",
      starter: `from math import sqrt
print(math.sqrt(25), round(pi, 3))`,
      solution: `from math import sqrt, pi
print(sqrt(25), round(pi, 3))`,
      alternatives: [`import math
print(math.sqrt(25), round(math.pi, 3))`],
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "Output '5.0 3.142'", expr: "_lines == ['5.0 3.142']" },
      ],
      hints: ["Konsep: from-import hanya membawa nama tertentu.", "`math` dan `pi` belum dikenal.", "`from math import sqrt, pi` lalu `sqrt(25)`"],
      explanation: "Dua solusi sama-sama benar: from-import kedua nama, atau `import math` dan pakai awalan `math.`.",
    },
    {
      id: "py-import-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Sampel acak yang reproducible",
      prompt: [
        "Import `random`. Atur seed 123, lalu ambil 3 elemen acak dari `kelas = [\"A\", \"B\", \"C\", \"D\", \"E\"]` dengan `random.sample(kelas, 3)` dan simpan ke `sampel`.",
        "Cetak `sampel`. (Test akan memeriksa hasilnya sama dengan seed 123.)",
      ],
      starter: `kelas = ["A", "B", "C", "D", "E"]
# Tulis kodemu di sini
`,
      solution: `import random
kelas = ["A", "B", "C", "D", "E"]
random.seed(123)
sampel = random.sample(kelas, 3)
print(sampel)`,
      tests: [
        { desc: "sampel berisi 3 elemen unik dari kelas", expr: "len(sampel) == 3 and len(set(sampel)) == 3 and set(sampel) <= set(kelas)" },
        { desc: "Hasil sesuai seed 123 (reproducible)", expr: "(__import__('random').seed(123) or True) and sampel == __import__('random').sample(kelas, 3)" },
      ],
      hints: ["Konsep: seed untuk reproducibility.", "Panggil `random.seed(123)` sebelum `random.sample`.", "`sampel = random.sample(kelas, 3)`"],
      explanation: "Dengan seed yang sama, `random.sample` selalu memilih elemen yang sama — prinsip `random_state` di scikit-learn.",
    },
    {
      id: "py-import-ex5",
      type: "code",
      kind: "write",
      level: 5,
      title: "Apply — Statistik dengan modul statistics",
      prompt: [
        "Diberikan nilai ujian `nilai = [72, 85, 90, 66, 85, 78]`. Import `statistics` dengan alias `st`.",
        "Hitung `mean`, `median`, `modus` (`st.mode`), dan `stdev` (dibulatkan 2 desimal). Cetak:\n`mean=79.33 median=81.5 mode=85 stdev=9.07`",
      ],
      starter: `nilai = [72, 85, 90, 66, 85, 78]
# Tulis kodemu di sini
`,
      solution: `import statistics as st
nilai = [72, 85, 90, 66, 85, 78]
mean = st.mean(nilai)
median = st.median(nilai)
modus = st.mode(nilai)
stdev = round(st.stdev(nilai), 2)
print(f"mean={mean:.2f} median={median} mode={modus} stdev={stdev}")`,
      tests: [
        { desc: "Memakai alias st", expr: "'import statistics as st' in _code" },
        { desc: "median = 81.5 dan modus = 85", expr: "median == 81.5 and modus == 85" },
        { desc: "Output sesuai", expr: "_lines == ['mean=79.33 median=81.5 mode=85 stdev=9.07']" },
      ],
      hints: ["Konsep: modul statistics.", "Fungsi: mean, median, mode, stdev.", "Format mean dengan `:.2f`."],
      explanation: "Module 05 akan menjelaskan arti setiap ukuran ini dan perhitungan manualnya.",
    },
  ],
  quiz: [
    { id: "py-import-q1", type: "mcq", prompt: "Alias standar untuk `import pandas` adalah…", options: ["pa", "pd", "pnd", "pandas"], answer: 1, explanation: "`import pandas as pd`." },
    { id: "py-import-q2", type: "predict", prompt: "Apa outputnya?", code: `from math import sqrt as akar\nprint(akar(81))`, options: ["9", "9.0", "81", "Error"], answer: 1, explanation: "Alias boleh dipakai untuk nama hasil from-import. sqrt menghasilkan float." },
    { id: "py-import-q3", type: "tf", prompt: "`math` dan `random` harus diinstal dengan pip sebelum dipakai.", answer: false, explanation: "Keduanya bagian dari standard library." },
    { id: "py-import-q4", type: "fill", prompt: "Lengkapi agar hasil acak bisa diulang: `random.____(42)`", answer: ["seed"], explanation: "`random.seed(42)`." },
    { id: "py-import-q5", type: "case", prompt: "Di notebook teman, muncul `ModuleNotFoundError: No module named 'xgboost'`. Apa langkah pertama yang paling tepat?", options: ["Ganti nama variabel", "Pastikan library sudah diinstal (pip install xgboost) dan ejaannya benar", "Hapus semua import", "Restart komputer"], answer: 1, explanation: "Error ini berarti Python tidak menemukan modul — belum diinstal atau salah ketik." },
  ],
  challenge: {
    id: "py-import-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Simulasi split acak",
    prompt: [
      "Simulasikan `train_test_split` sederhana:",
      "1. Import `random` dan `math`.",
      "2. `data = list(range(1, 21))` (20 sampel). Atur `random.seed(42)`, lalu acak dengan `random.shuffle(data)`.",
      "3. `n_test = math.ceil(len(data) * 0.25)`; `test = data[:n_test]`, `train = data[n_test:]`.",
      "Cetak `Train: 15 | Test: 5` lalu cetak `sorted(test)`.",
    ],
    starter: `# Tulis kodemu di sini
`,
    solution: `import random
import math

data = list(range(1, 21))
random.seed(42)
random.shuffle(data)
n_test = math.ceil(len(data) * 0.25)
test = data[:n_test]
train = data[n_test:]
print(f"Train: {len(train)} | Test: {len(test)}")
print(sorted(test))`,
    tests: [
      { desc: "n_test = 5", expr: "n_test == 5" },
      { desc: "train dan test tidak tumpang tindih dan lengkap", expr: "sorted(train + test) == list(range(1, 21)) and not set(train) & set(test)" },
      { desc: "Hasil acak sesuai seed 42", expr: "(lambda r: (r.seed(42), r.shuffle(d := list(range(1, 21))), d[:5])[2])(__import__('random')) == test" },
      { desc: "Baris pertama output", expr: "len(_lines) == 2 and _lines[0] == 'Train: 15 | Test: 5'" },
    ],
    hints: ["Konsep: import, seed, shuffle, ceil, slicing.", "`random.seed(42)` harus dipanggil sebelum `shuffle`.", "`test = data[:n_test]` dan `train = data[n_test:]`."],
    explanation: "Inilah logika inti `train_test_split(shuffle=True, random_state=42)`: acak dengan seed tetap, lalu potong. scikit-learn memakai generator acak NumPy, sehingga hasil persisnya berbeda, tetapi prinsipnya sama.",
  },
  summary: [
    "Module = file Python; package = kumpulan module; library = package siap pakai.",
    "`import m`, `import m as alias`, `from m import nama`.",
    "Modul standar: `math`, `random`, `statistics`, `csv`, `json`.",
    "Alias Data Science: `np`, `pd`, `plt`, `sns`.",
    "`random.seed()` membuat hasil acak reproducible — sama dengan `random_state`.",
  ],
  cheatsheet: [
    { syntax: "import numpy as np", desc: "NumPy" },
    { syntax: "import pandas as pd", desc: "Pandas" },
    { syntax: "import matplotlib.pyplot as plt", desc: "Matplotlib" },
    { syntax: "from sklearn.model_selection import train_test_split", desc: "Import fungsi scikit-learn" },
    { syntax: "random.seed(42)", desc: "Reproducibility" },
    { syntax: "math.ceil(x), math.sqrt(x)", desc: "Fungsi math" },
  ],
  flashcards: [
    { q: "Import pandas dengan alias standar", a: "import pandas as pd" },
    { q: "Import pyplot dari matplotlib dengan alias standar", a: "import matplotlib.pyplot as plt" },
    { q: "Import fungsi train_test_split", a: "from sklearn.model_selection import train_test_split" },
    { q: "Buat hasil random dapat diulang", a: "random.seed(42)" },
  ],
  references: [
    pyDoc("The Python Tutorial — 6. Modules", "tutorial/modules.html"),
    pyDoc("The Python Library Reference — math", "library/math.html"),
    pyDoc("The Python Library Reference — random", "library/random.html"),
    pyDoc("The Python Library Reference — statistics", "library/statistics.html"),
    kagglePy("Working with External Libraries (Kaggle Learn Python)", "working-with-external-libraries"),
  ],
};
