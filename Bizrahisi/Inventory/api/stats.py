from Inventory.models import Product


def restock_levels(products):
    """
    Returns the items where restock is recommended
    """

    for product in products:
        min = product.product_minimum_threshhold
        if product.product_quantity <= min:
            product.product_stock_level = product.BELOW
            product.save()
        elif min <= product.product_quantity <= min + min * 0.5:
            product.product_stock_level = product.LOW
            product.save()
        elif min + min * 0.5 < product.product_quantity < min * 4:
            product.product_stock_level = product.NORMAL
            product.save()
        elif product.product_quantity > 4 * min:
            product.product_stock_level = product.HIGH
            product.save()

    return "SUCCESS"


def get_inventory_stats(products):
    """
    Combines all stats into one function
    """
    restock_levels(products=products)
    restock = [
        product
        for product in products
        if product.product_stock_level in [product.BELOW, product.LOW]
    ]

    return {"restock_recommended": len(restock)}
