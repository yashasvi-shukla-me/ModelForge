import os
import logging
import joblib
import numpy as np

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


# -------------------------
# App initialization
# -------------------------

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "baseline", "model.pkl")

model = None
expected_features = None


# -------------------------
# Logging configuration
# -------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)


# -------------------------
# Schemas
# -------------------------

class PredictionRequest(BaseModel):
    features: list[float]


class PredictionResponse(BaseModel):
    prediction: float
    expected_features: int


class BatchPredictionRequest(BaseModel):
    samples: list[list[float]]


class BatchPredictionResponse(BaseModel):
    predictions: list[float]
    expected_features: int
    batch_size: int


# -------------------------
# Validation helpers
# -------------------------

def validate_features(features: list[float]):
    if len(features) != expected_features:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {expected_features} features, got {len(features)}"
        )


# -------------------------
# Startup event
# -------------------------

@app.on_event("startup")
def load_model():
    global model, expected_features
    try:
        model = joblib.load(MODEL_PATH)
        expected_features = model.n_features_in_
        logger.info(
            f"Model loaded successfully | expected_features={expected_features}"
        )
    except Exception as e:
        logger.error(f"Model load failed | error={e}")
        raise RuntimeError("Startup failed")


# -------------------------
# Health check
# -------------------------

@app.get("/health")
def health():
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {"status": "ok"}


# -------------------------
# Single prediction
# -------------------------

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    validate_features(request.features)
    logger.info(
        f"Single prediction request | features_count={len(request.features)}"
    )

    arr = np.array(request.features).reshape(1, -1)
    prediction = model.predict(arr)

    logger.info("Single prediction completed successfully")

    return PredictionResponse(
        prediction=float(prediction[0]),
        expected_features=expected_features
    )


# -------------------------
# Batch prediction
# -------------------------

@app.post("/predict/batch", response_model=BatchPredictionResponse)
def predict_batch(request: BatchPredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    for sample in request.samples:
        validate_features(sample)

    logger.info(
        f"Batch prediction request | batch_size={len(request.samples)}"
    )

    X = np.array(request.samples)
    preds = model.predict(X)

    logger.info("Batch prediction completed successfully")

    return BatchPredictionResponse(
        predictions=[float(p) for p in preds],
        expected_features=expected_features,
        batch_size=len(preds)
    )
