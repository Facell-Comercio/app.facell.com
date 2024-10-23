import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const uri = "/financeiro/relatorios";

export const useRelatorios = () => {
  //* Contas a Pagar
  const exportPrevisaoPagamentoCR = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/contas-a-pagar/export-previsao-pagamento`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onError: async (error) => {
        // @ts-expect-error "Funciona"
        const errorText = await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops",
          description: errorJSON.message,
        });
      },
    });

  const exportLayoutDespesasCR = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/contas-a-pagar/export-layout-despesas`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onError: async (error) => {
        // @ts-expect-error "Funciona"
        const errorText = await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops",
          description: errorJSON.message,
        });
      },
    });

  const exportLayoutVencimentosCR = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/contas-a-pagar/export-layout-vencimentos`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onError: async (error) => {
        // @ts-expect-error "Funciona"
        const errorText = await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops",
          description: errorJSON.message,
        });
      },
    });

  //* DRE
  const exportLayoutDREGerencial = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/dre/export-layout-dre-gerencial`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onError: async (error) => {
        // @ts-expect-error "Funciona"
        const errorText = await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops",
          description: errorJSON.message,
        });
      },
    });

  const exportLayoutDatasysCR = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/contas-a-pagar/export-datasys`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
          });
      },
      onError: async (error) => {
        // @ts-expect-error "Funciona"
        const errorText = await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops",
          description: errorJSON.message,
        });
      },
    });

  return {
    exportPrevisaoPagamentoCR,
    exportLayoutDespesasCR,
    exportLayoutVencimentosCR,
    exportLayoutDREGerencial,
    exportLayoutDatasysCR,
  };
};
