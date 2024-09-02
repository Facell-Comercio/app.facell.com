import { DateRange } from "react-day-picker";
import { create } from "zustand";

type FiltersProps = {
  tipo_data?: "data_vencimento" | "data_criacao";
  range_data?: DateRange;
  vinculados?: boolean;
  naoVinculados?: boolean;
  nome_fornecedor?: string;
  cod_barras?: string;
  filiais_list?: string[];
};
type OpenModalParams = {
  id_vencimento?: string | null;
  id_forma_pagamento?: string | null;
  filters?: FiltersProps;
};
interface UseStoreDDA {
  id_vencimento?: string | null;
  id_forma_pagamento?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  filters: FiltersProps;
  openModal: (params: OpenModalParams) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: (open?: boolean) => void;
  setFilters: (newFilters: any) => void;
  clearFilters: () => void;
}

const initialFilters: FiltersProps = {
  tipo_data: "data_vencimento",
  vinculados: undefined,
  naoVinculados: undefined,
  filiais_list: [],
  range_data: { from: undefined, to: undefined },
};

export const useStoreDDA = create<UseStoreDDA>(
  (set) => ({
    id_vencimento: null,
    id_forma_pagamento: null,
    modalOpen: false,
    modalEditing: false,
    filters: { ...initialFilters },

    openModal: ({
      id_vencimento,
      id_forma_pagamento,
      filters: newFilters,
    }) => {
      return set(() => ({
        modalOpen: true,
        id_vencimento: id_vencimento || null,
        id_forma_pagamento:
          id_forma_pagamento || null,
        filters: {
          ...initialFilters,
          ...newFilters,
        },
      }));
    },
    closeModal: () =>
      set({
        modalOpen: false,
        id_forma_pagamento: null,
        id_vencimento: null,
      }),
    editModal: (bool) =>
      set({ modalEditing: bool }),
    toggleModal: (open) => {
      return set((state) => ({
        modalOpen:
          open !== undefined
            ? open
            : !state.modalOpen,
        modalEditing: false,
      }));
    },
    setFilters: (newFilters) =>
      set((state) => ({
        filters: {
          ...state.filters,
          ...newFilters,
        },
      })),
    clearFilters: () =>
      set({ filters: { ...initialFilters } }),
  })
);
