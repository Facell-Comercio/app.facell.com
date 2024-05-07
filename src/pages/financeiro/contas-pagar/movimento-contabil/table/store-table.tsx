import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id_grupo_economico?: string;
  id_conta_bancaria?: string;
  conta_bancaria?: string;
  grupo_economico?: string;
  mes?: string;
  ano?: string;
  id_matriz?: string;
}

const initialFilters: Filters = {
  id_conta_bancaria: "",
  id_grupo_economico: "",
  conta_bancaria: "",
  grupo_economico: "",
  mes: "",
  ano: "",
  id_matriz: "",
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
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
  setRowSelection: (rowSelection: RowSelection) => void;
}

export const useStoreTableMovimentoContabil = create<State & Actions>(
  (set) => ({
    // Table
    rowCount: 0,
    pagination: { pageIndex: 0, pageSize: 15 },
    isAllSelected: false,
    rowSelection: {},

    // Filters
    filters: initialFilters,
    setFilters: (novoFiltro) =>
      set((state) => ({
        filters: { ...state.filters, ...novoFiltro },
      })),
    resetFilters: () => {
      set({ filters: initialFilters });
    },

    setPagination: (pagination) => set({ pagination }),
    setRowSelection: (rowSelection) => set({ rowSelection }),
  })
);
