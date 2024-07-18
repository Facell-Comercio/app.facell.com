import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GrupoEconomicoFormData } from "@/pages/admin/grupos-economicos/grupo-economico/form-data";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGrupoEconomico = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ['grupo_economico', 'lista', params],
        queryFn: async () => await fetchApi.grupo_economico.getAll(params),
        // placeholderData: keepPreviousData,
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    getAllMatriz: (params?: GetAllParams) =>
      useQuery({
        queryKey: ['matriz', 'lista', params],
        queryFn: async () =>
          await api.get('/grupo-economico/matriz', { params: params }),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ['grupo_economico', 'detalhe', id],
        queryFn: async () => await api.get(`/grupo-economico/${id}`),
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: GrupoEconomicoFormData) => {
          return await api
            .post('grupo-economico', data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Grupo econômico inserido com sucesso.',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['grupo_economico'] });
        },
        onError(error) {
          toast({
            title: 'Ocorreu o seguinte erro',
            description: error.message,
            variant: 'destructive',
          });
          console.log(error);
        },
      }),
    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: GrupoEconomicoFormData) => {
          return await api
            .put('grupo-economico', { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Grupo econômico atualizado com sucesso.',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['grupo_economico'] });
        },
        onError(error) {
          toast({
            title: 'Ocorreu o seguinte erro',
            description: error.message,
            variant: 'destructive',
          });
        },
      }),
  };
};
