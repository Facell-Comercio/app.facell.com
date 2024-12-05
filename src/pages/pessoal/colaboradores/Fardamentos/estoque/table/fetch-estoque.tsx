import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useStoreEstoque } from "./store-table";

export const useEstoque = () => ({
  getAll: () => {
    const pagination = useStoreEstoque().pagination;
    const filters = useStoreEstoque().filters;

    return useQuery({
      queryKey: ["pessoal", "fardamento", "estoque", "lista", {pagination, filters}],
      queryFn: async () => {
        const result = await api.get("/pessoal/fardamentos/estoque/", {
          params: {
            filters: filters,
            pagination,
          },
        });
        return result;
      },
    });
  },
});
