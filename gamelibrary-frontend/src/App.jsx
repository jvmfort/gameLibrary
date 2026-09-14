import { useState, useEffect } from "react";
import GameSearchInput from "./components/GameSearchInput";

const API = "http://localhost:8080/jogos";

// Ícones Vetoriais Minimalistas (SVG)
function LogoIcon() {
  return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="4" />
        <line x1="6" y1="12" x2="10" y2="12" />
        <line x1="8" y1="10" x2="8" y2="14" />
        <circle cx="15.5" cy="13" r="1" fill="#f59e0b" />
        <circle cx="18" cy="11" r="1" fill="#f59e0b" />
      </svg>
  );
}

function DiscIcon() {
  return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#444" />
      </svg>
  );
}

function EditIcon() {
  return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
  );
}

function TrashIcon() {
  return (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
  );
}

const STATUS_CONFIG = {
  NAO_INICIADO: {
    valor: "NAO_INICIADO",
    label: "Backlog",
    cor: "#a3a3a3",
    bgBadge: "rgba(163, 163, 163, 0.1)",
    borda: "rgba(163, 163, 163, 0.25)",
    glowDot: "0 0 6px #a3a3a3",
    classeBadge: "",
    classeDot: ""
  },
  EM_ANDAMENTO: {
    valor: "EM_ANDAMENTO",
    label: "Jogando",
    cor: "#38bdf8",
    bgBadge: "rgba(56, 189, 248, 0.12)",
    borda: "rgba(56, 189, 248, 0.35)",
    glowDot: "0 0 8px #38bdf8",
    classeBadge: "",
    classeDot: ""
  },
  CONCLUIDO: {
    valor: "CONCLUIDO",
    label: "Concluído",
    cor: "#f59e0b",
    bgBadge: "rgba(245, 158, 11, 0.15)",
    borda: "rgba(245, 158, 11, 0.4)",
    glowDot: "0 0 10px #f59e0b",
    classeBadge: "",
    classeDot: ""
  },
  PLATINADO: {
    valor: "PLATINADO",
    label: "Platinado",
    cor: "#f8fafc",
    bgBadge: "rgba(255, 255, 255, 0.15)",
    borda: "rgba(255, 255, 255, 0.55)",
    glowDot: "",
    classeBadge: "badge-platinado",
    classeDot: "dot-platinado"
  },
  ABANDONADO: {
    valor: "ABANDONADO",
    label: "Dropado",
    cor: "#ef4444",
    bgBadge: "rgba(239, 68, 68, 0.12)",
    borda: "rgba(239, 68, 68, 0.3)",
    glowDot: "0 0 8px #ef4444",
    classeBadge: "",
    classeDot: ""
  }
};

const STATUS_OPCOES = Object.values(STATUS_CONFIG);

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

export default function App() {
  const [jogos, setJogos]                     = useState([]);
  const [modal, setModal]                     = useState(false);
  const [form, setForm]                       = useState(jogoVazio);
  const [editandoId, setEditandoId]           = useState(null);
  const [erro, setErro]                       = useState(null);

  // Estados dos novos modais customizados
  const [modalSteam, setModalSteam]           = useState(false);
  const [steamInputId, setSteamInputId]       = useState("");
  const [steamLoading, setSteamLoading]       = useState(false);
  const [steamErro, setSteamErro]             = useState(null);

  const [jogoParaExcluir, setJogoParaExcluir] = useState(null);

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

  // Confirmação de exclusão customizada
  async function confirmarExclusao() {
    if (!jogoParaExcluir) return;
    try {
      await fetch(`${API}/${jogoParaExcluir.id}`, { method: "DELETE" });
      setJogoParaExcluir(null);
      carregarJogos();
    } catch (e) {
      console.error("Erro ao excluir:", e);
    }
  }

  // Sincronização Steam via modal customizado
  async function executarSincronizacaoSteam() {
    if (!steamInputId.trim()) {
      setSteamErro("Informe o seu SteamID64.");
      return;
    }

    setSteamLoading(true);
    setSteamErro(null);

    try {
      const res = await fetch(`http://localhost:8080/jogos/importar-steam/${steamInputId.trim()}`, {
        method: "POST"
      });

      if (!res.ok) {
        setSteamErro("Erro ao importar. Verifique se o ID está correto e se o perfil/jogos estão públicos na Steam.");
        setSteamLoading(false);
        return;
      }

      setModalSteam(false);
      setSteamInputId("");
      setSteamLoading(false);
      carregarJogos();
    } catch (err) {
      console.error(err);
      setSteamErro("Falha na conexão com o servidor.");
      setSteamLoading(false);
    }
  }

  function campo(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#080808",
        color: "#e5e5e5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Header Fixo Fluido */}
        <header style={{
          height: "64px",
          backgroundColor: "#0d0d0d",
          borderBottom: "1px solid #1a1a1a",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <LogoIcon />
            <span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "1px", color: "#f5f5f5" }}>
            GAME LIBRARY
          </span>
            <span style={{
              fontSize: "11px",
              color: "#666",
              backgroundColor: "#141414",
              border: "1px solid #222",
              padding: "2px 8px",
              borderRadius: "12px",
              marginLeft: "8px"
            }}>
            {jogos.length} {jogos.length === 1 ? "título" : "títulos"}
          </span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
                onClick={() => {
                  setSteamErro(null);
                  setModalSteam(true);
                }}
                style={{
                  backgroundColor: "#171a21",
                  border: "1px solid #2a475e",
                  color: "#c7d5e0",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontWeight: "600",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
            >
              Sincronizar Steam
            </button>

            <button
                onClick={abrirNovo}
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#080808",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: "none",
                  fontWeight: "700",
                  fontSize: "12px",
                  cursor: "pointer",
                  letterSpacing: "0.2px"
                }}
            >
              + Adicionar Jogo
            </button>
          </div>
        </header>

        {/* Grid de Pôsteres */}
        <main style={{ flex: 1, padding: "32px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
            gap: "20px"
          }}>
            {jogos.map((jogo) => {
              const statusConfig = STATUS_CONFIG[jogo.status] || STATUS_CONFIG.NAO_INICIADO;

              return (
                  <div
                      key={jogo.id}
                      className="game-card"
                      style={{
                        backgroundColor: "#111111",
                        borderRadius: "8px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #1c1c1c"
                      }}
                  >
                    <div style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "3 / 4",
                      overflow: "hidden",
                      backgroundColor: "#0a0a0a"
                    }}>
                      {jogo.capaUrl ? (
                          <img
                              src={jogo.capaUrl}
                              alt={jogo.nome}
                              className="card-poster-img"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                      ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <DiscIcon />
                          </div>
                      )}

                      <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to top, rgba(17, 17, 17, 0.95) 0%, rgba(17, 17, 17, 0.2) 35%, transparent 70%)"
                      }} />

                      <div
                          className={statusConfig.classeBadge}
                          style={{
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            backgroundColor: statusConfig.bgBadge,
                            border: `1px solid ${statusConfig.borda}`,
                            backdropFilter: "blur(6px)"
                          }}
                      >
                    <span
                        className={statusConfig.classeDot}
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          backgroundColor: statusConfig.cor,
                          boxShadow: statusConfig.glowDot,
                          display: "inline-block"
                        }}
                    />
                        <span style={{ fontSize: "10px", fontWeight: "600", color: statusConfig.cor, letterSpacing: "0.2px" }}>
                      {statusConfig.label}
                    </span>
                      </div>

                      {jogo.notaPessoal && (
                          <div style={{
                            position: "absolute",
                            bottom: "8px",
                            left: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            backgroundColor: "rgba(10, 10, 10, 0.85)",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                            padding: "2px 6px",
                            borderRadius: "4px"
                          }}>
                            <span style={{ color: "#f59e0b", fontSize: "10px" }}>★</span>
                            <span style={{ color: "#f5f5f5", fontSize: "11px", fontWeight: "700" }}>
                        {jogo.notaPessoal}
                      </span>
                          </div>
                      )}
                    </div>

                    <div style={{
                      padding: "10px 12px",
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "space-between",
                      gap: "4px"
                    }}>
                      <div>
                        <h3
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: "600",
                              color: "#f0f0f0",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis"
                            }}
                            title={jogo.nome}
                        >
                          {jogo.nome}
                        </h3>
                        <p style={{
                          margin: "2px 0 0 0",
                          fontSize: "11px",
                          color: "#6b6b6b",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {jogo.plataforma || "Sem plataforma"}
                        </p>
                      </div>

                      <div style={{
                        paddingTop: "8px",
                        borderTop: "1px solid #1a1a1a",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}>
                    <span style={{ fontSize: "11px", color: "#8a8a8a" }}>
                      {jogo.horasJogadas || 0}h
                    </span>

                        <div style={{ display: "flex", gap: "4px" }}>
                          <button
                              onClick={() => abrirEdicao(jogo.id)}
                              title="Editar"
                              style={{
                                backgroundColor: "#191919",
                                border: "1px solid #262626",
                                color: "#b0b0b0",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                          >
                            <EditIcon />
                          </button>
                          <button
                              onClick={() => setJogoParaExcluir(jogo)}
                              title="Excluir"
                              style={{
                                backgroundColor: "rgba(239, 68, 68, 0.08)",
                                border: "1px solid rgba(239, 68, 68, 0.2)",
                                color: "#ef4444",
                                padding: "4px 6px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center"
                              }}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })}
          </div>
        </main>

        {/* MODAL 1: Sincronização Steam */}
        {modalSteam && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              backdropFilter: "blur(4px)"
            }}>
              <div style={{
                backgroundColor: "#111111",
                borderRadius: "8px",
                padding: "24px",
                width: "100%",
                maxWidth: "400px",
                border: "1px solid #222",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f5f5f5" }}>
                  Sincronizar Biblioteca Steam
                </h2>

                <p style={{ margin: 0, fontSize: "12px", color: "#8a8a8a", lineHeight: "1.5" }}>
                  Digite o seu <strong>SteamID64</strong> (código numérico de 17 dígitos). Seu perfil e lista de jogos precisam estar configurados como públicos.
                </p>

                {steamErro && (
                    <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "12px", borderRadius: "4px", padding: "8px" }}>
                      {steamErro}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Ex: 76561198000000000"
                    value={steamInputId}
                    onChange={(e) => setSteamInputId(e.target.value)}
                    disabled={steamLoading}
                    style={{
                      backgroundColor: "#0a0a0a",
                      border: "1px solid #222",
                      borderRadius: "4px",
                      padding: "9px 12px",
                      color: "#fff",
                      fontSize: "13px"
                    }}
                />

                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                      onClick={executarSincronizacaoSteam}
                      disabled={steamLoading}
                      style={{
                        flex: 1,
                        backgroundColor: "#f59e0b",
                        color: "#080808",
                        border: "none",
                        padding: "9px",
                        borderRadius: "4px",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: steamLoading ? "not-allowed" : "pointer",
                        opacity: steamLoading ? 0.7 : 1
                      }}
                  >
                    {steamLoading ? "Sincronizando..." : "Sincronizar"}
                  </button>
                  <button
                      onClick={() => setModalSteam(false)}
                      disabled={steamLoading}
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        color: "#8a8a8a",
                        padding: "9px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL 2: Confirmação de Exclusão */}
        {jogoParaExcluir && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              backdropFilter: "blur(4px)"
            }}>
              <div style={{
                backgroundColor: "#111111",
                borderRadius: "8px",
                padding: "24px",
                width: "100%",
                maxWidth: "380px",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f87171" }}>
                  Remover Jogo?
                </h3>
                <p style={{ margin: 0, fontSize: "12px", color: "#a3a3a3", lineHeight: "1.5" }}>
                  Tem certeza que deseja excluir <strong>{jogoParaExcluir.nome}</strong> da sua coleção? Essa ação não pode ser desfeita.
                </p>

                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                      onClick={confirmarExclusao}
                      style={{
                        flex: 1,
                        backgroundColor: "#dc2626",
                        color: "#fff",
                        border: "none",
                        padding: "8px",
                        borderRadius: "4px",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                  >
                    Sim, excluir
                  </button>
                  <button
                      onClick={() => setJogoParaExcluir(null)}
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        color: "#8a8a8a",
                        padding: "8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* MODAL 3: Cadastro / Edição de Jogo */}
        {modal && (
            <div style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 50,
              backdropFilter: "blur(4px)"
            }}>
              <div style={{
                backgroundColor: "#111111",
                borderRadius: "8px",
                padding: "24px",
                width: "100%",
                maxWidth: "440px",
                maxHeight: "90vh",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                border: "1px solid #222"
              }}>
                <h2 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#f5f5f5" }}>
                  {editandoId ? "Editar Jogo" : "Adicionar à Coleção"}
                </h2>

                {erro && (
                    <div style={{ backgroundColor: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#fca5a5", fontSize: "12px", borderRadius: "4px", padding: "8px" }}>
                      {erro}
                    </div>
                )}

                {!editandoId && (
                    <div>
                      <label style={{ fontSize: "11px", color: "#8a8a8a", marginBottom: "4px", display: "block" }}>
                        Catálogo RAWG
                      </label>
                      <GameSearchInput onSelectJogo={handleJogoSelecionado} />
                    </div>
                )}

                {form.capaUrl && (
                    <div style={{ textAlign: "center" }}>
                      <img
                          src={form.capaUrl}
                          alt="Prévia"
                          style={{ width: "90px", aspectRatio: "3 / 4", objectFit: "cover", borderRadius: "4px", border: "1px solid #222" }}
                      />
                    </div>
                )}

                <input
                    name="nome"
                    value={form.nome}
                    onChange={campo}
                    placeholder="Título *"
                    style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                />

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                      name="plataforma"
                      value={form.plataforma}
                      onChange={campo}
                      placeholder="Plataforma"
                      style={{ flex: 1, backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                  />
                  <input
                      name="genero"
                      value={form.genero}
                      onChange={campo}
                      placeholder="Gênero"
                      style={{ flex: 1, backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                  />
                </div>

                <select
                    name="status"
                    value={form.status}
                    onChange={campo}
                    style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                >
                  {STATUS_OPCOES.map((o) => (
                      <option key={o.valor} value={o.valor}>{o.label}</option>
                  ))}
                </select>

                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                      name="horasJogadas"
                      value={form.horasJogadas}
                      onChange={campo}
                      type="number"
                      step="0.5"
                      placeholder="Horas jogadas"
                      style={{ flex: 1, backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                  />
                  <input
                      name="notaPessoal"
                      value={form.notaPessoal}
                      onChange={campo}
                      type="number"
                      min="0"
                      max="10"
                      placeholder="Nota (0-10)"
                      style={{ flex: 1, backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#b0b0b0" }}>
                    <input
                        type="checkbox"
                        name="temHistoria"
                        checked={form.temHistoria}
                        onChange={campo}
                    />
                    Modo História
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#b0b0b0" }}>
                    <input
                        type="checkbox"
                        name="historiaConcluida"
                        checked={form.historiaConcluida}
                        onChange={campo}
                    />
                    História Concluída
                  </label>
                </div>

                <textarea
                    name="review"
                    value={form.review}
                    onChange={campo}
                    placeholder="Anotações pessoais..."
                    rows={3}
                    style={{ backgroundColor: "#0a0a0a", border: "1px solid #222", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "12px", resize: "none" }}
                />

                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                  <button
                      onClick={salvar}
                      style={{
                        flex: 1,
                        backgroundColor: "#f59e0b",
                        color: "#080808",
                        border: "none",
                        padding: "8px",
                        borderRadius: "4px",
                        fontWeight: "700",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
                  >
                    Salvar
                  </button>
                  <button
                      onClick={() => setModal(false)}
                      style={{
                        flex: 1,
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #2a2a2a",
                        color: "#8a8a8a",
                        padding: "8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}
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