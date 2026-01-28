import joblib


def load_model_local(path: str):
    """
    Load a trained model from local filesystem.

    Args:
        path (str): Path to model file.

    Returns:
        Loaded sklearn model.
    """
    return joblib.load(path)
