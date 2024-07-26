import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type ValeProps = {
  id?: string;
  created_at?: string;
  updated_at?: string;
  data_inicio_cobranca: string;
  cpf: string;
  id_filial: string;
  valor: string;
  saldo: string;
  origem: string;
  parcelas: string;
  parcela: string;
  valor_parcela?: string;
  obs: string;
  nome_colaborador: string;
  id_criador: string;
  filial?: string;
  abatimentos?: AbatimentosProps[];
};

export type AbatimentosProps = {
  id?: string;
  valor?: string;
  obs?: string;
  created_at?: string;
  criador?: string;
};

export interface GetValesProps {
  pagination?: {
    pageIndex?: number;
    pageLength?: number;
  };
  filters: any;
}

export const useVales = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetValesProps) =>
    useQuery({
      queryKey: ["comercial", "vales", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: () =>
        fetchApi.comercial.vales.getAll({
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
      queryKey: ["comercial", "vales", "detalhe", id],
      queryFn: async () => {
        try {
          const result = fetchApi.comercial.vales.getOne(id);
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
      mutationFn: async (data: ValeProps) => {
        return await api
          .post(`comercial/vales`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "vales"],
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

  const update = () =>
    useMutation({
      mutationFn: async (data: ValeProps) => {
        return await api
          .put(`comercial/vales`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "vales"],
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

  const deleteVale = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/vales/${id}`)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "vales", "lista"],
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

  return {
    getAll,
    getOne,
    insertOne,
    update,
    deleteVale,
  };
};
