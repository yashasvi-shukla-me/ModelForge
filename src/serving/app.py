from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd

from registry.model_loader import load_model_from_run

app = FastAPI(title="ModelForge Inference API")

RUN_ID = "aa9a32ea1b0a459d84444bd26b2e41e4"
model = None  # global placeholder


class PredictionRequest(BaseModel):
    a: float


class PredictionResponse(BaseModel):
    prediction: float


@app.on_event("startup")
def load_model():
    """
    Load ML model once when the application starts.
    """
    global model
    model = load_model_from_run(RUN_ID)
    print("Model loaded successfully")


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    X = pd.DataFrame({"a": [request.a]})
    pred = model.predict(X)[0]
    return {"prediction": pred}
