
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { AlteracaoLoteSchemaProps } from "@/pages/financeiro/contas-pagar/titulos/alteracao-lote/Modal";
import { ExportAnexosProps } from "@/pages/financeiro/contas-pagar/titulos/components/ButtonExportarTitulos";
import { EditRecorrenciaProps } from "@/pages/financeiro/contas-pagar/titulos/recorrencias/editar/Modal";
import { TituloSchemaProps } from "@/pages/financeiro/contas-pagar/titulos/titulo/form-data";
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

    const getRecorrencias = ({ filters }: GetTitulosPagarProps) => useQuery({
        queryKey: ['fin_cp_recorrencias'],
        retry: false,
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/titulo/recorrencias`, { params: { filters } }) },
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
                // @ts-expect-error "Funciona"
                toast({ variant: "destructive", title: 'Erro ao tentar obter os dados!', description: error?.response?.data?.message || error.message })
                console.log(error);
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
            toast({ variant: 'success', title: 'Sucesso!', description: 'Solicitação criada com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Erro ao tentar criar a solicitação!', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    const update = () => useMutation({
        mutationFn: ({ id, ...rest }: TituloSchemaProps) => {
            return api.put("/financeiro/contas-a-pagar/titulo", { id, ...rest }).then((response) => response.data)
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Solicitação atualizada com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulo'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    const deleteRecorrencia = () => useMutation({
        mutationFn: (id : number|string) => {
            return api.delete(`/financeiro/contas-a-pagar/titulo/recorrencias/${id}`).then((response) => response.data)
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Exclusão de recorrência realizada com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_recorrencias'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    const changeTitulos = () => useMutation({
        mutationFn: async ({ ...rest }: AlteracaoLoteSchemaProps) => {
            return await api.put("/financeiro/contas-a-pagar/titulo/change-fields", {...rest}).then((response) => response.data)
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Alterações realizadas com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_titulo'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })
    const changeRecorrencia = () => useMutation({
        mutationFn: async ({id,data_vencimento}:EditRecorrenciaProps) => {
            return await api.put(`/financeiro/contas-a-pagar/titulo/recorrencias/${id}`, {data_vencimento}).then((response) => response.data)
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Alterações realizadas com sucesso!' })
            queryClient.invalidateQueries({ queryKey: ['fin_cp_recorrencias'] })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    const exportAnexo = () => useMutation({
        mutationFn: async ({type, idSelection}:ExportAnexosProps) => {
            return await api.post(`/financeiro/contas-a-pagar/titulo/download`, {type,idSelection},{
                responseType: 'blob'
            }).then((response) => {
                downloadResponse(response)
            })
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Exportação realizadas com sucesso!' })
        },
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })

    return {
        getAll,
        getRecorrencias,
        getOne,
        insertOne,
        update,
        deleteRecorrencia,
        changeTitulos,
        changeRecorrencia,
        exportAnexo,
    }
}