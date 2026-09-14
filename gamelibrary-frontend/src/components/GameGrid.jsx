import GameCard from "./GameCard";

export default function GameGrid({ jogos, onEditar, onExcluir }) {
    return (
        <main className="flex-1 p-8">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-5">
                {jogos.map((jogo) => (
                    <GameCard
                        key={jogo.id}
                        jogo={jogo}
                        onEditar={onEditar}
                        onExcluir={onExcluir}
                    />
                ))}
            </div>
        </main>
    );
}