import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { useStoreNovaCampanha } from "./store";

const ModalNovaCampanha = () => {
  const modalOpen = useStoreNovaCampanha().modalOpen;
  const closeModal = useStoreNovaCampanha().closeModal;
  const formRef = useRef(null);

  function handleClickCancel() {
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={() => handleClickCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Campanha</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {/* {modalOpen && !isLoading ? (
            <FormNovaCampanha formRef={formRef} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )} */}
        </ScrollArea>
        <DialogFooter className="flex gap-2 items-end flex-wrap">
          <ModalButtons cancel={handleClickCancel} formRef={formRef} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalNovaCampanha;
