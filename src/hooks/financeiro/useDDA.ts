import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { exportToExcel } from "@/helpers/importExportXLS";
import { api } from "@/lib/axios";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";

export interface GetDDAProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export type VinculoDDAparams = {
  id_vencimento?: number | string | null;
  id_dda?: number | string | null;
  id_forma_pagamento?: number | string | null;
};

export const useDDA = () => {
  const queryClient = useQueryClient();

  const getAllDDA = ({ pagination, filters }: GetDDAProps) =>
    useQuery({
      queryKey: ["financeiro", "contas_pagar", "dda", "lista", pagination, filters],
      staleTime: 0,
      retry: false,
      queryFn: async () => {
        return await api.get(`/financeiro/contas-a-pagar/dda/`, {
          params: {
            pagination,
            filters,
          },
        });
      },
      placeholderData: keepPreviousData,
    });

  const importDDA = () =>
    useMutation({
      mutationFn: async (form: FormData) => {
        return await api
          .postForm("/financeiro/contas-a-pagar/dda/import", form)
          .then((response) => response.data);
      },
      onSuccess(data) {
        exportToExcel(
          data,
          `RESULTADO IMPORTAÇÃO DDA ${formatDate(new Date(), "dd-MM-yyyy hh.mm")}`
        );
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "dda"],
        });
        toast({
          variant: "success",
          title: "Importação concluída!",
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Erro ao tentar importar o DDA",
          description:
            // @ts-ignore
            error?.response?.data?.message ||
            // @ts-ignore
            error?.message,
        });
      },
    });

  const exportDDA = () =>
    useMutation({
      mutationFn: async (params?: GetDDAProps) => {
        return await api
          .get("/financeiro/contas-a-pagar/dda/export", { params, responseType: "blob" })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Exportação concluída!",
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Erro ao tentar exportar o DDA",
          description:
            // @ts-ignore
            error?.response?.data?.message ||
            // @ts-ignore
            error?.message,
        });
      },
    });

  const limparDDA = () =>
    useMutation({
      mutationFn: async () => {
        return await api
          .post("/financeiro/contas-a-pagar/dda/limpar")
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Limpeza concluída!",
        });
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar"],
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Erro ao tentar limpar o DDA",
          description:
            // @ts-ignore
            error?.response?.data?.message ||
            // @ts-ignore
            error?.message,
        });
      },
    });

  const autoVincularDDA = () =>
    useMutation({
      mutationFn: async () => {
        return await api
          .post("/financeiro/contas-a-pagar/dda/auto-Vincular")
          .then((response) => response.data);
      },
      onSuccess(data) {
        exportToExcel(
          data,
          `RESULTADO AUTOVINCULAÇÃO DDA - ${formatDate(new Date(), "dd-MM-yyyy hh.mm")}`
        );
        toast({
          variant: "success",
          title: "Autovinculção concluída!",
        });
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "dda"],
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Erro ao tentar autovincular o DDA",
          description:
            // @ts-ignore
            error?.response?.data?.message ||
            // @ts-ignore
            error?.message,
        });
      },
    });

  const vincularDDA = () =>
    useMutation({
      mutationFn: async (params: VinculoDDAparams) => {
        return await api
          .post("/financeiro/contas-a-pagar/dda/vincular", { ...params })
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "dda"],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const desvincularDDA = () =>
    useMutation({
      mutationFn: async (params: { id_dda: number }) => {
        return await api
          .post("/financeiro/contas-a-pagar/dda/desvincular", { ...params })
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "dda"],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  return {
    getAllDDA,
    importDDA,
    exportDDA,
    limparDDA,
    autoVincularDDA,
    vincularDDA,
    desvincularDDA,
  };
};
