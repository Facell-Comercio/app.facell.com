import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ConciliacaoCPSchemaProps } from "./Modal";

const schemaConciliacaoCP = z.object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  titulos: z.array(
    z.object({
      checked: z.coerce.boolean().optional(),
      id_titulo: z.coerce.string().trim().optional(),
      descricao: z.string().trim().optional(),
      nome_fornecedor: z.string().trim().optional(),
      num_doc: z.string().optional(),
      valor: z.string().trim().optional(),
      filial: z.string().trim().optional(),
    })
  ),
});

export const useFormConciliacaoCPData = (data: ConciliacaoCPSchemaProps) => {
  const form = useForm<ConciliacaoCPSchemaProps>({
    resolver: zodResolver(schemaConciliacaoCP),
    defaultValues: data,
    values: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "titulos",
  });

  return {
    form,
    titulos: fields,
    addTitulo: append,
    removeTitulo: remove,
  };
};
