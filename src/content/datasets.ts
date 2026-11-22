// Dataset bawaan: tersedia langsung di folder kerja Python (tanpa login Kaggle / API key).
import breastCancer from "./data/breast_cancer.csv?raw";
import customerChurn from "./data/customer_churn.csv?raw";
import customerSeg from "./data/customer_segmentation.csv?raw";
import dataCsv from "./data/data.csv?raw";
import dataSemicolon from "./data/data_semicolon.csv?raw";
import housePrices from "./data/house_prices.csv?raw";
import iris from "./data/iris.csv?raw";
import studentScores from "./data/student_scores.csv?raw";

export { DATASETS, parseCsv, type DatasetInfo } from "./datasets-meta";

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

