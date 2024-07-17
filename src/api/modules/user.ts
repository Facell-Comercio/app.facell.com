import { api } from "@/lib/axios";

export const getAll = async ({params}: {params:Record<string, unknown>}) => {
    const response = await api.get("/user", { params });
    return response.data;
};

export const getOne = async (id: any) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const insertOne = async (data: Record<string, unknown>) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const update = async (data: unknown) => {
    const response = await api.put(`/users/`, data);
    return response.data;
};

export const updatePassword = async (data: unknown) => {
    return await api
      .put("auth/alterar-senha", { params: data })
      .then((response) => response.data);
  }