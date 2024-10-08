import { toast } from "@/components/ui/use-toast";
import { normalizeDate } from "@/helpers/mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkIsCartao, checkIsPIX, checkIsTransferenciaBancaria } from "./helpers/helper";
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
  percentual: z.coerce.string().transform((value) => String(parseFloat(value) / 100)),
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
    cnpj_fornecedor: z.string({ required_error: "Campo obrigatório" }),
    nome_fornecedor: z.string({ required_error: "Campo obrigatório" }),
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

    num_doc: z.string({ message: "Campo obrigatório" }).min(1, { message: "Campo obrigatório" }),
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
  )

  //^ Cobra Agência e Conta
  .refine(
    (data) => (checkIsTransferenciaBancaria(data.id_forma_pagamento) ? !!data.agencia : true),
    { path: ["agencia"], message: "Obrigatório para esta forma de pagamento." }
  )
  .refine((data) => (checkIsTransferenciaBancaria(data.id_forma_pagamento) ? !!data.conta : true), {
    path: ["conta"],
    message: "Obrigatório para esta forma de pagamento.",
  })

  //^ Cobrança PIX
  .refine((data) => (checkIsPIX(data.id_forma_pagamento) ? !!data.id_tipo_chave_pix : true), {
    path: ["id_tipo_chave_pix"],
    message: "Obrigatório para esta forma de pagamento.",
  })

  .refine((data) => (checkIsPIX(data.id_forma_pagamento) ? !!data.chave_pix : true), {
    path: ["chave_pix"],
    message: "Obrigatório para esta forma de pagamento.",
  })
  //^ Cobrança cartão
  .refine((data) => (checkIsCartao(data.id_forma_pagamento) ? !!data.id_cartao : true), {
    path: ["id_cartao"],
    message: "Obrigatório para esta forma de pagamento.",
  })

  // // ^ Validar se forma de pagamento for PIX Copia e Cola, cobrar o PIX Copia e Cola
  // .refine(
  //   (data) => {
  //     if (data.id_forma_pagamento == "8") {
  //       if (!data.vencimentos || data.vencimentos.length === 0) {
  //         return false;
  //       }
  //       for (const v of data.vencimentos) {
  //         if (!v.qr_code) {
  //           return false;
  //         }
  //       }
  //     }
  //     return true;
  //   },
  //   { path: ["vencimentos"], message: "Preencha o PIX Copia e Cola!" }
  // )
  // // ^ Validar se forma de pagamento for Boleto de Impostos/Concessionárias cobrar o PIX Copia e Cola
  // .refine(
  //   (data) => {
  //     if (data.id_forma_pagamento == "10") {
  //       if (!data.vencimentos || data.vencimentos.length === 0) {
  //         return false;
  //       }
  //       for (const v of data.vencimentos) {
  //         if (
  //           !v.cod_barras ||
  //           (v.cod_barras.length !== 44 && v.cod_barras.length !== 48)
  //         ) {
  //           return false;
  //         }
  //       }
  //     }
  //     return true;
  //   },
  //   {
  //     path: ["vencimentos"],
  //     message: "Preencha o código de barras corretamente",
  //   }
  // )
  // ^ Valida se forma de pagamento for cartão se a data de vencimento está no dia certo
  .refine(
    (data) => {
      if (checkIsCartao(data.id_forma_pagamento)) {
        if (!data.vencimentos || data.vencimentos.length === 0) {
          return false;
        }
        for (const v of data.vencimentos) {
          // console.log(
          // new Date(v.data_vencimento).getDate(),
          //   parseInt(data.dia_vencimento_cartao || "")
          // );
          if (
            new Date(v.data_vencimento).getDate() !== parseInt(data.dia_vencimento_cartao || "")
          ) {
            toast({
              title: "Data de vencimento inválida",
              description: `${normalizeDate(
                v.data_vencimento
              )} não é uma data de vencimento aceita, precisa ser no dia exato do vencimento do cartão.`,
              variant: "destructive",
            });
            return false;
          }
        }
      }
      return true;
    },
    { path: ["vencimentos"], message: "Preencha o PIX Copia e Cola!" }
  )

  // ^ Validação de Anexos
  .refine((data) => (data.id_tipo_solicitacao == "1" ? !!data.url_nota_fiscal : true), {
    path: ["url_nota_fiscal"],
    message: "Anexo Obrigatório!",
  })
  .refine((data) => (data.id_tipo_solicitacao == "4" ? !!data.url_boleto : true), {
    path: ["url_boleto"],
    message: "Anexo Obrigatório!",
  })
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
