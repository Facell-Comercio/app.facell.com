import fetchApi from "@/api/fetchApi";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export type ClientesProps = {
  gsm?: string;
  gsm_portado?: string | null;
  cpf?: string;
  data_ultima_compra?: string;
  plano_habilitado?: string;
  produto_ultima_compra?: string;
  desconto_plano?: string;
  valor_caixa?: string;
  filial?: string;
  area?: string;
};

export const useMailing = () => {
  // const queryClient = useQueryClient();

  const getClientes = ({ pagination, filters }: GetAllParams) =>
    useQuery({
      queryKey: ["marketing", "mailing", "lista", { pagination }],
      staleTime: 5 * 1000 * 60,
      retry: false,
      queryFn: async () => await fetchApi.marketing.mailing.getClientes({ pagination, filters }),
      placeholderData: keepPreviousData,
    });

  // const getOne = (id?: string | null) =>
  //   useQuery({
  //     enabled: !!id,
  //     retry: false,
  //     staleTime: 5 * 1000 * 60,
  //     queryKey: ["marketing", "mailing", "detalhe", id],
  //     queryFn: async () => {
  //       try {
  //         const result = fetchApi.marketing.mailing.getOne(id);
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

  // const insertOne = () =>
  //   useMutation({
  //     mutationFn: async (data: MailingProps) => {
  //       return await api.post(`marketing/mailing`, data).then((response) => response.data);
  //     },
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ["marketing", "mailing"],
  //       });
  //       toast({
  //         variant: "success",
  //         title: "Sucesso",
  //         description: "Atualização realizada com sucesso",
  //         duration: 3500,
  //       });
  //     },
  //     onError(error) {
  //       // @ts-expect-error 'Vai funcionar'
  //       const errorMessage = error.response?.data.message || error.message;
  //       toast({
  //         title: "Erro",
  //         description: errorMessage,
  //         duration: 3500,
  //         variant: "destructive",
  //       });
  //     },
  //   });

  // const importMailing = () =>
  //   useMutation({
  //     mutationFn: async (data: MailingProps[]) => {
  //       return await api.post(`marketing/mailing/import`, data).then((response) => response.data);
  //     },
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ["marketing", "mailing"],
  //       });
  //     },
  //     onError(error) {
  //       // @ts-expect-error 'Vai funcionar'
  //       const errorMessage = error.response?.data.message || error.message;
  //       toast({
  //         title: "Erro",
  //         description: errorMessage,
  //         duration: 3500,
  //         variant: "destructive",
  //       });
  //     },
  //   });

  // const update = () =>
  //   useMutation({
  //     mutationFn: async (data: MailingProps) => {
  //       return await api.put(`marketing/mailing`, data).then((response) => response.data);
  //     },
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ["marketing", "mailing"],
  //       });
  //       toast({
  //         variant: "success",
  //         title: "Sucesso",
  //         description: "Atualização realizada com sucesso",
  //         duration: 3500,
  //       });
  //     },
  //     onError(error) {
  //       // @ts-expect-error 'Vai funcionar'
  //       const errorMessage = error.response?.data.message || error.message;
  //       toast({
  //         title: "Erro",
  //         description: errorMessage,
  //         duration: 3500,
  //         variant: "destructive",
  //       });
  //     },
  //   });

  // const deleteAgregador = () =>
  //   useMutation({
  //     mutationFn: async (id: string | null | undefined) => {
  //       return await api.delete(`marketing/mailing/${id}`).then((response) => response.data);
  //     },
  //     onSuccess() {
  //       queryClient.invalidateQueries({
  //         queryKey: ["marketing", "mailing", "lista"],
  //       });
  //       toast({
  //         variant: "success",
  //         title: "Sucesso",
  //         description: "Atualização realizada com sucesso",
  //         duration: 3500,
  //       });
  //     },
  //     onError(error) {
  //       // @ts-expect-error 'Vai funcionar'
  //       const errorMessage = error.response?.data.message || error.message;
  //       toast({
  //         title: "Erro",
  //         description: errorMessage,
  //         duration: 3500,
  //         variant: "destructive",
  //       });
  //     },
  //   });

  // const exportMailing = () =>
  //   useMutation({
  //     mutationFn: async ({ filters }: GetAllParams) => {
  //       return await api
  //         .get(`/marketing/mailing/export-mailing`, {
  //           params: { filters },
  //           responseType: "blob",
  //         })
  //         .then((response) => {
  //           downloadResponse(response);
  //         });
  //     },
  //     onError: async (error) => {
  //       // @ts-expect-error "Funciona"
  //       const errorText = await error.response.data.text();
  //       const errorJSON = JSON.parse(errorText);

  //       toast({
  //         variant: "destructive",
  //         title: "Ops!",
  //         description: errorJSON.message,
  //       });
  //     },
  //   });

  return {
    getClientes,
  };
};