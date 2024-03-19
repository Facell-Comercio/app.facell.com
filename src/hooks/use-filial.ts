import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useFilial = ()=>({
    getAll: ()=> useQuery({ 
        queryKey: ['filial'], 
        queryFn: ()=>api.get('/filial'), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['filial', id], 
        queryFn: ()=>api.get(`/filial:${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})