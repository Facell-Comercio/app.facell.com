import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormInput, { Input } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import ModalButtons from "@/components/custom/ModalButtons";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { normalizeDate, normalizeNumberOnly } from "@/helpers/mask";
import { FaturaSchema, useCartoes } from "@/hooks/financeiro/useCartoes";
import {
  ArrowUpDown,
  Hourglass,
  Info,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormFaturaData } from "./form-data";
import { ItemFatura } from "./ItemFatura";
import ModalTransfer from "./ModalTransfer";
import RowVirtualizerFixed from "./RowVirtualizedFixed";
import { useStoreCartao } from "./store";

type DadosUpdateProps = {
  data_prevista?: Date;
  cod_barras?: string;
  valor?: string;
};

const ModalFatura = () => {
  const [
    modalOpen,
    closeModal,
    id,
    modalEditing,
    editModal,
    isPending,
    editIsPending,
    openModalTransfer,
    ids,
    handleChangeIds,
  ] = useStoreCartao((state) => [
    state.modalFaturaOpen,
    state.closeModalFatura,
    state.id_fatura,
    state.modalFaturaEditing,
    state.editFaturaModal,
    state.isPending,
    state.editIsPending,
    state.openModalTransfer,
    state.ids,
    state.handleChangeIds,
  ]);
  const formRef = useRef(null);

  const { data, isLoading } = useCartoes().getFatura(id);
  const dados: FaturaSchema = data?.data.dados;
  const { form } = useFormFaturaData(dados);

  //~ Compras Aprovadas
  const comprasAprovadas = data?.data?.comprasAprovadas || [];
  const qntdAprovadas =
    (data?.data?.comprasAprovadas && data?.data?.comprasAprovadas.length) || 0;
  const totalAprovadas = data?.data?.totalAprovadas || 0;

  //~ Compras Pendentes
  const comprasPendentes = data?.data.comprasPendentes;
  const qntdPendentes =
    (data?.data?.comprasPendentes && data?.data?.comprasPendentes.length) || 0;
  const totalPendentes = data?.data.totalPendentes;

  const {
    mutate: updateFatura,
    isPending: updateFaturaIsPending,
    isSuccess: updateFaturaIsSuccess,
    isError: updateFaturaIsError,
  } = useCartoes().updateFatura();

  useEffect(() => {
    if (updateFaturaIsSuccess) {
      editModal(false);
      closeModal();
      editIsPending(false);
    } else if (updateFaturaIsError) {
      editIsPending(false);
    } else if (updateFaturaIsPending) {
      editIsPending(true);
    }
  }, [updateFaturaIsPending]);

  function handleClickCancel() {
    closeModal();
  }

  let color = "";
  if (dados?.status === "pendente") {
    color = "bg-yellow-600";
  } else if (dados?.status === "pago") {
    color = "bg-green-600";
  } else if (dados?.status === "programado") {
    color = "bg-orange-600";
  } else {
    color = "bg-red-500";
  }

  function handleSubmit() {
    const valor = parseFloat(form.watch("valor") || "0");
    const diferenca = Math.abs(valor - parseFloat(totalAprovadas));
    if (valor !== parseFloat(totalAprovadas)) {
      if (parseFloat(totalAprovadas) < valor) {
        toast({
          title: `Valor da fatura ultrapassou o esperado em R$${diferenca}`,
          variant: "warning",
        });
      }
      if (parseFloat(totalAprovadas) > valor) {
        toast({
          title: `Valor da fatura é inferior ao valor esperado em R$${diferenca}`,
          variant: "warning",
        });
      }
      return;
    }
    const cod_barras =
      normalizeNumberOnly(form.watch("cod_barras")) || undefined;
    if (cod_barras && cod_barras.length < 44) {
      toast({ title: "Código de barras inválido", variant: "warning" });
      return;
    }
    updateFatura({
      id,
      data_prevista: form.watch("data_prevista"),
      cod_barras,
      valor: String(valor),
    });
  }

  function handleCloseFatura() {
    if (!form.watch("cod_barras")) {
      toast({ title: "Código de barras obrigatório", variant: "warning" });
      return;
    }
    const valor = parseFloat(form.watch("valor") || "0");
    const diferenca = Math.abs(valor - parseFloat(totalAprovadas));
    if (valor !== parseFloat(totalAprovadas)) {
      if (parseFloat(totalAprovadas) < valor) {
        toast({
          title: `Valor da fatura ultrapassou o esperado em R$${diferenca}`,
          variant: "warning",
        });
      }
      if (parseFloat(totalAprovadas) > valor) {
        toast({
          title: `Valor da fatura é inferior ao valor esperado em R$${diferenca}`,
          variant: "warning",
        });
      }
      return;
    }
    const cod_barras =
      normalizeNumberOnly(form.watch("cod_barras")) || undefined;
    if (cod_barras && cod_barras.length < 44) {
      toast({ title: "Código de barras inválido", variant: "warning" });
      return;
    }
    updateFatura({
      id,
      closed: !dados?.closed,
      cod_barras: form.watch("cod_barras") || undefined,
      valor: String(valor),
    });
  }

  const [itemOpen, setItemOpen] = useState<string>("aprovadas");

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Fatura: ${id}`}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
              {dados?.status && dados?.closed !== undefined && (
                <div className="py-2">
                  <div
                    className={`py-1 text-white text-center border text-md font-bold rounded-sm ${color} capitalize`}
                  >
                    {dados.status} - {dados.closed ? "Fechada" : "Aberta"}
                  </div>
                </div>
              )}
              <div className="max-w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Info />{" "}
                    <span className="text-lg font-bold ">Dados da Fatura</span>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    className="flex gap-2 flex-wrap"
                    ref={formRef}
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit();
                    }}
                  >
                    <span className="flex flex-1 flex-col gap-2 min-w-[15ch]">
                      <label className="text-sm font-medium">
                        Data Vencimento
                      </label>
                      <Input
                        value={normalizeDate(dados?.data_vencimento || "")}
                        readOnly
                      />
                    </span>
                    <span className="flex flex-col gap-2">
                      <label className="text-sm font-medium">
                        Data Previsão
                      </label>
                      <InputDate
                        disabled={!modalEditing || isPending}
                        value={form.watch(`data_prevista`)}
                        onChange={(e: Date) =>
                          form.setValue(`data_prevista`, e)
                        }
                      />
                    </span>
                    <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                      <label className="text-sm font-medium">Valor</label>
                      <FormInput
                        type="number"
                        name={`valor`}
                        control={form.control}
                        min={0}
                        icon={TbCurrencyReal}
                        iconLeft
                        disabled={!modalEditing || isPending}
                      />
                    </span>
                    <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                      <label className="text-sm font-medium">Cod. Barras</label>
                      <FormInput
                        disabled={!modalEditing || isPending}
                        name={`cod_barras`}
                        control={form.control}
                      />
                    </span>
                  </form>
                </Form>
              </div>
              {qntdAprovadas >= 0 && (
                <Accordion
                  type="single"
                  collapsible
                  value={itemOpen}
                  onValueChange={(e) => setItemOpen(e)}
                  className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg "
                >
                  <ItemFatura
                    title="Compras Aprovadas"
                    value="aprovadas"
                    className="flex-col"
                    icon={ShoppingCart}
                    qtde={qntdAprovadas}
                    valorTotal={parseFloat(totalAprovadas)}
                  >
                    <div className="flex justify-end mb-3 flex-wrap">
                      {!dados?.closed && (
                        <span
                          title={
                            ids.length === 0
                              ? "Selecione no mínimo um vencimento"
                              : ""
                          }
                        >
                          <Button
                            type={"button"}
                            variant={"tertiary"}
                            size={"sm"}
                            className="text-white justify-self-start"
                            disabled={
                              !modalEditing ||
                              isPending ||
                              ids.length === 0 ||
                              !!dados.closed
                            }
                            onClick={() => openModalTransfer()}
                          >
                            <ArrowUpDown className="me-2" size={18} />
                            Transferir de Fatura
                          </Button>
                        </span>
                      )}
                    </div>
                    <section className="grid grid-cols-1 max-w-full gap-2 flex-nowrap">
                      <RowVirtualizerFixed
                        data={comprasAprovadas}
                        modalEditing={
                          modalEditing && !isPending && !dados?.closed
                        }
                        ids={ids}
                        handleChangeIds={handleChangeIds}
                      />
                    </section>
                  </ItemFatura>
                </Accordion>
              )}
              {qntdPendentes > 0 && (
                <Accordion
                  type="single"
                  collapsible
                  value={itemOpen}
                  onValueChange={(e) => setItemOpen(e)}
                  className="px-2 py-1 border bg-slate-200 dark:bg-blue-950 rounded-lg border-yellow-600"
                >
                  <ItemFatura
                    title="Compras Pendentes"
                    value="pendentes"
                    className="flex-col"
                    icon={Hourglass}
                    qtde={qntdPendentes}
                    valorTotal={totalPendentes}
                  >
                    <div className="flex justify-end mb-3 flex-wrap">
                      {!dados?.closed && (
                        <span
                          title={
                            ids.length === 0
                              ? "Selecione no mínimo um vencimento"
                              : ""
                          }
                        >
                          <Button
                            type={"button"}
                            variant={"tertiary"}
                            size={"sm"}
                            className="text-white justify-self-start"
                            disabled={
                              !modalEditing ||
                              isPending ||
                              ids.length === 0 ||
                              !!dados.closed
                            }
                            onClick={() => openModalTransfer()}
                          >
                            <ArrowUpDown className="me-2" size={18} />
                            Transferir de Fatura
                          </Button>
                        </span>
                      )}
                    </div>
                    <section className="grid grid-cols-1 max-w-full gap-2 flex-nowrap">
                      <RowVirtualizerFixed
                        data={comprasPendentes}
                        modalEditing={
                          modalEditing && !isPending && !dados?.closed
                        }
                        ids={ids}
                        handleChangeIds={handleChangeIds}
                      />
                    </section>
                  </ItemFatura>
                </Accordion>
              )}
            </div>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
          >
            {!(dados?.status === "pago" || dados?.status === "programado") && (
              <AlertPopUp
                title={`Deseja realmente ${
                  !dados?.closed ? "fechar a  fatura" : "reabrir a fatura"
                }?`}
                action={() => {
                  handleCloseFatura();
                }}
              >
                <Button
                  variant={!dados?.closed ? "destructive" : "success"}
                  size={"lg"}
                >
                  <Receipt className="me-2" />
                  {!dados?.closed ? "Fechar Fatura" : "Reabrir Fatura"}
                </Button>
              </AlertPopUp>
            )}
          </ModalButtons>
        </DialogFooter>
        <ModalTransfer
          ids={ids}
          id_cartao={dados?.id_cartao || ""}
          dia_vencimento={dados?.dia_vencimento || ""}
          id_fatura={id || ""}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ModalFatura;
