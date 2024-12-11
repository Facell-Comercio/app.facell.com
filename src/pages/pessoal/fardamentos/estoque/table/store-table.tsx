import { create } from "zustand";

export interface Pagination {
    pageIndex: number
    pageSize: number
}


export interface Filters {
    id_grupo_economico?: string;
    uf?: string;
    modelo?: string;
    tamanho?: string;
    sexo?: string;
}

const initialFilters: Filters = {
    id_grupo_economico: "",
    uf: "",
    modelo: "",
    tamanho: "",
    sexo: "",
}

export interface State {
    rowCount: number;
    pagination: Pagination;
    isAllSelected: boolean;
    filters: Filters;
}

export interface SortingItem {
    id: string;
    desc: boolean;
}

export interface Actions {
    setFilters: (filters: Filters) => void;
    resetFilters: () => void;
    setPagination: (pagination: Pagination)=> void;
}

export const useStoreTableEstoque = create<State & Actions>((set) => ({
    //Table
    rowCount: 0,
    pagination: {pageIndex: 0, pageSize: 15},
    isAllSelected: false,
    rowSelection: {},
    // Filters
    filters: initialFilters,
    setFilters: (novofiltro) => 
        set((state) => ({
            filters: {...state.filters, ...novofiltro},
    })),
    resetFilters: () => {
        set({ filters: initialFilters });
      },
    
      setPagination: (pagination) => set({ pagination }),
}));
