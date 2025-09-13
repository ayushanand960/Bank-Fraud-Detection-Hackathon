# fraud/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
import json

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    location = models.CharField(max_length=10)   # country code like "IN", "US"
    timestamp = models.DateTimeField(auto_now_add=True)
    fraud = models.BooleanField(default=False)
    reasons = models.TextField(blank=True)  # we'll store JSON list as string

    def set_reasons(self, reasons_list):
        self.reasons = json.dumps(reasons_list)

    def get_reasons(self):
        if not self.reasons:
            return []
        try:
            return json.loads(self.reasons)
        except:
            return [self.reasons] if self.reasons else []
    
    def __str__(self):
        return f"{self.user} - {self.amount} @ {self.location} - fraud={self.fraud}"