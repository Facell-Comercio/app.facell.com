import { create } from "zustand";

interface useStoreVendedor {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreVendedor = create<useStoreVendedor>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
