import { api } from "@/lib/axios";

export const getAll = async () => {
    const response = await api.get("/financeiro/formas-pagamento");
    return response.data;
};
