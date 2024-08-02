import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  nome?: string;
  id_filial?: string;
  id_grupo_economico?: string;
  cpf?: string;
  cargo?: string;
  tipo_data?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  nome: "",
  id_filial: "",
  id_grupo_economico: "",
  cpf: "",
  cargo: "",
  tipo_data: "ref",
  range_data: { from: undefined, to: undefined },
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
  idSelection: number[];
  filters: Filters;
}

export interface SortingItem {
  id: string;
  desc: boolean;
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

export const useStoreTableMetas = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},
  idSelection: [],

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

  handleRowSelection: (data: HandleRowSelectionProps) =>
    set({ rowSelection: data.rowSelection, idSelection: data.idSelection }),
}));
