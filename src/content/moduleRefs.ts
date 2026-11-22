import type { Reference } from "../types";
import { numpyDoc, pandasDoc, sklearnDoc } from "./refs";

const MLCC = (title: string, path = ""): Reference => ({ source: "Google Machine Learning Crash Course", title, url: `https://developers.google.com/machine-learning/crash-course${path}` });
const KAGGLE = (title: string, slug: string): Reference => ({ source: "Kaggle Learn", title, url: `https://www.kaggle.com/learn/${slug}` });
const ISLP: Reference = { source: "An Introduction to Statistical Learning with Applications in Python (James, Witten, Hastie, Tibshirani & Taylor, 2023)", title: "Buku gratis (PDF) dan materi pendukung", url: "https://www.statlearning.com/" };
const OPENINTRO: Reference = { source: "OpenIntro Statistics", title: "Buku statistika dasar gratis", url: "https://www.openintro.org/book/os/" };
const UCI: Reference = { source: "UCI Machine Learning Repository", title: "Kumpulan dataset nyata untuk Machine Learning", url: "https://archive.ics.uci.edu/" };

/** Referensi resmi per modul — ditampilkan pada subbab yang belum tersedia agar pengguna tetap punya sumber belajar yang kredibel. */
export const MODULE_REFERENCES: Record<string, Reference[]> = {
  m00: [MLCC("Machine Learning Crash Course"), { ...ISLP, note: "Bab 1–2: Introduction & Statistical Learning" }, KAGGLE("Intro to Machine Learning", "intro-to-machine-learning")],
  m02: [numpyDoc("NumPy: the absolute basics for beginners", "user/absolute_beginners.html"), numpyDoc("NumPy quickstart", "user/quickstart.html")],
  m03: [pandasDoc("Getting started", "getting_started/index.html"), pandasDoc("10 minutes to pandas", "user_guide/10min.html"), KAGGLE("Pandas", "pandas")],
  m04: [pandasDoc("IO tools (text, CSV, Excel, JSON …)", "user_guide/io.html"), sklearnDoc("Dataset loading utilities", "datasets.html"), UCI, { source: "Kaggle", title: "Kaggle Datasets", url: "https://www.kaggle.com/datasets" }],
  m05: [OPENINTRO, numpyDoc("Statistics routines", "reference/routines.statistics.html"), { ...ISLP, note: "Bab 2: Statistical Learning" }],
  m06: [{ source: "Matplotlib Documentation", title: "Tutorials", url: "https://matplotlib.org/stable/tutorials/index.html" }, { source: "Seaborn Documentation", title: "User guide and tutorial", url: "https://seaborn.pydata.org/tutorial.html" }, KAGGLE("Data Visualization", "data-visualization")],
  m07: [sklearnDoc("Cross-validation: evaluating estimator performance", "modules/cross_validation.html"), sklearnDoc("train_test_split", "modules/generated/sklearn.model_selection.train_test_split.html"), sklearnDoc("Common pitfalls and recommended practices", "common_pitfalls.html")],
  m08: [sklearnDoc("Preprocessing data", "modules/preprocessing.html"), sklearnDoc("Imputation of missing values", "modules/impute.html"), sklearnDoc("Pipelines and composite estimators", "modules/compose.html"), KAGGLE("Data Cleaning", "data-cleaning"), KAGGLE("Intermediate Machine Learning", "intermediate-machine-learning")],
  m09: [sklearnDoc("Feature selection", "modules/feature_selection.html"), sklearnDoc("Decomposing signals in components (PCA)", "modules/decomposition.html"), KAGGLE("Feature Engineering", "feature-engineering")],
  m10: [MLCC("Linear regression", "/linear-regression"), MLCC("Overfitting", "/overfitting"), sklearnDoc("Getting Started", "getting_started.html")],
  m11: [sklearnDoc("Linear Models", "modules/linear_model.html"), sklearnDoc("Metrics and scoring — regression metrics", "modules/model_evaluation.html"), { ...ISLP, note: "Bab 3: Linear Regression; Bab 6: Regularization; Bab 8: Tree-Based Methods" }],
  m12: [MLCC("Logistic regression", "/logistic-regression"), MLCC("Classification", "/classification"), sklearnDoc("Supervised learning", "supervised_learning.html"), { ...ISLP, note: "Bab 4: Classification; Bab 8: Tree-Based Methods; Bab 9: Support Vector Machines" }],
  m13: [sklearnDoc("Clustering", "modules/clustering.html"), { ...ISLP, note: "Bab 12: Unsupervised Learning" }],
  m14: [sklearnDoc("Metrics and scoring: quantifying the quality of predictions", "modules/model_evaluation.html"), MLCC("Classification: accuracy, recall, precision", "/classification/accuracy-precision-recall")],
  m15: [sklearnDoc("Tuning the hyper-parameters of an estimator", "modules/grid_search.html"), sklearnDoc("Validation curves", "modules/learning_curve.html"), sklearnDoc("Ensembles", "modules/ensemble.html"), { ...ISLP, note: "Bab 5: Resampling Methods" }],
  m16: [sklearnDoc("Model persistence", "model_persistence.html")],
};
