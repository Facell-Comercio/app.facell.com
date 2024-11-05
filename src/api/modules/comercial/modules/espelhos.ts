import { api } from "@/lib/axios";

export namespace espelhos {
  export const getAll = async (
    params: unknown
  ) => {
    const response = await api.get(
      "/comercial/comissionamento/espelhos",
      { params }
    );
    return response.data;
  };

  export const getOne = async (
    id?: string | null
  ) => {
    const response = await api.get(
      `/comercial/comissionamento/espelhos/${id}`
    );
    return response.data;
  };
}
