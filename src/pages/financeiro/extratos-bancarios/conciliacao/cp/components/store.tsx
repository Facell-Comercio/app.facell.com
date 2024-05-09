import { create } from "zustand";

interface UseStoreConciliacaoCP {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  modalTransferOpen: boolean;
  modalContasBancariasOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
  toggleModalContasBancarias: () => void;
  toggleModalTransfer: () => void;
}

export const useStoreConciliacaoCP = create<UseStoreConciliacaoCP>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  modalTransferOpen: false,
  modalContasBancariasOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: () =>
    set(() => ({
      modalOpen: false,
      modalEditing: false,
    })),
  toggleModalContasBancarias: () =>
    set((state) => ({
      modalContasBancariasOpen: !state.modalContasBancariasOpen,
    })),
  toggleModalTransfer: () =>
    set((state) => ({
      modalTransferOpen: !state.modalTransferOpen,
    })),
}));
