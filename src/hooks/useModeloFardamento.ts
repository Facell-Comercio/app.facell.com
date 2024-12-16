import { api } from "@/lib/axios";
import { useStoreTableEstoque } from "@/pages/pessoal/fardamentos/estoque/table/store-table";
import {
  useQuery,
} from "@tanstack/react-query";


export const useModeloFardamento = () => {
  return {
    getAll: () => {
      const pagination = useStoreTableEstoque().pagination;
      const filters = useStoreTableEstoque().filters;
  
      return useQuery({
        queryKey: ["pessoal", "fardamento", "modelo", "lista", {pagination, filters}],
        queryFn: async () => {
          const result = await api.get("/pessoal/fardamentos/modelos", {
            params: {
              filters: filters,
              pagination,
            },
          });
          return result; //por que não funciona return result.data ?
        },
      });
    },
  };
};
