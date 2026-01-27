import mlflow
import mlflow.sklearn

from training.train_baseline import train_baseline_model


def run_baseline_experiment(data_path: str, target_column: str):
    """
    Run and log a baseline linear regression experiment.
    """

    mlflow.set_tracking_uri("http://127.0.0.1:5000")

    with mlflow.start_run():

        # Log experiment parameters
        mlflow.log_param("model_type", "LinearRegression")
        mlflow.log_param("target_column", target_column)

        # Train and evaluate model
        model, mse = train_baseline_model(
            data_path=data_path,
            target_column=target_column
        )

        # Log evaluation metric
        mlflow.log_metric("mse", mse)

        # Log trained model as an artifact
        mlflow.sklearn.log_model(
            sk_model=model.model,
            name="model"
        )

        return model, mse
