import { api } from "@/lib/axios";

export const getAll = async (params:unknown) => {
    const response = await api.get("/financeiro/contas-a-pagar/titulo", {params});
    return response.data;
};
