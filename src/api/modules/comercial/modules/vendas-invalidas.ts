import { api } from "@/lib/axios";

export namespace vendasInvalidas {
  export const getAll = async (
    params: unknown
  ) => {
    const response = await api.get(
      "/comercial/comissionamento/vendas-invalidas",
      { params }
    );
    return response.data;
  };

  export const getOne = async (
    id?: string | null
  ) => {
    const response = await api.get(
      `/comercial/comissionamento/vendas-invalidas/${id}`
    );
    return response.data;
  };
}
