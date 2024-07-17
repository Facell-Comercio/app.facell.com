import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { BancoSchema } from "@/pages/financeiro/cadastros/bancos/banco/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useBancos = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ['financeiro', 'banco', 'lista', params],
        queryFn: async () =>
          await api.get(`/financeiro/bancos`, { params: params }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ['financeiro', 'banco', 'detalhe', id],
        queryFn: async () => {
          return await api.get(`/financeiro/bancos/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: BancoSchema) => {
          return api
            .post('/financeiro/bancos', data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['banco'] });
          toast({
            variant: 'success',
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
          const errorMessage = error.response?.data.message || error.message;
          toast({
            title: 'Erro',
            description: errorMessage,
            duration: 3500,
            variant: 'destructive',
          });
        },
      }),

    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: BancoSchema) => {
          return await api
            .put('/financeiro/bancos/', { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['banco'] });
          toast({
            variant: 'success',
            title: 'Sucesso',
            description: 'Atualização realizada com sucesso',
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
          const errorMessage = error.response?.data.message || error.message;
          toast({
            title: 'Erro',
            description: errorMessage,
            duration: 3500,
            variant: 'destructive',
          });
        },
      }),
  };
};
