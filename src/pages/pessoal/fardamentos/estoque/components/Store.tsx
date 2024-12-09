import { create } from "zustand";
 interface useStoreEstoque {
    id: number | null;
    modalEditing: boolean;
    modalOpen: boolean;
  
    openModal: (id: number | null) => void;
    closeModal: () => void;
    editModal: (bool: boolean) => void;
 }

 export const useStoreEstoque = create<useStoreEstoque>((set) => ({
    id: null,
    modalEditing: false,
    modalOpen: false,
  
    openModal: (id: number | null) => set({ modalOpen: true, id: id }),
    closeModal: () => set({ modalOpen: false }),
    editModal: (bool) => set({ modalEditing: bool }),
  }));
  