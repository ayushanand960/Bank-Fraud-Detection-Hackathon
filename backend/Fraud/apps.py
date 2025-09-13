from django.apps import AppConfig

class FraudConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "Fraud"

    def ready(self):
        import Fraud.signals
