import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { ContaBancariaSchema } from "@/pages/financeiro/cadastros/contas-bancarias/conta-bancaria/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useContasBancarias = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "conta_bancaria", "lista", pagination, filters.id_matriz],
        queryFn: async () => {
          return await api.get(`financeiro/contas-bancarias/`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conta_bancaria", "detalhe", id],
        queryFn: async () => {
          return await api.get(`financeiro/contas-bancarias/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: ContaBancariaSchema) => {
          return await api
            .post("financeiro/contas-bancarias", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "conta_bancaria"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error "Vai funcionar"
          const errorMessage = error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: ContaBancariaSchema) => {
          return await api
            .put("financeiro/contas-bancarias/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "conta_bancaria"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error "Vai funcionar"
          const errorMessage = error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),
  };
};
