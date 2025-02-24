from flask import Flask, request, jsonify
from functools import wraps
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv
from routes import chatbot_call
from firebase import verify_firebase_token
from models.users import create_user, delete_user, update_user_email
from chains import analyze_spending
from models.transactions import get_transactions_by_date, get_transactions_by_two_dates, get_all_transactions_by_user, create_transaction, delete_transaction, update_transaction_amount, update_transaction_company, update_transaction_amount_and_company
from models.logs import create_log

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

def auth_middleware(f):
    @wraps(f)
    def middleware(*args, **kwargs):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return jsonify({"error": "Authorization header is missing"}), 401
        
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Invalid authorization header format"}), 401
        

        token = auth_header.split(' ')[1]

        uid = verify_firebase_token(token)

        response = f(*args, **kwargs)

        return response
    return middleware

@app.route("/api/analysis/<string:uid>", methods=['POST'])
def create_log_route(uid):
    try:

        log_ref, data = create_log(uid, datetime.today().replace(day=1))
        return jsonify({"data": data}), 200
    
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@app.route("/api/transactions/create", methods=['POST'])
@auth_middleware
def create_transaction_route():
    try:
        req = request.get_json()
        amount, company, uid = req["amount"] + "$", req["company"], req["uid"]
        
        if not amount or not company or not uid:
            return jsonify({"Error": "All Fields Must Be Filled"}), 500
        
        result = create_transaction(amount=amount, company=company, uid=uid)

        return jsonify({"data": result.to_dict()}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/<string:id>/delete", methods=['DELETE'])
@auth_middleware
def delete_transaction_route(id):
    try:
        
        result = delete_transaction(id)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/two-dates", methods=['GET'])
@auth_middleware
def get_transaction_two_dates_route():
    try:
        req = request.get_json()
        start_date, end_date = req["start_date"], req["end_date"]
        
        if not start_date or not end_date:
            return jsonify({"Error": "All Fields Must Be Filled"}), 500
        
        result = get_transactions_by_two_dates(start_date=start_date, end_date=end_date)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/date", methods=['GET'])
@auth_middleware
def get_transaction_date_route():
    try:
        req = request.get_json()
        start_date = req["start_date"]
        
        if not start_date:
            return jsonify({"Error": "Start Date Must Be Filled"}), 500
        
        result = get_transactions_by_date(start_date=start_date)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/users/<string:uid>", methods=['GET'])
@auth_middleware
def get_transaction_user_route(uid):
    try:
        
        result = get_all_transactions_by_user(uid)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/<string:id>/new-amount", methods=['PATCH'])
@auth_middleware
def update_transaction_amount_route(id):
    try:
        req = request.get_json()
        new_amount = req["new_amount"]

        result = update_transaction_amount(transaction_id=id, new_amount=new_amount)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/<string:id>/update", methods=['PATCH'])
@auth_middleware
def update_transaction_route(id):
    try:
        req = request.get_json()
        new_amount, new_company = req["new_amount"], req["new_company"]

        result = update_transaction_amount_and_company(transaction_id=id, new_amount=new_amount, new_company=new_company)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/transactions/<string:id>/new-company", methods=['PATCH'])
@auth_middleware
def update_transaction_company_route(id):
    try:
        req = request.get_json()
        new_company = req["new_company"]

        result = update_transaction_company(transaction_id=id, new_company=new_company)

        return jsonify({"data": result}), 200
    
    except Exception as e:
        print(e)
        return jsonify({"Error": f"An error occurred: {str(e)}"}), 500

@app.route("/api/users/create", methods=['POST'])
def create_user_route():
    try:
        req = request.get_json()
        email, uid = req["email"], req["uid"]

        if not email:
            return jsonify({"error": "Email cannot be blank"}), 500
        
        result = create_user(email, uid)

        return jsonify({"data": result.get().to_dict()}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    
@app.route("/api/users/<string:uid>/delete", methods=['DELETE'])
@auth_middleware
def delete_user_route(uid):
    try:
        
        result = delete_user(uid)

        return jsonify({"data": result}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route("/api/users/<string:uid>/update", methods=['PATCH'])
@auth_middleware
def update_user_route(uid):
    try:
        req = request.get_json()
        new_email= req["new_email"]

        if not new_email:
            return jsonify({"error": "New email cannot be blank"}), 500
        
        result = update_user_email(uid, new_email), 200

        return jsonify({"data": result})
    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

# Route for chatbot conversations
@app.route("/api/chat", methods=['POST'])
@auth_middleware
def chat_route():
   
    try:
        req = request.get_json()
        query = req["query"]
    
        if not query:
            return jsonify({"error": "No query provided"}), 400
        
        result = chatbot_call(uid, query)

        return jsonify({"data": result})

    except Exception as e:
        print(e)
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
