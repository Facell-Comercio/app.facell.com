import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreVale {
  id?: string | null;
  id_abatimento?: string | null;
  modalEditing: boolean;
  modalEditingAbatimento: boolean;
  modalOpen: boolean;
  modalOpenAbatimento: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  openModalAbatimento: (id: string) => void;
  closeModalAbatimento: () => void;
  editModal: (bool: boolean) => void;
  editModalAbatimento: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreVale = create<useStoreVale>((set) => ({
  id: null,
  id_abatimento: null,
  modalEditing: false,
  modalEditingAbatimento: false,
  modalOpen: false,
  modalOpenAbatimento: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  openModalAbatimento: (id: string) =>
    set({ modalOpenAbatimento: true, id_abatimento: id }),
  closeModalAbatimento: () =>
    set({ modalOpenAbatimento: false, id_abatimento: null }),
  editModal: (bool) => set({ modalEditing: bool }),
  editModalAbatimento: (bool) => set({ modalEditingAbatimento: bool }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
