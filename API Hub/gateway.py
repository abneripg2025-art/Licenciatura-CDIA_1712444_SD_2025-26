from flask import Flask, request, jsonify
import requests
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True)

CLIENTES_URL = "http://localhost:5001"
VIAGENS_URL = "http://localhost:5002"
RESERVAS_URL = "http://localhost:5003"


#Clientes

@app.route('/clientes', methods=['POST'])
def proxy_clientes():
    res = requests.post(f"{CLIENTES_URL}/clientes", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/clientes', methods=['GET'])
def listar_clientes():
    res = requests.get(f"{CLIENTES_URL}/clientes")
    return jsonify(res.json())

@app.route('/clientes/<int:id>', methods=['PUT'])
def proxy_update_cliente(id):
    res = requests.put(f"{CLIENTES_URL}/clientes/{id}", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/clientes/<int:id>', methods=['DELETE'])
def proxy_delete_cliente(id):
    res = requests.delete(f"{CLIENTES_URL}/clientes/{id}")
    return jsonify(res.json()), res.status_code

#Viagens

@app.route('/viagens', methods=['POST'])
def proxy_viagens():
    res = requests.post(f"{VIAGENS_URL}/viagens", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/viagens', methods=['GET'])
def listar_viagens():
    res = requests.get(f"{VIAGENS_URL}/viagens")
    return jsonify(res.json())

@app.route('/viagens/<int:id>', methods=['PUT'])
def proxy_update_viagem(id):
    res = requests.put(f"{VIAGENS_URL}/viagens/{id}", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/viagens/<int:id>', methods=['DELETE'])
def proxy_delete_viagem(id):
    res = requests.delete(f"{VIAGENS_URL}/viagens/{id}")
    return jsonify(res.json()), res.status_code

@app.route('/reservas', methods=['POST'])
def proxy_reservas():
    res = requests.post(f"{RESERVAS_URL}/reservas", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/reservas', methods=['GET'])
def listar_reservas():
    res = requests.get(f"{RESERVAS_URL}/reservas")
    return jsonify(res.json())

@app.route('/reservas/<int:id>', methods=['PUT'])
def proxy_update_reserva(id):
    res = requests.put(f"{RESERVAS_URL}/reservas/{id}", json=request.json)
    return jsonify(res.json()), res.status_code

@app.route('/reservas/<int:id>', methods=['DELETE'])
def proxy_delete_reserva(id):
    res = requests.delete(f"{RESERVAS_URL}/reservas/{id}")
    return jsonify(res.json()), res.status_code

if __name__ == '__main__':
    app.run(port=5000)