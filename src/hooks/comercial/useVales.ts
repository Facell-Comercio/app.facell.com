import fetchApi from "@/api/fetchApi";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
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
  data_inicio_cobranca: string | Date;
  cpf_colaborador?: string;
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
  id_colaborador: string;
  filial?: string;
  abatimentos?: AbatimentosProps[];
};

export type AbatimentosProps = {
  id?: string;
  id_vale?: string;
  valor?: string;
  valor_inicial?: string;
  saldo_vale?: string;
  saldo?: string;
  obs?: string;
  created_at?: string;
  criador?: string;
};

export const useVales = () => {
  const queryClient = useQueryClient();

  const getAll = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "vales", "lista", { pagination, filters }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () =>
        await fetchApi.comercial.vales.getAll({
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

  const getOneAbatimento = (id?: string | null) =>
    useQuery({
      enabled: !!id,
      retry: false,
      staleTime: 5 * 1000 * 60,
      queryKey: ["comercial", "vales", "vale", "detalhe", id],
      queryFn: async () => {
        try {
          const result = await api
            .get(`comercial/vales/abatimentos/${id}`)
            .then((response) => response.data);
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

  const lancamentoLote = () =>
    useMutation({
      mutationFn: async (data: ValeProps[]) => {
        return await api
          .post(`comercial/vales/lancamento-lote`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "vales"],
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

  const insertAbatimento = () =>
    useMutation({
      mutationFn: async (data: AbatimentosProps) => {
        return await api
          .post(`comercial/vales/abatimentos`, data)
          .then((response) => response.data);
      },
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: ["comercial", "vales", "detalhe"],
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

  const updateAbatimento = () =>
    useMutation({
      mutationFn: async (data: AbatimentosProps) => {
        return await api
          .put(`comercial/vales/abatimentos`, data)
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

  const deleteAbatimento = () =>
    useMutation({
      mutationFn: async (id: string | null | undefined) => {
        return await api
          .delete(`comercial/vales/abatimentos/${id}`)
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

  return {
    getAll,
    getOne,
    getOneAbatimento,
    insertOne,
    lancamentoLote,
    insertAbatimento,
    update,
    updateAbatimento,
    deleteVale,
    deleteAbatimento,
  };
};
