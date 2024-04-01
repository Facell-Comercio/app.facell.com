
import { api } from "@/lib/axios";
import { PlanoContasSchema } from "@/pages/financeiro/cadastros/components/plano-de-contas/plano-conta/ModalPlanoContas";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePlanoContas = () => {
    const queryClient = useQueryClient()
    return ({
        getAll : (params: getAllParams) => useQuery({
            queryKey: ['fin_plano_contas', params],
            queryFn: async () => { return await api.get(`financeiro/plano-contas/`, { params: params }) },
            placeholderData: keepPreviousData
        }),

        getOne : (id: string | null | undefined) => useQuery({
            enabled: !!id,
            queryKey: ['fin_plano_contas', id],
            queryFn: async () => {
                console.log(`Buscando plano de contas com base no ID: ${id}`)
                return await api.get(`financeiro/plano-contas/${id}`)
            },
        }),

        insertOne : () => useMutation({
            mutationFn: (data:PlanoContasSchema) => {
                console.log("Criando novo plano de contas:")            
                return api.post("financeiro/plano-contas", data).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_plano_contas']}) 
            },
            onError(error) {
                console.log(error);
            },
        }),

        update : () => useMutation({
            mutationFn: ({id, ...rest}:PlanoContasSchema) => {
                console.log(`Atualizando plano de contas com base no ID: ${id}`)            
                return api.put("financeiro/plano-contas/", {id, ...rest}).then((response)=>response.data)
            },
            onSuccess() {
                queryClient.invalidateQueries({queryKey:['fin_plano_contas']}) 
            },
            onError(error) {
                console.log(error);
            },
    })
})}