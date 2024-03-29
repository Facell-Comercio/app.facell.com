import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  codigo?: string;
  descricao?: string;
  tipo?: string;
  id_grupo_economico?: string;
  ativo?: string;
}

const initialFilters: Filters = {
  codigo: "",
  descricao: "",
  tipo: "",
  id_grupo_economico: "",
  ativo: "",
};

export interface State {
  rowCount: number;
  sorting: SortingItem[];
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
  setSorting: OnChangeFn<SortingState>;
  setPagination: (pagination: Pagination) => void;
  setRowSelection: (rowSelection: RowSelection) => void;
}

export const useStoreTablePlanoContas = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  sorting: [],
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

  setSorting: (sorting) => set({ sorting }),
  setPagination: (pagination) => set({ pagination }),
  setRowSelection: (rowSelection) => set({ rowSelection }),
}));

mountStoreDevtool("useStoreTablePlanoContas", useStoreTablePlanoContas);
