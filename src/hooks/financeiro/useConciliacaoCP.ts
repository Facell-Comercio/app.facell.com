
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { ConciliacaoCPSchemaProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/components/ModalConciliar";
import { TitulosConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TitulosConciliar";
import { TransacoesConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TransacoesConciliar";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ConciliacaoAutomaticaProps {
    vencimentos: TitulosConciliarProps[],
    transacoes: TransacoesConciliarProps[],
}

export const useConciliacaoCP = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_conciliacao_cp'],
            queryFn: async () => { return await api.get(`/financeiro/conciliacao-cp/`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getConciliacoes : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_conciliacoes_realizadas_cp', pagination],
            queryFn: async () => { return await api.get(`/financeiro/conciliacao-cp/conciliacoes`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['fin_conciliacao_cp', id],
            queryFn: async () => {
                console.log(`Buscando conciliação com base no ID: ${id}`)
                return await api.get(`/financeiro/conciliacao-cp/${id}`)
            },
        }),

        conciliacaoManual : () => useMutation({
            mutationFn: async (data:ConciliacaoCPSchemaProps
            ) => {
                console.log("Criando uma nova conciliação:")            
                return api.post("/financeiro/conciliacao-cp", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Nova conciliação criada", duration: 3500, variant:"success"})
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
                queryClient.invalidateQueries({queryKey:['fin_conciliacoes_realizadas_cp']}) 
            },
            onError(error: AxiosError) { 
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        conciliacaoAutomatica : () => useMutation({
            mutationFn: async (data:ConciliacaoAutomaticaProps
            ) => {
                console.log("Criando uma nova conciliação:")            
                return api.post("/financeiro/conciliacao-cp/automatica", data).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']})
                queryClient.invalidateQueries({queryKey:['fin_conciliacoes_realizadas_cp']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        deleteConciliacao :() => useMutation({
            mutationFn: async (id: string|null|undefined|number) => {
                console.log(`Deletando conta com base no ID`)            
                return api.delete(`/financeiro/conciliacao-cp/${id}`).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']})
                queryClient.invalidateQueries({queryKey:['fin_conciliacoes_realizadas_cp']}) 
                toast({variant: "success", title: "Sucesso", description: "Conciliação desfeita com sucesso", duration: 3500})
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),
})}