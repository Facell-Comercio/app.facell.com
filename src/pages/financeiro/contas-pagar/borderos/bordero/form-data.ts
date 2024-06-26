import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { BorderoSchemaProps } from "./Modal";

const schemaBorderos = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  conta_bancaria: z.string().trim().toUpperCase().optional(),
  id_conta_bancaria: z.coerce.string(),
  banco: z.string().optional(),
  data_pagamento: z.coerce.date({ message: "Data Obrigatória" }),
  id_matriz: z.coerce.string().trim().optional(),
  vencimentos: z.array(
    z
      .object({
        checked: z.coerce.boolean().optional(),
        id_titulo: z.coerce.string().trim().optional(),
        id_vencimento: z.coerce.string().trim().optional(),
        id_status: z.number(),
        status: z.string().optional(),
        forma_pagamento: z.string().optional(),
        tipo_baixa: z.string().optional(),
        data_prevista_parcial: z.date().optional(),
        id_dda: z.coerce.string().optional(),
        previsao: z.string().trim().optional(),
        nome_fornecedor: z.string().trim().optional(),
        valor_total: z.string().trim().optional(),
        valor_pago: z.coerce.number().optional(),
        num_doc: z.string().optional(),
        descricao: z.string().trim().optional(),
        filial: z.string().trim().optional(),

        can_remove: z.coerce.boolean().optional(),
        updated: z.coerce.boolean().optional(),
        remessa: z.coerce.number().optional(),
      })
      .refine(
        (data) =>
          data.tipo_baixa === "PARCIAL" && data.can_remove
            ? !!data.data_prevista_parcial
            : true,
        {
          path: ["data_prevista_parcial"],
          message: "Data prevista parcial é obrigatória",
        }
      )
      .refine(
        (data) =>
          data.valor_pago && data.valor_pago > 0 ? !!data.tipo_baixa : true,
        { path: ["tipo_baixa"], message: "Tipo baixa é obrigatório" }
      )
  ),
});

export const useFormBorderoData = (data: BorderoSchemaProps) => {
  const form = useForm<BorderoSchemaProps>({
    resolver: zodResolver(schemaBorderos),
    defaultValues: data,
    values: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vencimentos",
  });

  return {
    form,
    vencimentos: fields,
    addVencimento: append,
    removeVencimento: remove,
  };
};
