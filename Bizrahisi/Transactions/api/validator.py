from Inventory.models import Product

def validate_transaction_record(record):
    record['transaction_type'] = "INV" if record['transaction_type'] == 'sale' else "PO"
    record['paid_through'] = "SH" if record['paid_through'] == "cash" else "MM"
    record['transaction_status'] = "CMP" if record['transaction_status'] == "complete" else "ICMP"
    print(record)

    for transaction in record['transactions']:
        transaction['product'] = Product.objects.get(inventory=record['inventory'], product_code=transaction['product']).pk


    return record

    