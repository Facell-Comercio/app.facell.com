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

export const useUsers = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params: GetAllParams) => {
      return useQuery({
        queryKey: [`users`, params],
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const result = await api.get("/user", { params });
          return result;
        },
      });
    },
    getOne: (id: string | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: [`user`, id],
        queryFn: async () => {
          return await api.get(`user/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: UserFormData) => {
          return await api.post("user", data).then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Usuário inserido com sucesso.",
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError(error) {
          toast({
            title: "Ocorreu o seguinte erro",
            description: error.message,
          });
          console.log(error);
        },
      }),

    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: UserFormData) => {
          return await api
            .put("user", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Usuário atualizado com sucesso.",
          });
          queryClient.invalidateQueries({ queryKey: ["users"] });
          queryClient.invalidateQueries({ queryKey: ["user"] });
        },
        onError(error) {
          toast({
            title: "Ocorreu o seguinte erro",
            description: error.message,
          });
          console.log(error);
        },
      }),
  };
};
