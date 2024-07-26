import { checkCPF } from "@/helpers/validator";
import { AbatimentosProps, ValeProps } from "@/hooks/comercial/useVales";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaVale = z
  .object({
    // Dados Vale
    id: z.string().optional(),
    cpf_colaborador: z.coerce
      .string()
      .trim()
      .min(11, "CPF inválido")
      .max(11, "CPF inválido"),
    nome_colaborador: z
      .string()
      .trim()
      .min(3, "Campo Obrigatório")
      .transform((n) => String(n).toUpperCase()),
    id_filial: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    filial: z.string().trim().min(1, "Campo Obrigatório"),
    data_inicio_cobranca: z.coerce.string().min(1, "Campo Obrigatório"),
    origem: z.string().trim().min(1, "Campo Obrigatório"),
    parcelas: z.coerce.string().min(1, "Campo Obrigatório"),
    parcela: z.coerce.string().min(1, "Campo Obrigatório"),
    valor_parcela: z.coerce.string().min(1, "Campo Obrigatório"),
    saldo: z.coerce.string().min(1, "Campo Obrigatório"),
    obs: z.string().trim().min(5, "Campo Obrigatório"),
  })
  .refine((data) => checkCPF(data.cpf_colaborador), {
    path: ["cpf_colaborador"],
    message: "CPF Inválido",
  })
  // .refine(
  //   (data) =>
  //     data.parcelas === data.parcela && data.saldo !== data.valor_parcela
  //       ? false
  //       : true,

  //   { path: ["valor_parcela"], message: "Valor da parcela incompleto" }
  // )
  // .refine((data) => (data.valor_parcela > data.saldo ? false : true), {
  //   path: ["valor_parcela"],
  //   message: "Valor acima do permitido",
  // })

  .refine((data) => (data.parcela > data.parcelas ? false : true), {
    path: ["parcela"],
    message: "Valor acima do permitido",
  });
export const useFormValeData = (data: ValeProps) => {
  const form = useForm<ValeProps>({
    resolver: zodResolver(schemaVale),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};

const schemaAbatimento = z
  .object({
    // Dados Abatimento
    saldo: z.coerce.string().optional(),
    id_vale: z.coerce.string({ required_error: "Campo obrigatório" }),
    valor: z.coerce.number().min(1, "Campo obrigatório"),
    obs: z.coerce.string().min(5, "Campo Obrigatório"),
  })
  .refine(
    (data) => (data.valor > parseFloat(data.saldo || "0") ? false : true),
    {
      path: ["valor"],
      message: "Valor acima do permitido",
    }
  );

export const useFormAbatimentoData = (data: AbatimentosProps) => {
  const form = useForm<AbatimentosProps>({
    resolver: zodResolver(schemaAbatimento),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
