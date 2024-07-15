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
import { useCentroCustos } from "@/hooks/financeiro/useCentroCustos";
import { useRef } from "react";
import FormCentroCustos from "./Form";
import { useStoreCentroCustos } from "./store";

export type CentroCustosSchema = {
  id: string;
  active?: boolean;
  nome: string;
  id_grupo_economico: string;
};

const initialPropsCentroCustos: CentroCustosSchema = {
  // Dados CentroCustos
  id: "",
  active: true,
  nome: "",
  id_grupo_economico: "",
};

const ModalCentroCustos = () => {
  const [modalOpen, closeModal, modalEditing, editModal, isPending, id] =
    useStoreCentroCustos((state) => [
      state.modalOpen,
      state.closeModal,
      state.modalEditing,
      state.editModal,
      state.isPending,
      state.id,
    ]);
  const formRef = useRef(null);

  const { data, isLoading } = useCentroCustos().getOne(id);
  const newData: CentroCustosSchema & Record<string, any> =
    {} as CentroCustosSchema & Record<string, any>;

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
          <DialogTitle>
            {id ? `Centro de Custos: ${id}` : "Novo Centro de Custos"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormCentroCustos
              id={id}
              data={newData.id ? newData : initialPropsCentroCustos}
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

export default ModalCentroCustos;
