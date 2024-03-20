
import { api } from "@/lib/axios";
import { RowTitulo } from "@/pages/financeiro/contas-pagar/components/table-titulos/columns-table";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface GetTitulosPagarProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const useTituloPagar = () => {

    const useGetAll = ({ pagination, filters }: GetTitulosPagarProps) => useQuery({
        queryKey: ['fin_cp_titulos', pagination],
        queryFn: async () => { return await api.get<RowTitulo[] | Error>(`/financeiro/contas-a-pagar/titulo`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const useGetOne = (id: string | null) => useQuery({
        enabled: !!id,
        queryKey: ['fin_cp_titulo', id],
        queryFn: async () => {
            console.log(`Buscando título com base no ID: ${id}`)
            return await api.get(`/financeiro/contas-a-pagar/titulo/${id}`)
        },
    })

    return {
        useGetAll,
        useGetOne,
    }
}