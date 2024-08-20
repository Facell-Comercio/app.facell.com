import {
  ConferenciasCaixaSchema,
  DepositosCaixaProps,
  OcorrenciasProps,
} from "@/hooks/financeiro/useConferenciasCaixa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCaixa = z.object({
  // Dados Caixa
  id: z.string().optional(),
  id_matriz: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  descricao: z.string().trim().min(1, "Campo Obrigatório"),
  nome_portador: z.string().trim().min(1, "Campo Obrigatório"),
  dia_vencimento: z.string().trim().min(1, "Campo Obrigatório"),
  dia_corte: z.string().trim().min(1, "Campo Obrigatório"),
  id_fornecedor: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  nome_fornecedor: z.string().trim().min(3, "Campo Obrigatório"),
  active: z.coerce.number(),
});

export const useFormCaixaData = (data: ConferenciasCaixaSchema) => {
  const form = useForm<ConferenciasCaixaSchema>({
    resolver: zodResolver(schemaCaixa),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};

const schemaDeposito = z.object({
  // Dados Deposito
  id: z.string().optional(),
  id_conta_bancaria: z.coerce.string().trim().min(1, "Campo obrigatório"),
  id_caixa: z.coerce.string().trim().min(1, "Campo obrigatório"),
  conta_bancaria: z.string().trim().min(1, "Campo obrigatório"),
  data_deposito: z.coerce.string().trim().min(1, "Campo obrigatório"),
  valor: z.string().trim().min(1, "Campo obrigatório"),
  comprovante: z.string().trim().min(1, "Campo obrigatório"),
});

export const useFormDepositoData = (data: DepositosCaixaProps) => {
  const form = useForm<DepositosCaixaProps>({
    resolver: zodResolver(schemaDeposito),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};

const schemaOcorrencia = z.object({
  // Dados Ocorrencia
  id: z.string().optional(),
  id_user_criador: z.coerce.string().optional(),
  id_user_resolvedor: z.coerce.string().optional(),
  id_filial: z.coerce.string().optional(),
  data_ocorrencia: z.coerce.string().trim().min(1, "Campo obrigatório"),
  data_caixa: z.coerce.string().trim().min(1, "Campo obrigatório"),
  descricao: z.string().trim().min(5, "Campo obrigatório"),
  user_criador: z.string().trim().min(1, "Campo obrigatório"),
  resolvida: z.coerce.string().optional(),
});

export const useFormOcorrenciaData = (data: OcorrenciasProps) => {
  const form = useForm<OcorrenciasProps>({
    resolver: zodResolver(schemaOcorrencia),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
