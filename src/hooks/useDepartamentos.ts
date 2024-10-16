import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { DepartamentoFormData } from "@/pages/admin/departamentos/departamento/form-data";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useDepartamentos = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params: undefined | GetAllParams) =>
      useQuery({
        queryKey: ['departamento', 'lista', params],
        queryFn: async () => await api.get("/departamento", { params: params }),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ['departamento', 'detalhe', id],
        queryFn: async () => await api.get(`/departamento/${id}`),
        staleTime: Infinity,
      }),

    getUserDepartamento: () =>
      useQuery({
        queryKey: ['user', 'departamento', 'lista'],
        queryFn: async () => await api.get(`/departamento/user-departamentos`),
        staleTime: Infinity,
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: DepartamentoFormData) => {
          return await api
            .post('departamento', data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Departamento inserido com sucesso.',
          });
          queryClient.invalidateQueries({ queryKey: ['departamento'] });
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
        mutationFn: async ({ id, ...rest }: DepartamentoFormData) => {
          return await api
            .put('departamento', { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Departamento atualizado com sucesso.',
          });
          queryClient.invalidateQueries({ queryKey: ['departamento'] });
        },
        onError(error) {
          toast({
            title: 'Ocorreu o seguinte erro',
            description: error.message,
          });
        },
      }),
  };
};
