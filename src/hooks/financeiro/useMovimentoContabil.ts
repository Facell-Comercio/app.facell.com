
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const useMovimentoContabil = () => {
    const getAll = ({ pagination, filters }: GetAllParams) => useQuery({
        queryKey: ['financeiro', 'contas_pagar', 'movimento_contabil', 'lista', pagination],
        queryFn: async () => { return await api.get(`/financeiro/contas-a-pagar/movimento-contabil`, { params: { pagination, filters } }) },
        placeholderData: keepPreviousData
    });

    const downloadZip = () => useMutation({
        mutationFn: async ({ filters }: GetAllParams) => {
            return await api
            .get(`/financeiro/contas-a-pagar/movimento-contabil/download`, {
              params: { filters },
              responseType: "blob",
            })
            .then((response) => {      
              downloadResponse(response);
            });
        },
        onSuccess() {
            toast({ variant: 'success', title: 'Sucesso!', description: 'Exportação de movimento contábil realizada com sucesso!' })
        },
        onError: async (error)=> {
            // @ts-expect-error "Funciona"   
            const errorText = await error.response.data.text();
            const errorJSON = JSON.parse(errorText);
            
            toast({ 
                variant: "destructive", 
                title: 'Ocorreu o seguinte erro', 
                description: errorJSON.message
            });
        },
    })
    return {
        getAll,
        downloadZip
    }
}