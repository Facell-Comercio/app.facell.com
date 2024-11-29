import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStorePolitica {
  id?: string | null;
  modalOpen: boolean;
  pagination: Pagination;
  openModal: () => void;
  closeModal: () => void;
  setPagination: (pagination: Pagination) => void;
  setIdPolitica: (id: string | null) => void;
}

export const useStorePoliticas =
  create<useStorePolitica>((set) => ({
    id: null,
    modalOpen: false,
    pagination: {
      pageIndex: 0,
      pageSize: 15,
    },
    setPagination: (pagination) =>
      set({ pagination: pagination }),
    openModal: () =>
      set({
        modalOpen: true,
      }),
    closeModal: () =>
      set({
        modalOpen: false,
      }),
    setIdPolitica: (id: string | null) =>
      set({ id }),
  }));
