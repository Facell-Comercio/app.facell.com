import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import AlertPopUp from "@/components/custom/AlertPopUp";
import FormDateInput from "@/components/custom/FormDate";
import FormInput from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DepositosCaixaProps,
  useConferenciasCaixa,
} from "@/hooks/financeiro/useConferenciasCaixa";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { Trash } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormDepositoData } from "../form-data";
import { useStoreCaixa } from "../store";

const initialPropsDepositos: DepositosCaixaProps = {
  id: "",
  id_conta_bancaria: "",
  conta_bancaria: "",
  valor: "",
  comprovante: "",
  data_deposito: "",
};

const ModalDeposito = ({ id_matriz }: { id_matriz?: string }) => {
  const [modalContaBancariaOpen, setModalContaBancariaOpen] =
    useState<boolean>(false);
  const [modalOpen, closeModal, modalEditing, editModal, id, id_caixa] =
    useStoreCaixa((state) => [
      state.modalDepositoOpen,
      state.closeModalDeposito,
      state.modalDepositoEditing,
      state.editModalDeposito,
      state.id_deposito,
      state.id,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useConferenciasCaixa().getOneDeposito(id);
  const { mutate: deleteDeposito } = useConferenciasCaixa().deleteDeposito();
  const {
    mutate: insertOne,
    isSuccess: insertOneIsSuccess,
    isPending: insertOneIsPending,
  } = useConferenciasCaixa().insertOneDeposito();
  const {
    mutate: update,
    isSuccess: updateIsSuccess,
    isPending: updateIsPending,
  } = useConferenciasCaixa().updateDeposito();

  const newDataCaixa: DepositosCaixaProps & Record<string, any> =
    {} as DepositosCaixaProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataCaixa[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataCaixa[key] = "";
    } else {
      newDataCaixa[key] = data[key];
    }
  }

  const { form } = useFormDepositoData(
    id ? newDataCaixa : { ...initialPropsDepositos, id_caixa: id_caixa || "" }
  );

  function onSubmitData(data: DepositosCaixaProps) {
    if (id) update(data);
    if (!id) insertOne(data);
  }

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  function handleSelectionContaBancaria(
    conta_bancaria: ItemContaBancariaProps
  ) {
    form.setValue("conta_bancaria", conta_bancaria.descricao);
    form.setValue("id_conta_bancaria", conta_bancaria.id);
    setModalContaBancariaOpen(false);
  }

  useEffect(() => {
    if (updateIsSuccess) {
      closeModal();
      editModal(false);
    }
  }, [updateIsPending]);
  useEffect(() => {
    if (insertOneIsSuccess) {
      closeModal();
      editModal(false);
    }
  }, [insertOneIsPending]);

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex gap-4">
            {id ? `Depósito: ${id}` : "Novo Depósito"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form {...form}>
              <form
                className="flex gap-2 flex-wrap"
                ref={formRef}
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit(onSubmitData)(e);
                }}
              >
                <FormInput
                  className="flex-1 min-w-full shrink-0"
                  name="conta_bancaria"
                  disabled={!modalEditing}
                  label="Conta Bancária"
                  control={form.control}
                  onClick={() =>
                    modalEditing && setModalContaBancariaOpen(true)
                  }
                />
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="valor"
                  disabled={!modalEditing}
                  label="Valor"
                  type="number"
                  min={0}
                  step="0.01"
                  control={form.control}
                  icon={TbCurrencyReal}
                  iconLeft
                  iconClass="bg-secondary"
                />
                <FormInput
                  className="flex-1 min-w-[30ch] shrink-0"
                  name="comprovante"
                  disabled={!modalEditing}
                  label="Comprovante"
                  control={form.control}
                />
                <FormDateInput
                  disabled={!modalEditing}
                  name="data_deposito"
                  label="Data"
                  control={form.control}
                  className="flex-1 min-w-[30ch]"
                />
              </form>
              <ModalContasBancarias
                open={modalContaBancariaOpen}
                handleSelection={handleSelectionContaBancaria}
                onOpenChange={() => setModalContaBancariaOpen((prev) => !prev)}
                id_matriz={id_matriz || ""}
              />
            </Form>
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
          <ScrollBar />
        </ScrollArea>
        <DialogFooter className="sm:justify-between">
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
          >
            {id && (
              <AlertPopUp
                title={"Deseja realmente excluir"}
                description="Essa ação não pode ser desfeita. O depósito será excluído definitivamente do servidor."
                action={() => {
                  deleteDeposito(id);
                }}
              >
                <Button
                  type={"button"}
                  size="lg"
                  variant={"destructive"}
                  className={`text-white justify-self-start ${
                    !modalEditing && "hidden"
                  }`}
                >
                  <Trash className="me-2" />
                  Excluir Depósito
                </Button>
              </AlertPopUp>
            )}
          </ModalButtons>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDeposito;
