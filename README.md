# **⚙️** ModelForge – AutoML & MLOps Platform

ModelForge is a full‑stack AutoML and MLOps platform that demonstrates the complete lifecycle of a machine learning system – from training and experiment tracking to a containerized inference API and a live dashboard.

The system is designed around **clarity**, **realistic deployment** (free tiers, Docker, Vercel/Render/Supabase), and a clean separation between experimentation (MLflow) and production inference (pinned model artifact, no runtime dependency on MLflow).

---

## 🚀 Live demo

- **Frontend (Vercel)**: [https://modelforge-five.vercel.app/](https://modelforge-five.vercel.app/)
- **Backend API (Render)**: [https://modelforge-t58s.onrender.com](https://modelforge-t58s.onrender.com)

> The backend runs on Render’s free tier. If the service has been idle, the **first request may take a few seconds** while the server cold‑starts. Subsequent requests are much faster.

---

## Key capabilities

- **Experiment tracking & dashboard**
  - Web dashboard (Experiments and Deployments views) with filters, search, and an “Accuracy over Epochs” chart.
  - Experiment metadata (name, version, status, accuracy, loss) stored in **Supabase** and displayed in a table with status badges (RUNNING, COMPLETED, DEPLOYED).
- **Training pipeline**
  - Baseline **Linear Regression** training with scikit-learn.
  - Each run logs parameters, metrics (MSE), and model artifacts to **MLflow** for comparison and selection.
- **Model export**
  - Export the chosen model from MLflow to a single artifact (`models/baseline/model.pkl`).
  - This file is the **single source of truth** for inference – no live MLflow dependency in production.
- **Inference API**
  - **FastAPI** service with `/health`, single **POST /predict**, and **POST /predict/batch**.
  - Loads the pinned model from disk (path configurable via `MODEL_PATH`).
  - Fully **Dockerized** for Render; CORS enabled for the Vercel frontend.
- **Modern UX**
  - Dark-themed dashboard with navigation (Experiments / Deployments), “+ Run Experiment” CTA, and a bottom banner for deployment status.

---

## 🧩 Tech stack

### Frontend

- Next.js 14 (App Router)
- React, TypeScript
- Tailwind CSS
- Recharts (Accuracy over Epochs)
- Supabase client (experiments, deployments, metrics)
- Deployed on **Vercel**

Key files:

- `frontend/app/page.tsx` – Experiments view: filters, chart, table, mock/Supabase data.
- `frontend/app/deployments/page.tsx` – Deployments list.
- `frontend/components/`* – `Header`, `AccuracyChart`, `ExperimentsTable`, `StatusBadge`, `DeployingBanner`.
- `frontend/lib/supabase.ts` – Supabase client and types.

### Backend (inference API)

- Python 3.12
- FastAPI + Uvicorn + Gunicorn
- joblib (model load), NumPy, Pydantic v2
- Deployed on **Render** as a Docker Web Service

Key modules:

- `src/serving/app.py` – FastAPI app, CORS, `/health`, `/predict`, `/predict/batch`, model load from `MODEL_PATH`.
- `src/registry/model_loader.py` – `load_model_local(path)` for loading the exported `.pkl`.

### Training (local / MLflow)

- scikit-learn, pandas, NumPy
- MLflow (experiment tracking, model registry)
- `src/training/train_baseline.py` – baseline model training.
- `src/experiments/run_baseline_experiment.py` – run and log experiment to MLflow.
- `scripts/export_model.py` – export selected run to `models/baseline/model.pkl`.

### Data & deployment

- **Supabase** – tables: `experiments`, `deployments`, `experiment_metrics`; seed data and RLS for dashboard.
- **Docker** – inference image built from `Dockerfile` using `requirements-serve.txt` (slim deps for free tier).

---

## API overview

Base URL (Render): `https://modelforge-t58s.onrender.com`

### `GET /health`

Lightweight health check. Returns 500 if the model failed to load at startup.

**Response**

```json
{ "status": "ok" }
```

### `POST /predict`

Single prediction.

**Request body**

```json
{
  "features": [1.0, 2.0, 3.0]
}
```

`features` must match the model’s expected feature count (e.g. 1 for the baseline).

**Response**

```json
{
  "prediction": 2.5,
  "expected_features": 1
}
```

### `POST /predict/batch`

Batch predictions.

**Request body**

```json
{
  "samples": [[1.0], [2.0], [3.0]]
}
```

**Response**

```json
{
  "predictions": [1.2, 2.1, 2.9],
  "expected_features": 1,
  "batch_size": 3
}
```

Interactive API docs: [https://modelforge-t58s.onrender.com/docs](https://modelforge-t58s.onrender.com/docs)

---

## Architecture and design

### Training → inference flow

1. **Train** – Run baseline experiment; MLflow logs params, metrics (MSE), and artifact.
2. **Select** – Compare runs in MLflow and pick a run ID.
3. **Export** – `python scripts/export_model.py` (with optional `MLFLOW_TRACKING_URI`) writes `models/baseline/model.pkl`.
4. **Serve** – Docker image includes the exported model; FastAPI loads it at startup via `MODEL_PATH`. No MLflow server required at runtime.

### Why MLflow is not used at runtime

In production:

- Inference should be **self-contained** (no network dependency on an experiment server).
- A pinned artifact gives **reproducibility** and **stability**.
- Avoids coupling, security surface, and startup fragility from a live MLflow dependency.

ModelForge keeps **MLflow for experimentation and selection** and **the Dockerized API for inference only**.

---

## Local development

### Backend (inference API)

```bash
# With Docker
docker build -t modelforge-inference .
docker run -p 8000:8000 modelforge-inference
```

The API will be at `http://127.0.0.1:8000`. Optional: set `MODEL_PATH` if the model lives elsewhere.

### Frontend

```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
npm install
npm run dev
```

The UI runs on `http://localhost:3000`. Without Supabase env vars, the dashboard uses mock data.

### Training (optional)

```bash
# Start MLflow (e.g. mlflow ui --backend-store-uri sqlite:///mlflow.db)
# Run experiment, then export:
export MLFLOW_TRACKING_URI=http://127.0.0.1:5000
python scripts/export_model.py
```

---

## Deployment notes

### Render (backend)

- Service type: **Web Service**, runtime **Docker**.
- Dockerfile path: `./Dockerfile` (uses `requirements-serve.txt`).
- Env: `MODEL_PATH=models/baseline/model.pkl` (default; optional to override).
- Ensure `models/baseline/model.pkl` exists in the repo or is produced in the image.
- Free tier: service sleeps when idle; first request may be slow (cold start).

### Vercel (frontend)

- Root directory: `**frontend`**.
- Framework: **Next.js**.
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL.
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key.
  - `NEXT_PUBLIC_API_URL` – Render API base URL (e.g. `https://modelforge-t58s.onrender.com`).

### Supabase

- Create a project and run `**supabase/schema.sql`** in the SQL Editor (creates `experiments`, `deployments`, `experiment_metrics` and seed data).
- Use the project URL and anon key in the frontend env vars.

---

## Why this project matters ⭐

ModelForge is built as a **portfolio-grade**, discussion-ready MLOps project:

- End-to-end lifecycle: training, tracking, export, and serving.
- Production-oriented choice: pinned model artifact instead of runtime MLflow.
- Real deployment constraints (free tiers, Docker, cold starts).
- Full-stack visibility: dashboard (Vercel + Supabase) plus inference API (Render).

It provides a strong base to discuss MLOps trade-offs, experiment tracking, and deployment in interviews and technical conversations.

---

## Author

**Yashasvi Shukla**  
M.Tech (Computer Science) – Full‑Stack & AI‑focused Developer

---

## License

This project is intended for educational and portfolio use.  
If you are interested in using it commercially, please contact the author.