import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaUser = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  id_perfil: z.string().trim().optional(),
  perfil: z.string().trim().min(1, "O nome do perfil é obrigatório").toUpperCase(),
  active: z.coerce.number(),

  updatePermissoes: z.boolean().optional(),
  permissoes: z.array(
    z.object({
      id: z.coerce.string().trim().optional(),
      id_permissao: z.coerce.string().trim().optional(),
      nome: z.coerce.string().trim().min(1, "O nome da permissão é obrigatório").toUpperCase(),
      id_modulo: z.coerce.string().trim().min(1, "O módulo é obrigatório"),
      modulo: z.coerce.string().trim().optional(),
    })
  ),
});

export type PerfilFormData = z.infer<typeof schemaUser>;

export const useFormPerfilData = (data: PerfilFormData) => {
  const form = useForm<PerfilFormData>({
    resolver: zodResolver(schemaUser),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
