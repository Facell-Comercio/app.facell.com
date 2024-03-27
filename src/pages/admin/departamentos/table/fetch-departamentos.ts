import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useStoreDepartamentos } from "./store-table";

export const useDepartamentos = ()=>({
    getAll: ()=>{
        const pagination = useStoreDepartamentos().pagination;
        const filters = useStoreDepartamentos().filters;
        
        return useQuery({
            queryKey: [`departamento`, pagination],
            queryFn: async ()=>{
                const result = await api.get('/departamento', { params: {
                    filters: filters, pagination
                }})
                return result;
            }
        })
    }
})