
import { api } from "@/lib/axios";
import { ContaBancariaSchema } from "@/pages/financeiro/cadastros/contas-bancarias/conta-bancaria/Modal";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useContasBancarias = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : ({ pagination, filters }: GetAllParams) => useQuery({
            queryKey: ['fin_contas_bancarias', pagination, filters.id_matriz],
            queryFn: async () => { return await api.get(`financeiro/contas-bancarias/`, { params: { pagination, filters } }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['fin_contas_bancarias', id],
            queryFn: async () => {
                console.log(`Buscando plano de contas com base no ID: ${id}`)
                return await api.get(`financeiro/contas-bancarias/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data:ContaBancariaSchema) => {
                console.log("Criando novo plano de contas:")            
                return api.post("financeiro/contas-bancarias", data).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_contas_bancarias']}) 
            },
            onError(error) {
                console.log(error);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:ContaBancariaSchema) => {
                console.log(`Atualizando plano de contas com base no ID: ${id}`)            
                return api.put("financeiro/contas-bancarias/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_contas_bancarias']}) 
            },
            onError(error) {
                console.log(error);
            },
    })
})}