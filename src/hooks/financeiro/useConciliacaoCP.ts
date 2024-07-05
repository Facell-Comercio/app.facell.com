import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { ConciliacaoCPSchemaProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/components/ModalConciliar";
import { VencimentosConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TitulosConciliar";
import { TransacoesConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TransacoesConciliar";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ConciliacaoAutomaticaProps {
  vencimentos: VencimentosConciliarProps[];
  transacoes: TransacoesConciliarProps[];
  id_conta_bancaria?: string;
}

interface ConciliacaoTarifasProps {
  tarifas: TransacoesConciliarProps[];
  id_conta_bancaria?: string;
  data_transacao?: string;
}

export const useConciliacaoCP = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_conciliacao_cp"],
        queryFn: async () => {
          return await api.get(`/financeiro/conciliacao-cp/`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getConciliacoes: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_conciliacoes_realizadas_cp", pagination],
        queryFn: async () => {
          return await api.get(`/financeiro/conciliacao-cp/conciliacoes`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: [`fin_conciliacao_cp:${id}`, id],
        queryFn: async () => {
          return await api.get(`/financeiro/conciliacao-cp/${id}`);
        },
      }),

    conciliacaoManual: () =>
      useMutation({
        mutationFn: async (data: ConciliacaoCPSchemaProps) => {
          return api
            .post("/financeiro/conciliacao-cp", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Nova conciliação criada",
            duration: 3500,
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["fin_conciliacao_cp"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_conciliacoes_realizadas_cp"],
          });

          //* Invalidação nos locais onde há títulos e vencimentos
          queryClient.invalidateQueries({ queryKey: ["fin_cp_titulos"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagar"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_bordero"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagos"],
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

    conciliacaoAutomatica: () =>
      useMutation({
        mutationFn: async (data: ConciliacaoAutomaticaProps) => {
          return api
            .post("/financeiro/conciliacao-cp/automatica", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_conciliacao_cp"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_conciliacoes_realizadas_cp"],
          });

          //* Invalidação nos locais onde há títulos e vencimentos
          queryClient.invalidateQueries({ queryKey: ["fin_cp_titulos"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagar"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_bordero"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagos"],
          });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Conciliação automática feita com sucesso",
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

    conciliacaoTarifas: () =>
      useMutation({
        mutationFn: async (data: ConciliacaoTarifasProps) => {
          return api
            .post("/financeiro/conciliacao-cp/tarifas", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_conciliacao_cp"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_conciliacoes_realizadas_cp"],
          });

          //* Invalidação nos locais onde há títulos e vencimentos
          queryClient.invalidateQueries({ queryKey: ["fin_cp_titulos"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagar"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_bordero"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagos"],
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

    deleteConciliacao: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined | number) => {
          return api
            .delete(`/financeiro/conciliacao-cp/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_conciliacao_cp"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_conciliacoes_realizadas_cp"],
          });

          //* Invalidação nos locais onde há títulos e vencimentos
          queryClient.invalidateQueries({ queryKey: ["fin_cp_titulos"] });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagar"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_bordero"],
          });
          queryClient.invalidateQueries({
            queryKey: ["fin_cp_vencimentos_pagos"],
          });

          toast({
            variant: "success",
            title: "Sucesso",
            description: "Conciliação desfeita com sucesso",
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
  };
};
