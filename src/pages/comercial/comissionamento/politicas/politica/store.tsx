import { create } from "zustand";

interface useStorePolitica {
  action: "insert" | "copy" | null;
  modalOpen: boolean;
  isPending: boolean;

  openModal: ({
    action,
  }: {
    action: "insert" | "copy";
  }) => void;
  closeModal: () => void;
  editIsPending: (bool: boolean) => void;
}

export const useStorePolitica =
  create<useStorePolitica>((set) => ({
    action: null,
    modalOpen: false,
    isPending: false,

    openModal: ({ action }) =>
      set({ modalOpen: true, action }),
    closeModal: () =>
      set({ modalOpen: false, action: null }),
    editIsPending: (bool: boolean) =>
      set({
        isPending: bool,
      }),
  }));
