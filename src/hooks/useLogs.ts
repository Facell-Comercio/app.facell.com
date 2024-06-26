import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from 'axios'

export const useLogs = () => {
  const queryClient = useQueryClient()
  return {
    getAll: () => {
      return useQuery({
        queryKey: [`logs`],
        placeholderData: keepPreviousData,
        queryFn: async () =>
          await api.get("/logs").then((result) => result.data),
      });
    },
    getOne: (pid?: string | null) =>
      useQuery({
        enabled: !!pid,
        queryKey: [`logs-${pid}`, pid],
        queryFn: async () => {
          return await api.get(`logs/${pid}`);
        },
      }),

    delete: () => useMutation({
      mutationFn: async () => {
        return await api
          .delete(`/logs`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["logs"] });
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Limpeza realizada com sucesso",
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
