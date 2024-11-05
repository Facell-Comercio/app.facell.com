import { api } from "@/lib/axios";

export namespace politicas {
  export const getAll = async (
    params: unknown
  ) => {
    const response = await api.get(
      "/comercial/comissionamento/politicas",
      { params }
    );
    return response.data;
  };

  export const getOne = async (
    id?: string | null
  ) => {
    const response = await api.get(
      `/comercial/comissionamento/politicas/politica`,
      { params: { id } }
    );
    return response.data;
  };

  export const getOneModelo = async (
    id?: string | null
  ) => {
    const response = await api.get(
      `/comercial/comissionamento/politicas/modelos/${id}`
    );
    return response.data;
  };

  export const getOneModeloItem = async (
    id?: string | null
  ) => {
    const response = await api.get(
      `/comercial/comissionamento/politicas/modelos/itens/${id}`
    );
    return response.data;
  };
}
