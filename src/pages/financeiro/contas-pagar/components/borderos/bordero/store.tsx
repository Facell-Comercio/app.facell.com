import { create } from "zustand";

interface UseStoreBordero {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  checkedTitulos: string[];
  getTitulo: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
  toggleGetTitulo: () => void;
  setCheckedTitulos: (array: string[]) => void;
}

export const useStoreBordero = create<UseStoreBordero>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  checkedTitulos: [],
  getTitulo: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
    })),
  toggleGetTitulo: () =>
    set((state) => ({
      getTitulo: !state.getTitulo,
    })),
  setCheckedTitulos: (array: string[]) => set({ checkedTitulos: array }),
}));
