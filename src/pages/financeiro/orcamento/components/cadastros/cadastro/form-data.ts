import { normalizeDataDayOne } from "@/helpers/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCadastro = z.object({
  // Dados Cadastro
  id: z.string().optional(),
  grupo_economico: z.string().optional(),
  id_grupo_economico: z.coerce.string().min(1, "Grupo econômico é obrigatório"),
  ref: z.coerce.string().transform((v) => normalizeDataDayOne(v)),
  active: z.coerce.number(),
  contas: z
    .array(
      z.object({
        id_conta: z.coerce.string().trim().optional(),
        centro_custo: z.coerce.string().trim().min(1, "Obrigatório").optional(),
        plano_contas: z.coerce.string().optional(),
        id_centro_custo: z.coerce.string().trim().min(1, "Obrigatório"),
        id_plano_contas: z.coerce.string(),
        valor: z.coerce.string().min(1, "Obrigatório"),
        valor_inicial: z.coerce.string().optional(),
        saldo: z.coerce.string().optional(),
        realizado: z.coerce.string().optional(),
        active: z.coerce.boolean(),
        active_inicial: z.coerce.boolean().optional(),
        checked: z.coerce.boolean().optional(),
      })
    )
    .min(1, "Obrigatório"),
});

export type cadastroSchemaProps = z.infer<typeof schemaCadastro>;

export const useFormCadastroData = (data: cadastroSchemaProps) => {
  const form = useForm<cadastroSchemaProps>({
    resolver: zodResolver(schemaCadastro),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
