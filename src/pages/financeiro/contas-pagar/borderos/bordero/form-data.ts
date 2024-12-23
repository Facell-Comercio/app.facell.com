import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BorderoSchemaProps } from "./Modal";

const ItemBorderoSchema = z
  .object({
    checked: z.coerce.boolean().optional(),
    id_titulo: z.coerce.string().trim().optional(),
    id_item: z.coerce.string().trim().optional(),
    id_vencimento: z.coerce.string().trim().optional(),
    id_status: z.number().nullable(),
    status: z.string().optional(),
    id_forma_pagamento: z.number().optional(),
    forma_pagamento: z.string().optional(),
    tipo_baixa: z.coerce
      .string()
      .optional()
      .transform((v) => (v == "null" ? "" : v)),
    data_prevista_parcial: z.date().optional(),
    id_dda: z.coerce.string().optional(),
    previsao: z.string().trim().optional(),
    nome_fornecedor: z.string().trim().optional(),
    valor_total: z.string().trim().optional(),
    valor_pago: z.coerce.number().optional(),
    num_doc: z.string().optional(),
    descricao: z.string().trim().optional(),
    filial: z.string().trim().optional(),
    tipo: z.string().optional(),

    can_remove: z.coerce.boolean().optional(),
    can_modify: z.coerce.boolean().optional(),
    updated: z.coerce.boolean().optional(),
    remessa: z.coerce.number().optional(),
  })
  .refine(
    (data) =>
      data.tipo_baixa === "PARCIAL" && data.can_remove ? !!data.data_prevista_parcial : true,
    {
      path: ["data_prevista_parcial"],
      message: "Data prevista parcial é obrigatória",
    }
  );

const schemaBorderos = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  conta_bancaria: z.string().trim().toUpperCase().optional(),
  id_conta_bancaria: z.coerce.string(),
  banco: z.string().optional(),
  codigo_banco: z.string().optional(),
  data_pagamento: z.coerce.date({ message: "Data Obrigatória" }),
  id_matriz: z.coerce.string().trim().optional(),
  itens: z.array(ItemBorderoSchema),
});

export type ItemBordero = z.infer<typeof ItemBorderoSchema>;

export const useFormBorderoData = (data: BorderoSchemaProps) => {
  const form = useForm<BorderoSchemaProps>({
    resolver: zodResolver(schemaBorderos),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
