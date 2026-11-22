import type { ExamDef } from "../../types.ts";

// Diagnostic Pre-Test: 30 soal lintas materi untuk menentukan titik awal belajar.
// Soal bertipe "predict" diverifikasi dengan menjalankan kodenya (scripts/test-content.ts).
export const DIAGNOSTIC: ExamDef = {
  id: "diagnostic",
  title: "Diagnostic Pre-Test",
  description: "30 soal untuk memetakan kemampuan awalmu di Python, NumPy, Pandas, statistika dasar, EDA, preprocessing, modelling, dan evaluasi. Hasilnya dipakai untuk merekomendasikan modul awal. Jawab jujur — tidak apa-apa jika belum tahu.",
  kind: "diagnostic",
  pick: 30,
  timeLimitMin: 40,
  available: true,
  questions: [
    // ---------- Python (6) ----------
    { id: "dg-py1", type: "predict", skill: "python", lessonId: "py-list", prompt: "Apa output kode berikut?", code: `data = [10, 20, 30, 40]\nprint(data[1:3])`, options: ["[10, 20]", "[20, 30]", "[20, 30, 40]", "[10, 20, 30]"], answer: 1, explanation: "Slicing [1:3] mengambil index 1 dan 2." },
    { id: "dg-py2", type: "mcq", skill: "python", lessonId: "py-data-types", prompt: "Tipe data dari `3.0` adalah…", options: ["int", "float", "str", "bool"], answer: 1, explanation: "Angka dengan titik desimal adalah float." },
    { id: "dg-py3", type: "predict", skill: "python", lessonId: "py-for-loop", prompt: "Apa output kode berikut?", code: `total = 0\nfor i in range(3):\n    total += i\nprint(total)`, options: ["3", "6", "0", "2"], answer: 0, explanation: "0 + 1 + 2 = 3." },
    { id: "dg-py4", type: "mcq", skill: "python", lessonId: "py-dictionary", prompt: "Cara mengambil value key `\"age\"` dari dictionary `d` tanpa error jika key tidak ada?", options: ["d[\"age\"]", "d.get(\"age\")", "d.age", "d(\"age\")"], answer: 1, explanation: "`.get()` mengembalikan None jika key tidak ada." },
    { id: "dg-py5", type: "predict", skill: "python", lessonId: "py-functions", prompt: "Apa output kode berikut?", code: `def f(x, n=2):\n    return x ** n\nprint(f(3), f(2, n=3))`, options: ["9 8", "6 6", "9 6", "8 9"], answer: 0, explanation: "3² = 9, 2³ = 8." },
    { id: "dg-py6", type: "tf", skill: "python", lessonId: "py-error-handling", prompt: "Blok `except ValueError:` akan menangkap error dari `int(\"abc\")`.", answer: true, explanation: "`int(\"abc\")` memunculkan ValueError." },
    // ---------- NumPy (3) ----------
    { id: "dg-np1", type: "predict", skill: "numpy", lessonId: "np-array-operations", prompt: "Apa output kode berikut?", code: `import numpy as np\na = np.array([1, 2, 3])\nprint(a * 2)`, options: ["[1, 2, 3, 1, 2, 3]", "[2 4 6]", "[1 2 3 1 2 3]", "Error"], answer: 1, explanation: "Operasi NumPy bersifat element-wise (vectorized)." },
    { id: "dg-np2", type: "predict", skill: "numpy", lessonId: "np-array-shape", prompt: "Apa output kode berikut?", code: `import numpy as np\nm = np.zeros((2, 3))\nprint(m.shape)`, options: ["(3, 2)", "(2, 3)", "6", "(2,)"], answer: 1, explanation: "2 baris × 3 kolom." },
    { id: "dg-np3", type: "predict", skill: "numpy", lessonId: "np-boolean-indexing", prompt: "Apa output kode berikut?", code: `import numpy as np\nx = np.array([5, 12, 7, 20])\nprint(x[x > 6])`, options: ["[12  7 20]", "[12, 7, 20]", "[False  True  True  True]", "[5]"], answer: 0, explanation: "Boolean indexing memilih elemen yang memenuhi kondisi. NumPy mencetak array tanpa koma dan menyejajarkan lebar angka (karena itu ada dua spasi sebelum 7)." },
    // ---------- Pandas (4) ----------
    { id: "dg-pd1", type: "mcq", skill: "pandas", lessonId: "load-loading-csv-files", prompt: "Fungsi Pandas untuk membaca file CSV adalah…", options: ["pd.open_csv()", "pd.read_csv()", "pd.load()", "pd.csv()"], answer: 1, explanation: "`pd.read_csv(\"file.csv\")`." },
    { id: "dg-pd2", type: "predict", skill: "pandas", lessonId: "load-df-shape", prompt: "Apa output kode berikut?", code: `import pandas as pd\ndf = pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})\nprint(df.shape)`, options: ["(2, 3)", "(3, 2)", "6", "(3,)"], answer: 1, explanation: "3 baris, 2 kolom." },
    { id: "dg-pd3", type: "mcq", skill: "pandas", lessonId: "pd-filtering-data", prompt: "Cara memilih baris dengan umur di atas 30?", options: ["df[df[\"age\"] > 30]", "df.filter(age > 30)", "df[\"age\" > 30]", "df.where(\"age\", 30)"], answer: 0, explanation: "Boolean indexing: kondisi di dalam kurung siku." },
    { id: "dg-pd4", type: "predict", skill: "pandas", lessonId: "pd-groupby", prompt: "Apa output kode berikut?", code: `import pandas as pd\ndf = pd.DataFrame({"kota": ["A", "B", "A"], "nilai": [10, 20, 30]})\nprint(df.groupby("kota")["nilai"].mean().to_dict())`, options: ["{'A': 20.0, 'B': 20.0}", "{'A': 40, 'B': 20}", "{'A': 15.0, 'B': 20.0}", "{'A': 20.0}"], answer: 0, explanation: "Rata-rata A = (10 + 30) / 2 = 20; B = 20." },
    // ---------- Statistics (4) ----------
    { id: "dg-st1", type: "mcq", skill: "statistics", lessonId: "stat-median", prompt: "Median dari data 3, 9, 1, 7, 5 adalah…", options: ["5", "7", "4", "25"], answer: 0, explanation: "Urutkan: 1, 3, 5, 7, 9 → nilai tengah 5." },
    { id: "dg-st2", type: "tf", skill: "statistics", lessonId: "stat-mean", prompt: "Mean lebih terpengaruh outlier dibanding median.", answer: true, explanation: "Mean menjumlahkan semua nilai sehingga nilai ekstrem menariknya." },
    { id: "dg-st3", type: "mcq", skill: "statistics", lessonId: "stat-correlation", prompt: "Koefisien korelasi Pearson -0.9 menunjukkan…", options: ["Hubungan lemah", "Hubungan linear kuat dan berlawanan arah", "Tidak ada hubungan", "Hubungan sebab-akibat"], answer: 1, explanation: "Mendekati -1 = hubungan linear negatif yang kuat. Korelasi bukan kausalitas." },
    { id: "dg-st4", type: "mcq", skill: "statistics", lessonId: "stat-normal-distribution", prompt: "Pada distribusi normal, sekitar berapa persen data berada dalam ±1 standar deviasi dari mean?", options: ["50%", "68%", "95%", "99.7%"], answer: 1, explanation: "Aturan 68–95–99.7." },
    // ---------- EDA (3) ----------
    { id: "dg-eda1", type: "mcq", skill: "eda", lessonId: "eda-boxplot", prompt: "Grafik yang paling tepat untuk melihat outlier pada satu fitur numerik adalah…", options: ["Pie chart", "Boxplot", "Line chart", "Countplot"], answer: 1, explanation: "Boxplot menampilkan kuartil dan titik di luar 1.5×IQR." },
    { id: "dg-eda2", type: "mcq", skill: "eda", lessonId: "eda-missing-value-analysis", prompt: "Kode untuk menghitung jumlah missing value setiap kolom adalah…", options: ["df.isnull().sum()", "df.missing()", "df.count_na()", "df.null()"], answer: 0, explanation: "`isnull()` menghasilkan True/False, `sum()` menjumlahkannya per kolom." },
    { id: "dg-eda3", type: "case", skill: "eda", lessonId: "eda-scatter-plot", prompt: "Kamu ingin melihat hubungan jam belajar dan nilai ujian (keduanya numerik). Grafik yang tepat?", options: ["Histogram", "Scatter plot", "Bar chart", "Pie chart"], answer: 1, explanation: "Scatter plot untuk hubungan dua variabel numerik." },
    // ---------- Preprocessing & splitting (4) ----------
    { id: "dg-pp1", type: "mcq", skill: "preprocessing", lessonId: "prep-one-hot-encoding", prompt: "Teknik untuk mengubah kategori tanpa urutan (misalnya nama kota) menjadi angka adalah…", options: ["Label encoding berurutan", "One-hot encoding", "Standardization", "Normalization"], answer: 1, explanation: "One-hot encoding tidak menciptakan urutan palsu." },
    { id: "dg-pp2", type: "case", skill: "preprocessing", lessonId: "split-data-leakage", prompt: "Kapan StandardScaler sebaiknya di-fit?", options: ["Pada seluruh data sebelum split", "Hanya pada training data, lalu transform train dan test", "Hanya pada test data", "Tidak perlu fit"], answer: 1, explanation: "Fit pada seluruh data menyebabkan data leakage dari test set." },
    { id: "dg-pp3", type: "mcq", skill: "preprocessing", lessonId: "prep-standardization", prompt: "Algoritma mana yang paling dipengaruhi skala fitur?", options: ["Decision Tree", "Random Forest", "KNN", "Semua sama saja"], answer: 2, explanation: "KNN memakai jarak, sehingga fitur berskala besar mendominasi." },
    { id: "dg-pp4", type: "mcq", skill: "preprocessing", lessonId: "split-train-test-split", prompt: "Fungsi scikit-learn untuk membagi data latih dan uji adalah…", options: ["split_data()", "train_test_split()", "divide()", "cross_split()"], answer: 1, explanation: "`from sklearn.model_selection import train_test_split`." },
    // ---------- Modelling / fundamentals (3) ----------
    { id: "dg-ml1", type: "mcq", skill: "fundamentals", lessonId: "intro-regression-vs-classification-vs-clustering", prompt: "Memprediksi harga rumah termasuk jenis tugas…", options: ["Klasifikasi", "Regresi", "Clustering", "Reinforcement learning"], answer: 1, explanation: "Target berupa angka kontinu → regresi." },
    { id: "dg-ml2", type: "tf", skill: "fundamentals", lessonId: "mlf-overfitting", prompt: "Model dengan akurasi train 100% tetapi akurasi test 60% kemungkinan mengalami overfitting.", answer: true, explanation: "Selisih besar train vs test adalah tanda overfitting." },
    { id: "dg-ml3", type: "mcq", skill: "fundamentals", lessonId: "mlf-fit", prompt: "Method scikit-learn untuk melatih model adalah…", options: ["model.train()", "model.fit(X_train, y_train)", "model.learn()", "model.predict()"], answer: 1, explanation: "Pola API scikit-learn: fit → predict." },
    // ---------- Evaluation (3) ----------
    { id: "dg-ev1", type: "case", skill: "evaluation", lessonId: "eval-recall", prompt: "Pada deteksi penyakit, kesalahan paling berbahaya adalah pasien sakit diprediksi sehat. Metrik yang paling perlu diperhatikan?", options: ["Precision", "Recall", "Accuracy", "R²"], answer: 1, explanation: "Recall mengukur berapa banyak kasus positif yang berhasil ditemukan (menekan false negative)." },
    { id: "dg-ev2", type: "mcq", skill: "evaluation", lessonId: "eval-mae", prompt: "Metrik evaluasi untuk regresi adalah…", options: ["F1-score", "MAE", "Precision", "ROC-AUC"], answer: 1, explanation: "MAE (Mean Absolute Error) untuk regresi." },
    { id: "dg-ev3", type: "tf", skill: "evaluation", lessonId: "eval-accuracy", prompt: "Pada data dengan 95% kelas negatif, model yang selalu menebak negatif mendapat accuracy 95% sehingga pasti model yang baik.", answer: false, explanation: "Accuracy menyesatkan pada data tidak seimbang; recall kelas positifnya 0." },
  ],
};
