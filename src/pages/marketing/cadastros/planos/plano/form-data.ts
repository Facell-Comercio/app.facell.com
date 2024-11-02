import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlanoSchema } from "./Modal";

const schemaPlano = z.object({
  // Dados Plano
  id: z.string().optional(),
  plano: z
    .string()
    .refine((v) => v.trim() !== "", { message: "Nome inválido" })
    .transform((nome) => nome.toUpperCase()),
  produto_nao_fidelizado: z.string().refine((v) => v.trim() !== "", { message: "Plano inválido" }),
  produto_fidelizado: z.string().refine((v) => v.trim() !== "", { message: "Plano inválido" }),
});

export const useFormPlanoData = (data: PlanoSchema) => {
  const form = useForm<PlanoSchema>({
    resolver: zodResolver(schemaPlano),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
