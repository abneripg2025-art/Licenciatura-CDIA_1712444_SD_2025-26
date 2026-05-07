from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

viagens = {}
id_counter = 1


# ==================== CRIAR ====================
@app.route('/viagens', methods=['POST'])
def criar_viagem():
    global id_counter
    data = request.json

    viagem = {
        "id": id_counter,
        "codigo_voo": data.get("codigo_voo"),
        "companhia": data.get("companhia"),
        "origem": data.get("origem"),
        "destino": data.get("destino"),
        "data": data.get("data"),
        "hora": data.get("hora"),
        "terminal": data.get("terminal"),
        "portao": data.get("portao"),
        "status": data.get("status", "Agendado"),
        "preco": data.get("preco", 0),
        "vagas": data.get("vagas", 0)
    }

    viagens[id_counter] = viagem
    id_counter += 1

    return jsonify(viagem), 201


# ==================== LISTAR ====================
@app.route('/viagens', methods=['GET'])
def listar_viagens():
    return jsonify(list(viagens.values()))


# ==================== OBTER ====================
@app.route('/viagens/<int:id>', methods=['GET'])
def obter_viagem(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404
    return jsonify(viagens[id])


# ==================== RESERVAR ====================
@app.route('/viagens/<int:id>/reservar', methods=['PUT'])
def reservar_vaga(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    if viagens[id]["vagas"] > 0:
        viagens[id]["vagas"] -= 1
        return jsonify({"msg": "Vaga reservada"})

    return jsonify({"erro": "Sem vagas"}), 400


# ==================== LIBERAR ====================
@app.route('/viagens/<int:id>/liberar', methods=['PUT'])
def liberar_vaga(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    viagens[id]["vagas"] += 1
    return jsonify({"msg": "Vaga liberada"})


# ==================== ATUALIZAR ====================
@app.route('/viagens/<int:id>', methods=['PUT'])
def atualizar_viagem(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    data = request.json
    viagem = viagens[id]

    campos = [
        "codigo_voo", "companhia", "origem", "destino",
        "data", "hora", "terminal", "portao",
        "status", "preco", "vagas"
    ]

    for campo in campos:
        if campo in data:
            viagem[campo] = data[campo]

    return jsonify(viagem)


# ==================== DELETAR ====================
@app.route('/viagens/<int:id>', methods=['DELETE'])
def deletar_viagem(id):
    if id not in viagens:
        return jsonify({"erro": "Viagem não encontrada"}), 404

    del viagens[id]
    return jsonify({"msg": "Viagem deletada"})


# ==================== RUN ====================
if __name__ == '__main__':
    app.run(port=5002)