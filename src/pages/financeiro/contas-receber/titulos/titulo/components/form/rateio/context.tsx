import { create } from "zustand";

export interface State {
    indexFieldArray?: number,
    itemRateio: {
        id?: string,
        id_filial: string,
        filial?: string,
        id_centro_custo: string,
        centro_custo?: string,
        id_plano_conta: string,
        plano_conta?: string,
        valor: string,
        percentual: string
    },
    modalOpen: boolean,
}

export type ItemRateioFilial = Pick<State['itemRateio'], 'id_filial' | 'filial'>
export type ItemRateioPlanoContas = Pick<State['itemRateio'], 'id_plano_conta' | 'plano_conta'>
export type ItemRateioCentroCusto = Pick<State['itemRateio'], 'id_centro_custo' | 'centro_custo'>

export const initialStateRateio = {
    indexFieldArray: undefined,
    itemRateio: {
        id: '',
        id_filial: '',
        filial: '',
        id_centro_custo: '',
        centro_custo: '',
        id_plano_conta: '',
        plano_conta: '',
        valor: '0',
        percentual: '0'
    },
    modalOpen: false,
}
type UpdateItemRateioProps = { index?: number; itemRateio: State['itemRateio'] }
export interface Actions {
    newItemRateio: () => void;
    updateItemRateio: (data: UpdateItemRateioProps) => void;
    toggleModal: () => void;
    resetFilters: () => void;
}

export const useStoreRateio = create<State & Actions>((set) => ({
    ...initialStateRateio,
    newItemRateio: ()=>set(({itemRateio: {...initialStateRateio.itemRateio}, indexFieldArray: -1, modalOpen: true})),
    updateItemRateio: (data:UpdateItemRateioProps) => {
        set({ itemRateio: { ...data.itemRateio }, indexFieldArray: data.index, modalOpen: true }) 
    },
    toggleModal: () => { set((state) => ({ modalOpen: !state.modalOpen })) },
    resetFilters: () => { set({ ...initialStateRateio }) },
}
));
