import { api } from "@/lib/axios";

export namespace espelhos {
  export const getAll = async (params: unknown) => {
    const response = await api.get("/comercial/comissionamento/espelhos", { params });
    return response.data;
  };

  export const getOne = async (id?: string | null) => {
    const response = await api.get(`/comercial/comissionamento/espelhos/${id}`);
    return response.data;
  };

  export const getAllContestacoes = async (params: unknown) => {
    const response = await api.get("/comercial/comissionamento/espelhos/contestacoes", { params });
    return response.data;
  };

  export const getOneContestacao = async (id?: string | null) => {
    const response = await api.get(`/comercial/comissionamento/espelhos/contestacoes/${id}`);
    return response.data;
  };

  export const getAllItens = async (params: unknown) => {
    const response = await api.get("/comercial/comissionamento/espelhos/itens", { params });
    return response.data;
  };

  export const getOneItem = async (id?: string | null) => {
    const response = await api.get(`/comercial/comissionamento/espelhos/itens/${id}`);
    return response.data;
  };

  export const getAllVendasInvalidas = async (params: unknown) => {
    const response = await api.get("/comercial/comissionamento/espelhos/vendas-invalidadas", {
      params,
    });
    return response.data;
  };
}
