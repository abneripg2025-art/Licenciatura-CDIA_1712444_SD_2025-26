from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

viagens = {}

@app.route("/viagens", methods=["POST"])
def criar_viagem():
    data = request.json
    viagem_id = str(len(viagens) + 1)

    viagens[viagem_id] = {
        "id": viagem_id,
        "destino": data["destino"],
        "horario": data["horario"],
        "lugares_disponiveis": data["lugares"]
    }

    return jsonify(viagens[viagem_id]), 201

@app.route("/viagens/<id>", methods=["GET"])
def obter_viagem(id):
    return jsonify(viagens.get(id, {}))

@app.route("/viagens/<id>/reservar", methods=["POST"])
def reservar_lugar(id):
    if viagens[id]["lugares_disponiveis"] > 0:
        viagens[id]["lugares_disponiveis"] -= 1
        return jsonify({"status": "ok"})
    return jsonify({"status": "lotado"}), 400

if __name__ == "__main__":
    app.run(port=5006)