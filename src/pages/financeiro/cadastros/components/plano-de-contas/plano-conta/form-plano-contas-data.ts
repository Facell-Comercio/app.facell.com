import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PlanoContasSchema } from "./ModalPlanoContas";

const schemaPlanoContas = z
  .object({
  // Identificador do plano de contas
  id: z.string().trim().optional(),
  codigo: z.string().trim().min(1, "Coloque o código").toUpperCase(),
  active: z.coerce.boolean(),
  descricao: z.string().trim().min(3, "A descrição deve ter no mínimo 3 caracteres").toUpperCase(),
  codigo_pai: z.string().trim().toUpperCase().optional(),
  descricao_pai: z.string().trim().toUpperCase().optional(),

  // Parâmetros
  nivel: z.string().trim().toUpperCase().optional(),
  tipo: z.string().trim().min(1, "Obrigatório"),
  id_grupo_economico: z.string().trim().toUpperCase().min(1, "Obrigatório"),
  codigo_conta_estorno: z.string().trim().toUpperCase().optional(),
  });

export const useFormPlanoContaData =(data:PlanoContasSchema)=>{
    const form = useForm<PlanoContasSchema>({
        resolver: zodResolver(schemaPlanoContas),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}