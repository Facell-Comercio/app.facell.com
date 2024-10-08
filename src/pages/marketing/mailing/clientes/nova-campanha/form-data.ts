import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaNovaCampanha = z
  .object({
    nome: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(5, "Campo obrigatório")
      .max(50, "O máximo de caracteres é 50"),
    quantidade_lotes: z.coerce.string({ required_error: "Campo obrigatório" }),
    quantidade_total_clientes: z.coerce.string({ required_error: "Campo obrigatório" }),
    lotes: z
      .array(
        z.object({
          nome: z.coerce.string({ required_error: "Campo obrigatório" }),
          quantidade_itens: z.coerce.string().trim().min(1, "Obrigatório"),
        })
      )
      .refine(
        (lotes) => {
          const nomes = lotes.map((lote) => lote.nome);
          const nomesUnicos = new Set(nomes);
          return nomes.length === nomesUnicos.size;
        },
        {
          message: "Os nomes dos lotes precisam ser únicos.",
          path: ["lotes"], // Refere-se à propriedade "lotes"
        }
      ),
  })
  .refine(
    (data) =>
      (
        data.lotes?.reduce((acc, curr) => {
          return acc + parseFloat(curr.quantidade_itens);
        }, 0) || 0
      ).toFixed(2) == parseFloat(data.quantidade_total_clientes).toFixed(2),
    {
      path: ["lotes"],
      message: "A quantidade de clientes em lote precisa bater com a quantidade total de clientes.",
    }
  );

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
