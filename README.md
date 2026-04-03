# PolluTrace AI
### Urban Air Pollution Source Analysis and Prediction System

**Team ID:** S3-T3 | **Faculty:** Dr. Susmita Das | **Phase 1:** Complete

---

## Project Overview

PolluTrace AI is an end-to-end AI system that analyses urban air pollution in Indian cities. It goes beyond traditional monitoring by:

- Predicting future PM2.5 pollution levels using LSTM deep learning
- Identifying dominant pollution sources using XGBoost and Random Forest
- Detecting unusual pollution spikes using Autoencoder anomaly detection
- Explaining predictions with confidence scores using SHAP

**Cities Covered:** Delhi, Bengaluru, Mumbai, Hyderabad

**Data:** 6 million+ hourly records from 87 stations (2010-2023)

---

## Team

| Name | Enrollment | Role |
|------|-----------|------|
| Jyothi Kiran Satya Raju Jamy | E23CSEU2363 | Backend Development (Go) |
| Panku Raja Sai Vardhan | E23CSEU2183 | AI and ML |
| Aditi Jain | E23CSEU2354 | Frontend Development |
| Manohith Sai Mamidala | E23CSEU2064 | Database Management |

---

## Project Structure

```
PolluTrace-AI/
│
├── data/
│   ├── raw/                    # Raw CSV files from Kaggle (not pushed - too large)
│   └── processed/              # Cleaned datasets
│       ├── four_cities_raw.csv
│       ├── station_daily_clean.csv
│       └── city_daily_clean.csv
│
├── notebooks/
│   ├── 01_EDA.ipynb            # Exploratory Data Analysis
│   ├── 02_Preprocessing.ipynb  # Data cleaning and feature engineering
│   ├── 03_LSTM_Model.ipynb     # Pollution prediction model
│   ├── 04_XGBoost_Source.ipynb # Pollution source analysis
│   ├── 05_Autoencoder.ipynb    # Anomaly detection
│   ├── 06_Explainable_AI.ipynb # SHAP confidence scores
│   ├── 07_Database_Setup.ipynb # PostgreSQL setup and import
│   └── 08_Final_Metrics.ipynb  # Complete metrics report
│
├── src/
│   └── models/                 # All saved AI models (16 files)
│       ├── lstm_delhi.keras
│       ├── lstm_bengaluru.keras
│       ├── lstm_mumbai.keras
│       ├── lstm_hyderabad.keras
│       ├── xgboost_source.json
│       ├── random_forest_source.pkl
│       ├── autoencoder_delhi.keras
│       ├── autoencoder_bengaluru.keras
│       ├── autoencoder_mumbai.keras
│       ├── autoencoder_hyderabad.keras
│       ├── scalers.pkl
│       ├── anomaly_scalers.pkl
│       ├── shap_explainer.pkl
│       ├── confidence_results.pkl
│       ├── city_importances.pkl
│       └── top_anomalies.pkl
│
└── requirements.txt
```

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- PostgreSQL 15
- Mac or Linux

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/PolluTrace-AI.git
cd PolluTrace-AI
```

### 2. Create virtual environment
```bash
python3.11 -m venv pollutrace-env
source pollutrace-env/bin/activate
```

### 3. Install dependencies
```bash
pip install pandas numpy matplotlib seaborn scikit-learn xgboost tensorflow jupyter ipykernel shap psycopg2-binary sqlalchemy
```

### 4. Download dataset
Download from Kaggle and place CSV files in `data/raw/`:
- https://www.kaggle.com/datasets/abhisheksjha/time-series-air-quality-data-of-india-2010-2023

### 5. Set up database
```bash
psql postgres
CREATE DATABASE pollutrace_db;
\q
```

### 6. Run notebooks in order
```
01_EDA.ipynb
02_Preprocessing.ipynb
03_LSTM_Model.ipynb
04_XGBoost_Source_Analysis.ipynb
05_Autoencoder_Anomaly.ipynb
06_Explainable_AI.ipynb
07_Database_Setup.ipynb
08_Final_Metrics_Report.ipynb
```

---

## Model Results

### LSTM - Pollution Prediction
| City | RMSE | MAE | R2 Score | Accuracy |
|------|------|-----|----------|----------|
| Delhi | 33.42 | 21.53 | 0.805 | 81.75% |
| Bengaluru | 6.15 | 4.74 | 0.742 | 85.18% |
| Mumbai | 7.66 | 5.57 | 0.877 | 87.55% |
| Hyderabad | 9.03 | 6.87 | 0.809 | 83.67% |

### XGBoost - Source Analysis
| Metric | Score |
|--------|-------|
| R2 Score | 0.9367 |
| Accuracy | 88.44% |
| Within 20% | 83.97% |

### Autoencoder - Anomaly Detection
| City | F1 Score | Detection Rate | Anomalies |
|------|----------|----------------|-----------|
| Delhi | 0.237 | 28.51% | 210 |
| Bengaluru | 0.082 | 12.40% | 270 |
| Mumbai | 0.288 | 50.41% | 316 |
| Hyderabad | 0.318 | 30.66% | 123 |

### SHAP Confidence
| City | Confidence |
|------|-----------|
| Delhi | 54.6% |
| Bengaluru | 73.8% |
| Mumbai | 80.3% |
| Hyderabad | 69.4% |

---

## Key Findings

- **PM10** is the top pollution driver (SHAP: 22.11) - dust, construction, roads
- **CO** is second (SHAP: 10.04) - vehicle combustion and open burning
- **NH3** is third (SHAP: 6.28) - agriculture and waste burning
- Delhi PM2.5 peaks at 800+ ug/m3 in winter - 26x WHO safe limit
- Mumbai has the most predictable pollution patterns (confidence: 80.3%)

---

## Database Schema (PostgreSQL)

```sql
-- Main pollution data
city_pollution (id, city, date, pm25, pm10, no, no2, nox, nh3, so2, co, ozone, benzene, month, season, day_of_week, year)

-- AI prediction results
lstm_predictions (id, city, date, predicted_pm25, actual_pm25, rmse, mae, r2_score, created_at)

-- Source importance
source_analysis (id, city, top_source_1, top_source_2, top_source_3, pm10_importance, co_importance, nh3_importance, confidence, created_at)

-- Anomaly events
anomalies (id, city, date, pm25, reconstruction_error, threshold, is_anomaly, severity, created_at)

-- Model metrics
model_metrics (id, city, model_type, rmse, mae, r2_score, confidence, trained_at)
```

---

## API Endpoints (Backend - Go)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pollution` | GET | Daily pollution data. Param: city |
| `/api/predict` | GET | Next day PM2.5 prediction. Param: city |
| `/api/anomalies` | GET | Detected anomaly events. Param: city |
| `/api/sources` | GET | Pollution source importance. Param: city |
| `/api/metrics` | GET | Model performance metrics |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Data Processing | Python, Pandas, NumPy |
| Prediction | TensorFlow, Keras (LSTM) |
| Source Analysis | XGBoost, Scikit-learn |
| Anomaly Detection | Keras Autoencoder |
| Explainability | SHAP |
| Database | PostgreSQL 15 |
| Backend | Go (Golang) |
| Frontend | HTML, CSS, JavaScript |

---

## Status

| Component | Status |
|-----------|--------|
| Data Collection and EDA | Completed |
| Data Preprocessing | Completed |
| LSTM Model | Completed |
| XGBoost Source Analysis | Completed |
| Autoencoder Anomaly Detection | Completed |
| Explainable AI (SHAP) | Completed |
| PostgreSQL Database | Completed |
| Go Backend REST API | In Progress |
| Frontend Dashboard | In Progress |

---

