from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

reservas = {}
id_counter = 1

VIAGENS_URL = "http://localhost:5002"
CLIENTES_URL = "http://localhost:5001"

@app.route('/reservas', methods=['POST'])
def criar_reserva():
    global id_counter
    data = request.json

    cliente = requests.get(f"{CLIENTES_URL}/clientes/{data['cliente_id']}")
    viagem = requests.get(f"{VIAGENS_URL}/viagens/{data['viagem_id']}")

    if cliente.status_code != 200 or viagem.status_code != 200:
        return jsonify({"erro": "Cliente ou viagem inválido"}), 400

    reservar = requests.put(f"{VIAGENS_URL}/viagens/{data['viagem_id']}/reservar")
    if reservar.status_code != 200:
        return jsonify({"erro": "Sem vagas"}), 400

    reserva = {
        "id": id_counter,
        "cliente_id": data["cliente_id"],
        "viagem_id": data["viagem_id"],
        "status": "confirmada"
    }

    reservas[id_counter] = reserva
    id_counter += 1

    return jsonify(reserva), 201

@app.route('/reservas', methods=['GET'])
def listar_reservas():
    return jsonify(list(reservas.values()))

@@app.route('/reservas/<int:id>', methods=['DELETE'])
def cancelar_reserva(id):
    if id not in reservas:
        return jsonify({"erro": "Reserva não encontrada"}), 404

    reserva = reservas[id]

    if reserva["status"] == "cancelada":
        return jsonify({"erro": "Reserva já cancelada"}), 400

    viagem_id = reserva["viagem_id"]

    res = requests.put(f"{VIAGENS_URL}/viagens/{viagem_id}/liberar")
    if res.status_code != 200:
        return jsonify({"erro": "Erro ao liberar vaga"}), 500

    reserva["status"] = "cancelada"

    return jsonify(reserva)

@app.route('/reservas/<int:id>', methods=['PUT'])
def atualizar_reserva(id):
    if id not in reservas:
        return jsonify({"erro": "Reserva não encontrada"}), 404

    data = request.json
    reserva = reservas[id]

    reserva["status"] = data.get("status", reserva["status"])

    return jsonify(reserva)

if __name__ == '__main__':
    app.run(port=5003)