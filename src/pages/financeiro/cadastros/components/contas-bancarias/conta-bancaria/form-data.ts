import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContaBancariaSchema } from "./Modal";

const schemaContaBancaria = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  active: z.coerce.boolean(),
  id_filial: z.string().trim().min(1, "Selecione a filial"),
  id_tipo_conta: z.string().trim().min(1, "Selecione o tipo"),
  id_banco: z.string().trim().min(1, "Selecione o banco"),
  agencia: z.string().trim().min(1, "Coloque a agencia"),
  dv_agencia: z.string().trim().optional(),
  conta: z.string().trim().min(1, "Coloque a conta"),
  descricao: z.string().trim().min(1, "Coloque uma descrição"),
  dv_conta: z.string().trim().min(1, "Coloque dv conta"),
  });

export const useFormContaBancariaData =(data:ContaBancariaSchema)=>{
    const form = useForm<ContaBancariaSchema>({
        resolver: zodResolver(schemaContaBancaria),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}