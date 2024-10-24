import { create } from "zustand";

interface UseStoreConciliacaoCR {
  id_conciliacao?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id_conciliacao: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
  toggleModal: () => void;
}

export const useStoreConciliacaoCR = create<UseStoreConciliacaoCR>((set) => ({
  id_conciliacao: null,
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (newIdConciliacao: string) =>
    set({ modalOpen: true, id_conciliacao: newIdConciliacao }),
  closeModal: () => set({ modalOpen: false, id_conciliacao: null }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool) => set({ isPending: bool }),
  toggleModal: () =>
    set(() => ({
      id_conciliacao: null,
      modalOpen: false,
      modalEditing: false,
    })),
}));
