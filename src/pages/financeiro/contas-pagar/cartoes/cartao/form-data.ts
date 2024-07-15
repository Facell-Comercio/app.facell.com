import { CartaoSchema, FaturaSchema } from "@/hooks/financeiro/useCartoes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaCartao = z.object({
  // Dados Cartao
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

export const useFormCartaoData = (data: CartaoSchema) => {
  const form = useForm<CartaoSchema>({
    resolver: zodResolver(schemaCartao),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};

const schemaFatura = z.object({
  // Dados Fatura
  id: z.string().optional(),
  data_prevista: z.coerce.string().optional(),
  cod_barras: z.string().optional(),
  valor: z.string().optional(),
  closed: z.coerce.number().optional(),
  status: z.string().optional(),
  data_vencimento: z.coerce.string({ required_error: "Campo obrigatório" }),
});

export const useFormFaturaData = (data: FaturaSchema) => {
  const form = useForm<FaturaSchema>({
    resolver: zodResolver(schemaFatura),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
