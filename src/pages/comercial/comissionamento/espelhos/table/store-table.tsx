import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface Filters {
  id_grupo_economico?: string;
  tipo_meta?: string;
  ciclo_pagamento?: string;
  mes?: string;
  ano?: string;
}

const initialFilters: Filters = {
  id_grupo_economico: "",
  ciclo_pagamento: "",
  tipo_meta: "",
  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),
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

export const useStoreTableEspelhos = create<
  State & Actions
>((set) => ({
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
