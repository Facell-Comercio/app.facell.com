import { AgregadoresProps } from "@/hooks/comercial/useAgregadores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const schemaAgregador = z.object({
  // Dados Agregador
  id: z.string().optional(),
  ref: z.coerce.date({
    required_error: "Campo obrigatório",
  }),
  ciclo: z.coerce.date({
    required_error: "Campo obrigatório",
  }),
  id_grupo_economico: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  grupo_economico: z.string().trim().min(1, "Campo Obrigatório"),
  id_filial: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  filial: z.string().trim().min(1, "Campo Obrigatório"),
  cargo: z
    .string()
    .trim()
    .min(3, "Campo Obrigatório")
    .transform((n) => String(n).toUpperCase()),
  cpf: z
    .string()
    .trim()
    .min(3, "Campo Obrigatório")
    .transform((n) => String(n).toUpperCase()),
  nome: z
    .string()
    .trim()
    .min(3, "Campo Obrigatório")
    .transform((n) => String(n).toUpperCase()),
  tags: z.string().optional(),

  data_inicial: z.coerce.date({
    required_error: "Campo obrigatório",
  }),
  data_final: z.coerce.date({
    required_error: "Campo obrigatório",
  }),

  proporcional: z.coerce.string().transform((value) => String(parseFloat(value) / 100)),
  tipo_agregacao: z
    .string()
    .trim()
    .min(3, "Campo Obrigatório")
    .transform((n) => String(n).toUpperCase()),
  metas_agregadas: z
    .string().optional(),
  metas: z.array(
    z.object({
      id: z.coerce.string().optional(),
      id_grupo_economico: z.coerce.string().optional(),
      grupo_economico: z.coerce.string().optional(),
      id_filial: z.coerce.string().optional(),
      filial: z.coerce.string().optional(),
      cargo: z.coerce.string().optional(),
      cpf: z.coerce.string().optional(),
      nome: z.coerce.string().optional(),
      tags: z.coerce.string().optional(),

      proporcional: z.coerce.string().optional(),

      controle: z.coerce.string().optional(),
      pos: z.coerce.string().optional(),
      upgrade: z.coerce.string().optional(),
      receita: z.coerce.string().optional(),
      qtde_aparelho: z.coerce.string().optional(),
      aparelho: z.coerce.string().optional(),
      acessorio: z.coerce.string().optional(),
      pitzi: z.coerce.string().optional(),
      fixo: z.coerce.string().optional(),
      wttx: z.coerce.string().optional(),
      live: z.coerce.string().optional(),
    })
  ),
});
// .refine(
//   (data) =>
//     data.parcelas === data.parcela && data.saldo !== data.valor_parcela
//       ? false
//       : true,

//   { path: ["valor_parcela"], message: "Valor da parcela incompleto" }
// )
export const useFormAgregadorData = (data: AgregadoresProps) => {
  const form = useForm<AgregadoresProps>({
    resolver: zodResolver(schemaAgregador),
    defaultValues: data,
    values: data,
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "metas",
  });

  return {
    form,
    metas: fields,
    appendMeta: append,
    removeMeta: remove,
  };
};
