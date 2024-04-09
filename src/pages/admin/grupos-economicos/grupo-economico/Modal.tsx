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
import { useRef } from "react";
import Form from "./Form";
import { useStoreGrupoEconomico } from "./store";
import { GrupoEconomicoFormData } from "./form-data";
import { useGrupoEconomico } from "@/hooks/useGrupoEconomico";

const initialProps: GrupoEconomicoFormData = {
  id: "",
  id_matriz: '',
  active: true,
  apelido: '',
  nome: ''
};

const ModalDepartamento = () => {
  const modalOpen = useStoreGrupoEconomico(state=>state.modalOpen);
  const closeModal = useStoreGrupoEconomico(state=>state.closeModal);
  const modalEditing = useStoreGrupoEconomico(state=>state.modalEditing);
  const editModal = useStoreGrupoEconomico(state=>state.editModal);
  const id = useStoreGrupoEconomico(state=>state.id);
  const formRef = useRef(null);

  const { data, isLoading } = useGrupoEconomico().getOne(id);
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
          <DialogTitle>{id ? `` : "Novo Grupo Econômico"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <Form
              id={id}
              data={newData?.id ? newData : initialProps}
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

export default ModalDepartamento;
