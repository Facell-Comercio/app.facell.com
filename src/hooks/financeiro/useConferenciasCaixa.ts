import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type ConferenciasCaixaSchema = {
  id?: string;
  id_matriz: string;
  descricao: string;
  nome_portador: string;
  dia_vencimento: string;
  id_fornecedor: string;
  nome_fornecedor: string;
  active: boolean;
};

export const useConferenciasCaixa = () => {
  const queryClient = useQueryClient();

  return {
    getFiliais: (params?: GetAllParams) =>
      useQuery({
        queryKey: [
          "financeiro",
          "conferencia-de-caixa",
          "filiais",
          "list",
          [params],
        ],
        queryFn: async () =>
          (
            await api.get(`/financeiro/conferencia-de-caixa`, {
              params: params,
            })
          ).data,
        placeholderData: keepPreviousData,
      }),

    getAll: (params?: GetAllParams) =>
      useQuery({
        enabled: !!params?.filters.id_filial,
        queryKey: [
          "financeiro",
          "conferencia-de-caixa",
          "caixas",
          "list",
          [params],
        ],
        queryFn: async () =>
          (
            await api.get(`/financeiro/conferencia-de-caixa/filiais`, {
              params: params,
            })
          ).data,
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "banco", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/conferenciasCaixa/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: ConferenciasCaixaSchema) => {
          return api
            .post("/financeiro/conferenciasCaixa", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["banco"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
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
        mutationFn: async ({ id, ...rest }: ConferenciasCaixaSchema) => {
          return await api
            .put("/financeiro/conferenciasCaixa/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["banco"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          // @ts-expect-error 'Vai funcionar'
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
