import { api } from "@/lib/axios";
import { GetAllParams } from "@/types/query-params-type";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";

export type ConfiguracoesProps = {
  id?: string;
  ref?: string;
  ciclo?: string;
  id_grupo_economico?: string;
  grupo_economico?: string;
  id_filial?: string;
  filial?: string;
  cargo?: string;
  cpf?: string;
  nome?: string;
  tags?: string;

  data_inicial?: string;
  data_final?: string;

  proporcional?: string;

  controle?: string;
  pos?: string;
  upgrade?: string;
  receita?: string;
  qtde_aparelho?: string;
  aparelho?: string;
  acessorio?: string;
  pitzi?: string;
  fixo?: string;
  wttx?: string;
  live?: string;

  canEdit?: boolean;
};

export interface SegmentoProps {
  id?: string;
  categoria?: string;
  segmento?: string;
  empresa?: string;
  obs?: string;
  active?: string;
}

export const useConfiguracoes = () => {
  const queryClient = useQueryClient();

  const getEscalonamentos = () =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "configuracoes", "escalonamentos", "lista"],
      queryFn: async () =>
        await api
          .get("/comercial/comissionamento/configuracoes/escalonamentos")
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  const getSegmentos = (params: GetAllParams) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "configuracoes", "segmentos", "lista", [params]],
      queryFn: async () =>
        await api
          .get("/comercial/comissionamento/configuracoes/segmentos", { params })
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  const getCargos = (params?: { filters: any }) =>
    useQuery({
      queryKey: ["comercial", "comissionamento", "configuracoes", "cargos", "lista", [params]],
      queryFn: async () =>
        await api
          .get("/comercial/comissionamento/configuracoes/cargos", { params })
          .then((response) => response.data),
      placeholderData: keepPreviousData,
    });

  return {
    getEscalonamentos,
    getCargos,
    getSegmentos,
  };
};
