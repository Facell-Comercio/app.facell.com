
import { api } from "@/lib/axios";
import { FornecedorSchema } from "@/pages/financeiro/cadastros/components/fornecedores/fornecedor/ModalFornecedor";
import { getAllParams } from "@/types/params";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useFornecedores = () => {
    const queryClient = useQueryClient()
    
    return (
        {
            getAll : (params?: getAllParams) => useQuery({
                queryKey: ['fin_fornecedores', params],
                queryFn: async () => await api.get(`/financeiro/fornecedores`, { params: params }),
                placeholderData: keepPreviousData
            }),
        
            getOne : (id: string|null|undefined) => useQuery({
                enabled: !!id,
                queryKey: ['fin_fornecedores', id],
                queryFn: async () => {
                    console.log(`Buscando título com base no ID: ${id}`)
                    return await api.get(`/financeiro/fornecedores/${id}`)
                },
            }),
        
            insertOne : () => useMutation({
                mutationFn: (data:FornecedorSchema) => {
                    console.log("Criando novo fornecedor:")            
                    return api.post("financeiro/fornecedores", data).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_fornecedores']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            update : () => useMutation({
                mutationFn: ({id, ...rest}:FornecedorSchema) => {
                    console.log(`Atualizando fornecedor com base no ID: ${id}`)            
                    return api.put("financeiro/fornecedores/", {id, ...rest}).then((response)=>response.data)
                },
                onSuccess() {
                    console.log("deu certo!!!!!".toLocaleUpperCase());
                    queryClient.invalidateQueries({queryKey:['fin_fornecedores']}) 
                },
                onError(error) {
                    console.log(error);
                },
            }),
        
            consultaCnpj : async (cnpj?:string) => await api.get(`/financeiro/fornecedores/consulta-cnpj/${cnpj}`)
        
        }
    )
}