from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes import chatbot_call
from utils import verify_firebase_token

load_dotenv()

app = Flask(__name__)

CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Route for chatbot conversations
@app.route("/api/chat", methods=['POST'])
def chat_route():

    auth_header = request.headers.get('Authorization')

    if not auth_header:
        return jsonify({"error": "Authorization header is missing"}), 401
    
    if not auth_header.startswith('Bearer '):
        return jsonify({"error": "Invalid authorization header format"}), 401
    

    token = auth_header.split(' ')[1]

    uid = verify_firebase_token(token)

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
