import { create } from "zustand";

interface useStoreNovaCampanha {
  qtde_total: number | null;
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (qtde_total: number) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreNovaCampanha = create<useStoreNovaCampanha>((set) => ({
  qtde_total: null,
  modalEditing: false,
  modalOpen: false,

  openModal: (qtde_total: number) => set({ modalOpen: true, qtde_total }),
  closeModal: () => set({ modalOpen: false, qtde_total: null }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
