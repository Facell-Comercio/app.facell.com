import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaEscalonamento = z.object({
  // Dados Escalonamento
  id: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  percentual: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  valor: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
});

export type EscalonamentoModeloItemFormData =
  z.infer<typeof schemaEscalonamento>;

const schemaModeloItem = z
  .object({
    // Dados ModeloItem
    id: z.coerce.string().optional(),
    id_segmento: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),
    segmento: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),
    id_cargo_politica: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),
    id_modelo: z.string().optional(),
    tipo: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),

    tipo_premiacao: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),
    escalonamento: z.coerce
      .string()
      .min(1, "Campo Obrigatório"),
    itens_escalonamento: z.array(
      schemaEscalonamento
    ),
  })
  .refine(
    (item) =>
      item.itens_escalonamento.reduce(
        (acc, escalonamento) =>
          acc + parseFloat(escalonamento.valor),
        0
      ) > 0,
    {
      path: ["itens_escalonamento"],
      message:
        "É necessario definir no mínimo 1 item do escalonamento",
    }
  );
export type ModeloItemFormData = z.infer<
  typeof schemaModeloItem
>;

export const useFormModeloItemData = (
  data: ModeloItemFormData
) => {
  const form = useForm<ModeloItemFormData>({
    resolver: zodResolver(schemaModeloItem),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
