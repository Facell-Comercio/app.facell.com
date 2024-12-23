import ButtonMotivation from "@/components/custom/ButtonMotivation";
import FormDateInput from "@/components/custom/FormDate";
import FormFileUpload from "@/components/custom/FormFileUpload";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import SelectTipoContaBancaria from "@/components/custom/SelectTipoContaBancaria";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { checkUserDepartments, hasPermission } from "@/helpers/checkAuthorization";
import { formatarDataHora } from "@/helpers/format";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { api } from "@/lib/axios";
import ModalFornecedores, { ItemFornecedor } from "@/pages/financeiro/components/ModalFornecedores";

import fetchApi from "@/api/fetchApi";
import AlertPopUp from "@/components/custom/AlertPopUp";
import SelectCartao from "@/components/custom/SelectCartao";
import { SelectFormaPagamento } from "@/components/custom/SelectFormaPagamento";
import SelectUserDepartamento from "@/components/custom/SelectUserDepartamento";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ModalFiliais from "@/pages/admin/components/ModalFiliais";
import { Filial } from "@/types/filial-type";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Archive,
  Ban,
  Check,
  Contact,
  FileIcon,
  FileText,
  History,
  Pen,
  RotateCcw,
  Save,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, UseFormReturn, useWatch } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { TbCurrencyReal } from "react-icons/tb";
import SecaoRateio from "./components/form/rateio/SecaoRateio";
import SecaoVencimentos from "./components/form/vencimento/SecaoVencimentos";
import { TituloSchemaProps } from "./form-data";
import {
  checkIsCartao,
  checkIsPIX,
  checkIsTransferenciaBancaria,
  formatarHistorico,
} from "./helpers/helper";
import { useStoreTituloPagar } from "./store";

const FormTituloPagar = ({
  id,
  form,
  handleInsertTitulo,
}: {
  id: string | null | undefined;
  form: UseFormReturn<TituloSchemaProps> | any | undefined;
  handleInsertTitulo?: (id_titulo: number) => void;
  // formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const queryClient = useQueryClient();

  const modalEditing = useStoreTituloPagar().modalEditing;
  const editModal = useStoreTituloPagar().editModal;
  const closeModal = useStoreTituloPagar().closeModal;
  const [modalFornecedorOpen, setModalFornecedorOpen] = useState<boolean>(false);

  const data = form?.getValues() || {};
  const titulo = data;

  const {
    reset: resetForm,
    setValue,
    formState: { errors },
  } = form;

  useEffect(() => {
    return () => {
      // Reseta o form ao desmontar o componente...
      resetForm();
    };
  }, []);
  // console.log("ERROS_TITULO:", errors);

  // * [ WATCHES ]
  // const wfull = form.watch();
  // console.log(wfull);
  const url_nota_fiscal = useWatch({
    name: "url_nota_fiscal",
    control: form.control,
  });
  const id_grupo_economico = useWatch({
    name: "id_grupo_economico",
    control: form.control,
  });
  const id_matriz = useWatch({
    name: "id_matriz",
    control: form.control,
  });
  const id_forma_pagamento = useWatch({
    name: "id_forma_pagamento",
    control: form.control,
  });
  const id_cartao = useWatch({
    name: "id_cartao",
    control: form.control,
  });
  const valorTotalTitulo = parseFloat(
    useWatch({
      name: "valor",
      control: form.control,
    }) || "0"
  );

  // * [ VERIFICAÇÕES ]
  const status = titulo?.status || "Solicitado";
  const id_status = parseInt(titulo?.id_status) ?? 1;

  const isMaster = checkUserDepartments("FINANCEIRO") || hasPermission("MASTER");

  const canEdit = !id || status === "Solicitado" || (isMaster && id_status > 0 && id_status < 3);
  const readOnly = !canEdit || !modalEditing;
  const disabled = !canEdit || !modalEditing;

  const podeArquivar = id && (status == "Solicitado" || status == "Negado");

  const podeResolicitar =
    id &&
    status !== "Solicitado" &&
    (id_status < 3 || (isMaster === true && status === "Aprovado" ? true : false));

  const podeNegar = isMaster && id && status !== "Negado" && id_status > 0 && id_status < 4;
  const podeAprovar = isMaster && id && status !== "Aprovado" && id_status > 0 && id_status < 4;

  const podeAnexarNotaFiscal = id_status < 3 || !(id_status >= 3 && !!url_nota_fiscal);
  const podeExcluirNotaFiscal = id_status < 3 || isMaster;

  const canSelectFilial = id_forma_pagamento == 6 ? !!id_cartao : true;

  // * [ FORNECEDOR ]
  function showModalFornecedor() {
    setModalFornecedorOpen(true);
  }

  async function checkDoc() {
    const result = await fetchApi.financeiro.contas_pagar.titulos.checkDoc({
      id_fornecedor: form.watch("id_fornecedor"),
      num_doc: form.watch("num_doc"),
    });
    if (result > 0) {
      toast({
        variant: "warning",
        title: "Atenção!",
        // @ts-ignore
        description: `${
          result === 1 ? `Existe 1 solicitação` : `Existem ${result} solicitações`
        } no sistema com esse fornecedor e número de documento`,
      });
    }
  }

  // Quando escolher um fornecedor:
  async function handleSelectionFornecedor(item: ItemFornecedor) {
    try {
      const result = await api.get(`financeiro/fornecedores/${item.id}`);
      const fornecedor = result.data;
      // console.log('FORNECEDOR SELECIONADO', fornecedor)

      setValue("id_fornecedor", fornecedor.id?.toString() || "");
      setValue("cnpj_fornecedor", normalizeCnpjNumber(fornecedor.cnpj) || "");
      setValue("nome_fornecedor", fornecedor.nome || "");
      setValue("favorecido", fornecedor.favorecido || "");
      setValue("cnpj_favorecido", fornecedor.cnpj_favorecido || "");
      setValue("id_banco", fornecedor.id_banco?.toString() || "");
      setValue("banco", fornecedor.banco || "");
      setValue("codigo_banco", fornecedor.codigo_banco || "");
      setValue("agencia", fornecedor.agencia || "");
      setValue("dv_agencia", fornecedor.dv_agencia || "");
      setValue("conta", fornecedor.conta || "");
      setValue("dv_conta", fornecedor.dv_conta || "");
      setValue("id_forma_pagamento", fornecedor.id_forma_pagamento?.toString() || "");
      setValue("id_tipo_conta", fornecedor.id_tipo_conta?.toString() || "");
      setValue("id_tipo_chave_pix", fornecedor.id_tipo_chave_pix?.toString() || "");
      setValue("chave_pix", fornecedor.chave_pix || "");
      setModalFornecedorOpen(false);
    } catch (error) {}
    checkDoc();
  }

  // * [ ANEXOS ]
  // Quando um anexo for alterado:
  async function handleChangeFile({ campo, fileUrl }: { campo: string; fileUrl?: string }) {
    try {
      if (id) {
        const result = await api.post("financeiro/contas-a-pagar/titulo/update-anexo", {
          campo,
          fileUrl,
          id,
        });
        // @ts-ignore
        form.setValue(campo, result.data.fileUrl || "");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description:
          "O arquivo pode ter sido excluído, mas não foi possível remover o anexo da solicitação, tente excluir novamente mais tarde!",
      });
    }
  }

  // * [ FORMA DE PAGAMENTO ]
  const showPix = checkIsPIX(id_forma_pagamento);
  const showCartao = checkIsCartao(id_forma_pagamento);
  // Liberada a visualização de dados bancários caso forma de pagamento = Dinheiro ou Transferência:
  const showDadosBancarios = checkIsTransferenciaBancaria(id_forma_pagamento) || id_forma_pagamento == 3;

  // ! [ ACTIONS ] //////////////////////////////////////////////
  const [isSubmtting, setIsSubmitting] = useState<boolean>(false);

  const {
    data: dataInsertOne,
    mutate: insertOne,
    isSuccess: insertOneSuccess,
    isPending: isPendingInsert,
  } = useTituloPagar().insertOne();
  const {
    mutate: update,
    isSuccess: updateSuccess,
    isPending: isPendingUpdate,
  } = useTituloPagar().update();

  useEffect(() => {
    if (isPendingInsert || isPendingUpdate) {
      setIsSubmitting(true);
    } else {
      setIsSubmitting(false);
    }
  }, [isPendingInsert, isPendingUpdate]);

  const onSubmit: SubmitHandler<TituloSchemaProps> = async (data) => {
    if (!id) {
      // console.log("Inserindo Titulo:", data);
      insertOne(data);
      return;
    }
    if (id) {
      // console.log("Atualizando Titulo:", data);
      update(data);
      return;
    }
  };

  useEffect(() => {
    if (updateSuccess) {
      editModal(false);
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (insertOneSuccess) {
      handleInsertTitulo && handleInsertTitulo(dataInsertOne.id_titulo);

      resetForm();
      closeModal();

      if (titulo.id_recorrencia) {
        queryClient.invalidateQueries({
          queryKey: ["financeiro", "contas_pagar", "recorrencia"],
        });
      }
    }
  }, [insertOneSuccess]);

  type changeStatusTituloProps = {
    id_novo_status: string;
    motivo?: string;
  };
  const changeStatusTitulo = async ({ id_novo_status, motivo }: changeStatusTituloProps) => {
    try {
      await api.post(`financeiro/contas-a-pagar/titulo/change-status`, {
        id_titulo: id,
        id_novo_status,
        motivo,
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_pagar"],
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro!",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    }
  };

  const handleClickArquivar = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: "0",
      motivo,
    });
  };
  const handleChangeVoltarSolicitado = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: "1",
      motivo,
    });
  };
  const handleChangeNegar = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: "2",
      motivo: motivo,
    });
  };
  const handleChangeAprovar = () => {
    changeStatusTitulo({
      id_novo_status: "3",
    });
  };

  async function processarXml({ fileUrl }: { fileUrl: string }) {
    try {
      if (!fileUrl) {
        return;
      }
      const data = await fetchApi.financeiro.contas_pagar.titulos.processarXml(fileUrl);

      if (data) {
        const { fornecedor, filial, num_doc, valor, data_emissao } = data;
        if (fornecedor) {
          form.setValue("id_fornecedor", String(fornecedor.id));
          form.setValue("id_forma_pagamento", String(fornecedor.id_forma_pagamento));
          form.setValue("cnpj_fornecedor", String(fornecedor.cnpj));
          form.setValue("nome_fornecedor", String(fornecedor.nome));
        }
        if (filial) {
          form.setValue("filial", String(filial.nome));
          form.setValue("id_filial", String(filial.id));
          form.setValue("id_matriz", String(filial.id_matriz));
          form.setValue("id_grupo_economico", String(filial.id_grupo_economico));
        }
        form.setValue("num_doc", String(num_doc));
        if (valor) {
          form.setValue("valor", String(valor));
        }
        form.setValue("data_emissao", String(data_emissao));
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error.message,
      });
    }
  }

  // ! FIM - ACTIONS //////////////////////////////////////
  const [modalFilialOpen, setModalFilialOpen] = useState<boolean>(false);
  const handleSelectionFilial = (item: Filial) => {
    setValue("id_filial", String(item.id));
    setValue("id_grupo_economico", String(item.id_grupo_economico));
    setValue("id_matriz", String(item.id_matriz));

    setValue("filial", String(item.nome));
  };
  const showModalFilial = () => {
    setModalFilialOpen(true);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        method="POST"
        className="max-w-screen-xl w-full grid grid-cols-1 lg:grid-rows-[1fr_auto] lg:grid-cols-[1fr_auto] z-[100]"
      >
        <ModalFiliais
          open={modalFilialOpen}
          handleSelection={handleSelectionFilial}
          onOpenChange={setModalFilialOpen}
          id_grupo_economico={id_grupo_economico}
          closeOnSelection
        />
        <section className="overflow-auto scroll-thin z-[100] flex flex-col max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
          {titulo?.status && (
            <div className="py-2">
              <div
                className={`py-1 text-white text-center border text-md font-bold rounded-sm ${generateStatusColor(
                  {
                    status: titulo?.status || "",
                    bg: true,
                    text: true,
                  }
                )}`}
              >
                {titulo.status}
              </div>
            </div>
          )}

          <section className="overflow-auto scroll-thin z-[100] flex-1 ">
            <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 z-[100]">
              {/* Primeira coluna */}
              <div className="grid gap-3 flex-shrink-0 flex-grow-0">
                {/* Dados do Fornecedor */}
                <div className="flex flex-col p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <Contact />
                    <span className="text-lg font-bold">Fornecedor</span>
                    <div>
                      {errors.id_fornecedor?.message && (
                        <Badge variant={"destructive"}>{errors.id_fornecedor?.message || ""}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 items-end  z-50">
                    <FormInput
                      className="flex-1 min-w-[18ch]"
                      name="cnpj_fornecedor"
                      readOnly={true}
                      label="CPF/CNPJ"
                      fnMask={normalizeCnpjNumber}
                      placeholder="SELECIONE O FORNECEDOR"
                      control={form.control}
                      disabled={disabled}
                      onClick={showModalFornecedor}
                    />
                    <FormInput
                      className="flex-1 min-w-[30ch] sm:min-w-[40ch] shrink-0"
                      name="nome_fornecedor"
                      placeholder="SELECIONE O FORNECEDOR"
                      readOnly={true}
                      label="Nome do fornecedor"
                      control={form.control}
                      disabled={disabled}
                      onClick={showModalFornecedor}
                    />

                    <SelectFormaPagamento
                      label="Forma de pagamento"
                      name="id_forma_pagamento"
                      control={form.control}
                      disabled={disabled}
                      className="flex-1 min-w-[15ch]"
                    />
                    <div className={`${showPix ? "flex w-full" : "hidden"} gap-3 flex-wrap`}>
                      <SelectTipoChavePix
                        control={form.control}
                        name="id_tipo_chave_pix"
                        label="Tipo Chave PIX"
                        disabled={disabled}
                        className="flex-1 min-w-[20ch]"
                      />

                      <FormInput
                        label="Chave PIX"
                        name="chave_pix"
                        control={form.control}
                        readOnly={readOnly}
                        className="flex-1 min-w-[20ch]"
                      />
                    </div>
                    <div className={`flex gap-3 ${showCartao ? "flex w-full" : "hidden"}`}>
                      <SelectCartao
                        control={form.control}
                        name="id_cartao"
                        label="Cartão"
                        disabled={disabled}
                        className={`flex-1 min-w-[30ch]`}
                        onChange={async (id) => {
                          await api.get(`/financeiro/contas-a-pagar/cartoes/${id}`).then((data) => {
                            form.setValue("dia_vencimento_cartao", data.data.dia_vencimento);
                            form.setValue("dia_corte_cartao", data.data.dia_corte);
                            form.setValue("id_matriz", data.data.id_matriz);
                            form.setValue("id_grupo_economico", data.data.id_grupo_economico);
                            form.setValue("itens_rateio", []);
                          });
                        }}
                      />
                      <FormInput
                        className="flex-1 min-w-[20ch] shrink-0"
                        name="dia_vencimento_cartao"
                        readOnly
                        label="Dia do vencimento"
                        control={form.control}
                        disabled={disabled}
                      />
                      <FormInput
                        className="flex-1 min-w-[20ch] shrink-0"
                        name="dia_corte_cartao"
                        readOnly
                        label="Dia de Corte"
                        control={form.control}
                        disabled={disabled}
                      />
                    </div>
                    {/* Dados bancários do fornecedor */}
                    {showDadosBancarios && (
                      <>
                        <FormInput
                          label="Favorecido"
                          name="favorecido"
                          control={form.control}
                          readOnly={readOnly}
                          inputClass="flex-1 min-w-[30ch] sm:min-w-[40ch]"
                          className="flex-1"
                          disabled={disabled}
                        />

                        <FormInput
                          label="CNPJ Favorecido"
                          name="cnpj_favorecido"
                          control={form.control}
                          readOnly={readOnly}
                          fnMask={normalizeCnpjNumber}
                          inputClass="min-w-[20ch]"
                          className="flex-1"
                          disabled={disabled}
                        />

                        <FormInput
                          label="Cód. Banco"
                          name="codigo_banco"
                          className="min-w-[10ch]"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />

                        <FormInput
                          label="Banco"
                          name="banco"
                          className="min-w-fit"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />

                        <FormInput
                          label="Agência"
                          name="agencia"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />

                        <FormInput
                          label="Dv. Ag."
                          name="dv_agencia"
                          className="min-w-[10ch]"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />

                        <SelectTipoContaBancaria
                          label="Tipo conta"
                          name="id_tipo_conta"
                          className="min-w-[15ch]"
                          control={form.control}
                          disabled={disabled}
                        />

                        <FormInput
                          label="Conta"
                          name="conta"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />

                        <FormInput
                          label="Dv. Conta"
                          name="dv_conta"
                          className="min-w-[10ch]"
                          control={form.control}
                          readOnly={true}
                          disabled={disabled}
                        />
                      </>
                    )}

                    <ModalFornecedores
                      open={canEdit && modalFornecedorOpen}
                      handleSelection={handleSelectionFornecedor}
                      onOpenChange={() => setModalFornecedorOpen((prev) => !prev)}
                    />
                  </div>
                </div>

                {/* Dados da solicitação */}
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <FileText /> <span className="text-lg font-bold ">Dados da solicitação</span>
                  </div>

                  <div className="grid gap-3 flex-wrap items-end">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <FormSelect
                        disabled={disabled}
                        name="id_tipo_solicitacao"
                        label={"Tipo de solicitação"}
                        control={form.control}
                        className="flex-1 min-w-[32ch]"
                        options={[
                          {
                            value: "1",
                            label: "Com nota fiscal",
                          },
                          {
                            value: "2",
                            label: "Antecipado / Nota fiscal futura",
                          },
                          {
                            value: "3",
                            label: "Sem nota fiscal",
                          },
                          {
                            value: "4",
                            label: "Impostos / Concessionárias",
                          },
                        ]}
                      />

                      <span className="space-y-2">
                        <span className="flex justify-between gap-2">
                          <label className="text-sm font-medium">Filial</label>
                          <AlertPopUp
                            title="Deseja realmente redefinir a filial?"
                            description="Todos os campos relacionados a essa filial serão resetados"
                            action={() => {
                              form.setValue("itens_rateio", []);
                              form.setValue("id_filial", "");
                              form.setValue("filial", "");
                              form.setValue("id_matriz", "");
                              form.setValue("id_grupo_economico", "");
                              form.setValue("id_cartao", "");
                            }}
                          >
                            <Button
                              variant={"destructive"}
                              size={"xss"}
                              title="Redefinir filial"
                              disabled={disabled}
                            >
                              <RotateCcw size={13} />
                            </Button>
                          </AlertPopUp>
                        </span>
                        <FormInput
                          readOnly={true}
                          name="filial"
                          placeholder="SELECIONE A FILIAL"
                          control={form.control}
                          inputClass="sm:min-w-[100px]"
                          disabled={disabled || !canSelectFilial}
                          onClick={showModalFilial}
                        />
                      </span>
                      <span className="lg:col-span-2 min-w-[20ch]">
                        <SelectUserDepartamento
                          label="Departamento"
                          name="id_departamento"
                          disabled={disabled}
                          className="flex-1 w-full min-w-[20ch]"
                          form={form}
                        />
                      </span>
                    </div>

                    <div className="max-w-full flex flex-wrap gap-3">
                      <FormDateInput
                        disabled={disabled}
                        name="data_emissao"
                        label="Data de emissão"
                        control={form.control}
                        className="flex-1 min-w-[15ch]"
                      />

                      <FormInput
                        readOnly={readOnly}
                        name="num_doc"
                        label="Núm. Doc."
                        className={"flex-1 min-w-[15ch]"}
                        control={form.control}
                        onBlur={() => checkDoc()}
                        disabled={disabled}
                      />

                      <FormInput
                        control={form.control}
                        inputClass="text-left"
                        name="valor"
                        type="number"
                        iconLeft
                        icon={TbCurrencyReal}
                        label="Valor Total"
                        disabled={disabled}
                        className="flex-1 min-w-[20ch]"
                      />
                    </div>

                    <FormInput
                      readOnly={readOnly}
                      className="flex-1 trunkate sm:min-w-[400px]"
                      name="descricao"
                      inputClass="uppercase"
                      label="Descrição do pagamento"
                      control={form.control}
                      disabled={disabled}
                    />
                  </div>
                </div>

                {/* Abas Vencimentos / Rateio entre filiais */}
                {valorTotalTitulo > 0 && !!id_matriz ? (
                  <div className="overflow-auto">
                    <Tabs defaultValue="vencimentos" className="overflow-auto">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="vencimentos">
                          <div className="flex gap-3">
                            <span>Vencimentos</span>
                            {errors.vencimentos?.message && (
                              <Popover>
                                <PopoverTrigger>
                                  <Badge variant={"destructive"}>Atenção</Badge>
                                </PopoverTrigger>
                                <PopoverContent className="bg-destructive text-destructive-foreground text-wrap">
                                  {errors.vencimentos.message}
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </TabsTrigger>
                        <TabsTrigger value="rateio">
                          <div className="flex gap-3">
                            <span>Rateio da solicitação</span>
                            {errors.itens_rateio?.message && (
                              <Popover>
                                <PopoverTrigger>
                                  <Badge variant={"destructive"}>Atenção</Badge>
                                </PopoverTrigger>
                                <PopoverContent className="bg-destructive text-destructive-foreground text-wrap">
                                  {errors.itens_rateio.message}
                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="vencimentos" className="orverflow-auto">
                        <SecaoVencimentos
                          id={id}
                          form={form}
                          canEdit={canEdit}
                          modalEditing={modalEditing}
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                      </TabsContent>

                      <TabsContent value="rateio" className="orverflow-auto">
                        <SecaoRateio
                          id={id}
                          form={form}
                          disabled={disabled}
                          canEdit={canEdit}
                          modalEditing={modalEditing}
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>
                      {valorTotalTitulo > 0 ? "Selecione a filial!" : "Preencha o valor!"}
                    </AlertTitle>
                  </Alert>
                )}

                {/* Histórico */}
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <History /> <span className="text-lg font-bold ">Histórico</span>
                  </div>
                  <ScrollArea className={"flex flex-col gap-3 max-h-72 z-[999]"}>
                    {
                      // @ts-ignore
                      data?.historico?.map((h, index) => (
                        <p key={`hist.${h.id}.${index}`} className="text-xs my-2">
                          {formatarDataHora(h.created_at)}: {formatarHistorico(h.descricao)}
                        </p>
                      ))
                    }
                  </ScrollArea>
                </div>

                {/* Fim da primeira coluna */}
              </div>

              {/* Segunda coluna */}
              <div className="max-w-full flex-1 lg:max-w-[300px] flex shrink-0 flex-col gap-3 bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
                {/* Anexos */}
                <div className="flex gap-2 font-bold mb-3">
                  <FileIcon /> <span>Anexos</span>
                </div>

                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  label="XML Nota fiscal"
                  name="url_xml"
                  mediaType="xml"
                  control={form.control}
                  onChange={(fileUrl: string) => {
                    handleChangeFile({
                      fileUrl,
                      campo: "url_xml",
                    });
                    processarXml({ fileUrl });
                  }}
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={!podeAnexarNotaFiscal}
                  canDelete={podeExcluirNotaFiscal}
                  label="Nota fiscal"
                  name="url_nota_fiscal"
                  mediaType="pdf"
                  control={form.control}
                  onChange={(fileUrl: string) => {
                    handleChangeFile({
                      fileUrl,
                      campo: "url_nota_fiscal",
                    });
                  }}
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  label="Boleto"
                  name="url_boleto"
                  mediaType="pdf"
                  control={form.control}
                  onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: "url_boleto" })}
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  label="Contrato/Autorização"
                  name="url_contrato"
                  mediaType="etc"
                  control={form.control}
                  onChange={(fileUrl: string) =>
                    handleChangeFile({
                      fileUrl,
                      campo: "url_contrato",
                    })
                  }
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  label="Planilha"
                  name="url_planilha"
                  mediaType="excel"
                  control={form.control}
                  onChange={(fileUrl: string) =>
                    handleChangeFile({
                      fileUrl,
                      campo: "url_planilha",
                    })
                  }
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  label="Arquivo remessa"
                  name="url_txt"
                  mediaType="remessa"
                  control={form.control}
                  onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: "url_txt" })}
                />
              </div>
            </div>
          </section>
        </section>

        <div className="max-w-full flex justify-between sm:items-center mt-4 gap-3 sm:gap-0 col-span-2">
          {isSubmtting ? (
            <div className="flex gap-3 items-center">
              <span className="font-lg">Aguarde...</span> {<FaSpinner className="animate-spin" />}
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 items-center">
                {podeArquivar && (
                  <ButtonMotivation
                    title="Arquiva a solictação para sumir da vista."
                    variant={"secondary"}
                    size={"lg"}
                    action={handleClickArquivar}
                  >
                    <Archive className="me-2" size={18} />
                    Arquivar
                  </ButtonMotivation>
                )}
                {podeResolicitar && (
                  <ButtonMotivation
                    title="Volta o status da solicitação para 'Solicitado', possibilitando a edição..."
                    variant={"secondary"}
                    size={"lg"}
                    action={handleChangeVoltarSolicitado}
                  >
                    <Undo2 className="me-2" size={18} />
                    Re-Solicitar
                  </ButtonMotivation>
                )}
                {podeNegar && (
                  <ButtonMotivation variant={"destructive"} size={"lg"} action={handleChangeNegar}>
                    <X className="me-2" size={18} />
                    Negar
                  </ButtonMotivation>
                )}
                {podeAprovar && (
                  <Button
                    type="button"
                    variant={"success"}
                    size={"lg"}
                    onClick={handleChangeAprovar}
                  >
                    <Check className="me-2" size={18} />
                    Aprovar
                  </Button>
                )}
              </div>

              <div className="flex gap-3 flex-wrap items-center">
                {canEdit && modalEditing && (
                  <>
                    <Button
                      onClick={() => editModal(false)}
                      size="lg"
                      variant={"secondary"}
                      className={!id ? "hidden" : ""}
                    >
                      <Ban className="me-2" size={18} /> Cancelar
                    </Button>
                    <Button type="submit" size="lg" variant={"default"}>
                      <Save className="me-2" size={18} />
                      {id ? "Salvar" : "Solicitar"}
                    </Button>
                  </>
                )}
                {canEdit && !modalEditing && (
                  <Button onClick={() => editModal(true)} size="lg" variant={"warning"}>
                    <Pen size={18} className="me-2" /> Editar
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </form>
    </Form>
  );
};

export default FormTituloPagar;
