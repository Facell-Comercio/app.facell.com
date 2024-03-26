import { create } from 'zustand';

interface useStoreFornecedor {
  id: string | undefined,
  modalEditing: boolean,
  modalOpen: boolean,

  openModal: (id: string) => void,
  closeModal: () => void,
  editModal: (bool: boolean) => void,

}

export const useStoreFornecedor = create<useStoreFornecedor>((set) => ({
  id: undefined,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string)=>set({modalOpen: true, id: id}),
  closeModal: () => set(({ modalOpen: false })),
  editModal:(bool) => set(({ modalEditing: bool})),
}))