from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

viagens = {}
id_counter = 1

@app.route('/viagens', methods=['POST'])
def criar_viagem():
    global id_counter
    data = request.json
    viagem = {
        "id": id_counter,
        "destino": data["destino"],
        "horario": data["horario"],
        "vagas": data["vagas"]
    }
    viagens[id_counter] = viagem
    id_counter += 1
    return jsonify(viagem), 201

@app.route('/viagens', methods=['GET'])
def listar_viagens():
    return jsonify(list(viagens.values()))

@app.route('/viagens/<int:id>', methods=['GET'])
def obter_viagem(id):
    return jsonify(viagens.get(id, {}))

@app.route('/viagens/<int:id>/reservar', methods=['PUT'])
def reservar_vaga(id):
    if viagens[id]["vagas"] > 0:
        viagens[id]["vagas"] -= 1
        return jsonify({"msg": "Vaga reservada"})
    return jsonify({"erro": "Sem vagas"}), 400

@app.route('/viagens/<int:id>/liberar', methods=['PUT'])
def liberar_vaga(id):
    if id in viagens:
        viagens[id]["vagas"] += 1
        return jsonify({"msg": "Vaga liberada"})
    return jsonify({"erro": "Viagem não encontrada"}), 404

@app.route('/viagens/<int:id>', methods=['PUT'])
def atualizar_viagem(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    data = request.json
    viagem = viagens[id]

    viagem["destino"] = data.get("destino", viagem["destino"])
    viagem["horario"] = data.get("horario", viagem["horario"])
    viagem["vagas"] = data.get("vagas", viagem["vagas"])

    return jsonify(viagem)


@app.route('/viagens/<int:id>', methods=['DELETE'])
def deletar_viagem(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    del viagens[id]
    return jsonify({"msg": "Viagem deletada"})

if __name__ == '__main__':
    app.run(port=5002)