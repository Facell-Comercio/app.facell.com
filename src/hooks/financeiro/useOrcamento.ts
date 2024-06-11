import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

import { cadastroSchemaProps } from "@/pages/financeiro/orcamento/components/cadastros/cadastro/form-data";
import { MeuOrcamentoSchema } from "@/pages/financeiro/orcamento/components/meu-orcamento/orcamento/form-data";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useOrcamento = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["fin_orcamento", params],
        queryFn: async () =>
          await api.get(`/financeiro/orcamento/`, { params: params }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_orcamento", id],
        queryFn: async () => {
          return await api.get(`/financeiro/orcamento/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: cadastroSchemaProps) => {
          return await api
            .post("/financeiro/orcamento", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Novo Orçamento Criado",
            duration: 3500,
          });
          queryClient.invalidateQueries({ queryKey: ["fin_orcamento"] });
        },
        onError(error: AxiosError) {
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
        mutationFn: async (data: cadastroSchemaProps) => {
          return await api
            .put("financeiro/orcamento", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Atualização Realizada",
            duration: 3500,
          });
          queryClient.invalidateQueries({ queryKey: ["fin_orcamento"] });
        },
        onError(error: AxiosError) {
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

    deleteItemBudget: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined | number) => {
          return await api
            .delete(`financeiro/orcamento/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Atualização Realizada",
            duration: 3500,
          });
        },
        onError(error: AxiosError) {
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

    getMyBudgets: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_my_budget", pagination],
        queryFn: async () =>
          await api.get(`/financeiro/orcamento/my-budget`, {
            params: { pagination, filters },
          }),
        placeholderData: keepPreviousData,
      }),

    getMyBudget: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_my_budget", id],
        queryFn: async () => {
          return await api.get(`/financeiro/orcamento/my-budget/${id}`);
        },
      }),

    transfer: () =>
      useMutation({
        mutationFn: async (data: MeuOrcamentoSchema) => {
          return await api
            .put("financeiro/orcamento/my-budget", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Tranferencia Realizada",
            duration: 3500,
          });

          queryClient.invalidateQueries({ queryKey: ["fin_my_budget"] });
        },
        onError(error: AxiosError) {
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

    getLogs: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_orcamento_log", id],
        queryFn: async () => {
          return await api.get(`/financeiro/orcamento/logs/${id}`);
        },
      }),

    exportMyBudgets: async ({ filters }: GetAllParams) =>
      await api.get(`/financeiro/orcamento/my-budget`, { params: { filters } }),
  };
};
