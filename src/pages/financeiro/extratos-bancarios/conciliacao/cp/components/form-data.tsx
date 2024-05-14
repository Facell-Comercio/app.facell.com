import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ConciliacaoCPSchemaProps } from "./ModalConciliar";

const schemaConciliacaoCP = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  titulos: z.array(
    z.object({
      id_titulo: z.coerce.string().trim().optional(),
      valor: z.string().trim().optional(),
      tipo_baixa: z.string().trim().optional(),
      valor_pago: z.string().optional(),
    })
  ),
  transacoes: z.array(
    z.object({
      id_transacao: z.coerce.string().trim().optional(),
      descricao: z.string().trim().optional(),
      valor: z.string().trim().optional(),
    })
  ),
});

export const useFormConciliacaoCPData = (data: ConciliacaoCPSchemaProps) => {
  const form = useForm<ConciliacaoCPSchemaProps>({
    resolver: zodResolver(schemaConciliacaoCP),
    defaultValues: data,
    values: data,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "titulos",
  });

  return {
    form,
    titulos: fields,
  };
};
