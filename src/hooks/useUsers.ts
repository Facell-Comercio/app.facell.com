import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { UserFormData } from "@/pages/admin/users/user/form-data";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type UserProps = {
  id?: number | string | null;
  nome?: string;
};

type UserUpdateProps = {
  id: number | null;
  senha: string;
  confirmaSenha: string;
};

export const useUsers = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params: GetAllParams) => {
      return useQuery({
        queryKey: ['user', 'lista', params],
        placeholderData: keepPreviousData,
        queryFn: ()=>fetchApi.user.getAll({params}),
      });
    },
    getOne: (id: number | null) =>
      useQuery({
        enabled: !!id,
        queryKey: ['user', 'detalhe', id],
        queryFn: ()=>fetchApi.user.getOne(id)
      }),

    insertOne: () =>
      useMutation({
        mutationFn: (data: UserFormData)=>fetchApi.user.insertOne(data),
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Usuário inserido com sucesso.',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['user'] });
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
        mutationFn: (data: UserFormData)=>fetchApi.user.update(data),
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Usuário atualizado com sucesso.',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['user'] });
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

    updatePassword: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: UserUpdateProps) => {
          return await api
            .put('auth/alterar-senha', { params: { id, ...rest } })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: 'Sucesso!',
            description: 'Senha atualizada com sucesso.',
            variant: 'success',
          });
          queryClient.invalidateQueries({ queryKey: ['user'] });
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
