import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";

export type ContestacaoVendasInvalidadasProps = {
  id?: string;
  id_venda_invalida?: string;
  status?: string;
  created_at?: string;
  contestacao?: string;
  user?: string;
  resposta?: string;
  data_resposta?: string;
  user_resposta?: string;
};

export type RateioVendasInvalidadasProps = {
  id?: string;
  id_venda_invalida?: string;
  id_vale?: string;
  id_filial?: string;
  cpf_colaborador?: string;
  nome_colaborador?: string;
  cargo_colaborador?: string;
  valor?: string;
  percentual?: string;
  canEdit?: number;
};

export type VendasInvalidadasProps = {
  id?: string;
  ref?: string;
  status?: string;
  filial?: string;
  tipo?: string;
  segmento?: string;
  motivo?: string;
  valor?: string;
  estorno?: string;
  data_venda?: string;
  pedido?: string;
  gsm?: string;
  gsm_provisorio?: string;
  imei?: string;
  cpf_cliente?: string;
  cpf_vendedor?: string;
  observacao?: string;

  contestacoes?: ContestacaoVendasInvalidadasProps[];
  rateios?: RateioVendasInvalidadasProps[];
  podeGerarVales?: boolean;
};

export const useVendasInvalidadas = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "vendas_invalidadas",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.vendasInvalidadas.getAll({
          pagination,
          filters,
        }),
      placeholderData: keepPreviousData,
    });

  const getOne = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "vendas_invalidadas", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.vendasInvalidadas.getOne(id);
          return result;
        } catch (error) {
          const errorMessage =
            // @ts-expect-error "Vai funcionar"
            error.response?.data.message ||
            // @ts-expect-error "Vai funcionar"
            error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        }
      },
    });

  const insertOne = () =>
    useMutation({
      mutationFn: async (data: VendasInvalidadasProps) => {
        return await api
          .post(`comercial/comissionamento/vendas-invalidadas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const update = () =>
    useMutation({
      mutationFn: async (data: VendasInvalidadasProps) => {
        return await api
          .put(`comercial/comissionamento/vendas-invalidadas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const updateLote = () =>
    useMutation({
      mutationFn: async (data: { status: string; filters: unknown }) => {
        return await api
          .put(`comercial/comissionamento/vendas-invalidadas/lote`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const importVendasInvalidadas = () =>
    useMutation({
      mutationFn: async (data: VendasInvalidadasProps[]) => {
        return await api
          .post(`comercial/comissionamento/vendas-invalidadas/import`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const excluirVendasInvalidadas = () =>
    useMutation({
      mutationFn: async (params: unknown) => {
        return await api.delete(`/comercial/comissionamento/vendas-invalidadas`, { params });
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError: async (error) => {
        const errorText =
          // @ts-expect-error "Funciona"
          await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops!",
          description: errorJSON.message,
        });
      },
    });

  const processarVendasInvalidadas = () =>
    useMutation({
      mutationFn: async (params: unknown) => {
        return await api
          .post(`/comercial/comissionamento/vendas-invalidadas`, params)
          .then((response) => {
            const filename = `RESULTADO PROCESSAMENTO VENDAS INVÁLIDAS ${formatDate(
              new Date(),
              "dd-MM-yyyy hh.mm"
            )}`;
            exportToExcel(response?.data, filename);
          });
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description: "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError: async (error) => {
        const errorText =
          // @ts-expect-error "Funciona"
          await error.response.data.text();
        const errorJSON = JSON.parse(errorText);

        toast({
          variant: "destructive",
          title: "Ops!",
          description: errorJSON.message,
        });
      },
    });

  //* CONTESTAÇÃO
  const getOneContestacao = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: [
        "comercial",
        "comissionamento",
        "vendas_invalidadas",
        "contestacoes",
        "detalhe",
        id,
      ],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.vendasInvalidadas.getOneContestacao(id);
          return result;
        } catch (error) {
          const errorMessage =
            // @ts-expect-error "Vai funcionar"
            error.response?.data.message ||
            // @ts-expect-error "Vai funcionar"
            error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        }
      },
    });

  const insertOneContestacao = () =>
    useMutation({
      mutationFn: async (data: ContestacaoVendasInvalidadasProps) => {
        return await api
          .post(`comercial/comissionamento/vendas-invalidadas/contestacoes`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const updateStatusContestacao = () =>
    useMutation({
      mutationFn: async (data: ContestacaoVendasInvalidadasProps) => {
        return await api
          .put(`comercial/comissionamento/vendas-invalidadas/contestacoes`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const deleteContestacao = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/comissionamento/vendas-invalidadas/contestacoes/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  //* RATEIO
  const getOneRateio = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "vendas_invalidadas", "rateios", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.vendasInvalidadas.getOneRateio(id);
          return result;
        } catch (error) {
          const errorMessage =
            // @ts-expect-error "Vai funcionar"
            error.response?.data.message ||
            // @ts-expect-error "Vai funcionar"
            error.message;
          toast({
            title: "Erro",
            description: errorMessage,
            duration: 3500,
            variant: "destructive",
          });
        }
      },
    });

  const insertOneRateio = () =>
    useMutation({
      mutationFn: async (data: RateioVendasInvalidadasProps) => {
        return await api
          .post(`comercial/comissionamento/vendas-invalidadas/rateios`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const updateRateio = () =>
    useMutation({
      mutationFn: async (data: RateioVendasInvalidadasProps) => {
        return await api
          .put(`comercial/comissionamento/vendas-invalidadas/rateios`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  const deleteRateio = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/comissionamento/vendas-invalidadas/rateios/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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

  //* OUTROS
  const gerarVales = () =>
    useMutation({
      mutationFn: async (data: { ref: string; id_venda_invalida?: string | null }) => {
        return await api
          .post(`comercial/comissionamento/vendas-invalidadas/vales`, data)
          .then((response) => {
            const filename = `RESULTADO GERAÇÃO VALES ${formatDate(
              new Date(),
              "dd-MM-yyyy hh.mm"
            )}`;
            exportToExcel(response?.data, filename);
          });
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial"],
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
    // VENDAS INVÁLIDAS
    getAll,
    getOne,
    insertOne,
    update,
    updateLote,
    excluirVendasInvalidadas,
    importVendasInvalidadas,
    processarVendasInvalidadas,

    // CONTESTAÇÕES
    getOneContestacao,
    insertOneContestacao,
    updateStatusContestacao,
    deleteContestacao,

    // RATEIOS
    getOneRateio,
    insertOneRateio,
    updateRateio,
    deleteRateio,

    // OUTROS
    gerarVales,
  };
};
