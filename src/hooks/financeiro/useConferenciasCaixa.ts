import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type MovimentoCaixaProps = {
  id?: string;
  data?: string;
  documento?: string;
  tipo_operacao?: string;
  forma_pagamento?: string;
  historico?: string;
  valor?: string;
};

export type DepositosCaixaProps = {
  id?: string;
  hora?: string;
  doc?: string;
  tipo?: string;
  forma_pagamento?: string;
  historico?: string;
  valor?: string;
};

export type ConferenciasCaixaSchema = {
  created_at?: string;
  data?: string;
  data_baixa_datasys?: string;
  data_conferencia?: string;
  divergente?: string;
  id?: string | number;
  id_filial?: string | number;
  id_user_conferencia?: string;
  ocorrencias?: string;
  ocorrencias_resolvidas?: string;
  saldo_anterior?: string;
  saldo_atual?: string;
  status?: string;
  updated_at?: string;

  valor_dinheiro?: string;
  valor_retiradas?: string;
  total_dinheiro?: string;

  valor_cartao?: string;
  valor_cartao_real?: string;
  divergencia_cartao?: string;

  valor_pitzi?: string;
  valor_pitzi_real?: string;
  divergencia_pitzi?: string;

  valor_pix?: string;
  valor_pix_banco?: string;
  divergencia_pix?: string;

  valor_recarga?: string;
  valor_recarga_real?: string;
  divergencia_recarga?: string;

  valor_tradein?: string;
  valor_tradein_disponivel?: string;
  valor_tradein_utilizado?: string;
  divergencia_tradein?: string;

  movimentos_caixa?: MovimentoCaixaProps[];
  qtde_movimentos_caixa?: string;
  depositos_caixa?: DepositosCaixaProps[];
  qtde_depositos_caixa?: string;
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

    getOne: (id?: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: [
          "financeiro",
          "conferencia-de-caixa",
          "caixas",
          "detalhe",
          ,
          id,
        ],
        queryFn: async () => {
          return await api.get(`/financeiro/conferencia-de-caixa/${id}`);
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
