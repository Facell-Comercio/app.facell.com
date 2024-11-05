import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaFilial = z.object({
  // Dados Filial
  id: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  uf: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  nome: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
});

export type FilialModeloFormData = z.infer<
  typeof schemaFilial
>;

const schemaModelo = z
  .object({
    // Dados Modelo
    id_modelo: z.coerce.string().optional(),
    descricao: z.coerce
      .string()
      .trim()
      .min(1, "Campo Obrigatório")
      .transform((descricao) =>
        String(descricao).toUpperCase()
      ),
    filiais: z.array(schemaFilial),
    id_cargo_politica: z.coerce.string({
      required_error: "Campo obrigatório",
    }),
  })
  .refine((modelo) => modelo.filiais.length > 0, {
    path: ["filiais"],
    message:
      "Deve existir no mínimo uma filial no modelo",
  });

export type ModeloFormData = z.infer<
  typeof schemaModelo
>;

export const useFormModeloData = (
  data: ModeloFormData
) => {
  const form = useForm<ModeloFormData>({
    resolver: zodResolver(schemaModelo),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
