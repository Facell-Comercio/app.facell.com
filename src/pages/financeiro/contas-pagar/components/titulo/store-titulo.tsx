import { create } from "zustand";

export interface ItemRateioTitulo {
  id?: string;
  id_rateio?: string;
  id_filial: string;
  filial?: string;
  percentual: string;
  valor: number;
  ordem?: string;
}

export interface TituloPagar {
  id_tipo_solicitacao: string;
  id_status: string;
  id_centro_custo?: string;
  id_forma_pagamento?: string;
  id_plano_contas?: string;
  plano_contas?: string | null;

  valor: number;
  data_emissao: string;
  data_vencimento: string;
  data_pagamento: string;
  descricao: string;

  num_parcelas: number;
  parcela: number;

  id_filial?: string | null;
  nome_filial?: string | null;
  cnpj_filial?: string | null;

  id_solicitante?: string | null;
  nome_solicitante?: string | null;

  id_fornecedor?: string | null;
  nome_fornecedor?: string | null;
  cnpj_fornecedor?: string | null;

  id_rateio?: string | null;
  itens_rateio: ItemRateioTitulo[];

  url_xml_nota?: string | null;
  url_nota_fiscal?: string | null;
  url_boleto?: string | null;
  url_contrato?: string | null;
  url_planilha?: string | null;
  url_txt?: string | null;
}

export const initialPropsTitulo: TituloPagar = {
  id_tipo_solicitacao: "1",
  id_status: "1",
  id_centro_custo: "",
  id_forma_pagamento: "",

  valor: 0,
  data_emissao: "",
  data_vencimento: "",
  data_pagamento: "",
  descricao: "",

  // Parcelamento
  num_parcelas: 1,
  parcela: 1,

  // Filial
  id_filial: "",
  nome_filial: "",
  cnpj_filial: "",

  // Solicitante
  id_solicitante: "",
  nome_solicitante: "",

  // Fornecedor
  id_fornecedor: "",
  nome_fornecedor: "",
  cnpj_fornecedor: "",

  // rateio
  id_rateio: "",
  itens_rateio: [],

  // anexos
  url_xml_nota: "",
  url_nota_fiscal: "",
  url_boleto: "",
  url_contrato: "",
  url_planilha: "",
  url_txt: "",
};

interface useStoreTitulo {
  id: string | null;
  titulo: TituloPagar;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreTitulo = create<useStoreTitulo>((set) => ({
  id: null,
  titulo: initialPropsTitulo,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
}));

// interface useStoreTitulo {
//   id: string | null,
//   modalEditing: boolean,
//   modalOpen: boolean,

//   openModal: (id: string) => void,
//   closeModal: () => void,
//   editModal: (bool: boolean) => void,

// }

// export const useStoreTitulo = create<useStoreTitulo>((set) => ({
//   id: null,
//   modalEditing: false,
//   modalOpen: false,

//   openModal: (id: string)=>set({modalOpen: true, id: id}),
//   closeModal: () => set(({ modalOpen: false })),
//   editModal:(bool) => set(({ modalEditing: bool})),
// }))

export interface TipoRateio {
  id?: number;
  id_grupo_economico?: number;
  nome?: string;
  codigo?: string;
  manual?: boolean;
  default?: boolean;
}

export interface ItemRateio {
  id: number;
  id_filial: number;
  filial?: string;
  percentual: number;
}

export interface UseStoreRateio {
  valorRateio: number;
  tipoRateio: TipoRateio;
  itensRateio: ItemRateio[];

  addItemRateio: (novoItemRateio: ItemRateio) => void;
  removeItemRateio: (index: number) => void;
}

export const useStoreRateio = create<UseStoreRateio>((set) => ({
  valorRateio: 0,
  tipoRateio: {},
  itensRateio: [],

  setValorRateio: (novoValor: number) => {
    set({ valorRateio: novoValor });
  },
  addItemRateio: (novoItemRateio: ItemRateio) => {
    set((state) => ({
      ...state,
      itensRateio: [...state.itensRateio, novoItemRateio],
    }));
  },
  removeItemRateio: (index) => {
    set((state) => ({
      ...state,
      itensRateio: state.itensRateio.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  },
}));
