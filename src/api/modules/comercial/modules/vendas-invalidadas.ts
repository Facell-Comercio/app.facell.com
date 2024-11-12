import { api } from "@/lib/axios";

export namespace vendasInvalidadas {
  export const getAll = async (params: unknown) => {
    const response = await api.get("/comercial/comissionamento/vendas-invalidadas", { params });
    return response.data;
  };

  export const getOne = async (id?: string | null) => {
    const response = await api.get(`/comercial/comissionamento/vendas-invalidadas/${id}`);
    return response.data;
  };

  export const getOneContestacao = async (id?: string | null) => {
    const response = await api.get(
      `/comercial/comissionamento/vendas-invalidadas/contestacoes/${id}`
    );
    return response.data;
  };
}
