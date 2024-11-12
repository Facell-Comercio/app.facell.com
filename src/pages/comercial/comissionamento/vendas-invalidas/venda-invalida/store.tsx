import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreVendaInvalidada {
  id?: string | null;
  id_contestacao?: string | null;
  modalOpen: boolean;
  modalContestacaoOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  openModalContestacao: (id: string) => void;
  closeModalContestacao: () => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreVendaInvalidada = create<useStoreVendaInvalidada>((set) => ({
  id: null,
  id_contestacao: null,
  modalEditing: false,
  modalOpen: false,
  modalContestacaoOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  openModalContestacao: (id: string) => set({ modalContestacaoOpen: true, id_contestacao: id }),
  closeModalContestacao: () => set({ modalContestacaoOpen: false, id_contestacao: null }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
