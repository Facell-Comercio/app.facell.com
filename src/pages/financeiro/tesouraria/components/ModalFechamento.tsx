import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputDate } from "@/components/custom/InputDate";
import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { FechamentoTesourariaSchema, useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { DialogDescription } from "@radix-ui/react-dialog";
import { addDays, subDays } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { useStoreTesouraria } from "../store";

const initialDataForm: FechamentoTesourariaSchema = {
  data_fechamento: subDays(new Date(), 1),
  id_conta_bancaria: "",
};

const ModalFechamento = () => {
  const [modalOpen, closeModal, setIsPending, id_conta_bancaria, data_fechamento] =
    useStoreTesouraria((state) => [
      state.modalFechamentoOpen,
      state.closeFechamentoModal,
      state.setIsPending,
      state.id,
      state.data_fechamento,
    ]);

  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState<FechamentoTesourariaSchema>(initialDataForm);

  const {
    mutate: fechamento,
    isPending: fechamentoIsPending,
    isSuccess: fechamentoIsSuccess,
    isError: fechamentoIsError,
  } = useTesouraria().fechamento();

  function handleClickCancel() {
    closeModal();
  }

  function onSubmitData() {
    if (!formData.data_fechamento) {
      toast({
        title: "Dados insuficientes!",
        description: "Defina qual será data do fechamento",
        variant: "destructive",
      });
      return;
    }

    fechamento({
      ...formData,
      id_conta_bancaria: id_conta_bancaria || "",
    });
  }

  useEffect(() => {
    if (!modalOpen && data_fechamento)
      setFormData({ ...initialDataForm, data_fechamento: data_fechamento || undefined });
  }, [modalOpen, data_fechamento]);

  useEffect(() => {
    if (fechamentoIsSuccess) {
      closeModal();
      setIsPending(false);
    } else if (fechamentoIsPending) {
      setIsPending(true);
    } else if (fechamentoIsError) {
      setIsPending(false);
    }
  }, [fechamentoIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit xl:min-w-1">
        <DialogHeader>
          <DialogTitle className="flex justify-between pe-4">Novo fechamento:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSubmitData();
            }}
            className="flex flex-col gap-3 p-1 w-full"
          >
            <span className="flex flex-col gap-2">
              <label className="text-sm font-medium">Descrição:</label>
              <InputDate
                value={formData.data_fechamento}
                min={addDays(formData.data_fechamento || "", 1)}
                max={subDays(new Date(), 1)}
                onChange={(e) => setFormData((prev) => ({ ...prev, data_fechamento: e }))}
              />
            </span>
          </form>
          <ScrollBar />
        </ScrollArea>
        <DialogFooter>
          <ModalButtons modalEditing={true} cancel={handleClickCancel} formRef={formRef} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalFechamento;
