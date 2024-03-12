
import { create } from "zustand";

export const useRateio = create((set, get, store) => ({
    valorRateio: 1000,
    itensRateio: [
        {filial: '01 TIM MIDWAY', valor: 50.00, percentual: 0.3},
        {filial: '02 TIM NATAL SHOPPING', valor: 50.00, percentual: 0.3},
        {filial: '08 TIM NORTE SHOPPING 2', valor: 50.00, percentual: 0.3},
    ],
    updateItemRateio: () => {
      set((state) => ({ valorRateio: novoValor }));
    },
    setValorRateio: (novoValor) => {
      set((state) => ({ valorRateio: novoValor }));
    },
    addItemRateio: (novoItemRateio) => {
      set(state=>({ itensRateio: [...state.itensRateio, novoItemRateio] }));
    },
    removeItemRateio: (index) => {
      set((state) => ({ itensRateio: state.itensRateio.filter((item, itemIndex) => itemIndex !== index) }));
    },
  }));