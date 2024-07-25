import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreVale {
  id?: string | null;
  id_fatura?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreVale = create<useStoreVale>((set) => ({
  id: null,
  id_fatura: null,
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
