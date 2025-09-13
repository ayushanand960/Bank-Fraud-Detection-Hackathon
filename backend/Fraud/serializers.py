# fraud/serializers.py
from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    reasons = serializers.SerializerMethodField()
    user = serializers.CharField(source='user.username', read_only=True)  

    class Meta:
        model = Transaction
        fields = ['id', 'user', 'amount', 'location', 'timestamp', 'fraud', 'reasons']

    def get_reasons(self, obj):
        return obj.get_reasons()