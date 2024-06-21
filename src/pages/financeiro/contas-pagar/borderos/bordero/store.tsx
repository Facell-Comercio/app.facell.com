import { create } from "zustand";

interface UseStoreBordero {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  modalTransferOpen: boolean;
  modalContasBancariasOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
  toggleModalContasBancarias: () => void;
  toggleModalTransfer: () => void;

  editIsPending: (bool: boolean) => void;
}

export const useStoreBordero = create<UseStoreBordero>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  modalTransferOpen: false,
  modalContasBancariasOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
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

  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
