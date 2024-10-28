// import { mountStoreDevtool } from "simple-zustand-devtools";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  //* LISTAS
  grupo_estoque_list?: string[];
  subgrupo_list?: string[];
  uf_list?: string[];
  filiais_list?: string[];
  plano_habilitado_list?: string[];
  modalidade_venda_list?: string[];
  fabricante_list?: string[];
  tipo_pedido_list?: string[];
  produto_compra_list?: string[];

  range_data_pedido?: DateRange;
  valor_minimo?: string;
  valor_maximo?: string;
  fidelizacao_aparelho?: string;
  fidelizacao_plano?: string;

  //* OUTROS
  status_plano?: string[];
  produtos_cliente?: string[];
}

const initialFilters: Filters = {
  grupo_estoque_list: [],
  subgrupo_list: [],
  uf_list: [],
  filiais_list: [],
  plano_habilitado_list: [],
  modalidade_venda_list: [],
  fabricante_list: [],
  tipo_pedido_list: [],
  produto_compra_list: [],

  range_data_pedido: { from: undefined, to: undefined },
  // range_data_pedido: { from: undefined, to: subYears(new Date(), 1) },
  valor_minimo: "0.00",
  valor_maximo: "",
  fidelizacao_aparelho: "all",
  fidelizacao_plano: "all",

  //* OUTROS
  produtos_cliente: [],
  status_plano: ["Ativo", "Desativado", "Analise pendente"],
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
