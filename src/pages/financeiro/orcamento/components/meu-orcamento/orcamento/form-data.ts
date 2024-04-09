import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaMeuOrcamento = z
  .object({
  id_conta_saida: z.coerce.string(),
  disponivel: z.coerce.string(),
  conta_saida: z.coerce.string(),
  id_conta_entrada: z.coerce.string(),
  conta_entrada: z.coerce.string(),
  valor_transferido: z.coerce.string(),

  id_filial: z.coerce.string(),
  id_orcamento: z.coerce.string(),
  id_centro_custo_saida: z.coerce.string(),
  id_centro_custo_entrada: z.coerce.string(),
});

export type MeuOrcamentoSchema =  z.infer<typeof schemaMeuOrcamento>;

export const useFormMeuOrcamentoData =(data:MeuOrcamentoSchema)=>{
    const form = useForm<MeuOrcamentoSchema>({
        resolver: zodResolver(schemaMeuOrcamento),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}