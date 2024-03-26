import { create } from 'zustand';

interface useStorePlanoContas {
  id?: string | null,
  modalEditing: boolean,
  modalOpen: boolean,

  openModal: (id: string) => void,
  closeModal: () => void,
  editModal: (bool: boolean) => void,

}

export const useStorePlanoContas = create<useStorePlanoContas>((set) => ({
  id: null,
  modalEditing: false,
  modalOpen: false,

  openModal: (id: string)=>set({modalOpen: true, id: id}),
  closeModal: () => set(({ modalOpen: false })),
  editModal:(bool) => set(({ modalEditing: bool})),
}))