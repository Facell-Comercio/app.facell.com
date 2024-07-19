import { DateRange } from 'react-day-picker';
import { create } from 'zustand';

export interface Filters {
  level?: string;
  module?: string;
  origin?: string;
  method?: string;
  range_data?: DateRange;
}

const initialFilters: Filters = {
  level: '50',
  module: '',
  origin: '',
  method: '',
  range_data: { from: undefined, to: undefined },
};

export interface State {
  id?: string | null;
  time?: string | null;
  modalOpen: boolean;

  filters: Filters;
}

export interface Actions {
  openModal: (id: string, time: string) => void;
  closeModal: () => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreLogs = create<State & Actions>((set) => ({
  id: null,
  time: null,
  modalOpen: false,
  filters: initialFilters,

  openModal: (id: string, time: string) => set({ modalOpen: true, id, time }),
  closeModal: () => set({ modalOpen: false, id: null, time: null }),

  setFilters: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },
}));
