import { DateRange } from "react-day-picker";
import { create } from "zustand";

export interface State {
  filters: Filters;
}

export interface Filters {
  grupo_economico_list?: string[];
  status_list?: string[];
  tipo_data?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  grupo_economico_list: [],
  status_list: [],
  tipo_data: "data_vencimento",
  range_data: { from: undefined, to: undefined },
};

export interface Actions {
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreSolicitacoesCriadasRelatorio = create<State & Actions>((set) => ({
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
