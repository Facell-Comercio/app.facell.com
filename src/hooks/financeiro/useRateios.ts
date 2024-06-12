import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { RateiosSchema } from "@/pages/financeiro/cadastros/rateios/rateio/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useRateios = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_rateios", pagination, filters?.id_grupo_economico],
        queryFn: async () => {
          return await api.get(`financeiro/rateios/`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: [`fin_rateios-${id}`, id],
        queryFn: async () => {
          return await api.get(`financeiro/rateios/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: RateiosSchema) => {
          return await api
            .post("financeiro/rateios", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_rateios"] });
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
        mutationFn: async ({ id, ...rest }: RateiosSchema) => {
          return await api
            .put("financeiro/rateios/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess(_, { id }) {
          queryClient.invalidateQueries({ queryKey: ["fin_rateios"] });
          queryClient.invalidateQueries({ queryKey: [`fin_rateios-${id}`] });
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
        mutationFn: async (id: string | null | undefined | number) => {
          return await api
            .delete(`/financeiro/rateios/${id}`)
            .then((response) => response.data);
        },
        onSuccess(_, id) {
          queryClient.invalidateQueries({ queryKey: ["fin_rateios"] });
          queryClient.invalidateQueries({ queryKey: ["fin_borderos", id] });
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
