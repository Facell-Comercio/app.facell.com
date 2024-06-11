import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { EquipamentoSchema } from "@/pages/financeiro/cadastros/equipamentos-cielo/equipamento/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

export const useEquipamentos = () => {
  const queryClient = useQueryClient();

  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_equipamentos_cielo", pagination],
        queryFn: async () =>
          await api.get(`/financeiro/equipamentos-cielo`, {
            params: { pagination, filters },
          }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_equipamentos_cielo", id],
        queryFn: async () => {
          return await api.get(`/financeiro/equipamentos-cielo/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: EquipamentoSchema) => {
          return await api
            .post("financeiro/equipamentos-cielo", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["fin_equipamentos_cielo"],
          });
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
        mutationFn: async ({ id, ...rest }: EquipamentoSchema) => {
          return await api
            .put("financeiro/equipamentos-cielo/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["fin_equipamentos_cielo"],
          });
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
