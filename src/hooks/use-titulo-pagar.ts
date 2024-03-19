
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface GetTitulosPagarProps {
    pagination: {
        pageIndex: number;
        pageLength: number;
    };
    filters: any;
}

export const useTituloPagar = () => {

    const getAll = ({pagination, filters}: GetTitulosPagarProps) => useQuery({
        queryKey: ['fin_cp_titulos', pagination],
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/titulo`, {params: {pagination, filters}}) },
    })

    const getOne = (id: number | null) => useQuery({
        enabled: id !== null,
        queryKey: ['fin_cp_titulo', id],
        queryFn: async () => { 
            console.log(`Buscando título com base no ID: ${id}`)
            return await api.get(`/financeiro/contas-a-pagar/titulo/${id}`) },
    })

    return {
        getAll,
        getOne,
    }
}