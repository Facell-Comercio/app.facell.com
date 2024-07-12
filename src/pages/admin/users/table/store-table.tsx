
import { create } from "zustand";

export interface Pagination {
  pageIndex: number
  pageSize: number
}

type RowSelection = Record<number, boolean>

export interface Filters {
  termo?: string,
  inactives: boolean,
}

const initialFilters: Filters = {
  termo: '',
  inactives: false,
}

export interface SortingItem {
  id: string,
  desc: boolean,
}

export interface State {
  rowCount: number
  pagination: Pagination
  isAllSelected: boolean
  rowSelection: RowSelection
  filters: Filters
}

export interface Actions {
  setFilters: (filters: Filters) => void,
  resetFilters: () => void,
  setPagination: (pagination: Pagination) => void,
}

export const useStoreUsers = create<State & Actions>(set => ({
  // Table
  rowCount: 0,

  pagination: { pageIndex: 0, pageSize: 10 },
  isAllSelected: false,
  rowSelection: {},

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) => set(({ filters: novoFiltro })),
  resetFilters: () => { set(({ filters: initialFilters })) },
  setPagination: (pagination) => set(({ pagination })),
}))
