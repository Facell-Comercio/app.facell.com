import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectFilial from "@/components/custom/SelectFilial";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { normalizeCnpjNumber, normalizePercentual } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ban, Contact, Divide, DollarSign, Edit, FileIcon, FileText, Save } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { ItemRateioTitulo, TituloPagar, initialPropsTitulo } from "./store-titulo";
import FormFileUpload from "@/components/custom/FormFileUpload";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import SelectTipoContaBancaria from "@/components/custom/SelectTipoContaBancaria";
import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
// import { useTituloPagar } from "@/hooks/useTituloPagar";

const schemaTitulo = z.object({
  // IDs
  id_fornecedor: z.coerce.number(),
  id_filial: z.coerce.number(),
  id_plano_contas: z.coerce.number(),
  id_tipo_solicitacao: z.coerce.number(),
  id_forma_pagamento: z.coerce.number(),
  id_centro_custo: z.coerce.number(),

  // Outros
  data_emissao: z.coerce.date(),
  data_vencimento: z.coerce.date(),
  num_parcelas: z.string(),
  parcela: z.string(),
  valor: z.coerce.number(),
  descricao: z
    .string()
    .min(10, { message: "Precisa conter mais que 10 caracteres" }),

  // Rateio:
  id_rateio: z.string(),
  itens_rateio: z.array(
    z.object({
      id_filial: z.string(),
      valor: z.coerce.number().min(0),
      percentual: z.coerce.number(),
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
var i = 0;
const FormTituloPagar = ({ id }: { id: string | null }) => {
  console.log(`RENDER ${++i} - Form, titulo:`, id);
  const [modalFornecedorOpen, setModalFornecedorOpen] = useState<boolean>(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!id || false)

  const { data, isLoading, isError } = useTituloPagar().getOne(id);

  const { titulo, itens_rateio: itensRateioTitulo } = data?.data || { titulo: {}, itens_rateio: [] }

  for (const key in titulo) {
    if (Object.hasOwnProperty.call(titulo, key)) {
      const tipo_campo = typeof titulo[key]
      const val = titulo[key]
      if (tipo_campo === 'number') {
        titulo[key] = String(val);
      }
      if (val === null) {
        titulo[key] = '';
      }
    }
  }

  console.log('Titulo', titulo)

  const statusTitulo = titulo?.status || ''
  const isMaster = checkUserDepartments('FINANCEIRO') || checkUserPermission('MASTER')
  const canEdit = !id || (
    statusTitulo === 'Solicitado' || (
      isMaster
      && statusTitulo !== 'Aprovado'
      && statusTitulo !== 'Negado'
      && statusTitulo !== 'Pago'
    )
  )

  const handleEditing = (mode: boolean) => {
    if (canEdit) {
      setIsEditing(mode)
    }
  }

  const itens_rateio: ItemRateioTitulo[] = []

  itensRateioTitulo?.forEach((item_rateio: ItemRateioTitulo) => {
    const item = {
      id: item_rateio.id?.toString() || "",
      id_filial: item_rateio.id_filial?.toString() || "",
      percentual: item_rateio.percentual || '',
      valor: item_rateio.valor || 0,
    };
    itens_rateio.push(item);
  });

  const form = useForm<TituloPagar>({
    resolver: zodResolver(schemaTitulo),
    values: {
      ...titulo, itens_rateio
    },
    defaultValues: initialPropsTitulo,
  });

  const { setValue } = form;

  // Controle de fornecedor
  function showModalFornecedor() {
    setModalFornecedorOpen(true);
  }

  function handleSelectionFornecedor(item: ItemFornecedor) {
    setValue("id_fornecedor", item.id);
    setValue("cnpj_fornecedor", normalizeCnpjNumber(item.cnpj));
    setValue("nome_fornecedor", item.nome);
    setModalFornecedorOpen(false);
  }

  // Controle de plano de contas
  function showModalPlanoContas() {
    if (canEdit) {
      console.log('Abrir modal plano contas')
      setModalPlanoContasOpen(true)
    }
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setValue("id_plano_contas", item.id);
    setValue("plano_contas", item.codigo + " - " + item.descricao);
    setModalPlanoContasOpen(false);
  }
  const watchIdFilial = useWatch({ name: "id_filial", control: form.control });
  const watchFormaPagamento = useWatch({ name: "id_forma_pagamento", control: form.control });
  const showPix = watchFormaPagamento === '4'
  const showDadosBancarios = watchFormaPagamento === '2' || watchFormaPagamento === '5' || watchFormaPagamento === '8' 

  // Controle de rateio
  const {
    fields: itensRateio,
    append: addFieldArray,
    remove: removeFieldArray,
  } = useFieldArray({
    control: form.control,
    name: "itens_rateio",
  });

  function addItemRateio() {
    addFieldArray({ id_filial: "1", valor: 0, percentual: "0" });
  }

  function removeItemRateio(index: number) {
    removeFieldArray(index);
  }

  const onSubmit = (data: TituloPagar) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <ScrollArea className="h-[300px]">
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        </ScrollArea>
      ),
    });
  };

  const rateioManual = titulo.id_rateio == "6";

  if (isLoading) {
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
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center">
        <h3 className="font-bold text-md">Ops!</h3>
        <p className="text-red-500">Ocorreu um erro ao tentar buscar os dados do título!</p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col max-w-full max-h-[85vh] overflow-hidden">
          {titulo?.status && (<div className="flex-1 py-2">
            <div className={`py-1 text-center border text-md font-bold rounded-sm ${generateStatusColor({ status: titulo?.status || '', bg: true, text: true })}`}>{titulo.status}</div>
          </div>)}

          <ScrollArea className="flex-1 overflow-auto pe-3" >
            <div className="max-w-full flex flex-col lg:flex-row gap-5">

              {/* Primeira coluna */}
              <div className="flex flex-1 flex-col gap-3 shrink-0">

                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <Contact /> <span className="text-lg font-bold ">Fornecedor</span>
                    <Button disabled={!canEdit} type="button" onClick={showModalFornecedor} size={'sm'}>Procurar</Button>
                  </div>

                  {/* Dados do Fornecedor */}
                  <div className="flex flex-wrap gap-3 items-end">
                    <FormInput
                      type="hidden"
                      readOnly={true}
                      name="id_filial"
                      control={form.control}
                    />
                    <FormInput
                      className="min-w-[18ch]"
                      name="cnpj_fornecedor"
                      readOnly={true}
                      label="CPF/CNPJ"
                      fnMask={normalizeCnpjNumber}
                      control={form.control}
                    />
                    <FormInput
                      className="min-w-[50ch] shrink-0"
                      name="nome_fornecedor"
                      readOnly={true}
                      label="Nome do fornecedor"
                      control={form.control}
                    /> <br/>

                    <SelectFormaPagamento
                      label="Forma de pagamento"
                      name="id_forma_pagamento"
                      control={form.control}
                    />

                    <div className={`${showPix ? 'flex' : 'hidden'} gap-3 flex-wrap`}>
                      <SelectTipoChavePix
                        control={form.control}
                        name="id_tipo_chave_pix"
                        label="Tipo Chave PIX"
                      />

                      <FormInput
                        label="Chave PIX"
                        name="chave_pix"
                        control={form.control}
                        readOnly={!isEditing}
                      />
                    </div>

                    {/* Dados bancários do fornecedor */}
                    <div className={`${showDadosBancarios ? 'flex' : 'hidden'} gap-3 flex-wrap`}>
                      <FormInput
                        label="Favorecido"
                        name="favorecido"
                        control={form.control}
                        readOnly={!isEditing}
                      />

                      <FormInput
                        label="CNPJ Favorecido"
                        name="cnpj_favorecido"
                        control={form.control}
                        readOnly={!isEditing}
                      />

                      <FormInput
                        label="Cód. Banco"
                        name="codigo_banco"
                        className="max-w-[10ch]"
                        control={form.control}
                        readOnly={true}
                      />

                      <FormInput
                        label="Banco"
                        name="nome_banco"
                        className="max-w-fit"
                        control={form.control}
                        readOnly={true}
                      />

                      <FormInput
                        label="Agência"
                        name="agencia"
                        control={form.control}
                        readOnly={true}
                      />

                      <FormInput
                        label="Dv. Ag."
                        name="dv_agencia"
                        className="max-w-[10ch]"
                        control={form.control}
                        readOnly={true}
                      />

                      <SelectTipoContaBancaria
                        label="Tipo conta"
                        name="id_tipo_conta"
                        control={form.control}
                      />

                      <FormInput
                        label="Conta"
                        name="conta"
                        control={form.control}
                        readOnly={true}
                      />

                      <FormInput
                        label="Dv. Conta"
                        name="dv_conta"
                        className="max-w-[10ch]"
                        control={form.control}
                        readOnly={true}
                      />
                    </div>

                    <ModalFornecedores
                      open={(isEditing && modalFornecedorOpen)}
                      handleSelecion={handleSelectionFornecedor}
                      onOpenChange={() => setModalFornecedorOpen((prev) => !prev)}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <FileText />{" "}
                    <span className="text-lg font-bold ">Dados do título</span>
                  </div>
                  <div className="flex gap-3 flex-wrap items-end">
                    <FormSelect
                      disabled={!isEditing}
                      name="id_tipo_solicitacao"
                      label={"Tipo de solicitação"}
                      control={form.control}
                      className="min-w-[32ch]"
                      options={[
                        { value: "1", label: "Com nota fiscal" },
                        { value: "2", label: "Antecipado / Nota fiscal futura" },
                        { value: "3", label: "Sem nota fiscal" },
                      ]}
                    />

                    <SelectFilial
                      disabled={!isEditing}
                      name="id_filial"
                      label="Filial"
                      className="min-w-[40ch]"
                      control={form.control}
                    />

                    {/* Plano contas */}
                    <FormInput
                      type="hidden"
                      readOnly={true}
                      name="id_plano_contas"
                      control={form.control}
                    />
                    <FormItem>
                      <div className="flex justify-between items-end">
                        <FormLabel>Plano de contas</FormLabel>
                      </div>

                      <Button type="button" variant={'ghost'} onClick={showModalPlanoContas} className="flex-1 p-0">
                        <FormInput
                          className="min-w-[50ch]"
                          readOnly={true}
                          name="plano_contas"
                          placeholder="Selecione o plano de contas"
                          control={form.control}
                        />
                      </Button>
                    </FormItem>

                    <ModalPlanoContas
                      open={isEditing && modalPlanoContasOpen}
                      id_filial={watchIdFilial}
                      onOpenChange={() =>
                        setModalPlanoContasOpen((prev) => !prev)
                      }
                      handleSelecion={handleSelectionPlanoContas}
                    />

                    <FormSelect
                      disabled={!isEditing}
                      name="id_centro_custo"
                      control={form.control}
                      label={"Centro de custo"}
                      className={"min-w-[30ch]"}
                      options={[
                        { value: "1", label: "DIRETORIA" },
                        { value: "2", label: "DP" },
                        { value: "3", label: "COMERCIAL" },
                      ]}
                    />

                    <FormInput
                      readOnly={!isEditing}
                      name="num_parcelas"
                      type={"number"}
                      label="Número de parcelas"
                      control={form.control}
                    />
                    <FormInput
                      readOnly={!isEditing}
                      name="parcela"
                      type={"number"}
                      label="Parcela"
                      control={form.control}
                    />

                    <FormDateInput
                      disabled={!isEditing}
                      name="data_emissao"
                      label="Data de emissão"
                      control={form.control}
                    />
                    <FormDateInput
                      disabled={!isEditing}
                      name="data_vencimento"
                      label="Data de vencimento"
                      control={form.control}
                    />

                    <FormInput
                      readOnly={!isEditing}
                      className="w-[20ch]"
                      name="valor"
                      control={form.control}
                      type={"number"}
                      label="Valor do título"
                    />

                    <FormInput
                      readOnly={!isEditing}
                      className="min-w-[400px] flex-1"
                      name="descricao"
                      label="Descrição do pagamento"
                      control={form.control}
                    />
                  </div>
                </div>


                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <DollarSign />{" "}
                    <span className="text-lg font-bold ">Dados do pagamento</span>
                  </div>
                  <div className="flex gap-3">


                  </div>
                </div>

                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <Divide />{" "}
                    <span className="text-lg font-bold ">Dados do rateio</span>
                  </div>

                  <div className="flex gap-3">
                    <FormSelect
                      name="id_rateio"
                      disabled={!isEditing}
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
                    {isEditing && rateioManual && (
                      <Button type="button" onClick={addItemRateio}>
                        Novo item
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 mt-3">
                    <table>
                      <thead>
                        <tr>
                          <th>Filial</th>
                          <th>Percentual</th>
                          <th>Valor</th>
                          {isEditing && rateioManual && <th>Ação</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {itensRateio?.map((_, index) => (
                          <tr key={index}>
                            <td className="p-1">
                              <SelectFilial
                                name={`itens_rateio.${index}.id_filial`}
                                disabled={!(isEditing && rateioManual)}
                                control={form.control}
                              />
                            </td>
                            <td className="p-1">
                              <FormInput
                                className="text-end"
                                readOnly={!(isEditing && rateioManual)}
                                type="text"
                                name={`itens_rateio.${index}.percentual`}
                                control={form.control}
                                fnMask={normalizePercentual}
                              />
                            </td>
                            <td className="p-1">
                              <FormInput
                                className="text-end"
                                readOnly={!(isEditing && rateioManual)}
                                type="number"
                                name={`itens_rateio.${index}.valor`}
                                control={form.control}
                              />
                            </td>
                            {isEditing && rateioManual && (
                              <td className="p-1">
                                <Button
                                  type="button"
                                  size={'sm'}
                                  variant="destructive"
                                  onClick={() => {
                                    removeItemRateio(index);
                                  }}
                                >
                                  Remover
                                </Button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Fim da primeira coluna */}
              </div>

              {/* Segunda coluna */}
              <div className="max-w-full lg:max-w-[300px] flex shrink-0 flex-col gap-3 bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
                <div className="flex gap-2 font-bold mb-3">
                  <FileIcon /> <span>Anexos</span>
                </div>

                <FormFileUpload disabled={!isEditing} label='XML Nota fiscal' name="url_xml" mediaType="xml" control={form.control} />
                <FormFileUpload disabled={!isEditing} label='Nota fiscal' name="url_nota_fiscal" mediaType="pdf" control={form.control} />
                <FormFileUpload disabled={!isEditing} label='Boleto' name="url_boleto" mediaType="pdf" control={form.control} />
                <FormFileUpload disabled={!isEditing} label='Contrato/Autorização' name="url_contrato" mediaType="etc" control={form.control} />
                <FormFileUpload disabled={!isEditing} label='Planilha' name="url_planilha" mediaType="excel" control={form.control} />
                <FormFileUpload disabled={!isEditing} label='Arquivo remessa' name="url_txt" mediaType="txt" control={form.control} />

              </div>
            </div>
          </ScrollArea>

          <div className="flex-1 flex items-center justify-between mt-3">

            <div className="flex items-center gap-2 ms-auto">
              {/* Editar */}
              {canEdit && !isEditing && <Button
                onClick={() => { handleEditing(true) }}
                type="button"
                size="lg"
                className="ms-auto text-orange-950 bg-orange-500 hover:bg-orange-400 hover:dark:bg-orange-700 dark:bg-orange-600"
              ><Edit className="me-2" /> Editar</Button>}

              {/* Cancelar */}
              {id && isEditing &&
                <Button
                  onClick={() => { handleEditing(false) }}
                  type="button"
                  variant={'secondary'}
                  size="lg"
                  className="ms-auto bg-slate-300 hover:bg-slate-400 dark:bg-slate-700"
                ><Ban className="me-2" /> Cancelar</Button>}

              {/* Salvar */}
              {isEditing && <Button type="submit" size="lg" className="ms-auto"><Save className="me-2" /> Salvar</Button>}
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FormTituloPagar;
