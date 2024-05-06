
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useMovimentoContabil = () => {
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_bordero', pagination],
            queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/movimento-contabil`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        
})}