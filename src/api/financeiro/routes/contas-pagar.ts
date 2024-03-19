import { api } from "@/lib/axios";

export interface GetTitulosPagarProps {
  pagination: {
    pageIndex: number;
    pageLength: number;
  };
  filters: any;
}

interface ITituloPagar {
  // ... relevant properties based on your API response structure
}

export const getTitulos = async (props: GetTitulosPagarProps) => {
    const response = await api.get("/financeiro/contas-a-pagar/titulo/", { params: { ...props } });
    return response;
};

export const getTitulo = (id: number) => {
  return api.get(`/financeiro/contas-a-pagar/titulo/${id}`);
};
