import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FormInput, { Input } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AbatimentosProps, useVales } from "@/hooks/comercial/useVales";
import { Ban, Plus, Save } from "lucide-react";
import { useEffect, useRef } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useFormAbatimentoData } from "./form-data";
import { useStoreVale } from "./store";

interface ModalAbatimentoProps {
  saldo?: string;
}

const initialFormAbatimentoData = { valor: "0", obs: "" };

const ModalAbatimento = ({ saldo }: ModalAbatimentoProps) => {
  const [modalOpen, closeModal, id, idVale] = useStoreVale((state) => [
    state.modalOpenAbatimento,
    state.closeModalAbatimento,
    state.id_abatimento,
    state.id,
  ]);
  const formRef = useRef(null);
  const { data, isLoading } = useVales().getOne(id); //! Trocar por uma função de abatimento

  const {
    mutate: insertAbatimento,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useVales().insertAbatimento();
  const {
    mutate: update,
    isPending: updateIsPending,
    isSuccess: updateIsSuccess,
    isError: updateIsError,
  } = useVales().update(); //! Trocar por uma função de abatimento
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
      ? newDataAbatimento
      : { ...initialFormAbatimentoData, saldo, id_vale: idVale || "" }
  );

  function handleClickCancel() {
    closeModal();
  }

  const onSubmitData = (data: AbatimentosProps) => {
    // if (id) update(data);
    if (!id) insertAbatimento(data);
    console.log(data);
  };

  // ! Verificar a existênicia de erros
  // console.log(form.formState.errors);

  useEffect(() => {
    if (updateIsSuccess || insertIsSuccess) {
      closeModal();
    }
  }, [updateIsPending, insertIsPending]);
  const saldoFinal =
    parseFloat(saldo || "0") - parseFloat(form.watch("valor") || "0");

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Abatimento</DialogTitle>
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
                    />
                  </div>
                </div>
                <FormInput
                  className="flex-1 min-w-[20ch]"
                  name="valor"
                  label="Valor a Abater"
                  type="number"
                  min={0}
                  max={parseFloat(saldo || "0")}
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
                    />
                  </div>
                </div>
              </section>
              <FormInput
                name="obs"
                label="Observação"
                className="flex-1 min-w-full"
                control={form.control}
              />
            </form>
          </Form>
        </ScrollArea>
        <DialogFooter className="flex gap-2 flex-row-reverse">
          <Button
            variant={"secondary"}
            disabled={isLoading}
            onClick={() => closeModal()}
          >
            <Ban className="me-2 text-xl" />
            Cancelar
          </Button>
          <Button
            variant={id ? "success" : "default"}
            type="submit"
            onClick={() => {
              // @ts-ignore
              formRef.current && formRef.current.requestSubmit();
            }}
          >
            {id ? (
              <span className="flex gap-2">
                <Save size={18} />
                Salvar
              </span>
            ) : (
              <span className="flex gap-2">
                <Plus size={18} />
                Adicionar
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAbatimento;
