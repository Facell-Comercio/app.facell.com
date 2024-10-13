import { create } from "zustand";

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

  openModalRecebimentoManual: ({
    id_matriz,
    id_vencimento,
  }: {
    id_matriz: string;
    id_vencimento: string;
  }) => void;
  closeModalRecebimentoManual: () => void;

  openModalRecebimentoBancario: () => void;
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
  openModalRecebimentoBancario: () =>
    set({
      modalRecebimentoBancarioOpen: true,
    }),
  closeModalRecebimentoBancario: () =>
    set({
      modalRecebimentoBancarioOpen: false,
    }),

  openModalVencimento: () => set({ modalVencimentosOpen: true }),
  editIsPending: (bool) => set({ isPending: bool }),
}));
