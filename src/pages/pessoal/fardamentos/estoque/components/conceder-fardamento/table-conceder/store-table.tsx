import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}


export interface State {
  rowCount: number;
  pagination: Pagination;
  isAllSelected: boolean;
}

export interface SortingItem {
  id: string;
  desc: boolean;
}

export interface Actions {
  setPagination: (pagination: Pagination) => void;
}

export const useStoreTableConcederVenderFardamento = create<State & Actions>((set) => ({
  //Table
  rowCount: 0,
  pagination: { pageIndex: 0, pageSize: 15 },
  isAllSelected: false,
  rowSelection: {},
  setPagination: (pagination) => set({ pagination }),
}));
