import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { BorderoSchemaProps } from "./Modal";

const schemaBorderos = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  conta_bancaria: z.string().trim().min(1, "Conta Obrigatória").toUpperCase(),
  id_conta_bancaria: z.string(),
  data_pagamento: z.string().trim(),
  titulos: z.array(z.object({
    checked: z.boolean(),
    id_titulo: z.string().trim().optional(),
    descricao: z.string().trim().optional(),
    nome_fornecedor: z.string().trim().optional(),
    n_doc: z.string().trim().optional(),
    valor_total: z.string().trim().optional(),
    filial: z.string().trim().optional(),
    vencimento: z.string().trim().optional(),
    data_pg: z.string().trim().optional(),
  }))
  
  });

export const useFormBorderoData =(data:BorderoSchemaProps)=>{
    const form = useForm<BorderoSchemaProps>({
        resolver: zodResolver(schemaBorderos),
        defaultValues: data,
        values: data
      });

      const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "titulos"
      })

    return {
        form,
        titulos: fields,
        addTitulo: append,
        removeTitulo: remove,
    }
}