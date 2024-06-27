import { create } from "zustand";

interface UseStorePerfil {
  modalOpen: boolean;
  modalUploadOpen: boolean;

  openModal: () => void;
  closeModal: () => void;
  openUploadModal: () => void;
  closeUploadModal: () => void;
}

export const useStorePerfil = create<UseStorePerfil>((set) => ({
  modalOpen: false,
  modalUploadOpen: false,

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
  openUploadModal: () => set({ modalUploadOpen: true }),
  closeUploadModal: () => set({ modalUploadOpen: false }),
}));
