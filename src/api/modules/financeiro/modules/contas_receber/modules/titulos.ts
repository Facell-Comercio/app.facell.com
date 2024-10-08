import { api } from "@/lib/axios";

const uri = "/financeiro/contas-a-receber/titulo";
export namespace titulos {
  export const getAll = async (params: unknown) => {
    const response = await api.get(`${uri}`, {
      params,
    });
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
