import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FormInput, { Input } from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AbatimentosProps, useVales } from "@/hooks/comercial/useVales";
import { useEffect, useRef } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormAbatimentoData } from "./form-data";
import { useStoreVale } from "./store";

interface ModalAbatimentoProps {
  saldo?: string;
}

const initialFormAbatimentoData = { valor: "0", obs: "" };

const ModalAbatimento = ({ saldo }: ModalAbatimentoProps) => {
  const [modalOpen, closeModal, id, idVale, modalEditing, editModal] =
    useStoreVale((state) => [
      state.modalOpenAbatimento,
      state.closeModalAbatimento,
      state.id_abatimento,
      state.id,
      state.modalEditingAbatimento,
      state.editModalAbatimento,
    ]);
  const formRef = useRef(null);
  const { data } = useVales().getOneAbatimento(id);

  const {
    mutate: insertAbatimento,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
  } = useVales().insertAbatimento();
  const {
    mutate: updateAbatimento,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
  } = useVales().updateAbatimento();
  const newDataAbatimento: AbatimentosProps & Record<string, any> =
    {} as AbatimentosProps & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newDataAbatimento[key] = String(data[key]);
    } else if (data[key] === null) {
      newDataAbatimento[key] = "";
    } else {
      newDataAbatimento[key] = data[key];
    }
  }

  const { form } = useFormAbatimentoData(
    id
      ? {
          ...newDataAbatimento,
          saldo: newDataAbatimento.saldo_vale,
          valor_inicial: newDataAbatimento.valor,
        }
      : { ...initialFormAbatimentoData, saldo, id_vale: idVale || "" }
  );

  function handleClickCancel() {
    closeModal();
    editModal(false);
  }

  const disabled = !modalEditing || insertIsPending || updateIsPending;

  const onSubmitData = (data: AbatimentosProps) => {
    console.log(data);
    if (id) updateAbatimento(data);
    if (!id) insertAbatimento(data);
  };

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      closeModal();
      editModal(false);
    }
  }, [updateIsPending, insertIsPending]);

  //~ O cálculo será diferente se houver um id
  const saldoVale = id
    ? parseFloat(newDataAbatimento.saldo_vale || "0") +
      parseFloat(newDataAbatimento.valor || "0")
    : parseFloat(saldo || "0");

  const saldoFinal = saldoVale - parseFloat(form.watch("valor") || "0");

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id ? `Abatimento: ${id}` : "Novo Abatimento"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={(e) => {
                // @ts-ignore
                form.handleSubmit(onSubmitData)(e);
                e.stopPropagation();
              }}
              className="flex gap-2 items-end flex-wrap"
            >
              <section className="min-w-full flex items-end gap-2 flex-wrap">
                <div className="flex flex-col gap-2 flex-1 min-w-[20ch]">
                  <label className="text-sm font-medium">Saldo</label>
                  <div className="flex itens-center justify-center">
                    <Button
                      type={"button"}
                      variant={"secondary"}
                      disabled={true}
                      className={`flex items-center justify-center rounded-none p-2 rounded-l-md `}
                    >
                      <TbCurrencyReal size={18} />
                    </Button>
                    <Input
                      type="number"
                      className="rounded-none rounded-r-md"
                      readOnly
                      value={saldo}
                      disabled={disabled}
                    />
                  </div>
                </div>
                <FormInput
                  className="flex-1 min-w-[20ch]"
                  name="valor"
                  label="Valor a Abater"
                  type="number"
                  min={0}
                  max={saldoVale}
                  disabled={disabled}
                  step="0.01"
                  icon={TbCurrencyReal}
                  iconLeft
                  control={form.control}
                  iconClass="bg-secondary text-secondary-foreground dark:text-white"
                />
                <div className="flex flex-col gap-2 flex-1 min-w-[20ch]">
                  <label className="text-sm font-medium">Saldo Final</label>
                  <div className="flex itens-center justify-center">
                    <Button
                      type={"button"}
                      variant={"secondary"}
                      disabled={true}
                      className={`flex items-center justify-center rounded-none p-2 rounded-l-md `}
                    >
                      <TbCurrencyReal size={18} />
                    </Button>
                    <Input
                      type="number"
                      className="rounded-none rounded-r-md"
                      readOnly
                      value={saldoFinal.toFixed(2)}
                      disabled={disabled}
                    />
                  </div>
                </div>
              </section>
              <FormInput
                name="obs"
                label="Observação"
                disabled={disabled}
                className="flex-1 min-w-full"
                control={form.control}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="flex gap-2 flex-row-reverse">
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAbatimento;
