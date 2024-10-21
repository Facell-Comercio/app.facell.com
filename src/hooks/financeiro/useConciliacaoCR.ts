import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TransacoesConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cp/tables/TransacoesConciliar";
import { ConciliacaoCRSchemaProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cr/components/ModalConciliar";
import { RecebimentosConciliarProps } from "@/pages/financeiro/extratos-bancarios/conciliacao/cr/tables/RecebimentosConciliar";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ConciliacaoAutomaticaProps {
  recebimentos: RecebimentosConciliarProps[];
  transacoes: TransacoesConciliarProps[];
  id_conta_bancaria?: string;
}

interface ConciliacaoTransferenciaContasProps {
  id_entrada?: string;
  id_saida?: string;
  valor?: string;
  id_conta_bancaria?: string;
}

interface TratarDuplicidadeProps {
  id_extrato?: string;
  id_duplicidade?: string;
}

export const useConciliacaoCR = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        enabled: !!filters?.id_conta_bancaria,
        refetchOnMount: false,
        queryKey: ["financeiro", "conciliacao", "cr", "lista", filters],
        queryFn: async () => {
          const result = await api.get(`/financeiro/conciliacao-cr/`, {
            params: { pagination, filters },
          });
          return result.data;
        },
        placeholderData: keepPreviousData,
      }),

    getConciliacoes: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        enabled: !!filters?.id_conta_bancaria,
        refetchOnMount: false,
        queryKey: [
          "financeiro",
          "conciliacao",
          "cr",
          "realizado",
          "lista",
          { pagination, filters },
        ],
        queryFn: async () => {
          const result = await api.get(`/financeiro/conciliacao-cr/conciliacoes`, {
            params: { pagination, filters },
          });
          return result.data;
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conciliacao", "cr", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/conciliacao-cr/${id}`);
        },
      }),

    conciliacaoManual: () =>
      useMutation({
        mutationFn: async (data: ConciliacaoCRSchemaProps) => {
          return api.post("/financeiro/conciliacao-cr", data).then((response) => response.data);
        },
        onSuccess() {
          toast({
            title: "Sucesso",
            description: "Nova conciliação criada",
            duration: 3500,
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["financeiro"] });
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
            .post("/financeiro/conciliacao-cr/automatica", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro"] });
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

    conciliacaoTransferenciaContas: () =>
      useMutation({
        mutationFn: async (data: ConciliacaoTransferenciaContasProps) => {
          return api
            .post("/financeiro/conciliacao-cr/transferencia-contas", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro"] });

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

    tratarDuplicidade: () =>
      useMutation({
        mutationFn: async (data: TratarDuplicidadeProps) => {
          return api
            .put("/financeiro/conciliacao-cr/tratar-duplicidade", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["financeiro"],
          });

          toast({
            variant: "success",
            title: "Sucesso",
            description: "Tratamento realizado com sucesso",
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

    deleteConciliacao: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined | number) => {
          return api.delete(`/financeiro/conciliacao-cr/${id}`).then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro"] });

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
