import { create } from "zustand";

interface useStoreNovaCampanha {
  qtde_total: number | null;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (qtde_total: number) => void;
  closeModal: () => void;
  setIsPending: (bool: boolean) => void;
}

export const useStoreNovaCampanha = create<useStoreNovaCampanha>((set) => ({
  qtde_total: null,
  modalOpen: false,
  isPending: false,

  openModal: (qtde_total: number) => set({ modalOpen: true, qtde_total }),
  closeModal: () => set({ modalOpen: false, qtde_total: null }),
  setIsPending: (bool: boolean) => set({ isPending: bool }),
}));
