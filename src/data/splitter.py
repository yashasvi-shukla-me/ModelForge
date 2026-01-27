from typing import Tuple

import pandas as pd
from sklearn.model_selection import train_test_split


def split_features_labels(
    data: pd.DataFrame,
    target_column: str,
    test_size: float = 0.2,
    random_state: int = 42
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Split dataset into train and test sets.

    Args:
        data (pd.DataFrame): Full dataset.
        target_column (str): Name of the label column.
        test_size (float): Proportion of test data.
        random_state (int): Seed for reproducibility.

    Returns:
        X_train, X_test, y_train, y_test
    """
    X = data.drop(columns=[target_column])
    y = data[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    return X_train, X_test, y_train, y_test
