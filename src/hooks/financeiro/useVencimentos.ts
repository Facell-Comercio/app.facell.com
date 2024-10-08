import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { AlteracaoLoteVencimentosSchemaProps } from "@/pages/financeiro/contas-pagar/vencimentos/components/ModalAlteracoesVencimentosLote";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface GetVencimentosProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export const useVencimentos = () => {
  const queryClient = useQueryClient();

  const getVencimentosAPagar = ({
    pagination,
    filters,
  }: GetVencimentosProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_pagar",
        "vencimento",
        "pagamento_pendente",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => {
        return await api.get(
          `/financeiro/contas-a-pagar/vencimentos/vencimentos-e-faturas`,
          {
            params: {
              pagination,
              filters,
              minStatusTitulo: 3,
              pago: 0,
              closed: 1,
              emBordero: 0,
            },
          }
        );
      },
      placeholderData: keepPreviousData,
    });

  const getVencimentosEmBordero = ({
    pagination,
    filters,
  }: GetVencimentosProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_pagar",
        "vencimento",
        "em_bordero",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => {
        return await api.get(
          `/financeiro/contas-a-pagar/vencimentos/vencimentos-e-faturas`,
          {
            params: {
              pagination,
              filters,
              minStatusTitulo: 3,
              pago: 0,
              closed: 1,
              emBordero: 1,
            },
          }
        );
      },
      placeholderData: keepPreviousData,
    });

  const getVencimentosPagos = ({
    pagination,
    filters,
  }: GetVencimentosProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_pagar",
        "vencimento",
        "pago",
        "lista",
        { pagination, filters },
      ],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => {
        return await api.get(
          `/financeiro/contas-a-pagar/vencimentos/vencimentos-e-faturas`,
          {
            params: {
              pagination,
              filters,
              minStatusTitulo: 4,
              pago: 1,
              closed: 1,
              emBordero: 1,
            },
          }
        );
      },
      placeholderData: keepPreviousData,
    });

  const changeVencimentos = () =>
    useMutation({
      mutationFn: async ({
        ...rest
      }: AlteracaoLoteVencimentosSchemaProps) => {
        return await api
          .put(
            "/financeiro/contas-a-pagar/vencimentos/change-fields",
            {
              ...rest,
            }
          )
          .then((response) => response.data);
      },
      onSuccess() {
        toast({
          variant: "success",
          title: "Sucesso!",
          description:
            "Alterações realizadas com sucesso!",
        });
        queryClient.invalidateQueries({
          queryKey: [
            "financeiro",
            "contas_pagar",
          ],
        });
      },
      onError(error) {
        toast({
          variant: "destructive",
          title: "Ocorreu o seguinte erro",
          description:
            // @ts-expect-error "Funciona"
            error?.response?.data?.message ||
            error.message,
        });
        console.log(error);
      },
    });

  return {
    getVencimentosAPagar,
    getVencimentosEmBordero,
    getVencimentosPagos,
    changeVencimentos,
  };
};
