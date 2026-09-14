import { LogoIcon } from "./icons/Icons";

export default function Header({ totalJogos, onAbrirNovo, onAbrirSteam }) {
    return (
        <header className="h-16 bg-[#0d0d0d] border-b border-[#1a1a1a] px-8 flex items-center justify-between sticky top-0 z-40">
            <div className="flex items-center gap-2.5">
                <LogoIcon />
                <span className="text-sm font-bold tracking-wider text-neutral-100">
          GAME LIBRARY
        </span>
                <span className="text-[11px] text-neutral-500 bg-[#141414] border border-neutral-800 px-2 py-0.5 rounded-full ml-2">
          {totalJogos} {totalJogos === 1 ? "título" : "títulos"}
        </span>
            </div>

            <div className="flex items-center gap-2.5">
                <button
                    onClick={onAbrirSteam}
                    className="bg-[#171a21] border border-[#2a475e] text-[#c7d5e0] hover:bg-[#1f242e] transition-colors text-xs font-semibold px-3.5 py-2 rounded-md cursor-pointer"
                >
                    Sincronizar Steam
                </button>
                <button
                    onClick={onAbrirNovo}
                    className="bg-amber-500 hover:bg-amber-400 transition-colors text-neutral-950 text-xs font-bold px-4 py-2 rounded-md cursor-pointer tracking-wide"
                >
                    + Adicionar Jogo
                </button>
            </div>
        </header>
    );
}