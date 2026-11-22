// Metadata dataset (tanpa isi file) — aman diimpor dari Node maupun browser.
export interface DatasetInfo {
  file: string;
  name: string;
  description: string;
  kind: "real" | "synthetic";
  source: string;
  sourceUrl?: string;
  /** Halaman dataset yang sama/terkait di Kaggle (diverifikasi oleh scripts/check-links.ts). */
  kaggleUrl?: string;
  /** File besar: diunduh dari public/datasets/ saat pertama kali dipakai, bukan dibundel. */
  lazy?: boolean;
  rows?: number;
  sep?: string;
  license: string;
  task: string;
  columns: [string, string][];
}

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
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/iris",
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
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/breast-cancer-wisconsin-data",
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

const UCI = "UCI Machine Learning Repository";
const NOTE = "Diunduh dari sumber asli (UCI) oleh scripts/fetch_real_datasets.py; nilai tidak diubah, hanya ditambah header dan '?' dijadikan sel kosong.";

/** Dataset nyata tambahan (lisensi CC BY 4.0), juga populer di Kaggle. */
export const REAL_DATASETS: DatasetInfo[] = [
  {
    file: "heart_disease.csv",
    name: "Heart Disease (Cleveland)",
    description: "303 pasien dari Cleveland Clinic dengan 13 hasil pemeriksaan klinis. Berisi 6 missing value asli (kolom ca dan thal).",
    kind: "real",
    lazy: true,
    rows: 303,
    source: `Janosi, A., Steinbrunn, W., Pfisterer, M., & Detrano, R. (1989). Heart Disease [Dataset]. ${UCI}. ${NOTE}`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/45/heart+disease",
    kaggleUrl: "https://www.kaggle.com/datasets/cherngs/heart-disease-cleveland-uci",
    license: "CC BY 4.0",
    task: "Binary classification (buat target: num > 0 berarti ada penyakit jantung)",
    columns: [
      ["age", "Usia (tahun)"],
      ["sex", "1 = laki-laki, 0 = perempuan"],
      ["cp", "Jenis nyeri dada: 1 typical angina, 2 atypical angina, 3 non-anginal, 4 asymptomatic"],
      ["trestbps", "Tekanan darah istirahat (mm Hg)"],
      ["chol", "Kolesterol serum (mg/dl)"],
      ["fbs", "Gula darah puasa > 120 mg/dl (1 = ya)"],
      ["restecg", "Hasil EKG istirahat (0 normal, 1 kelainan ST-T, 2 hipertrofi ventrikel kiri)"],
      ["thalach", "Detak jantung maksimum"],
      ["exang", "Angina akibat olahraga (1 = ya)"],
      ["oldpeak", "Depresi ST akibat olahraga dibanding istirahat"],
      ["slope", "Kemiringan segmen ST puncak (1 naik, 2 datar, 3 turun)"],
      ["ca", "Jumlah pembuluh utama (0–3) yang terlihat fluoroskopi — 4 missing"],
      ["thal", "3 normal, 6 fixed defect, 7 reversible defect — 2 missing"],
      ["num", "Diagnosis: 0 = tidak ada penyakit, 1–4 = ada (tingkat keparahan)"],
    ],
  },
  {
    file: "winequality-red.csv",
    name: "Wine Quality (Red)",
    description: "1.599 anggur merah Portugal (vinho verde) dengan 11 hasil uji fisikokimia dan skor kualitas dari penilai. File ASLI berpemisah titik koma — baca dengan sep=\";\".",
    kind: "real",
    lazy: true,
    rows: 1599,
    sep: ";",
    source: `Cortez, P., Cerdeira, A., Almeida, F., Matos, T., & Reis, J. (2009). Wine Quality [Dataset]. ${UCI}. File asli tanpa perubahan.`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/186/wine+quality",
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009",
    license: "CC BY 4.0",
    task: "Regression atau classification (prediksi quality 3–8)",
    columns: [
      ["fixed acidity … alcohol", "11 fitur numerik hasil uji laboratorium (keasaman, gula sisa, klorida, sulfur dioksida, densitas, pH, sulfat, kadar alkohol)"],
      ["quality", "Skor kualitas 0–10 dari penilai (di data ini 3–8) — target"],
    ],
  },
  {
    file: "student_performance.csv",
    name: "Student Performance (Math)",
    description: "395 siswa sekolah menengah di Portugal: latar belakang keluarga, kebiasaan belajar, dan nilai matematika per periode.",
    kind: "real",
    lazy: true,
    rows: 395,
    source: `Cortez, P. (2008). Student Performance [Dataset]. ${UCI}. ${NOTE}`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/320/student+performance",
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/student-alcohol-consumption",
    license: "CC BY 4.0",
    task: "Regression (prediksi G3) atau classification (lulus jika G3 ≥ 10)",
    columns: [
      ["school, sex, age, address, famsize, Pstatus", "Data demografis"],
      ["Medu, Fedu", "Pendidikan ibu/ayah (0 tidak sekolah … 4 pendidikan tinggi)"],
      ["studytime", "Waktu belajar mingguan (1: <2 jam … 4: >10 jam)"],
      ["failures", "Jumlah kegagalan kelas sebelumnya"],
      ["absences", "Jumlah ketidakhadiran"],
      ["G1, G2", "Nilai periode 1 dan 2 (0–20) — sangat berkorelasi dengan G3"],
      ["G3", "Nilai akhir (0–20) — target"],
    ],
  },
  {
    file: "auto_mpg.csv",
    name: "Auto MPG",
    description: "398 mobil (1970–1982): silinder, tenaga, berat, akselerasi, dan efisiensi bahan bakar. 6 missing value asli di horsepower.",
    kind: "real",
    lazy: true,
    rows: 398,
    source: `Quinlan, R. (1993). Auto MPG [Dataset]. ${UCI}. ${NOTE}`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/9/auto+mpg",
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/autompg-dataset",
    license: "CC BY 4.0",
    task: "Regression (prediksi mpg)",
    columns: [
      ["mpg", "Miles per gallon — target"],
      ["cylinders, displacement, horsepower, weight, acceleration", "Spesifikasi mesin & kendaraan (horsepower punya 6 missing)"],
      ["model_year", "Tahun model (70 = 1970)"],
      ["origin", "1 = Amerika, 2 = Eropa, 3 = Jepang"],
      ["car_name", "Nama mobil (teks unik — biasanya tidak dipakai sebagai fitur)"],
    ],
  },
  {
    file: "bank_marketing.csv",
    name: "Bank Marketing",
    description: "4.521 nasabah bank Portugal yang ditelepon kampanye deposito berjangka (sampel 10% resmi dari UCI). Kelas tidak seimbang (±11,5% yes).",
    kind: "real",
    lazy: true,
    rows: 4521,
    source: `Moro, S., Rita, P., & Cortez, P. (2014). Bank Marketing [Dataset]. ${UCI}. ${NOTE}`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/222/bank+marketing",
    kaggleUrl: "https://www.kaggle.com/datasets/janiobachmann/bank-marketing-dataset",
    license: "CC BY 4.0",
    task: "Binary classification (prediksi y: yes/no) — imbalanced",
    columns: [
      ["age, job, marital, education, default, balance, housing, loan", "Profil nasabah"],
      ["contact, day, month", "Kontak terakhir"],
      ["duration", "Durasi telepon (detik). PERHATIAN: baru diketahui setelah telepon selesai — memakainya untuk prediksi adalah data leakage"],
      ["campaign, pdays, previous, poutcome", "Riwayat kampanye"],
      ["y", "Berlangganan deposito? yes/no — target"],
    ],
  },
  {
    file: "online_shoppers.csv",
    name: "Online Shoppers Purchasing Intention",
    description: "12.330 sesi kunjungan toko online: halaman yang dibuka, durasi, bounce rate, bulan, jenis pengunjung, dan apakah terjadi pembelian (±15,5%).",
    kind: "real",
    lazy: true,
    rows: 12330,
    source: `Sakar, C., & Kastro, Y. (2018). Online Shoppers Purchasing Intention Dataset [Dataset]. ${UCI}. File asli tanpa perubahan.`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/468/online+shoppers+purchasing+intention+dataset",
    kaggleUrl: "https://www.kaggle.com/datasets/henrysue/online-shoppers-intention",
    license: "CC BY 4.0",
    task: "Binary classification (prediksi Revenue) — imbalanced",
    columns: [
      ["Administrative … ProductRelated_Duration", "Jumlah halaman & durasi per jenis halaman"],
      ["BounceRates, ExitRates, PageValues", "Metrik Google Analytics"],
      ["SpecialDay, Month, OperatingSystems, Browser, Region, TrafficType", "Konteks kunjungan"],
      ["VisitorType, Weekend", "Pengunjung baru/kembali; akhir pekan"],
      ["Revenue", "True jika sesi berakhir dengan pembelian — target"],
    ],
  },
  {
    file: "wholesale_customers.csv",
    name: "Wholesale Customers",
    description: "440 pelanggan distributor grosir di Portugal dengan belanja tahunan per kategori produk — cocok untuk segmentasi (clustering).",
    kind: "real",
    lazy: true,
    rows: 440,
    source: `Cardoso, M. (2013). Wholesale customers [Dataset]. ${UCI}. File asli tanpa perubahan.`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/292/wholesale+customers",
    kaggleUrl: "https://www.kaggle.com/datasets/binovi/wholesale-customers-data-set",
    license: "CC BY 4.0",
    task: "Clustering (segmentasi pelanggan)",
    columns: [
      ["Channel", "1 = Horeca (hotel/restoran/kafe), 2 = Retail"],
      ["Region", "1 = Lisbon, 2 = Oporto, 3 = lainnya"],
      ["Fresh, Milk, Grocery, Frozen, Detergents_Paper, Delicassen", "Belanja tahunan (satuan moneter) per kategori — distribusinya sangat miring ke kanan"],
    ],
  },
  {
    file: "adult_income.csv",
    name: "Adult / Census Income",
    description: "32.561 orang dari sensus AS 1994: pendidikan, pekerjaan, jam kerja, dan apakah pendapatan > $50K/tahun. Berisi missing value asli (workclass, occupation, native_country).",
    kind: "real",
    lazy: true,
    rows: 32561,
    source: `Becker, B., & Kohavi, R. (1996). Adult [Dataset]. ${UCI}. ${NOTE}`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/2/adult",
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/adult-census-income",
    license: "CC BY 4.0",
    task: "Binary classification (prediksi income) — imbalanced (±24% >50K)",
    columns: [
      ["age, fnlwgt, education_num, capital_gain, capital_loss, hours_per_week", "Fitur numerik"],
      ["workclass, education, marital_status, occupation, relationship, race, sex, native_country", "Fitur kategorikal"],
      ["income", "<=50K atau >50K — target"],
    ],
  },
  {
    file: "credit_card_default.csv",
    name: "Default of Credit Card Clients",
    description: "30.000 pemegang kartu kredit di Taiwan (2005): limit, demografi, riwayat pembayaran 6 bulan, dan apakah gagal bayar bulan berikutnya (±22%).",
    kind: "real",
    lazy: true,
    rows: 30000,
    source: `Yeh, I-C. (2009). Default of Credit Card Clients [Dataset]. ${UCI}. Dikonversi dari file .xls asli ke CSV tanpa mengubah nilai.`,
    sourceUrl: "https://archive.ics.uci.edu/dataset/350/default+of+credit+card+clients",
    kaggleUrl: "https://www.kaggle.com/datasets/uciml/default-of-credit-card-clients-dataset",
    license: "CC BY 4.0",
    task: "Binary classification (Credit Risk) — imbalanced",
    columns: [
      ["ID", "Nomor urut (bukan fitur)"],
      ["LIMIT_BAL", "Limit kredit (dolar Taiwan)"],
      ["SEX, EDUCATION, MARRIAGE, AGE", "Demografi (EDUCATION & MARRIAGE berisi kode yang tidak terdokumentasi, misalnya 0, 5, 6 — latihan data cleaning)"],
      ["PAY_0, PAY_2 … PAY_6", "Status pembayaran per bulan (-1 tepat waktu, 1–9 = terlambat n bulan)"],
      ["BILL_AMT1–6, PAY_AMT1–6", "Tagihan dan pembayaran per bulan"],
      ["default payment next month", "1 = gagal bayar — target"],
    ],
  },
];

/** Semua dataset, nyata lebih dulu. */
export const ALL_DATASETS: DatasetInfo[] = [...DATASETS.filter((d) => d.kind === "real"), ...REAL_DATASETS, ...DATASETS.filter((d) => d.kind === "synthetic")];
export const LAZY_DATASET_FILES: string[] = REAL_DATASETS.filter((d) => d.lazy).map((d) => d.file);

/** Parser CSV untuk preview tabel (mendukung tanda kutip). */
export function parseCsv(text: string, maxRows = 10, sep?: string): { header: string[]; rows: string[][]; total: number } {
  const lines = text.replace(/\r/g, "").split("\n").filter((l) => l.length > 0);
  const first = lines[0] ?? "";
  const delim = sep ?? (first.split(";").length > first.split(",").length ? ";" : ",");
  const split = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') { cur += '"'; i++; } else q = !q;
      } else if (ch === delim && !q) { out.push(cur); cur = ""; } else cur += ch;
    }
    out.push(cur);
    return out;
  };
  return { header: split(first), rows: lines.slice(1, 1 + maxRows).map(split), total: Math.max(0, lines.length - 1) };
}
