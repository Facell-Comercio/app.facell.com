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
  modalOcorrenciaEditing: boolean;
  modalDepositoEditing: boolean;
  modalOpen: boolean;
  modalDepositoOpen: boolean;
  modalOcorrenciasOpen: boolean;
  modalOcorrenciaOpen: boolean;

  data_caixa?: string | null;
  id_filial?: string | null;
  ocorrencias_nao_resolvidas: boolean;

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

  setFilial: (id: string) => void;
  setDisabled: (bool: boolean) => void;
  setIsPending: (bool: boolean) => void;
}

export const useStoreCaixa = create<useStoreCaixa>((set) => ({
  id: null,
  id_deposito: null,
  id_ocorrencia: null,
  modalOcorrenciaEditing: false,
  modalDepositoEditing: false,
  modalOpen: false,
  modalDepositoOpen: false,
  modalOcorrenciaOpen: false,
  modalOcorrenciasOpen: false,

  data_caixa: null,
  id_filial: null,
  ocorrencias_nao_resolvidas: false,

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
  }) => set({ modalOpen: true, id, id_filial, data_caixa }),
  closeModal: () =>
    set({
      modalOpen: false,
      id: null,
      id_filial: null,
      data_caixa: null,
      disabled: false,
      isPending: false,
    }),

  openModalDeposito: (id: string) =>
    set({ modalDepositoOpen: true, id_deposito: id }),
  closeModalDeposito: () =>
    set({ modalDepositoOpen: false, id_deposito: null }),
  editModalDeposito: (bool) => set({ modalDepositoEditing: bool }),

  openModalOcorrencias: (props?: OpenOcorrenciaProps) =>
    set({
      modalOcorrenciasOpen: true,
      ocorrencias_nao_resolvidas: props?.ocorrencias_nao_resolvidas,
    }),
  closeModalOcorrencias: () =>
    set({ modalOcorrenciasOpen: false, ocorrencias_nao_resolvidas: false }),

  openModalOcorrencia: (id: string) =>
    set({ modalOcorrenciaOpen: true, id_ocorrencia: id }),
  closeModalOcorrencia: () =>
    set({ modalOcorrenciaOpen: false, id_ocorrencia: null }),
  editModalOcorrencia: (bool) => set({ modalOcorrenciaEditing: bool }),

  setFilial: (id: string) => set({ id_filial: id }),
  setDisabled: (bool: boolean) => set({ disabled: bool }),
  setIsPending: (bool: boolean) => set({ isPending: bool }),
}));
