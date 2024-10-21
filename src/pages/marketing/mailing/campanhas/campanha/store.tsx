import { create } from "zustand";

export interface FiltersCampanha {
  plano_atual?: string;
  produto?: string;
  produto_fidelizado?: string;
  sem_contato?: string;
  status?: string;
  id_campanha?: string;
}

const initialFilters: FiltersCampanha = {
  plano_atual: "",
  produto: "",
  produto_fidelizado: "",
  sem_contato: "",
  status: "",
  id_campanha: "",
};

interface useStoreCampanha {
  id: string | null;
  modalOpen: boolean;
  isPending: boolean;
  qtde_clientes: string | null;

  openModal: (id: string) => void;
  closeModal: () => void;

  setIsPending: (bool: boolean) => void;

  // FILTROS
  filters: FiltersCampanha;
  setFilters: (filters: FiltersCampanha) => void;
  resetFilters: () => void;

  // FILTROS LOTE
  filters_lote: FiltersCampanha;
  setFiltersLote: (filters: FiltersCampanha) => void;
  resetFiltersLote: () => void;

  //NOVA SUBCAMPANHA
  modalNovaSubcampanhaOpen: boolean;
  openModalNovaSubcampanha: (qtde_clientes: string) => void;
  closeModalNovaSubcampanha: () => void;

  id_cliente: string | null;

  //EDITAR CLIENTE
  modalEditarClienteOpen: boolean;
  openModalEditarCliente: (id_cliente: string) => void;
  closeModalEditarCliente: () => void;

  //VER CLIENTE
  modalVerClienteOpen: boolean;
  openModalVerCliente: (id_cliente: string) => void;
  closeModalVerCliente: () => void;

  //DEFINIR APARELHO
  modalDefinirAparelhoOpen: boolean;
  openModalDefinirAparelho: (qtde_clientes: string) => void;
  closeModalDefinirAparelho: () => void;

  //DEFINIR VENDEDORES
  modalDefinirVendedoresOpen: boolean;
  openModalDefinirVendedores: (qtde_clientes: string) => void;
  closeModalDefinirVendedores: () => void;
}

export const useStoreCampanha = create<useStoreCampanha>((set) => ({
  id: null,
  modalOpen: false,
  isPending: false,
  qtde_clientes: null,

  openModal: (id: string) => set({ modalOpen: true, id }),
  closeModal: () => set({ modalOpen: false, id: null }),
  setIsPending: (bool: boolean) => set({ isPending: bool }),

  // FILTERS
  filters: initialFilters,
  setFilters: (novoFiltro) =>
    set((state) => ({
      filters: { ...state.filters, ...novoFiltro },
    })),
  resetFilters: () => {
    set({
      filters: initialFilters,
    });
  },

  // FILTERS LOTE
  filters_lote: initialFilters,
  setFiltersLote: (novoFiltro) =>
    set((state) => ({
      filters_lote: { ...state.filters_lote, ...novoFiltro },
    })),
  resetFiltersLote: () => {
    set({
      filters_lote: initialFilters,
    });
  },

  // NOVA SUBCAMPANHA
  modalNovaSubcampanhaOpen: false,
  openModalNovaSubcampanha: (qtde_clientes) =>
    set({ modalNovaSubcampanhaOpen: true, qtde_clientes }),
  closeModalNovaSubcampanha: () => set({ modalNovaSubcampanhaOpen: false, qtde_clientes: null }),

  id_cliente: null,

  //EDITAR CLIENTE
  modalEditarClienteOpen: false,
  openModalEditarCliente: (id_cliente: string) => set({ modalEditarClienteOpen: true, id_cliente }),
  closeModalEditarCliente: () => set({ modalEditarClienteOpen: false, id_cliente: null }),

  //VER CLIENTE
  modalVerClienteOpen: false,
  openModalVerCliente: (id_cliente: string) => set({ modalVerClienteOpen: true, id_cliente }),
  closeModalVerCliente: () => set({ modalVerClienteOpen: false, id_cliente: null }),

  //DEFINIR APARELHO
  modalDefinirAparelhoOpen: false,
  openModalDefinirAparelho: (qtde_clientes: string) =>
    set({ modalDefinirAparelhoOpen: true, qtde_clientes }),
  closeModalDefinirAparelho: () => set({ modalDefinirAparelhoOpen: false, id_cliente: null }),

  //DEFINIR VENDEDORES
  modalDefinirVendedoresOpen: false,
  openModalDefinirVendedores: (qtde_clientes: string) =>
    set({ modalDefinirVendedoresOpen: true, qtde_clientes }),
  closeModalDefinirVendedores: () => set({ modalDefinirVendedoresOpen: false, id_cliente: null }),
}));
