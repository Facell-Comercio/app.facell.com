import { api } from "@/lib/axios";

export namespace mailing {
  // FILTROS MUITO COMPLEXOS (NECESSÁRIO TROCAR POR UM POST)
  export const getClientes = async (data: unknown) =>
    await api.post("/marketing/mailing/clientes", data).then((res) => res.data);
  // -

  export const getCampanhas = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/campanhas", { params });
    return response.data;
  };
  export const getAparelhos = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/aparelhos", { params });
    return response.data;
  };
  export const getEstoquesAparelho = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/aparelhos/estoque", { params });
    return response.data;
  };
  export const getVendedores = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/vendedores", { params });
    return response.data;
  };

  // FILTROS MUITO COMPLEXOS (NECESSÁRIO TROCAR POR UM POST)
  export const getOneCampanha = async ({
    id,
    ...data
  }: {
    id?: string | null;
    filters: any;
    pagination: any;
  }) => await api.post(`/marketing/mailing/campanhas/${id}`, data).then((res) => res.data);
  // -

  export const getOneClienteCampanha = async (id?: string | null) => {
    const response = await api.get(`/marketing/mailing/campanhas/clientes/${id}`);
    return response.data;
  };
}
