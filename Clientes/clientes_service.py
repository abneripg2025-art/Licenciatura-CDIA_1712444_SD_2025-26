from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

clientes = {}
id_counter = 1

@app.route('/clientes', methods=['POST'])
def criar_cliente():
    global id_counter

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"erro": "JSON inválido"}), 400

    if not data.get("nome") or not data.get("email"):
        return jsonify({"erro": "Nome e email obrigatórios"}), 400

    cliente = {
        "id": id_counter,
        "nome": data.get("nome"),
        "email": data.get("email"),
        "telefone": data.get("telefone"),
        "nif": data.get("nif"),
        "passaporte": data.get("passaporte"),
        "data_registo": data.get("data_registo"),
        "estado": data.get("estado", "ativo")
    }

    clientes[id_counter] = cliente
    id_counter += 1

    return jsonify(cliente), 201

@app.route('/clientes/<int:id>', methods=['GET'])
def obter_cliente(id):
    cliente = clientes.get(id)

    if not cliente:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    return jsonify(cliente)

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    return jsonify(list(clientes.values()))

@app.route('/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente(id):

    if id not in clientes:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    data = request.get_json(silent=True)

    if not data:
        return jsonify({"erro": "JSON inválido"}), 400

    cliente = clientes[id]

    cliente["nome"] = data.get("nome", cliente["nome"])
    cliente["email"] = data.get("email", cliente["email"])
    cliente["telefone"] = data.get("telefone", cliente.get("telefone"))
    cliente["nif"] = data.get("nif", cliente.get("nif"))
    cliente["passaporte"] = data.get("passaporte", cliente.get("passaporte"))
    cliente["estado"] = data.get("estado", cliente.get("estado"))

    return jsonify(cliente)

@app.route('/clientes/<int:id>', methods=['DELETE'])
def deletar_cliente(id):

    if id not in clientes:
        return jsonify({"erro": "Cliente não encontrado"}), 404

    del clientes[id]

    return jsonify({"msg": "Cliente deletado"})


# =========================
# RUN
# =========================
if __name__ == '__main__':
    app.run(port=5001, debug=True)