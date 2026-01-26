from sklearn.metrics import mean_squared_error


def evaluate_regression_model(model, X_test, y_test) -> float:
    """
    Evaluate a regression model using Mean Squared Error.

    Args:
        model: Trained regression model.
        X_test: Test features.
        y_test: True labels.

    Returns:
        float: MSE value.
    """
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    return mse
