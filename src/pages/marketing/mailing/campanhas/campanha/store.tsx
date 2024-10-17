import { create } from "zustand";

interface useStoreCampanha {
  id: string | null;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  setIsPending: (bool: boolean) => void;
}

export const useStoreCampanha = create<useStoreCampanha>((set) => ({
  id: null,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  setIsPending: (bool: boolean) => set({ isPending: bool }),
}));
