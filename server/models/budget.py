import sys
import ast
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from firebase import db
from .users import get_user_doc_by_uid
from .transactions import get_transactions_user_month
from chains import budget_default

collection = db.collection("users")


def create_budget_with_rec(uid, cur_month, income, fixed, savings, rec):
    user_ref = get_user_doc_by_uid(uid)
    budget_ref = user_ref.collection("budget")
    logs = get_transactions_user_month(uid, cur_month)

    if not rec:
        rec = budget_default(logs, income, fixed, savings)

    fixed = income * (int(rec[0:2]) / 100)
    variable = income * (int(rec[3:5]) / 100)
    savings = income * (int(rec[6:8]) / 100)

    data = {"budget_stats":
            {
                "saved": 0,
                "spent_fixed": 0,
                "spent_variable": 0
            },
            "fixed_expenses": fixed,
            "income": income,
            "rule": rec,
            "savings": savings,
            "variable_expenses": variable
            }

    ref = budget_ref.document(cur_month.strftime("%B")).set(data)

    return (ref, data)