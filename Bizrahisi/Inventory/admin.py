from django.contrib import admin
from .models import Inventory, Product

# Register your models here.
admin.site.register(Inventory)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("product_name", "product_code", "inventory")
    list_filter = ("inventory",)