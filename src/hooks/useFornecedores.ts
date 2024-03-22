
import { api } from "@/lib/axios";
import { RowTitulo } from "@/pages/financeiro/contas-pagar/components/table-titulos/columns-table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export interface GetFornecedoresProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const useFornecedores = () => {

    const useGetAll = ({ pagination, filters }: GetFornecedoresProps) => useQuery({
        queryKey: ['fin_fornecedores', pagination],
        queryFn: async () => { return await api.get<RowTitulo[] | Error>(`/financeiro/fornecedores`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    })

    const useGetOne = (id: string | null) => useQuery({
        enabled: !!id,
        queryKey: ['fin_fornecedores', id],
        queryFn: async () => {
            console.log(`Buscando título com base no ID: ${id}`)
            return await api.get(`/financeiro/fornecedores/${id}`)
        },
    })

    return {
        useGetAll,
        useGetOne,
    }
}