// import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  termo?: string;
  mes?: string;
  ano?: string;
}

const initialFilters: Filters = {
  termo: "",
  mes: (new Date().getMonth() + 1).toString(),
  ano: new Date().getFullYear().toString(),
  // mes: "4",
  // ano: "2024",
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
  setFilters: (novoFiltro) => set({ filters: novoFiltro }),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setPagination: (pagination) => set({ pagination }),
  setRowSelection: (rowSelection) => set({ rowSelection }),

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
