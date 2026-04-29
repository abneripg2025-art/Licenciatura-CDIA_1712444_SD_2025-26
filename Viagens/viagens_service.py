from flask import Flask, request, jsonify

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(port=5002)