import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { PerfilFormData } from "@/pages/admin/perfis/perfil/form-data";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePerfil = () => {
  const queryClient = useQueryClient();
  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["adm", "perfil", "lista", params],
        queryFn: async () =>
          await api.get("/adm/perfis", { params: params }).then((response) => response.data),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ["adm", "perfil", "detalhe", id],
        queryFn: async () => await api.get(`/adm/perfis/${id}`),
        staleTime: Infinity,
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: PerfilFormData) => {
          return await api.post("/adm/perfis", data).then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Perfil inserida com sucesso.",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["adm", "perfil"] });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
          const errorMessage = error.response?.data.message || error.message;

          toast({
            title: "Ocorreu o seguinte erro",
            description: errorMessage,
            variant: "destructive",
          });
        },
      }),
    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: PerfilFormData) => {
          return await api.put("/adm/perfis", { id, ...rest }).then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Perfil atualizada com sucesso.",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["adm", "perfil"] });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
          const errorMessage = error.response?.data.message || error.message;

          toast({
            title: "Ocorreu o seguinte erro",
            description: errorMessage,
            variant: "destructive",
          });
          console.log(error);
        },
      }),
  };
};
