import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

const uri = "/financeiro/relatorios";

export const useRelatorios = () => {
  //* CONTAS A PAGAR
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
          title: "Erro",
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
          title: "Erro",
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
          title: "Erro",
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });

  //* CONTROLE DE CAIXA
  const exportLayoutRV = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-recarga-rv`, {
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });
  const exportLayoutPIX = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-pix`, {
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });
  const exportLayoutPitzi = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-pitzi`, {
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });
  const exportLayoutCrediario = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-crediario`, {
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });
  const exportLayoutTradein = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-tradein`, {
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });
  const exportLayoutCartoes = () =>
    useMutation({
      mutationFn: async (filters: any) => {
        return await api
          .get(`${uri}/controle-de-caixa/export-layout-cartoes`, {
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
          title: "Erro",
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
          title: "Erro",
          description: errorJSON.message,
        });
      },
    });

  return {
    //* CONTAS A PAGAR
    exportPrevisaoPagamentoCR,
    exportLayoutDespesasCR,
    exportLayoutVencimentosCR,
    exportLayoutDatasysCR,

    //* CONTROLE DE CAIXA
    exportLayoutRV,
    exportLayoutPIX,
    exportLayoutPitzi,
    exportLayoutCrediario,
    exportLayoutTradein,
    exportLayoutCartoes,

    //* DRE
    exportLayoutDREGerencial,
  };
};
