
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const useMovimentoContabil = () => {
    const getAll = ({ pagination, filters }: GetAllParams) => useQuery({
        queryKey: ['fin_movimento_contabil', pagination],
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
        onError(error) {
            // @ts-expect-error "Funciona"
            toast({ variant: "destructive", title: 'Ocorreu o seguinte erro', description: error?.response?.data?.message || error.message })
            console.log(error);
        },
    })
    return {
        getAll,
        downloadZip
    }
}