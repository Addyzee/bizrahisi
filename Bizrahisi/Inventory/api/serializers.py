from rest_framework import serializers
from ..models import Inventory, Product


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    product_date_added = serializers.DateTimeField(read_only=True, format="%d/%m/%Y")
    product_stock_level = serializers.CharField(source="get_product_stock_level_display", required=False)

    class Meta:
        model = Product
        fields = (
            "product_code",
            "product_name",
            "product_image",
            "product_category",
            "product_quantity",
            "product_unit",
            "product_minimum_threshhold",
            "product_selling_price",
            "product_date_added",
            "product_image",
            "product_cost",
            "product_stock_level",
        )


class InventoryStatsSerializer(serializers.Serializer):
    """Contains inventory stats"""

    restock_recommended = serializers.IntegerField()
