import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  useQuery,
} from "@tanstack/react-query";


export const useModeloFardamento = () => {
  return {
    getAll: (params?: GetAllParams) => {
      return useQuery({
        queryKey: ["pessoal", "fardamento", "modelo", "lista", params ],
        queryFn: async () => {
          const result = await api.get("/pessoal/fardamentos/modelos", {params: params});
          return result; //por que não funciona return result.data ?
        },
      });
    },
  };
};
