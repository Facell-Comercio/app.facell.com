import { create } from "zustand";

interface useStoreBoleto {
  id?: string;
  isPending: boolean;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  setIsPending: (bool: boolean) => void;
}

export const useStoreBoleto = create<useStoreBoleto>((set) => ({
  id: "",
  isPending: false,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, modalEditing: id ? false : true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  setIsPending: (bool) => set({ isPending: bool }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
    })),
}));
