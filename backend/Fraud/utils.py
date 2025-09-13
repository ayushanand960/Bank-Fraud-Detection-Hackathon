# Fraud/utils.py
import numpy as np
from .models import Transaction
import json

LARGE_AMOUNT_THRESHOLD = 100000.0   # change as needed
Z_SCORE_THRESHOLD = 3.0
HISTORY_WINDOW = 50
MIN_HISTORY = 5  # minimum history to compute user-specific stats

def rule_check(amount: float, location: str, user):
    reasons = []
    if amount > LARGE_AMOUNT_THRESHOLD:
        reasons.append("Large transaction")
    # try user home country; fallback to 'IN'
    user_home = getattr(user, "home_country", None) or getattr(user, "country", None) or "IN"
    if location != user_home:
        reasons.append("Unusual country")
    return reasons

def zscore_check(amount: float, user, window=HISTORY_WINDOW, threshold=Z_SCORE_THRESHOLD):
    """
    Returns (flag_bool, metadata_dict)
    Uses last `window` transactions of this user (excluding the new tx),
    falls back to global transactions if user history < MIN_HISTORY.
    """
    # fetch last N historical transactions for user (exclude the new tx)
    qs = Transaction.objects.filter(user=user).order_by("-timestamp")[:window]
    amounts = [float(tx.amount) for tx in qs]
    source = "user"
    if len(amounts) < MIN_HISTORY:
        # fallback: use global recent transactions
        qs2 = Transaction.objects.all().order_by("-timestamp")[:window*2]
        amounts = [float(tx.amount) for tx in qs2]
        source = "global"
    if len(amounts) < MIN_HISTORY:
        # not enough data — cannot compute reliable z-score
        return False, {"reason": "insufficient_history", "source": source}
    mean = float(np.mean(amounts))
    std = float(np.std(amounts))
    if std == 0:
        return False, {"reason": "zero_std", "mean": mean, "std": std, "source": source}
    z = (amount - mean) / std
    meta = {"z_score": z, "mean": mean, "std": std, "source": source}
    if abs(z) > threshold:
        return True, meta
    return False, meta

def detect_and_update(tx_instance):
    """
    Compute rules + z-score and update transaction instance (fraud, reasons) and save.
    """
    user = tx_instance.user
    amount = float(tx_instance.amount)
    location = tx_instance.location

    reasons = rule_check(amount, location, user)

    z_flag, z_meta = zscore_check(amount, user)
    if z_flag:
        reasons.append(f"Z-score anomaly (z={z_meta['z_score']:.2f})")

    tx_instance.fraud = len(reasons) > 0
    tx_instance.set_reasons(reasons)
    tx_instance.save()
    return tx_instance