import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os


def generate_transactions(num_records=3000, seed=42, bank_name="Bank_A"):
    """Creates fake but realistic transaction data for AML training."""
    np.random.seed(seed)
    random.seed(seed)

    dates = [datetime.now() - timedelta(days=random.randint(0, 90)) for _ in range(num_records)]
    amounts = np.random.lognormal(mean=5, sigma=1.5, size=num_records).round(2)

    # Create suspicious patterns
    is_foreign = np.random.choice([0, 1], num_records, p=[0.7, 0.3])
    known_risky_entities = ['ENTITY_X', 'ENTITY_Y', 'ENTITY_Z']

    origins = []
    suspicious_flags = []

    for i in range(num_records):
        # 3% chance transaction comes from known risky entity
        if random.random() < 0.03:
            origin = random.choice(known_risky_entities)
            is_suspicious = 1
        else:
            origin = f'CUST_{random.randint(1000, 9999)}'
            # Suspicious if: foreign AND large amount (>8000) AND odd hour
            hour = dates[i].hour
            is_suspicious = 1 if (is_foreign[i] and amounts[i] > 8000 and (hour < 6 or hour > 20)) else 0

        origins.append(origin)
        suspicious_flags.append(is_suspicious)

    # Create DataFrame
    df = pd.DataFrame({
        'transaction_id': [f'TX_{bank_name}_{i:05d}' for i in range(num_records)],
        'timestamp': dates,
        'amount': amounts,
        'currency': np.random.choice(['EUR', 'USD', 'GBP'], num_records, p=[0.6, 0.3, 0.1]),
        'origin': origins,
        'destination': [f'BENEF_{random.randint(5000, 9999)}' for _ in range(num_records)],
        'is_foreign': is_foreign,
        'suspicious_flag': suspicious_flags
    })

    # Ensure directory exists
    output_dir = f"C:\\Users\\fasho\\PycharmProjects\\EUSoverignDataPlatform\\{bank_name.lower()}_pod"
    os.makedirs(output_dir, exist_ok=True)

    # Save to CSV
    output_path = os.path.join(output_dir, 'transactions.csv')
    df.to_csv(output_path, index=False)

    suspicious_rate = sum(suspicious_flags) / num_records
    print(f"[+] Created {num_records} transactions for {bank_name}")
    print(f"    Suspicious rate: {suspicious_rate:.1%}")
    print(f"    Saved to: {output_path}")
    return df


if __name__ == "__main__":
    print("=== Generating Synthetic Banking Data ===")
    generate_transactions(seed=42, bank_name="Bank_A")
    generate_transactions(seed=99, bank_name="Bank_B")  # Different seed = different data
    print("\n✅ Data generation complete! Ready for model training.")