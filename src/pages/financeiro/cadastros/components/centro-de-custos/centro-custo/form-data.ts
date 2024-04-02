import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CentroCustosSchema } from "./Modal";

const schemaCentroCustos = z
  .object({
  id: z.string().optional(),
  active: z.boolean(),
  nome: z.string().refine(v=>v.trim() !=="", {message: "Nome inválido"}),
  id_grupo_economico: z.string(),
  });

export const useFormCentroCustosData =(data:CentroCustosSchema)=>{
    const form = useForm<CentroCustosSchema>({
        resolver: zodResolver(schemaCentroCustos),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}