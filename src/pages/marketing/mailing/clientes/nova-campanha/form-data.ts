import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaNovaCampanha = z.object({
  nome: z.coerce
    .string({ required_error: "Campo obrigatório" })
    .min(5, "Campo obrigatório")
    .max(50, "O máximo de caracteres é 50"),
  quantidade_total_clientes: z.coerce.string({ required_error: "Campo obrigatório" }),
});

export type NovaCampanhaSchema = z.infer<typeof schemaNovaCampanha>;

export const useFormNovaCampanhaData = (data: NovaCampanhaSchema) => {
  const form = useForm<NovaCampanhaSchema>({
    resolver: zodResolver(schemaNovaCampanha),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
