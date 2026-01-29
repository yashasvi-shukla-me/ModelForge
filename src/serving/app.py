import os
from fastapi import FastAPI, HTTPException
import joblib
import numpy as np

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "baseline", "model.pkl")

model = None

@app.on_event("startup")
def load_model():
    global model
    try:
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully")
    except Exception as e:
        print("Model load failed:", e)
        raise RuntimeError("Startup failed")


@app.get("/health")
def health():
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    return {"status": "ok"}


@app.post("/predict")
def predict(features: list[float]):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    arr = np.array(features).reshape(1, -1)
    prediction = model.predict(arr)
    return {"prediction": float(prediction[0])}
