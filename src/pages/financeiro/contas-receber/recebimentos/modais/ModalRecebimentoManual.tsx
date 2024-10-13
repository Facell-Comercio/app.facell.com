import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/custom/FormInput";
import { InputDate } from "@/components/custom/InputDate";
import { RecebimentoProps, useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { Ban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { TbCurrencyReal } from "react-icons/tb";
import { useStoreRecebimentos } from "../store";

const initialValuesRecebimento: RecebimentoProps = {
  id_vencimento: "",
  data: new Date(),
  id_conta_bancaria: "",
  conta_bancaria: "",
  valor: "",
};

export function ModalRecebimentoManual() {
  const [modalOpen, closeModal, id_matriz, id_vencimento, editIsPending, isPending] =
    useStoreRecebimentos((state) => [
      state.modalRecebimentoManualOpen,
      state.closeModalRecebimentoManual,

      state.id_matriz,
      state.id_vencimento,

      state.editIsPending,
      state.isPending,
    ]);

  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useTituloReceber().insertOneRecebimento();

  const [formData, setFormData] = useState<RecebimentoProps>(initialValuesRecebimento);
  const [modalContasBancariasOpen, setModalContasBancariasOpen] = useState(false);

  function handleClickCancel() {
    closeModal();
  }

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setFormData((prev) => ({
      ...prev,
      conta_bancaria: item.descricao,
      id_conta_bancaria: item.id,
    }));

    setModalContasBancariasOpen(false);
  }

  useEffect(() => {
    setFormData(initialValuesRecebimento);
  }, [modalOpen]);

  useEffect(() => {
    if (insertIsSuccess) {
      closeModal();
      editIsPending(false);
    } else if (insertIsError) {
      editIsPending(false);
    } else if (insertIsPending) {
      editIsPending(true);
    }
  }, [insertIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className={`md:max-w-xl`}>
        <DialogHeader>
          <DialogTitle>Adicionar Recebimento</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <section className="flex gap-3 flex-wrap">
          <div className="flex-1 flex flex-col gap-2">
            <label className="text-sm font-medium">Data do Recebimento</label>
            <InputDate
              value={formData.data}
              onChange={(date) => setFormData((prev) => ({ ...prev, data: date }))}
              disabled={isPending}
              className="w-full"
            />
          </div>
          <div className="flex-1 min-w-[30ch] flex flex-col gap-2">
            <label className="text-sm font-medium">Valor</label>
            <span className="flex">
              <Button
                type={"button"}
                variant={"outline"}
                disabled={true}
                className={`flex items-center justify-center rounded-none p-2 rounded-l-md bg-secondary`}
              >
                <TbCurrencyReal size={18} />
              </Button>
              <Input
                type="number"
                className="rounded-none rounded-r-md"
                value={formData.valor}
                onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
                disabled={isPending}
                min={0}
              />
            </span>
          </div>
          <div className="flex-1 min-w-[30ch] flex flex-col gap-2">
            <label className="text-sm font-medium">Conta Bancaria</label>
            <Input
              readOnly
              value={formData.conta_bancaria}
              onClick={() => setModalContasBancariasOpen(true)}
              disabled={isPending}
            />
          </div>
        </section>
        <ModalContasBancarias
          open={modalContasBancariasOpen}
          handleSelection={handleSelectionContaBancaria}
          onOpenChange={() => setModalContasBancariasOpen(false)}
          id_matriz={id_matriz || ""}
          isCaixa
        />
        <DialogFooter>
          <Button
            className="flex gap-2"
            variant={"secondary"}
            onClick={handleClickCancel}
            disabled={isPending}
          >
            <Ban size={18} />
            Cancelar
          </Button>
          <Button
            className="flex gap-2"
            onClick={() => insertOne({ ...formData, id_vencimento: id_vencimento || "" })}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <Plus size={18} />
                Adicionar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
