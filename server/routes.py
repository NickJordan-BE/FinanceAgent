from model import the_agent
from flask import request, jsonify
from firebase_admin import credentials, auth


def chat():
    text = request.get_json()

    
    
    query = text.get("query")
    
    if not query:
        return jsonify({"error": "No query provided"}), 400
    
    result = the_agent.invoke(query)

    try:
        agent_response = result.get('output')

        return jsonify({"response": agent_response})
    
    except Exception as e:
        
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

