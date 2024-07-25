import { AbatimentosProps, ValeProps } from "@/hooks/comercial/useVales";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaVale = z.object({
  // Dados Vale
  id: z.string().optional(),
  cpf_colaborador: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  nome_colaborador: z.string().trim().min(1, "Campo Obrigatório"),
  id_filial: z.coerce.string().trim().min(1, "Campo Obrigatório"),
  filial: z.string().trim().min(1, "Campo Obrigatório"),
  data_inicio_cobranca: z.coerce.string().min(1, "Campo Obrigatório"),
  origem: z.string().trim().min(1, "Campo Obrigatório"),
  parcelas: z.coerce.number().min(1, "Campo Obrigatório"),
  parcela: z.coerce.number().min(1, "Campo Obrigatório"),
  valor_parcela: z.coerce.number().min(1, "Campo Obrigatório"),
  saldo: z.coerce.number().min(1, "Campo Obrigatório"),
  obs: z.string().trim().min(5, "Campo Obrigatório"),
});

export const useFormValeData = (data: ValeProps) => {
  const form = useForm<ValeProps>({
    resolver: zodResolver(schemaVale),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};

const schemaAbatimento = z.object({
  // Dados Abatimento
  saldo: z.coerce.string({ required_error: "Campo obrigatório" }),
  valor: z.coerce.string({ required_error: "Campo obrigatório" }),
  obs: z.coerce.string({ required_error: "Campo obrigatório" }),
});

export const useFormAbatimentoData = (data: AbatimentosProps) => {
  const form = useForm<AbatimentosProps>({
    resolver: zodResolver(schemaAbatimento),
    defaultValues: data,
    values: data,
  });

  return {
    form,
  };
};
