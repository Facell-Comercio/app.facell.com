import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type getAllParams = {
    pagination?: {
        pageIndex: number,
        pageSize: number,
    },
    filters: any
}

export const useUsers = ()=>({
    getAll: (params: getAllParams)=>{      
        return useQuery({
            queryKey: [`user`, params],
            queryFn: async ()=>{
                const result = await api.get('/user', { params })
                return result;
            }
        })
    }
})