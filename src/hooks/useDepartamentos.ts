import { api } from "@/lib/axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { GetAllParams } from "@/types/query-params-type";
import { DepartamentoFormData } from "@/pages/admin/departamentos/departamento/form-data";

export const useDepartamentos = ()=>{
    const queryClient = useQueryClient()
    return {
    getAll: (params: undefined | GetAllParams)=> useQuery({ 
        queryKey: ['departamentos', params], 
        queryFn: async()=> await api.get('/departamento', {params: params}), 
        placeholderData: keepPreviousData,
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id?: string)=> useQuery({ 
        enabled: !!id,
        queryKey: ['departamento', id], 
        queryFn: async()=> await api.get(`/departamento/${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),

    insertOne: () => useMutation({
        mutationFn: (data: DepartamentoFormData) => {
            return api.post("departamento", data).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Departamento inserido com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['departamentos'] })
        },
        onError(error) {
            toast({title: 'Ocorreu o seguinte erro', description: error.message})
            console.log(error);
        },
    }),
    update: () => useMutation({
        mutationFn: ({ id, ...rest }: DepartamentoFormData) => {
            return api.put("departamento", { id, ...rest }).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Departamento atualizado com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['departamentos'] })
            queryClient.invalidateQueries({ queryKey: ['departamento'] })
        },
        onError(error) {
            toast({title: 'Ocorreu o seguinte erro', description: error.message})
            console.log(error);
        },
    })
}
}