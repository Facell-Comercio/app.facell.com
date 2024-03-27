import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type getAllParams = {
    pagination?: {
        pageIndex: number,
        pageSize: number,
    },
    filters: any
}

export const useFilial = ()=>({
    getAll: (params: getAllParams)=> useQuery({ 
        queryKey: ['filial', params], 
        queryFn: async()=> await api.get('/filial', {params: params}), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['filial', id], 
        queryFn: async()=> await api.get(`/filial:${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})