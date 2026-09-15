import { useState, useEffect, useCallback } from "react";

export function useJogos(userId) {
    const [jogos, setJogos] = useState([]);
    const [erro, setErro] = useState(null);

    const API = import.meta.env.VITE_API_URL || "https://gamelibrary-wwak.onrender.com/jogos";

    const carregarJogos = useCallback(async () => {
        if (!userId) {
            setJogos([]);
            return;
        }

        try {
            const res = await fetch(`${API}?userId=${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId,
                },
            });

            if (!res.ok) throw new Error("Erro ao carregar jogos");
            const dados = await res.json();
            setJogos(dados);
        } catch (err) {
            setErro(err.message);
        }
    }, [API, userId]);

    useEffect(() => {
        carregarJogos();
    }, [carregarJogos]);

    async function salvarJogo(jogo, editandoId) {
        try {
            const url = editandoId ? `${API}/${editandoId}` : API;
            const method = editandoId ? "PUT" : "POST";

            const payload = {
                ...jogo,
                userId: userId,
                horasJogadas: jogo.horasJogadas ? parseFloat(jogo.horasJogadas) : 0,
                notaPessoal: jogo.notaPessoal ? parseInt(jogo.notaPessoal, 10) : null,
                anoLancamento: jogo.anoLancamento ? parseInt(jogo.anoLancamento, 10) : null,
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId || "",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erro ao salvar jogo");
            await carregarJogos();
            return true;
        } catch (err) {
            setErro(err.message);
            return false;
        }
    }

    async function excluirJogo(id) {
        try {
            const res = await fetch(`${API}/${id}`, {
                method: "DELETE",
                headers: {
                    "X-User-Id": userId || "",
                },
            });

            if (!res.ok) throw new Error("Erro ao excluir jogo");
            await carregarJogos();
            return true;
        } catch (err) {
            setErro(err.message);
            return false;
        }
    }

    async function sincronizarSteam(steamId) {
        try {
            const url = `${API}/steam?steamId=${steamId}&userId=${userId}`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId || "",
                },
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Erro ao sincronizar com a Steam");
            }

            await carregarJogos();
            return true;
        } catch (err) {
            setErro(err.message);
            throw err;
        }
    }

    return {
        jogos,
        erro,
        setErro,
        salvarJogo,
        excluirJogo,
        sincronizarSteam,
        recarregar: carregarJogos,
    };
}