from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

from registry.model_loader import load_model_local

app = FastAPI(title="ModelForge Inference API")

MODEL_PATH = "models/baseline/model.pkl"
model = None


class PredictionRequest(BaseModel):
    a: float


class PredictionResponse(BaseModel):
    prediction: float


@app.on_event("startup")
def load_model():
    global model
    model = load_model_local(MODEL_PATH)
    print("Model loaded successfully")


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    X = pd.DataFrame({"a": [request.a]})
    pred = model.predict(X)[0]
    return {"prediction": pred}
