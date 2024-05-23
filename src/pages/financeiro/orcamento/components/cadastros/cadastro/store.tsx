import { create } from "zustand";

interface useStoreCadastro {
  id?: string;
  modalEditing: boolean;
  modalOpen: boolean;
  modalLogsOpen: boolean;
  modalReplicateOpen: boolean;
  modalInsertOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  openLogsModal: (id: string) => void;
  closeLogsModal: () => void;
  openReplicateModal: (id: string) => void;
  closeReplicateModal: () => void;
  openInsertModal: () => void;
  closeInsertModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
}

export const useStoreCadastro = create<useStoreCadastro>((set) => ({
  id: "",
  modalEditing: false,
  modalOpen: false,
  modalLogsOpen: false,
  modalReplicateOpen: false,
  modalInsertOpen: false,

  openModal: (id: string) =>
    set({ modalOpen: true, modalEditing: id ? false : true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  openLogsModal: (id: string) => set({ modalLogsOpen: true, id: id }),
  closeLogsModal: () => set({ modalLogsOpen: false }),
  openReplicateModal: (id: string) => set({ modalReplicateOpen: true, id: id }),
  closeReplicateModal: () => set({ modalReplicateOpen: false }),
  openInsertModal: () => set({ modalInsertOpen: true }),
  closeInsertModal: () => set({ modalInsertOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
    })),
}));
