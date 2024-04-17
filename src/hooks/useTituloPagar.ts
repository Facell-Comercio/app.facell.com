
import { api } from "@/lib/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface GetTitulosPagarProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const useTituloPagar = () => {

    const getAll = ({ pagination, filters }: GetTitulosPagarProps) => useQuery({
        queryKey: ['fin_cp_titulos', pagination],
        staleTime: 5 * 1000 * 60,
        retry: false,
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/titulo`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const getOne = (id: string | null) => useQuery({
        enabled: !!id,
        retry: false,
        staleTime: 5 * 1000 * 60,
        queryKey: ['fin_cp_titulo', id],
        queryFn: async () => {
            console.log(`Buscando título com base no ID: ${id}`)
            try {
                
                const result = await api.get(`/financeiro/contas-a-pagar/titulo/${id}`)
                return result
            } catch (error) {
                console.log(error)
                throw error
            }
        },
    })

    return {
        getAll,
        getOne,
    }
}