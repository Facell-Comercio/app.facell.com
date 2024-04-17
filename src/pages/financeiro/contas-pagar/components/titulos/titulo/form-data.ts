import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Historico, ItemRateioTitulo } from "./store";

const schemaTitulo = z.object({
  // IDs
  id_fornecedor: z.string(),
  id_filial: z.string(),
  id_plano_contas: z.string(),
  id_tipo_solicitacao: z.string(),
  id_forma_pagamento: z.string(),
  id_centro_custo: z.string(),

  // Outros
  data_emissao: z.coerce.date(),
  data_vencimento: z.coerce.date(),
  num_parcelas: z.string(),
  parcela: z.string(),

  num_doc: z.string(),
  valor: z.string(),
  descricao: z
    .string()
    .min(10, { message: "Precisa conter mais que 10 caracteres" }),

  // Rateio:
  id_rateio: z.string(),
  itens_rateio: z.array(
    z.object({
      id_filial: z.string(),
      valor: z.string().min(0),
      percentual: z.string(),
    })
  ),

  // Anexos:
  url_nota_fiscal: z.string().optional(),
  url_xml_nota: z.string().optional(),
  url_boleto: z.string().optional(),
  url_contrato: z.string().optional(),
  url_planilha: z.string().optional(),
  url_txt: z.string().optional(),
});

export interface TituloSchemaProps {
  id_fornecedor: string;
  id_filial: string;
  id_plano_contas: string;
  id_tipo_solicitacao: string;
  id_centro_custo: string;

  num_doc: string;
  
  id?: string;
  id_solicitante?: string;
  id_rateio?: string;
  itens_rateio: ItemRateioTitulo[];
  update_rateio: boolean;
  id_extrato?: string | null;
  id_extrato_lote?: string | null;
  id_status?: string;
  id_tipo_baixa?: string | null;
  
  id_forma_pagamento?: string;
  created_at?: string;
  updated_at?: string;
  data_emissao?: string;
  data_vencimento?: string;
  data_provisao?: string;
  data_pagamento?: string | null;
  valor_pago?: string;
  descricao?: string;
  valor?: string;
  id_bordero?: string | null;
  num_parcelas?: string;
  parcela?: string;
  linha_digitavel?: string | null;
  cnpj_favorecido?: string | null;
  favorecido?: string | null;
  id_tipo_chave_pix?: string | null;
  chave_pix?: string | null;
  id_banco?: string | null;
  agencia?: string | null;
  dv_agencia?: string | null;
  id_tipo_conta?: string | null;
  conta?: string | null;
  dv_conta?: string | null;

  centro_custo?: string;
  
  url_xml?: string | null;
  url_nota_fiscal?: string | null;
  url_boleto?: string | null;
  url_contrato?: string | null;
  url_planilha?: string | null;
  url_txt?: string | null;
  url_xml_nota?: string;

  lancado_sistema?: string;
  temp_acrescimo_desconto?: string | null;
  temp_tipo_baixa?: string | null;
  status?: string;
  nome_fornecedor?: string;
  cnpj_fornecedor?: string;
  plano_contas?: string;

  historico?: Historico[] 
}

export const useFormTituloData =(data:TituloSchemaProps)=>{
    const form = useForm<TituloSchemaProps>({
        resolver: zodResolver(schemaTitulo),
        defaultValues: data,
        values: data
      });
    const {fields, append, remove} = useFieldArray({
      control: form.control,
      name: "itens_rateio"
    })

    return {
        form,
        itens: fields,
        appendItem: append,
        removeItem: remove
    }
}