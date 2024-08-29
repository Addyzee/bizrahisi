from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .serializers import (
    CreateTransactionRecordSerializer,
    ViewTransactionRecord,
    ViewTransaction,
    ViewTransactionDetails,
    TransactionStatsSerializer,
    TopSellingStockSerializer,
)
from ..models import Transaction, TransactionRecord
from Inventory.models import Inventory
from User.models import UserProfile
from django.contrib.auth import get_user_model
from .stats import get_transaction_stats, top_selling_stock
from .validator import validate_transaction_record

User = get_user_model()



@api_view(["POST"])
def CreateTransactionRecordView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner).pk
    # tied_inventory = 2
    
    if request.method == "POST":
        request.data["transaction_date"] = timezone.now()  # Set transaction date
        request.data['inventory'] = tied_inventory
        record = validate_transaction_record(request.data)
        print(record)
        
        record_serializer = CreateTransactionRecordSerializer(data=record)
        
        if record_serializer.is_valid():
            transaction_record = record_serializer.save()
            if transaction_record:
                return Response(record_serializer.data, status=status.HTTP_201_CREATED)
        else:
            serializer_errors = record_serializer.errors
            print("Serializer Errors:", serializer_errors)  # Debugging statement
            return Response(serializer_errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(
    [
        "POST",
    ]
)
def CreateTransaction(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    print(tied_inventory)

    # should receive the below from frontend
    transaction_record = TransactionRecord.objects.get(pk=70, inventory=tied_inventory)

    if request.method == "POST":
        request.data["accompanying_transaction"] = transaction_record
        transaction_serializer = CreateTransaction(data=request.data)
        print(transaction_serializer)
        if transaction_serializer.is_valid(raise_exception=True):
            transaction = transaction_serializer.save(request.data)
            print("here")

            if transaction:
                return Response(
                    transaction_serializer.data, status=status.HTTP_201_CREATED
                )
        print(request)
        return Response(
            transaction_serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )
    else:
        print("error")
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def TransactionRecordsView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=2)
    # -- the above line is for testing purposes. Comment the first three lines above
    # plus permission classes to test with inventory pk 2
    try:
        transaction_records = tied_inventory.transactionrecord_set.all().order_by(
            "-transaction_date"
        )
    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = ViewTransactionRecord(transaction_records, many=True)
    if request.method == "GET":
        return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def TransactionRecordDetails(request, code):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=1)
    # -- the above line is for testing purposes. Comment the first three lines above
    # plus permission classes to test with inventory pk 2
    try:
        transaction_code = "#" + code.replace("s", "/")
        transaction_records = tied_inventory.transactionrecord_set.filter(
            code=transaction_code
        ).order_by("-transaction_date")
        record = transaction_records.first()

    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = ViewTransactionRecord(record)
    if request.method == "GET":
        return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def SalesTransactionRecordsView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=1)
    # -- the above line is for testing purposes. Comment the first three lines above
    # plus permission classes to test with inventory pk 2
    try:
        transaction_records = tied_inventory.transactionrecord_set.all().order_by(
            "-transaction_date"
        )
        sales_records = [
            record for record in transaction_records if record.transaction_type == "INV"
        ]

    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = ViewTransactionRecord(sales_records, many=True)
    if request.method == "GET":
        return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def PurchaseTransactionRecordsView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=2)
    # -- the above line is for testing purposes. Comment the first three lines above
    # plus permission classes to test with inventory pk 2
    try:
        transaction_records = tied_inventory.transactionrecord_set.all()
        sales_records = [
            record for record in transaction_records if record.transaction_type == "PO"
        ]

    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = ViewTransactionRecord(sales_records, many=True)
    if request.method == "GET":
        return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def TransactionView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    transaction_record = TransactionRecord.objects.get(
        inventory=tied_inventory, id=7
    )  # i have put an id here, since there are many transaction records, and a transaction is tied to one transaction record only
    try:
        transactions = transaction_record.transaction.all()
        print("Transaction", transactions)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    serializer = ViewTransactionDetails(transactions, many=True)
    if request.method == "GET":
        return Response(serializer.data)
    else:
        print("error")
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def TopSellingStockView(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=2)
    try:
        transaction_records = tied_inventory.transactionrecord_set.all()
        top_stock_data = top_selling_stock(transaction_records=transaction_records)

    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = TopSellingStockSerializer(top_stock_data, many=True)

    if request.method == "GET":
        return Response(serializer.data)


@api_view(
    [
        "GET",
    ]
)
@permission_classes([IsAuthenticated])
def TransactionRecordStats(request):
    user_account = request.user
    inventory_owner = UserProfile.objects.get(user=user_account)
    tied_inventory = Inventory.objects.get(owner=inventory_owner)
    # tied_inventory = Inventory.objects.get(pk=2)
    try:
        transaction_records = tied_inventory.transactionrecord_set.all()
        stats_data = get_transaction_stats(transaction_records=transaction_records)

    except TransactionRecord.DoesNotExist:
        return Response()

    serializer = TransactionStatsSerializer(stats_data)

    if request.method == "GET":
        return Response(serializer.data)
