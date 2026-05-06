const API = "http://localhost:5000";

let clientes = [];
let viagens = [];
let reservas = [];

function getStatusColor(status) {
    switch (status) {
        case "Agendado": return "primary";
        case "Embarque": return "warning";
        case "Atrasado": return "danger";
        case "Cancelado": return "secondary";
        case "Concluído": return "success";
        default: return "dark";
    }
}

function mostrar(secao) {
    const secoes = ["clientes", "viagens", "reservas"];

    secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    const ativa = document.getElementById(secao);
    if (ativa) ativa.style.display = "block";
}

// ==================== LOAD ====================
async function carregar() {
    clientes = await (await fetch(`${API}/clientes`)).json();
    viagens = await (await fetch(`${API}/viagens`)).json();
    reservas = await (await fetch(`${API}/reservas`)).json();

    renderClientes();
    renderViagens();
    renderReservas();
    atualizarSelects();
}

// ==================== CLIENTES ====================
function renderClientes() {
    clientesLista.innerHTML = clientes.map(c => `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3">

                <div class="d-flex justify-content-between align-items-center">

                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-primary text-white icon-btn">
                            <i class="bi bi-person-fill"></i>
                        </div>

                        <div>
                            <h5>${c.nome}</h5>
                            <small class="text-muted">
                                <i class="bi bi-envelope"></i> ${c.email}
                            </small>
                        </div>
                    </div>

                    <div class="d-flex gap-2">
                        <button class="btn btn-light icon-btn" onclick="editarCliente(${c.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-light icon-btn" onclick="deletarCliente(${c.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    `).join("");
}

async function criarCliente() {
    await fetch(`${API}/clientes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome: nome.value, email: email.value })
    });
    carregar();
}

async function editarCliente(id) {
    const c = clientes.find(x => x.id === id);

    const nomeNovo = prompt("Nome:", c.nome);
    const emailNovo = prompt("Email:", c.email);

    if (!nomeNovo || !emailNovo) return;

    await fetch(`${API}/clientes/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ nome: nomeNovo, email: emailNovo })
    });

    carregar();
}

async function deletarCliente(id) {
    if (!confirm("Deletar cliente?")) return;

    await fetch(`${API}/clientes/${id}`, { method: "DELETE" });
    carregar();
}

// ==================== VIAGENS ====================
function renderViagens() {
    viagensLista.innerHTML = viagens.map(v => `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3">

                <div class="d-flex justify-content-between">

                    <div>

                        <!-- Cabeçalho -->
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <i class="bi bi-airplane-fill text-primary"></i>
                            <h5 class="mb-0">${v.destino}</h5>
                        </div>

                        <!-- Código + companhia -->
                        <div class="text-muted mb-1">
                            <i class="bi bi-hash"></i> ${v.codigo_voo || "-"} • ${v.companhia || ""}
                        </div>

                        <!-- Origem -->
                        <div class="text-muted mb-1">
                            <i class="bi bi-geo-alt"></i> ${v.origem || "-"} → ${v.destino}
                        </div>

                        <!-- Data + Hora -->
                        <div class="text-muted mb-2">
                            <i class="bi bi-clock"></i> ${v.data || "-"} às ${v.hora || "-"}
                        </div>

                        <!-- Terminal e Portão -->
                         <div class="text-muted mb-1">
                            <i class="bi bi-hash"></i> Terminal ${v.terminal || "-"} • Portão ${v.portao || ""}
                        </div>

                        <!-- Status -->
                        <span class="badge bg-${getStatusColor(v.status)}">
                            ${v.status || "Agendado"}
                        </span>

                        <!-- Vagas -->
                        <div class="mt-2">
                            <span class="badge bg-${v.vagas > 0 ? "success" : "danger"}">
                                <i class="bi bi-people-fill"></i> ${v.vagas} vagas
                            </span>
                        </div>

                        <!-- Preço -->
                        <div class="mt-2 fw-bold text-primary">
                            € ${v.preco ?? "-"}
                        </div>

                    </div>

                    <!-- Botões -->
                    <div class="d-flex flex-column gap-2">
                        <button class="btn btn-light icon-btn" onclick='abrirModalEditar(${JSON.stringify(v)})'>
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-light icon-btn" onclick="deletarViagem(${v.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    `).join("");
}

async function criarViagem() {
    await fetch(`${API}/viagens`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            codigo_voo: codigo_voo.value,
            companhia: companhia.value,
            origem: origem.value,
            destino: destino.value,
            data: data.value,
            hora: hora.value,
            terminal: terminal.value,
            portao: portao.value,
            preco: parseFloat(preco.value),
            vagas: parseInt(vagas.value)
        })
    });

    carregar();
}

async function editarViagem(id) {
    const v = viagens.find(x => x.id === id);

    const destinoNovo = prompt("Destino:", v.destino);
    const origemNova = prompt("Origem:", v.origem);
    const dataNova = prompt("Data:", v.data);
    const horaNova = prompt("Hora:", v.hora);
    const vagasNovo = prompt("Vagas:", v.vagas);

    if (!destinoNovo) return;

    await fetch(`${API}/viagens/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            destino: destinoNovo,
            origem: origemNova,
            data: dataNova,
            hora: horaNova,
            vagas: parseInt(vagasNovo)
        })
    });

    carregar();
}

async function deletarViagem(id) {
    if (!confirm("Deletar viagem?")) return;

    await fetch(`${API}/viagens/${id}`, { method: "DELETE" });
    carregar();
}

let viagemEditando = null;

function abrirModalEditar(v) {
    viagemEditando = v;

    m_codigo_voo.value = v.codigo_voo || "";
    m_companhia.value = v.companhia || "";
    m_origem.value = v.origem || "";
    m_destino.value = v.destino || "";
    m_data.value = v.data || "";
    m_hora.value = v.hora || "";
    m_terminal.value = v.terminal || "";
    m_portao.value = v.portao || "";
    m_preco.value = v.preco || "";
    m_vagas.value = v.vagas || "";

    const modal = new bootstrap.Modal(document.getElementById('modalViagem'));
    modal.show();
}

async function salvarEdicaoViagem() {

    if (!viagemEditando) return;

    const dados = {
        codigo_voo: m_codigo_voo.value,
        companhia: m_companhia.value,
        origem: m_origem.value,
        destino: m_destino.value,
        data: m_data.value,
        hora: m_hora.value,
        terminal: m_terminal.value,
        portao: m_portao.value,
        preco: parseFloat(m_preco.value),
        vagas: parseInt(m_vagas.value)
    };

    await fetch(`${API}/viagens/${viagemEditando.id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(dados)
    });

    bootstrap.Modal.getInstance(document.getElementById('modalViagem')).hide();

    viagemEditando = null;
    carregar();
}

// ==================== RESERVAS ====================
function renderReservas() {
    reservasLista.innerHTML = reservas.map(r => {
        const c = clientes.find(x => x.id === r.cliente_id);
        const v = viagens.find(x => x.id === r.viagem_id);

        return `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3">

                <div class="mb-2">
                    <i class="bi bi-person"></i> <strong>${c?.nome}</strong>
                </div>

                <div class="text-muted mb-2">
                    <i class="bi bi-airplane"></i> ${v?.codigo_voo} - ${v?.destino}
                </div>

                <span class="badge bg-${r.status === "cancelada" ? "secondary" : "primary"}">
                    ${r.status}
                </span>

                <div class="mt-3">
                    ${r.status !== "cancelada"
                        ? `<button class="btn btn-danger btn-sm w-100" onclick="cancelarReserva(${r.id})">
                                <i class="bi bi-x-circle"></i> Cancelar
                           </button>`
                        : `<small class="text-muted">Reserva cancelada</small>`
                    }
                </div>

            </div>
        </div>
        `;
    }).join("");
}

async function criarReserva() {
    await fetch(`${API}/reservas`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            cliente_id: parseInt(cliente.value),
            viagem_id: parseInt(viagem.value)
        })
    });
    carregar();
}

async function cancelarReserva(id) {
    await fetch(`${API}/reservas/${id}`, { method: "DELETE" });
    carregar();
}

// ==================== SELECTS ====================
function atualizarSelects() {
    cliente.innerHTML = clientes.map(c =>
        `<option value="${c.id}">${c.nome}</option>`
    ).join("");

    viagem.innerHTML = viagens.map(v =>
        `<option value="${v.id}" ${v.vagas === 0 ? "disabled" : ""}>
            ${v?.codigo_voo} - ${v?.destino} (${v.vagas} vagas)
        </option>`
    ).join("");
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    carregar();
});