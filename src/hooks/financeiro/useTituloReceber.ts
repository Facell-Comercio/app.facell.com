import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { VencimentoCRProps } from "@/pages/financeiro/components/ModalVencimentosCR";
import { LancamentoTimProps } from "@/pages/financeiro/contas-receber/titulos/components/ButtonImportarTituloReceber";
import { TituloCRSchemaProps } from "@/pages/financeiro/contas-receber/titulos/titulo/form-data";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GetTitulosReceberProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export type RecebimentoProps = {
  id_titulo?: string;
  id_vencimento?: string;
  data: Date;
  valor?: string;
  id_conta_bancaria?: string;
  conta_bancaria?: string;
  num_doc?: string;
  id_fornecedor?: string;
  fornecedor?: string;
  id_filial?: string;
  filial?: string;
  descricao?: string;
  criador?: string;
};

type RecebimentoContaBancariaProps = {
  id_extrato?: string;
  id_conta_bancaria?: string;
  vencimentos?: VencimentoCRProps[];
};

type LancamentoTimSchemma = {
  items_list?: LancamentoTimProps[];
};

const uri = "/financeiro/contas-a-receber/titulo";
const uriRecebimentos = "/financeiro/contas-a-receber/recebimentos";

export const useTituloReceber = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetTitulosReceberProps) =>
    useQuery({
      queryKey: ["financeiro", "contas_receber", "titulo", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: () =>
        fetchApi.financeiro.contas_receber.titulos.getAll({
          pagination,
          filters,
        }),
      placeholderData: keepPreviousData,
    });

  const getOne = (id: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["financeiro", "contas_receber", "titulo", "detalhe", id],
      queryFn: () => fetchApi.financeiro.contas_receber.titulos.getOne(id),
    });

  const insertOne = () =>
    useMutation({
      mutationFn: async (data: TituloCRSchemaProps) => {
        return await api.post(`${uri}`, data).then((response) => response.data);
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
      mutationFn: async ({ id, ...rest }: TituloCRSchemaProps) => {
        return await api.put(`${uri}`, { id, ...rest }).then((response) => response.data);
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

  //* RECEBIMENTOS
  const getAllRecebimentos = ({ pagination, filters }: GetTitulosReceberProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_receber",
        "titulo",
        "vencimentos",
        "recebimentos",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: () =>
        fetchApi.financeiro.contas_receber.titulos.getAllRecebimentos({
          pagination,
          filters,
        }),
      placeholderData: keepPreviousData,
    });
  const getAllRecebimentosVencimento = (id_vencimento: string | null) =>
    useQuery({
      enabled: !!id_vencimento,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: [
        "financeiro",
        "contas_receber",
        "titulo",
        "vencimentos",
        "recebimentos",
        "lista",
        [id_vencimento],
      ],
      queryFn: () =>
        fetchApi.financeiro.contas_receber.titulos.getAllRecebimentosVencimento(id_vencimento),
    });

  const getAllTransacoesAndVencimentos = (params: unknown) =>
    useQuery({
      //@ts-ignore
      enabled: !!params.id_conta_bancaria,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: [
        "financeiro",
        "contas_receber",
        "titulo",
        "vencimentos",
        "recebimentos",
        "conta_bancaria",
        "lista",
        //@ts-ignore
        [params.id_conta_bancaria],
      ],
      queryFn: () =>
        fetchApi.financeiro.contas_receber.titulos.getAllTransacoesAndVencimentos(params),
    });

  const insertOneRecebimentoManual = () =>
    useMutation({
      mutationFn: async (data: RecebimentoProps) => {
        return await api.post(`${uriRecebimentos}/manual`, data).then((response) => response.data);
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

  const insertOneRecebimentoContaBancaria = () =>
    useMutation({
      mutationFn: async (data: RecebimentoContaBancariaProps) => {
        return await api
          .post(`${uriRecebimentos}/conta-bancaria`, data)
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

  const deleteRecebimento = () =>
    useMutation({
      mutationFn: async (id: string) => {
        return await api
          .delete(`${uri}/vencimentos/recebimentos/${id}`)
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

  const lancamentoReembolsoTim = () =>
    useMutation({
      mutationFn: async (data: LancamentoTimSchemma) => {
        return api.post(`${uri}/reembolso-tim-lote`, data).then((response) => response.data);
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

  const lancamentoComissoesTim = () =>
    useMutation({
      mutationFn: async (data: LancamentoTimSchemma) => {
        return api.post(`${uri}/comissoes-tim-lote`, data).then((response) => response.data);
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

  return {
    getAll,
    getOne,
    insertOne,
    update,

    getAllRecebimentos,
    getAllRecebimentosVencimento,
    getAllTransacoesAndVencimentos,
    insertOneRecebimentoManual,
    insertOneRecebimentoContaBancaria,
    deleteRecebimento,

    lancamentoReembolsoTim,
    lancamentoComissoesTim,
  };
};
