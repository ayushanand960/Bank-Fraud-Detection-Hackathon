# from rest_framework import generics
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from .models import Transaction
# from .serializers import TransactionSerializer


# # POST new transaction
# class TransactionCreateView(generics.CreateAPIView):
#     queryset = Transaction.objects.all()
#     serializer_class = TransactionSerializer


# # GET all transactions
# class TransactionListView(generics.ListAPIView):
#     queryset = Transaction.objects.all().order_by("-timestamp")
#     serializer_class = TransactionSerializer


# # GET only fraud transactions
# class FraudTransactionListView(generics.ListAPIView):
#     queryset = Transaction.objects.filter(fraud=True).order_by("-timestamp")
#     serializer_class = TransactionSerializer


# # Health check (class-based)
# class HealthCheckView(APIView):
#     def get(self, request, *args, **kwargs):
#         return Response({"status": "ok", "message": "Fraud detection backend is running!"})


# fraud/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer
from .utils import detect_and_update
from rest_framework import status

class SubmitTransactionAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        amount = request.data.get("amount")
        location = request.data.get("location")
        if amount is None or location is None:
            return Response({"detail": "amount and location required"}, status=400)
        try:
            tx = Transaction.objects.create(user=request.user, amount=amount, location=location)
        except Exception as e:
            return Response({"detail": "creation error", "error": str(e)}, status=400)

        tx = detect_and_update(tx)
        serializer = TransactionSerializer(tx)
        return Response(serializer.data, status=201)

class UserTransactionsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        qs = Transaction.objects.filter(user=request.user).order_by("-timestamp")
        serializer = TransactionSerializer(qs, many=True)
        return Response(serializer.data)

class AllTransactionsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "admin/staff only"}, status=403)
        qs = Transaction.objects.all().order_by("-timestamp")[:2000]
        serializer = TransactionSerializer(qs, many=True)
        return Response(serializer.data)