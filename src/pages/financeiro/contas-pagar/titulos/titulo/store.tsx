import { create } from "zustand";
import { TituloSchemaProps } from "./form-data";
import { calcularDataPrevisaoPagamento } from "./helper";

export interface ItemRateioTitulo {
  id?: string;
  id_rateio?: string;
  id_filial: string;
  filial?: string;
  percentual: string;
  ordem?: string;
}

export interface ItemTitulo {
  id?: string;
  id_plano_conta: string;
  plano_conta?: string;
  valor: string;
}

export interface Historico {
  id: string;
  id_titulo: string;
  created_at: string;
  descricao: string;
}

export const initialPropsTitulo: TituloSchemaProps = {
  id_tipo_solicitacao: "1",
  id_status: "1",
  id_centro_custo: "",
  centro_custo: "",
  id_forma_pagamento: "1",

  num_doc: "",

  // Pagamento
  // forma_pagamento: "",

  data_emissao: new Date().toString(),
  data_vencimento: new Date().toString(),
  data_pagamento: "",
  data_prevista: calcularDataPrevisaoPagamento(new Date()).toString(),

  valor: "0",
  descricao: "",

  // Parcelamento
  num_parcelas: "1",
  parcela: "1",

  // Filial
  id_filial: "",

  // Solicitante
  id_solicitante: "",

  // Fornecedor
  id_fornecedor: "",
  nome_fornecedor: "",
  cnpj_fornecedor: "",
  favorecido: "",
  cnpj_favorecido: "",
  id_banco: "",
  banco: "",
  codigo_banco: "",
  id_tipo_conta: "",
  conta: "",
  dv_conta: "",
  agencia: "",
  dv_agencia: "",
  id_tipo_chave_pix: "",
  chave_pix: "",

  // Itens
  itens: [],
  update_itens: true,

  // rateio
  update_rateio: false,
  rateio_manual: false,
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

type RecorrenciaProps = {
  id: string;
  data_vencimento: string;
};

interface useStoreTitulo {
  id: string | null;
  recorrencia?: RecorrenciaProps;
  titulo: TituloSchemaProps;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string, recorrencia?: RecorrenciaProps) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreTitulo = create<useStoreTitulo>((set) => ({
  id: null,
  recorrencia: undefined,
  titulo: initialPropsTitulo,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string, recorrencia?: RecorrenciaProps) =>
    recorrencia
      ? set({
          modalOpen: true,
          id: id,
          modalEditing: true,
          recorrencia: recorrencia,
        })
      : set({ modalOpen: true, id: id, modalEditing: !id ? true : false }),
  closeModal: () => set({ modalOpen: false, recorrencia: undefined }),
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
  id?: string;
  id_filial: string;
  filial?: string;
  percentual: string;
}