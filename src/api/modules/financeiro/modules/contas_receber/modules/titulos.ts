import { api } from "@/lib/axios";

const uri = "/financeiro/contas-a-receber/titulo";
const uriRecebimentos = "/financeiro/contas-a-receber/recebimentos";
export namespace titulos {
  export const getAll = async (params: unknown) => {
    const response = await api.get(`${uri}`, {
      params,
    });
    return response.data;
  };

  export const getOne = async (id: string | null) => {
    const response = await api.get(`${uri}/${id}`);
    return response.data;
  };

  export const getAllRecebimentos = async (params: unknown) => {
    const response = await api.get(`${uriRecebimentos}`, {
      params,
    });
    return response.data;
  };

  export const getAllRecebimentosVencimento = async (id_vencimento: string | null) => {
    const response = await api.get(`${uri}/vencimentos/recebimentos`, {
      params: {
        id_vencimento,
      },
    });
    return response.data;
  };

  export const getOneRecebimento = async (id: string | null) => {
    const response = await api.get(`${uri}/vencimentos/recebimentos/${id}`);
    return response.data;
  };

  export const processarXml = async function (fileUrl: string) {
    try {
      const result = await api.post(`${uri}/processar-xml`, { fileUrl });
      return result.data;
    } catch (error) {
      return error;
    }
  };
}
