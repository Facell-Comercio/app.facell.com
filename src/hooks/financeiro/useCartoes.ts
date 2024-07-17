import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type CartaoSchema = {
  id?: string;
  id_matriz: string;
  descricao: string;
  nome_portador: string;
  dia_vencimento: string;
  id_fornecedor: string;
  nome_fornecedor: string;
  active: boolean;
};

export type FaturaSchema = {
  id?: string | null;
  data_vencimento?: Date;
  data_prevista?: Date;
  cod_barras?: string;
  valor?: string;
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

export type GetAllParamsCartao = {
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
        queryKey: ["financeiro", "contas_pagar", "cartao", "lista", params?.pagination],
        queryFn: async () =>
          await api.get(`/financeiro/contas-a-pagar/cartoes`, {
            params: params,
          }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "contas_pagar", "cartao", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/cartoes/${id}`);
        },
      }),

    getFatura: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "contas_pagar", "cartao", "fatura", "detalhe", id],
        staleTime: 0,
        queryFn: async () => {
          return await api.get(
            `/financeiro/contas-a-pagar/cartoes/fatura/${id}`
          );
        },
      }),

    getOneFaturas: ({ id, ...rest }: GetAllParamsCartao) =>
      useQuery({
        enabled: !!id,
        staleTime: 0,
        queryKey: ["financeiro", "contas_pagar", "cartao", "fatura", "lista", id, rest.pagination],
        queryFn: async () => {
          return await api.get(
            `/financeiro/contas-a-pagar/cartoes/${id}/faturas/`,
            {
              params: rest,
            }
          );
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
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar", "cartao"] });
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
        mutationFn: async ({ id, ...rest }: CartaoSchema) => {
          return await api
            .put("financeiro/contas-a-pagar/cartoes/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar", "cartao"] });
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

    updateFatura: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: FaturaSchema) => {
          return await api
            .put(`financeiro/contas-a-pagar/cartoes/fatura/${id}`, { ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar"] });

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
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar"] });

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

    deleteCartao: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`financeiro/contas-a-pagar/cartoes/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "contas_pagar"] });
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
