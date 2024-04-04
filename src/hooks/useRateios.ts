
import { api } from "@/lib/axios";
import { RateiosSchema } from "@/pages/financeiro/cadastros/components/rateios/rateio/Modal";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRateios = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: getAllParams) => useQuery({
            queryKey: ['fin_rateios', pagination],
            queryFn: async () => { return await api.get(`financeiro/rateios/`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['fin_rateios', id],
            queryFn: async () => {
                console.log(`Buscando plano de contas com base no ID: ${id}`)
                return await api.get(`financeiro/rateios/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data:RateiosSchema) => {
                console.log("Criando novo plano de contas:")            
                return api.post("financeiro/rateios", data).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_rateios']}) 
            },
            onError(error) {
                console.log(error);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:RateiosSchema) => {
                console.log(`Atualizando plano de contas com base no ID: ${id}`)            
                return api.put("financeiro/rateios/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_rateios']}) 
            },
            onError(error) {
                console.log(error);
            },
    })
})}