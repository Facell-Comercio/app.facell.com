import { normalizeNumberOnly } from "@/helpers/mask";
import { checkEmail } from "@/helpers/validator";
import {
  checkIsPIX,
  checkIsTransferenciaBancaria,
} from "@/pages/financeiro/contas-pagar/titulos/titulo/helpers/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FornecedorSchema } from "./Modal";

const schemaFornecedor = z
  .object({
    // Dados Fornecedor
    id: z.string().optional(),
    active: z.coerce.boolean(),
    cnpj: z
      .string()
      .refine((v) => v.trim() !== "", { message: "CPF/CNPJ inválido" })
      .transform((v) => normalizeNumberOnly(v)),
    nome: z
      .string()
      .refine((v) => v.trim() !== "", { message: "Nome inválido" }),
    telefone: z
      .string()
      .transform((v) => normalizeNumberOnly(v))
      .optional(),
    razao: z.string().optional(),
    cep: z
      .string()
      .transform((v) => normalizeNumberOnly(v))
      .optional(),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    email: z.string().optional(),

    // Dados Bancários
    id_forma_pagamento: z.string(),
    id_tipo_chave_pix: z.string().optional(),
    id_banco: z.string().optional(),
    id_tipo_conta: z.string().optional(),
    chave_pix: z.string().optional(),
    agencia: z.string().optional(),
    dv_agencia: z.string().optional(),
    conta: z.string().optional(),
    dv_conta: z.string().optional(),
    cnpj_favorecido: z
      .string()
      .transform((v) => normalizeNumberOnly(v))
      .optional(),
    favorecido: z.string().optional(),
  })
  //^ Cobra Agência e Conta
  .refine(
    (data) =>
      checkIsTransferenciaBancaria(data.id_forma_pagamento)
        ? !!data.agencia
        : true,
    { path: ["agencia"], message: "Obrigatório para esta forma de pagamento." }
  )
  .refine(
    (data) =>
      checkIsTransferenciaBancaria(data.id_forma_pagamento)
        ? !!data.conta
        : true,
    { path: ["conta"], message: "Obrigatório para esta forma de pagamento." }
  )

  // Cobrança PIX
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) ? !!data.id_tipo_chave_pix : true,
    {
      path: ["id_tipo_chave_pix"],
      message: "Obrigatório para esta forma de pagamento.",
    }
  )

  .refine(
    (data) => (checkIsPIX(data.id_forma_pagamento) ? !!data.chave_pix : true),
    {
      path: ["chave_pix"],
      message: "Obrigatório para esta forma de pagamento.",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "1"
        ? String(data.chave_pix).length === 36 &&
          data.chave_pix?.split("-").length === 5
        : true,
    {
      path: ["chave_pix"],
      message: "Formato de chave inválido",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "2"
        ? checkEmail(String(data.chave_pix))
        : true,
    {
      path: ["chave_pix"],
      message: "Formatação de email incorreta",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "2"
        ? String(data.chave_pix).length < 77
        : true,
    {
      path: ["chave_pix"],
      message: "Tamanho da chave acima do permitido (77 caracteres)",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "3"
        ? String(normalizeNumberOnly(data.chave_pix)).length === 11
        : true,
    {
      path: ["chave_pix"],
      message: "Formato de chave inválido - (00) 98888-8888",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "4"
        ? String(normalizeNumberOnly(data.chave_pix)).length === 11
        : true,
    {
      path: ["chave_pix"],
      message: "Formato de chave inválido - 111.222.333-44",
    }
  )
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) &&
      String(data.id_tipo_chave_pix) === "5"
        ? String(normalizeNumberOnly(data.chave_pix)).length === 14
        : true,
    {
      path: ["chave_pix"],
      message: "Formato de chave inválido - 11.222.333/0001-44",
    }
  )
  .transform((data) => {
    if (
      checkIsPIX(data.id_forma_pagamento) &&
      parseInt(data.id_tipo_chave_pix || "0") >= 3
    ) {
      return { ...data, chave_pix: normalizeNumberOnly(data.chave_pix) };
    }
    return data;
  });

export const useFormFornecedorData = (data: FornecedorSchema) => {
  const form = useForm<FornecedorSchema>({
    resolver: zodResolver(schemaFornecedor),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
