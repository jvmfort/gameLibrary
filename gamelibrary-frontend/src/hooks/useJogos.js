import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/jogos";

export function useJogos() {
    const [jogos, setJogos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        carregarJogos();
    }, []);

    async function carregarJogos() {
        setLoading(true);
        try {
            const res = await fetch(API);
            const data = await res.json();
            setJogos(data);
        } catch (e) {
            console.error("Erro ao carregar jogos:", e);
        } finally {
            setLoading(false);
        }
    }

    async function salvarJogo(formData, editandoId) {
        setErro(null);
        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId ? `${API}/${editandoId}` : API;

        const payload = {
            ...formData,
            horasJogadas: parseFloat(formData.horasJogadas) || 0,
            notaPessoal: formData.notaPessoal !== "" ? parseInt(formData.notaPessoal, 10) : null,
            anoLancamento: formData.anoLancamento ? parseInt(formData.anoLancamento, 10) : null,
        };

        const res = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const dados = await res.json();
            const msg = dados.erros ? Object.values(dados.erros).join(", ") : dados.erro || "Erro ao salvar";
            setErro(msg);
            return false;
        }

        await carregarJogos();
        return true;
    }

    async function excluirJogo(id) {
        try {
            await fetch(`${API}/${id}`, { method: "DELETE" });
            await carregarJogos();
        } catch (e) {
            console.error("Erro ao excluir jogo:", e);
        }
    }

    async function sincronizarSteam(steamId) {
        const res = await fetch(`${API}/importar-steam/${steamId}`, { method: "POST" });
        if (!res.ok) throw new Error("Erro na sincronização");
        await carregarJogos();
    }

    return {
        jogos,
        loading,
        erro,
        setErro,
        carregarJogos,
        salvarJogo,
        excluirJogo,
        sincronizarSteam,
    };
}