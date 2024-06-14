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
        queryKey: ["departamentos", params],
        queryFn: async () => await api.get("/departamento", { params: params }),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ["departamento", id],
        queryFn: async () => await api.get(`/departamento/${id}`),
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    getUserDepartamento: () =>
      useQuery({
        queryKey: ["user-departamentos"],
        queryFn: async () => await api.get(`/departamento/user-departamentos`),
        staleTime: Infinity,
        refetchOnMount: false,
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: DepartamentoFormData) => {
          return await api
            .post("departamento", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Departamento inserido com sucesso.",
          });
          queryClient.invalidateQueries({ queryKey: ["departamentos"] });
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
        mutationFn: async ({ id, ...rest }: DepartamentoFormData) => {
          return await api
            .put("departamento", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso!",
            description: "Departamento atualizado com sucesso.",
          });
          queryClient.invalidateQueries({ queryKey: ["departamentos"] });
          queryClient.invalidateQueries({ queryKey: ["departamento"] });
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
