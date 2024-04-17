import { create } from "zustand";

interface useStoreBordero {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  modalMoveBorderoOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  openMoveBorderoModal: (id: string) => void;
  closeMoveBorderoModal: () => void;
}

export const useStoreBordero = create<useStoreBordero>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  modalMoveBorderoOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  openMoveBorderoModal: (id: string) =>
    set({ modalMoveBorderoOpen: true, id: id }),
  closeMoveBorderoModal: () => set({ modalMoveBorderoOpen: false }),
}));
