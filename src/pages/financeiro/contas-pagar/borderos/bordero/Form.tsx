import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { exportToExcel } from "@/helpers/importExportXLS";
import { useBordero } from "@/hooks/financeiro/useBordero";
import { api } from "@/lib/axios";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";

import { ArrowUpDown, Download, Fingerprint, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useFormBorderoData } from "./form-data";
import { useStoreBordero } from "./store";

// Componentes
import { Accordion } from "@/components/ui/accordion";
import ModalVencimentos, {
  VencimentosProps,
} from "@/pages/financeiro/components/ModalVencimentos";
import BtnOptionsRemessa from "./BtnOptionsRemessa";
import { ItemVencimento } from "./ItemVencimento";
import { BorderoSchemaProps } from "./Modal";
import ModalTransfer from "./ModalTransfer";
import RowVirtualizerFixedErro from "./RowVirtualizedFixedErro";
import RowVirtualizerFixedPagos from "./RowVirtualizedFixedPagos";
import RowVirtualizerFixedPendentes from "./RowVirtualizedFixedPendentes";
import RowVirtualizerFixedProgramado from "./RowVirtualizedFixedProgramado";

const FormBordero = ({
  id,
  data,
  formRef,
}: {
  id: string | null | undefined;
  data: BorderoSchemaProps;
  formRef: React.MutableRefObject<HTMLFormElement | null>;
}) => {
  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useBordero().insertOne();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useBordero().update();
  const { mutate: deleteVencimento } = useBordero().deleteVencimento();

  const [
    modalEditing,
    editModal,
    closeModal,
    editIsPending,
    toggleModalTransfer,
    isPending,
  ] = useStoreBordero((state) => [
    state.modalEditing,
    state.editModal,
    state.closeModal,
    state.editIsPending,
    state.toggleModalTransfer,
    state.isPending,
  ]);

  const [modalVencimentoOpen, setModalVencimentoOpen] =
    useState<boolean>(false);
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);

  const [exporting, setExporting] = useState<string>("");

  const { form, addVencimento, removeVencimento } = useFormBorderoData(data);

  const id_conta_bancaria = form.watch("id_conta_bancaria");
  const id_matriz = form.watch("id_matriz");
  const data_pagamento = form.watch("data_pagamento");
  const wVencimentos = form.watch("vencimentos");
  const wVencimentosPendentes = form
    .watch("vencimentos")
    .filter((v) => v.status === "pendente");
  const wVencimentosPendentesValorTotal =
    form
      .watch("vencimentos")
      .filter((v) => v.status === "pendente")
      .reduce((acc, item: VencimentosProps) => acc + +item.valor_total, 0) || 0;
  const wVencimentosProgramados = form
    .watch("vencimentos")
    .filter((v) => v.status === "programado");
  const wVencimentosProgramadosValorTotal =
    form
      .watch("vencimentos")
      .filter((v) => v.status === "programado")
      .reduce((acc, item: VencimentosProps) => acc + +item.valor_total, 0) || 0;
  const wVencimentosErro = form
    .watch("vencimentos")
    .filter((v) => v.status === "erro");
  const wVencimentosErroValorTotal =
    form
      .watch("vencimentos")
      .filter((v) => v.status === "erro")
      .reduce((acc, item: VencimentosProps) => acc + +item.valor_total, 0) || 0;
  const wVencimentosPago = form
    .watch("vencimentos")
    .filter((v) => v.status === "pago");
  const wVencimentosPagoValorTotal =
    form
      .watch("vencimentos")
      .filter((v) => v.status === "pago")
      .reduce((acc, item: VencimentosProps) => acc + +item.valor_total, 0) || 0;
  const vencimentosChecked: VencimentosProps[] = form
    .watch("vencimentos")
    .filter((v) => v.checked);

  function onSubmitData(newData: BorderoSchemaProps) {
    const filteredData: BorderoSchemaProps = {
      id: newData.id,
      id_conta_bancaria: newData.id_conta_bancaria,
      data_pagamento: newData.data_pagamento,
      id_matriz: newData.id_matriz,
      vencimentos: newData.vencimentos?.filter(
        (vencimento: VencimentosProps) => vencimento.updated
      ),
    };
    if (!id) insertOne(newData);
    // console.log(filteredData);

    if (id) update(filteredData);

    editModal(false);
    closeModal();
  }

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateIsError || insertIsError) {
      editIsPending(false);
    } else if (updateIsPending || insertIsPending) {
      editIsPending(true);
    }
  }, [updateIsPending, insertIsPending]);

  function handleSelectionVencimento(item: VencimentosProps[]) {
    //^ Verificar se ele realmente está salvando como updated
    const idsVencimentos: string[] = wVencimentos.map(
      (vencimento) => vencimento.id_vencimento
    );
    item.forEach((subItem: VencimentosProps) => {
      const isNewId = idsVencimentos.includes(subItem.id_vencimento);
      if (!isNewId) {
        return addVencimento({
          ...subItem,
          updated: true,
          valor_pago: "0",
          can_remove: true,
        });
      }
    });

    setModalVencimentoOpen(false);
  }

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    form.setValue("id_conta_bancaria", item.id);
    form.setValue("conta_bancaria", item.descricao);
    form.setValue("banco", item.banco);
    if (!data.id_matriz && !id_matriz) {
      form.setValue("id_matriz", item.id_matriz);
    }

    setModalContaBancariaOpen(false);
  }

  async function removeItemVencimentos(
    index: number,
    id?: string,
    id_status?: string
  ) {
    if (id_status != "4" && id_status != "5") {
      deleteVencimento(id);
      removeVencimento(index);
    } else {
      toast({
        title: "Erro",
        description:
          "Não é possível remover do borderô vencimentos de títulos com status pago!",
        duration: 3500,
        variant: "warning",
      });
    }
  }

  async function removeCheckedVencimentos(
    checkedVencimentos: VencimentosProps[]
  ) {
    const novosVencimentos = wVencimentos.filter(
      (v: VencimentosProps) =>
        !checkedVencimentos
          .map((v) => v.id_vencimento)
          .includes(v.id_vencimento)
    );
    wVencimentos.forEach((v) => {
      if (
        !checkedVencimentos
          .map((v) => v.id_vencimento)
          .includes(v.id_vencimento) &&
        v.id_status != "4" &&
        v.id_status != "5"
      ) {
        deleteVencimento(v.id_vencimento);
      }
    });
    form.setValue("vencimentos", novosVencimentos);
  }

  async function exportBordero(id: string) {
    setExporting("default");
    const response = await api.put(
      `/financeiro/contas-a-pagar/bordero/export`,
      { data: [id] }
    );
    exportToExcel(response.data, `bordero-${id}`);
    setExporting("");
  }

  // const data_pagamento = form.watch("data_pagamento");
  // console.log(form.formState.errors);
  // console.log(form.watch("vencimentos"));

  // console.log(form.watch("vencimentos"), data.vencimentos);
  const [itemOpen, setItemOpen] = useState<string>("a-pagar");

  return (
    <div className="max-w-full sm:me-3 overflow-hidden">
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmitData)}
          className="grid grid-cols-1 lg:flex-row gap-5"
        >
          {/* Primeira coluna */}
          <div className="max-w-full grid grid-cols-1 gap-3 shrink-0">
            {/* Dados do Borderô */}
            <div className="p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
              <div className="flex gap-3 flex-wrap justify-between mb-3">
                <div className="flex gap-2 items-center ">
                  <Fingerprint />{" "}
                  <span className="min-w-40 md:text-lg font-bold ">
                    Dados do Borderô
                  </span>
                </div>

                {/* Exportação */}
                {id && (
                  <div className="flex gap-3 items-center">
                    <BtnOptionsRemessa id={id} />
                    {/* <Button
                      disabled={isLoadingDownload && isLoadingPix}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => {
                        setIsLoadingPix(true);
                        downloadRemessa({ id, isPix: true });
                      }}
                    >
                      {isLoadingDownload && isLoadingPix ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Upload className="me-2" size={20} />
                      )}{" "}
                      Retorno Remessa
                    </Button>
                    <Button
                      disabled={isLoadingDownload && isLoadingPix}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => {
                        setIsLoadingPix(true);
                        downloadRemessa({ id, isPix: true });
                      }}
                    >
                      {isLoadingDownload && isLoadingPix ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Download className="me-2" size={20} />
                      )}{" "}
                      Remessa PIX
                    </Button>
                    <Button
                      disabled={isLoadingDownload && !isLoadingPix}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => downloadRemessa({ id })}
                    >
                      {isLoadingDownload && !isLoadingPix ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Download className="me-2" size={20} />
                      )}{" "}
                      Remessa
                    </Button> */}
                    <Button
                      disabled={!!exporting}
                      variant={"outline"}
                      type={"button"}
                      onClick={() => exportBordero(id || "")}
                    >
                      {exporting == "default" ? (
                        <FaSpinner size={18} className="me-2 animate-spin" />
                      ) : (
                        <Download className="me-2" size={20} />
                      )}
                      Exportar
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col justify-end flex-1 min-w-36">
                  <label className="text-sm font-medium">Conta Bancária</label>
                  <Input
                    value={form.watch("conta_bancaria")?.toUpperCase()}
                    className="flex-1 max-h-10 mt-2"
                    readOnly
                    disabled={!modalEditing || isPending}
                    onClick={() => setModalContaBancariaOpen(true)}
                    placeholder="Selecione a conta bancária"
                  />
                </div>
                <ModalContasBancarias
                  open={modalEditing && modalContaBancariaOpen}
                  handleSelection={handleSelectionContaBancaria}
                  onOpenChange={() =>
                    setModalContaBancariaOpen((prev) => !prev)
                  }
                  id_matriz={id_matriz || ""}
                />
                <div className="flex flex-col justify-end flex-1 min-w-36">
                  <label className="text-sm font-medium">Banco</label>
                  <Input
                    value={form.watch("banco")?.toUpperCase()}
                    className="flex-1 max-h-10 mt-2"
                    readOnly
                    disabled={!modalEditing || isPending}
                    placeholder="Defina a conta bancária"
                  />
                </div>
                <FormDateInput
                  disabled={!modalEditing || isPending}
                  name="data_pagamento"
                  label="Data de Pagamento"
                  control={form.control}
                />
              </div>
            </div>

            {/* Titúlos do Borderô */}
            <Accordion
              type="single"
              collapsible
              value={itemOpen}
              onValueChange={(e) => setItemOpen(e)}
              className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg "
            >
              <ItemVencimento
                title="A Pagar"
                value="a-pagar"
                className="flex-col"
                qtde={wVencimentosPendentes.length}
                valorTotal={wVencimentosPendentesValorTotal}
              >
                <div className="flex gap-2 flex-wrap justify-end">
                  {id_conta_bancaria &&
                    modalEditing &&
                    vencimentosChecked.length > 0 && (
                      <>
                        <Button
                          type={"button"}
                          variant={"tertiary"}
                          size={"sm"}
                          className="text-white justify-self-start"
                          onClick={() => toggleModalTransfer()}
                        >
                          <ArrowUpDown className="me-2" size={18} />
                          Transferir de borderô
                        </Button>
                        <AlertPopUp
                          title="Deseja realmente remover esses vencimentos?"
                          description="Os vencimentos serão removidos definitivamente deste borderô, podendo ser incluidos novamente."
                          action={() =>
                            removeCheckedVencimentos(vencimentosChecked)
                          }
                        >
                          <Button
                            type={"button"}
                            variant={"destructive"}
                            size={"sm"}
                            className="justify-self-start"
                          >
                            <Minus className="me-2" size={18} />
                            Remover
                          </Button>
                        </AlertPopUp>
                      </>
                    )}
                  {id_conta_bancaria && modalEditing && (
                    <Button
                      type="button"
                      size={"sm"}
                      onClick={() => setModalVencimentoOpen(true)}
                    >
                      <Plus className="me-2" strokeWidth={2} size={18} />
                      Adicionar
                    </Button>
                  )}
                </div>
                {wVencimentosPendentes?.length > 0 && (
                  <RowVirtualizerFixedPendentes
                    data={wVencimentos}
                    filteredData={wVencimentosPendentes}
                    form={form}
                    modalEditing={modalEditing && !isPending}
                    removeItem={removeItemVencimentos}
                  />
                )}
              </ItemVencimento>
            </Accordion>

            {wVencimentosProgramados.length > 0 && (
              <Accordion
                type="single"
                collapsible
                value={itemOpen}
                onValueChange={(e) => setItemOpen(e)}
                className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg border-yellow-600"
              >
                <ItemVencimento
                  title="Programados"
                  value="programados"
                  className="flex-col"
                  qtde={wVencimentosProgramados.length}
                  valorTotal={wVencimentosProgramadosValorTotal}
                >
                  {wVencimentosProgramados.length > 0 && (
                    <RowVirtualizerFixedProgramado
                      data={wVencimentos}
                      filteredData={wVencimentosProgramados}
                      form={form}
                      modalEditing={modalEditing && !isPending}
                      removeItem={removeItemVencimentos}
                    />
                  )}
                </ItemVencimento>
              </Accordion>
            )}
            {wVencimentosPago.length > 0 && (
              <Accordion
                type="single"
                collapsible
                value={itemOpen}
                onValueChange={(e) => setItemOpen(e)}
                className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg border-green-600"
              >
                <ItemVencimento
                  title="Pagos"
                  value="pagos"
                  className="flex-col"
                  qtde={wVencimentosPago.length}
                  valorTotal={wVencimentosPagoValorTotal}
                >
                  {wVencimentosPago.length > 0 && (
                    <RowVirtualizerFixedPagos
                      data={wVencimentos}
                      filteredData={wVencimentosPago}
                      form={form}
                      modalEditing={modalEditing && !isPending}
                      removeItem={removeItemVencimentos}
                    />
                  )}
                </ItemVencimento>
              </Accordion>
            )}

            {wVencimentosErro.length > 0 && (
              <Accordion
                type="single"
                collapsible
                value={itemOpen}
                onValueChange={(e) => setItemOpen(e)}
                className={`px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg border-red-700`}
              >
                <ItemVencimento
                  title="Erros"
                  value="erro"
                  className="flex-col"
                  qtde={wVencimentosErro.length}
                  valorTotal={wVencimentosErroValorTotal}
                >
                  <div className="flex gap-2 flex-wrap justify-end ">
                    {id_conta_bancaria &&
                      modalEditing &&
                      vencimentosChecked.length > 0 && (
                        <>
                          <Button
                            type={"button"}
                            variant={"tertiary"}
                            size={"sm"}
                            className="text-white justify-self-start"
                            onClick={() => toggleModalTransfer()}
                          >
                            <ArrowUpDown className="me-2" size={18} />
                            Transferir de borderô
                          </Button>
                          <AlertPopUp
                            title="Deseja realmente remover esses vencimentos?"
                            description="Os vencimentos serão removidos definitivamente deste borderô, podendo ser incluidos novamente."
                            action={() =>
                              removeCheckedVencimentos(vencimentosChecked)
                            }
                          >
                            <Button
                              type={"button"}
                              variant={"destructive"}
                              size={"sm"}
                              className="justify-self-start"
                            >
                              <Minus className="me-2" size={18} />
                              Remover
                            </Button>
                          </AlertPopUp>
                        </>
                      )}
                  </div>
                  {wVencimentosErro.length > 0 && (
                    <RowVirtualizerFixedErro
                      data={wVencimentos}
                      filteredData={wVencimentosErro}
                      form={form}
                      modalEditing={modalEditing && !isPending}
                      removeItem={removeItemVencimentos}
                    />
                  )}
                </ItemVencimento>
              </Accordion>
            )}
          </div>
        </form>
        <ModalVencimentos
          open={modalEditing && modalVencimentoOpen}
          handleSelection={handleSelectionVencimento}
          onOpenChange={() => setModalVencimentoOpen((prev) => !prev)}
          id_matriz={id_matriz || ""}
          initialFilters={{
            tipo_data: "data_prevista",
            range_data: {
              from: data_pagamento,
              to: data_pagamento,
            },
          }}
        />
        <ModalTransfer data={vencimentosChecked} id_matriz={id_matriz || ""} />
      </Form>
    </div>
  );
};

export default FormBordero;
