import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { MetasProps } from "./useMetas";

export type AgregadoresProps = {
  id?: string;
  ref?: string;
  ciclo?: string;
  id_grupo_economico?: string;
  grupo_economico?: string;
  id_filial?: string;
  filial?: string;
  cargo?: string;
  tipo_agregacao?: string;
  cpf?: string;
  nome?: string;
  tags?: string;
  metas_agregadas?: string;

  data_inicial?: string;
  data_final?: string;

  proporcional?: string;

  metas?: MetasProps[];
};

export const useAgregadores = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "agregadores", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.agregadores.getAll({ pagination, filters }),
      placeholderData: keepPreviousData,
    });

  const getOne = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "agregadores", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.agregadores.getOne(id);
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

  const insertOne = () =>
    useMutation({
      mutationFn: async (data: AgregadoresProps) => {
        return await api
          .post(`comercial/agregadores`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "agregadores"],
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

  const lancamentoLote = () =>
    useMutation({
      mutationFn: async (data: AgregadoresProps[]) => {
        return await api
          .post(`comercial/agregadores/lancamento-lote`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "agregadores"],
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

  const update = () =>
    useMutation({
      mutationFn: async (data: AgregadoresProps) => {
        return await api
          .put(`comercial/agregadores`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "agregadores"],
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

  const deleteAgregador = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/agregadores/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "agregadores", "lista"],
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

  const exportAgregadores = () =>
    useMutation({
      mutationFn: async ({ filters }: GetAllParams) => {
        return await api
          .get(`/comercial/agregadores/export-agregadores`, {
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
          title: "Ops!",
          description: errorJSON.message,
        });
      },
    });

  return {
    getAll,
    getOne,
    insertOne,
    lancamentoLote,
    update,
    deleteAgregador,

    exportAgregadores,
  };
};
