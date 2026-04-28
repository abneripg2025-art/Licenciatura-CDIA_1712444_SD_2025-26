from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.before_request
def before():
    print(">>> REQUEST CHEGOU:", request.method, request.path)

@app.route("/clientes", methods=["POST", "OPTIONS", "GET"])
def clientes():
    return {"ok": True, "method": request.method}

if __name__ == "__main__":
    app.run(port=5004, debug=True)