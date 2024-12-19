import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Filters {
  filiais_list?: string[];
  uf_list?: string[];
}

const initialFilters: Filters = {
  filiais_list: [],
  uf_list: [],
};

export interface State {
  filters: Filters;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
}

export const useStoreConferenciaCaixa = create(
  persist<State & Actions>(
    (set) => ({
      filters: initialFilters,
      setFilters: (novoFiltro) =>
        set((state) => ({
          ...state,
          filters: { ...state.filters, ...novoFiltro },
        })),
    }),
    {
      name: "store-conferencia-caixa",
      // @ts-ignore
      partialize: (state) => ({ filters: state.filters } as State),
    }
  )
);
