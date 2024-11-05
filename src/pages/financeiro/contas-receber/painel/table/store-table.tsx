import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface State {
  rowCount: number;
  paginationCanceladas: Pagination;
}

export interface Actions {
  setPaginationCanceladas: (pagination: Pagination) => void;
}

export const useStoreTablePainel = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  // sorting: [],
  paginationCanceladas: { pageIndex: 0, pageSize: 15 },

  // Filters

  setPaginationCanceladas: (pagination) => set({ paginationCanceladas: pagination }),
}));
