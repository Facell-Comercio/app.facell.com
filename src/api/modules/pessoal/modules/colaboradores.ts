import { api } from "@/lib/axios";

export const getAll = async (params: unknown) => {
  const response = await api.get("/pessoal/colaboradores", { params });
  return response.data;
};

export const getOne = async (id?: string | null) => {
  const response = await api.get(`/pessoal/colaboradores/${id}`);
  return response.data;
};
