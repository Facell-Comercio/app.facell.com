
import { create } from "zustand";
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { DateRange } from "react-day-picker";
import { OnChangeFn, SortingState } from "@tanstack/react-table";

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
  id?: string
  id_grupo_economico?: number
  id_status?: number
  tipo_data?: string
  range_data?: DateRange
  descricao?: string
  nome_user?: string
}

const initialFilters: Filters = {
  id: '',
  id_grupo_economico: "",
  id_status: null,
  tipo_data: 'data_vencimento',
  range_data: { from: undefined, to: undefined },
  descricao: '',
  nome_user: null,
}

export interface State {
  rowCount: number
  sorting: any[]
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

export const useStoreTablePagar = create<State & Actions>(set => ({
  // Table
  rowCount: 0,
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) => set(state => ({ ...state, filters: { ...state.filters, ...novoFiltro } })),
  resetFilters: () => { set(({ filters: initialFilters })) },

  setSorting: (sorting) => set(({ sorting })),
  setPagination: (pagination) => set(({ pagination })),
  // @ts-ignore
  setRowSelection: (rowSelection) => set(({ rowSelection }))
}))


mountStoreDevtool('useStoreTablePagar', useStoreTablePagar);
