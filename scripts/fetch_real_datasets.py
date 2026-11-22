"""Mengunduh dataset NYATA dari sumber aslinya (UCI Machine Learning Repository, lisensi CC BY 4.0)
dan menyimpannya sebagai CSV di public/datasets/. Dataset-dataset ini juga populer di Kaggle;
tautan Kaggle dicantumkan di src/content/datasets-meta.ts.

Prinsip: nilai data TIDAK diubah. Yang dilakukan hanya:
  - menambahkan nama kolom (header) bila file asli tidak punya header,
  - mengubah penanda missing '?' menjadi sel kosong (dibaca Pandas sebagai NaN),
  - menyimpan sebagai CSV berpemisah koma — kecuali winequality-red.csv yang sengaja
    dipertahankan dengan pemisah ';' seperti aslinya (latihan parameter sep).

Jalankan: python scripts/fetch_real_datasets.py
"""

import io
import urllib.request
import zipfile
from pathlib import Path

import pandas as pd

OUT = Path(__file__).resolve().parent.parent / "public" / "datasets"
OUT.mkdir(parents=True, exist_ok=True)
CACHE = Path("/tmp") / "uci-cache"
CACHE.mkdir(exist_ok=True)


def uci_zip(uci_id: int, slug: str) -> zipfile.ZipFile:
    path = CACHE / f"{uci_id}.zip"
    if not path.exists():
        url = f"https://archive.ics.uci.edu/static/public/{uci_id}/{slug}.zip"
        with urllib.request.urlopen(url) as r:
            path.write_bytes(r.read())
    return zipfile.ZipFile(path)


def inner(z: zipfile.ZipFile, name: str) -> zipfile.ZipFile:
    return zipfile.ZipFile(io.BytesIO(z.read(name)))


def save(df: pd.DataFrame, name: str, sep: str = ","):
    df.to_csv(OUT / name, index=False, sep=sep)
    print(f"{name:32s} {df.shape[0]:>6d} baris × {df.shape[1]:>2d} kolom  {(OUT / name).stat().st_size / 1024:8.1f} KB")


# 1. Heart Disease (Cleveland) — UCI id 45
z = uci_zip(45, "heart+disease")
cols = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "num"]
df = pd.read_csv(io.BytesIO(z.read("processed.cleveland.data")), header=None, names=cols, na_values="?")
save(df, "heart_disease.csv")

# 2. Wine Quality (red) — UCI id 186 — pemisah ';' dipertahankan
z = uci_zip(186, "wine+quality")
(OUT / "winequality-red.csv").write_bytes(z.read("winequality-red.csv"))
df = pd.read_csv(OUT / "winequality-red.csv", sep=";")
print(f"{'winequality-red.csv':32s} {df.shape[0]:>6d} baris × {df.shape[1]:>2d} kolom  (file asli, sep=';')")

# 3. Adult / Census Income — UCI id 2
z = uci_zip(2, "adult")
cols = ["age", "workclass", "fnlwgt", "education", "education_num", "marital_status", "occupation", "relationship", "race", "sex", "capital_gain", "capital_loss", "hours_per_week", "native_country", "income"]
df = pd.read_csv(io.BytesIO(z.read("adult.data")), header=None, names=cols, na_values="?", skipinitialspace=True)
save(df, "adult_income.csv")

# 4. Bank Marketing — UCI id 222 (bank.csv = sampel 10% resmi dari UCI)
z = inner(uci_zip(222, "bank+marketing"), "bank.zip")
df = pd.read_csv(io.BytesIO(z.read("bank.csv")), sep=";")
save(df, "bank_marketing.csv")

# 5. Student Performance (matematika) — UCI id 320
z = inner(uci_zip(320, "student+performance"), "student.zip")
df = pd.read_csv(io.BytesIO(z.read("student-mat.csv")), sep=";")
save(df, "student_performance.csv")

# 6. Auto MPG — UCI id 9
z = uci_zip(9, "auto+mpg")
cols = ["mpg", "cylinders", "displacement", "horsepower", "weight", "acceleration", "model_year", "origin", "car_name"]
df = pd.read_csv(io.BytesIO(z.read("auto-mpg.data")), sep=r"\s+", header=None, names=cols, na_values="?", quotechar='"')
save(df, "auto_mpg.csv")

# 7. Online Shoppers Purchasing Intention — UCI id 468
z = uci_zip(468, "online+shoppers+purchasing+intention+dataset")
df = pd.read_csv(io.BytesIO(z.read("online_shoppers_intention.csv")))
save(df, "online_shoppers.csv")

# 8. Wholesale Customers — UCI id 292
z = uci_zip(292, "wholesale+customers")
df = pd.read_csv(io.BytesIO(z.read("Wholesale customers data.csv")))
save(df, "wholesale_customers.csv")

# 9. Default of Credit Card Clients (Taiwan) — UCI id 350
z = uci_zip(350, "default+of+credit+card+clients")
df = pd.read_excel(io.BytesIO(z.read("default of credit card clients.xls")), header=1)
save(df, "credit_card_default.csv")
