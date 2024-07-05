import { endOfMonth, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type ContaBancaria = {
  id: number;
  descricao: string;
  banco: string;
  id_matriz?: string;
};
export type Transacao = {
  id: number;
  id_conta_bancaria: number;
  id_transacao: string;
  created_at: Date;
  documento: string;
  data_transacao: Date;
  tipo_transacao: "CREDIT" | "DEBIT";
  valor: number;
  descricao: string;
  id_user: string;
  name_user: string;
};

interface store {
  contaBancaria?: ContaBancaria;
  modalOpen: boolean;
  periodo?: DateRange;
  transacoes: Transacao[];

  setContaBancaria: (conta: ContaBancaria) => void;
  toggleModal: () => void;
  setPeriodo: (range: DateRange) => void;
  setTransacoes: (transactions: Transacao[]) => void;
}

export const useExtratoStore = create<store>((set) => ({
  contaBancaria: undefined,
  modalOpen: false,
  periodo: {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  transacoes: [],

  setContaBancaria: async (conta: ContaBancaria) => {
    set({ contaBancaria: conta });
  },
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
  setPeriodo: (range: DateRange) => set({ periodo: range }),
  setTransacoes: (transactions: Transacao[]) =>
    set({ transacoes: transactions }),
}));
