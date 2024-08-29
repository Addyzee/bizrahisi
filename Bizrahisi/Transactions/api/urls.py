from django.urls import path
from . import views

urlpatterns = [
    path("records/", views.TransactionRecordsView, name="transaction_records"),
    path(
        "records/detail/<str:code>", views.TransactionRecordDetails, name="transaction_records"
    ),
    path("records/view/", views.TransactionView, name="transaction_view"),
    # path("records/post", views.CreateTransactionRecord, name="transaction_post"),
    path("records/post", views.CreateTransactionRecordView, name="transaction_post"),
    path("records/transaction/post", views.CreateTransaction, name="transaction_view"),
    path("records/stats", views.TransactionRecordStats, name="transaction_stats"),
    path("records/sales", views.SalesTransactionRecordsView, name="sales_records"),
    path(
        "records/purchases",
        views.PurchaseTransactionRecordsView,
        name="purchase_records",
    ),
    path("records/top-stock", views.TopSellingStockView, name="top_selling_stock"),
]
