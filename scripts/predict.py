import os
import sys

# Allow importing from src when run from project root
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import numpy as np
from registry.model_loader import load_model_local


def main():
    model_path = os.environ.get("MODEL_PATH", "models/baseline/model.pkl")
    if not os.path.isfile(model_path):
        print(f"Model not found at {model_path}. Run export_model.py first.")
        sys.exit(1)

    model = load_model_local(model_path)

    # Input data (must match training feature count)
    X = np.array([[1], [3]])

    predictions = model.predict(X)
    print("Predictions:", predictions.tolist())


if __name__ == "__main__":
    main()
