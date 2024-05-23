import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { VencimentosConciliarProps } from "./TitulosConciliar";
import { TransacoesConciliadasProps } from "./TransacoesConciliadas";
import { TransacoesConciliarProps } from "./TransacoesConciliar";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

type RowSelection = Record<number, boolean>;

type HandleRowSelectioVencimentosProps = {
  rowSelection: RowSelectionState;
  vencimentosSelection: VencimentosConciliarProps[];
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

interface UseStoreTableConciliacaoCP {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  filtersSearch: FiltersSearchProps | undefined;
  isAllSelected: boolean;
  rowVencimentosSelection: RowSelection;
  rowTransacoesSelection: RowSelection;
  vencimentosSelection: VencimentosConciliarProps[];
  transacoesSelection: TransacoesConciliarProps[];
  filters: Filters;
  tipoConciliacao?: "manual" | "automatica";
  data_pagamento?: string;
  canSelect: boolean;
  showAccordion?: boolean;
  pagination: Pagination;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  handlevencimentosSelection: (titulo: VencimentosConciliarProps) => void;
  handleTransacoesSelection: (transacao: TransacoesConciliadasProps) => void;
  toggleModal: () => void;
  setFiltersSearch: (filters: FiltersSearchProps) => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;

  setTipoConciliacao: (tipo: "manual" | "automatica") => void;
  resetTipoConciliacao: () => void;

  handlerowVencimentosSelection: (
    data: HandleRowSelectioVencimentosProps
  ) => void;
  handleRowTransacoesSelection: (
    data: HandleRowSelectionTransacoesProps
  ) => void;
  resetSelections: () => void;
  setCanSelect: (bool: boolean) => void;
  setShowAccordion: (bool: boolean) => void;
  setDataPagamento: (data?: string) => void;

  setPagination: (pagination: Pagination) => void;
}

export const useStoreTableConciliacaoCP = create<UseStoreTableConciliacaoCP>(
  (set) => ({
    id: null,
    modalEditing: false,
    modalOpen: false,
    filtersSearch: initialFiltersSearch,
    tipoConciliacao: undefined,
    canSelect: false,
    showAccordion: false,

    isAllSelected: false,
    rowVencimentosSelection: {},
    rowTransacoesSelection: {},
    vencimentosSelection: [],
    transacoesSelection: [],
    data_pagamento: undefined,
    pagination: { pageIndex: 0, pageSize: 15 },

    // Filters
    filters: initialFilters,
    setFilters: (novoFiltro) =>
      set((state) => ({
        filters: { ...state.filters, ...novoFiltro },
      })),
    resetFilters: () => {
      set({ filters: initialFilters });
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
    handlevencimentosSelection: (titulo) =>
      set((state) => {
        const tituloExists = state.vencimentosSelection
          .map((vencimento) => vencimento.id_vencimento)
          .includes(titulo.id_vencimento);

        if (tituloExists) {
          return {
            vencimentosSelection: state.vencimentosSelection.filter(
              (selectedTitulo) =>
                selectedTitulo.id_vencimento !== titulo.id_vencimento
            ),
          };
        } else {
          return {
            vencimentosSelection: [...state.vencimentosSelection, titulo],
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
              (selectedTitulo) =>
                selectedTitulo.id_transacao !== transacao.id_transacao
            ),
          };
        } else {
          return {
            transacoesSelection: [...state.transacoesSelection, transacao],
          };
        }
      }),
    toggleModal: () =>
      set(() => ({
        modalOpen: false,
        modalEditing: false,
      })),
    setFiltersSearch: (novoFiltro) =>
      set((state) => ({
        filtersSearch: { ...state.filtersSearch, ...novoFiltro },
      })),
    handlerowVencimentosSelection: (data: HandleRowSelectioVencimentosProps) =>
      set({
        rowVencimentosSelection: data.rowSelection,
        vencimentosSelection: data.vencimentosSelection,
      }),
    handleRowTransacoesSelection: (data: HandleRowSelectionTransacoesProps) =>
      set({
        rowTransacoesSelection: data.rowSelection,
        transacoesSelection: data.transacoesSelection,
      }),
    resetSelections: () =>
      set({
        rowVencimentosSelection: {},
        rowTransacoesSelection: {},
        vencimentosSelection: [],
        transacoesSelection: [],
        canSelect: false,
      }),
    setCanSelect: (bool) => set({ canSelect: bool }),
    setShowAccordion: (bool) => set({ showAccordion: bool }),
    setDataPagamento: (dataPagamento) =>
      set({
        data_pagamento: dataPagamento,
      }),
    setPagination: (pagination) => set({ pagination }),
  })
);
