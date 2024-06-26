import { create } from "zustand";

interface UseStorePerfil {
  modalOpen: boolean;

  openModal: () => void;
  closeModal: () => void;
}

export const useStorePerfil = create<UseStorePerfil>((set) => ({
  modalOpen: false,

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
