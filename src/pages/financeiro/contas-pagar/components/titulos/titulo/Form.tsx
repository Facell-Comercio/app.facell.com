import FormDateInput from "@/components/custom/FormDate";
import FormFileUpload from "@/components/custom/FormFileUpload";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectFilial from "@/components/custom/SelectFilial";
import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import SelectTipoContaBancaria from "@/components/custom/SelectTipoContaBancaria";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { formatarDataHora } from "@/helpers/format";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { normalizeCnpjNumber, normalizeCurrency } from "@/helpers/mask";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import {
  ArrowDown,
  Ban,
  Check,
  Clock,
  Contact,
  Divide,
  Download,
  FileIcon,
  FileText,
  History,
  List,
  Pen,
  Percent,
  Plus,
  Repeat2,
  Save,
  Trash,
  Undo2,
  Upload,
  X,
} from "lucide-react";
import React, { InputHTMLAttributes, useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from '@tanstack/react-query'
import { useFieldArray, useWatch } from "react-hook-form";
import { TituloSchemaProps, schemaTitulo, useFormTituloData } from "./form-data";
import { ItemRateio, initialPropsTitulo, useStoreTitulo } from "./store";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import SelectTipoRateio from "@/components/custom/SelectTipoRateio";
import { exportToExcel, importFromExcel } from "@/helpers/importExportXLS";
import { useFilial } from "@/hooks/useFilial";
import { Separator } from "@/components/ui/separator";
import { Filial } from "@/types/filial-type";
import ButtonMotivation from "@/components/custom/ButtonMotivation";
import { useTituloPagar } from "@/hooks/useTituloPagar";
import { calcularDataPrevisaoPagamento, formatarHistorico, getVencimentoMinimo } from "./helper";
import { Badge } from "@/components/ui/badge";

let i = 0;
const FormTituloPagar = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: TituloSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const queryClient = useQueryClient()

  // console.log(`RENDER ${++i} - Form, titulo:`, id);
  const modalEditing = useStoreTitulo().modalEditing;
  const editModal = useStoreTitulo().editModal;
  const closeModal = useStoreTitulo().closeModal;

  const [modalFornecedorOpen, setModalFornecedorOpen] =
    useState<boolean>(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] =
    useState<boolean>(false);
  const [modalCentrosCustosOpen, setModalCentrosCustosOpen] =
    useState<boolean>(false);

  const titulo = {
    ...data,
    update_itens: false,
    update_rateio: false,
  } || initialPropsTitulo;

  // console.log("Data", titulo);

  // * [ VERIFICAÇÕES ]
  const status = titulo?.status || "";
  const isMaster =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");
  const canEdit =
    (!id ||
      status === "Solicitado" ||
      (isMaster &&
        status !== "Aprovado" &&
        status !== "Negado" &&
        status !== "Pago")
    );
  const canChangeParcelas = canEdit && !id
  const readOnly = !canEdit || !modalEditing
  const disabled = !canEdit || !modalEditing

  // * [ FORM ]
  const { form } = useFormTituloData(titulo);

  const { setValue, formState: { errors } } = form;
  console.log('ERRORS:', errors)

  // * [ WATCHES ]
  const valor = useWatch({ name: "valor", control: form.control });
  const id_filial = useWatch({ name: "id_filial", control: form.control });
  const id_matriz = useWatch({ name: "id_matriz", control: form.control });
  const id_grupo_economico = useWatch({ name: "id_grupo_economico", control: form.control });
  const id_forma_pagamento = useWatch({ name: "id_forma_pagamento", control: form.control });
  const id_centro_custo = useWatch({ name: "id_centro_custo", control: form.control });
  const witens = useWatch({ name: "itens", control: form.control });
  const parcelas = useWatch({ name: "num_parcelas", control: form.control });
  const parcela = useWatch({ name: "parcela", control: form.control });

  // * [ DATA PREVISTA ]
  const onChangeDataVencimento = (data_venc: Date) => {
    // setar a data para o data_prevista
    const data_prevista = calcularDataPrevisaoPagamento(data_venc)
    setValue('data_prevista', data_prevista.toString())
  }

  // * [ FILIAL ]
  // Ao alterar a filial:
  async function handleChangeFilial(novo_id_filial: string) {
    if (novo_id_filial) {

      api.get(`filial/${novo_id_filial}`)
        .then(data => {
          const novaFilial = data.data;

          if (id_grupo_economico != novaFilial.id_grupo_economico) {
            setValue('id_grupo_economico', novaFilial.id_grupo_economico)
            setValue('id_matriz', novaFilial.id_matriz)

            setValue('id_centro_custo', '')
            setValue('centro_custo', '')
            form.resetField('itens', { defaultValue: [] })
            form.resetField('itens_rateio', { defaultValue: [] })
          }
        })
        .catch(error => {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: "Não foi possível receber os dados da Filial"
          })
        })
    }
  }
  const { data: responseFiliais } = useFilial().getAll({ filters: { id_grupo_economico: id_grupo_economico } })
  const filiais = responseFiliais?.data?.rows;

  // * [ITENS DO TÍTULO]
  const {
    fields: itens,
    append: addItem,
    remove: removeItem,
  } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const calcularTotal = () => {
    return witens.reduce((acc, curr) => acc + parseFloat(curr.valor), 0)
  }

  useEffect(() => {
    const updatedValue = normalizeCurrency(calcularTotal());
    form.setValue('valor', updatedValue)
  }, [witens])

  function handleAddItem() {
    if (!novoItemIdPlanoContasRef.current) return;
    if (!novoItemPlanoContasRef.current) return;
    if (!novoItemValorRef.current) return;

    if (!id_centro_custo) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Selecione o centro de custo!',
      })
      return
    }

    const idPlanoConta = novoItemIdPlanoContasRef.current.value
    const planoConta = novoItemPlanoContasRef.current.value
    const valor = parseFloat(novoItemValorRef.current.value)
    if (!valor) {
      toast({
        variant: 'destructive',
        title: 'Corrija o valor',
        description: 'Não pode ser zerado'
      })
      return
    }
    if (!idPlanoConta) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Selecione um plano de contas',
      })
      return
    }
    const checkIfExistis = itens.findIndex(item => item.id_plano_conta == idPlanoConta)
    if (checkIfExistis !== -1) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Plano de contas já foi selecionado!',
      })
      return
    }
    setValue('update_itens', true);
    addItem({ id_plano_conta: idPlanoConta, valor: valor.toFixed(2), plano_conta: planoConta });
    novoItemIdPlanoContasRef.current.value = ''
    novoItemPlanoContasRef.current.value = ''
    novoItemValorRef.current.value = ''
  }

  function handleRemoveItem(index: number) {
    setValue('update_itens', true);
    removeItem(index);
  }
  function handleChangeItemValue() {
    setValue('update_itens', true)
  }


  // * [ RATEIO ]
  const rateio_manual = !!+form.watch("rateio_manual");
  const canEditRateio = canEdit && modalEditing;
  const canEditItensRateio = canEdit && modalEditing && rateio_manual;

  const fileImportRateioRef = useRef<HTMLInputElement | null>(null);

  const {
    fields: itensRateio,
    append: addItemRateio,
    remove: removeItemRateio,
  } = useFieldArray({
    control: form.control,
    name: "itens_rateio",
  });

  async function handleChangeRateio(novo_id_rateio: string) {
    if (novo_id_rateio) {
      setValue('update_rateio', true);
      api.get(`financeiro/rateios/${novo_id_rateio}`, { params: { id_grupo_economico: id_grupo_economico } })
        .then(async data => {
          const novoRateio = data.data;
          const itensNovoRateio = novoRateio.itens;

          await new Promise((resolve) => {
            form.resetField('itens_rateio', { defaultValue: [] })
            resolve('success')
          })

          if (novoRateio.manual) {
            addItemRateio({
              id_filial: `${id_filial}`,
              percentual: '100.00',
            })
          }

          itensNovoRateio?.forEach((item: ItemRateio) => {
            addItemRateio({
              id_filial: String(item.id_filial || ""),
              percentual: String(item.percentual || "0.00")
            })
          })

          setValue('rateio_manual', !!novoRateio.manual)
        })
        .catch(error => {
          toast({
            variant: 'destructive',
            title: 'Erro!',
            description: "Não foi possível receber os dados do novo rateio"
          })
        })
    }
  }

  function handleAddItemRateio() {
    setValue('update_rateio', true);
    addItemRateio({ id_filial: "", percentual: "0.00" });
  }

  function handleRemoveItemRateio(index: number) {
    setValue('update_rateio', true);
    removeItemRateio(index);
  }

  function handleClickExportarRateio() {
    const json: any = []
    itensRateio.forEach((item: ItemRateio) => {
      const obj: any = {}
      obj.filial = filiais?.find((f: { id: string, nome: string }) => f.id == item.id_filial)?.nome || 'Não identificada';
      obj.percentual = parseFloat(item.percentual)
      // @ts-ignore
      obj.valor = (parseFloat(item.percentual) / 100) * parseFloat(valor || 0);
      json.push(obj)
    })
    exportToExcel(json, `rateio-${id ? "titulo-" + id : 'novo-titulo'}`)
  }

  function handleClickImportarRateio() {
    fileImportRateioRef?.current?.click()
  }

  function handleChangeImportarRateio() {
    if (fileImportRateioRef?.current) {
      const file = fileImportRateioRef.current.files && fileImportRateioRef.current.files[0]
      if (file) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
          const importedData = e.target?.result;

          const result = importFromExcel(importedData);

          const valorTotalRateio = result.reduce((acc, cur) => {
            // @ts-ignore
            return acc + cur.valor
          }, 0)

          setValue('update_rateio', true);
          form.resetField('itens_rateio', { defaultValue: [] })
          const lastItem = (result?.length || 0) - 1
          result?.forEach((item, index) => {
            // @ts-ignore
            const id_filial_rateio_item = filiais.find((f: Filial) => f.nome === item?.filial)?.id
            // const incremento = lastItem === index ? 0.01 : 0;
            // @ts-ignore
            const percentual_rateio_item = (item.valor / valorTotalRateio * 100).toFixed(4)
            // console.log(item.filial, id_filial_rateio_item,  item.valor, valorTotalRateio,percentual_rateio_item )

            addItemRateio({
              id_filial: String(id_filial_rateio_item),
              percentual: String(percentual_rateio_item)
            })
          })
        }
      };
    }
  }

  function handleChangeItemRateio() {
    setValue('update_rateio', true)
  }


  // * [ FORNECEDOR ]
  function showModalFornecedor() {
    setModalFornecedorOpen(true);
  }

  // Quando escolher um fornecedor:
  async function handleSelectionFornecedor(item: ItemFornecedor) {
    try {
      const result = await api.get(`financeiro/fornecedores/${item.id}`)
      const fornecedor = result.data;
      // console.log('FORNECEDOR SELECIONADO', fornecedor)

      setValue("id_fornecedor", fornecedor.id?.toString() || '');
      setValue("cnpj_fornecedor", normalizeCnpjNumber(fornecedor.cnpj) || '');
      setValue("nome_fornecedor", fornecedor.nome || '');
      setValue("favorecido", fornecedor.favorecido || '');
      setValue("cnpj_favorecido", fornecedor.cnpj_favorecido || '');
      setValue("id_banco", fornecedor.id_banco?.toString() || '');
      setValue("banco", fornecedor.banco || '');
      setValue("codigo_banco", fornecedor.codigo_banco || '');
      setValue("agencia", fornecedor.agencia || '');
      setValue("dv_agencia", fornecedor.dv_agencia || '');
      setValue("conta", fornecedor.conta || '');
      setValue("dv_conta", fornecedor.dv_conta || '');
      setValue("id_forma_pagamento", fornecedor.id_forma_pagamento?.toString() || '');
      setValue("id_tipo_conta", fornecedor.id_tipo_conta?.toString() || '');
      setValue("id_tipo_chave_pix", fornecedor.id_tipo_chave_pix?.toString() || '');
      setValue("chave_pix", fornecedor.chave_pix || '');
      setModalFornecedorOpen(false);
    } catch (error) {

    }
  }

  // * [ ANEXOS ]
  // Quando um anexo for alterado:
  async function handleChangeFile({ campo, fileUrl }: { campo: string, fileUrl?: string }) {
    try {
      if (id && !fileUrl) {
        await api.post('financeiro/contas-a-pagar/titulo/update-anexo', { campo, fileUrl, id })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro!', description: 'O arquivo pode ter sido excluído, mas não foi possível remover o anexo da solicitação, tente excluir novamente mais tarde!'
      })
    }
  }

  // * [ PLANO DE CONTAS ]
  // Controle de plano de contas
  function showModalPlanoContas() {
    if (!id_matriz) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Selecione primeiro a filial!'
      })
      return
    }
    if (!canEdit) {
      return
    }
    setModalPlanoContasOpen(true);
  }
  const novoItemPlanoContasRef = useRef<HTMLInputElement | null>(null)
  const novoItemIdPlanoContasRef = useRef<HTMLInputElement | null>(null)
  const novoItemValorRef = useRef<HTMLInputElement | null>(null)

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    if (!novoItemPlanoContasRef?.current) return;
    if (!novoItemIdPlanoContasRef?.current) return;

    novoItemPlanoContasRef.current.value = `${item.codigo} - ${item.descricao}`
    novoItemIdPlanoContasRef.current.value = item.id
    setModalPlanoContasOpen(false);
  }

  // * [ CENTRO DE CUSTOS ]
  function showModalCentrosCustos() {
    if (!id_matriz) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Selecione primeiro a filial!'
      })
      return
    }
    if (!canEdit) {
      return
    }
    setModalCentrosCustosOpen(true);
  }
  function handleSelectionCentroCusto(item: CentroCustos) {
    setValue("id_centro_custo", `${item.id}`);
    setValue("centro_custo", item.nome);
    setModalCentrosCustosOpen(false);
  }

  // * [ FORMA DE PAGAMENTO ]
  const showPix = id_forma_pagamento === "4";
  const showDadosBancarios =
    id_forma_pagamento === "2" ||
    id_forma_pagamento === "5" ||
    id_forma_pagamento === "8";

  // ! [ ACTIONS ] //////////////////////////////////////////////
  const { mutate: insertOne, isSuccess: insertOneSuccess } = useTituloPagar().insertOne();
  const { mutate: update, isSuccess: updateSuccess } = useTituloPagar().update();

  const onSubmit = async (data: TituloSchemaProps) => {
    if (!id) {
      insertOne(data)
    };
    if (id) update(data);
  };
  
  useEffect(()=>{
    if(updateSuccess){
      editModal(false);
    }
  }, [updateSuccess])

  useEffect(()=>{
    if (insertOneSuccess) {
      if (parcelas === parcela) {
        closeModal()
      } else {
        const qtde_parcelas = parseInt(parcelas || 1)
        const parcela_atual = parseInt(parcela || 1)
        if (qtde_parcelas > parcela_atual) {
          const proxima_parcela = parcela_atual + 1;
          setValue('parcela', String(proxima_parcela))
          setValue('data_vencimento', '')
          setValue('data_prevista', '')
        }
      }
      console.log('INSERIU COM SUCESSO!')
    }
  }, [insertOneSuccess])

  type changeStatusTituloProps = {
    id_novo_status: string,
    motivo?: string
  }
  const changeStatusTitulo = async ({ id_novo_status, motivo }: changeStatusTituloProps) => {
    try {
      const result = await api.post(`financeiro/contas-a-pagar/titulo/change-status`, { id_titulo: id, id_novo_status, motivo })
      queryClient.invalidateQueries({ queryKey: ['fin_cp_titulos'] })
      queryClient.invalidateQueries({ queryKey: ['fin_cp_titulo'] })
    } catch (error: unknown) {
      // @ts-ignore;
      toast({ variant: 'destructive', title: 'Erro!', description: error?.response?.data?.message || error?.message })
    }
  }

  const handleChangeVoltarSolicitado = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: '1', motivo
    })
  }
  const handleChangeNegar = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: '2', motivo: motivo
    })
  }
  const handleChangeAprovar = () => {
    changeStatusTitulo({
      id_novo_status: '3'
    })
  }
  const handleClickCriarRecorrencia = async (e) => {
    try {
      e.preventDefault()
      const dados = form.getValues();
      try {
        await schemaTitulo.parse(dados)
      } catch (error) {
          form.trigger()
          return;
      }

      await api.post('financeiro/contas-a-pagar/titulo/criar-recorrencia', { ...dados })
      toast({
        variant:'success', title: 'Recorrência criada com sucesso!'
      })
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        title: 'Erro ao tentar criar a recorrência!',
        description: error.response?.data?.message || error.message
      })
    }
  }
  // ! FIM - ACTIONS //////////////////////////////////////

  return (
    <div className="max-w-full  overflow-hidden">
      <ModalPlanoContas
        open={canEdit && modalPlanoContasOpen && !!id_matriz}
        id_matriz={id_matriz}
        tipo="Despesa"
        onOpenChange={() => setModalPlanoContasOpen(prev => !prev)}
        handleSelecion={handleSelectionPlanoContas}
      />

      <ModalCentrosCustos
        handleSelecion={handleSelectionCentroCusto}
        id_matriz={id_matriz}
        // @ts-expect-error 'Vai funcionar'
        onOpenChange={setModalCentrosCustosOpen}
        open={canEdit && modalCentrosCustosOpen && !!id_matriz}
        closeOnSelection={true}
      />

      <Form {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)}>
          <ScrollArea className="flex flex-col max-w-full max-h-[70vh] overflow-hidden">
            {titulo?.status && (
              <div className="flex-1 py-2">
                <div
                  className={`py-1 text-center border text-md font-bold rounded-sm ${generateStatusColor(
                    { status: titulo?.status || "", bg: true, text: true }
                  )}`}
                >
                  {titulo.status}
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 overflow-auto pe-3">
              <div className="max-w-full flex flex-col lg:flex-row gap-5">
                {/* Primeira coluna */}
                <div className="flex flex-1 flex-col gap-3 shrink-0">

                  {/* Dados do Fornecedor */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <Contact />{" "}
                      <span className="text-lg font-bold ">Fornecedor</span>
                      <Button
                        disabled={disabled}
                        type="button"
                        onClick={showModalFornecedor}
                        size={"sm"}
                      >
                        Selecionar
                      </Button>
                      {errors.id_fornecedor?.message && (<span className="rounded-md flex-1 px-3 text-white bg-destructive">{errors.id_fornecedor?.message}</span>)}

                    </div>

                    <div className="flex flex-wrap gap-3 items-end">
                      <FormInput
                        type="hidden"
                        readOnly={true}
                        name="id_filial"
                        control={form.control}
                      />
                      <FormInput
                        className="flex-1 min-w-[18ch]"
                        name="cnpj_fornecedor"
                        readOnly={true}
                        label="CPF/CNPJ"
                        fnMask={normalizeCnpjNumber}
                        control={form.control}
                      />
                      <FormInput
                        className="flex-1 min-w-[50ch] shrink-0"
                        name="nome_fornecedor"
                        readOnly={true}
                        label="Nome do fornecedor"
                        control={form.control}
                      />
                      <SelectFormaPagamento
                        label="Forma de pagamento"
                        name="id_forma_pagamento"
                        control={form.control}
                        disabled={disabled}
                        className="flex-1"
                      />
                      <div
                        className={`${showPix ? "flex flex-1" : "hidden"
                          } gap-3 flex-wrap`}
                      >
                        <SelectTipoChavePix
                          control={form.control}
                          name="id_tipo_chave_pix"
                          label="Tipo Chave PIX"
                          disabled={disabled}
                          className="flex-1"
                        />

                        <FormInput
                          label="Chave PIX"
                          name="chave_pix"
                          control={form.control}
                          readOnly={readOnly}
                          className="flex-1"
                        />
                      </div>
                      {/* Dados bancários do fornecedor */}
                      <div
                        className={`${showDadosBancarios ? "flex" : "hidden"
                          } gap-3 flex-wrap`}
                      >
                        <FormInput
                          label="Favorecido"
                          name="favorecido"
                          control={form.control}
                          readOnly={readOnly}
                          inputClass="min-w-[40ch]"
                          className="flex-1"
                        />

                        <FormInput
                          label="CNPJ Favorecido"
                          name="cnpj_favorecido"
                          control={form.control}
                          readOnly={readOnly}
                          fnMask={normalizeCnpjNumber}
                          inputClass="min-w-[20ch]"
                          className="flex-1"
                        />

                        <FormInput
                          label="Cód. Banco"
                          name="codigo_banco"
                          className="min-w-[4ch]"
                          control={form.control}
                          readOnly={true}
                        />

                        <FormInput
                          label="Banco"
                          name="banco"
                          className="min-w-fit"
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
                          className="min-w-[10ch]"
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
                          className="min-w-[10ch]"
                          control={form.control}
                          readOnly={true}
                        />
                      </div>
                      <ModalFornecedores
                        open={canEdit && modalFornecedorOpen}
                        handleSelecion={handleSelectionFornecedor}
                        onOpenChange={() =>
                          setModalFornecedorOpen((prev) => !prev)
                        }
                      />
                    </div>
                  </div>

                  {/* Dados da solicitação */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <FileText />{" "}
                      <span className="text-lg font-bold ">
                        Dados da solicitação
                      </span>
                    </div>
                    <div className="flex gap-3 flex-wrap items-end">
                      <FormSelect
                        disabled={disabled}
                        name="id_tipo_solicitacao"
                        label={"Tipo de solicitação"}
                        control={form.control}
                        className="flex-1 min-w-[32ch]"
                        options={[
                          { value: "1", label: "Com nota fiscal" },
                          {
                            value: "2",
                            label: "Antecipado / Nota fiscal futura",
                          },
                          { value: "3", label: "Sem nota fiscal" },
                        ]}
                      />

                      <SelectFilial
                        disabled={disabled}
                        name="id_filial"
                        label="Filial"
                        className="flex-1 min-w-[40ch]"
                        control={form.control}
                        onChange={handleChangeFilial}
                      />

                      <FormInput
                        name="id_centro_custo"
                        type={"hidden"}
                        control={form.control}
                      />

                      <FormItem className="flex-1">
                        <div className="flex flex-1 justify-between items-end">
                          <FormLabel>Centro de custo</FormLabel>
                        </div>

                        <Button
                          type="button"
                          disabled={disabled}
                          variant={"ghost"}
                          onClick={showModalCentrosCustos}
                          className="flex flex-1 p-0"
                        >
                          <FormInput
                            readOnly={true}
                            name="centro_custo"
                            control={form.control}
                            className={"flex-1 min-w-[40ch]"}
                          />
                        </Button>
                        {errors.id_centro_custo && <Badge variant={'destructive'}>{errors.id_centro_custo?.message}</Badge>}
                      </FormItem>

                      <FormInput
                        readOnly={!canChangeParcelas}
                        name="num_parcelas"
                        type={"number"}
                        label="Número de parcelas"
                        step='1'
                        min={1}
                        max={365}
                        control={form.control}
                      />

                      <FormInput
                        readOnly={true}
                        name="parcela"
                        type={"number"}
                        label="Parcela"
                        step='1'
                        control={form.control}
                      />

                      <FormDateInput
                        disabled={disabled}
                        name="data_emissao"
                        label="Data de emissão"
                        control={form.control}
                      />
                      <FormDateInput
                        disabled={disabled}
                        name="data_vencimento"
                        label="Data de vencimento"
                        min={getVencimentoMinimo(isMaster)}
                        control={form.control}
                        onChange={onChangeDataVencimento}
                      />

                      <FormDateInput
                        disabled={!isMaster || disabled}
                        name="data_prevista"
                        label="Previsão de Pagamento"
                        control={form.control}
                      />

                      <FormInput
                        readOnly={readOnly}
                        name="num_doc"
                        label="Núm. Doc."
                        className="max-w-[15ch]"
                        control={form.control}
                      />

                      <FormItem className="w-[20ch] text-center">
                        <FormLabel>Valor Total</FormLabel>
                        <Input
                          readOnly={true}
                          className="text-end"
                          value={normalizeCurrency(calcularTotal())}
                          {...form.register('valor')}
                        />
                      </FormItem>

                      <FormInput
                        readOnly={readOnly}
                        className="min-w-[400px] flex-1"
                        name="descricao"
                        label="Descrição do pagamento"
                        control={form.control}
                      />
                    </div>
                  </div>

                  {/* Itens da solicitação */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3 items-center">
                      <List />{" "}
                      <span className="text-lg font-bold ">
                        Itens da Solicitação
                      </span>
                      {errors.itens?.message && <Badge variant={'destructive'}>{errors.itens?.message}</Badge>}
                    </div>
                    {canEdit && modalEditing && (
                      <>
                        <div className="flex gap-3 mb-3 rounded-md items-end">
                          {/* Plano contas */}
                          <Input
                            type="hidden"
                            ref={novoItemIdPlanoContasRef}
                            readOnly={true}
                            name="id_plano_contas"
                          />
                          <FormItem className="w-full">
                            <div className="flex justify-between items-end">
                              <FormLabel>Plano de Contas</FormLabel>
                            </div>
                            <Button
                              type="button"
                              variant={"ghost"}
                              onClick={showModalPlanoContas}
                              className="w-full p-0"
                            >
                              <Input
                                ref={novoItemPlanoContasRef}
                                className="w-full"
                                readOnly={true}
                                placeholder="Selecione o plano de contas"
                              />
                            </Button>
                          </FormItem>
                          <FormItem>
                            <div className="flex justify-between items-end">
                              <FormLabel>Valor</FormLabel>
                            </div>
                            <Input
                              type="number"
                              ref={novoItemValorRef}
                              className="max-w-40 text-end"
                            />
                          </FormItem>

                          <Button className="ms-auto" type="button" onClick={handleAddItem}>
                            <ArrowDown size={18} className="me-2" /> Add item
                          </Button>
                        </div>
                        <Separator className="my-4 bg-gray-900" />
                      </>
                    )}
                    <div className="flex gap-3">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-center pl-2">Item</th>
                            <th className="text-left pl-2">Plano de contas</th>
                            <th className="text-center pl-2">Valor</th>
                            {canEdit && modalEditing && (
                              <th className="text-left max-w-[20ch]">Ação</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {itens?.map((item, index) => (
                            <tr key={item.id}>
                              <td className="mt-1 text-center flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                {index + 1}
                              </td>
                              <td className="p-1 w-full">
                                <FormInput
                                  className="w-full"
                                  readOnly={true}
                                  name={`itens.${index}.plano_conta`}
                                  control={form.control}
                                />
                              </td>
                              <td className="p-1">
                                <FormInput
                                  type="number"
                                  className="min-w-40 text-center"
                                  readOnly={readOnly}
                                  name={`itens.${index}.valor`}
                                  inputClass="text-end pe-3"
                                  control={form.control}
                                  onChange={handleChangeItemValue}
                                  min={0.1}
                                />
                              </td>
                              {canEdit && modalEditing && (
                                <td>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                      if (itens.length === 1) {
                                        toast({
                                          variant: 'destructive',
                                          title: 'Ops!',
                                          description: 'Tem que ter pelo menos um item na solicitação!'
                                        })
                                        return
                                      }
                                      handleRemoveItem(index);
                                    }}
                                  >
                                    <Trash size={18} />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                    </div>
                  </div>

                  {/* Rateio de filiais */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3 items-center">
                      <Divide />{" "}
                      <span className="text-lg font-bold ">
                        Dados do rateio
                      </span>
                      {errors.itens_rateio?.message && <Badge variant={'destructive'}>{errors.itens_rateio?.message}</Badge>}
                    </div>

                    <div className="flex gap-3 flex-wrap items-end">
                      <SelectTipoRateio
                        label="Tipo de rateio"
                        name="id_rateio"
                        disabled={disabled}
                        id_grupo_economico={id_grupo_economico}
                        control={form.control}
                        onChange={handleChangeRateio}
                      />

                      <div className="flex items-center gap-3">
                        <Button onClick={handleClickExportarRateio} variant={'success'}><Download size={18} className="me-2" /> Exportar Padrão</Button>

                        <input className="hidden" type="file" ref={fileImportRateioRef} onChange={handleChangeImportarRateio} />
                        {canEditRateio && rateio_manual && (
                          <Button onClick={handleClickImportarRateio} variant={'tertiary'}><Upload size={18} className="me-2" /> Importar Rateio</Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-baseline mt-3">
                      <span className="text-md font-medium">
                        Itens do rateio
                      </span>
                      {canEditRateio && rateio_manual && (
                        <Button type="button" onClick={handleAddItemRateio}>
                          <Plus size={18} className="me-2" /> Novo item Rateio
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left pl-2">Filial</th>
                            <th className="text-center pl-2">Percentual</th>
                            {canEditItensRateio && (
                              <th className="text-left max-w-[20ch]">Ação</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {itensRateio?.map((item, index) => (
                            <tr key={item.id}>
                              <td className="p-1 w-full">
                                <SelectFilial
                                  name={`itens_rateio.${index}.id_filial`}
                                  id_grupo_economico={id_grupo_economico}
                                  disabled={!canEditItensRateio}
                                  control={form.control}
                                />
                              </td>
                              <td className="p-1 min-w-40">
                                <FormInput
                                  type="number"
                                  readOnly={!canEditItensRateio}
                                  name={`itens_rateio.${index}.percentual`}
                                  control={form.control}
                                  inputClass="text-end pe-3"
                                  icon={Percent}
                                  step="0.0001"
                                  min={0.0001}
                                  max={100}
                                  onChange={handleChangeItemRateio}
                                />
                              </td>
                              {canEditItensRateio && (
                                <td>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className=""
                                    onClick={() => {
                                      handleRemoveItemRateio(index);
                                    }}
                                  >
                                    <Trash size={18} />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-2 text-muted-foreground">
                        <span>Total percentual: </span>
                        {itensRateio.reduce((acc, curr) => { return acc + parseFloat(curr.percentual) }, 0).toFixed(2).replace('.', ',')}%
                      </div>
                    </div>
                  </div>

                  {/* Histórico da solicitação */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <History />{" "}
                      <span className="text-lg font-bold ">
                        Histórico do título
                      </span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-auto max-h-72">
                      {data?.historico?.map((h) => (
                        <p key={`hist.${h.id}`} className="text-xs">
                          {formatarDataHora(h.created_at)}: {formatarHistorico(h.descricao)}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Fim da primeira coluna */}
                </div>

                {/* Segunda coluna */}
                <div className="max-w-full lg:max-w-[300px] flex shrink-0 flex-col gap-3 bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
                  {/* Anexos */}
                  <div className="flex gap-2 font-bold mb-3">
                    <FileIcon /> <span>Anexos</span>
                  </div>

                  <FormFileUpload
                    disabled={disabled}
                    label="XML Nota fiscal"
                    name="url_xml"
                    mediaType="xml"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_xml' })}
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Nota fiscal"
                    name="url_nota_fiscal"
                    mediaType="pdf"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_nota_fiscal' })}
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Boleto"
                    name="url_boleto"
                    mediaType="pdf"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_boleto' })}
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Contrato/Autorização"
                    name="url_contrato"
                    mediaType="etc"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_contrato' })}
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Planilha"
                    name="url_planilha"
                    mediaType="excel"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_planilha' })}
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Arquivo remessa"
                    name="url_txt"
                    mediaType="txt"
                    control={form.control}
                    onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: 'url_txt' })}
                  />
                </div>
              </div>
            </ScrollArea>
          </ScrollArea>
          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-3 items-center">
              {id && status !== 'Solicitado' && status !== 'Pago' && (isMaster === true && (status === 'Aprovado' || status === 'Negado') ? true : false) && (
                <ButtonMotivation variant={'secondary'} size={'lg'} action={handleChangeVoltarSolicitado}>
                  <Undo2 className="me-2" size={18} />Tornar solicitado
                </ButtonMotivation>
              )}
              {isMaster && id && status !== 'Negado' && status !== 'Pago' && (
                <ButtonMotivation variant={'destructive'} size={'lg'} action={handleChangeNegar}>
                  <X className="me-2" size={18} />Negar
                </ButtonMotivation>
              )}
              {isMaster && id && status !== 'Aprovado' && status !== 'Pago' && (
                <Button type="button" variant={'success'} size={'lg'} onClick={handleChangeAprovar}>
                  <Check className="me-2" size={18} />Aprovar
                </Button>
              )}
              {id && isMaster && (
                <Button type="button" variant={'secondary'} size={'lg'} onClick={handleClickCriarRecorrencia}>
                  <Repeat2 className="me-2" size={18} />Criar Recorrência
                </Button>
              )}
            </div>
            <div className="flex gap-3 items-center">
              {canEdit && modalEditing && (
                <>
                  <Button onClick={() => editModal(false)} size="lg" variant={'secondary'}><Ban className="me-2" size={18} /> Cancelar</Button>
                  <Button type="submit" size="lg" variant={'default'}><Save className="me-2" size={18} />{id ? 'Salvar' : 'Solicitar'}</Button>
                </>
              )
              }
              {canEdit && !modalEditing && (
                <Button onClick={() => editModal(true)} size="lg" variant={'warning'}><Pen size={18} className="me-2" /> Editar</Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
