import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { Pagination } from "@/pages/financeiro/tesouraria/store";
import { DefinirVendedoresProps } from "@/pages/marketing/mailing/campanhas/campanha/components/modais/ModalDefinirVendedores";
import { EditarClienteProps } from "@/pages/marketing/mailing/campanhas/campanha/components/modais/ModalEditarCliente";
import { FiltersCampanha } from "@/pages/marketing/mailing/campanhas/campanha/store";
import { NovaCampanhaSchema } from "@/pages/marketing/mailing/clientes/nova-campanha/form-data";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

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

interface InsertClientesSubcampanhaProps extends NovaCampanhaSchema {
  filters: any;
  id_parent: string;
}

interface TransferirClientesSubcampanhaProps extends NovaCampanhaSchema {
  filters: any;
  id_parent: string;
  id_subcampanha: string;
}

interface DuplicateCampanhaProps extends NovaCampanhaSchema {
  filters: any;
  id_campanha: string;
}

interface UpdateCampanhaProps {
  id: string;
  active?: boolean;
  public?: boolean;
}

const uri = "marketing/mailing";
export const useMailing = () => {
  const queryClient = useQueryClient();

  const getClientes = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["marketing", "mailing", "clientes", "lista", { pagination }],
      queryFn: async () =>
        await fetchApi.marketing.mailing.getClientes({
          pagination,
          filters,
        }),
      placeholderData: keepPreviousData,
    });

  const getOneCampanha = ({
    id,
    filters,
    pagination,
  }: {
    id?: string | null;
    filters: any;
    pagination: Pagination;
  }) =>
    useQuery({
      enabled: !!id,
      queryKey: ["marketing", "mailing", "campanhas", "detalhe", [id, pagination]],
      queryFn: async () => {
        try {
          const result = await fetchApi.marketing.mailing.getOneCampanha({
            id,
            filters,
            pagination,
          });
          return result;
        } catch (error) {
          console.log(error);

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
      queryKey: ["marketing", "mailing", "campanhas", "clientes", "detalhe", id],
      queryFn: async () => {
        try {
          const result = await fetchApi.marketing.mailing.getOneClienteCampanha(id);
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
        return await api.post(`${uri}/nova-campanha`, data).then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing"],
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

  const insertOneSubcampanha = () =>
    useMutation({
      mutationFn: async (data: InsertClientesSubcampanhaProps) => {
        return await api
          .post(`${uri}/campanhas/subcampanhas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing"],
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
  const duplicateCampanha = () =>
    useMutation({
      mutationFn: async (data: DuplicateCampanhaProps) => {
        return await api.post(`${uri}/campanhas/duplicar`, data).then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing"],
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

  const transferirClientesSubcampanha = () =>
    useMutation({
      mutationFn: async (data: TransferirClientesSubcampanhaProps) => {
        return await api
          .post(`${uri}/campanhas/transferir`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["marketing"],
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

  const updateCampanha = () =>
    useMutation({
      mutationFn: async (data: UpdateCampanhaProps) => {
        return await api.put(`${uri}/campanhas`, data).then((response) => response.data);
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
  const updateOneCliente = () =>
    useMutation({
      mutationFn: async (data: EditarClienteProps | null) => {
        return await api.put(`${uri}/campanhas/clientes`, data).then((response) => response.data);
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
          .put(`${uri}/campanhas/clientes/lote`, data)
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
  const definirVendedores = () =>
    useMutation({
      mutationFn: async (data: DefinirVendedoresProps) => {
        return await api.put(`${uri}/campanhas/vendedores`, data).then((response) => response.data);
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

  const exportSubcampanha = () =>
    useMutation({
      mutationFn: async (params: { filters: any; type: "csv" | "xlsx"; id_campanha: string }) => {
        return await api
          .get(`${uri}/campanhas/export-evolux`, {
            params,
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

  const deleteClientesLote = () =>
    useMutation({
      mutationFn: async (data: { id_campanha: string; filters: FiltersCampanha }) => {
        return await api
          .delete(`${uri}/campanhas/clientes/lote`, { data })
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

  const deleteSubcampanha = () =>
    useMutation({
      mutationFn: async (id_campanha: string) => {
        return await api
          .delete(`${uri}/campanhas/${id_campanha}`)
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

  const reimportarEvolux = () =>
    useMutation({
      mutationFn: async (date_range: DateRange) => {
        return await api
          .post(`${uri}/campanhas/import-evolux`, { range_datas: date_range })
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
    insertOneSubcampanha,
    duplicateCampanha,
    transferirClientesSubcampanha,

    updateCampanha,
    updateOneCliente,
    updateClienteLote,
    definirVendedores,

    deleteClientesLote,
    deleteSubcampanha,
    reimportarEvolux,
    exportSubcampanha,
  };
};
