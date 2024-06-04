import { create } from "zustand";

interface useStoreCadastro {
  id?: string;
  isPending: boolean;
  modalEditing: boolean;
  modalOpen: boolean;
  modalLogsOpen: boolean;
  modalReplicateOpen: boolean;
  modalInsertOpen: boolean;
  modalMultiInsertOpen: boolean;
  modalMultiPlanoContasOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  setIsPending: (bool: boolean) => void;
  toggleModal: () => void;

  openLogsModal: (id: string) => void;
  closeLogsModal: () => void;

  openReplicateModal: (id: string) => void;
  closeReplicateModal: () => void;

  openInsertModal: () => void;
  closeInsertModal: () => void;

  openMultiInsertModal: () => void;
  closeMultiInsertModal: () => void;

  openMultiPlanoContasModal: () => void;
  closeMultiPlanoContasModal: () => void;
}

export const useStoreCadastro = create<useStoreCadastro>((set) => ({
  id: "",
  isPending: false,
  modalEditing: false,
  modalOpen: false,
  modalLogsOpen: false,
  modalReplicateOpen: false,
  modalInsertOpen: false,
  modalMultiInsertOpen: false,
  modalMultiPlanoContasOpen: false,

  openModal: (id: string) =>
    set({ modalOpen: true, modalEditing: id ? false : true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  setIsPending: (bool) => set({ isPending: bool }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
    })),

  openLogsModal: (id: string) => set({ modalLogsOpen: true, id: id }),
  closeLogsModal: () => set({ modalLogsOpen: false }),

  openReplicateModal: (id: string) => set({ modalReplicateOpen: true, id: id }),
  closeReplicateModal: () => set({ modalReplicateOpen: false }),

  openInsertModal: () => set({ modalInsertOpen: true }),
  closeInsertModal: () => set({ modalInsertOpen: false }),

  openMultiInsertModal: () => set({ modalMultiInsertOpen: true }),
  closeMultiInsertModal: () => set({ modalMultiInsertOpen: false }),

  openMultiPlanoContasModal: () => set({ modalMultiPlanoContasOpen: true }),
  closeMultiPlanoContasModal: () => set({ modalMultiPlanoContasOpen: false }),
}));
