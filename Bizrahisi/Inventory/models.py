from django.db import models
from django.utils import timezone

from User.models import UserProfile


class Inventory(models.Model):
    owner = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.owner.business_name) + " Inventory"


def product_image_path(instance, filename):
    return f"{instance.inventory.owner.business_name}/inventory/products/{filename}"


class ProductManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted=False)


class Product(models.Model):
    # product is a part of inventory, hence foreign key
    inventory = models.ForeignKey(Inventory, on_delete=models.CASCADE)

    product_code = models.CharField(
        max_length=100, blank=False, null=False, default="XXX"
    )
    product_name = models.CharField(max_length=300)
    product_image = models.ImageField(
        null=True, blank=True, upload_to=product_image_path
    )
    product_category = models.CharField(max_length=70, default="General")
    product_quantity = models.FloatField(default=0)
    product_unit = models.CharField(default="unit", max_length=200)

    product_minimum_threshhold = models.FloatField(default=1)

    BELOW = "BELOW_T"
    LOW = "LOW"
    NORMAL = "NORM"
    HIGH = "HIGH"
    stock_levels = [
        (BELOW, "Below Threshhold"),
        (LOW, "Low Level"),
        (NORMAL, "Normal Level"),
        (HIGH, "High Level"),
    ]
    product_stock_level = models.CharField(
        max_length=10, default=NORMAL, choices=stock_levels, null=True, blank=False
    )

    product_selling_price = models.FloatField(default=0)
    product_cost = models.FloatField(default=0)

    product_date_added = models.DateTimeField(null=True, editable=False, blank=True)
    product_date_modified = models.DateTimeField(blank=True, null=True)
    product_last_stocked = models.DateTimeField(blank=True, null=True)
    product_last_sold = models.DateTimeField(blank=True, null=True)

    deleted = models.BooleanField(default=False)

    objects = ProductManager()
    all_objects = models.Manager()

    def generate_code(self):
        """Code is generated based on number of items in the inventory"""
        products_number = list(
            Product.all_objects.filter(
                inventory=self.inventory, product_category=self.product_category
            )
        )

        product_number = f"000{len(products_number)}"[-4:]

        return f"{self.product_category[0]}{self.product_category[2].upper()}{product_number}"

    def save(self, *args, **kwargs):
        """Updating date and code fields during save"""
        if not self.id:
            self.product_date_added = timezone.now()
        self.product_date_modified = timezone.now()
        super(Product, self).save(*args, **kwargs)

        # if product code has not been generated
        if len(self.product_code) < 4:
            self.product_code = self.generate_code()
            super(Product, self).save(*args, **kwargs)

    def delete(self):
        self.deleted = True
        self.save()

    def __str__(self):
        return self.product_name
