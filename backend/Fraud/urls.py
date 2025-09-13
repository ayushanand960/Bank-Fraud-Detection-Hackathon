# fraud/urls.py
from django.urls import path
from .views import SubmitTransactionAPIView, UserTransactionsAPIView, AllTransactionsAPIView, FlaggedTransactionsAPIView
from .views import AddTransactionAPIView

urlpatterns = [
    path('submit/', SubmitTransactionAPIView.as_view(), name='tx-submit'),
    path('', UserTransactionsAPIView.as_view(), name='tx-list'),
    path('all/', AllTransactionsAPIView.as_view(), name='tx-all'),
    path('flagged/', FlaggedTransactionsAPIView.as_view(), name='tx-flagged'),
    path("add/", AddTransactionAPIView.as_view(), name="add_transaction"),
]