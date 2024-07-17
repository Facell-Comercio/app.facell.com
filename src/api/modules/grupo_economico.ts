import { api } from "@/lib/axios";

export const getAll =  async (params:unknown) => await api.get("/grupo-economico", {params});


