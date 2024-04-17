import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id?: string;
  id_grupo_economico?: string;
  id_status?: string;
  tipo_data?: string;
  range_data?: DateRange;
  descricao?: string;
  nome_user?: string;
}

const initialFilters: Filters = {
  id: "",
  id_grupo_economico: "",
  id_status: "",
  tipo_data: "data_vencimento",
  range_data: { from: undefined, to: undefined },
  descricao: "",
  nome_user: undefined,
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
  filters: Filters;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
  setRowSelection: (rowSelection: RowSelection) => void;
}

export const useStoreTablePagar = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  // sorting: [],
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

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
  setRowSelection: (rowSelection) => set({ rowSelection }),
}));
