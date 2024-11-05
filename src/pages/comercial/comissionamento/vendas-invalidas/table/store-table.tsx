import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface Filters {
  mes?: string;
  ano?: string;
  status?: string;
  tipo?: string;
  segmento?: string;
  motivo?: string;
  termo?: string;
}

const initialFilters: Filters = {
  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),
  status: "",
  tipo: "",
  segmento: "",
  motivo: "",
  termo: "",
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  filters: Filters;
}

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
}

export const useStoreTableVendasInvalidas =
  create<State & Actions>((set) => ({
    // Table
    rowCount: 0,
    pagination: { pageIndex: 0, pageSize: 15 },
    isAllSelected: false,

    // Filters
    filters: initialFilters,
    setFilters: (novoFiltro) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...novoFiltro,
        },
      })),
    resetFilters: () => {
      set({ filters: initialFilters });
    },

    setPagination: (pagination) =>
      set({ pagination }),
  }));
