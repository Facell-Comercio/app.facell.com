import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

type getAllParams = {
    pagination?: {
        pageIndex: number,
        pageSize: number,
    },
    filters?: any
}

export const useBanco = ()=>({
    getAll: (params?: getAllParams)=> useQuery({ 
        queryKey: ['banco', params], 
        queryFn: async()=> await api.get('/banco', {params: params}), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['banco', id], 
        queryFn: async()=> await api.get(`/banco:${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})