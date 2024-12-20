import { User } from "@/types/user-type";
import { create } from "zustand";
import { ItemEstoqueFardamento } from "../../types";

type ItemConcessaoVendaFardamento = ItemEstoqueFardamento & { qtde: number };
interface useStoreConcederVenderFardamento {
  modalEditing: boolean;
  modalOpen: boolean;

  receptor?: User;
  items: ItemConcessaoVendaFardamento[];
  operacao?: "concessao" | "venda";

  openModal: () => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;

  addItem: (item: ItemConcessaoVendaFardamento) => void;
  deletItem: (id: ItemConcessaoVendaFardamento["id"]) => void;
}

export const useStoreConcederVenderFardamento = 
  create<useStoreConcederVenderFardamento>((set) => ({
    modalEditing: false,
    modalOpen: false,
    
    receptor: undefined,
    items: [],
    operacao: undefined,
    
    openModal: () => set({ modalOpen: true }),
    closeModal: () => set({ modalOpen: false }),
    editModal: (bool) => set({ modalEditing: bool }),
    
    addItem: (item) =>
      set((state) => {
        const findItem = state.items.find(
          (selectedItem) => selectedItem.id == item.id
        );
        if (findItem && findItem.saldo > findItem.qtde) {
          findItem.qtde++;
          return {
            items: state.items.map((i) => (i.id == findItem.id ? findItem : i)),
          };
        } else {
          return { items: [...state.items, item] };
        }
      }),
    deletItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),
  }));
