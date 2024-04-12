
import { api } from "@/lib/axios";
import { CentroCustosSchema } from "@/pages/financeiro/cadastros/components/centro-de-custos/centro-custo/Modal";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCentroCustos = () => {
    const queryClient = useQueryClient()
    return (
        {
            getAll : ({ pagination, filters }: GetAllParams) => useQuery({
                queryKey: ['fin_centro_custos', pagination, filters],
                queryFn: async () => await api.get(`/financeiro/centro-custos`, { params: { pagination, filters } }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_centro_custos', id],
                queryFn: async () => {
                    console.log(`Buscando título com base no ID: ${id}`)
                    return await api.get(`/financeiro/centro-custos/${id}`)
                },
            }),
        
            insertOne : () => useMutation({
                mutationFn: (data:CentroCustosSchema) => {
                    console.log("Criando novo fornecedor:")            
                    return api.post("financeiro/centro-custos", data).then((response)=>response.data)
                },
                onSuccess() {
                    queryClient.invalidateQueries({queryKey:['fin_centro_custos']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            update : () => useMutation({
                mutationFn: ({id, ...rest}:CentroCustosSchema) => {
                    console.log(`Atualizando fornecedor com base no ID: ${id}`)            
                    return api.put("financeiro/centro-custos/", {id, ...rest}).then((response)=>response.data)
                },
                onSuccess() {
                    queryClient.invalidateQueries({queryKey:['fin_centro_custos']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),        
        }
    )
}