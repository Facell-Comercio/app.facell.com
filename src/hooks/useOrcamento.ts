
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { CadastroSchema } from "@/pages/financeiro/orcamento/components/cadastros/cadastro/Modal";
import { MeuOrcamentoSchema } from "@/pages/financeiro/orcamento/components/meu-orcamento/orcamento/form-data";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useOrcamento = () => {
    const queryClient = useQueryClient()
    
    return (
        {
            getAll : (params?: getAllParams) => useQuery({
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
                mutationFn: (data:CadastroSchema) => {
                    console.log("Criando novo orcamento:")            
                    return api.post("financeiro/orcamento", data).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Novo Orçamento Criado"})
                    queryClient.invalidateQueries({queryKey:['fin_orcamento']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),

            update : () => useMutation({
                mutationFn: (data:CadastroSchema) => {
                    console.log(`Atualizando meu orcamento com base no ID`)            
                    return api.put("financeiro/orcamento/my-budget", data).then((response)=>response.data)
                },
                onSuccess() {
                    toast({title: "Sucesso", description: "Atualização Realizada"})
                    queryClient.invalidateQueries({queryKey:['fin_orcamento']}) 
                },
                onError(error) {
                    toast({title: "Error", description: error.message})
                    console.log(error);
                },
            }),

            getMyBudgets : ({ pagination, filters }: getAllParams) => useQuery({
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
                    toast({title: "Sucesso", description: "Tranferencia Realizada"})

                    queryClient.invalidateQueries({queryKey:['fin_my_budget']}) 
                },
                onError(error) {
                    toast({title: "Error", description: error.message})
                    console.log(error);
                },
            }),
        }
    )
}