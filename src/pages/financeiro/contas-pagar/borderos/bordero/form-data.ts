import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { BorderoSchemaProps } from "./Modal";

const schemaBorderos = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  conta_bancaria: z.string().trim().toUpperCase().optional(),
  id_conta_bancaria: z.coerce.string(),
  banco: z.string().optional(),
  data_pagamento: z.coerce.date({message: "Data Obrigatória"}),
  id_matriz: z.coerce.string().trim().optional(),
  titulos: z.array(z.object({
    checked: z.coerce.boolean().optional(),
    id_titulo: z.coerce.string().trim().optional(),
    id_status: z.number(),
    status: z.string().optional(),
    previsao: z.string().trim().optional(),
    nome_fornecedor: z.string().trim().optional(),
    valor_total: z.string().trim().optional(),
    num_doc: z.string().optional(),
    descricao: z.string().trim().optional(),
    filial: z.string().trim().optional(),
    data_pagamento: z.coerce.date({message: "Data Obrigatória"}),
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