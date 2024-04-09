import { api } from "@/lib/axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllParams } from "@/types/query-params-type";
import { FilialFormData } from "@/pages/admin/filiais/filial/form-data";
import { toast } from "@/components/ui/use-toast";

export const useFilial = ()=>{
    const queryClient = useQueryClient()
    return {
    getAll: (params?: GetAllParams)=> useQuery({ 
        queryKey: ['filiais', params?.pagination], 
        queryFn: async()=> await api.get('/filial', {params: params}), 
        placeholderData: keepPreviousData,
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id?: string)=> useQuery({ 
        enabled: !!id,
        queryKey: ['filial', id], 
        queryFn: async()=> await api.get(`/filial/${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),

    insertOne: () => useMutation({
        mutationFn: (data: FilialFormData) => {
            return api.post("filial", data).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Filial inserida com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['filial'] })
        },
        onError(error) {
            toast({title: 'Ocorreu o seguinte erro', description: error.message})
            console.log(error);
        },
    }),
    update: () => useMutation({
        mutationFn: ({ id, ...rest }: FilialFormData) => {
            return api.put("filial", { id, ...rest }).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Filial atualizada com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['filiais'] })
            queryClient.invalidateQueries({ queryKey: ['filial'] })
        },
        onError(error) {
            toast({title: 'Ocorreu o seguinte erro', description: error.message})
            console.log(error);
        },
    })
}
}