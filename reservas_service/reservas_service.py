from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

RESERVAS = {}

CLIENTES_URL = "http://localhost:5001"
VIAGENS_URL = "http://localhost:5002"

@app.route("/reservas", methods=["POST"])
def criar_reserva():
    data = request.json

    cliente = requests.get(f"{CLIENTES_URL}/clientes/{data['cliente_id']}").json()
    viagem = requests.get(f"{VIAGENS_URL}/viagens/{data['viagem_id']}").json()

    if not cliente or not viagem:
        return jsonify({"erro": "Cliente ou viagem inválido"}), 400

    # tenta reservar lugar na viagem
    r = requests.post(f"{VIAGENS_URL}/viagens/{data['viagem_id']}/reservar")

    if r.status_code != 200:
        return jsonify({"erro": "Sem lugares"}), 400

    reserva_id = str(len(RESERVAS) + 1)

    RESERVAS[reserva_id] = {
        "id": reserva_id,
        "cliente_id": data["cliente_id"],
        "viagem_id": data["viagem_id"]
    }

    # atualiza histórico do cliente
    requests.post(
        f"{CLIENTES_URL}/clientes/{data['cliente_id']}/historico",
        json={"viagem_id": data["viagem_id"]}
    )

    return jsonify(RESERVAS[reserva_id]), 201

@app.route("/reservas", methods=["GET"])
def listar_reservas():
    return jsonify(RESERVAS)

if __name__ == "__main__":
    app.run(port=5003)