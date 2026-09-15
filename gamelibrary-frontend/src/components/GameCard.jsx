import { STATUS_CONFIG } from "../config/statusConfig";
import { DiscIcon, EditIcon, TrashIcon } from "./icons/Icons";

export default function GameCard({ jogo, onEditar, onExcluir }) {
    // Fallback seguro caso o status venha nulo ou com nome não mapeado
    const statusPadrao = {
        label: "Não Iniciado",
        badgeClass: "border-neutral-700 text-neutral-400 bg-neutral-900/80",
        dotClass: "bg-neutral-500",
    };

    const status = (STATUS_CONFIG && STATUS_CONFIG[jogo.status])
        || (STATUS_CONFIG && STATUS_CONFIG.NAO_INICIADO)
        || statusPadrao;

    return (
        <div className="game-card bg-[#111111] rounded-lg overflow-hidden flex flex-col border border-[#1c1c1c] hover:border-neutral-700 transition-colors">
            {/* Capa Pôster 3:4 */}
            <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0a0a0a]">
                {jogo.capaUrl ? (
                    <img
                        src={jogo.capaUrl}
                        alt={jogo.nome}
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x800/111111/444444?text=Sem+Capa";
                        }}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-600">
                        <DiscIcon />
                    </div>
                )}

                {/* Gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/20 to-transparent" />

                {/* Badge de Status */}
                <div className={`absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded border backdrop-blur-md ${status.badgeClass || ""}`}>
                    <span className={`w-1.5 h-1.5 rounded-full inline-block ${status.dotClass || "bg-neutral-400"}`} />
                    <span className="text-[10px] font-semibold tracking-wide">
            {status.label || "Não Iniciado"}
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

            {/* Informações do Jogo */}
            <div className="p-3 flex flex-col flex-1 justify-between gap-2">
                <div>
                    <h3 className="m-0 text-[13px] font-semibold text-neutral-100 truncate" title={jogo.nome}>
                        {jogo.nome}
                    </h3>
                    <div className="flex items-center justify-between mt-0.5 text-[11px] text-neutral-500">
                        <span className="truncate max-w-[110px]">{jogo.plataforma || "PC"}</span>
                        <span>{jogo.anoLancamento ? jogo.anoLancamento : "—"}</span>
                    </div>
                </div>

                <div className="pt-2 border-t border-[#1a1a1a] flex justify-between items-center">
          <span className="text-[11px] text-neutral-400 font-mono">
            {jogo.horasJogadas ? `${jogo.horasJogadas}h` : "0h"}
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