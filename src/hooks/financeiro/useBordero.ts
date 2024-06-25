import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { VencimentosProps } from "@/pages/financeiro/components/ModalVencimentos";
import { BorderoSchemaProps } from "@/pages/financeiro/contas-pagar/borderos/bordero/Modal";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

type TransferDataProps = {
  id_vencimento: string;
  id_status?: string;
};

type DownloadRemessaProps = {
  id: string;
  isPix?: boolean;
};

export const useBordero = () => {
  const queryClient = useQueryClient();
  return {
    getAll: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["fin_borderos", pagination],
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/bordero/`, {
            params: { pagination, filters },
          });
        },
        placeholderData: keepPreviousData,
      }),

    getOne: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["fin_borderos", id],
        queryFn: async () => {
          return await api.get(`/financeiro/contas-a-pagar/bordero/${id}`);
        },
      }),

    insertOne: () =>
      useMutation({
        mutationFn: async (data: BorderoSchemaProps) => {
          return await api
            .post("/financeiro/contas-a-pagar/bordero", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Novo borderô criado",
            duration: 3500,
          });
          queryClient.invalidateQueries({ queryKey: ["fin_borderos"] });
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
        mutationFn: async ({ id, ...rest }: BorderoSchemaProps) => {
          return await api
            .put("/financeiro/contas-a-pagar/bordero/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess(_, { id }) {
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
          });
          queryClient.invalidateQueries({ queryKey: ["fin_borderos", id] });
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

    transferVencimentos: () =>
      useMutation({
        mutationFn: async (data: {
          id_conta_bancaria: string;
          date: Date;
          vencimentos: TransferDataProps[];
        }) => {
          return await api
            .put("financeiro/contas-a-pagar/bordero/transfer", data)
            .then((response) => response.data);
        },
        onSuccess() {
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Transferência realizada com sucesso",
            duration: 3500,
          });
          queryClient.invalidateQueries({ queryKey: ["fin_borderos"] });
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

    deleteVencimento: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined | number) => {
          return await api
            .delete(`/financeiro/contas-a-pagar/bordero/titulo/${id}`)
            .then((response) => response.data);
        },
        onSuccess(_, id) {
          queryClient.invalidateQueries({ queryKey: ["fin_borderos"] });
          queryClient.invalidateQueries({ queryKey: ["fin_borderos", id] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
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

    deleteBordero: () =>
      useMutation({
        mutationFn: async (params: {
          id: string | null | undefined | number;
          vencimentos: VencimentosProps[];
        }) => {
          const { id, vencimentos } = params;
          return await api
            .delete(`/financeiro/contas-a-pagar/bordero/${id}`, {
              data: vencimentos,
            })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["fin_borderos"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Exclusão realizada com sucesso",
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

    downloadRemessa: () =>
      useMutation({
        mutationFn: async ({ id, isPix }: DownloadRemessaProps) => {
          return await api
            .get(`/financeiro/contas-a-pagar/bordero/remessa/${id}`, {
              params: { isPix },
              responseType: "blob",
            })
            .then(async (response) => {
              downloadResponse(response);
            });
          // })
        },
        onSuccess() {
          toast({
            variant: "success",
            title: "Sucesso!",
            description: "Exportação de remessa realizada com sucesso!",
          });
        },
        onError: async (error) => {
          // @ts-expect-error "Funciona"
          const errorText = await error.response.data.text();
          const errorJSON = JSON.parse(errorText);

          toast({
            variant: "destructive",
            title: "Ocorreu o seguinte erro",
            description: errorJSON.message,
          });
        },
      }),

    importRemessa: (files: FileList | null) => {
      return new Promise(async (resolve, reject) => {
        try {
          const form = new FormData();
          if (files) {
            for (let i = 0; i < files.length; i++) {
              form.append("files", files[i]);
            }
          }
          const result = await api.postForm(
            "/financeiro/contas-a-pagar/bordero/import-retorno-remessa",
            form
          );
          queryClient.invalidateQueries({ queryKey: ["fin_borderos"] });
          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      });
    },
  };
};
