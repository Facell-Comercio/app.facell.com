import ButtonMotivation from "@/components/custom/ButtonMotivation";
import FormDateInput from "@/components/custom/FormDate";
import FormFileUpload from "@/components/custom/FormFileUpload";
import FormInput from "@/components/custom/FormInput";
import FormSelect from "@/components/custom/FormSelect";
import SelectFormaPagamento from "@/components/custom/SelectFormaPagamento";
import SelectTipoChavePix from "@/components/custom/SelectTipoChavePix";
import SelectTipoContaBancaria from "@/components/custom/SelectTipoContaBancaria";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import {
  checkUserDepartments,
  checkUserPermission,
} from "@/helpers/checkAuthorization";
import { formatarDataHora } from "@/helpers/format";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { useTituloPagar } from "@/hooks/financeiro/useTituloPagar";
import { api } from "@/lib/axios";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";

import SelectUserDepartamento from "@/components/custom/SelectUserDepartamento";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  Repeat2,
  Save,
  Undo2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useWatch } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { TbCurrencyReal } from "react-icons/tb";
import SecaoRateio from "./components/form/rateio/SecaoRateio";
import SecaoVencimentos from "./components/form/vencimento/SecaoVencimentos";
import { TituloSchemaProps, useFormTituloData } from "./form-data";
import {
  checkIsPIX,
  checkIsTransferenciaBancaria,
  formatarHistorico,
} from "./helpers/helper";
import { initialPropsTitulo, useStoreTitulo } from "./store";

const FormTituloPagar = ({
  id,
  data,
}: {
  id: string | null | undefined;
  data: TituloSchemaProps;
  // formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const queryClient = useQueryClient();

  const modalEditing = useStoreTitulo().modalEditing;
  const editModal = useStoreTitulo().editModal;
  const closeModal = useStoreTitulo().closeModal;
  const [modalFornecedorOpen, setModalFornecedorOpen] =
    useState<boolean>(false);

  const titulo =
    {
      ...data,
      update_vencimentos: false,
      update_rateio: false,
    } || initialPropsTitulo;
  // console.log(titulo);

  // * [ VERIFICAÇÕES ]
  const status = titulo?.status || "Solicitado";
  const id_status = parseInt(titulo?.id_status) ?? 1;

  const isMaster =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");
  // const canEdit =
  //   !id ||
  //   status === "Solicitado" ||
  //   (isMaster &&
  //     status !== "Aprovado" &&
  //     status !== "Negado" &&
  //     status !== "Pago" &&
  //     status !== "Pago Parcial");

  const canEdit =
    !id ||
    status === "Solicitado" ||
    (isMaster && id_status > 0 && id_status <= 2);
  const readOnly = !canEdit || !modalEditing;
  const disabled = !canEdit || !modalEditing;

  // * [ FORM ]
  const { form } = useFormTituloData(titulo);

  const {
    setValue,
    formState: { errors },
  } = form;

  console.log("ERROS_TITULO:", errors);

  // * [ WATCHES ]
  // const wfull = form.watch();
  // console.log(wfull);
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
  const valorTotalTitulo = parseFloat(
    useWatch({
      name: "valor",
      control: form.control,
    }) || "0"
  );

  // * [ FORNECEDOR ]
  function showModalFornecedor() {
    setModalFornecedorOpen(true);
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
      setValue(
        "id_forma_pagamento",
        fornecedor.id_forma_pagamento?.toString() || ""
      );
      setValue("id_tipo_conta", fornecedor.id_tipo_conta?.toString() || "");
      setValue(
        "id_tipo_chave_pix",
        fornecedor.id_tipo_chave_pix?.toString() || ""
      );
      setValue("chave_pix", fornecedor.chave_pix || "");
      setModalFornecedorOpen(false);
    } catch (error) {}
  }

  // * [ ANEXOS ]
  // Quando um anexo for alterado:
  async function handleChangeFile({
    campo,
    fileUrl,
  }: {
    campo: string;
    fileUrl?: string;
  }) {
    try {
      if (id && !fileUrl) {
        await api.post("financeiro/contas-a-pagar/titulo/update-anexo", {
          campo,
          fileUrl,
          id,
        });
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
  const showDadosBancarios = checkIsTransferenciaBancaria(id_forma_pagamento);

  // ! [ ACTIONS ] //////////////////////////////////////////////
  const [isSubmtting, setIsSubmitting] = useState<boolean>(false);

  const {
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
      closeModal();

      if (titulo.id_recorrencia) {
        queryClient.invalidateQueries({ queryKey: ["fin_cp_recorrencias"] });
      }
    }
  }, [insertOneSuccess]);

  type changeStatusTituloProps = {
    id_novo_status: string;
    motivo?: string;
  };
  const changeStatusTitulo = async ({
    id_novo_status,
    motivo,
  }: changeStatusTituloProps) => {
    try {
      await api.post(`financeiro/contas-a-pagar/titulo/change-status`, {
        id_titulo: id,
        id_novo_status,
        motivo,
      });
      queryClient.invalidateQueries({ queryKey: ["fin_cp_titulos"] });
      queryClient.invalidateQueries({ queryKey: ["fin_cp_titulo"] });
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
  const handleClickCriarRecorrencia = async (e: any) => {
    try {
      e.preventDefault();
      const dados = form.getValues();
      // console.log(
      //   "CRIAR RECORRENCIA",
      //   dados.id,
      //   dados.vencimentos && dados.vencimentos[0].data_vencimento,
      //   dados.valor
      // );

      // try {
      //   await schemaTitulo.parse(dados)
      // } catch (error) {
      //     form.trigger()
      //     return;
      // }

      await api.post("financeiro/contas-a-pagar/titulo/criar-recorrencia", {
        id: dados.id,
        data_vencimento:
          dados.vencimentos && dados.vencimentos[0].data_vencimento,
        valor: dados.valor,
      });
      queryClient.invalidateQueries({ queryKey: ["fin_cp_recorrencias"] });
      toast({
        variant: "success",
        title: "Recorrência criada com sucesso!",
      });
    } catch (error) {
      // console.log(error);
      toast({
        variant: "destructive",
        title: "Erro ao tentar criar a recorrência!",
        // @ts-ignore
        description: error.response?.data?.message || error.message,
      });
    }
  };

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
    <div
      key={`${id}.${data.created_at}`}
      className="max-w-screen-xl overflow-auto grid grid-cols-1 lg:grid-rows-[1fr_auto] lg:grid-cols-[1fr_auto]"
    >
      <ModalFiliais
        open={modalFilialOpen}
        handleSelection={handleSelectionFilial}
        onOpenChange={setModalFilialOpen}
        id_grupo_economico={id_grupo_economico}
        id_matriz={id_matriz}
        closeOnSelection
      />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          method="POST"
          className="w-full grid grid-cols-1 lg:grid-rows-[1fr_auto] lg:grid-cols-[1fr_auto]"
        >
          <ScrollArea className="flex flex-col max-w-full max-h-[72vh] sm:max-h-[70vh] overflow-auto col-span-2">
            {titulo?.status && (
              <div className="flex-1 py-2">
                <div
                  className={`py-1 text-white text-center border text-md font-bold rounded-sm ${generateStatusColor(
                    { status: titulo?.status || "", bg: true, text: true }
                  )}`}
                >
                  {titulo.status}
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 overflow-auto sm:pe-3">
              <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 ">
                {/* Primeira coluna */}
                <div className="flex flex-col flex-wrap gap-3 flex-shrink-0 flex-grow-0">
                  {/* Dados do Fornecedor */}
                  <div className="flex flex-col p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <Contact />
                      <span className="text-lg font-bold">Fornecedor</span>
                      <div>
                        {errors.id_fornecedor?.message && (
                          <Badge variant={"destructive"}>
                            {errors.id_fornecedor?.message || ""}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-end">
                      <span onClick={showModalFornecedor}>
                        <FormInput
                          className="flex-1 min-w-[18ch]"
                          name="cnpj_fornecedor"
                          readOnly={true}
                          label="CPF/CNPJ"
                          fnMask={normalizeCnpjNumber}
                          placeholder="SELECIONE O FORNECEDOR"
                          control={form.control}
                        />
                      </span>
                      <span onClick={showModalFornecedor}>
                        <FormInput
                          className="flex-1 min-w-[30ch] sm:min-w-[40ch] shrink-0"
                          name="nome_fornecedor"
                          placeholder="SELECIONE O FORNECEDOR"
                          readOnly={true}
                          label="Nome do fornecedor"
                          control={form.control}
                        />
                      </span>

                      <SelectFormaPagamento
                        label="Forma de pagamento"
                        name="id_forma_pagamento"
                        control={form.control}
                        disabled={disabled}
                        className="flex-1 min-w-[15ch]"
                      />
                      <div
                        className={`${
                          showPix ? "flex w-full" : "hidden"
                        } gap-3 flex-wrap`}
                      >
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
                            className="min-w-[15ch]"
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
                        </>
                      )}

                      <ModalFornecedores
                        open={canEdit && modalFornecedorOpen}
                        handleSelection={handleSelectionFornecedor}
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

                    <div className="grid gap-3 flex-wrap items-end">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
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

                        <span onClick={showModalFilial}>
                          <FormInput
                            readOnly={true}
                            name="filial"
                            label="Filial"
                            placeholder="SELECIONE A FILIAL"
                            control={form.control}
                            inputClass="sm:min-w-[100px]"
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
                        label="Descrição do pagamento"
                        control={form.control}
                      />
                    </div>
                  </div>

                  {/* Abas Vencimentos / Rateio entre filiais */}
                  {valorTotalTitulo > 0 && !!id_matriz ? (
                    <div className="max-w-full">
                      <Tabs defaultValue="vencimentos" className="max-w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="vencimentos">
                            <div className="flex gap-3">
                              <span>Vencimentos</span>
                              {errors.vencimentos?.message && (
                                <Popover>
                                  <PopoverTrigger>
                                    <Badge variant={"destructive"}>
                                      Atenção
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent className="bg-destructive text-destructive-foreground">
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
                                    <Badge variant={"destructive"}>
                                      Atenção
                                    </Badge>
                                  </PopoverTrigger>
                                  <PopoverContent className="bg-destructive text-destructive-foreground">
                                    {errors.itens_rateio.message}
                                  </PopoverContent>
                                </Popover>
                              )}
                            </div>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="vencimentos">
                          <SecaoVencimentos
                            id={id}
                            form={form}
                            canEdit={canEdit}
                            modalEditing={modalEditing}
                            disabled={disabled}
                            readOnly={readOnly}
                          />
                        </TabsContent>

                        <TabsContent value="rateio">
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
                        {valorTotalTitulo > 0
                          ? "Selecione a filial!"
                          : "Preencha o valor!"}
                      </AlertTitle>
                    </Alert>
                  )}

                  {/* Histórico */}
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <History />{" "}
                      <span className="text-lg font-bold ">Histórico</span>
                    </div>
                    <div className="flex flex-col gap-3 overflow-auto max-h-72">
                      {data?.historico?.map((h, index) => (
                        <p key={`hist.${h.id}.${index}`} className="text-xs">
                          {formatarDataHora(h.created_at)}:{" "}
                          {formatarHistorico(h.descricao)}
                        </p>
                      ))}
                    </div>
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
                    disabled={disabled}
                    label="XML Nota fiscal"
                    name="url_xml"
                    mediaType="xml"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_xml" })
                    }
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Nota fiscal"
                    name="url_nota_fiscal"
                    mediaType="pdf"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_nota_fiscal" })
                    }
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Boleto"
                    name="url_boleto"
                    mediaType="pdf"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_boleto" })
                    }
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Contrato/Autorização"
                    name="url_contrato"
                    mediaType="etc"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_contrato" })
                    }
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Planilha"
                    name="url_planilha"
                    mediaType="excel"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_planilha" })
                    }
                  />
                  <FormFileUpload
                    disabled={disabled}
                    label="Arquivo remessa"
                    name="url_txt"
                    mediaType="txt"
                    control={form.control}
                    onChange={(fileUrl: string) =>
                      handleChangeFile({ fileUrl, campo: "url_txt" })
                    }
                  />
                </div>
              </div>
            </ScrollArea>
          </ScrollArea>

          <div className="max-w-full flex justify-between sm:items-center mt-4 gap-3 sm:gap-0 col-span-2">
            {isSubmtting ? (
              <div className="flex gap-3 items-center">
                <span className="font-lg">Aguarde...</span>{" "}
                {<FaSpinner className="animate-spin" />}
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-3 items-center">
                  {id && (status == "Solicitado" || status == "Negado") && (
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
                  {id &&
                    status !== "Solicitado" &&
                    id_status < 4 &&
                    (isMaster === true &&
                    (status === "Aprovado" || status === "Negado")
                      ? true
                      : false) && (
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
                  {isMaster &&
                    id &&
                    status !== "Negado" &&
                    id_status > 0 &&
                    id_status < 4 && (
                      <ButtonMotivation
                        variant={"destructive"}
                        size={"lg"}
                        action={handleChangeNegar}
                      >
                        <X className="me-2" size={18} />
                        Negar
                      </ButtonMotivation>
                    )}
                  {isMaster &&
                    id &&
                    status !== "Aprovado" &&
                    id_status > 0 &&
                    id_status < 4 && (
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
                  {id && id_status > 0 && (
                    <Button
                      type="button"
                      title="Uma recorrência será criada com data para 1 mês após a data de vencimento desta solicitação."
                      variant={"secondary"}
                      size={"lg"}
                      onClick={handleClickCriarRecorrencia}
                    >
                      <Repeat2 className="me-2" size={18} />
                      Criar Recorrência
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
                    <Button
                      onClick={() => editModal(true)}
                      size="lg"
                      variant={"warning"}
                    >
                      <Pen size={18} className="me-2" /> Editar
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
