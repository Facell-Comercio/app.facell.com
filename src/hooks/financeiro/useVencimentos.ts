
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { AlteracaoLoteVencimentosSchemaProps } from "@/pages/financeiro/contas-pagar/vencimentos/components/ModalAlteracoesVencimentosLote";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GetVencimentosProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const useVencimentos = () => {
    const queryClient = useQueryClient();

    const getVencimentosAPagar = ({ pagination, filters }: GetVencimentosProps) => useQuery({
        queryKey: ['fin_cp_vencimentos_pagar', pagination],
        staleTime: 5 * 1000 * 60,
        retry: false,
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/vencimentos/a-pagar`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const getVencimentosEmBordero = ({ pagination, filters }: GetVencimentosProps) => useQuery({
        queryKey: ['fin_cp_vencimapentos_bordero', pagination],
        staleTime: 5 * 1000 * 60,
        retry: false,
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/vencimentos/em-bordero`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const getVencimentosPagos = ({ pagination, filters }: GetVencimentosProps) => useQuery({
        queryKey: ['fin_cp_vencimapentos_pagos', pagination],
        staleTime: 5 * 1000 * 60,
        retry: false,
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/vencimentos/pagos`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const changeVencimentos = () => useMutation({
        mutationFn: async ({ ...rest }: AlteracaoLoteVencimentosSchemaProps) => {
            return await api.put("/financeiro/contas-a-pagar/vencimentos/change-fields", {...rest}).then((response) => response.data)
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Alterações realizadas com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_vencimentos_pagar'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    return {
        getVencimentosAPagar,
        getVencimentosEmBordero,
        getVencimentosPagos,
        changeVencimentos
    }
}