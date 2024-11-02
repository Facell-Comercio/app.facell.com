import ModalButtons from "@/components/custom/ModalButtons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useCadastros } from "@/hooks/marketing/useCadastros";
import { useRef } from "react";
import FormFornecedor from "./Form";
import { useStoreVendedor } from "./store";

export type VendedorSchema = {
  id: string;
  nome: string;
  active?: number;
};

const initialPropsVendedor: VendedorSchema = {
  id: "",
  nome: "",
  active: 1,
};

const ModalVendedor = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] = useStoreVendedor(
    (state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]
  );

  const formRef = useRef(null);

  const { data, isLoading } = useCadastros().getOneVendedor(id);
  const newData: VendedorSchema & Record<string, any> = {} as VendedorSchema & Record<string, any>;

  for (const key in data) {
    if (typeof data[key] === "number") {
      newData[key] = String(data[key]);
    } else if (data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{id ? `Vendedor: ${id}` : "Novo Vendedor"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormFornecedor
              id={id}
              data={newData.id ? newData : initialPropsVendedor}
              formRef={formRef}
            />
          ) : (
            <div className="w-full min-h-full p-2 grid grid-rows-4 gap-3">
              <Skeleton className="w-full row-span-1" />
              <Skeleton className="w-full row-span-3" />
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <ModalButtons
            id={id}
            modalEditing={modalEditing}
            edit={() => editModal(true)}
            cancel={handleClickCancel}
            formRef={formRef}
            isLoading={isPending}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVendedor;
