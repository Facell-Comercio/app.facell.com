import { api } from "@/lib/axios";
import { useStoreTableEstoque } from "@/pages/pessoal/fardamentos/estoque/table/store-table";
import {
  useQuery,
} from "@tanstack/react-query";


export const useTamanhoFardamento = () => {
  return {
    getAll: () => {
      const pagination = useStoreTableEstoque().pagination;
      const filters = useStoreTableEstoque().filters;
  
      return useQuery({
        queryKey: ["pessoal", "fardamento", "tamanho", "lista", {pagination, filters}],
        queryFn: async () => {
          const result = await api.get("/pessoal/fardamentos/tamanhos", {
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
