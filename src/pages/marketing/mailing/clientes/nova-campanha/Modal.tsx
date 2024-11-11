import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import FormNovaCampanha from "./Form";
import { useStoreNovaCampanha } from "./store";

const ModalNovaCampanha = () => {
  const [modalOpen, closeModal] = useStoreNovaCampanha((state) => [
    state.modalOpen,
    state.closeModal,
  ]);
  const [isPending] = useStoreNovaCampanha((state) => [state.isPending]);
  const formRef = useRef(null);

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && <FormNovaCampanha formRef={formRef} />}
        </ScrollArea>
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <ModalButtons cancel={handleClickCancel} formRef={formRef} isLoading={isPending} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovaCampanha;
