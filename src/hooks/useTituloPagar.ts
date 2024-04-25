
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TituloSchemaProps } from "@/pages/financeiro/contas-pagar/components/titulos/titulo/form-data";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GetTitulosPagarProps {
    pagination?: {
        pageIndex?: number;
        pageLength?: number;
    };
    filters: any;
}

export const useTituloPagar = () => {
    const queryClient = useQueryClient();

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

    const insertOne = () => useMutation({
        mutationFn: (data: TituloSchemaProps) => {
            return api.post("/financeiro/contas-a-pagar/titulo", data).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Usuário inserido com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
        },
        onError(error) {
            // @ts-ignore
            toast({title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message})
            console.log(error);
        },
    })

    const update = () => useMutation({
        mutationFn: ({ id, ...rest }: TituloSchemaProps) => {
            return api.put("/financeiro/contas-a-pagar/titulo", { id, ...rest }).then((response) => response.data)
        },
        onSuccess() {
            toast({title: 'Sucesso!', description: 'Usuário atualizado com sucesso.'})
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulo'] })
        },
        onError(error) {
            // @ts-ignore
            toast({title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message})
            console.log(error);
        },
    })


    return {
        getAll,
        getOne,
        insertOne,
        update,
    }
}