import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/axios";
import { PlanoSchema } from "@/pages/marketing/cadastros/planos/plano/Modal";
import { VendedorSchema } from "@/pages/marketing/cadastros/vendedores/vendedor/Modal";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCadastros = () => {
  const queryClient = useQueryClient();
  return {
    //* PLANOS MARKETING
    getAllPlanos: (params?: GetAllParams) =>
      useQuery({
        queryKey: ["marketing", "cadastros", "planos", "lista", params?.pagination],
        queryFn: async () => {
          return await api
            .get(`marketing/cadastros/planos`, {
              params,
            })
            .then((response) => response.data);
        },
        placeholderData: keepPreviousData,
      }),

    getOnePlano: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["marketing", "cadastros", "planos", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`marketing/cadastros/planos/${id}`)
            .then((response) => response.data);
        },
      }),

    insertOnePlano: () =>
      useMutation({
        mutationFn: async (data: PlanoSchema) => {
          return await api
            .post("marketing/cadastros/planos", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),

    updatePlano: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: PlanoSchema) => {
          return await api
            .put("marketing/cadastros/planos/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),
    deletePlano: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`marketing/cadastros/planos/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),

    //* VENDEDORES MARKETING
    getAllVendedores: ({ pagination, filters }: GetAllParams) =>
      useQuery({
        queryKey: ["marketing", "cadastros", "vendedores", "lista", pagination],
        queryFn: async () => {
          return await api
            .get(`marketing/cadastros/vendedores`, {
              params: { pagination, filters },
            })
            .then((response) => response.data);
        },
        placeholderData: keepPreviousData,
      }),

    getOneVendedor: (id: string | null | undefined) =>
      useQuery({
        enabled: !!id,
        queryKey: ["marketing", "cadastros", "vendedores", "detalhe", id],
        queryFn: async () => {
          return await api
            .get(`marketing/cadastros/vendedores/${id}`)
            .then((response) => response.data);
        },
      }),

    insertOneVendedor: () =>
      useMutation({
        mutationFn: async (data: VendedorSchema) => {
          return await api
            .post("marketing/cadastros/vendedores", data)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),

    updateVendedor: () =>
      useMutation({
        mutationFn: async ({ id, ...rest }: VendedorSchema) => {
          return await api
            .put("marketing/cadastros/vendedores/", { id, ...rest })
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),
    deleteVendedor: () =>
      useMutation({
        mutationFn: async (id: string | null | undefined) => {
          return await api
            .delete(`marketing/cadastros/vendedores/${id}`)
            .then((response) => response.data);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: ["marketing", "cadastros"] });
          toast({
            variant: "success",
            title: "Sucesso",
            description: "Atualização realizada com sucesso",
            duration: 3500,
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
      }),
  };
};
