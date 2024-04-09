
import { api } from "@/lib/axios";
import { BancoSchema } from "@/pages/financeiro/cadastros/components/bancos/bancos/Modal";
import { getAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBancos = () => {
    const queryClient = useQueryClient()
    
    return (
        {
            getAll : (params?: getAllParams) => useQuery({
                queryKey: ['fin_bancos', params],
                queryFn: async () => await api.get(`/financeiro/bancos`, { params: params }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_bancos', id],
                queryFn: async () => {
                    console.log(`Buscando banco com base no ID: ${id}`)
                    return await api.get(`/financeiro/bancos/${id}`)
                },
            }),
        
            insertOne : () => useMutation({
                mutationFn: (data:BancoSchema) => {
                    console.log("Criando novo banco:")            
                    return api.post("/financeiro/bancos", data).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_bancos']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            update : () => useMutation({
                mutationFn: ({id, ...rest}:BancoSchema) => {
                    console.log(`Atualizando bancos com base no ID: ${id}`) 
                    console.log({...rest})
                               
                    return api.put("/financeiro/bancos/", {id, ...rest}).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_bancos']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),        
        }
    )
}