import { api } from "@/lib/axios";

export const getAll = async (params:unknown) => {
    const response = await api.get("/financeiro/contas-a-pagar/cartoes", {params});
    return response.data;
};

