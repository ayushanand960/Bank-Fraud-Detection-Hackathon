# fraud/urls.py
from django.urls import path
from .views import SubmitTransactionAPIView, UserTransactionsAPIView, AllTransactionsAPIView

urlpatterns = [
    path('submit/', SubmitTransactionAPIView.as_view(), name='tx-submit'),
    path('', UserTransactionsAPIView.as_view(), name='tx-list'),
    path('all/', AllTransactionsAPIView.as_view(), name='tx-all'),
]