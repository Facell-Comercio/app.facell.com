import { api } from "@/lib/axios";

export const getAll = async () => {
    const response = await api.get("/grupo-economico/");
    return response.data;
};
