
import { api } from "@/lib/axios";
import { EquipamentoSchema } from "@/pages/financeiro/cadastros/components/equipamentos-cielo/equipamento/Modal";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useEquipamentos = () => {
    const queryClient = useQueryClient()
    
    return (
        {
            getAll : ({ pagination, filters }: getAllParams) => useQuery({
                queryKey: ['fin_equipamentos_cielo', pagination],
                queryFn: async () => await api.get(`/financeiro/equipamentos-cielo`, { params: { pagination, filters } }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_equipamentos_cielo', id],
                queryFn: async () => {
                    console.log(`Buscando equipamento com base no ID: ${id}`)
                    return await api.get(`/financeiro/equipamentos-cielo/${id}`)
                },
            }),
        
            insertOne : () => useMutation({
                mutationFn: (data:EquipamentoSchema) => {
                    console.log("Criando novo equipamento:")            
                    return api.post("financeiro/equipamentos-cielo", data).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_equipamentos_cielo']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            update : () => useMutation({
                mutationFn: ({id, ...rest}:EquipamentoSchema) => {
                    console.log(`Atualizando equipamento com base no ID: ${id}`)            
                    return api.put("financeiro/equipamentos-cielo/", {id, ...rest}).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_equipamentos_cielo']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
            
        }
    )
}