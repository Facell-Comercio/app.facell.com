import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BancoSchema } from "./Modal";

const schemaBanco = z
  .object({
  // Dados Banco
  id: z.string().optional(),
  nome: z.string().refine(v=>v.trim() !=="", {message: "Nome inválido"}),
  codigo: z.string().refine(v=>v.trim() !=="", {message: "Código requerido"}),
  });

export const useFormBancoData =(data:BancoSchema)=>{
    const form = useForm<BancoSchema>({
        resolver: zodResolver(schemaBanco),
        defaultValues: data,
        values: data
      });

    return {
        form
    }
}