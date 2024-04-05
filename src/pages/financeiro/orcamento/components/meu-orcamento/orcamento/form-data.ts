import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaMeuOrcamento = z
  .object({
  id_conta_saida: z.string(),
  disponivel: z.string(),
  id_conta_entrada: z.string(),
  valor_transferido: z.string(),
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