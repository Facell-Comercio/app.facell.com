import { ItemContaBancariaProps } from "@/pages/financeiro/components/ModalContasBancarias";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

type FiltersExtratosBancarios = {
  range_data?: DateRange;
  descricao?: string;
};

const initialFiltersExtratosBancarios = {
  range_data: { from: undefined, to: undefined },
  descricao: "",
};

type FiltersVencimentos = {
  range_data_vencimentos?: DateRange;
  descricao_titulo?: string;
  id_fornecedor?: string;
  fornecedor?: string;
  num_doc?: string;
};

const initialFiltersVencimentos = {
  range_data_vencimentos: { from: undefined, to: undefined },
  descricao_titulo: "",
  id_fornecedor: "",
  fornecedor: "",
  num_doc: "",
};

export interface State {
  conta_bancaria: ItemContaBancariaProps | null;
  filters_extratos_bancarios: FiltersExtratosBancarios;
  filters_vencimentos: FiltersVencimentos;
}

export interface Actions {
  setFiltersExtratosBancarios: (filters: FiltersExtratosBancarios) => void;
  resetFiltersExtratosBancarios: () => void;

  setFiltersVencimentos: (filters: FiltersVencimentos) => void;
  resetFiltersVencimentos: () => void;

  setContaBancaria: (conta: ItemContaBancariaProps | null) => void;
}

export const useStoreTableModalRecebimentos = create<State & Actions>((set) => ({
  conta_bancaria: null,
  filters_extratos_bancarios: initialFiltersExtratosBancarios,
  filters_vencimentos: initialFiltersVencimentos,

  setFiltersExtratosBancarios: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters_extratos_bancarios: { ...state.filters_extratos_bancarios, ...novoFiltro },
    })),
  resetFiltersExtratosBancarios: () => {
    set({ filters_extratos_bancarios: initialFiltersExtratosBancarios });
  },

  setFiltersVencimentos: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters_vencimentos: { ...state.filters_vencimentos, ...novoFiltro },
    })),
  resetFiltersVencimentos: () => {
    set({ filters_vencimentos: initialFiltersVencimentos });
  },

  setContaBancaria: (conta) =>
    set({
      conta_bancaria: conta,
      filters_extratos_bancarios: initialFiltersExtratosBancarios,
      filters_vencimentos: initialFiltersVencimentos,
    }),
}));
