from django.contrib import admin
from .models import Transaction, TransactionRecord


@admin.register(TransactionRecord)
class TransactionRecordAdmin(admin.ModelAdmin):
    list_display = ("code","inventory","transaction_type","paid_through", "transaction_amount")
    list_filter = ("inventory",)

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("product", "transaction_value","quantity_affected",)
