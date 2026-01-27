import mlflow

from src.training.train_baseline import train_baseline_model


def run_baseline_experiment(data_path: str, target_column: str):
    """
    Run and log a baseline linear regression experiment.
    """

    with mlflow.start_run():

        # Log basic experiment parameters
        mlflow.log_param("model_type", "LinearRegression")
        mlflow.log_param("target_column", target_column)

        # Train and evaluate model
        model, mse = train_baseline_model(
            data_path=data_path,
            target_column=target_column
        )

        # Log evaluation metric
        mlflow.log_metric("mse", mse)

        return model, mse
