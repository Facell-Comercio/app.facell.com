import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface Filters {
  status?: string;
  tipo?: string;
  segmento?: string;
  motivo?: string;
  termo?: string;
}

const initialFilters: Filters = {
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

  mes?: string;
  ano?: string;
}

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;

  setMes: (mes: string) => void;
  setAno: (ano: string) => void;
}

export const useStoreTableVendasInvalidadas = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,

  mes: String(new Date().getMonth()),
  ano: String(new Date().getFullYear()),

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

  setPagination: (pagination) => set({ pagination }),

  setMes: (mes: string) => {
    set({ mes });
  },
  setAno: (ano: string) => {
    set({ ano });
  },
}));
