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
import { useTituloReceber } from "@/hooks/financeiro/useTituloReceber";
import ModalContasBancarias, {
  ItemContaBancariaProps,
} from "@/pages/financeiro/components/ModalContasBancarias";
import { Ban, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreRecebimentos } from "../store";
import VirtualizedTransacoesCR from "./components/VirtualizedTransacoesCR";
import VirtualizedVencimentosCR from "./components/VirtualizedVencimentosCR";

export function ModalRecebimentoBancario() {
  const [modalOpen, closeModal, editIsPending, isPending] = useStoreRecebimentos((state) => [
    state.modalRecebimentoBancarioOpen,
    state.closeModalRecebimentoBancario,

    state.editIsPending,
    state.isPending,
  ]);

  const {
    mutate: insertOne,
    isPending: insertIsPending,
    isSuccess: insertIsSuccess,
    isError: insertIsError,
  } = useTituloReceber().insertOneRecebimento();

  const [modalContasBancariasOpen, setModalContasBancariasOpen] = useState(false);
  const [contaBancaria, setContaBancaria] = useState<ItemContaBancariaProps | null>(null);

  function handleClickCancel() {
    closeModal();
  }

  function handleSelectionContaBancaria(item: ItemContaBancariaProps) {
    setContaBancaria(item);
    setModalContasBancariasOpen(false);
  }

  useEffect(() => {
    setContaBancaria(null);
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
      <DialogContent className={`md:max-w-4xl`}>
        <DialogHeader>
          <DialogTitle>Adicionar Recebimento</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <section className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[30ch] flex flex-col gap-2">
            <label className="text-sm font-medium">Conta Bancaria</label>
            <Input
              readOnly
              value={contaBancaria?.descricao}
              onClick={() => setModalContasBancariasOpen(true)}
              disabled={isPending}
            />
          </div>
          {contaBancaria && (
            <div className="grid grid-cols-2 gap-2">
              <VirtualizedTransacoesCR data={[]} />
              <VirtualizedVencimentosCR data={[]} />
            </div>
          )}
        </section>
        <ModalContasBancarias
          open={modalContasBancariasOpen}
          handleSelection={handleSelectionContaBancaria}
          onOpenChange={() => setModalContasBancariasOpen(false)}
          isCaixa={false}
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
          <Button className="flex gap-2" onClick={() => console.log("ENVIAR")} disabled={isPending}>
            {isPending ? (
              <>
                <FaSpinner size={18} className="me-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Plus size={18} />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
