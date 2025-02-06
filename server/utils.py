import firebase_admin
import os
from firebase_admin import credentials, auth

FIREBASE_CREDS = os.getenv('FIREBASE_CREDENTIALS')

cred = credentials.Certificate(FIREBASE_CREDS)
firebase_admin.initialize_app(cred)

def verify_firebase_token(token):
    try:
        decoded_token = auth.verify_id_token(token)

        uid = decoded_token['uid']

        return uid 
    except Exception as e:
        return str(e) 