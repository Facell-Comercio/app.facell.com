import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FormInput from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransferenciaTesourariaSchema, useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { ArrowDownUp, Ban } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { TbCurrencyReal } from "react-icons/tb";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "../../components/ModalContasBancarias";
import { useStoreTesouraria } from "../store";
import { useFormTransferenciaTesourariaData } from "./form-data";

export type NewTesourariaProps = {
  id_filial?: string;
  valor?: string;
};

const ModalTransferenciaTesouraria = () => {
  const [modalOpen, closeModal, setIsPending] = useStoreTesouraria((state) => [
    state.modalTransferOpen,
    state.closeTransferModal,
    state.setIsPending,
  ]);
  const [modalContaBancariaSaidaOpen, setModalContaBancariaSaidaOpen] = useState<boolean>(false);
  const [modalContaBancariaEntradaOpen, setModalContaBancariaEntradaOpen] =
    useState<boolean>(false);

  const initialPropsFormData: TransferenciaTesourariaSchema = {
    id_caixa_saida: "",
    caixa_saida: "",
    saldo_caixa_saida: "",
    id_caixa_entrada: "",
    caixa_entrada: "",
    saldo_caixa_entrada: "",
    valor_transferir: "0",
  };
  const { form } = useFormTransferenciaTesourariaData(initialPropsFormData);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    mutate: transferSaldo,
    isPending: transferSaldoIsPending,
    isSuccess: transferSaldoIsSuccess,
    isError: transferSaldoIsError,
  } = useTesouraria().transferSaldo();
  const [modalData, setModalData] = useState({
    id_matriz: "",
    entrada_is_caixa: 0,
    saida_is_caixa: 0,
  });

  const onSubmitData = (data: TransferenciaTesourariaSchema) => {
    transferSaldo(data);
  };

  function handleClickCancel() {
    closeModal();
  }
  function handleSelectionContaBancariaSaida(item: ItemContaBancariaProps) {
    form.setValue("id_caixa_saida", item.id);
    form.setValue("caixa_saida", item.descricao);

    if (!item.caixa) {
      form.setValue("saldo_caixa_saida", "-");
    } else {
      form.setValue("saldo_caixa_saida", item.saldo);
    }

    setModalData((prev) => ({ ...prev, id_matriz: item.id_matriz, saida_is_caixa: item.caixa }));
    form.setValue("id_caixa_entrada", "");
    form.setValue("caixa_entrada", "");
    form.setValue("saldo_caixa_entrada", "");
    setModalContaBancariaSaidaOpen(false);
  }
  function handleSelectionContaBancariaEntrada(item: ItemContaBancariaProps) {
    form.setValue("id_caixa_entrada", item.id);
    form.setValue("caixa_entrada", item.descricao);

    if (!item.caixa) {
      form.setValue("saldo_caixa_entrada", "-");
    } else {
      form.setValue("saldo_caixa_entrada", item.saldo);
    }

    setModalData((prev) => ({ ...prev, id_matriz: item.id_matriz, entrada_is_caixa: item.caixa }));
    setModalContaBancariaEntradaOpen(false);
  }

  useEffect(() => {
    if (!modalOpen) {
      form.reset();
      setModalData({
        id_matriz: "",
        entrada_is_caixa: 0,
        saida_is_caixa: 0,
      });
    }
  }, [modalOpen]);

  useEffect(() => {
    if (transferSaldoIsSuccess) {
      closeModal();
      setIsPending(false);
    } else if (transferSaldoIsPending) {
      setIsPending(true);
    } else if (transferSaldoIsError) {
      setIsPending(false);
    }
  }, [transferSaldoIsPending]);

  const saldo_conta_saida = form.watch("saldo_caixa_saida");
  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Transferência Entre Contas Caixa</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(onSubmitData)}
              className="flex flex-col gap-3 w-full"
            >
              <div className="flex gap-2 px-1">
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="caixa_saida"
                  label="Conta Caixa de Saída:"
                  control={form.control}
                  readOnly
                  placeholder="SELECIONE A CONTA BANCÁRIA"
                  onClick={() => setModalContaBancariaSaidaOpen(true)}
                />
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="saldo_caixa_saida"
                  label="Saldo:"
                  control={form.control}
                  readOnly
                  iconLeft
                  icon={TbCurrencyReal}
                  iconClass="bg-secondary"
                  onClick={() => setModalContaBancariaSaidaOpen(true)}
                />
              </div>
              <div className="flex gap-2 px-1">
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="caixa_entrada"
                  label="Conta Caixa de Entrada:"
                  control={form.control}
                  readOnly
                  disabled={!saldo_conta_saida}
                  placeholder="SELECIONE A CONTA BANCÁRIA"
                  onClick={() => saldo_conta_saida && setModalContaBancariaEntradaOpen(true)}
                />
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="saldo_caixa_entrada"
                  label="Saldo:"
                  control={form.control}
                  readOnly
                  disabled={!saldo_conta_saida}
                  iconLeft
                  icon={TbCurrencyReal}
                  iconClass="bg-secondary"
                  onClick={() => saldo_conta_saida && setModalContaBancariaEntradaOpen(true)}
                />
              </div>
              <FormInput
                className="flex-1 min-w-[30ch] shrink-0 mb-1 mr-1"
                name="valor_transferir"
                label="Valor a Transferir:"
                control={form.control}
                type="number"
                iconLeft
                disabled={!saldo_conta_saida}
                icon={TbCurrencyReal}
                iconClass="bg-secondary"
                max={modalData.saida_is_caixa ? parseFloat(saldo_conta_saida || "0") : undefined}
                min={0}
              />
            </form>
            <ModalContasBancarias
              open={modalContaBancariaSaidaOpen}
              handleSelection={handleSelectionContaBancariaSaida}
              onOpenChange={() => setModalContaBancariaSaidaOpen(false)}
            />
            <ModalContasBancarias
              open={modalContaBancariaEntradaOpen}
              handleSelection={handleSelectionContaBancariaEntrada}
              onOpenChange={() => setModalContaBancariaEntradaOpen(false)}
              isCaixa={!modalData.saida_is_caixa}
              id_matriz={modalData.id_matriz}
            />
          </Form>
        </ScrollArea>
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <Button onClick={handleClickCancel} variant={"secondary"}>
            <Ban className="me-2" />
            Cancelar
          </Button>
          <Button type="submit" onClick={() => formRef.current && formRef.current.requestSubmit()}>
            <ArrowDownUp className="me-2" />
            Transferir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTransferenciaTesouraria;
