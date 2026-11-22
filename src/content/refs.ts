import type { Reference } from "../types";

// Pembuat referensi agar nama sumber konsisten. Semua URL diperiksa oleh scripts/check-links.ts.
export const pyDoc = (title: string, path: string, note?: string): Reference => ({
  source: "Python Official Documentation",
  title,
  url: `https://docs.python.org/3/${path}`,
  note,
});

export const pep8 = (title: string, anchor = ""): Reference => ({
  source: "Python Official Documentation — PEP 8 Style Guide",
  title,
  url: `https://peps.python.org/pep-0008/${anchor}`,
});

export const kagglePy = (title: string, slug: string): Reference => ({
  source: "Kaggle Learn — Python",
  title,
  url: `https://www.kaggle.com/code/colinmorris/${slug}`,
});

export const KAGGLE_PYTHON_COURSE: Reference = {
  source: "Kaggle Learn",
  title: "Python (kursus gratis)",
  url: "https://www.kaggle.com/learn/python",
};

export const numpyDoc = (title: string, path: string): Reference => ({
  source: "NumPy Official Documentation",
  title,
  url: `https://numpy.org/doc/stable/${path}`,
});

export const pandasDoc = (title: string, path: string): Reference => ({
  source: "Pandas Official Documentation",
  title,
  url: `https://pandas.pydata.org/docs/${path}`,
});

export const sklearnDoc = (title: string, path: string): Reference => ({
  source: "Scikit-learn Official Documentation",
  title,
  url: `https://scikit-learn.org/stable/${path}`,
});
