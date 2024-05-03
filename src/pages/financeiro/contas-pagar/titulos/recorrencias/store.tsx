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
  modalOpen: boolean;
  filters: Filters;

  openModal: (id: string) => void;
  closeModal: () => void;
  toggleModal: () => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreRecorrencias = create<UseStoreRecorrencias>((set) => ({
  id: null,
  modalOpen: false,
  filters: initialFilters,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
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
