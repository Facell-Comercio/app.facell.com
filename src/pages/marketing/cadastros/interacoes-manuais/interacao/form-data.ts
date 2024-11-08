import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { InteracaoManualSchema } from "./Modal";

const schemaInteracaoManual = z
  .object({
    // Dados Interação Manual
    id: z.coerce.string().optional(),
    nome_assinante: z.coerce.string().min(11, "Campo obrigatório"),
    gsm: z.coerce.string().min(11, "Campo obrigatório").max(11, "Campo inválido"),
    cpf: z.coerce.string().min(11, "GSM Inválido").max(14, "GSM Inválido  "),

    operador: z.coerce.string().min(1, "Campo obrigatório"),
    observacao: z.coerce.string().min(1, "Campo obrigatório"),
    data: z.coerce.string().refine((v) => !v.includes("undefined"), { message: "Data inválida" }),
  })
  .transform((object) => {
    console.log(object);

    return object;
  });

export const useFormInteracaoManualData = (data: InteracaoManualSchema) => {
  const form = useForm<InteracaoManualSchema>({
    resolver: zodResolver(schemaInteracaoManual),
    defaultValues: data,
  });

  return {
    form,
  };
};
