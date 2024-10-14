// import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Filters {
  mes?: string;
  ano?: string;
}

const initialFilters: Filters = {
  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),
};

export interface State {
  filters: Filters;

  modalOpen: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;

  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useStoreCampanhas = create<State & Actions>((set) => ({
  // Modal
  modalOpen: false,

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({
      filters: initialFilters,
    });
  },

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
