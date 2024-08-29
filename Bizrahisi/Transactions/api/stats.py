from statistics import median
from Transactions.models import TransactionRecord, Transaction
from datetime import datetime


def customers_per_month(transaction_records):
    """
    Finds the average number of customers the business has had over a certain
    period of time, counted in days, using the variable `month_length`
    It will take the most recent `month_length` days and find the distinct
    number of customers you had per day, then calculate the average
    """
    month_length = 29
    dates = []
    customers_per_date = {}

    # find all the dates we have and append to dates if the record is a sale
    for record in transaction_records:
        if record.transaction_type == "INV":
            dates.append(TransactionRecord.objects.get(id=record.id).transaction_date)

    # get all the unique dates recorded and sort them
    sorted_dates = sorted(list(set([date.date() for date in dates])))

    # check if the number of dates is less than month_length
    # if so, jump to action, else, get the most recent `month_length` days
    if len(sorted_dates) > month_length:
        sorted_dates = sorted_dates[-month_length:]

    # customers_per_date is a dictionary with the name of customers served
    # on each day
    for date in sorted_dates:
        customers_per_date.update(
            {
                date.strftime("%d/%m/%Y"): list(
                    TransactionRecord.objects.filter(
                        transaction_date__date=date, transaction_type="INV"
                    )
                    .values_list("transaction_party", flat=True)
                    .distinct()
                )
            }
        )

    numbers_per_date = [len(customers) for customers in customers_per_date.values()]

    average_customers = median(numbers_per_date) if len(numbers_per_date) > 0 else 0

    return average_customers


def last_total_sales(transaction_records):
    """
    Finds the total amount made from sales in the most recent day
    of activity
    """
    dates = []
    # find all the dates we have and append to dates if the record is a sale
    for record in transaction_records:
        if record.transaction_type == "INV":
            dates.append(TransactionRecord.objects.get(id=record.id).transaction_date)

    # get all the unique dates recorded and sort them
    sorted_dates = sorted(list(set([date.date() for date in dates])))

    if len(sorted_dates) > 0:
        date = sorted_dates[-1]
        sales_amounts = []
        for record in transaction_records:
            if (
                record.transaction_date.date() == date
                and record.transaction_type == "INV"
            ):
                sales_amounts.append(record.transaction_amount)

            last_total_sales_amount = sum(sales_amounts)
            last_sales_day = date.strftime("%b %d, %Y")

    else:
        date = datetime.today()
        last_total_sales_amount = 0
        last_sales_day = date.strftime("%b %d, %Y")

    return last_total_sales_amount, last_sales_day


def total_sales(transaction_records):
    """
    Calculate the total amount made from sales
    """
    sales = [
        record.transaction_amount
        for record in transaction_records
        if record.transaction_type == "INV"
    ]
    total_sales_amount = sum(sales)

    return total_sales_amount


def total_sales_transactions(transaction_records):
    """
    Calculate the total number of sales transactions
    """
    sales = [
        record.id for record in transaction_records if record.transaction_type == "INV"
    ]
    number_of_sales_transactions = len(sales)

    return number_of_sales_transactions


def total_customers(transaction_records):
    """
    Calculate the total number of customers served by the business
    """
    customers = [
        record.transaction_party
        for record in transaction_records
        if record.transaction_type == "INV"
    ]
    customers = list(set(customers))

    return len(customers)


def total_purchase_transactions(transaction_records):
    """
    Calculate the total number of purchase transactions
    """
    purchases = [
        record.id for record in transaction_records if record.transaction_type == "PO"
    ]
    number_of_purchase_transactions = len(purchases)

    return number_of_purchase_transactions


def total_suppliers(transaction_records):
    """
    Calculate the total number of suppliers serving the business
    """
    suppliers = [
        record.transaction_party
        for record in transaction_records
        if record.transaction_type == "PO"
    ]
    suppliers = list(set(suppliers))

    return len(suppliers)


def cost_of_goods_sold(transaction_records):
    """
    Calculates the total cost of goods sold
    """
    # find transactions within transaction records
    transactions = [
        list(record.transaction.all())
        for record in transaction_records
        if record.transaction_type == "INV"
    ]
    transaction_costs = []
    for query in transactions:
        for transaction in query:
            transaction_costs.append(transaction.transaction_cost)

    total_cost_of_goods_sold = sum(transaction_costs)

    return total_cost_of_goods_sold


def total_earnings(transaction_records):
    """
    Calculates the earnings from sales(profit or loss)
    """
    transactions = [
        list(record.transaction.all())
        for record in transaction_records
        if record.transaction_type == "INV"
    ]
    transaction_earnings = []
    for query in transactions:
        for transaction in query:
            transaction_earnings.append(transaction.transaction_earnings)

    total_earnings_amount = sum(transaction_earnings)

    return total_earnings_amount


def top_selling_stock(transaction_records):
    """
    Returns the top selling products based on the quantity sold of each
    """
    transactions = [
        list(record.transaction.all())
        for record in transaction_records
        if record.transaction_type == "INV"
    ]
    top_stock = []
    product_codes = []

    for query in transactions:
        for transaction in query:
            product_quantity = {}
            if transaction.product.product_code not in product_codes:
                product_quantity.update(
                    {
                        # adding the necessary fields
                        "product_code": transaction.product.product_code,
                        "product_name": transaction.product.product_name,
                        "quantity_sold": transaction.quantity_affected,
                        "quantity_remaining": transaction.product.product_quantity,
                        "selling_price": transaction.product.product_selling_price,
                        "last_stocked": transaction.product.product_last_stocked.strftime(
                            "%d/%m/%Y"
                        )
                        if transaction.product.product_last_stocked is not None
                        else "-",
                    }
                )
                product_codes.append(transaction.product.product_code)
                top_stock.append(product_quantity)

            else:
                ind = product_codes.index(transaction.product.product_code)
                quantity_affected = (
                    top_stock[ind]["quantity_sold"] + transaction.quantity_affected
                )
                top_stock[ind]["quantity_sold"] = quantity_affected

    top_selling_products = top_stock[:10]

    return top_selling_products


def get_transaction_stats(transaction_records):
    """
    Create a dictionary with all stats data
    """
    stats_data = {}

    top_selling_stock(transaction_records=transaction_records)

    average_customers = customers_per_month(transaction_records=transaction_records)

    last_total_sales_amount, last_sales_day = last_total_sales(
        transaction_records=transaction_records
    )
    total_sales_amount = total_sales(transaction_records=transaction_records)
    number_of_sales_transactions = total_sales_transactions(
        transaction_records=transaction_records
    )
    customers_number = total_customers(transaction_records=transaction_records)
    suppliers_number = total_suppliers(transaction_records=transaction_records)
    number_of_purchase_transactions = total_purchase_transactions(
        transaction_records=transaction_records
    )
    total_cost_of_sales = cost_of_goods_sold(transaction_records=transaction_records)
    total_earnings_amount = total_earnings(transaction_records=transaction_records)
    stats_data.update(
        {
            "average_customers": average_customers,
            "last_total_sales": last_total_sales_amount,
            "last_sales_day": last_sales_day,
            "total_sales": total_sales_amount,
            "sales_transactions": number_of_sales_transactions,
            "customers_number": customers_number,
            "suppliers_number": suppliers_number,
            "purchase_transactions": number_of_purchase_transactions,
            "cost_of_goods_sold": total_cost_of_sales,
            "total_earnings": total_earnings_amount,
        }
    )

    return stats_data
