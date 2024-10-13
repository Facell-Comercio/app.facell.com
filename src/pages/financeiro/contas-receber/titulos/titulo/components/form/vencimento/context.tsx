import { create } from "zustand";

export interface State {
  indexFieldArray?: number;
  vencimento: {
    id?: string;
    data_vencimento: string;
    valor: string;
  };
  modalOpen: boolean;

  isPending: boolean;
}

export const initialStateVencimento = {
  indexFieldArray: undefined,
  vencimento: {
    id: "",
    data_vencimento: "",
    valor: "",
  },
  modalOpen: false,

  isPending: false,
};
type UpdateVencimentoProps = {
  index?: number;
  vencimento: Pick<State["vencimento"], "data_vencimento" | "id" | "valor">;
};
export interface Actions {
  newVencimento: () => void;
  updateVencimento: (data: UpdateVencimentoProps) => void;
  toggleModal: () => void;
  resetFilters: () => void;

  editIsPending: (bool: boolean) => void;
}

export const useStoreVencimento = create<State & Actions>((set) => ({
  ...initialStateVencimento,
  newVencimento: () =>
    set({
      vencimento: { ...initialStateVencimento.vencimento },
      modalOpen: true,
    }),
  updateVencimento: (data: UpdateVencimentoProps) => {
    set({
      vencimento: { ...data.vencimento },
      indexFieldArray: data.index,
      modalOpen: true,
    });
  },
  toggleModal: () => {
    set((state) => ({ modalOpen: !state.modalOpen }));
  },
  resetFilters: () => {
    set({ ...initialStateVencimento });
  },

  editIsPending: (bool) => set({ isPending: bool }),
}));
