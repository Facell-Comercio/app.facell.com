import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  useQuery,
} from "@tanstack/react-query";


export const useTamanhoFardamento = () => {
  return {
    getAll: (params?: GetAllParams) => {
      return useQuery({
        queryKey: ["pessoal", "fardamento", "tamanho", "lista", params],
        queryFn: async () => {
          const result = await api.get("/pessoal/fardamentos/tamanhos", {params: params });
          return result; //por que não funciona return result.data ?
        },
      });
    },
  };
};
