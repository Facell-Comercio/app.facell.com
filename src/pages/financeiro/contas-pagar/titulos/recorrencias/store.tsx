import { create } from "zustand";

type Filters = {
  ano?: string | number;
  mes?: string | number;
};

const initialFilters: Filters = {
  ano: new Date().getFullYear(),
  mes: new Date().getMonth() + 1,
};

interface UseStoreRecorrencias {
  id?: string | null;
  modalOpen: boolean;
  filters: Filters;

  modalEditRecorrenciaOpen: boolean;
  data_vencimento?: Date;
  valor?: number;

  openModalEditRecorrencia: (
    id: string,
    data_vencimento: Date,
    valor: number
  ) => void;
  closeModalEditRecorrencia: () => void;

  openModal: (id: string) => void;
  closeModal: () => void;
  toggleModal: () => void;

  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
}

export const useStoreRecorrencias = create<UseStoreRecorrencias>((set) => ({
  id: null,
  modalOpen: false,
  filters: initialFilters,

  modalEditRecorrenciaOpen: false,
  data_vencimento: undefined,
  valor: undefined,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false }),
  toggleModal: () =>
    set((state) => ({
      modalOpen: !state.modalOpen,
      modalEditing: false,
    })),
  setFilters: (novoFiltro) =>
    set((state) => ({
      ...state,
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({ filters: initialFilters });
  },

  openModalEditRecorrencia: (
    id: string,
    data_vencimento: Date,
    valor: number
  ) => set({ modalEditRecorrenciaOpen: true, id, data_vencimento, valor }),
  closeModalEditRecorrencia: () =>
    set({
      modalEditRecorrenciaOpen: false,
      data_vencimento: undefined,
      valor: undefined,
    }),
}));
