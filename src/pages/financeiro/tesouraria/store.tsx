import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface State {
  id: string | null;
  id_extrato_bancario: string | null;
  valor_maximo_adiantamento: string | null;
  modalOpen: boolean;
  modalTransferOpen: boolean;
  modalAdiantamentoOpen: boolean;
  modalTitulosPagarOpen: boolean;

  modalEditing: boolean;
  isPending: boolean;

  // DataTable Movimentação Conta
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
  rowSelection: RowSelection;
  filters: Filters;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

export interface Filters {
  tipo_list?: string[];
  descricao?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  tipo_list: [],
  descricao: "",
  range_data: { from: undefined, to: undefined },
};

export interface Actions {
  openModal: (id: string) => void;
  closeModal: () => void;

  openTransferModal: () => void;
  closeTransferModal: () => void;

  openModalAdiantamento: () => void;
  closeAdiantamentoModal: () => void;

  openModalTitulosPagar: (data: { id: string; valor: string }) => void;
  closeTitulosPagarModal: () => void;

  setIsPending(isPending: boolean): void;
  editModal: (bool: boolean) => void;

  // DataTable Movimentação Conta
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (pagination: Pagination) => void;
}

export const useStoreTesouraria = create<State & Actions>((set) => ({
  id: null,
  id_extrato_bancario: null,
  valor_maximo_adiantamento: null,
  isPending: false,
  modalOpen: false,
  modalTransferOpen: false,
  modalAdiantamentoOpen: false,
  modalTitulosPagarOpen: false,
  modalEditing: false,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () =>
    set({
      modalOpen: false,
      id: null,
      modalEditing: false,
      id_extrato_bancario: null,
      valor_maximo_adiantamento: null,
    }),

  openTransferModal: () => set({ modalTransferOpen: true }),
  closeTransferModal: () => set({ modalTransferOpen: false }),

  openModalAdiantamento: () => set({ modalAdiantamentoOpen: true }),
  closeAdiantamentoModal: () => set({ modalAdiantamentoOpen: false }),

  openModalTitulosPagar: ({ id, valor }) =>
    set({
      modalTitulosPagarOpen: true,
      id_extrato_bancario: id,
      valor_maximo_adiantamento: Math.abs(parseFloat(valor)).toFixed(2),
    }),
  closeTitulosPagarModal: () => set({ modalTitulosPagarOpen: false }),

  setIsPending: (isPending) => set({ isPending }),

  editModal: (bool) => set({ modalEditing: bool }),

  // DataTable Movimentação Conta
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},

  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setPagination: (pagination) => set({ pagination }),
}));
