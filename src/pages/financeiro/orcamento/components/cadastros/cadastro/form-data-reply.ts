import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCadastroReply = z
  .object({
    // Dados Cadastro
  id: z.string().optional(),
  active: z.boolean().optional(),
  });

export type CadastroSchemaReplyProps = z.infer<typeof schemaCadastroReply>

export const useFormCadastroDataReply =(data:CadastroSchemaReplyProps)=>{
    const form = useForm<CadastroSchemaReplyProps>({
        resolver: zodResolver(schemaCadastroReply),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}