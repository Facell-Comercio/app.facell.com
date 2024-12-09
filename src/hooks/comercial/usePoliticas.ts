import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { ModeloItemFormData } from "@/pages/comercial/comissionamento/politicas/modelos/item/form-data";
import { ModeloFormData } from "@/pages/comercial/comissionamento/politicas/modelos/modelo/form-data";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type PoliticasProps = {
  descricao: string;
  month: string;
  year: string;
  current_id?: number | string;
};

type CargoPoliticasProps = {
  id_cargo?: string;
  id_escalonamento?: string;
  id_politica?: string;
};

export const usePoliticas = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "politicas", "lista", { pagination }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.politicas.getAll({
          pagination,
        }),
      placeholderData: keepPreviousData,
    });

  const getOne = (id?: string | null) =>
    useQuery({
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "politicas", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.politicas.getOne(id);
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

  const getOneModelo = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "politicas", "modelo", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.politicas.getOneModelo(id);
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

  const getOneModeloItem = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "comissionamento", "politicas", "modelo", "item", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.politicas.getOneModeloItem(id);
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
      mutationFn: async (data: PoliticasProps) => {
        return await api
          .post(`comercial/comissionamento/politicas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const copyPolitica = () =>
    useMutation({
      mutationFn: async (data: PoliticasProps) => {
        return await api
          .post(`comercial/comissionamento/politicas/copy`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const insertCargoPolitica = () =>
    useMutation({
      mutationFn: async (data: CargoPoliticasProps) => {
        return await api
          .post(`comercial/comissionamento/politicas/cargos`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const insertModelo = () =>
    useMutation({
      mutationFn: async (data: ModeloFormData) => {
        return await api
          .post(`comercial/comissionamento/politicas/modelos`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const insertModeloItem = () =>
    useMutation({
      mutationFn: async (data: ModeloItemFormData) => {
        return await api
          .post(`comercial/comissionamento/politicas/modelos/itens`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const updateModelo = () =>
    useMutation({
      mutationFn: async (data: ModeloFormData) => {
        return await api
          .put(`comercial/comissionamento/politicas/modelos`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const updateModeloItem = () =>
    useMutation({
      mutationFn: async (data: ModeloItemFormData) => {
        return await api
          .put(`comercial/comissionamento/politicas/modelos/itens`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const removeCargoPolitica = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/comissionamento/politicas/cargos/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "comissionamento", "politicas"],
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

  const getAllCargos = (params: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "cargos", "lista", { params }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => await fetchApi.comercial.politicas.getAllCargos(params),
      placeholderData: keepPreviousData,
    });

  return {
    getAll,
    getOne,
    getOneModelo,
    getOneModeloItem,

    insertOne,
    copyPolitica,
    insertCargoPolitica,
    insertModelo,
    insertModeloItem,

    updateModelo,
    updateModeloItem,

    removeCargoPolitica,

    getAllCargos,
  };
};
