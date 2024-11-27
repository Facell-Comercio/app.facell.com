import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ContestacaoEspelhosProps = {
  id?: string;
  id_comissao?: string;
  created_at?: string;
  status?: string;
  contestacao?: string;
  user?: string;
  resposta?: string;
  data_resposta?: string;
  user_resposta?: string;
};

export type ParametrosEspelhoProps = {
  id?: string;
  id_comissao?: string;
  descricao?: string;
  meta?: string;
  realizado?: string;
  deflator?: string;
};

export type ItemEspelhosProps = {
  id?: string;
  id_comissao?: string;
  tipo?: string;
  segmento?: string;
  descricao?: string;
  meta?: string;
  realizado?: string;
  atingimento?: string;
  valor?: string;
  manual?: string;
};

export type EspelhosProps = {
  id?: string;
  ref?: string;
  ciclo?: string;
  comissao?: string;
  bonus?: string;
  nome?: string;
  cargo?: string;
  filial?: string;
  proporcional?: string;
  data_inicial?: string;
  data_final?: string;
  qtdeTotalContestacoes?: string;
  parametros?: ParametrosEspelhoProps[];
  comissoes_list?: ItemEspelhosProps[];
  bonus_list?: ItemEspelhosProps[];
};

type CalcularComissionamentoProps = {
  ciclo: string;
  metas: any[];
  agregadores: any[];
};

export const useEspelhos = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "espelhos", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.espelhos.getAll({
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
      queryKey: ["comercial", "comissionamento", "espelhos", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getOne(id);
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

  const calcularComissionamento = () =>
    useMutation({
      mutationFn: async (data: CalcularComissionamentoProps) => {
        return await api
          .post(`comercial/comissionamento/espelhos/`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "espelhos"],
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

  const recalcularEspelho = () =>
    useMutation({
      mutationFn: async (id?: string | null) => {
        return await api
          .post(`comercial/comissionamento/espelhos/recalcular/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "espelhos"],
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

  const deleteEspelho = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/comissionamento/espelhos/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "espelhos", "lista"],
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

  const exportEspelhos = () =>
    useMutation({
      mutationFn: async ({ filters }: GetAllParams) => {
        return await api
          .get(`/comercial/comissionamento/espelhos/export-espelhos`, {
            params: { filters },
            responseType: "blob",
          })
          .then((response) => {
            downloadResponse(response);
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
  const getAllContestacoes = (params?: unknown) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "espelhos", "contestacoes", "lista", [params]],
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getAllContestacoes(params);
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

  const getOneContestacao = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "espelhos", "contestacoes", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getOneContestacao(id);
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
      mutationFn: async (data: ContestacaoEspelhosProps) => {
        return await api
          .post(`comercial/comissionamento/espelhos/contestacoes`, data)
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
      mutationFn: async (data: ContestacaoEspelhosProps) => {
        return await api
          .put(`comercial/comissionamento/espelhos/contestacoes`, data)
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
          .delete(`comercial/comissionamento/espelhos/contestacoes/${id}`)
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

  //* ITEM
  const getAllItens = (params?: unknown) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "espelhos", "itens", "lista", [params]],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getAllItens(params);
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
  const getOneItem = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "espelhos", "itens", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getOneItem(id);
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

  const insertOneItem = () =>
    useMutation({
      mutationFn: async (data: ItemEspelhosProps) => {
        return await api
          .post(`comercial/comissionamento/espelhos/itens`, data)
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

  const updateItem = () =>
    useMutation({
      mutationFn: async (data: ItemEspelhosProps) => {
        return await api
          .put(`comercial/comissionamento/espelhos/itens`, data)
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

  const deleteItem = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/comissionamento/espelhos/itens/${id}`)
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

  //* VENDAS INVÁLIDAS
  const getAllVendasInvalidadas = (id_comissao?: unknown) =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "espelhos",
        "vendas_invalidas",
        "lista",
        [id_comissao],
      ],
      retry: false,
      enabled: !!id_comissao,

      queryFn: async () => {
        try {
          const result = fetchApi.comercial.espelhos.getAllVendasInvalidas({
            filters: {
              id_comissao,
            },
          });
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

  return {
    getAll,
    getOne,
    calcularComissionamento,
    recalcularEspelho,
    deleteEspelho,

    exportEspelhos,

    // CONTESTAÇÕES
    getAllContestacoes,
    getOneContestacao,
    insertOneContestacao,
    updateStatusContestacao,
    deleteContestacao,

    // ITENS
    getAllItens,
    getOneItem,
    insertOneItem,
    updateItem,
    deleteItem,

    // VENDAS INVÁLIDAS
    getAllVendasInvalidadas,
  };
};
