import pandas as pd
import numpy as np
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import os


class AMLModel:
    """A simple AML detection model that runs locally."""

    def __init__(self):
        self.model = SGDClassifier(loss='log_loss', random_state=42, max_iter=1000)
        self.scaler = StandardScaler()
        self.is_trained = False

    def prepare_features(self, df):
        """Creates features from raw transaction data."""
        X = pd.DataFrame()
        X['amount_log'] = np.log1p(df['amount'])
        X['is_foreign'] = df['is_foreign']
        X['hour'] = pd.to_datetime(df['timestamp']).dt.hour
        X['amount_ratio'] = df['amount'] / df['amount'].median()
        return X

    def train(self, data_path):
        """Trains the model on local bank data."""
        print(f"\n[AML Model] Training on {os.path.basename(data_path)}...")

        # Load data
        df = pd.read_csv(data_path)
        X = self.prepare_features(df)
        y = df['suspicious_flag']

        # Scale features and train
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True

        # Evaluate
        y_pred = self.model.predict(X_scaled)
        acc = accuracy_score(y, y_pred)

        print(f"[AML Model] Training complete!")
        print(f"    Accuracy: {acc:.3f}")
        print(f"    Suspicious transactions detected: {sum(y_pred)} / {sum(y)}")

        # Save model state
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler
        }, 'model_state.joblib')

        print("[AML Model] Model saved as 'model_state.joblib'")

    def get_weights(self):
        """Extracts model weights for federated learning (Week 2)."""
        if not self.is_trained:
            raise ValueError("Model not trained yet!")
        return {
            'coef': self.model.coef_.tolist(),
            'intercept': self.model.intercept_.tolist()
        }


if __name__ == "__main__":
    # Test the model
    model = AMLModel()
    model.train('transactions.csv')

    # Show what will be shared in Week 2
    weights = model.get_weights()
    print(f"\n[Model Weights Ready for Sharing]")
    print(f"Coefficients shape: {len(weights['coef'][0])}")
    print(f"Intercept: {weights['intercept']}")