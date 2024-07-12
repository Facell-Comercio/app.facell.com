import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreCartao {
  id?: string | null;
  id_fatura?: string | null;
  modalEditing: boolean;
  modalFaturaEditing: boolean;
  modalOpen: boolean;
  modalFaturaOpen: boolean;
  modalTransferOpen: boolean;
  isPending: boolean;
  paginationFaturas: Pagination;
  ids: string[];

  openModal: (id: string) => void;
  openModalFatura: (id: string) => void;
  openModalTransfer: () => void;
  closeModal: () => void;
  closeModalFatura: () => void;
  closeModalTransfer: () => void;
  editModal: (bool: boolean) => void;
  editFaturaModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
  setPaginationFaturas: (pagination: Pagination) => void;
  handleChangeIds: (id: string) => void;
}

export const useStoreCartao = create<useStoreCartao>((set) => ({
  id: null,
  id_fatura: null,
  modalEditing: false,
  modalFaturaEditing: false,
  modalOpen: false,
  modalFaturaOpen: false,
  modalTransferOpen: false,
  isPending: false,
  paginationFaturas: { pageIndex: 0, pageSize: 15 },
  ids: [],

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  openModalFatura: (id: string) =>
    set({ modalFaturaOpen: true, id_fatura: id }),
  openModalTransfer: () => set({ modalTransferOpen: true }),
  closeModal: () => set({ modalOpen: false, id: null }),
  closeModalFatura: () =>
    set({
      modalFaturaOpen: false,
      modalFaturaEditing: false,
      id_fatura: null,
      ids: [],
    }),
  closeModalTransfer: () => set({ modalTransferOpen: false, ids: [] }),

  editModal: (bool) => set({ modalEditing: bool }),
  editFaturaModal: (bool) => set({ modalFaturaEditing: bool }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),

  setPaginationFaturas: (pagination) => set({ paginationFaturas: pagination }),

  handleChangeIds: (id: string) =>
    set((state) => ({
      ids: state.ids.includes(id)
        ? state.ids.filter((id_filter) => id_filter !== id)
        : [...state.ids, id],
    })),
}));
