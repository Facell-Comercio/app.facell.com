
import { OnChangeFn, SortingState } from "@tanstack/react-table";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { create } from "zustand";

export interface Pagination {
  pageIndex: number
  pageSize: number
}

type RowSelection = Record<number, boolean>

// ^ Conferir
// export interface RangeData {
//   from?: string,
//   to?: string,
// }

export interface Filters {
  termo?: string
}

const initialFilters: Filters = {
  termo: '',
}

export interface State {
  rowCount: number
  sorting: SortingItem[]
  pagination: Pagination
  isAllSelected: boolean
  rowSelection: RowSelection
  filters: Filters

}

export interface SortingItem {
  id: string,
  desc: boolean,
}

export interface Actions {
  setFilters: (filters: Filters) => void,
  resetFilters: () => void,
  setSorting: OnChangeFn<SortingState>,
  setPagination: (pagination: Pagination) => void,
  setRowSelection: (rowSelection: RowSelection) => void,
}

export const useStoreTablePlanoContas = create<State & Actions>(set => ({
  // Table
  rowCount: 0,
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) => set(({ filters: novoFiltro })),
  resetFilters: () => { set(({ filters: initialFilters })) },

  setSorting: (sorting) => set(({ sorting })),
  setPagination: (pagination) => set(({ pagination })),
  setRowSelection: (rowSelection) => set(({ rowSelection }))
}))


mountStoreDevtool('useStoreTablePlanoContas', useStoreTablePlanoContas);
