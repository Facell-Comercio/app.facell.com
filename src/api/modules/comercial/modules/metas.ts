import { api } from "@/lib/axios";

export namespace metas {
  export const getAll = async (params: unknown) => {
    const response = await api.get("/comercial/metas", { params });
    return response.data;
  };

  export const getOne = async (id?: string | null) => {
    const response = await api.get(`/comercial/metas/${id}`);
    return response.data;
  };
}
