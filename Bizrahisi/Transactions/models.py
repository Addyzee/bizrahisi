from django.db import models, transaction
from django.utils import timezone

from Inventory.models import Product, Inventory


class TransactionRecord(models.Model):
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)
    code = models.CharField(max_length=100, blank=False, null=False)

    # transaction types
    SALE = "INV"
    PURCHASE = "PO"
    transaction_types = [(SALE, "Sale"), (PURCHASE, "Purchase")]
    transaction_type = models.CharField(max_length=4, choices=transaction_types)

    # payment methods
    CASH = "SH"
    MPESA = "MM"
    payment_methods = [(CASH, "Cash"), (MPESA, "M-Pesa")]
    paid_through = models.CharField(max_length=4, choices=payment_methods)

    COMPLETE = "CMP"
    INCOMPLETE = "ICMP"
    status = [(COMPLETE, "Complete"), (INCOMPLETE, "Incomplete")]
    transaction_status = models.CharField(max_length=5, choices=status)
    transaction_party = models.CharField(max_length=100, null=True)
    transaction_date = models.DateTimeField(default=timezone.now)
    transaction_amount = models.FloatField(default=0)

    @property
    def transactions(self):
        return self.transaction.all()

    def generate_code(self):
        transaction_type = self.transaction_type
        transactions_number = list(
            TransactionRecord.objects.filter(
                inventory=self.inventory, transaction_type=transaction_type
            )
        )

        transaction_number = f"0000{len(transactions_number)}"[-4:]
        return f"#{self.transaction_type}-{transaction_number}/{self.transaction_date.month}/{self.transaction_date.year}"

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.pk:  # If object is being created
                super(TransactionRecord, self).save(*args, **kwargs)
            if len(self.code) < 10:
                self.code = self.generate_code()
                super(TransactionRecord, self).save(update_fields=['code'])
            else:
                self.transaction_amount = sum(
                    transaction.transaction_value for transaction in self.transactions.all()
                )
                super(TransactionRecord, self).save(update_fields=['transaction_amount'])

    
    def __str__(self):
        return str(self.code)


class Transaction(models.Model):
    accompanying_transaction = models.ForeignKey(
        TransactionRecord, on_delete=models.RESTRICT, related_name="transaction"
    )
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)

    quantity_affected = models.FloatField(default=1)
    unit_price = models.FloatField()
    transaction_value = models.FloatField(null=True, blank=True)

    product_cost = models.FloatField(null=True, blank=True)
    transaction_cost = models.FloatField(null=True, blank=True)

    transaction_earnings = models.FloatField(null=True, blank=True)

    def get_total_price(self):
        transaction_value = self.quantity_affected * self.unit_price
        return transaction_value

    def get_total_cost(self):
        transaction_cost = self.quantity_affected * self.product.product_cost
        return transaction_cost

    def save(self, *args, **kwargs):
        self.transaction_value = self.get_total_price()

        if self.accompanying_transaction.transaction_type == "INV":
            quantity = self.product.product_quantity
            quantity -= self.quantity_affected
            self.product.product_quantity = 0 if quantity < 0 else quantity
            self.product_cost = self.product.product_cost

            self.transaction_cost = self.get_total_cost()

            self.transaction_earnings = self.transaction_value - self.transaction_cost

            self.product.product_last_sold = (
                self.accompanying_transaction.transaction_date
            )
            self.product.save()

        elif self.accompanying_transaction.transaction_type == "PO":
            self.product.product_quantity += self.quantity_affected

            self.transaction_earnings = 0
            self.product_cost = 0
            self.transaction_cost = 0

            self.product.product_last_stocked = (
                self.accompanying_transaction.transaction_date
            )
            self.product.save()

        super(Transaction, self).save(*args, **kwargs)
        accompanying_record = self.accompanying_transaction
        transaction_record = TransactionRecord.objects.get(pk=accompanying_record.id)
        transaction_record.save()

    def __str__(self):
        return f"{self.accompanying_transaction.code}-{self.product.product_code}"
