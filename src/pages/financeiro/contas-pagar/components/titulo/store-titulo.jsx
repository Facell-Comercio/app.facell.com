import {create} from 'zustand';

const initialPropsTitulo = {
  id_tipo_solicitacao: '1',
  id_status: null,
  id_centro_custo: null,
  id_forma_pagamento: null,
  
  valor: 0,
  data_emissao: null,
  data_vencimento: null,
  data_pagamento: null,
  descricao: null,

  num_parcelas: 1,
  parcela: 1,

  filial: {
    id: null,
    nome: null,
    cnpj: null,
  },

  emissor: {
    id: null,
    nome: null
  },

  fornecedor: {
    id: null,
    nome: null,
    cnpj: null,
    cnpj_favorecido: null,
    favorecido: null
  },

  rateio: {
    id_rateio: null,
    itens_rateio: []
  },

  anexos: {
    xml_nota: null,
    nota_fiscal: null,
    boleto: null,
    contrato: null,
    planilha: null,
    txt: null
  },

}

export const useTituloStore = create((set, get, store) => ({
  id_titulo: null,
  titulo: initialPropsTitulo,
  modalTituloOpen: false,
  setModalTituloOpen: ({open, id_titulo})=>set(state=>({ modalTituloOpen: open, id_titulo })),
  resetTitulo: ()=>set({titulo: initialPropsTitulo, id_titulo: null}),
  
}))

export const useRateioStore = create((set, get, store) => ({
    
    valorRateio: 1000,
    tipoRateio: {
        nome: 'R08 - RATEIO MANNUAL',
        manual: 1,

        
    },
    itensRateio: [
        {filial: '01 TIM MIDWAY', valor: 50.00, percentual: 0.3},
        {filial: '02 TIM NATAL SHOPPING', valor: 50.00, percentual: 0.3},
        {filial: '08 TIM NORTE SHOPPING 2', valor: 50.00, percentual: 0.3},
    ],
    updateItemRateio: () => {
      set((state) => ({ valorRateio: novoValor }));
    },
    setValorRateio: (novoValor) => {
      set((state) => ({ valorRateio: novoValor }));
    },
    addItemRateio: (novoItemRateio) => {
      set(state=>({ itensRateio: [...state.itensRateio, novoItemRateio] }));
    },
    removeItemRateio: (index) => {
      set((state) => ({ itensRateio: state.itensRateio.filter((item, itemIndex) => itemIndex !== index) }));
    },
  }));