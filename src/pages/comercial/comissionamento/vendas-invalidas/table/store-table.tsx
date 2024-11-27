import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface Filters {
  status_list?: string[];
  tipo_list?: string[];
  segmento_list?: string[];
  motivo?: string;
  termo?: string;
}

const initialFilters: Filters = {
  status_list: [],
  tipo_list: [],
  segmento_list: [],
  motivo: "",
  termo: "",
};

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  filters: Filters;

  modalAlteracaoLoteOpen: boolean;

  mes?: string;
  ano?: string;
}

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;

  setMes: (mes: string) => void;
  setAno: (ano: string) => void;

  // MODAL
  openModalAlteracaoLote: () => void;
  closeModalAlteracaoLote: () => void;
}

export const useStoreTableVendasInvalidadas = create<State & Actions>((set) => ({
  // Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,

  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...novoFiltro,
      },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setPagination: (pagination) => set({ pagination }),

  setMes: (mes: string) => set(() => ({ mes })),
  setAno: (ano: string) => set(() => ({ ano })),

  // Modal
  modalAlteracaoLoteOpen: false,
  openModalAlteracaoLote: () => set({ modalAlteracaoLoteOpen: true }),
  closeModalAlteracaoLote: () => set({ modalAlteracaoLoteOpen: false }),
}));
