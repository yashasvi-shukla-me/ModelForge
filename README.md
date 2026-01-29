# 🖥️ ModelForge – AutoML & MLOps Platform

ModelForge is a production-grade AutoML and MLOps platform designed to demonstrate the complete lifecycle of a machine learning system – from model training and experiment tracking to containerized inference deployment.

The project focuses on **clarity, correctness, and real-world MLOps practices**, rather than black-box automation.

---

## 🚀 Key Features

- End-to-end ML pipeline (training → evaluation → inference)
- Experiment tracking and model comparison using **MLflow**
- Model selection and export as a versioned artifact
- Production-ready **FastAPI** inference service
- Fully **Dockerized** inference layer
- Clean separation of training and serving (industry best practice)
- Environment-variable based configuration

---

## 🧠 Architecture Overview

### Training Phase

Dataset

↓

ML Training (Linear Regression)

↓

MLflow Experiment Tracking

↓

Model Selection

↓

Export Selected Model (model.pkl)

### Inference Phase

model.pkl

↓

FastAPI Inference Service

↓

Docker Container

↓

REST API (/predict)

### Design Principle

> **MLflow is used for experimentation and model selection, not for runtime inference.**

The inference service loads a pinned model artifact from disk, ensuring:

- stability
- reproducibility
- zero dependency on a live MLflow server

This mirrors how production ML systems are typically deployed.

---

## 🛠 Tech Stack

### Machine Learning

- Python
- scikit-learn
- pandas
- NumPy

### MLOps

- MLflow (experiment tracking, model registry)
- joblib (model serialization)

### Backend / Serving

- FastAPI
- Pydantic
- Uvicorn

### Infrastructure

- Docker
- Environment-based configuration

---

## 🔬 Training & Experiment Tracking

- Models are trained using a baseline **Linear Regression** pipeline.
- Each experiment logs:
  - parameters
  - metrics (MSE)
  - trained model artifacts
- MLflow enables comparison across multiple runs.

Once a model is selected, it is **exported** as a static artifact for inference.

---

## 📦 Model Export

Export the selected model from MLflow:

```bash
python scripts/export_model.py
```

This generates:

```bash
models/baseline/model.pkl
```

This file is the single source of truth for inference.

## 🌐 Inference API

Start the API locally (Docker)

```bash
docker build -t modelforge-inference .
docker run -p 8000:8000 modelforge-inference
```

### API Documentation

```bash
http://127.0.0.1:8000/docs
```

### Prediction Endpoint

POST /predict
Example request:
{
"a": 3
}
Example response:
{
"prediction": 2
}

## 🧪 Why MLflow Is Not Used at Runtime

In production systems:

- Inference services should be self-contained
- Runtime dependency on experiment tracking systems introduces:
  - network coupling
  - security complexity
  - startup instability

ModelForge follows the production pattern:

- MLflow → experimentation & selection
- Dockerized API → inference only

This design decision is intentional and documented.

## 📌 What This Project Demonstrates

- Practical MLOps architecture decisions
- Clean separation of concerns
- Debugging and handling real-world tooling constraints
- Production-oriented ML system design

## 🧭 Future Improvements

Model versioning via semantic tags
CI/CD pipeline for automated builds
Cloud deployment (AWS ECS / EC2)
Monitoring & metrics (Prometheus)

# 👤 Author

Built with a focus on deep understanding and real-world readiness, not shortcuts.
Yashasvi Shukla (YASHASVI SHUKLA)

---
