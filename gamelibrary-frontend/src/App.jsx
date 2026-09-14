import { useState, useEffect } from "react";
import GameSearchInput from "./components/GameSearchInput";

const API = "http://localhost:8080/jogos";

const STATUS_OPCOES = [
  { valor: "NAO_INICIADO", label: "Não iniciado" },
  { valor: "EM_ANDAMENTO", label: "Em andamento" },
  { valor: "CONCLUIDO", label: "Concluído" },
  { valor: "ABANDONADO", label: "Abandonado" },
  { valor: "PLATINADO", label: "Platinado" },
];

const jogoVazio = {
  nome: "",
  plataforma: "",
  genero: "",
  status: "NAO_INICIADO",
  horasJogadas: "",
  notaPessoal: "",
  temHistoria: false,
  historiaConcluida: false,
  review: "",
  capaUrl: "",
  anoLancamento: "",
  rawgId: null
};

function formatarStatus(status) {
  const encontrado = STATUS_OPCOES.find((o) => o.valor === status);
  return encontrado ? encontrado.label : "Sem status";
}

export default function App() {
  const [jogos, setJogos] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(jogoVazio);
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarJogos();
  }, []);

  async function carregarJogos() {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setJogos(data);
    } catch (e) {
      console.error("Erro ao carregar jogos:", e);
    }
  }

  function abrirNovo() {
    setForm(jogoVazio);
    setEditandoId(null);
    setErro(null);
    setModal(true);
  }

  async function abrirEdicao(id) {
    try {
      const res = await fetch(`${API}/${id}`);
      const jogo = await res.json();
      setForm(jogo);
      setEditandoId(id);
      setErro(null);
      setModal(true);
    } catch (e) {
      console.error("Erro ao abrir edição:", e);
    }
  }

  function handleJogoSelecionado(dadosRawg) {
    setForm((f) => ({
      ...f,
      nome: dadosRawg.nome,
      capaUrl: dadosRawg.capaUrl,
      anoLancamento: dadosRawg.anoLancamento,
      rawgId: dadosRawg.rawgId,
      genero: dadosRawg.genero,
      plataforma: dadosRawg.plataforma
    }));
  }

  async function salvar() {
    setErro(null);
    const metodo = editandoId ? "PUT" : "POST";
    const url = editandoId ? `${API}/${editandoId}` : API;

    const payload = {
      ...form,
      horasJogadas: parseFloat(form.horasJogadas) || 0,
      notaPessoal: form.notaPessoal !== "" ? parseInt(form.notaPessoal, 10) : null,
      anoLancamento: form.anoLancamento ? parseInt(form.anoLancamento, 10) : null
    };

    const res = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const dados = await res.json();
      setErro(dados.erros ? Object.values(dados.erros).join(", ") : dados.erro || "Erro ao salvar");
      return;
    }

    setModal(false);
    carregarJogos();
  }

  async function excluir(id) {
    if (!confirm("Excluir este jogo?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    carregarJogos();
  }

  function campo(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#fff", padding: "32px", fontFamily: "sans-serif" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>🎮 Game Library</h1>
          <button
              onClick={abrirNovo}
              style={{
                backgroundColor: "#7c3aed",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                fontWeight: "600",
                cursor: "pointer"
              }}
          >
            + Adicionar Jogo
          </button>
        </div>

        {/* Grid de Jogos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          {jogos.map((jogo) => (
              <div
                  key={jogo.id}
                  style={{
                    backgroundColor: "#1a1a1a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #282828"
                  }}
              >
                {/* Capa RAWG ou Fallback */}
                {jogo.capaUrl ? (
                    <img
                        src={jogo.capaUrl}
                        alt={jogo.nome}
                        style={{ width: "100%", height: "140px", objectFit: "cover" }}
                    />
                ) : (
                    <div style={{ height: "140px", backgroundColor: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "36px" }}>
                      🎮
                    </div>
                )}

                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "bold" }}>{jogo.nome}</h3>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                    {jogo.plataforma} {jogo.genero && `• ${jogo.genero}`}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>⏱ {jogo.horasJogadas || 0}h</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>⭐ {jogo.notaPessoal ? `${jogo.notaPessoal}/10` : "-"}</p>

                  <span style={{
                    fontSize: "11px",
                    backgroundColor: "#333",
                    padding: "3px 8px",
                    borderRadius: "12px",
                    width: "fit-content",
                    marginTop: "4px"
                  }}>
                {formatarStatus(jogo.status)}
              </span>

                  <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                    <button
                        onClick={() => abrirEdicao(jogo.id)}
                        style={{
                          flex: 1,
                          fontSize: "12px",
                          backgroundColor: "#333",
                          color: "#fff",
                          border: "none",
                          padding: "6px 0",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                        onClick={() => excluir(jogo.id)}
                        style={{
                          backgroundColor: "#7f1d1d",
                          color: "#fff",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          cursor: "pointer"
                        }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
          ))}
        </div>

        {/* Modal */}
        {modal && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50
            }}>
              <div style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "16px",
                padding: "24px",
                width: "100%",
                maxWidth: "460px",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                border: "1px solid #333"
              }}>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "bold" }}>
                  {editandoId ? "Editar Jogo" : "Adicionar Jogo"}
                </h2>

                {erro && (
                    <div style={{ backgroundColor: "#450a0a", border: "1px solid #991b1b", color: "#fca5a5", fontSize: "12px", borderRadius: "6px", padding: "8px" }}>
                      {erro}
                    </div>
                )}

                {/* Campo RAWG apenas no cadastro novo */}
                {!editandoId && (
                    <div>
                      <label style={{ fontSize: "12px", color: "#aaa", marginBottom: "4px", display: "block" }}>
                        Pesquisar no catálogo RAWG:
                      </label>
                      <GameSearchInput onSelectJogo={handleJogoSelecionado} />
                    </div>
                )}

                {form.capaUrl && (
                    <div style={{ textAlign: "center" }}>
                      <img
                          src={form.capaUrl}
                          alt="Prévia da capa"
                          style={{ width: "100px", height: "130px", objectFit: "cover", borderRadius: "6px" }}
                      />
                    </div>
                )}

                <input
                    name="nome"
                    value={form.nome}
                    onChange={campo}
                    placeholder="Nome do jogo *"
                    style={{ backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                      name="plataforma"
                      value={form.plataforma}
                      onChange={campo}
                      placeholder="Plataforma"
                      style={{ flex: 1, backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                  />
                  <input
                      name="genero"
                      value={form.genero}
                      onChange={campo}
                      placeholder="Gênero"
                      style={{ flex: 1, backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                  />
                </div>

                <select
                    name="status"
                    value={form.status}
                    onChange={campo}
                    style={{ backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                >
                  {STATUS_OPCOES.map((o) => (
                      <option key={o.valor} value={o.valor}>{o.label}</option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: "10px" }}>
                  <input
                      name="horasJogadas"
                      value={form.horasJogadas}
                      onChange={campo}
                      type="number"
                      step="0.5"
                      placeholder="Horas jogadas"
                      style={{ flex: 1, backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                  />
                  <input
                      name="notaPessoal"
                      value={form.notaPessoal}
                      onChange={campo}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="Nota (0-10)"
                      style={{ flex: 1, backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        name="temHistoria"
                        checked={form.temHistoria}
                        onChange={campo}
                    />
                    Tem história
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                        type="checkbox"
                        name="historiaConcluida"
                        checked={form.historiaConcluida}
                        onChange={campo}
                    />
                    História concluída
                  </label>
                </div>

                <textarea
                    name="review"
                    value={form.review}
                    onChange={campo}
                    placeholder="Review pessoal (opcional)"
                    rows={3}
                    style={{ backgroundColor: "#2a2a2a", border: "1px solid #444", borderRadius: "8px", padding: "10px", color: "#fff", resize: "none" }}
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                  <button
                      onClick={salvar}
                      style={{ flex: 1, backgroundColor: "#7c3aed", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Salvar
                  </button>
                  <button
                      onClick={() => setModal(false)}
                      style={{ flex: 1, backgroundColor: "#333", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", cursor: "pointer" }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}