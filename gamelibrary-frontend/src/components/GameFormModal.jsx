import { STATUS_OPCOES } from "../config/statusConfig";
import GameSearchInput from "./GameSearchInput";

export default function GameFormModal({
                                          aberto,
                                          editandoId,
                                          form,
                                          erro,
                                          onClose,
                                          onChange,
                                          onSelectRawg,
                                          onSalvar,
                                      }) {
    if (!aberto) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-[#111111] rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col gap-3 border border-neutral-800">
                <h2 className="text-[15px] font-bold text-neutral-100">
                    {editandoId ? "Editar Jogo" : "Adicionar à Coleção"}
                </h2>

                {erro && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-xs rounded p-2">
                        {erro}
                    </div>
                )}

                {!editandoId && (
                    <div>
                        <label className="text-[11px] text-neutral-400 mb-1 block">
                            Catálogo RAWG
                        </label>
                        <GameSearchInput onSelectJogo={onSelectRawg} />
                    </div>
                )}

                {form.capaUrl && (
                    <div className="flex justify-center">
                        <img
                            src={form.capaUrl}
                            alt="Prévia"
                            className="w-20 aspect-[3/4] object-cover rounded border border-neutral-800"
                        />
                    </div>
                )}

                <input
                    name="nome"
                    value={form.nome}
                    onChange={onChange}
                    placeholder="Título *"
                    className="bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                />

                <div className="flex gap-2">
                    <input
                        name="plataforma"
                        value={form.plataforma}
                        onChange={onChange}
                        placeholder="Plataforma"
                        className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                    />
                    <input
                        name="genero"
                        value={form.genero}
                        onChange={onChange}
                        placeholder="Gênero"
                        className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                    />
                </div>

                <select
                    name="status"
                    value={form.status}
                    onChange={onChange}
                    className="bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                >
                    {STATUS_OPCOES.map((o) => (
                        <option key={o.valor} value={o.valor}>
                            {o.label}
                        </option>
                    ))}
                </select>

                <div className="flex gap-2">
                    <input
                        name="horasJogadas"
                        value={form.horasJogadas}
                        onChange={onChange}
                        type="number"
                        step="0.5"
                        placeholder="Horas jogadas"
                        className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                    />
                    <input
                        name="notaPessoal"
                        value={form.notaPessoal}
                        onChange={onChange}
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Nota (0-10)"
                        className="flex-1 bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none focus:border-amber-500"
                    />
                </div>

                <div className="flex gap-3 text-xs text-neutral-300">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                            type="checkbox"
                            name="temHistoria"
                            checked={form.temHistoria}
                            onChange={onChange}
                        />
                        Modo História
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                            type="checkbox"
                            name="historiaConcluida"
                            checked={form.historiaConcluida}
                            onChange={onChange}
                        />
                        História Concluída
                    </label>
                </div>

                <textarea
                    name="review"
                    value={form.review}
                    onChange={onChange}
                    placeholder="Anotações pessoais..."
                    rows={3}
                    className="bg-[#0a0a0a] border border-neutral-800 rounded px-2.5 py-2 text-white text-xs outline-none resize-none focus:border-amber-500"
                />

                <div className="flex gap-2 mt-1">
                    <button
                        onClick={onSalvar}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold py-2 rounded text-xs cursor-pointer transition-colors"
                    >
                        Salvar
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-neutral-800 text-neutral-400 py-2 rounded text-xs cursor-pointer transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}