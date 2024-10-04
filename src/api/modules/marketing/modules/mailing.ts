import { api } from "@/lib/axios";

export namespace mailing {
  export const getClientes = async (params: unknown) => {
    const response = await api.get("/marketing/mailing/clientes", { params });
    return response.data;
  };
}
