export interface ProjectBrief {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  task: string;
  problem: string;
  goal: string;
  dataset?: string;
  datasetNote?: string;
  /** Materi terkait (rekomendasi, bukan syarat — semua proyek bebas dikerjakan). */
  prerequisites: string[];
  phase: number;
  /** Langkah kerja proyek. */
  checklist?: string[];
  /** Kode awal yang sudah diuji: memuat data, mendefinisikan X/y, dan split. */
  starter?: string;
}

// Ringkasan proyek (problem statement, tujuan, dataset). Panduan, starter code, checklist, dan solusi
// ditambahkan ketika seluruh materi prasyarat sudah tersedia.
export const PROJECTS: ProjectBrief[] = [
  {
    id: "student-score",
    checklist: ["Baca data dictionary; catat bahwa G1/G2 sangat berkorelasi dengan G3", "EDA: distribusi G3 (perhatikan nilai 0) dan korelasi fitur numerik", "Pisahkan X dan y, lalu train_test_split", "Latih LinearRegression; evaluasi MAE dan R² pada test set", "Bandingkan model dengan dan tanpa G1/G2, jelaskan perbedaannya", "Coba tambahkan fitur kategorikal dengan one-hot encoding"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("student_performance.csv")
print(df.shape)
print(df[["studytime", "failures", "absences", "G1", "G2", "G3"]].describe().round(2))

# Target: nilai akhir G3 (0–20). Mulai dari fitur numerik sederhana.
fitur = ["studytime", "failures", "absences", "G1", "G2"]
X = df[fitur]
y = df["G3"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: latih LinearRegression, hitung MAE & R² pada test set,
#       lalu ulangi TANPA G1 dan G2 — apa yang berubah?`,
    title: "Student Score Prediction",
    level: "Beginner",
    task: "Regression",
    problem: "Sekolah di Portugal ingin memperkirakan nilai akhir matematika (G3) siswa dari latar belakang, kebiasaan belajar, dan nilai periode sebelumnya agar dapat memberi bimbingan lebih awal.",
    goal: "Membangun model regresi linear dan mengevaluasinya dengan MAE dan R²; bandingkan model dengan dan tanpa G1/G2.",
    dataset: "student_performance.csv",
    prerequisites: ["py-variables", "pd-introduction-to-pandas", "load-loading-csv-files", "eda-scatter-plot", "split-train-test-split", "reg-simple-linear-regression", "reg-mae", "reg-r2-score"],
    phase: 2,
  },
  {
    id: "salary",
    checklist: ["Pahami target (>50K) dan ketidakseimbangan kelas", "Tangani missing value di workclass, occupation, native_country", "One-hot encoding fitur kategorikal; scaling fitur numerik", "Latih Logistic Regression di dalam Pipeline", "Evaluasi dengan classification report, bukan hanya accuracy", "Interpretasikan 5 koefisien terbesar"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("adult_income.csv")
print(df.shape)
print(df["income"].value_counts(normalize=True).round(3))
print("Missing per kolom:")
print(df.isnull().sum()[lambda s: s > 0])

X = df.drop(columns=["income"])
y = (df["income"] == ">50K").astype(int)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: ColumnTransformer (imputer + one-hot untuk kategorikal, scaler untuk numerik)
#       + LogisticRegression; evaluasi precision, recall, F1.`,
    title: "Salary Prediction (Census Income)",
    level: "Beginner",
    task: "Binary classification",
    problem: "Memperkirakan apakah pendapatan seseorang di atas $50K/tahun dari pendidikan, pekerjaan, dan jam kerja (data sensus AS 1994).",
    goal: "Menangani missing value dan fitur kategorikal, melatih Logistic Regression, dan menginterpretasikan koefisien.",
    dataset: "adult_income.csv",
    prerequisites: ["load-features-and-target", "split-train-test-split", "reg-multiple-linear-regression", "reg-rmse"],
    phase: 2,
  },
  {
    id: "iris",
    checklist: ["EDA: pairplot per spesies — fitur mana yang paling memisahkan?", "Split stratified", "KNN dengan scaling; coba beberapa nilai K", "Decision Tree dengan max_depth kecil", "Bandingkan accuracy dan confusion matrix", "Jelaskan spesies mana yang paling sering tertukar"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("iris.csv")
print(df["species"].value_counts())
print(df.groupby("species").mean().round(2))

X = df.drop(columns="species")
y = df["species"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: latih KNN (dengan StandardScaler) dan DecisionTree,
#       bandingkan accuracy dan confusion matrix.`,
    title: "Iris Flower Classification",
    level: "Beginner",
    task: "Multiclass classification",
    problem: "Ahli botani ingin mengidentifikasi spesies bunga iris secara otomatis dari ukuran kelopak dan mahkota.",
    goal: "Melatih KNN dan Decision Tree, membandingkan accuracy dan confusion matrix.",
    dataset: "iris.csv",
    prerequisites: ["eda-pairplot", "split-stratified-splitting", "clf-k-nearest-neighbors-knn", "clf-decision-tree", "eval-confusion-matrix", "eval-accuracy"],
    phase: 2,
  },
  {
    id: "breast-cancer",
    checklist: ["Tentukan kelas positif (malignant) dan alasannya", "Split stratified", "Pipeline scaling + Logistic Regression dan SVM", "Pilih model dengan cross-validation (scoring recall)", "Evaluasi sekali pada test set; laporkan false negative", "Coba turunkan threshold untuk menaikkan recall"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("breast_cancer.csv")
print(df["diagnosis"].value_counts())

X = df.drop(columns=["target", "diagnosis"])
y = (df["diagnosis"] == "malignant").astype(int)   # 1 = ganas (kelas positif)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: Pipeline(StandardScaler, LogisticRegression) dan SVC;
#       cross-validation dengan scoring="recall" pada training data.`,
    title: "Breast Cancer Classification",
    level: "Intermediate",
    task: "Binary classification",
    problem: "Membantu skrining diagnosis tumor payudara (jinak/ganas) dari fitur citra sel. Kesalahan false negative sangat mahal.",
    goal: "Membangun pipeline scaling + Logistic Regression/SVM, mengutamakan recall kelas malignant, dan memakai cross-validation.",
    dataset: "breast_cancer.csv",
    prerequisites: ["prep-standardscaler", "prep-pipeline", "clf-logistic-regression", "clf-support-vector-machine-svm", "eval-recall", "imp-stratified-k-fold"],
    phase: 4,
  },
  {
    id: "house-price",
    checklist: ["EDA: hubungan luas, umur, jarak dengan harga", "One-hot encoding kota", "Bandingkan Linear Regression, Ridge, dan Random Forest dengan K-fold CV", "Evaluasi MAE, RMSE, R² pada test set", "Interpretasikan fitur terpenting", "Catatan: dataset ini sintetis — untuk regresi data nyata coba Auto MPG"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("house_prices.csv")
print(df.describe().round(1))
print(df.groupby("city")["price_million"].median())

X = df.drop(columns=["house_id", "price_million"])
y = df["price_million"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: ColumnTransformer (one-hot city + scaler numerik),
#       bandingkan LinearRegression, Ridge, RandomForestRegressor dengan cross-validation.`,
    title: "House Price Prediction",
    level: "Intermediate",
    task: "Regression",
    problem: "Agen properti ingin estimasi harga rumah berdasarkan kota, luas, jumlah kamar, umur bangunan, dan jarak ke pusat kota.",
    goal: "One-hot encoding kota, membandingkan Linear Regression, Ridge, dan Random Forest dengan cross-validation.",
    dataset: "house_prices.csv",
    prerequisites: ["prep-one-hot-encoding", "prep-columntransformer", "reg-ridge-regression", "reg-random-forest-regressor", "reg-comparing-regression-models", "imp-k-fold-cross-validation"],
    phase: 4,
  },
  {
    id: "churn",
    checklist: ["Hapus duplikat persis sebelum split", "Imputasi missing value di dalam Pipeline", "One-hot encoding kontrak & layanan internet", "class_weight='balanced' atau resampling di dalam training fold", "Pilih threshold berdasarkan recall/precision yang dibutuhkan bisnis", "Ikuti contoh lengkap di halaman Workflow"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("customer_churn.csv")
print("Duplikat:", df.duplicated().sum(), "| Missing:", df.isnull().sum().sum())
df = df.drop_duplicates()
print(df["churn"].value_counts(normalize=True).round(3))

X = df.drop(columns=["customer_id", "churn"])
y = df["churn"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: ikuti halaman Workflow (16 tahap) — semua tahap memakai dataset ini.`,
    title: "Customer Churn Prediction",
    level: "Intermediate",
    task: "Binary classification (imbalanced)",
    problem: "Penyedia internet ingin mengetahui pelanggan yang berisiko berhenti berlangganan agar tim retensi dapat menghubungi mereka. (Dataset sintetis dengan masalah kualitas data yang disengaja; untuk data nyata dengan pola serupa gunakan Bank Marketing atau Online Shoppers.)",
    goal: "Membersihkan missing value & duplikat, encoding, menangani imbalance, dan memilih threshold yang menaikkan recall tanpa mengorbankan precision berlebihan.",
    dataset: "customer_churn.csv",
    prerequisites: ["prep-handling-missing-values", "prep-drop-duplicates", "prep-one-hot-encoding", "prep-handling-imbalanced-data", "clf-random-forest", "eval-precision", "eval-recall", "imp-threshold-tuning"],
    phase: 4,
  },
  {
    id: "segmentation",
    checklist: ["EDA: skewness setiap kategori belanja", "Transformasi log1p lalu StandardScaler", "Elbow method dan silhouette score untuk memilih K", "Latih K-Means dengan random_state", "Profilkan setiap cluster (rata-rata belanja asli)", "Bandingkan cluster dengan kolom Channel (Horeca vs Retail)"],
    starter: `import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

df = pd.read_csv("wholesale_customers.csv")
produk = ["Fresh", "Milk", "Grocery", "Frozen", "Detergents_Paper", "Delicassen"]
print(df[produk].describe().round(0))
print("Skewness:")
print(df[produk].skew().round(2))

# Belanja sangat miring ke kanan -> transformasi log sebelum scaling
X = np.log1p(df[produk])
X_scaled = StandardScaler().fit_transform(X)
print(X_scaled.shape)

# TODO: Elbow method & silhouette untuk K = 2..8, latih KMeans,
#       lalu bandingkan rata-rata belanja tiap cluster dengan kolom Channel.`,
    title: "Customer Segmentation",
    level: "Intermediate",
    task: "Clustering",
    problem: "Distributor grosir di Portugal ingin mengelompokkan 440 pelanggannya berdasarkan pola belanja tahunan per kategori produk untuk strategi pemasaran yang berbeda.",
    goal: "Transformasi log untuk data miring, scaling, K-Means dengan Elbow Method dan Silhouette Score, lalu menginterpretasikan setiap cluster.",
    dataset: "wholesale_customers.csv",
    prerequisites: ["prep-standardscaler", "uns-k-means-clustering", "uns-elbow-method", "uns-silhouette-score", "uns-cluster-interpretation"],
    phase: 2,
  },
  {
    id: "credit-risk",
    checklist: ["Bersihkan kode kategori yang tidak terdokumentasi", "Analisis riwayat PAY_0..PAY_6 terhadap gagal bayar", "Baseline Logistic Regression dalam Pipeline", "Gradient Boosting + tuning dengan cross-validation", "Evaluasi ROC-AUC, precision, recall", "Tentukan threshold berdasarkan biaya FN vs FP"],
    starter: `import pandas as pd
from sklearn.model_selection import train_test_split

df = pd.read_csv("credit_card_default.csv")
target = "default payment next month"
print(df.shape)
print(df[target].value_counts(normalize=True).round(3))
print("Kode EDUCATION:", sorted(df["EDUCATION"].unique()), "| MARRIAGE:", sorted(df["MARRIAGE"].unique()))

X = df.drop(columns=["ID", target])
y = df[target]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("Train:", X_train.shape, "| Test:", X_test.shape)

# TODO: gabungkan kode tak terdokumentasi (EDUCATION 0/5/6 -> 4, MARRIAGE 0 -> 3),
#       baseline LogisticRegression, lalu GradientBoosting dengan GridSearchCV.`,
    title: "Credit Risk Prediction",
    level: "Advanced",
    task: "Binary classification",
    problem: "Bank penerbit kartu kredit di Taiwan ingin memprediksi nasabah yang akan gagal bayar bulan depan dari limit, demografi, dan riwayat pembayaran.",
    goal: "Membersihkan kode kategori tak terdokumentasi, pipeline lengkap, gradient boosting, tuning dengan cross-validation, dan analisis biaya kesalahan.",
    dataset: "credit_card_default.csv",
    prerequisites: ["prep-pipeline", "clf-gradient-boosting", "imp-gridsearchcv", "fe-feature-importance", "eval-roc-auc"],
    phase: 4,
  },
  {
    id: "fraud",
    title: "Fraud Detection",
    level: "Advanced",
    task: "Highly imbalanced classification",
    problem: "Mendeteksi transaksi mencurigakan ketika kasus fraud sangat jarang (<1%).",
    goal: "Resampling di dalam training fold, metrik Precision-Recall, dan threshold tuning berbasis biaya.",
    datasetNote: "Dataset sintetis transaksi akan disediakan bersama panduan proyek.",
    prerequisites: ["prep-smote", "eval-precision-recall-curve", "imp-threshold-tuning", "imp-improving-recall"],
    phase: 4,
  },
  {
    id: "sales-forecast",
    title: "Sales Forecasting",
    level: "Advanced",
    task: "Regression (time-based)",
    problem: "Memperkirakan penjualan mingguan untuk perencanaan stok.",
    goal: "Feature engineering berbasis waktu (lag, rolling mean), validasi berbasis waktu tanpa kebocoran masa depan.",
    datasetNote: "Dataset sintetis penjualan mingguan akan disediakan bersama panduan proyek.",
    prerequisites: ["fe-creating-new-features", "reg-random-forest-regressor", "split-data-leakage", "imp-cross-validation"],
    phase: 4,
  },
  {
    id: "customer-intelligence",
    checklist: ["Segmentasi pelanggan (clustering)", "Model churn (klasifikasi) dalam Pipeline", "Simpan kedua model dengan joblib", "Buat fungsi prediksi gabungan", "Rancang tampilan Streamlit sederhana", "Rencana monitoring (data drift)"],
    starter: `import pandas as pd

df = pd.read_csv("customer_churn.csv").drop_duplicates()
print(df.shape)
print(df.groupby("contract")[["monthly_charges", "tenure_months", "churn"]].mean().round(2))

# TODO: (1) segmentasi pelanggan dengan K-Means, (2) model churn,
#       (3) fungsi predict(customer: dict) yang mengembalikan segmen + probabilitas churn.`,
    title: "Customer Intelligence System",
    level: "Advanced",
    task: "Clustering + classification + deployment",
    problem: "Menggabungkan segmentasi pelanggan dan prediksi churn menjadi satu aplikasi yang dapat dipakai tim bisnis.",
    goal: "Menyimpan model, membuat fungsi prediksi, aplikasi Streamlit sederhana, dan rencana monitoring.",
    dataset: "customer_churn.csv",
    prerequisites: ["uns-customer-segmentation", "clf-comparing-classification-models", "dep-creating-a-prediction-function", "dep-introduction-to-streamlit", "dep-introduction-to-model-monitoring"],
    phase: 4,
  },
];
