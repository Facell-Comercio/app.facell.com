import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { VendedorSchema } from "./Modal";

const schemaVendedor = z.object({
  // Dados Vendedor
  id: z.string().optional(),
  nome: z
    .string()
    .refine((v) => v.trim() !== "", { message: "Nome inválido" })
    .transform((nome) => nome.toUpperCase()),
  active: z.coerce.number(),
});

export const useFormVendedorData = (data: VendedorSchema) => {
  const form = useForm<VendedorSchema>({
    resolver: zodResolver(schemaVendedor),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
