import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { Spinner } from "@/components/custom/Spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { normalizeCurrency, normalizeDate, normalizeNumberOnly } from "@/helpers/mask";
import { FaturaSchema, useCartoes } from "@/hooks/financeiro/useCartoes";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, Hourglass, Info, Receipt, ShoppingCart, Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import ModalTituloPagar from "../../titulos/titulo/Modal";
import { useFormFaturaData } from "./form-data";
import { ItemFatura } from "./ItemFatura";
import ModalTransfer from "./ModalTransfer";
import RowVirtualizerFixed from "./RowVirtualizedFixed";
import { useStoreCartao } from "./store";

const ModalFatura = () => {
  const queryClient = useQueryClient();

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
  const dados: FaturaSchema = data?.data.dados || {};

  const { form } = useFormFaturaData(dados);

  //~ Compras Aprovadas
  const comprasAprovadas = data?.data?.comprasAprovadas || [];
  const qntdAprovadas = (data?.data?.comprasAprovadas && data?.data?.comprasAprovadas.length) || 0;
  const totalAprovadas = parseFloat(data?.data?.totalAprovadas || '0');

  //~ Compras Pendentes
  const comprasPendentes = data?.data?.comprasPendentes || [];
  const qntdPendentes = (data?.data?.comprasPendentes && data?.data?.comprasPendentes.length) || 0;
  const totalPendentes = parseFloat(data?.data.totalPendentes || '0');

  const faturaFechada = !!dados?.closed;
  const disabled = faturaFechada || dados?.status === "pago" || dados?.status === "programado";
  const canDeleteFatura = comprasAprovadas.length + comprasPendentes.length == 0;
  const canReabrirFatura =
    !canDeleteFatura &&
    faturaFechada &&
    !(dados?.status === "pago" || dados?.status === "programado");
  const canCloseFatura = !canDeleteFatura && !faturaFechada;

  const {
    mutate: updateFatura,
    isPending: updateFaturaIsPending,
    isSuccess: updateFaturaIsSuccess,
    isError: updateFaturaIsError,
  } = useCartoes().updateFatura();

  useEffect(() => {
    if (updateFaturaIsSuccess) {
      editModal(false);
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
    color = "bg-slate-600";
  } else if (dados?.status === "pago") {
    color = "bg-blue-600";
  } else if (dados?.status === "programado") {
    color = "bg-green-600";
  } else {
    color = "bg-red-500";
  }

  useEffect(()=>{
    form.setValue('valor', String(parseFloat(form.getValues('valor_inicial') || '0') - parseFloat(form.getValues('estorno') || '0')))
  }, [form.watch('estorno')])

  function handleSubmit() {
    const valor = parseFloat(form.watch("valor") || "0");
    const estorno = parseFloat(form.watch("estorno") || "0");

    const cod_barras = normalizeNumberOnly(form.watch("cod_barras")) || undefined;
    if (cod_barras && cod_barras.length < 44) {
      toast({ title: "Código de barras inválido", variant: "warning" });
      return;
    }
    updateFatura({
      id,
      data_prevista: form.watch("data_prevista"),
      cod_barras,
      valor: String(valor),
      estorno: String(estorno),
    });
  }

  const [isOpenCloseLoading, setIsOpenCloseLoading] = useState<boolean>(false);

  async function handleCloseFatura() {
    const valor = parseFloat(form.watch("valor") || "0") + parseFloat(form.watch("estorno") || "0");

    const diferenca = Math.abs(valor - totalAprovadas);

    if (valor.toFixed(2) !== totalAprovadas.toFixed(2)) {
        toast({
          title: `Valor da fatura + estorno diverge do valor de contas aprovadas em ${normalizeCurrency(diferenca)}`,
          variant: "warning",
        });
      return;
    }
    const cod_barras = normalizeNumberOnly(form.watch("cod_barras")) || undefined;
    if (cod_barras && cod_barras.length < 44) {
      toast({ title: "Código de barras inválido", variant: "warning" });
      return;
    }

    try {
      setIsOpenCloseLoading(true);
      await api.post("/financeiro/contas-a-pagar/cartoes/fatura/fechar", {
        ...dados,
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_pagar"],
      });
      toast({
        variant: "success",
        title: "Fatura fechada!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setIsOpenCloseLoading(false);
    }
  }

  async function handleReabrirFatura() {
    try {
      setIsOpenCloseLoading(true);
      await api.post("/financeiro/contas-a-pagar/cartoes/fatura/reabrir", {
        ...dados,
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_pagar"],
      });
      toast({
        variant: "success",
        title: "Fatura reaberta!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setIsOpenCloseLoading(false);
    }
  }

  async function handleDeleteFatura() {
    try {
      setIsOpenCloseLoading(true);
      await api.delete("/financeiro/contas-a-pagar/cartoes/fatura", {
        params: { id: dados.id },
      });
      queryClient.invalidateQueries({
        queryKey: ["financeiro", "contas_pagar", "cartao"],
      });

      toast({
        variant: "success",
        title: "Fatura excluída!",
      });
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ops!",
        // @ts-ignore
        description: error?.response?.data?.message || error?.message,
      });
    } finally {
      setIsOpenCloseLoading(false);
    }
  }

  const [itemOpen, setItemOpen] = useState<string>("aprovadas");

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {`Fatura: ${id} `}
            {dados?.closed ? (
              <span className="text-slate-500">Fechada</span>
            ) : (
              <span className="text-green-500">Aberta</span>
            )}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <div className="overflow-auto scroll-thin z-[100] flex flex-col gap-3 max-w-full h-full max-h-[72vh] sm:max-h-[70vh] col-span-2">
              {dados?.status && dados?.closed !== undefined && (
                <div className="py-2">
                  <div
                    className={`py-1 text-white text-center border text-md font-bold rounded-sm ${color} capitalize`}
                  >
                    {dados.status == "pago" ? "Pago" : `Pagamento ${dados.status}`}
                  </div>
                </div>
              )}
              <div className="max-w-full p-3 bg-slate-200 dark:bg-blue-950 rounded-lg">
                <div className="flex justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Info /> <span className="text-lg font-bold ">Dados da Fatura</span>
                  </div>
                </div>
                <Form {...form}>
                  <form
                    className="flex flex-col gap-2 flex-wrap"
                    ref={formRef}
                    onSubmit={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSubmit();
                    }}
                  >
                    <div className="flex gap-2">
                      <span className="flex flex-1 flex-col gap-2 min-w-[15ch]">
                        <label className="text-sm font-medium">Data Vencimento</label>
                        <Input
                          disabled={disabled}
                          // @ts-ignore
                          value={normalizeDate(dados?.data_vencimento || "")}
                          readOnly
                        />
                      </span>
                      <span className="flex flex-col gap-2">
                        <label className="text-sm font-medium">Data Previsão</label>
                        <InputDate
                          disabled={disabled || !modalEditing || isPending}
                          value={form.watch(`data_prevista`)}
                          onChange={(e: Date) => form.setValue(`data_prevista`, e)}
                        />
                      </span>
                      <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                        <label className="text-sm font-medium">Valor da Fatura</label>
                        <FormInput
                          type="number"
                          name={`valor_inicial`}
                          control={form.control}
                          min={0}
                          icon={TbCurrencyReal}
                          iconLeft
                          disabled={disabled || !modalEditing || isPending}
                        />
                      </span>
                      <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                        <label className="text-sm font-medium">Estorno</label>
                        <FormInput
                          type="number"
                          name={`estorno`}
                          control={form.control}
                          min={0}
                          icon={TbCurrencyReal}
                          iconLeft
                          disabled={disabled || !modalEditing || isPending}
                        />
                      </span>
                      <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                        <label className="text-sm font-medium">Valor Final</label>
                        <FormInput
                          type="number"
                          name={`valor`}
                          control={form.control}
                          min={0}
                          icon={TbCurrencyReal}
                          iconLeft
                          disabled={disabled || !modalEditing || isPending}
                        />
                      </span>


                    </div>
                    <div className="flex gap-2">
                      <span className="flex flex-1 flex-col gap-2 min-w-[20ch]">
                        <label className="text-sm font-medium">Cod. Barras</label>
                        <FormInput
                          disabled={disabled || !modalEditing || isPending}
                          name={`cod_barras`}
                          control={form.control}
                        />
                      </span>
                    </div>

                  </form>
                </Form>
              </div>
              {qntdAprovadas > 0 && (
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
                    valorTotal={totalAprovadas}
                  >
                    <div className="flex justify-end mb-3 flex-wrap">
                      {!dados?.closed && (
                        <span title={ids.length === 0 ? "Selecione no mínimo um vencimento" : ""}>
                          <Button
                            type={"button"}
                            variant={"tertiary"}
                            size={"sm"}
                            className="text-white justify-self-start"
                            disabled={
                              !modalEditing || isPending || ids.length === 0 || !!dados.closed
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
                        modalEditing={modalEditing && !isPending && !dados?.closed}
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
                        <span title={ids.length === 0 ? "Selecione no mínimo um vencimento" : ""}>
                          <Button
                            type={"button"}
                            variant={"tertiary"}
                            size={"sm"}
                            className="text-white justify-self-start"
                            disabled={
                              !modalEditing || isPending || ids.length === 0 || !!dados.closed
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
                        modalEditing={modalEditing && !isPending && !dados?.closed}
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
            blockEdit={disabled}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
          >
            <>
              <div className="flex gap-3 items-center">
                {canDeleteFatura && (
                  <AlertPopUp
                    title={`Deseja realmente fechar a fatura?`}
                    action={handleDeleteFatura}
                  >
                    <Button disabled={isOpenCloseLoading} variant={"destructive"} size={"lg"}>
                      {isOpenCloseLoading ? <Spinner /> : <Trash className="me-2" />}
                      {"Excluir Fatura"}
                    </Button>
                  </AlertPopUp>
                )}
                {canCloseFatura && (
                  <AlertPopUp
                    title={`Deseja realmente fechar a fatura?`}
                    action={handleCloseFatura}
                  >
                    <Button variant={"destructive"} size={"lg"}>
                      <Receipt className="me-2" />
                      {"Fechar Fatura"}
                    </Button>
                  </AlertPopUp>
                )}
                {canReabrirFatura && (
                  <AlertPopUp
                    title={`Deseja realmente reabrir a fatura?`}
                    action={handleReabrirFatura}
                  >
                    <Button variant={"warning"} size={"lg"}>
                      {isOpenCloseLoading ? <Spinner /> : <Receipt className="me-2" />}
                      {"Reabrir Fatura"}
                    </Button>
                  </AlertPopUp>
                )}
              </div>
            </>
          </ModalButtons>
        </DialogFooter>
        <ModalTransfer
          ids={ids}
          id_cartao={dados?.id_cartao || ""}
          dia_vencimento={dados?.dia_vencimento || ""}
          id_fatura={id || ""}
        />
        <ModalTituloPagar />
      </DialogContent>
    </Dialog>
  );
};

export default ModalFatura;
