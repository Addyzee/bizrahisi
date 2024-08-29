from django.urls import path, include
from . import views


urlpatterns = [
    path("products/", views.ProductsView, name="products"),
    path("products-add/", views.ProductAdd, name="products_add"),
    path("products/detail/<str:code>", views.ProductsDetail, name="products_details"),
    path("products/restock", views.ProductRestockView, name="products_restock"),
    path("products/stats", views.InventoryStats, name="inventory_stats"),
]
