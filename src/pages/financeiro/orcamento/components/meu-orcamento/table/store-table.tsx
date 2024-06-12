// import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  mes?: string;
  ano?: string;
  id_grupo_economico?: string;
  id_centro_custo?: string;
  plano_contas?: string;
}

const initialFilters: Filters = {
  mes: (new Date().getMonth() + 1).toString(),
  ano: new Date().getFullYear().toString(),
  id_grupo_economico: "",
  id_centro_custo: "",
  plano_contas: "",
};

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
  filters: Filters;

  modalOpen: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
  setRowSelection: (rowSelection: RowSelection) => void;

  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useStoreTableMeuOrcamento = create<State & Actions>((set) => ({
  // Modal
  modalOpen: false,

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
      pagination: { pageIndex: 0, pageSize: 15 },
    })),
  resetFilters: () => {
    set({
      filters: initialFilters,
      pagination: { pageIndex: 0, pageSize: 15 },
    });
  },

  setPagination: (pagination) => set({ pagination }),
  setRowSelection: (rowSelection) => set({ rowSelection }),

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
