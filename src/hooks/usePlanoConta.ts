
import { api } from "@/lib/axios";
import { RowPlanoConta } from "@/pages/financeiro/cadastros/components/plano-de-contas/table-plano-contas/columns-table";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GetPlanoContasProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

type PlanoContasSchema = {
    id: string,
    codigo: string,
    active: boolean,
    descricao: string,
    codigo_pai: string,
    descricao_pai: string,
  
    // Parâmetros
    nivel: string,
    tipo: string,
    grupo_economico: string,
    codigo_conta_estorno: string,
  }

export const usePlanoContas = () => {
    const queryClient = useQueryClient()

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

    const useInsertOne = () => useMutation({
        mutationFn: (data:PlanoContasSchema) => {
            console.log("Criando novo plano de contas:")            
            return api.post("financeiro/plano-contas", data).then((response)=>response.data)
        },
        onSuccess() {
            console.log("deu certo!!!!!".toLocaleUpperCase());
            queryClient.invalidateQueries({queryKey:['fin_plano_contas']}) 
        },
        onError(error) {
            console.log(error);
        },
    })

    const useUpdate = () => useMutation({
        mutationFn: ({id, ...rest}:PlanoContasSchema) => {
            console.log(`Atualizando plano de contas com base no ID: ${id}`)            
            return api.put("financeiro/plano-contas/", {id, ...rest}).then((response)=>response.data)
        },
        onSuccess() {
            console.log("deu certo!!!!!".toLocaleUpperCase());
            queryClient.invalidateQueries({queryKey:['fin_plano_contas']}) 
        },
        onError(error) {
            console.log(error);
        },
    })

    return {
        useGetAll,
        useGetOne,
        useInsertOne,
        useUpdate
    }
}