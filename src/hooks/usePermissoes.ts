
import { api } from "@/lib/axios";
import { Permissao } from "@/types/permissao-type";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePermissoes = () => {
    const queryClient = useQueryClient()
    return (
        {
            getAll : ({ pagination, filters }: GetAllParams) => useQuery({
                queryKey: ['permissoes', pagination],
                queryFn: async () => await api.get(`/permissao`, { params: { pagination, filters } }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['permissao', id],
                queryFn: async () => {
                    console.log(`Buscando título com base no ID: ${id}`)
                    return await api.get(`/permissao/${id}`)
                },
            }),
        
            insertOne : () => useMutation({
                mutationFn: (data:Permissao) => {            
                    return api.post("/permissao", data).then((response)=>response.data)
                },
                onSuccess() {
                    queryClient.invalidateQueries({queryKey:['permissoes']}) 
                    queryClient.invalidateQueries({queryKey:['permissao']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            update : () => useMutation({
                mutationFn: ({id, ...rest}:Permissao) => {          
                    return api.put("/permissao", {id, ...rest}).then((response)=>response.data)
                },
                onSuccess() {
                    queryClient.invalidateQueries({queryKey:['permissoes']}) 
                    queryClient.invalidateQueries({queryKey:['permissao']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),        
        }
    )
}