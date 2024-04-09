import { create } from "zustand";

interface useStoreCadastro {
  id?: string | null;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useStoreCadastro = create<useStoreCadastro>((set) => ({
  id: null,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
}));
