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

export type EspelhosProps = {
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

export const useEspelhos = () => {
  const queryClient = useQueryClient();

  const getAll = ({
    pagination,
    filters,
  }: GetAllParams) =>
    useQuery({
      queryKey: [
        "comercial",
        "comissionamento",
        "espelhos",
        "lista",
        { pagination, filters },
      ],
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
      queryKey: [
        "comercial",
        "comissionamento",
        "espelhos",
        "detalhe",
        id,
      ],
      queryFn: async () => {
        try {
          const result =
            fetchApi.comercial.espelhos.getOne(
              id
            );
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
      mutationFn: async (data: EspelhosProps) => {
        return await api
          .post(
            `comercial/comissionamento/espelhos`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "espelhos",
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

  const importEspelhos = () =>
    useMutation({
      mutationFn: async (
        data: EspelhosProps[]
      ) => {
        return await api
          .post(
            `comercial/comissionamento/espelhos/import`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "espelhos",
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
      mutationFn: async (data: EspelhosProps) => {
        return await api
          .put(
            `comercial/comissionamento/espelhos`,
            data
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "comissionamento",
            "espelhos",
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
            `comercial/comissionamento/espelhos/${id}`
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "comercial",
            "espelhos",
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

  const exportEspelhos = () =>
    useMutation({
      mutationFn: async ({
        filters,
      }: GetAllParams) => {
        return await api
          .get(
            `/comercial/comissionamento/espelhos/export-espelhos`,
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
    getAll,
    getOne,
    insertOne,
    importEspelhos,
    update,
    deleteEspelho,

    exportEspelhos,
  };
};
