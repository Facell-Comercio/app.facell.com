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
import { useRateios } from "@/hooks/useRateios";
import { useRef } from "react";
import FormRateios from "./Form";
import { useStoreRateios } from "./store";

export interface RateiosSchema {
  id: string;
  active: boolean;
  id_grupo_economico: string;
  nome: string;
  codigo: string;
  itens: RateioItens[];
  manual: boolean;
}

type RateioItens = {
  id_filial: string;
  percentual: string;
};

const initialPropsRateios: RateiosSchema = {
  id: "",
  active: true,
  id_grupo_economico: "",
  nome: "",
  codigo: "",
  itens: [],
  manual: false,
};

const ModalRateios = () => {
  const modalOpen = useStoreRateios().modalOpen;
  const closeModal = useStoreRateios().closeModal;
  const modalEditing = useStoreRateios().modalEditing;
  const editModal = useStoreRateios().editModal;
  const id = useStoreRateios().id;
  const formRef = useRef(null);

  const { data, isLoading } = useRateios().getOne(id);
  const newData: RateiosSchema & Record<string, any> = {} as RateiosSchema &
    Record<string, any>;
  const rateio = data?.data;

  for (const key in rateio) {
    if (typeof rateio[key] === "number") {
      newData[key] = String(rateio[key]);
    } else if (rateio[key] === null) {
      newData[key] = "";
    } else {
      newData[key] = rateio[key];
    }
  }

  rateio?.itens?.forEach(
    (value: any) => (value.id_filial = value.id_filial.toString())
  );

  // Salvo pelo Gambiarrex
  newData["manual"] = !!+newData["manual"];

  console.log("TESTE ", newData);

  function handleClickCancel() {
    editModal(false);
    closeModal();
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleClickCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{id ? `Rateio: ${id}` : "Novo Rateio"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          {modalOpen && !isLoading ? (
            <FormRateios
              id={id}
              data={newData.id ? newData : initialPropsRateios}
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

export default ModalRateios;
