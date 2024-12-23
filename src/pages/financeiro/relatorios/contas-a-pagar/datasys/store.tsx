import { create } from "zustand";

export interface State {
  filters: Filters;
}

export interface Filters {
  data_pagamento?: Date;
  grupo_economico_list?: string[];
}

const initialFilters: Filters = {
  grupo_economico_list: [],
  data_pagamento: undefined,
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreDatasysRelatorio = create<State & Actions>((set) => ({
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
