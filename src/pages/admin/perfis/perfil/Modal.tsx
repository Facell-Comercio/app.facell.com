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
import { usePerfil } from "@/hooks/adm/usePerfil";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRef } from "react";
import Form from "./Form";
import { PerfilFormData } from "./form-data";
import { useStorePerfil } from "./store";

const initialProps: PerfilFormData = {
  id: "",
  perfil: "",
  active: 1,
  permissoes: [],
  updatePermissoes: false,
};

const ModalDepartamento = () => {
  const modalOpen = useStorePerfil((state) => state.modalOpen);
  const closeModal = useStorePerfil((state) => state.closeModal);
  const modalEditing = useStorePerfil((state) => state.modalEditing);
  const editModal = useStorePerfil((state) => state.editModal);
  const id = useStorePerfil((state) => state.id);
  const formRef = useRef(null);

  const { data, isLoading } = usePerfil().getOne(id);
  const newData: PerfilFormData & Record<string, any> = {} as PerfilFormData & Record<string, any>;

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
  }

  return (
    <Dialog open={modalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Perfil: ${id}` : "Novo perfil"}</DialogTitle>
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
