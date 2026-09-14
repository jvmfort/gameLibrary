import { useState } from 'react';
import GameSearchInput from './GameSearchInput';

export default function NewGameForm({ onJogoCadastrado }) {
    const [formData, setFormData] = useState({
        nome: '',
        plataforma: '',
        genero: '',
        status: 'NAO_INICIADO',
        horasJogadas: 0,
        temHistoria: false,
        historiaConcluida: false,
        notaPessoal: '',
        review: '',
        capaUrl: '',
        anoLancamento: '',
        rawgId: null
    });

    const [mensagem, setMensagem] = useState('');

    // Ao selecionar um jogo na busca, preenche os dados do RAWG
    const handleJogoSelecionado = (dadosRawg) => {
        setFormData((prev) => ({
            ...prev,
            nome: dadosRawg.nome,
            capaUrl: dadosRawg.capaUrl,
            anoLancamento: dadosRawg.anoLancamento,
            rawgId: dadosRawg.rawgId,
            genero: dadosRawg.genero,
            plataforma: dadosRawg.plataforma
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');

        const payload = {
            ...formData,
            horasJogadas: parseFloat(formData.horasJogadas) || 0,
            notaPessoal: formData.notaPessoal !== '' ? parseInt(formData.notaPessoal, 10) : null,
            anoLancamento: formData.anoLancamento ? parseInt(formData.anoLancamento, 10) : null
        };

        try {
            const response = await fetch('http://localhost:8080/jogos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Falha ao salvar o jogo no servidor');
            }

            const novoJogo = await response.json();
            setMensagem('Jogo salvo com sucesso!');

            // Limpa formulário
            setFormData({
                nome: '',
                plataforma: '',
                genero: '',
                status: 'NAO_INICIADO',
                horasJogadas: 0,
                temHistoria: false,
                historiaConcluida: false,
                notaPessoal: '',
                review: '',
                capaUrl: '',
                anoLancamento: '',
                rawgId: null
            });

            if (onJogoCadastrado) onJogoCadastrado(novoJogo);
        } catch (err) {
            console.error(err);
            setMensagem('Erro ao salvar o jogo.');
        }
    };

    return (
        <div style={{ maxWidth: '520px', margin: '0 auto', padding: '16px' }}>
            <h2>Adicionar Jogo à Biblioteca</h2>

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>
                    Pesquisar no catálogo:
                </label>
                <GameSearchInput onSelectJogo={handleJogoSelecionado} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {formData.capaUrl && (
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={formData.capaUrl}
                            alt="Capa"
                            style={{ width: '140px', borderRadius: '8px', objectFit: 'cover' }}
                        />
                    </div>
                )}

                <div>
                    <label>Nome do Jogo *</label>
                    <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Plataforma</label>
                        <input
                            type="text"
                            name="plataforma"
                            value={formData.plataforma}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Gênero</label>
                        <input
                            type="text"
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1 }}>
                        <label>Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        >
                            <option value="NAO_INICIADO">Não Iniciado</option>
                            <option value="EM_ANDAMENTO">Em Andamento</option>
                            <option value="CONCLUIDO">Concluído</option>
                            <option value="PLATINADO">Platinado</option>
                            <option value="ABANDONADO">Abandonado</option>
                        </select>
                    </div>

                    <div style={{ flex: 1 }}>
                        <label>Horas Jogadas</label>
                        <input
                            type="number"
                            step="0.5"
                            min="0"
                            name="horasJogadas"
                            value={formData.horasJogadas}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ width: '90px' }}>
                        <label>Nota (0-10)</label>
                        <input
                            type="number"
                            min="0"
                            max="10"
                            name="notaPessoal"
                            value={formData.notaPessoal}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '20px', margin: '4px 0' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                        <input
                            type="checkbox"
                            name="temHistoria"
                            checked={formData.temHistoria}
                            onChange={handleChange}
                        />
                        Tem modo história?
                    </label>

                    {formData.temHistoria && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="historiaConcluida"
                                checked={formData.historiaConcluida}
                                onChange={handleChange}
                            />
                            História concluída?
                        </label>
                    )}
                </div>

                <div>
                    <label>Review / Observações Pessoais</label>
                    <textarea
                        name="review"
                        rows="3"
                        value={formData.review}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>

                <button
                    type="submit"
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Salvar Jogo
                </button>

                {mensagem && (
                    <p style={{ marginTop: '8px', textAlign: 'center', fontWeight: '500' }}>
                        {mensagem}
                    </p>
                )}
            </form>
        </div>
    );
}