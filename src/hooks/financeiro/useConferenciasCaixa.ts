import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TransacoesCreditProps } from "@/pages/financeiro/controle-caixa/conferecia-caixa/caixas/caixa/components/ModalTransacoesCredit";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export type OcorrenciasProps = {
  id?: string;
  id_user_criador?: string;
  id_user_resolvedor?: string;
  data_caixa?: string | Date;
  data_ocorrencia?: string | Date;
  resolvida?: string | number | boolean;
  descricao?: string;
  user_criador?: string;
};

export type AjustesProps = {
  id?: string;
  id_caixa?: string;
  id_user?: string;
  tipo_ajuste?: string;
  user?: string;
  saida?: string;
  entrada?: string;
  valor?: string;
  obs?: string;
  aprovado?: string;
  id_user_aprovador?: string;
};

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
  id_caixa?: string;
  id_conta_bancaria?: string;
  conta_bancaria?: string;
  valor?: string;
  comprovante?: string;
  data_deposito?: string;
};

export type ConferenciasCaixaSchema = {
  id?: string;
  created_at?: string;
  data?: string;
  manual: boolean;
  caixa_confirmado: boolean;
  data_baixa_datasys?: string;
  data_conferencia?: string;
  divergente?: string;
  id_filial?: string | number;
  id_matriz?: string;
  id_user_conferencia?: string;
  ocorrencias?: string;
  ajustes?: string;
  ocorrencias_resolvidas?: string;
  saldo_anterior?: string;
  saldo_atual?: string;
  status?: string;
  updated_at?: string;

  valor_dinheiro?: string;
  valor_despesas?: string;
  total_dinheiro?: string;
  valor_devolucoes?: string;

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

  valor_crediario?: string;
  valor_crediario_real?: string;
  divergencia_crediario?: string;

  movimentos_caixa?: MovimentoCaixaProps[];
  depositos_caixa?: DepositosCaixaProps[];
  qtde_depositos_caixa?: string;
  historico?: {
    id: string;
    created_at: string;
    descricao: string;
  }[];

  caixa_anterior_fechado: boolean;
  suprimento_caixa?: string;
};

type MultiDepositoExtratoSchema = {
  id_caixa: string | number;
  extratos: TransacoesCreditProps[];
};

export const useConferenciasCaixa = () => {
  const queryClient = useQueryClient();

  return {
    getFiliais: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "conferencia_de_caixa", "filiais", "list", [params]],
        queryFn: async () =>
          await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/filiais`, {
              params: params,
            })
            .then((response) => response.data),

        placeholderData: keepPreviousData,
      }),

    getAll: (params?: GetAllParams) =>
      useQuery({
        enabled: !!params?.filters.id_filial,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "list", [params]],
        queryFn: async () =>
          await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/`, {
              params: params,
            })
            .then((response) => response.data),

        placeholderData: keepPreviousData,
      }),

    getAllOcorrencias: (params?: GetAllParams) =>
      useQuery({
        enabled: !!params?.filters.id_filial,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "ocorrencias", "list", [params]],
        queryFn: async () =>
          await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/ocorrencias`, {
              params: params,
            })
            .then((response) => response.data),

        placeholderData: keepPreviousData,
      }),

    getAllAjustes: (params?: GetAllParams) =>
      useQuery({
        enabled: !!params?.filters.id_caixa,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "ajustes", "list", [params]],
        queryFn: async () =>
          await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes`, {
              params: params,
            })
            .then((response) => response.data),

        placeholderData: keepPreviousData,
      }),

    getOne: (id?: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/${id}`)
            .then((response) => response.data);
        },
      }),

    getOneDeposito: (id?: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "depositos", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/depositos/${id}`)
            .then((response) => response.data);
        },
      }),

    getOneOcorrencia: (id?: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "ocorrencias", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/ocorrencias/${id}`)
            .then((response) => response.data);
        },
      }),

    getOneAjuste: (id?: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conferencia_de_caixa", "caixas", "ajustes", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes/${id}`)
            .then((response) => response.data);
        },
      }),

    getCardDetalhe: (params: { id_caixa?: string | null; type?: string | null }) =>
      useQuery({
        enabled: !!params.id_caixa && !!params.type,
        queryKey: [
          "financeiro",
          "conferencia_de_caixa",
          "caixas",
          "cards",
          "detalhe",
          [params.id_caixa, params.type],
        ],
        queryFn: async () => {
          return await api
            .get(`/financeiro/controle-de-caixa/conferencia-de-caixa/cards`, {
              params: params,
            })
            .then((response) => response.data);
        },
      }),

    insertOneDeposito: () =>
      useMutation({
        mutationFn: async (data: DepositosCaixaProps) => {
          return api
            .post("/financeiro/controle-de-caixa/conferencia-de-caixa/depositos", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    insertMultiDepositoExtrato: () =>
      useMutation({
        mutationFn: async (data: MultiDepositoExtratoSchema) => {
          return api
            .post(
              "/financeiro/controle-de-caixa/conferencia-de-caixa/multi-depositos-extratos",
              data
            )
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    insertOneOcorrencia: () =>
      useMutation({
        mutationFn: async (data: OcorrenciasProps) => {
          return api
            .post("/financeiro/controle-de-caixa/conferencia-de-caixa/ocorrencias", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    insertOneAjuste: () =>
      useMutation({
        mutationFn: async (data: AjustesProps) => {
          return api
            .post("/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    updateDeposito: () =>
      useMutation({
        mutationFn: async (data: DepositosCaixaProps) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/depositos", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    updateOcorrencia: () =>
      useMutation({
        mutationFn: async (data: OcorrenciasProps) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/ocorrencias", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    updateAjuste: () =>
      useMutation({
        mutationFn: async (data: AjustesProps) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    aprovarAjuste: () =>
      useMutation({
        mutationFn: async (id_ajuste?: string | null | undefined) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes/aprovar", {
              id_ajuste,
            })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    cruzarRelatorios: () =>
      useMutation({
        mutationFn: async (data: { id_filial?: string | number; data_caixa?: string }) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/cruzar-relatorios", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    cruzarRelatoriosLote: () =>
      useMutation({
        mutationFn: async () => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/cruzar-relatorios-lote")
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    changeStatus: () =>
      useMutation({
        mutationFn: async (data: { id?: string | null | undefined; action: string }) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/change-status", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    deleteDeposito: () =>
      useMutation({
        mutationFn: async (id?: string | null | undefined) => {
          return api
            .delete(`/financeiro/controle-de-caixa/conferencia-de-caixa/depositos/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    deleteAjuste: () =>
      useMutation({
        mutationFn: async (id?: string | null | undefined) => {
          return api
            .delete(`/financeiro/controle-de-caixa/conferencia-de-caixa/ajustes/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        },
      }),

    importDatasys: () =>
      useMutation({
        mutationFn: async (data: { id_filial: string | number; range_datas: DateRange }) => {
          return await api
            .put("/financeiro/controle-de-caixa/conferencia-de-caixa/import-caixas-datasys", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "conferencia_de_caixa", "caixas"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
        },
        onError(error) {
          const errorMessage =
            // @ts-expect-error 'Vai funcionar'
            error.response?.data.message || error.message;
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
