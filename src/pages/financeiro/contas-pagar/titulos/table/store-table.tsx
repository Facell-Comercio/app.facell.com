import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id?: string;
  forma_pagamento_list?: string[];
  grupo_economico_list?: string[];
  status_list?: string[];
  tipo_data?: string;
  range_data?: DateRange;
  descricao?: string;
  nome_user?: string;
  nome_fornecedor?: string;
  filial?: string;
  num_doc?: string;
}

const initialFilters: Filters = {
  id: "",
  forma_pagamento_list: [],
  grupo_economico_list: [],
  status_list: [],
  tipo_data: "data_vencimento",
  range_data: { from: undefined, to: undefined },
  descricao: "",
  nome_user: "",
  nome_fornecedor: "",
  filial: "",
  num_doc: "",
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

export const useStoreTablePagar = create<State & Actions>((set) => ({
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
