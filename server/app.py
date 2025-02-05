from flask import Flask
from flask_cors import CORS
from routes import chat

app = Flask(__name__)

CORS(app)


@app.route("/api/chat", methods=['POST'])
def route():
    chat()


if __name__ == "__main__":
    app.run(port=8080, debug=True)
