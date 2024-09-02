import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export interface GetDDAProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export type VinculoDDAparams = {
  id_vencimento: number | string;
  id_dda: number | string;
  id_forma_pagamento: number | string;
};

export const useDDA = () => {
  const queryClient = useQueryClient();

  const getAllDDA = ({
    pagination,
    filters,
  }: GetDDAProps) =>
    useQuery({
      queryKey: [
        "financeiro",
        "contas_pagar",
        "dda",
        "lista",
        pagination,
        filters,
      ],
      staleTime: 0,
      retry: false,
      queryFn: async () => {
        return await api.get(
          `/financeiro/contas-a-pagar/dda/`,
          {
            params: {
              pagination,
              filters,
            },
          }
        );
      },
      placeholderData: keepPreviousData,
    });

  const importDDA = (files: FileList | null) => {
    return new Promise(
      async (resolve, reject) => {
        try {
          const form = new FormData();
          if (files) {
            for (
              let i = 0;
              i < files.length;
              i++
            ) {
              form.append("files", files[i]);
            }
          }
          const result = await api.postForm(
            "/financeiro/contas-a-pagar/dda/import",
            form
          );
          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      }
    );
  };

  const exportDDA = (filters: any) => {
    return new Promise(
      async (resolve, reject) => {
        try {
          const result = await api.post(
            "/financeiro/contas-a-pagar/dda/export",
            { filters }
          );
          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      }
    );
  };

  const limparDDA = () => {
    return new Promise(
      async (resolve, reject) => {
        try {
          const result = await api.post(
            "/financeiro/contas-a-pagar/dda/limpar"
          );
          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      }
    );
  };

  const autoVincularDDA = () => {
    return new Promise(
      async (resolve, reject) => {
        try {
          const result = await api.post(
            "/financeiro/contas-a-pagar/dda/auto-vincular"
          );
          resolve(result.data);
        } catch (error) {
          reject(error);
        }
      }
    );
  };

  const vincularDDA = () =>
    useMutation({
      mutationFn: async (
        params: VinculoDDAparams
      ) => {
        return await api
          .post(
            "/financeiro/contas-a-pagar/dda/vincular",
            { ...params }
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "financeiro",
            "contas_pagar",
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

  const desvincularDDA = () =>
    useMutation({
      mutationFn: async (params: {
        id_dda: number;
      }) => {
        return await api
          .post(
            "/financeiro/contas-a-pagar/dda/desvincular",
            { ...params }
          )
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: [
            "financeiro",
            "contas_pagar",
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

  return {
    getAllDDA,
    importDDA,
    exportDDA,
    limparDDA,
    autoVincularDDA,
    vincularDDA,
    desvincularDDA,
  };
};
