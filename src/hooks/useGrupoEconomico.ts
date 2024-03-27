import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGrupoEconomico = ()=>({
    getAll: ()=> useQuery({ 
        queryKey: ['grupo-economico'], 
        queryFn: async()=> {
            const result = await api.get('/grupo-economico')
            return result
        }, 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
    
    getOne: (id: number)=> useQuery({ 
        queryKey: ['grupo-economico', id], 
        queryFn: async ()=>{
            const result = await api.get(`/grupo-economico/${id}`)
            return result;
        }, 
        staleTime: Infinity, 
        refetchOnMount: false
    }),
})