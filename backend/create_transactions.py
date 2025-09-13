import random
from datetime import datetime, timedelta
from users.models import User
from Fraud.models import Transaction
from Fraud.utils import detect_and_update

users = User.objects.filter(is_staff=False, is_superuser=False)

for _ in range(50):
    user = random.choice(users)
    amount = round(random.uniform(100, 200000), 2)
    location = "IN"
    timestamp = datetime.now() - timedelta(days=random.randint(0, 10))

    tx = Transaction.objects.create(
        user=user,
        amount=amount,
        location=location,
        timestamp=timestamp
    )

    detect_and_update(tx)

print("50 transactions created successfully!")
