import { create } from "zustand";

type RecebimentoDataProps = {
  id_matriz: string;
  id_vencimento: string;
};

export interface State {
  id_vencimento: string | null;
  id_matriz: string | null;
  modalRecebimentoBancarioOpen: boolean;
  modalRecebimentoManualOpen: boolean;
  modalVencimentosOpen: boolean;

  isPending: boolean;
}

export interface Actions {
  openModaVencimento: () => void;
  closeModaVencimento: () => void;

  openModalRecebimentoManual: (recebimento: RecebimentoDataProps) => void;
  closeModalRecebimentoManual: () => void;

  openModalRecebimentoBancario: (recebimento?: RecebimentoDataProps) => void;
  closeModalRecebimentoBancario: () => void;

  editIsPending: (bool: boolean) => void;
}

export const useStoreRecebimentos = create<State & Actions>((set) => ({
  id_vencimento: null,
  id_matriz: null,
  modalRecebimentoBancarioOpen: false,
  modalRecebimentoManualOpen: false,
  modalVencimentosOpen: false,

  isPending: false,

  //* MODAL VENCIMENTO
  openModaVencimento: () =>
    set({
      modalVencimentosOpen: true,
    }),
  closeModaVencimento: () => set({ modalVencimentosOpen: false }),

  //* RECEBIMENTO MANUAL  (VINCULADO A UM VENCIMENTO)
  openModalRecebimentoManual: ({ id_matriz, id_vencimento }) =>
    set({
      modalRecebimentoManualOpen: true,
      id_vencimento,
      id_matriz,
    }),
  closeModalRecebimentoManual: () =>
    set({
      modalRecebimentoManualOpen: false,
      id_vencimento: null,
      id_matriz: null,
    }),

  //* RECEBIMENTO BANCÁRIO
  openModalRecebimentoBancario: (recebimento) =>
    set({
      modalRecebimentoBancarioOpen: true,
      id_vencimento: recebimento?.id_vencimento || null,
      id_matriz: recebimento?.id_matriz || null,
    }),
  closeModalRecebimentoBancario: () =>
    set({
      modalRecebimentoBancarioOpen: false,
      id_vencimento: null,
      id_matriz: null,
    }),

  openModalVencimento: () => set({ modalVencimentosOpen: true }),
  editIsPending: (bool) => set({ isPending: bool }),
}));
