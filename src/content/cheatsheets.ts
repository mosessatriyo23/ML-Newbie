// Cheat sheet sintaks. Field `output` diisi dari hasil eksekusi nyata di Pyodide
// (scripts/gen-outputs.ts → generated-outputs.ts) dan diverifikasi ulang oleh scripts/test-content.ts.
import { GENERATED_OUTPUTS } from "./generated-outputs.ts";

export interface CheatEntry {
  name: string;
  syntax: string;
  use: string;
  params?: string;
  example?: string;
  /** Output persis dari `example` (hasil eksekusi nyata). */
  output?: string;
  /** Contoh menghasilkan grafik, bukan teks. */
  figure?: boolean;
}
export interface CheatCategory {
  id: string;
  title: string;
  items: CheatEntry[];
}

type Raw = Omit<CheatEntry, "output">;

const RAW: { id: string; title: string; items: Raw[] }[] = [
  {
    id: "python",
    title: "Python Cheat Sheet",
    items: [
      { name: "print()", syntax: 'print(a, b, sep=" ", end="\\n")', use: "Menampilkan output.", params: "sep = pemisah antar-nilai, end = akhir baris", example: 'print("Akurasi:", 0.9, sep=" ")' },
      { name: "f-string", syntax: 'f"{x:.2f} {y:.1%}"', use: "Menyisipkan & memformat nilai dalam teks.", params: ".2f = 2 desimal, .1% = persen, <10 = rata kiri lebar 10", example: 'acc = 0.91847\nprint(f"Akurasi {acc:.2f} ({acc:.1%})")' },
      { name: "Konversi tipe", syntax: 'int("5"), float("2.5"), str(10), bool(1)', use: "Mengubah tipe data.", example: 'print(int("21") + 1, float("3.5"), str(10) + "%")' },
      { name: "List", syntax: "x = [1, 2, 3]; x.append(4); x[0]; x[-1]; x[1:3]", use: "Koleksi berurutan yang bisa diubah.", params: "append, insert, remove, pop, sort, copy", example: "x = [3, 1, 2]\nx.append(5)\nprint(x[0], x[-1], sorted(x))" },
      { name: "Dictionary", syntax: 'd = {"k": v}; d["k"]; d.get("k", default); d.items()', use: "Pasangan key-value.", example: 'skor = {"KNN": 0.91, "SVM": 0.94}\nprint(skor.get("Tree", 0), max(skor, key=skor.get))' },
      { name: "Set", syntax: "set(x); a | b; a & b; a - b", use: "Nilai unik & operasi himpunan.", example: 'print(sorted(set(["A", "B", "A"])), {1, 2} & {2, 3})' },
      { name: "if / elif / else", syntax: "if k1:\n    ...\nelif k2:\n    ...\nelse:\n    ...", use: "Percabangan.", example: 'nilai = 78\nif nilai >= 85:\n    print("A")\nelif nilai >= 70:\n    print("B")\nelse:\n    print("C")' },
      { name: "for loop", syntax: "for i, x in enumerate(data):\nfor a, b in zip(x, y):", use: "Mengulang setiap elemen.", example: "for i, m in enumerate([\"KNN\", \"SVM\"], start=1):\n    print(i, m)" },
      { name: "Function", syntax: "def f(x, n=2):\n    return x ** n", use: "Kode yang dapat dipakai ulang.", params: "default parameter, keyword argument, return beberapa nilai", example: "def f(x, n=2):\n    return x ** n\nprint(f(3), f(2, n=3))" },
      { name: "try / except", syntax: "try:\n    ...\nexcept ValueError as e:\n    ...", use: "Menangani error.", example: 'try:\n    int("abc")\nexcept ValueError as e:\n    print("Error:", e)' },
      { name: "Baca/tulis file", syntax: 'with open("f.txt", "w", encoding="utf-8") as f:\n    f.write("...")', use: "File teks; gunakan with agar file tertutup otomatis.", example: 'with open("cs.txt", "w", encoding="utf-8") as f:\n    f.write("halo\\n")\nwith open("cs.txt", encoding="utf-8") as f:\n    print(f.read().strip())' },
    ],
  },
  {
    id: "numpy",
    title: "NumPy Cheat Sheet",
    items: [
      { name: "np.array()", syntax: "np.array([1, 2, 3])", use: "Membuat array dari list.", example: "import numpy as np\na = np.array([1, 2, 3])\nprint(a, a.dtype, a.shape)" },
      { name: "arange / linspace", syntax: "np.arange(start, stop, step); np.linspace(a, b, n)", use: "Deret angka berjarak sama.", example: "import numpy as np\nprint(np.arange(0, 10, 3))\nprint(np.linspace(0, 1, 5))" },
      { name: "zeros / ones", syntax: "np.zeros((2, 3)); np.ones(4)", use: "Array berisi 0 atau 1.", example: "import numpy as np\nprint(np.zeros((2, 3)))" },
      { name: "reshape", syntax: "a.reshape(baris, kolom)", use: "Mengubah bentuk array; -1 = dihitung otomatis.", example: "import numpy as np\nprint(np.arange(6).reshape(2, -1))" },
      { name: "Indexing 2D", syntax: "m[baris, kolom]; m[:, 0]; m[1, :]", use: "Mengambil elemen, kolom, atau baris.", example: "import numpy as np\nm = np.array([[1, 2, 3], [4, 5, 6]])\nprint(m[1, 2], m[:, 0])" },
      { name: "Boolean indexing", syntax: "a[a > 5]", use: "Memfilter elemen dengan kondisi.", example: "import numpy as np\na = np.array([3, 8, 1, 9])\nprint(a[a > 5], (a > 5).sum())" },
      { name: "Statistik", syntax: "a.mean(); np.median(a); a.std(); a.min(); a.max()", use: "Ringkasan numerik. std default ddof=0 (populasi).", example: "import numpy as np\na = np.array([2, 4, 4, 4, 5, 5, 7, 9])\nprint(a.mean(), np.median(a), a.std())" },
      { name: "axis", syntax: "m.sum(axis=0); m.mean(axis=1)", use: "axis=0 per kolom, axis=1 per baris.", example: "import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m.sum(axis=0), m.sum(axis=1))" },
      { name: "Random generator", syntax: "rng = np.random.default_rng(42); rng.normal(0, 1, size)", use: "Angka acak yang reproducible (API modern).", example: "import numpy as np\nrng = np.random.default_rng(42)\nprint(rng.integers(0, 10, size=5))" },
      { name: "Broadcasting", syntax: "m - m.mean(axis=0)", use: "Operasi antar-array berbeda ukuran yang kompatibel.", example: "import numpy as np\nm = np.array([[1, 2], [3, 4]])\nprint(m - m.mean(axis=0))" },
    ],
  },
  {
    id: "pandas",
    title: "Pandas Cheat Sheet",
    items: [
      { name: "pd.read_csv()", syntax: 'pd.read_csv("file.csv", sep=",", usecols=[...])', use: "Membaca file CSV menjadi DataFrame.", params: "sep, usecols, header, index_col, na_values, nrows", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.head(3))' },
      { name: "read_csv dengan sep (data nyata)", syntax: 'pd.read_csv("winequality-red.csv", sep=";")', use: "File asli Wine Quality (UCI) memakai titik koma sebagai pemisah kolom.", params: "sep", example: 'import pandas as pd\ndf = pd.read_csv("winequality-red.csv", sep=";")\nprint(df.shape)\nprint(df["quality"].value_counts().sort_index().to_dict())' },
      { name: "pd.DataFrame()", syntax: 'pd.DataFrame({"kolom": [...]})', use: "Membuat DataFrame dari dictionary.", example: 'import pandas as pd\ndf = pd.DataFrame({"nama": ["A", "B"], "nilai": [80, 90]})\nprint(df)' },
      { name: "Info dasar", syntax: "df.shape; df.columns; df.dtypes; df.info()", use: "Memahami struktur dataset.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.shape)\nprint(list(df.columns))' },
      { name: "describe()", syntax: "df.describe()", use: "Statistik ringkas kolom numerik.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df["Score"].describe().round(2))' },
      { name: "Pilih kolom", syntax: 'df["kolom"]; df[["k1", "k2"]]', use: "Satu kolom (Series) atau beberapa kolom (DataFrame).", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df[["Name", "Score"]].head(2))' },
      { name: "loc / iloc", syntax: 'df.loc[baris, "kolom"]; df.iloc[0:3, 1]', use: "loc berbasis label, iloc berbasis posisi.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.loc[0, "Name"], df.iloc[1, 3])' },
      { name: "Filter", syntax: 'df[(df["a"] > 1) & (df["b"] == "x")]', use: "Memilih baris dengan kondisi; setiap kondisi dalam kurung.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df[(df["Score"] > 80) & (df["City"] == "Jakarta")]["Name"].tolist())' },
      { name: "sort_values()", syntax: 'df.sort_values("kolom", ascending=False)', use: "Mengurutkan baris.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.sort_values("Score", ascending=False)["Name"].head(3).tolist())' },
      { name: "groupby()", syntax: 'df.groupby("k")["v"].agg(["mean", "count"])', use: "Agregasi per kelompok.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.groupby("City")["Score"].mean().round(1))' },
      { name: "value_counts()", syntax: 'df["k"].value_counts(normalize=False)', use: "Frekuensi setiap kategori.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df["City"].value_counts().to_dict())' },
      { name: "Missing value", syntax: "df.isnull().sum(); df.dropna(); df.fillna(nilai)", use: "Memeriksa dan menangani nilai kosong.", example: 'import pandas as pd\ndf = pd.read_csv("customer_churn.csv")\nprint(df.isnull().sum()[lambda s: s > 0])' },
      { name: "Kolom baru / hapus / rename", syntax: 'df["baru"] = ...; df.drop(columns=[...]); df.rename(columns={...})', use: "Memodifikasi kolom.", example: 'import pandas as pd\ndf = pd.read_csv("data.csv")\ndf["lulus"] = df["Score"] >= 80\ndf = df.drop(columns=["City"]).rename(columns={"Score": "nilai"})\nprint(list(df.columns))' },
    ],
  },
  {
    id: "statistics",
    title: "Statistics Cheat Sheet",
    items: [
      { name: "Mean / median / mode", syntax: "np.mean(x); np.median(x); statistics.mode(x)", use: "Ukuran pemusatan data.", example: "import numpy as np\nimport statistics as st\nx = [2, 3, 3, 4, 50]\nprint(np.mean(x), np.median(x), st.mode(x))" },
      { name: "Variance & std", syntax: "np.var(x, ddof=1); np.std(x, ddof=1)", use: "Ukuran sebaran. ddof=1 untuk sampel (pembagi n−1); Pandas .std() default ddof=1.", example: "import numpy as np\nx = [2, 4, 4, 4, 5, 5, 7, 9]\nprint(np.std(x), round(np.std(x, ddof=1), 4))" },
      { name: "Quartile & IQR", syntax: "q1, q3 = np.percentile(x, [25, 75]); iqr = q3 - q1", use: "Sebaran tengah data dan batas outlier (Q1 − 1.5·IQR, Q3 + 1.5·IQR).", example: "import numpy as np\nx = [1, 2, 3, 4, 5, 6, 7, 8, 100]\nq1, q3 = np.percentile(x, [25, 75])\niqr = q3 - q1\nprint(q1, q3, iqr, q3 + 1.5 * iqr)" },
      { name: "Korelasi", syntax: 'np.corrcoef(x, y)[0, 1]; df.corr(numeric_only=True)', use: "Kekuatan hubungan linear (-1 sampai 1).", example: "import numpy as np\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\nprint(round(np.corrcoef(x, y)[0, 1], 3))" },
      { name: "Kovarians", syntax: "np.cov(x, y)[0, 1]", use: "Arah hubungan (satuan bergantung data).", example: "import numpy as np\nprint(np.cov([1, 2, 3], [2, 4, 7])[0, 1])" },
      { name: "Skewness", syntax: 'df["k"].skew()', use: "Kemiringan distribusi: >0 ekor kanan panjang.", example: 'import pandas as pd\nprint(round(pd.Series([1, 2, 2, 3, 3, 3, 20]).skew(), 3))' },
      { name: "Euclidean & Manhattan", syntax: "np.linalg.norm(a - b); np.abs(a - b).sum()", use: "Jarak antar-sampel (KNN, K-Means).", example: "import numpy as np\na = np.array([1, 2])\nb = np.array([4, 6])\nprint(np.linalg.norm(a - b), np.abs(a - b).sum())" },
    ],
  },
  {
    id: "eda",
    title: "EDA Cheat Sheet",
    items: [
      { name: "Langkah awal", syntax: "df.head(); df.shape; df.info(); df.describe()", use: "Kenali isi, ukuran, tipe, dan statistik data." },
      { name: "Missing value per kolom", syntax: "df.isnull().sum().sort_values(ascending=False)", use: "Mencari kolom dengan data kosong.", example: 'import pandas as pd\ndf = pd.read_csv("customer_churn.csv")\nprint(df.isnull().sum().sort_values(ascending=False).head(3))' },
      { name: "Missing value pada data nyata", syntax: "df.isnull().sum()[lambda s: s > 0]", use: "Heart Disease (UCI) memiliki missing value asli di kolom ca dan thal.", example: 'import pandas as pd\ndf = pd.read_csv("heart_disease.csv")\nprint(df.isnull().sum()[lambda s: s > 0])\nprint("Ada penyakit:", (df["num"] > 0).mean().round(3))' },
      { name: "Duplikat", syntax: "df.duplicated().sum()", use: "Menghitung baris duplikat.", example: 'import pandas as pd\ndf = pd.read_csv("customer_churn.csv")\nprint(df.duplicated().sum())' },
      { name: "Class distribution", syntax: 'df["target"].value_counts(normalize=True)', use: "Memeriksa keseimbangan kelas target.", example: 'import pandas as pd\ndf = pd.read_csv("iris.csv")\nprint(df["species"].value_counts(normalize=True).round(3))' },
      { name: "Korelasi dengan target", syntax: 'df.corr(numeric_only=True)["target"].sort_values()', use: "Fitur numerik yang paling berhubungan dengan target.", example: 'import pandas as pd\ndf = pd.read_csv("student_scores.csv")\nprint(df.corr(numeric_only=True)["final_score"].round(2))' },
      { name: "Rata-rata target per kategori", syntax: 'df.groupby("kategori")["target"].mean()', use: "Analisis bivariat kategori vs target.", example: 'import pandas as pd\ndf = pd.read_csv("customer_churn.csv")\nprint(df.groupby("contract")["churn"].mean().round(3))' },
    ],
  },
  {
    id: "matplotlib",
    title: "Matplotlib Cheat Sheet",
    items: [
      { name: "Line plot", syntax: "plt.plot(x, y); plt.show()", use: "Tren (misalnya loss per epoch).", example: 'import matplotlib.pyplot as plt\nplt.plot([1, 2, 3, 4], [0.9, 0.6, 0.45, 0.4], marker="o")\nplt.xlabel("Epoch")\nplt.ylabel("Loss")\nplt.show()', figure: true },
      { name: "Scatter plot", syntax: "plt.scatter(x, y)", use: "Hubungan dua variabel numerik.", example: 'import pandas as pd\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("student_scores.csv")\nplt.scatter(df["hours_studied"], df["final_score"])\nplt.show()', figure: true },
      { name: "Histogram", syntax: "plt.hist(x, bins=10)", use: "Distribusi satu variabel numerik.", example: 'import pandas as pd\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("iris.csv")\nplt.hist(df["petal_length"], bins=15)\nplt.show()', figure: true },
      { name: "Bar chart", syntax: "plt.bar(kategori, nilai)", use: "Membandingkan nilai antar-kategori.", example: 'import matplotlib.pyplot as plt\nplt.bar(["KNN", "SVM", "Tree"], [0.91, 0.94, 0.88])\nplt.ylim(0.8, 1)\nplt.show()', figure: true },
      { name: "Boxplot", syntax: "plt.boxplot(x)", use: "Kuartil dan outlier.", example: 'import matplotlib.pyplot as plt\nplt.boxplot([1, 2, 3, 4, 5, 6, 30])\nplt.show()', figure: true },
      { name: "Subplots", syntax: "fig, axes = plt.subplots(1, 2, figsize=(10, 4))", use: "Beberapa grafik dalam satu figure.", example: 'import matplotlib.pyplot as plt\nfig, axes = plt.subplots(1, 2, figsize=(8, 3))\naxes[0].plot([1, 2, 3])\naxes[1].bar(["a", "b"], [3, 5])\nplt.tight_layout()\nplt.show()', figure: true },
    ],
  },
  {
    id: "seaborn",
    title: "Seaborn Cheat Sheet",
    items: [
      { name: "histplot", syntax: 'sns.histplot(data=df, x="kolom", kde=True)', use: "Histogram + kurva kepadatan.", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("iris.csv")\nsns.histplot(data=df, x="sepal_length", kde=True)\nplt.show()', figure: true },
      { name: "boxplot", syntax: 'sns.boxplot(data=df, x="kategori", y="numerik")', use: "Distribusi numerik per kategori.", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("iris.csv")\nsns.boxplot(data=df, x="species", y="petal_length")\nplt.show()', figure: true },
      { name: "countplot", syntax: 'sns.countplot(data=df, x="kategori")', use: "Jumlah data per kategori (class distribution).", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("customer_churn.csv")\nsns.countplot(data=df, x="contract", hue="churn")\nplt.show()', figure: true },
      { name: "scatterplot", syntax: 'sns.scatterplot(data=df, x="a", y="b", hue="kelas")', use: "Scatter dengan warna per kelas.", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("iris.csv")\nsns.scatterplot(data=df, x="petal_length", y="petal_width", hue="species")\nplt.show()', figure: true },
      { name: "heatmap korelasi", syntax: 'sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")', use: "Matriks korelasi berwarna.", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("student_scores.csv")\nsns.heatmap(df.corr(numeric_only=True), annot=True, fmt=".2f", cmap="coolwarm")\nplt.show()', figure: true },
      { name: "pairplot", syntax: 'sns.pairplot(df, hue="kelas")', use: "Semua pasangan fitur sekaligus.", example: 'import pandas as pd\nimport seaborn as sns\nimport matplotlib.pyplot as plt\ndf = pd.read_csv("iris.csv")\nsns.pairplot(df, hue="species", height=1.6)\nplt.show()', figure: true },
    ],
  },
  {
    id: "preprocessing",
    title: "Preprocessing Cheat Sheet",
    items: [
      { name: "train_test_split", syntax: "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)", use: "Membagi data SEBELUM preprocessing yang di-fit.", params: "test_size, random_state, stratify, shuffle", example: 'import pandas as pd\nfrom sklearn.model_selection import train_test_split\ndf = pd.read_csv("iris.csv")\nX = df.drop(columns="species")\ny = df["species"]\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\nprint(X_train.shape, X_test.shape)' },
      { name: "SimpleImputer", syntax: 'SimpleImputer(strategy="median").fit(X_train)', use: "Mengisi missing value; fit hanya di training data.", params: 'strategy: "mean", "median", "most_frequent", "constant"', example: 'import numpy as np\nfrom sklearn.impute import SimpleImputer\nX_train = np.array([[1.0], [np.nan], [3.0]])\nimp = SimpleImputer(strategy="median").fit(X_train)\nprint(imp.transform([[np.nan]]))' },
      { name: "StandardScaler", syntax: "scaler.fit_transform(X_train); scaler.transform(X_test)", use: "z = (x − mean) / std. Penting untuk KNN, SVM, Logistic Regression.", example: 'from sklearn.preprocessing import StandardScaler\nX_train = [[1.0], [2.0], [3.0]]\nX_test = [[4.0]]\nsc = StandardScaler()\nprint(sc.fit_transform(X_train).ravel(), sc.transform(X_test).ravel())' },
      { name: "MinMaxScaler", syntax: "MinMaxScaler().fit_transform(X_train)", use: "Skala ke rentang 0–1.", example: "from sklearn.preprocessing import MinMaxScaler\nprint(MinMaxScaler().fit_transform([[10], [15], [20]]).ravel())" },
      { name: "OneHotEncoder", syntax: 'OneHotEncoder(handle_unknown="ignore", sparse_output=False)', use: "Kategori nominal → kolom 0/1.", params: "handle_unknown, sparse_output, drop", example: 'from sklearn.preprocessing import OneHotEncoder\nenc = OneHotEncoder(handle_unknown="ignore", sparse_output=False)\nenc.fit([["Jakarta"], ["Bandung"]])\nprint(enc.get_feature_names_out(), enc.transform([["Bandung"], ["Medan"]]))' },
      { name: "OrdinalEncoder", syntax: 'OrdinalEncoder(categories=[["low", "mid", "high"]])', use: "Kategori berurutan → angka berurutan.", example: 'from sklearn.preprocessing import OrdinalEncoder\nenc = OrdinalEncoder(categories=[["low", "mid", "high"]])\nprint(enc.fit_transform([["mid"], ["high"], ["low"]]).ravel())' },
      { name: "ColumnTransformer + Pipeline", syntax: "Pipeline([(\"prep\", ColumnTransformer([...])), (\"model\", ...)])", use: "Preprocessing berbeda per kolom, aman dari leakage di cross-validation.", example: 'import pandas as pd\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import OneHotEncoder, StandardScaler\nfrom sklearn.linear_model import LinearRegression\ndf = pd.read_csv("house_prices.csv")\nX = df[["area_m2", "city"]]\ny = df["price_million"]\nprep = ColumnTransformer([("num", StandardScaler(), ["area_m2"]), ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"])])\nmodel = Pipeline([("prep", prep), ("reg", LinearRegression())]).fit(X, y)\nprint(model.named_steps["prep"].get_feature_names_out())' },
    ],
  },
  {
    id: "sklearn",
    title: "Scikit-learn Cheat Sheet",
    items: [
      { name: "Pola API estimator", syntax: "model = Model(params)\nmodel.fit(X_train, y_train)\ny_pred = model.predict(X_test)", use: "Semua model scikit-learn memakai pola yang sama.", example: 'from sklearn.tree import DecisionTreeClassifier\nmodel = DecisionTreeClassifier(random_state=0)\nmodel.fit([[0], [1], [2], [3]], [0, 0, 1, 1])\nprint(model.predict([[0.5], [2.5]]))' },
      { name: "fit / transform / fit_transform", syntax: "scaler.fit(X_train); scaler.transform(X_test)", use: "fit = mempelajari parameter dari data; transform = menerapkannya; fit_transform = keduanya (hanya untuk train)." },
      { name: "predict_proba", syntax: "model.predict_proba(X)[:, 1]", use: "Probabilitas kelas positif (untuk threshold & ROC).", example: 'from sklearn.linear_model import LogisticRegression\nm = LogisticRegression().fit([[0], [1], [2], [3]], [0, 0, 1, 1])\nprint(m.predict_proba([[1.5]]).round(3))' },
      { name: "cross_val_score", syntax: 'cross_val_score(model, X, y, cv=5, scoring="accuracy")', use: "Estimasi performa dengan K-fold cross-validation.", example: 'import pandas as pd\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.neighbors import KNeighborsClassifier\ndf = pd.read_csv("iris.csv")\nscores = cross_val_score(KNeighborsClassifier(), df.drop(columns="species"), df["species"], cv=5)\nprint(scores.round(3), round(scores.mean(), 3))' },
      { name: "GridSearchCV", syntax: 'GridSearchCV(model, {"param": [..]}, cv=5).fit(X_train, y_train)', use: "Tuning hyperparameter dengan cross-validation.", example: 'import pandas as pd\nfrom sklearn.model_selection import GridSearchCV\nfrom sklearn.neighbors import KNeighborsClassifier\ndf = pd.read_csv("iris.csv")\ngs = GridSearchCV(KNeighborsClassifier(), {"n_neighbors": [1, 5, 15]}, cv=5)\ngs.fit(df.drop(columns="species"), df["species"])\nprint(gs.best_params_, round(gs.best_score_, 3))' },
      { name: "Simpan & muat model", syntax: 'joblib.dump(model, "model.joblib"); joblib.load("model.joblib")', use: "Persistensi model untuk deployment.", example: 'import joblib\nfrom sklearn.linear_model import LinearRegression\nm = LinearRegression().fit([[0], [1]], [0, 2])\njoblib.dump(m, "model.joblib")\nprint(joblib.load("model.joblib").predict([[3]]))' },
    ],
  },
  {
    id: "classification",
    title: "Classification Cheat Sheet",
    items: [
      { name: "LogisticRegression", syntax: "LogisticRegression(C=1.0, max_iter=1000)", use: "Baseline klasifikasi; butuh scaling.", params: "C (kebalikan kekuatan regularisasi), max_iter, class_weight" },
      { name: "KNeighborsClassifier", syntax: "KNeighborsClassifier(n_neighbors=5)", use: "Berdasarkan tetangga terdekat; wajib scaling.", params: "n_neighbors, weights, metric" },
      { name: "DecisionTreeClassifier", syntax: "DecisionTreeClassifier(max_depth=3, random_state=42)", use: "Aturan if-else; mudah diinterpretasi; tidak butuh scaling.", params: "max_depth, min_samples_leaf, criterion" },
      { name: "RandomForestClassifier", syntax: "RandomForestClassifier(n_estimators=200, random_state=42)", use: "Ensemble banyak tree; kuat untuk data tabular.", params: "n_estimators, max_depth, class_weight" },
      { name: "SVC", syntax: 'SVC(kernel="rbf", C=1.0, probability=False)', use: "Margin maksimum; wajib scaling.", params: "kernel, C, gamma" },
      { name: "GaussianNB", syntax: "GaussianNB()", use: "Cepat; asumsi fitur independen." },
      { name: "Contoh lengkap", syntax: "fit → predict → accuracy_score", use: "Klasifikasi Iris dengan scaling + KNN.", example: 'import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.metrics import accuracy_score\ndf = pd.read_csv("iris.csv")\nX, y = df.drop(columns="species"), df["species"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\nmodel = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)).fit(X_tr, y_tr)\nprint(round(accuracy_score(y_te, model.predict(X_te)), 3))' },
    ],
  },
  {
    id: "regression",
    title: "Regression Cheat Sheet",
    items: [
      { name: "LinearRegression", syntax: "LinearRegression().fit(X, y); model.coef_; model.intercept_", use: "Hubungan linear antara fitur dan target.", example: 'import pandas as pd\nfrom sklearn.linear_model import LinearRegression\ndf = pd.read_csv("student_scores.csv")\nm = LinearRegression().fit(df[["hours_studied"]], df["final_score"])\nprint(round(m.coef_[0], 2), round(m.intercept_, 2))' },
      { name: "Ridge / Lasso", syntax: "Ridge(alpha=1.0); Lasso(alpha=0.1)", use: "Regresi linear dengan regularisasi L2 / L1.", params: "alpha = kekuatan regularisasi" },
      { name: "DecisionTreeRegressor / RandomForestRegressor", syntax: "RandomForestRegressor(n_estimators=200, random_state=42)", use: "Menangkap hubungan non-linear." },
      { name: "SVR", syntax: 'SVR(kernel="rbf", C=1.0)', use: "Support Vector Regression; butuh scaling." },
      { name: "Contoh lengkap + metrik", syntax: "fit → predict → MAE/RMSE/R²", use: "Prediksi harga rumah.", example: 'import pandas as pd\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score\ndf = pd.read_csv("house_prices.csv")\nX = df[["area_m2", "bedrooms", "age_years", "distance_to_center_km"]]\ny = df["price_million"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)\npred = LinearRegression().fit(X_tr, y_tr).predict(X_te)\nprint(round(mean_absolute_error(y_te, pred), 1), round(root_mean_squared_error(y_te, pred), 1), round(r2_score(y_te, pred), 3))' },
    ],
  },
  {
    id: "clustering",
    title: "Clustering Cheat Sheet",
    items: [
      { name: "KMeans", syntax: "KMeans(n_clusters=3, random_state=42).fit(X)", use: "Mengelompokkan berdasarkan jarak ke centroid; scaling dulu.", params: "n_clusters, n_init, random_state", example: 'import pandas as pd\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\ndf = pd.read_csv("customer_segmentation.csv")\nX = StandardScaler().fit_transform(df[["annual_income_million", "spending_score"]])\nkm = KMeans(n_clusters=5, random_state=42).fit(X)\nprint(sorted(pd.Series(km.labels_).value_counts().tolist()))' },
      { name: "Elbow method", syntax: "[KMeans(k).fit(X).inertia_ for k in range(1, 10)]", use: "Memilih K dari penurunan inertia." },
      { name: "silhouette_score", syntax: "silhouette_score(X, labels)", use: "Kualitas cluster (-1 sampai 1, makin tinggi makin baik).", example: 'import pandas as pd\nfrom sklearn.cluster import KMeans\nfrom sklearn.metrics import silhouette_score\nfrom sklearn.preprocessing import StandardScaler\ndf = pd.read_csv("customer_segmentation.csv")\nX = StandardScaler().fit_transform(df[["annual_income_million", "spending_score"]])\nfor k in [3, 5]:\n    labels = KMeans(n_clusters=k, random_state=42).fit_predict(X)\n    print(k, round(silhouette_score(X, labels), 3))' },
      { name: "DBSCAN", syntax: "DBSCAN(eps=0.5, min_samples=5)", use: "Cluster berbasis kepadatan; label -1 = noise." },
      { name: "AgglomerativeClustering", syntax: 'AgglomerativeClustering(n_clusters=3, linkage="ward")', use: "Hierarchical clustering." },
      { name: "PCA", syntax: "PCA(n_components=2).fit_transform(X_scaled)", use: "Reduksi dimensi untuk visualisasi.", example: 'import pandas as pd\nfrom sklearn.decomposition import PCA\nfrom sklearn.preprocessing import StandardScaler\ndf = pd.read_csv("iris.csv")\npca = PCA(n_components=2).fit(StandardScaler().fit_transform(df.drop(columns="species")))\nprint(pca.explained_variance_ratio_.round(3))' },
    ],
  },
  {
    id: "metrics",
    title: "Evaluation Metrics Cheat Sheet",
    items: [
      { name: "confusion_matrix", syntax: "confusion_matrix(y_true, y_pred)", use: "Baris = aktual, kolom = prediksi: [[TN, FP], [FN, TP]].", example: "from sklearn.metrics import confusion_matrix\nprint(confusion_matrix([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1]))" },
      { name: "accuracy / precision / recall / F1", syntax: "accuracy_score, precision_score, recall_score, f1_score", use: "Metrik klasifikasi. Precision = TP/(TP+FP), Recall = TP/(TP+FN).", example: "from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score\nyt = [1, 0, 1, 1, 0, 1]\nyp = [1, 0, 0, 1, 1, 1]\nprint(round(accuracy_score(yt, yp), 3), precision_score(yt, yp), recall_score(yt, yp), f1_score(yt, yp))" },
      { name: "classification_report", syntax: "print(classification_report(y_true, y_pred))", use: "Ringkasan precision, recall, F1 per kelas.", example: "from sklearn.metrics import classification_report\nprint(classification_report([1, 0, 1, 1, 0, 1], [1, 0, 0, 1, 1, 1]))" },
      { name: "balanced_accuracy", syntax: "balanced_accuracy_score(y_true, y_pred)", use: "Rata-rata recall setiap kelas — lebih adil pada data tidak seimbang.", example: "from sklearn.metrics import accuracy_score, balanced_accuracy_score\nyt = [0] * 9 + [1]\nyp = [0] * 10\nprint(accuracy_score(yt, yp), balanced_accuracy_score(yt, yp))" },
      { name: "ROC-AUC", syntax: "roc_auc_score(y_true, y_score)", use: "Kemampuan memisahkan kelas di semua threshold (pakai probabilitas).", example: "from sklearn.metrics import roc_auc_score\nprint(roc_auc_score([0, 0, 1, 1], [0.1, 0.4, 0.35, 0.8]))" },
      { name: "MAE / MSE / RMSE / R²", syntax: "mean_absolute_error, mean_squared_error, root_mean_squared_error, r2_score", use: "Metrik regresi. Gunakan root_mean_squared_error (parameter squared=False sudah dihapus).", example: "from sklearn.metrics import mean_absolute_error, mean_squared_error, root_mean_squared_error, r2_score\nyt = [3, 5, 7]\nyp = [2.5, 5, 8]\nprint(mean_absolute_error(yt, yp), round(mean_squared_error(yt, yp), 4), round(root_mean_squared_error(yt, yp), 4), round(r2_score(yt, yp), 4))" },
      { name: "silhouette / davies_bouldin / calinski_harabasz", syntax: "silhouette_score(X, labels); davies_bouldin_score(X, labels)", use: "Evaluasi clustering tanpa label: silhouette & CH makin tinggi makin baik, DB makin rendah makin baik." },
    ],
  },
];

export const CHEATSHEETS: CheatCategory[] = RAW.map((c) => ({
  ...c,
  items: c.items.map((it) => ({ ...it, output: it.example && !it.figure ? GENERATED_OUTPUTS[`cheat:${c.id}/${it.name}`] : undefined })),
}));

export const ML_WORKFLOW_CODE = `# === 1-3. Problem, data collection & loading ===
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

df = pd.read_csv("breast_cancer.csv")

# === 4-5. Understanding & EDA (ringkas) ===
print(df.shape)
print(df["diagnosis"].value_counts())

# === 6. Split SEBELUM preprocessing yang di-fit ===
X = df.drop(columns=["target", "diagnosis"])
y = df["target"]          # 0 = malignant, 1 = benign
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# === 7-10. Preprocessing + model dalam Pipeline (fit hanya pada train) ===
model = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])

# === 11. Validation dengan cross-validation pada training data ===
cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring="recall")
print("CV recall:", cv_scores.mean().round(3))

# === 12-13. Latih final & evaluasi SEKALI pada test set ===
model.fit(X_train, y_train)
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred, target_names=["malignant", "benign"]))

# === 14-15. Prediksi data baru & simpan model ===
joblib.dump(model, "model.joblib")
loaded = joblib.load("model.joblib")
print(loaded.predict(X_test.iloc[:3]))
`;
