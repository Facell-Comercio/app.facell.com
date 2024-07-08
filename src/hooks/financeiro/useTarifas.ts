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
        queryKey: ["fin_tarifas", params],
        queryFn: async () =>
          await api.get(`/financeiro/tarifas`, { params: params }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: [`fin_tarifas: ${id}`, id],
        queryFn: async () => {
          return await api.get(`/financeiro/tarifas/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: TarifaProps) => {
          return api
            .post("/financeiro/tarifas", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_tarifas"] });
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
            .put("/financeiro/tarifas/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_tarifas"] });
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
            .delete(`/financeiro/tarifas/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_tarifas"] });
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
