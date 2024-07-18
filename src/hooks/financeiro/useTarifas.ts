import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type TarifaProps = {
  id?: string;
  id_grupo_economico: string;
  id_centro_custo: string;
  id_plano_contas: string;
  grupo_economico?: string;
  centro_custo?: string;
  plano_contas?: string;
  descricao: string;
};

export const useTarifas = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["financeiro", "conciliacao", "tarifa_padrao", "lista", params],
        queryFn: async () =>
          await api.get(`/financeiro/conciliacao-cp/tarifas-padrao`, { params: params }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["financeiro", "conciliacao", "tarifa_padrao", "detalhe", id],
        queryFn: async () => {
          return await api.get(`/financeiro/conciliacao-cp/tarifas-padrao/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: TarifaProps) => {
          return api
            .post("/financeiro/conciliacao-cp/tarifas-padrao", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "conciliacao", "tarifa_padrao"] });
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
        mutationFn: async ({ id, ...rest }: TarifaProps) => {
          return await api
            .put("/financeiro/conciliacao-cp/tarifas-padrao/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "conciliacao", "tarifa_padrao"] });
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

    deleteOne: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`/financeiro/conciliacao-cp/tarifas-padrao/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["financeiro", "conciliacao", "tarifa_padrao"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Tarifa deletada com sucesso",
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
