from sklearn.linear_model import LinearRegression


class LinearRegressionModel:
    """
    Wrapper around sklearn's LinearRegression model.
    """

    def __init__(self):
        self.model = LinearRegression()

    def train(self, X_train, y_train):
        """
        Train the linear regression model.
        """
        self.model.fit(X_train, y_train)

    def predict(self, X):
        """
        Make predictions using the trained model.
        """
        return self.model.predict(X)
