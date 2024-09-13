import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type OpenOcorrenciaProps = {
  ocorrencias_nao_resolvidas?: boolean;
};

interface useStoreCaixa {
  id?: string | null;
  id_deposito?: string | null;
  id_ocorrencia?: string | null;
  id_ajuste?: string | null;
  id_caixa?: string | null;

  modalOpen: boolean;
  modalDepositoOpen: boolean;

  modalOcorrenciaOpen: boolean;
  modalOcorrenciasOpen: boolean;

  modalDetalheCardOpen: boolean;

  modalAjustesOpen: boolean;
  modalAjusteOpen: boolean;

  modalOcorrenciaEditing: boolean;
  modalDepositoEditing: boolean;
  modalAjusteEditing: boolean;

  modalBoletoOpen: boolean;

  data_caixa?: string | null;
  id_filial?: string | null;
  filial?: string | null;
  ocorrencias_nao_resolvidas: boolean;
  type_detalhe?: string | null;
  title_detalhe?: string | null;

  disabled: boolean;
  isPending: boolean;

  openModal: ({
    id,
    id_filial,
    data_caixa,
  }: {
    id: string;
    id_filial: string;
    data_caixa: string;
  }) => void;
  closeModal: () => void;

  openModalDeposito: (id: string) => void;
  closeModalDeposito: () => void;
  editModalDeposito: (bool: boolean) => void;

  openModalOcorrencias: (props?: OpenOcorrenciaProps) => void;
  closeModalOcorrencias: () => void;

  openModalOcorrencia: (id: string) => void;
  closeModalOcorrencia: () => void;
  editModalOcorrencia: (bool: boolean) => void;

  openModalAjustes: (id: string) => void;
  closeModalAjustes: () => void;

  openModalAjuste: (id: string) => void;
  closeModalAjuste: () => void;
  editModalAjuste: (bool: boolean) => void;

  openModalDetalheCard: ({ type, title }: { type: string; title: string }) => void;
  closeModalDetalheCard: () => void;

  openModalBoleto: (data: { id_filial: string; filial: string }) => void;
  closeModalBoleto: () => void;

  setFilial: (id: string) => void;
  setDisabled: (bool: boolean) => void;
  setIsPending: (bool: boolean) => void;
}

export const useStoreCaixa = create<useStoreCaixa>((set) => ({
  id: null,
  id_deposito: null,
  id_ocorrencia: null,
  id_ajuste: null,
  id_caixa: null,

  modalOpen: false,
  modalDepositoOpen: false,

  modalOcorrenciasOpen: false,
  modalOcorrenciaOpen: false,

  modalAjustesOpen: false,
  modalAjusteOpen: false,

  modalOcorrenciaEditing: false,
  modalDepositoEditing: false,
  modalDetalheCardOpen: false,
  modalAjusteEditing: false,

  modalBoletoOpen: false,

  data_caixa: null,
  id_filial: null,
  filial: null,
  ocorrencias_nao_resolvidas: false,
  type_detalhe: null,
  title_detalhe: null,

  disabled: false,
  isPending: false,

  openModal: ({
    id,
    id_filial,
    data_caixa,
  }: {
    id: string;
    id_filial: string;
    data_caixa: string;
  }) =>
    set({
      modalOpen: true,
      id,
      id_filial,
      data_caixa,
    }),
  closeModal: () =>
    set({
      modalOpen: false,
      id: null,
      data_caixa: null,
      disabled: false,
      isPending: false,
    }),

  openModalDeposito: (id: string) =>
    set({
      modalDepositoOpen: true,
      id_deposito: id,
    }),
  closeModalDeposito: () =>
    set({
      modalDepositoOpen: false,
      id_deposito: null,
    }),
  editModalDeposito: (bool) => set({ modalDepositoEditing: bool }),

  openModalOcorrencias: (props?: OpenOcorrenciaProps) =>
    set({
      modalOcorrenciasOpen: true,
      ocorrencias_nao_resolvidas: props?.ocorrencias_nao_resolvidas,
    }),
  closeModalOcorrencias: () =>
    set({
      modalOcorrenciasOpen: false,
      ocorrencias_nao_resolvidas: false,
    }),

  openModalOcorrencia: (id: string) =>
    set({
      modalOcorrenciaOpen: true,
      id_ocorrencia: id,
    }),
  closeModalOcorrencia: () =>
    set({
      modalOcorrenciaOpen: false,
      id_ocorrencia: null,
    }),
  editModalOcorrencia: (bool) => set({ modalOcorrenciaEditing: bool }),

  openModalAjustes: (id: string) =>
    set({
      modalAjustesOpen: true,
      id_caixa: id,
    }),

  closeModalAjustes: () =>
    set({
      modalAjustesOpen: false,
      id_caixa: null,
    }),

  openModalAjuste: (id: string) =>
    set({
      modalAjusteOpen: true,
      id_ajuste: id,
      modalAjusteEditing: !id,
    }),

  closeModalAjuste: () =>
    set({
      modalAjusteOpen: false,
      modalAjusteEditing: false,
      id_ajuste: null,
    }),
  editModalAjuste: (bool) => set({ modalAjusteEditing: bool }),

  openModalDetalheCard: ({ type, title }: { type: string; title: string }) =>
    set({
      modalDetalheCardOpen: true,
      type_detalhe: type,
      title_detalhe: title,
    }),
  closeModalDetalheCard: () =>
    set({
      modalDetalheCardOpen: false,
      type_detalhe: null,
      title_detalhe: null,
    }),

  openModalBoleto: ({ id_filial, filial }) =>
    set({
      modalBoletoOpen: true,
      id_filial,
      filial,
    }),

  closeModalBoleto: () =>
    set({
      modalBoletoOpen: false,
      id_filial: null,
      filial: null,
    }),

  setFilial: (id: string) => set({ id_filial: id }),
  setDisabled: (bool: boolean) => set({ disabled: bool }),
  setIsPending: (bool: boolean) => set({ isPending: bool }),
}));
