import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaUser = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  active: z.coerce.boolean(),

  nome: z.string().trim().min(1, "A nome deve ter no mínimo 10 caracteres").toUpperCase(),
  cnpj: z.string().trim().min(14, "CNPJ precisa conter 14 caracteres numéricos!"),
  cnpj_datasys: z.string().optional(),
  cod_datasys: z.string().optional(),
  id_matriz: z.string(),
  id_grupo_economico: z.string(),
  apelido: z.string(),
  nome_fantasia: z.string().optional(),
  razao: z.string().optional(),

  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  cep: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().optional(),
  uf: z.string().optional(),
  municipio: z.string().optional()
});

export type FilialFormData = z.infer<typeof schemaUser>

export const useFormFilialData =(data: FilialFormData)=>{
    const form = useForm<FilialFormData>({
        resolver: zodResolver(schemaUser),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}