import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaUser = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  id_matriz: z.string(),
  active: z.coerce.boolean(),
  orcamento: z.coerce.boolean(),
  nome: z
    .string()
    .trim()
    .min(1, "O nome deve ter no mínimo 1 caracter")
    .toUpperCase(),
  apelido: z
    .string()
    .trim()
    .min(1, "O apelido deve ter no mínimo 1 caracter")
    .toUpperCase(),
});

export type GrupoEconomicoFormData = z.infer<typeof schemaUser>;

export const useFormGrupoEconomico = (data: GrupoEconomicoFormData) => {
  const form = useForm<GrupoEconomicoFormData>({
    resolver: zodResolver(schemaUser),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
