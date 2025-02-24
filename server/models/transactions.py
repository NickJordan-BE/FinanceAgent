import sys
import os
from firebase_admin import firestore
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase import db
from chains import categorize_spending

collection = db.collection("transactions")

# Creates new transaction in firebase database
# w/ amount, company, user, timestamp, and category
def create_transaction(amount, company, uid):

    category = categorize_spending(amount, company)

    data = {"amount": amount + "$", 
            "company": company, 
            "uid": uid,
            "category": category,
            "createdAt": firestore.SERVER_TIMESTAMP}
    
    time, doc_ref = collection.add(data)
    
    return doc_ref.get()

# Deletes selected transaction
def delete_transaction(transaction_id):
    transaction_ref = collection.document(transaction_id)

    transaction_ref.delete()

    return ("Success: Transaction Deleted")

# Retrieves all transactions by given user
def get_all_transactions_by_user(uid):

    query = collection.where(field_path="uid", op_string="==", value=uid)
    doc_snapshot = query.get()
    docs = []
    
    for doc in doc_snapshot:
        docs.append((doc.id, doc.to_dict()))
    
    return docs

# Retrieves all transactions between the start date and end date
def get_transactions_by_two_dates(start_date, end_date):

    query = collection.where(field_path="createdAt", op_string=">=", value=start_date).where(field_path="createdAt", op_string="<=", value=end_date).order_by("createdAt")
    doc_snapshot = query.get()
    docs = []

    for doc in doc_snapshot:
        docs.append(doc.to_dict())
    
    if not docs:
        return "No transactions found within the given dates."

    return docs

# Retrieves all transactions after given start date
def get_transactions_by_date(start_date):

    query = collection.where(field_path="createdAt", op_string=">=", value=start_date)
    doc_snapshot = query.get()
    docs = []

    for doc in doc_snapshot:
        docs.append(doc.to_dict())

    return docs

# Retrieves all transactions by user for the current month
def get_transactions_user_month(uid, cur_month):

    query = collection.where(field_path="uid", op_string="==", value=uid).where(field_path="createdAt", op_string=">=", value=cur_month)
    doc_snapshot = query.get()
    docs = []

    for doc in doc_snapshot:
        docs.append((doc.id, doc.to_dict()))

    return docs


# Updates selected transaction's amount to new amount
def update_transaction_amount(transaction_id, new_amount):
    transaction_ref = collection.document(transaction_id)

    transaction_ref.set({"amount": new_amount + "$"}, merge=True)

    return ("Success: Transaction Amount Updated")

# Updates selected transaction's amount to new amount and new company
def update_transaction_amount_and_company(transaction_id, new_amount, new_company):
    update_transaction_amount(transaction_id, new_amount)
    update_transaction_company(transaction_id, new_company)

    return ("Success: Transaction Amount Updated")

# Updates selected transaction's company to new amount
def update_transaction_company(transaction_id, new_company):
    transaction_ref = collection.document(transaction_id)
    amount = transaction_ref.get().to_dict()["amount"]

    new_category = categorize_spending(amount, new_company)

    transaction_ref.set({"company": new_company, "category": new_category}, merge=True)

    return ("Success: Transaction Company Updated")
