import { normalizeNumberOnly } from "@/helpers/mask";
import { checkCPF } from "@/helpers/validator";
import { ColaboradorSchema } from "@/hooks/pessoal/useColaboradores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaColaborador = z.object({
  // Dados Colaborador
  active: z.coerce.number(),
  id: z.string().optional(),
  nome: z.string().refine((v) => v.trim() !== "", { message: "Nome inválido" }),
  cpf: z
    .string()
    .refine((v) => checkCPF(v), {
      message: "CPF Inválido",
    })
    .transform((cpf) => normalizeNumberOnly(cpf)),
});

export const useFormColaboradorData = (data: ColaboradorSchema) => {
  const form = useForm<ColaboradorSchema>({
    resolver: zodResolver(schemaColaborador),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
