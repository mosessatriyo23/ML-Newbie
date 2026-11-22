import type { Lesson } from "../../../types.ts";
import { numpyDoc } from "../../refs.ts";

export const lesson: Lesson = {
  id: "np-array-data-types",
  title: "Array Data Types",
  minutes: 35,
  prerequisites: ["np-creating-arrays", "py-data-types"],
  objectives: [
    "Membaca tipe elemen array dengan atribut `dtype`.",
    "Mengenal dtype umum: `int64`, `float64`, `bool`, dan string.",
    "Mengubah dtype dengan `astype()` dan memahami risikonya (pemotongan desimal).",
    "Memahami aturan *upcasting* saat tipe dicampur, serta hubungan NaN dengan float.",
  ],
  definition: [
    "Setiap NumPy array punya satu **dtype** (*data type*) yang berlaku untuk semua elemennya. Inilah yang membuat NumPy cepat: komputer tahu persis ukuran setiap angka.",
    "dtype yang paling sering ditemui:\n- `int64` — bilangan bulat 64-bit\n- `float64` — bilangan desimal 64-bit (default untuk hasil pembagian, `zeros`, `linspace`)\n- `bool` — True/False (hasil perbandingan)\n- `<U…` — string Unicode (misalnya `<U6` = teks maksimal 6 karakter)\n- `object` — campuran objek Python (lambat, sebaiknya dihindari)",
    "Jika list berisi tipe campuran, NumPy memilih tipe yang bisa menampung semuanya (*upcasting*): int + float → float; angka + teks → teks.",
    "`astype(tipe)` membuat **array baru** dengan tipe lain. Dari float ke int, bagian desimal **dipotong** (bukan dibulatkan) — sama seperti `int()` di Python.",
  ],
  why: [
    "Model scikit-learn membutuhkan input numerik (int/float). Kolom yang tidak sengaja bertipe string atau object akan menyebabkan error *could not convert string to float*.",
    "NaN (nilai hilang) hanya ada pada tipe float. Mengetahui ini menjelaskan mengapa kolom bilangan bulat di Pandas berubah menjadi float ketika ada missing value.",
    "Untuk data besar, memilih dtype yang tepat (misalnya `float32`) menghemat memori.",
  ],
  when: [
    "- Setelah membaca data: cek apakah kolom angka benar-benar numerik.",
    "- Saat mengubah label boolean menjadi 0/1 (`astype(int)`).",
    "- Saat membulatkan hasil prediksi ke kelas/angka bulat (gunakan `round` dulu, baru `astype`).",
  ],
  analogy: "dtype seperti **ukuran kotak di gudang**. Semua barang dalam satu rak harus memakai ukuran kotak yang sama. Jika satu barang lebih besar (float di antara int, teks di antara angka), semua kotak diganti ke ukuran yang lebih besar agar muat.",
  syntax: {
    code: `arr.dtype                 # cek tipe
np.array([1, 2], dtype=float)
arr.astype(int)           # konversi (array baru)
(arr > 0).astype(int)     # bool -> 0/1`,
  },
  anatomy: [
    ["dtype", "Atribut tipe elemen array."],
    ["dtype=float", "Parameter saat membuat array untuk memaksa tipe."],
    ["astype(int)", "Mengembalikan array baru bertipe int; desimal dipotong."],
    ["np.nan", "Nilai \"bukan angka\" bertipe float untuk menandai data hilang."],
  ],
  examples: [
    {
      title: "Contoh 1 — Memeriksa dtype",
      code: `import numpy as np

print(np.array([1, 2, 3]).dtype)
print(np.array([1.5, 2.0]).dtype)
print(np.array([True, False]).dtype)
print(np.array(["setosa", "virginica"]).dtype)`,
      output: "int32\nfloat64\nbool\n<U9",
      explain: [
        ["np.array([1, 2, 3]).dtype", "Bilangan bulat → int64."],
        ["np.array([1.5, 2.0]).dtype", "Desimal → float64."],
        ["np.array([True, False]).dtype", "Boolean → bool."],
        ["np.array([\"setosa\", \"virginica\"]).dtype", "Teks → string Unicode `<U9` (panjang maksimal 9 karakter)."],
      ],
    },
    {
      title: "Contoh 2 — Upcasting tipe campuran",
      code: `import numpy as np

a = np.array([1, 2, 3.5])
b = np.array([1, 2, "3"])
print(a, a.dtype)
print(b, b.dtype)`,
      output: "[1.  2.  3.5] float64\n['1' '2' '3'] <U11",
      explain: [
        ["a = np.array([1, 2, 3.5])", "int + float → semua menjadi float."],
        ["b = np.array([1, 2, \"3\"])", "angka + teks → semua menjadi teks! Operasi matematika tidak lagi bisa dilakukan."],
      ],
      change: "Kita melihat NumPy menyamakan tipe — kadang menjadi tipe yang tidak kita inginkan.",
    },
    {
      title: "Contoh 3 — astype: konversi tipe",
      code: `import numpy as np

pred = np.array([2.7, 3.2, 4.9])
print(pred.astype(int))
print(pred.round().astype(int))

benar = np.array([True, False, True, True])
print(benar.astype(int), benar.mean())

teks = np.array(["12", "7", "30"])
print(teks.astype(float).sum())`,
      output: "[2 3 4]\n[3 3 5]\n[1 0 1 1] 0.75\n49.0",
      explain: [
        ["pred.astype(int)", "Desimal dipotong: 2.7 → 2 (bukan 3)."],
        ["pred.round().astype(int)", "Bulatkan dulu, baru ubah ke int."],
        ["benar.astype(int), benar.mean()", "Boolean → 0/1; rata-rata boolean = proporsi True (accuracy!)."],
        ["teks.astype(float).sum()", "Teks berisi angka diubah ke float agar bisa dijumlahkan."],
      ],
      change: "astype memberi kontrol penuh atas tipe — dengan risiko pemotongan desimal.",
    },
    {
      title: "Contoh 4 — NaN membutuhkan float",
      code: `import numpy as np

pm25 = np.array([55, 60, np.nan, 70])
print(pm25.dtype)
print(pm25.mean())
print(np.nanmean(pm25))
print(np.isnan(pm25))`,
      output: "float64\nnan\n61.666666666666664\n[False False  True False]",
      explain: [
        ["pm25 = np.array([55, 60, np.nan, 70])", "Ada NaN → array otomatis float64."],
        ["pm25.mean()", "Satu NaN membuat hasil `mean()` menjadi nan."],
        ["np.nanmean(pm25)", "Versi yang mengabaikan NaN."],
        ["np.isnan(pm25)", "Menandai posisi NaN (True)."],
      ],
      change: "Data nyata (misalnya PM2.5 yang tidak tercatat) hampir selalu punya NaN — fungsi `nan*` sangat berguna.",
    },
  ],
  params: [
    {
      title: "Konversi & fungsi NaN",
      items: [
        { name: "arr.astype(dtype)", desc: "Array baru dengan tipe dtype (int, float, bool, str, 'float32', …)." },
        { name: "np.isnan(arr)", desc: "True di posisi NaN." },
        { name: "np.nanmean / np.nansum / np.nanmax", desc: "Statistik yang mengabaikan NaN." },
      ],
    },
  ],
  io: { title: "Input → Output", input: `import numpy as np\nx = np.array([1.9, -1.9])\nprint(x.astype(int), np.round(x).astype(int))`, output: "[ 1 -1] [ 2 -2]", note: "astype memotong ke arah nol: -1.9 menjadi -1." },
  tryIt: `import numpy as np
import pandas as pd

df = pd.read_csv("heart_disease.csv")
ca = df["ca"].to_numpy()
print(ca.dtype)
print("Jumlah NaN:", np.isnan(ca).sum())
print("Rata-rata (abaikan NaN):", np.nanmean(ca).round(3))`,
  mistakes: [
    {
      title: "Matematika pada array string",
      wrong: `import numpy as np
x = np.array(["1", "2", "3"])
print(x.sum())`,
      error: "TypeError",
      fix: `import numpy as np
x = np.array(["1", "2", "3"])
print(x.astype(int).sum())`,
      explain: "Angka dalam bentuk teks harus dikonversi dulu dengan `astype`.",
    },
    {
      title: "astype(int) mengira membulatkan",
      wrong: `import numpy as np
print(np.array([0.9]).astype(int))   # [0], bukan [1]`,
      fix: `import numpy as np
print(np.array([0.9]).round().astype(int))`,
      explain: "astype memotong desimal. Bulatkan terlebih dahulu bila maksudnya pembulatan.",
    },
    {
      title: "Konversi teks bukan angka",
      wrong: `import numpy as np
np.array(["12", "N/A"]).astype(float)`,
      error: "ValueError",
      fix: `import numpy as np
x = np.array(["12", "N/A"])
x = np.where(x == "N/A", "nan", x).astype(float)
print(x)`,
      explain: "Ganti penanda kosong seperti \"N/A\" menjadi \"nan\" lebih dulu. (Di Pandas: `pd.to_numeric(..., errors=\"coerce\")`.)",
    },
  ],
  bestPractices: [
    "Cek `dtype` setiap kali membaca data — pastikan fitur numerik bertipe int/float.",
    "Gunakan `np.nan` untuk nilai hilang dan fungsi `nan*` untuk statistik.",
    "Bulatkan sebelum `astype(int)`.",
    "Hindari dtype `object` untuk data numerik.",
  ],
  exercises: [
    {
      id: "np-dtype-ex1",
      type: "code",
      kind: "fill",
      level: 3,
      title: "Fill in the Blank — Boolean ke 0/1",
      prompt: "Lengkapi agar `label` berisi 0/1 dari array boolean `churn`.",
      starter: `import numpy as np
churn = np.array([True, False, False, True])
label = churn.____(int)
print(label)`,
      solution: `import numpy as np
churn = np.array([True, False, False, True])
label = churn.astype(int)
print(label)`,
      tests: [{ desc: "label == [1, 0, 0, 1] bertipe int", expr: "list(label) == [1, 0, 0, 1] and label.dtype.kind == 'i'" }],
      hints: ["Konsep: konversi tipe.", "Method-nya berarti \"sebagai tipe\".", "`churn.astype(int)`"],
      explanation: "True → 1, False → 0.",
    },
    {
      id: "np-dtype-ex2",
      type: "predict",
      level: 3,
      title: "Predict the Output",
      prompt: "Tulis output kode berikut.",
      code: `import numpy as np
a = np.array([3.99, 5.01])
print(a.astype(int))
print(np.array([1, 2.0]).dtype)
print(np.array([True, True, False]).mean())`,
      answer: "[3 5]\nfloat64\n0.6666666666666666",
      hints: ["Konsep: pemotongan, upcasting, rata-rata boolean.", "3.99 → 3.", "Rata-rata 2 True dari 3."],
      explanation: "astype memotong; campuran int/float → float64; mean boolean = 2/3.",
    },
    {
      id: "np-dtype-ex3",
      type: "code",
      kind: "debug",
      level: 3,
      title: "Debugging — Rata-rata dengan NaN",
      prompt: "`rata` bernilai nan karena ada data hilang. Perbaiki agar rata-rata mengabaikan NaN (hasil 65.0).",
      starter: `import numpy as np
aqi = np.array([60, np.nan, 70])
rata = aqi.mean()
print(rata)`,
      solution: `import numpy as np
aqi = np.array([60, np.nan, 70])
rata = np.nanmean(aqi)
print(rata)`,
      tests: [{ desc: "rata == 65.0", expr: "rata == 65.0" }],
      hints: ["Konsep: NaN menular pada operasi biasa.", "NumPy punya versi fungsi yang mengabaikan NaN.", "`np.nanmean(aqi)`"],
      explanation: "`np.nanmean` mengabaikan NaN saat menghitung rata-rata.",
    },
    {
      id: "np-dtype-ex4",
      type: "code",
      kind: "write",
      level: 4,
      title: "Write Code — Bersihkan kolom teks",
      prompt: "Diberikan `raw = np.array([\"10.5\", \"8.0\", \"12.25\"])`. Ubah menjadi float `nilai`, lalu hitung `total`. Cetak `nilai.dtype` dan `total` (`float64 30.75`).",
      starter: `import numpy as np
raw = np.array(["10.5", "8.0", "12.25"])
# Tulis kodemu di sini
`,
      solution: `import numpy as np
raw = np.array(["10.5", "8.0", "12.25"])
nilai = raw.astype(float)
total = nilai.sum()
print(nilai.dtype, total)`,
      tests: [
        { desc: "nilai bertipe float64", expr: "str(nilai.dtype) == 'float64'" },
        { desc: "total == 30.75", expr: "total == 30.75" },
        { desc: "Output sesuai", expr: "_lines == ['float64 30.75']" },
      ],
      hints: ["Konsep: astype dari teks ke angka.", "`raw.astype(float)`", "Lalu `.sum()`."],
      explanation: "Data hasil scraping/CSV kadang terbaca sebagai teks — astype mengubahnya ke numerik.",
    },
    {
      id: "np-dtype-ex5",
      type: "code",
      kind: "dataset",
      level: 5,
      title: "Apply — Proporsi missing Auto MPG",
      prompt: [
        "Baca `auto_mpg.csv`, ambil kolom `horsepower` sebagai array `hp` (`.to_numpy()`).",
        "Hitung `n_missing` (jumlah NaN), `persen` (persentase NaN, 2 desimal), dan `rata_hp` (rata-rata mengabaikan NaN, 2 desimal). Cetak ketiganya.",
      ],
      starter: `import numpy as np
import pandas as pd
# Tulis kodemu di sini
`,
      solution: `import numpy as np
import pandas as pd
hp = pd.read_csv("auto_mpg.csv")["horsepower"].to_numpy()
n_missing = np.isnan(hp).sum()
persen = round(n_missing / len(hp) * 100, 2)
rata_hp = round(np.nanmean(hp), 2)
print(n_missing, persen, rata_hp)`,
      tests: [
        { desc: "n_missing == 6", expr: "n_missing == 6" },
        { desc: "persen ≈ 1.51", expr: "abs(persen - 1.51) < 0.01" },
        { desc: "rata_hp sesuai data", expr: "abs(rata_hp - round(__import__('numpy').nanmean(hp), 2)) < 1e-9" },
      ],
      hints: ["Konsep: isnan dan nanmean pada data nyata.", "`np.isnan(hp).sum()` menghitung NaN.", "`np.nanmean(hp)`"],
      explanation: "Langkah awal analisis missing value: berapa banyak dan berapa persen data yang hilang.",
    },
  ],
  quiz: [
    { id: "np-dtype-q1", type: "mcq", prompt: "dtype dari `np.array([1, 2, 3]) / 2` adalah…", options: ["int64", "float64", "bool", "object"], answer: 1, explanation: "Pembagian `/` menghasilkan float." },
    { id: "np-dtype-q2", type: "predict", prompt: "Apa outputnya?", code: `import numpy as np\nprint(np.array([7.8, -2.5]).astype(int))`, options: ["[8 -3]", "[ 7 -2]", "[7 -3]", "[8 -2]"], answer: 1, explanation: "Dipotong ke arah nol: 7 dan -2." },
    { id: "np-dtype-q3", type: "tf", prompt: "Array bertipe int64 dapat menyimpan np.nan.", answer: false, explanation: "NaN adalah float; array integer tidak bisa menyimpannya." },
    { id: "np-dtype-q4", type: "fill", prompt: "Fungsi untuk menghitung rata-rata sambil mengabaikan NaN: `np.____(arr)`", answer: ["nanmean"], explanation: "`np.nanmean`." },
    { id: "np-dtype-q5", type: "case", prompt: "Saat `model.fit(X, y)` muncul *could not convert string to float: '12,5'*. Penyebab paling mungkin?", options: ["Model salah", "Ada kolom numerik yang masih bertipe teks (desimal memakai koma)", "Data terlalu kecil", "Perlu GPU"], answer: 1, explanation: "Bersihkan dan konversi kolom ke numerik sebelum melatih model." },
  ],
  challenge: {
    id: "np-dtype-challenge",
    type: "code",
    kind: "write",
    level: 5,
    title: "Mini Challenge — Akurasi dari array boolean",
    prompt: [
      "Diberikan `y_true` dan `y_pred` (8 label). Buat `cocok = y_true == y_pred` (array boolean).",
      "Hitung `accuracy` = rata-rata `cocok`, dan `n_salah` = jumlah elemen False (gunakan `astype` atau `~`). Cetak `Accuracy: 0.75 | Salah: 2`.",
    ],
    starter: `import numpy as np
y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 0, 1, 0, 1, 1, 0])
# Tulis kodemu di sini
`,
    solution: `import numpy as np
y_true = np.array([1, 0, 1, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 0, 1, 0, 1, 1, 0])
cocok = y_true == y_pred
accuracy = cocok.mean()
n_salah = (~cocok).astype(int).sum()
print(f"Accuracy: {accuracy} | Salah: {n_salah}")`,
    tests: [
      { desc: "cocok bertipe bool", expr: "cocok.dtype == bool" },
      { desc: "accuracy == 0.75", expr: "accuracy == 0.75" },
      { desc: "n_salah == 2", expr: "n_salah == 2" },
      { desc: "Output sesuai", expr: "_lines == ['Accuracy: 0.75 | Salah: 2']" },
    ],
    hints: ["Konsep: rata-rata boolean = proporsi True.", "`cocok.mean()`", "`~cocok` membalik True/False; jumlahkan dengan `.sum()`."],
    explanation: "Inilah yang dilakukan `accuracy_score` dari scikit-learn.",
  },
  summary: [
    "Setiap array punya satu `dtype`: int64, float64, bool, string, object.",
    "Tipe campuran di-upcast; angka + teks menjadi teks.",
    "`astype()` membuat array baru; float → int memotong desimal.",
    "NaN hanya ada di float; gunakan `np.isnan` dan `np.nanmean`.",
    "Rata-rata array boolean = proporsi True.",
  ],
  cheatsheet: [
    { syntax: "arr.dtype", desc: "Cek tipe" },
    { syntax: "arr.astype(float)", desc: "Konversi tipe" },
    { syntax: "(a > 0).astype(int)", desc: "Boolean → 0/1" },
    { syntax: "np.isnan(a).sum()", desc: "Jumlah NaN" },
    { syntax: "np.nanmean(a)", desc: "Rata-rata tanpa NaN" },
  ],
  flashcards: [
    { q: "Cek tipe elemen array a", a: "a.dtype" },
    { q: "Ubah array teks angka menjadi float", a: "a.astype(float)" },
    { q: "Hitung jumlah NaN di array a", a: "np.isnan(a).sum()" },
  ],
  references: [
    numpyDoc("Data types", "user/basics.types.html"),
    numpyDoc("numpy.ndarray.astype", "reference/generated/numpy.ndarray.astype.html"),
    numpyDoc("numpy.nanmean", "reference/generated/numpy.nanmean.html"),
    numpyDoc("numpy.isnan", "reference/generated/numpy.isnan.html"),
  ],
};
