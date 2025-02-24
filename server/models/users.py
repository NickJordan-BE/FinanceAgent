import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase import db
from google.cloud.firestore_v1.base_query import FieldFilter

collection = db.collection("users")

# Writes user document to users collection
def create_user(email, uid):
    data = {"email": email, "uid": uid}

    time, user_ref = collection.add(data)

    return user_ref

# Deletes user document from users collection
def delete_user(uid):

    user_query = collection.where(field_path="uid", op_string="==", value=uid).limit(1)
    user_snapshot = user_query.get()

    if not user_snapshot:
        return ("No found with UID: ", uid)
    
    user_document = user_snapshot[0]
    user_document.reference.delete()

    return "Success: User with UID:" +  uid +" deleted."

# Returns a reference to the user document
def get_user_doc_by_uid(uid):
    query = collection.where(field_path="uid", op_string="==", value=uid)

    user_snap = query.get()

    user_doc = user_snap[0]

    return user_doc.reference

def get_user_by_email(email):
    query = collection.where(field_path="email", op_string="==", value=email)

    user = query.get()

    if not user:
        return "No User found with email: {email}."
    
    return user.to_dict()

# Updates selected user document's email to new emails
def update_user_email(uid, new_email):
    
    user_query = collection.where(field_path="uid", op_string="==", value=uid).limit(1)
    user_snapshot = user_query.get()

    if not user_snapshot:
        return ("No found with UID: ", uid)
    
    user_doc = user_snapshot[0]
    user_doc.reference.set({"email": new_email}, merge=True)

    return "Success: User with UID:", uid, "updated."



