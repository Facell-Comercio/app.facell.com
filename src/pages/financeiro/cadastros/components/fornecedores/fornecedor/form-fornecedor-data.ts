import { normalizeCnpjNumber, normalizePhoneNumber } from "@/helpers/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FornecedorSchema } from "./ModalFornecedor";

const schemaFornecedor = z
  .object({
    // Dados Fornecedor
  id: z.string().optional(),
  ativo: z.string(),
  cnpj: z.string().refine(v=>v.trim() !=="", {message: "Número de telefone inválido"}).transform(v=>normalizeCnpjNumber(v)),
  nome: z.string(),
  razao: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  bairro: z.string(),
  municipio: z.string(),
  uf: z.string(),
  email: z.string(),
  telefone: z.string().refine(v=>v.trim() !=="", {message: "Número de telefone inválido"}).transform(v=>normalizePhoneNumber(v)),

  // Dados Bancários
  id_forma_pagamento: z.string(),
  id_tipo_chave_pix: z.string(),
  id_banco: z.string(),
  chave_pix: z.string(),
  agencia: z.string(),
  dv_agencia: z.string(),
  conta: z.string(),
  dv_conta: z.string(),
  cnpj_favorecido: z.string(),
  favorecido: z.string(),
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