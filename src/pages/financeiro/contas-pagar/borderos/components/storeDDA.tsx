import { create } from "zustand";

interface UseStoreDDA {
  id?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  filters: any,
  openModal: (filters: any) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: (open?: boolean)=>void;
  setFilters: (newFilters: any)=>void
  clearFilters: ()=>void
}

export const useStoreDDA = create<UseStoreDDA>((set) => ({
  modalEditing: false,
  modalOpen: false,
  modalTransferOpen: false,
  modalContasBancariasOpen: false,
  filters: {},

  openModal: (filters) => set({ modalOpen: true, filters }),
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: (open) => {
    return set((state) => ({
      modalOpen: open !== undefined ? open : !state.modalOpen,
      modalEditing: false,
    }))},
    setFilters: (newFilters)=> set(prev=>({ filters: {...prev.filters, ...newFilters}})),
    clearFilters: ()=>set(({ filters: {}}))
  
}));
