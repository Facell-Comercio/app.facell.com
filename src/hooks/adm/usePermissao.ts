import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const usePermissao = () => {
  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["adm", "permissao", "lista", params],
        queryFn: async () =>
          await api.get("/adm/permissoes", { params: params }).then((response) => response.data),
        placeholderData: keepPreviousData,
        staleTime: Infinity,
      }),

    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ["adm", "permissao", "detalhe", id],
        queryFn: async () => await api.get(`/adm/permissoes/${id}`),
        staleTime: Infinity,
      }),
  };
};
