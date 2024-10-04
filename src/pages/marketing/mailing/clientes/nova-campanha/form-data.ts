import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaNovaCampanha = z.object({
  nome: z.coerce.string(),
  quantidade_lotes: z.coerce.string(),
  quantidade_clientes: z.coerce.string(),
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
