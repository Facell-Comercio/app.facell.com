import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { FilialFormData } from "@/pages/admin/filiais/filial/form-data";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useFilial = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ['filial', 'lista', params],
        queryFn: async () => await api.get('/filial', { params: params }),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ['filial', 'detalhe', id],
        queryFn: async () => await api.get(`/filial/${id}`),
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: FilialFormData) => {
          return await api
            .post('filial', data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Filial inserida com sucesso.',
          });
          queryClient.invalidateQueries({ queryKey: ['filial'] });
        },
        onError(error) {
          toast({
            title: 'Ocorreu o seguinte erro',
            description: error.message,
          });
        },
      }),
    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: FilialFormData) => {
          return await api
            .put('filial', { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Filial atualizada com sucesso.',
          });
          queryClient.invalidateQueries({ queryKey: ['filial'] });
        },
        onError(error) {
          toast({
            title: 'Ocorreu o seguinte erro',
            description: error.message,
          });
          console.log(error);
        },
      }),
  };
};
