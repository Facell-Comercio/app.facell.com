import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useExtratoBancario = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['extratos-bancarios', pagination],
            queryFn: async () => { return await api.get(`/financeiro/extratos-bancarios/`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['extratos-bancarios', id],
            queryFn: async () => {
                return await api.get(`/financeiro/extratos-bancarios/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data
            ) => {          
                return api.post("/financeiro/extratos-bancarios/", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Novo borderô criado", duration: 3500})
                queryClient.invalidateQueries({queryKey:['extratos-bancarios']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
            },
        }),

        update : () => useMutation({
            // @ts-ignore
            mutationFn: ({id, ...rest}) => {
                return api.put("/financeiro/extratos-bancarios/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Atualização realizada com sucesso", duration: 3500})
                queryClient.invalidateQueries({queryKey:['extratos-bancarios']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
            }
        }),
})}