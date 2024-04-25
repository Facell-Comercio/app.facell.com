import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Historico, ItemRateioTitulo, ItemTitulo } from "./store";

const schemaTitulo = z.object({
  id: z.string().optional(),
  // IDs
  id_fornecedor: z.string(),
  id_filial: z.string(),
  id_grupo_economico: z.string(),
  id_tipo_solicitacao: z.string(),
  id_forma_pagamento: z.string(),
  id_centro_custo: z.string(),

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
  data_emissao: z.coerce.date(),
  data_vencimento: z.coerce.date(),
  data_prevista: z.coerce.date(),

  num_parcelas: z.string(),
  parcela: z.string(),

  num_doc: z.string(),
  valor: z.string(),
  descricao: z
    .string()
    .min(10, { message: "Precisa conter mais que 10 caracteres" }),

  itens: z.array(
    z.object({
      id: z.string().optional(),
      id_plano_conta: z.string(),
      plano_conta: z.string(),
      valor: z.string().min(0),
    })
  ),
    
  // Rateio:
  id_rateio: z.string(),
  rateio_manual: z.coerce.boolean(),
  itens_rateio: z.array(
    z.object({
      id: z.string().optional(),
      id_filial: z.string(),
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
  id_tipo_solicitacao: string;
  id_centro_custo: string;
  id_matriz?: string;
  id_grupo_economico?: string;
  status?: string;

  num_doc: string;
  
  id?: string;
  id_solicitante?: string;

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

}

export const useFormTituloData =(data:TituloSchemaProps)=>{
    const form = useForm<TituloSchemaProps>({
        resolver: zodResolver(schemaTitulo),
        defaultValues: data,
        values: data
      });
    return {
        form
    }
}