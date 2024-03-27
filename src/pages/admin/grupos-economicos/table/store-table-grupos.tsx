
import { SortingState } from "@tanstack/react-table";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number
  pageSize: number
}

type RowSelection = Record<number, boolean>

export interface Filters {
  termo?: string
}

const initialFilters: Filters = {
  termo: '',
}

export interface SortingItem {
  id: string,
  desc: boolean,
}

export interface State {
  rowCount: number
  sorting?: SortingState
  pagination: Pagination
  isAllSelected: boolean
  rowSelection: RowSelection
  filters: Filters

  id_user: string

  modalOpen: boolean
}

export interface Actions {
  setFilters: (filters: Filters) => void,
  resetFilters: () => void,
  setSorting: (sorting: SortingState)=>void,
  setPagination: (pagination: Pagination) => void,
  setRowSelection: (rowSelection: RowSelection) => void,

  openModal: (id: string)=>void
  closeModal: ()=>void
}

export const useStoreGruposEconomicos = create<State & Actions>(set => ({
  id_user: '',
  
  // Modal
  modalOpen: false,

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
  setRowSelection: (rowSelection) => set(({ rowSelection })),

  openModal: (id_user)=>set({id_user, modalOpen: true}),
  closeModal: ()=>set({modalOpen: false})
}))
