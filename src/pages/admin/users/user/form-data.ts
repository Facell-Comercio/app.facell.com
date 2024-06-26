import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaUser = z
  .object({
  id: z.coerce.number().optional(),
  active: z.coerce.boolean(),
  email: z.string().toLowerCase().trim().email(),
  nome: z.string().trim().min(12, "A nome deve ter no mínimo 12 caracteres").toUpperCase(),
  img_url: z.string().optional(),

  updateFiliais: z.boolean(),
  filiais: z.array(z.object({
    id: z.string().trim(),
    id_filial: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.coerce.number().optional(),
    nome: z.string().optional(),
    grupo_economico: z.string().optional(),
    gestor: z.coerce.boolean(),
  })),

  updateDepartamentos: z.boolean(),
  departamentos: z.array(z.object({
    id: z.string().trim().optional(),
    id_departamento: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.coerce.number().optional(),
    nome: z.string().optional(),
    gestor: z.coerce.boolean()
  })),
  
  updateCentrosCusto: z.boolean(),
  centros_custo: z.array(z.object({
    id: z.string().trim().optional(),
    id_centro_custo: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.coerce.number().optional(),
    nome: z.string().optional(),
    grupo_economico: z.string().optional(),
    gestor: z.coerce.boolean()
  })),

  updatePermissoes: z.boolean(),
  permissoes: z.array(z.object({
    id: z.string().trim().optional(),
    id_permissao: z.coerce.string().trim().min(1, "Obrigatório"),
    nome: z.string().optional(),
    id_user: z.coerce.number().optional(),
  })),
});

export type UserFormData = z.infer<typeof schemaUser>

export const useFormUserData =(data: UserFormData)=>{
    data.updateFiliais = false;
    data.updateDepartamentos = false;
    data.updateCentrosCusto = false;
    data.updatePermissoes = false;

    const form = useForm<UserFormData>({
        resolver: zodResolver(schemaUser),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}