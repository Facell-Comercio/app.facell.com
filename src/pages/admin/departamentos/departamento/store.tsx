import { create } from "zustand";

interface useStoreDepartamento {
  id?: string;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreDepartamento = create<useStoreDepartamento>((set) => ({
  id: '',
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
