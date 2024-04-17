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
import { normalizeCnpjNumber } from "@/helpers/mask";
import ModalCentrosCustos from "@/pages/admin/components/ModalCentrosCustos";
import ModalFornecedores, {
  ItemFornecedor,
} from "@/pages/financeiro/components/ModalFornecedores";
import ModalPlanoContas, {
  ItemPlanoContas,
} from "@/pages/financeiro/components/ModalPlanoContas";
import { CentroCustos } from "@/types/financeiro/centro-custos-type";
import {
  Contact,
  Divide,
  FileIcon,
  FileText,
  History,
  List,
  Percent,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useWatch } from "react-hook-form";
import { TituloSchemaProps, useFormTituloData } from "./form-data";
import { Historico, ItemRateioTitulo, useStoreTitulo } from "./store";
// import { useTituloPagar } from "@/hooks/useTituloPagar";

export type DataSchemaProps = {
  titulo: TituloSchemaProps;
  itens_rateio: ItemRateioTitulo[];
  historico: Historico[];
};

let i = 0;
const FormTituloPagar = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: DataSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  console.log(`RENDER ${++i} - Form, titulo:`, id);
  const modalEditing = useStoreTitulo().modalEditing;
  const editModal = useStoreTitulo().editModal;
  const closeModal = useStoreTitulo().closeModal;

  const [modalFornecedorOpen, setModalFornecedorOpen] =
    useState<boolean>(false);
  const [modalPlanoContasOpen, setModalPlanoContasOpen] =
    useState<boolean>(false);
  const [modalCentrosCustosOpen, setModalCentrosCustosOpen] =
    useState<boolean>(false);

  const { titulo, itens_rateio: itensRateioTitulo } = data || {
    titulo: {},
    itens_rateio: [],
  };

  console.log("Titulo", titulo);

  const statusTitulo = titulo?.status || "";
  const isMaster =
    checkUserDepartments("FINANCEIRO") || checkUserPermission("MASTER");
  const canEdit =
    !id ||
    statusTitulo === "Solicitado" ||
    (isMaster &&
      statusTitulo !== "Aprovado" &&
      statusTitulo !== "Negado" &&
      statusTitulo !== "Pago");

  const itens_rateio: ItemRateioTitulo[] = [];

  itensRateioTitulo?.forEach((item_rateio: ItemRateioTitulo) => {
    const item = {
      id: item_rateio.id?.toString() || "",
      id_filial: item_rateio.id_filial?.toString() || "",
      percentual: item_rateio.percentual || "",
      valor: item_rateio.valor || "0",
    };
    itens_rateio.push(item);
  });

  // const { form, itens, appendItem, removeItem } = useFormTituloData(data);
  const { form } = useFormTituloData({
    ...titulo,
    itens_rateio: itensRateioTitulo,
    historico: data.historico,
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
      setModalPlanoContasOpen(true);
    }
  }

  function showModalCentrosCustos() {
    if (canEdit) {
      setModalCentrosCustosOpen(true);
    }
  }

  function handleSelectionPlanoContas(item: ItemPlanoContas) {
    setValue("id_plano_contas", item.id);
    setValue("plano_contas", item.codigo + " - " + item.descricao);
    setModalPlanoContasOpen(false);
  }

  function handleSelectionCentroCusto(item: CentroCustos) {
    setValue("id_centro_custo", item.id);
    setValue("centro_custo", item.nome);
    setModalCentrosCustosOpen(false);
  }

  const watchIdFilial = useWatch({ name: "id_filial", control: form.control });

  const watchFormaPagamento = useWatch({
    name: "id_forma_pagamento",
    control: form.control,
  });
  const showPix = watchFormaPagamento === "4";
  const showDadosBancarios =
    watchFormaPagamento === "2" ||
    watchFormaPagamento === "5" ||
    watchFormaPagamento === "8";

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
    addFieldArray({ id_filial: "1", valor: "0", percentual: "0" });
  }

  function removeItemRateio(index: number) {
    removeFieldArray(index);
  }

  const onSubmit = (data: TituloSchemaProps) => {
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
    editModal(false);
    closeModal();
  };

  const isManual = form.watch("id_rateio");
  console.log("É MANUAL -> ", isManual);

  const rateioManual = titulo.id_rateio == "6";

  return (
    <div className="max-w-full  overflow-hidden">
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
                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <Contact />{" "}
                      <span className="text-lg font-bold ">Fornecedor</span>
                      <Button
                        disabled={!canEdit}
                        type="button"
                        onClick={showModalFornecedor}
                        size={"sm"}
                      >
                        Procurar
                      </Button>
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
                      />{" "}
                      <SelectFormaPagamento
                        label="Forma de pagamento"
                        name="id_forma_pagamento"
                        control={form.control}
                        className="flex-1"
                      />
                      <div
                        className={`${
                          showPix ? "flex flex-1" : "hidden"
                        } gap-3 flex-wrap`}
                      >
                        <SelectTipoChavePix
                          control={form.control}
                          name="id_tipo_chave_pix"
                          label="Tipo Chave PIX"
                          className="flex-1"
                        />

                        <FormInput
                          label="Chave PIX"
                          name="chave_pix"
                          control={form.control}
                          readOnly={!modalEditing}
                          className="flex-1"
                        />
                      </div>
                      {/* Dados bancários do fornecedor */}
                      <div
                        className={`${
                          showDadosBancarios ? "flex" : "hidden"
                        } gap-3 flex-wrap`}
                      >
                        <FormInput
                          label="Favorecido"
                          name="favorecido"
                          control={form.control}
                          readOnly={!modalEditing}
                          className="flex-1"
                        />

                        <FormInput
                          label="CNPJ Favorecido"
                          name="cnpj_favorecido"
                          control={form.control}
                          readOnly={!modalEditing}
                          className="flex-1"
                        />

                        <FormInput
                          label="Cód. Banco"
                          name="codigo_banco"
                          className="min-w-[10ch]"
                          control={form.control}
                          readOnly={true}
                        />

                        <FormInput
                          label="Banco"
                          name="nome_banco"
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
                        open={modalEditing && modalFornecedorOpen}
                        handleSelecion={handleSelectionFornecedor}
                        onOpenChange={() =>
                          setModalFornecedorOpen((prev) => !prev)
                        }
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <FileText />{" "}
                      <span className="text-lg font-bold ">
                        Dados da solicitação
                      </span>
                    </div>
                    <div className="flex gap-3 flex-wrap items-end">
                      <FormSelect
                        disabled={!modalEditing}
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
                        disabled={!modalEditing}
                        name="id_filial"
                        label="Filial"
                        className="flex-1 min-w-[40ch]"
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

                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={showModalPlanoContas}
                          className="flex-1 p-0"
                        >
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
                        open={modalEditing && modalPlanoContasOpen}
                        id_matriz={watchIdFilial}
                        onOpenChange={() =>
                          setModalPlanoContasOpen((prev) => !prev)
                        }
                        handleSelecion={handleSelectionPlanoContas}
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
                          variant={"ghost"}
                          onClick={showModalCentrosCustos}
                          className="flex flex-1 p-0"
                        >
                          <FormInput
                            disabled={!modalEditing}
                            name="centro_custo"
                            control={form.control}
                            className={"flex-1 min-w-[40ch]"}
                          />
                        </Button>
                      </FormItem>

                      <ModalCentrosCustos
                        handleSelecion={handleSelectionCentroCusto}
                        // @ts-expect-error 'Vai funcionar'
                        onOpenChange={setModalCentrosCustosOpen}
                        open={modalCentrosCustosOpen}
                        closeOnSelection={true}
                      />

                      <FormInput
                        readOnly={!modalEditing}
                        name="num_parcelas"
                        type={"number"}
                        label="Número de parcelas"
                        control={form.control}
                      />

                      <FormInput
                        readOnly={!modalEditing}
                        name="parcela"
                        type={"number"}
                        label="Parcela"
                        control={form.control}
                      />

                      <FormDateInput
                        disabled={!modalEditing}
                        name="data_emissao"
                        label="Data de emissão"
                        control={form.control}
                      />
                      <FormDateInput
                        disabled={!modalEditing}
                        name="data_vencimento"
                        label="Data de vencimento"
                        control={form.control}
                      />

                      <FormInput
                        readOnly={!modalEditing}
                        name="num_doc"
                        label="Núm. Doc."
                        control={form.control}
                      />

                      <FormInput
                        readOnly={!modalEditing}
                        className="w-[20ch]"
                        name="valor"
                        control={form.control}
                        type={"number"}
                        label="Valor Total"
                      />

                      <FormInput
                        readOnly={!modalEditing}
                        className="min-w-[400px] flex-1"
                        name="descricao"
                        label="Descrição do pagamento"
                        control={form.control}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3 items-center">
                      <List />{" "}
                      <span className="text-lg font-bold ">
                        Items da Solicitação
                      </span>
                    </div>
                    <div className="flex gap-3"></div>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3 items-center">
                      <Divide />{" "}
                      <span className="text-lg font-bold ">
                        Dados do rateio
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <FormSelect
                        name="id_rateio"
                        disabled={!modalEditing}
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

                    <div className="flex justify-between items-baseline mt-3">
                      <span className="text-md font-medium">
                        Itens do rateio
                      </span>
                      {modalEditing && rateioManual && (
                        <Button type="button" onClick={addItemRateio}>
                          Novo item
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 mt-3">
                      <table>
                        <thead>
                          <tr>
                            <th className="text-left pl-2">Filial</th>
                            <th className="text-left pl-2">Percentual</th>
                            {modalEditing && rateioManual && (
                              <th className="text-left max-w-[20ch]">Ação</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {itensRateio?.map((_, index) => (
                            <tr key={index}>
                              <td className="p-1">
                                <SelectFilial
                                  name={`itens_rateio.${index}.id_filial`}
                                  disabled={modalEditing || rateioManual}
                                  control={form.control}
                                />
                              </td>
                              <td className="p-1">
                                <FormInput
                                  type="number"
                                  readOnly={modalEditing || rateioManual}
                                  name={`itens_rateio.${index}.percentual`}
                                  control={form.control}
                                  icon={Percent}
                                  min={0.1}
                                  max={99}
                                />
                              </td>
                              {modalEditing && rateioManual && (
                                <td>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => {
                                      removeItemRateio(index);
                                    }}
                                  >
                                    <Trash />
                                  </Button>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                    <div className="flex gap-2 mb-3">
                      <History />{" "}
                      <span className="text-lg font-bold ">
                        Histórico do título
                      </span>
                    </div>
                    <div className="flex gap-3 flex-wrap items-end">
                      {data.historico.map((h) => (
                        <p key={`hist.${h.id}`}>
                          {formatarDataHora(h.created_at)} - {h.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Fim da primeira coluna */}
                </div>

                {/* Segunda coluna */}
                <div className="max-w-full lg:max-w-[300px] flex shrink-0 flex-col gap-3 bg-slate-200 dark:bg-blue-950 p-3 rounded-lg">
                  <div className="flex gap-2 font-bold mb-3">
                    <FileIcon /> <span>Anexos</span>
                  </div>

                  <FormFileUpload
                    disabled={!modalEditing}
                    label="XML Nota fiscal"
                    name="url_xml"
                    mediaType="xml"
                    control={form.control}
                  />
                  <FormFileUpload
                    disabled={!modalEditing}
                    label="Nota fiscal"
                    name="url_nota_fiscal"
                    mediaType="pdf"
                    control={form.control}
                  />
                  <FormFileUpload
                    disabled={!modalEditing}
                    label="Boleto"
                    name="url_boleto"
                    mediaType="pdf"
                    control={form.control}
                  />
                  <FormFileUpload
                    disabled={!modalEditing}
                    label="Contrato/Autorização"
                    name="url_contrato"
                    mediaType="etc"
                    control={form.control}
                  />
                  <FormFileUpload
                    disabled={!modalEditing}
                    label="Planilha"
                    name="url_planilha"
                    mediaType="excel"
                    control={form.control}
                  />
                  <FormFileUpload
                    disabled={!modalEditing}
                    label="Arquivo remessa"
                    name="url_txt"
                    mediaType="txt"
                    control={form.control}
                  />
                </div>
              </div>
            </ScrollArea>
          </ScrollArea>
        </form>
      </Form>
    </div>
  );
};

export default FormTituloPagar;
