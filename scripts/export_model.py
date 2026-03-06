import os
import mlflow
import mlflow.sklearn
import joblib

# -------- CONFIG --------
RUN_ID = "aa9a32ea1b0a459d84444bd26b2e41e4"
OUTPUT_DIR = "models/baseline"
OUTPUT_PATH = f"{OUTPUT_DIR}/model.pkl"

# ------------------------

def export_model():
    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Point to MLflow (set MLFLOW_TRACKING_URI or default to local)
    mlflow.set_tracking_uri(os.environ.get("MLFLOW_TRACKING_URI", "http://127.0.0.1:5000"))

    # Load model from MLflow
    model_uri = f"runs:/{RUN_ID}/model"
    model = mlflow.sklearn.load_model(model_uri)

    # Save model locally
    joblib.dump(model, OUTPUT_PATH)

    print(f"Model exported to {OUTPUT_PATH}")


if __name__ == "__main__":
    export_model()
