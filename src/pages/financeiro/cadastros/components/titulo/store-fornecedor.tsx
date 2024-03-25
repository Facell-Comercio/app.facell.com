import { create } from 'zustand';

export interface TituloPagar {
  // Dados Fornecedor
  id: number | null,
  cnpj: string,
  nome: string,
  razao: string,
  cep: string,
  logradouro: string,
  numero: string,
  complemento: string,
  bairro: string,
  municipio: string,
  uf: string,
  email: string,
  telefone: string,

  // Dados Bancários
  id_forma_pagamento: number | null,
  id_tipo_chave_pix: number | null,
  id_banco: number | null,
  id_conta: number | null,
  chave_pix: string,
  agencia: string,
  dv_agencia: string,
  conta: string,
  dv_conta: string,
  cpf_cnpj_favorecido: string,
  favorecido: string,
}

export const initialPropsTitulo: TituloPagar = {
   // Dados Fornecedor
   id: null,
   cnpj: "",
   nome: "",
   razao: "",
   cep: "",
   logradouro: "",
   numero: "",
   complemento: "",
   bairro: "",
   municipio: "",
   uf: "",
   email: "",
   telefone: "",
 
   // Dados Bancários
   id_forma_pagamento: null,
   id_tipo_chave_pix: null,
   id_banco: null,
   id_conta: null,
   chave_pix: "",
   agencia: "",
   dv_agencia: "",
   conta: "",
   dv_conta: "",
   cpf_cnpj_favorecido: "",
   favorecido: "",
}

interface useStoreFornecedor {
  id: string | null,
  titulo: TituloPagar,
  modalFornecedorIsEditing: boolean,
  modalFornecedorIsOpen: boolean,

  setModalFornecedorIsEditing: ({ open, id }: { open: boolean, id: string | null }) => void,
  setModalFornecedorIsOpen: ({ open, id }: { open: boolean, id: string | null }) => void,
  resetTitulo: () => void
}

export const useStoreFornecedor = create<useStoreFornecedor>((set) => ({
  id: null,
  titulo: initialPropsTitulo,
  modalFornecedorIsEditing: false,
  modalFornecedorIsOpen: false,
  setModalFornecedorIsEditing: ({ open, id }) => set(({ modalFornecedorIsEditing: open, id })),
  setModalFornecedorIsOpen: ({ open, id }) => set(({ modalFornecedorIsOpen: open, id })),
  resetTitulo: () => set({ titulo: initialPropsTitulo, id: null }),
}))