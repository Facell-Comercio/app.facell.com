import { DateRange } from "react-day-picker";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id_conta_bancaria?: string;
  fornecedor?: string;
  id_titulo?: string;
  num_doc?: string;
  tipo_data?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  id_conta_bancaria: "",
  id_titulo: "",
  num_doc: "",
  tipo_data: "data_vencimento",
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
  setRowSelection: (rowSelection: RowSelection) => void;
}

export const useStoreTableBorderos = create<State & Actions>((set) => ({
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
}));

mountStoreDevtool("useStoreTableBorderos", useStoreTableBorderos);
