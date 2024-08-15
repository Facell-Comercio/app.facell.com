import { ConferenciasCaixaSchema } from "@/hooks/financeiro/useConferenciasCaixa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCaixa = z.object({
  // Dados Caixa
  id: z.string().optional(),
  id_matriz: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  descricao: z.string().trim().min(1, "Campo Obrigatório"),
  nome_portador: z.string().trim().min(1, "Campo Obrigatório"),
  dia_vencimento: z.string().trim().min(1, "Campo Obrigatório"),
  dia_corte: z.string().trim().min(1, "Campo Obrigatório"),
  id_fornecedor: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  nome_fornecedor: z.string().trim().min(3, "Campo Obrigatório"),
  active: z.coerce.number(),
});

export const useFormCaixaData = (data: ConferenciasCaixaSchema) => {
  const form = useForm<ConferenciasCaixaSchema>({
    resolver: zodResolver(schemaCaixa),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
