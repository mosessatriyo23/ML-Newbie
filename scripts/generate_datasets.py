"""Membuat dataset latihan ML Academy.

Dataset ASLI (real) diambil dari salinan yang dibundel scikit-learn (tidak perlu internet):
  - iris.csv            -> Iris (Fisher, 1936), UCI ML Repository, CC BY 4.0
  - breast_cancer.csv   -> Breast Cancer Wisconsin (Diagnostic), UCI ML Repository, CC BY 4.0

Dataset SINTETIS dibuat dengan NumPy (seed tetap) khusus untuk latihan:
  - student_scores.csv, customer_churn.csv, house_prices.csv, customer_segmentation.csv
  - data.csv, data_semicolon.csv (file kecil untuk materi dasar)

Jalankan:  python scripts/generate_datasets.py
"""

from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.datasets import load_breast_cancer, load_iris

OUT = Path(__file__).resolve().parent.parent / "src" / "content" / "data"
OUT.mkdir(parents=True, exist_ok=True)

# ---------------- Real datasets ----------------
iris = load_iris(as_frame=True)
df = iris.frame.copy()
df.columns = ["sepal_length", "sepal_width", "petal_length", "petal_width", "target"]
df["species"] = df["target"].map(dict(enumerate(iris.target_names)))
df = df.drop(columns="target")
df.to_csv(OUT / "iris.csv", index=False)

bc = load_breast_cancer(as_frame=True)
df = bc.frame.copy()
df.columns = [c.replace(" ", "_") for c in df.columns]
df["diagnosis"] = df["target"].map({0: "malignant", 1: "benign"})
df.round(5).to_csv(OUT / "breast_cancer.csv", index=False)

# ---------------- Synthetic datasets ----------------
rng = np.random.default_rng(42)

# Student scores (30 siswa)
n = 30
hours = np.round(rng.uniform(1, 10, n), 1)
attendance = rng.integers(60, 101, n)
previous = rng.integers(50, 96, n)
final = np.clip(np.round(20 + 5.2 * hours + 0.25 * attendance + 0.2 * previous + rng.normal(0, 4, n)), 0, 100).astype(int)
pd.DataFrame(
    {
        "student_id": [f"S{i:03d}" for i in range(1, n + 1)],
        "hours_studied": hours,
        "attendance": attendance,
        "previous_score": previous,
        "final_score": final,
    }
).to_csv(OUT / "student_scores.csv", index=False)

# Customer churn (400 pelanggan) — sengaja diberi sedikit missing value dan duplikat untuk latihan cleaning
n = 400
tenure = rng.integers(1, 73, n)
monthly = np.round(rng.uniform(20, 120, n), 2)
contract = rng.choice(["Month-to-month", "One year", "Two year"], n, p=[0.55, 0.25, 0.20])
internet = rng.choice(["DSL", "Fiber optic", "No"], n, p=[0.35, 0.45, 0.20])
tickets = rng.poisson(1.2, n)
logit = -1.2 + 0.025 * (monthly - 70) - 0.045 * (tenure - 24) + 1.3 * (contract == "Month-to-month") + 0.35 * tickets - 0.6 * (contract == "Two year")
prob = 1 / (1 + np.exp(-logit))
churn = (rng.uniform(0, 1, n) < prob).astype(int)
churn_df = pd.DataFrame(
    {
        "customer_id": [f"C{i:04d}" for i in range(1, n + 1)],
        "gender": rng.choice(["Female", "Male"], n),
        "age": rng.integers(18, 71, n),
        "tenure_months": tenure,
        "contract": contract,
        "internet_service": internet,
        "monthly_charges": monthly,
        "support_tickets": tickets,
        "churn": churn,
    }
)
churn_df["total_charges"] = np.round(churn_df["tenure_months"] * churn_df["monthly_charges"] * rng.uniform(0.95, 1.05, n), 2)
miss_idx = rng.choice(n, 12, replace=False)
churn_df.loc[miss_idx[:7], "total_charges"] = np.nan
churn_df.loc[miss_idx[7:], "age"] = np.nan
churn_df = pd.concat([churn_df, churn_df.iloc[[5, 77, 150]]], ignore_index=True)
churn_df.to_csv(OUT / "customer_churn.csv", index=False)

# House prices (300 rumah), harga dalam juta rupiah
n = 300
city = rng.choice(["Jakarta", "Bandung", "Surabaya", "Yogyakarta"], n, p=[0.35, 0.25, 0.25, 0.15])
area = np.round(rng.uniform(36, 300, n))
bedrooms = np.clip(np.round(area / 45 + rng.normal(0, 0.8, n)), 1, 6).astype(int)
bathrooms = np.clip(bedrooms - rng.integers(0, 2, n), 1, 5)
age = rng.integers(0, 41, n)
distance = np.round(rng.uniform(1, 30, n), 1)
city_factor = pd.Series(city).map({"Jakarta": 1.6, "Bandung": 1.1, "Surabaya": 1.2, "Yogyakarta": 1.0}).to_numpy()
price = (area * 9.5 + bedrooms * 60 + bathrooms * 40 - age * 6 - distance * 12) * city_factor + rng.normal(0, 120, n)
price = np.round(np.clip(price, 250, None)).astype(int)
pd.DataFrame(
    {
        "house_id": [f"H{i:03d}" for i in range(1, n + 1)],
        "city": city,
        "area_m2": area.astype(int),
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "age_years": age,
        "distance_to_center_km": distance,
        "price_million": price,
    }
).to_csv(OUT / "house_prices.csv", index=False)

# Customer segmentation (200 pelanggan, 5 kelompok tersembunyi)
centers = [(25, 30, 80), (45, 55, 50), (35, 85, 85), (50, 90, 18), (30, 25, 20)]
rows = []
for k, (a, inc, sp) in enumerate(centers):
    m = 40
    rows.append(
        pd.DataFrame(
            {
                "age": np.clip(np.round(rng.normal(a, 6, m)), 18, 70).astype(int),
                "annual_income_million": np.clip(np.round(rng.normal(inc, 7, m)), 10, 140).astype(int),
                "spending_score": np.clip(np.round(rng.normal(sp, 7, m)), 1, 100).astype(int),
            }
        )
    )
seg = pd.concat(rows, ignore_index=True).sample(frac=1, random_state=7).reset_index(drop=True)
seg.insert(0, "customer_id", [f"M{i:03d}" for i in range(1, len(seg) + 1)])
seg.insert(1, "gender", rng.choice(["Female", "Male"], len(seg)))
seg.to_csv(OUT / "customer_segmentation.csv", index=False)

# File kecil untuk materi dasar
small = pd.DataFrame(
    {
        "Name": ["Andi", "Budi", "Citra", "Dewi", "Eko", "Fajar"],
        "Age": [21, 22, 20, 23, 21, 24],
        "City": ["Jakarta", "Bandung", "Surabaya", "Jakarta", "Medan", "Bandung"],
        "Score": [85, 78, 92, 88, 70, 95],
    }
)
small.to_csv(OUT / "data.csv", index=False)
small.to_csv(OUT / "data_semicolon.csv", index=False, sep=";")

for p in sorted(OUT.glob("*.csv")):
    print(f"{p.name:28s} {p.stat().st_size:>8d} bytes")
