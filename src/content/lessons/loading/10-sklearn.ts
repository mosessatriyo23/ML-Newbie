import type { Lesson } from "../../../types.ts";
import { sklearnDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "load-loading-dataset-from-scikit-learn",
  title: "Loading Dataset from Scikit-learn",
  minutes: 35,
  prerequisites: ["load-features-and-target"],
  objectives: [
    "Memuat toy dataset bawaan scikit-learn: `load_iris`, `load_wine`, `load_breast_cancer`, `load_diabetes`, `load_digits`.",
    "Memahami objek **Bunch**: `data`, `target`, `feature_names`, `target_names`, `DESCR`.",
    "Mendapatkan DataFrame langsung dengan `as_frame=True` atau `return_X_y=True`.",
    "Membuat dataset sintetis dengan `make_classification`, `make_regression`, dan `make_blobs`.",
  ],
  definition: [
    "Modul `sklearn.datasets` menyediakan tiga jenis dataset:\n- **Toy datasets** (`load_*`) — dataset kecil yang ikut terpasang bersama scikit-learn, tidak perlu internet: iris, wine, breast_cancer, diabetes, digits\n- **Real-world datasets** (`fetch_*`) — diunduh dari internet saat pertama dipakai (california_housing, 20newsgroups, openml)\n- **Generated datasets** (`make_*`) — data sintetis dengan sifat yang bisa diatur",
    "Fungsi `load_*` mengembalikan objek **Bunch** (mirip dictionary yang bisa diakses dengan titik): `data` (fitur X sebagai array), `target` (y), `feature_names`, `target_names` (nama kelas), dan `DESCR` (dokumentasi lengkap, termasuk sumber dan referensi).",
    "`as_frame=True` mengembalikan `data` sebagai DataFrame dan `frame` berisi X + y; `return_X_y=True` langsung mengembalikan tuple `(X, y)`.",
    "Di situs ini, toy datasets dan generator `make_*` berjalan penuh karena tidak membutuhkan internet. Fungsi `fetch_*` membutuhkan internet (gunakan di Colab/Jupyter).",
  ],
  why: [
    "Toy datasets bersih, terdokumentasi, dan langsung berbentuk X/y — ideal untuk mencoba algoritma baru, memahami API scikit-learn, dan membuat contoh yang bisa diulang siapa saja.",
    "Dataset sintetis (`make_*`) memungkinkan kita mengontrol kesulitan masalah (jumlah fitur informatif, noise, ketidakseimbangan kelas) untuk memahami perilaku model secara eksperimen.",
  ],
  when: [
    "- Belajar atau menguji algoritma baru.",
    "- Membuat contoh minimal yang bisa direproduksi (misalnya saat bertanya di forum).",
    "- Menguji pipeline sebelum data asli tersedia.",
    "- Eksperimen: bagaimana model bereaksi terhadap noise atau imbalance.",
  ],
  analogy: "Toy datasets seperti **set latihan alat musik yang sudah disetel** — kamu bisa langsung berlatih teknik tanpa repot menyetel senar. Setelah mahir, barulah berlatih dengan \"lagu nyata\" (dataset dunia nyata yang berantakan).",
  syntax: {
    code: `from sklearn.datasets import load_iris, make_classification

iris = load_iris()                     # Bunch
X, y = iris.data, iris.target
df = load_iris(as_frame=True).frame    # DataFrame X + target
X, y = load_iris(return_X_y=True, as_frame=True)
X, y = make_classification(n_samples=500, n_features=5, random_state=42)`,
  },
  anatomy: [
    ["bunch.data / .target", "Fitur dan target."],
    ["bunch.feature_names / .target_names", "Nama fitur dan nama kelas."],
    ["bunch.DESCR", "Dokumentasi dataset."],
    ["as_frame=True", "Hasil berupa DataFrame/Series."],
    ["return_X_y=True", "Langsung (X, y)."],
  ],
  examples: [
    {
      title: "Contoh 1 — Objek Bunch",
      code: `from sklearn.datasets import load_iris

iris = load_iris()
print(type(iris).__name__, list(iris.keys()))
print(iris.data.shape, iris.target.shape)
print(iris.feature_names)
print(iris.target_names, iris.target[:5], iris.target[-5:])
print(iris.DESCR[:150])`,
      output: "Bunch ['data', 'target', 'frame', 'target_names', 'DESCR', 'feature_names', 'filename', 'data_module']\n(150, 4) (150,)\n['sepal length (cm)', 'sepal width (cm)', 'petal length (cm)', 'petal width (cm)']\n['setosa' 'versicolor' 'virginica'] [0 0 0 0 0] [2 2 2 2 2]\n.. _iris_dataset:\n\nIris plants dataset\n--------------------\n\n**Data Set Characteristics:**\n\n:Number of Instances: 150 (50 in each of three classes)\n:N",
      explain: [
        ["iris = load_iris()", "Memuat dataset bawaan tanpa internet."],
        ["iris.data.shape, iris.target.shape", "X (150, 4) dan y (150,) sebagai array NumPy."],
        ["iris.target_names", "y berupa angka 0/1/2; target_names memberi arti setiap angka."],
        ["iris.DESCR[:150]", "Awal dokumentasi dataset — baca lengkapnya untuk sumber dan referensi."],
      ],
    },
    {
      title: "Contoh 2 — Langsung sebagai DataFrame",
      code: `from sklearn.datasets import load_wine

wine = load_wine(as_frame=True)
df = wine.frame
print(df.shape)
print(df.iloc[:3, :5])
print(df["target"].value_counts().sort_index().to_dict())

X, y = load_wine(return_X_y=True, as_frame=True)
print(type(X).__name__, X.shape, type(y).__name__, y.name)`,
      output: "(178, 14)\n   alcohol  malic_acid   ash  alcalinity_of_ash  magnesium\n0    14.23        1.71  2.43               15.6      127.0\n1    13.20        1.78  2.14               11.2      100.0\n2    13.16        2.36  2.67               18.6      101.0\n{0: 59, 1: 71, 2: 48}\nDataFrame (178, 13) Series target",
      explain: [
        ["df = wine.frame", "DataFrame berisi 13 fitur + kolom target."],
        ["df[\"target\"].value_counts()", "Jumlah sampel per kelas (3 kultivar anggur)."],
        ["return_X_y=True, as_frame=True", "Langsung X (DataFrame) dan y (Series)."],
      ],
      change: "Hasil berupa DataFrame pandas, bukan array.",
    },
    {
      title: "Contoh 3 — Mengganti kode target dengan nama kelas",
      code: `import pandas as pd
from sklearn.datasets import load_breast_cancer

bc = load_breast_cancer(as_frame=True)
df = bc.frame.copy()
df["diagnosis"] = pd.Categorical.from_codes(df["target"], bc.target_names)
print(bc.target_names)
print(df["diagnosis"].value_counts().to_dict())
print(df.shape, "|", len(bc.feature_names), "fitur, contoh:", bc.feature_names[:3].tolist())`,
      output: "['malignant' 'benign']\n{'benign': 357, 'malignant': 212}\n(569, 32) | 30 fitur, contoh: ['mean radius', 'mean texture', 'mean perimeter']",
      explain: [
        ["pd.Categorical.from_codes(df[\"target\"], bc.target_names)", "Kode 0/1 diubah ke nama kelas sesuai urutan target_names."],
        ["bc.target_names", "['malignant' 'benign'] — kode 0 = ganas, 1 = jinak (perhatikan: bukan sebaliknya!)."],
      ],
      change: "Arti kode target diambil dari metadata, bukan ditebak.",
    },
    {
      title: "Contoh 4 — Dataset sintetis yang bisa diatur",
      code: `import numpy as np
from sklearn.datasets import make_classification, make_regression, make_blobs

X, y = make_classification(n_samples=1000, n_features=6, n_informative=3,
                           weights=[0.9, 0.1], random_state=42)
print("klasifikasi:", X.shape, np.bincount(y))

X, y = make_regression(n_samples=200, n_features=3, noise=10, random_state=0)
print("regresi:", X.shape, y[:3].round(1))

X, label = make_blobs(n_samples=300, centers=4, random_state=1)
print("clustering:", X.shape, np.bincount(label))`,
      output: "klasifikasi: (1000, 6) [898 102]\nregresi: (200, 3) [ 14.5 -91.  197.3]\nclustering: (300, 2) [75 75 75 75]",
      explain: [
        ["weights=[0.9, 0.1]", "Membuat data imbalanced: 90% kelas 0, 10% kelas 1."],
        ["n_informative=3", "Hanya 3 dari 6 fitur yang benar-benar berguna — sisanya noise/redundan."],
        ["noise=10", "Target linear dari fitur + noise."],
        ["make_blobs(n_samples=300, centers=4", "Kelompok titik untuk latihan clustering."],
      ],
      change: "Data dibuat sendiri dengan sifat yang kita tentukan.",
    },
  ],
  params: [
    {
      title: "Toy datasets",
      items: [
        { name: "load_iris", desc: "150 × 4, klasifikasi 3 kelas (bunga)." },
        { name: "load_wine", desc: "178 × 13, klasifikasi 3 kelas (anggur)." },
        { name: "load_breast_cancer", desc: "569 × 30, klasifikasi biner (tumor)." },
        { name: "load_diabetes", desc: "442 × 10, regresi (perkembangan penyakit)." },
        { name: "load_digits", desc: "1797 × 64, klasifikasi 10 kelas (gambar angka 8×8)." },
        { name: "make_classification / make_regression / make_blobs", desc: "Data sintetis; selalu isi random_state." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `from sklearn.datasets import load_diabetes\nX, y = load_diabetes(return_X_y=True)\nprint(X.shape, y.shape, round(y.mean(), 1))`, output: "(442, 10) (442,) 152.1" },
  tryIt: `from sklearn.datasets import load_digits

digits = load_digits()
print(digits.data.shape, digits.images.shape)
print(digits.images[0])          # gambar 8x8 angka pertama
print("label:", digits.target[0])`,
  mistakes: [
    {
      title: "Mengira load_* mengembalikan DataFrame",
      wrong: `from sklearn.datasets import load_iris
iris = load_iris()
print(iris.head())`,
      error: "AttributeError",
      fix: `from sklearn.datasets import load_iris
df = load_iris(as_frame=True).frame
print(df.head())`,
      explain: "Default hasilnya Bunch berisi array NumPy. Gunakan `as_frame=True` lalu `.frame`.",
    },
    {
      title: "Salah mengartikan kode target",
      wrong: `from sklearn.datasets import load_breast_cancer
bc = load_breast_cancer()
print("Proporsi ganas:", bc.target.mean().round(3))   # salah: 1 = benign`,
      fix: `from sklearn.datasets import load_breast_cancer
bc = load_breast_cancer()
print(bc.target_names)
print("Proporsi ganas:", (bc.target == 0).mean().round(3))`,
      explain: "Selalu cek `target_names`: pada breast_cancer kode 0 = malignant.",
    },
    {
      title: "make_* tanpa random_state",
      wrong: `from sklearn.datasets import make_classification
X1, _ = make_classification(n_samples=5, random_state=None)
X2, _ = make_classification(n_samples=5, random_state=None)
print((X1 == X2).all())   # False — berbeda tiap dijalankan`,
      fix: `from sklearn.datasets import make_classification
X1, _ = make_classification(n_samples=5, random_state=0)
X2, _ = make_classification(n_samples=5, random_state=0)
print((X1 == X2).all())`,
      explain: "Isi random_state agar data sintetis dapat direproduksi.",
    },
  ],
  bestPractices: [
    "Baca `DESCR` untuk mengetahui sumber, satuan, dan arti fitur.",
    "Gunakan `as_frame=True` agar nama kolom ikut terbawa.",
    "Cek `target_names` sebelum menafsirkan target.",
    "Pakai toy datasets untuk belajar, tetapi uji juga pada data nyata — toy datasets jauh lebih bersih daripada dunia nyata.",
  ],
  exercises: [
    {
      id: "load-skl-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — X dan y langsung",
      prompt: "Lengkapi agar `X` dan `y` langsung didapat dari `load_wine`.",
      starter: `from sklearn.datasets import load_wine
X, y = load_wine(____=True)
print(X.shape, y.shape)`,
      solution: `from sklearn.datasets import load_wine
X, y = load_wine(return_X_y=True)
print(X.shape, y.shape)`,
      tests: [{ desc: "Shape benar", expr: "X.shape == (178, 13) and y.shape == (178,)" }],
      hints: ["Konsep: mengembalikan tuple (X, y).", "Parameter return_..._...", "`return_X_y=True`"],
      explanation: "return_X_y=True → (X, y).",
    },
    {
      id: "load-skl-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `from sklearn.datasets import load_iris
iris = load_iris(as_frame=True)
print(iris.frame.shape)
print(iris.target_names[iris.target.iloc[-1]])
print(len(iris.feature_names))`,
      answer: "(150, 5)\nvirginica\n4",
      hints: ["Konsep: frame = fitur + target.", "Baris terakhir iris adalah virginica.", "4 fitur."],
      explanation: "(150, 5); virginica; 4.",
    },
    {
      id: "load-skl-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — DataFrame dari Bunch",
      prompt: "Perbaiki agar `df` adalah DataFrame diabetes lengkap dengan kolom target.",
      starter: `from sklearn.datasets import load_diabetes
df = load_diabetes()
print(df.shape)`,
      solution: `from sklearn.datasets import load_diabetes
df = load_diabetes(as_frame=True).frame
print(df.shape)`,
      tests: [
        { desc: "Tidak ada error", expr: "_error is None" },
        { desc: "DataFrame (442, 11)", expr: "type(df).__name__ == 'DataFrame' and df.shape == (442, 11) and 'target' in df.columns" },
      ],
      hints: ["Konsep: Bunch vs DataFrame.", "Gunakan as_frame=True.", "Ambil atribut `.frame`."],
      explanation: "frame berisi 10 fitur + target.",
    },
    {
      id: "load-skl-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Ringkasan beberapa toy dataset",
      prompt: "Untuk `load_iris`, `load_wine`, `load_breast_cancer`, dan `load_digits`, buat DataFrame `ringkas` dengan kolom `nama`, `n_sampel`, `n_fitur`, `n_kelas` (`len(target_names)`). Cetak `ringkas`.",
      starter: `import pandas as pd
from sklearn.datasets import load_iris, load_wine, load_breast_cancer, load_digits
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
from sklearn.datasets import load_iris, load_wine, load_breast_cancer, load_digits
baris = []
for nama, loader in [("iris", load_iris), ("wine", load_wine), ("breast_cancer", load_breast_cancer), ("digits", load_digits)]:
    b = loader()
    baris.append({"nama": nama, "n_sampel": b.data.shape[0], "n_fitur": b.data.shape[1], "n_kelas": len(b.target_names)})
ringkas = pd.DataFrame(baris)
print(ringkas)`,
      tests: [
        { desc: "4 baris", expr: "ringkas['nama'].tolist() == ['iris', 'wine', 'breast_cancer', 'digits']" },
        { desc: "Nilai benar", expr: "ringkas[['n_sampel', 'n_fitur', 'n_kelas']].values.tolist() == [[150, 4, 3], [178, 13, 3], [569, 30, 2], [1797, 64, 10]]" },
      ],
      hints: ["Konsep: loop atas fungsi loader.", "Fungsi bisa disimpan di list dan dipanggil `loader()`.", "Kumpulkan dict lalu pd.DataFrame."],
      explanation: "Tabel ini membantu memilih dataset latihan sesuai jumlah kelas dan fitur.",
    },
    {
      id: "load-skl-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Bandingkan dengan file CSV",
      prompt: [
        "Situs ini juga menyediakan `breast_cancer.csv`. Muat versi scikit-learn (`as_frame=True`) dan versi CSV. Simpan `sama_jumlah` = apakah jumlah baris sama, dan `prop_ganas_skl` = proporsi kelas malignant di versi scikit-learn (3 desimal).",
        "Cetak kolom-kolom CSV dan bandingkan cara penamaan targetnya.",
      ],
      starter: `import pandas as pd
from sklearn.datasets import load_breast_cancer
# Tulis kodemu di sini
`,
      solution: `import pandas as pd
from sklearn.datasets import load_breast_cancer
bc = load_breast_cancer(as_frame=True)
csv = pd.read_csv("breast_cancer.csv")
sama_jumlah = len(bc.frame) == len(csv)
malignant = list(bc.target_names).index("malignant")
prop_ganas_skl = round((bc.target == malignant).mean(), 3)
print(sama_jumlah, prop_ganas_skl)
print(csv.columns.tolist()[:5], "...", csv.columns.tolist()[-2:])`,
      tests: [
        { desc: "Jumlah baris sama", expr: "sama_jumlah is True or bool(sama_jumlah) is True" },
        { desc: "Proporsi ganas benar", expr: "prop_ganas_skl == round((load_breast_cancer().target == 0).mean(), 3)" },
      ],
      hints: ["Konsep: dataset yang sama dari dua sumber.", "Cari kode malignant dari target_names.", "Proporsi = (target == kode).mean()."],
      explanation: "Sekitar 37% tumor ganas. Dataset yang sama bisa punya format target berbeda di sumber berbeda — selalu periksa.",
    },
  ],
  quiz: [
    { id: "load-skl-q1", type: "mcq", prompt: "Toy dataset scikit-learn untuk regresi?", options: ["load_iris", "load_diabetes", "load_wine", "load_digits"], answer: 1, explanation: "Target diabetes berupa angka kontinu." },
    { id: "load-skl-q2", type: "predict", prompt: "Apa outputnya?", code: `from sklearn.datasets import load_iris\nX, y = load_iris(return_X_y=True)\nprint(X.shape[1], len(set(y)))`, options: ["150 3", "4 3", "4 150", "3 4"], answer: 1, explanation: "4 fitur, 3 kelas." },
    { id: "load-skl-q3", type: "tf", prompt: "Fungsi `fetch_*` di sklearn.datasets dapat dipakai tanpa internet pada pemakaian pertama.", answer: false, explanation: "fetch_* mengunduh data saat pertama dipakai." },
    { id: "load-skl-q4", type: "fill", prompt: "Atribut Bunch yang berisi dokumentasi dataset: `.____`", answer: ["DESCR"], explanation: "DESCR." },
    { id: "load-skl-q5", type: "case", prompt: "Kamu ingin menguji apakah model tetap bagus saat kelas positif hanya 5%. Cara cepat?", options: ["Cari dataset baru", "make_classification(weights=[0.95, 0.05])", "load_iris", "Hapus data"], answer: 1, explanation: "Generator sintetis mengatur tingkat imbalance." },
  ],
  challenge: {
    id: "load-skl-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Fungsi loader seragam",
    prompt: [
      "Tulis fungsi `muat_toy(nama)` yang menerima \"iris\", \"wine\", \"breast_cancer\", atau \"diabetes\" dan mengembalikan `(X, y, info)`:",
      "- X DataFrame, y Series (gunakan `as_frame=True`)\n- untuk klasifikasi, y berisi **nama kelas** (bukan kode) — gunakan `target_names`; untuk diabetes y tetap angka\n- `info` = dict `{\"tugas\": \"klasifikasi\"/\"regresi\", \"n_sampel\", \"n_fitur\"}`\n- nama lain → `raise ValueError(\"Dataset tidak dikenal\")`",
      "Uji untuk keempat dataset dan cetak `info` serta 3 nilai y pertama.",
    ],
    starter: `import pandas as pd
from sklearn import datasets
# Tulis kodemu di sini
`,
    solution: `import pandas as pd
from sklearn import datasets

def muat_toy(nama):
    loader = {"iris": datasets.load_iris, "wine": datasets.load_wine,
              "breast_cancer": datasets.load_breast_cancer, "diabetes": datasets.load_diabetes}.get(nama)
    if loader is None:
        raise ValueError("Dataset tidak dikenal")
    b = loader(as_frame=True)
    X, y = b.data, b.target
    if "target_names" in b:
        y = pd.Series(b.target_names[y], name="target")
        tugas = "klasifikasi"
    else:
        tugas = "regresi"
    return X, y, {"tugas": tugas, "n_sampel": X.shape[0], "n_fitur": X.shape[1]}

for n in ["iris", "wine", "breast_cancer", "diabetes"]:
    X, y, info = muat_toy(n)
    print(n, info, y.head(3).tolist())`,
    tests: [
      { desc: "Info iris benar", expr: "muat_toy('iris')[2] == {'tugas': 'klasifikasi', 'n_sampel': 150, 'n_fitur': 4}" },
      { desc: "y berisi nama kelas", expr: "muat_toy('breast_cancer')[1].iloc[0] == 'malignant' and set(muat_toy('iris')[1]) == {'setosa', 'versicolor', 'virginica'}" },
      { desc: "Diabetes regresi", expr: "muat_toy('diabetes')[2]['tugas'] == 'regresi' and muat_toy('diabetes')[1].dtype.kind == 'f'" },
      { desc: "Nama tidak dikenal", expr: "_raises(muat_toy, 'titanic') == ('ValueError', 'Dataset tidak dikenal')" },
    ],
    hints: ["Konsep: dictionary berisi fungsi.", "`\"target_names\" in b` membedakan klasifikasi dan regresi.", "`b.target_names[y]` memetakan kode ke nama (indexing array NumPy)."],
    explanation: "Loader seragam memudahkan mencoba model yang sama di beberapa dataset dengan satu baris kode.",
  },
  summary: [
    "`load_*` = toy datasets offline; `fetch_*` = unduh dari internet; `make_*` = sintetis.",
    "Bunch berisi data, target, feature_names, target_names, DESCR.",
    "`as_frame=True` → DataFrame; `return_X_y=True` → (X, y).",
    "Selalu cek target_names dan isi random_state untuk make_*.",
  ],
  cheatsheet: [
    { syntax: "load_iris(as_frame=True).frame", desc: "DataFrame lengkap" },
    { syntax: "X, y = load_wine(return_X_y=True)", desc: "X, y langsung" },
    { syntax: "bunch.target_names", desc: "Nama kelas" },
    { syntax: "make_classification(weights=[0.9, 0.1], random_state=0)", desc: "Data imbalanced" },
    { syntax: "make_blobs(centers=4)", desc: "Data clustering" },
  ],
  flashcards: [
    { q: "Muat iris sebagai DataFrame lengkap", a: "load_iris(as_frame=True).frame" },
    { q: "Tiga jenis dataset di sklearn.datasets", a: "load_* (toy), fetch_* (unduhan), make_* (sintetis)" },
    { q: "Arti kode 0 pada load_breast_cancer", a: "malignant (ganas) — cek target_names" },
  ],
  references: [
    sklearnDoc("Dataset loading utilities", "datasets.html"),
    sklearnDoc("Toy datasets", "datasets/toy_dataset.html"),
    sklearnDoc("Generated datasets", "datasets/sample_generators.html"),
    sklearnDoc("sklearn.datasets.load_iris", "modules/generated/sklearn.datasets.load_iris.html"),
  ],
};
