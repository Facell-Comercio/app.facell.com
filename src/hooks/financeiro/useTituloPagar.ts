import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { downloadResponse } from "@/helpers/download";
import { api } from "@/lib/axios";
import { AlteracaoLoteSchemaProps } from "@/pages/financeiro/contas-pagar/titulos/alteracao-lote/Modal";
import { ExportAnexosProps } from "@/pages/financeiro/contas-pagar/titulos/components/ButtonExportarTitulos";
import { LancamentoLoteProps } from "@/pages/financeiro/contas-pagar/titulos/components/ButtonImportarTitulo";
import { EditRecorrenciaProps } from "@/pages/financeiro/contas-pagar/titulos/recorrencias/ModalEditarRecorrencia";
import { TituloSchemaProps } from "@/pages/financeiro/contas-pagar/titulos/titulo/form-data";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface GetTitulosPagarProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

const uri = '/financeiro/contas-a-pagar/titulo';

export const useTituloPagar = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetTitulosPagarProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_pagar",
        "titulo",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: () =>
        fetchApi.financeiro.contas_pagar.titulos.getAll({
          pagination,
          filters,
        }),
      placeholderData: keepPreviousData,
    });

  const getRecorrencias = ({ filters }: GetTitulosPagarProps) =>
    useQuery({
      queryKey: ["financeiro", "contas_pagar", "recorrencia", "lista", filters],
      retry: false,
      queryFn: async () => {
        return await api.get(`${uri}/recorrencias`, {
          params: { filters },
        });
      },
      placeholderData: keepPreviousData,
    });

  const getOne = (id: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["financeiro", "contas_pagar", "titulo", "detalhe", id],
      queryFn: async () => {
        try {
          const result = await api.get(
            `${uri}/${id}`
          );
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

  const getPendencias = () =>
    useQuery({
      retry: false,
      queryKey: ["financeiro", "contas_pagar", "pendencia", "lista"],
      queryFn: async () => {
        try {
          const result = await api.get(
            `${uri}/pendencias`
          );
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
      mutationFn: async (data: TituloSchemaProps) => {
        return await api
          .post(`${uri}`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Solicitação criada com sucesso!",
        });
        queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
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
      mutationFn: async ({ id, ...rest }: TituloSchemaProps) => {
        return await api
          .put(`${uri}`, { id, ...rest })
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Solicitação atualizada com sucesso!",
        });
        queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
        const errorMessage = error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const deleteRecorrencia = () =>
    useMutation({
      mutationFn: async (id: number | string) => {
        return await api
          .delete(`${uri}/recorrencias/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Exclusão de recorrência realizada com sucesso!",
        });
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "recorrencia"],
        });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
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
      mutationFn: async (data: LancamentoLoteProps[]) => {
        return api
          .post(`${uri}/solicitacao-lote`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
        const errorMessage = error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const changeTitulos = () =>
    useMutation({
      mutationFn: async ({ ...rest }: AlteracaoLoteSchemaProps) => {
        return await api
          .put(`${uri}/change-fields`, { ...rest })
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Alterações realizadas com sucesso!",
        });
        queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
        const errorMessage = error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });
  const changeRecorrencia = () =>
    useMutation({
      mutationFn: async ({
        id,
        data_vencimento,
        valor,
      }: EditRecorrenciaProps) => {
        return await api
          .put(`${uri}/recorrencias/${id}`, {
            data_vencimento,
            valor,
          })
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Alterações realizadas com sucesso!",
        });
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "recorrencia"],
        });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
        const errorMessage = error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const exportAnexo = () =>
    useMutation({
      mutationFn: async ({ type, idSelection }: ExportAnexosProps) => {
        return await api
          .post(
            `${uri}/download`,
            { type, idSelection },
            {
              responseType: "blob",
            }
          )
          .then((response) => {
            downloadResponse(response);
          });
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description: "Exportação realizadas com sucesso!",
        });
      },
      onError(error) {
        // @ts-expect-error "Vai funcionar"
        const errorMessage = error.response?.data.message || error.message;
        toast({
          title: "Erro",
          description: errorMessage,
          duration: 3500,
          variant: "destructive",
        });
      },
    });

  const exportPrevisaoPagamento = () => useMutation({
    mutationFn: async ({ filters }: GetTitulosPagarProps) => {
      
      return await api
        .get(`${uri}/export-previsao-pagamento`, {
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
        title: 'Ops',
        description: errorJSON.message
      });
    },
  })

  const exportLayoutDespesas = () => useMutation({
    mutationFn: async ({ filters }: GetTitulosPagarProps) => {
      
      return await api
        .get(`${uri}/export-layout-despesas`, {
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
        title: 'Ops',
        description: errorJSON.message
      });
    },
  })

  const exportLayoutDRE = () => useMutation({
    mutationFn: async ({ filters }: GetTitulosPagarProps) => {
      
      return await api
        .get(`${uri}/export-layout-dre`, {
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
        title: 'Ops',
        description: errorJSON.message
      });
    },
  })


  return {
    getAll,
    getRecorrencias,
    getOne,
    getPendencias,
    insertOne,
    update,
    lancamentoLote,
    deleteRecorrencia,
    changeTitulos,
    changeRecorrencia,
    exportAnexo,
    exportPrevisaoPagamento,
    exportLayoutDespesas,
    exportLayoutDRE,
  };
};
