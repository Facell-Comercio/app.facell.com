import { create } from "zustand";

interface useStorePerfil {
  id?: string;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
}

export const useStorePerfil = create<useStorePerfil>((set) => ({
  id: "",
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool) => set({ isPending: bool }),
}));
