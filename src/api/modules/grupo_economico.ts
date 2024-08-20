import { api } from "@/lib/axios";

export namespace grupo_economico {
  export const getAll = async (params: unknown) =>
    await api.get("/grupo-economico", { params });
}
