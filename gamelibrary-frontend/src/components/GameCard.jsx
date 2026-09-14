import { STATUS_CONFIG } from "../config/statusConfig";
import { DiscIcon, EditIcon, TrashIcon } from "./icons/Icons";

export default function GameCard({ jogo, onEditar, onExcluir }) {
    const status = STATUS_CONFIG[jogo.status] || STATUS_CONFIG.NAO_INICIADO;

    return (
        <div className="game-card bg-[#111111] rounded-lg overflow-hidden flex flex-col border border-[#1c1c1c]">
            {/* Capa Pôster 3:4 */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                {jogo.capaUrl ? (
                    <img
                        src={jogo.capaUrl}
                        alt={jogo.nome}
                        className="card-poster-img w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <DiscIcon />
                    </div>
                )}

                {/* Gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />

                {/* Badge de Status */}
                <div className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded border backdrop-blur-md ${status.badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${status.dotClass}`} />
                    <span className="text-[10px] font-semibold tracking-wide">
            {status.label}
          </span>
                </div>

                {/* Badge de Nota */}
                {jogo.notaPessoal && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#0a0a0a]/85 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        <span className="text-amber-500 text-[10px]">★</span>
                        <span className="text-neutral-100 text-[11px] font-bold">
              {jogo.notaPessoal}
            </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-1">
                <div>
                    <h3 className="m-0 text-[13px] font-semibold text-neutral-100 truncate" title={jogo.nome}>
                        {jogo.nome}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-neutral-500 truncate">
                        {jogo.plataforma || "Sem plataforma"}
                    </p>
                </div>

                <div className="pt-2 border-t border-[#1a1a1a] flex justify-between items-center">
          <span className="text-[11px] text-neutral-400">
            {jogo.horasJogadas || 0}h
          </span>

                    <div className="flex gap-1">
                        <button
                            onClick={() => onEditar(jogo)}
                            title="Editar"
                            className="bg-[#191919] hover:bg-[#222222] border border-neutral-800 text-neutral-400 p-1.5 rounded cursor-pointer transition-colors"
                        >
                            <EditIcon />
                        </button>
                        <button
                            onClick={() => onExcluir(jogo)}
                            title="Excluir"
                            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 p-1.5 rounded cursor-pointer transition-colors"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}