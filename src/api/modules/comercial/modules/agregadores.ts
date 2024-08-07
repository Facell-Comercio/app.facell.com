import { api } from "@/lib/axios";

export namespace agregadores {
  export const getAll = async (params: unknown) => {
    const response = await api.get("/comercial/agregadores", { params });
    return response.data;
  };

  export const getOne = async (id?: string | null) => {
    const response = await api.get(`/comercial/agregadores/${id}`);
    return response.data;
  };
}
