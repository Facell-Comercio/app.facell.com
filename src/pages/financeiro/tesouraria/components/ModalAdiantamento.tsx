import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/custom/FormInput";
import ModalButtons from "@/components/custom/ModalButtons";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { TransacaoTesourariaSchema, useTesouraria } from "@/hooks/financeiro/useTesouraria";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useEffect, useRef, useState } from "react";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreTesouraria } from "../store";

const initialDataForm: TransacaoTesourariaSchema = {
  id: "",
  descricao: "",
  valor: "",
  id_conta_bancaria: "",
};

const ModalAdiantamento = () => {
  const [modalOpen, closeModal, setIsPending, id_conta_bancaria, id_extrato_bancario] =
    useStoreTesouraria((state) => [
      state.modalAdiantamentoOpen,
      state.closeAdiantamentoModal,
      state.setIsPending,
      state.id,
      state.id_extrato_bancario,
    ]);

  const { data } = useTesouraria().getOneTransacao(id_extrato_bancario || "");
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formData, setFormData] = useState<TransacaoTesourariaSchema>(
    id_extrato_bancario ? data : initialDataForm
  );

  const {
    mutate: insertAdiantamento,
    isPending: insertAdiantamentoIsPending,
    isSuccess: insertAdiantamentoIsSuccess,
    isError: insertAdiantamentoIsError,
  } = useTesouraria().insertAdiantamento();

  const {
    mutate: updateTransacao,
    isPending: updateTransacaoIsPending,
    isSuccess: updateTransacaoIsSuccess,
    isError: updateTransacaoIsError,
  } = useTesouraria().updateTransacao();

  function handleClickCancel() {
    closeModal();
  }

  function onSubmitData() {
    if (!formData.descricao || !formData.valor) {
      toast({
        title: "Dados insuficientes!",
        description: "Defina qual será a descrição e o valor do adiantamento",
        variant: "destructive",
      });
      return;
    }

    if (!id_extrato_bancario) {
      insertAdiantamento({ ...formData, id_conta_bancaria: id_conta_bancaria || "" });
    }
    if (id_extrato_bancario) {
      updateTransacao(formData);
    }
  }

  useEffect(() => {
    if (!modalOpen) setFormData(initialDataForm);
    if (modalOpen) setFormData(id_extrato_bancario && data ? data : initialDataForm);
  }, [modalOpen, data]);

  useEffect(() => {
    if (insertAdiantamentoIsSuccess) {
      closeModal();
      setIsPending(false);
    } else if (insertAdiantamentoIsPending) {
      setIsPending(true);
    } else if (insertAdiantamentoIsError) {
      setIsPending(false);
    }
  }, [insertAdiantamentoIsPending]);

  useEffect(() => {
    if (updateTransacaoIsSuccess) {
      closeModal();
      setIsPending(false);
    } else if (updateTransacaoIsPending) {
      setIsPending(true);
    } else if (updateTransacaoIsError) {
      setIsPending(false);
    }
  }, [updateTransacaoIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-fit xl:min-w-1">
        <DialogHeader>
          <DialogTitle className="flex justify-between pe-4">
            {id_extrato_bancario ? `Adiantamento: ${id_extrato_bancario}` : "Novo adiantamento:"}
          </DialogTitle>
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
            <span className="flex min-w-[50ch] flex-col gap-2">
              <label className="text-sm font-medium">Descrição:</label>
              <Textarea
                maxLength={250}
                value={formData.descricao || ""}
                onChange={(e) =>
                  setFormData((prev: TransacaoTesourariaSchema) => ({
                    ...prev,
                    descricao: e.target.value,
                  }))
                }
              />
            </span>
            <span className="flex flex-1 flex-col gap-2">
              <label className="text-sm font-medium">Valor:</label>
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
                  value={formData.valor || ""}
                  className="rounded-l-none"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min={0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
                />
              </div>
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

export default ModalAdiantamento;
