import { api } from "@/lib/axios";
import { EstoqueFormdata } from "@/pages/pessoal/fardamentos/estoque/components/form-data";
import { useStoreEstoque } from "@/pages/pessoal/fardamentos/estoque/table/store-table";
import { Permissao } from "@/types/permissao-type";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";


export const useFardamentos = () => {
  const queryClient = useQueryClient();
  return {
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
          return result.data;
        },
      });
    },

    abastecer: () =>
      useMutation({
        mutationFn: async (data: EstoqueFormdata) => {
          return await api
            .post('/pessoal/fardamentos/estoque/abastecer', data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['pessoal','fardamento'] });
        },
        onError(error) {
          console.log(error);
        },
      }),
    
    getOne: (id?: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ['pessoal','fardamento', id],
        queryFn: async () => await api.get(`/pessoal/fardamentos/estoque/${id}`),
        // staleTime: Infinity,
      }),
    
    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: Permissao) => {
          return await api
            .put('/permissao', { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ['permissao'] });
        },
        onError(error) {
          console.log(error);
        },
      }),
  };
};
