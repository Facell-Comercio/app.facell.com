import { endOfMonth, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import { create } from "zustand";

export type ContaBancaria = {
  id: number;
  descricao: string;
  banco: string;
  id_matriz?: string;
  id_filial?: string;
};

interface store {
  contaBancaria?: ContaBancaria;
  modalOpen: boolean;
  periodo: DateRange;
  mes: string;
  ano: string;

  setContaBancaria: (conta: ContaBancaria) => void;
  setMes: (mes: string) => void;
  setAno: (ano: string) => void;
  toggleModal: () => void;
  setPeriodo: (range: DateRange) => void;
}

export const useExtratosStore = create<store>((set) => ({
  contaBancaria: undefined,
  modalOpen: false,
  periodo: {
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  },
  mes: String(new Date().getMonth() + 1),
  ano: String(new Date().getFullYear()),

  setContaBancaria: async (conta: ContaBancaria) => {
    set({ contaBancaria: conta });
  },
  setMes: (mes: string) => {
    set((state) => ({
      mes,
      periodo: {
        from: startOfMonth(new Date(parseInt(state.ano), parseInt(mes) - 1, 1)),
        to: endOfMonth(new Date(parseInt(state.ano), parseInt(mes) - 1, 1)),
      },
    }));
  },
  setAno: (ano: string) => {
    set((state) => ({
      ano,
      periodo: {
        from: startOfMonth(new Date(parseInt(ano), parseInt(state.mes) - 1, 1)),
        to: endOfMonth(new Date(parseInt(ano), parseInt(state.mes) - 1, 1)),
      },
    }));
  },
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),
  setPeriodo: (range: DateRange) => set({ periodo: range }),

}));
