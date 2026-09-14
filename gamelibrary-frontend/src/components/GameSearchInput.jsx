import { useState, useEffect } from 'react';

const RAWG_KEY = import.meta.env.VITE_RAWG_API_KEY;

export default function GameSearchInput({ onSelectJogo }) {
    const [query, setQuery] = useState('');
    const [resultados, setResultados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    useEffect(() => {
        if (query.trim().length < 3) {
            setResultados([]);
            return;
        }

        const timer = setTimeout(async () => {
            setCarregando(true);
            try {
                const res = await fetch(
                    `https://api.rawg.io/api/games?key=${RAWG_KEY}&search=${encodeURIComponent(query)}&page_size=5`
                );
                const data = await res.json();
                setResultados(data.results || []);
            } catch (err) {
                console.error("Erro ao buscar jogos na RAWG:", err);
            } finally {
                setCarregando(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const handleSelect = (game) => {
        // Mapeamento direto para os atributos de Jogo.java
        const jogoMapeado = {
            nome: game.name,
            capaUrl: game.background_image || '',
            anoLancamento: game.released ? parseInt(game.released.split('-')[0], 10) : null,
            rawgId: game.id,
            genero: game.genres?.map((g) => g.name).slice(0, 3).join(', ') || '',
            plataforma: game.platforms?.map((p) => p.platform.name).slice(0, 4).join(', ') || ''
        };

        onSelectJogo(jogoMapeado);
        setQuery(game.name);
        setResultados([]);
    };

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                placeholder="Digite o nome do jogo (ex: Detroit: Become Human)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box'
                }}
            />

            {carregando && <span style={{ fontSize: '12px', color: '#666' }}>Buscando sugestões...</span>}

            {resultados.length > 0 && (
                <ul style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#1f2937',
                    color: '#fff',
                    listStyle: 'none',
                    margin: '4px 0 0 0',
                    padding: '0',
                    borderRadius: '6px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                    zIndex: 50,
                    maxHeight: '260px',
                    overflowY: 'auto'
                }}>
                    {resultados.map((game) => (
                        <li
                            key={game.id}
                            onClick={() => handleSelect(game)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderBottom: '1px solid #374151'
                            }}
                        >
                            {game.background_image ? (
                                <img
                                    src={game.background_image}
                                    alt={game.name}
                                    style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                                />
                            ) : (
                                <div style={{ width: '45px', height: '45px', background: '#374151', borderRadius: '4px' }} />
                            )}
                            <div>
                                <strong style={{ fontSize: '14px', display: 'block' }}>{game.name}</strong>
                                <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                  {game.released ? game.released.split('-')[0] : 'Ano desconhecido'}
                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}