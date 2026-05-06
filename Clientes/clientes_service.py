from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clientes = {}
id_counter = 1

@app.route('/clientes', methods=['POST'])
def criar_cliente():
    global id_counter
    data = request.json
    cliente = {
        "id": id_counter,
        "nome": data["nome"],
        "email": data["email"],
        "historico": []
    }
    clientes[id_counter] = cliente
    id_counter += 1
    return jsonify(cliente), 201

@app.route('/clientes/<int:id>', methods=['GET'])
def obter_cliente(id):
    return jsonify(clientes.get(id, {}))

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    return jsonify(list(clientes.values()))

@app.route('/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente(id):
    if id not in clientes:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    data = request.json
    cliente = clientes[id]

    cliente["nome"] = data.get("nome", cliente["nome"])
    cliente["email"] = data.get("email", cliente["email"])

    return jsonify(cliente)


@app.route('/clientes/<int:id>', methods=['DELETE'])
def deletar_cliente(id):
    if id not in clientes:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    del clientes[id]
    return jsonify({"msg": "Cliente deletado"})

if __name__ == '__main__':
    app.run(port=5001)