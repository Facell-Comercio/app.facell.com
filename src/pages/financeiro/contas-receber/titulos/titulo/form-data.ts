import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { initialPropsTitulo } from "./store";

export const vencimentoSchema = z.object({
  id: z.string().optional(),
  data_vencimento: z.coerce.string({ required_error: "Campo obrigatório" }),
  data_prevista: z.coerce.string({ required_error: "Campo obrigatório" }),
  valor: z.string().min(0),
  cod_barras: z
    .string()
    .optional()
    .transform((v) => v?.trim() || ""),
  qr_code: z
    .string()
    .optional()
    .transform((v) => v?.trim() || ""),
});

export const rateioSchema = z.object({
  id: z.string().optional(),
  id_filial: z.string({ required_error: "Campo obrigatório" }),
  filial: z.string().optional(),
  id_centro_custo: z.string(),
  centro_custo: z.string().optional(),
  id_plano_conta: z.string(),
  plano_conta: z.string().optional(),
  percentual: z.coerce
    .string()
    .transform((value) => String(parseFloat(value) / 100)),
  valor: z.string(),
});

export const schemaTitulo = z
  .object({
    id: z.string().optional(),
    id_status: z.string(),
    status: z.string().optional(),
    id_recorrencia: z.number().optional(),
    // IDs
    id_fornecedor: z.coerce
      .string({ message: "Campo obrigatório" })
      .min(1, { message: "Selecione o Fornecedor!" }),
    id_filial: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),
    id_departamento: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione o departamento!" }),
    id_grupo_economico: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),
    id_matriz: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Filial!" }),
    id_tipo_solicitacao: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione o Tipo de Solicitação!" }),
    id_forma_pagamento: z.coerce
      .string({ required_error: "Campo obrigatório" })
      .min(1, { message: "Selecione a Forma de Pagamento!" }),

    id_solicitante: z.string().optional(),
    filial: z.string().optional(),

    // Fornecedor
    cnpj_fornecedor: z.string().optional(),
    nome_fornecedor: z.string().optional(),
    favorecido: z.string().optional(),
    cnpj_favorecido: z.string().optional(),
    id_tipo_chave_pix: z.string().optional(),
    chave_pix: z.string().optional(),
    id_cartao: z.string().optional(),

    id_banco: z.string().optional(),
    banco: z.string().optional(),
    codigo_banco: z.string().optional(),

    agencia: z.string().optional(),
    dv_agencia: z.string().optional(),
    id_tipo_conta: z.string().optional(),
    conta: z.string().optional(),
    dv_conta: z.string().optional(),

    // Outros
    created_at: z.coerce.date().optional(),
    data_emissao: z.coerce.string({ required_error: "Campo obrigatório" }),
    dia_vencimento_cartao: z.coerce.string().optional(), //~ Usado somente na forma de pagamento Cartão
    dia_corte_cartao: z.coerce.string().optional(), //~ Usado somente na forma de pagamento Cartão

    num_doc: z
      .string({ message: "Campo obrigatório" })
      .min(1, { message: "Campo obrigatório" }),
    valor: z.coerce.string().min(0.01, "Preencha o valor"),

    descricao: z
      .string()
      .min(10, { message: "Precisa conter mais que 10 caracteres" })
      .toUpperCase(),

    update_vencimentos: z.boolean(),
    vencimentos: z.array(vencimentoSchema),

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
    url_nota_fiscal: z.string().optional(),
    url_xml: z.string().optional(),
    url_boleto: z.string().optional(),
    url_contrato: z.string().optional(),
    url_planilha: z.string().optional(),
    url_txt: z.string().optional(),
  })
  //^ Validar se vencimentos == valor total
  .refine(
    (data) =>
      (data.vencimentos?.reduce((acc, curr) => {
        return acc + parseFloat(curr.valor);
      }, 0) || 0).toFixed(2) == parseFloat(data.valor).toFixed(2),
    {
      path: ["vencimentos"],
      message:
        "O valor dos vencimentos precisa bater com o valor total da solicitação.",
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
      message:
        "O valor total do rateio precisa bater com o valor total da solicitação.",
    }
  )

  // ^ Validação de Anexos
  .refine(
    (data) => (data.id_tipo_solicitacao == "1" ? !!data.url_nota_fiscal : true),
    { path: ["url_nota_fiscal"], message: "Anexo Obrigatório!" }
  )
  .refine(
    (data) => (data.id_tipo_solicitacao == "4" ? !!data.url_boleto : true),
    { path: ["url_boleto"], message: "Anexo Obrigatório!" }
  )
  .refine(
    (data) =>
      data.id_tipo_solicitacao != "1" &&
      data.id_tipo_solicitacao != "4" &&
      data.id_forma_pagamento != "2"
        ? !!data.url_contrato
        : true,
    { path: ["url_contrato"], message: "Anexo Obrigatória!" }
  );

export type TituloSchemaProps = z.infer<typeof schemaTitulo>;

export const useFormTituloData = (data: TituloSchemaProps) => {
  const form = useForm<TituloSchemaProps>({
    resolver: zodResolver(schemaTitulo),
    defaultValues: initialPropsTitulo,
    values: data,
    mode: "all",
  });
  return {
    form,
  };
};
