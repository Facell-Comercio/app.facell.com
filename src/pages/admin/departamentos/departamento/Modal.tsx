import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModalButtons from "@/components/custom/ModalButtons";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useDepartamentos } from "@/hooks/useDepartamentos";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import Form from "./Form";
import { DepartamentoFormData } from "./form-data";
import { useStoreDepartamento } from "./store";

const initialProps: DepartamentoFormData = {
  id: "",
  active: true,
  nome: "",
};

const ModalDepartamento = () => {
  const modalOpen = useStoreDepartamento((state) => state.modalOpen);
  const closeModal = useStoreDepartamento((state) => state.closeModal);
  const modalEditing = useStoreDepartamento((state) => state.modalEditing);
  const editModal = useStoreDepartamento((state) => state.editModal);
  const id = useStoreDepartamento((state) => state.id);
  const formRef = useRef(null);

  const { data, isLoading } = useDepartamentos().getOne(id);
  const newData = data?.data;

  for (const key in newData) {
    if (typeof newData[key] === "number") {
      newData[key] = String(newData[key]);
    } else if (newData[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = newData[key];
    }
  }

  function handleClickCancel() {
    editModal(false);
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `` : "Novo Departamento"}</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form id={id} data={newData?.id ? newData : initialProps} formRef={formRef} />
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

export default ModalDepartamento;
