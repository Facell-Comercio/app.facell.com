import { api } from "@/lib/axios";
import { Permissao } from "@/types/permissao-type";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const usePermissoes = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["permissao", "lista", pagination],
        queryFn: async () =>
          await api.get(`/permissao`, { params: { pagination, filters } }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["permissao", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/permissao/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: Permissao) => {
          return await api
            .post("/permissao", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["permissao"] });
        },
        onError(error) {
          console.log(error);
        },
      }),

    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: Permissao) => {
          return await api
            .put("/permissao", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["permissao", "lista"] });
          queryClient.invalidateQueries({ queryKey: ["permissao"] });
        },
        onError(error) {
          console.log(error);
        },
      }),
  };
};
