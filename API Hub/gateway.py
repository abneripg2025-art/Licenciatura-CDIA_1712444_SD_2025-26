from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

CLIENTES_URL = "http://localhost:5001"
VIAGENS_URL = "http://localhost:5002"
RESERVAS_URL = "http://localhost:5003"

TIMEOUT = 5


# =========================
# UTILIDADE SEGURA
# =========================
def safe_request(method, url, json=None):
    try:
        res = requests.request(method, url, json=json, timeout=TIMEOUT)

        try:
            data = res.json()
        except Exception:
            data = {
                "erro": "Resposta não é JSON",
                "status": res.status_code,
                "raw": res.text
            }

        return data, res.status_code

    except requests.exceptions.RequestException as e:
        return {"erro": "Serviço indisponível", "detalhe": str(e)}, 503


# =========================
# CLIENTES
# =========================
@app.route('/clientes', methods=['POST'])
def proxy_clientes():
    data, status = safe_request(
        "POST",
        f"{CLIENTES_URL}/clientes",
        json=request.get_json(silent=True)
    )
    return jsonify(data), status

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    data, status = safe_request("GET", f"{CLIENTES_URL}/clientes")
    return jsonify(data), status


@app.route('/clientes/<int:id>', methods=['PUT'])
def proxy_update_cliente(id):
    data, status = safe_request(
        "PUT",
        f"{CLIENTES_URL}/clientes/{id}",
        json=request.get_json(silent=True)
    )
    return jsonify(data), status


@app.route('/clientes/<int:id>', methods=['DELETE'])
def proxy_delete_cliente(id):
    data, status = safe_request("DELETE", f"{CLIENTES_URL}/clientes/{id}")
    return jsonify(data), status


# =========================
# VIAGENS
# =========================
@app.route('/viagens', methods=['POST'])
def proxy_viagens():
    res = requests.post(
        f"{VIAGENS_URL}/viagens",
        json=request.get_json(silent=True)
    )

    print("STATUS:", res.status_code)
    print("RAW:", res.text)

    return jsonify({"debug": res.text}), 200


@app.route('/viagens', methods=['GET'])
def listar_viagens():
    data, status = safe_request("GET", f"{VIAGENS_URL}/viagens")
    return jsonify(data), status


@app.route('/viagens/<int:id>', methods=['PUT'])
def proxy_update_viagem(id):
    data, status = safe_request(
        "PUT",
        f"{VIAGENS_URL}/viagens/{id}",
        json=request.get_json(silent=True)
    )
    return jsonify(data), status


@app.route('/viagens/<int:id>', methods=['DELETE'])
def proxy_delete_viagem(id):
    data, status = safe_request("DELETE", f"{VIAGENS_URL}/viagens/{id}")
    return jsonify(data), status


# =========================
# RESERVAS
# =========================
@app.route('/reservas', methods=['POST'])
def proxy_reservas():
    data, status = safe_request(
        "POST",
        f"{RESERVAS_URL}/reservas",
        json=request.get_json(silent=True)
    )
    return jsonify(data), status


@app.route('/reservas', methods=['GET'])
def listar_reservas():
    data, status = safe_request("GET", f"{RESERVAS_URL}/reservas")
    return jsonify(data), status


@app.route('/reservas/<int:id>', methods=['PUT'])
def proxy_update_reserva(id):
    data, status = safe_request(
        "PUT",
        f"{RESERVAS_URL}/reservas/{id}",
        json=request.get_json(silent=True)
    )
    return jsonify(data), status


@app.route('/reservas/<int:id>', methods=['DELETE'])
def proxy_delete_reserva(id):
    data, status = safe_request("DELETE", f"{RESERVAS_URL}/reservas/{id}")
    return jsonify(data), status


# =========================
# RUN
# =========================
if __name__ == '__main__':
    app.run(port=5000, debug=True)