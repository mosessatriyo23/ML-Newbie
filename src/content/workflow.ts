// Halaman Machine Learning Workflow. Studi kasus yang sama (customer_churn.csv) dipakai di setiap
// tahap agar hubungan antartahap terlihat. Output setiap kode adalah hasil eksekusi nyata di Pyodide
// (scripts/gen-outputs.ts) dan diverifikasi ulang oleh scripts/test-content.ts.
import { GENERATED_OUTPUTS } from "./generated-outputs.ts";

export interface WorkflowStep {
  id: string;
  n: number;
  title: string;
  phase: "data" | "model" | "result";
  goal: string;
  input: string;
  output_desc: string;
  libraries: string;
  functions: string[];
  code?: string;
  /** Output persis dari `code` (hasil eksekusi nyata). */
  output?: string;
  mistakes: string[];
  next: string;
  lessons: string[];
}

const LOAD = `import pandas as pd
df = pd.read_csv("customer_churn.csv").drop_duplicates()`;

const SPLIT = `${LOAD}
from sklearn.model_selection import train_test_split
X = df.drop(columns=["customer_id", "churn"])
y = df["churn"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)`;

const PREP = `${SPLIT}
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

num_cols = ["age", "tenure_months", "monthly_charges", "support_tickets", "total_charges"]
cat_cols = ["gender", "contract", "internet_service"]
preprocess = ColumnTransformer([
    ("num", Pipeline([("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())]), num_cols),
    ("cat", Pipeline([("imputer", SimpleImputer(strategy="most_frequent")), ("onehot", OneHotEncoder(handle_unknown="ignore"))]), cat_cols),
])`;

const MODEL = `${PREP}
from sklearn.linear_model import LogisticRegression
model = Pipeline([("prep", preprocess), ("clf", LogisticRegression(max_iter=1000, class_weight="balanced"))])`;

const RAW: Omit<WorkflowStep, "output">[] = [
  {
    id: "problem",
    n: 1,
    title: "Problem Understanding",
    phase: "data",
    goal: "Menerjemahkan masalah bisnis menjadi masalah Machine Learning: apa yang diprediksi (target), jenis tugasnya (regresi/klasifikasi/clustering), siapa pengguna hasilnya, dan metrik keberhasilan. Di sini: perusahaan ingin menemukan pelanggan yang akan berhenti berlangganan (churn) agar tim retensi bisa menghubungi mereka.",
    input: "Pertanyaan bisnis, wawancara dengan stakeholder, batasan (biaya, waktu, privasi).",
    output_desc: "Problem statement, definisi target, jenis tugas, metrik utama (misal recall kelas churn), dan baseline yang harus dikalahkan.",
    libraries: "— (diskusi & dokumentasi)",
    functions: [],
    code: `problem = {
    "tujuan": "Mendeteksi pelanggan yang berisiko churn",
    "target": "churn (1 = berhenti, 0 = bertahan)",
    "jenis_tugas": "klasifikasi biner",
    "metrik_utama": "recall kelas churn (jangan sampai pelanggan berisiko terlewat)",
    "metrik_pendukung": "precision, F1, ROC-AUC",
}
for k, v in problem.items():
    print(f"{k:<17}: {v}")`,
    mistakes: ["Langsung memilih algoritma sebelum jelas apa yang diprediksi.", "Memilih accuracy sebagai metrik untuk data tidak seimbang.", "Tidak menanyakan bagaimana prediksi akan dipakai (threshold dan biaya kesalahan berbeda)."],
    next: "Definisi target dan fitur yang dibutuhkan menentukan data apa yang harus dikumpulkan.",
    lessons: ["intro-what-is-machine-learning", "intro-regression-vs-classification-vs-clustering", "eval-choosing-the-correct-evaluation-metric"],
  },
  {
    id: "collection",
    n: 2,
    title: "Data Collection",
    phase: "data",
    goal: "Mengumpulkan data yang relevan dari sumber yang sah: database perusahaan, file CSV/Excel, API, repositori publik (UCI, Kaggle), atau dataset bawaan library. Catat sumber, lisensi, dan waktu pengambilan data.",
    input: "Definisi masalah dan daftar informasi yang dibutuhkan.",
    output_desc: "File/tabel mentah beserta dokumentasi sumber dan lisensinya.",
    libraries: "pandas, sklearn.datasets, requests (di luar browser)",
    functions: ["pd.read_csv()", "sklearn.datasets.load_breast_cancer()"],
    code: `from sklearn.datasets import load_breast_cancer

data = load_breast_cancer(as_frame=True)
print(type(data.frame).__name__, data.frame.shape)
print(data.target_names)
print(data.frame.columns[:3].tolist())`,
    mistakes: ["Memakai data tanpa memeriksa lisensi atau izin.", "Data tidak mewakili kondisi nyata (misalnya hanya pelanggan dari satu kota).", "Tidak mencatat versi/tanggal data sehingga hasil sulit direproduksi."],
    next: "Data mentah yang terkumpul kemudian dimuat ke Python.",
    lessons: ["load-introduction-to-dataset", "load-loading-dataset-from-scikit-learn", "load-introduction-to-kaggle-datasets"],
  },
  {
    id: "loading",
    n: 3,
    title: "Data Loading",
    phase: "data",
    goal: "Memuat data ke DataFrame dengan parameter yang benar (pemisah, encoding, kolom).",
    input: "File CSV/Excel/JSON atau URL.",
    output_desc: "DataFrame `df` yang siap diperiksa.",
    libraries: "pandas",
    functions: ["pd.read_csv()", "df.head()"],
    code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
print(df.head(3))`,
    mistakes: ["Salah `sep` sehingga semua data masuk satu kolom.", "Salah path/nama file (FileNotFoundError).", "Tidak menyadari baris pertama bukan header."],
    next: "Setelah termuat, kenali struktur datanya.",
    lessons: ["load-loading-csv-files", "load-df-head", "py-reading-and-writing-files"],
  },
  {
    id: "understanding",
    n: 4,
    title: "Data Understanding",
    phase: "data",
    goal: "Memahami ukuran data, arti setiap kolom, tipe data, dan kualitas awal (missing, duplikat).",
    input: "DataFrame mentah.",
    output_desc: "Data dictionary, daftar fitur numerik & kategorikal, catatan masalah kualitas data.",
    libraries: "pandas",
    functions: ["df.shape", "df.dtypes", "df.isnull().sum()", "df.duplicated().sum()"],
    code: `import pandas as pd

df = pd.read_csv("customer_churn.csv")
print("Shape:", df.shape)
print(df.dtypes)
print("Missing:", df.isnull().sum().sum(), "| Duplikat:", df.duplicated().sum())`,
    mistakes: ["Mengira kolom ID adalah fitur yang berguna.", "Tidak memeriksa tipe data (angka terbaca sebagai teks).", "Mengabaikan duplikat yang dapat membocorkan data ke test set."],
    next: "Temuan awal ini menentukan pertanyaan yang dieksplorasi di EDA.",
    lessons: ["load-df-shape", "load-df-info", "load-df-dtypes", "load-numerical-data", "load-categorical-data"],
  },
  {
    id: "eda",
    n: 5,
    title: "Exploratory Data Analysis",
    phase: "data",
    goal: "Menggali pola: distribusi fitur, class distribution, hubungan fitur dengan target, outlier, dan korelasi — lalu menarik kesimpulan yang memandu preprocessing dan pemilihan model.",
    input: "DataFrame (sebaiknya EDA mendalam dilakukan pada training data agar keputusan tidak dipengaruhi test set).",
    output_desc: "Insight tertulis (misalnya: kontrak bulanan churn jauh lebih tinggi), daftar masalah data, ide fitur baru.",
    libraries: "pandas, matplotlib, seaborn",
    functions: ["value_counts()", "groupby().mean()", "describe()", "sns.countplot()", "sns.heatmap()"],
    code: `import pandas as pd

df = pd.read_csv("customer_churn.csv").drop_duplicates()
print(df["churn"].value_counts(normalize=True).round(3))
print(df.groupby("contract")["churn"].mean().round(3))
print(df[["tenure_months", "monthly_charges", "churn"]].corr().round(2)["churn"])`,
    mistakes: ["Hanya membuat grafik tanpa menuliskan kesimpulan.", "Mengira korelasi berarti sebab-akibat.", "Mengabaikan ketidakseimbangan kelas (≈38% churn)."],
    next: "Insight EDA (imbalance, missing, kategori) menentukan strategi split dan preprocessing.",
    lessons: ["eda-what-is-eda", "eda-class-distribution", "eda-correlation-analysis", "eda-interpreting-eda-results"],
  },
  {
    id: "splitting",
    n: 6,
    title: "Data Splitting",
    phase: "data",
    goal: "Memisahkan fitur (X) dan target (y), lalu membagi data menjadi training dan test set SEBELUM melakukan preprocessing yang mempelajari karakteristik data (fit). Test set disimpan untuk evaluasi akhir.",
    input: "DataFrame bersih dari duplikat persis.",
    output_desc: "X_train, X_test, y_train, y_test (stratified agar proporsi churn sama).",
    libraries: "scikit-learn",
    functions: ["df.drop(columns=...)", "train_test_split(..., stratify=y, random_state=42)"],
    code: `${SPLIT}
print(X_train.shape, X_test.shape)
print("Churn rate train:", y_train.mean().round(3), "| test:", y_test.mean().round(3))`,
    mistakes: ["Melakukan scaling/imputasi pada seluruh data sebelum split (data leakage).", "Tidak memakai stratify pada data tidak seimbang.", "Lupa membuang kolom ID atau kolom yang berisi informasi masa depan."],
    next: "Preprocessing di-fit hanya pada X_train.",
    lessons: ["split-feature-x", "split-target-y", "split-train-test-split-fn", "split-stratified-splitting", "split-data-leakage"],
  },
  {
    id: "preprocessing",
    n: 7,
    title: "Data Preprocessing",
    phase: "data",
    goal: "Menangani missing value, encoding kategori, dan scaling fitur numerik. Semua transformer di-fit pada training data, lalu dipakai untuk mentransformasi train dan test.",
    input: "X_train, X_test.",
    output_desc: "Matriks fitur numerik siap pakai, dan objek preprocessing (ColumnTransformer) yang dapat dipakai ulang.",
    libraries: "scikit-learn",
    functions: ["SimpleImputer", "StandardScaler", "OneHotEncoder(handle_unknown=\"ignore\")", "ColumnTransformer", "fit_transform() / transform()"],
    code: `${PREP}
X_train_prep = preprocess.fit_transform(X_train)   # fit HANYA pada train
X_test_prep = preprocess.transform(X_test)         # test hanya di-transform
print(X_train_prep.shape, X_test_prep.shape)
print(preprocess.get_feature_names_out()[:7])`,
    mistakes: ["Memanggil fit_transform pada test set.", "Label encoding berurutan untuk kategori nominal (kota, jenis layanan).", "Lupa handle_unknown sehingga kategori baru di test menyebabkan error."],
    next: "Data yang sudah rapi bisa diperkaya dengan fitur baru.",
    lessons: ["prep-handling-missing-values", "prep-simpleimputer", "prep-one-hot-encoding", "prep-standardscaler", "prep-columntransformer"],
  },
  {
    id: "feature-engineering",
    n: 8,
    title: "Feature Engineering",
    phase: "data",
    goal: "Membuat fitur baru yang lebih informatif dari pengetahuan domain, atau memilih fitur yang relevan. Fitur baru yang hanya memakai baris itu sendiri (tanpa statistik dataset) aman dibuat sebelum split.",
    input: "DataFrame/X_train.",
    output_desc: "Fitur tambahan (misalnya rata-rata tagihan, flag kontrak bulanan) dan bukti bahwa fitur tersebut berguna.",
    libraries: "pandas, scikit-learn",
    functions: ["df.assign()", "groupby().mean()", "SelectKBest", "feature_importances_"],
    code: `${LOAD}
df = df.assign(
    avg_charge=df["total_charges"] / df["tenure_months"],
    is_monthly=(df["contract"] == "Month-to-month").astype(int),
    new_customer=(df["tenure_months"] <= 6).astype(int),
)
print(df.groupby("new_customer")["churn"].mean().round(3))
print(df[["avg_charge", "monthly_charges"]].corr().round(3).iloc[0, 1])`,
    mistakes: ["Membuat fitur memakai informasi target (target leakage).", "Membuat fitur memakai statistik seluruh data (mean global) sebelum split.", "Menambah banyak fitur tanpa memvalidasi manfaatnya."],
    next: "Dengan fitur final, bandingkan beberapa kandidat model.",
    lessons: ["fe-what-is-feature-engineering", "fe-creating-new-features", "fe-feature-selection"],
  },
  {
    id: "selection",
    n: 9,
    title: "Model Selection",
    phase: "model",
    goal: "Membandingkan beberapa algoritma kandidat (termasuk baseline sederhana) dengan cross-validation pada training data, memakai metrik yang sesuai tujuan.",
    input: "X_train, y_train, pipeline preprocessing.",
    output_desc: "Tabel perbandingan skor CV; satu atau dua kandidat terbaik.",
    libraries: "scikit-learn",
    functions: ["DummyClassifier", "LogisticRegression", "RandomForestClassifier", "cross_val_score(scoring=\"recall\")"],
    code: `${PREP}
from sklearn.dummy import DummyClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

kandidat = {
    "Baseline (selalu mayoritas)": DummyClassifier(strategy="most_frequent"),
    "Logistic Regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42, class_weight="balanced"),
}
for nama, clf in kandidat.items():
    pipe = Pipeline([("prep", preprocess), ("clf", clf)])
    rec = cross_val_score(pipe, X_train, y_train, cv=5, scoring="recall")
    f1 = cross_val_score(pipe, X_train, y_train, cv=5, scoring="f1")
    print(f"{nama:<28} recall={rec.mean():.3f} f1={f1.mean():.3f}")`,
    mistakes: ["Memilih model berdasarkan skor test set (test set jadi tidak netral).", "Tidak membandingkan dengan baseline.", "Hanya melihat accuracy."],
    next: "Kandidat terbaik dilatih penuh pada training data.",
    lessons: ["mlf-baseline-model", "clf-comparing-classification-models", "imp-cross-validation"],
  },
  {
    id: "training",
    n: 10,
    title: "Model Training",
    phase: "model",
    goal: "Melatih pipeline (preprocessing + model) dengan `fit()` pada training data. Model mempelajari parameter (misalnya koefisien Logistic Regression).",
    input: "Pipeline, X_train, y_train.",
    output_desc: "Model terlatih dengan parameter yang dipelajari.",
    libraries: "scikit-learn",
    functions: ["pipeline.fit(X_train, y_train)", "named_steps", "coef_"],
    code: `${MODEL}
model.fit(X_train, y_train)
coef = pd.Series(model.named_steps["clf"].coef_[0], index=model.named_steps["prep"].get_feature_names_out())
urutan = coef.abs().sort_values(ascending=False).index
print(coef[urutan].head(3).round(3))`,
    mistakes: ["Melatih dengan X yang masih berisi target atau ID.", "Mengabaikan ConvergenceWarning (biasanya karena fitur belum di-scale).", "Melatih ulang pada test set."],
    next: "Pastikan performanya stabil dengan validasi.",
    lessons: ["mlf-training", "mlf-fit", "clf-logistic-regression"],
  },
  {
    id: "validation",
    n: 11,
    title: "Model Validation",
    phase: "model",
    goal: "Mengukur performa pada data yang tidak dilihat saat training memakai validation set atau cross-validation — bukan test set — serta memeriksa overfitting (selisih skor train vs validasi).",
    input: "Pipeline, X_train, y_train.",
    output_desc: "Skor validasi beberapa metrik, rata-rata dan sebarannya.",
    libraries: "scikit-learn",
    functions: ["cross_validate(scoring=[...], return_train_score=True)", "StratifiedKFold"],
    code: `${MODEL}
from sklearn.model_selection import cross_validate, StratifiedKFold

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
hasil = cross_validate(model, X_train, y_train, cv=cv, scoring=["recall", "precision", "roc_auc"], return_train_score=True)
for m in ["recall", "precision", "roc_auc"]:
    print(f"{m:<9} train={hasil['train_' + m].mean():.3f} val={hasil['test_' + m].mean():.3f}")`,
    mistakes: ["Menganggap skor training sebagai performa sebenarnya.", "Preprocessing di luar pipeline sehingga bocor ke setiap fold.", "Tidak melihat sebaran skor antar-fold."],
    next: "Jika validasi stabil, coba tingkatkan dengan hyperparameter tuning.",
    lessons: ["imp-k-fold-cross-validation", "imp-stratified-k-fold", "mlf-overfitting", "mlf-generalization"],
  },
  {
    id: "tuning",
    n: 12,
    title: "Hyperparameter Tuning",
    phase: "model",
    goal: "Mencari kombinasi hyperparameter terbaik dengan GridSearchCV/RandomizedSearchCV yang memakai cross-validation pada training data.",
    input: "Pipeline, grid parameter, X_train, y_train.",
    output_desc: "best_params_, best_score_, dan best_estimator_ yang sudah dilatih ulang pada seluruh training data.",
    libraries: "scikit-learn",
    functions: ["GridSearchCV(pipe, param_grid, cv=5, scoring=\"recall\")", "best_params_", "best_estimator_"],
    code: `${MODEL}
from sklearn.model_selection import GridSearchCV

param_grid = {"clf__C": [0.01, 0.1, 1, 10]}
search = GridSearchCV(model, param_grid, cv=5, scoring="f1")
search.fit(X_train, y_train)
print(search.best_params_, round(search.best_score_, 3))`,
    mistakes: ["Tuning berdasarkan skor test set.", "Grid terlalu besar (lambat) tanpa alasan.", "Lupa prefix nama step pipeline (`clf__C`)."],
    next: "Model terbaik dievaluasi SEKALI pada test set.",
    lessons: ["imp-hyperparameter-tuning", "imp-gridsearchcv", "mlf-hyperparameters"],
  },
  {
    id: "evaluation",
    n: 13,
    title: "Final Model Evaluation",
    phase: "result",
    goal: "Mengukur performa akhir model terpilih pada test set yang belum pernah dipakai untuk keputusan apa pun, lalu menginterpretasikannya dalam konteks bisnis.",
    input: "Model terbaik, X_test, y_test.",
    output_desc: "Confusion matrix, classification report, ROC-AUC, dan interpretasi (berapa pelanggan churn yang tertangkap/terlewat).",
    libraries: "scikit-learn",
    functions: ["confusion_matrix", "classification_report", "roc_auc_score", "predict_proba"],
    code: `${MODEL}
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score

model.set_params(clf__C=10)   # hyperparameter terbaik dari tahap 12 (dipilih dengan CV, bukan test set)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(confusion_matrix(y_test, y_pred))
print(classification_report(y_test, y_pred, digits=3))
print("ROC-AUC:", round(roc_auc_score(y_test, y_prob), 3))`,
    mistakes: ["Mengulang evaluasi test set berkali-kali sambil mengubah model (test set tidak lagi netral).", "Hanya melaporkan accuracy.", "Tidak menjelaskan arti FP dan FN bagi bisnis."],
    next: "Model yang memenuhi kriteria dipakai untuk memprediksi data baru.",
    lessons: ["eval-confusion-matrix", "eval-recall", "eval-classification-report", "eval-interpreting-model-performance"],
  },
  {
    id: "prediction",
    n: 14,
    title: "Prediction",
    phase: "result",
    goal: "Memakai model untuk data baru dengan format kolom yang sama seperti saat training, termasuk memilih threshold yang sesuai kebutuhan bisnis.",
    input: "Data baru (DataFrame dengan kolom yang sama).",
    output_desc: "Prediksi kelas dan probabilitas.",
    libraries: "pandas, scikit-learn",
    functions: ["model.predict()", "model.predict_proba()"],
    code: `${MODEL}
model.fit(X_train, y_train)
baru = pd.DataFrame([
    {"gender": "Female", "age": 29, "tenure_months": 2, "contract": "Month-to-month", "internet_service": "Fiber optic", "monthly_charges": 99.5, "support_tickets": 3, "total_charges": 199.0},
    {"gender": "Male", "age": 51, "tenure_months": 60, "contract": "Two year", "internet_service": "DSL", "monthly_charges": 45.0, "support_tickets": 0, "total_charges": 2700.0},
])
prob = model.predict_proba(baru)[:, 1]
for p in prob:
    print(f"Prob churn {p:.2f} -> {'HUBUNGI' if p >= 0.5 else 'aman'}")`,
    mistakes: ["Urutan/nama kolom data baru berbeda dari training.", "Lupa menerapkan preprocessing yang sama (solusi: simpan pipeline utuh).", "Memakai threshold 0.5 tanpa mempertimbangkan biaya FP/FN."],
    next: "Simpan pipeline agar bisa dipakai tanpa melatih ulang.",
    lessons: ["mlf-predict", "mlf-predict-proba", "clf-classification-threshold"],
  },
  {
    id: "saving",
    n: 15,
    title: "Model Saving",
    phase: "result",
    goal: "Menyimpan pipeline terlatih (preprocessing + model) ke file agar dapat dimuat kembali untuk prediksi. Catat versi library karena file model terikat versi scikit-learn.",
    input: "Pipeline terlatih.",
    output_desc: "File `.joblib` dan catatan versi.",
    libraries: "joblib, scikit-learn",
    functions: ["joblib.dump()", "joblib.load()", "sklearn.__version__"],
    code: `${MODEL}
import joblib
import sklearn

model.fit(X_train, y_train)
joblib.dump(model, "churn_model.joblib")
loaded = joblib.load("churn_model.joblib")
print("Prediksi sama:", (loaded.predict(X_test) == model.predict(X_test)).all())
print("scikit-learn", sklearn.__version__)`,
    mistakes: ["Hanya menyimpan model tanpa preprocessing.", "Tidak mencatat versi library.", "Memuat file model dari sumber yang tidak tepercaya (pickle/joblib bisa menjalankan kode)."],
    next: "Model tersimpan dibungkus menjadi layanan/aplikasi.",
    lessons: ["dep-saving-a-trained-model", "dep-pickle-and-joblib", "dep-model-loading"],
  },
  {
    id: "deployment",
    n: 16,
    title: "Deployment",
    phase: "result",
    goal: "Menyediakan model untuk pengguna: fungsi prediksi, aplikasi Streamlit, atau API FastAPI/Flask. Setelah itu, pantau performa (monitoring) karena data dunia nyata bisa berubah (data drift). Contoh di bawah membuat fungsi prediksi yang menjadi inti aplikasi.",
    input: "File model tersimpan dan format input yang disepakati.",
    output_desc: "Fungsi/aplikasi/API prediksi, beserta rencana monitoring.",
    libraries: "joblib, pandas; Streamlit / FastAPI (dijalankan di server atau komputer, bukan di editor browser ini)",
    functions: ["def predict_churn(data: dict)", "joblib.load()", "st.number_input() / @app.post() (di luar browser)"],
    code: `${MODEL}
import joblib

model.fit(X_train, y_train)
joblib.dump(model, "churn_model.joblib")

def predict_churn(customer: dict, threshold: float = 0.5) -> dict:
    """Fungsi inti yang nanti dipanggil oleh aplikasi Streamlit atau endpoint FastAPI."""
    pipe = joblib.load("churn_model.joblib")
    prob = float(pipe.predict_proba(pd.DataFrame([customer]))[0, 1])
    return {"churn_probability": round(prob, 3), "churn": prob >= threshold}

print(predict_churn({"gender": "Male", "age": 35, "tenure_months": 3, "contract": "Month-to-month",
                     "internet_service": "Fiber optic", "monthly_charges": 105.0,
                     "support_tickets": 4, "total_charges": 315.0}))`,
    mistakes: ["Tidak memvalidasi input pengguna.", "Tidak memantau performa setelah rilis.", "Melatih ulang otomatis tanpa evaluasi."],
    next: "Monitoring menghasilkan data dan masukan baru — workflow kembali ke tahap awal (iteratif).",
    lessons: ["dep-creating-a-prediction-function", "dep-introduction-to-streamlit", "dep-introduction-to-flask-or-fastapi", "dep-introduction-to-model-monitoring"],
  },
];

export const WORKFLOW_STEPS: WorkflowStep[] = RAW.map((s) => ({ ...s, output: s.code ? GENERATED_OUTPUTS[`wf:${s.id}`] : undefined }));
