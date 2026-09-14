export const STATUS_CONFIG = {
    NAO_INICIADO: {
        valor: "NAO_INICIADO",
        label: "Não iniciado",
        cor: "#8a8a8a",
        badgeClass: "bg-neutral-800/60 border-neutral-700/50 text-neutral-400",
        dotClass: "bg-neutral-400 shadow-[0_0_6px_#8a8a8a]",
    },
    EM_ANDAMENTO: {
        valor: "EM_ANDAMENTO",
        label: "Jogando",
        cor: "#38bdf8",
        badgeClass: "bg-sky-500/10 border-sky-500/30 text-sky-400",
        dotClass: "bg-sky-400 shadow-[0_0_8px_#38bdf8]",
    },
    CONCLUIDO: {
        valor: "CONCLUIDO",
        label: "Concluído",
        cor: "#f59e0b",
        badgeClass: "bg-amber-500/10 border-amber-500/40 text-amber-400",
        dotClass: "bg-amber-400 shadow-[0_0_10px_#f59e0b]",
    },
    PLATINADO: {
        valor: "PLATINADO",
        label: "Platinado",
        cor: "#f8fafc",
        badgeClass: "badge-platinado",
        dotClass: "dot-platinado",
    },
    ABANDONADO: {
        valor: "ABANDONADO",
        label: "Abandonado",
        cor: "#ef4444",
        badgeClass: "bg-red-500/10 border-red-500/30 text-red-400",
        dotClass: "bg-red-400 shadow-[0_0_6px_#ef4444]",
    },
};

export const STATUS_OPCOES = Object.values(STATUS_CONFIG);