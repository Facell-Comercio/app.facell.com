import { api } from "@/lib/axios";
export namespace forma_pagamento {
  export const getAll = async () => {
    const response = await api.get("/financeiro/formas-pagamento");
    return response.data;
  };
}
