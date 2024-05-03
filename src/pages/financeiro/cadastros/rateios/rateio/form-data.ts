import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { RateiosSchema } from "./Modal";

const schemaRateios = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  codigo: z.string().trim().min(1, "Coloque o código").toUpperCase(),
  active: z.coerce.boolean(),
  nome: z.string().trim().min(12, "A nome deve ter no mínimo 12 caracteres").toUpperCase(),
  id_grupo_economico: z.string().trim().toUpperCase().min(1, "Obrigatório"),
  manual: z.coerce.boolean(),
  itens: z.array(z.object({
    id: z.string().trim().optional(),
    id_filial: z.coerce.string().trim().min(1, "Obrigatório"),
    percentual: z.string().transform(v=> parseFloat(v)/100)
  }))
});

export const useFormRateioData =(data:RateiosSchema)=>{
    const form = useForm<RateiosSchema>({
        resolver: zodResolver(schemaRateios),
        defaultValues: data,
        values: data
      });
    const {fields, append, remove} = useFieldArray({
      control: form.control,
      name: "itens"
    })

    return {
        form,
        itens: fields,
        appendItem: append,
        removeItem: remove
    }
}