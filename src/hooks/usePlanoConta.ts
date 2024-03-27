
import { api } from "@/lib/axios";
import { RowPlanoConta } from "@/pages/financeiro/cadastros/components/plano-de-contas/table-plano-contas/columns-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface GetPlanoContasProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const usePlanoContas = () => {

    const useGetAll = ({ pagination, filters }: GetPlanoContasProps) => useQuery({
        queryKey: ['fin_plano_contas', pagination],
        queryFn: async () => { return await api.get<RowPlanoConta[] | Error>(`financeiro/plano-contas/`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const useGetOne = (id: string | null | undefined) => useQuery({
        enabled: !!id,
        queryKey: ['fin_plano_contas', id],
        queryFn: async () => {
            console.log(`Buscando plano de contas com base no ID: ${id}`)
            return await api.get(`financeiro/plano-contas/${id}`)
        },
    })

    return {
        useGetAll,
        useGetOne,
    }
}