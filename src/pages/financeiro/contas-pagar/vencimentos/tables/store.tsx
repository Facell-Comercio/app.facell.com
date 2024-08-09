import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  id_vencimento?: string;
  id_titulo?: string;
  id_grupo_economico?: string;
  id_matriz?: string;
  forma_pagamento_list?: string[];
  id_status?: string;
  tipo_data?: string;
  range_data?: DateRange;
  descricao?: string;
  nome_user?: string;
}

const initialFilters: Filters = {
  id_vencimento: "",
  id_titulo: "",
  id_grupo_economico: "",
  id_matriz: "",
  forma_pagamento_list: [],
  id_status: "",
  tipo_data: "data_vencimento",
  range_data: { from: undefined, to: undefined },
  descricao: "",
};

export interface State {
  rowCount: number;
  paginationAPagar: Pagination;
  paginationEmBordero: Pagination;
  paginationPagos: Pagination;
  isAllSelected: boolean;
  filters: Filters;
  rowSelection: RowSelection;
  idSelection: number[];
  modalOpen: boolean;
}
type HandleRowSelectionProps = {
  rowSelection: RowSelectionState;
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPaginationAPagar: (paginationAPagar: Pagination) => void;
  setPaginationEmBordero: (paginationEmBordero: Pagination) => void;
  setPaginationPagos: (paginationPagos: Pagination) => void;
  handleRowSelection: (data: HandleRowSelectionProps) => void;

  openModal: () => void;
  closeModal: () => void;
}

export const useStoreTableVencimentos = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  // sorting: [],
  paginationAPagar: { pageIndex: 0, pageSize: 15 },
  paginationEmBordero: { pageIndex: 0, pageSize: 15 },
  paginationPagos: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},
  idSelection: [],
  modalOpen: false,

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

  setPaginationAPagar: (pagination) => set({ paginationAPagar: pagination }),
  setPaginationEmBordero: (pagination) =>
    set({ paginationEmBordero: pagination }),
  setPaginationPagos: (pagination) => set({ paginationPagos: pagination }),
  handleRowSelection: (data: HandleRowSelectionProps) =>
    set({ rowSelection: data.rowSelection }),

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
})
);
