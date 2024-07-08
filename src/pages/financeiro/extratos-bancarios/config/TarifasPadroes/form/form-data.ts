import { TarifaProps } from "@/hooks/financeiro/useTarifas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schemaTarifasPadrao = z.object({
  id: z.string().trim().optional(),
  id_grupo_economico: z.string().trim().min(1, "Campo obrigatório"),
  id_centro_custo: z.string().trim().min(1, "Campo obrigatório"),
  id_plano_contas: z.string().trim().min(1, "Campo obrigatório"),
  centro_custo: z.string().trim().min(3, "Campo obrigatório"),
  plano_contas: z.string().trim().min(3, "Campo obrigatório"),
  descricao: z.string().trim().min(3, "Campo obrigatório"),
});

const defaultValues = {
  id: "",
  id_grupo_economico: "",
  id_centro_custo: "",
  id_plano_contas: "",
  centro_custo: "",
  plano_contas: "",
  descricao: "",
};

export default (data: TarifaProps) => {
  const form = useForm<TarifaProps>({
    resolver: zodResolver(schemaTarifasPadrao),
    defaultValues: defaultValues,
    values: (data && data.id && data) || defaultValues,
  });

  return {
    form,
  };
};
