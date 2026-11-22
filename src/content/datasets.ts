// Dataset bawaan: tersedia langsung di folder kerja Python (tanpa login Kaggle / API key).
import breastCancer from "./data/breast_cancer.csv?raw";
import customerChurn from "./data/customer_churn.csv?raw";
import customerSeg from "./data/customer_segmentation.csv?raw";
import dataCsv from "./data/data.csv?raw";
import dataSemicolon from "./data/data_semicolon.csv?raw";
import housePrices from "./data/house_prices.csv?raw";
import iris from "./data/iris.csv?raw";
import studentScores from "./data/student_scores.csv?raw";

export interface DatasetInfo {
  file: string;
  name: string;
  description: string;
  kind: "real" | "synthetic";
  source: string;
  sourceUrl?: string;
  license: string;
  task: string;
  columns: [string, string][];
}

export const DATASET_FILES: Record<string, string> = {
  "student_scores.csv": studentScores,
  "iris.csv": iris,
  "breast_cancer.csv": breastCancer,
  "customer_churn.csv": customerChurn,
  "house_prices.csv": housePrices,
  "customer_segmentation.csv": customerSeg,
  "data.csv": dataCsv,
  "data_semicolon.csv": dataSemicolon,
};

export const DATASETS: DatasetInfo[] = [
  {
    file: "student_scores.csv",
    name: "Student Scores",
    description: "30 siswa: jam belajar, kehadiran, nilai sebelumnya, dan nilai akhir.",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy (scripts/generate_datasets.py, seed 42) khusus untuk latihan.",
    license: "Bebas dipakai untuk belajar (data buatan, bukan data orang sungguhan).",
    task: "Regression (prediksi final_score)",
    columns: [
      ["student_id", "ID siswa (teks)"],
      ["hours_studied", "Jam belajar per hari (float)"],
      ["attendance", "Persentase kehadiran 60–100 (int)"],
      ["previous_score", "Nilai ujian sebelumnya (int)"],
      ["final_score", "Nilai akhir 0–100 — target (int)"],
    ],
  },
  {
    file: "iris.csv",
    name: "Iris",
    description: "150 bunga iris dari 3 spesies dengan 4 ukuran kelopak/mahkota (cm).",
    kind: "real",
    source: "Fisher, R. A. (1936). Iris [Dataset]. UCI Machine Learning Repository. Salinan dari scikit-learn (load_iris).",
    sourceUrl: "https://archive.ics.uci.edu/dataset/53/iris",
    license: "CC BY 4.0",
    task: "Multiclass classification (prediksi species)",
    columns: [
      ["sepal_length", "Panjang sepal (cm)"],
      ["sepal_width", "Lebar sepal (cm)"],
      ["petal_length", "Panjang petal (cm)"],
      ["petal_width", "Lebar petal (cm)"],
      ["species", "setosa / versicolor / virginica — target"],
    ],
  },
  {
    file: "breast_cancer.csv",
    name: "Breast Cancer Wisconsin (Diagnostic)",
    description: "569 sampel sel dengan 30 fitur numerik hasil citra digital; diagnosis jinak/ganas.",
    kind: "real",
    source: "Wolberg, W., Mangasarian, O., Street, N., & Street, W. (1993). UCI Machine Learning Repository. Salinan dari scikit-learn (load_breast_cancer).",
    sourceUrl: "https://archive.ics.uci.edu/dataset/17/breast+cancer+wisconsin+diagnostic",
    license: "CC BY 4.0",
    task: "Binary classification (target: 0 = malignant, 1 = benign)",
    columns: [
      ["mean_radius … worst_fractal_dimension", "30 fitur numerik (mean, error, worst dari 10 ukuran sel)"],
      ["target", "0 = malignant (ganas), 1 = benign (jinak) — sesuai pengodean scikit-learn"],
      ["diagnosis", "Label teks: malignant / benign"],
    ],
  },
  {
    file: "customer_churn.csv",
    name: "Customer Churn",
    description: "403 baris pelanggan layanan internet. Sengaja berisi 12 missing value dan 3 baris duplikat untuk latihan cleaning.",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy (scripts/generate_datasets.py, seed 42). Bukan data pelanggan sungguhan.",
    license: "Bebas dipakai untuk belajar.",
    task: "Binary classification (prediksi churn: 1 = berhenti berlangganan)",
    columns: [
      ["customer_id", "ID pelanggan"],
      ["gender", "Female / Male"],
      ["age", "Usia (ada missing value)"],
      ["tenure_months", "Lama berlangganan (bulan)"],
      ["contract", "Month-to-month / One year / Two year"],
      ["internet_service", "DSL / Fiber optic / No"],
      ["monthly_charges", "Tagihan per bulan (USD)"],
      ["support_tickets", "Jumlah tiket keluhan"],
      ["churn", "1 = churn, 0 = bertahan — target"],
      ["total_charges", "Total tagihan (ada missing value)"],
    ],
  },
  {
    file: "house_prices.csv",
    name: "House Prices",
    description: "300 rumah di 4 kota dengan luas, kamar, umur bangunan, jarak ke pusat kota, dan harga.",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy (scripts/generate_datasets.py, seed 42). Harga bukan harga pasar sungguhan.",
    license: "Bebas dipakai untuk belajar.",
    task: "Regression (prediksi price_million)",
    columns: [
      ["house_id", "ID rumah"],
      ["city", "Jakarta / Bandung / Surabaya / Yogyakarta"],
      ["area_m2", "Luas bangunan (m²)"],
      ["bedrooms", "Jumlah kamar tidur"],
      ["bathrooms", "Jumlah kamar mandi"],
      ["age_years", "Umur bangunan (tahun)"],
      ["distance_to_center_km", "Jarak ke pusat kota (km)"],
      ["price_million", "Harga (juta rupiah) — target"],
    ],
  },
  {
    file: "customer_segmentation.csv",
    name: "Customer Segmentation",
    description: "200 pelanggan pusat perbelanjaan: usia, pendapatan tahunan, dan spending score.",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy (scripts/generate_datasets.py, seed 42) dengan 5 kelompok tersembunyi.",
    license: "Bebas dipakai untuk belajar.",
    task: "Clustering (tanpa target)",
    columns: [
      ["customer_id", "ID pelanggan"],
      ["gender", "Female / Male"],
      ["age", "Usia"],
      ["annual_income_million", "Pendapatan tahunan (juta rupiah)"],
      ["spending_score", "Skor belanja 1–100"],
    ],
  },
  {
    file: "data.csv",
    name: "data.csv (contoh kecil)",
    description: "6 baris: Name, Age, City, Score. Dipakai di contoh materi dasar.",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy.",
    license: "Bebas dipakai untuk belajar.",
    task: "Latihan membaca file",
    columns: [
      ["Name", "Nama"],
      ["Age", "Usia"],
      ["City", "Kota"],
      ["Score", "Nilai"],
    ],
  },
  {
    file: "data_semicolon.csv",
    name: "data_semicolon.csv",
    description: "Isi sama dengan data.csv, tetapi pemisah kolomnya titik koma (;).",
    kind: "synthetic",
    source: "Dibuat oleh ML Academy.",
    license: "Bebas dipakai untuk belajar.",
    task: "Latihan parameter sep",
    columns: [["Name;Age;City;Score", "Kolom dipisah dengan ;"]],
  },
];

/** Parser CSV sederhana untuk preview tabel (dataset bawaan tidak memakai koma di dalam kutip). */
export function parseCsv(text: string, maxRows = 10, sep?: string): { header: string[]; rows: string[][]; total: number } {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  const delim = sep ?? (lines[0]?.includes(";") && !lines[0]?.includes(",") ? ";" : ",");
  const header = (lines[0] ?? "").split(delim);
  const rows = lines.slice(1, 1 + maxRows).map((l) => l.split(delim));
  return { header, rows, total: Math.max(0, lines.length - 1) };
}
