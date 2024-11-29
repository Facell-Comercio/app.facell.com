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

export type ConfiguracoesProps = {
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

export interface SegmentoProps {
  id?: string;
  categoria?: string;
  segmento?: string;
  empresa?: string;
  obs?: string;
  active?: string;
}

export const useConfiguracoes = () => {
  const queryClient = useQueryClient();

  const getEscalonamentos = () =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "configuracoes",
        "escalonamentos",
        "lista",
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await api
          .get(
            "/comercial/comissionamento/configuracoes/escalonamentos"
          )
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  const getSegmentos = (params: GetAllParams) =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "configuracoes",
        "segmentos",
        "lista",
        [params],
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await api
          .get(
            "/comercial/comissionamento/configuracoes/segmentos",
            { params }
          )
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  const getCargos = () =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "configuracoes",
        "cargos",
        "lista",
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await api
          .get(
            "/comercial/comissionamento/configuracoes/cargos"
          )
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  const insertOne = () =>
    useMutation({
      mutationFn: async (
        data: ConfiguracoesProps
      ) => {
        return await api
          .post(
            `comercial/comissionamento/configuracoes`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "configuracoes",
          ],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description:
            "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message ||
          error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const importConfiguracoes = () =>
    useMutation({
      mutationFn: async (
        data: ConfiguracoesProps[]
      ) => {
        return await api
          .post(
            `comercial/comissionamento/configuracoes/import`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "configuracoes",
          ],
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message ||
          error.message;
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
      mutationFn: async (
        data: ConfiguracoesProps
      ) => {
        return await api
          .put(
            `comercial/comissionamento/configuracoes`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "configuracoes",
          ],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description:
            "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message ||
          error.message;
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
      mutationFn: async (
        id: string | null | undefined
      ) => {
        return await api
          .delete(
            `comercial/comissionamento/configuracoes/${id}`
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "configuracoes",
            "lista",
          ],
        });
        toast({
          variant: "success",
          title: "Sucesso",
          description:
            "Atualização realizada com sucesso",
          duration: 3500,
        });
      },
      onError(error) {
        const errorMessage =
          // @ts-expect-error 'Vai funcionar'
          error.response?.data.message ||
          error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const exportConfiguracoes = () =>
    useMutation({
      mutationFn: async ({
        filters,
      }: GetAllParams) => {
        return await api
          .get(
            `/comercial/comissionamento/configuracoes/export-configuracoes`,
            {
              params: { filters },
              responseType: "blob",
            }
          )
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

  return {
    getEscalonamentos,
    getCargos,
    getSegmentos,

    insertOne,
    importConfiguracoes,
    update,
    deleteEspelho,

    exportConfiguracoes,
  };
};
