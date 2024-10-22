import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { EditarClienteProps } from "@/pages/marketing/mailing/campanhas/campanha/components/ModalEditarCliente";
import { FiltersCampanha } from "@/pages/marketing/mailing/campanhas/campanha/store";
import { NovaCampanhaSchema } from "@/pages/marketing/mailing/clientes/nova-campanha/form-data";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ClientesProps = {
  gsm?: string;
  gsm_portado?: string | null;
  cpf?: string;
  data_ultima_compra?: string;
  plano_habilitado?: string;
  produto_ultima_compra?: string;
  desconto_plano?: string;
  valor_caixa?: string;
  filial?: string;
  area?: string;
};

interface InsertClientesProps extends NovaCampanhaSchema {
  filters: any;
}

export const useMailing = () => {
  const queryClient = useQueryClient();

  const getClientes = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["marketing", "mailing", "clientes", "lista", { pagination }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => await fetchApi.marketing.mailing.getClientes({ pagination, filters }),
      placeholderData: keepPreviousData,
    });

  const getOneCampanha = ({ id, filters }: { id?: string | null; filters: any }) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["marketing", "mailing", "campanhas", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.marketing.mailing.getOneCampanha({ id, filters });
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
    });

  const getOneClienteCampanha = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["marketing", "mailing", "campanhas", "clientes", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.marketing.mailing.getOneClienteCampanha(id);
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
    });

  const insertOneCampanha = () =>
    useMutation({
      mutationFn: async (data: InsertClientesProps) => {
        return await api.post(`marketing/mailing/clientes`, data).then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing", "mailing"],
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
    });

  const getCampanhas = (params: GetAllParams) =>
    useQuery({
      queryKey: ["marketing", "mailing", "campanhas", "lista", params],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => await fetchApi.marketing.mailing.getCampanhas(params),
      placeholderData: keepPreviousData,
    });

  const updateOneCliente = () =>
    useMutation({
      mutationFn: async (data: EditarClienteProps | null) => {
        return await api
          .put(`marketing/mailing/campanhas/clientes`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing", "mailing"],
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
    });
  const updateClienteLote = () =>
    useMutation({
      mutationFn: async (data: { data: EditarClienteProps | null; filters: FiltersCampanha }) => {
        return await api
          .put(`marketing/mailing/campanhas/clientes/lote`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing", "mailing"],
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
    });

  return {
    getClientes,
    getCampanhas,
    getOneCampanha,
    getOneClienteCampanha,
    insertOneCampanha,

    updateOneCliente,
    updateClienteLote,
  };
};
