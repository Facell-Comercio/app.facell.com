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

export type MetasProps = {
  id?: string;
  ref?: string;
  ciclo?: string;
  id_grupo_economico?: string;
  grupo_economico?: string;
  id_filial?: string;
  filial?: string;
  cargo?: string;
  cpf?: string;
  nome?: string;
  tags?: string;

  data_inicial?: string;
  data_final?: string;

  proporcional?: string;

  controle?: string;
  pos?: string;
  upgrade?: string;
  receita?: string;
  qtde_aparelho?: string;
  aparelho?: string;
  acessorio?: string;
  pitzi?: string;
  fixo?: string;
  wttx?: string;
  live?: string;

  canEdit?: boolean;
};

export const useMetas = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "metas", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.metas.getAll({ pagination, filters }),
      placeholderData: keepPreviousData,
    });

  const getOne = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "metas", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.metas.getOne(id);
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

  const getComparison = ({ filters }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "metas", "comparison", "list", { filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.metas.getComparison({ filters }),
    });

  const insertOne = () =>
    useMutation({
      mutationFn: async (data: MetasProps) => {
        return await api
          .post(`comercial/metas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "metas"],
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

  const importMetas = () =>
    useMutation({
      mutationFn: async (data: MetasProps[]) => {
        return await api
          .post(`comercial/metas/import`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "metas"],
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
      mutationFn: async (data: MetasProps) => {
        return await api
          .put(`comercial/metas`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "metas"],
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

  const deleteMeta = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/metas/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "metas", "lista"],
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

  const exportMetas = () =>
    useMutation({
      mutationFn: async ({ filters }: GetAllParams) => {
        return await api
          .get(`/comercial/metas/export-metas`, {
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
    getComparison,
    insertOne,
    importMetas,
    update,
    deleteMeta,

    exportMetas,
  };
};
