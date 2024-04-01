import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type getAllParams = {
    pagination?: {
        pageIndex: number,
        pageSize: number,
    },
    filters: any
}

export const useDepartamentos = ()=>({
    getAll: (params: undefined | getAllParams)=> useQuery({ 
        queryKey: ['departamento', params], 
        queryFn: async()=> await api.get('/departamento', {params: params}), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['departamento', id], 
        queryFn: async()=> await api.get(`/departamento:${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})