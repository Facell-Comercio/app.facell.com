import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { TituloCRSchemaProps } from "@/pages/financeiro/contas-receber/titulos/titulo/form-data";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface GetTitulosReceberProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

const uri = "/financeiro/contas-a-receber/titulo";

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

  // const getPendencias = () =>
  //   useQuery({
  //     retry: false,
  //     queryKey: ["financeiro", "contas_receber", "pendencia", "lista"],
  //     queryFn: async () => {
  //       try {
  //         const result = await api.get(
  //           `${uri}/pendencias`
  //         );
  //         return result;
  //       } catch (error) {
  //         // @ts-expect-error "Vai funcionar"
  //         const errorMessage = error.response?.data.message || error.message;
  //         toast({
  //           title: "Erro",
  //           description: errorMessage,
  //           duration: 3500,
  //           variant: "destructive",
  //         });
  //       }
  //     },
  //   });

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

  return {
    getAll,
    getOne,
    insertOne,
    update,
  };
};
