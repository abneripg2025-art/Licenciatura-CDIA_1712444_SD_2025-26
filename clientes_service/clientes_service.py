from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

clientes = {}

@app.route("/clientes", methods=["POST"])
def criar_cliente():
    data = request.json
    cliente_id = str(len(clientes) + 1)
    clientes[cliente_id] = {
        "id": cliente_id,
        "nome": data["nome"],
        "email": data["email"],
        "historico": []
    }
    return jsonify(clientes[cliente_id]), 201

@app.route("/clientes/<id>", methods=["GET"])
def obter_cliente(id):
    return jsonify(clientes.get(id, {}))

@app.route("/clientes/<id>/historico", methods=["POST"])
def adicionar_historico(id):
    data = request.json
    clientes[id]["historico"].append(data)
    return jsonify(clientes[id])

if __name__ == "__main__":
    app.run(port=5004)