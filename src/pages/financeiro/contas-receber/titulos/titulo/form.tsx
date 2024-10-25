import ButtonMotivation from "@/components/custom/ButtonMotivation";
import FormDateInput from "@/components/custom/FormDate";
import FormFileUpload from "@/components/custom/FormFileUpload";
import FormInput from "@/components/custom/FormInput";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { checkUserDepartments, checkUserPermission } from "@/helpers/checkAuthorization";
import { formatarDataHora } from "@/helpers/format";
import { generateStatusColor } from "@/helpers/generateColorStatus";
import { normalizeCnpjNumber } from "@/helpers/mask";
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import { api } from "@/lib/axios";
import ModalFornecedores, { ItemFornecedor } from "@/pages/financeiro/components/ModalFornecedores";

import fetchApi from "@/api/fetchApi";
import AlertPopUp from "@/components/custom/AlertPopUp";
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

import FormSelect from "@/components/custom/FormSelect";
import SecaoRateioCR from "./components/form/rateio/SecaoRateioCR";
import SecaoVencimentosCR from "./components/form/vencimento/SecaoVencimentosCR";
import { TituloCRSchemaProps } from "./form-data";
import { formatarHistorico } from "./helpers/helper";
import { useStoreTituloReceber } from "./store";

const FormTituloReceber = ({
  id,
  form,
  handleInsertTitulo,
}: {
  id: string | null | undefined;
  form: UseFormReturn<TituloCRSchemaProps> | any | undefined;
  handleInsertTitulo?: (id_titulo: number) => void;
  // formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const queryClient = useQueryClient();

  const modalEditing = useStoreTituloReceber().modalEditing;
  const editModal = useStoreTituloReceber().editModal;
  const closeModal = useStoreTituloReceber().closeModal;
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
  const id_grupo_economico = useWatch({
    name: "id_grupo_economico",
    control: form.control,
  });
  const id_matriz = useWatch({
    name: "id_matriz",
    control: form.control,
  });
  const valorTotalTitulo = parseFloat(
    useWatch({
      name: "valor",
      control: form.control,
    }) || "0"
  );

  // * [ VERIFICAÇÕES ]
  const status = titulo?.status || "Criado";
  const id_status = parseInt(titulo?.id_status) ?? 10;

  const isMaster = checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");

  const canEdit = !id || status === "Criado" || (isMaster && id_status > 0 && id_status < 30);
  // const canEditRecebimento = !id || status === "Criado" || (isMaster && id_status > 0 && id_status < 50);
  const readOnly = !canEdit || !modalEditing;
  const disabled = !canEdit || !modalEditing;

  const podeArquivar = id && (status == "Criado" || status == "Cancelado");

  const podeResolicitar =
    id &&
    status !== "Criado" &&
    (id_status < 30 || (isMaster === true && status === "Emitido" ? true : false));

  const podeCancelar = id && status !== "Cancelado" && id_status > 0 && id_status < 40;
  const podeEmitir = id && status !== "Emitido" && id_status > 0 && id_status < 40;
  const podeEditarPedido = !id || !form.watch("id_user");
  const podeExcluirNotaFiscal = id_status < 30 || isMaster;
  // const emitido = id_status === 30;

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
      setModalFornecedorOpen(false);
    } catch (error) {}
  }

  // * [ ANEXOS ]
  // Quando um anexo for alterado:
  async function handleChangeFile({ campo, fileUrl }: { campo: string; fileUrl?: string }) {
    try {
      if (id) {
        const result = await api.post("financeiro/contas-a-receber/titulo/update-anexo", {
          campo,
          fileUrl,
          id,
        });
        // @ts-ignore
        form.setValue(campo, result.data.fileUrl || "");
      }
    } catch (error) {
      console.log(error);

      toast({
        variant: "destructive",
        title: "Erro!",
        description:
          "O arquivo pode ter sido excluído, mas não foi possível remover o anexo do título, tente excluir novamente mais tarde!",
      });
    }
  }

  // ! [ ACTIONS ] //////////////////////////////////////////////
  const [isSubmtting, setIsSubmitting] = useState<boolean>(false);

  const {
    data: dataInsertOne,
    mutate: insertOne,
    isSuccess: insertOneSuccess,
    isPending: isPendingInsert,
  } = useTituloReceber().insertOne();
  const {
    mutate: update,
    isSuccess: updateSuccess,
    isPending: isPendingUpdate,
  } = useTituloReceber().update();

  useEffect(() => {
    if (isPendingInsert || isPendingUpdate) {
      setIsSubmitting(true);
    } else {
      setIsSubmitting(false);
    }
  }, [isPendingInsert, isPendingUpdate]);

  const onSubmit: SubmitHandler<TituloCRSchemaProps> = async (data) => {
    if (!id) insertOne(data);
    if (id) update(data);
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
    }
  }, [insertOneSuccess]);

  type changeStatusTituloProps = {
    id_novo_status: string;
    motivo?: string;
  };
  const changeStatusTitulo = async ({ id_novo_status, motivo }: changeStatusTituloProps) => {
    try {
      await api.post(`financeiro/contas-a-receber/titulo/change-status`, {
        id_titulo: id,
        id_novo_status,
        motivo,
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_receber"],
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
  const handleChangeVoltarCriado = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: "10",
      motivo,
    });
  };
  const handleChangeCancelar = (motivo: string) => {
    changeStatusTitulo({
      id_novo_status: "20",
      motivo: motivo,
    });
  };
  const handleChangeEmitir = () => {
    changeStatusTitulo({
      id_novo_status: "30",
    });
  };

  async function processarXml({ fileUrl }: { fileUrl: string }) {
    try {
      if (!fileUrl) {
        return;
      }
      const data = await fetchApi.financeiro.contas_receber.titulos.processarXml(fileUrl);

      if (data) {
        const { fornecedor, filial, num_doc, valor, data_emissao } = data;
        if (fornecedor) {
          form.setValue("id_fornecedor", String(fornecedor.id));
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
                    <span className="text-lg font-bold">Cliente</span>
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
                      placeholder="SELECIONE O CLIENTE"
                      control={form.control}
                      disabled={disabled}
                      onClick={showModalFornecedor}
                    />
                    <FormInput
                      className="flex-1 min-w-[30ch] sm:min-w-[40ch] shrink-0"
                      name="nome_fornecedor"
                      placeholder="SELECIONE O CLIENTE"
                      readOnly={true}
                      label="Nome"
                      control={form.control}
                      disabled={disabled}
                      onClick={showModalFornecedor}
                    />
                    <ModalFornecedores
                      open={canEdit && modalFornecedorOpen}
                      handleSelection={handleSelectionFornecedor}
                      onOpenChange={() => setModalFornecedorOpen((prev) => !prev)}
                    />
                  </div>
                </div>

                {/* Dados do título */}
                <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                  <div className="flex gap-2 mb-3">
                    <FileText /> <span className="text-lg font-bold ">Dados do título</span>
                  </div>

                  <div className="grid gap-3 flex-wrap items-end">
                    <div className="flex items-end flex-wrap gap-3">
                      <FormSelect
                        disabled={disabled}
                        name="id_tipo_documento"
                        label={"Tipo de documento"}
                        control={form.control}
                        className="flex-1 min-w-[32ch]"
                        options={[
                          {
                            value: "1",
                            label: "Nota Fiscal",
                          },
                          {
                            value: "2",
                            label: "Nota de Débito",
                          },
                          {
                            value: "3",
                            label: "Recibo",
                          },
                        ]}
                      />
                      <span className="space-y-2 flex-1 min-w-[32ch]">
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
                          disabled={disabled}
                          onClick={showModalFilial}
                        />
                      </span>
                    </div>

                    <div className="max-w-full flex flex-wrap gap-3">
                      <FormInput
                        readOnly={disabled}
                        name="num_doc"
                        label="Núm. Doc."
                        className={"flex-1 min-w-[15ch]"}
                        control={form.control}
                        disabled={disabled}
                      />
                      <FormInput
                        readOnly={!podeEditarPedido}
                        name="tim_pedido  "
                        label="Pedido TIM"
                        className={"flex-1 min-w-[15ch]"}
                        control={form.control}
                        disabled={disabled}
                      />
                      <FormInput
                        readOnly={!podeEditarPedido}
                        name="tim_pedido_sap"
                        label="Pedido TIM SAP"
                        className={"flex-1 min-w-[15ch]"}
                        control={form.control}
                        disabled={disabled}
                      />
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
                        control={form.control}
                        inputClass="text-left"
                        name="valor"
                        type="number"
                        iconLeft
                        icon={TbCurrencyReal}
                        label="Valor Total"
                        disabled={disabled}
                        min={0}
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
                            <span>Rateio do título</span>
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
                        <SecaoVencimentosCR
                          id={id}
                          form={form}
                          canEdit={canEdit}
                          modalEditing={modalEditing}
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                      </TabsContent>

                      <TabsContent value="rateio" className="orverflow-auto">
                        <SecaoRateioCR
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
                  label="XML Nota Fiscal"
                  name="url_xml_nota"
                  mediaType="xml"
                  control={form.control}
                  onChange={(fileUrl: string) => {
                    handleChangeFile({
                      fileUrl,
                      campo: "url_xml_nota",
                    });
                    processarXml({ fileUrl });
                  }}
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  canDelete={podeExcluirNotaFiscal}
                  label="Nota Fiscal"
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
                  canDelete={podeExcluirNotaFiscal}
                  label="Nota Débito"
                  name="url_nota_debito"
                  mediaType="pdf"
                  control={form.control}
                  onChange={(fileUrl: string) => {
                    handleChangeFile({
                      fileUrl,
                      campo: "url_nota_debito",
                    });
                  }}
                />
                <FormFileUpload
                  folderName={"financeiro"}
                  disabled={disabled}
                  canDelete={podeExcluirNotaFiscal}
                  label="Recibo"
                  name="url_recibo"
                  mediaType="etc"
                  control={form.control}
                  onChange={(fileUrl: string) => {
                    handleChangeFile({
                      fileUrl,
                      campo: "url_recibo",
                    });
                  }}
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
                  label="Outros"
                  name="url_outros"
                  mediaType="etc"
                  control={form.control}
                  onChange={(fileUrl: string) => handleChangeFile({ fileUrl, campo: "url_outros" })}
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
                    title="Volta o status do título para 'Criado', possibilitando a edição..."
                    variant={"secondary"}
                    size={"lg"}
                    action={handleChangeVoltarCriado}
                  >
                    <Undo2 className="me-2" size={18} />
                    Status Inicial
                  </ButtonMotivation>
                )}
                {podeCancelar && (
                  <ButtonMotivation
                    variant={"destructive"}
                    size={"lg"}
                    action={handleChangeCancelar}
                  >
                    <X className="me-2" size={18} />
                    Cancelar
                  </ButtonMotivation>
                )}
                {podeEmitir && (
                  <Button
                    type="button"
                    variant={"success"}
                    size={"lg"}
                    onClick={handleChangeEmitir}
                  >
                    <Check className="me-2" size={18} />
                    Emitir
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
                      Salvar
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

export default FormTituloReceber;
