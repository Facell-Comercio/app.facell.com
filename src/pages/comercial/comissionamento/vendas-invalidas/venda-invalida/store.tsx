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
  modalRateioOpen: boolean;
  isPending: boolean;

  valor_total_rateio: string;
  filial?: string | null;
  ref?: string | null;

  openModal: (id: string) => void;
  closeModal: () => void;
  openModalContestacao: (id: string) => void;
  closeModalContestacao: () => void;
  openModalRateio: ({
    id,
    valor,
    filial,
    ref,
  }: {
    id: string;
    valor: string;
    filial: string;
    ref: string;
  }) => void;
  closeModalRateio: () => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreVendaInvalidada = create<useStoreVendaInvalidada>((set) => ({
  id: null,
  id_contestacao: null,
  id_rateio: null,
  modalEditing: false,
  modalOpen: false,
  modalContestacaoOpen: false,
  modalRateioOpen: false,
  isPending: false,

  valor_total_rateio: "0",
  filial: null,
  ref: null,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  openModalContestacao: (id: string) => set({ modalContestacaoOpen: true, id_contestacao: id }),
  closeModalContestacao: () => set({ modalContestacaoOpen: false, id_contestacao: null }),
  openModalRateio: ({ id, valor, filial, ref }) =>
    set({ modalRateioOpen: true, id_rateio: id, valor_total_rateio: valor, filial, ref }),
  closeModalRateio: () => set({ modalRateioOpen: false, id_rateio: null, valor_total_rateio: "0" }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
