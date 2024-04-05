
import { api } from "@/lib/axios";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useOrcamento = () => {
    // const queryClient = useQueryClient()
    
    return (
        {
            getAll : (params?: getAllParams) => useQuery({
                queryKey: ['fin_meu_orcamento', params],
                queryFn: async () => await api.get(`/financeiro/orcamento/`, { params: params }),
                placeholderData: keepPreviousData
            }),

            getMyBudget : (params?: getAllParams) => useQuery({
                queryKey: ['fin_meu_orcamento', params],
                queryFn: async () => await api.get(`/financeiro/orcamento/my-budget`, { params: params }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_meu_orcamento', id],
                queryFn: async () => {
                    console.log(`Buscando orcamento com base no ID: ${id}`)
                    return await api.get(`/financeiro/orcamento/${id}`)
                },
            }),
        
            // update : () => useMutation({
            //     mutationFn: ({id, ...rest}:MeuOrcamentoSchema) => {
            //         console.log(`Atualizando meu orcamento com base no ID: ${id}`)            
            //         return api.put("financeiro/orcamento/", {id, ...rest}).then((response)=>response.data)
            //     },
            //     onSuccess() {
            //         console.log("deu certo!!!!!".toLocaleUpperCase());
            //         queryClient.invalidateQueries({queryKey:['fin_meu_orcamento']}) 
            //     },
            //     onError(error) {
            //         console.log(error);
            //     },
            // }),
            
        }
    )
}