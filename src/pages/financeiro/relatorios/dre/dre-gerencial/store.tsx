import { create } from "zustand";

export interface State {
  filters: Filters;
}

export interface Filters {
  grupo_economico_list?: string[];
  mes?: string;
  ano?: string;
}

const initialFilters: Filters = {
  grupo_economico_list: [],
  ano: String(new Date().getFullYear()),
  mes: String(new Date().getMonth() + 1),
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreDREGerencialRelatorio = create<State & Actions>((set) => ({
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
