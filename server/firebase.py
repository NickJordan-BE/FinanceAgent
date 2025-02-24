import firebase_admin
import os
from firebase_admin import credentials, auth
from firebase_admin import firestore
from dotenv import load_dotenv

load_dotenv()

FIREBASE_CREDS = os.getenv('FIREBASE_CREDENTIALS')

cred = credentials.Certificate(FIREBASE_CREDS)
firebase_admin.initialize_app(cred)
db = firestore.client()

# middleware to verify user's firebase token
def verify_firebase_token(token):
    try:
        decoded_token = auth.verify_id_token(token)

        uid = decoded_token['uid']

        return uid 
    except Exception as e:
        return str(e) 