
import { api } from "@/lib/axios";
import { BorderoSchemaProps } from "@/pages/financeiro/contas-pagar/components/borderos/bordero/Modal";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
                console.log(`Buscando plano de contas com base no ID: ${id}`)
                return await api.get(`/financeiro/contas-a-pagar/bordero/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data:BorderoSchemaProps
            ) => {
                console.log("Criando novo plano de contas:")            
                return api.post("/financeiro/contas-a-pagar/bordero", data).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
            },
            onError(error) {
                console.log(error);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:BorderoSchemaProps) => {
                console.log(`Atualizando plano de contas com base no ID: ${id}`)            
                return api.put("/financeiro/contas-a-pagar/bordero/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_bordero']}) 
            },
            onError(error) {
                console.log(error);
            },
    })
})}