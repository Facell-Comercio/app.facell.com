import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id_titulo?: string;
  id_vencimento?: string;
  id_matriz?: string;
  filiais_list?: string[];
  id_conta_bancaria?: string;
  fornecedor?: string;
  descricao?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  id_titulo: "",
  id_vencimento: "",
  id_matriz: "",
  filiais_list: [],
  id_conta_bancaria: "",
  fornecedor: "",
  descricao: "",
  range_data: { from: undefined, to: undefined },
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  filters: Filters;
  rowSelection: RowSelection;
  idSelection: number[];
}
type HandleRowSelectionProps = {
  rowSelection: RowSelectionState;
  idSelection: number[];
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
  handleRowSelection: (data: HandleRowSelectionProps) => void;
}

export const useStoreTableRecebimentos = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  // sorting: [],
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},
  idSelection: [],

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setPagination: (pagination) => set({ pagination }),
  handleRowSelection: (data: HandleRowSelectionProps) =>
    set({ rowSelection: data.rowSelection, idSelection: data.idSelection }),
}));
