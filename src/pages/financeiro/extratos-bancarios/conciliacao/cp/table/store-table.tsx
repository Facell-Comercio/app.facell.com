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
  conta_bancaria?: string;
  id_transacao?: string;
  descricao?: string;
  documento?: string;
  range_data?: DateRange;
  conciliado?: string;
}

const initialFilters: Filters = {
  id_conta_bancaria: "",
  conta_bancaria: "",
  id_transacao: "",
  descricao: "",
  documento: "",
  range_data: { from: undefined, to: undefined },
  conciliado: undefined,
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

export const useStoreTableConciliacaoCP = create<State & Actions>((set) => ({
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

mountStoreDevtool("useStoreTableConciliacaoCP", useStoreTableConciliacaoCP);
