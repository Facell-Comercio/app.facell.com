import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "@/types/user-type";

const schemaUser = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  active: z.coerce.boolean(),
  email: z.string().toLowerCase().trim().email(),
  nome: z.string().trim().min(12, "A nome deve ter no mínimo 12 caracteres").toUpperCase(),
  img_url: z.string().optional(),

  updateFiliais: z.boolean(),
  filiais: z.array(z.object({
    id: z.string().trim().optional(),
    id_filial: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.string().trim().min(1, "Obrigatório"),
    nome: z.string().optional(),
    gestor: z.coerce.boolean()
  })),

  updateDepartamentos: z.boolean(),
  departamentos: z.array(z.object({
    id: z.string().trim().optional(),
    id_departamento: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.string().trim().min(1, "Obrigatório"),
    nome: z.string().optional(),
    gestor: z.coerce.boolean()
  })),
  
  updateCentrosCusto: z.boolean(),
  centros_custo: z.array(z.object({
    id: z.string().trim().optional(),
    id_centro_custo: z.coerce.string().trim().min(1, "Obrigatório"),
    id_user: z.string().trim().min(1, "Obrigatório"),
    nome: z.string().optional(),
    gestor: z.coerce.boolean()
  })),

  updatePermissoes: z.boolean(),
  permissoes: z.array(z.object({
    id: z.string().trim().optional(),
    id_permissao: z.coerce.string().trim().min(1, "Obrigatório"),
    nome: z.string().optional(),
    id_user: z.string().trim().min(1, "Obrigatório"),
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