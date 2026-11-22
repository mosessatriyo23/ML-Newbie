export interface ProjectBrief {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  task: string;
  problem: string;
  goal: string;
  dataset?: string;
  datasetNote?: string;
  prerequisites: string[];
  phase: number;
}

// Ringkasan proyek (problem statement, tujuan, dataset). Panduan, starter code, checklist, dan solusi
// ditambahkan ketika seluruh materi prasyarat sudah tersedia.
export const PROJECTS: ProjectBrief[] = [
  {
    id: "student-score",
    title: "Student Score Prediction",
    level: "Beginner",
    task: "Regression",
    problem: "Sekolah ingin memperkirakan nilai akhir siswa dari jam belajar, kehadiran, dan nilai sebelumnya agar dapat memberi bimbingan lebih awal.",
    goal: "Membangun model regresi linear dan mengevaluasinya dengan MAE dan R².",
    dataset: "student_scores.csv",
    prerequisites: ["py-variables", "pd-introduction-to-pandas", "load-loading-csv-files", "eda-scatter-plot", "split-train-test-split", "reg-simple-linear-regression", "reg-mae", "reg-r2-score"],
    phase: 2,
  },
  {
    id: "salary",
    title: "Salary Prediction",
    level: "Beginner",
    task: "Regression",
    problem: "Perusahaan ingin memperkirakan gaji yang wajar berdasarkan pengalaman kerja dan tingkat pendidikan kandidat.",
    goal: "Membandingkan simple dan multiple linear regression, lalu menginterpretasikan koefisien.",
    datasetNote: "Dataset sintetis gaji akan disediakan bersama panduan proyek.",
    prerequisites: ["load-features-and-target", "split-train-test-split", "reg-multiple-linear-regression", "reg-rmse"],
    phase: 2,
  },
  {
    id: "iris",
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
    title: "Customer Churn Prediction",
    level: "Intermediate",
    task: "Binary classification (imbalanced)",
    problem: "Penyedia internet ingin mengetahui pelanggan yang berisiko berhenti berlangganan agar tim retensi dapat menghubungi mereka.",
    goal: "Membersihkan missing value & duplikat, encoding, menangani imbalance, dan memilih threshold yang menaikkan recall tanpa mengorbankan precision berlebihan.",
    dataset: "customer_churn.csv",
    prerequisites: ["prep-handling-missing-values", "prep-drop-duplicates", "prep-one-hot-encoding", "prep-handling-imbalanced-data", "clf-random-forest", "eval-precision", "eval-recall", "imp-threshold-tuning"],
    phase: 4,
  },
  {
    id: "segmentation",
    title: "Customer Segmentation",
    level: "Intermediate",
    task: "Clustering",
    problem: "Pusat perbelanjaan ingin mengelompokkan pelanggan berdasarkan usia, pendapatan, dan pola belanja untuk strategi pemasaran yang berbeda.",
    goal: "Scaling, K-Means dengan Elbow Method dan Silhouette Score, lalu menginterpretasikan setiap cluster.",
    dataset: "customer_segmentation.csv",
    prerequisites: ["prep-standardscaler", "uns-k-means-clustering", "uns-elbow-method", "uns-silhouette-score", "uns-cluster-interpretation"],
    phase: 2,
  },
  {
    id: "credit-risk",
    title: "Credit Risk Prediction",
    level: "Advanced",
    task: "Binary classification",
    problem: "Lembaga keuangan ingin menilai risiko gagal bayar calon peminjam secara konsisten dan dapat dijelaskan.",
    goal: "Pipeline lengkap, gradient boosting, tuning dengan cross-validation, interpretasi fitur, dan analisis biaya kesalahan.",
    datasetNote: "Akan memakai dataset nyata dari UCI Machine Learning Repository (Statlog German Credit Data, CC BY 4.0).",
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
