
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TitulosProps } from "@/pages/financeiro/components/ModalTitulos";
import { BorderoSchemaProps } from "@/pages/financeiro/contas-pagar/components/borderos/bordero/Modal";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type TransferDataProps = {
    id_titulo: string,
    id_status?: string
  }

export const useBordero = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_bordero', pagination],
            queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/bordero/`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['fin_bordero', id],
            queryFn: async () => {
                console.log(`Buscando borderô com base no ID: ${id}`)
                return await api.get(`/financeiro/contas-a-pagar/bordero/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data:BorderoSchemaProps
            ) => {
                console.log("Criando novo borderô:")            
                return api.post("/financeiro/contas-a-pagar/bordero", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Novo borderô criado", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:BorderoSchemaProps) => {
                console.log(`Atualizando borderô com base no ID: ${id}`)            
                return api.put("/financeiro/contas-a-pagar/bordero/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Atualização realizada com sucesso", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
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
                return api.put("financeiro/contas-a-pagar/bordero/transfer", data).then((response)=>response.data)
            },
            onSuccess() {
                toast({title: "Sucesso", description: "Transferência realizada com sucesso", duration: 3500})
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
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
                return api.delete(`/financeiro/contas-a-pagar/bordero/titulo/${id}`).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
                toast({title: "Sucesso", description: "Atualização realizada com sucesso", duration: 3500})
            },
            onError(error: AxiosError) {
                // @ts-expect-error "Vai funcionar"
                const errorMessage = error.response?.data.message||error.message
                toast({title: "Erro", description:errorMessage, duration: 3500, variant:"destructive"})
                console.log(errorMessage);
            },
        }),

        deleteBordero :() => useMutation({
            mutationFn: (params:{id: string|null|undefined|number, titulos:TitulosProps[]}) => {
                const {id, titulos} = params;
                console.log(`Deletando conta com base no ID`)            
                return api.delete(`/financeiro/contas-a-pagar/bordero/${id}`, {data:titulos}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
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