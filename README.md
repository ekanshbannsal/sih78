# ForecastGuard AI ⛈️🛡️
### AI-Powered Medium-Range Forecast Bust Detection
**Smart India Hackathon (SIH) Prototype — Problem #79**

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-blue.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-19.x-cyan.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple.svg)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9-brightgreen.svg)](https://leafletjs.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 1. Executive Summary & Problem Context

Medium-range weather forecasts (**Day 3 to Day 10**) provide critical lead time for disaster risk reduction, reservoir floodgate operations, agricultural planning, and aviation safety in India. However, during rapidly evolving synoptic events, global and regional Numerical Weather Prediction (NWP) models (e.g., GFS, NCUM, ECMWF EPS) can suffer from sudden, catastrophic forecast failures—known as **"forecast busts"**.

Key drivers of forecast busts include:
- **Monsoon Depressions & Low Pressure Systems**: Non-linear track deviation and rapid intensification over the Bay of Bengal and Arabian Sea.
- **Extreme Rainfall Events & Cloudbursts**: Sub-grid scale convective complexes poorly resolved by hydrostatic model cores.
- **Western Disturbances**: Steep mid-latitude westerlies interacting with high-relief Himalayan topography.
- **Severe Cyclonic Storms**: Rapid intensity changes over anomalous sea surface temperatures.
- **Heat Waves & Thermal Advection**: Continental boundary-layer sensible heat flux divergences.
- **Active / Break Monsoon Phases**: Abrupt oscillations in the monsoon trough axis.

**ForecastGuard AI** functions as an **operational decision-support system** that acts as an intelligent supervisor over raw numerical models. Instead of replacing numerical physics, it analyzes ensemble spread, atmospheric instability vectors, and 10 years of historical verification error climatology to quantify:
1. **Regions where forecasts are likely to have high uncertainty.**
2. **Forecast lead times where large errors are expected.**
3. **Calibrated probability of a forecast bust.**
4. **Error-prone geographical subdivisions across India.**
5. **Explainable meteorological reasons for low model confidence.**

---

## 2. SIH Presentation Workflow Architecture

The dashboard explicitly implements and demonstrates the end-to-end operational meteorological decision-support workflow:

```
┌────────────────────────┐
│      NWP Forecast      │ Raw GRIB2 / NetCDF ensembles (GFS, ECMWF, NCUM)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   Feature Extraction   │ Ensemble spread, 850 hPa moisture flux, pressure gradients
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Historical Error Match │ Verification error matrix across 10-year IMD AWS catalog
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Synoptic System ID     │ Depression, Cyclone, Western Disturbance, Heat Wave
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│   ML Bust Classifier   │ Gradient-boosted decision trees (XGBoost / LightGBM)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│Probability Calibration │ Isotonic regression for empirical risk reliability
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│ Confidence & Risk Map  │ Subdivisional GIS surface (Leaflet + OpenStreetMap)
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│  Explainable AI (XAI)  │ TreeSHAP feature attributions & plain-language summary
└───────────┬────────────┘
            │
            ▼
┌────────────────────────┐
│Operational Support (DSS) Alerting for NDRF, SDMAs, and Central Water Commission
└────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with dedicated meteorological dark-navy palette
- **Mapping**: [Leaflet 1.9](https://leafletjs.com/) + [React-Leaflet 5](https://react-leaflet.js.org/) + CartoDB Dark Matter / OSM tiles
- **Charts & Data Visualization**: [Recharts 2](https://recharts.org/) (LineCharts, AreaCharts, BarCharts, horizontal SHAP bars)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/) (v20+)
- **Server Framework**: [Express 5](https://expressjs.com/)
- **Architecture**: Modular service layer with deterministic mock AI inference engine (`forecastBustModel.js`) adhering to a strict JSON contract for seamless Python ML microservice integration.

### Deployment
- Fully optimized single-service build for [Render](https://render.com/), Docker, or standard VPS hosting.

---

## 4. Folder Structure

```
SIH-problem-79/
├── .env.example               # Environment variables template
├── package.json               # Root scripts (build, dev, start)
├── render.yaml                # Render Blueprint deployment configuration
├── server/
│   ├── index.js               # Express application entrypoint & static host
│   ├── routes/
│   │   └── api.js             # REST API endpoints (/api/confidence, /api/regions, etc.)
│   ├── services/
│   │   └── forecastBustModel.js # Deterministic mock AI inference layer (FBC-v1.4)
│   └── data/
│       ├── regions.json       # 22+ meteorological subdivisions of India
│       ├── weatherSystems.json# Synoptic system definitions and risk multipliers
│       ├── forecast.json      # NWP baselines & Forecast vs Observed datasets
│       └── historical.json    # Historical verified forecast busts (2022–2025)
└── client/
    ├── index.html             # Client HTML with Leaflet CSS & Google Fonts
    ├── vite.config.js         # Vite configuration with /api backend proxy
    ├── tailwind.config.js     # Tailwind configuration with meteorological theme
    ├── src/
    │   ├── main.jsx           # React DOM root
    │   ├── App.jsx            # Central router, state management, modal handlers
    │   ├── index.css          # Tailwind base & custom animations/scrollbars
    │   ├── services/
    │   │   └── api.js         # Frontend HTTP client with offline fallbacks
    │   ├── components/
    │   │   ├── Navbar.jsx              # Responsive header, live/demo toggle, status
    │   │   ├── OperationalAlert.jsx    # Precautionary uncertainty banner
    │   │   ├── HeroSummary.jsx         # 5 core dynamic metric cards
    │   │   ├── ControlPanel.jsx        # Horizon (Day 1-10), region, system, variable filters
    │   │   ├── ConfidenceMapLegend.jsx # Risk thresholds & layer switcher
    │   │   ├── ForecastMap.jsx         # Interactive Leaflet India map with radar styling
    │   │   ├── ConfidenceChart.jsx     # Day 1 to 10 confidence degradation curve
    │   │   ├── BustProbabilityChart.jsx# Lead-time vs bust probability risk curve
    │   │   ├── ForecastVsObserved.jsx   # Verification comparison with MAE/RMSE/Bias
    │   │   ├── RegionTable.jsx         # Ranked high-error probability subdivisions
    │   │   ├── PipelineVisualizer.jsx  # Interactive 8-step SIH workflow inspector
    │   │   ├── MetricCard.jsx          # Reusable stat card
    │   │   ├── RiskBadge.jsx           # Accessible risk badge (LOW to VERY HIGH)
    │   │   ├── LoadingSkeleton.jsx     # Animated skeleton shimmers
    │   │   └── Footer.jsx              # Prototype disclaimer & navigation links
    │   └── pages/
    │       ├── DashboardPage.jsx       # Unified meteorological operations dashboard
    │       ├── ForecastAnalysisPage.jsx# Multi-variable lead time decay analysis
    │       ├── BustDetectionPage.jsx   # Dedicated AI assessment & 6 uncertainty bars
    │       ├── ExplainabilityPage.jsx  # SHAP horizontal bar chart & plain language XAI
    │       ├── HistoricalPage.jsx      # Historical bust archive with multi-axis charts
    │       ├── AIModelPage.jsx         # Model card, demo validation metrics, specs
    │       └── AboutPage.jsx           # Problem, solution, benefits, and future scope
```

---

## 5. Core Features & Dashboard Capabilities

1. **Top Operations Navbar**:
   - Live system status (`ONLINE`), real-time UTC clock, and operational alert counters.
   - **DEMO DATA / LIVE DATA Switcher**: Gracefully prompts when live NWP connectors are unconfigured without making fabricated claims.
2. **Hero Uncertainty Summary**:
   - Dynamically updates **Forecast Confidence (%)**, **Bust Probability (%)**, **High-Risk Subdivisions Count**, **Current Lead Horizon (Day 1–10)**, and **Model Status**.
3. **Granular Control Panel**:
   - Subdivision selector (All India, North, Central, South, Northeast, West, East, or specific state/subdivision).
   - Interactive Day 1 through Day 10 lead time buttons.
   - Active synoptic system selection (Monsoon Depression, Cyclone, Western Disturbance, Heat Wave, Active/Break Monsoon).
   - Target variable selection (Rainfall, Temperature, Wind Speed, Pressure, Humidity).
4. **Interactive India Map (Leaflet)**:
   - 22+ meteorological subdivisions plotted with color-coded risk markers (Green, Yellow, Orange, Red) and radar pulse animations.
   - Layer switcher: **Bust Probability**, **Confidence**, **Forecast Error**, **Rainfall**, **Temperature**, **Wind**.
   - Interactive popups displaying region metadata, dominant variable, forecast error margin, and local meteorological vulnerabilities.
5. **Decay & Risk Curves (Recharts)**:
   - **Confidence Line Chart**: Tracks Day 1 → Day 10 decay with a 60% operational threshold reference line.
   - **Bust Probability Risk Area Chart**: Highlights the Day 4–6 non-linear ensemble divergence transition with 40% (High) and 60% (Very High) risk zones.
6. **Forecast vs Observed Ground Truth Verification**:
   - Evaluates forecasted values against observed ground truth for Rainfall, Temperature, and Wind Speed.
   - Automatically computes and displays **MAE**, **RMSE**, **Systematic Bias**, and **Pearson Correlation (r)**.
7. **Ranked Error-Prone Area Detection**:
   - Table sorting subdivisions by bust probability with progress bars and clickable focus station rows.
8. **Explainable AI (XAI)**:
   - Dedicated page featuring **TreeSHAP relative feature contributions** (Ensemble Spread +28%, Historical Error +21%, Pressure Gradient +17%, Moisture Convergence +14%, Wind Shear +9%, Temperature Anomaly +6%, Other +5%).
   - Plain-language meteorological synthesis designed for non-technical duty decision-makers.
9. **Historical Climatology Archive**:
   - Detailed ledger of verified events (2022–2025) with dynamic filters by Year, Region, System, and Variable, accompanied by 3 aggregation charts.
10. **Model Card & Visual Pipeline**:
    - Complete specifications for the *Forecast Bust Classifier* (v1.4) with demo validation metrics: **Accuracy: 87%**, **Precision: 82%**, **Recall: 79%**, **F1: 80%**.

---

## 6. Local Setup & Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) v10 or higher

### Installation & Run

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/forecastguard-ai.git
   cd forecastguard-ai
   ```

2. **Install Server & Client Dependencies**:
   ```bash
   npm install
   npm --prefix client install
   ```

3. **Start in Development Mode** (runs backend on port 5001 and Vite frontend on port 5173 with proxy):
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run Production Server Locally**:
   ```bash
   npm run build
   npm start
   ```
   Open [http://localhost:5001](http://localhost:5001) in your browser.

---

## 7. API Endpoints Reference

The Express backend provides clean, RESTful JSON endpoints under `/api`:

| Method | Endpoint | Query Parameters | Description |
|---|---|---|---|
| `GET` | `/api/health` | - | System status, uptime, model status |
| `GET` | `/api/regions` | `leadTime`, `weatherSystem`, `variable`, `zone` | Ranked meteorological subdivisions with evaluated risk |
| `GET` | `/api/confidence` | `region`, `leadTime` (or `day`), `weatherSystem`, `variable` | Specific subdivision confidence, bust prob, and reasons |
| `GET` | `/api/bust-probability` | `region`, `leadTime`, `weatherSystem`, `variable` | Current evaluation + full Day 1 to 10 risk curve |
| `GET` | `/api/forecast` | `variable` | Forecast vs observed dataset with MAE, RMSE, Bias, and r |
| `GET` | `/api/explainability` | `region`, `leadTime`, `weatherSystem`, `variable` | SHAP feature contribution vector and text justification |
| `GET` | `/api/historical` | `year`, `region`, `weatherSystem`, `variable` | Historical events ledger & aggregate breakdown charts |
| `GET` | `/api/alerts` | - | Active operational meteorological advisories |
| `GET` | `/api/metrics` | - | Model architecture specs, demo metrics, and pipeline steps |

### Example Request & Response
```bash
curl -s "http://localhost:5001/api/confidence?region=odisha&day=5&variable=Rainfall"
```

```json
{
  "region": "Odisha",
  "regionId": "odisha",
  "zone": "East India",
  "leadTime": 5,
  "weatherSystem": "Monsoon Depression",
  "variable": "Rainfall",
  "confidence": 75.6,
  "bustProbability": 23.2,
  "forecastError": 16.6,
  "risk": "MODERATE",
  "factors": {
    "ensembleSpread": { "score": 72, "level": "High" },
    "historicalError": { "score": 75, "level": "High" },
    "pressureGradient": { "score": 67, "level": "Moderate" },
    "moistureConvergence": { "score": 80, "level": "High" },
    "rainfallGradient": { "score": 78, "level": "High" },
    "trackUncertainty": { "score": 49, "level": "Moderate" }
  },
  "reasons": [
    "High ensemble forecast spread across perturbation members",
    "Intense moisture convergence in lower troposphere (850 hPa)",
    "Rapid local surface pressure gradient changes (67th percentile)",
    "Known regional historical NWP bias (+18.4% rainfall underestimation)"
  ],
  "plainLanguageExplanation": "The model has reduced confidence because ensemble members show large disagreement over rainfall intensity at Lead Day 5, and the historical forecast error for similar Monsoon Depression systems is elevated across Odisha."
}
```

---

## 8. Replacing the Mock AI Engine with a Real Python ML / NWP API

The mock service in `server/services/forecastBustModel.js` is isolated and designed with a strict JSON contract. To attach an external Python microservice (FastAPI, PyTorch, LightGBM, or ONNX):

1. **Create Python Microservice** (`ml_service/main.py`):
   ```python
   from fastapi import FastAPI
   import uvicorn
   import joblib

   app = FastAPI(title="ForecastGuard AI Inference API")
   model = joblib.load("fbc_xgboost_v1.pkl")
   calibrator = joblib.load("isotonic_calibrator.pkl")

   @app.get("/predict")
   def predict(region: str, lead_time: int, weather_system: str, variable: str):
       # Extract atmospheric features from live NWP NetCDF grids
       features = extract_nwp_features(region, lead_time, weather_system, variable)
       raw_prob = model.predict_proba([features])[0][1]
       calibrated_prob = calibrator.predict([raw_prob])[0] * 100
       confidence = max(10, 100 - (calibrated_prob * 1.05))
       shap_values = compute_shap(model, features)
       
       return {
           "confidence": round(confidence, 1),
           "bustProbability": round(calibrated_prob, 1),
           "risk": "HIGH" if calibrated_prob >= 40 else "MODERATE",
           "featureContributions": shap_values
       }
   ```

2. **Connect in `server/services/forecastBustModel.js`**:
   Add an HTTP call to your Python microservice:
   ```javascript
   const PYTHON_SERVICE = process.env.PYTHON_ML_SERVICE_URL;

   async function evaluateForecastBust(params) {
     if (PYTHON_SERVICE) {
       const res = await fetch(`${PYTHON_SERVICE}/predict?${new URLSearchParams(params)}`);
       return await res.json();
     }
     // Fallback to deterministic mock engine
     return deterministicMockEvaluation(params);
   }
   ```

---

## 9. Render Deployment Guide

The application is configured for deployment as a single **Web Service** on [Render](https://render.com/).

### Option A: Using Render Blueprint (`render.yaml`)
1. Fork or push this repository to GitHub.
2. In the Render Dashboard, click **New +** → **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml` and deploys the unified Node + Vite build.

### Option B: Manual Web Service Setup
1. In Render, select **New +** → **Web Service**.
2. Connect your repository.
3. Configure the following settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render binds dynamically)
5. Click **Create Web Service**. Render installs dependencies, builds the Vite production bundle into `client/dist`, and starts Express on the designated port.

---

## 10. Future Integration with Live NWP Data Feeds

In an operational deployment at the national level (e.g., IMD National Weather Forecasting Centre / NCMRWF):
- **Data Ingestion**: Automated ingestion of 00Z and 12Z model cycles from IMD GFS (12 km) and NCMRWF Global Ensemble Prediction System (NEPS, 12 km, 23 members).
- **Satellite Assimilation**: Near-real-time brightness temperature from INSAT-3D/3DR (Thermal Infrared & Water Vapor bands) to detect rapid convective cloud cluster development.
- **Observational Calibration**: Live telemetry from 1,000+ Automated Weather Stations (AWS) and 35+ Doppler Weather Radars (DWR) across India.
- **Downscaling**: Spatial downscaling using Graph Neural Networks (GNNs) to provide block-level advisories for all 700+ Indian districts.

---

## 11. Disclaimer

> **Smart India Hackathon (SIH) Prototype Notice**: This application demonstrates an operational meteorological decision-support architecture. Simulated predictions, ensemble spreads, and validation metrics are grounded in physically plausible demo datasets to showcase how operational numerical weather prediction (NWP) models can be augmented with AI-based uncertainty classifiers. This project does not claim endorsement by or official affiliation with the India Meteorological Department (IMD).

---

## 12. License & Authors
Developed for **Smart India Hackathon (SIH)**. Released under the MIT License.
