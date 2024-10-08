import { create } from "zustand";
import { TituloCRSchemaProps } from "./form-data";

export interface ItemRateioTituloCR {
  id?: string;
  id_rateio?: string;
  id_filial: string;
  filial?: string;
  id_centro_custo: string;
  centro_custo?: string;
  id_plano_conta: string;
  plano_conta?: string;
  percentual: string;
  valor: string;
}

export interface VencimentoTituloCR {
  id?: string;
  data_vencimento: string;
  valor: string;
  valor_pago?: string;
}

export interface Historico {
  id: string;
  id_titulo: string;
  created_at: string;
  descricao: string;
}

export const initialPropsTituloCR: TituloCRSchemaProps = {
  id_status: "1",

  num_doc: "",

  // Pagamento
  // forma_pagamento: "",

  data_emissao: "",

  valor: "0",
  descricao: "",

  // Filial
  id_filial: "",
  filial: "",
  id_matriz: "",
  id_grupo_economico: "",

  // Solicitante
  id_solicitante: "",

  // Fornecedor
  id_fornecedor: "",
  nome_fornecedor: "",
  cnpj_fornecedor: "",

  // Itens
  vencimentos: [],
  update_vencimentos: true,

  // rateio
  update_rateio: true,
  rateio_manual: true,
  id_rateio: "",
  itens_rateio: [],

  // anexos
  url_xml_nota: "",
  url_nota_fiscal: "",
  url_nota_debito: "",
  url_planilha: "",
  url_txt: "",
};

interface useStoreTituloReceber {
  id: string | null;
  copyData?: Partial<TituloCRSchemaProps>;
  tituloCopiado: boolean;
  titulo: TituloCRSchemaProps;
  modalEditing: boolean;
  modalOpen: boolean;
  modalAlteracaoLoteOpen: boolean;

  openModal: ({ id, copyData }: { id: string; copyData?: Partial<TituloCRSchemaProps> }) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  setTituloCopiado: (tituloCopiado: boolean) => void;

  openAlteracaoLoteModal: () => void;
  closeAlteracaoLoteModal: () => void;
}

export const useStoreTituloReceber = create<useStoreTituloReceber>((set) => ({
  id: null,
  copyData: undefined,
  tituloCopiado: false,
  titulo: initialPropsTituloCR,
  modalEditing: false,
  modalOpen: false,
  modalAlteracaoLoteOpen: false,

  openModal: ({ id, copyData }) =>
    set({
      modalOpen: true,
      id: id,
      modalEditing: !id ? true : false,
      copyData: copyData ? copyData : undefined,
    }),
  closeModal: () =>
    set({
      id: null,
      modalOpen: false,
      copyData: undefined,
    }),
  editModal: (bool) => set({ modalEditing: bool }),
  setTituloCopiado: (novoEstado) => set({ tituloCopiado: novoEstado }),
  openAlteracaoLoteModal: () => set({ modalAlteracaoLoteOpen: true }),
  closeAlteracaoLoteModal: () => set({ modalAlteracaoLoteOpen: false }),
}));

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
