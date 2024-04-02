import { normalizeCepNumber, normalizeCnpjNumber, normalizePhoneNumber } from "@/helpers/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FornecedorSchema } from "./ModalFornecedor";

const schemaFornecedor = z
  .object({
    // Dados Fornecedor
  id: z.string().optional(),
  active: z.boolean(),
  cnpj: z.string().refine(v=>v.trim() !=="", {message: "CPF/CNPJ inválido"}).transform(v=>normalizeCnpjNumber(v)),
  nome: z.string().refine(v=>v.trim() !=="", {message: "Nome inválido"}),
  telefone: z.string().transform(v=>normalizePhoneNumber(v)).optional(),
  razao: z.string().optional(),
  cep: z.string().transform(v=>normalizeCepNumber(v)).optional(),
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
  chave_pix: z.string().optional(),
  agencia: z.string().optional(),
  dv_agencia: z.string().optional(),
  conta: z.string().optional(),
  dv_conta: z.string().optional(),
  cnpj_favorecido: z.string().optional(),
  favorecido: z.string().optional(),
  });

export const useFormFornecedorData =(data:FornecedorSchema)=>{
    const form = useForm<FornecedorSchema>({
        resolver: zodResolver(schemaFornecedor),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}