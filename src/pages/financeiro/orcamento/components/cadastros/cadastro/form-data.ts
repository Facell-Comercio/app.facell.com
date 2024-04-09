import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CadastroSchema } from "./Modal";

const schemaCadastro = z
  .object({
    // Dados Cadastro
  id: z.string().optional(),
  active: z.boolean().optional(),
  });

export const useFormCadastroData =(data:CadastroSchema)=>{
    const form = useForm<CadastroSchema>({
        resolver: zodResolver(schemaCadastro),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}