
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TitulosProps } from "@/pages/financeiro/components/ModalTitulos";
import { ConciliacaoCPSchemaProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/components/ModalConciliar";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type TransferDataProps = {
    id_titulo: string,
    id_status?: string
  }

export const useConciliacaoCP = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_conciliacao_cp', pagination],
            queryFn: async () => { return await api.get(`/financeiro/conciliacao-cp/`, { params: { pagination, filters } }) },
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

        insertOne : () => useMutation({
            mutationFn: (data:ConciliacaoCPSchemaProps
            ) => {
                console.log("Criando novo borderô:")            
                return api.post("/financeiro/conciliacao-cp", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Novo borderô criado", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:ConciliacaoCPSchemaProps) => {
                console.log(`Atualizando borderô com base no ID: ${id}`)            
                return api.put("/financeiro/conciliacao-cp/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                toast({variant:"success", title: "Sucesso", description: "Atualização realizada com sucesso", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            }
        }),

        transferTitulos : () => useMutation({
            mutationFn: (data:{id_conta_bancaria: string, date: Date, titulos: TransferDataProps[]}) => {
                console.log(`Realizando tranferência de títulos`)            
                return api.put("financeiro/conciliacao-cp/transfer", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({variant:"success",title: "Sucesso", description: "Transferência realizada com sucesso", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),
            
        deleteTitulo :() => useMutation({
            mutationFn: (id: string|null|undefined|number) => {
                console.log(`Deletando conta com base no ID`)            
                return api.delete(`/financeiro/conciliacao-cp/titulo/${id}`).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
                toast({variant:"success",title: "Sucesso", description: "Atualização realizada com sucesso", duration: 3500})
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        deleteConciliacaoCP :() => useMutation({
            mutationFn: (params:{id: string|null|undefined|number, titulos:TitulosProps[]}) => {
                const {id, titulos} = params;
                console.log(`Deletando conta com base no ID`)            
                return api.delete(`/financeiro/conciliacao-cp/${id}`, {data:titulos}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_conciliacao_cp']}) 
                toast({title: "Sucesso", description: "Exclusão realizada com sucesso", duration: 3500})
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),
})}