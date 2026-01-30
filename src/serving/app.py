import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "baseline", "model.pkl")

model = None
expected_features = None

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: float
    expected_features: int


@app.on_event("startup")
def load_model():
    global model, expected_features
    try:
        model = joblib.load(MODEL_PATH)
        expected_features = model.n_features_in_
        print(f"Model loaded. Expected features: {expected_features}")
    except Exception as e:
        print("Model load failed:", e)
        raise RuntimeError("Startup failed")



@app.get("/health")
def health():
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {"status": "ok"}



@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if len(request.features) != expected_features:
        raise HTTPException(
            status_code=400,
            detail=f"Expected {expected_features} features, got {len(request.features)}"
        )

    arr = np.array(request.features).reshape(1, -1)
    prediction = model.predict(arr)
    return PredictionResponse(
    prediction=float(prediction[0]),
    expected_features=expected_features
)




