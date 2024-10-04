// import { mountStoreDevtool } from "simple-zustand-devtools";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  grupo_estoque?: string;
  subgrupo?: string;
  areas?: string[];
  data_pedido?: Date | string;
  valor_minimo?: string;
  valor_maximo?: string;
  filial?: string;
  descricao?: string;
  plano_habilitacao?: string;
  modalidade_venda?: string;
  fabricante?: string;
  tipo_pedido?: string;
  fidelizacao_aparelho?: string;
  fidelizacao_plano?: string;
}

const initialFilters: Filters = {
  grupo_estoque: "APARELHO",
  subgrupo: "",
  areas: [],
  data_pedido: "",
  valor_minimo: "0.00",
  valor_maximo: "",
  filial: "",
  descricao: "",
  plano_habilitacao: "",
  modalidade_venda: "",
  fabricante: "",
  tipo_pedido: "",
  fidelizacao_aparelho: "all",
  fidelizacao_plano: "all",
};

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
  filters: Filters;

  modalOpen: boolean;
}

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
  setRowSelection: (rowSelection: RowSelection) => void;

  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useStoreTableClientes = create<State & Actions>((set) => ({
  // Modal
  modalOpen: false,

  // Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  // Filters
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
      pagination: { pageIndex: 0, pageSize: 15 },
    })),
  resetFilters: () => {
    set({
      filters: initialFilters,
      pagination: { pageIndex: 0, pageSize: 15 },
    });
  },

  setPagination: (pagination) => set({ pagination }),
  setRowSelection: (rowSelection) => set({ rowSelection }),

  openModal: () => set({ modalOpen: true }),
  closeModal: () => set({ modalOpen: false }),
}));
