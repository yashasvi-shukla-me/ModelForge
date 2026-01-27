import mlflow
import mlflow.sklearn


def load_model_from_run(run_id: str):
    """
    Load a trained sklearn model from an MLflow run.

    Args:
        run_id (str): MLflow run ID.

    Returns:
        Loaded sklearn model.
    """

    # IMPORTANT: must match the tracking URI used during logging
    mlflow.set_tracking_uri("http://127.0.0.1:5000")

    model_uri = f"runs:/{run_id}/model"
    model = mlflow.sklearn.load_model(model_uri)

    return model
