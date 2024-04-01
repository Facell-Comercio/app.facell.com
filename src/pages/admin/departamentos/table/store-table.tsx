
import { create } from "zustand";

export interface Pagination {
  pageIndex: number
  pageSize: number
}

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
  pagination: Pagination
  isAllSelected: boolean
  filters: Filters

  id_user: string

  modalOpen: boolean
}

export interface Actions {
  setFilters: (filters: Filters) => void,
  resetFilters: () => void,

  setPagination: (pagination: Pagination) => void,

  openModal: (id: string)=>void
  closeModal: ()=>void
}

export const useStoreDepartamentos = create<State & Actions>(set => ({
  id_user: '',
  
  // Modal
  modalOpen: false,

  // Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) => set(({ filters: novoFiltro })),
  resetFilters: () => { set(({ filters: initialFilters })) },

  setPagination: (pagination) => set(({ pagination })),

  openModal: (id_user)=>set({id_user, modalOpen: true}),
  closeModal: ()=>set({modalOpen: false})
}))
