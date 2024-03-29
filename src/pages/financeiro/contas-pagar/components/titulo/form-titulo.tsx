import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/custom/form-input";
import FormSelect from "@/components/custom/form-select";
import { toast } from "@/components/ui/use-toast";
import { Contact, Divide, DollarSign, FileIcon, FileText } from "lucide-react";
import { TituloPagar, initialPropsTitulo, useStoreRateio } from "./store-titulo";
import { useTituloPagar } from "@/hooks/use-titulo-pagar";
import SelectFilial from "@/components/custom/select-filial";
import { useState } from "react";
import ModalPlanoContas, { ItemPlanoContas } from "@/pages/financeiro/components/ModalPlanoContas";
import ModalFornecedores, { ItemFornecedor } from "@/pages/financeiro/components/ModalFornecedor";

const schemaTitulo = z
  .object({
    // IDs
    id_fornecedor: z.number(),
    id_filial: z.coerce.number(),
    id_plano_contas: z.coerce.number(),
    id_tipo_solicitacao: z.coerce.number().min(1),
    id_centro_custo: z.coerce.number(),

    // Outros
    data_emissao: z.date(),
    data_vencimento: z.date(),
    num_parcelas: z.coerce.number().min(1),
    parcela: z.number().min(1),
    valor: z.coerce.number(),
    descricao: z.string().min(10, { message: "Precisa conter mais que 10 caracteres" }),

    // Rateio:
    id_rateio: z.coerce.number(),
    itens_rateio: z.array(z.object({
      id_filial: z.coerce.number(),
      valor: z.number(),
      percentual: z.number(),
    })),

    // Anexos:
    anexo_nota_fiscal: z.instanceof(FileList).optional(),
    url_nota_fiscal: z.string().optional(),

    anexo_xml_nota: z.instanceof(FileList).optional(),
    url_xml_nota: z.string().optional(),

    anexo_boleto: z.instanceof(FileList).optional(),
    url_boleto: z.string().optional(),

    anexo_contrato: z.instanceof(FileList).optional(),
    url_contrato: z.string().optional(),

    anexo_planilha: z.instanceof(FileList).optional(),
    url_planilha: z.string().optional(),

    anexo_txt: z.instanceof(FileList).optional(),
    url_txt: z.string().optional(),
  });


const FormTituloPagar = ({ id_titulo }: { id_titulo: number | null }) => {
  console.log('RENDER - Form, titulo:', id_titulo)

  const { data } = useTituloPagar().getOne(id_titulo)

  const form = useForm<TituloPagar>({
    defaultValues: initialPropsTitulo,
    resolver: zodResolver(schemaTitulo),
  });
  const { setValue } = form;

  const [modalFornecedorOpen, setModalFornecedorOpen] = useState(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);

  // Controle de fornecedor
  function showModalFornecedor() {
    setModalFornecedorOpen(true)
  }

  function handleSelectionFornecedor(item: ItemFornecedor) {
    setValue('id_fornecedor', item.id)
    setValue("cnpj_fornecedor", item.cnpj)
    setValue("nome_fornecedor", item.nome)
    setModalFornecedorOpen(false)
  }

  // Controle de plano de contas
  function showModalPlanoContas() {
    console.log('Abrir modal plano contas')
    setModalPlanoContasOpen(true)
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setValue('id_plano_contas', item.id)
    setValue("plano_contas", item.codigo + ' - ' + item.descricao)
    setModalPlanoContasOpen(false)
  }
  const { watch } = form;
  const watchIdFilial = watch('id_filial')

  // Controle de rateio
  const { fields: itensRateio, append: addFieldArray, remove: removeFieldArray } = useFieldArray({
    control: form.control,
    name: 'itens_rateio',
  })

  function addItemRateio() {
    addFieldArray({ id_filial: 1, valor: 0, percentual: 0 })
  }

  function removeItemRateio(index: number) {
    removeFieldArray(index)
  }


  const onSubmit = (data: TituloPagar) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <div className="max-w-full max-h-[90vh] overflow-x-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-full flex flex-wrap gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">
              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Contact /> <span className="text-lg font-bold ">Fornecedor</span> <Button type="button" onClick={showModalFornecedor} size={'sm'}>Procurar</Button>
                </div>

                <div className="flex flex-wrap gap-3 items-end">
                <FormInput
                    type="hidden"
                    name="id_filial"
                    control={form.control}
                  />
                  <FormInput className="w-64" name="cnpj_fornecedor" readOnly={true} label="CPF/CNPJ" control={form.control} />
                  <FormInput className="max-w-[500px]" name="nome_fornecedor" readOnly={true} label="Nome do fornecedor" control={form.control} />
                  
                  <ModalFornecedores open={modalFornecedorOpen} handleSelecion={handleSelectionFornecedor} onOpenChange={() => setModalFornecedorOpen(prev => !prev)}/>
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <FileText /> <span className="text-lg font-bold ">Dados do título</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormSelect
                    name="tipo_solicitacao"
                    control={form.control}
                    label={"Tipo de solicitação"}
                    options={[
                      { value: "1", label: "Com nota fiscal" },
                      { value: "2", label: "Antecipado / Nota fiscal futura" },
                      { value: "3", label: "Sem nota fiscal" },
                    ]}
                  />

                  <SelectFilial
                    name="id_filial"
                    label="Filial"
                    control={form.control}
                  />

{/* Plano contas */}
                  <FormInput
                    type="hidden"
                    name="id_plano_contas"
                    control={form.control}
                  />
                  <FormItem>
                    <FormLabel>Plano de contas</FormLabel>
                    <Input className="w-[50ch]" readOnly {...form.register('plano_contas')} placeholder="Selecione um plano de contas" onClick={showModalPlanoContas} />
                  </FormItem>
                  <ModalPlanoContas id_filial={watchIdFilial} onOpenChange={() => setModalPlanoContasOpen(prev => !prev)} open={modalPlanoContasOpen} handleSelecion={handleSelectionPlanoContas} />



                  <FormSelect
                    name="centro_custo"
                    control={form.control}
                    label={"Centro de custo"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "1", label: "DIRETORIA" },
                      { value: "2", label: "DP" },
                      { value: "3", label: "COMERCIAL" },
                    ]}
                  />

                  <FormSelect
                    name="forma_pagamento"
                    control={form.control}
                    label={"Forma de pagamento"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "1", label: "Boleto" },
                      { value: "2", label: "Débito em conta" },
                      { value: "3", label: "Dinheiro" },
                      { value: "4", label: "PIX" },
                      { value: "5", label: "Transferência" },
                      { value: "6", label: "Cartão" },
                      { value: "7", label: "Câmbio Invoice" },
                      { value: "8", label: "Débito automático" },
                    ]}
                  />

                  <FormInput name="parcelas" type={"number"} label="Número de parcelas" control={form.control} />
                  <FormInput name="data_emissao" type={"date"} label="Data de emissão" control={form.control} />
                  <FormInput name="data_vencimento" type={"date"} label="Data de vencimento" control={form.control} />

                  <FormInput name="valor" type={"number"} label="Valor do título" control={form.control} />

                  <FormInput className="min-w-[400px]" name="descricao" label="Descrição do pagamento" control={form.control} />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Divide /> <span className="text-lg font-bold ">Dados do rateio</span>
                </div>

                <div className="flex gap-3">
                  <FormSelect
                    name="tipo_rateio"
                    control={form.control}
                    label={"Tipo de rateio"}
                    className={"min-w-[30ch]"}
                    options={[
                      { value: "6", label: "R08 - RATEIO MANUAL" },
                      { value: "1", label: "R01 - RATEIO REGIONAL RN" },
                      { value: "2", label: "R02 - RATEIO REGIONAL CE" },
                      { value: "3", label: "R03 - RATEIO REGIONAL BA" },
                      { value: "4", label: "R05 - TODAS FILIAIS" },
                      { value: "5", label: "R07 - RATEIO REGIONAL RN/CE" },
                    ]}
                  />
                </div>

                <div className="flex justify-between items-baseline border mt-3">
                  <FormLabel>Itens do rateio</FormLabel>
                  <Button type="button" onClick={addItemRateio}>
                    Novo item
                  </Button>
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  {itensRateio?.map((itemRateio, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <SelectFilial name={`itens_rateio.${index}.id_filial`} register={form.register} />

                      <Input className="w-60" type="number" value={itemRateio.percentual} />
                      <Input className="w-60" type="number" value={itemRateio.valor} />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => { removeItemRateio(index) }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <DollarSign /> <span className="text-lg font-bold ">Dados do pagamento</span>
                </div>
                <div className="flex gap-3">pagamento aqui</div>
              </div>

              {/* Fim da primeira coluna */}
            </div>

            {/* Segunda coluna */}
            <div className="flex shrink-0 flex-col gap-3 bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
              <div className="flex gap-2 font-bold mb-3">
                <FileIcon /> <span>Anexos</span>
              </div>

              <FormInput name="xml" type="file" label="XML Nota fiscal" control={form.control} />
              <FormInput name="nota_fiscal" type="file" label="Nota fiscal" control={form.control} />
              <FormInput name="boleto" type="file" label="Boleto" control={form.control} />
              <FormInput name="contrato" type="file" label="Contrato/Ordem de compra" control={form.control} />
              <FormInput name="planilha" type="file" label="Planilha" control={form.control} />
              <FormInput name="txt" type="file" label="TXT Remessa" control={form.control} />
            </div>
          </div>

        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
