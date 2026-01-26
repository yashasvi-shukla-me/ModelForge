from src.data.data_loader import load_csv_data
from src.data.splitter import split_features_labels
from src.models.linear_regression import LinearRegressionModel
from src.training.evaluate import evaluate_regression_model


def train_baseline_model(data_path: str, target_column: str):
    """
    Train and evaluate a baseline linear regression model.
    """
    data = load_csv_data(data_path)

    X_train, X_test, y_train, y_test = split_features_labels(
        data=data,
        target_column=target_column
    )

    model = LinearRegressionModel()
    model.train(X_train, y_train)

    mse = evaluate_regression_model(model, X_test, y_test)

    return model, mse
