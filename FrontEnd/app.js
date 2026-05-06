const API = "http://localhost:5000";

let clientes = [];
let viagens = [];
let reservas = [];

window.onload = () => {
    mostrar("clientes", document.querySelector(".sidebar button"));
};

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

function mostrar(secao, btn) {

    // esconder todas as secções
    document.getElementById("clientes").style.display = "none";
    document.getElementById("viagens").style.display = "none";
    document.getElementById("reservas").style.display = "none";

    // mostrar selecionada
    document.getElementById(secao).style.display = "block";

    // remover active de todos os botões
    document.querySelectorAll(".sidebar button").forEach(b => {
        b.classList.remove("active");
    });

    // adicionar active ao clicado
    if (btn) {
        btn.classList.add("active");
    }
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

                <div class="d-flex justify-content-between align-items-start">

                    <div class="d-flex align-items-start gap-3">

                        <div class="bg-primary text-white icon-btn">
                            <i class="bi bi-person-fill"></i>
                        </div>

                        <div>
                            <h5>${c.nome}</h5>

                            <small class="text-muted d-block">
                                <i class="bi bi-envelope"></i> ${c.email}
                            </small>

                            <small class="text-muted d-block">
                                <i class="bi bi-telephone"></i> ${c.telefone || "—"}
                            </small>

                            <small class="text-muted d-block">
                                <i class="bi bi-credit-card"></i> NIF: ${c.nif || "—"}
                            </small>

                            <small class="text-muted d-block">
                                <i class="bi bi-passport"></i> ${c.passaporte || "—"}
                            </small>

                            <span class="badge bg-${c.estado === 'ativo' ? 'success' : 'secondary'} mt-2">
                                ${c.estado || 'ativo'}
                            </span>
                        </div>

                    </div>

                    <div class="d-flex flex-column gap-2">

                        <button class="btn btn-light icon-btn" onclick="verHistorico(${c.id})">
                            <i class="bi bi-clock-history"></i>
                        </button>

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

function renderClientesFiltrados(lista) {
    clientesLista.innerHTML = lista.map(c => `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3">
                <h5>${c.nome}</h5>
                <small class="text-muted">${c.email}</small>

                <div class="mt-2 d-flex gap-2">
                    <button class="btn btn-light btn-sm" onclick="editarCliente(${c.id})">
                        <i class="bi bi-pencil"></i>
                    </button>

                    <button class="btn btn-light btn-sm" onclick="deletarCliente(${c.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

async function criarCliente() {
    await fetch(`${API}/clientes`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            nome: nome.value,
            email: email.value,
            telefone: telefone.value,
            nif: nif.value,
            passaporte: passaporte.value
        })
    });

    carregar();
}

function editarCliente(id) {
    const c = clientes.find(x => x.id === id);

    document.getElementById("edit-id").value = c.id;
    document.getElementById("edit-nome").value = c.nome;
    document.getElementById("edit-email").value = c.email;
    document.getElementById("edit-telefone").value = c.telefone || "";
    document.getElementById("edit-nif").value = c.nif || "";
    document.getElementById("edit-passaporte").value = c.passaporte || "";
    document.getElementById("edit-estado").value = c.estado || "ativo";

    const modal = new bootstrap.Modal(document.getElementById("modalEditarCliente"));
    modal.show();
}

async function salvarEdicaoCliente() {
    const id = document.getElementById("edit-id").value;

    const payload = {
        nome: document.getElementById("edit-nome").value,
        email: document.getElementById("edit-email").value,
        telefone: document.getElementById("edit-telefone").value,
        nif: document.getElementById("edit-nif").value,
        passaporte: document.getElementById("edit-passaporte").value,
        estado: document.getElementById("edit-estado").value
    };

    await fetch(`${API}/clientes/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    // fechar modal
    const modalEl = document.getElementById("modalEditarCliente");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    carregar();
}

async function verHistorico(clienteId) {

    const res = await fetch(`${API}/clientes/${clienteId}/historico`);
    const historico = await res.json();

    const container = document.getElementById("historicoConteudo");

    if (!Array.isArray(historico) || historico.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                Sem reservas encontradas
            </div>
        `;
    } else {

        container.innerHTML = historico.map(r => {

            const v = r.viagem;

            return `
                <div class="card mb-2 p-3">

                    <div class="d-flex justify-content-between align-items-center">

                        <div>

                            <h6 class="mb-1">
                                ✈️ ${v?.codigo_voo || "Voo desconhecido"}
                            </h6>

                            <small class="text-muted">
                                ${v?.origem || "?"} → ${v?.destino || "?"}
                            </small><br>

                            <small class="text-muted">
                                ${v?.companhia || ""}
                            </small><br>

                            <small class="text-muted">
                                📅 ${v?.data || ""} ${v?.hora || ""}
                            </small>

                        </div>

                        <div class="text-end">

                            <span class="badge bg-${
                                r.status === 'confirmada' ? 'success' : 'secondary'
                            }">
                                ${r.status}
                            </span>

                        </div>

                    </div>

                </div>
            `;
        }).join("");
    }

    new bootstrap.Modal(
        document.getElementById("modalHistoricoCliente")
    ).show();
}

async function deletarCliente(id) {
    if (!confirm("Deletar cliente?")) return;

    await fetch(`${API}/clientes/${id}`, { method: "DELETE" });
    carregar();
}

function filtrarClientes() {
    const termo = document.getElementById("searchClientes").value.toLowerCase();

    const filtrados = clientes.filter(c =>
        (c.nome || "").toLowerCase().includes(termo) ||
        (c.email || "").toLowerCase().includes(termo)
    );

    renderClientesFiltrados(filtrados);
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

function renderViagensFiltradas(lista) {
    viagensLista.innerHTML = lista.map(v => `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3">

                <h5>${v.origem} → ${v.destino}</h5>

                <div class="text-muted">
                    ${v.codigo_voo} • ${v.companhia}
                </div>

                <div class="mt-2">
                    📅 ${v.data} ${v.hora}
                </div>

                <div class="mt-2 fw-bold text-primary">
                    € ${v.preco}
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

function filtrarViagens() {
    const termo = document.getElementById("searchViagens").value.toLowerCase();

    const filtradas = viagens.filter(v =>
        (v.codigo_voo || "").toLowerCase().includes(termo) ||
        (v.origem || "").toLowerCase().includes(termo) ||
        (v.destino || "").toLowerCase().includes(termo) ||
        (v.companhia || "").toLowerCase().includes(termo)
    );

    renderViagensFiltradas(filtradas);
}

// ==================== RESERVAS ====================
function renderReservas() {
    reservasLista.innerHTML = reservas.map(r => {

        const c = clientes.find(x => x.id === r.cliente_id);
        const v = viagens.find(x => x.id === r.viagem_id);

        return `
        <div class="col-md-4">
            <div class="card-modern p-3 mb-3 h-100">

                <!-- CLIENTE -->
                <div class="d-flex align-items-center gap-2 mb-2">
                    <i class="bi bi-person-circle text-primary"></i>
                    <strong>${c?.nome || "Cliente desconhecido"}</strong>
                </div>

                <div class="text-muted small mb-2">
                    ${c?.email || ""}
                </div>

                <hr class="my-2">

                <!-- VIAGEM -->
                <div class="mb-2">

                    <div class="d-flex align-items-center gap-2 mb-1">
                        <i class="bi bi-airplane"></i>
                        <strong>${v?.codigo_voo || "-"}</strong>
                    </div>

                    <div class="text-muted small">
                        ✈️ ${v?.origem || "?"} → ${v?.destino || "?"}
                    </div>

                    <div class="text-muted small">
                        📅 ${v?.data || "-"} às ${v?.hora || "-"}
                    </div>

                    <div class="text-muted small">
                        🏢 ${v?.companhia || ""}
                    </div>

                </div>

                <hr class="my-2">

                <!-- STATUS -->
                <div class="d-flex justify-content-between align-items-center">

                    <span class="badge bg-${
                        r.status === "cancelada"
                            ? "secondary"
                            : r.status === "confirmada"
                                ? "success"
                                : "primary"
                    }">
                        ${r.status}
                    </span>

                </div>

                <!-- AÇÕES -->
                <div class="mt-3">

                    ${r.status !== "cancelada"
                        ? `
                        <button class="btn btn-danger btn-sm w-100"
                            onclick="cancelarReserva(${r.id})">
                            <i class="bi bi-x-circle"></i> Cancelar reserva
                        </button>
                        `
                        : `
                        <div class="text-center text-muted small">
                            Reserva cancelada
                        </div>
                        `
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