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
import ModalAparelhos, { ItemAparelhos } from "@/pages/marketing/mailing/components/ModalAparelhos";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Ban, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { useStoreCampanha } from "../../store";

export type EditarClienteProps = {
  id?: string;
  vendedor?: string;
  produto_ofertado?: string;
  canUpdateClienteMarketingCompras?: number;
};

const ModalEditarCliente = () => {
  const [id, modalOpen, closeModal, isPending, setIsPending] = useStoreCampanha((state) => [
    state.id_cliente,
    state.modalEditarClienteOpen,
    state.closeModalEditarCliente,
    state.isPending,
    state.setIsPending,
  ]);

  const { data, isSuccess, isLoading } = useMailing().getOneClienteCampanha(id);

  const [formData, setFormData] = useState<EditarClienteProps | null>(null);
  const {
    mutate: updateCliente,
    isPending: updateClienteIsPending,
    isError: updateClienteIsError,
    isSuccess: updateClienteIsSuccess,
  } = useMailing().updateOneCliente();
  const [modalAparelhoOpen, setModalAparelhoOpen] = useState(false);

  function handleSelectionAparelho(aparelho: ItemAparelhos) {
    setFormData((prev) => ({ ...prev, produto_ofertado: aparelho.descricao_comercial }));
  }

  useEffect(() => {
    if (data) {
      setFormData(data);
      setModalAparelhoOpen(false);
    }
  }, [isSuccess, isLoading]);

  useEffect(() => {
    if (updateClienteIsPending) {
      setIsPending(true);
    }
    if (updateClienteIsSuccess) {
      closeModal();
      setIsPending(false);
    }
    if (updateClienteIsError) {
      setIsPending(false);
    }
  }, [updateClienteIsPending]);

  function handleClickCancel() {
    closeModal();
  }
  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Cliente: {id}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex p-1 gap-2 max-h-[70vh]">
          <div className="flex gap-3 p-1 w-full">
            <InputWithLabel
              label="Nome Vendedor:"
              value={formData?.vendedor || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, vendedor: e.target.value }))}
              className="flex-1"
            />
            <InputWithLabel
              label="Nome Aparelho:"
              value={formData?.produto_ofertado || ""}
              readOnly
              className="flex-1"
              onClick={() => setModalAparelhoOpen(true)}
            />
          </div>
          <ModalAparelhos
            open={modalAparelhoOpen}
            onOpenChange={() => setModalAparelhoOpen(false)}
            closeOnSelection
            handleSelection={handleSelectionAparelho}
          />
        </ScrollArea>
        <DialogFooter className="flex gap-1 items-end flex-wrap">
          <Button variant={"secondary"} onClick={handleClickCancel} disabled={isPending}>
            <Ban size={18} className="me-2" />
            Fechar
          </Button>
          <Button
            onClick={() => updateCliente({ ...formData, canUpdateClienteMarketingCompras: 0 })}
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

export default ModalEditarCliente;
