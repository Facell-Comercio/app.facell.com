import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { RecebimentosConciliarProps } from "./RecebimentosConciliar";
import { TransacoesConciliadasProps } from "./TransacoesConciliadas";
import { TransacoesConciliarProps } from "./TransacoesConciliar";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

type HandleRowSelectioRecebimentosProps = {
  rowSelection: RowSelectionState;
  recebimentosSelection: RecebimentosConciliarProps[];
};

type HandleRowSelectionTransacoesProps = {
  rowSelection: RowSelectionState;
  transacoesSelection: TransacoesConciliarProps[];
};

type FiltersSearchProps = {
  tituloConciliar?: string;
  tituloConciliado?: string;
  transacaoConciliar?: string;
  transacaoConciliada?: string;
  conciliacao?: string;
};

const initialFiltersSearch: FiltersSearchProps = {
  tituloConciliar: "",
  tituloConciliado: "",
  transacaoConciliar: "",
  transacaoConciliada: "",
  conciliacao: "",
};

export interface Filters {
  id_conta_bancaria?: string;
  conta_bancaria?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  id_conta_bancaria: "",
  conta_bancaria: "",
  range_data: { from: undefined, to: undefined },
};

export interface FiltersConciliacoes {
  id_filial?: string;
  range_data?: DateRange;
}

const initialFiltersConciliacoes: FiltersConciliacoes = {
  id_filial: "",
  range_data: { from: undefined, to: undefined },
};

interface UseStoreTableConciliacaoCR {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  filtersSearch: FiltersSearchProps | undefined;
  isAllSelected: boolean;
  rowRecebimentosSelection: RowSelection;
  rowTransacoesSelection: RowSelection;
  recebimentosSelection: RecebimentosConciliarProps[];
  transacoesSelection: TransacoesConciliarProps[];
  filters: Filters;
  filtersConciliacoes: FiltersConciliacoes;
  tipoConciliacao?: "manual" | "automatica";
  data_recebimento?: string;
  canSelect: boolean;
  showAccordion?: boolean;
  pagination: Pagination;
  paginationConciliacoes: Pagination;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  handlerecebimentosSelection: (titulo: RecebimentosConciliarProps) => void;
  handleTransacoesSelection: (transacao: TransacoesConciliadasProps) => void;
  toggleModal: () => void;
  setFiltersSearch: (filters: FiltersSearchProps) => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;

  setFiltersConciliacoes: (filtersConciliacoes: FiltersConciliacoes) => void;
  resetFiltersConciliacoes: () => void;

  setTipoConciliacao: (tipo: "manual" | "automatica") => void;
  resetTipoConciliacao: () => void;

  handlerowRecebimentosSelection: (data: HandleRowSelectioRecebimentosProps) => void;
  handleRowTransacoesSelection: (data: HandleRowSelectionTransacoesProps) => void;

  resetSelectionTransacoes: (transacao: TransacoesConciliarProps[]) => void;
  resetSelections: () => void;
  setCanSelect: (bool: boolean) => void;
  setShowAccordion: (bool: boolean) => void;
  setDataRecebimento: (data?: string) => void;

  setPagination: (pagination: Pagination) => void;
  setPaginationConciliacoes: (paginationConciliacoes: Pagination) => void;
}

export const useStoreTableConciliacaoCR = create<UseStoreTableConciliacaoCR>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  filtersSearch: initialFiltersSearch,
  tipoConciliacao: undefined,
  canSelect: false,
  showAccordion: false,

  isAllSelected: false,
  rowRecebimentosSelection: {},
  rowTransacoesSelection: {},
  recebimentosSelection: [],
  transacoesSelection: [],
  data_recebimento: undefined,
  pagination: { pageIndex: 0, pageSize: 15 },
  paginationConciliacoes: { pageIndex: 0, pageSize: 15 },

  // Filters
  filters: initialFilters,
  filtersConciliacoes: initialFiltersConciliacoes,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  setFiltersConciliacoes: (novoFiltro) =>
    set((state) => ({
      filtersConciliacoes: { ...state.filtersConciliacoes, ...novoFiltro },
    })),
  resetFiltersConciliacoes: () => {
    set({ filtersConciliacoes: initialFiltersConciliacoes });
  },

  setTipoConciliacao: (novoTipo) =>
    set({
      tipoConciliacao: novoTipo,
    }),
  resetTipoConciliacao: () => {
    set({ tipoConciliacao: undefined });
  },

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  handlerecebimentosSelection: (titulo) =>
    set((state) => {
      const tituloExists = state.recebimentosSelection
        .map((vencimento) => vencimento.id_recebimento)
        .includes(titulo.id_recebimento);

      if (tituloExists) {
        return {
          recebimentosSelection: state.recebimentosSelection.filter(
            (selectedTitulo) => selectedTitulo.id_recebimento !== titulo.id_recebimento
          ),
        };
      } else {
        return {
          recebimentosSelection: [...state.recebimentosSelection, titulo],
        };
      }
    }),
  handleTransacoesSelection: (transacao) =>
    set((state) => {
      const transacaoExists = state.transacoesSelection
        .map((transacao) => transacao.id_transacao)
        .includes(transacao.id_transacao);
      if (transacaoExists) {
        return {
          transacoesSelection: state.transacoesSelection.filter(
            (selectedTitulo) => selectedTitulo.id_transacao !== transacao.id_transacao
          ),
        };
      } else {
        return {
          transacoesSelection: [...state.transacoesSelection, transacao],
        };
      }
    }),

  resetSelectionTransacoes: (transacoes: TransacoesConciliarProps[]) => {
    set({ transacoesSelection: transacoes });
  },

  toggleModal: () =>
    set(() => ({
      modalOpen: false,
      modalEditing: false,
    })),
  setFiltersSearch: (novoFiltro) =>
    set((state) => ({
      filtersSearch: { ...state.filtersSearch, ...novoFiltro },
    })),
  handlerowRecebimentosSelection: (data: HandleRowSelectioRecebimentosProps) =>
    set({
      rowRecebimentosSelection: data.rowSelection,
      recebimentosSelection: data.recebimentosSelection,
    }),
  handleRowTransacoesSelection: (data: HandleRowSelectionTransacoesProps) =>
    set({
      rowTransacoesSelection: data.rowSelection,
      transacoesSelection: data.transacoesSelection,
    }),
  resetSelections: () =>
    set({
      rowRecebimentosSelection: {},
      rowTransacoesSelection: {},
      recebimentosSelection: [],
      transacoesSelection: [],
      canSelect: false,
    }),
  setCanSelect: (bool) => set({ canSelect: bool }),
  setShowAccordion: (bool) => set({ showAccordion: bool }),
  setDataRecebimento: (dataRecebimento) =>
    set({
      data_recebimento: dataRecebimento,
    }),
  setPagination: (pagination) => set({ pagination }),
  setPaginationConciliacoes: (paginationConciliacoes) => set({ paginationConciliacoes }),
}));
