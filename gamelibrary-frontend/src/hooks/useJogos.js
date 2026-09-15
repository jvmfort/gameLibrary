import { useState, useEffect, useCallback } from "react";

export function useJogos(userId) {
    const [jogos, setJogos] = useState([]);
    const [erro, setErro] = useState(null);

    const API = import.meta.env.VITE_API_URL || "http://localhost:8080/jogos";


    const carregarJogos = useCallback(async () => {
        // Se não tem usuário logado, zera a lista na hora
        if (!userId) {
            setJogos([]);
            return;
        }

        try {
            // Passa o userId tanto na query string (?userId=...) quanto no header
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

            // Injeta o userId diretamente dentro do objeto antes de enviar
            const jogoComUsuario = {
                ...jogo,
                userId: userId,
            };

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "X-User-Id": userId,
                },
                body: JSON.stringify(jogoComUsuario),
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

        // Recarrega os jogos imediatamente com o userId atual
        await carregarJogos();
        return true;
    }

        if (!res.ok) {
            const msg = await res.text();
            throw new Error(msg || "Erro ao sincronizar com a Steam");
        }

        await carregarJogos();
        return true;
    }

    return { jogos, erro, setErro, salvarJogo, excluirJogo, sincronizarSteam, recarregar: carregarJogos };
}