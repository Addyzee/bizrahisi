from rest_framework import serializers
from ..models import Transaction, TransactionRecord
from Inventory.models import Product
from Inventory.api.serializers import ProductSerializer

class CreateTransactionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Transaction
        fields = ("product", "quantity_affected", "unit_price")

class CreateTransactionRecordSerializer(serializers.ModelSerializer):
    transactions = CreateTransactionSerializer(many=True)

    class Meta:
        model = TransactionRecord
        fields = (
            "inventory",
            "transaction_type",
            "paid_through",
            "transaction_status",
            "transaction_party",
            "transaction_date",
            "transaction_amount",
            "transactions",
        )

    def create(self, validated_data):
        transactions_data = validated_data.pop('transactions')
        transaction_record = TransactionRecord.objects.create(**validated_data)        
        for transaction_data in transactions_data:
            print("creating transaction")
            Transaction.objects.create(accompanying_transaction=transaction_record, **transaction_data)
        return transaction_record
    
    def update(self, instance, validated_data):
        transactions_data = validated_data.pop('transactions', [])  # Extract transactions data
        instance = super().update(instance, validated_data)
        instance.transaction.all().delete()  # Delete existing transactions
        for transaction_data in transactions_data:
            Transaction.objects.create(accompanying_transaction=instance, **transaction_data)
        return instance

class ViewTransaction(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


class ViewTransactionDetails(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = Transaction
        fields = ("product", "quantity_affected", "unit_price", "transaction_value")


class ViewTransactionRecord(serializers.ModelSerializer):
    transaction = ViewTransactionDetails(many=True)
    transaction_status = serializers.CharField(
        source="get_transaction_status_display"
    )  # this method referred to by source gets the human readable version of the transaction status from the models
    paid_through = serializers.CharField(source="get_paid_through_display")
    transaction_type = serializers.CharField(source="get_transaction_type_display")
    transaction_date = serializers.DateTimeField(read_only=True, format="%d/%m/%Y")

    class Meta:
        model = TransactionRecord
        fields = (
            "inventory",
            "code",
            "transaction_type",
            "paid_through",
            "transaction_status",
            "transaction_party",
            "transaction_date",
            "transaction_amount",
            "transaction",
        )


class TransactionStatsSerializer(serializers.Serializer):
    """Contains aggregated transaction data"""

    average_customers = serializers.IntegerField()
    last_total_sales = serializers.FloatField()
    last_sales_day = serializers.CharField()
    total_sales = serializers.FloatField()
    sales_transactions = serializers.IntegerField()
    customers_number = serializers.IntegerField()
    purchase_transactions = serializers.IntegerField()
    suppliers_number = serializers.IntegerField()
    cost_of_goods_sold = serializers.FloatField()
    total_earnings = serializers.FloatField()


class TopSellingStockSerializer(serializers.Serializer):
    """Contains the top selling stock"""

    product_code = serializers.CharField()
    product_name = serializers.CharField()
    quantity_sold = serializers.FloatField()
    quantity_remaining = serializers.FloatField()
    selling_price = serializers.FloatField()
    last_stocked = serializers.CharField()
