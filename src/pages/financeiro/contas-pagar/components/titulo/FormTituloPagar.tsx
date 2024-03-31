import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import FormInputUncontrolled from "@/components/custom/FormInputUncontrolled";
import FormSelect from "@/components/custom/FormSelect";
import SelectFilial from "@/components/custom/SelectFilial";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import ModalFornecedores, { ItemFornecedor } from "@/pages/financeiro/components/ModalFornecedores";
import ModalPlanoContas, { ItemPlanoContas } from "@/pages/financeiro/components/ModalPlanoContas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact, Divide, DollarSign, FileIcon, FileText, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ItemRateioTitulo, TituloPagar, initialPropsTitulo } from "./store-titulo";
import FormFileUpload from "@/components/custom/FormFileUpload";
import { checkUserDepartments } from "@/helpers/checkAuthorization";
import { generateStatusColor } from "@/helpers/generateColorStatus";
// import { useTituloPagar } from "@/hooks/useTituloPagar";

const schemaTitulo = z
  .object({
    // IDs
    id_fornecedor: z.coerce.number(),
    id_filial: z.coerce.number(),
    id_plano_contas: z.coerce.number(),
    id_tipo_solicitacao: z.coerce.number(),
    id_centro_custo: z.coerce.number(),

    // Outros
    data_emissao: z.date(),
    data_vencimento: z.date(),
    num_parcelas: z.coerce.number().min(1),
    parcela: z.number().min(1),
    valor: z.number().min(0),
    descricao: z.string().min(10, { message: "Precisa conter mais que 10 caracteres" }),

    // Rateio:
    id_rateio: z.coerce.number(),
    itens_rateio: z.array(z.object({
      id_filial: z.coerce.number(),
      valor: z.number().min(0),
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

const FormTituloPagar = ({ id }: { id: string | null }) => {
  console.log('RENDER - Form, titulo:', id)
  const { data, isLoading } = useTituloPagar().useGetOne(id)
  const { titulo, itens_rateio: itensRateioTitulo } = data?.data ?? { titulo: initialPropsTitulo, itens_rateio: [] }

  const canEdit = titulo?.status === 'Solicitado' || (
    checkUserDepartments('FINANCEIRO') 
    && titulo?.status !== 'Aprovado' 
    && titulo?.status !== 'Negado' 
    && titulo?.status !== 'Pago'
    )

  console.log(itensRateioTitulo)
  const itens_rateio: ItemRateioTitulo[] = []
  itensRateioTitulo?.forEach((item_rateio: ItemRateioTitulo) => {
    const item = {
      id: item_rateio.id?.toString() || '',
      id_filial: item_rateio.id_filial?.toString() || '',
      percentual: item_rateio.percentual?.toString() || '',
      valor: item_rateio.valor || 0
    }
    itens_rateio.push(item)
  });


  const form = useForm<TituloPagar>({
    resolver: zodResolver(schemaTitulo),
    defaultValues: {
      itens_rateio: itens_rateio
    }
  });

  const { setValue, register } = form;

  useEffect(() => {
    Object.entries(titulo).forEach(([key, value]) => {
      // @ts-expect-error ignored
      setValue(key, value?.toString() || '');
    });


  }, [data])

  const [modalFornecedorOpen, setModalFornecedorOpen] = useState(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState(false);

  // Controle de fornecedor
  function showModalFornecedor() {
    setModalFornecedorOpen(true)
  }

  function handleSelectionFornecedor(item: ItemFornecedor) {
    setValue('id_fornecedor', item.id)
    setValue("cnpj_fornecedor", normalizeCnpjNumber(item.cnpj))
    setValue("nome_fornecedor", item.nome)
    setModalFornecedorOpen(false)
  }

  // Controle de plano de contas
  function showModalPlanoContas() {
    if(!canEdit) return;
    console.log('Abrir modal plano contas')
    setModalPlanoContasOpen(true)
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setValue('id_plano_contas', item.id)
    setValue("plano_contas", item.codigo + ' - ' + item.descricao)
    setModalPlanoContasOpen(false)
  }
  const watchIdFilial = useWatch({ name: 'id_filial', control: form.control })

  // Controle de rateio
  const { fields: itensRateio, append: addFieldArray, remove: removeFieldArray } = useFieldArray({
    control: form.control,
    name: 'itens_rateio'
  })

  function addItemRateio() {
    addFieldArray({ id_filial: "1", valor: 0, percentual: "0" })
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

  const rateioManual = titulo.id_rateio == '6'

  if (isLoading || (id && !titulo?.id_filial)) {
    return (

      <ScrollArea>
        <div className="flex gap-3 w-full h-full">

          <div className="flex-1 flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-72" />
            <Skeleton className="h-72" />
            <Skeleton className="h-24" />
          </div>

          <div className="w-72 flex flex-col gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />


            <Skeleton className="self-end mt-auto justify-self-end w-44 h-16" />
          </div>
        </div>
      </ScrollArea>
    )
  }

  return (
    <div className="max-w-full max-h-[90vh] overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="max-w-full flex flex-col lg:flex-row gap-5">
            {/* Primeira coluna */}
            <div className="flex flex-1 flex-col gap-3 shrink-0">

              {titulo?.status && <span className={`p-2 my-2 w-fit text-md font-bold rounded-sm ${generateStatusColor({status: titulo?.status || '', bg: true, text: true})}`}>{titulo.status}</span>}

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <Contact /> <span className="text-lg font-bold ">Fornecedor</span> 
                  <Button disabled={!canEdit} type="button" onClick={showModalFornecedor} size={'sm'}>Procurar</Button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <FormInput
                    type="hidden"
                    name="id_filial"
                    control={form.control}
                  />
                  <FormInputUncontrolled className="min-w-[18ch]" name="cnpj_fornecedor" readOnly={true} label="CPF/CNPJ" register={register} />
                  <FormInput className="min-w-[50ch] shrink-0" name="nome_fornecedor" readOnly={true} label="Nome do fornecedor" control={form.control} />

                  <ModalFornecedores
                    open={canEdit && modalFornecedorOpen}
                    handleSelecion={handleSelectionFornecedor}
                    onOpenChange={() => setModalFornecedorOpen(prev => !prev)}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex gap-2 mb-3">
                  <FileText /> <span className="text-lg font-bold ">Dados do título</span>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <FormSelect
                    disabled={!canEdit}
                    name="tipo_solicitacao"
                    control={form.control}
                    label={"Tipo de solicitação"}
                    defaultValue={titulo.id_tipo_solicitacao.toString()}
                    options={[
                      { value: "1", label: "Com nota fiscal" },
                      { value: "2", label: "Antecipado / Nota fiscal futura" },
                      { value: "3", label: "Sem nota fiscal" },
                    ]}
                  />

                  <SelectFilial
                    disabled={!canEdit}
                    name="id_filial"
                    label="Filial"
                    control={form.control}
                    defaultValue={titulo.id_filial.toString()}
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

                  <ModalPlanoContas
                    open={canEdit && modalPlanoContasOpen}
                    id_filial={watchIdFilial}
                    onOpenChange={() => setModalPlanoContasOpen(prev => !prev)}
                    handleSelecion={handleSelectionPlanoContas}
                  />

                  <FormSelect
                    disabled={!canEdit}
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
                  disabled={!canEdit}
                    name="forma_pagamento"
                    control={form.control}
                    label={"Forma de pagamento"}
                    className={"min-w-[30ch]"}
                    defaultValue={titulo.id_forma_pagamento.toString()}
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

                  <FormInput name="num_parcelas" type={"number"} label="Número de parcelas" control={form.control} />
                  <FormInput name="parcela" type={"number"} label="Parcela" control={form.control} />

                  <FormDateInput name="data_emissao" label="Data de emissão" control={form.control} />
                  <FormDateInput name="data_vencimento" label="Data de vencimento" control={form.control} />

                  <FormInputUncontrolled className="max-w-[20ch]" name="valor" register={register} type={"number"} label="Valor do título" />

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
                    defaultValue={titulo.id_rateio?.toString()}
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
                  {rateioManual && (<Button type="button" onClick={addItemRateio}>
                    Novo item
                  </Button>)}
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  <table >
                    <thead>
                      <th>Filial</th>
                      <th>Percentual</th>
                      <th>Valor</th>
                      {rateioManual && <th>Ação</th>}
                    </thead>
                    <tbody>


                      {itensRateio?.map((itemRateio, index) => (
                        <tr key={index}>
                          <td className='p-1'>

                            <SelectFilial name={`itens_rateio.${index}.id_filial`} disabled={!rateioManual} control={form.control} />
                          </td>
                          <td className='p-1'>

                            <Input className="" readOnly={!rateioManual} type="number" value={(parseFloat(itemRateio.percentual) * 100).toFixed(2)} />
                          </td>
                          <td className='p-1'>

                            <Input className="" readOnly={!rateioManual} type="number" value={itemRateio.valor} />
                          </td>
                          {rateioManual && (<td className='p-1'>

                            <Button
                              type="button"
                              variant="destructive"
                              onClick={() => { removeItemRateio(index) }}
                            >
                              Remover
                            </Button>
                          </td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="hidden p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
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

              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='XML Nota fiscal' name="url_xml" mediaType="xml" control={form.control} />
              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='Nota fiscal' name="url_nota_fiscal" mediaType="pdf" control={form.control} />
              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='Boleto' name="url_boleto" mediaType="pdf" control={form.control} />
              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='Contrato/Autorização' name="url_contrato" mediaType="etc" control={form.control} />
              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='Planilha' name="url_planilha" mediaType="excel" control={form.control} />
              <FormFileUpload className='max-w-[400px]' disabled={!canEdit} label='Arquivo remessa' name="url_txt" mediaType="txt" control={form.control} />

            </div>
          </div>
          <div className="my-2 flex justify-end">

          <Button type="submit" size="lg">
            <Save className="me-2" />
            Salvar
          </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
