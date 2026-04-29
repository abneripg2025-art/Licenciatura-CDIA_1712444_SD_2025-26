from flask import Flask, request, jsonify

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(port=5001)