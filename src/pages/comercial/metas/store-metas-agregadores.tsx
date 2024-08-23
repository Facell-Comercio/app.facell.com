import { create } from "zustand";

interface useStoreMetasAgregadores {
  mes: string;
  ano: string;

  setMes: (mes: string) => void;
  setAno: (ano: string) => void;
}

export const useStoreMetasAgregadores = create<useStoreMetasAgregadores>(
  (set) => ({
    mes: String(new Date().getMonth() + 1),
    ano: String(new Date().getFullYear()),

    setMes: (mes: string) => {
      set({ mes });
    },
    setAno: (ano: string) => {
      set({ ano });
    },
  })
);
