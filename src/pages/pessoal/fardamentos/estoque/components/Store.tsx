import { create } from "zustand";
import { ItemEstoqueFardamento } from "../types";
interface useStoreEstoque {
  id: ItemEstoqueFardamento["id"];
  
  modalEditing: boolean;
  modalOpen: boolean;

  openModal: (id: ItemEstoqueFardamento["id"]) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
}

export const useStoreEstoque = create<useStoreEstoque>((set) => ({
  id: null,
  
  modalEditing: false,
  modalOpen: false,

  openModal: (id) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  editModal: (bool) => set({ modalEditing: bool }),
}));
