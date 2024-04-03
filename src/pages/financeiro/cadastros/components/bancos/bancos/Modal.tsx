import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { useStoreTitulo } from "./store-titulo";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useBancos } from "@/hooks/useBancos";
import { useRef } from "react";
import FormFornecedor from "./Form";
import { useStoreBanco } from "./store";

export type BancoSchema = {
  id: string;
  codigo: string;
  nome: string;
};

const initialPropsBanco: BancoSchema = {
  id: "",
  codigo: "",
  nome: "",
};

const ModalBanco = () => {
  const modalOpen = useStoreBanco().modalOpen;
  const closeModal = useStoreBanco().closeModal;
  const modalEditing = useStoreBanco().modalEditing;
  const editModal = useStoreBanco().editModal;
  const id = useStoreBanco().id;
  const formRef = useRef(null);

  const { data, isLoading } = useBancos().getOne(id);
  const newData: BancoSchema & Record<string, any> = {} as BancoSchema &
    Record<string, any>;

  for (const key in data?.data) {
    if (typeof data?.data[key] === "number") {
      newData[key] = String(data?.data[key]);
    } else if (data?.data[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = data?.data[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Banco: ${id}` : "Novo Banco"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormFornecedor
              id={id}
              data={newData.id ? newData : initialPropsBanco}
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
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModalBanco;
