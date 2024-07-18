import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { PlanoContasSchema } from "@/pages/financeiro/cadastros/plano-de-contas/plano-conta/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const usePlanoContas = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "plano_contas", "lista", pagination],
        queryFn: async () => {
          return await api.get(`financeiro/plano-contas/`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "plano_contas", "detalhe", id],
        queryFn: async () => {
          return await api.get(`financeiro/plano-contas/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: PlanoContasSchema) => {
          return await api
            .post("financeiro/plano-contas", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "plano_contas"] });
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
        mutationFn: async ({ id, ...rest }: PlanoContasSchema) => {
          return await api
            .put("financeiro/plano-contas/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "plano_contas"] });
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
