import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface getOneParams extends GetAllParams {
  id?: string | null;
}

export type TransferenciaTesourariaSchema = {
  id_caixa_saida?: string;
  caixa_saida?: string;
  saldo_caixa_saida?: string;
  id_caixa_entrada?: string;
  caixa_entrada?: string;
  saldo_caixa_entrada?: string;
  valor_transferir?: string;
};

export type TransacaoTesourariaSchema = {
  id?: string;
  descricao: string;
  valor: string;
  id_conta_bancaria: string;
};

export type FechamentoTesourariaSchema = {
  data_fechamento?: Date;
  id_conta_bancaria: string;
};

export const useTesouraria = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "tesouraria", "lista", params],
        queryFn: async () => {
          return await api
            .get(`/financeiro/tesouraria`, { params })
            .then((response) => response.data);
        },
        placeholderData: keepPreviousData,
      }),
    getOne: ({ id, ...params }: getOneParams) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "tesouraria", "detalhe", [id, params]],
        queryFn: async () => {
          return await api
            .get(`/financeiro/tesouraria/${id}`, { params })
            .then((response) => response.data);
        },
        placeholderData: keepPreviousData,
      }),
    getOneTransacao: (id: string) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "tesouraria", "transacao", "detalhe", [id]],
        queryFn: async () => {
          return await api
            .get(`/financeiro/tesouraria/transacao/${id}`)
            .then((response) => response.data);
        },
        placeholderData: keepPreviousData,
      }),
    transferSaldo: () =>
      useMutation({
        mutationFn: async (data: TransferenciaTesourariaSchema) => {
          return await api
            .post(`/financeiro/tesouraria/transferir-saldo`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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
    insertAdiantamento: () =>
      useMutation({
        mutationFn: async (data: TransacaoTesourariaSchema) => {
          return await api
            .post(`/financeiro/tesouraria/adiantamento`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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

    insertSuprimento: () =>
      useMutation({
        mutationFn: async (data: TransacaoTesourariaSchema) => {
          return await api
            .post(`/financeiro/tesouraria/suprimento`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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

    fechamento: () =>
      useMutation({
        mutationFn: async (data: FechamentoTesourariaSchema) => {
          return await api
            .put(`/financeiro/tesouraria/data-fechamento`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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

    updateTransacao: () =>
      useMutation({
        mutationFn: async (data: TransacaoTesourariaSchema) => {
          return await api
            .put(`/financeiro/tesouraria/transacao`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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

    vincularAdiantamento: () =>
      useMutation({
        mutationFn: async (data: { id_titulo: string; id_extrato_bancario: string }) => {
          return await api
            .put(`/financeiro/tesouraria/vincular-adiantamento`, data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro"],
          });
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

    deleteTransacao: () =>
      useMutation({
        mutationFn: async (id: string) => {
          return await api
            .delete(`/financeiro/tesouraria/transacao/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "tesouraria"],
          });
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
