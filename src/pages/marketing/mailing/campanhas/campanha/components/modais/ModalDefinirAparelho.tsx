import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { InputWithLabel } from "@/components/custom/FormInput";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMailing } from "@/hooks/marketing/useMailing";
import ModalAparelhos, { ItemAparelho } from "@/pages/marketing/mailing/components/ModalAparelhos";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreCampanha } from "../../store";

const ModalDefinirAparelho = ({ reset }: { reset: () => void }) => {
  const [qtde_clientes, modalOpen, closeModal, isPending, setIsPending, filters_lote] =
    useStoreCampanha((state) => [
      state.qtde_clientes,
      state.modalDefinirAparelhoOpen,
      state.closeModalDefinirAparelho,

      state.isPending,
      state.setIsPending,
      state.filters_lote,
    ]);

  const [aparelho, setAparelho] = useState<string>("");
  const [modalAparelhoOpen, setModalAparelhoOpen] = useState(false);

  function handleSelectionAparelho(aparelho: ItemAparelho) {
    setAparelho(aparelho.descricao_comercial);
  }

  function handleClickCancel() {
    closeModal();
  }

  useEffect(() => {
    if (!modalOpen) {
      setAparelho("");
      setModalAparelhoOpen(false);
    }
  }, [modalOpen]);

  const {
    mutate: updateClienteLote,
    isPending: updateClienteLoteIsPending,
    isError: updateClienteLoteIsError,
    isSuccess: updateClienteLoteIsSuccess,
  } = useMailing().updateClienteLote();

  useEffect(() => {
    if (updateClienteLoteIsPending) {
      setIsPending(true);
    }
    if (updateClienteLoteIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (updateClienteLoteIsError) {
      setIsPending(false);
    }
  }, [updateClienteLoteIsPending]);

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Definir Aparelho:</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="flex gap-3 items-end p-1 w-full">
            <InputWithLabel
              label="Nome Aparelho:"
              value={aparelho}
              readOnly
              className="flex-1"
              onClick={() => setModalAparelhoOpen(true)}
            />
            <InputWithLabel
              label="Quantidade Total de Clientes:"
              value={qtde_clientes || ""}
              readOnly
              className="flex-1"
            />
          </div>
          <ModalAparelhos
            open={modalAparelhoOpen}
            onOpenChange={() => setModalAparelhoOpen(false)}
            closeOnSelection
            handleSelection={handleSelectionAparelho}
          />
        </ScrollArea>
        <DialogFooter className="flex gap-1 items-end justify-end flex-row flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel} disabled={isPending}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button
            onClick={() => {
              updateClienteLote({ data: { produto_ofertado: aparelho }, filters: filters_lote });
              reset();
            }}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <FaSpinner size={16} className="animate-spin me-2" /> Carregando...
              </>
            ) : (
              <>
                <Save size={18} className="me-2" />
                Salvar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDefinirAparelho;
