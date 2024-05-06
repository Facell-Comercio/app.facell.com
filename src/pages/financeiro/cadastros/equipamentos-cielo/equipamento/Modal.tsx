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
import { useEquipamentos } from "@/hooks/financeiro/useEquipamentos";
import { useRef } from "react";
import FormEquipamento from "./Form";
import { useStoreEquipamento } from "./store";

export type EquipamentoSchema = {
  id: string;
  active: boolean;
  estabelecimento: string;
  num_maquina: string;
  id_filial: string;
};

const initialPropsEquipamento: EquipamentoSchema = {
  // Dados Equipamento
  id: "",
  active: true,
  estabelecimento: "",
  num_maquina: "",
  id_filial: "",
};

const ModalEquipamento = () => {
  const modalOpen = useStoreEquipamento().modalOpen;
  const closeModal = useStoreEquipamento().closeModal;
  const modalEditing = useStoreEquipamento().modalEditing;
  const editModal = useStoreEquipamento().editModal;
  const id = useStoreEquipamento().id;
  const formRef = useRef(null);

  const { data, isLoading } = useEquipamentos().getOne(id);
  const newData: EquipamentoSchema & Record<string, any> =
    {} as EquipamentoSchema & Record<string, any>;

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
            {id ? `Equipamento: ${id}` : "Novo equipamento"}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormEquipamento
              id={id}
              data={newData.id ? newData : initialPropsEquipamento}
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

export default ModalEquipamento;
