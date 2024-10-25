import { api } from "@/lib/axios";

export namespace mailing {
  export const getClientes = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/clientes", { params });
    return response.data;
  };
  export const getCampanhas = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/campanhas", { params });
    return response.data;
  };
  export const getAparelhos = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/aparelhos", { params });
    return response.data;
  };
  export const getVendedores = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/vendedores", { params });
    return response.data;
  };
  export const getOneCampanha = async ({ id, filters }: { id?: string | null; filters: any }) => {
    const response = await api.get(`/marketing/mailing/campanhas/${id}`, { params: { filters } });
    return response.data;
  };
  export const getOneClienteCampanha = async (id?: string | null) => {
    const response = await api.get(`/marketing/mailing/campanhas/clientes/${id}`);
    return response.data;
  };
}
