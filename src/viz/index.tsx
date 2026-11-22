import type { ComponentType } from "react";
import { GradientDescentViz, KMeansViz, KnnViz, MeanMedianViz, NormalViz, OverfitViz, SplitViz, StandardizationViz, ThresholdViz } from "./ml";
import { ListIndexViz, LoopTrace, TruthTable, VariableBoxes } from "./python";

/** Registry visualisasi. Lesson merujuk visualisasi dengan key di sini (field `visual`). */
export const VISUALS: Record<string, ComponentType> = {
  variables: VariableBoxes,
  "list-index": ListIndexViz,
  "loop-trace": LoopTrace,
  "truth-table": TruthTable,
  "mean-median": MeanMedianViz,
  normal: NormalViz,
  standardization: StandardizationViz,
  split: SplitViz,
  "gradient-descent": GradientDescentViz,
  knn: KnnViz,
  kmeans: KMeansViz,
  threshold: ThresholdViz,
  overfit: OverfitViz,
};

export const VISUAL_LAB: { key: string; title: string; module: string }[] = [
  { key: "mean-median", title: "Mean vs median", module: "Statistics" },
  { key: "normal", title: "Normal distribution", module: "Statistics" },
  { key: "standardization", title: "Standardization", module: "Preprocessing" },
  { key: "split", title: "Train-test split", module: "Data Splitting" },
  { key: "gradient-descent", title: "Linear regression & gradient descent", module: "ML Fundamentals" },
  { key: "overfit", title: "Underfitting vs overfitting", module: "ML Fundamentals" },
  { key: "knn", title: "KNN neighbors", module: "Classification" },
  { key: "kmeans", title: "K-Means clustering", module: "Clustering" },
  { key: "threshold", title: "Threshold, confusion matrix & ROC", module: "Evaluation" },
];
