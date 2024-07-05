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
      .refine(
        (v) =>
          v.trim() !== "" &&
          (normalizeNumberOnly(v).length === 11 ||
            normalizeNumberOnly(v).length === 14),
        { message: "CPF/CNPJ inválido" }
      )
      .transform((v) => normalizeNumberOnly(v)),
    nome: z
      .string()
      .refine((v) => v.trim() !== "", { message: "Nome inválido" }),
    telefone: z.string().min(10, "Campo Obrigatório"),
    razao: z.string().optional(),
    cep: z
      .string()
      .min(9, "Campo Obrigatório")
      .transform((v) => normalizeNumberOnly(v)),
    logradouro: z.string().optional(),
    numero: z.string().optional(),
    complemento: z.string().optional(),
    bairro: z.string().optional(),
    municipio: z.string().optional(),
    uf: z.string().optional(),
    email: z.string().optional(),

    // Dados Bancários
    id_forma_pagamento: z.string().min(1, "Campo Obrigatório"),
    id_tipo_chave_pix: z.string().optional(),
    id_banco: z.coerce.number().optional(),
    banco: z.string().optional(),
    codigo_banco: z.coerce.number().optional(),
    id_tipo_conta: z.string().optional(),
    chave_pix: z.string().optional(),
    agencia: z.string().optional(),
    dv_agencia: z.string().optional(),
    conta: z.string().optional(),
    dv_conta: z.string().optional(),
    cnpj_favorecido: z
      .string()
      .refine(
        (v) =>
          v.trim() !== "" &&
          (normalizeNumberOnly(v).length === 11 ||
            normalizeNumberOnly(v).length === 14),
        { message: "CPF/CNPJ inválido" }
      )
      .transform((v) => normalizeNumberOnly(v)),
    favorecido: z.string().min(3, "Campo Obrigatório"),
  })
  //^ Cobra Banco Agência e Conta
  .refine(
    (data) =>
      checkIsTransferenciaBancaria(data.id_forma_pagamento) && data.id_forma_pagamento != '4'
        ? !!data.banco
        : true,
    { path: ["banco"], message: "Obrigatório." }
  )
  .refine(
    (data) =>
      checkIsTransferenciaBancaria(data.id_forma_pagamento) && data.id_forma_pagamento != '4'
        ? !!data.agencia
        : true,
    { path: ["agencia"], message: "Obrigatório." }
  )
  .refine(
    (data) =>
      checkIsTransferenciaBancaria(data.id_forma_pagamento) && data.id_forma_pagamento != '4'
        ? !!data.conta
        : true,
    { path: ["conta"], message: "Obrigatório." }
  )
  // ^ Validação dados obrigatórios CNPJ
  .refine((data)=> data.cnpj.length > 11 && !data.razao ? false : true
  , {path: ['razao'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.email ? false : true
  , {path: ['email'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.numero ? false : true
  , {path: ['numero'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.logradouro ? false : true
  , {path: ['logradouro'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.bairro ? false : true
  , {path: ['bairro'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.uf ? false : true
  , {path: ['uf'], message: 'Obrigatório'})
  .refine((data)=> data.cnpj.length > 11 && !data.municipio ? false : true
  , {path: ['municipio'], message: 'Obrigatório'})

  //^ Validação PIX
  .refine(
    (data) =>
      checkIsPIX(data.id_forma_pagamento) ? !!data.id_tipo_chave_pix : true,
    {
      path: ["id_tipo_chave_pix"],
      message: "Obrigatório.",
    }
  )
  .refine(
    (data) => (checkIsPIX(data.id_forma_pagamento) ? !!data.chave_pix : true),
    {
      path: ["chave_pix"],
      message: "Obrigatório.",
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
  })

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
