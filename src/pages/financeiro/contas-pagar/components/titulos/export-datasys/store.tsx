import { create } from "zustand";

interface UseStoreExportDatasys {
  id?: string | null;
  modalOpen: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useStoreExportDatasys = create<UseStoreExportDatasys>((set) => ({
  id: null,
  modalOpen: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
    })),
}));
