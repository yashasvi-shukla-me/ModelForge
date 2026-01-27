import pandas as pd

from registry.model_loader import load_model_from_run


def main():
    run_id = "aa9a32ea1b0a459d84444bd26b2e41e4"

    # Load model from MLflow
    model = load_model_from_run(run_id)

    # Input data (must match training features)
    X = pd.DataFrame({
        "a": [1, 3]
    })

    # Run prediction
    predictions = model.predict(X)

    print("Predictions:", predictions)


if __name__ == "__main__":
    main()
