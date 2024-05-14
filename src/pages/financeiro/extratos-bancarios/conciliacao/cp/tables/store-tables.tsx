import { RowSelectionState } from "@tanstack/react-table";
import { DateRange } from "react-day-picker";
import { create } from "zustand";
import { TitulosConciliarProps } from "./TitulosConciliar";
import { TransacaoConciliarProps } from "./TransacoesConciliar";

type RowSelection = Record<number, boolean>;

type HandleRowSelectioTitulosProps = {
  rowSelection: RowSelectionState;
  titulosSelection: TitulosConciliarProps[];
};

type HandleRowSelectionTransacoesProps = {
  rowSelection: RowSelectionState;
  transacoesSelection: TransacaoConciliarProps[];
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
  rowTitulosSelection: RowSelection;
  rowTransacoesSelection: RowSelection;
  titulosSelection: TitulosConciliarProps[];
  transacoesSelection: TransacaoConciliarProps[];
  filters: Filters;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: () => void;
  setFiltersSearch: (filters: FiltersSearchProps) => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;

  handleRowTitulosSelection: (data: HandleRowSelectioTitulosProps) => void;
  handleRowTransacoesSelection: (
    data: HandleRowSelectionTransacoesProps
  ) => void;
}

export const useStoreTableConciliacaoCP = create<UseStoreTableConciliacaoCP>(
  (set) => ({
    id: null,
    modalEditing: false,
    modalOpen: false,
    filtersSearch: initialFiltersSearch,

    isAllSelected: false,
    rowTitulosSelection: {},
    rowTransacoesSelection: {},
    titulosSelection: [],
    transacoesSelection: [],

    // Filters
    filters: initialFilters,
    setFilters: (novoFiltro) =>
      set((state) => ({
        filters: { ...state.filters, ...novoFiltro },
      })),
    resetFilters: () => {
      set({ filters: initialFilters });
    },

    openModal: (id: string) => set({ modalOpen: true, id }),
    closeModal: () => set({ modalOpen: false }),
    editModal: (bool) => set({ modalEditing: bool }),
    toggleModal: () =>
      set(() => ({
        modalOpen: false,
        modalEditing: false,
      })),
    setFiltersSearch: (novoFiltro) =>
      set((state) => ({
        filtersSearch: { ...state.filtersSearch, ...novoFiltro },
      })),
    handleRowTitulosSelection: (data: HandleRowSelectioTitulosProps) =>
      set({
        rowTitulosSelection: data.rowSelection,
        titulosSelection: data.titulosSelection,
      }),
    handleRowTransacoesSelection: (data: HandleRowSelectionTransacoesProps) =>
      set({
        rowTransacoesSelection: data.rowSelection,
        transacoesSelection: data.transacoesSelection,
      }),
  })
);
