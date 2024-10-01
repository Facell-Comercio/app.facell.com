import { TransferenciaTesourariaSchema } from "@/hooks/financeiro/useTesouraria";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaTransferenciaTesouraria = z
  .object({
    // Dados Transferencia Tesouraria
    id_caixa_saida: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    caixa_saida: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    saldo_caixa_saida: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    id_caixa_entrada: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    caixa_entrada: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    saldo_caixa_entrada: z.coerce.string().trim().min(1, "Campo Obrigatório"),
    valor_transferir: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  })
  .refine((data) => (data.id_caixa_entrada === data.id_caixa_saida ? false : true), {
    path: ["caixa_entrada"],
    message: "Deve ser diferente do caixa saída",
  });

export const useFormTransferenciaTesourariaData = (data: TransferenciaTesourariaSchema) => {
  const form = useForm<TransferenciaTesourariaSchema>({
    resolver: zodResolver(schemaTransferenciaTesouraria),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
