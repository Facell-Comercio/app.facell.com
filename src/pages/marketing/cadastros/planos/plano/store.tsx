import { create } from "zustand";

interface useStorePlanoMailing {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  isPending: boolean;

  openModal: (id: string) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  editIsPending: (bool: boolean) => void;
}

// FOI NECESSÁRIO COLOCAR ESSE NOME GIGANTE POIS ESTAVA DANDO ERRO EM DESENVOLVIMENTO (BUG)
const useStorePlanoMailing = create<useStorePlanoMailing>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,
  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
export default useStorePlanoMailing;
