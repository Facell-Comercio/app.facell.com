import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { initialPropsTituloCR } from "./store";

export const vencimentoSchema = z.object({
  id: z.string().optional(),
  status: z.string().optional(),
  data_vencimento: z.coerce.string({ required_error: "Campo obrigatório" }),
  valor: z.string().min(0),
});

export const rateioSchema = z.object({
  id: z.string().optional(),
  id_filial: z.string({ required_error: "Campo obrigatório" }),
  filial: z.string().optional(),
  id_centro_custo: z.string(),
  centro_custo: z.string().optional(),
  id_plano_conta: z.string(),
  plano_conta: z.string().optional(),
  percentual: z.coerce.string().transform((value) => String(parseFloat(value) / 100)),
  valor: z.string(),
});

export const schemaTituloCR = z
  .object({
    id: z.string().optional(),
    id_status: z.string(),
    status: z.string().optional(),
    // IDs
    id_fornecedor: z.coerce
      .string({ message: "Campo obrigatório" })
      .min(1, { message: "Selecione o Fornecedor!" }),
    id_filial: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),
    id_grupo_economico: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),
    id_matriz: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),

    id_solicitante: z.string().optional(),
    filial: z.string().optional(),

    // Fornecedor
    cnpj_fornecedor: z.string({ required_error: "Campo obrigatório" }),
    nome_fornecedor: z.string({ required_error: "Campo obrigatório" }),

    // Outros
    created_at: z.coerce.date().optional(),
    data_emissao: z.coerce.string().optional(),

    num_doc: z.string().optional(),
    valor: z.coerce.string().min(0.01, "Preencha o valor"),

    descricao: z
      .string()
      .min(10, { message: "Precisa conter mais que 10 caracteres" })
      .toUpperCase(),

    vencimentos: z.array(vencimentoSchema),
    update_vencimentos: z.boolean(),

    // Rateio:
    id_rateio: z.string().optional(),
    update_rateio: z.boolean(),
    rateio_manual: z.coerce.boolean(),
    itens_rateio: z.array(rateioSchema),

    historico: z
      .array(
        z.object({
          id: z.string(),
          id_titulo: z.string(),
          created_at: z.string(),
          descricao: z.string(),
        })
      )
      .optional(),

    // Anexos:
    url_xml_nota: z.string().optional(),
    url_nota_fiscal: z.string().optional(),
    url_nota_debito: z.string().optional(),
    url_planilha: z.string().optional(),
    url_txt: z.string().optional(),
  })
  //^ Validar se vencimentos == valor total
  .refine(
    (data) =>
      (
        data.vencimentos?.reduce((acc, curr) => {
          return acc + parseFloat(curr.valor);
        }, 0) || 0
      ).toFixed(2) == parseFloat(data.valor).toFixed(2),
    {
      path: ["vencimentos"],
      message: "O valor dos vencimentos precisa bater com o valor total da solicitação.",
    }
  )
  //^ Validar se rateio == valor total
  .refine(
    (data) =>
      (
        data.itens_rateio?.reduce((acc, curr) => {
          return acc + parseFloat(curr.valor);
        }, 0) || 0
      ).toFixed(2) == parseFloat(data.valor).toFixed(2),
    {
      path: ["itens_rateio"],
      message: "O valor total do rateio precisa bater com o valor total da solicitação.",
    }
  );

export type TituloCRSchemaProps = z.infer<typeof schemaTituloCR>;

export const useFormTituloCRData = (data: TituloCRSchemaProps) => {
  const form = useForm<TituloCRSchemaProps>({
    resolver: zodResolver(schemaTituloCR),
    defaultValues: initialPropsTituloCR,
    values: data,
    mode: "all",
  });
  return {
    form,
  };
};
