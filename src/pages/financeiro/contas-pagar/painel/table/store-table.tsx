import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface State {
  rowCount: number;
  paginationNegadas: Pagination;
  paginationSemNota: Pagination;
  paginationRecorrencia: Pagination;
}

export interface Actions {
  setPaginationNegadas: (pagination: Pagination) => void;
  setPaginationSemNota: (pagination: Pagination) => void;
  setPaginationRecorrencia: (pagination: Pagination) => void;
}

export const useStoreTablePainel = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  // sorting: [],
  paginationNegadas: { pageIndex: 0, pageSize: 15 },
  paginationSemNota: { pageIndex: 0, pageSize: 15 },
  paginationRecorrencia: { pageIndex: 0, pageSize: 15 },

  // Filters

  setPaginationNegadas: (pagination) => set({ paginationNegadas: pagination }),
  setPaginationSemNota: (pagination) => set({ paginationSemNota: pagination }),
  setPaginationRecorrencia: (pagination) =>
    set({ paginationRecorrencia: pagination }),
}));
