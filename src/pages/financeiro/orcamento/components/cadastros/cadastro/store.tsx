import { create } from "zustand";

interface useStoreCadastro {
  id?: string;
  modalEditing: boolean;
  modalOpen: boolean;
  modalReplicateOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  openReplicateModal: (id: string) => void;
  closeReplicateModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreCadastro = create<useStoreCadastro>((set) => ({
  id: "",
  modalEditing: false,
  modalOpen: false,
  modalReplicateOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  openReplicateModal: (id: string) => set({ modalReplicateOpen: true, id: id }),
  closeReplicateModal: () => set({ modalReplicateOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
