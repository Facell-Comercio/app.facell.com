
import { create } from "zustand";
import { mountStoreDevtool } from 'simple-zustand-devtools';

const initialFilters = {
  id: '',
  id_grupo_economico: null,
  id_status: null,
  tipo_data: 'data_vencimento',
  range_data: {from: undefined, to: undefined},
  descricao: '',
  nome_user: null,
}

export const useStoreTablePagar = create(set=>({
  // Table
  titulos: [],
  rowCount: 0,
  sorting: [],
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  setDataTitulos: (data)=>set({titulos: data?.rows || [], rowCount: data?.rowCount || 0}),
  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro)=>set(state=>({...state, filters: {...state.filters, ...novoFiltro}})),
  resetFilters: ()=>{set(state=>({ filters: initialFilters}))},
  
  setSorting: (sorting)=>set(({sorting})),
  setPagination: (pagination)=>set(({pagination})),
  setRowSelection: (rowSelection)=>set(({rowSelection}))
}))


  mountStoreDevtool('useStoreTablePagar', useStoreTablePagar);
