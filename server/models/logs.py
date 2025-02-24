import sys
import ast
import os
from datetime import datetime

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase import db
from users import get_user_doc_by_uid
from transactions import get_transactions_user_month
from chains import analyze_spending

collection = db.collection("users")


# Stores financial Analysis 
def create_log(uid, cur_month):
    user_ref = get_user_doc_by_uid(uid)
    analysis_ref = user_ref.collection("analysis")
    logs = get_transactions_user_month(uid, cur_month)
    data_string = analyze_spending(logs)
    data_map = ast.literal_eval(data_string)
    

    ref = analysis_ref.document(cur_month.strftime("%B")).set(data_map)

    return (ref, data_map)
