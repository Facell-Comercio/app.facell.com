import { PoliticasProps } from "@/hooks/comercial/usePoliticas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaPolitica = z.object({
  // Dados Politica
  id: z.string().optional(),
  ref: z.coerce.date({
    required_error: "Campo obrigatório",
  }),
  ciclo: z.coerce.date({
    required_error: "Campo obrigatório",
  }),
  id_grupo_economico: z.coerce
    .string()
    .trim()
    .min(1, "Campo Obrigatório"),
  grupo_economico: z
    .string()
    .trim()
    .min(1, "Campo Obrigatório"),
  id_filial: z.coerce
    .string()
    .trim()
    .min(1, "Campo Obrigatório"),
  filial: z
    .string()
    .trim()
    .min(1, "Campo Obrigatório"),
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

  proporcional: z.coerce
    .string()
    .transform((value) =>
      String(parseFloat(value) / 100)
    ),

  controle: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  pos: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  upgrade: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  receita: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  aparelho: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  qtde_aparelho: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  acessorio: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  pitzi: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  fixo: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  wttx: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
  live: z.coerce.string({
    required_error: "Campo obrigatório",
  }),
});
// .refine(
//   (data) =>
//     data.parcelas === data.parcela && data.saldo !== data.valor_parcela
//       ? false
//       : true,

//   { path: ["valor_parcela"], message: "Valor da parcela incompleto" }
// )
export const useFormPoliticaData = (
  data: PoliticasProps
) => {
  const form = useForm<PoliticasProps>({
    resolver: zodResolver(schemaPolitica),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
