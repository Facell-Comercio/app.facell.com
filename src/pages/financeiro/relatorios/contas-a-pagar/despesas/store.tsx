import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface State {
  filters: Filters;
}

export interface Filters {
  id_grupo_economico?: string;
  tipo_data?: string;
  em_aberto?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  id_grupo_economico: "",
  em_aberto: "",
  tipo_data: "data_prevista",
  range_data: { from: undefined, to: undefined },
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreDespesasRelatorio = create<State & Actions>((set) => ({
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
