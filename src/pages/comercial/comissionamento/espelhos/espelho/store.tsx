import { create } from "zustand";

export interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface useStoreEspelho {
  id?: string | null;
  id_contestacao?: string | null;
  id_item?: string | null;
  type?: string | null;

  modalOpen: boolean;

  modalContestacoesOpen: boolean;
  modalContestacaoOpen: boolean;
  modalContestacaoEditing: boolean;

  modalVendasInvalidasOpen: boolean;

  modalItemOpen: boolean;
  modalItensOpen: boolean;

  modalItemEditing: boolean;

  isPending: boolean;

  qtde_contestacoes?: string | null;
  qtde_vendas_invalidas?: string | null;
  qtde_itens?: string | null;

  openModal: (id: string) => void;
  closeModal: () => void;

  openModalContestacoes: () => void;
  closeModalContestacoes: () => void;

  openModalVendasInvalidas: () => void;
  closeModalVendasInvalidas: () => void;

  openModalContestacao: (id: string) => void;
  closeModalContestacao: () => void;
  editModalContestacao: (bool: boolean) => void;

  openModalItem: (data: { id: string; type: string }) => void;
  closeModalItem: () => void;
  editModalItem: (bool: boolean) => void;

  openModalItens: () => void;
  closeModalItens: () => void;

  editQtdeContestacoes: (qtde?: string) => void;
  editQtdeVendasInvalidas: (qtde?: string) => void;
  editQtdeItens: (qtde?: string) => void;
  editIsPending: (bool: boolean) => void;
}

export const useStoreEspelho = create<useStoreEspelho>((set) => ({
  id: null,
  id_contestacao: null,
  modalOpen: false,

  modalContestacoesOpen: false,
  modalItensOpen: false,

  modalVendasInvalidasOpen: false,

  modalContestacaoOpen: false,
  modalContestacaoEditing: false,

  id_item: null,
  type: null,
  modalItemOpen: false,
  modalItemEditing: false,

  qtde_contestacoes: null,
  qtde_vendas_invalidas: null,
  qtde_itens: null,

  isPending: false,

  openModal: (id: string) => set({ modalOpen: true, id: id }),
  closeModal: () => set({ modalOpen: false, id: null }),

  openModalContestacoes: () => set({ modalContestacoesOpen: true }),
  closeModalContestacoes: () => set({ modalContestacoesOpen: false }),

  openModalVendasInvalidas: () => set({ modalVendasInvalidasOpen: true }),
  closeModalVendasInvalidas: () => set({ modalVendasInvalidasOpen: false }),

  openModalContestacao: (id: string) =>
    set({ modalContestacaoOpen: true, id_contestacao: id, modalContestacaoEditing: !id }),
  closeModalContestacao: () =>
    set({ modalContestacaoOpen: false, id_contestacao: null, modalContestacaoEditing: false }),
  editModalContestacao: (bool) => set({ modalContestacaoEditing: bool }),

  openModalItem: ({ id, type }) =>
    set({ modalItemOpen: true, id_item: id, type, modalItemEditing: !id }),
  closeModalItem: () =>
    set({ modalItemOpen: false, id_item: null, modalItemEditing: false, type: null }),
  editModalItem: (bool) => set({ modalItemEditing: bool }),

  openModalItens: () => set({ modalItensOpen: true }),
  closeModalItens: () => set({ modalItensOpen: false }),

  editQtdeContestacoes: (qtde) =>
    set({
      qtde_contestacoes: qtde,
    }),
  editQtdeVendasInvalidas: (qtde) =>
    set({
      qtde_vendas_invalidas: qtde,
    }),
  editQtdeItens: (qtde) =>
    set({
      qtde_itens: qtde,
    }),

  editIsPending: (bool: boolean) =>
    set({
      isPending: bool,
    }),
}));
