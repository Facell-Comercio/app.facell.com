import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ConciliacaoCRSchemaProps } from "./ModalConciliar";

const schemaConciliacaoCR = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  recebimentos: z.array(
    z.object({
      id_recebimento: z.coerce.string().trim().optional(),
      id_vencimento: z.coerce.string().trim().optional(),
      id_titulo: z.coerce.string().trim().optional(),
      valor: z.coerce.string().trim().optional(),
      data: z.coerce.date().optional(),
    })
  ),
  transacoes: z.array(
    z.object({
      id_transacao: z.coerce.string().trim().optional(),
      id: z.coerce.string().trim().optional(),
      descricao: z.string().trim().optional(),
      valor: z.string().trim().optional(),
    })
  ),
});
export const useFormConciliacaoCRData = (data: ConciliacaoCRSchemaProps) => {
  const form = useForm<ConciliacaoCRSchemaProps>({
    resolver: zodResolver(schemaConciliacaoCR),
    defaultValues: data,
    values: data,
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "recebimentos",
  });

  return {
    form,
    recebimentos: fields,
  };
};
