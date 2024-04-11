
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { cadastroSchemaProps } from "@/pages/financeiro/orcamento/components/cadastros/cadastro/form-data";
import { MeuOrcamentoSchema } from "@/pages/financeiro/orcamento/components/meu-orcamento/orcamento/form-data";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrcamento = () => {
    const queryClient = useQueryClient()
    
    return (
        {
            getAll : (params?: GetAllParams) => useQuery({
                queryKey: ['fin_orcamento', params],
                queryFn: async () => await api.get(`/financeiro/orcamento/`, { params: params }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_orcamento', id],
                queryFn: async () => {
                    console.log(`Buscando orcamento com base no ID: ${id}`)
                    return await api.get(`/financeiro/orcamento/${id}`)
                },
            }),

            insertOne : () => useMutation({
                mutationFn: (data:cadastroSchemaProps) => {
                    console.log("Criando novo orcamento:")            
                    return api.post("/financeiro/orcamento", data).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Novo Orçamento Criado", duration: 3500})
                    queryClient.invalidateQueries({queryKey:['fin_orcamento']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),

            update : () => useMutation({
                mutationFn: (data:cadastroSchemaProps) => {
                    console.log(`Atualizando meu orcamento com base no ID`)            
                    return api.put("financeiro/orcamento", data).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Atualização Realizada", duration: 3500})
                    queryClient.invalidateQueries({queryKey:['fin_orcamento']}) 
                },
                onError(error) {
                    toast({title: "Error", description: error.message, duration: 3500})
                    console.log(error);
                },
            }),

            deleteBudget :() => useMutation({
                mutationFn: (id: string|null|undefined|number) => {
                    console.log(`Deletando conta com base no ID`)            
                    return api.delete(`financeiro/orcamento/${id}`).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Atualização Realizada", duration: 3500})
                    queryClient.invalidateQueries({queryKey:['fin_orcamento']}) 
                },
                onError(error) {
                    toast({title: "Error", description: error.message, duration: 3500})
                    console.log(error);
                },
            }),

            getMyBudgets : ({ pagination, filters }: GetAllParams) => useQuery({
                queryKey: ['fin_my_budget', pagination],
                queryFn: async () => await api.get(`/financeiro/orcamento/my-budget`, { params: { pagination, filters } }),
                placeholderData: keepPreviousData
            }),

            getMyBudget : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_my_budget', id],
                queryFn: async () => {
                    console.log(`Buscando orcamento com base no ID: ${id}`)
                    return await api.get(`/financeiro/orcamento/my-budget/${id}`)
                },
            }),
        
            transfer : () => useMutation({
                mutationFn: (data:MeuOrcamentoSchema) => {
                    console.log(`Atualizando meu orcamento com base no ID`)            
                    return api.put("financeiro/orcamento/my-budget", data).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Tranferencia Realizada", duration: 3500})

                    queryClient.invalidateQueries({queryKey:['fin_my_budget']}) 
                },
                onError(error) {
                    toast({title: "Error", description: error.message, duration: 3500})
                    console.log(error);
                },
            }),
        }
    )
}