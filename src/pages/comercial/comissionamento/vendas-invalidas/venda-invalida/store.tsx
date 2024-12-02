import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreVendaInvalidada {
  id?: string | null;
  id_contestacao?: string | null;
  id_rateio?: string | null;

  modalOpen: boolean;

  modalContestacaoOpen: boolean;
  modalContestacaoEditing: boolean;

  modalRateioOpen: boolean;
  modalRateioEditing: boolean;

  isPending: boolean;

  valor_total_rateio: string;
  filial?: string | null;
  ref?: string | null;

  openModal: (id: string) => void;
  closeModal: () => void;

  openModalContestacao: (id: string) => void;
  closeModalContestacao: () => void;
  editModalContestacao: (bool: boolean) => void;

  openModalRateio: ({
    id,
    valor,
    filial,
    ref,
    edit,
  }: {
    id: string;
    valor: string;
    filial: string;
    ref: string;
    edit?: boolean;
  }) => void;
  closeModalRateio: () => void;
  editModalRateio: (bool: boolean) => void;

  editIsPending: (bool: boolean) => void;
}

export const useStoreVendaInvalidada = create<useStoreVendaInvalidada>((set) => ({
  id: null,
  id_contestacao: null,
  id_rateio: null,

  modalOpen: false,

  modalContestacaoOpen: false,
  modalContestacaoEditing: false,

  modalRateioOpen: false,
  modalRateioEditing: false,

  isPending: false,

  valor_total_rateio: "0",
  filial: null,
  ref: null,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),

  openModalContestacao: (id: string) =>
    set({ modalContestacaoOpen: true, id_contestacao: id, modalContestacaoEditing: !id }),
  closeModalContestacao: () =>
    set({ modalContestacaoOpen: false, id_contestacao: null, modalContestacaoEditing: false }),
  editModalContestacao: (bool) => set({ modalContestacaoEditing: bool }),

  openModalRateio: ({ id, valor, filial, ref, edit }) =>
    set({
      modalRateioOpen: true,
      id_rateio: id,
      valor_total_rateio: valor,
      filial,
      ref,
      modalRateioEditing: edit !== undefined ? edit : !id,
    }),
  closeModalRateio: () =>
    set({
      modalRateioOpen: false,
      id_rateio: null,
      valor_total_rateio: "0",
      modalContestacaoEditing: false,
    }),
  editModalRateio: (bool) => set({ modalRateioEditing: bool }),

  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
