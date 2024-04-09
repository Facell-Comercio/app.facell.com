import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaUser = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  active: z.coerce.boolean(),
  nome: z.string().trim().min(1, "O nome deve ter no mínimo 1 caracter").toUpperCase(),
});

export type DepartamentoFormData = z.infer<typeof schemaUser>

export const useFormDepartamentoData =(data: DepartamentoFormData)=>{
    const form = useForm<DepartamentoFormData>({
        resolver: zodResolver(schemaUser),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}