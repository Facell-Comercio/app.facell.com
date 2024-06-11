import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EquipamentoSchema } from "./Modal";

const schemaEquipamento = z
  .object({
    // Dados Equipamento
  id: z.string().optional(),
  active: z.coerce.boolean(),
  estabelecimento: z.string().min(2, "Digite o estabelecimento"),
  num_maquina: z.string().min(2, "Digite o número da máquina"),
  id_filial: z.string().min(1, "Adicione a filial"),
  });

export const useFormEquipamentoData =(data:EquipamentoSchema)=>{
    const form = useForm<EquipamentoSchema>({
        resolver: zodResolver(schemaEquipamento),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}