import { create } from "zustand";

type Filters = {
  ano?: string | number;
  mes?: string | number;
};

const initialFilters: Filters = {
  ano: new Date().getFullYear(),
  mes: new Date().getMonth() + 1,
};

interface UseStoreRecorrencias {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  modalTransferOpen: boolean;
  modalContasBancariasOpen: boolean;
  filters: Filters;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
  toggleModalContasBancarias: () => void;
  toggleModalTransfer: () => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreRecorrencias = create<UseStoreRecorrencias>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  modalTransferOpen: false,
  modalContasBancariasOpen: false,
  filters: initialFilters,

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

  setFilters: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
