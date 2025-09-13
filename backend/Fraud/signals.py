from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Transaction
from .utils import detect_and_update

@receiver(post_save, sender=Transaction)
def run_fraud_detection(sender, instance, created, **kwargs):
    if created:  # new transaction
        detect_and_update(instance)
