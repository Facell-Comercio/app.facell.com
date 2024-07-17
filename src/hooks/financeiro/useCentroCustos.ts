import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { CentroCustosSchema } from "@/pages/financeiro/cadastros/centro-de-custos/centro-custo/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCentroCustos = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "centro_custo", "lista", pagination, filters.id_grupo_economico, filters.id_matriz],
        queryFn: async () =>
          await api.get(`/financeiro/centro-custos`, {
            params: { pagination, filters },
          }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "centro_custo", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/centro-custos/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: CentroCustosSchema) => {
          return api
            .post("financeiro/centro-custos", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "centro_custo"] });
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
        mutationFn: async ({ id, ...rest }: CentroCustosSchema) => {
          return await api
            .put("financeiro/centro-custos/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "centro_custo"] });
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
