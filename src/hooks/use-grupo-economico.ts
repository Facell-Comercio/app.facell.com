import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGrupoEconomico = ()=>({
    getAll: ()=> useQuery({ 
        queryKey: ['grupo-economico'], 
        queryFn: ()=>api.get('/grupo-economico'), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['grupo-economico', id], 
        queryFn: ()=>api.get(`/grupo-economico:${id}`), 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})