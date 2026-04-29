from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

CLIENTES_URL = "http://localhost:5001"
VIAGENS_URL = "http://localhost:5002"
RESERVAS_URL = "http://localhost:5003"

@app.route('/clientes', methods=['POST'])
def proxy_clientes():
    res = requests.post(f"{CLIENTES_URL}/clientes", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/viagens', methods=['POST'])
def proxy_viagens():
    res = requests.post(f"{VIAGENS_URL}/viagens", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/reservas', methods=['POST'])
def proxy_reservas():
    res = requests.post(f"{RESERVAS_URL}/reservas", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/viagens', methods=['GET'])
def listar_viagens():
    res = requests.get(f"{VIAGENS_URL}/viagens")
    return jsonify(res.json())

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    res = requests.get(f"{CLIENTES_URL}/clientes")
    return jsonify(res.json())

@app.route('/reservas', methods=['GET'])
def listar_reservas():
    res = requests.get(f"{RESERVAS_URL}/reservas")
    return jsonify(res.json())

if __name__ == '__main__':
    app.run(port=5000)