import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoreEstoque } from "./Store";
import FormEstoqueFardamento from "./Form";
import ModalButtons from "@/components/custom/ModalButtons";
import { useRef } from "react";
import { useFardamentos } from "@/hooks/useFardamentos";
import { Skeleton } from "@/components/ui/skeleton";

// initials
const ModalEstoque = () => {
  const modalOpen = useStoreEstoque().modalOpen;
  const closeModal = useStoreEstoque().closeModal;
  const id = useStoreEstoque().id;
  const modalEditing = !!id;
  const editModal = useStoreEstoque().editModal;
  const formRef = useRef(null);

  const { data, isLoading } = useFardamentos().getOne(id);
  const fardamentoData = data?.data || {
    saldo: "0",
  };
  Object.keys(fardamentoData).forEach((key) => {
    fardamentoData[key] = String(fardamentoData[key]);
  });
  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent className="  w-full">
        <DialogHeader>
          <DialogTitle>{"Abastecimento"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormEstoqueFardamento formRef={formRef} data={fardamentoData} />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            edit={() => editModal(true)}
            modalEditing={modalEditing}
            cancel={handleClickCancel}
            formRef={formRef}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalEstoque;
