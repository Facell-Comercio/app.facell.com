import { api } from "@/lib/axios";

export namespace vales {
  export const getAll = async (params: unknown) => {
    const response = await api.get("/comercial/vales", { params });
    return response.data;
  };

  export const getOne = async (id?: string | null) => {
    const response = await api.get(`/comercial/vales/${id}`);
    return response.data;
  };
}
