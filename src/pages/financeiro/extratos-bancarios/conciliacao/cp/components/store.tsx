import { create } from "zustand";

interface UseStoreConciliacaoCP {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
}

export const useStoreConciliacaoCP = create<UseStoreConciliacaoCP>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: () =>
    set(() => ({
      modalOpen: false,
      modalEditing: false,
    })),
}));
