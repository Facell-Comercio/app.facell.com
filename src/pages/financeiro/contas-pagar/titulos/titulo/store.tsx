import { create } from "zustand";
import { TituloSchemaProps } from "./form-data";

export interface ItemRateioTitulo {
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

export interface VencimentoTitulo {
  id?: string;
  data_vencimento: string;
  data_prevista: string;
  valor: string;
  valor_pago?: string;
  data_pagamento?: string;
  tipo_baixa?:
    | "PADRÃO"
    | "PARCIAL"
    | "COM DESCONTO"
    | "COM ACRÉSCIMO";
}

export interface Historico {
  id: string;
  id_titulo: string;
  created_at: string;
  descricao: string;
}

export const initialPropsTitulo: TituloSchemaProps =
  {
    id_tipo_solicitacao: "1",
    id_status: "1",
    id_forma_pagamento: "1",
    id_departamento: "",

    num_doc: "",

    // Pagamento
    // forma_pagamento: "",

    data_emissao: new Date().toDateString(),

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
    vencimentos: [],
    update_vencimentos: true,

    // rateio
    update_rateio: true,
    rateio_manual: true,
    id_rateio: "",
    itens_rateio: [],

    // anexos
    url_xml: "",
    url_nota_fiscal: "",
    url_boleto: "",
    url_contrato: "",
    url_planilha: "",
    url_txt: "",
  };

type RecorrenciaProps = {
  id: string;
  data_vencimento: string | Date;
  valor: string;
};

interface useStoreTituloPagar {
  id: string | null;
  recorrencia?: RecorrenciaProps;
  copyData?: Partial<TituloSchemaProps>;
  tituloCopiado: boolean;
  titulo: TituloSchemaProps;
  modalEditing: boolean;
  modalOpen: boolean;
  modalAlteracaoLoteOpen: boolean;

  openModal: ({
    id,
    recorrencia,
    copyData,
  }: {
    id: string;
    recorrencia?: RecorrenciaProps;
    copyData?: Partial<TituloSchemaProps>;
  }) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  setTituloCopiado: (
    tituloCopiado: boolean
  ) => void;

  openAlteracaoLoteModal: () => void;
  closeAlteracaoLoteModal: () => void;
}

export const useStoreTituloPagar =
  create<useStoreTituloPagar>((set) => ({
    id: null,
    recorrencia: undefined,
    copyData: undefined,
    tituloCopiado: false,
    titulo: initialPropsTitulo,
    modalEditing: false,
    modalOpen: false,
    modalAlteracaoLoteOpen: false,

    openModal: ({ id, recorrencia, copyData }) =>
      set({
        modalOpen: true,
        id: id,
        modalEditing:
          !id || recorrencia ? true : false,
        recorrencia: recorrencia
          ? recorrencia
          : undefined,
        copyData: copyData ? copyData : undefined,
      }),
    closeModal: () =>
      set({
        id: null,
        modalOpen: false,
        recorrencia: undefined,
        copyData: undefined,
      }),
    editModal: (bool) =>
      set({ modalEditing: bool }),
    setTituloCopiado: (novoEstado) =>
      set({ tituloCopiado: novoEstado }),
    openAlteracaoLoteModal: () =>
      set({ modalAlteracaoLoteOpen: true }),
    closeAlteracaoLoteModal: () =>
      set({ modalAlteracaoLoteOpen: false }),
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
