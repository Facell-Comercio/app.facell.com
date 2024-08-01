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
import {
  ColaboradorSchema,
  useColaboradores,
} from "@/hooks/pessoal/useColaboradores";
import { useRef } from "react";
import FormColaborador from "./Form";
import { useStoreColaborador } from "./store";

const initialPropsColaborador: ColaboradorSchema = {
  id: "",
  nome: "",
  cpf: "",
  active: true,
};

const ModalColaborador = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] =
    useStoreColaborador((state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]);

  const formRef = useRef(null);

  const { data, isLoading } = useColaboradores().getOne(id);
  const newData: ColaboradorSchema & Record<string, any> =
    {} as ColaboradorSchema & Record<string, any>;

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {id ? `Colaborador: ${id}` : "Novo Colaborador"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormColaborador
              id={id}
              data={newData.id ? newData : initialPropsColaborador}
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

export default ModalColaborador;
