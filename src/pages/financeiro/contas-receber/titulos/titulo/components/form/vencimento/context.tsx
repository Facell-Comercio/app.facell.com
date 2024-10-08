import { create } from "zustand";
import { calcularDataPrevisaoPagamento } from "../../../helpers/helper";

export interface State {
  indexFieldArray?: number;
  vencimento: {
    id?: string;
    data_vencimento: string;
    valor: string;
  };
  modalOpen: boolean;
}

export const initialStateVencimento = {
  indexFieldArray: undefined,
  vencimento: {
    id: "",
    data_vencimento: String(calcularDataPrevisaoPagamento(new Date())),
    valor: "",
  },
  modalOpen: false,
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
}));
