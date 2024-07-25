import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  colaborador?: string;
  id_filial?: string;
  origem?: string;
  obs?: string;
  tipo_data?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  colaborador: "",
  id_filial: "",
  origem: "",
  obs: "",
  tipo_data: "created_at",
  range_data: { from: undefined, to: undefined },
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
}

export const useStoreTableVale = create<State & Actions>((set) => ({
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
}));
