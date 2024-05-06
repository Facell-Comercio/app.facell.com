import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { checkIsPIX, checkIsTransferenciaBancaria } from "./helper";
import { Historico, ItemRateioTitulo, ItemTitulo } from "./store";

export const schemaTitulo = z.object({
  id: z.string().optional(),
  id_recorrencia: z.number  ().optional(),
  // IDs
  id_fornecedor: z.coerce.string({ message: 'Campo obrigatório' }).min(1, { message: 'Selecione o Fornecedor!' }),
  id_filial: z.coerce.string({ required_error: 'Campo obrigatório' }).min(1, { message: 'Selecione a Filial!' }),
  id_grupo_economico: z.coerce.string({ required_error: 'Campo obrigatório' }).min(1, { message: 'Selecione a Filial!' }),
  id_matriz: z.coerce.string({ required_error: 'Campo obrigatório' }).min(1, { message: 'Selecione a Filial!' }),
  id_tipo_solicitacao: z.coerce.string({ required_error: 'Campo obrigatório' }).min(1, { message: 'Selecione o Tipo de Solicitação!' }),
  id_forma_pagamento: z.coerce.string({ required_error: 'Campo obrigatório' }).min(1, { message: 'Selecione a Forma de Pagamento!' }),

  centro_custo: z.string().optional(),
  id_centro_custo: z.string().trim().min(1, { message: 'Selecione o Centro de Custo!' }),

  // Fornecedor
  favorecido: z.string().optional(),
  cnpj_favorecido: z.string().optional(),
  id_tipo_chave_pix: z.string().optional(),
  chave_pix: z.string().optional(),

  id_banco: z.string().optional(),
  banco: z.string().optional(),
  codigo_banco: z.string().optional(),

  agencia: z.string().optional(),
  dv_agencia: z.string().optional(),
  id_tipo_conta: z.string().optional(),
  conta: z.string().optional(),
  dv_conta: z.string().optional(),

  // Outros
  data_emissao: z.coerce.date({ message: 'Data inválida' }),
  data_vencimento: z.coerce.date({ message: 'Data inválida' }),
  data_prevista: z.coerce.date({ message: 'Data inválida' }),

  num_parcelas: z.coerce.number({ required_error: 'Campo obrigatório' }),
  parcela: z.coerce.string({ required_error: 'Campo obrigatório' }),

  num_doc: z.string({ required_error: 'Campo obrigatório' }),
  valor: z.coerce.string({ required_error: 'Campo obrigatório' }).transform(val => {
    return parseFloat(val.replace(/[^\d,]/g, '').replace(',', '.'))
  }).refine(val => !isNaN(val)),
  descricao: z
    .string()
    .min(10, { message: "Precisa conter mais que 10 caracteres" }),

  update_itens: z.boolean(),
  itens: z.array(
    z.object({
      id: z.string().optional(),
      id_plano_conta: z.string({ required_error: 'Campo obrigatório' }),
      plano_conta: z.string({ required_error: 'Campo obrigatório' }),
      valor: z.string().min(0),
    })
  ).nonempty({message: 'Inclua ao menos um item à solicitação!'}),

  // Rateio:
  id_rateio: z.string({ required_error: 'Campo obrigatório' }),
  update_rateio: z.boolean(),
  rateio_manual: z.coerce.boolean(),
  itens_rateio: z.array(
    z.object({
      id: z.string().optional(),
      id_filial: z.string({ required_error: 'Campo obrigatório' }),
      percentual: z.string().transform(value => parseFloat(value) / 100),
    })
  ).nonempty({message: 'Defina corretamente o rateio!'}),

  // Anexos:
  url_nota_fiscal: z.string().optional(),
  url_xml_nota: z.string().optional(),
  url_boleto: z.string().optional(),
  url_contrato: z.string().optional(),
  url_planilha: z.string().optional(),
  url_txt: z.string().optional(),

})
  // Cobra Agência e Conta
  .refine(data => checkIsTransferenciaBancaria(data.id_forma_pagamento) ? !!data.agencia : true,
  {path: ['agencia'], message: 'Obrigatório para esta forma de pagamento.'})
  .refine(data => checkIsTransferenciaBancaria(data.id_forma_pagamento) ? !!data.conta : true,
  {path: ['conta'], message: 'Obrigatório para esta forma de pagamento.'})

  // Cobrança PIX
  .refine(data => checkIsPIX(data.id_forma_pagamento) ? !!data.id_tipo_chave_pix : true,
  { path: ['id_tipo_chave_pix'],message: "Obrigatório para esta forma de pagamento."})

  .refine(data => checkIsPIX(data.id_forma_pagamento) ? !!data.chave_pix : true,
  { path: ['chave_pix'],message: "Obrigatório para esta forma de pagamento."})

  .refine(data=>data.id_tipo_solicitacao == '1' ? !!data.url_nota_fiscal : true, {path:['url_nota_fiscal'], message: 'Anexo Obrigatório!'})
  .refine(data=>data.id_tipo_solicitacao != '1' ? !!data.url_contrato : true, {path:['url_contrato'], message: 'Anexo Obrigatória!'})


export interface TituloSchemaProps {
  id_fornecedor: string;
  id_filial: string;
  id_tipo_solicitacao: string;
  id_centro_custo: string;
  id_matriz?: string;
  id_grupo_economico?: string;
  status?: string;

  num_doc: string;

  id?: string|null;
  id_solicitante?: string;

  update_itens: boolean;
  itens: ItemTitulo[];

  update_rateio: boolean;
  rateio_manual: boolean;
  id_rateio?: string;
  itens_rateio: ItemRateioTitulo[];

  id_extrato?: string | null;
  id_extrato_lote?: string | null;
  id_status?: string;
  id_tipo_baixa?: string | null;

  created_at?: string;
  updated_at?: string;
  data_emissao?: string;
  data_vencimento?: string;
  data_prevista?: string;
  data_pagamento?: string | null;
  valor_pago?: string;
  descricao?: string;
  valor?: string;

  num_parcelas?: string;
  parcela?: string;
  linha_digitavel?: string | null;

  // Fornecedor
  nome_fornecedor?: string;
  cnpj_fornecedor?: string;

  cnpj_favorecido?: string | null;
  favorecido?: string | null;

  id_forma_pagamento?: string;
  id_banco?: string | null;
  banco?: string;
  codigo_banco?: string;
  agencia?: string | null;
  dv_agencia?: string | null;
  id_tipo_conta?: string | null;
  conta?: string | null;
  dv_conta?: string | null;

  id_tipo_chave_pix?: string | null;
  chave_pix?: string | null;

  centro_custo?: string;

  historico?: Historico[]

  url_xml?: string | null;
  url_nota_fiscal?: string | null;
  url_boleto?: string | null;
  url_contrato?: string | null;
  url_planilha?: string | null;
  url_txt?: string | null;
  url_xml_nota?: string;

  id_recorrencia?: string;
}

export const useFormTituloData = (data: TituloSchemaProps) => {
  const form = useForm<TituloSchemaProps>({
    resolver: zodResolver(schemaTitulo),
    defaultValues: data,
    values: data
  });
  return {
    form
  }
}