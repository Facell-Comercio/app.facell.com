import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface ColaboradorSchema {
  id?: string;
  nome?: string;
  cpf?: string;
  active?: boolean;
}

export const useColaboradores = () => {
  const queryClient = useQueryClient();

  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: [
          "pessoal",
          "colaboradores",
          "lista",
          { pagination, filters },
        ],
        queryFn: async () =>
          await fetchApi.pessoal.colaboradores.getAll({
            pagination,
            filters,
          }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["pessoal", "colaboradores", "detalhe", id],
        queryFn: async () => {
          try {
            const result = fetchApi.pessoal.colaboradores.getOne(id);
            return result;
          } catch (error) {
            // @ts-expect-error "Vai funcionar"
            const errorMessage = error.response?.data.message || error.message;
            toast({
              title: "Erro",
              description: errorMessage,
              duration: 3500,
              variant: "destructive",
            });
          }
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: ColaboradorSchema) => {
          return api
            .post("/pessoal/colaboradores", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["pessoal", "colaboradores"],
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
        mutationFn: async ({ id, ...rest }: ColaboradorSchema) => {
          return await api
            .put("/pessoal/colaboradores/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["pessoal", "colaboradores"],
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
