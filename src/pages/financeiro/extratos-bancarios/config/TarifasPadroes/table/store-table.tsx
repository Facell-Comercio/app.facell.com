import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export interface State {
  id: string;
  modalOpen: boolean;
  modalEditing: boolean;
  pagination: Pagination;
}

export interface Actions {
  openModal: (id: string) => void;
  closeModal: () => void;
  setPagination: (pagination: Pagination) => void;
  editModal: (bool: boolean) => void;
}

export const useStoreTableTarifas = create<State & Actions>((set) => ({
  id: "",
  modalOpen: false,
  modalEditing: false,
  pagination: { pageIndex: 0, pageSize: 15 },

  openModal: (id: string) =>
    set({ modalOpen: true, id, modalEditing: id ? false : true }),
  closeModal: () => set({ modalOpen: false }),
  setPagination: (pagination) => set({ pagination }),
  editModal: (bool: boolean) => set({ modalEditing: bool }),
}));
