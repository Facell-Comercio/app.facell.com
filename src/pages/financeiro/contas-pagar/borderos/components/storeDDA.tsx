import { create } from "zustand";

type OpenModalParams = {
  id_vencimento?: string | null,
  filters?: any
}
interface UseStoreDDA {
  id_vencimento?: string | null;
  modalEditing: boolean;
  modalOpen: boolean;
  filters: any,
  openModal: (params: OpenModalParams) => void;
  closeModal: () => void;
  editModal: (bool: boolean) => void;
  toggleModal: (open?: boolean)=>void;
  setFilters: (newFilters: any)=>void
  clearFilters: ()=>void
}

const initialFilters = {
  tipo_data: 'data_vencimento', 
  vinculados: undefined, 
  naoVinculados: undefined
}

export const useStoreDDA = create<UseStoreDDA>((set) => ({
  id_vencimento: null,
  modalOpen: false,
  modalEditing: false,
  filters: {...initialFilters},

  openModal: ({id_vencimento, filters: newFilters}) => {
    return set(()=>({ modalOpen: true, id_vencimento: id_vencimento || null, filters: {...initialFilters, ...newFilters}  }))
  },
  closeModal: () => set({ modalOpen: false }),
  editModal: (bool) => set({ modalEditing: bool }),
  toggleModal: (open) => {
    return set((state) => ({
      modalOpen: open !== undefined ? open : !state.modalOpen,
      modalEditing: false,
    }))},
    setFilters: (newFilters)=> set(prev=>({ filters: {...prev.filters, ...newFilters}})),
    clearFilters: ()=>set(({ filters: {...initialFilters}}))
  
}));
