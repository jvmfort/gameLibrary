import { useState, useEffect, useCallback } from "react";

export function useJogos(userId) {
    const [jogos, setJogos] = useState([]);
    const [erro, setErro] = useState(null);

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080/jogos";

    const carregarJogos = useCallback(async () => {
        if (!userId) {
            setJogos([]);
            return;
        }
        try {
            const res = await fetch(API, {
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId,
                },
            });
            if (!res.ok) throw new Error("Erro ao buscar jogos");
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

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId,
                },
                body: JSON.stringify(jogo),
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
                    "X-User-Id": userId,
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
        // se tiver endpoint de steam, envie o header 'X-User-Id' também
    }

    return { jogos, erro, setErro, salvarJogo, excluirJogo, sincronizarSteam, recarregar: carregarJogos };
}