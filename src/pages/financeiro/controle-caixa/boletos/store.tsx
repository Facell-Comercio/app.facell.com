import { create } from "zustand";

export interface State {
  id: string | null;
  modalOpen: boolean;
  modalEditing: boolean;
  isPending: boolean;
}

export interface Actions {
  openModal: (id: string) => void;
  closeModal: () => void;
  setIsPending(isPending: boolean): void;
  editModal: (bool: boolean) => void;
}

export const useStoreBoletos = create<State & Actions>((set) => ({
  id: null,
  isPending: false,
  modalOpen: false,
  modalEditing: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false, id: null, modalEditing: false }),

  setIsPending: (isPending) => set({ isPending }),

  editModal: (bool) => set({ modalEditing: bool }),
}));
