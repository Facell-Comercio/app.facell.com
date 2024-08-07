
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";


export const usePainel = () => {
    return ({
        getAllSolicitacoesNegadas : ({ pagination }: GetAllParams) => useQuery({
            queryKey: ["financeiro", "contas_pagar", "painel", "negados", "lista", pagination],
            queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/painel/negados`, { params: { pagination } }) },
            placeholderData: keepPreviousData
        }),
        getAllNotasFiscaisPendentes : ({ pagination }: GetAllParams) => useQuery({
            queryKey: ["financeiro", "contas_pagar", "painel", "sem_nota", "lista", pagination],
            queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/painel/sem-nota`, { params: { pagination } }) },
            placeholderData: keepPreviousData
        }),
        getAllRecorrenciasPendentes : ({ pagination }: GetAllParams) => useQuery({
            queryKey: ["financeiro", "contas_pagar", "painel", "recorrencia", "lista", pagination],
            queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/painel/recorrencias`, { params: { pagination } }) },
            placeholderData: keepPreviousData
        }),
})}