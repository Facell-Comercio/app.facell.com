import { create } from 'zustand';

interface UseStoreConciliacaoCP {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
  toggleModal: () => void;
}

export const useStoreConciliacaoCP = create<UseStoreConciliacaoCP>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool) => set({ isPending: bool }),
  toggleModal: () =>
    set(() => ({
      id: null,
      modalOpen: false,
      modalEditing: false,
    })),
}));
