import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type CartaoSchema = {
  id?: string;
  id_matriz: string;
  descricao: string;
  nome_portador: string;
  dia_vencimento: string;
  id_fornecedor: string;
  nome_fornecedor: string;
  active: boolean;
  faturas?: FaturasDatabaseSchema;
  users?: CartoesDatabaseSchema[];
};

type FaturasDatabaseSchema = {
  rows: FaturaSchema[];
  pageCount: number;
  rowCount: number;
};

type CartoesDatabaseSchema = {
  id: string;
  nome: string;
  img_url: string;
};

export type FaturaSchema = {
  id?: string | null;
  data_vencimento?: Date;
  data_prevista?: Date;
  cod_barras?: string;
  valor_inicial?: string;
  valor?: string;
  estorno?: string;
  status?: string;
  closed?: boolean;
  id_cartao?: string;
  dia_vencimento?: string;
};

export type TransferVencimentosSchema = {
  id_cartao: string;
  id_antiga_fatura: string;
  data_vencimento: Date;
  data_prevista: Date;
  ids: string[];
};

export type InsertUserFaturaSchema = {
  id_cartao?: string | number | null;
  id_user?: string | number | null;
};

export type GetAllParamsCartao = {
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  filters?: any;
  id: string | null | undefined;
};

export type GetOneParamsCartao = {
  pagination?: {
    pageIndex: number;
    pageSize: number;
  };
  filters?: any;
  id: string | null | undefined;
};

export const useCartoes = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        staleTime: Infinity,
        queryKey: ["financeiro", "contas_pagar", "cartao", "lista", params?.pagination],
        queryFn: async () => await fetchApi.financeiro.contas_pagar.cartoes.getAll(params),
        placeholderData: [],
      }),

    getOne: ({ id, ...params }: GetOneParamsCartao) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "contas_pagar", "cartao", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/cartoes/${id}`, {
            params,
          });
        },
      }),

    getFatura: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "contas_pagar", "cartao", "fatura", "detalhe", id],
        staleTime: 0,
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/cartoes/fatura/${id}`);
        },
      }),

    getOneFaturas: ({ id, ...rest }: GetAllParamsCartao) =>
      useQuery({
        enabled: !!id,
        staleTime: 0,
        queryKey: ["financeiro", "contas_pagar", "cartao", "fatura", "lista", id, rest.pagination],
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/cartoes/${id}/faturas/`, {
            params: rest,
          });
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: CartaoSchema) => {
          return await api
            .post("financeiro/contas-a-pagar/cartoes", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_cartoes"] });
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

    insertUserFatura: () =>
      useMutation({
        mutationFn: async (data: InsertUserFaturaSchema) => {
          return await api
            .post("financeiro/contas-a-pagar/cartoes/user", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar", "cartao"],
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

    update: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: CartaoSchema) => {
          return await api
            .put("financeiro/contas-a-pagar/cartoes/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar", "cartao"],
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

    updateFatura: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: FaturaSchema) => {
          return await api
            .put(`financeiro/contas-a-pagar/cartoes/fatura/${id}`, { ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar"],
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

    transferVencimentos: () =>
      useMutation({
        mutationFn: async (body: TransferVencimentosSchema) => {
          return await api
            .put(`financeiro/contas-a-pagar/cartoes/fatura/transfer`, {
              ...body,
            })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar"],
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

    removeUserFatura: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`financeiro/contas-a-pagar/cartoes/user/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar"],
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

    deleteCartao: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`financeiro/contas-a-pagar/cartoes/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro", "contas_pagar", "cartao"],
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
