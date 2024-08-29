from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models
from django.conf import settings

from .serializers import ProductSerializer, InventoryStatsSerializer
from ..models import Inventory, Product
from User.models import UserProfile
from .stats import get_inventory_stats, restock_levels


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def ProductsView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    product_inventory = Inventory.objects.get(owner=inventory_owner)
    # product_inventory = Inventory.objects.get(pk=1)

    try:
        print("getting products")
        products = product_inventory.product_set.all()

    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(products, many=True)

    if request.method == "GET":
        return Response(serializer.data)

    elif request.method == "POST":
        print("posting")
        product = Product(inventory=product_inventory)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ProductAdd(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    product_inventory = Inventory.objects.get(owner=inventory_owner)
    if request.method == "POST":
        product = Product(inventory=product_inventory)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(
    [
        "GET",
        "PUT",
        "DELETE",
    ]
)
@permission_classes([IsAuthenticated])
def ProductsDetail(request, code):
    try:
        user_account = request.user
        inventory_owner = UserProfile.objects.get(user=user_account)
        product_inventory = Inventory.objects.get(owner=inventory_owner)
        product = Product.objects.get(inventory=product_inventory, product_code=code)
        print("got the product")
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = ProductSerializer(product, data=request.data)
        data = {}
        if serializer.is_valid():
            serializer.save()
            data["success"] = "Update successful"
            return Response(data=data)
        else:
            print(serializer.data)
            print(serializer.errors)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        operation = product.delete()
        data = {}
        if operation:
            data["success"] = "delete successful"
        else:
            data["failure"] = "delete failed"
        return Response(data=data, status=status.HTTP_204_NO_CONTENT)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def ProductRestockView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    product_inventory = Inventory.objects.get(owner=inventory_owner)
    # product_inventory = Inventory.objects.get(pk=2)

    try:
        products = product_inventory.product_set.all()
        if restock_levels(products) == "SUCCESS":
            restock = [
                product
                for product in products
                if product.product_stock_level in [product.BELOW, product.LOW]
            ]

    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(restock, many=True)

    return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def InventoryStats(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    product_inventory = Inventory.objects.get(owner=inventory_owner)
    # product_inventory = Inventory.objects.get(pk=1)
    
    try:
        products = product_inventory.product_set.all()
        print(products)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    low_stock_number = get_inventory_stats(products=products)

    serializer = InventoryStatsSerializer(low_stock_number)
    print(serializer.data)

    return Response(serializer.data)
