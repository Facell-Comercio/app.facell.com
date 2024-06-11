import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { FornecedorSchema } from "@/pages/financeiro/cadastros/fornecedores/fornecedor/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useFornecedores = () => {
  const queryClient = useQueryClient();

  return {
    getAll: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["fin_fornecedores", params],
        queryFn: async () =>
          await api.get(`/financeiro/fornecedores`, { params: params }),
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_fornecedores", id],
        queryFn: async () => {
          return await api.get(`/financeiro/fornecedores/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: FornecedorSchema) => {
          return await api
            .post("financeiro/fornecedores", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_fornecedores"] });
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
        mutationFn: async ({ id, ...rest }: FornecedorSchema) => {
          return await api
            .put("financeiro/fornecedores/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_fornecedores"] });
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

    consultaCnpj: async (cnpj?: string) =>
      await api.get(`/financeiro/fornecedores/consulta-cnpj/${cnpj}`),
  };
};
