import { useState, useEffect } from "react";
import { useJogos } from "./hooks/useJogos";
import { supabase } from "./services/supabase";
import { AuthModal } from "./components/AuthModal";
import Header from "./components/Header";
import GameGrid from "./components/GameGrid";
import GameFormModal from "./components/GameFormModal";

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
  rawgId: null,
};

export default function App() {
  // 1. Estados de Autenticação Supabase (DECLARADOS PRIMEIRO)
  const [session, setSession] = useState(null);
  const [carregandoAuth, setCarregandoAuth] = useState(true);
  const [modalAuth, setModalAuth] = useState(false);

  // 2. Hook de Jogos (AGORA SESSION JÁ EXISTE QUANDO ELE É CHAMADO)
  const { jogos, erro, setErro, salvarJogo, excluirJogo, sincronizarSteam } = useJogos(session?.user?.id);

  // 3. Estados dos Jogos e Modais
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(jogoVazio);
  const [editandoId, setEditandoId] = useState(null);

  // Modais utilitários
  const [modalSteam, setModalSteam] = useState(false);
  const [steamIdInput, setSteamIdInput] = useState("");
  const [steamLoading, setSteamLoading] = useState(false);
  const [steamErro, setSteamErro] = useState(null);
  const [jogoParaExcluir, setJogoParaExcluir] = useState(null);

  // Escuta o status do login no Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCarregandoAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCarregandoAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  function abrirNovo() {
    setForm(jogoVazio);
    setEditandoId(null);
    setErro(null);
    setModal(true);
  }

  function abrirEdicao(jogo) {
    setForm(jogo);
    setEditandoId(jogo.id);
    setErro(null);
    setModal(true);
  }

  function handleFormChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSelectRawg(dados) {
    setForm((prev) => ({
      ...prev,
      nome: dados.nome,
      capaUrl: dados.capaUrl,
      anoLancamento: dados.anoLancamento,
      rawgId: dados.rawgId,
      genero: dados.genero,
      plataforma: dados.plataforma,
    }));
  }

  async function handleSalvar() {
    const ok = await salvarJogo(form, editandoId);
    if (ok) setModal(false);
  }

  async function handleConfirmarExclusao() {
    if (!jogoParaExcluir) return;
    await excluirJogo(jogoParaExcluir.id);
    setJogoParaExcluir(null);
  }

  async function handleSincronizarSteam() {
    if (!steamIdInput.trim()) {
      setSteamErro("Informe o SteamID64.");
      return;
    }
    setSteamLoading(true);
    setSteamErro(null);
    try {
      await sincronizarSteam(steamIdInput.trim());
      setModalSteam(false);
      setSteamIdInput("");
    } catch {
      setSteamErro("Erro ao importar da Steam. Verifique o ID e a privacidade do perfil.");
    } finally {
      setSteamLoading(false);
    }
  }

  // 1. Loading inicial enquanto checa se há sessão ativa salva
  if (carregandoAuth) {
    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center text-amber-500 text-xs tracking-widest font-mono">
          CARREGANDO...
        </div>
    );
  }

  // 2. Tela de bloqueio caso não esteja logado
  if (!session) {
    return (
        <div className="min-h-screen bg-[#080808] text-neutral-200 flex flex-col items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full text-center space-y-6">
            <div>
              <h1 className="text-2xl font-black tracking-widest text-amber-500 uppercase">
                Game Library
              </h1>
              <p className="text-xs text-neutral-500 mt-2">
                Sua coleção pessoal de jogos, sincronizada na nuvem.
              </p>
            </div>

            <button
                onClick={() => setModalAuth(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-3 rounded-lg text-xs tracking-wide uppercase transition-all cursor-pointer shadow-lg shadow-amber-500/10"
            >
              Acessar com minha conta
            </button>
          </div>

          <AuthModal isOpen={modalAuth} onClose={() => setModalAuth(false)} />
        </div>
    );
  }

  // 3. Aplicação Liberada (Usuário Logado)
  return (
      <div className="min-h-screen bg-[#080808] text-neutral-200 flex flex-col font-sans">
        {/* Barra de usuário no topo */}
        <div className="bg-[#0e0e0e] border-b border-neutral-900 px-6 py-2 flex items-center justify-between text-[11px] text-neutral-400">
          <div>
            Conectado como: <span className="text-amber-500 font-medium">{session.user.email}</span>
          </div>
          <button
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
          >
            Sair da conta
          </button>
        </div>

        <Header
            totalJogos={jogos.length}
            onAbrirNovo={abrirNovo}
            onAbrirSteam={() => {
              setSteamErro(null);
              setModalSteam(true);
            }}
        />

        <GameGrid
            jogos={jogos}
            onEditar={abrirEdicao}
            onExcluir={(jogo) => setJogoParaExcluir(jogo)}
        />

        <GameFormModal
            aberto={modal}
            editandoId={editandoId}
            form={form}
            erro={erro}
            onClose={() => setModal(false)}
            onChange={handleFormChange}
            onSelectRawg={handleSelectRawg}
            onSalvar={handleSalvar}
        />

        {/* Modal Sincronização Steam */}
        {modalSteam && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-[#111111] rounded-lg p-6 w-full max-w-sm border border-neutral-800 flex flex-col gap-3">
                <h2 className="text-[15px] font-bold text-neutral-100">Sincronizar Biblioteca Steam</h2>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Informe o <strong>SteamID64</strong> (17 dígitos). O perfil e os jogos precisam estar públicos.
                </p>
                {steamErro && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded p-2">
                      {steamErro}
                    </div>
                )}
                <input
                    type="text"
                    placeholder="Ex: 76561198000000000"
                    value={steamIdInput}
                    onChange={(e) => setSteamIdInput(e.target.value)}
                    disabled={steamLoading}
                    className="bg-[#0a0a0a] border border-neutral-800 rounded px-3 py-2 text-white text-xs outline-none focus:border-amber-500"
                />
                <div className="flex gap-2 mt-1">
                  <button
                      onClick={handleSincronizarSteam}
                      disabled={steamLoading}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2 rounded text-xs cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {steamLoading ? "Sincronizando..." : "Sincronizar"}
                  </button>
                  <button
                      onClick={() => setModalSteam(false)}
                      disabled={steamLoading}
                      className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-neutral-800 text-neutral-400 py-2 rounded text-xs cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal Confirmação Exclusão */}
        {jogoParaExcluir && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-[#111111] rounded-lg p-6 w-full max-w-sm border border-red-500/30 flex flex-col gap-3">
                <h3 className="text-[15px] font-bold text-red-400">Remover Jogo?</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Deseja excluir <strong>{jogoParaExcluir.nome}</strong> da sua coleção? Essa ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                      onClick={handleConfirmarExclusao}
                      className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2 rounded text-xs cursor-pointer transition-colors"
                  >
                    Sim, excluir
                  </button>
                  <button
                      onClick={() => setJogoParaExcluir(null)}
                      className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-neutral-800 text-neutral-400 py-2 rounded text-xs cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Modal de Autenticação */}
        <AuthModal isOpen={modalAuth} onClose={() => setModalAuth(false)} />
      </div>
  );


}