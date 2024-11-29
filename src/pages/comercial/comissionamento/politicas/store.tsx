import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

export type EscalonamentoCargoProps = {
  descricao: string | null;
  itens: string[];
};

interface useStorePolitica {
  // Cargo
  modalCargoOpen: boolean;
  openModalCargo: () => void;
  closeModalCargo: () => void;

  // Modelo
  id_modelo: string | null;
  id_cargo_politica: string | null;
  modeloIsPending: boolean;
  modalModeloOpen: boolean;
  modalModeloEditing: boolean;
  openModalModelo: ({
    id,
    id_cargo_politica,
  }: {
    id: string;
    id_cargo_politica?: string;
  }) => void;
  closeModalModelo: () => void;
  editModalModelo: (bool: boolean) => void;
  setModeloIsPending: (bool: boolean) => void;

  // Modelo
  id_modelo_item: string | null;
  escalonamento_cargo: EscalonamentoCargoProps | null;
  modeloItemIsPending: boolean;
  modalModeloItemOpen: boolean;
  modalModeloItemEditing: boolean;
  openModalModeloItem: ({
    id,
    id_modelo,
    id_cargo_politica,
    escalonamento,
  }: {
    id: string;
    id_modelo?: string;
    id_cargo_politica?: string;
    escalonamento?: EscalonamentoCargoProps;
  }) => void;
  closeModalModeloItem: () => void;
  editModalModeloItem: (bool: boolean) => void;
  setModeloItemIsPending: (bool: boolean) => void;
}

export const useStoreComissionamentoPoliticas =
  create<useStorePolitica>((set) => ({
    // Cargo
    modalCargoOpen: false,
    openModalCargo: () =>
      set({
        modalCargoOpen: true,
      }),
    closeModalCargo: () =>
      set({
        modalCargoOpen: false,
      }),

    // Modelo
    id_modelo: null,
    id_cargo_politica: null,
    modeloIsPending: false,
    modalModeloOpen: false,
    modalModeloEditing: false,
    openModalModelo: ({
      id,
      id_cargo_politica,
    }) =>
      set({
        modalModeloOpen: true,
        modalModeloEditing: false,
        id_modelo: id,
        id_cargo_politica,
      }),
    closeModalModelo: () =>
      set({
        modalModeloOpen: false,
        id_modelo: null,
        modalModeloEditing: false,
        id_cargo_politica: null,
      }),
    editModalModelo: (bool: boolean) => {
      set({
        modalModeloEditing: bool,
      });
    },
    setModeloIsPending(bool: boolean) {
      set({
        modeloIsPending: bool,
      });
    },

    // Modelo Item
    id_modelo_item: null,
    escalonamento_cargo: null,
    modeloItemIsPending: false,
    modalModeloItemOpen: false,
    modalModeloItemEditing: false,
    openModalModeloItem: ({
      id,
      id_modelo,
      id_cargo_politica,
      escalonamento,
    }) =>
      set({
        modalModeloItemOpen: true,
        modalModeloItemEditing: false,
        id_modelo_item: id,
        id_modelo,
        escalonamento_cargo: escalonamento,
        id_cargo_politica,
      }),
    closeModalModeloItem: () =>
      set({
        modalModeloItemOpen: false,
        id_modelo_item: null,
        id_modelo: null,
        modalModeloItemEditing: false,
        escalonamento_cargo: null,
        id_cargo_politica: null,
      }),
    editModalModeloItem: (bool: boolean) => {
      set({
        modalModeloItemEditing: bool,
      });
    },
    setModeloItemIsPending(bool: boolean) {
      set({
        modeloItemIsPending: bool,
      });
    },
  }));
