import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

export type RowParcial = {
    uf: string;
    filial: string;
    vendedor: string;

    controle: number;
    pos: number;
    upgrade: number;
    receita: number;
    residenciais: number;
    live: number;
    portab: number;
    qtde_aparelho: number;
    aparelho: number;
    qtde_acessorio: number;
    acessorio: number;
    qtde_pitzi: number;
    pitzi: number;
}

export type AtivacaoParcial = {
    uf: string;
    filial: string;
    vendedor: string;
    modalidade: string;
    plaOpera: string;
    categoria: string;
    statusLinha: string;
    dtAtivacao: Date;
    grupo_economico: string;
    tipo_movimento: string;
    valor: number;
    qtde: string;
    pedido: string;

}

export type VendaParcial = {
    uf: string;
    filial: string;
    nomeVendedor: string;
    grupoEstoque: string;
    subgrupo: string;
    descricao: string;
    valor: number;
    qtde: string;
    grupo_economico: string;
    dataPedido: Date;
    tipoPedido: string;
    numeroPedido: string;
    planoHabilitacao: string;
}

export type ParcialData = {
    rows: RowParcial[]
}

const agrupamentos = [
    {
        uf: "RN",
        label: "ALFA",
    },
    {
        uf: "CE",
        label: "FALCON",
    },
    {
        uf: "BA",
        label: "LION",
    },
];

const grupos_economicos = ["FACELL", "FORTTELECOM"]

type ParcialState = {
    range_data?: DateRange,
    agrupamentos: typeof agrupamentos,
    grupos_economicos: typeof grupos_economicos
    modalListaVendasOpen?: {
        hierarquia: 'filial' | 'vendedor',
        chave: string
    }
    modalListaAtivacoesOpen?: {
        hierarquia: 'filial' | 'vendedor',
        chave: string
    }

}

type ParcialMethods = {
    setState: (newState: any) => void,
}

export const useParcialStore = create<ParcialState & ParcialMethods>((set) =>
({
    range_data: {
        from: subDays(new Date(), 2),
        to: new Date(),
    },
    agrupamentos: agrupamentos,
    grupos_economicos: grupos_economicos,
    modalListaVendasOpen: undefined,
    modalListaAtivacoesOpen: undefined,
    setState: (newState) => { set((state) => ({ ...state, ...newState })) },
}))